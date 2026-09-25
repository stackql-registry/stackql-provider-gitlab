# NOTES

Engine evidence behind the provider's design and its documented limitations. Sources: `stackql/any-sdk` (`pkg/graphql/graphql.go`, `internal/anysdk/graphql.go`, `internal/anysdk/server.go`, `pkg/queryrouter/queryrouter.go`), `stackql/stackql` (`internal/stackql/primitivebuilder/graphql_single_select_acquire.go`), the mock-server integration suite (`tests/integration/`), and live queries against gitlab.com. Phase 1 findings (2026-07-11, stackql v0.10.542) were re-verified on 2026-09-25 against stackql v0.12.718 (any-sdk v0.6.0-alpha01); differences are called out.

## Engine baseline (2026-09-25)

- any-sdk `main` at `4ea3775` (2026-09-22): no GraphQL code changes since 2026-05-28 (cursor strategies, error surfacing, HTTP logging). No `feature/graphql-mutations` branch exists in either engine repo; the untracked `mutations-e2e-work-order.md` in this repo was never executed and mutation support remains absent from the engine.
- stackql `v0.12.718` (2026-09-22) pins any-sdk `v0.6.0-alpha01`. The only GraphQL change since July is the SQL `LIMIT` -> `{{ .limit }}` push-down (2026-07-02), which this provider does not use (see item 3).
- Registry precedent for GraphQL methods: `github` (`discussions`, `activity`, `orgs`, `pulls`, `users`) uses `/graphql?resource=<r>` path keys, query aliases for snake_case fields and the `page_info` strategy; `cloudflare` uses `keyset`. This provider follows the github shape.

## 1. Single-object `responseSelection` (the `.get` method shape)

Answered. A jsonPath targeting a non-array object does NOT project as a row: `StandardGQLReader.Read()` requires the resolved value to be `[]interface{}` of maps and errors with `cannot accommodate GraphQL processed response of type = 'map[string]interface{}'` otherwise.

Resolution, no wrapping needed: the jsonpath library is PaesslerAG/jsonpath, where a wildcard step returns a slice of values. A `.get` query selects exactly one object field, so `responseSelection.jsonPath: $.data.*` (instance scope) or `$.data.project.*` / `$.data.group.*` (scoped) resolves to a one-element array: one row. Proven in the integration suite (`current_user get returns exactly 1 row`, `project_pipeline get returns exactly 1 row with columns`) with column projection via `objectKey: $.data.<path>` in the resource method.

Two engine facts make the `cursor` block mandatory even on gets:

- `GetResponseJSONPath()` in any-sdk `internal/anysdk/graphql.go` returns nothing when `Cursor == nil` (it checks the cursor, not the response selection).
- `graphql_single_select_acquire.go` hard-fails without `cursor.jsonPath` (`cannot perform graphql action without cursor json path`).

Gets therefore carry `cursor: { jsonPath: '$.stackql_gql_get_sentinel' }`: the path never resolves, which the default `cursor_after` strategy treats as end-of-iteration, so exactly one page is fetched.

Null objects: `currentUser` is `null` without a token and `project(fullPath: "missing")` is `null`; the reader then errors with `cannot accommodate GraphQL processed response item of type = '<nil>'`. A get on a missing object is an error, not zero rows. Documented.

## 2. `page_info` config exactness

Confirmed end to end on a two-page mock fixture and live.

- Config keys (any-sdk `internal/anysdk/graphql.go`): `cursor.strategy: page_info`, `cursor.jsonPath` (endCursor), `cursor.terminateOnJsonPath` (hasNextPage). Optional `cursor.format`, `cursor.pageSize` are not needed here.
- The `{{ .cursor }}` splice renders exactly `, after: "<endCursor>"` (`advancePageInfo` in `pkg/graphql/graphql.go`); the integration suite asserts the literal `, after: "PROJ_CURSOR_1"` on the second wire request.
- Termination: `hasNextPage: false` stops iteration even though the final page carries a non-empty `endCursor` (Relay-strict, GitLab behavior); the mock fixture asserts exactly 2 requests. Absent/nil at `terminateOnJsonPath` also terminates (conservative default in `isPageInfoContinue`).
- Live (phase 1): `SELECT COUNT(*) ... WHERE search = 'gitlab'` with `--http.response.pageLimit=3` returned exactly 200 rows = two full pages traversed against gitlab.com.
- Page cap: `pageCount` starts at 1 and is checked before each request, so the runtime `--http.response.pageLimit` (default 20) yields at most 19 fetched pages. Full-chain reads of large result sets need that flag raised.

