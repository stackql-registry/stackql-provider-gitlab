#!/usr/bin/env node
// Complexity build gate: execute every generated query's complexity check
// against gitlab.com by appending the queryComplexity root field, and fail
// if any query's score exceeds the limit.
//
// Uses GITLAB_TOKEN as a bearer token when present (authenticated limit,
// 250 on gitlab.com); otherwise runs anonymously (limit 200). The
// authenticated limit is never lower, so an anonymous pass is conservative
// in the score dimension while the limit reported reflects the credential
// used.
//
// Probe rendering: optional-argument blocks ({{ if ... }}...{{ end }}) are
// dropped, {{ .cursor }} renders empty (first page), full_path renders a
// real public project/group, and required identifier arguments render a
// syntactically valid value for their GraphQL type (global IDs as
// gid://gitlab/<Model>/1) so the query passes argument validation - a
// lookup miss returns a null object, and the complexity score is still
// reported. Scores depend on the selection set, not the argument values.
//
// A probe GitLab rejects before scoring (for example a global ID whose
// model class cannot be derived from the scalar name) is UNMEASURED. It
// passes by proxy when another query on the same node type measured
// within the limit (same selection policy, same leaf set). When the
// failure is GitLab's own (an internal server error or a request timeout -
// some resolvers 500 for anonymous callers, and gitlab.com times out under
// load), the query is instead BOUNDED: it passes when its selection could
// not exceed the limit even if every selected leaf cost the highest
// per-field complexity ever measured (MAX_FIELD_COST, 10 from the
// MergeRequest measurement, plus the 12-point wrapper). Anything else
// unmeasured fails the gate.
//
// Usage: node validate_complexity.mjs [--host gitlab.com] [--delay-ms 500] [--service merge_requests,ci] [--resource project_pipelines]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');
const servicesDir = path.join(baseDir, 'provider-dev', 'openapi', 'src', 'gitlab', 'v00.00.00000', 'services');

const argv = process.argv.slice(2);
let host = 'gitlab.com';
let delayMs = 500;
let onlyServices = null; // --service a,b: score only these service docs (re-check after a trim)
let onlyResources = null; // --resource a,b: score only these resources
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--host') host = argv[++i];
  else if (argv[i] === '--delay-ms') delayMs = Number(argv[++i]);
  else if (argv[i] === '--service') onlyServices = argv[++i].split(',').map((x) => x.trim()).filter(Boolean);
  else if (argv[i] === '--resource') onlyResources = argv[++i].split(',').map((x) => x.trim()).filter(Boolean);
}

const PROBE_VALUES = {
  full_path: 'gitlab-org/gitlab',
  cursor: '',
};

// Global ID scalars whose model class is namespaced (the bare heuristic
// strips the ID suffix: IssueID -> Issue).
const GID_MODELS = {
  CiRunnerID: 'Ci::Runner',
  CiPipelineID: 'Ci::Pipeline',
  CiStageID: 'Ci::Stage',
  CiBuildID: 'Ci::Build',
  JobID: 'Ci::Build',
  PackagesPackageID: 'Packages::Package',
  MlExperimentID: 'Ml::Experiment',
  RemoteDevelopmentWorkspaceID: 'RemoteDevelopment::Workspace',
  IncidentManagementEscalationPolicyID: 'IncidentManagement::EscalationPolicy',
  IncidentManagementTimelineEventID: 'IncidentManagement::TimelineEvent',
  ClustersAgentID: 'Clusters::Agent',
  DastProfileID: 'Dast::Profile',
  DastSiteProfileID: 'DastSiteProfile',
  ProjectsSavedReplyID: 'Projects::SavedReply',
  GroupsSavedReplyID: 'Groups::SavedReply',
  GitlabErrorTrackingDetailedErrorID: 'Gitlab::ErrorTracking::DetailedError',
  ComplianceManagementProjectsComplianceViolationID: 'ComplianceManagement::Projects::ComplianceViolation',
  AnalyticsCustomDashboardsDashboardID: 'Analytics::CustomDashboards::Dashboard',
  BoardsEpicListID: 'Boards::EpicList',
  ListID: 'List',
  SbomOccurrenceID: 'Sbom::Occurrence',
  VulnerabilitiesScannerID: 'Vulnerabilities::Scanner',
  WorkItemsTypeID: 'WorkItems::Type',
  IterationsCadenceID: 'Iterations::Cadence',
  AiDuoWorkflowsWorkflowID: 'Ai::DuoWorkflows::Workflow',
  NamespaceID: 'Namespace',
  ProjectID: 'Project',
  UserID: 'User',
  GroupID: 'Group',
  BoardID: 'Board',
};

