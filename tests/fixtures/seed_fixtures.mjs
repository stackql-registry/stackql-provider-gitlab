#!/usr/bin/env node
// Seed (or tear down) the gitlab.com UAT fixtures the authenticated smoke
// tier queries: a public group holding a read-only mirror of
// github.com/stackql/stackql, a private smoke project with labels, a
// milestone, issues, a merge request, a tag + release, CI variables, an
// environment and a board, a private subgroup, and a group label.
//
// Idempotent: every object is looked up before it is created, so re-runs
// write nothing that already exists. Uses the REST v4 API (the provider
// itself is GraphQL read-only; creation is out of its scope by design).
//
// Env: GITLAB_TOKEN (api scope), GITLAB_HOST (default gitlab.com),
//      GITLAB_SMOKE_GROUP / GITLAB_SMOKE_PROJECT (override fixtures.json paths)
// Usage: node tests/fixtures/seed_fixtures.mjs [--teardown] [--skip-mirror]
//   --teardown    delete the smoke project and subgroup (never the group or
//                 the mirror - those are deliberate, delete them by hand)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const F = JSON.parse(fs.readFileSync(path.join(here, 'fixtures.json'), 'utf8'));

const token = process.env.GITLAB_TOKEN;
if (!token) { console.error('GITLAB_TOKEN is not set'); process.exit(1); }
const host = process.env.GITLAB_HOST || 'gitlab.com';
const API = `https://${host}/api/v4`;
const groupPath = process.env.GITLAB_SMOKE_GROUP || F.group.path;
let nsPath = groupPath; // reassigned to the personal namespace on fallback
const smokePathFor = () => process.env.GITLAB_SMOKE_PROJECT || `${nsPath}/${F.smokeProject.path}`;
const mirrorPathFor = () => `${nsPath}/${F.mirror.path}`;
const subgroupPath = `${groupPath}/${F.subgroup.path}`;
const teardown = process.argv.includes('--teardown');
const skipMirror = process.argv.includes('--skip-mirror');

