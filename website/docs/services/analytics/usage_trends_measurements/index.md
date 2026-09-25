--- 
title: usage_trends_measurements
hide_title: false
hide_table_of_contents: false
keywords:
  - usage_trends_measurements
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

Gets or lists a <code>usage_trends_measurements</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="usage_trends_measurements" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.analytics.usage_trends_measurements" /></td></tr>
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
    <td><CopyableCode code="count" /></td>
    <td><code>integer</code></td>
    <td>Object count.</td>
</tr>
<tr>
    <td><CopyableCode code="identifier" /></td>
    <td><code>string</code></td>
    <td>Type of objects being measured. (PROJECTS, USERS, ISSUES, MERGE_REQUESTS, GROUPS, PIPELINES, PIPELINES_SUCCEEDED, PIPELINES_FAILED, PIPELINES_CANCELED, PIPELINES_SKIPPED)</td>
</tr>
<tr>
    <td><CopyableCode code="recorded_at" /></td>
    <td><code>string</code></td>
    <td>Time the measurement was recorded.</td>
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
    <td><a href="#parameter-identifier"><code>identifier</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-recorded_after"><code>recorded_after</code></a>, <a href="#parameter-recorded_before"><code>recorded_before</code></a></td>
    <td>Get statistics on the instance. Generated from the GitLab GraphQL schema field Query.usageTrendsMeasurements (connection of UsageTrendsMeasurement nodes).</td>
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
<tr id="parameter-identifier">
    <td><CopyableCode code="identifier" /></td>
    <td><code>string</code></td>
    <td>Type of measurement or statistics to retrieve.</td>
</tr>
<tr id="parameter-recorded_after">
    <td><CopyableCode code="recorded_after" /></td>
    <td><code>string</code></td>
    <td>Measurement recorded after the date.</td>
</tr>
<tr id="parameter-recorded_before">
    <td><CopyableCode code="recorded_before" /></td>
    <td><code>string</code></td>
    <td>Measurement recorded before the date.</td>
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

Get statistics on the instance. Generated from the GitLab GraphQL schema field Query.usageTrendsMeasurements (connection of UsageTrendsMeasurement nodes).

```sql
SELECT
count,
identifier,
recorded_at
FROM gitlab.analytics.usage_trends_measurements
WHERE identifier = '{{ identifier }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND recorded_after = '{{ recorded_after }}'
AND recorded_before = '{{ recorded_before }}'
;
```
</TabItem>
</Tabs>
