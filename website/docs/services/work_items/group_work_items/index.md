--- 
title: group_work_items
hide_title: false
hide_table_of_contents: false
keywords:
  - group_work_items
  - work_items
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

Gets or lists a <code>group_work_items</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_work_items" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.work_items.group_work_items" /></td></tr>
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
    <td>Global ID of the work item.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name or title of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="closed_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the work item was closed.</td>
</tr>
<tr>
    <td><CopyableCode code="confidential" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the work item is confidential.</td>
</tr>
<tr>
    <td><CopyableCode code="create_note_email" /></td>
    <td><code>string</code></td>
    <td>User specific email address for the work item.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the work item was created.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the work item.</td>
</tr>
<tr>
    <td><CopyableCode code="duplicated_to_work_item_url" /></td>
    <td><code>string</code></td>
    <td>URL of the work item that the work item is marked as a duplicate of.</td>
</tr>
<tr>
    <td><CopyableCode code="hidden" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the work item is hidden because the author has been banned.</td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the work item.</td>
</tr>
<tr>
    <td><CopyableCode code="imported" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the work item was imported.</td>
</tr>
<tr>
    <td><CopyableCode code="lock_version" /></td>
    <td><code>integer</code></td>
    <td>Lock version of the work item. Incremented each time the work item is updated.</td>
</tr>
<tr>
    <td><CopyableCode code="moved_to_work_item_url" /></td>
    <td><code>string</code></td>
    <td>URL of the work item that the work item was moved to.</td>
</tr>
<tr>
    <td><CopyableCode code="promoted_to_epic_url" /></td>
    <td><code>string</code></td>
    <td>URL of the epic that the work item has been promoted to.</td>
</tr>
<tr>
    <td><CopyableCode code="reference" /></td>
    <td><code>string</code></td>
    <td>Internal reference of the work item. Returned in shortened format by default.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the work item. (OPEN, CLOSED)</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the work item.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the work item was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="user_discussions_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user discussions in the work item.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>URL of the object.</td>
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
    <td><a href="#parameter-assignee_wildcard_id"><code>assignee_wildcard_id</code></a>, <a href="#parameter-author_username"><code>author_username</code></a>, <a href="#parameter-closed_after"><code>closed_after</code></a>, <a href="#parameter-closed_before"><code>closed_before</code></a>, <a href="#parameter-confidential"><code>confidential</code></a>, <a href="#parameter-created_after"><code>created_after</code></a>, <a href="#parameter-created_before"><code>created_before</code></a>, <a href="#parameter-crm_contact_id"><code>crm_contact_id</code></a>, <a href="#parameter-crm_organization_id"><code>crm_organization_id</code></a>, <a href="#parameter-due_after"><code>due_after</code></a>, <a href="#parameter-due_before"><code>due_before</code></a>, <a href="#parameter-health_status_filter"><code>health_status_filter</code></a>, <a href="#parameter-iid"><code>iid</code></a>, <a href="#parameter-include_ancestors"><code>include_ancestors</code></a>, <a href="#parameter-include_descendants"><code>include_descendants</code></a>, <a href="#parameter-iteration_wildcard_id"><code>iteration_wildcard_id</code></a>, <a href="#parameter-milestone_wildcard_id"><code>milestone_wildcard_id</code></a>, <a href="#parameter-my_reaction_emoji"><code>my_reaction_emoji</code></a>, <a href="#parameter-release_tag_wildcard_id"><code>release_tag_wildcard_id</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-state"><code>state</code></a>, <a href="#parameter-subscribed"><code>subscribed</code></a>, <a href="#parameter-updated_after"><code>updated_after</code></a>, <a href="#parameter-updated_before"><code>updated_before</code></a>, <a href="#parameter-weight"><code>weight</code></a>, <a href="#parameter-weight_wildcard_id"><code>weight_wildcard_id</code></a></td>
    <td>Work items that belong to the namespace. Generated from the GitLab GraphQL schema field Group.workItems (connection of WorkItem nodes).</td>
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
<tr id="parameter-assignee_wildcard_id">
    <td><CopyableCode code="assignee_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by assignee wildcard. Incompatible with `assigneeUsernames`.</td>
</tr>
<tr id="parameter-author_username">
    <td><CopyableCode code="author_username" /></td>
    <td><code>string</code></td>
    <td>Filter work items by author username.</td>
</tr>
<tr id="parameter-closed_after">
    <td><CopyableCode code="closed_after" /></td>
    <td><code>string</code></td>
    <td>Work items closed after the date.</td>
</tr>
<tr id="parameter-closed_before">
    <td><CopyableCode code="closed_before" /></td>
    <td><code>string</code></td>
    <td>Work items closed before the date.</td>
