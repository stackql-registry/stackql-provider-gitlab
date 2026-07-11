// Shared schema-walking and selection-set resolution for the gitlab provider
// build. build_inventory.mjs and generate_provider.mjs both consume this
// module so the inventory, the generated query text, and the generated
// response schemas all derive from one code path.

import fs from 'node:fs';
import path from 'node:path';
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

export function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function loadSchema(baseDir) {
  const schemaFile = path.join(baseDir, 'provider-dev', 'downloaded', 'introspection_result_no_deprecated.json');
  const raw = loadJson(schemaFile);
  return buildClientSchema(raw.data ? raw.data : raw);
}

export function loadPolicy(baseDir) {
  return loadJson(path.join(baseDir, 'provider-dev', 'config', 'selection_policy.json'));
}

export function loadServiceNames(baseDir) {
  return loadJson(path.join(baseDir, 'provider-dev', 'config', 'service_names.json'));
}

export function snake(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

// Service proposal rules: first regex match on the snake_case resource name
// wins. Overrides in service_names.json take precedence over these proposals.
export const SERVICE_RULES = [
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

export function proposeService(resourceName, scope) {
  for (const [re, svc] of SERVICE_RULES) {
    if (re.test(resourceName)) return svc;
  }
  if (scope === 'project') return 'projects';
  if (scope === 'group') return 'groups';
  return 'misc';
}

export function isConnectionType(t) {
  if (!isObjectType(t)) return false;
  if (!t.name.endsWith('Connection')) return false;
  return 'pageInfo' in t.getFields();
}

export function hasRequiredArgs(field) {
  return field.args.some((a) => isNonNullType(a.type) && a.defaultValue === undefined);
}

// Every selectable flat field on the node type: named type is a scalar or an
// enum (lists of scalars/enums included - they project as JSON arrays), and
// the field declares no required arguments.
export function scalarEnumFields(nodeType) {
  const out = [];
  for (const f of Object.values(nodeType.getFields())) {
    if (hasRequiredArgs(f)) continue;
    const named = getNamedType(f.type);
    if (isScalarType(named) || isEnumType(named)) {
      const outer = isNonNullType(f.type) ? f.type.ofType : f.type;
      out.push({
        name: f.name,
        gqlType: named.name,
        isEnum: isEnumType(named),
        isList: isListType(outer),
        description: f.description || '',
      });
    }
  }
  return out;
}

// Nested identity selections per the policy allowlist: node-type fields named
// in the allowlist whose type is a single (non-list) object; select the
// intersection of allowlisted subfields present as scalars/enums.
export function nestedAllowlisted(nodeType, allowlist) {
  const out = [];
  for (const [fieldName, wanted] of Object.entries(allowlist)) {
    const f = nodeType.getFields()[fieldName];
    if (!f) continue;
    const named = getNamedType(f.type);
    if (!isObjectType(named)) continue;
    const outer = isNonNullType(f.type) ? f.type.ofType : f.type;
    if (isListType(outer)) continue;
    const subfields = [];
    for (const w of wanted) {
      const sub = named.getFields()[w];
      if (!sub) continue;
      const subNamed = getNamedType(sub.type);
      if (isScalarType(subNamed) || isEnumType(subNamed)) {
        subfields.push({ name: w, gqlType: subNamed.name, isEnum: isEnumType(subNamed), isList: false });
      }
    }
    if (subfields.length > 0) out.push({ fieldName, typeName: named.name, subfields });
  }
  return out;
}

// Coarse complexity proxy used for inventory ranking only; the build gate is
// the live queryComplexity check.
export function estimateComplexity(scalarCount, nested, isConnection) {
  const nestedLeaves = nested.reduce((n, s) => n + s.subfields.length, 0);
  return scalarCount + nestedLeaves + (isConnection ? 3 : 1);
}

function argEntry(arg) {
  const required = isNonNullType(arg.type) && arg.defaultValue === undefined;
  return `${arg.name}:${String(arg.type)}${required ? ' (required)' : ''}`;
}

// Walk one scope host type and return row objects. Each row carries enough
// references for the generator to re-resolve the field (scope + source_field)
// plus the pre-computed selection material.
export function walkScope(scopeName, hostType, allowlist) {
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
      fieldArgs: field.args,
      scalar_enum_field_count: '',
      nested_allowlist: '',
      scalars: [],
      nested: [],
      nodeType: null,
      fieldDescription: field.description || '',
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
      const nodesField = named.getFields().nodes;
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
      const nested = nestedAllowlisted(nodeType, allowlist);
      row.nodeType = nodeType;
      row.scalars = scalars;
      row.nested = nested;
      row.scalar_enum_field_count = scalars.length;
      row.nested_allowlist = nested.map((n) => `${n.fieldName}{${n.subfields.map((s) => s.name).join(' ')}}`).join('; ');
      row.proposed_resource = `${scopePrefix}${resourceBase}`;
      row.proposed_service = proposeService(row.proposed_resource, scopeName);
      row.proposed_method = 'list';
      row.est_complexity = estimateComplexity(scalars.length, nested, true);
      row.disposition = 'map';
      rows.push(row);
      continue;
    }

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
    const nested = nestedAllowlisted(named, allowlist);
    row.nodeType = named;
    row.scalars = scalars;
    row.nested = nested;
    row.scalar_enum_field_count = scalars.length;
    row.nested_allowlist = nested.map((n) => `${n.fieldName}{${n.subfields.map((s) => s.name).join(' ')}}`).join('; ');
    row.proposed_resource = `${scopePrefix}${resourceBase}`;
    row.proposed_service = proposeService(row.proposed_resource, scopeName);
    row.proposed_method = 'get';
    row.est_complexity = estimateComplexity(scalars.length, nested, false);
    row.disposition = 'map';
    rows.push(row);
  }
  return rows;
}

export function walkAll(schema, policy) {
  const allowlist = policy.nestedIdentityAllowlist;
  const scopes = [
    ['instance', schema.getType('Query')],
    ['project', schema.getType('Project')],
    ['group', schema.getType('Group')],
  ];
  for (const [name, t] of scopes) {
    if (!isObjectType(t)) throw new Error(`Type for scope '${name}' not found or not an object type`);
  }
  return scopes.flatMap(([name, t]) => walkScope(name, t, allowlist));
}
