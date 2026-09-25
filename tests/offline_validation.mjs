#!/usr/bin/env node

// Quick offline validation of the generated provider against the local file
// registry - no network, no server. Runs SHOW SERVICES / SHOW RESOURCES /
// SHOW METHODS and DESCRIBE over representative resources and asserts the
// service split, the snake_case column surface, the scope parameters, and
// the x-stackQL-envVar behaviour of the host server variable (GITLAB_HOST).
// Exit 1 on any failure.
//
// Usage: node tests/offline_validation.mjs
// Binary resolution: $STACKQL, ./stackql(.exe) for the platform, then PATH.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const regPath = path.join(repoRoot, 'provider-dev', 'openapi').replace(/\\/g, '/');
const registry = JSON.stringify({ url: `file://${regPath}`, localDocRoot: regPath, verifyConfig: { nopVerify: true } });

function findBinary() {
  if (process.env.STACKQL && fs.existsSync(process.env.STACKQL)) return process.env.STACKQL;
  const local = path.join(repoRoot, process.platform === 'win32' ? 'stackql.exe' : 'stackql');
  if (fs.existsSync(local)) return local;
  return 'stackql'; // PATH
}
const bin = findBinary();

function runSql(sql, envOverrides = {}) {
  return new Promise((resolve) => {
    const env = { ...process.env, ...envOverrides };
    for (const [k, v] of Object.entries(envOverrides)) if (v === undefined) delete env[k];
    const child = spawn(bin, [`--registry=${registry}`, 'exec', sql, '--output', 'json'], { cwd: repoRoot, env });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (code) => {
      let rows = [];
      try { rows = JSON.parse(stdout) ?? []; } catch { rows = []; }
      resolve({ code, rows, stdout, stderr });
    });
    child.on('error', (err) => resolve({ code: -1, rows: [], stdout: '', stderr: String(err) }));
  });
}

const results = [];
function check(name, cond, note = '') {
  results.push({ name, pass: !!cond, note });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : `  [${String(note).slice(0, 200)}]`}`);
}

const EXPECTED_SERVICES = [
  'admin', 'analytics', 'audit', 'boards', 'ci', 'duo', 'groups', 'issues', 'merge_requests', 'metadata',
  'ml', 'packages', 'projects', 'security', 'snippets', 'users', 'work_items', 'workspaces',
];
const EXPECTED_RESOURCES = {
  projects: ['project', 'projects', 'project_labels', 'project_milestones', 'project_releases', 'project_environments', 'project_repository', 'topics'],
  groups: ['group', 'groups', 'group_projects', 'group_group_members', 'group_descendant_groups', 'group_iterations', 'namespace'],
  issues: ['issue', 'project_issue', 'project_issues', 'group_issues', 'timelogs'],
  merge_requests: ['merge_request', 'project_merge_request', 'project_merge_requests', 'group_merge_requests'],
  ci: ['project_pipelines', 'project_pipeline', 'project_jobs', 'runners', 'runner', 'group_runners', 'project_ci_variables'],
  users: ['current_user', 'user', 'users'],
  security: ['vulnerabilities', 'project_vulnerabilities', 'group_vulnerabilities', 'project_dependencies'],
  metadata: ['metadata', 'query_complexity', 'current_license'],
};

console.log(`offline validation  stackql=${bin}  registry=${regPath}`);

let r = await runSql('SHOW SERVICES IN gitlab');
const services = r.rows.map((x) => x.name).sort();
check(`SHOW SERVICES lists the ${EXPECTED_SERVICES.length} services`, JSON.stringify(services) === JSON.stringify(EXPECTED_SERVICES), r.stderr || services.join(','));

for (const [svc, expected] of Object.entries(EXPECTED_RESOURCES)) {
  r = await runSql(`SHOW RESOURCES IN gitlab.${svc}`);
  const names = new Set(r.rows.map((x) => x.name));
  const missing = expected.filter((n) => !names.has(n));
  check(`SHOW RESOURCES IN gitlab.${svc} includes ${expected.join(', ')}`, r.rows.length > 0 && missing.length === 0, r.stderr || `missing: ${missing.join(',')} (have ${r.rows.length})`);
}

// every resource is SELECT-only, with exactly one method
r = await runSql('SHOW EXTENDED METHODS IN gitlab.issues.project_issues');
check('project_issues has exactly one method, list, mapped to SELECT', r.rows.length === 1 && r.rows[0].MethodName === 'list' && r.rows[0].SQLVerb === 'SELECT', JSON.stringify(r.rows).slice(0, 200));
check('project_issues list requires full_path (+ host when GITLAB_HOST is unset)', /full_path/.test(r.rows[0]?.RequiredParams || ''), JSON.stringify(r.rows).slice(0, 200));

r = await runSql('SHOW METHODS IN gitlab.users.user', { GITLAB_HOST: undefined });
check('user get: host is reported required when GITLAB_HOST is unset (default gitlab.com still applies at query time)', r.rows.length === 1 && r.rows[0].RequiredParams === 'host', JSON.stringify(r.rows).slice(0, 200));
r = await runSql('SHOW METHODS IN gitlab.users.user', { GITLAB_HOST: 'gitlab.example.com' });
check('user get: host is not required when GITLAB_HOST is set (x-stackQL-envVar)', r.rows.length === 1 && !/host/.test(r.rows[0].RequiredParams || ''), JSON.stringify(r.rows).slice(0, 200));

// snake_case column surface from the query aliases
r = await runSql('DESCRIBE gitlab.projects.projects');
const cols = new Set(r.rows.map((x) => x.name));
check('DESCRIBE projects: snake_case columns (full_path, star_count, created_at, web_url)', ['full_path', 'star_count', 'created_at', 'web_url', 'namespace'].every((c) => cols.has(c)), r.stderr || [...cols].slice(0, 20).join(','));
check('DESCRIBE projects: no camelCase columns remain', ![...cols].some((c) => /[A-Z]/.test(c)), [...cols].filter((c) => /[A-Z]/.test(c)).join(','));
check('DESCRIBE projects: no *Html rendered duplicates', ![...cols].some((c) => /_html$/.test(c)), [...cols].filter((c) => /_html$/.test(c)).join(','));

r = await runSql('DESCRIBE EXTENDED gitlab.merge_requests.project_merge_requests');
const mrCols = new Map(r.rows.map((x) => [x.name, x]));
check('DESCRIBE EXTENDED merge requests: > 60 columns with types and descriptions', mrCols.size > 60 && mrCols.get('created_at')?.type === 'string' && (mrCols.get('title')?.description || '').length > 0, `got ${mrCols.size}`);
check('DESCRIBE merge requests: enum column state is a string, boolean columns typed boolean', mrCols.get('state')?.type === 'string' && mrCols.get('draft')?.type === 'boolean', JSON.stringify([mrCols.get('state'), mrCols.get('draft')]).slice(0, 200));

r = await runSql('DESCRIBE gitlab.users.current_user');
check('DESCRIBE current_user (singular get) projects columns', r.rows.length > 20 && r.rows.some((x) => x.name === 'username'), r.stderr || `got ${r.rows.length}`);

r = await runSql('DESCRIBE gitlab.ci.project_pipeline');
check('DESCRIBE project_pipeline (project-scoped get) projects columns incl. nested user identity', r.rows.some((x) => x.name === 'status') && r.rows.some((x) => x.name === 'user' && x.type === 'object'), r.stderr || `got ${r.rows.length}`);

const failed = results.filter((x) => !x.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed === 0 ? 0 : 1);
