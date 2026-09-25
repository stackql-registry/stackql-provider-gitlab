--- 
title: group_contributions
hide_title: false
hide_table_of_contents: false
keywords:
  - group_contributions
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

Gets or lists a <code>group_contributions</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_contributions" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.analytics.group_contributions" /></td></tr>
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
    <td><CopyableCode code="issues_closed" /></td>
    <td><code>integer</code></td>
    <td>Number of issues closed by the user.</td>
</tr>
<tr>
    <td><CopyableCode code="issues_created" /></td>
    <td><code>integer</code></td>
    <td>Number of issues created by the user.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_approved" /></td>
    <td><code>integer</code></td>
    <td>Number of merge requests approved by the user.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_closed" /></td>
    <td><code>integer</code></td>
    <td>Number of merge requests closed by the user.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_created" /></td>
    <td><code>integer</code></td>
    <td>Number of merge requests created by the user.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_merged" /></td>
    <td><code>integer</code></td>
    <td>Number of merge requests merged by the user.</td>
</tr>
<tr>
    <td><CopyableCode code="repo_pushed" /></td>
    <td><code>integer</code></td>
    <td>Number of repository pushes the user made.</td>
</tr>
<tr>
    <td><CopyableCode code="total_events" /></td>
    <td><code>integer</code></td>
    <td>Total number of events contributed by the user.</td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-from_"><code>from_</code></a>, <a href="#parameter-to_"><code>to_</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Provides the aggregated contributions by users within the group and its subgroups Generated from the GitLab GraphQL schema field Group.contributions (connection of ContributionAnalyticsContribution nodes).</td>
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
<tr id="parameter-from_">
    <td><CopyableCode code="from_" /></td>
    <td><code>string</code></td>
    <td>Start date of the reporting time range.</td>
</tr>
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
<tr id="parameter-to_">
    <td><CopyableCode code="to_" /></td>
    <td><code>string</code></td>
    <td>End date of the reporting time range. The end date must be within 93 days after the start date.</td>
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

Provides the aggregated contributions by users within the group and its subgroups Generated from the GitLab GraphQL schema field Group.contributions (connection of ContributionAnalyticsContribution nodes).

```sql
SELECT
issues_closed,
issues_created,
merge_requests_approved,
merge_requests_closed,
merge_requests_created,
merge_requests_merged,
repo_pushed,
total_events,
user
FROM gitlab.analytics.group_contributions
WHERE full_path = '{{ full_path }}' -- required
AND from_ = '{{ from_ }}' -- required
AND to_ = '{{ to_ }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
