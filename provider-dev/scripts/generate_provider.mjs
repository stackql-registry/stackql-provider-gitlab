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
//   node generate_provider.mjs --only projects,project_issues,current_user
//
// --only is required in phase 1: full generation is gated until the pilot
// resources are proven. Validates everything (including parsing each emitted
// query with graphql-js) before writing any file.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parse as gqlParse,
  isListType,
  isNonNullType,
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
  walkAll,
} from './lib/schema_walk.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');

const PROVIDER = 'gitlab';
const VERSION = 'v00.00.00000';
const DEFAULT_HOST = 'gitlab.com';
const GRAPHQL_PATH = '/api/graphql';

// ---------------------------------------------------------------------------
// CLI
const argv = process.argv.slice(2);
let only = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--only') only = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
}
if (!only || only.length === 0) {
  console.error('Full generation is gated in phase 1. Pass --only <resource,resource,...> (proposed_resource names from the inventory).');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Resolve target rows
const schema = loadSchema(baseDir);
const policy = loadPolicy(baseDir);
const serviceNames = loadServiceNames(baseDir);
const pageSize = policy.pageSize;

const rows = walkAll(schema, policy).filter((r) => r.disposition === 'map');
const byResource = new Map(rows.map((r) => [r.proposed_resource, r]));

const targets = [];
for (const name of only) {
  const row = byResource.get(name);
  if (!row) {
    console.error(`Resource '${name}' not found in mapped inventory rows. Aborting; nothing written.`);
    process.exit(1);
  }
  targets.push(row);
}

function serviceFor(row) {
  const svc = serviceNames.overrides[row.proposed_resource] || row.proposed_service;
  if (!serviceNames.services.includes(svc)) {
    throw new Error(`Service '${svc}' for resource '${row.proposed_resource}' is not in service_names.json services list`);
  }
  return svc;
}

// ---------------------------------------------------------------------------
// Type mapping and argument templating

const GQL_SCALAR_TO_OPENAPI = {
  Int: { type: 'integer' },
  Float: { type: 'number' },
  Boolean: { type: 'boolean' },
  BigInt: { type: 'string' },
  JSON: { type: 'object' },
};

function openApiTypeForScalar(gqlTypeName, isEnum, enumValues) {
  if (isEnum) {
    const s = { type: 'string' };
    if (enumValues && enumValues.length > 0) s.enum = enumValues;
    return s;
  }
  return { ...(GQL_SCALAR_TO_OPENAPI[gqlTypeName] || { type: 'string' }) };
}

function containsList(type) {
  if (isListType(type)) return true;
  if (isNonNullType(type)) return containsList(type.ofType);
  return false;
}

function isRequiredArg(arg) {
  return isNonNullType(arg.type) && arg.defaultValue === undefined;
}

// GraphQL argument value rendering: strings and string-like scalars (ID,
// Time, Date, ...) are quoted; Int, Float, Boolean, and enums are not.
// Enum values arrive from the WHERE clause as bare strings and are spliced
// unquoted, which is the GraphQL enum literal form.
const UNQUOTED_GQL_TYPES = new Set(['Int', 'Float', 'Boolean']);

const PAGINATION_ARGS = new Set(['first', 'last', 'after', 'before']);

function filterArgsFor(row) {
  const out = [];
  for (const arg of row.fieldArgs) {
    if (PAGINATION_ARGS.has(arg.name)) continue;
    if (isRequiredArg(arg)) continue; // required args are handled by scope wrappers, not filters
    if (containsList(arg.type)) continue; // list-valued args deferred in v1
    const named = getNamedType(arg.type);
    if (!isScalarType(named) && !isEnumType(named)) continue; // input objects deferred in v1
    const isEnum = isEnumType(named);
    out.push({
      gqlName: arg.name,
      paramName: snake(arg.name),
      gqlType: named.name,
      isEnum,
      enumValues: isEnum ? named.getValues().map((v) => v.name) : null,
      quoted: !isEnum && !UNQUOTED_GQL_TYPES.has(named.name),
      description: arg.description || '',
    });
  }
  out.sort((a, b) => a.paramName.localeCompare(b.paramName));
  return out;
}

function filterTemplate(filters) {
  // Conditional inclusion: absent optional WHERE params render nothing.
  return filters
    .map((f) => {
      const value = f.quoted ? `"{{ .${f.paramName} }}"` : `{{ .${f.paramName} }}`;
      return `{{ if .${f.paramName} }}, ${f.gqlName}: ${value}{{ end }}`;
    })
    .join('');
}

// ---------------------------------------------------------------------------
// Selection sets and response schemas from one field list

function selectionSet(row) {
  const parts = row.scalars.map((s) => s.name);
  for (const n of row.nested) {
    parts.push(`${n.fieldName} { ${n.subfields.map((s) => s.name).join(' ')} }`);
  }
  return parts.join(' ');
}

function enumValuesOf(row, scalarField) {
  const f = row.nodeType.getFields()[scalarField.name];
  if (!f) return null;
  const named = getNamedType(f.type);
  return isEnumType(named) ? named.getValues().map((v) => v.name) : null;
}

function nodeSchema(row) {
  const properties = {};
  for (const s of row.scalars) {
    const base = openApiTypeForScalar(s.gqlType, s.isEnum, s.isEnum ? enumValuesOf(row, s) : null);
    if (s.description) base.description = s.description;
    properties[s.name] = s.isList ? { type: 'array', items: base } : base;
  }
  for (const n of row.nested) {
    const sub = {};
    for (const f of n.subfields) {
      sub[f.name] = openApiTypeForScalar(f.gqlType, f.isEnum, null);
    }
    properties[n.fieldName] = { type: 'object', properties: sub };
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
// Method assembly

function buildMethod(row) {
  const service = serviceFor(row);
  const resource = row.proposed_resource;
  const method = row.proposed_method; // list | get
  const fieldName = row.source_field;
  const sel = selectionSet(row);

  const scopeWrapper = {
    instance: null,
    project: { field: 'project', param: 'full_path', gqlArg: 'fullPath', description: 'The full path of the project, e.g. gitlab-org/gitlab' },
    group: { field: 'group', param: 'full_path', gqlArg: 'fullPath', description: 'The full path of the group, e.g. gitlab-org' },
  }[row.scope];

  const parameters = [];
  if (scopeWrapper) {
    parameters.push({
      name: scopeWrapper.param,
      in: 'query',
      required: true,
      description: scopeWrapper.description,
      schema: { type: 'string' },
    });
  }

  let query;
  let dataPath; // dotted path under $.data to the connection / object
  if (method === 'list') {
    const filters = filterArgsFor(row);
    const conn = `${fieldName}(first: ${pageSize}{{ .cursor }}${filterTemplate(filters)}) { nodes { ${sel} } pageInfo { hasNextPage endCursor } }`;
    if (scopeWrapper) {
      query = `query { ${scopeWrapper.field}(${scopeWrapper.gqlArg}: "{{ .${scopeWrapper.param} }}") { ${conn} } }`;
      dataPath = `${scopeWrapper.field}.${fieldName}`;
    } else {
      query = `query { ${conn} }`;
      dataPath = fieldName;
    }
    for (const f of filters) {
      parameters.push({
        name: f.paramName,
        in: 'query',
        required: false,
        ...(f.description ? { description: f.description } : {}),
        schema: openApiTypeForScalar(f.gqlType, f.isEnum, f.enumValues),
      });
    }
  } else {
    // Singular get. Required args become required parameters (quoted string
    // rendering; all current singular identity args are string-like).
    const requiredArgs = row.fieldArgs.filter(isRequiredArg);
    const callArgs = [];
    for (const a of requiredArgs) {
      const paramName = snake(a.name);
      callArgs.push(`${a.name}: "{{ .${paramName} }}"`);
      parameters.push({
        name: paramName,
        in: 'query',
        required: true,
        ...(a.description ? { description: a.description } : {}),
        schema: { type: 'string' },
      });
    }
    const call = callArgs.length > 0 ? `(${callArgs.join(', ')})` : '';
    if (scopeWrapper) {
      query = `query { ${scopeWrapper.field}(${scopeWrapper.gqlArg}: "{{ .${scopeWrapper.param} }}") { ${fieldName}${call} { ${sel} } } }`;
      dataPath = `${scopeWrapper.field}.${fieldName}`;
    } else {
      query = `query { ${fieldName}${call} { ${sel} } }`;
      dataPath = fieldName;
    }
  }

  // Validate the query text parses as GraphQL once template constructs are
  // resolved with representative values.
  const rendered = query
    .replace(/\{\{ if \.[a-z_0-9]+ \}\}.*?\{\{ end \}\}/g, '')
    .replace(/\{\{ \.cursor \}\}/g, ', after: "abc"')
    .replace(/\{\{ \.[a-z_0-9]+ \}\}/g, 'x');
  gqlParse(rendered); // throws on invalid

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
    // reader (rows must be an array), so gets select the single root field
    // via a wildcard, which the jsonpath library returns as a 1-element
    // array: one row.
    responseSelectionJsonPath = '$.data.*';
    // The engine requires cursor.jsonPath for every GraphQL method. This
    // path never resolves, which the default cursor_after strategy treats
    // as end-of-iteration: exactly one page is fetched.
    cursor = { jsonPath: '$.stackql_gql_get_sentinel' };
  }

  const pathKey = `${GRAPHQL_PATH}?resource=${resource}&method=${method}`;
  const operation = {
    operationId: `${resource}_${method}`,
    summary: row.fieldDescription || `${method} ${resource}`,
    'x-stackQL-graphQL': {
      id: `${PROVIDER}.${service}.${resource}.${method}`,
      url: `https://${DEFAULT_HOST}${GRAPHQL_PATH}`,
      httpVerb: 'POST',
      responseSelection: { jsonPath: responseSelectionJsonPath },
      cursor,
      query,
    },
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

  const objectKey = method === 'list' ? responseSelectionJsonPath : `$.data.${dataPath}`;
  return { service, resource, method, pathKey, operation, objectKey };
}

// ---------------------------------------------------------------------------
// Service doc assembly

function jsonPointerEscape(p) {
  return p.replace(/~/g, '~0').replace(/\//g, '~1');
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
        title: m.resource.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
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
    };
    resources[m.resource].sqlVerbs.select.push({
      $ref: `#/components/x-stackQL-resources/${m.resource}/methods/${m.method}`,
    });
  }
  return {
    openapi: '3.0.3',
    info: {
      title: `${service} API`,
      description: `GitLab GraphQL API - ${service} (read-only)`,
      version: VERSION,
    },
    servers: [
      {
        // The inline {host:[^/]+} regex is consumed by the any-sdk query
        // router (gorilla/mux host template), where the default host
        // variable regex does not span dots - without it, even the literal
        // default gitlab.com fails route resolution. The armoury strips the
        // regex before variable substitution, so wire URLs are unaffected.
        url: 'https://{host:[^/]+}',
        variables: { host: { default: DEFAULT_HOST } },
      },
    ],
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
      description: `GitLab GraphQL API - ${s} (read-only)`,
    };
  }
  return {
    id: PROVIDER,
    name: PROVIDER,
    version: VERSION,
    providerServices,
    config: {
      auth: {
        credentialsenvvar: 'GITLAB_TOKEN',
        type: 'bearer',
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Emit (validate-first: methods are all built - and queries parsed - before
// any file is written)

const methods = targets.map(buildMethod);

const byService = new Map();
for (const m of methods) {
  if (!byService.has(m.service)) byService.set(m.service, []);
  byService.get(m.service).push(m);
}

const outDir = path.join(baseDir, 'provider-dev', 'openapi', 'src', PROVIDER, VERSION);
const servicesDir = path.join(outDir, 'services');
fs.mkdirSync(servicesDir, { recursive: true });

const yamlOpts = { lineWidth: -1, noRefs: true };
for (const [service, ms] of byService) {
  const doc = buildServiceDoc(service, ms);
  fs.writeFileSync(path.join(servicesDir, `${service}.yaml`), yaml.dump(doc, yamlOpts));
  console.log(`Wrote services/${service}.yaml (${ms.length} method(s): ${ms.map((m) => `${m.resource}.${m.method}`).join(', ')})`);
}

const providerDoc = buildProviderDoc([...byService.keys()]);
fs.writeFileSync(path.join(outDir, 'provider.yaml'), yaml.dump(providerDoc, yamlOpts));
console.log(`Wrote provider.yaml (${byService.size} service(s))`);
