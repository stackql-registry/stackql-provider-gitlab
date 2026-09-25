--- 
title: project_environments
hide_title: false
hide_table_of_contents: false
keywords:
  - project_environments
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

Gets or lists a <code>project_environments</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_environments" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_environments" /></td></tr>
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
    <td>ID of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Human-readable name of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_delete_at" /></td>
    <td><code>string</code></td>
    <td>When the environment is going to be deleted automatically.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_stop_at" /></td>
    <td><code>string</code></td>
    <td>When the environment is going to be stopped automatically.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_stop_setting" /></td>
    <td><code>string</code></td>
    <td>Auto stop setting of the environment. (ALWAYS, WITH_ACTION)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>When the environment was created.</td>
</tr>
<tr>
    <td><CopyableCode code="deployments_display_count" /></td>
    <td><code>string</code></td>
    <td>Number of deployments in the environment for display. Returns the precise number up to 999, and "999+" for counts exceeding this limit.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="environment_type" /></td>
    <td><code>string</code></td>
    <td>Folder name of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="external_url" /></td>
    <td><code>string</code></td>
    <td>External URL of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="flux_resource_path" /></td>
    <td><code>string</code></td>
    <td>Flux resource path of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="kubernetes_namespace" /></td>
    <td><code>string</code></td>
    <td>Kubernetes namespace of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="path" /></td>
    <td><code>string</code></td>
    <td>Path to the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="slug" /></td>
    <td><code>string</code></td>
    <td>Slug of the environment.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the environment, for example: available/stopped.</td>
</tr>
<tr>
    <td><CopyableCode code="tier" /></td>
    <td><code>string</code></td>
    <td>Deployment tier of the environment. (PRODUCTION, STAGING, TESTING, DEVELOPMENT, OTHER)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>When the environment was updated.</td>
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
    <td><a href="#parameter-name"><code>name</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-type"><code>type</code></a></td>
    <td>Environments of the project. This field can only be resolved for one project in any single request. Generated from the GitLab GraphQL schema field Project.environments (connection of Environment nodes).</td>
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
<tr id="parameter-name">
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the environment.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for environment name.</td>
</tr>
<tr id="parameter-type">
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Search query for environment type.</td>
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

Environments of the project. This field can only be resolved for one project in any single request. Generated from the GitLab GraphQL schema field Project.environments (connection of Environment nodes).

```sql
SELECT
id,
name,
auto_delete_at,
auto_stop_at,
auto_stop_setting,
created_at,
deployments_display_count,
description,
environment_type,
external_url,
flux_resource_path,
kubernetes_namespace,
path,
slug,
state,
tier,
updated_at
FROM gitlab.projects.project_environments
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND name = '{{ name }}'
AND search = '{{ search }}'
AND type = '{{ type }}'
;
```
</TabItem>
</Tabs>
