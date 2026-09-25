--- 
title: group_code_coverage_activities
hide_title: false
hide_table_of_contents: false
keywords:
  - group_code_coverage_activities
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

Gets or lists a <code>group_code_coverage_activities</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_code_coverage_activities" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.analytics.group_code_coverage_activities" /></td></tr>
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
    <td><CopyableCode code="average_coverage" /></td>
    <td><code>number</code></td>
    <td>Average percentage of the different code coverage results available for the group.</td>
</tr>
<tr>
    <td><CopyableCode code="coverage_count" /></td>
    <td><code>integer</code></td>
    <td>Number of different code coverage results available for the group.</td>
</tr>
<tr>
    <td><CopyableCode code="date" /></td>
    <td><code>string</code></td>
    <td>Date when the code coverage was created.</td>
</tr>
<tr>
    <td><CopyableCode code="project_count" /></td>
    <td><code>integer</code></td>
    <td>Number of projects with code coverage results for the group.</td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-start_date"><code>start_date</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Represents the code coverage activity for this group. Generated from the GitLab GraphQL schema field Group.codeCoverageActivities (connection of CodeCoverageActivity nodes).</td>
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
<tr id="parameter-start_date">
    <td><CopyableCode code="start_date" /></td>
    <td><code>string</code></td>
    <td>First day for which to fetch code coverage activity (maximum time window is set to 90 days).</td>
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

Represents the code coverage activity for this group. Generated from the GitLab GraphQL schema field Group.codeCoverageActivities (connection of CodeCoverageActivity nodes).

```sql
SELECT
average_coverage,
coverage_count,
date,
project_count
FROM gitlab.analytics.group_code_coverage_activities
WHERE full_path = '{{ full_path }}' -- required
AND start_date = '{{ start_date }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
