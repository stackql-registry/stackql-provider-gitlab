#!/usr/bin/env node
// Build the resource inventory for the gitlab provider.
//
// Parses the pinned introspection result with graphql-js and walks the
// Query, Project, and Group types. Emits
// provider-dev/config/resource_inventory.csv with one row per candidate
// field: scope, source field, node type, connection or singular, arguments,
// field counts, proposed service/resource/method, estimated complexity, and
// a skip reason where the field is not mappable. Prints counts by scope and
// disposition.
//
// Deterministic: same schema in, same CSV out. Validates everything in
// memory and only writes the CSV at the end.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildClientSchema,
  getNamedType,
  isObjectType,
  isScalarType,
  isEnumType,
  isUnionType,
  isInterfaceType,
  isNonNullType,
  isListType,
} from 'graphql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..', '..');
const schemaFile = path.join(baseDir, 'provider-dev', 'downloaded', 'introspection_result_no_deprecated.json');
const outFile = path.join(baseDir, 'provider-dev', 'config', 'resource_inventory.csv');

const raw = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
const introspection = raw.data ? raw.data : raw;
const schema = buildClientSchema(introspection);

// Nested identity allowlist: one-level object selections carried into
// selection sets when the node type has a field of this name. Kept in sync
// with provider-dev/config/selection_policy.json (task 4 writes that file
// from the same table).
const NESTED_IDENTITY_ALLOWLIST = {
  author: ['id', 'username', 'name'],
  user: ['id', 'username', 'name'],
  namespace: ['id', 'fullPath', 'name'],
  group: ['id', 'fullPath', 'name'],
  project: ['id', 'fullPath', 'name'],
  milestone: ['id', 'title'],
};

// Service proposal rules: first regex match on the snake_case resource name
// wins. The final split is decided in task 4 from this inventory; these are
// mechanical proposals.
const SERVICE_RULES = [
  [/merge_request/, 'merge_requests'],
  [/work_item/, 'work_items'],
  [/issue/, 'issues'],
  [/^(pipeline|job|runner|ci_)/, 'ci'],
  [/(pipeline|jobs$|runner)/, 'ci'],
  [/vulnerab|security/, 'security'],
  [/package|container_repositor/, 'packages'],
  [/snippet/, 'snippets'],
  [/audit_event/, 'audit'],
  [/^(metadata|query_complexity|current_license|echo)/, 'metadata'],
  [/epic/, 'groups'],
  [/^group/, 'groups'],
  [/user/, 'users'],
  [/^current_user/, 'users'],
  [/^(project|fork|star|topic|namespace)/, 'projects'],
  [/(release|environment|deployment|label|milestone|branch|tag|commit|repositor|member)/, 'projects'],
  [/board/, 'boards'],
  [/todo/, 'users'],
];

function snake(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').toLowerCase();
}

function proposeService(resourceName, scope) {
  for (const [re, svc] of SERVICE_RULES) {
    if (re.test(resourceName)) return svc;
  }
  if (scope === 'project') return 'projects';
  if (scope === 'group') return 'groups';
  return 'misc';
}

function typeString(t) {
  return String(t);
}

function argEntry(arg) {
  const required = isNonNullType(arg.type) && arg.defaultValue === undefined;
  return `${arg.name}:${typeString(arg.type)}${required ? ' (required)' : ''}`;
}

function isConnectionType(t) {
  if (!isObjectType(t)) return false;
  if (!t.name.endsWith('Connection')) return false;
  const fields = t.getFields();
  return 'pageInfo' in fields;
}

// A field is selectable as a flat column when its named type is a scalar or
// an enum (lists of scalars/enums included - they project as JSON arrays).
function scalarEnumFields(nodeType) {
  const out = [];
  for (const f of Object.values(nodeType.getFields())) {
    // Fields with required arguments cannot be selected bare.
    if (f.args.some((a) => isNonNullType(a.type) && a.defaultValue === undefined)) continue;
    const named = getNamedType(f.type);
    if (isScalarType(named) || isEnumType(named)) out.push(f.name);
  }
  return out;
}

function nestedAllowlisted(nodeType) {
  const out = [];
  for (const [fieldName, wanted] of Object.entries(NESTED_IDENTITY_ALLOWLIST)) {
    const f = nodeType.getFields()[fieldName];
    if (!f) continue;
    const named = getNamedType(f.type);
    if (!isObjectType(named)) continue;
    if (isListType(isNonNullType(f.type) ? f.type.ofType : f.type)) continue;
    const present = wanted.filter((w) => {
      const sub = named.getFields()[w];
      if (!sub) return false;
      const subNamed = getNamedType(sub.type);
      return isScalarType(subNamed) || isEnumType(subNamed);
    });
    if (present.length > 0) out.push(`${fieldName}{${present.join(' ')}}`);
  }
  return out;
}

