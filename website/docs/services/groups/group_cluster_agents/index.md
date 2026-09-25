--- 
title: group_cluster_agents
hide_title: false
hide_table_of_contents: false
keywords:
  - group_cluster_agents
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

Gets or lists a <code>group_cluster_agents</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_cluster_agents" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.groups.group_cluster_agents" /></td></tr>
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
    <td>ID of the cluster agent.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the cluster agent.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the cluster agent was created.</td>
</tr>
<tr>
    <td><CopyableCode code="is_receptive" /></td>
    <td><code>boolean</code></td>
    <td>Whether the cluster agent is receptive or not.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the cluster agent was updated.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the cluster agent.</td>
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
    <td><a href="#parameter-has_remote_development_enabled"><code>has_remote_development_enabled</code></a>, <a href="#parameter-has_vulnerabilities"><code>has_vulnerabilities</code></a>, <a href="#parameter-has_workspaces_agent_config"><code>has_workspaces_agent_config</code></a></td>
    <td>Cluster agents associated with projects in the group and its subgroups. Generated from the GitLab GraphQL schema field Group.clusterAgents (connection of ClusterAgent nodes).</td>
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
<tr id="parameter-has_remote_development_enabled">
    <td><CopyableCode code="has_remote_development_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Returns only cluster agents which have been enabled with the remote development feature.</td>
</tr>
<tr id="parameter-has_vulnerabilities">
    <td><CopyableCode code="has_vulnerabilities" /></td>
    <td><code>boolean</code></td>
    <td>Returns only cluster agents which have vulnerabilities.</td>
</tr>
<tr id="parameter-has_workspaces_agent_config">
    <td><CopyableCode code="has_workspaces_agent_config" /></td>
    <td><code>boolean</code></td>
    <td>Returns only cluster agents which have an associated workspaces agent config.</td>
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

Cluster agents associated with projects in the group and its subgroups. Generated from the GitLab GraphQL schema field Group.clusterAgents (connection of ClusterAgent nodes).

```sql
SELECT
id,
name,
created_at,
is_receptive,
project,
updated_at,
web_path
FROM gitlab.groups.group_cluster_agents
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND has_remote_development_enabled = '{{ has_remote_development_enabled }}'
AND has_vulnerabilities = '{{ has_vulnerabilities }}'
AND has_workspaces_agent_config = '{{ has_workspaces_agent_config }}'
;
```
</TabItem>
</Tabs>
