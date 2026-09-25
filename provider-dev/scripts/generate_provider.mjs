#!/usr/bin/env node
// Generate StackQL service docs for the gitlab provider from the pinned
// GraphQL introspection schema.
//
// Every method is generated from a single resolved field list per resource:
// the GraphQL query text, the x-stackQL-graphQL block, the OpenAPI
// parameters, and the responses.200 schema all come from the same walk
// (lib/schema_walk.mjs), so query and schema cannot drift.
//
// Usage:
//   node generate_provider.mjs                        # full generation
//   node generate_provider.mjs --only projects,issue  # dev subset (no CSV)
//   node generate_provider.mjs --accept-mapping-changes
//
// Validate-and-fail-without-writing: every method is built, every emitted
// query is parsed with graphql-js (with optional arguments both absent and
// present), resource names and path keys are checked for uniqueness, and
// the operation mapping is compared against the checked-in
// provider-dev/config/all_services.csv BEFORE any file is written. A mapping
// row that disappears or whose source field changes fails the build unless
// --accept-mapping-changes is passed (the CSV diff is then the review).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parse as gqlParse,
  isScalarType,
  isEnumType,
  getNamedType,
} from 'graphql';
import * as yaml from 'js-yaml';
import {
  loadSchema,
  loadPolicy,
  loadServiceNames,
  snake,
  sqlName,
  walkAll,
  isRequiredArg,
  containsList,
} from './lib/schema_walk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');

const PROVIDER = 'gitlab';
const VERSION = 'v00.00.00000';
const DEFAULT_HOST = 'gitlab.com';
const HOST_ENV_VAR = 'GITLAB_HOST';
const TOKEN_ENV_VAR = 'GITLAB_TOKEN';
const GRAPHQL_PATH = '/api/graphql';
const REFERENCE_URL = 'https://docs.gitlab.com/api/graphql/reference/';
const PROTOCOL_MARKER = 'x-stackql-protocol';

