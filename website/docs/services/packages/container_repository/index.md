--- 
title: container_repository
hide_title: false
hide_table_of_contents: false
keywords:
  - container_repository
  - packages
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

Gets or lists a <code>container_repository</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="container_repository" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.packages.container_repository" /></td></tr>
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
    <td>ID of the container repository.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the container repository.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp when the container repository was created.</td>
</tr>
<tr>
    <td><CopyableCode code="expiration_policy_cleanup_status" /></td>
    <td><code>string</code></td>
    <td>Tags cleanup status for the container repository. (UNSCHEDULED, SCHEDULED, UNFINISHED, ONGOING)</td>
</tr>
<tr>
    <td><CopyableCode code="expiration_policy_started_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp when the cleanup done by the expiration policy was started on the container repository.</td>
</tr>
<tr>
    <td><CopyableCode code="last_cleanup_deleted_tags_count" /></td>
    <td><code>integer</code></td>
    <td>Number of deleted tags from the last cleanup.</td>
</tr>
<tr>
    <td><CopyableCode code="last_published_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp when a repository tag was last created or updated. Only present for repositories that had tags created or updated after GitLab 16.11.</td>
</tr>
<tr>
    <td><CopyableCode code="location" /></td>
    <td><code>string</code></td>
    <td>URL of the container repository.</td>
</tr>
<tr>
    <td><CopyableCode code="path" /></td>
    <td><code>string</code></td>
    <td>Path of the container repository.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="protection_rule_exists" /></td>
    <td><code>boolean</code></td>
    <td>Whether any matching container protection rule exists for the container repository.</td>
</tr>
<tr>
    <td><CopyableCode code="size" /></td>
    <td><code>number</code></td>
    <td>Deduplicated size of the image repository in bytes. This is only available on GitLab.com for repositories created after `2021-11-04`.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the container repository. (DELETE_SCHEDULED, DELETE_FAILED, DELETE_ONGOING)</td>
</tr>
<tr>
    <td><CopyableCode code="tags_count" /></td>
    <td><code>integer</code></td>
    <td>Number of tags associated with the image.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp when the container repository was updated.</td>
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
    <td>Find a container repository. Generated from the GitLab GraphQL schema field Query.containerRepository (ContainerRepositoryDetails).</td>
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
    <td>Global ID of the container repository.</td>
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

Find a container repository. Generated from the GitLab GraphQL schema field Query.containerRepository (ContainerRepositoryDetails).

```sql
SELECT
id,
name,
created_at,
expiration_policy_cleanup_status,
expiration_policy_started_at,
last_cleanup_deleted_tags_count,
last_published_at,
location,
path,
project,
protection_rule_exists,
size,
status,
tags_count,
updated_at
FROM gitlab.packages.container_repository
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
