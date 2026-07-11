// Mock GitLab GraphQL endpoint for integration tests.
//
// Serves POST /api/graphql and answers based on the query text, mirroring
// GitLab wire shapes:
//   - projects list: two pages via Relay pageInfo; the final page carries a
//     NON-empty endCursor with hasNextPage=false (Relay-strict), so
//     termination must come from the hasNextPage flag, not cursor absence.
//   - project issues list: asserts fullPath templating; echoes whether enum
//     and string filters appeared in the query.
//   - currentUser: single-object response for the .get archetype.
//   - a query containing 'trigger-error' in a search filter returns an
//     HTTP 200 with a GraphQL errors array (partial-error surfacing test).
//
// Every request is appended to the exported log: { path, query, auth }.

import http from 'node:http';

const PROJECT_NODE = (i) => ({
  id: `gid://gitlab/Project/${i}`,
  name: `project-${i}`,
  fullPath: `mock-group/project-${i}`,
  archived: false,
  starCount: i,
  namespace: { id: 'gid://gitlab/Group/1', fullPath: 'mock-group', name: 'Mock Group' },
});

const ISSUE_NODE = (i, state) => ({
  id: `gid://gitlab/Issue/${i}`,
  iid: String(i),
  title: `issue-${i}`,
  state,
  confidential: false,
  author: { id: 'gid://gitlab/User/1', username: 'mockuser', name: 'Mock User' },
  milestone: null,
});

const CURRENT_USER = {
  id: 'gid://gitlab/User/1',
  username: 'mockuser',
  name: 'Mock User',
  active: true,
  bot: false,
  state: 'active',
  namespace: { id: 'gid://gitlab/Namespaces::UserNamespace/1', fullPath: 'mockuser', name: 'Mock User' },
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
          reply({ data: { currentUser: CURRENT_USER } });
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
          const nodes = stateFiltered
            ? [ISSUE_NODE(1, 'opened')]
            : [ISSUE_NODE(1, 'opened'), ISSUE_NODE(2, 'closed')];
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
        if (/projects\(/.test(query)) {
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
