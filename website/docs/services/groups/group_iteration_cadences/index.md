--- 
title: group_iteration_cadences
hide_title: false
hide_table_of_contents: false
keywords:
  - group_iteration_cadences
  - groups
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

Gets or lists a <code>group_iteration_cadences</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_iteration_cadences" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.groups.group_iteration_cadences" /></td></tr>
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
    <td>Global ID of the iteration cadence.</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Whether the iteration cadence is active.</td>
</tr>
<tr>
    <td><CopyableCode code="automatic" /></td>
    <td><code>boolean</code></td>
    <td>Whether the iteration cadence should automatically generate upcoming iterations.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the iteration cadence. Maximum length is 5000 characters.</td>
</tr>
<tr>
    <td><CopyableCode code="duration_in_weeks" /></td>
    <td><code>integer</code></td>
    <td>Duration in weeks of the iterations within the cadence.</td>
</tr>
<tr>
    <td><CopyableCode code="iterations_in_advance" /></td>
    <td><code>integer</code></td>
    <td>Number of future iterations to schedule in addition to the current one.</td>
</tr>
<tr>
    <td><CopyableCode code="roll_over" /></td>
    <td><code>boolean</code></td>
    <td>Whether the iteration cadence should roll over issues to the next iteration or not.</td>
</tr>
<tr>
    <td><CopyableCode code="start_date" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the automation start date.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the iteration cadence.</td>
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
    <td><a href="#parameter-active"><code>active</code></a>, <a href="#parameter-automatic"><code>automatic</code></a>, <a href="#parameter-duration_in_weeks"><code>duration_in_weeks</code></a>, <a href="#parameter-id"><code>id</code></a>, <a href="#parameter-include_ancestor_groups"><code>include_ancestor_groups</code></a>, <a href="#parameter-title"><code>title</code></a></td>
    <td>Find iteration cadences. Generated from the GitLab GraphQL schema field Group.iterationCadences (connection of IterationCadence nodes).</td>
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
<tr id="parameter-active">
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Whether the iteration cadence is active.</td>
</tr>
<tr id="parameter-automatic">
    <td><CopyableCode code="automatic" /></td>
    <td><code>boolean</code></td>
    <td>Whether the iteration cadence should automatically generate upcoming iterations.</td>
</tr>
<tr id="parameter-duration_in_weeks">
    <td><CopyableCode code="duration_in_weeks" /></td>
    <td><code>integer</code></td>
    <td>Duration in weeks of the iterations within the cadence.</td>
</tr>
<tr id="parameter-id">
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>Global ID of the iteration cadence to look up.</td>
</tr>
<tr id="parameter-include_ancestor_groups">
    <td><CopyableCode code="include_ancestor_groups" /></td>
    <td><code>boolean</code></td>
    <td>Whether to include ancestor groups to search iterations cadences in.</td>
</tr>
<tr id="parameter-title">
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Fuzzy search by title.</td>
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

Find iteration cadences. Generated from the GitLab GraphQL schema field Group.iterationCadences (connection of IterationCadence nodes).

```sql
SELECT
id,
active,
automatic,
description,
duration_in_weeks,
iterations_in_advance,
roll_over,
start_date,
title
FROM gitlab.groups.group_iteration_cadences
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND active = '{{ active }}'
AND automatic = '{{ automatic }}'
AND duration_in_weeks = '{{ duration_in_weeks }}'
AND id = '{{ id }}'
AND include_ancestor_groups = '{{ include_ancestor_groups }}'
AND title = '{{ title }}'
;
```
</TabItem>
</Tabs>
