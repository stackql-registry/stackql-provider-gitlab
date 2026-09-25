#!/usr/bin/env node

// Integration tests: run the generated provider against the mock GitLab
// GraphQL server and assert row-level results per archetype:
//   - nodes unwrapping and page_info traversal across two pages, including
//     termination on hasNextPage=false with a non-empty final endCursor
//   - snake_case columns via query aliases (full_path, star_count, ...)
//   - parameter templating: full_path splice, enum filter (unquoted),
//     string filter (quoted), boolean false filter (rendered, not dropped),
//     omitted optional filters absent from the wire
//   - group-scoped list whose nodes carry a full_path column of their own
//   - single-object .get projection: instance scope ($.data.*) and project
//     scope ($.data.project.*), and an optional-only-argument get (user)
//   - GraphQL errors array (HTTP 200) surfacing as a query failure
//   - bearer auth header, and the wire path stripped of the routing query
//     string
//
// The provider declares 'https://{host}'; the mock is plain HTTP, so the
// runner materializes a test registry copy with the server url switched to
// 'http://{host}'. Everything else is byte-identical to the generated docs.
//
// Requires a stackql binary: $STACKQL, ./stackql(.exe), or 'stackql' on PATH.
//
// Usage: node tests/integration/run_integration_tests.mjs [--verbose]

import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startMockServer } from './mock_gitlab_server.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const verbose = process.argv.includes('--verbose');

function findStackql() {
  if (process.env.STACKQL) return process.env.STACKQL;
  // the repo-root ./stackql is a Linux ELF (WSL use) - only pick the
  // platform-appropriate local binary, else fall back to PATH
  const local = path.join(repoRoot, process.platform === 'win32' ? 'stackql.exe' : 'stackql');
  if (existsSync(local)) return local;
  return 'stackql';
}
const stackqlBin = findStackql();

// --- materialize the http test registry
const tmpRoot = mkdtempSync(path.join(os.tmpdir(), 'gitlab-provider-itest-'));
const srcRegistry = path.join(repoRoot, 'provider-dev', 'openapi');
cpSync(srcRegistry, tmpRoot, { recursive: true });
const servicesDir = path.join(tmpRoot, 'src', 'gitlab', 'v00.00.00000', 'services');
for (const f of readdirSync(servicesDir)) {
  const p = path.join(servicesDir, f);
  writeFileSync(p, readFileSync(p, 'utf8').replace('url: https://{host', 'url: http://{host'));
}
const regPath = tmpRoot.split(path.sep).join('/');
const registry = JSON.stringify({
  url: `file://${regPath}`,
  localDocRoot: regPath,
  verifyConfig: { nopVerify: true },
});

function runSql(sql) {
  return new Promise((resolve) => {
    const env = { ...process.env, GITLAB_TOKEN: 'mock-token' };
    delete env.GITLAB_HOST; // the host is supplied per query below
    const child = spawn(stackqlBin, [`--registry=${registry}`, 'exec', sql, '--output', 'json'], { cwd: repoRoot, env });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    const timer = setTimeout(() => child.kill(), 120000);
    child.on('error', (e) => { clearTimeout(timer); resolve({ rows: null, err: String(e) }); });
    child.on('close', () => {
      clearTimeout(timer);
      stdout = stdout.trim();
      stderr = stderr.trim();
      if (verbose) console.log(`    sql: ${sql}\n    out: ${stdout.slice(0, 300)}${stderr ? `\n    err: ${stderr.slice(0, 300)}` : ''}`);
      const errish = /http response status code: [45]|error|panic|FindRoute|no matching operation/i;
      if (errish.test(stderr)) return resolve({ rows: null, err: stderr });
      if (!stdout) return resolve({ rows: [], err: null });
      try {
        resolve({ rows: JSON.parse(stdout) ?? [], err: null });
      } catch {
        resolve({ rows: [{ _text: stdout }], err: errish.test(stdout) ? stdout : null });
      }
    });
  });
}