const enc = (p) => encodeURIComponent(p);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, route, body, { okStatuses = [] } = {}) {
  const res = await fetch(`${API}${route}`, {
    method,
    headers: { 'PRIVATE-TOKEN': token, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok && !okStatuses.includes(res.status)) {
    throw new Error(`${method} ${route} -> ${res.status}: ${typeof data === 'string' ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300)}`);
  }
  return { status: res.status, data };
}
const get = (route) => api('GET', route, undefined, { okStatuses: [404] });
const post = (route, body) => api('POST', route, body);
const put = (route, body) => api('PUT', route, body);
const del = (route) => api('DELETE', route, undefined, { okStatuses: [404, 202, 204] });

const log = (s) => console.log(`  ${s}`);
const summary = {};

// The namespace that holds the fixtures: the configured group when it exists
// (or can be created), otherwise - gitlab.com refuses top-level group
// creation for some accounts with a bare 403 - the token's personal
// namespace, where projects can still be created. Group-only fixtures
// (subgroup, group label) are skipped in that case and the mirror is
// created under the personal namespace too, so the smoke tier and the
// provider learnings proceed; the group move is a later, manual step.
async function ensureNamespace() {
  let r = await get(`/groups/${enc(groupPath)}`);
  if (r.status === 200) {
    const mine = await get(`/groups/${r.data.id}/members/all`);
    const me = (await get('/user')).data;
    const member = Array.isArray(mine.data) && mine.data.some((m) => m.id === me.id && m.access_level >= 40);
    if (member) { log(`group ${groupPath} exists (id ${r.data.id})`); summary.group = r.data.web_url; return { kind: 'group', ns: r.data }; }
    log(`group ${groupPath} exists but ${me.username} is not a maintainer/owner of it - falling back to the personal namespace`);
  } else {
    const g = F.group;
    try {
      r = await post('/groups', { name: g.name, path: groupPath, visibility: g.visibility, description: g.description, request_access_enabled: false, project_creation_level: 'maintainer' });
      log(`created group ${groupPath} (id ${r.data.id})`);
      summary.group = r.data.web_url;
      return { kind: 'group', ns: r.data };
    } catch (e) {
      log(`cannot create group ${groupPath} (${e.message.slice(0, 80)}) - falling back to the personal namespace`);
    }
  }
  const me = (await get('/user')).data;
  // /user reports namespace_id as null on gitlab.com; the namespaces API
  // resolves the personal namespace by its path (the username)
  const ns = (await get(`/namespaces/${enc(me.username)}`)).data;
  log(`using personal namespace ${ns.full_path} (id ${ns.id}); group-only fixtures skipped`);
  summary.namespace = `https://${host}/${ns.full_path}`;
  return { kind: 'user', ns };
}

async function ensureSubgroup(group) {
  let r = await get(`/groups/${enc(subgroupPath)}`);
  if (r.status === 200) { log(`subgroup ${subgroupPath} exists`); return r.data; }
  r = await post('/groups', { name: F.subgroup.name, path: F.subgroup.path, parent_id: group.id, visibility: F.subgroup.visibility, description: F.subgroup.description });
  log(`created subgroup ${subgroupPath}`);
  return r.data;
}

async function ensureGroupLabel(group) {
  const r = await get(`/groups/${group.id}/labels?search=${enc(F.groupLabel.name)}`);
  if (r.status === 200 && r.data.some((l) => l.name === F.groupLabel.name)) { log(`group label ${F.groupLabel.name} exists`); return; }
  await post(`/groups/${group.id}/labels`, { name: F.groupLabel.name, color: F.groupLabel.color, description: F.groupLabel.description });
  log(`created group label ${F.groupLabel.name}`);
}

async function ensureMirror(group) {
  const mirrorPath = mirrorPathFor();
  let r = await get(`/projects/${enc(mirrorPath)}`);
  if (r.status === 200) {
    log(`mirror ${mirrorPath} exists (import_status ${r.data.import_status || 'n/a'})`);
    summary.mirror = r.data.web_url;
    return r.data;
  }
  const m = F.mirror;
  const disabled = Object.fromEntries(m.disableFeatures.map((f) => [`${f}_access_level`, 'disabled']));
  // Pull mirroring (mirror: true) is a Premium feature on gitlab.com; the
  // free tier gets a one-time repository import from the URL. Try the
  // mirror first and fall back to the plain import.
  const base = { name: m.name, path: m.path, namespace_id: group.id, visibility: m.visibility, description: m.description, import_url: m.importUrl, ...disabled };
  try {
    r = await post('/projects', { ...base, mirror: true });
    // gitlab.com accepts the flag and ignores it on the free tier (the
    // created project reports mirror: null): a one-time import, re-run
    // by deleting the project and seeding again
    log(`created ${mirrorPath} (pull mirroring ${r.data.mirror ? 'enabled' : 'not available on this tier - one-time import'})`);
  } catch (e) {
    log(`pull mirroring unavailable (${e.message.slice(0, 120)}); creating a one-time import instead`);
    r = await post('/projects', base);
    log(`created ${mirrorPath} as a one-time import of ${m.importUrl}`);
  }
  summary.mirror = r.data.web_url;
  return r.data;
}

async function waitForImport(project, label) {
  for (let i = 0; i < 60; i++) {
    const r = await get(`/projects/${project.id}`);
    const st = r.data.import_status;
    if (!st || st === 'finished' || st === 'none') { log(`${label}: import ${st || 'complete'}`); return; }
    if (st === 'failed') { log(`${label}: import FAILED: ${r.data.import_error || ''}`); return; }
    await sleep(5000);
  }
  log(`${label}: import still running after 5 minutes; continuing`);
}

async function ensureSmokeProject(group) {
  const smokePath = smokePathFor();
  let r = await get(`/projects/${enc(smokePath)}`);
  if (r.status === 200) { log(`smoke project ${smokePath} exists (id ${r.data.id})`); summary.smokeProject = r.data.web_url; return r.data; }
  const p = F.smokeProject;
  r = await post('/projects', { name: p.name, path: smokePath.split('/').pop(), namespace_id: group.id, visibility: p.visibility, description: p.description, initialize_with_readme: false, default_branch: p.defaultBranch });
  log(`created smoke project ${smokePath} (id ${r.data.id})`);
  summary.smokeProject = r.data.web_url;
  return r.data;
}

async function ensureFile(project, branch, filePath, content, message, { startBranch } = {}) {
  const r = await get(`/projects/${project.id}/repository/files/${enc(filePath)}?ref=${enc(branch)}`);
  if (r.status === 200) { log(`file ${filePath}@${branch} exists`); return; }
  const body = { branch, content, commit_message: message, ...(startBranch ? { start_branch: startBranch } : {}) };
  await post(`/projects/${project.id}/repository/files/${enc(filePath)}`, body);
  log(`committed ${filePath}@${branch}`);
}

async function ensureBranch(project, name, ref) {
  const r = await get(`/projects/${project.id}/repository/branches/${enc(name)}`);
  if (r.status === 200) { log(`branch ${name} exists`); return; }
  await post(`/projects/${project.id}/repository/branches`, { branch: name, ref });
  log(`created branch ${name} from ${ref}`);
}

async function ensureLabels(project) {
  const existing = (await get(`/projects/${project.id}/labels?per_page=100`)).data || [];
  for (const l of F.smokeProject.labels) {
    if (existing.some((x) => x.name === l.name)) { log(`label ${l.name} exists`); continue; }
    await post(`/projects/${project.id}/labels`, { name: l.name, color: l.color, description: l.description });
    log(`created label ${l.name}`);
  }
}

async function ensureMilestone(project) {
  const m = F.smokeProject.milestone;
  const existing = (await get(`/projects/${project.id}/milestones?title=${enc(m.title)}`)).data || [];
  if (existing.length) { log(`milestone ${m.title} exists`); return existing[0]; }
  const r = await post(`/projects/${project.id}/milestones`, { title: m.title, description: m.description });
  log(`created milestone ${m.title}`);
  return r.data;
}

async function ensureIssues(project, milestone) {
  const existing = (await get(`/projects/${project.id}/issues?per_page=100&state=all`)).data || [];
  for (const i of F.smokeProject.issues) {
    let issue = existing.find((x) => x.title === i.title);
    if (!issue) {
      const body = { title: i.title, description: i.description, labels: i.labels };
      if (i.weight) body.weight = i.weight;
      if (i.milestone) body.milestone_id = milestone.id;
      issue = (await post(`/projects/${project.id}/issues`, body)).data;
      log(`created issue #${issue.iid} ${i.title}`);
    } else log(`issue #${issue.iid} ${i.title} exists`);
    if (i.state === 'closed' && issue.state !== 'closed') {
      await put(`/projects/${project.id}/issues/${issue.iid}`, { state_event: 'close' });
      log(`closed issue #${issue.iid}`);
    }
  }
}

async function ensureMergeRequest(project) {
  const p = F.smokeProject;
  const existing = (await get(`/projects/${project.id}/merge_requests?state=all&source_branch=${enc(p.featureBranch)}`)).data || [];
  if (existing.length) { log(`merge request !${existing[0].iid} exists (${existing[0].state})`); return; }
  const r = await post(`/projects/${project.id}/merge_requests`, { source_branch: p.featureBranch, target_branch: p.defaultBranch, title: p.mergeRequest.title, description: p.mergeRequest.description, labels: p.mergeRequest.labels });
  log(`created merge request !${r.data.iid}`);
}

async function ensureRelease(project) {
  const p = F.smokeProject;
  let r = await get(`/projects/${project.id}/repository/tags/${enc(p.tag)}`);
  if (r.status !== 200) {
    await post(`/projects/${project.id}/repository/tags`, { tag_name: p.tag, ref: p.defaultBranch, message: 'smoke fixture tag' });
    log(`created tag ${p.tag}`);
  } else log(`tag ${p.tag} exists`);
  r = await get(`/projects/${project.id}/releases/${enc(p.tag)}`);
  if (r.status === 200) { log(`release ${p.tag} exists`); return; }
  await post(`/projects/${project.id}/releases`, { tag_name: p.tag, name: p.release.name, description: p.release.description });
  log(`created release ${p.tag}`);
}

async function ensureCiVariables(project) {
  const existing = (await get(`/projects/${project.id}/variables`)).data || [];
  for (const v of F.smokeProject.ciVariables) {
    if (existing.some((x) => x.key === v.key)) { log(`CI variable ${v.key} exists`); continue; }
    await post(`/projects/${project.id}/variables`, { key: v.key, value: v.value, masked: v.masked, protected: v.protected });
    log(`created CI variable ${v.key}${v.masked ? ' (masked)' : ''}`);
  }
}

async function ensureEnvironment(project) {
  const e = F.smokeProject.environment;
  const existing = (await get(`/projects/${project.id}/environments?name=${enc(e.name)}`)).data || [];
  if (existing.length) { log(`environment ${e.name} exists`); return; }
  await post(`/projects/${project.id}/environments`, { name: e.name, external_url: e.externalUrl, tier: e.tier });
  log(`created environment ${e.name}`);
}

async function ensureBoard(project) {
  const b = F.smokeProject.board;
  const existing = (await get(`/projects/${project.id}/boards`)).data || [];
  if (existing.some((x) => x.name === b.name)) { log(`board ${b.name} exists`); return; }
  await post(`/projects/${project.id}/boards`, { name: b.name });
  log(`created board ${b.name}`);
}

async function main() {
  console.log(`gitlab fixtures on ${host}: group ${groupPath}${teardown ? ' (TEARDOWN)' : ''}`);
  if (teardown) {
    const { kind, ns } = await ensureNamespace();
    if (kind === 'user') nsPath = ns.full_path;
    const smokePath = smokePathFor();
    const r = await get(`/projects/${enc(smokePath)}`);
    if (r.status === 200) { await del(`/projects/${r.data.id}`); log(`deleted smoke project ${smokePath}`); } else log(`smoke project ${smokePath} absent`);
    const s = await get(`/groups/${enc(subgroupPath)}`);
    if (s.status === 200) { await del(`/groups/${s.data.id}`); log(`deleted subgroup ${subgroupPath}`); } else log(`subgroup ${subgroupPath} absent`);
    log(`group ${groupPath} and mirror ${mirrorPathFor()} are left in place by design`);
    return;
  }
  const { kind, ns } = await ensureNamespace();
  if (kind === 'user') nsPath = ns.full_path;
  if (kind === 'group') {
    await ensureSubgroup(ns);
    await ensureGroupLabel(ns);
  }
  if (!skipMirror) {
    const mirror = await ensureMirror(ns);
    await waitForImport(mirror, `mirror ${mirrorPathFor()}`);
  }
  const project = await ensureSmokeProject(ns);
  const p = F.smokeProject;
  await ensureFile(project, p.defaultBranch, 'README.md', `# ${p.name}\n\nFixture project for the stackql gitlab provider smoke suite. Everything here is synthetic.\n`, 'smoke: add README');
  await ensureFile(project, p.defaultBranch, '.gitlab-ci.yml', 'smoke-job:\n  script:\n    - echo "smoke fixture pipeline"\n', 'smoke: add pipeline definition');
  await ensureBranch(project, p.featureBranch, p.defaultBranch);
  await ensureFile(project, p.featureBranch, 'docs/feature.md', '# smoke feature\n\nA change on the feature branch so the merge request has a diff.\n', 'smoke: feature branch change');
  await ensureLabels(project);
  const milestone = await ensureMilestone(project);
  await ensureIssues(project, milestone);
  await ensureMergeRequest(project);
  await ensureRelease(project);
  await ensureCiVariables(project);
  await ensureEnvironment(project);
  await ensureBoard(project);
  console.log('\nfixtures ready:');
  for (const [k, v] of Object.entries(summary)) console.log(`  ${k}: ${v}`);
  console.log(`  smoke tier env: GITLAB_SMOKE_GROUP=${nsPath} GITLAB_SMOKE_PROJECT=${smokePathFor()}`);
}

main().catch((e) => { console.error(`seed failed: ${e.message}`); process.exit(1); });
