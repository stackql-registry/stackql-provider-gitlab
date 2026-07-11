# NOTES

Open questions from phase 1, answered with evidence. Sources: `stackql/any-sdk` `pkg/graphql/graphql.go` and `pkg/queryrouter/queryrouter.go`, `stackql/stackql` `internal/stackql/primitivebuilder/graphql_single_select_acquire.go`, the mock-server integration suite (`tests/integration/`), and live queries against gitlab.com (2026-07-11, stackql v0.10.542).

## 1. Single-object `responseSelection` (the `.get` method shape)

Answered. A jsonPath targeting a non-array object does NOT project as a row: `StandardGQLReader.Read()` requires the resolved value to be `[]interface{}` of maps and errors with `cannot accommodate GraphQL processed response of type = 'map[string]interface{}'` otherwise (graphql.go, the `switch pr :=` block).

Resolution, no wrapping needed: the jsonpath library is PaesslerAG/jsonpath, where a wildcard step returns a slice of values. Since a `.get` query selects exactly one root field, `responseSelection.jsonPath: $.data.*` resolves to a one-element array: one row. Proven in the integration suite (`current_user get returns exactly 1 row`) with column projection via `objectKey: $.data.currentUser` in the resource method (schema navigation for DESCRIBE works against the object).

Two engine quirks make the `cursor` block mandatory even on gets:

- `GetResponseJSONPath()` in any-sdk `internal/anysdk/graphql.go` returns nothing when `Cursor == nil` (it checks the cursor, not the response selection).
- `graphql_single_select_acquire.go` hard-fails without `cursor.jsonPath` (`cannot perform graphql action without cursor json path`).

Gets therefore carry `cursor: { jsonPath: '$.stackql_gql_get_sentinel' }`: the path never resolves, which the default `cursor_after` strategy treats as end-of-iteration, so exactly one page is fetched.

Anonymous caveat: `currentUser` is `null` without a token; the reader then errors with `cannot accommodate GraphQL processed response item of type = '<nil>'`. Correct behavior, slightly cryptic message.

## 2. `page_info` config exactness

Confirmed end to end on a two-page mock fixture and live.

- Config keys (any-sdk `internal/anysdk/graphql.go`): `cursor.strategy: page_info`, `cursor.jsonPath` (endCursor), `cursor.terminateOnJsonPath` (hasNextPage). Optional `cursor.format`, `cursor.pageSize` are not needed here.
- The `{{ .cursor }}` splice renders exactly `, after: "<endCursor>"` (`advancePageInfo` in `pkg/graphql/graphql.go`); the integration suite asserts the literal `, after: "PROJ_CURSOR_1"` on the second wire request.
- Termination: `hasNextPage: false` stops iteration even though the final page carries a non-empty `endCursor` (Relay-strict, GitLab behavior); the mock fixture asserts exactly 2 requests. Absent/nil at `terminateOnJsonPath` also terminates (conservative default in `isPageInfoContinue`).
- Live: `SELECT COUNT(*) ... WHERE search = 'gitlab'` with `--http.response.pageLimit=3` returned exactly 200 rows = two full pages traversed against gitlab.com.
- Page cap: traversal is bounded by the runtime `--http.response.pageLimit` (default 20, i.e. up to 19 fetched pages; the counter starts at 1). Full-chain reads of large result sets need that flag raised.

## 3. Typed argument templating

The query is a Go `text/template` rendered against the flat parameter map from the WHERE clause (`renderQuery` in graphql.go; `paramMap` from `reqCtx.GetParameters().ToFlatMap()` in the acquire builder).

- Enums render unquoted (`state: opened`), strings and string-like scalars (ID, Time, Date) render quoted (`search: "needle"`). Both asserted on the wire in the integration suite.
- Omission: optional arguments are emitted as `{{ if .param }}, arg: <value>{{ end }}` blocks; a missing map key is falsy, so absent WHERE params render nothing (asserted: no `state:`/`search:` on the wire when not supplied).
- Known limitation: Go template truthiness means an explicit `false` boolean or `0` integer WHERE value is indistinguishable from absent and renders nothing. Filters like `membership = false` are silently dropped. Documented; a future `{{ if isset ... }}`-style helper in any-sdk would fix it.
- List-valued and input-object arguments are excluded from v1 (no clean splice form); recorded per-resource in the inventory.
- `LIMIT` pushdown: the engine injects `paramMap["limit"]` when a SQL LIMIT resolves (graphql_single_select_acquire.go). The generated queries pin `first: 100` and do not reference `{{ .limit }}`; wiring it in is a possible optimization for small LIMITs.
- Newline handling: `renderQuery` strips newlines from the rendered query without replacement, so the generator emits single-line query text.