## 3. Typed argument templating

The query is a Go `text/template` rendered against the flat parameter map from the WHERE clause (`renderQuery` in graphql.go; `paramMap` from `reqCtx.GetParameters().ToFlatMap()` in the acquire builder). No template functions are registered and no `missingkey` option is set: a missing key is falsy in `{{ if }}` and renders `<no value>` bare.

- Enums render unquoted (`state: opened`); Int, Float and Boolean render bare; every other scalar (String, ID, Time, Date, the global-ID scalars) renders quoted. Asserted on the wire in the integration suite.
- Omission: optional arguments are emitted as `{{ if .param }}, arg: <value>{{ end }}` blocks; a missing map key is falsy, so absent WHERE params render nothing (asserted: no `state:` / `search:` / `confidential:` on the wire when not supplied).
- Commas are insignificant tokens in GraphQL, so each conditional block carries its own leading comma; gets with only optional arguments wrap the whole argument list in `{{ if or .a .b }}(...){{ end }}` because `()` is a syntax error. Both renders (all absent, all present) are parsed with graphql-js at generation time.
- Boolean `false` and integer `0` (re-verified 2026-09-25 on v0.12.718): WHERE values reach the template as strings, so `confidential = false` renders `confidential: false` and `weight = 0` renders `weight: "0"`; the phase-1 note that `false` was dropped no longer holds. Only an empty string (`search = ''`) is falsy and treated as absent. Asserted in the integration suite (`boolean false filter rendered`). Note `confidential = 0` renders `confidential: 0`, which GitLab rejects as a type error - booleans must be written `true` / `false`.
- List-valued and input-object arguments are excluded (no flat splice form); required ones skip the resource (`unsupported_required_arg` in the inventory - none in the current schema once argument defaults are honoured).
- `LIMIT` pushdown: the engine injects `paramMap["limit"]` when a SQL LIMIT resolves. The generated queries pin `first: 100` and do not reference `{{ .limit }}`: without a LIMIT the template would render `first: <no value>`, and with `page_info` traversal a small `first:` would multiply requests rather than bound them. LIMIT applies locally.
- Newline handling: `renderQuery` strips newlines from the rendered query without replacement, so the generator emits single-line query text.

## 4. The `{host}` server variable and `GITLAB_HOST`

With `url: https://{host}`, route resolution fails for the DEFAULT too (`anysdk router.FindRoute() failure: no matching operation was found`) because the any-sdk query router (gorilla/mux) compiles `{host}` with a host-variable regex that does not span dots. The engine's escape hatch is an inline-regex server variable, `url: https://{host:[^/]+}`: the router builds the mux host matcher from the raw form, `[^/]+` matches dotted hosts (ports included), and `SanitiseServerURL` strips the regex before variable substitution so the wire URL is built correctly. The datadog provider in the registry uses the same form (`https://api.{site:.+}`).

