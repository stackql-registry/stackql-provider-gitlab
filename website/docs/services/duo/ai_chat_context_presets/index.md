--- 
title: ai_chat_context_presets
hide_title: false
hide_table_of_contents: false
keywords:
  - ai_chat_context_presets
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

Creates, updates, deletes, gets or lists an <code>ai_chat_context_presets</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="ai_chat_context_presets" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.duo.ai_chat_context_presets" /></td></tr>
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
    <td><CopyableCode code="ai_resource_data" /></td>
    <td><code>string</code></td>
    <td>Serialized representation of the AI resource in the current context.</td>
</tr>
<tr>
    <td><CopyableCode code="questions" /></td>
    <td><code>array</code></td>
    <td></td>
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
    <td><a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-project_id"><code>project_id</code></a>, <a href="#parameter-question_count"><code>question_count</code></a>, <a href="#parameter-resource_id"><code>resource_id</code></a>, <a href="#parameter-url"><code>url</code></a></td>
    <td>Get available GitLab Duo Chat context presets for the current user for a specific URL Generated from the GitLab GraphQL schema field Query.aiChatContextPresets (ContextPreset).</td>
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
<tr id="parameter-project_id">
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>Global ID of the project the user is acting on.</td>
</tr>
<tr id="parameter-question_count">
    <td><CopyableCode code="question_count" /></td>
    <td><code>integer</code></td>
    <td>Number of questions for the default screen.</td>
</tr>
<tr id="parameter-resource_id">
    <td><CopyableCode code="resource_id" /></td>
    <td><code>string</code></td>
    <td>Global ID of the resource from the current page.</td>
</tr>
<tr id="parameter-url">
    <td><CopyableCode code="url" /></td>
    <td><code>string</code></td>
    <td>URL of the page the user is currently on.</td>
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

Get available GitLab Duo Chat context presets for the current user for a specific URL Generated from the GitLab GraphQL schema field Query.aiChatContextPresets (ContextPreset).

```sql
SELECT
ai_resource_data,
questions
FROM gitlab.duo.ai_chat_context_presets
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND project_id = '{{ project_id }}'
AND question_count = '{{ question_count }}'
AND resource_id = '{{ resource_id }}'
AND url = '{{ url }}'
;
```
</TabItem>
</Tabs>
