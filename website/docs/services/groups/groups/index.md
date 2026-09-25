--- 
title: groups
hide_title: false
hide_table_of_contents: false
keywords:
  - groups
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

Gets or lists a <code>groups</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="groups" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.groups.groups" /></td></tr>
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
    <td>ID of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="full_name" /></td>
    <td><code>string</code></td>
    <td>Full name of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="actual_repository_size_limit" /></td>
    <td><code>number</code></td>
    <td>Size limit for repositories in the namespace in bytes. This limit only applies to namespaces under Project limit enforcement.</td>
</tr>
<tr>
    <td><CopyableCode code="actual_size_limit" /></td>
    <td><code>number</code></td>
    <td>The actual storage size limit (in bytes) based on the enforcement type of either repository or namespace. This limit is agnostic of enforcement type.</td>
</tr>
<tr>
    <td><CopyableCode code="additional_purchased_storage_size" /></td>
    <td><code>number</code></td>
    <td>Additional storage purchased for the root namespace in bytes.</td>
</tr>
<tr>
    <td><CopyableCode code="admin_edit_path" /></td>
    <td><code>string</code></td>
    <td>Admin path for editing group. Only available to admins.</td>
</tr>
<tr>
    <td><CopyableCode code="admin_show_path" /></td>
    <td><code>string</code></td>
    <td>Admin path of the group. Only available to admins.</td>
</tr>
<tr>
    <td><CopyableCode code="allow_stale_runner_pruning" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether to regularly prune stale group runners. Defaults to false.</td>
</tr>
<tr>
    <td><CopyableCode code="archived" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the group or any ancestor is archived.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_devops_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether Auto DevOps is enabled for all projects within the group.</td>
</tr>
<tr>
    <td><CopyableCode code="avatar_url" /></td>
    <td><code>string</code></td>
    <td>Avatar URL of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="billable_members_count" /></td>
    <td><code>integer</code></td>
    <td>Number of billable users in the group.</td>
</tr>
<tr>
    <td><CopyableCode code="contains_locked_projects" /></td>
    <td><code>boolean</code></td>
    <td>Includes at least one project where the repository size exceeds the limit. This only applies to namespaces under Project limit enforcement.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the group creation.</td>
</tr>
<tr>
    <td><CopyableCode code="cross_project_pipeline_available" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the cross_project_pipeline feature is available for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="dependency_proxy_blob_count" /></td>
    <td><code>integer</code></td>
    <td>Number of dependency proxy blobs cached in the group.</td>
</tr>
<tr>
    <td><CopyableCode code="dependency_proxy_image_count" /></td>
    <td><code>integer</code></td>
    <td>Number of dependency proxy images cached in the group.</td>
</tr>
<tr>
    <td><CopyableCode code="dependency_proxy_image_prefix" /></td>
    <td><code>string</code></td>
    <td>Prefix for pulling images when using the dependency proxy.</td>
</tr>
<tr>
    <td><CopyableCode code="dependency_proxy_total_size" /></td>
    <td><code>string</code></td>
    <td>Total size of the dependency proxy cached images.</td>
</tr>
<tr>
    <td><CopyableCode code="dependency_proxy_total_size_bytes" /></td>
    <td><code>string</code></td>
    <td>Total size of the dependency proxy cached images in bytes, encoded as a string.</td>
</tr>
<tr>
    <td><CopyableCode code="descendant_groups_count" /></td>
    <td><code>integer</code></td>
    <td>Count of direct descendant groups of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="edit_path" /></td>
    <td><code>string</code></td>
    <td>Path for editing group.</td>
</tr>
<tr>
    <td><CopyableCode code="emails_disabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a group has email notifications disabled.</td>
</tr>
<tr>
    <td><CopyableCode code="emails_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a group has email notifications enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="enforce_free_user_cap" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the group has limited users for a free plan.</td>
</tr>
<tr>
    <td><CopyableCode code="full_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="group_members_count" /></td>
    <td><code>integer</code></td>
    <td>Count of direct members of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="is_linked_to_subscription" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if group is linked to a subscription.</td>
</tr>
<tr>
    <td><CopyableCode code="is_self_archived" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the group is archived.</td>
</tr>
<tr>
    <td><CopyableCode code="lfs_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Large File Storage (LFS) is enabled for namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="lock_math_rendering_limits_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if math rendering limits are locked for all descendant groups.</td>
</tr>
<tr>
    <td><CopyableCode code="math_rendering_limits_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if math rendering limits are used for the group.</td>
</tr>
<tr>
    <td><CopyableCode code="mentions_disabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a group is disabled from getting mentioned.</td>
</tr>
<tr>
    <td><CopyableCode code="path" /></td>
    <td><code>string</code></td>
    <td>Path of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="project_creation_level" /></td>
    <td><code>string</code></td>
    <td>Permission level required to create projects in the group.</td>
</tr>
<tr>
    <td><CopyableCode code="projects_count" /></td>
    <td><code>integer</code></td>
    <td>Count of direct projects in the group.</td>
</tr>
<tr>
    <td><CopyableCode code="repository_size_excess_project_count" /></td>
    <td><code>integer</code></td>
    <td>Number of projects in the root namespace where the repository size exceeds the limit. This only applies to namespaces under Project limit enforcement.</td>
