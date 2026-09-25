--- 
title: ci_variables
hide_title: false
hide_table_of_contents: false
keywords:
  - ci_variables
  - ci
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

Gets or lists a <code>ci_variables</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="ci_variables" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.ci_variables" /></td></tr>
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
    <td>ID of the variable.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the variable.</td>
</tr>
<tr>
    <td><CopyableCode code="hidden" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the variable is hidden.</td>
</tr>
<tr>
    <td><CopyableCode code="key" /></td>
    <td><code>string</code></td>
    <td>Name of the variable.</td>
</tr>
<tr>
    <td><CopyableCode code="masked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the variable is masked.</td>
</tr>
<tr>
    <td><CopyableCode code="protected" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the variable is protected.</td>
</tr>
<tr>
    <td><CopyableCode code="raw" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the variable is raw.</td>
</tr>
<tr>
    <td><CopyableCode code="value" /></td>
    <td><code>string</code></td>
    <td>Value of the variable.</td>
</tr>
<tr>
    <td><CopyableCode code="variable_type" /></td>
    <td><code>string</code></td>
    <td>Type of the variable. (ENV_VAR, FILE)</td>
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
    <td><a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-sort"><code>sort</code></a></td>
    <td>List of the instance's CI/CD variables. Generated from the GitLab GraphQL schema field Query.ciVariables (connection of CiInstanceVariable nodes).</td>
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
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort order of results.</td>
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

List of the instance's CI/CD variables. Generated from the GitLab GraphQL schema field Query.ciVariables (connection of CiInstanceVariable nodes).

```sql
SELECT
id,
description,
hidden,
key,
masked,
protected,
raw,
value,
variable_type
FROM gitlab.ci.ci_variables
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND sort = '{{ sort }}'
;
```
</TabItem>
</Tabs>
