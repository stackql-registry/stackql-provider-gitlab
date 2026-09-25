--- 
title: project_milestones
hide_title: false
hide_table_of_contents: false
keywords:
  - project_milestones
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

Gets or lists a <code>project_milestones</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_milestones" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_milestones" /></td></tr>
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
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-containing_date"><code>containing_date</code></a>, <a href="#parameter-include_ancestors"><code>include_ancestors</code></a>, <a href="#parameter-search_title"><code>search_title</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-state"><code>state</code></a>, <a href="#parameter-title"><code>title</code></a></td>
    <td>Milestones of the project. Generated from the GitLab GraphQL schema field Project.milestones (connection of Milestone nodes).</td>
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
<tr id="parameter-containing_date">
    <td><CopyableCode code="containing_date" /></td>
    <td><code>string</code></td>
    <td>Date the milestone contains.</td>
</tr>
<tr id="parameter-include_ancestors">
    <td><CopyableCode code="include_ancestors" /></td>
    <td><code>boolean</code></td>
    <td>Also return milestones in the project's parent group and its ancestors.</td>
</tr>
<tr id="parameter-search_title">
    <td><CopyableCode code="search_title" /></td>
    <td><code>string</code></td>
    <td>Search string for the title.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort milestones by the criteria.</td>
</tr>
<tr id="parameter-state">
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Filter milestones by state.</td>
</tr>
<tr id="parameter-title">
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the milestone.</td>
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

Milestones of the project. Generated from the GitLab GraphQL schema field Project.milestones (connection of Milestone nodes).

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
FROM gitlab.projects.project_milestones
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND containing_date = '{{ containing_date }}'
AND include_ancestors = '{{ include_ancestors }}'
AND search_title = '{{ search_title }}'
AND sort = '{{ sort }}'
AND state = '{{ state }}'
AND title = '{{ title }}'
;
```
</TabItem>
</Tabs>
