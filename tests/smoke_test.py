#!/usr/bin/env python3
"""pystackql smoke test for the gitlab stackql provider.

Read-only smokes against live gitlab.com, exercising the queries the
provider exists for: meta routes (SHOW / DESCRIBE), an instance-scoped
paginated projects search (row count past one page proves page_info
traversal), a singular project get, project-scoped issues / merge requests /
pipelines / releases with pushed-down filters, a group-scoped project
inventory, the reserved-word column rename, and - when GITLAB_TOKEN is set -
the authenticated tier: instance metadata, current_user, users search,
runners, group members, and the seeded fixture project's labels, milestones,
issues, merge request, release, CI variables, environments, boards,
pipelines and branch rules (tests/fixtures/seed_fixtures.mjs).

The provider is read-only by architecture, so the suite creates nothing and
there are no breadcrumbs to sweep. Every call is a GraphQL read on the free
tier: the run costs nothing beyond the gitlab.com rate limits, which the
harness respects with serial pacing.

Auth: GITLAB_TOKEN (the Terraform provider's variable) is used as a bearer
token when set. Without it the suite runs anonymously (null_auth) against
public data and skips the authenticated tier. GITLAB_SMOKE_GROUP /
GITLAB_SMOKE_PROJECT select the UAT group and project for the authenticated
tier (default: the public gitlab-org / gitlab-org/gitlab-runner).

Usage:
    pip install pystackql
    python tests/smoke_test.py          # local provider-dev/openapi registry (default)
    python tests/smoke_test.py --live   # the published provider in the stackql registry
                                        # (pulls it first, reports its version)

On Windows run with PYTHONUTF8=1: pystackql decodes subprocess output with
the locale code page by default, and UTF-8 characters in issue titles break
cp1252 decoding. WSL is the preferred runtime (`make smoke`).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
INTER_REQUEST_DELAY_S = 0.6
# page_info cursor strategy, {host:regex} server routing and x-stackQL-envVar
# server variables all need the current engine; pystackql manages its own
# binary, so the harness upgrades it when older.
MIN_STACKQL_VERSION = (0, 12, 700)

ERROR_RE = re.compile(
    r"http response status code: [45]|graphql error|error assembling|"
    r"cannot find matching operation|FindRoute|no matching operation|"
    r"cannot find any viable servers|parser error|panic|credentials error|"
    r"cannot find provider|providers not viable|try a pull from the registry|"
    r"context deadline exceeded|cannot accommodate",
    re.I,
)
RATE_LIMIT_RE = re.compile(r"status code: 429|Too Many Requests|rate limit", re.I)


class Smoke:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.results: list[tuple[str, str, str]] = []
        self.requests = 0
        self.authed = bool(os.environ.get("GITLAB_TOKEN"))
        self.group = os.environ.get("GITLAB_SMOKE_GROUP") or args.group
        self.project = args.project
        # the seeded fixture project (tests/fixtures/seed_fixtures.mjs) that the
        # authenticated tier reads back; it lives in the token's personal
        # namespace where gitlab.com refused top-level group creation
        self.smoke_project = os.environ.get("GITLAB_SMOKE_PROJECT") or args.smoke_project

        from pystackql import StackQL

        # api_timeout maps to --apirequesttimeout: wide selections on very large
        # projects exceed stackql's 45 s default when gitlab.com is slow
        kwargs = {"output": "dict", "page_limit": args.page_limit, "api_timeout": args.api_timeout}
        if not self.authed:
            kwargs["custom_auth"] = {"gitlab": {"type": "null_auth"}}

        if not args.live:
            reg_path = (BASE_DIR / "provider-dev" / "openapi").resolve()
            reg_url = "file://" + reg_path.as_posix()
            self.sq = StackQL(custom_registry=reg_url, **kwargs)
            # pystackql only serialises {"url": ...}; a local file registry
            # additionally needs localDocRoot + nopVerify - patch the exec
            # params in place (compact JSON, platform-quoted below).
            full = json.dumps(
                {"url": reg_url, "localDocRoot": reg_path.as_posix(), "verifyConfig": {"nopVerify": True}},
                separators=(",", ":"),
            )
            for i, p in enumerate(self.params()):
                if p == "--registry":
                    self.params()[i + 1] = full
                    break
            self.provider_version = "local (provider-dev/openapi)"
        else:
            self.sq = StackQL(**kwargs)

        # pystackql joins params into a shell command string without quoting
        # JSON-valued arguments. Re-serialise them compactly (no spaces), then
        # platform-quote: on Windows the target process's argv parsing strips
        # bare double quotes, so they must be backslash-escaped; on POSIX the
        # shell strips them, so single-quote the whole argument.
        win = sys.platform.startswith("win")
        params = self.params()
        for i, p in enumerate(params):
            if isinstance(p, str) and p.startswith("{"):
                try:
                    compact = json.dumps(json.loads(p), separators=(",", ":"))
                except ValueError:
                    continue
                params[i] = compact.replace('"', '\\"') if win else f"'{compact}'"

        self.ensure_stackql_version()
        if args.live:
            # pystackql drives its own stackql binary with its own app root
            # (not the CLI's), so pull the latest published provider into it
            # here - stackql does not auto-pull, and a missing provider
            # otherwise surfaces as silent empty result sets.
            self.provider_version = self.ensure_provider()

    def params(self) -> list:
        executor = getattr(self.sq, "local_query_executor", None)
        return executor.params if executor is not None else self.sq.params

    def ensure_stackql_version(self) -> None:
        def parse(v: str) -> tuple[int, ...]:
            return tuple(int(x) for x in re.findall(r"\d+", str(v))[:3])

        current = parse(getattr(self.sq, "version", "") or "")
        if current and current >= MIN_STACKQL_VERSION:
            return
        print(f"stackql {self.sq.version} at {self.sq.bin_path} is older than "
              f"v{'.'.join(map(str, MIN_STACKQL_VERSION))} - upgrading pystackql's binary")
        self.sq.upgrade(showprogress=False)
        if parse(self.sq.version) < MIN_STACKQL_VERSION:
            sys.exit(f"stackql {self.sq.version} is still too old after upgrade")

    def ensure_provider(self) -> str:
        self.sq.executeStmt("REGISTRY PULL gitlab")
        rows = self.sq.execute("SHOW PROVIDERS")
        version = next((r.get("version") for r in rows if r.get("name") == "gitlab"), None)
        if not version:
            sys.exit("gitlab provider is not installed after REGISTRY PULL gitlab - is it published?")
        return version

    # ------------------------------------------------------------------ core
    def run(self, sql: str):
        if self.requests:
            time.sleep(INTER_REQUEST_DELAY_S)
        self.requests += 1
        try:
            # suppress_errors=False surfaces the binary's stderr as [{"error": ...}]
            # instead of an empty result set
            rows = self.sq.execute(sql, suppress_errors=False)
        except Exception as exc:  # noqa: BLE001
            return None, str(exc)
        # errors arrive as a single {"error": <stderr>} row (suppress_errors=False);
        # row content is data and is never pattern-matched (issue titles can
        # legitimately contain "rate limit" or "error")
        if isinstance(rows, list) and rows and isinstance(rows[0], dict) and "error" in rows[0] and len(rows[0]) == 1:
            err = str(rows[0]["error"])
            if RATE_LIMIT_RE.search(err):
                return None, "RATE LIMITED (429): " + err[:200]
            return None, err[:300]
        if not isinstance(rows, list):
            return None, f"unexpected result type {type(rows).__name__}: {str(rows)[:200]}"
        return rows, None

    def check(self, name: str, cond: bool, note: str = "") -> bool:
        status = "PASS" if cond else "FAIL"
        self.results.append((status, name, note))
        print(f"  {status}  {name}" + (f"  [{note[:160]}]" if note and not cond else ""))
        return cond

    def skip(self, name: str, why: str) -> None:
        self.results.append(("SKIP", name, why))
        print(f"  SKIP  {name}  [{why}]")

    # ------------------------------------------------------------- tiers
    def meta(self) -> None:
        rows, err = self.run("SHOW SERVICES IN gitlab")
        self.check("SHOW SERVICES lists 18 services", rows is not None and len(rows) == 18, err or f"got {rows and len(rows)}")

        rows, err = self.run("DESCRIBE gitlab.projects.projects")
        names = {r.get("name") for r in rows} if rows else set()
        self.check("DESCRIBE projects: snake_case columns (id, name, full_path, star_count)",
                   {"id", "name", "full_path", "star_count"} <= names, err or str(sorted(names))[:160])

        rows, err = self.run("SHOW METHODS IN gitlab.issues.project_issues")
        self.check("SHOW METHODS project_issues: single list method mapped to SELECT",
                   rows is not None and len(rows) == 1 and rows[0].get("SQLVerb") == "SELECT", err or str(rows)[:160])

    def anonymous_reads(self) -> None:
        a = self.args
        p = self.project

        # instance-scoped connection: a narrow search (the wide Project
        # selection across the whole instance can hit GitLab's request
        # timeout under load, so pagination is proven on the group below)
        rows, err = self.run(
            f"SELECT id, name, full_path FROM gitlab.projects.projects WHERE search = '{a.search}'"
        )
        self.check(f"projects search '{a.search}' (instance root, string filter pushed down)",
                   rows is not None and len(rows) > 0, err or f"got {len(rows) if rows else 0} rows")

        # singular get
        rows, err = self.run(
            f"SELECT id, name, full_path, star_count, visibility FROM gitlab.projects.project WHERE full_path = '{p}'"
        )
        self.check(f"project get {p} returns exactly 1 row",
                   rows is not None and len(rows) == 1 and rows[0].get("full_path") == p, err or str(rows)[:160])

        # project-scoped connection with an enum filter pushed down
        rows, err = self.run(
            "SELECT iid, title, state, json_extract(author, '$.username') AS author "
            f"FROM gitlab.issues.project_issues WHERE full_path = '{p}' AND state = 'opened'"
        )
        n = len(rows) if rows else 0
        all_opened = bool(rows) and all(r.get("state") == "opened" for r in rows)
        self.check(f"project_issues on {p} (state = opened)", n > 0 and all_opened, err or f"got {n} rows")

        # merge requests with enum filter + nested identity
        rows, err = self.run(
            "SELECT iid, title, state, merged_at, json_extract(author, '$.username') AS author "
            f"FROM gitlab.merge_requests.project_merge_requests WHERE full_path = '{p}' AND state = 'merged'"
        )
        n = len(rows) if rows else 0
        self.check(f"project_merge_requests on {p} (state = merged)",
                   n > 0 and all(r.get("state") == "merged" for r in rows), err or f"got {n} rows")

        # pipelines: aggregate over the first pages. lower(status): pystackql's
        # error detector (errors.yaml exact_matches) treats any row value that
        # starts with "FAILED" as an error, so the enum is folded to lower case
        rows, err = self.run(
            "SELECT lower(status) AS status, COUNT(*) AS pipelines FROM gitlab.ci.project_pipelines "
            f"WHERE full_path = '{p}' GROUP BY status"
        )
        self.check(f"project_pipelines on {p} grouped by status", rows is not None and len(rows) > 0, err or str(rows)[:160])

        # releases
        rows, err = self.run(
            f"SELECT tag_name, name, released_at FROM gitlab.projects.project_releases WHERE full_path = '{p}'"
        )
        self.check(f"project_releases on {p}", rows is not None and len(rows) > 0 and rows[0].get("tag_name"), err or str(rows)[:160])

        # group-scoped project inventory: the scope parameter and the column
        # share the name full_path and must not post-filter each other
        rows, err = self.run(
            "SELECT name, full_path, archived, last_activity_at FROM gitlab.groups.group_projects "
            f"WHERE full_path = '{self.group}'"
        )
        n = len(rows) if rows else 0
        prefixed = bool(rows) and all(str(r.get("full_path", "")).startswith(self.group + "/") for r in rows)
        self.check(f"group_projects for {self.group} (nodes keep their own full_path)", n > 0 and prefixed, err or f"got {n} rows")
        self.check(f"group_projects for {self.group} paginates past one page (page_info traversal)", n > 100, err or f"got {n} rows")

        # reserved-word column: quoted identifier
        # reserved-word columns are renamed by policy (exists -> exists_): no quoting needed
        rows, err = self.run(
            f"SELECT root_ref, exists_, branch_count FROM gitlab.projects.project_repository WHERE full_path = '{p}'"
        )
        self.check("project_repository get with a renamed reserved-word column (exists_)",
                   rows is not None and len(rows) == 1 and rows[0].get("root_ref") and "exists_" in rows[0], err or str(rows)[:160])

    def authenticated_reads(self) -> None:
        names = ("metadata", "current_user", "users search", "group members", "projects membership",
                 "smoke project get", "smoke runners", "smoke user permissions", "smoke labels", "smoke milestones", "smoke issues closed",
                 "smoke issue search", "smoke merge request", "smoke release", "smoke CI variables",
                 "smoke environments", "smoke boards", "smoke pipelines", "smoke branch rules")
        if not self.authed:
            for name in names:
                self.skip(name, "GITLAB_TOKEN not set")
            return

        # instance metadata (singular get, no arguments; null for anonymous callers)
        rows, err = self.run("SELECT version, revision FROM gitlab.metadata.metadata")
        self.check("metadata get returns the GitLab version",
                   rows is not None and len(rows) == 1 and rows[0].get("version"), err or str(rows)[:160])

        rows, err = self.run("SELECT id, username, name FROM gitlab.users.current_user")
        me = rows[0].get("username") if rows else None
        self.check("current_user returns exactly 1 row", rows is not None and len(rows) == 1 and bool(me), err or str(rows)[:160])

        if me:
            rows, err = self.run(f"SELECT id, username FROM gitlab.users.users WHERE search = '{me}'")
            self.check(f"users search '{me}' finds the current user",
                       rows is not None and any(r.get("username") == me for r in rows), err or str(rows)[:160])

        # group member listings need membership of the group: only run when
        # the caller named a group the token belongs to
        if os.environ.get("GITLAB_SMOKE_GROUP"):
            rows, err = self.run(
                "SELECT json_extract(user, '$.username') AS username, json_extract(access_level, '$.string_value') AS access_level "
                f"FROM gitlab.groups.group_group_members WHERE full_path = '{self.group}'"
            )
            self.check(f"group_group_members for {self.group}", rows is not None and len(rows) > 0, err or "no rows")
        else:
            self.skip("group members", "GITLAB_SMOKE_GROUP not set (member listings need group membership)")

        # instance root with a boolean filter pushed down: the projects the
        # token's user is a member of (the seeded fixtures), fast and
        # deterministic where an instance-wide search is not
        sp = self.smoke_project
        rows, err = self.run("SELECT full_path, visibility FROM gitlab.projects.projects WHERE membership = true")
        self.check("projects membership = true lists the seeded project (boolean pushdown)",
                   rows is not None and any(r.get("full_path") == sp for r in rows), err or str(rows)[:160])

        # --- the seeded smoke project (tests/fixtures/seed_fixtures.mjs)
        rows, err = self.run(
            f"SELECT id, full_path, visibility, description FROM gitlab.projects.project WHERE full_path = '{sp}'"
        )
        seeded = rows is not None and len(rows) == 1 and rows[0].get("full_path") == sp
        self.check(f"smoke project get {sp}", seeded, err or str(rows)[:160])
        if not seeded:
            for name in names[6:]:
                self.skip(name, f"{sp} not readable - run make seed-fixtures")
            return

        # runners visible to the project (shared runners ran its pipelines);
        # the instance-wide gitlab.ci.runners is administrator-only on
        # gitlab.com, and job_count / project_count are excluded by policy
        # (they time out over the shared fleet)
        rows, err = self.run(
            f"SELECT id, description, lower(status) AS status, runner_type FROM gitlab.ci.project_runners WHERE full_path = '{sp}'"
        )
        self.check("smoke runners: project_runners lists the shared runners", rows is not None and len(rows) > 0, err or str(rows)[:160])

        rows, err = self.run(
            f"SELECT read_project, admin_project, push_code FROM gitlab.users.project_user_permissions WHERE full_path = '{sp}'"
        )
        self.check("smoke user permissions: current user can read and administer the project",
                   rows is not None and len(rows) == 1 and str(rows[0].get("admin_project")).lower() in ("true", "1"), err or str(rows)[:160])

        rows, err = self.run(
            f"SELECT title, color, description FROM gitlab.projects.project_labels WHERE full_path = '{sp}'"
        )
        titles = {r.get("title") for r in rows} if rows else set()
        self.check("smoke labels: the three seeded labels are listed",
                   {"smoke::bug", "smoke::feature", "smoke::docs"} <= titles, err or str(sorted(titles))[:160])

        rows, err = self.run(
            f"SELECT title, state, due_date FROM gitlab.projects.project_milestones WHERE full_path = '{sp}'"
        )
        self.check("smoke milestones: smoke-m1 listed",
                   rows is not None and any(r.get("title") == "smoke-m1" for r in rows), err or str(rows)[:160])

        rows, err = self.run(
            "SELECT iid, title, state, weight, json_extract(milestone, '$.title') AS milestone "
            f"FROM gitlab.issues.project_issues WHERE full_path = '{sp}' AND state = 'closed'"
        )
        self.check("smoke issues closed: state filter pushed down (one closed issue)",
                   rows is not None and len(rows) == 1 and rows[0].get("title") == "smoke: closed issue", err or str(rows)[:160])
        rows, err = self.run(
            "SELECT iid, title, weight, json_extract(milestone, '$.title') AS milestone "
            f"FROM gitlab.issues.project_issues WHERE full_path = '{sp}' AND state = 'opened' AND search = 'bug report'"
        )
        # weight is a Premium field: accepted at creation on the free tier
        # but read back as null, so it is projected, not asserted
        self.check("smoke issue search: search pushdown and milestone identity projected",
                   rows is not None and len(rows) == 1 and rows[0].get("milestone") == "smoke-m1" and "weight" in rows[0],
                   err or str(rows)[:160])

        rows, err = self.run(
            "SELECT iid, title, state, draft, source_branch, target_branch, approved, json_extract(author, '$.username') AS author "
            f"FROM gitlab.merge_requests.project_merge_requests WHERE full_path = '{sp}' AND state = 'opened'"
        )
        self.check("smoke merge request: open MR with branches and author",
                   rows is not None and len(rows) == 1 and rows[0].get("source_branch") == "smoke-feature" and rows[0].get("author"),
                   err or str(rows)[:160])

        rows, err = self.run(
            f"SELECT tag_name, name, released_at FROM gitlab.projects.project_releases WHERE full_path = '{sp}'"
        )
        self.check("smoke release: v0.0.1-smoke listed",
                   rows is not None and any(r.get("tag_name") == "v0.0.1-smoke" for r in rows), err or str(rows)[:160])

        rows, err = self.run(
            f"SELECT key, masked, protected, value FROM gitlab.ci.project_ci_variables WHERE full_path = '{sp}'"
        )
        keys = {r.get("key"): r for r in rows} if rows else {}
        self.check("smoke CI variables: both keys listed, SMOKE_SECRET masked",
                   {"SMOKE_VAR", "SMOKE_SECRET"} <= set(keys) and str(keys.get("SMOKE_SECRET", {}).get("masked")).lower() in ("true", "1"),
                   err or str(rows)[:160])

        rows, err = self.run(
            f"SELECT name, state, tier, external_url FROM gitlab.projects.project_environments WHERE full_path = '{sp}'"
        )
        self.check("smoke environments: smoke-staging listed with tier",
                   rows is not None and any(r.get("name") == "smoke-staging" for r in rows), err or str(rows)[:160])

        rows, err = self.run(f"SELECT id, name FROM gitlab.boards.project_boards WHERE full_path = '{sp}'")
        self.check("smoke boards: smoke board listed",
                   rows is not None and any(r.get("name") == "smoke board" for r in rows), err or str(rows)[:160])

        # the .gitlab-ci.yml commit creates pipelines (shared runners ran them
        # for the seeded project); lower(status) sidesteps pystackql's FAILED heuristic
        rows, err = self.run(
            f"SELECT iid, lower(status) AS status, ref, source FROM gitlab.ci.project_pipelines WHERE full_path = '{sp}'"
        )
        self.check("smoke pipelines: seeded pipelines listed", rows is not None and len(rows) >= 1, err or str(rows)[:160])

        rows, err = self.run(
            f"SELECT name, is_default, is_protected FROM gitlab.projects.project_branch_rules WHERE full_path = '{sp}'"
        )
        self.check("smoke branch rules: default branch rule listed", rows is not None and len(rows) >= 1, err or str(rows)[:160])

    # ---------------------------------------------------------------- summary
    def summary(self) -> int:
        counts = {"PASS": 0, "FAIL": 0, "SKIP": 0}
        for status, name, note in self.results:
            counts[status] += 1
        for status, name, note in self.results:
            if status == "FAIL":
                print(f"  FAIL  {name}  [{note[:160]}]")
        print(f"\n{counts['PASS']} passed, {counts['FAIL']} failed, {counts['SKIP']} skipped; "
              f"{self.requests} statements paced at {INTER_REQUEST_DELAY_S}s "
              f"(registry: {'public' if self.args.live else 'local'}, provider: {self.provider_version})")
        return 1 if counts["FAIL"] else 0


def main() -> int:
    ap = argparse.ArgumentParser(description="gitlab provider smoke test (read-only)")
    ap.add_argument("--live", action="store_true",
                    help="run against the published provider in the stackql registry (default: the local provider-dev/openapi file registry)")
    ap.add_argument("--project", default="gitlab-org/gitlab-runner",
                    help="public project full_path for the anonymous tier (gitlab-org/gitlab is large enough to hit the API timeout under throttling)")
    ap.add_argument("--group", default="gitlab-org", help="public group full_path for the anonymous and group-scoped tiers")
    ap.add_argument("--smoke-project", default="javen-infraql/stackql-provider-smoke",
                    help="the seeded fixture project queried by the authenticated tier (make seed-fixtures)")
    ap.add_argument("--search", default="stackql",
                    help="projects search term for the instance-root check (a narrow term: instance-wide search is slow on gitlab.com and wide result sets time out server-side)")
    ap.add_argument("--page-limit", type=int, default=3, help="http.response.pageLimit passed to stackql (bounds traversal)")
    ap.add_argument("--api-timeout", type=int, default=120, help="apirequesttimeout (seconds) passed to stackql")
    args = ap.parse_args()

    smoke = Smoke(args)
    print(f"gitlab smoke test  registry={'public' if args.live else 'local'}  provider={smoke.provider_version}  "
          f"stackql={smoke.sq.version}  auth={'bearer (GITLAB_TOKEN)' if smoke.authed else 'anonymous (null_auth)'}  "
          f"group={smoke.group}  project={smoke.project}")
    smoke.meta()
    smoke.anonymous_reads()
    smoke.authenticated_reads()
    return smoke.summary()


if __name__ == "__main__":
    sys.exit(main())