## 4. The `{host}` server variable

Answered, with a fix. With `url: https://{host}`, route resolution fails for the DEFAULT too - `anysdk router.FindRoute() failure: no matching operation was found` on a live query - because the any-sdk query router (gorilla/mux) compiles `{host}` with a host-variable regex that does not span dots, and `gitlab.com` is dotted. (The k8s provider only avoids this because its default `localhost` is dot-free.)

The engine has a designed escape hatch: `urltranslate.extractRegexpVariable` supports inline-regex server variables. With `url: https://{host:[^/]+}`:

- the router builds the mux host matcher from the raw form `{host:[^/]+}`, and `[^/]+` matches dotted hosts, ports included;
- the armoury calls `SanitiseServerURL` (which renders variables as `{host}`, regex stripped) before variable substitution (`generateServerURL` in `internal/anysdk/server.go`), so the wire URL is built correctly from the default or an override.

Verified live: default (`gitlab.com`) routes and returns rows; the integration suite routes `host = 'localhost:<port>'`. A true self-managed FQDN override (e.g. `gitlab.example.com`) matches the same `[^/]+` pattern and is expected to work - untested pending access to a self-managed instance; the version-alignment caveat in CLAUDE.md (older instances missing schema fields error on unknown fields) still applies and remains the reason v1 targets gitlab.com.

## 5. Complexity

Measured via `npm run validate-complexity` (appends `queryComplexity { score limit }` to each generated query, POSTs to gitlab.com):

- `projects.list`: 181; `project_issues.list`: 144; `current_user.get`: 40. Anonymous limit 200, authenticated 250.
- Score is independent of `first: 100` for flat scalar selections - the 100-per-page setting costs nothing extra.
- `projects` is the widest node type in the schema (70 scalars); at 181 it fits but is the ceiling case. Resources wider than ~85 selected leaves would breach the anonymous limit; the per-resource `est_complexity` column in the inventory ranks candidates, and the live gate runs on every regeneration.

## 6. Error surfacing

Answered from code and asserted in the integration suite. `extractGraphQLErrors` (pkg/graphql/graphql.go) treats ANY non-empty top-level `errors` array as a hard failure - explicitly including the partial-failure case where `data` is also populated. The user sees `graphql error: <message>[; <message>...]` and no rows. No post-processing is needed or possible provider-side; the strict policy is the engine's.

Implication: any field in a generated selection set that errors for a given principal fails the whole query. GitLab mostly nulls unauthorized fields rather than erroring, and the full 70-field projects selection succeeded anonymously, but this is the mechanism to watch when widening coverage (notably admin-only fields on self-managed).

## Additional findings

- **Multiple GraphQL methods per service**: all methods POST to `/api/graphql`, but OpenAPI allows one operation per path+verb. The engine explicitly supports query-string-differentiated path keys (`/api/graphql?resource=<r>&method=<m>`): the query router strips the `?` part for the mux path match and adds the pairs as query matchers (`addRoutes` in pkg/queryrouter), the armoury appends real query params with `&` when the path already contains `?` (operation_store.go), and the GraphQL reader clears `RawQuery` before hitting the wire (asserted in the integration suite: wire path is exactly `/api/graphql`).
- **`x-stackQL-graphQL.url` is dead config**: the engine never uses it to build the request (URL comes from server + path key). Emitted anyway for self-description.
- **Auth**: `type: bearer` + `credentialsenvvar: GITLAB_TOKEN` in provider.yaml sends `Authorization: Bearer <token>` (asserted against the mock). Without the env var the error is clear (`credentials error: credentialsenvvar references empty string`); anonymous use works via `--auth='{"gitlab": {"type": "null_auth"}}'`.
- **pystackql on Windows**: JSON-valued CLI params (`--auth`, `--registry`) must be compact and backslash-quote-escaped (the library joins the command line without quoting), and `PYTHONUTF8=1` is required for UTF-8 row content. Handled in `tests/smoke_test.py`.

## Pending / blockers

- **Live PAT validation of `current_user`**: `GITLAB_TOKEN` was not available in this session. Everything else was validated anonymously against public data. Run `python tests/smoke_test.py` with `GITLAB_TOKEN` set to close this out; the mock suite already proves the row shape.
- **UAT group/project fixtures** (`tests/fixtures/`): deferred until a dedicated gitlab.com test group exists.
- **Self-managed FQDN override**: expected to work with the `{host:[^/]+}` form (see item 4); verify against a real self-managed instance before documenting support.
