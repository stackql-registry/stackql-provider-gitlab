# StackQL gitlab (GitLab GraphQL API, read-only) provider build pipeline.
#
# Every step is deterministic and re-runnable; manual mapping decisions live
# in provider-dev/config (policy and service split) and provider-dev/scripts
# (rules), never in hand-edited artifacts. `make all` runs the full chain:
# verify the schema pin -> inventory -> generate -> complexity gate ->
# offline + integration + meta-route tests -> docs -> website build.
# `make smoke` (live gitlab.com reads) is separate so `all` never needs a
# token; the anonymous complexity gate is the only network call in `all`.
#
# Requirements: Node >= 20, GNU make, a stackql binary ($STACKQL, ./stackql
# or on PATH), Python 3 (a venv with pystackql is created on demand for the
# smoke suite), yarn for the website. Runs under Linux / WSL / macOS.
#
# Optional .env (never committed - gitignored; smoke and complexity targets
# source it if present), see .env.example:
#   GITLAB_TOKEN          personal access token, read_api scope (the same
#                         variable the Terraform provider reads)
#   GITLAB_HOST           self-managed host override (x-stackQL-envVar target)
#   GITLAB_SMOKE_GROUP    UAT group full path for the authenticated smokes
#   GITLAB_SMOKE_PROJECT  UAT project full path for the authenticated smokes

SHELL := bash
.DEFAULT_GOAL := help

PROVIDER := gitlab
SERVICES_DIR := provider-dev/openapi/src/$(PROVIDER)
VENV := .venv
PY := $(VENV)/bin/python
ENV_FILE := .env

.PHONY: help deps fetch-schema refresh-schema inventory generate generate-accept validate-complexity build measure-costs trim-budget \
        test-offline test-integration test-meta test venv seed-fixtures teardown-fixtures smoke smoke-live \
        docs website website-start publish-registry clean all

help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

deps: ## install node dependencies (latest @stackql/provider-utils + @stackql/pgwire-lite per package.json ranges)
	npm install

# ---------------------------------------------------------------- pipeline

fetch-schema: ## download the gitlab.com introspection schema and verify it against the pin (fails on drift)
	npm run fetch-schema

refresh-schema: ## download the schema and ACCEPT the upstream change (rewrites the pin - review the generated diff)
	npm run fetch-schema -- --update

inventory: ## walk the pinned schema into provider-dev/config/resource_inventory.csv
	npm run build-inventory

generate: ## generate the provider from the pinned schema (fails if the operation mapping changed - see generate-accept)
	npm run generate-provider

generate-accept: ## generate and ACCEPT operation mapping changes (review the all_services.csv diff - these break existing queries)
	npm run generate-provider -- --accept-mapping-changes

# The complexity gate needs gitlab.com; GITLAB_TOKEN from .env raises the
# limit checked from the anonymous 200 to the authenticated 250.
validate-complexity: ## complexity gate: every generated query scored against the live gitlab.com limit
	@$(with_env) npm run validate-complexity

build: fetch-schema inventory generate validate-complexity ## full schema -> provider pipeline

# Over-budget node types (a FAIL from validate-complexity): measure every
# field's cost, then derive the policy exclusion list from the evidence.
#   make measure-costs TYPE=MergeRequest SCOPE=project FIELD=mergeRequests
#   make trim-budget TYPE=MergeRequest SCORE=245
measure-costs: ## score every selectable field of TYPE alone on gitlab.com -> provider-dev/config/field_costs/TYPE.json
	@$(with_env) node provider-dev/scripts/measure_field_costs.mjs --type $(TYPE) --scope $(SCOPE) --field $(FIELD)

trim-budget: ## write nodeTypeFieldExclusions.TYPE from the measured costs so the query fits the policy budget (SCORE = the failing score)
	node provider-dev/scripts/trim_to_budget.mjs --type $(TYPE) --current-score $(SCORE)

# ------------------------------------------------------------------- tests