const results = [];
function check(name, cond, note = '') {
  results.push({ name, pass: !!cond, note });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${!cond && note ? `  [${String(note).slice(0, 200)}]` : ''}`);
}

const { server, port, log } = await startMockServer();
const hostWhere = `host = 'localhost:${port}'`;
console.log(`mock gitlab graphql server on localhost:${port}, stackql: ${stackqlBin}`);
console.log(`test registry: ${regPath}`);

try {
  // --- instance-scoped connection: two-page page_info traversal, snake columns
  let mark = log.length;
  let r = await runSql(`SELECT id, name, full_path, star_count FROM gitlab.projects.projects WHERE ${hostWhere}`);
  check('projects list returns 3 rows across 2 pages', r.rows && r.rows.length === 3, r.err || `got ${r.rows?.length}`);
  check('snake_case alias columns projected (full_path, star_count)', r.rows && r.rows[0] && r.rows[0].full_path === 'mock-group/project-1' && String(r.rows[0].star_count) === '1', JSON.stringify(r.rows?.[0] || {}).slice(0, 200));
  let calls = log.slice(mark);
  check('page_info traversal made exactly 2 requests', calls.length === 2, `got ${calls.length}`);
  check('second request splices , after: "PROJ_CURSOR_1"', calls.length === 2 && /, after: "PROJ_CURSOR_1"/.test(calls[1].query), calls[1]?.query?.slice(0, 200));
  check('terminated on hasNextPage=false despite non-empty endCursor', calls.length === 2, `got ${calls.length} requests`);
  check('query aliases fields to snake_case on the wire', /full_path: fullPath/.test(calls[0]?.query || ''), calls[0]?.query?.slice(0, 200));
  check('bearer token header sent', calls.every((c) => c.auth === 'Bearer mock-token'), JSON.stringify(calls.map((c) => c.auth)));
  check('wire URL query string cleared by reader', calls.every((c) => c.path === '/api/graphql'), JSON.stringify(calls.map((c) => c.path)));

  // --- project-scoped connection: full_path templating, no optional filters
  mark = log.length;
  r = await runSql(`SELECT iid, title, state, json_extract(author, '$.username') AS author FROM gitlab.issues.project_issues WHERE ${hostWhere} AND full_path = 'mock-group/project-1'`);
  check('project_issues returns 3 rows for full_path', r.rows && r.rows.length === 3, r.err || `got ${r.rows?.length}`);
  check('author nested identity projected', r.rows && r.rows[0] && r.rows.every((row) => row.author === 'mockuser'), JSON.stringify(r.rows?.[0] || {}).slice(0, 200));
  let q = log.slice(mark)[0]?.query || '';
  check('fullPath rendered into wrapper', /project\(fullPath: "mock-group\/project-1"\)/.test(q), q.slice(0, 160));
  check('omitted optional filters absent from wire query', !/state:/.test(q) && !/search:/.test(q) && !/confidential:/.test(q), q.slice(0, 300));

  // --- enum filter: unquoted rendering
  mark = log.length;
  r = await runSql(`SELECT iid, state FROM gitlab.issues.project_issues WHERE ${hostWhere} AND full_path = 'mock-group/project-1' AND state = 'opened'`);
  check('enum filter narrows to 2 rows', r.rows && r.rows.length === 2 && r.rows.every((row) => row.state === 'opened'), r.err || `got ${JSON.stringify(r.rows)}`);
  q = log.slice(mark)[0]?.query || '';
  check('enum filter rendered unquoted (state: opened)', /, state: opened[,)]/.test(q), q.slice(0, 300));

  // --- boolean false filter: rendered on the wire, not dropped
  mark = log.length;
  r = await runSql(`SELECT iid, confidential FROM gitlab.issues.project_issues WHERE ${hostWhere} AND full_path = 'mock-group/project-1' AND confidential = false`);
  q = log.slice(mark)[0]?.query || '';
  check('boolean false filter rendered (confidential: false)', /, confidential: false[,)]/.test(q), q.slice(0, 300));
  check('boolean false filter narrows to 2 rows', r.rows && r.rows.length === 2, r.err || `got ${r.rows?.length}`);

  // --- string filter: quoted rendering
  mark = log.length;
  r = await runSql(`SELECT id, name FROM gitlab.projects.projects WHERE ${hostWhere} AND search = 'needle'`);
  q = log.slice(mark)[0]?.query || '';
  check('string filter rendered quoted (search: "needle")', /, search: "needle"[,)]/.test(q), q.slice(0, 300));

  // --- group-scoped connection whose nodes carry their own full_path
  mark = log.length;
  r = await runSql(`SELECT name, full_path FROM gitlab.groups.group_projects WHERE ${hostWhere} AND full_path = 'mock-group'`);
  q = log.slice(mark)[0]?.query || '';
  check('group_projects wrapper rendered group(fullPath: "mock-group")', /group\(fullPath: "mock-group"\)/.test(q), q.slice(0, 160));
  check('group_projects returns the 2 project rows (scope param does not post-filter the column)', r.rows && r.rows.length === 2 && r.rows[0].full_path === 'mock-group/project-10', r.err || JSON.stringify(r.rows).slice(0, 200));

  // --- singular .get: one row from a single object via $.data.*
  r = await runSql(`SELECT id, username, name, active, json_extract(namespace, '$.full_path') AS ns FROM gitlab.users.current_user WHERE ${hostWhere}`);
  check('current_user get returns exactly 1 row', r.rows && r.rows.length === 1, r.err || `got ${r.rows?.length}`);
  check('current_user columns projected', r.rows && r.rows[0] && r.rows[0].username === 'mockuser' && r.rows[0].ns === 'mockuser', JSON.stringify(r.rows?.[0] || {}).slice(0, 200));

  // --- optional-only-argument .get: argument list emitted only when supplied
  mark = log.length;
  r = await runSql(`SELECT id, username FROM gitlab.users.user WHERE ${hostWhere} AND username = 'someone'`);
  q = log.slice(mark)[0]?.query || '';
  check('user get renders optional argument list (username: "someone")', /user\(, username: "someone"\)|user\(username: "someone"\)/.test(q), q.slice(0, 160));
  check('user get returns the matching row', r.rows && r.rows.length === 1 && r.rows[0].username === 'someone', r.err || JSON.stringify(r.rows).slice(0, 200));

  // --- project-scoped singular .get via $.data.project.*
  mark = log.length;
  r = await runSql(`SELECT iid, status, ref, duration, json_extract(user, '$.username') AS triggered_by FROM gitlab.ci.project_pipeline WHERE ${hostWhere} AND full_path = 'mock-group/project-1' AND iid = '42'`);
  q = log.slice(mark)[0]?.query || '';
  check('project_pipeline get renders iid argument', /pipeline\(, iid: "42"\)/.test(q), q.slice(0, 200));
  check('project_pipeline get returns exactly 1 row with columns', r.rows && r.rows.length === 1 && r.rows[0].status === 'SUCCESS' && r.rows[0].triggered_by === 'mockuser', r.err || JSON.stringify(r.rows).slice(0, 200));

  // --- GraphQL errors array (HTTP 200) surfaces as failure
  r = await runSql(`SELECT id FROM gitlab.projects.projects WHERE ${hostWhere} AND search = 'trigger-error'`);
  const failed = (r.rows === null) || (r.err !== null) || (Array.isArray(r.rows) && r.rows.length === 0);
  check('errors array surfaces as failure (no silent rows)', failed, JSON.stringify(r).slice(0, 200));
} finally {
  server.close();
  rmSync(tmpRoot, { recursive: true, force: true });
}

const failCount = results.filter((x) => !x.pass).length;
console.log(`\n${results.length - failCount}/${results.length} checks passed`);
process.exit(failCount === 0 ? 0 : 1);
