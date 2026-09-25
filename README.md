# `gitlab` provider for [`stackql`](https://github.com/stackql/stackql)

This repository generates and documents the `gitlab` provider for StackQL, enabling SQL-based query operations against the GitLab GraphQL API - projects, groups, users, issues, merge requests, pipelines, jobs, runners, work items, vulnerabilities, releases, environments, packages and audit events.

**The provider is read-only.** It is built on GitLab's GraphQL API, and StackQL's GraphQL support is a read path only: every method in this provider maps to `SELECT`. This is a property of the architecture, not a policy choice - the any-sdk GraphQL reader exposes a single `Read()` method and no mutation execution path exists in the engine. The provider is positioned as a read-only SQL layer over the GitLab control plane for inventory, reporting and cross-provider joins. Mutations are roadmap, not scope.

Documentation: [gitlab-provider.stackql.io](https://gitlab-provider.stackql.io)

## Design Principles

- **Generated from GitLab's published schema** - GitLab serves a static GraphQL introspection result on production endpoints, kept current with the deployed schema. The build input is `https://gitlab.com/-/graphql/introspection_result_no_deprecated.json`, snapshotted into `provider-dev/downloaded/` with the fetch date and content hash pinned in `provider-dev/config/schema_pin.json`. Schema refreshes are reviewed diffs of generated output, never silent regenerations: `make fetch-schema` fails on drift and `make refresh-schema` accepts it.
- **Three resource scopes, derived mechanically** - connection fields on the `Query` root become instance-scoped resources (`projects`, `users`, `runners`); connection fields on `Project` become project-scoped resources prefixed `project_` with a required `full_path` parameter (`project_issues`, `project_pipelines`); connection fields on `Group` become group-scoped resources prefixed `group_` (`group_projects`, `group_vulnerabilities`). Singular object fields become `.get` methods (`project`, `current_user`, `project_pipeline`).
- **Relay pagination via `page_info`** - GitLab connections carry `pageInfo { hasNextPage endCursor }` and cap `first:` at 100. Every list method uses the any-sdk `page_info` cursor strategy, so StackQL traverses the full result chain transparently.
- **Deterministic selection sets, snake_case columns** - GraphQL returns only what is selected. The generator selects every scalar and enum field of each node type (rendered-HTML duplicates excluded) plus a fixed allowlist of one-level nested identity objects, applied uniformly from `provider-dev/config/selection_policy.json`. Every field is aliased in the query to its snake_case name (`full_path: fullPath`), so the wire response, the response schema and `DESCRIBE` present the same snake_case columns with no engine-side aliasing. The query text and the response schema are generated from the same field list by the same code path, so they cannot drift.
- **Predicate pushdown** - every scalar or enum argument of a schema field becomes a parameter: required ones (the scope `full_path`, identifiers) are required, the rest are optional filters rendered into the query only when supplied (`WHERE state = 'opened'` becomes `state: opened` on the wire).
- **Complexity budget** - GitLab enforces query complexity limits (200 anonymous, 250 authenticated on gitlab.com). Every generated query is scored against the live limit as a build gate.
- **Stable operation mapping** - `provider-dev/config/all_services.csv` records which schema field backs every `service.resource.method`. Regeneration fails if a mapping disappears, moves service or changes source, unless the change is explicitly accepted - published resource names do not drift between provider versions by accident.
- **One provider, any GitLab** - the server URL is `https://{host}/api/graphql` with `host` defaulting to `gitlab.com`, overridable per query (`WHERE host = ...`) or from the `GITLAB_HOST` environment variable. v1 targets gitlab.com; self-managed instances on older versions may lack fields present in the generated selection sets.

## Authentication

Authentication uses a GitLab personal access token with the `read_api` scope, supplied as a bearer token via the `GITLAB_TOKEN` environment variable - the same variable the Terraform `gitlab` provider reads:

```bash
export GITLAB_TOKEN=<your-pat>
```

Public data on gitlab.com is readable without a token:

```bash
stackql shell --auth='{"gitlab": {"type": "null_auth"}}'
```

The Terraform provider's `GITLAB_BASE_URL` carries the REST v4 path (`https://gitlab.example.com/api/v4/`) and cannot be reused as a bare host; the provider therefore reads `GITLAB_HOST` for self-managed instances.

## Prerequisites

To build or test the provider you will need:

1. Node.js 20+ and GNU make (Linux, macOS or WSL)
2. A `stackql` binary - `$STACKQL`, `./stackql`, or on `PATH` (see [StackQL](https://github.com/stackql/stackql))
3. Python 3 for the smoke suite (a venv with `pystackql` is created on demand)
4. yarn for the docs microsite
5. A gitlab.com personal access token with `read_api` scope for the authenticated smoke tier (optional - see `.env.example`)

Install build dependencies:

```bash
make deps
```

`make help` lists every target; `make all` runs the whole token-free chain (deps, pipeline, tests, docs, website build).

## 1. Fetch and Pin the Schema (`make fetch-schema`)

Downloads the introspection result and compares its content hash with `provider-dev/config/schema_pin.json`. A match writes nothing; a mismatch fails without writing. To accept an upstream change:

```bash
make refresh-schema
```

This rewrites the snapshot and the pin; the regenerated inventory and provider are then the reviewed diff.

## 2. Build the Resource Inventory (`make inventory`)

Walks the `Query`, `Project` and `Group` types of the pinned schema (`provider-dev/scripts/lib/schema_walk.mjs`, the same code path the generator uses) and writes `provider-dev/config/resource_inventory.csv`: one row per candidate field with scope, host type, node type, connection or singular shape, arguments, selectable field counts, proposed service / resource / method, an estimated complexity score, and a skip reason where a field is not mappable (union or interface node types, non-Relay lists, nodes with no scalar fields, required arguments that are lists or input objects).

Current inventory: 409 candidate fields, 244 mapped (138 `list`, 106 `get`), 165 skipped.

## 3. Generate the Provider (`make generate`)

Emits one service doc per service into `provider-dev/openapi/src/gitlab/v00.00.00000/services/`, plus `provider.yaml`, and rewrites `provider-dev/config/all_services.csv`. Per method, from a single resolved field list: the GraphQL query text (single line, Go-template parameter and cursor splices, snake_case aliases), the `x-stackQL-graphQL` block (`page_info` cursor strategy for connections, a sentinel cursor for gets), typed OpenAPI parameters (enum values enumerated, optional filters conditionally included), and a `responses.200` schema mirroring the selection set. Every emitted query is parsed with graphql-js with optional arguments both absent and present before any file is written.

Service assignment is mechanical: `SERVICE_RULES` in `lib/schema_walk.mjs` (first regex match on the resource name) plus the `overrides` map in `provider-dev/config/service_names.json`. The generated provider has 18 services and 244 resources:

| Service | Resources | Examples |
|---|---|---|
| `projects` | 58 | `projects`, `project`, `group_projects` (in `groups`), `project_labels`, `project_releases`, `project_environments`, `project_repository` |
| `groups` | 33 | `groups`, `group`, `group_projects`, `group_group_members`, `group_descendant_groups`, `group_iterations` |
| `security` | 42 | `vulnerabilities`, `group_vulnerabilities`, `project_dependencies`, `project_scan_execution_policies`, `group_compliance_frameworks` |
| `ci` | 32 | `project_pipelines`, `project_pipeline`, `project_jobs`, `runners`, `group_runners`, `project_ci_variables` |
| `packages` | 16 | `group_packages`, `project_container_repositories`, `group_dependency_proxy_manifests` |
| `analytics` | 12 | `group_value_streams`, `group_dora_performance_score_counts`, `usage_trends_measurements` |
| `boards` | 8 | `project_boards`, `group_boards`, `board_list`, `epic_board_list` |
| `issues` | 7 | `project_issues`, `group_issues`, `issue`, `project_issue_status_counts`, `timelogs` |
| `merge_requests` | 7 | `project_merge_requests`, `group_merge_requests`, `merge_request` |
| `users` | 6 | `current_user`, `user`, `users`, `project_user_permissions`, `todo` |
| `admin` | 5 | `geo_node`, `license_history_entries`, `subscription_future_entries` |
| `work_items` | 5 | `group_work_items`, `group_work_item_types`, `project_work_item_types` |
| `duo`, `metadata` | 3 each | `ai_chat_context_presets`; `metadata`, `query_complexity`, `current_license` |
| `ml`, `snippets`, `workspaces` | 2 each | `ml_experiment`; `snippets`, `project_snippets`; `workspaces` |
| `audit` | 1 | `audit_event_definitions` |

A regeneration that removes, moves or re-sources an existing mapping row fails:

```
Operation mapping changed against provider-dev/config/all_services.csv:
  moved service: custom_dashboard.get boards.yaml -> analytics.yaml
These are breaking changes for existing queries. Re-run with --accept-mapping-changes ...
```

Accept it deliberately with `make generate-accept` and call the change out in the release notes.

### Complexity gate (`make validate-complexity`)

Appends `queryComplexity { score limit }` to each generated query and executes it against gitlab.com, failing the build if any score exceeds the limit (200 anonymous, 250 with `GITLAB_TOKEN` in `.env`). Probes render optional arguments absent and required identifiers as syntactically valid values (global IDs as `gid://gitlab/<Model>/1`); a lookup miss still reports the score. Over-budget node types are trimmed by adding fields to `nodeTypeFieldExclusions` in `selection_policy.json` - a policy rule, never a per-resource edit - chosen from measured evidence: `node provider-dev/scripts/measure_field_costs.mjs --type MergeRequest --scope project --field mergeRequests` scores every selectable field of a node type alone and writes the per-field costs to `provider-dev/config/field_costs/<Type>.json`, then `node provider-dev/scripts/trim_to_budget.mjs --type MergeRequest --current-score <failing score>` (or `make trim-budget TYPE=... SCORE=...`) excludes the highest-cost fields, never those in the policy's `budgetProtectedFields`, until the projected score fits `complexityBudget` (200, the anonymous gitlab.com limit), and records the evidence next to the list. MergeRequest is the one node type trimmed this way: its list query scored 245 untrimmed and 190 after 13 exclusions (see NOTES.md item 7). Transient throttling (gitlab.com returns HTML challenge pages to bursty anonymous traffic) is retried with backoff; `--delay-ms` spaces the probes, and `--service a,b` / `--resource x,y` re-score a subset after a trim. GitLab answers a non-existent `incidentId` with an internal server error rather than null, so the validator samples one real issue id from the probe project for `IssueID` arguments; a few resolvers (Terraform states, agent configurations) answer anonymous callers with a server error, so a probe GitLab itself fails to serve is bounded conservatively (12 + leaves x 10, the highest per-field cost measured) rather than failed. CI runs the gate authenticated when the `GITLAB_TOKEN` secret is configured. Current state (2026-09-25, authenticated): 244/244 within the limit, highest score 190.

## 4. Test (`make test`)

Four layers, adapted from the k8s provider:

1. **Offline validation** (`make test-offline`) - `tests/offline_validation.mjs` runs `SHOW SERVICES / RESOURCES / METHODS` and `DESCRIBE` against the local file registry: the 18-service split, representative resources per service, one `SELECT` method per resource, the snake_case column surface with no camelCase or `_html` columns, and the `host` server variable's `GITLAB_HOST` resolution.
2. **Integration tests** (`make test-integration`) - `tests/integration/run_integration_tests.mjs` runs the generated provider against a mock GitLab GraphQL server (`tests/integration/mock_gitlab_server.mjs`) and asserts row-level results: `nodes` unwrapping, `page_info` traversal across two pages including termination on `hasNextPage: false` with a non-empty final cursor, snake_case aliases on the wire and in the rows, parameter templating (`full_path` splice, enum filters unquoted, string filters quoted, boolean `false` rendered, omitted optionals absent), a group-scoped list whose nodes carry their own `full_path`, instance and project-scoped `.get` projection, an optional-only-argument get, bearer auth, and GraphQL `errors` arrays surfacing as a query failure. No network.
3. **Meta-route tests** (`make test-meta`) - starts a local `stackql srv`, walks every service, resource and method (`SHOW`, `DESCRIBE EXTENDED`) and fails on any resource without columns or duplicate method signatures.
4. **Smoke tests** (`make smoke`) - `tests/smoke_test.py` (pystackql, venv created on demand) runs read-only checks against live gitlab.com. The authenticated tier reads back fixtures seeded by `make seed-fixtures` (`tests/fixtures/seed_fixtures.mjs`, driven by `tests/fixtures/fixtures.json`, idempotent, needs a token with the `api` scope): a public read-only mirror of `github.com/stackql/stackql` (one-time import - pull mirroring is a gitlab.com Premium feature and the flag is silently ignored on the free tier; issues, merge requests, wiki and forking are disabled so GitHub stays the canonical home) and a private `stackql-provider-smoke` project with labels, a milestone, three issues, a merge request, a tag and release, CI variables, an environment, a board and pipelines. gitlab.com refused API creation of a top-level group for the token's account with a bare 403 (`can_create_group` is true; the web UI gate is identity verification), so the fixtures live in the token's personal namespace (`javen-infraql/...`) until a group is available; `GITLAB_SMOKE_GROUP` then moves them (`make teardown-fixtures` removes the smoke project and subgroup, never the group or the mirror). The suite then runs: meta routes, a paginated projects search, a project get, project issues / merge requests / pipelines / releases with pushed-down filters, a group project inventory, instance metadata and reserved-word column quoting, then - with `GITLAB_TOKEN` in `.env` - instance metadata, `current_user`, a users search, runners, group members, and the seeded project's labels, milestones, issues (state and search pushdown, weight and milestone identity), merge request, release, CI variables (masking flag), environments, boards, pipelines and branch rules (`GITLAB_SMOKE_PROJECT` overrides the seeded path; `GITLAB_SMOKE_GROUP` the group, default `gitlab-org`). Without a token the suite runs anonymously against public data and skips the authenticated tier. `make smoke-live` runs the same suite against the published provider (`REGISTRY PULL gitlab` first, reporting its version) for post-publish verification. The suite creates nothing and costs nothing beyond gitlab.com rate limits, which it respects with serial pacing.

## 5. Publish

Copy `provider-dev/openapi/src/gitlab` to `providers/src/gitlab` in a feature branch of [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry), raise a PR against `dev` (the version directory must be `v00.00.00000`; CI assigns the published version), then verify against the dev registry:

```bash
export DEV_REG='{ "url": "https://registry-dev.stackql.app/providers" }'
stackql --registry="${DEV_REG}" exec "REGISTRY PULL gitlab"
make smoke-live
```

## 6. Generate Web Docs (`make docs website`)

`website/` is a Docusaurus 3.10 microsite following the shared provider-docs architecture: all navbar, footer, theme and plugin configuration comes from [`stackql/docusaurus-config`](https://github.com/stackql/docusaurus-config), vendored into `.shared-config/` at build time (`vendor-config` runs automatically before `start` and `build`). Site-local files are `website/provider.js`, thin `docusaurus.config.js` / `sidebars.js` wrappers (`showLastUpdateTime` is flipped on locally so every page carries a "Last updated on ..." stamp from git history), shared components under `src/`, and `static/CNAME` pinning `gitlab-provider.stackql.io`.

1. Author the landing page content in `provider-dev/docgen/provider-data/headerContent1.txt` and `headerContent2.txt` (installation, the read-only scope, PAT creation, `GITLAB_TOKEN` / `GITLAB_HOST`, example queries).
2. `make docs` - runs `@stackql/provider-utils` docgen against the generated provider into `website/docs/`, then `website/scripts/sanitize-docs.mjs` (escapes description content MDX v3 would parse as JSX). No `--snake-case-aliases` flag: the columns are already snake_case in the provider docs.
3. `make website` - `yarn install && yarn build` (needs network access to GitHub for the shared config). `make website-start` runs the dev server.

The site publishes via GitHub Pages (`.github/workflows/prod-web-deploy.yml` on pushes to `main` touching `website/**`); DNS: `gitlab-provider.stackql.io` CNAME -> `stackql.github.io.`

## 7. CI

`.github/workflows/build-and-test.yml`: schema pin verification (warns on drift), inventory and generation with a generation-drift gate, the anonymous complexity gate, offline, integration and meta-route tests, and docs generation on every push and PR; a secret-gated live smoke job (`GITLAB_TOKEN`, `GITLAB_SMOKE_GROUP`, `GITLAB_SMOKE_PROJECT`); and a weekly schema-drift job that opens an issue when the served schema moves off the pin.

## Server Parameter

`host` is a server variable defaulting to `gitlab.com`. The generated server URL uses an inline-regex form (`https://{host:[^/]+}`) so that dotted hostnames resolve through the any-sdk query router. It resolves from `WHERE host = 'gitlab.example.com'`, else from `GITLAB_HOST` (`x-stackQL-envVar`), else the default; `SHOW METHODS` lists `host` as required only while `GITLAB_HOST` is unset (the default still applies at query time).

## Known Limitations

- `SELECT` only: no `INSERT`, `UPDATE`, `DELETE` or `EXEC` (engine architecture, see above).
- List-valued and input-object filter arguments are not exposed; an empty-string filter value is treated as absent.
- Any non-empty GraphQL `errors` array fails the whole query (engine policy), including partial errors alongside data; a `.get` whose object is null (missing project, anonymous `current_user`) errors rather than returning zero rows.
- Full result-chain traversal is bounded by `--http.response.pageLimit` (stackql default 20, yielding at most 19 requests of 100 rows); `LIMIT` is applied locally, not pushed into `first:`.
- Wide selections on very large projects (for example `gitlab-org/gitlab`) can exceed stackql's default 45-second API timeout when gitlab.com is slow; raise `--apirequesttimeout` (the smoke suite passes 120 seconds).
- Column and parameter names that are SQL reserved words in the engine (`exists`, `group`, `default`, `primary`, `all`, `from`, `to`, `limit`, `release`) are renamed with a trailing underscore (`exists_`, `group_`) by the policy in `selection_policy.json`, because neither double quotes nor backticks make them selectable.
- Fields whose GitLab resolver times out on large result sets are excluded by the `unstableFields` policy entry (currently `containerRepositoriesCount` on `Project` and `Group`, and `jobCount` / `projectCount` on `CiRunner`), because a GraphQL error on one node fails the whole page. Each entry records the probe that justified it.
- Nested identity objects are limited to the policy allowlist (`author`, `user`, `namespace`, `group_`, `project`, `milestone`, `access_level`); other object-typed fields are not selected.
- Authorization follows GitLab: `gitlab.ci.runners` (the instance-wide listing) is administrator-only and returns a permission error for ordinary tokens on gitlab.com (use `group_runners` / `project_runners`); group member listings need membership of the group; Premium-tier fields such as issue `weight`, `health_status` and epics read back as null on the free tier.
- Wide selections across the whole instance (for example `gitlab.projects.projects WHERE search = ...` with a token) can hit GitLab's server-side request timeout under load (`Request timed out. Please try a less complex query`); narrow the search or query a group instead.
- Self-managed instances are routed but not validated; the provider is generated from the gitlab.com schema.

See [NOTES.md](NOTES.md) for the engine evidence behind each of these.

## Repository Layout

```
provider-dev/
  downloaded/          # pinned introspection snapshot (the build input)
  config/              # schema pin, selection policy, service split, resource inventory, all_services.csv
  openapi/src/gitlab/  # generated provider output
  scripts/             # lib/schema_walk.mjs, build_inventory.mjs, generate_provider.mjs, validate_complexity.mjs
  docgen/provider-data/  # headerContent1.txt, headerContent2.txt
bin/                   # fetch-schema.sh, server lifecycle scripts, test-meta-routes.cjs
tests/
  offline_validation.mjs
  integration/         # mock GraphQL server + row-level assertions
  smoke_test.py        # pystackql smoke suite (read-only, --live for the published provider)
website/               # Docusaurus microsite
Makefile               # every stage as a target; make all
```

## License

MIT
