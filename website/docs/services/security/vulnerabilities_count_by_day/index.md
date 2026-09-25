--- 
title: vulnerabilities_count_by_day
hide_title: false
hide_table_of_contents: false
keywords:
  - vulnerabilities_count_by_day
  - security
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

Gets or lists a <code>vulnerabilities_count_by_day</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="vulnerabilities_count_by_day" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.security.vulnerabilities_count_by_day" /></td></tr>
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
    <td><CopyableCode code="critical" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day with critical severity</td>
</tr>
<tr>
    <td><CopyableCode code="date" /></td>
    <td><code>string</code></td>
    <td>Date for the count.</td>
</tr>
<tr>
    <td><CopyableCode code="high" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day with high severity</td>
</tr>
<tr>
    <td><CopyableCode code="info" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day with info severity</td>
</tr>
<tr>
    <td><CopyableCode code="low" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day with low severity</td>
</tr>
<tr>
    <td><CopyableCode code="medium" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day with medium severity</td>
</tr>
<tr>
    <td><CopyableCode code="total" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day.</td>
</tr>
<tr>
    <td><CopyableCode code="unknown" /></td>
    <td><code>integer</code></td>
    <td>Total number of vulnerabilities on a particular day with unknown severity</td>
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
    <td><a href="#parameter-end_date"><code>end_date</code></a>, <a href="#parameter-start_date"><code>start_date</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>The historical number of vulnerabilities per day for the projects on the current user's instance security dashboard. Generated from the GitLab GraphQL schema field Query.vulnerabilitiesCountByDay (connection of VulnerabilitiesCountByDay nodes).</td>
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
<tr id="parameter-end_date">
    <td><CopyableCode code="end_date" /></td>
    <td><code>string</code></td>
    <td>Last day for which to fetch vulnerability history.</td>
</tr>
<tr id="parameter-host">
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>GitLab host, with an optional port (default gitlab.com). Resolved from the GITLAB_HOST environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve. (default: gitlab.com, x-stackQL-envVar: GITLAB_HOST)</td>
</tr>
<tr id="parameter-start_date">
    <td><CopyableCode code="start_date" /></td>
    <td><code>string</code></td>
    <td>First day for which to fetch vulnerability history.</td>
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

The historical number of vulnerabilities per day for the projects on the current user's instance security dashboard. Generated from the GitLab GraphQL schema field Query.vulnerabilitiesCountByDay (connection of VulnerabilitiesCountByDay nodes).

```sql
SELECT
critical,
date,
high,
info,
low,
medium,
total,
unknown
FROM gitlab.security.vulnerabilities_count_by_day
WHERE end_date = '{{ end_date }}' -- required
AND start_date = '{{ start_date }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
