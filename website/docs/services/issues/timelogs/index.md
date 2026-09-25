--- 
title: timelogs
hide_title: false
hide_table_of_contents: false
keywords:
  - timelogs
  - issues
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

Gets or lists a <code>timelogs</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="timelogs" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.issues.timelogs" /></td></tr>
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
    <td>Internal ID of the timelog.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="spent_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the time tracked was spent at.</td>
</tr>
<tr>
    <td><CopyableCode code="summary" /></td>
    <td><code>string</code></td>
    <td>Summary of how the time was spent.</td>
</tr>
<tr>
    <td><CopyableCode code="time_spent" /></td>
    <td><code>integer</code></td>
    <td>Time spent displayed in seconds.</td>
</tr>
<tr>
    <td><CopyableCode code="user" /></td>
    <td><code>object</code></td>
    <td>UserCore identity (id, username, name)</td>
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
    <td><a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-end_date"><code>end_date</code></a>, <a href="#parameter-end_time"><code>end_time</code></a>, <a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-project_id"><code>project_id</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-start_date"><code>start_date</code></a>, <a href="#parameter-start_time"><code>start_time</code></a>, <a href="#parameter-username"><code>username</code></a></td>
    <td>Find timelogs visible to the current user. Generated from the GitLab GraphQL schema field Query.timelogs (connection of Timelog nodes).</td>
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
<tr id="parameter-end_date">
    <td><CopyableCode code="end_date" /></td>
    <td><code>string</code></td>
    <td>List timelogs within a date range where the logged date is equal to or before endDate.</td>
</tr>
<tr id="parameter-end_time">
    <td><CopyableCode code="end_time" /></td>
    <td><code>string</code></td>
    <td>List timelogs within a time range where the logged time is equal to or before endTime.</td>
</tr>
<tr id="parameter-group_id">
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>List timelogs for a group.</td>
</tr>
<tr id="parameter-project_id">
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>List timelogs for a project.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>List timelogs in a particular order.</td>
</tr>
<tr id="parameter-start_date">
    <td><CopyableCode code="start_date" /></td>
    <td><code>string</code></td>
    <td>List timelogs within a date range where the logged date is equal to or after startDate.</td>
</tr>
<tr id="parameter-start_time">
    <td><CopyableCode code="start_time" /></td>
    <td><code>string</code></td>
    <td>List timelogs within a time range where the logged time is equal to or after startTime.</td>
</tr>
<tr id="parameter-username">
    <td><CopyableCode code="username" /></td>
    <td><code>string</code></td>
    <td>List timelogs for a user.</td>
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

Find timelogs visible to the current user. Generated from the GitLab GraphQL schema field Query.timelogs (connection of Timelog nodes).

```sql
SELECT
id,
project,
spent_at,
summary,
time_spent,
user
FROM gitlab.issues.timelogs
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND end_date = '{{ end_date }}'
AND end_time = '{{ end_time }}'
AND group_id = '{{ group_id }}'
AND project_id = '{{ project_id }}'
AND sort = '{{ sort }}'
AND start_date = '{{ start_date }}'
AND start_time = '{{ start_time }}'
AND username = '{{ username }}'
;
```
</TabItem>
</Tabs>
