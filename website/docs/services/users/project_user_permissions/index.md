--- 
title: project_user_permissions
hide_title: false
hide_table_of_contents: false
keywords:
  - project_user_permissions
  - users
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

Gets or lists a <code>project_user_permissions</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_user_permissions" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.users.project_user_permissions" /></td></tr>
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
    <td><CopyableCode code="admin_operations" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_operations` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_path_locks" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_path_locks` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_remote_mirror" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_remote_mirror` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_wiki" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_wiki` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="admin_work_item_lifecycle" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `admin_work_item_lifecycle` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="archive_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `archive_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="can_leave" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can leave this project.</td>
</tr>
<tr>
    <td><CopyableCode code="change_namespace" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `change_namespace` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="change_visibility_level" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `change_visibility_level` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_deployment" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_deployment` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_design" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_design` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_issue" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_issue` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_label" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_label` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_merge_request_from" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_merge_request_from` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_merge_request_in" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_merge_request_in` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_pages" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_pages` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_path_lock" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_path_lock` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_pipeline" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_pipeline` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_pipeline_schedule" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_pipeline_schedule` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_snippet" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_snippet` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_wiki" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_wiki` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="create_work_item" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `create_work_item` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="destroy_design" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `destroy_design` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="destroy_pages" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `destroy_pages` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="destroy_wiki" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `destroy_wiki` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="download_code" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `download_code` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="download_wiki_code" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `download_wiki_code` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="fork_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `fork_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="generate_description" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `generate_description` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="import_issues" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `import_issues` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="move_design" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `move_design` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="push_code" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `push_code` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="push_to_delete_protected_branch" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `push_to_delete_protected_branch` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_commit_status" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_commit_status` on this resource</td>
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
    <td><CopyableCode code="read_cycle_analytics" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_cycle_analytics` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_design" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_design` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_environment" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_environment` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_merge_request" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_merge_request` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_pages_content" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_pages_content` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_path_locks" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_path_locks` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_project_member" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_project_member` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="read_wiki" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `read_wiki` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="remove_fork_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `remove_fork_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="remove_pages" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `remove_pages` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="remove_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `remove_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="rename_project" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `rename_project` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="request_access" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `request_access` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="update_design" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `update_design` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="update_pages" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `update_pages` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="update_wiki" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `update_wiki` on this resource</td>
</tr>
<tr>
    <td><CopyableCode code="upload_file" /></td>
    <td><code>boolean</code></td>
    <td>If `true`, the user can perform `upload_file` on this resource</td>
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
    <td>Permissions for the current user on the resource Generated from the GitLab GraphQL schema field Project.userPermissions (ProjectPermissions).</td>
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

Permissions for the current user on the resource Generated from the GitLab GraphQL schema field Project.userPermissions (ProjectPermissions).

```sql
SELECT
admin_all_resources,
admin_issue,
admin_operations,
admin_path_locks,
admin_project,
admin_remote_mirror,
admin_wiki,
admin_work_item_lifecycle,
archive_project,
can_leave,
change_namespace,
change_visibility_level,
create_deployment,
create_design,
create_issue,
create_label,
create_merge_request_from,
create_merge_request_in,
create_pages,
create_path_lock,
create_pipeline,
create_pipeline_schedule,
create_snippet,
create_wiki,
create_work_item,
destroy_design,
destroy_pages,
destroy_wiki,
download_code,
download_wiki_code,
fork_project,
generate_description,
import_issues,
move_design,
push_code,
push_to_delete_protected_branch,
read_commit_status,
read_crm_contact,
read_crm_organization,
read_cycle_analytics,
read_design,
read_environment,
read_merge_request,
read_pages_content,
read_path_locks,
read_project,
read_project_member,
read_wiki,
remove_fork_project,
remove_pages,
remove_project,
rename_project,
request_access,
update_design,
update_pages,
update_wiki,
upload_file,
view_edit_page
FROM gitlab.users.project_user_permissions
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
