--- 
title: group_work_item
hide_title: false
hide_table_of_contents: false
keywords:
  - group_work_item
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

Gets or lists a <code>group_work_item</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_work_item" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.work_items.group_work_item" /></td></tr>
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
    <td><a href="#get"><CopyableCode code="get" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-iid"><code>iid</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Find a work item by IID directly associated with the group. Generated from the GitLab GraphQL schema field Group.workItem (WorkItem).</td>
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
<tr id="parameter-iid">
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>IID of the work item.</td>
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

Find a work item by IID directly associated with the group. Generated from the GitLab GraphQL schema field Group.workItem (WorkItem).

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
FROM gitlab.work_items.group_work_item
WHERE full_path = '{{ full_path }}' -- required
AND iid = '{{ iid }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
