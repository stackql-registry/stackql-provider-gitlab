--- 
title: project_alert_management_alert_status_counts
hide_title: false
hide_table_of_contents: false
keywords:
  - project_alert_management_alert_status_counts
  - projects
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

Gets or lists a <code>project_alert_management_alert_status_counts</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_alert_management_alert_status_counts" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_alert_management_alert_status_counts" /></td></tr>
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
    <td><CopyableCode code="acknowledged" /></td>
    <td><code>integer</code></td>
    <td>Number of alerts with status ACKNOWLEDGED for the project</td>
</tr>
<tr>
    <td><CopyableCode code="all_" /></td>
    <td><code>integer</code></td>
    <td>Total number of alerts for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="ignored" /></td>
    <td><code>integer</code></td>
    <td>Number of alerts with status IGNORED for the project</td>
</tr>
<tr>
    <td><CopyableCode code="open" /></td>
    <td><code>integer</code></td>
    <td>Number of alerts with status TRIGGERED or ACKNOWLEDGED for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="resolved" /></td>
    <td><code>integer</code></td>
    <td>Number of alerts with status RESOLVED for the project</td>
</tr>
<tr>
    <td><CopyableCode code="triggered" /></td>
    <td><code>integer</code></td>
    <td>Number of alerts with status TRIGGERED for the project</td>
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
    <td><a href="#parameter-assignee_username"><code>assignee_username</code></a>, <a href="#parameter-search"><code>search</code></a></td>
    <td>Counts of alerts by status for the project. Generated from the GitLab GraphQL schema field Project.alertManagementAlertStatusCounts (AlertManagementAlertStatusCountsType).</td>
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
    <td>Full path of the project, for example gitlab-org/gitlab</td>
</tr>
<tr id="parameter-host">
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>GitLab host, with an optional port (default gitlab.com). Resolved from the GITLAB_HOST environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve. (default: gitlab.com, x-stackQL-envVar: GITLAB_HOST)</td>
</tr>
<tr id="parameter-assignee_username">
    <td><CopyableCode code="assignee_username" /></td>
    <td><code>string</code></td>
    <td>Username of a user assigned to the issue.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for title, description, service, or monitoring_tool.</td>
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

Counts of alerts by status for the project. Generated from the GitLab GraphQL schema field Project.alertManagementAlertStatusCounts (AlertManagementAlertStatusCountsType).

```sql
SELECT
acknowledged,
all_,
ignored,
open,
resolved,
triggered
FROM gitlab.projects.project_alert_management_alert_status_counts
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND assignee_username = '{{ assignee_username }}'
AND search = '{{ search }}'
;
```
</TabItem>
</Tabs>
