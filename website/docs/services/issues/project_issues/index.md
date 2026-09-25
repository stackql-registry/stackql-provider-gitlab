--- 
title: project_issues
hide_title: false
hide_table_of_contents: false
keywords:
  - project_issues
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

Gets or lists a <code>project_issues</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_issues" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.issues.project_issues" /></td></tr>
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
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-assignee_id"><code>assignee_id</code></a>, <a href="#parameter-assignee_wildcard_id"><code>assignee_wildcard_id</code></a>, <a href="#parameter-author_username"><code>author_username</code></a>, <a href="#parameter-closed_after"><code>closed_after</code></a>, <a href="#parameter-closed_before"><code>closed_before</code></a>, <a href="#parameter-confidential"><code>confidential</code></a>, <a href="#parameter-created_after"><code>created_after</code></a>, <a href="#parameter-created_before"><code>created_before</code></a>, <a href="#parameter-crm_contact_id"><code>crm_contact_id</code></a>, <a href="#parameter-crm_organization_id"><code>crm_organization_id</code></a>, <a href="#parameter-due_after"><code>due_after</code></a>, <a href="#parameter-due_before"><code>due_before</code></a>, <a href="#parameter-epic_id"><code>epic_id</code></a>, <a href="#parameter-epic_wildcard_id"><code>epic_wildcard_id</code></a>, <a href="#parameter-health_status_filter"><code>health_status_filter</code></a>, <a href="#parameter-iid"><code>iid</code></a>, <a href="#parameter-include_subepics"><code>include_subepics</code></a>, <a href="#parameter-iteration_title"><code>iteration_title</code></a>, <a href="#parameter-iteration_wildcard_id"><code>iteration_wildcard_id</code></a>, <a href="#parameter-milestone_wildcard_id"><code>milestone_wildcard_id</code></a>, <a href="#parameter-my_reaction_emoji"><code>my_reaction_emoji</code></a>, <a href="#parameter-release_tag_wildcard_id"><code>release_tag_wildcard_id</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-state"><code>state</code></a>, <a href="#parameter-subscribed"><code>subscribed</code></a>, <a href="#parameter-updated_after"><code>updated_after</code></a>, <a href="#parameter-updated_before"><code>updated_before</code></a>, <a href="#parameter-weight"><code>weight</code></a>, <a href="#parameter-weight_wildcard_id"><code>weight_wildcard_id</code></a></td>
    <td>Issues of the project. Generated from the GitLab GraphQL schema field Project.issues (connection of Issue nodes).</td>
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
<tr id="parameter-assignee_id">
    <td><CopyableCode code="assignee_id" /></td>
    <td><code>string</code></td>
    <td>ID of a user assigned to the issues. Wildcard values "NONE" and "ANY" are supported.</td>
</tr>
<tr id="parameter-assignee_wildcard_id">
    <td><CopyableCode code="assignee_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by assignee wildcard. Incompatible with assigneeUsername and assigneeUsernames.</td>
</tr>
<tr id="parameter-author_username">
    <td><CopyableCode code="author_username" /></td>
    <td><code>string</code></td>
    <td>Username of the author of the issue.</td>
</tr>
<tr id="parameter-closed_after">
    <td><CopyableCode code="closed_after" /></td>
    <td><code>string</code></td>
    <td>Issues closed after the date.</td>
</tr>
<tr id="parameter-closed_before">
    <td><CopyableCode code="closed_before" /></td>
    <td><code>string</code></td>
    <td>Issues closed before the date.</td>
</tr>
<tr id="parameter-confidential">
    <td><CopyableCode code="confidential" /></td>
    <td><code>boolean</code></td>
    <td>Filter for confidential issues. If "false", excludes confidential issues. If "true", returns only confidential issues.</td>
</tr>
<tr id="parameter-created_after">
    <td><CopyableCode code="created_after" /></td>
    <td><code>string</code></td>
    <td>Issues created after the date.</td>
</tr>
<tr id="parameter-created_before">
    <td><CopyableCode code="created_before" /></td>
    <td><code>string</code></td>
    <td>Issues created before the date.</td>
</tr>
<tr id="parameter-crm_contact_id">
    <td><CopyableCode code="crm_contact_id" /></td>
    <td><code>string</code></td>
    <td>ID of a contact assigned to the issues.</td>
</tr>
<tr id="parameter-crm_organization_id">
    <td><CopyableCode code="crm_organization_id" /></td>
    <td><code>string</code></td>
    <td>ID of an organization assigned to the issues.</td>
</tr>
<tr id="parameter-due_after">
    <td><CopyableCode code="due_after" /></td>
    <td><code>string</code></td>
    <td>Return issues due on or after the given time.</td>
