--- 
title: geo_node
hide_title: false
hide_table_of_contents: false
keywords:
  - geo_node
  - admin
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

Gets or lists a <code>geo_node</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="geo_node" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.admin.geo_node" /></td></tr>
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
    <td>ID of the GeoNode.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Unique identifier for the Geo node.</td>
</tr>
<tr>
    <td><CopyableCode code="container_repositories_max_capacity" /></td>
    <td><code>integer</code></td>
    <td>Maximum concurrency of container repository sync for the secondary node.</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the Geo node is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="files_max_capacity" /></td>
    <td><code>integer</code></td>
    <td>Maximum concurrency of LFS/attachment backfill for the secondary node.</td>
</tr>
<tr>
    <td><CopyableCode code="internal_url" /></td>
    <td><code>string</code></td>
    <td>URL defined on the primary node secondary nodes should use to contact it.</td>
</tr>
<tr>
    <td><CopyableCode code="minimum_reverification_interval" /></td>
    <td><code>integer</code></td>
    <td>Interval (in days) in which the repository verification is valid. After expiry, it is reverted.</td>
</tr>
<tr>
    <td><CopyableCode code="primary_" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the Geo node is the primary.</td>
</tr>
<tr>
    <td><CopyableCode code="repos_max_capacity" /></td>
    <td><code>integer</code></td>
    <td>Maximum concurrency of repository backfill for the secondary node.</td>
</tr>
<tr>
    <td><CopyableCode code="selective_sync_shards" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="selective_sync_type" /></td>
    <td><code>string</code></td>
    <td>Indicates if syncing is limited to only specific groups, or shards.</td>
</tr>
<tr>
    <td><CopyableCode code="sync_object_storage" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the secondary node will replicate blobs in Object Storage.</td>
</tr>
<tr>
    <td><CopyableCode code="url" /></td>
    <td><code>string</code></td>
    <td>User-facing URL for the Geo node.</td>
</tr>
<tr>
    <td><CopyableCode code="verification_max_capacity" /></td>
    <td><code>integer</code></td>
    <td>Maximum concurrency of repository verification for the secondary node.</td>
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
    <td><a href="#parameter-name"><code>name</code></a></td>
    <td>Find a Geo node. Generated from the GitLab GraphQL schema field Query.geoNode (GeoNode).</td>
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
<tr id="parameter-name">
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the Geo node. Defaults to the current Geo node name.</td>
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

Find a Geo node. Generated from the GitLab GraphQL schema field Query.geoNode (GeoNode).

```sql
SELECT
id,
name,
container_repositories_max_capacity,
enabled,
files_max_capacity,
internal_url,
minimum_reverification_interval,
primary_,
repos_max_capacity,
selective_sync_shards,
selective_sync_type,
sync_object_storage,
url,
verification_max_capacity
FROM gitlab.admin.geo_node
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND name = '{{ name }}'
;
```
</TabItem>
</Tabs>
