--- 
title: group_user_permissions
hide_title: false
hide_table_of_contents: false
keywords:
  - group_user_permissions
  - groups
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

Gets or lists a <code>group_user_permissions</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_user_permissions" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.groups.group_user_permissions" /></td></tr>
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
    <td><CopyableCode code="admin_ai_catalog_item_consumer" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_ai_catalog_item_consumer` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_all_resources" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user is an instance administrator.</td>
</tr>
<tr>
    <td><CopyableCode code="admin_issue" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_issue` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_work_item_lifecycle" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_work_item_lifecycle` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="archive_group" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `archive_group` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="can_leave" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can leave this group.</td>
</tr>
<tr>
    <td><CopyableCode code="change_group" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `change_group` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_custom_emoji" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_custom_emoji` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_projects" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_projects` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="generate_description" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `generate_description` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_crm_contact" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_crm_contact` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_crm_organization" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_crm_organization` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_group" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_group` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="remove_group" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `remove_group` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="view_edit_page" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `view_edit_page` on this resource</td>
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
    <td></td>
    <td>Permissions for the current user on the resource Generated from the GitLab GraphQL schema field Group.userPermissions (GroupPermissions).</td>
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

Permissions for the current user on the resource Generated from the GitLab GraphQL schema field Group.userPermissions (GroupPermissions).

```sql
SELECT
admin_ai_catalog_item_consumer,
admin_all_resources,
admin_issue,
admin_work_item_lifecycle,
archive_group,
can_leave,
change_group,
create_custom_emoji,
create_projects,
generate_description,
read_crm_contact,
read_crm_organization,
read_group,
remove_group,
view_edit_page
FROM gitlab.groups.group_user_permissions
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
