--- 
title: project_alert_management_alert
hide_title: false
hide_table_of_contents: false
keywords:
  - project_alert_management_alert
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

Gets or lists a <code>project_alert_management_alert</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_alert_management_alert" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_alert_management_alert" /></td></tr>
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
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>ID of the alert.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name or title of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the alert was created.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the alert.</td>
</tr>
<tr>
    <td><CopyableCode code="details" /></td>
    <td><code>string</code></td>
    <td>Alert details.</td>
</tr>
<tr>
    <td><CopyableCode code="details_url" /></td>
    <td><code>string</code></td>
    <td>URL of the alert detail page.</td>
</tr>
<tr>
    <td><CopyableCode code="ended_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the alert ended.</td>
</tr>
<tr>
    <td><CopyableCode code="event_count" /></td>
    <td><code>integer</code></td>
    <td>Number of events of the alert.</td>
</tr>
<tr>
    <td><CopyableCode code="hosts" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the alert.</td>
</tr>
<tr>
    <td><CopyableCode code="monitoring_tool" /></td>
    <td><code>string</code></td>
    <td>Monitoring tool the alert came from.</td>
</tr>
<tr>
    <td><CopyableCode code="runbook" /></td>
    <td><code>string</code></td>
    <td>Runbook for the alert as defined in alert details.</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>Service the alert came from.</td>
</tr>
<tr>
    <td><CopyableCode code="severity" /></td>
    <td><code>string</code></td>
    <td>Severity of the alert. (CRITICAL, HIGH, MEDIUM, LOW, INFO, UNKNOWN)</td>
</tr>
<tr>
    <td><CopyableCode code="started_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the alert was raised.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the alert. (TRIGGERED, ACKNOWLEDGED, RESOLVED, IGNORED)</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the alert.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the alert was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>URL of the alert.</td>
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
    <td><a href="#parameter-assignee_username"><code>assignee_username</code></a>, <a href="#parameter-domain"><code>domain</code></a>, <a href="#parameter-iid"><code>iid</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a></td>
    <td>A single Alert Management alert of the project. Generated from the GitLab GraphQL schema field Project.alertManagementAlert (AlertManagementAlert).</td>
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
<tr id="parameter-domain">
    <td><CopyableCode code="domain" /></td>
    <td><code>string</code></td>
    <td>Filter query for given domain.</td>
</tr>
<tr id="parameter-iid">
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>IID of the alert. For example, "1".</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for title, description, service, or monitoring_tool.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort alerts by the criteria.</td>
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

A single Alert Management alert of the project. Generated from the GitLab GraphQL schema field Project.alertManagementAlert (AlertManagementAlert).

```sql
SELECT
id,
name,
created_at,
description,
details,
details_url,
ended_at,
event_count,
hosts,
iid,
monitoring_tool,
runbook,
service,
severity,
started_at,
status,
title,
updated_at,
web_url
FROM gitlab.projects.project_alert_management_alert
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND assignee_username = '{{ assignee_username }}'
AND domain = '{{ domain }}'
AND iid = '{{ iid }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
;
```
</TabItem>
</Tabs>
