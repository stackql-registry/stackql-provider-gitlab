--- 
title: issue
hide_title: false
hide_table_of_contents: false
keywords:
  - issue
  - issues
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

Creates, updates, deletes, gets or lists an <code>issue</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="issue" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.issues.issue" /></td></tr>
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
    <td>ID of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name or title of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="project_id" /></td>
    <td><code>integer</code></td>
    <td>ID of the issue project.</td>
</tr>
<tr>
    <td><CopyableCode code="author" /></td>
    <td><code>object</code></td>
    <td>UserCore identity (id, username, name)</td>
</tr>
<tr>
    <td><CopyableCode code="blocked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the issue is blocked.</td>
</tr>
<tr>
    <td><CopyableCode code="blocked_by_count" /></td>
    <td><code>integer</code></td>
    <td>Count of issues blocking the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="blocking_count" /></td>
    <td><code>integer</code></td>
    <td>Count of issues the issue is blocking.</td>
</tr>
<tr>
    <td><CopyableCode code="closed_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the issue was closed.</td>
</tr>
<tr>
    <td><CopyableCode code="confidential" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the issue is confidential.</td>
</tr>
<tr>
    <td><CopyableCode code="create_note_email" /></td>
    <td><code>string</code></td>
    <td>User specific email address for the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the issue was created.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="discussion_locked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates discussion is locked on the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="downvotes" /></td>
    <td><code>integer</code></td>
    <td>Number of downvotes the issue has received.</td>
</tr>
<tr>
    <td><CopyableCode code="due_date" /></td>
    <td><code>string</code></td>
    <td>Due date of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="emails_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the parent project or group has email notifications disabled: `false` if email notifications are disabled.</td>
</tr>
<tr>
    <td><CopyableCode code="escalation_status" /></td>
    <td><code>string</code></td>
    <td>Escalation status of the issue. (TRIGGERED, ACKNOWLEDGED, RESOLVED, IGNORED)</td>
</tr>
<tr>
    <td><CopyableCode code="external_author" /></td>
    <td><code>string</code></td>
    <td>Email address of non-GitLab user reporting the issue. For guests, the email address is obfuscated.</td>
</tr>
<tr>
    <td><CopyableCode code="has_epic" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the issue belongs to an epic.             Can return true and not show an associated epic when the user has no access to the epic.</td>
</tr>
<tr>
    <td><CopyableCode code="health_status" /></td>
    <td><code>string</code></td>
    <td>Current health status. (onTrack, needsAttention, atRisk)</td>
</tr>
<tr>
    <td><CopyableCode code="hidden" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the issue is hidden because the author has been banned.</td>
</tr>
<tr>
    <td><CopyableCode code="human_time_estimate" /></td>
    <td><code>string</code></td>
    <td>Human-readable time estimate of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="human_total_time_spent" /></td>
    <td><code>string</code></td>
    <td>Human-readable total time reported as spent on the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_count" /></td>
    <td><code>integer</code></td>
    <td>Number of merge requests that close the issue on merge.</td>
</tr>
<tr>
    <td><CopyableCode code="milestone" /></td>
    <td><code>object</code></td>
    <td>Milestone identity (id, title)</td>
</tr>
<tr>
    <td><CopyableCode code="moved" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if issue got moved from other project.</td>
</tr>
<tr>
    <td><CopyableCode code="reference" /></td>
    <td><code>string</code></td>
    <td>Internal reference of the issue. Returned in shortened format by default.</td>
</tr>
<tr>
    <td><CopyableCode code="relative_position" /></td>
    <td><code>integer</code></td>
    <td>Relative position of the issue (used for positioning in epic tree and issue boards).</td>
</tr>
<tr>
    <td><CopyableCode code="severity" /></td>
    <td><code>string</code></td>
    <td>Severity level of the incident. (UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL)</td>
</tr>
<tr>
    <td><CopyableCode code="sla_due_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the issue SLA expires.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the issue. (opened, closed, locked, all)</td>
</tr>
<tr>
    <td><CopyableCode code="status_page_published_incident" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether an issue is published to the status page.</td>
</tr>
<tr>
    <td><CopyableCode code="subscribed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the currently logged in user is subscribed to the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="time_estimate" /></td>
    <td><code>integer</code></td>
    <td>Time estimate of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="total_time_spent" /></td>
    <td><code>integer</code></td>
    <td>Total time (in seconds) reported as spent on the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of the issue. (ISSUE, INCIDENT, TEST_CASE, REQUIREMENT, TASK, TICKET)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the issue was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="upvotes" /></td>
    <td><code>integer</code></td>
    <td>Number of upvotes the issue has received.</td>
</tr>
<tr>
    <td><CopyableCode code="user_discussions_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user discussions in the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="user_notes_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user notes of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the issue.</td>
</tr>
<tr>
    <td><CopyableCode code="weight" /></td>
    <td><code>integer</code></td>
    <td>Weight of the issue.</td>
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
    <td><a href="#parameter-id"><code>id</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Find an issue. Generated from the GitLab GraphQL schema field Query.issue (Issue).</td>
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
<tr id="parameter-id">
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>Global ID of the issue.</td>
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

Find an issue. Generated from the GitLab GraphQL schema field Query.issue (Issue).

```sql
SELECT
id,
name,
project_id,
author,
blocked,
blocked_by_count,
blocking_count,
closed_at,
confidential,
create_note_email,
created_at,
description,
discussion_locked,
downvotes,
due_date,
emails_enabled,
escalation_status,
external_author,
has_epic,
health_status,
hidden,
human_time_estimate,
human_total_time_spent,
iid,
merge_requests_count,
milestone,
moved,
reference,
relative_position,
severity,
sla_due_at,
state,
status_page_published_incident,
subscribed,
time_estimate,
title,
total_time_spent,
type,
updated_at,
upvotes,
user_discussions_count,
user_notes_count,
web_path,
web_url,
weight
FROM gitlab.issues.issue
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
