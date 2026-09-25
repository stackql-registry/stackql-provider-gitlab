--- 
title: project_duo_workflow_events
hide_title: false
hide_table_of_contents: false
keywords:
  - project_duo_workflow_events
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

Gets or lists a <code>project_duo_workflow_events</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_duo_workflow_events" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.duo.project_duo_workflow_events" /></td></tr>
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
    <td><CopyableCode code="compressed_checkpoint" /></td>
    <td><code>string</code></td>
    <td>Checkpoint of the event, zlib-compressed and Base64-encoded.</td>
</tr>
<tr>
    <td><CopyableCode code="errors" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="metadata" /></td>
    <td><code>string</code></td>
    <td>Metadata associated with the event.</td>
</tr>
<tr>
    <td><CopyableCode code="parent_ts" /></td>
    <td><code>string</code></td>
    <td>UUID v7 timestamp identifier of the parent message for branched conversations or responses.</td>
</tr>
<tr>
    <td><CopyableCode code="thread_ts" /></td>
    <td><code>string</code></td>
    <td>UUID v7 timestamp identifier for the conversation thread/session in LangGraph state management.</td>
</tr>
<tr>
    <td><CopyableCode code="workflow_definition" /></td>
    <td><code>string</code></td>
    <td>GitLab Duo Agent Platform flow type based on its capabilities.</td>
</tr>
<tr>
    <td><CopyableCode code="workflow_goal" /></td>
    <td><code>string</code></td>
    <td>Goal of the session.</td>
</tr>
<tr>
    <td><CopyableCode code="workflow_status" /></td>
    <td><code>string</code></td>
    <td>Status of the session. (CREATED, RUNNING, PAUSED, INPUT_REQUIRED, PLAN_APPROVAL_REQUIRED, TOOL_CALL_APPROVAL_REQUIRED, STOPPED, FAILED, FINISHED)</td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-workflow_id"><code>workflow_id</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Checkpoints for GitLab Duo Agent Platform flows, for all users (remote flows only). Returns only the latest checkpoint by default. Use `first` and `after` to page through history. Generated from the GitLab GraphQL schema field Project.duoWorkflowEvents (connection of DuoWorkflowEvent nodes).</td>
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
<tr id="parameter-workflow_id">
    <td><CopyableCode code="workflow_id" /></td>
    <td><code>string</code></td>
    <td>Array of request IDs to fetch.</td>
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

Checkpoints for GitLab Duo Agent Platform flows, for all users (remote flows only). Returns only the latest checkpoint by default. Use `first` and `after` to page through history. Generated from the GitLab GraphQL schema field Project.duoWorkflowEvents (connection of DuoWorkflowEvent nodes).

```sql
SELECT
compressed_checkpoint,
errors,
metadata,
parent_ts,
thread_ts,
workflow_definition,
workflow_goal,
workflow_status
FROM gitlab.duo.project_duo_workflow_events
WHERE full_path = '{{ full_path }}' -- required
AND workflow_id = '{{ workflow_id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