</tr>
<tr>
    <td><CopyableCode code="request_access_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if users can request access to namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="require_two_factor_authentication" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if all users in the group are required to set up two-factor authentication.</td>
</tr>
<tr>
    <td><CopyableCode code="share_with_group_lock" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if sharing a project with another group within the group is prevented.</td>
</tr>
<tr>
    <td><CopyableCode code="shared_runners_setting" /></td>
    <td><code>string</code></td>
    <td>Shared runners availability for the namespace and its descendants. (DISABLED_AND_UNOVERRIDABLE, DISABLED_AND_OVERRIDABLE, ENABLED)</td>
</tr>
<tr>
    <td><CopyableCode code="storage_size_limit" /></td>
    <td><code>number</code></td>
    <td>The storage limit (in bytes) included with the root namespace plan. This limit only applies to namespaces under namespace limit enforcement.</td>
</tr>
<tr>
    <td><CopyableCode code="subgroup_creation_level" /></td>
    <td><code>string</code></td>
    <td>Permission level required to create subgroups within the group.</td>
</tr>
<tr>
    <td><CopyableCode code="total_repository_size" /></td>
    <td><code>number</code></td>
    <td>Total repository size of all projects in the root namespace in bytes.</td>
</tr>
<tr>
    <td><CopyableCode code="total_repository_size_excess" /></td>
    <td><code>number</code></td>
    <td>Total excess repository size of all projects in the root namespace in bytes. This only applies to namespaces under Project limit enforcement.</td>
</tr>
<tr>
    <td><CopyableCode code="two_factor_grace_period" /></td>
    <td><code>integer</code></td>
    <td>Time before two-factor authentication is enforced.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the group was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="visibility" /></td>
    <td><code>string</code></td>
    <td>Visibility of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the group.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the group.</td>
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
    <td><a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-active"><code>active</code></a>, <a href="#parameter-all_available"><code>all_available</code></a>, <a href="#parameter-marked_for_deletion_on"><code>marked_for_deletion_on</code></a>, <a href="#parameter-owned_only"><code>owned_only</code></a>, <a href="#parameter-parent_path"><code>parent_path</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-top_level_only"><code>top_level_only</code></a></td>
    <td>Find groups. Generated from the GitLab GraphQL schema field Query.groups (connection of Group nodes).</td>
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
<tr id="parameter-active">
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>When `nil` (default value), returns all groups. When `true`, returns only groups that are not pending deletion. When `false`, only returns groups that are pending deletion.</td>
</tr>
<tr id="parameter-all_available">
    <td><CopyableCode code="all_available" /></td>
    <td><code>boolean</code></td>
    <td>When `true`, returns all accessible groups. When `false`, returns only groups where the user is a member. Unauthenticated requests always return all public groups. The `owned_only` argument takes precedence. </td>
</tr>
<tr id="parameter-marked_for_deletion_on">
    <td><CopyableCode code="marked_for_deletion_on" /></td>
    <td><code>string</code></td>
    <td>Date when the group was marked for deletion.</td>
</tr>
<tr id="parameter-owned_only">
    <td><CopyableCode code="owned_only" /></td>
    <td><code>boolean</code></td>
    <td>Only include groups where the current user has an owner role.</td>
</tr>
<tr id="parameter-parent_path">
    <td><CopyableCode code="parent_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the parent group.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for group name or group full path.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort order of results. Format: `&lt;field_name&gt;_&lt;sort_direction&gt;`, for example: `id_desc` or `name_asc`</td>
</tr>
<tr id="parameter-top_level_only">
    <td><CopyableCode code="top_level_only" /></td>
    <td><code>boolean</code></td>
    <td>Only include top-level groups.</td>
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

Find groups. Generated from the GitLab GraphQL schema field Query.groups (connection of Group nodes).

```sql
SELECT
id,
name,
full_name,
actual_repository_size_limit,
actual_size_limit,
additional_purchased_storage_size,
admin_edit_path,
admin_show_path,
allow_stale_runner_pruning,
archived,
auto_devops_enabled,
avatar_url,
billable_members_count,
contains_locked_projects,
created_at,
cross_project_pipeline_available,
dependency_proxy_blob_count,
dependency_proxy_image_count,
dependency_proxy_image_prefix,
dependency_proxy_total_size,
dependency_proxy_total_size_bytes,
descendant_groups_count,
description,
edit_path,
emails_disabled,
emails_enabled,
enforce_free_user_cap,
full_path,
group_members_count,
is_linked_to_subscription,
is_self_archived,
lfs_enabled,
lock_math_rendering_limits_enabled,
math_rendering_limits_enabled,
mentions_disabled,
path,
project_creation_level,
projects_count,
repository_size_excess_project_count,
request_access_enabled,
require_two_factor_authentication,
share_with_group_lock,
shared_runners_setting,
storage_size_limit,
subgroup_creation_level,
total_repository_size,
total_repository_size_excess,
two_factor_grace_period,
updated_at,
visibility,
web_path,
web_url
FROM gitlab.groups.groups
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND active = '{{ active }}'
AND all_available = '{{ all_available }}'
AND marked_for_deletion_on = '{{ marked_for_deletion_on }}'
AND owned_only = '{{ owned_only }}'
AND parent_path = '{{ parent_path }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
AND top_level_only = '{{ top_level_only }}'
;
```
</TabItem>
</Tabs>
