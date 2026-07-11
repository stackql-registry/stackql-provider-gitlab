# `gitlab` provider for [`stackql`](https://github.com/stackql/stackql)

This repository generates and documents the `gitlab` provider for StackQL, enabling SQL-based query operations against the GitLab GraphQL API - projects, groups, users, issues, merge requests, pipelines, jobs, runners, work items, epics, vulnerabilities, releases, environments, packages, and audit events.

**The provider is read-only.** It is built on GitLab's GraphQL API, and StackQL's GraphQL support is a read path only: every method in this provider maps to `SELECT`. This is a property of the architecture, not a policy choice - the any-sdk GraphQL reader exposes a single `Read()` method and no mutation execution path exists in the engine. The provider is positioned accurately as a read-only SQL layer over the GitLab control plane for inventory, reporting, and cross-provider joins. Mutations (via GitLab's REST API) are a possible v2 addition and are recorded as roadmap, not scope.

## Design Principles

- **Generated from GitLab's published schema** - GitLab serves a static GraphQL introspection result on production endpoints, kept current with the deployed schema. The build input is `https://gitlab.com/-/graphql/introspection_result_no_deprecated.json`, snapshotted into `provider-dev/downloaded/` with the fetch date and content hash pinned in `provider-dev/config/schema_pin.json`. Schema refreshes are reviewed diffs of generated output, never silent regenerations.
- **Relay pagination via `page_info`** - GitLab connections carry `pageInfo { hasNextPage endCursor }` and cap `first:` at 100. Every list method uses the any-sdk `page_info` cursor strategy, so StackQL traverses the full result chain transparently.
- **Deterministic selection sets** - GraphQL returns only what is selected. The generator selects all scalar and enum fields of each node type plus a small fixed allowlist of one-level nested identity objects, applied uniformly from policy config (`provider-dev/config/selection_policy.json`). The query text and the response schema are generated from the same field list by the same code path, so they cannot drift.
- **Three resource scopes, derived mechanically** - connection fields on the `Query` root become instance-scoped resources; connection fields on `Project` become project-scoped resources requiring a `full_path` parameter; connection fields on `Group` become group-scoped resources. Singular object fields become `.get` methods.
- **Complexity budget** - GitLab enforces query complexity limits. Every generated query is validated against the authenticated complexity limit as a build gate.
- **v1 targets gitlab.com** - the server URL is `https://{host}/api/graphql` with `{host}` defaulting to `gitlab.com`. Self-managed instances on older GitLab versions may lack fields present in the generated selection sets; self-managed support is a documented follow-up decision.

## Authentication

Authentication uses a GitLab personal access token with the `read_api` scope, supplied as a bearer token via the `GITLAB_TOKEN` environment variable:

```bash
export GITLAB_TOKEN=<your-pat>
```

## Prerequisites

To build or test the provider you will need:

1. Node.js 20+ (for the build pipeline)
2. StackQL CLI installed (see [StackQL](https://github.com/stackql/stackql))
3. A gitlab.com personal access token with `read_api` scope (for live tests)

Install build dependencies:

```bash
npm install
```

## 1. Fetch and Pin the Schema

```bash
npm run fetch-schema
```

Downloads the introspection result into `provider-dev/downloaded/` and records the fetch date, content hash, and byte size in `provider-dev/config/schema_pin.json`. The script validates the download parses as a GraphQL introspection result before writing anything.

## 2. Build the Resource Inventory

```bash
npm run build-inventory
```

Walks the `Query`, `Project`, and `Group` types of the pinned schema (via `provider-dev/scripts/lib/schema_walk.mjs`, the same code path the generator uses) and writes `provider-dev/config/resource_inventory.csv`: one row per candidate field with scope, node type, connection or singular shape, arguments, selectable field counts, proposed service/resource/method, an estimated complexity score, and a skip reason where a field is not mappable (union or interface node types, non-Relay lists, nodes with no scalar fields).

Current inventory (schema pinned 2026-07-11): 409 candidate fields, 244 mapped (138 `list`, 106 `get`), 165 skipped. By scope: 51 instance, 123 project, 70 group.

## 3. Generate the Provider

```bash
npm run generate-provider -- --only projects,project_issues,current_user
```

Emits one OpenAPI-shaped service doc per service into `provider-dev/openapi/src/gitlab/`, plus `provider.yaml`. Per method, from a single resolved field list: the GraphQL query text (single line, Go-template parameter and cursor splices), the `x-stackQL-graphQL` block (`page_info` cursor strategy for connections), typed OpenAPI parameters (enum values enumerated, optional filters conditionally included), and a `responses.200` schema mirroring the selection set. Queries are parsed with graphql-js before any file is written.

`--only` restricts generation to named resources; full generation is gated until the pilot set is proven (phase 1 emits `projects.projects`, `issues.project_issues`, and `users.current_user`).

Then validate every emitted query's complexity against the live gitlab.com limit:

```bash
npm run validate-complexity
```

Appends `queryComplexity { score limit }` to each generated query and fails the build if any score exceeds the limit (200 anonymous, 250 authenticated). Pilot scores: `projects.list` 181, `project_issues.list` 144, `current_user.get` 40.

## 4. Test

Four layers, adapted from the k8s provider:

1. **Offline validation** - local file registry, `SHOW SERVICES/RESOURCES/METHODS` and `DESCRIBE` confirm the generated response schemas project columns.
2. **Meta-route tests** - `npm run start-server`, `npm run test-meta-routes -- gitlab --verbose`, `npm run stop-server`.
3. **Integration tests** - `npm run test-integration` runs the generated provider against a mock GitLab GraphQL server (`tests/integration/mock_gitlab_server.mjs`) and asserts row-level results: `nodes` unwrapping, `page_info` traversal across two pages including termination on `hasNextPage: false` with a non-empty final cursor, parameter templating (`full_path` splice, enum filters unquoted, string filters quoted, omitted optionals absent from the wire), single-object `.get` projection, bearer auth header, and GraphQL `errors` array surfacing as a query failure.
4. **Smoke tests** - `python tests/smoke_test.py` (pystackql) runs read-only checks against live gitlab.com using the local provider; `--registry public` targets the published provider for post-publish verification. Set `GITLAB_TOKEN` for the `current_user` check; without it the suite runs anonymously against public data. On Windows run with `PYTHONUTF8=1`.

## Server Parameter

`host` is a server variable defaulting to `gitlab.com`; the generated server URL uses an inline-regex form (`https://{host:[^/]+}`) so that dotted hostnames resolve through the any-sdk query router. Self-managed instances are expected to route with `WHERE host = 'gitlab.example.com'` but are not yet validated, and older GitLab versions may lack fields present in the generated selection sets (GraphQL errors on unknown fields). v1 targets gitlab.com.

## Known Limitations

- Optional boolean filters with an explicit `false` value (and integer filters with `0`) are omitted from the rendered query - Go template truthiness cannot distinguish them from absent parameters.
- List-valued and input-object filter arguments are not exposed in v1.
- Any non-empty GraphQL `errors` array fails the whole query (engine policy), including partial errors alongside data.
- Full result-chain traversal is bounded by `--http.response.pageLimit` (stackql default 20).

See [NOTES.md](NOTES.md) for the evidence behind each of these.

## Repository Layout

```
provider-dev/
  downloaded/          # pinned introspection snapshot
  config/              # schema pin, service map, selection-set policy, resource inventory
  openapi/src/gitlab/  # generated provider output
  scripts/             # build_inventory.mjs, generate_provider.mjs, validate_complexity.mjs
  docgen/provider-data/
bin/                   # thin wrappers for npm scripts
tests/
  integration/         # mock GraphQL server + row-level assertions
  fixtures/            # seed definitions for the UAT group/project
  smoke_test.py        # pystackql smoke suite
website/               # Docusaurus microsite (docs phase)
```

## License

MIT
