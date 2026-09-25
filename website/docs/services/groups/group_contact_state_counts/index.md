--- 
title: group_contact_state_counts
hide_title: false
hide_table_of_contents: false
keywords:
  - group_contact_state_counts
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

Gets or lists a <code>group_contact_state_counts</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_contact_state_counts" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.groups.group_contact_state_counts" /></td></tr>
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
    <td><CopyableCode code="active" /></td>
    <td><code>integer</code></td>
    <td>Number of contacts with state `ACTIVE`</td>
</tr>
<tr>
    <td><CopyableCode code="all_" /></td>
    <td><code>integer</code></td>
    <td>Number of contacts with state `ALL`</td>
</tr>
<tr>
    <td><CopyableCode code="inactive" /></td>
    <td><code>integer</code></td>
    <td>Number of contacts with state `INACTIVE`</td>
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
    <td><a href="#parameter-search"><code>search</code></a>, <a href="#parameter-state"><code>state</code></a></td>
    <td>Counts of contacts by state for the group. Generated from the GitLab GraphQL schema field Group.contactStateCounts (ContactStateCounts).</td>
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
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search term to find contacts with.</td>
</tr>
<tr id="parameter-state">
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the contacts to search for.</td>
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

Counts of contacts by state for the group. Generated from the GitLab GraphQL schema field Group.contactStateCounts (ContactStateCounts).

```sql
SELECT
active,
all_,
inactive
FROM gitlab.groups.group_contact_state_counts
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND search = '{{ search }}'
AND state = '{{ state }}'
;
```
</TabItem>
</Tabs>