// ---------------------------------------------------------------------------
// CLI
const argv = process.argv.slice(2);
let only = null;
let acceptMappingChanges = false;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--only') only = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
  else if (argv[i] === '--accept-mapping-changes') acceptMappingChanges = true;
  else {
    console.error(`Unknown argument: ${argv[i]}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Resolve target rows
const schema = loadSchema(baseDir);
const policy = loadPolicy(baseDir);
const serviceNames = loadServiceNames(baseDir);
const pageSize = policy.pageSize;

const mapped = walkAll(schema, policy).filter((r) => r.disposition === 'map');
let targets = mapped;
if (only) {
  const byResource = new Map(mapped.map((r) => [r.proposed_resource, r]));
  targets = only.map((name) => {
    const row = byResource.get(name);
    if (!row) {
      console.error(`Resource '${name}' not found in mapped inventory rows. Aborting; nothing written.`);
      process.exit(1);
    }
    return row;
  });
}

function serviceFor(row) {
  const svc = serviceNames.overrides[row.proposed_resource] || row.proposed_service;
  if (!serviceNames.services.includes(svc)) {
    throw new Error(`Service '${svc}' for resource '${row.proposed_resource}' is not in service_names.json services list (add an override)`);
  }
  return svc;
}

// ---------------------------------------------------------------------------
// Type mapping and argument templating

const GQL_SCALAR_TO_OPENAPI = {
  Int: { type: 'integer' },
  Float: { type: 'number' },
  Boolean: { type: 'boolean' },
};

function openApiTypeFor(gqlTypeName, isEnum, enumValues) {
  if (isEnum) {
    const s = { type: 'string' };
    if (enumValues && enumValues.length > 0) s.enum = enumValues;
    return s;
  }
  return { ...(GQL_SCALAR_TO_OPENAPI[gqlTypeName] || { type: 'string' }) };
}

// GraphQL argument value rendering: Int, Float, Boolean and enum values are
// spliced bare; every other scalar (String, ID, Time, Date, the *ID global
// identifier scalars, ...) is quoted. Enum values arrive from the WHERE
// clause as bare strings and are spliced unquoted, which is the GraphQL
// enum literal form.
const UNQUOTED_GQL_TYPES = new Set(['Int', 'Float', 'Boolean']);
const PAGINATION_ARGS = new Set(['first', 'last', 'after', 'before']);

function argDescriptor(arg) {
  const named = getNamedType(arg.type);
  const isEnum = isEnumType(named);
  return {
    gqlName: arg.name,
    paramName: sqlName(arg.name),
    gqlType: named.name,
    isEnum,
    enumValues: isEnum ? named.getValues().map((v) => v.name) : null,
    quoted: !isEnum && !UNQUOTED_GQL_TYPES.has(named.name),
    required: isRequiredArg(arg),
    description: arg.description || '',
  };
}

function templatedValue(d) {
  return d.quoted ? `"{{ .${d.paramName} }}"` : `{{ .${d.paramName} }}`;
}

// Arguments the WHERE clause can supply: scalar or enum, not list-valued,
// not an input object, not a Relay pagination argument. Required ones become
// required parameters and are always rendered; optional ones are rendered
// only when supplied (conditional inclusion - the engine's Go template sees
// a missing map key as falsy, and an empty string is treated as absent).
function templatableArgs(row) {
  const out = [];
  for (const arg of row.fieldArgs) {
    if (PAGINATION_ARGS.has(arg.name)) continue;
    if (containsList(arg.type)) continue;
    const named = getNamedType(arg.type);
    if (!isScalarType(named) && !isEnumType(named)) continue;
    out.push(argDescriptor(arg));
  }
  // required first, then alphabetical within each group: deterministic
  out.sort((a, b) => (a.required === b.required ? a.paramName.localeCompare(b.paramName) : a.required ? -1 : 1));
  return out;
}

function renderArgs(args, { leadingComma }) {
  let s = '';
  let first = !leadingComma;
  for (const d of args.filter((a) => a.required)) {
    s += `${first ? '' : ', '}${d.gqlName}: ${templatedValue(d)}`;
    first = false;
  }
  for (const d of args.filter((a) => !a.required)) {
    // Commas are insignificant in GraphQL, so a conditional block can
    // always carry its own leading comma without tracking position.
    s += `{{ if .${d.paramName} }}, ${d.gqlName}: ${templatedValue(d)}{{ end }}`;
  }
  return s;
}

function parameterFor(d) {
  return {
    name: d.paramName,
    in: 'query',
    required: d.required,
    ...(d.description ? { description: d.description } : {}),
    schema: openApiTypeFor(d.gqlType, d.isEnum, d.enumValues),
  };
}

// ---------------------------------------------------------------------------
// Selection sets and response schemas from one field list

function aliased(field) {
  return field.column === field.name ? field.name : `${field.column}: ${field.name}`;
}

function selectionSet(row) {
  const parts = row.scalars.map(aliased);
  for (const n of row.nested) {
    const head = n.column === n.fieldName ? n.fieldName : `${n.column}: ${n.fieldName}`;
    parts.push(`${head} { ${n.subfields.map(aliased).join(' ')} }`);
  }
  return parts.join(' ');
}

function nodeSchema(row) {
  const properties = {};
  for (const s of row.scalars) {
    const base = openApiTypeFor(s.gqlType, s.isEnum, s.enumValues);
    if (s.description) base.description = s.description;
    properties[s.column] = s.isList ? { type: 'array', items: base } : base;
  }
  for (const n of row.nested) {
    const sub = {};
    for (const f of n.subfields) sub[f.column] = openApiTypeFor(f.gqlType, f.isEnum, null);
    properties[n.column] = {
      type: 'object',
      description: `${n.typeName} identity (${n.subfields.map((f) => f.column).join(', ')})`,
      properties: sub,
    };
  }
  return { type: 'object', properties };
}

const PAGE_INFO_SCHEMA = {
  type: 'object',
  properties: {
    hasNextPage: { type: 'boolean' },
    endCursor: { type: 'string' },
  },
};

// data.<a>.<b> envelope: wrap leafSchema in nested object schemas so the
// response schema mirrors the query shape segment by segment.
function wrapPath(dottedPath, leafSchema) {
  const segments = dottedPath.split('.');
  let current = leafSchema;
  for (let i = segments.length - 1; i >= 0; i--) {
    current = { type: 'object', properties: { [segments[i]]: current } };
  }
  return current;
}

// ---------------------------------------------------------------------------
// Query text validation: the Go template is rendered two ways (optional
// arguments all absent, optional arguments all present) and both renders
// must parse as GraphQL.

function renderAbsent(query) {
  let s = query;
  // strip innermost conditional blocks until none remain (handles nesting)
  const inner = /\{\{ if [^}]* \}\}(?:(?!\{\{ if )[\s\S])*?\{\{ end \}\}/g;
  let prev;
  do { prev = s; s = s.replace(inner, ''); } while (s !== prev);
  return s.replace(/\{\{ \.cursor \}\}/g, ', after: "abc"').replace(/\{\{ \.[a-z_0-9]+ \}\}/g, 'x');
}

function renderPresent(query) {
  return query
    .replace(/\{\{ if [^}]* \}\}/g, '')
    .replace(/\{\{ end \}\}/g, '')
    .replace(/\{\{ \.cursor \}\}/g, ', after: "abc"')
    .replace(/\{\{ \.[a-z_0-9]+ \}\}/g, 'x');
}

function validateQuery(id, query) {
  for (const [mode, rendered] of [['absent', renderAbsent(query)], ['present', renderPresent(query)]]) {
    try {
      gqlParse(rendered);
    } catch (e) {
      throw new Error(`${id}: rendered query (${mode} optionals) does not parse: ${e.message}\n${rendered}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Method assembly

const SCOPE_WRAPPERS = {
  instance: null,
  project: { field: 'project', param: 'full_path', gqlArg: 'fullPath', description: 'Full path of the project, for example gitlab-org/gitlab' },
  group: { field: 'group', param: 'full_path', gqlArg: 'fullPath', description: 'Full path of the group, for example gitlab-org' },
};

function buildMethod(row) {
  const service = serviceFor(row);
  const resource = row.proposed_resource;
  const method = row.proposed_method; // list | get
  const fieldName = row.source_field;
  const sel = selectionSet(row);
  const wrapper = SCOPE_WRAPPERS[row.scope];
  const args = templatableArgs(row);

  const parameters = [];
  if (wrapper) {
    parameters.push({
      name: wrapper.param,
      in: 'query',
      required: true,
      description: wrapper.description,
      schema: { type: 'string' },
    });
  }
  for (const d of args) {
    if (d.paramName === wrapper?.param) {
      throw new Error(`${resource}: argument '${d.gqlName}' collides with the scope parameter '${wrapper.param}'`);
    }
    parameters.push(parameterFor(d));
  }

  let call;
  if (method === 'list') {
    call = `${fieldName}(first: ${pageSize}{{ .cursor }}${renderArgs(args, { leadingComma: true })})`;
  } else if (args.some((a) => a.required)) {
    call = `${fieldName}(${renderArgs(args, { leadingComma: false })})`;
  } else if (args.length > 0) {
    // Only optional arguments: GraphQL forbids empty parentheses, so the
    // argument list is emitted only when at least one value is supplied.
    const any = args.map((a) => `.${a.paramName}`).join(' ');
    call = `${fieldName}{{ if or ${any} }}(${renderArgs(args, { leadingComma: true })}){{ end }}`;
  } else {
    call = fieldName;
  }

  const body = method === 'list'
    ? `${call} { nodes { ${sel} } pageInfo { hasNextPage endCursor } }`
    : `${call} { ${sel} }`;

  let query;
  let dataPath; // dotted path under $.data to the connection / object
  if (wrapper) {
    query = `query { ${wrapper.field}(${wrapper.gqlArg}: "{{ .${wrapper.param} }}") { ${body} } }`;
    dataPath = `${wrapper.field}.${fieldName}`;
  } else {
    query = `query { ${body} }`;
    dataPath = fieldName;
  }
  const id = `${PROVIDER}.${service}.${resource}.${method}`;
  validateQuery(id, query);

  // Response envelope schema mirrors the query selection exactly.
  const node = nodeSchema(row);
  let responseData;
  let responseSelectionJsonPath;
  let cursor;
  if (method === 'list') {
    const connSchema = {
      type: 'object',
      properties: { nodes: { type: 'array', items: node }, pageInfo: PAGE_INFO_SCHEMA },
    };
    responseData = wrapPath(dataPath, connSchema);
    responseSelectionJsonPath = `$.data.${dataPath}.nodes[*]`;
    cursor = {
      strategy: 'page_info',
      jsonPath: `$.data.${dataPath}.pageInfo.endCursor`,
      terminateOnJsonPath: `$.data.${dataPath}.pageInfo.hasNextPage`,
    };
  } else {
    responseData = wrapPath(dataPath, node);
    // A bare object at the response selection path is not accepted by the
    // reader (rows must be an array), so gets select the single object
    // field via a wildcard on its parent, which the jsonpath library returns
    // as a 1-element array: one row.
    responseSelectionJsonPath = wrapper ? `$.data.${wrapper.field}.*` : '$.data.*';
    // The engine requires cursor.jsonPath for every GraphQL method. This
    // path never resolves, which the default cursor_after strategy treats
    // as end-of-iteration: exactly one page is fetched.
    cursor = { jsonPath: '$.stackql_gql_get_sentinel' };
  }

  const pathKey = `${GRAPHQL_PATH}?resource=${resource}&method=${method}`;
  const summary = row.fieldDescription || `${method} ${resource}`;
  const operation = {
    operationId: `${resource}_${method}`,
    summary,
    description: `${summary} Generated from the GitLab GraphQL schema field ${row.host_type}.${fieldName} (${method === 'list' ? `connection of ${row.node_type} nodes` : row.node_type}).`,
    externalDocs: {
      description: `GitLab GraphQL API reference: ${row.host_type}.${fieldName}`,
      url: `${REFERENCE_URL}#${row.docAnchor}`,
    },
    'x-stackQL-graphQL': {
      id,
      url: `https://${DEFAULT_HOST}${GRAPHQL_PATH}`,
      httpVerb: 'POST',
      responseSelection: { jsonPath: responseSelectionJsonPath },
      cursor,
      query,
    },
    [PROTOCOL_MARKER]: 'graphql',
    parameters,
    responses: {
      200: {
        description: 'GraphQL response envelope',
        content: {
          'application/json': {
            schema: { type: 'object', properties: { data: responseData } },
          },
        },
      },
    },
  };

  // objectKey drives schema navigation (DESCRIBE columns, docgen fields);
  // the row selection itself is responseSelection.jsonPath. The suffix-free
  // dotted form is what both the engine and docgen resolve (the github
  // provider's GraphQL resources use the same shape).
  const objectKey = method === 'list' ? `$.data.${dataPath}.nodes` : `$.data.${dataPath}`;
  return {
    service, resource, method, pathKey, operation, objectKey, row,
    requiredParams: parameters.filter((p) => p.required).map((p) => p.name),
    optionalParams: parameters.filter((p) => !p.required).map((p) => p.name),
    columnCount: Object.keys(node.properties).length,
  };
}

// ---------------------------------------------------------------------------
// Service doc assembly

function jsonPointerEscape(p) {
  return p.replace(/~/g, '~0').replace(/\//g, '~1');
}

function titleCase(s) {
  return s.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function serversBlock() {
  return [
    {
      // The inline {host:[^/]+} regex is consumed by the any-sdk query
      // router (gorilla/mux host template), where the default host
      // variable regex does not span dots - without it, even the literal
      // default gitlab.com fails route resolution. The engine strips the
      // regex before variable substitution, so wire URLs are unaffected.
      url: 'https://{host:[^/]+}',
      variables: {
        host: {
          default: DEFAULT_HOST,
          description: `GitLab host, with an optional port (default gitlab.com). Resolved from the ${HOST_ENV_VAR} environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve.`,
          'x-stackQL-envVar': HOST_ENV_VAR,
        },
      },
    },
  ];
}

function buildServiceDoc(service, methods) {
  const paths = {};
  const resources = {};
  for (const m of methods) {
    paths[m.pathKey] = { post: m.operation };
    if (!resources[m.resource]) {
      resources[m.resource] = {
        id: `${PROVIDER}.${service}.${m.resource}`,
        name: m.resource,
        title: titleCase(m.resource),
        methods: {},
        sqlVerbs: { select: [], insert: [], update: [], delete: [] },
      };
    }
    resources[m.resource].methods[m.method] = {
      operation: { $ref: `#/paths/${jsonPointerEscape(m.pathKey)}/post` },
      response: {
        mediaType: 'application/json',
        openAPIDocKey: '200',
        objectKey: m.objectKey,
      },
      [PROTOCOL_MARKER]: 'graphql',
    };
    resources[m.resource].sqlVerbs.select.push({
      $ref: `#/components/x-stackQL-resources/${m.resource}/methods/${m.method}`,
    });
  }
  return {
    openapi: '3.0.3',
    info: {
      title: `${service} API`,
      description: `${serviceNames.descriptions[service] || `GitLab GraphQL API - ${service}`} Read-only: every method is a GraphQL query mapped to SELECT.`,
      version: VERSION,
    },
    servers: serversBlock(),
    paths,
    components: { 'x-stackQL-resources': resources },
  };
}

function buildProviderDoc(services) {
  const providerServices = {};
  for (const s of [...services].sort()) {
    providerServices[s] = {
      id: `${s}:${VERSION}`,
      name: s,
      preferred: true,
      service: { $ref: `${PROVIDER}/${VERSION}/services/${s}.yaml` },
      title: `${s} API`,
      version: VERSION,
      description: serviceNames.descriptions[s] || `GitLab GraphQL API - ${s}`,
    };
  }
  return {
    id: PROVIDER,
    name: PROVIDER,
    version: VERSION,
    providerServices,
    config: {
      auth: {
        credentialsenvvar: TOKEN_ENV_VAR,
        type: 'bearer',
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Operation mapping (all_services.csv): the durable, checked-in record of
// which schema field backs which service.resource.method. Header matches
// the provider-utils `analyze` output used by the REST-based providers so
// the file reads the same way across the registry.

const CSV_HEADER = [
  'filename', 'path', 'operationId', 'formatted_op_id', 'verb', 'response_object',
  'tags', 'formatted_tags', 'stackql_resource_name', 'stackql_method_name',
  'stackql_verb', 'stackql_object_key', 'op_description',
];

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csvParse(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function mappingRow(m) {
  return {
    filename: `${m.service}.yaml`,
    path: m.pathKey,
    operationId: m.operation.operationId,
    formatted_op_id: m.operation.operationId,
    verb: 'post',
    response_object: m.row.node_type,
    tags: `${m.row.host_type}.${m.row.source_field}`,
    formatted_tags: m.row.scope,
    stackql_resource_name: m.resource,
    stackql_method_name: m.method,
    stackql_verb: 'select',
    stackql_object_key: m.objectKey,
    op_description: m.operation.summary,
  };
}

function checkMappingStability(newRows, csvFile) {
  if (!fs.existsSync(csvFile)) return [];
  const parsed = csvParse(fs.readFileSync(csvFile, 'utf8'));
  const header = parsed[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const existing = new Map();
  for (const r of parsed.slice(1)) {
    if (r.length < header.length) continue;
    existing.set(`${r[idx.stackql_resource_name]}.${r[idx.stackql_method_name]}`, {
      service: r[idx.filename],
      source: r[idx.tags],
      node: r[idx.response_object],
    });
  }
  const current = new Map(newRows.map((r) => [`${r.stackql_resource_name}.${r.stackql_method_name}`, r]));
  const problems = [];
  for (const [key, old] of existing) {
    const now = current.get(key);
    if (!now) { problems.push(`removed: ${key} (was ${old.service} <- ${old.source})`); continue; }
    if (now.filename !== old.service) problems.push(`moved service: ${key} ${old.service} -> ${now.filename}`);
    if (now.tags !== old.source) problems.push(`source changed: ${key} ${old.source} -> ${now.tags}`);
    if (now.response_object !== old.node) problems.push(`node type changed: ${key} ${old.node} -> ${now.response_object}`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Build everything in memory, then validate, then write.

const methods = targets.map(buildMethod);

const pathKeys = new Set();
for (const m of methods) {
  const k = `${m.service}:${m.pathKey}`;
  if (pathKeys.has(k)) throw new Error(`Duplicate path key ${m.pathKey} in service ${m.service}`);
  pathKeys.add(k);
}

const byService = new Map();
for (const m of methods) {
  if (!byService.has(m.service)) byService.set(m.service, []);
  byService.get(m.service).push(m);
}
for (const ms of byService.values()) ms.sort((a, b) => a.pathKey.localeCompare(b.pathKey));

const csvFile = path.join(baseDir, 'provider-dev', 'config', 'all_services.csv');
const mappingRows = methods.map(mappingRow).sort((a, b) => a.filename.localeCompare(b.filename) || a.path.localeCompare(b.path));
if (!only) {
  const problems = checkMappingStability(mappingRows, csvFile);
  if (problems.length > 0) {
    console.error(`Operation mapping changed against ${path.relative(baseDir, csvFile)}:`);
    for (const p of problems) console.error(`  ${p}`);
    if (!acceptMappingChanges) {
      console.error('These are breaking changes for existing queries. Re-run with --accept-mapping-changes to accept them (and review the CSV diff). Nothing written.');
      process.exit(1);
    }
    console.error('Accepted via --accept-mapping-changes.');
  }
}

const outDir = path.join(baseDir, 'provider-dev', 'openapi', 'src', PROVIDER, VERSION);
const servicesDir = path.join(outDir, 'services');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(servicesDir, { recursive: true });

const yamlOpts = { lineWidth: -1, noRefs: true };
for (const [service, ms] of [...byService].sort((a, b) => a[0].localeCompare(b[0]))) {
  const doc = buildServiceDoc(service, ms);
  fs.writeFileSync(path.join(servicesDir, `${service}.yaml`), yaml.dump(doc, yamlOpts));
  console.log(`Wrote services/${service}.yaml (${ms.length} method(s), ${new Set(ms.map((m) => m.resource)).size} resource(s))`);
}

fs.writeFileSync(path.join(outDir, 'provider.yaml'), yaml.dump(buildProviderDoc([...byService.keys()]), yamlOpts));
console.log(`Wrote provider.yaml (${byService.size} service(s))`);

if (!only) {
  const csv = [CSV_HEADER.join(',')]
    .concat(mappingRows.map((r) => CSV_HEADER.map((h) => csvEscape(r[h])).join(',')))
    .join('\n') + '\n';
  fs.writeFileSync(csvFile, csv);
  console.log(`Wrote ${path.relative(baseDir, csvFile)} (${mappingRows.length} operation mapping(s))`);
} else {
  console.log('--only given: all_services.csv not written and mapping stability not checked');
}

const lists = methods.filter((m) => m.method === 'list').length;
console.log(`\n${methods.length} methods (${lists} list, ${methods.length - lists} get) across ${byService.size} services`);
