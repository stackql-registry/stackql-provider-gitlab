--- 
title: project_labels
hide_title: false
hide_table_of_contents: false
keywords:
  - project_labels
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

Gets or lists a <code>project_labels</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_labels" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_labels" /></td></tr>
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
    <td>Global ID of the label.</td>
</tr>
<tr>
    <td><CopyableCode code="archived" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the label is archived.</td>
</tr>
<tr>
    <td><CopyableCode code="color" /></td>
    <td><code>string</code></td>
    <td>Background color of the label.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>When the label was created.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the label (Markdown rendered as HTML for caching).</td>
</tr>
<tr>
    <td><CopyableCode code="lock_on_merge" /></td>
    <td><code>boolean</code></td>
    <td>Indicates this label is locked for merge requests that have been merged.</td>
</tr>
<tr>
    <td><CopyableCode code="text_color" /></td>
    <td><code>string</code></td>
    <td>Text color of the label.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Content of the label.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>When the label was last updated.</td>
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
    <td><a href="#parameter-archived"><code>archived</code></a>, <a href="#parameter-include_ancestor_groups"><code>include_ancestor_groups</code></a>, <a href="#parameter-search_term"><code>search_term</code></a>, <a href="#parameter-title"><code>title</code></a></td>
    <td>Labels available on this project. Generated from the GitLab GraphQL schema field Project.labels (connection of Label nodes).</td>
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
<tr id="parameter-archived">
    <td><CopyableCode code="archived" /></td>
    <td><code>boolean</code></td>
    <td>Filters archived labels. Defaults to false.</td>
</tr>
<tr id="parameter-include_ancestor_groups">
    <td><CopyableCode code="include_ancestor_groups" /></td>
    <td><code>boolean</code></td>
    <td>Include labels from ancestor groups.</td>
</tr>
<tr id="parameter-search_term">
    <td><CopyableCode code="search_term" /></td>
    <td><code>string</code></td>
    <td>Search term to find labels with.</td>
</tr>
<tr id="parameter-title">
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Exact match on title. Cannot be used with `searchTerm`. `searchIn` will be ignored if `title` argument is provided.</td>
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

Labels available on this project. Generated from the GitLab GraphQL schema field Project.labels (connection of Label nodes).

```sql
SELECT
id,
archived,
color,
created_at,
description,
lock_on_merge,
text_color,
title,
updated_at
FROM gitlab.projects.project_labels
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND archived = '{{ archived }}'
AND include_ancestor_groups = '{{ include_ancestor_groups }}'
AND search_term = '{{ search_term }}'
AND title = '{{ title }}'
;
```
</TabItem>
</Tabs>
