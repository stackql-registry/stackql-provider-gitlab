--- 
title: group_pipeline_analytics
hide_title: false
hide_table_of_contents: false
keywords:
  - group_pipeline_analytics
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

Gets or lists a <code>group_pipeline_analytics</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_pipeline_analytics" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.group_pipeline_analytics" /></td></tr>
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
    <td><CopyableCode code="month_pipelines_labels" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="month_pipelines_successful" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="month_pipelines_totals" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="pipeline_times_labels" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="pipeline_times_values" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="week_pipelines_labels" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="week_pipelines_successful" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="week_pipelines_totals" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="year_pipelines_labels" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="year_pipelines_successful" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="year_pipelines_totals" /></td>
    <td><code>array</code></td>
    <td></td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-from_time"><code>from_time</code></a>, <a href="#parameter-ref"><code>ref</code></a>, <a href="#parameter-source"><code>source</code></a>, <a href="#parameter-to_time"><code>to_time</code></a></td>
    <td>Pipeline analytics. Generated from the GitLab GraphQL schema field Group.pipelineAnalytics (PipelineAnalytics).</td>
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
<tr id="parameter-from_time">
    <td><CopyableCode code="from_time" /></td>
    <td><code>string</code></td>
    <td>Start of the requested time (in UTC). Defaults to the pipelines started in the past week.</td>
</tr>
<tr id="parameter-ref">
    <td><CopyableCode code="ref" /></td>
    <td><code>string</code></td>
    <td>Branch that triggered the pipeline.</td>
</tr>
<tr id="parameter-source">
    <td><CopyableCode code="source" /></td>
    <td><code>string</code></td>
    <td>Source of the pipeline.</td>
</tr>
<tr id="parameter-to_time">
    <td><CopyableCode code="to_time" /></td>
    <td><code>string</code></td>
    <td>End of the requested time (in UTC). Defaults to the pipelines started before the current date.</td>
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

Pipeline analytics. Generated from the GitLab GraphQL schema field Group.pipelineAnalytics (PipelineAnalytics).

```sql
SELECT
month_pipelines_labels,
month_pipelines_successful,
month_pipelines_totals,
pipeline_times_labels,
pipeline_times_values,
week_pipelines_labels,
week_pipelines_successful,
week_pipelines_totals,
year_pipelines_labels,
year_pipelines_successful,
year_pipelines_totals
FROM gitlab.ci.group_pipeline_analytics
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND from_time = '{{ from_time }}'
AND ref = '{{ ref }}'
AND source = '{{ source }}'
AND to_time = '{{ to_time }}'
;
```
</TabItem>
</Tabs>
