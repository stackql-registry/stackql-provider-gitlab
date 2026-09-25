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
  isInputObjectType,
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

// snake_case for the SQL surface: resource names, parameter names and column
// aliases all go through this one function. Digits stay attached to the
// preceding word (sha256 -> sha256, x509Certificate -> x509_certificate).
export function snake(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

// SQL surface names (columns and parameters): snake_case, plus the policy's
// reserved-word rule - a name the stackql parser or the SQLite backend
// rejects as a bare identifier (policy.sqlReservedColumnNames, measured
// against the engine) gets policy.reservedColumnSuffix appended
// (exists -> exists_, group -> group_), because double-quoting such a
// column fails at the SQLite stage and backticks fail at the parser.
let reservedNames = new Set();
let reservedSuffix = '_';
export function configureNaming(policy) {
  reservedNames = new Set(policy.sqlReservedColumnNames || []);
  reservedSuffix = policy.reservedColumnSuffix || '_';
}
export function sqlName(name) {
  const s = snake(name);
  return reservedNames.has(s) ? `${s}${reservedSuffix}` : s;
}

// graphql-js 17 exposes argument defaults as `arg.default` ({ literal } or
// { value }); older releases used `arg.defaultValue`. An argument is required
// only when it is non-null AND carries no default of either form.
export function hasDefault(arg) {
  return arg.defaultValue !== undefined || (arg.default !== undefined && arg.default !== null);
}

export function isRequiredArg(arg) {
  return isNonNullType(arg.type) && !hasDefault(arg);
}

export function containsList(type) {
  if (isListType(type)) return true;
  if (isNonNullType(type)) return containsList(type.ofType);
  return false;
}

// Service proposal rules: first regex match on the snake_case resource name
// wins. Overrides in service_names.json take precedence over these proposals.
export const SERVICE_RULES = [
  [/merge_request/, 'merge_requests'],
  [/work_item/, 'work_items'],
  [/(^|_)board/, 'boards'],
  [/issue/, 'issues'],
  [/(pipeline|_job|^job|runner|_ci_|^ci_)/, 'ci'],
  [/(package|container_repositor|dependency_proxy|container_protection|container_tags)/, 'packages'],
  [/(vulnerab|security|scan_execution_polic|approval_polic|compliance|dependenc|dast|fuzzing|corpus)/, 'security'],
  [/snippet/, 'snippets'],
  [/audit_event/, 'audit'],
  [/^(metadata|query_complexity|current_license|echo)/, 'metadata'],
  [/(usage_trends|devops_adoption|dashboard|value_stream|dora_|code_coverage|contributions)/, 'analytics'],
  [/(geo_node|license|subscription)/, 'admin'],
  [/workspace/, 'workspaces'],
  [/(^ml_|_ml_)/, 'ml'],
  [/(duo|^ai_)/, 'duo'],
  [/(epic|^namespace|^iteration)/, 'groups'],
  [/^group/, 'groups'],
  [/(user|todo)/, 'users'],
  [/^(project|fork|star|topic)/, 'projects'],
  [/(release|environment|deployment|label|milestone|branch|tag|commit|repositor|member)/, 'projects'],
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
  return field.args.some(isRequiredArg);
}

function compilePatterns(patterns) {
  return (patterns || []).map((p) => new RegExp(p));
}

// Every selectable flat field on the node type: named type is a scalar or an
// enum (lists of scalars/enums included - they project as JSON arrays), the
// field declares no required arguments, and the field is not excluded by
// policy (name patterns, or a per-node-type exclusion list). Each field
// carries its SQL column name (snake_case alias).
export function scalarEnumFields(nodeType, policy) {
  const excludePatterns = compilePatterns(policy.excludeFieldNamePatterns);
  const exclusionEntry = (policy.nodeTypeFieldExclusions || {})[nodeType.name];
  const typeExclusions = new Set(Array.isArray(exclusionEntry) ? exclusionEntry : (exclusionEntry && exclusionEntry.fields) || []);
  for (const f of Object.keys((policy.unstableFields || {})[nodeType.name] || {})) typeExclusions.add(f);
  const out = [];
  for (const f of Object.values(nodeType.getFields())) {
    if (hasRequiredArgs(f)) continue;
    if (excludePatterns.some((re) => re.test(f.name))) continue;
    if (typeExclusions.has(f.name)) continue;
    const named = getNamedType(f.type);
    if (isScalarType(named) || isEnumType(named)) {
      const outer = isNonNullType(f.type) ? f.type.ofType : f.type;
      out.push({
        name: f.name,
        column: sqlName(f.name),
        gqlType: named.name,
        isEnum: isEnumType(named),
        enumValues: isEnumType(named) ? named.getValues().map((v) => v.name) : null,
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
    if (hasRequiredArgs(f)) continue;
    const named = getNamedType(f.type);
    if (!isObjectType(named)) continue;
    const outer = isNonNullType(f.type) ? f.type.ofType : f.type;
    if (isListType(outer)) continue;
    const subfields = [];
    for (const w of wanted) {
      const sub = named.getFields()[w];
      if (!sub) continue;
      if (hasRequiredArgs(sub)) continue;
      const subNamed = getNamedType(sub.type);
      if (isScalarType(subNamed) || isEnumType(subNamed)) {
        subfields.push({ name: w, column: sqlName(w), gqlType: subNamed.name, isEnum: isEnumType(subNamed), isList: false });
      }
    }
    if (subfields.length > 0) out.push({ fieldName, column: sqlName(fieldName), typeName: named.name, subfields });
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
  return `${arg.name}:${String(arg.type)}${isRequiredArg(arg) ? ' (required)' : ''}`;
}

const PAGINATION_ARGS = new Set(['first', 'last', 'after', 'before']);

// A required argument can only be templated when it is a scalar or enum and
// not a list: the WHERE clause supplies one flat value per parameter.
function unsupportedRequiredArg(field) {
  for (const a of field.args) {
    if (!isRequiredArg(a)) continue;
    if (PAGINATION_ARGS.has(a.name)) continue;
    const named = getNamedType(a.type);
    if (containsList(a.type) || isInputObjectType(named) || !(isScalarType(named) || isEnumType(named))) {
      return `${a.name}:${String(a.type)}`;
    }
  }
  return null;
}

// GitLab GraphQL reference anchors are the lowercased "<Type><field>" pair,
// e.g. Query.projects -> #queryprojects, Project.issues -> #projectissues.
export function referenceAnchor(hostTypeName, fieldName) {
  return `${hostTypeName}${fieldName}`.toLowerCase();
}

// Walk one scope host type and return row objects. Each row carries enough
// references for the generator to re-resolve the field (scope + source_field)
// plus the pre-computed selection material.
export function walkScope(scopeName, hostType, policy) {
  const allowlist = policy.nestedIdentityAllowlist;
  const rows = [];
  for (const field of Object.values(hostType.getFields())) {
    const named = getNamedType(field.type);
    const resourceBase = snake(field.name);
    const scopePrefix = scopeName === 'instance' ? '' : `${scopeName}_`;
    const row = {
      scope: scopeName,
      host_type: hostType.name,
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
      docAnchor: referenceAnchor(hostType.name, field.name),
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

    const unsupported = unsupportedRequiredArg(field);

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
      if (unsupported) { skip(`unsupported_required_arg:${unsupported}`); continue; }
      const scalars = scalarEnumFields(nodeType, policy);
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
    if (unsupported) { skip(`unsupported_required_arg:${unsupported}`); continue; }
    const scalars = scalarEnumFields(named, policy);
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
  configureNaming(policy);
  const scopes = [
    ['instance', schema.getType('Query')],
    ['project', schema.getType('Project')],
    ['group', schema.getType('Group')],
  ];
  for (const [name, t] of scopes) {
    if (!isObjectType(t)) throw new Error(`Type for scope '${name}' not found or not an object type`);
  }
  const rows = scopes.flatMap(([name, t]) => walkScope(name, t, policy));

  // Resource names must be unique across the provider and column aliases
  // unique within a node type; both are fatal (the schema changed shape).
  const seen = new Map();
  for (const r of rows.filter((x) => x.disposition === 'map')) {
    if (seen.has(r.proposed_resource)) {
      throw new Error(`Duplicate resource name '${r.proposed_resource}' from ${seen.get(r.proposed_resource)} and ${r.scope}.${r.source_field}`);
    }
    seen.set(r.proposed_resource, `${r.scope}.${r.source_field}`);
    const cols = new Map();
    for (const s of [...r.scalars, ...r.nested]) {
      const col = s.column;
      const src = s.name || s.fieldName;
      if (cols.has(col) && cols.get(col) !== src) {
        throw new Error(`Column alias collision on ${r.node_type}: '${cols.get(col)}' and '${src}' both map to '${col}'`);
      }
      cols.set(col, src);
    }
  }
  return rows;
}