</tr>
<tr id="parameter-due_before">
    <td><CopyableCode code="due_before" /></td>
    <td><code>string</code></td>
    <td>Return issues due on or before the given time.</td>
</tr>
<tr id="parameter-epic_id">
    <td><CopyableCode code="epic_id" /></td>
    <td><code>string</code></td>
    <td>ID of an epic associated with the issues, "none" and "any" values are supported.</td>
</tr>
<tr id="parameter-epic_wildcard_id">
    <td><CopyableCode code="epic_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by epic ID wildcard. Incompatible with epicId.</td>
</tr>
<tr id="parameter-health_status_filter">
    <td><CopyableCode code="health_status_filter" /></td>
    <td><code>string</code></td>
    <td>Health status of the issue, "none" and "any" values are supported.</td>
</tr>
<tr id="parameter-iid">
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>IID of the issue. For example, "1".</td>
</tr>
<tr id="parameter-include_subepics">
    <td><CopyableCode code="include_subepics" /></td>
    <td><code>boolean</code></td>
    <td>Whether to include subepics when filtering issues by epicId.</td>
</tr>
<tr id="parameter-iteration_title">
    <td><CopyableCode code="iteration_title" /></td>
    <td><code>string</code></td>
    <td>Filter by iteration title.</td>
</tr>
<tr id="parameter-iteration_wildcard_id">
    <td><CopyableCode code="iteration_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by iteration ID wildcard.</td>
</tr>
<tr id="parameter-milestone_wildcard_id">
    <td><CopyableCode code="milestone_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter issues by milestone ID wildcard.</td>
</tr>
<tr id="parameter-my_reaction_emoji">
    <td><CopyableCode code="my_reaction_emoji" /></td>
    <td><code>string</code></td>
    <td>Filter by reaction emoji applied by the current user. Wildcard values "NONE" and "ANY" are supported.</td>
</tr>
<tr id="parameter-release_tag_wildcard_id">
    <td><CopyableCode code="release_tag_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter issues by release tag ID wildcard.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for title or description.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort issues by the criteria.</td>
</tr>
<tr id="parameter-state">
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Current state of the issue.</td>
</tr>
<tr id="parameter-subscribed">
    <td><CopyableCode code="subscribed" /></td>
    <td><code>string</code></td>
    <td>Issues the current user is subscribed to.</td>
</tr>
<tr id="parameter-updated_after">
    <td><CopyableCode code="updated_after" /></td>
    <td><code>string</code></td>
    <td>Issues updated after the date.</td>
</tr>
<tr id="parameter-updated_before">
    <td><CopyableCode code="updated_before" /></td>
    <td><code>string</code></td>
    <td>Issues updated before the date.</td>
</tr>
<tr id="parameter-weight">
    <td><CopyableCode code="weight" /></td>
    <td><code>string</code></td>
    <td>Weight applied to the issue, "none" and "any" values are supported.</td>
</tr>
<tr id="parameter-weight_wildcard_id">
    <td><CopyableCode code="weight_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by weight ID wildcard. Incompatible with weight.</td>
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

Issues of the project. Generated from the GitLab GraphQL schema field Project.issues (connection of Issue nodes).

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
FROM gitlab.issues.project_issues
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND assignee_id = '{{ assignee_id }}'
AND assignee_wildcard_id = '{{ assignee_wildcard_id }}'
AND author_username = '{{ author_username }}'
AND closed_after = '{{ closed_after }}'
AND closed_before = '{{ closed_before }}'
AND confidential = '{{ confidential }}'
AND created_after = '{{ created_after }}'
AND created_before = '{{ created_before }}'
AND crm_contact_id = '{{ crm_contact_id }}'
AND crm_organization_id = '{{ crm_organization_id }}'
AND due_after = '{{ due_after }}'
AND due_before = '{{ due_before }}'
AND epic_id = '{{ epic_id }}'
AND epic_wildcard_id = '{{ epic_wildcard_id }}'
AND health_status_filter = '{{ health_status_filter }}'
AND iid = '{{ iid }}'
AND include_subepics = '{{ include_subepics }}'
AND iteration_title = '{{ iteration_title }}'
AND iteration_wildcard_id = '{{ iteration_wildcard_id }}'
AND milestone_wildcard_id = '{{ milestone_wildcard_id }}'
AND my_reaction_emoji = '{{ my_reaction_emoji }}'
AND release_tag_wildcard_id = '{{ release_tag_wildcard_id }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
AND state = '{{ state }}'
AND subscribed = '{{ subscribed }}'
AND updated_after = '{{ updated_after }}'
AND updated_before = '{{ updated_before }}'
AND weight = '{{ weight }}'
AND weight_wildcard_id = '{{ weight_wildcard_id }}'
;
```
</TabItem>
</Tabs>
