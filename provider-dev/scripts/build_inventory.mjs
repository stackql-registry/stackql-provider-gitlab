#!/usr/bin/env node
// Build the resource inventory for the gitlab provider.
//
// Walks the Query, Project, and Group types via lib/schema_walk.mjs (the same
// code path the generator uses) and emits
// provider-dev/config/resource_inventory.csv: scope, source field, node type,
// connection or singular, arguments, field counts, proposed
// service/resource/method, estimated complexity, and a skip reason where the
// field is not mappable. Prints counts by scope and disposition.
//
// Deterministic: same schema in, same CSV out. Validates everything in
// memory and only writes the CSV at the end.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSchema, loadPolicy, walkAll } from './lib/schema_walk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');
const outFile = path.join(baseDir, 'provider-dev', 'config', 'resource_inventory.csv');

const schema = loadSchema(baseDir);
const policy = loadPolicy(baseDir);
const allRows = walkAll(schema, policy);

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
const header = [
  'scope', 'host_type', 'source_field', 'node_type', 'kind', 'args',
  'scalar_enum_field_count', 'nested_allowlist',
  'proposed_service', 'proposed_resource', 'proposed_method',
  'est_complexity', 'disposition', 'skip_reason',
];
const csv = [header.join(',')]
  .concat(allRows.map((r) => header.map((h) => csvEscape(r[h])).join(',')))
  .join('\n') + '\n';

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, csv);

const by = (rows, key) => rows.reduce((m, r) => { m[r[key]] = (m[r[key]] || 0) + 1; return m; }, {});
console.log(`Wrote ${allRows.length} rows to ${path.relative(baseDir, outFile)}`);
console.log('\nBy scope:');
for (const [k, v] of Object.entries(by(allRows, 'scope'))) console.log(`  ${k}: ${v}`);
console.log('\nBy disposition:');
for (const [k, v] of Object.entries(by(allRows, 'disposition'))) console.log(`  ${k}: ${v}`);
const skipped = allRows.filter((r) => r.disposition === 'skip');
console.log('\nSkip reasons:');
for (const [k, v] of Object.entries(by(skipped, 'skip_reason'))) console.log(`  ${k}: ${v}`);
const mapped = allRows.filter((r) => r.disposition === 'map');
console.log('\nMapped by scope:');
for (const [k, v] of Object.entries(by(mapped, 'scope'))) console.log(`  ${k}: ${v}`);
console.log('\nMapped by proposed service:');
for (const [k, v] of Object.entries(by(mapped, 'proposed_service')).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
console.log('\nMapped by method:');
for (const [k, v] of Object.entries(by(mapped, 'proposed_method'))) console.log(`  ${k}: ${v}`);
