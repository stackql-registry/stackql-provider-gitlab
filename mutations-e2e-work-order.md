# Work order - GraphQL mutations end to end (any-sdk -> stackql -> stackql-provider-gitlab)

## Context

This project is the local driver for implementing and proving GraphQL mutation support across three repositories before any PRs are raised:

- **stackql/any-sdk issue #142** - feat: GraphQL mutation support (operationType, variables payload, errors-in-200 selection) - https://github.com/stackql/any-sdk/issues/142
- **stackql/stackql issue #763** - feat: support GraphQL-backed INSERT/UPDATE/DELETE/EXEC via the any-sdk feature - https://github.com/stackql/stackql/issues/763

Read both issues in full before doing anything else - they are the specification; this work order is the local execution plan. The three working trees:

- this repo (`stackql-provider-gitlab`) - the reference provider, gaining mutation methods
- `C:\LocalGitRepos\stackql\core\any-sdk` - the engine library, gaining the feature
- `C:\LocalGitRepos\stackql\core\stackql` - the application, consuming it

Everything is built and proven locally, end to end against GitLab, in this session sequence. PRs are raised afterwards, in dependency order, only once the whole chain is confirmed - the final task prepares them but does not raise them.

## Branch discipline (first, in all three repos)

For each repo: `git fetch origin`, check out `main` (or the repo's default branch - confirm per repo), `git pull --ff-only`, record the HEAD SHA in this repo's NOTES.md, then branch:

- any-sdk: `feature/graphql-mutations` (off the recorded main SHA)
- stackql: `feature/graphql-mutations` (off the recorded main SHA)
- this repo: `feature/mutations-v2`

All three SHAs and branch names go in NOTES.md under a "Session baseline" heading before any code changes. If either core repo has uncommitted local changes, stop and report - never branch over a dirty tree.

## Tasks, in order

### 1. any-sdk: implement issue #142

In `C:\LocalGitRepos\stackql\core\any-sdk` on `feature/graphql-mutations`, per the issue's proposed design, in this order:

1. Model: `operationType`, `variables`, `errorSelection` on `standardGraphQL` (`internal/anysdk/graphql.go`) and the `GraphQL` interface; loader handling confirmed through `ExtensionKeyGraphQL` (`internal/anysdk/loader.go`) - back-compat is the first constraint: absent `operationType` means current behaviour.
2. Executor: one-shot `GQLExecutor` in `pkg/graphql/` beside `StandardGQLReader` - renders query + variables as `{"query": ..., "variables": {...}}`, single request, applies `errorSelection` (non-empty/non-null -> call failure carrying the selected content) then top-level `$.errors` check, then `responseSelection` projection. Reuse the client, `ContextWithHTTPLogger`, and stream_transform hooks.
3. Invocation wiring: route `operationType: mutation` methods through the mutation path (`public/formulation`, `public/providerinvokers/anysdkhttp`) so mutating verb wiring becomes legal for GraphQL methods.
4. Static analyzer: replace the TODO at `public/discovery/static_analyzer.go:1448` with the issue's checks (query parses, template placeholders resolvable, `errorSelection` warning on mutations, `responseSelection` on selectable methods, cursor config forbidden on mutations).
5. Tests: unit tests in `pkg/graphql` (success, payload errors, top-level errors on 200, template resolution failure) plus the back-compat proof - the fixture at `internal/anysdk/testdata/registry/src/github/v0.3.1/services/scim.yaml` loads and behaves byte-identically. `go build ./... && go test ./...` green before proceeding.

Commit in reviewable units (model, executor, wiring, analyzer, tests) with conventional messages referencing #142.

### 2. stackql: implement issue #763 against the local any-sdk

In `C:\LocalGitRepos\stackql\core\stackql` on `feature/graphql-mutations`:

1. Add the local module override as its own clearly-marked commit (it is dropped before the PR - see task 7): a `replace` directive in go.mod pointing `github.com/stackql/any-sdk` at the local path (relative form `../any-sdk` from the stackql repo root; verify the module path spelling from go.mod itself), then `go mod tidy`.
2. Implement per the issue: verb routing for `operationType: mutation` methods through the GraphQL executor; SQL-value -> declared-parameter -> variables binding with validation identical to REST; result semantics (projection on success; `errorSelection`/top-level errors as statement failure, never empty success, never rows); no protocol leakage in `SHOW`/`DESCRIBE`; `--http.log.enabled` parity via the logger context.
3. Build the local binary and record its path for the provider tests; run the existing test suite (or the relevant subset if the full suite is long - record which) green before proceeding.

Commits reference #763.

### 3. This repo: gitlab v2 mutation methods (hand-authored pilots)

Generator rules are downstream work - this session hand-authors the pilot mutation methods to prove the chain, in the exact spec shape from issue #142:

1. Pilot resources and methods, wired into `sqlVerbs`: `issues.create` (`createIssue` - insert), `issues.update` (state/title via the appropriate mutation - update or exec per signature fit), `labels.create` + `labels.delete` (a clean create/destroy pair). Each carries `operationType: mutation`, a `variables` block binding the method parameters, `responseSelection` on the payload object, and `errorSelection` on the payload `errors` array.
2. Static analysis: run the local any-sdk analyzer path over the amended docs - the new checks from task 1.4 must pass (and one deliberately broken doc should fail, as a check of the checks - not committed).
3. Keep the amendments in a dedicated directory or clearly-scoped diff - the registry PR for these docs comes after both engine PRs merge, and the docs must state the minimum any-sdk/stackql versions.

### 4. End-to-end proof against GitLab

Target: dockerized gitlab-ce if the local machine accommodates it (it is memory-heavy - allow several GB and a slow first boot); otherwise a gitlab.com free-tier account with a PAT scoped to a disposable `stackql-smoke` group. Record which target was used. Fixtures: a `stackql-smoke-<stamp>` project.

Run with the local stackql binary against the local provider docs (file registry), capturing `--http.log.enabled` wire logs as evidence for each:

1. `INSERT` an issue -> `createIssue` executes with a variables payload; the created issue projection returns (iid, title, webUrl).
2. Update the issue (state or title) via the mapped verb -> mutation executes, projection returns.
3. `INSERT` then `DELETE` a label -> create and destroy round trip.
4. Negative test: a mutation that returns a populated `errors` array inside HTTP 200 (a create against an invalid target is the easy vector) -> the statement fails with the error content surfaced; assert no empty-success and no rows.
5. Regression: two existing gitlab `SELECT` resources (one paginated) behave byte-identically to the pre-change binary - run both binaries if practical, otherwise against recorded expectations.
6. Sweep: everything created is deleted within the run; the smoke project is disposable.

Every acceptance criterion in both issues is checked off in NOTES.md with a pointer to its evidence (test name or wire-log excerpt).

### 5. Cross-repo consistency pass

Diff review across the three trees: no stray debug code, no committed credentials or wire logs, analyzer clean, `go vet`/formatting per each repo's conventions, provider docs valid. The go.mod `replace` commit in stackql is still present and still clearly isolated.

### 6. Draft the PR descriptions (do not raise)

Write `pr-drafts/any-sdk-pr.md` and `pr-drafts/stackql-pr.md` in this repo: summary, linked issue, the change list by commit, the acceptance evidence (from NOTES.md), and back-compat statements. The stackql draft states its dependency explicitly: merges only after the any-sdk PR merges and a tagged release exists, at which point the `replace` commit is dropped and go.mod pins the released version - include that step in the draft's checklist. A third stub, `pr-drafts/registry-gitlab.md`, notes the provider-docs PR that follows both.

### 7. PR sequence (for the record - executed after confirmation, not in this session)

1. any-sdk `feature/graphql-mutations` -> PR referencing #142; merge; tag/release.
2. stackql: drop the `replace` commit, pin the released any-sdk version, `go mod tidy`, re-run tests -> PR referencing #763; merge.
3. Registry PR: the gitlab provider docs with mutation methods, minimum-version noted.

## Working rules

Deterministic scripts and reviewable commits over ad hoc edits; validate-and-fail-without-writing wherever a script emits artifacts; never branch over a dirty tree; never commit credentials or wire logs; the `replace` directive never reaches a PR. Conventional commit messages referencing the issue numbers. NOTES.md in this repo is the single evidence ledger for the session. No hyperbole anywhere, no em dashes, `->` for arrows.

## Stop and summarize

Stop after task 6 (or at any blocking finding - a dirty tree, a failing back-compat fixture, an e2e failure that implicates the design rather than the implementation) and summarize: the session baseline (three SHAs, branches), the any-sdk change list with test results, the stackql change list with test results and the replace-commit id, the provider pilot methods, the e2e evidence table mapped to both issues' acceptance criteria, the consistency-pass result, and the locations of the three PR drafts.
