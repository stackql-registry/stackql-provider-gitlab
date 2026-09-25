# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this repo is

This repository generates and documents the `gitlab` provider for [StackQL](https://github.com/stackql/stackql). StackQL is a SQL-based query and provisioning engine for cloud and SaaS providers; this repo produces the provider artifacts that let StackQL query GitLab with SQL (for example `SELECT ... FROM gitlab.issues.project_issues`).

**The provider is read-only by architecture, not by policy.** It is built on GitLab's GraphQL API, and StackQL's GraphQL support is a read path only: the any-sdk `GQLReader` exposes a single `Read()` and the only GraphQL primitive builder in stackql is `graphql_single_select_acquire.go`. Every method maps to `SELECT`. Mutations (GitLab's REST API, or GraphQL mutations once the engine supports them) are roadmap, not scope; do not add write verbs.

The provider is generated from the gitlab.com introspection schema (`https://gitlab.com/-/graphql/introspection_result_no_deprecated.json`), snapshotted into `provider-dev/downloaded/` and pinned by hash in `provider-dev/config/schema_pin.json`. No token is needed at build time; gitlab.com is contacted only by the complexity gate (anonymous) and the smoke suite.

## What this repo does

Every stage is a `make` target (`make help` lists them); `make all` runs the full token-free chain (deps -> build -> test -> docs -> website):

1. **Fetch and pin** - `make fetch-schema` downloads the schema and fails on drift against the pin without writing anything; `make refresh-schema` accepts the upstream change (rewrites the pin - the generated diff is the review)
2. **Inventory** - `make inventory` walks `Query`, `Project` and `Group` (`provider-dev/scripts/lib/schema_walk.mjs`) into `provider-dev/config/resource_inventory.csv`: one row per candidate field with scope, node type, arguments, proposed service / resource / method and a skip reason where not mappable
3. **Generate** - `make generate` emits `provider-dev/openapi/src/gitlab/v00.00.00000/` (one service doc per service plus `provider.yaml`) and `provider-dev/config/all_services.csv`, the durable operation mapping. Query text, `x-stackQL-graphQL` block, parameters and the `responses.200` schema all come from one resolved field list per resource. It FAILS if an existing mapping row is removed, moves service, or changes source field; `make generate-accept` accepts (these break existing queries - review the CSV diff)
4. **Complexity gate** - `make validate-complexity` scores every generated query against the live gitlab.com `queryComplexity` limit (anonymous 200 / authenticated 250 with `GITLAB_TOKEN`); over-budget node types get entries in `nodeTypeFieldExclusions` in `selection_policy.json` (derived by `make trim-budget TYPE=... SCORE=...` from `make measure-costs` evidence in `provider-dev/config/field_costs/<Type>.json`: highest cost first, `budgetProtectedFields` never, until `complexityBudget` fits), never per-resource hand edits
5. **Test** - `make test` = offline SHOW / DESCRIBE checks (`tests/offline_validation.mjs`) + row-level integration tests against the mock GitLab GraphQL server (`tests/integration/`, no network) + meta-route walk over every resource (`bin/test-meta-routes.cjs` via a local `stackql srv`); `make smoke` runs the read-only pystackql suite against gitlab.com (anonymous, or the authenticated tier with `GITLAB_TOKEN`), `make smoke-live` the same against the PUBLISHED provider (pulls it, reports its version); smoke targets source `.env` if present (see `.env.example`)
6. **Docs** - `make docs` runs `@stackql/provider-utils` docgen (landing page content from `provider-dev/docgen/provider-data/headerContent{1,2}.txt`) then `website/scripts/sanitize-docs.mjs`; `make website` builds the Docusaurus 3.10 microsite (shared config vendored from `stackql/docusaurus-config` at build time, `showLastUpdateTime` flipped on locally)
7. **Publish** - the provider dir is pushed to `providers/src/gitlab` in [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry) (PR against `dev`); the microsite publishes to https://gitlab-provider.stackql.io via GitHub Pages

The README documents each step with full commands. Follow it as the source of truth for the pipeline.

## Key directories

```
provider-dev/downloaded/   pinned introspection snapshot (committed - the build input)
provider-dev/config/       schema_pin.json, selection_policy.json, service_names.json, resource_inventory.csv, all_services.csv
provider-dev/scripts/      lib/schema_walk.mjs (walk + SERVICE_RULES), build_inventory.mjs, generate_provider.mjs, validate_complexity.mjs, measure_field_costs.mjs, trim_to_budget.mjs - rule changes go here
provider-dev/openapi/      generated provider output (regenerable, committed, never hand-edited)
provider-dev/docgen/       provider-data/headerContent{1,2}.txt for the docs landing page
tests/                     offline_validation.mjs, integration/ (mock GraphQL server + runner), smoke_test.py (pystackql), fixtures/ (fixtures.json + seed_fixtures.mjs: idempotent gitlab.com UAT seeding via REST, make seed-fixtures)
website/                   Docusaurus microsite - provider identity in website/provider.js; docs/ generated by docgen + sanitize-docs.mjs
bin/                       fetch-schema.sh, start/stop/server-status.sh, test-meta-routes.cjs
```

## Conventions

- Three resource scopes, derived mechanically: connection fields on `Query` are instance-scoped (`projects`, `users`, `runners`); on `Project` they are project-scoped with the `project_` prefix and a required `full_path` parameter (`project_issues`, `project_pipelines`); on `Group` they are group-scoped with the `group_` prefix and a required `full_path` (`group_projects`, `group_group_members`). Singular object fields become `.get` methods (`project`, `current_user`, `project_pipeline`)
- Service assignment is `SERVICE_RULES` in `lib/schema_walk.mjs` (first regex match on the snake_case resource name) plus `overrides` in `service_names.json`; a resource that lands in `misc` fails generation until a rule or override places it
- Columns are snake_case via GraphQL aliases in the query itself (`full_path: fullPath`), so the wire response, the response schema and `DESCRIBE` agree without engine-side aliasing (`snake_case_aliases` is deliberately NOT set). Nested identity objects (`author`, `user`, `namespace`, `group_`, `project`, `milestone`, `access_level`) project as JSON columns: `json_extract(author, '$.username')`
- Filter arguments (scalar or enum, non-list) are optional parameters pushed down into the query: enums render bare (`state: opened`), Int / Float / Boolean bare, everything else quoted. Absent WHERE values render nothing; `false` and `0` render (only an empty string is treated as absent). List-valued and input-object arguments are not exposed
- Every list uses the any-sdk `page_info` cursor strategy (`first: 100{{ .cursor }}`, terminate on `hasNextPage`); gets carry a sentinel cursor path so exactly one page is fetched and select the object via a wildcard (`$.data.*` / `$.data.project.*`) to yield one row
- `host` is a server variable (`https://{host:[^/]+}`, default `gitlab.com`) supplied as `WHERE host = ...` or defaulted from `GITLAB_HOST` via `x-stackQL-envVar` (explicit WHERE wins); auth is a bearer PAT from `GITLAB_TOKEN`, the Terraform provider's variable
- Rendered-HTML duplicate fields (`*Html`) are excluded by policy, as are resolvers observed to time out on large result sets (`unstableFields`, with the observation recorded); column and parameter names the engine rejects as identifiers (`exists`, `group`, `default`, `primary`, `all`, `from`, `to`, `limit`, `release` - measured, listed in `sqlReservedColumnNames`) get a trailing underscore (`exists_`, `group_`), since quoting does not rescue them

## Things to know

- `all_services.csv` is generated by `generate_provider.mjs` and is the stability contract for published resource names; a mapping change is a breaking change and must be accepted explicitly (`make generate-accept`) and called out in the release notes
- Any non-empty GraphQL `errors` array fails the whole query (engine policy), including partial errors alongside data; a `.get` whose object is null (missing project, anonymous `current_user`) errors rather than returning zero rows
- Full-chain traversal is bounded by `--http.response.pageLimit` (stackql default 20, which yields at most 19 requests = 1900 rows); raise it for large inventories
- `SQL LIMIT` is not pushed into `first:`; every page is 100 rows and the limit applies locally
- v1 targets gitlab.com; self-managed instances route via `GITLAB_HOST` / `WHERE host` but older versions may reject fields the gitlab.com schema serves (GraphQL errors on unknown fields). The Terraform `GITLAB_BASE_URL` variable carries the REST v4 path and is therefore not reused for the host
- UAT fixtures on gitlab.com are seeded by `make seed-fixtures` (REST v4, `api` scope): a public read-only mirror of github.com/stackql/stackql (one-time import; pull mirroring is Premium) and a private smoke project. gitlab.com refuses API top-level group creation for the token's account (bare 403), so they sit in the personal namespace `javen-infraql`; the `stackql` group on gitlab.com belongs to the user's other account (`javen2`) and is the intended home once `javen-infraql` is an owner there
- `mutations-e2e-work-order.md` (untracked) describes a GraphQL mutation effort spanning any-sdk and stackql; neither engine repo has that branch and it is out of scope for this provider until the engine ships mutation support

## Writing conventions

- README and docs copy: measured, precise, no hyperbole. State the read-only scope directly; do not bury it
- No em dashes; use `-`. No characters not on a QWERTY keyboard; use `->` for arrows
- Sample queries: realistic, runnable, snake_case columns, `json_extract` for nested identity objects

## Non-negotiables

1. Latest `@stackql/provider-utils` and `@stackql/pgwire-lite` (see `package.json` ranges; `make deps`)
2. The k8s `feature/provider-dev` repo is the reference for repo structure, Makefile and testing; the any-sdk `scim` service doc and the github provider's GraphQL services are the references for GraphQL method shape - deviate only with a documented reason in the README
3. Query text and response schema are generated from one field list by one code path - they can never drift
4. Deterministic scripts and policy config, never hand-edits to generated artifacts
5. Every regeneration is followed by the complexity gate and the integration and meta-route suites before commit