test-offline: ## quick offline validation against the local file registry (SHOW / DESCRIBE, snake_case columns, host env var)
	npm run test-offline

test-integration: ## row-level integration tests against the mock GitLab GraphQL server (no token, no network)
	npm run test-integration

test-meta: ## meta-route suite against a local stackql server (walks every service/resource/method)
	npm run start-server
	npm run test-meta-routes -- $(PROVIDER) || (npm run stop-server; exit 1)
	npm run stop-server

test: test-offline test-integration test-meta ## all non-live test layers

$(VENV)/bin/activate:
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install --quiet --upgrade pip pystackql

venv: $(VENV)/bin/activate ## create the python venv with pystackql for the smoke suite

# smoke targets source .env when present so a developer checkout works
# without exporting anything; CI sets variables from secrets.
with_env = set -a; [ -f $(ENV_FILE) ] && source <(tr -d '\r' < $(ENV_FILE)); set +a;

# UAT fixtures on gitlab.com (a token with the api scope): the public group
# with the read-only mirror of github.com/stackql/stackql, and the private
# smoke project the authenticated smoke tier queries. Idempotent.
seed-fixtures: ## create the gitlab.com UAT group, mirror and smoke fixtures (idempotent; needs GITLAB_TOKEN with api scope)
	@$(with_env) node tests/fixtures/seed_fixtures.mjs

teardown-fixtures: ## delete the smoke project and subgroup (the group and the mirror are left in place)
	@$(with_env) node tests/fixtures/seed_fixtures.mjs --teardown

smoke: venv ## live read smoke suite against gitlab.com with the locally generated provider (anonymous, or GITLAB_TOKEN for the authenticated tier)
	@$(with_env) $(PY) tests/smoke_test.py

smoke-live: venv ## live read smoke suite against the PUBLISHED provider in the stackql registry (post-publish verification)
	@$(with_env) $(PY) tests/smoke_test.py --live

# -------------------------------------------------------------------- docs

# No --snake-case-aliases: the generated queries alias every field to
# snake_case, so the docs render the columns exactly as the engine does.
docs: ## generate the website docs, then sanitize for MDX v3
	npm run generate-docs -- \
	  --provider-name $(PROVIDER) \
	  --provider-dir ./$(SERVICES_DIR)/v00.00.00000 \
	  --output-dir ./website \
	  --provider-data-dir ./provider-dev/docgen/provider-data
	node website/scripts/sanitize-docs.mjs

website: ## build the docusaurus microsite (vendors shared config first)
	cd website && yarn install && yarn build

website-start: ## run the docusaurus dev server
	cd website && yarn install && yarn start

# Stage the generated provider into a local checkout of stackql-provider-registry
# (providers/src/gitlab). Commit and raise the PR against `dev` by hand after
# `make smoke` passes; nothing here touches a remote.
REGISTRY_DIR ?= ../../../../stackql/core/stackql-provider-registry
publish-registry: ## copy the generated provider into $(REGISTRY_DIR)/providers/src/gitlab (local checkout; no git operations)
	@test -d "$(REGISTRY_DIR)/providers/src" || { echo "REGISTRY_DIR=$(REGISTRY_DIR) is not a stackql-provider-registry checkout"; exit 1; }
	rm -rf "$(REGISTRY_DIR)/providers/src/$(PROVIDER)"
	cp -r $(SERVICES_DIR) "$(REGISTRY_DIR)/providers/src/$(PROVIDER)"
	@echo "staged $(SERVICES_DIR) -> $(REGISTRY_DIR)/providers/src/$(PROVIDER); review with 'git -C $(REGISTRY_DIR) status'"

clean: ## remove regenerable artifacts (provider output, website build)
	rm -rf provider-dev/openapi/* website/build website/.docusaurus

all: deps build test docs website ## everything that needs no token: deps, pipeline (incl. the anonymous complexity gate), tests, docs, site build
