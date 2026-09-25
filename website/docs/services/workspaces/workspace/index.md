--- 
title: workspace
hide_title: false
hide_table_of_contents: false
keywords:
  - workspace
  - workspaces
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

Gets or lists a <code>workspace</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="workspace" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.workspaces.workspace" /></td></tr>
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
    <td>Global ID of the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the workspace in Kubernetes.</td>
</tr>
<tr>
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>ID of the project that contains the devfile for the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="actual_state" /></td>
    <td><code>string</code></td>
    <td>Actual state of the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the workspace was created.</td>
</tr>
<tr>
    <td><CopyableCode code="deployment_resource_version" /></td>
    <td><code>integer</code></td>
    <td>Version of the deployment resource for the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="desired_state" /></td>
    <td><code>string</code></td>
    <td>Desired state of the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="desired_state_updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the last update to the desired state.</td>
</tr>
<tr>
    <td><CopyableCode code="devfile" /></td>
    <td><code>string</code></td>
    <td>Source YAML of the devfile used to configure the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="devfile_path" /></td>
    <td><code>string</code></td>
    <td>Path to the devfile used to configure the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="namespace" /></td>
    <td><code>string</code></td>
    <td>Namespace of the workspace in Kubernetes.</td>
</tr>
<tr>
    <td><CopyableCode code="processed_devfile" /></td>
    <td><code>string</code></td>
    <td>Processed YAML of the devfile used to configure the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="project_ref" /></td>
    <td><code>string</code></td>
    <td>Git reference that contains the devfile used to configure the workspace, and that will be cloned into the workspace</td>
</tr>
<tr>
    <td><CopyableCode code="responded_to_agent_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the last response sent to the GitLab agent for Kubernetes for the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the last update to any mutable workspace property.</td>
</tr>
<tr>
    <td><CopyableCode code="url" /></td>
    <td><code>string</code></td>
    <td>URL of the workspace.</td>
</tr>
<tr>
    <td><CopyableCode code="user" /></td>
    <td><code>object</code></td>
    <td>UserCore identity (id, username, name)</td>
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
    <td>Find a workspace. Generated from the GitLab GraphQL schema field Query.workspace (Workspace).</td>
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
    <td>Find a workspace by its ID.</td>
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

Find a workspace. Generated from the GitLab GraphQL schema field Query.workspace (Workspace).

```sql
SELECT
id,
name,
project_id,
actual_state,
created_at,
deployment_resource_version,
desired_state,
desired_state_updated_at,
devfile,
devfile_path,
namespace,
processed_devfile,
project_ref,
responded_to_agent_at,
updated_at,
url,
user
FROM gitlab.workspaces.workspace
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
