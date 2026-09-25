--- 
title: milestone
hide_title: false
hide_table_of_contents: false
keywords:
  - milestone
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

Gets or lists a <code>milestone</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="milestone" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.milestone" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' }
    ]}
>
<TabItem value="get">

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
    <td>ID of the milestone.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of milestone creation.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the milestone.</td>
</tr>
<tr>
    <td><CopyableCode code="due_date" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the milestone due date.</td>
</tr>
<tr>
    <td><CopyableCode code="expired" /></td>
    <td><code>boolean</code></td>
    <td>Expired state of the milestone (a milestone is expired when the due date is past the current date). Defaults to `false` when due date has not been set.</td>
</tr>
<tr>
    <td><CopyableCode code="group_" /></td>
    <td><code>object</code></td>
    <td>Group identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="group_milestone" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if milestone is at group level.</td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the milestone.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="project_milestone" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if milestone is at project level.</td>
</tr>
<tr>
    <td><CopyableCode code="start_date" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the milestone start date.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the milestone. (active, closed)</td>
</tr>
<tr>
    <td><CopyableCode code="subgroup_milestone" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if milestone is at subgroup level.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the milestone.</td>
</tr>
<tr>
    <td><CopyableCode code="upcoming" /></td>
    <td><code>boolean</code></td>
    <td>Upcoming state of the milestone (a milestone is upcoming when the start date is in the future). Defaults to `false` when start date has not been set.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of last milestone update.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the milestone.</td>
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
    <td><a href="#get"><CopyableCode code="get" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-id"><code>id</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Find a milestone. Generated from the GitLab GraphQL schema field Query.milestone (Milestone).</td>
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
<tr id="parameter-host">
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>GitLab host, with an optional port (default gitlab.com). Resolved from the GITLAB_HOST environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve. (default: gitlab.com, x-stackQL-envVar: GITLAB_HOST)</td>
</tr>
<tr id="parameter-id">
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>Find a milestone by its ID.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' }
    ]}
>
<TabItem value="get">

Find a milestone. Generated from the GitLab GraphQL schema field Query.milestone (Milestone).

```sql
SELECT
id,
created_at,
description,
due_date,
expired,
group_,
group_milestone,
iid,
project,
project_milestone,
start_date,
state,
subgroup_milestone,
title,
upcoming,
updated_at,
web_path
FROM gitlab.projects.milestone
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
