#!/usr/bin/env node
// Measure the per-field complexity cost of one node type on gitlab.com, so
// over-budget node types can be trimmed by policy (nodeTypeFieldExclusions in
// selection_policy.json) from evidence rather than taste.
//
// Complexity is additive per selected field, so each scalar/enum field of the
// node type is scored alone inside the same connection wrapper (baseline =
// the wrapper with only `id`), and its cost is the difference. Results are
// printed highest-cost first and written to provider-dev/config/field_costs/<Type>.json.
//
// Usage: node measure_field_costs.mjs --type MergeRequest --scope project --field mergeRequests [--full-path gitlab-org/gitlab] [--delay-ms 1000]
// Uses GITLAB_TOKEN when set (the authenticated limit is 250; scores are the same).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSchema, loadPolicy, scalarEnumFields } from './lib/schema_walk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');

const argv = process.argv.slice(2);
const opt = { type: null, scope: 'project', field: null, fullPath: 'gitlab-org/gitlab', delayMs: 1000, host: 'gitlab.com' };
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--type') opt.type = argv[++i];
  else if (argv[i] === '--scope') opt.scope = argv[++i];
  else if (argv[i] === '--field') opt.field = argv[++i];
  else if (argv[i] === '--full-path') opt.fullPath = argv[++i];
  else if (argv[i] === '--delay-ms') opt.delayMs = Number(argv[++i]);
  else if (argv[i] === '--host') opt.host = argv[++i];
}
if (!opt.type || !opt.field) {
  console.error('usage: --type <NodeType> --field <connectionField> [--scope instance|project|group]');
  process.exit(1);
}

const schema = loadSchema(baseDir);
const policy = { ...loadPolicy(baseDir), nodeTypeFieldExclusions: {} }; // measure everything the policy could select
const nodeType = schema.getType(opt.type);
if (!nodeType) { console.error(`type ${opt.type} not in schema`); process.exit(1); }
const fields = scalarEnumFields(nodeType, policy).map((f) => f.name);

function wrap(selection) {
  const conn = `${opt.field}(first: 100) { nodes { ${selection} } }`;
  if (opt.scope === 'instance') return `query { queryComplexity { score limit } ${conn} }`;
  return `query { queryComplexity { score limit } ${opt.scope}(fullPath: "${opt.fullPath}") { ${conn} } }`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function score(query) {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.GITLAB_TOKEN) headers.Authorization = `Bearer ${process.env.GITLAB_TOKEN}`;
  const backoff = [3000, 10000, 30000, 60000];
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(`https://${opt.host}/api/graphql`, { method: 'POST', headers, body: JSON.stringify({ query }) });
      const text = await res.text();
      let body = null;
      try { body = JSON.parse(text); } catch { body = null; }
      const qc = body && body.data && body.data.queryComplexity;
      if (qc) return qc.score;
      const msg = body && body.errors ? body.errors.map((e) => e.message).join('; ') : `http ${res.status}`;
      // an over-limit single-field query still reports the score in the error text
      const m = /complexity of (\d+)/.exec(msg);
      if (m) return Number(m[1]);
      if (attempt >= backoff.length) throw new Error(msg);
    } catch (e) {
      if (attempt >= backoff.length) throw e;
    }
    await sleep(backoff[attempt]);
  }
}

const baseline = await score(wrap('id'));
console.log(`baseline (id only): ${baseline}`);
const costs = {};
for (const f of fields) {
  if (f === 'id') { costs[f] = 0; continue; }
  await sleep(opt.delayMs);
  try {
    const s = await score(wrap(`id ${f}`));
    costs[f] = s - baseline;
    console.log(`${String(costs[f]).padStart(4)}  ${f}`);
  } catch (e) {
    costs[f] = null;
    console.log(`   ?  ${f}: ${e.message.slice(0, 120)}`);
  }
}

const sorted = Object.entries(costs).filter(([, v]) => v !== null).sort((a, b) => b[1] - a[1]);
const total = sorted.reduce((n, [, v]) => n + v, 0) + baseline;
console.log(`\nfull selection estimate: ${total}; highest costs:`);
for (const [f, v] of sorted.slice(0, 20)) console.log(`  ${String(v).padStart(4)}  ${f}`);

const outDir = path.join(baseDir, 'provider-dev', 'config', 'field_costs');
fs.mkdirSync(outDir, { recursive: true });
const out = { type: opt.type, scope: opt.scope, field: opt.field, measuredAt: new Date().toISOString(), baseline, costs };
fs.writeFileSync(path.join(outDir, `${opt.type}.json`), JSON.stringify(out, null, 2) + '\n');
console.log(`wrote provider-dev/config/field_costs/${opt.type}.json`);
