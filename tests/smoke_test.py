#!/usr/bin/env python3
"""pystackql smoke test for the gitlab stackql provider.

Read-only smokes against live gitlab.com: SHOW/DESCRIBE meta routes, an
instance-scoped paginated projects search (row count > one page proves
page_info traversal), a project-scoped issues query with an enum filter,
and - when GITLAB_TOKEN is set - the current_user singular get.

The provider is read-only by architecture, so no breadcrumb sweeping is
needed: the suite creates nothing.

Auth: if GITLAB_TOKEN is set it is used as a bearer token (the provider
default). Without it the suite runs anonymously (null_auth) against public
data and skips the current_user check.

Usage:
    pip install pystackql
    python tests/smoke_test.py                    # local registry (default)
    python tests/smoke_test.py --registry public  # published provider in the
                                                  # public stackql registry
    python tests/smoke_test.py --project gitlab-org/gitlab --search gitlab

On Windows run with PYTHONUTF8=1: pystackql decodes subprocess output with
the locale code page by default, and UTF-8 characters in issue titles break
cp1252 decoding.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

ERROR_RE = re.compile(
    r"http response status code: [45]|graphql error|error assembling|"
    r"cannot find matching operation|FindRoute|no matching operation|"
    r"cannot find any viable servers|parser error|panic|credentials error",
    re.I,
)


class Smoke:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.results: list[tuple[str, str, str]] = []

        from pystackql import StackQL

        kwargs = {"output": "dict", "page_limit": args.page_limit}
        if not os.environ.get("GITLAB_TOKEN"):
            kwargs["custom_auth"] = {"gitlab": {"type": "null_auth"}}

        if args.registry == "local":
            reg_path = (BASE_DIR / "provider-dev" / "openapi").resolve()
            reg_url = "file://" + reg_path.as_posix()
            self.sq = StackQL(custom_registry=reg_url, **kwargs)
            # pystackql only serialises {"url": ...}; a local file registry
            # additionally needs localDocRoot + nopVerify - patch the exec
            # params in place. Compact separators are required: pystackql on
            # Windows joins the command line without quoting, so any space
            # inside a JSON argument splits it and stackql fails to parse.
            full = json.dumps(
                {
                    "url": reg_url,
                    "localDocRoot": reg_path.as_posix(),
                    "verifyConfig": {"nopVerify": True},
                },
                separators=(",", ":"),
            )
            for i, p in enumerate(self.sq.params):
                if p == "--registry":
                    self.sq.params[i + 1] = full
        else:
            self.sq = StackQL(**kwargs)

        # pystackql joins params into a shell command string without quoting
        # JSON-valued arguments. Re-serialise them compactly (no spaces), then
        # platform-quote: on Windows the target process's argv parsing strips
        # bare double quotes, so they must be backslash-escaped; on POSIX the
        # shell strips them, so single-quote the whole argument.
        import platform
        win = platform.system().startswith("Windows")
        for i, p in enumerate(self.sq.params):
            if isinstance(p, str) and p.startswith("{"):
                try:
                    compact = json.dumps(json.loads(p), separators=(",", ":"))
                except ValueError:
                    continue
                self.sq.params[i] = compact.replace('"', '\\"') if win else f"'{compact}'"

    def run(self, sql: str):
        rows = self.sq.execute(sql)
        if isinstance(rows, list) and rows and isinstance(rows[0], dict) and "error" in rows[0] and len(rows[0]) == 1:
            return None, rows[0]["error"]
        return rows, None

    def check(self, name: str, cond: bool, note: str = "") -> None:
        status = "PASS" if cond else "FAIL"
        self.results.append((status, name, note))
        print(f"  {status}  {name}" + (f"  [{note[:160]}]" if note and not cond else ""))

    def smoke(self) -> int:
        a = self.args
        authed = bool(os.environ.get("GITLAB_TOKEN"))
        print(f"registry: {a.registry}, auth: {'bearer (GITLAB_TOKEN)' if authed else 'anonymous (null_auth)'}")

        # --- meta routes
        rows, err = self.run("SHOW SERVICES IN gitlab")
        self.check("show services", rows is not None and len(rows) >= 3, err or f"got {rows and len(rows)}")

        rows, err = self.run("DESCRIBE gitlab.projects.projects")
        names = {r.get("name") for r in rows} if rows else set()
        self.check("describe projects has id/name/fullPath", {"id", "name", "fullPath"} <= names, err or str(sorted(names))[:160])

        # --- instance-scoped connection with pagination (> 1 page of rows)
        rows, err = self.run(
            f"SELECT id, name, fullPath FROM gitlab.projects.projects WHERE search = '{a.search}'"
        )
        n = len(rows) if rows else 0
        self.check(
            f"projects search '{a.search}' paginates past one page",
            rows is not None and n > 100,
            err or f"got {n} rows",
        )

        # --- project-scoped connection with enum filter
        rows, err = self.run(
            "SELECT iid, title, state FROM gitlab.issues.project_issues "
            f"WHERE full_path = '{a.project}' AND state = 'opened'"
        )
        n = len(rows) if rows else 0
        all_opened = bool(rows) and all(r.get("state") == "opened" for r in rows)
        self.check(f"project_issues on {a.project} (state=opened)", n > 0 and all_opened, err or f"got {n} rows")

        # --- singular get (requires a PAT)
        if authed:
            rows, err = self.run("SELECT id, username, name FROM gitlab.users.current_user")
            self.check(
                "current_user returns exactly 1 row",
                rows is not None and len(rows) == 1 and rows[0].get("username"),
                err or str(rows)[:160],
            )
        else:
            print("  SKIP  current_user (GITLAB_TOKEN not set)")

        failed = [r for r in self.results if r[0] == "FAIL"]
        print(f"\n{len(self.results) - len(failed)}/{len(self.results)} checks passed")
        return 1 if failed else 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--registry", choices=["local", "public"], default="local",
                    help="local = provider-dev/openapi file registry; public = published provider in the public stackql registry")
    ap.add_argument("--project", default="gitlab-org/gitlab", help="public project full_path for issue smokes")
    ap.add_argument("--search", default="gitlab", help="projects search term (needs > 100 public matches to prove pagination)")
    ap.add_argument("--page-limit", type=int, default=3, help="http.response.pageLimit passed to stackql")
    args = ap.parse_args()
    return Smoke(args).smoke()


if __name__ == "__main__":
    sys.exit(main())
