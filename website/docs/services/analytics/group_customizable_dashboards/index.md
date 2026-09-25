--- 
title: group_customizable_dashboards
hide_title: false
hide_table_of_contents: false
keywords:
  - group_customizable_dashboards
  - analytics
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

Gets or lists a <code>group_customizable_dashboards</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_customizable_dashboards" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.analytics.group_customizable_dashboards" /></td></tr>
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
    <td><CopyableCode code="category" /></td>
    <td><code>string</code></td>
    <td>Category of dashboard. (ANALYTICS)</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the dashboard.</td>
</tr>
<tr>
    <td><CopyableCode code="errors" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="filters" /></td>
    <td><code>string</code></td>
    <td>Dashboard global filters.</td>
</tr>
<tr>
    <td><CopyableCode code="slug" /></td>
    <td><code>string</code></td>
    <td>Slug of the dashboard.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the dashboard.</td>
</tr>
<tr>
    <td><CopyableCode code="user_defined" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the dashboard is user-defined or provided by GitLab.</td>
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
    <td><a href="#parameter-category"><code>category</code></a>, <a href="#parameter-slug"><code>slug</code></a></td>
    <td>Customizable dashboards for the group. Generated from the GitLab GraphQL schema field Group.customizableDashboards (connection of CustomizableDashboard nodes).</td>
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
<tr id="parameter-category">
    <td><CopyableCode code="category" /></td>
    <td><code>string</code></td>
    <td>Find by dashboard type.</td>
</tr>
<tr id="parameter-slug">
    <td><CopyableCode code="slug" /></td>
    <td><code>string</code></td>
    <td>Find by dashboard slug.</td>
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

Customizable dashboards for the group. Generated from the GitLab GraphQL schema field Group.customizableDashboards (connection of CustomizableDashboard nodes).

```sql
SELECT
category,
description,
errors,
filters,
slug,
title,
user_defined
FROM gitlab.analytics.group_customizable_dashboards
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND category = '{{ category }}'
AND slug = '{{ slug }}'
;
```
</TabItem>
</Tabs>
