--- 
title: group_dora_performance_score_counts
hide_title: false
hide_table_of_contents: false
keywords:
  - group_dora_performance_score_counts
  - analytics
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

Gets or lists a <code>group_dora_performance_score_counts</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_dora_performance_score_counts" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.analytics.group_dora_performance_score_counts" /></td></tr>
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
    <td><CopyableCode code="metric_name" /></td>
    <td><code>string</code></td>
    <td>Name of the DORA metric.</td>
</tr>
<tr>
    <td><CopyableCode code="high_projects_count" /></td>
    <td><code>integer</code></td>
    <td>Number of projects that score "high" on the metric.</td>
</tr>
<tr>
    <td><CopyableCode code="low_projects_count" /></td>
    <td><code>integer</code></td>
    <td>Number of projects that score "low" on the metric.</td>
</tr>
<tr>
    <td><CopyableCode code="medium_projects_count" /></td>
    <td><code>integer</code></td>
    <td>Number of projects that score "medium" on the metric.</td>
</tr>
<tr>
    <td><CopyableCode code="no_data_projects_count" /></td>
    <td><code>integer</code></td>
    <td>Number of projects with no data for the metric.</td>
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
    <td></td>
    <td>Group's DORA scores for all projects by DORA key metric for the last complete month. Generated from the GitLab GraphQL schema field Group.doraPerformanceScoreCounts (connection of DoraPerformanceScoreCount nodes).</td>
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

Group's DORA scores for all projects by DORA key metric for the last complete month. Generated from the GitLab GraphQL schema field Group.doraPerformanceScoreCounts (connection of DoraPerformanceScoreCount nodes).

```sql
SELECT
metric_name,
high_projects_count,
low_projects_count,
medium_projects_count,
no_data_projects_count
FROM gitlab.analytics.group_dora_performance_score_counts
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