`x-stackQL-envVar` (any-sdk `internal/anysdk/server.go`, added 2026-08-05 for stackql#706) attaches to the server variable only. Precedence: a WHERE value, then a non-empty env var, then `default`. Requiredness in `SHOW METHODS`: a server variable is reported as required unless it resolved from the environment - so `host` shows as required while `GITLAB_HOST` is unset, even though the default applies at query time. Asserted offline (`user get: host is reported required when GITLAB_HOST is unset` / `not required when GITLAB_HOST is set`).

Terraform parity: the Terraform `gitlab` provider reads `GITLAB_TOKEN` (adopted) and `GITLAB_BASE_URL`, which is the full REST v4 endpoint (`https://gitlab.example.com/api/v4/`). A verbatim env-var substitution cannot derive a bare host from it, so the provider reads `GITLAB_HOST` instead. Documented in `.env.example` and the docs.

## 5. Scope parameter vs. column name overlap

Group-scoped lists of Project or Group nodes (`group_projects`, `group_descendant_groups`, `group_shared_groups`) take `full_path` as the scope parameter while their rows carry a `full_path` column with a different value. Asserted in the integration suite (`group_projects returns the 2 project rows (scope param does not post-filter the column)`): the engine consumes the WHERE predicate as the request parameter and does not re-apply it as a row filter, so the rows come back. The uniform `full_path` parameter name therefore stands for all scoped resources.

## 6. Snake_case columns

Two engine mechanisms exist: provider-level `config.snake_case_aliases: true` (botocore-style `ToSnake` on every response property, used by aws / azure / k8s) and method-level `request.nativeCasing`. Neither is used here: GraphQL lets the query alias every field (`full_path: fullPath`), so the wire response, the generated response schema and `DESCRIBE` carry identical snake_case names with no engine transform, and docgen renders them without `--snake-case-aliases`. Alias collisions within a node type are checked at generation time (none in the current schema). Asserted offline (`no camelCase columns remain`) and on the wire (`query aliases fields to snake_case on the wire`).

## 7. Complexity

Measured via `make validate-complexity` (appends `queryComplexity { score limit }` to each generated query, POSTs to gitlab.com, retries HTML throttle pages with backoff):

- Phase 1 pilot (2026-07-11, camelCase, no `*Html` exclusion): `projects.list` 181, `project_issues.list` 144, `current_user.get` 40 against the anonymous limit of 200.
- Full build, anonymous (2026-09-25): gitlab.com throttled the address after a few probes (HTML challenge pages, 502s, then 13-48 s per request); only a handful of scores were obtained that way.
- Full build, authenticated (2026-09-25, limit 250): all 244 generated queries scored within the limit - 239 in the main run (throttle backoff stretched it to about 25 minutes), 12 in the `analytics` re-score after the probe-value fix for the renamed `from_` / `to_` parameters (`group_contributions.list` 38), and the two incident timeline queries (36 and 16) once the validator sampled a real issue id (GitLab answers any non-existent `incidentId` with `Internal server error` rather than null, so a synthetic global id cannot score those two; `SAMPLED_GIDS` in the validator resolves one real `IssueID` from the probe project). Two probes hit GitLab's own request timeout (`groups.list`, `snippets.list`) and passed by proxy through measured queries on the same node types. Highest scores: `group_projects.list`, `group_merge_requests.list` and `project_merge_requests.list` at 190, `project_snippets.list` 178, `group_shared_projects.list` 170, `projects.list` 169 - so every query also fits the anonymous limit of 200.
- MergeRequest was the one node type over budget: the untrimmed list query scored 245 (fails anonymously, 5 points under the authenticated 250). `measure_field_costs.mjs` scored all 77 selectable fields alone against `Project.mergeRequests` (`provider-dev/config/field_costs/MergeRequest.json`): 51 fields cost 2, 23 cost 4 and 3 cost 10 (`closedAt`, `mergedAt`, `subscribed`); the wrapper with `id` alone costs 12 and the nested identity objects and pageInfo account for the ~25-point gap between the field sum and the full score. `trim_to_budget.mjs` then excluded 13 unprotected fields, highest cost first (`subscribed` 10; `availableAutoMergeStrategies`, `defaultMergeCommitMessage`, `defaultSquashCommitMessage`, `diffHeadSha`, `divergedFromTargetBranch`, `hasSecurityReports`, `mergeableDiscussionsState`, `rebaseInProgress`, `securityReportsUpToDateOnTargetBranch`, `shouldBeRebased`, `sourceBranchExists`, `sourceBranchProtected` at 4) for a projected 187; the live re-score is 190, at the policy budget (`complexityBudget: 190`, the anonymous limit less a margin). `approvalsLeft`, `approvalsRequired`, `approved`, `mergeable`, `detailedMergeStatus`, `closedAt` and `mergedAt` are protected (`budgetProtectedFields`) because the documented queries depend on them.
- Score is independent of `first: 100` for flat scalar selections. The `*Html` exclusion removes 74 fields provider-wide; Project (71 columns) is the next-widest node type and measured 181 in phase 1 with more fields than it has now.
- Probes for gets with required global-ID arguments render `gid://gitlab/<Model>/1`; a query GitLab rejects before scoring is `UNMEASURED` and passes by proxy when a query on the same node type measured within the limit. CI run 1 (2026-09-25, anonymous from a GitHub runner) found three resolvers that answer anonymous callers with `Internal server error` and have no measured sibling - `Project.terraformState(s)` and `Project.agentConfigurations` (all three scored normally in the authenticated run) - so the validator now bounds server-side failures instead of failing on them: 12 + leaves x 10 (the wrapper cost and the highest per-field cost ever measured) must fit the limit, reported as `BOUNDED`; and the workflow passes `GITLAB_TOKEN` to the gate when the secret is configured.

## 8. Error surfacing

Answered from code and asserted in the integration suite. `extractGraphQLErrors` (pkg/graphql/graphql.go) treats ANY non-empty top-level `errors` array as a hard failure - explicitly including the partial-failure case where `data` is also populated. The user sees `graphql error: <message>[; <message>...]` and no rows. No post-processing is needed or possible provider-side; the strict policy is the engine's.

Implication: any field in a generated selection set that errors for a given principal fails the whole query. Observed live (2026-09-25): `group_projects` for `gitlab-org` (thousands of projects) failed with `Timeout on Project.containerRepositoriesCount` repeated per node - GitLab's per-field resolver timeout, returned as a GraphQL error alongside data, so the engine discards the page. `containerRepositoriesCount` is now excluded on `Project` and, since it is the same registry-count resolver aggregated over a whole group, on `Group`, by the `unstableFields` policy entry (recorded with the observation); the same mechanism covers any other resolver that proves load-sensitive. GitLab mostly nulls unauthorized fields rather than erroring, and the full Project selection succeeded anonymously in phase 1, but this is the mechanism to watch when widening coverage (notably admin-only fields on self-managed).

## 9. graphql-js 17 argument defaults

graphql-js 17 exposes argument defaults as `arg.default` (`{ literal }`), not `arg.defaultValue`. The phase-1 walker tested `defaultValue === undefined` and so treated every non-null argument as required, which excluded defaulted-argument fields from selection sets and mis-flagged `Project.labels(searchIn: [..]! = [TITLE, DESCRIPTION])` as unmappable. Fixed in `hasDefault()` in `lib/schema_walk.mjs`.

## 10. SQL reserved words as columns

`Repository.exists`, the nested identity `group`, `default`, `primary` and a few argument names (`all`, `from`, `to`, `limit`, `release`) are reserved words in the engine. Verified 2026-09-25 against stackql v0.12.718 with mock-server probes of every SQLite and MySQL keyword: the stackql parser (vitess-derived) rejects `all`, `exists`, `from`, `group`, `limit`, `release`, `to` outright; `default` and `primary` pass the parser but fail at the SQLite stage (`near "default": syntax error`). Double-quoting passes the parser but the SQLite rewrite drops the quotes (`near "group": syntax error`); backticks are rejected by the parser. Everything else that is a SQLite keyword (`key`, `action`, `filter`, `first`, `last`, `window`, `plan`, `trigger`, `groups`) works as a bare identifier.

Resolution, by policy: `sqlReservedColumnNames` in `selection_policy.json` lists the nine measured names and the walker appends `reservedColumnSuffix` (`_`) to any column or parameter whose snake_case form is listed (`exists_`, `group_`, `default_`). Uniform, generated, and recorded in the docs; the smoke suite selects `exists_` bare.

## Additional findings

- **Multiple GraphQL methods per service**: all methods POST to `/api/graphql`, but OpenAPI allows one operation per path+verb. The engine explicitly supports query-string-differentiated path keys (`/api/graphql?resource=<r>&method=<m>`): the query router strips the `?` part for the mux path match and adds the pairs as query matchers, the armoury appends real query params with `&` when the path already contains `?`, and the GraphQL reader clears `RawQuery` before hitting the wire (asserted: wire path is exactly `/api/graphql`).
- **`x-stackQL-graphQL.url` is dead config**: the engine never uses it to build the request (URL comes from server + path key). Emitted anyway for self-description, as the github and cloudflare providers do.
- **Auth**: `type: bearer` + `credentialsenvvar: GITLAB_TOKEN` in provider.yaml sends `Authorization: Bearer <token>` (asserted against the mock). Without the env var the error is clear (`credentials error: credentialsenvvar references empty string`); anonymous use works via `--auth='{"gitlab": {"type": "null_auth"}}'`.
- **stackql JSON output types**: integer columns come back as strings in `--output json` (`"star_count":"1"`); the integration suite compares stringified values.
- **pystackql error heuristics**: pystackql 3.8 scans row values against `errors.yaml` and reports a result as an error when any string value equals or starts with `FAILED` / `FAILURE` (exact matches) or contains `syntax error` and similar (fuzzy matches). Pipeline and job status enums (`FAILED`) trip it; the smoke suite folds such enums with `lower()` and only trusts explicit `{"error": ...}` rows (`suppress_errors=False`) as failures.
- **pystackql on Windows**: JSON-valued CLI params (`--auth`, `--registry`) must be compact and backslash-quote-escaped (the library joins the command line without quoting), and `PYTHONUTF8=1` is required for UTF-8 row content. Handled in `tests/smoke_test.py`; WSL (`make smoke`) is the preferred runtime.

## 11. UAT fixtures on gitlab.com (2026-09-25)

Seeded with `tests/fixtures/seed_fixtures.mjs` (REST v4, token scope `api`, idempotent):

- `POST /groups` for a new top-level group returned a bare `403 Forbidden` although `GET /user` reports `can_create_group: true`; gitlab.com gates top-level group creation on identity verification in the web UI and the API gives no reason. The existing `stackql` group (StackQL Studios, public, empty, created 2021) is owned by the account `javen2`, not the token's `javen-infraql`. The script therefore falls back to the personal namespace; the mirror and the smoke project live at `javen-infraql/stackql` and `javen-infraql/stackql-provider-smoke`.
- Mirror: `POST /projects` with `import_url` imported github.com/stackql/stackql (`main` plus all release tags) in under a minute; `mirror: true` was accepted but ignored (`mirror: null` on the created project) - pull mirroring is a gitlab.com Premium feature, so the mirror is a one-time import. Issues, merge requests, wiki, snippets and forking are disabled on it so GitHub stays the canonical home.
- Shared runners picked up the seeded `.gitlab-ci.yml` immediately: the branch, feature and tag commits produced four `success` pipelines, so `project_pipelines` has real rows without any runner setup.
- `GET /user` reports `namespace_id: null` on gitlab.com; the personal namespace is resolved via `GET /namespaces/<username>`.
- Read-back through the provider (authenticated smoke tier, 24/28 first pass): labels, milestones, issues (state and search pushdown, milestone identity), the merge request (branches, author), release, CI variables (masked flag), environments (tier), boards, pipelines and branch rules all project as expected. The four misses were authorization and tier facts, not provider defects: `Query.runners` is administrator-only on gitlab.com (`project_runners` / `group_runners` are the readable listings), `group_group_members` on a group the token is not a member of returns a permission error (public visibility does not extend to membership), issue `weight` is Premium (accepted by `POST /issues` on the free tier but read back as null), and the instance-wide `projects(search:)` with the 70-column Project selection hit GitLab's server-side request timeout under load (`Request timed out. Please try a less complex query or a smaller set of records`) while the same selection on `group_projects` for gitlab-org paginated fine.
- Attribution probes (curl, authenticated): `Project.runners(first: 100)` on the smoke project answers in 1 s with `id description status` and fails with `Request timed out` as soon as `jobCount projectCount` are added (16 s) - per-runner aggregations over gitlab.com's shared fleet; both are now `unstableFields` on `CiRunner`. `projects(search: "gitlab", first: 100)` takes about 12 s even for `id name` and 16 s with the count fields, and succeeded on every probe once the platform was not under load: the instance-wide search itself is the cost, not a field, so it stays as documented guidance (narrow the term, or query a group) rather than a policy change. The smoke suite now proves pagination on `group_projects` and uses `membership = true` (boolean pushdown) as its authenticated instance-root check.

## Pending

- **Authenticated complexity gate and smoke tier**: done 2026-09-25 with the `.env` token - 244/244 queries within the limit (item 7) and the smoke suite at 30 passed, 0 failed, 1 skipped (the group-members check waits on a group the token belongs to).
- **UAT group**: the fixtures are in the personal namespace until `javen-infraql` can create in (or is added as an owner of) the `stackql` group; then `GITLAB_SMOKE_GROUP=stackql make seed-fixtures` re-seeds there and `make teardown-fixtures` (with the old defaults) removes the personal-namespace smoke project.
- **Self-managed FQDN override**: expected to work with the `{host:[^/]+}` form and `GITLAB_HOST`; verify against a real self-managed instance before documenting support.
