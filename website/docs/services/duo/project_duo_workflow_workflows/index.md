--- 
title: project_duo_workflow_workflows
hide_title: false
hide_table_of_contents: false
keywords:
  - project_duo_workflow_workflows
  - duo
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

Gets or lists a <code>project_duo_workflow_workflows</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_duo_workflow_workflows" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.duo.project_duo_workflow_workflows" /></td></tr>
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
    <td>ID of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name or title of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="namespace_id" /></td>
    <td><code>string</code></td>
    <td>ID of the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>ID of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="user_id" /></td>
    <td><code>string</code></td>
    <td>ID of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="status_name" /></td>
    <td><code>string</code></td>
    <td>Status name of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="agent_privileges_names" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="all_executor_logs_urls" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="allow_agent_to_request_user" /></td>
    <td><code>boolean</code></td>
    <td>Allow the agent to request user input.</td>
</tr>
<tr>
    <td><CopyableCode code="archived" /></td>
    <td><code>boolean</code></td>
    <td>Archived due to retention policy.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the session was created.</td>
</tr>
<tr>
    <td><CopyableCode code="environment" /></td>
    <td><code>string</code></td>
    <td>Environment, like IDE or web. (CHAT_PARTIAL, CHAT, AMBIENT)</td>
</tr>
<tr>
    <td><CopyableCode code="goal" /></td>
    <td><code>string</code></td>
    <td>Goal of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="human_status" /></td>
    <td><code>string</code></td>
    <td>Human-readable status of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="incremental_checkpoints_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates incremental checkpoints were enabled for the session at creation.</td>
</tr>
<tr>
    <td><CopyableCode code="last_executor_logs_url" /></td>
    <td><code>string</code></td>
    <td>URL to the latest executor logs of the workflow.</td>
</tr>
<tr>
    <td><CopyableCode code="mcp_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Has MCP been enabled for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="namespace" /></td>
    <td><code>object</code></td>
    <td>Namespace identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="pre_approved_agent_privileges_names" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="resource_iid" /></td>
    <td><code>integer</code></td>
    <td>IID of the associated resource (issue or merge request).</td>
</tr>
<tr>
    <td><CopyableCode code="resource_web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the associated resource (issue or merge request).</td>
</tr>
<tr>
    <td><CopyableCode code="stalled" /></td>
    <td><code>boolean</code></td>
    <td>Workflow got created but has no checkpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the session. (CREATED, RUNNING, PAUSED, INPUT_REQUIRED, PLAN_APPROVAL_REQUIRED, TOOL_CALL_APPROVAL_REQUIRED, STOPPED, FAILED, FINISHED)</td>
</tr>
<tr>
    <td><CopyableCode code="status_group" /></td>
    <td><code>string</code></td>
    <td>Status group of the flow session. (ACTIVE, PAUSED, AWAITING_INPUT, COMPLETED, FAILED, CANCELED)</td>
</tr>
<tr>
    <td><CopyableCode code="summary" /></td>
    <td><code>string</code></td>
    <td>Summary of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="tool_call_approvals" /></td>
    <td><code>string</code></td>
    <td>Tools approval per session policy.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the session was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="user" /></td>
    <td><code>object</code></td>
    <td>UserCore identity (id, username, name)</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>URL of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="workflow_definition" /></td>
    <td><code>string</code></td>
    <td>GitLab Duo Agent Platform flow type based on its capabilities.</td>
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
    <td><a href="#parameter-environment"><code>environment</code></a>, <a href="#parameter-project_path"><code>project_path</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-status_group"><code>status_group</code></a>, <a href="#parameter-type"><code>type</code></a>, <a href="#parameter-updated_after"><code>updated_after</code></a>, <a href="#parameter-workflow_id"><code>workflow_id</code></a></td>
    <td>GitLab Duo Agent Platform flows for a project, for all users (remote flows only). Generated from the GitLab GraphQL schema field Project.duoWorkflowWorkflows (connection of DuoWorkflow nodes).</td>
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
<tr id="parameter-environment">
    <td><CopyableCode code="environment" /></td>
    <td><code>string</code></td>
    <td>Environment, for example, IDE or web.</td>
</tr>
<tr id="parameter-project_path">
    <td><CopyableCode code="project_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the project that contains the flows.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Flow title or goal to search for.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort flows by the criteria.</td>
</tr>
<tr id="parameter-status_group">
    <td><CopyableCode code="status_group" /></td>
    <td><code>string</code></td>
    <td>Status group to filter flow sessions by.</td>
</tr>
<tr id="parameter-type">
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of flow to filter by (for example, software_development or foundational_chat_agents).</td>
</tr>
<tr id="parameter-updated_after">
    <td><CopyableCode code="updated_after" /></td>
    <td><code>string</code></td>
    <td>Filters flows updated after a given date.</td>
</tr>
<tr id="parameter-workflow_id">
    <td><CopyableCode code="workflow_id" /></td>
    <td><code>string</code></td>
    <td>Flow ID to filter by.</td>
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

GitLab Duo Agent Platform flows for a project, for all users (remote flows only). Generated from the GitLab GraphQL schema field Project.duoWorkflowWorkflows (connection of DuoWorkflow nodes).

```sql
SELECT
id,
name,
namespace_id,
project_id,
user_id,
status_name,
agent_privileges_names,
all_executor_logs_urls,
allow_agent_to_request_user,
archived,
created_at,
environment,
goal,
human_status,
incremental_checkpoints_enabled,
last_executor_logs_url,
mcp_enabled,
namespace,
pre_approved_agent_privileges_names,
project,
resource_iid,
resource_web_url,
stalled,
status,
status_group,
summary,
title,
tool_call_approvals,
updated_at,
user,
web_url,
workflow_definition
FROM gitlab.duo.project_duo_workflow_workflows
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND environment = '{{ environment }}'
AND project_path = '{{ project_path }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
AND status_group = '{{ status_group }}'
AND type = '{{ type }}'
AND updated_after = '{{ updated_after }}'
AND workflow_id = '{{ workflow_id }}'
;
```
</TabItem>
</Tabs>
