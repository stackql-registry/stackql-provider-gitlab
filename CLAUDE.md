# CLAUDE.md

## Project

This repository builds and documents the `gitlab` provider for [StackQL](https://github.com/stackql/stackql), enabling SQL-based query operations against the GitLab GraphQL API - projects, groups, users, issues, merge requests, pipelines, jobs, runners, work items, epics, vulnerabilities, releases, environments, packages, and audit events.

**v1 is read-only by architecture, not by policy.** The provider is built on GitLab's GraphQL API, and StackQL's GraphQL support is a read path only. This has been verified in both engine repositories:

- [`stackql/any-sdk`](https://github.com/stackql/any-sdk): `pkg/graphql` exposes a `GQLReader` interface with a single `Read()` method; there is no mutation execution path. The provider-spec construct is an `x-stackQL-graphQL` block attached to a method, carrying `url`, `httpVerb`, a Go-templated `query` (`{{ .param }}` substitution from the `WHERE` clause, `{{ .cursor }}` pagination splice), `responseSelection.jsonPath`, and a `cursor` config with four strategies: `cursor_after`, `keyset`, `offset`, `page_info`.
- [`stackql/stackql`](https://github.com/stackql/stackql): GraphQL dispatch exists only in `internal/stackql/primitivebuilder/graphql_single_select_acquire.go`, gated by the `isGraphQL` check in `single_select_acquire.go`. No insert/update/delete/exec primitive builders touch GraphQL.

Consequently every method in this provider maps to `SELECT`. Mutations (REST-based, from GitLab's partial REST OpenAPI spec) are a possible v2 addition to the same provider - REST and GraphQL methods can coexist in the same service docs - and are recorded as roadmap, not scope.

The reference example for the GraphQL method shape is the `scim` service in the any-sdk test registry (`internal/anysdk/testdata/registry/src/github/v0.3.1/services/scim.yaml`): a POST operation on a `/graphql` path with the `x-stackQL-graphQL` block, ordinary OpenAPI `parameters` feeding the query template, and a full `responses.200` JSON schema mirroring the query's selection set - the response schema is what StackQL reads for column projection and `DESCRIBE`. Study it before writing the generator.

For repository structure, testing layers, and the docs microsite, the reference implementation is [`stackql-registry/stackql-provider-k8s`](https://github.com/stackql-registry/stackql-provider-k8s/tree/feature/provider-dev) (branch `feature/provider-dev`). Note however that the OpenAPI pipeline stages of `@stackql/provider-utils` (`split`/`normalize`/`analyze`/`generate`) do not apply to GraphQL method generation - this build's generator emits StackQL service docs directly from the GraphQL schema. `docgen` still applies, since the emitted service docs are OpenAPI-shaped.

## Schema source

GitLab serves a static introspection result on production endpoints, unauthenticated and automatically kept current with the deployed schema:

- `https://gitlab.com/-/graphql/introspection_result.json` - full schema including deprecated fields
- `https://gitlab.com/-/graphql/introspection_result_no_deprecated.json` - deprecated fields excluded (the build input)

Snapshot the file into `provider-dev/downloaded/` with fetch date and content hash recorded in `provider-dev/config/schema_pin.json`. GitLab's schema changes continuously (monthly releases); schema refreshes are reviewed diffs of the generated output, never silent regenerations.

Version alignment note: the provider is generated from the gitlab.com schema. Self-managed instances on older versions may lack fields present in the generated selection sets, and GraphQL errors on unknown fields rather than ignoring them. v1 targets gitlab.com; self-managed support (per-minor generated variants, or a trailing-version selection-set policy) is a documented follow-up decision, not an assumption.

## Design principles

- **SELECT-only surface** - every resource exposes `SELECT` methods only. The docs state this plainly and position it accurately: a read-only SQL layer over the GitLab control plane for inventory, reporting, and cross-provider joins.
- **Relay pagination via `page_info`** - GitLab is Relay-strict: connections carry `pageInfo { hasNextPage endCursor }`, and `first:` is capped (100). Every list method uses the any-sdk `page_info` cursor strategy: cursor jsonPath on `endCursor`, `terminateOnJsonPath` on `hasNextPage`, `{{ .cursor }}` spliced after `first: 100`. StackQL then traverses the full chain transparently.
- **Deterministic selection sets, schema in lockstep** - GraphQL returns only what is selected. The generator's selection-set policy: all scalar and enum fields of the node type, plus a small fixed allowlist of one-level nested objects where they carry identity (`author { username }`, `namespace { fullPath }` - policy applied uniformly, recorded in config, never per-resource hand tuning). The `responses.200` schema is generated from the same field list as the query text, by the same code path, so query and schema cannot drift.
- **Three resource scopes, derived mechanically** - walking the schema: connection fields on the `Query` root become instance-scoped resources (`projects`, `users`, `runners`); connection fields on the `Project` type become project-scoped resources requiring a `full_path` parameter (`issues`, `merge_requests`, `pipelines`); connection fields on the `Group` type become group-scoped resources (`epics`, `group_members`). Singular object fields (`project(fullPath:)`, `currentUser`) become `.get` methods - confirm single-object `responseSelection` projects as one row in phase 1.
- **Complexity budget** - GitLab enforces query complexity limits. Selection sets stay flat for this reason as well as determinism. `queryComplexity { score limit }` is itself queryable; the generator validates every emitted query's complexity against the authenticated limit as a build gate.
- **One provider, any GitLab** - server URL `https://{host}/api/graphql`, `{host}` defaulting to `gitlab.com`. Known constraint: the any-sdk query router (gorilla/mux) does not match host variables spanning dots - the default literal is unaffected, but runtime overrides to self-managed FQDNs may fail route resolution, the same constraint documented in the k8s, proxmox, and hcp_terraform builds. Verify in phase 1; if unresolved, v1 documents gitlab.com support with self-managed pending the core fix.
- **Auth** - personal access token as a bearer token (`Authorization: Bearer <PAT>`), env var `GITLAB_TOKEN`, `read_api` scope sufficient.

## Toolchain rules

- Use the **latest** `@stackql/provider-utils` (see [npm](https://www.npmjs.com/package/@stackql/provider-utils)) for the stages that apply (`docgen`; any OpenAPI-stage reuse). Check for a newer version before starting work; do not pin to an old minor.
- Node.js >= 20. `type: module` in package.json. Use `graphql` (graphql-js) as the schema-parsing dependency for the generator.
- Wrap CLI entry points as npm scripts invoked through `node` (not `.bin` shims). Pass flags with npm's `--` separator.
- A local `stackql` binary is required for testing (`$STACKQL`, `./stackql`, or on `PATH`).

## Repository layout

```
provider-dev/
  downloaded/          # pinned introspection_result_no_deprecated.json snapshot
  config/              # schema pin, service map, selection-set policy, resource inventory CSV
  openapi/src/gitlab/  # generated provider output (OpenAPI-shaped service docs with x-stackQL-graphQL methods)
  scripts/             # build_inventory.mjs, generate_provider.mjs, validate_complexity.mjs
  docgen/provider-data/       # headerContent1.txt, headerContent2.txt for docs landing page
bin/                   # thin shell/node wrappers for npm scripts (mirror k8s repo)
tests/
  integration/         # mock GraphQL server + row-level assertions
  fixtures/            # seed definitions for the UAT group/project
  smoke_test.py        # pystackql smoke suite
website/               # Docusaurus 3.10 microsite
CLAUDE.md
README.md              # written in the style of the k8s provider README
```

## Build pipeline

Every step is deterministic and re-runnable. Manual decisions are applied as rules in scripts or policy config, never hand-edits to generated artifacts. Validate-and-fail-without-writing is the standard for every script.

### 0. Fetch and pin the schema

`bin/fetch-schema.sh` downloads `introspection_result_no_deprecated.json` into `provider-dev/downloaded/` and records date and hash in `provider-dev/config/schema_pin.json`. Scripted, not manual.

### 1. Build the resource inventory

`provider-dev/scripts/build_inventory.mjs` parses the introspection JSON (via graphql-js `buildClientSchema`) and walks `Query`, `Project`, and `Group` types, emitting `provider-dev/config/resource_inventory.csv`: scope (instance/project/group), source field, node type, connection or singular, argument list (name, type, required), scalar/enum field count on the node type, allowlisted nested selections, proposed service, proposed resource, proposed method (`list`/`get`), estimated complexity, skip reason where applicable (subscription-only types, fields requiring instance-admin, union-typed nodes deferred). Report counts by scope and disposition.

### 2. Service split

From the inventory, group resources into services and write `provider-dev/config/service_names.json`. Candidates (final decision from the inventory):

`projects` (projects, project members, labels, milestones, releases, environments), `groups` (groups, group members, epics if not split out), `users` (users, current_user), `issues`, `merge_requests`, `ci` (pipelines, jobs, runners, ci config), `work_items`, `security` (vulnerabilities, security reports), `packages` (packages, container repositories), `snippets`, `audit` (audit events), `metadata` (metadata, query_complexity)

### 3. Generate the provider

`provider-dev/scripts/generate_provider.mjs` emits one service doc per service into `provider-dev/openapi/src/gitlab/`, generating per method, from a single field list per resource:

- the GraphQL query text: scoped wrapper (`project(fullPath: "{{ .full_path }}")` where applicable), connection call with `(first: 100{{ .cursor }})` plus any exposed filter arguments as optional templated parameters, `nodes { <selection set> }`, and `pageInfo { hasNextPage endCursor }`
- the `x-stackQL-graphQL` block: `url` composed from the server template, `httpVerb: POST`, `responseSelection.jsonPath` at `$.data.<...>.nodes[*]`, `cursor` with `strategy: page_info`, `jsonPath` at the `endCursor` path, and `terminateOnJsonPath` at the `hasNextPage` path
- OpenAPI `parameters` for every templated variable (`full_path` required on scoped resources; filter arguments optional), typed from the schema's argument types
- the `responses.200` schema mirroring the full response envelope down through the selection set

Filter arguments deserve care: GraphQL argument values are typed (enums unquoted, strings quoted). The template must render each argument correctly for its type, and omit absent optional arguments entirely - a conditional-inclusion policy the generator implements once, uniformly.

Then `provider-dev/scripts/validate_complexity.mjs` executes every generated query's complexity check (dry-run against gitlab.com with `queryComplexity`) and fails the build if any query exceeds the authenticated limit.

### 4. Test

Adapted from the k8s repo's four layers:

1. **Offline validation** - local file registry, `SHOW SERVICES/RESOURCES/METHODS`, `DESCRIBE EXTENDED` on representative resources (`gitlab.projects.projects`, `gitlab.issues.project_issues`) - confirms the generated response schemas project columns
2. **Meta-route tests** - `npm run start-server` / `npm run test-meta-routes -- gitlab --verbose` / `npm run stop-server`
3. **Integration tests** - `tests/integration/mock_gitlab_server.mjs` serving captured GraphQL wire shapes; assert row-level results per archetype: nodes unwrapping, `page_info` traversal across multiple pages including the final-page termination, parameter templating (`full_path`, enum filter, string filter, omitted optional filter), and single-object `.get` projection
4. **Smoke tests** - `tests/smoke_test.py` (pystackql) against gitlab.com with a `read_api` PAT, targeting a dedicated public UAT group seeded from `tests/fixtures/`; read-only by nature so no breadcrumb sweeping is needed; `--registry public` variant doubles as post-publish verification

A free gitlab.com account with a dedicated test group is sufficient for all live testing and CI smoke. Respect GitLab API rate and complexity limits in test pacing.

### 5. Publish

Push the `gitlab` dir to `providers/src` in a feature branch of [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry) and follow the registry release flow. Verify with `registry pull gitlab` against the dev registry.

### 6. Docs microsite

`website/` is Docusaurus 3.10 following the shared architecture: all navbar/footer/theme/plugin configuration comes from [`stackql/docusaurus-config`](https://github.com/stackql/docusaurus-config), vendored into `.shared-config/` at build time (`vendor-config` runs automatically before `start`/`build`). Site-local files are limited to `website/provider.js` (`providerName = 'gitlab'`, `providerTitle = 'GitLab'`), thin `docusaurus.config.js` / `sidebars.js` wrappers, shared components under `src/`, and `static/CNAME` pinning `gitlab-provider.stackql.io`.

- Author `headerContent1.txt` / `headerContent2.txt` in `provider-dev/docgen/provider-data/` (installation, PAT creation with `read_api` scope, `GITLAB_TOKEN` connection, the read-only positioning stated plainly, example queries)
- `npm run generate-docs` against the generated provider dir, then `node website/scripts/sanitize-docs.mjs`
- Build locally with yarn, Node 20+; publish via GitHub Pages, DNS: `gitlab-provider.stackql.io` CNAME -> `stackql.github.io.`

Lead the docs examples with the queries this provider exists for: group-wide project inventory, open merge requests by age and approver, pipeline failure rates across projects, runner fleet status, vulnerability reporting, and at least one cross-provider join (GitLab members against Okta/Entra users) - the differentiator no single-tool integration offers.

### 7. CI

GitHub Actions: fetch + pin check + generate, complexity validation, integration tests against the mock server, meta-route tests, and (secret-gated) the smoke suite against the UAT group on gitlab.com. Model on the k8s repo's `build-and-test.yml`.

## Writing conventions

- README and docs copy: measured, precise, no hyperbole. Third-person or passive framing for descriptive copy. State the read-only scope directly; do not bury it.
- No em dashes; use `-`. No characters not on a QWERTY keyboard; use `->` for arrows.
- Sample queries follow the k8s README style: realistic, runnable, `json_extract` for nested fields.

## Non-negotiables

1. Latest `@stackql/provider-utils` for the applicable stages, always
2. The k8s `feature/provider-dev` repo is the reference for repo structure and testing; the any-sdk `scim` service doc is the reference for GraphQL method shape - deviate only with a documented reason in the README
3. Query text and response schema are generated from one field list by one code path - they can never drift
4. Deterministic scripts and policy config, never hand-edits to generated artifacts
5. Every regeneration is followed by complexity validation and the integration test suite before commit
