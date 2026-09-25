--- 
title: project_scan_execution_policies
hide_title: false
hide_table_of_contents: false
keywords:
  - project_scan_execution_policies
  - security
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

Gets or lists a <code>project_scan_execution_policies</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_scan_execution_policies" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.security.project_scan_execution_policies" /></td></tr>
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
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the policy.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the policy.</td>
</tr>
<tr>
    <td><CopyableCode code="edit_path" /></td>
    <td><code>string</code></td>
    <td>URL of policy edit page.</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the policy is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the policy YAML was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="yaml" /></td>
    <td><code>string</code></td>
    <td>YAML definition of the policy.</td>
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
    <td><a href="#parameter-deduplicate_policies"><code>deduplicate_policies</code></a>, <a href="#parameter-include_unscoped"><code>include_unscoped</code></a>, <a href="#parameter-relationship"><code>relationship</code></a></td>
    <td>Scan Execution Policies of the project Generated from the GitLab GraphQL schema field Project.scanExecutionPolicies (connection of ScanExecutionPolicy nodes).</td>
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
    <td>Full path of the project, for example gitlab-org/gitlab</td>
</tr>
<tr id="parameter-host">
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>GitLab host, with an optional port (default gitlab.com). Resolved from the GITLAB_HOST environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve. (default: gitlab.com, x-stackQL-envVar: GITLAB_HOST)</td>
</tr>
<tr id="parameter-deduplicate_policies">
    <td><CopyableCode code="deduplicate_policies" /></td>
    <td><code>boolean</code></td>
    <td>Remove duplicate policies when the same policy is applied via multiple routes.</td>
</tr>
<tr id="parameter-include_unscoped">
    <td><CopyableCode code="include_unscoped" /></td>
    <td><code>boolean</code></td>
    <td>Filter policies that are scoped to the project.</td>
</tr>
<tr id="parameter-relationship">
    <td><CopyableCode code="relationship" /></td>
    <td><code>string</code></td>
    <td>Filter policies by the given policy relationship. Default is DIRECT.</td>
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

Scan Execution Policies of the project Generated from the GitLab GraphQL schema field Project.scanExecutionPolicies (connection of ScanExecutionPolicy nodes).

```sql
SELECT
name,
description,
edit_path,
enabled,
updated_at,
yaml
FROM gitlab.security.project_scan_execution_policies
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND deduplicate_policies = '{{ deduplicate_policies }}'
AND include_unscoped = '{{ include_unscoped }}'
AND relationship = '{{ relationship }}'
;
```
</TabItem>
</Tabs>
