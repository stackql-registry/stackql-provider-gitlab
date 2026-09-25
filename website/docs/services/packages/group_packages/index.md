--- 
title: group_packages
hide_title: false
hide_table_of_contents: false
keywords:
  - group_packages
  - packages
  - gitlab
  - infrastructure-as-code
  - configuration-as-data
  - cloud inventory
description: Query, deploy and manage gitlab resources using SQL
custom_edit_url: null
image: /img/stackql-gitlab-provider-featured-image.png
---

import CopyableCode from '@site/src/components/CopyableCode/CopyableCode';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Gets or lists a <code>group_packages</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_packages" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.packages.group_packages" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

GraphQL response envelope

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>ID of the package.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the package.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Date of creation.</td>
</tr>
<tr>
    <td><CopyableCode code="package_type" /></td>
    <td><code>string</code></td>
    <td>Package type. (MAVEN, NPM, CONAN, NUGET, PYPI, COMPOSER, GENERIC, GOLANG, DEBIAN, RUBYGEMS, HELM, TERRAFORM_MODULE, RPM, ML_MODEL, CARGO)</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="protection_rule_exists" /></td>
    <td><code>boolean</code></td>
    <td>Whether any matching package protection rule exists for the package.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Package status. (DEFAULT, HIDDEN, PROCESSING, ERROR, PENDING_DESTRUCTION, DEPRECATED)</td>
</tr>
<tr>
    <td><CopyableCode code="status_message" /></td>
    <td><code>string</code></td>
    <td>Status message.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Date of most recent update.</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>Version string.</td>
</tr>
</tbody>
</table>
</TabItem>
</Tabs>

## Methods

The following methods are available for this resource:

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Accessible by</th>
    <th>Required Params</th>
    <th>Optional Params</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-include_versionless"><code>include_versionless</code></a>, <a href="#parameter-package_name"><code>package_name</code></a>, <a href="#parameter-package_type"><code>package_type</code></a>, <a href="#parameter-package_version"><code>package_version</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-status"><code>status</code></a></td>
    <td>Packages of the group. This field can only be resolved for one group in any single request. Generated from the GitLab GraphQL schema field Group.packages (connection of Package nodes).</td>
</tr>
</tbody>
</table>

## Parameters

Parameters can be passed in the `WHERE` clause of a query. Check the [Methods](#methods) section to see which parameters are required or optional for each operation.

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr id="parameter-full_path">
    <td><CopyableCode code="full_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the group, for example gitlab-org</td>
</tr>
<tr id="parameter-host">
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>GitLab host, with an optional port (default gitlab.com). Resolved from the GITLAB_HOST environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve. (default: gitlab.com, x-stackQL-envVar: GITLAB_HOST)</td>
</tr>
<tr id="parameter-include_versionless">
    <td><CopyableCode code="include_versionless" /></td>
    <td><code>boolean</code></td>
    <td>Include versionless packages.</td>
</tr>
<tr id="parameter-package_name">
    <td><CopyableCode code="package_name" /></td>
    <td><code>string</code></td>
    <td>Search a package by name.</td>
</tr>
<tr id="parameter-package_type">
    <td><CopyableCode code="package_type" /></td>
    <td><code>string</code></td>
    <td>Filter a package by type.</td>
</tr>
<tr id="parameter-package_version">
    <td><CopyableCode code="package_version" /></td>
    <td><code>string</code></td>
    <td>Filter a package by version. If used in combination with `include_versionless`,           then no versionless packages are returned.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort packages by the criteria.</td>
</tr>
<tr id="parameter-status">
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Filter a package by status.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

Packages of the group. This field can only be resolved for one group in any single request. Generated from the GitLab GraphQL schema field Group.packages (connection of Package nodes).

```sql
SELECT
id,
name,
created_at,
package_type,
project,
protection_rule_exists,
status,
status_message,
updated_at,
version
FROM gitlab.packages.group_packages
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND include_versionless = '{{ include_versionless }}'
AND package_name = '{{ package_name }}'
AND package_type = '{{ package_type }}'
AND package_version = '{{ package_version }}'
AND sort = '{{ sort }}'
AND status = '{{ status }}'
;
```
</TabItem>
</Tabs>