// Coarse complexity proxy: one point per selected leaf field plus the
// connection envelope. The build gate is the live queryComplexity check in
// validate_complexity.mjs; this exists to rank resources in the inventory.
function estimateComplexity(scalarCount, nestedSelections, isConnection) {
  const nestedLeaves = nestedSelections.reduce((n, s) => n + s.split(' ').length, 0);
  return scalarCount + nestedLeaves + (isConnection ? 3 : 1);
}

function walkScope(scopeName, hostType) {
  const rows = [];
  for (const field of Object.values(hostType.getFields())) {
    const named = getNamedType(field.type);
    const resourceBase = snake(field.name);
    const scopePrefix = scopeName === 'instance' ? '' : `${scopeName}_`;
    const row = {
      scope: scopeName,
      source_field: field.name,
      node_type: '',
      kind: '',
      args: field.args.map(argEntry).join('; '),
      scalar_enum_field_count: '',
      nested_allowlist: '',
      proposed_service: '',
      proposed_resource: '',
      proposed_method: '',
      est_complexity: '',
      disposition: '',
      skip_reason: '',
    };

    const skip = (reason) => {
      row.disposition = 'skip';
      row.skip_reason = reason;
      rows.push(row);
    };

    if (isConnectionType(named)) {
      row.kind = 'connection';
      const connFields = named.getFields();
      const nodesField = connFields.nodes;
      if (!nodesField) {
        row.node_type = named.name;
        skip('connection_without_nodes_field');
        continue;
      }
      const nodeType = getNamedType(nodesField.type);
      row.node_type = nodeType.name;
      if (isUnionType(nodeType)) { skip('union_typed_nodes'); continue; }
      if (isInterfaceType(nodeType)) { skip('interface_typed_nodes'); continue; }
      if (!isObjectType(nodeType)) { skip('non_object_nodes'); continue; }
      const scalars = scalarEnumFields(nodeType);
      if (scalars.length === 0) { skip('no_scalar_fields_on_node'); continue; }
      const nested = nestedAllowlisted(nodeType);
      row.scalar_enum_field_count = scalars.length;
      row.nested_allowlist = nested.join('; ');
      row.proposed_resource = `${scopePrefix}${resourceBase}`;
      row.proposed_service = proposeService(row.proposed_resource, scopeName);
      row.proposed_method = 'list';
      row.est_complexity = estimateComplexity(scalars.length, nested, true);
      row.disposition = 'map';
      rows.push(row);
      continue;
    }

    // Singular object field
    row.kind = 'singular';
    row.node_type = named.name;
    if (isScalarType(named) || isEnumType(named)) { skip('scalar_or_enum_field'); continue; }
    if (isUnionType(named)) { skip('union_typed_field'); continue; }
    if (isInterfaceType(named)) { skip('interface_typed_field'); continue; }
    if (!isObjectType(named)) { skip('non_object_field'); continue; }
    const outerType = isNonNullType(field.type) ? field.type.ofType : field.type;
    if (isListType(outerType)) { skip('non_relay_list'); continue; }
    const scalars = scalarEnumFields(named);
    if (scalars.length === 0) { skip('no_scalar_fields_on_node'); continue; }
    const nested = nestedAllowlisted(named);
    row.scalar_enum_field_count = scalars.length;
    row.nested_allowlist = nested.join('; ');
    row.proposed_resource = `${scopePrefix}${resourceBase}`;
    row.proposed_service = proposeService(row.proposed_resource, scopeName);
    row.proposed_method = 'get';
    row.est_complexity = estimateComplexity(scalars.length, nested, false);
    row.disposition = 'map';
    rows.push(row);
  }
  return rows;
}

const scopes = [
  ['instance', schema.getType('Query')],
  ['project', schema.getType('Project')],
  ['group', schema.getType('Group')],
];

for (const [name, t] of scopes) {
  if (!isObjectType(t)) {
    console.error(`Type for scope '${name}' not found or not an object type`);
    process.exit(1);
  }
}

const allRows = scopes.flatMap(([name, t]) => walkScope(name, t));

// CSV encoding
function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
const header = [
  'scope', 'source_field', 'node_type', 'kind', 'args',
  'scalar_enum_field_count', 'nested_allowlist',
  'proposed_service', 'proposed_resource', 'proposed_method',
  'est_complexity', 'disposition', 'skip_reason',
];
const csv = [header.join(',')]
  .concat(allRows.map((r) => header.map((h) => csvEscape(r[h])).join(',')))
  .join('\n') + '\n';

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, csv);

// Report
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
