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
// Template rendering for the probe: {{ if .x }}...{{ end }} blocks are
// dropped (optional filters absent), {{ .cursor }} renders empty (first
// page), full_path renders a real public project/group, and any other
// required parameter renders a placeholder.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');
const servicesDir = path.join(baseDir, 'provider-dev', 'openapi', 'src', 'gitlab', 'v00.00.00000', 'services');

const PROBE_VALUES = {
  full_path: 'gitlab-org/gitlab',
  cursor: '',
};

function renderProbe(query) {
  return query
    .replace(/\{\{ if \.[a-z_0-9]+ \}\}.*?\{\{ end \}\}/g, '')
    .replace(/\{\{ \.([a-z_0-9]+) \}\}/g, (m, name) => (name in PROBE_VALUES ? PROBE_VALUES[name] : 'probe'))
    .replace(/^query \{/, 'query { queryComplexity { score limit }');
}

async function checkComplexity(id, query) {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.GITLAB_TOKEN) headers.Authorization = `Bearer ${process.env.GITLAB_TOKEN}`;
  const res = await fetch('https://gitlab.com/api/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });
  const body = await res.json();
  if (body.errors && body.errors.length > 0) {
    return { id, ok: false, error: body.errors.map((e) => e.message).join('; ').slice(0, 300) };
  }
  const qc = body.data && body.data.queryComplexity;
  if (!qc) return { id, ok: false, error: 'no queryComplexity in response' };
  return { id, ok: qc.score <= qc.limit, score: qc.score, limit: qc.limit };
}

const results = [];
for (const f of fs.readdirSync(servicesDir).filter((x) => x.endsWith('.yaml'))) {
  const doc = yaml.load(fs.readFileSync(path.join(servicesDir, f), 'utf8'));
  for (const [pathKey, item] of Object.entries(doc.paths || {})) {
    for (const op of Object.values(item)) {
      const gql = op['x-stackQL-graphQL'];
      if (!gql) continue;
      const probe = renderProbe(gql.query);
      // eslint-disable-next-line no-await-in-loop
      const r = await checkComplexity(gql.id, probe);
      results.push(r);
      console.log(
        r.error
          ? `FAIL  ${r.id}: ${r.error}`
          : `${r.ok ? 'PASS' : 'FAIL'}  ${r.id}: score ${r.score} / limit ${r.limit}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 500)); // rate-limit courtesy
    }
  }
}

const auth = process.env.GITLAB_TOKEN ? 'authenticated' : 'anonymous';
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} queries within the ${auth} complexity limit`);
process.exit(failed.length === 0 ? 0 : 1);
