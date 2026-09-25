--- 
title: ci_dedicated_hosted_runner_usage
hide_title: false
hide_table_of_contents: false
keywords:
  - ci_dedicated_hosted_runner_usage
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

Gets or lists a <code>ci_dedicated_hosted_runner_usage</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="ci_dedicated_hosted_runner_usage" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.ci_dedicated_hosted_runner_usage" /></td></tr>
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
    <td><CopyableCode code="billing_month" /></td>
    <td><code>string</code></td>
    <td>Month of the usage data.</td>
</tr>
<tr>
    <td><CopyableCode code="billing_month_iso8601" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the billing month in ISO 8601 format.</td>
</tr>
<tr>
    <td><CopyableCode code="compute_minutes" /></td>
    <td><code>integer</code></td>
    <td>Total compute minutes used across all namespaces. Values are rounded down to the nearest integer.</td>
</tr>
<tr>
    <td><CopyableCode code="compute_minutes_usage" /></td>
    <td><code>number</code></td>
    <td>Total compute minutes used across all namespaces.</td>
</tr>
<tr>
    <td><CopyableCode code="duration_minutes" /></td>
    <td><code>number</code></td>
    <td>Total duration in minutes of runner usage.</td>
</tr>
<tr>
    <td><CopyableCode code="duration_seconds" /></td>
    <td><code>integer</code></td>
    <td>Total duration in seconds of runner usage. Values are rounded down to the nearest integer.</td>
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
    <td><a href="#parameter-billing_month"><code>billing_month</code></a>, <a href="#parameter-grouping"><code>grouping</code></a>, <a href="#parameter-runner_id"><code>runner_id</code></a>, <a href="#parameter-year"><code>year</code></a></td>
    <td>Compute usage data for runners across namespaces on GitLab Dedicated. Defaults to the current year if no year or billing month is specified. Ultimate only. Generated from the GitLab GraphQL schema field Query.ciDedicatedHostedRunnerUsage (connection of CiDedicatedHostedRunnerUsage nodes).</td>
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
<tr id="parameter-billing_month">
    <td><CopyableCode code="billing_month" /></td>
    <td><code>string</code></td>
    <td>First day of the month to retrieve data for.</td>
</tr>
<tr id="parameter-grouping">
    <td><CopyableCode code="grouping" /></td>
    <td><code>string</code></td>
    <td>Groups usage data by instance aggregate or root namespace.</td>
</tr>
<tr id="parameter-runner_id">
    <td><CopyableCode code="runner_id" /></td>
    <td><code>string</code></td>
    <td>Runner ID to retrieve data for.</td>
</tr>
<tr id="parameter-year">
    <td><CopyableCode code="year" /></td>
    <td><code>integer</code></td>
    <td>Year to retrieve data for.</td>
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

Compute usage data for runners across namespaces on GitLab Dedicated. Defaults to the current year if no year or billing month is specified. Ultimate only. Generated from the GitLab GraphQL schema field Query.ciDedicatedHostedRunnerUsage (connection of CiDedicatedHostedRunnerUsage nodes).

```sql
SELECT
billing_month,
billing_month_iso8601,
compute_minutes,
compute_minutes_usage,
duration_minutes,
duration_seconds
FROM gitlab.ci.ci_dedicated_hosted_runner_usage
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND billing_month = '{{ billing_month }}'
AND grouping = '{{ grouping }}'
AND runner_id = '{{ runner_id }}'
AND year = '{{ year }}'
;
```
</TabItem>
</Tabs>
