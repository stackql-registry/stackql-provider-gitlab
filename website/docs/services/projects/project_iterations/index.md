--- 
title: project_iterations
hide_title: false
hide_table_of_contents: false
keywords:
  - project_iterations
  - projects
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

Gets or lists a <code>project_iterations</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_iterations" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_iterations" /></td></tr>
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
    <td>ID of the iteration.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of iteration creation.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the iteration.</td>
</tr>
<tr>
    <td><CopyableCode code="due_date" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the iteration due date.</td>
</tr>
<tr>
    <td><CopyableCode code="group_" /></td>
    <td><code>object</code></td>
    <td>Group identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the iteration.</td>
</tr>
<tr>
    <td><CopyableCode code="scoped_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the iteration, scoped to the query parent. Only valid for Project parents. Returns null in other contexts.</td>
</tr>
<tr>
    <td><CopyableCode code="scoped_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the iteration, scoped to the query parent. Only valid for Project parents. Returns null in other contexts.</td>
</tr>
<tr>
    <td><CopyableCode code="sequence" /></td>
    <td><code>integer</code></td>
    <td>Sequence number for the iteration when you sort the containing cadence's iterations by the start and end date. The earliest starting and ending iteration is assigned 1.</td>
</tr>
<tr>
    <td><CopyableCode code="start_date" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the iteration start date.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the iteration. (upcoming, current, opened, closed, all)</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the iteration.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of last iteration update.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the iteration.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the iteration.</td>
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
    <td><a href="#parameter-id"><code>id</code></a>, <a href="#parameter-iid"><code>iid</code></a>, <a href="#parameter-include_ancestors"><code>include_ancestors</code></a>, <a href="#parameter-include_descendants"><code>include_descendants</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-state"><code>state</code></a></td>
    <td>Find iterations. Generated from the GitLab GraphQL schema field Project.iterations (connection of Iteration nodes).</td>
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
<tr id="parameter-id">
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>Global ID of the Iteration to look up.</td>
</tr>
<tr id="parameter-iid">
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the Iteration to look up.</td>
</tr>
<tr id="parameter-include_ancestors">
    <td><CopyableCode code="include_ancestors" /></td>
    <td><code>boolean</code></td>
    <td>Whether to include ancestor iterations. Defaults to true.</td>
</tr>
<tr id="parameter-include_descendants">
    <td><CopyableCode code="include_descendants" /></td>
    <td><code>boolean</code></td>
    <td>Whether to include descendant iterations.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Query used for fuzzy-searching in the fields selected in the argument `in`. Returns all iterations if empty.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>List iterations by sort order. If unspecified, an arbitrary order (subject to change) is used.</td>
</tr>
<tr id="parameter-state">
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Filter iterations by state.</td>
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

Find iterations. Generated from the GitLab GraphQL schema field Project.iterations (connection of Iteration nodes).

```sql
SELECT
id,
created_at,
description,
due_date,
group_,
iid,
scoped_path,
scoped_url,
sequence,
start_date,
state,
title,
updated_at,
web_path,
web_url
FROM gitlab.projects.project_iterations
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND id = '{{ id }}'
AND iid = '{{ iid }}'
AND include_ancestors = '{{ include_ancestors }}'
AND include_descendants = '{{ include_descendants }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
AND state = '{{ state }}'
;
```
</TabItem>
</Tabs>