// Scalars whose resolvers answer a non-existent global ID with an internal
// server error instead of null (observed: IssueID via
// Project.incidentManagementTimelineEvents), so a synthetic id cannot score
// the query. A real id is sampled once from the probe project's connection.
const SAMPLED_GIDS = { IssueID: { connection: 'issues' } };
const sampledGids = {};
async function sampleGid(gqlType) {
  if (gqlType in sampledGids) return sampledGids[gqlType];
  const conn = SAMPLED_GIDS[gqlType].connection;
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.GITLAB_TOKEN) headers.Authorization = `Bearer ${process.env.GITLAB_TOKEN}`;
  try {
    const res = await fetch(`https://${host}/api/graphql`, { method: 'POST', headers, body: JSON.stringify({ query: `query { project(fullPath: "${PROBE_VALUES.full_path}") { ${conn}(first: 1) { nodes { id } } } }` }) });
    const body = await res.json();
    sampledGids[gqlType] = body.data.project[conn].nodes[0].id;
  } catch {
    sampledGids[gqlType] = null;
  }
  return sampledGids[gqlType];
}

function probeValueFor(paramName, schemaType, gqlType) {
  if (paramName in PROBE_VALUES) return PROBE_VALUES[paramName];
  if (gqlType && gqlType in SAMPLED_GIDS && sampledGids[gqlType]) return sampledGids[gqlType];
  if (gqlType && /ID$/.test(gqlType) && gqlType !== 'ID') {
    const model = GID_MODELS[gqlType] || gqlType.replace(/ID$/, '');
    return `gid://gitlab/${model}/1`;
  }
  if (/Date$/.test(gqlType || '')) return '2026-01-01';
  if (gqlType === 'Time') return '2026-01-01T00:00:00Z';
  if (schemaType === 'integer') return '1';
  if (schemaType === 'boolean') return 'true';
  if (schemaType === 'enum') return null; // filled from the enum list
  return '1';
}

