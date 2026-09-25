// Mock GitLab GraphQL endpoint for integration tests.
//
// Serves POST /api/graphql and answers based on the query text, mirroring
// GitLab wire shapes. Response keys are the ALIASES the generated queries
// request (snake_case), exactly as a GraphQL server echoes them:
//   - projects list: two pages via Relay pageInfo; the final page carries a
//     NON-empty endCursor with hasNextPage=false (Relay-strict), so
//     termination must come from the hasNextPage flag, not cursor absence.
//   - project issues list: asserts fullPath templating; echoes whether enum,
//     string and boolean filters appeared in the query.
//   - group projects list: a group-scoped connection whose nodes carry
//     their own full_path column (the scope parameter / column overlap case).
//   - currentUser and user: single-object responses for the instance .get
//     archetypes (user echoes the username argument it received).
//   - project pipeline: a project-scoped single-object .get.
//   - a query containing 'trigger-error' in a search filter returns an
//     HTTP 200 with a GraphQL errors array (partial-error surfacing test).
//
// Every request is appended to the exported log: { path, query, auth }.

import http from 'node:http';

const PROJECT_NODE = (i, group = 'mock-group') => ({
  id: `gid://gitlab/Project/${i}`,
  name: `project-${i}`,
  full_path: `${group}/project-${i}`,
  archived: false,
  star_count: i,
  namespace: { id: 'gid://gitlab/Group/1', full_path: group, name: 'Mock Group' },
});

const ISSUE_NODE = (i, state, confidential = false) => ({
  id: `gid://gitlab/Issue/${i}`,
  iid: String(i),
  title: `issue-${i}`,
  state,
  confidential,
  created_at: `2026-01-0${i}T00:00:00Z`,
  author: { id: 'gid://gitlab/User/1', username: 'mockuser', name: 'Mock User' },
  milestone: null,
});

const USER = (username) => ({
  id: 'gid://gitlab/User/1',
  username,
  name: 'Mock User',
  active: true,
  bot: false,
  state: 'active',
  namespace: { id: 'gid://gitlab/Namespaces::UserNamespace/1', full_path: username, name: 'Mock User' },
});

const PIPELINE = {
  id: 'gid://gitlab/Ci::Pipeline/42',
  iid: '42',
  status: 'SUCCESS',
  ref: 'main',
  sha: 'abc123',
  duration: 61,
  created_at: '2026-01-01T00:00:00Z',
  user: { id: 'gid://gitlab/User/1', username: 'mockuser', name: 'Mock User' },
};

export function startMockServer() {
  const log = [];
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (d) => { body += d; });
      req.on('end', () => {
        let query = '';
        try { query = JSON.parse(body).query || ''; } catch { /* fallthrough */ }
        log.push({ path: req.url, query, auth: req.headers.authorization || '' });
        const reply = (obj) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(obj));
        };
        if (req.method !== 'POST' || !req.url.startsWith('/api/graphql')) {
          res.writeHead(404);
          res.end('not found');
          return;
        }
        if (/trigger-error/.test(query)) {
          reply({ errors: [{ message: 'mock GraphQL failure', path: ['projects'] }], data: null });
          return;
        }
        if (/currentUser/.test(query)) {
          reply({ data: { currentUser: USER('mockuser') } });
          return;
        }
        if (/^query \{ user/.test(query)) {
          const m = query.match(/username: "([^"]*)"/);
          reply({ data: { user: m ? USER(m[1]) : null } });
          return;
        }
        if (/project\(fullPath:/.test(query) && /pipeline[({ ]/.test(query) && !/pipelines\(/.test(query)) {
          reply({ data: { project: { pipeline: PIPELINE } } });
          return;
        }
        if (/project\(fullPath:/.test(query) && /issues\(/.test(query)) {
          const m = query.match(/project\(fullPath: "([^"]*)"\)/);
          const fullPath = m ? m[1] : '';
          if (fullPath !== 'mock-group/project-1') {
            reply({ data: { project: null } });
            return;
          }
          const stateFiltered = /state: opened/.test(query);
          const confidentialFalse = /confidential: false/.test(query);
          let nodes = [ISSUE_NODE(1, 'opened'), ISSUE_NODE(2, 'closed'), ISSUE_NODE(3, 'opened', true)];
          if (stateFiltered) nodes = nodes.filter((n) => n.state === 'opened');
          if (confidentialFalse) nodes = nodes.filter((n) => !n.confidential);
          reply({
            data: {
              project: {
                issues: {
                  nodes,
                  pageInfo: { hasNextPage: false, endCursor: 'ISSUE_CURSOR_END' },
                },
              },
            },
          });
          return;
        }
        if (/group\(fullPath:/.test(query) && /projects\(/.test(query)) {
          const m = query.match(/group\(fullPath: "([^"]*)"\)/);
          const group = m ? m[1] : '';
          reply({
            data: {
              group: {
                projects: {
                  nodes: [PROJECT_NODE(10, group), PROJECT_NODE(11, group)],
                  pageInfo: { hasNextPage: false, endCursor: 'GP_CURSOR_END' },
                },
              },
            },
          });
          return;
        }
        if (/^query \{ projects\(/.test(query)) {
          const isPage2 = /after: "PROJ_CURSOR_1"/.test(query);
          if (!isPage2) {
            reply({
              data: {
                projects: {
                  nodes: [PROJECT_NODE(1), PROJECT_NODE(2)],
                  pageInfo: { hasNextPage: true, endCursor: 'PROJ_CURSOR_1' },
                },
              },
            });
          } else {
            reply({
              data: {
                projects: {
                  nodes: [PROJECT_NODE(3)],
                  // Relay-strict: non-empty endCursor on the final page.
                  pageInfo: { hasNextPage: false, endCursor: 'PROJ_CURSOR_2' },
                },
              },
            });
          }
          return;
        }
        reply({ errors: [{ message: `mock server: unrecognized query: ${query.slice(0, 120)}` }] });
      });
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port, log });
    });
  });
}