</tr>
<tr id="parameter-confidential">
    <td><CopyableCode code="confidential" /></td>
    <td><code>boolean</code></td>
    <td>Filter for confidential work items. If `false`, excludes confidential work items. If `true`, returns only confidential work items.</td>
</tr>
<tr id="parameter-created_after">
    <td><CopyableCode code="created_after" /></td>
    <td><code>string</code></td>
    <td>Work items created after the timestamp.</td>
</tr>
<tr id="parameter-created_before">
    <td><CopyableCode code="created_before" /></td>
    <td><code>string</code></td>
    <td>Work items created before the timestamp.</td>
</tr>
<tr id="parameter-crm_contact_id">
    <td><CopyableCode code="crm_contact_id" /></td>
    <td><code>string</code></td>
    <td>Filter by ID of CRM contact.</td>
</tr>
<tr id="parameter-crm_organization_id">
    <td><CopyableCode code="crm_organization_id" /></td>
    <td><code>string</code></td>
    <td>Filter by ID of CRM contact organization.</td>
</tr>
<tr id="parameter-due_after">
    <td><CopyableCode code="due_after" /></td>
    <td><code>string</code></td>
    <td>Work items due after the timestamp.</td>
</tr>
<tr id="parameter-due_before">
    <td><CopyableCode code="due_before" /></td>
    <td><code>string</code></td>
    <td>Work items due before the timestamp.</td>
</tr>
<tr id="parameter-health_status_filter">
    <td><CopyableCode code="health_status_filter" /></td>
    <td><code>string</code></td>
    <td>Health status of the work item, "none" and "any" values are supported.</td>
</tr>
<tr id="parameter-iid">
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>IID of the work item. For example, "1".</td>
</tr>
<tr id="parameter-include_ancestors">
    <td><CopyableCode code="include_ancestors" /></td>
    <td><code>boolean</code></td>
    <td>Include work items from ancestor groups. Ignored for project namespaces.</td>
</tr>
<tr id="parameter-include_descendants">
    <td><CopyableCode code="include_descendants" /></td>
    <td><code>boolean</code></td>
    <td>Include work items from descendant groups and projects. Ignored for project namespaces.</td>
</tr>
<tr id="parameter-iteration_wildcard_id">
    <td><CopyableCode code="iteration_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by iteration ID wildcard.</td>
</tr>
<tr id="parameter-milestone_wildcard_id">
    <td><CopyableCode code="milestone_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by milestone ID wildcard. Incompatible with `milestoneTitle`.</td>
</tr>
<tr id="parameter-my_reaction_emoji">
    <td><CopyableCode code="my_reaction_emoji" /></td>
    <td><code>string</code></td>
    <td>Filter by reaction emoji applied by the current user. Wildcard values `NONE` and `ANY` are supported.</td>
</tr>
<tr id="parameter-release_tag_wildcard_id">
    <td><CopyableCode code="release_tag_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by release tag wildcard.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for title or description.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort work items by criteria.</td>
</tr>
<tr id="parameter-state">
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Current state of the work item.</td>
</tr>
<tr id="parameter-subscribed">
    <td><CopyableCode code="subscribed" /></td>
    <td><code>string</code></td>
    <td>Work items the current user is subscribed to.</td>
</tr>
<tr id="parameter-updated_after">
    <td><CopyableCode code="updated_after" /></td>
    <td><code>string</code></td>
    <td>Work items updated after the timestamp.</td>
</tr>
<tr id="parameter-updated_before">
    <td><CopyableCode code="updated_before" /></td>
    <td><code>string</code></td>
    <td>Work items updated before the timestamp.</td>
</tr>
<tr id="parameter-weight">
    <td><CopyableCode code="weight" /></td>
    <td><code>string</code></td>
    <td>Weight applied to the work item, "none" and "any" values are supported.</td>
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

Work items that belong to the namespace. Generated from the GitLab GraphQL schema field Group.workItems (connection of WorkItem nodes).

```sql
SELECT
id,
name,
closed_at,
confidential,
create_note_email,
created_at,
description,
duplicated_to_work_item_url,
hidden,
iid,
imported,
lock_version,
moved_to_work_item_url,
promoted_to_epic_url,
reference,
state,
title,
updated_at,
user_discussions_count,
web_path,
web_url
FROM gitlab.work_items.group_work_items
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
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
AND health_status_filter = '{{ health_status_filter }}'
AND iid = '{{ iid }}'
AND include_ancestors = '{{ include_ancestors }}'
AND include_descendants = '{{ include_descendants }}'
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
