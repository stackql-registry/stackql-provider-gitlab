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
