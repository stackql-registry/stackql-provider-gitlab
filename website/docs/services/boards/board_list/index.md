--- 
title: board_list
hide_title: false
hide_table_of_contents: false
keywords:
  - board_list
  - boards
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

Gets or lists a <code>board_list</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="board_list" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.boards.board_list" /></td></tr>
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
    <td>ID (global ID) of the list.</td>
</tr>
<tr>
    <td><CopyableCode code="collapsed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the list is collapsed for the user.</td>
</tr>
<tr>
    <td><CopyableCode code="issues_count" /></td>
    <td><code>integer</code></td>
    <td>Count of issues in the list.</td>
</tr>
<tr>
    <td><CopyableCode code="limit_metric" /></td>
    <td><code>string</code></td>
    <td>Current limit metric for the list. (all_metrics, issue_count, issue_weights)</td>
</tr>
<tr>
    <td><CopyableCode code="list_type" /></td>
    <td><code>string</code></td>
    <td>Type of the list.</td>
</tr>
<tr>
    <td><CopyableCode code="max_issue_count" /></td>
    <td><code>integer</code></td>
    <td>Maximum number of issues in the list.</td>
</tr>
<tr>
    <td><CopyableCode code="max_issue_weight" /></td>
    <td><code>integer</code></td>
    <td>Maximum weight of issues in the list.</td>
</tr>
<tr>
    <td><CopyableCode code="milestone" /></td>
    <td><code>object</code></td>
    <td>Milestone identity (id, title)</td>
</tr>
<tr>
    <td><CopyableCode code="position" /></td>
    <td><code>integer</code></td>
    <td>Position of list within the board.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the list.</td>
</tr>
<tr>
    <td><CopyableCode code="total_issue_weight" /></td>
    <td><code>string</code></td>
    <td>Total weight of all issues in the list, encoded as a string.</td>
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
    <td>Find an issue board list. Generated from the GitLab GraphQL schema field Query.boardList (BoardList).</td>
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
    <td>Global ID of the list.</td>
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

Find an issue board list. Generated from the GitLab GraphQL schema field Query.boardList (BoardList).

```sql
SELECT
id,
collapsed,
issues_count,
limit_metric,
list_type,
max_issue_count,
max_issue_weight,
milestone,
position,
title,
total_issue_weight
FROM gitlab.boards.board_list
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
