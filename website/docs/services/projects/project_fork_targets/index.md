--- 
title: project_fork_targets
hide_title: false
hide_table_of_contents: false
keywords:
  - project_fork_targets
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

Gets or lists a <code>project_fork_targets</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_fork_targets" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_fork_targets" /></td></tr>
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
    <td>ID of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="full_name" /></td>
    <td><code>string</code></td>
    <td>Full name of the namespace.</td>
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
    <td><CopyableCode code="avatar_url" /></td>
    <td><code>string</code></td>
    <td>URL to avatar image file of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="contains_locked_projects" /></td>
    <td><code>boolean</code></td>
    <td>Includes at least one project where the repository size exceeds the limit. This only applies to namespaces under Project limit enforcement.</td>
</tr>
<tr>
    <td><CopyableCode code="cross_project_pipeline_available" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the cross_project_pipeline feature is available for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="full_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="lfs_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Large File Storage (LFS) is enabled for namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="path" /></td>
    <td><code>string</code></td>
    <td>Path of the namespace.</td>
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
    <td><CopyableCode code="visibility" /></td>
    <td><code>string</code></td>
    <td>Visibility of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>URL of the namespace.</td>
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
    <td><a href="#parameter-search"><code>search</code></a></td>
    <td>Namespaces in which the current user can fork the project into. Generated from the GitLab GraphQL schema field Project.forkTargets (connection of Namespace nodes).</td>
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
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for path or name.</td>
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

Namespaces in which the current user can fork the project into. Generated from the GitLab GraphQL schema field Project.forkTargets (connection of Namespace nodes).

```sql
SELECT
id,
name,
full_name,
actual_repository_size_limit,
actual_size_limit,
additional_purchased_storage_size,
avatar_url,
contains_locked_projects,
cross_project_pipeline_available,
description,
full_path,
lfs_enabled,
path,
repository_size_excess_project_count,
request_access_enabled,
shared_runners_setting,
storage_size_limit,
total_repository_size,
total_repository_size_excess,
visibility,
web_url
FROM gitlab.projects.project_fork_targets
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND search = '{{ search }}'
;
```
</TabItem>
</Tabs>
