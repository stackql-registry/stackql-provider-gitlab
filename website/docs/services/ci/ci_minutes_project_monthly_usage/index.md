--- 
title: ci_minutes_project_monthly_usage
hide_title: false
hide_table_of_contents: false
keywords:
  - ci_minutes_project_monthly_usage
  - ci
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

Gets or lists a <code>ci_minutes_project_monthly_usage</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="ci_minutes_project_monthly_usage" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.ci_minutes_project_monthly_usage" /></td></tr>
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
    <td><CopyableCode code="minutes" /></td>
    <td><code>integer</code></td>
    <td>Number of compute minutes used by the project in the month.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="shared_runners_duration" /></td>
    <td><code>integer</code></td>
    <td>Total duration (in seconds) of shared runners use by the project for the month.</td>
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
    <td><a href="#parameter-date"><code>date</code></a>, <a href="#parameter-namespace_id"><code>namespace_id</code></a></td>
    <td>Compute usage data for projects in a namespace for a given month. Returns project usage independent of whether a namespace-level usage record exists. Generated from the GitLab GraphQL schema field Query.ciMinutesProjectMonthlyUsage (connection of CiMinutesProjectMonthlyUsage nodes).</td>
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
<tr id="parameter-date">
    <td><CopyableCode code="date" /></td>
    <td><code>string</code></td>
    <td>Date for which to retrieve the usage data, should be the first day of a month. Defaults to the current month.</td>
</tr>
<tr id="parameter-namespace_id">
    <td><CopyableCode code="namespace_id" /></td>
    <td><code>string</code></td>
    <td>Global ID of the Namespace for the project compute usage.</td>
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

Compute usage data for projects in a namespace for a given month. Returns project usage independent of whether a namespace-level usage record exists. Generated from the GitLab GraphQL schema field Query.ciMinutesProjectMonthlyUsage (connection of CiMinutesProjectMonthlyUsage nodes).

```sql
SELECT
minutes,
project,
shared_runners_duration
FROM gitlab.ci.ci_minutes_project_monthly_usage
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND date = '{{ date }}'
AND namespace_id = '{{ namespace_id }}'
;
```
</TabItem>
</Tabs>