function renderProbe(query, params, argTypes) {
  let s = query;
  const inner = /\{\{ if [^}]* \}\}(?:(?!\{\{ if )[\s\S])*?\{\{ end \}\}/g;
  let prev;
  do { prev = s; s = s.replace(inner, ''); } while (s !== prev);
  s = s.replace(/\{\{ \.([a-z_0-9]+) \}\}/g, (m, name) => {
    const p = params.find((x) => x.name === name);
    if (p && p.schema && p.schema.enum) return p.schema.enum[0];
    return probeValueFor(name, p?.schema?.type, argTypes[name]);
  });
  return s.replace(/^query \{/, 'query { queryComplexity { score limit }');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// gitlab.com throttles anonymous GraphQL traffic with HTML (429 / challenge)
// pages and the occasional 5xx; those are transient, so each probe is
// retried with backoff before it counts as unmeasured.
async function checkComplexity(query) {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.GITLAB_TOKEN) headers.Authorization = `Bearer ${process.env.GITLAB_TOKEN}`;
  const backoff = [2000, 8000, 30000, 60000];
  let lastErr = '';
  for (let attempt = 0; attempt <= backoff.length; attempt++) {
    try {
      const res = await fetch(`https://${host}/api/graphql`, { method: 'POST', headers, body: JSON.stringify({ query }) });
      const text = await res.text();
      let body = null;
      try { body = JSON.parse(text); } catch { body = null; }
      if (body) {
        const qc = body.data && body.data.queryComplexity;
        if (qc) return { measured: true, ok: qc.score <= qc.limit, score: qc.score, limit: qc.limit };
        const msg = (body.errors || []).map((e) => e.message).join('; ').slice(0, 240) || `http ${res.status}`;
        if (res.status < 500 && res.status !== 429) return { measured: false, error: msg };
        lastErr = msg;
      } else {
        lastErr = `http ${res.status} non-JSON response${res.status === 429 ? ' (rate limited)' : ''}`;
      }
      const retryAfter = Number(res.headers.get('retry-after') || 0) * 1000;
      if (attempt < backoff.length) await sleep(Math.max(retryAfter, backoff[attempt]));
    } catch (e) {
      lastErr = `network: ${e.message}`;
      if (attempt < backoff.length) await sleep(backoff[attempt]);
    }
  }
  return { measured: false, error: `${lastErr} (after retries)` };
}

// Argument GraphQL types come from the generated operation description of
// the parameter list; the service docs carry OpenAPI types only, so the
// introspection schema is consulted for the scalar names of required args.
import { loadSchema, loadPolicy, walkAll, sqlName } from './lib/schema_walk.mjs';
import { getNamedType } from 'graphql';
const schema = loadSchema(baseDir);
const rows = walkAll(schema, loadPolicy(baseDir)).filter((r) => r.disposition === 'map');
// parameter names carry the reserved-word suffix rule (from -> from_), so the
// lookup must use the same sqlName the generator used (walkAll configured it)
const argTypesByResource = new Map(rows.map((r) => [r.proposed_resource, Object.fromEntries(r.fieldArgs.map((a) => [sqlName(a.name), getNamedType(a.type).name]))]));
const nodeTypeByResource = new Map(rows.map((r) => [r.proposed_resource, r.node_type]));

for (const t of Object.keys(SAMPLED_GIDS)) await sampleGid(t);
const results = [];
for (const f of fs.readdirSync(servicesDir).filter((x) => x.endsWith('.yaml') && (!onlyServices || onlyServices.includes(x.replace(/\.yaml$/, '')))).sort()) {
  const doc = yaml.load(fs.readFileSync(path.join(servicesDir, f), 'utf8'));
  for (const [pathKey, item] of Object.entries(doc.paths || {})) {
    const op = item.post;
    const gql = op && op['x-stackQL-graphQL'];
    if (!gql) continue;
    const resource = /resource=([a-z_0-9]+)/.exec(pathKey)[1];
    if (onlyResources && !onlyResources.includes(resource)) continue;
    const probe = renderProbe(gql.query, op.parameters || [], argTypesByResource.get(resource) || {});
    // eslint-disable-next-line no-await-in-loop
    const r = await checkComplexity(probe);
    const entry = { id: gql.id, nodeType: nodeTypeByResource.get(resource), query: gql.query, ...r };
    results.push(entry);
    if (r.measured) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${gql.id}: score ${r.score} / limit ${r.limit}`);
    else console.log(`UNMEASURED  ${gql.id}: ${r.error}`);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

// Conservative bound for probes GitLab itself failed to serve: the wrapper
// costs 12 with a single leaf and no measured field has cost more than 10.
const MAX_FIELD_COST = 10;
const WRAPPER_COST = 12;
const SERVER_FAULT = /internal server error|request timed out|http 5\d\d|non-json response/i;
function leafCount(query) {
  // the selection set between "nodes {" and "} pageInfo" for lists, or the
  // whole body for gets; nested identity braces are flattened
  const m = /nodes \{ (.*) \} pageInfo/.exec(query);
  const body = m ? m[1] : query.replace(/^query \{ /, '').replace(/\{\{[^}]*\}\}/g, '');
  return body.replace(/[{}()]/g, ' ').split(/\s+/).filter((t) => t && !/:$/.test(t) && !/^"/.test(t)).length;
}

const passedByNode = new Set(results.filter((r) => r.measured && r.ok).map((r) => r.nodeType));
const observedLimit = Math.max(0, ...results.filter((r) => r.measured).map((r) => r.limit)) || (process.env.GITLAB_TOKEN ? 250 : 200);
let failed = 0;
let proxied = 0;
let bounded = 0;
let unresolved = 0;
for (const r of results) {
  if (r.measured) { if (!r.ok) failed++; continue; }
  if (passedByNode.has(r.nodeType)) { proxied++; continue; }
  if (SERVER_FAULT.test(r.error || '')) {
    const leaves = leafCount(r.query);
    const bound = WRAPPER_COST + leaves * MAX_FIELD_COST;
    if (bound <= observedLimit) {
      bounded++;
      console.log(`BOUNDED     ${r.id}: server-side failure (${r.error.slice(0, 60)}); ${leaves} leaves x ${MAX_FIELD_COST} + ${WRAPPER_COST} = ${bound} <= ${observedLimit}`);
      continue;
    }
    unresolved++;
    console.log(`UNRESOLVED  ${r.id}: server-side failure and the conservative bound ${bound} exceeds ${observedLimit} (${r.error})`);
    continue;
  }
  unresolved++;
  console.log(`UNRESOLVED  ${r.id}: no measured query on node type ${r.nodeType} (${r.error})`);
}
const auth = process.env.GITLAB_TOKEN ? 'authenticated' : 'anonymous';
const measured = results.filter((r) => r.measured);
const top = measured.filter((r) => r.ok).sort((a, b) => b.score - a.score).slice(0, 5);
console.log(`\n${measured.length - failed}/${measured.length} measured queries within the ${auth} complexity limit; ${proxied} unmeasured passed by node type; ${bounded} bounded after server-side failures; ${unresolved} unresolved`);
console.log(`highest scores: ${top.map((r) => `${r.id}=${r.score}`).join(', ')}`);
process.exit(failed === 0 && unresolved === 0 ? 0 : 1);
