#!/usr/bin/env node
// Derive nodeTypeFieldExclusions for one node type from measured per-field
// costs (provider-dev/config/field_costs/<Type>.json, written by
// measure_field_costs.mjs) so the type's generated query fits the complexity
// budget. Deterministic: the highest-cost fields are excluded first (ties
// alphabetical), fields named in policy.budgetProtectedFields are never
// excluded, and exclusion stops as soon as the projected score is within
// budget. The plan is printed, then written into selection_policy.json
// under nodeTypeFieldExclusions.<Type> together with the evidence (measured
// score, budget, per-field costs) so the review sees why each field went.
//
// Usage: node trim_to_budget.mjs --type MergeRequest --current-score 245 [--budget 200] [--dry-run]
//   --current-score  the score validate_complexity reported for the type's
//                    widest generated query (list) before trimming

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');
const policyFile = path.join(baseDir, 'provider-dev', 'config', 'selection_policy.json');

const argv = process.argv.slice(2);
const opt = { type: null, currentScore: null, budget: null, dryRun: false };
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--type') opt.type = argv[++i];
  else if (argv[i] === '--current-score') opt.currentScore = Number(argv[++i]);
  else if (argv[i] === '--budget') opt.budget = Number(argv[++i]);
  else if (argv[i] === '--dry-run') opt.dryRun = true;
}
if (!opt.type || !opt.currentScore) {
  console.error('usage: --type <NodeType> --current-score <n> [--budget <n>] [--dry-run]');
  process.exit(1);
}

const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
const budget = opt.budget || policy.complexityBudget;
if (!budget) { console.error('no --budget and no policy.complexityBudget'); process.exit(1); }
const protectedFields = new Set(policy.budgetProtectedFields || []);

const costsFile = path.join(baseDir, 'provider-dev', 'config', 'field_costs', `${opt.type}.json`);
if (!fs.existsSync(costsFile)) { console.error(`${costsFile} not found - run measure_field_costs.mjs first`); process.exit(1); }
const measured = JSON.parse(fs.readFileSync(costsFile, 'utf8'));

const already = new Set(((policy.nodeTypeFieldExclusions || {})[opt.type] || {}).fields || []);
const candidates = Object.entries(measured.costs)
  .filter(([name, cost]) => cost !== null && cost > 0 && !protectedFields.has(name) && !already.has(name))
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

let projected = opt.currentScore;
const excluded = [];
for (const [name, cost] of candidates) {
  if (projected <= budget) break;
  excluded.push({ name, cost });
  projected -= cost;
}

console.log(`${opt.type}: measured ${opt.currentScore}, budget ${budget}, protected ${protectedFields.size} field(s)`);
if (projected > budget) {
  console.error(`cannot reach the budget: projected ${projected} after excluding every unprotected field`);
  process.exit(1);
}
for (const e of excluded) console.log(`  exclude ${e.name} (cost ${e.cost})`);
console.log(`projected score ${projected} (${excluded.length} field(s) excluded)`);

if (opt.dryRun) process.exit(0);

policy.nodeTypeFieldExclusions = policy.nodeTypeFieldExclusions || {};
const prior = policy.nodeTypeFieldExclusions[opt.type] || {};
policy.nodeTypeFieldExclusions[opt.type] = {
  evidence: `measured ${opt.currentScore} against budget ${budget} on ${measured.measuredAt.slice(0, 10)} via measure_field_costs.mjs (${measured.scope}.${measured.field}); highest-cost unprotected fields excluded until the projected score (${projected}) fits`,
  fields: [...(prior.fields || []), ...excluded.map((e) => e.name)].sort(),
  costs: Object.fromEntries([...(Object.entries(prior.costs || {})), ...excluded.map((e) => [e.name, e.cost])].sort((a, b) => a[0].localeCompare(b[0]))),
};
fs.writeFileSync(policyFile, JSON.stringify(policy, null, 2) + '\n');
console.log(`wrote nodeTypeFieldExclusions.${opt.type} to ${path.relative(baseDir, policyFile)}; run make generate && make validate-complexity`);
