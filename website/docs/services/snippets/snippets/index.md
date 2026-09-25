--- 
title: snippets
hide_title: false
hide_table_of_contents: false
keywords:
  - snippets
  - snippets
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

Gets or lists a <code>snippets</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="snippets" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.snippets.snippets" /></td></tr>
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
    <td>ID of the snippet.</td>
</tr>
<tr>
    <td><CopyableCode code="file_name" /></td>
    <td><code>string</code></td>
    <td>File Name of the snippet.</td>
</tr>
<tr>
    <td><CopyableCode code="author" /></td>
    <td><code>object</code></td>
    <td>UserCore identity (id, username, name)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the snippet was created.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the snippet.</td>
</tr>
<tr>
    <td><CopyableCode code="hidden" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the snippet is hidden because the author has been banned.</td>
</tr>
<tr>
    <td><CopyableCode code="http_url_to_repo" /></td>
    <td><code>string</code></td>
    <td>HTTP URL to the snippet repository.</td>
</tr>
<tr>
    <td><CopyableCode code="imported" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the snippet was imported.</td>
</tr>
<tr>
    <td><CopyableCode code="imported_from" /></td>
    <td><code>string</code></td>
    <td>Import source of the snippet. (NONE, GITLAB_MIGRATION, GITLAB_PROJECT, GITLAB_GROUP, GITHUB, BITBUCKET, BITBUCKET_SERVER, FOGBUGZ, GITEA, GIT, MANIFEST, CUSTOM_TEMPLATE, JIRA, OFFLINE_TRANSFER)</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="raw_url" /></td>
    <td><code>string</code></td>
    <td>Raw URL of the snippet.</td>
</tr>
<tr>
    <td><CopyableCode code="ssh_url_to_repo" /></td>
    <td><code>string</code></td>
    <td>SSH URL to the snippet repository.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the snippet.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp the snippet was updated.</td>
</tr>
<tr>
    <td><CopyableCode code="visibility_level" /></td>
    <td><code>string</code></td>
    <td>Visibility Level of the snippet. (private, internal, public)</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the snippet.</td>
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
    <td><a href="#parameter-author_id"><code>author_id</code></a>, <a href="#parameter-explore"><code>explore</code></a>, <a href="#parameter-project_id"><code>project_id</code></a>, <a href="#parameter-type"><code>type</code></a>, <a href="#parameter-visibility"><code>visibility</code></a></td>
    <td>Find Snippets visible to the current user. Generated from the GitLab GraphQL schema field Query.snippets (connection of Snippet nodes).</td>
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
<tr id="parameter-author_id">
    <td><CopyableCode code="author_id" /></td>
    <td><code>string</code></td>
    <td>ID of an author.</td>
</tr>
<tr id="parameter-explore">
    <td><CopyableCode code="explore" /></td>
    <td><code>boolean</code></td>
    <td>Explore personal snippets.</td>
</tr>
<tr id="parameter-project_id">
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>ID of a project.</td>
</tr>
<tr id="parameter-type">
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of snippet.</td>
</tr>
<tr id="parameter-visibility">
    <td><CopyableCode code="visibility" /></td>
    <td><code>string</code></td>
    <td>Visibility of the snippet.</td>
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

Find Snippets visible to the current user. Generated from the GitLab GraphQL schema field Query.snippets (connection of Snippet nodes).

```sql
SELECT
id,
file_name,
author,
created_at,
description,
hidden,
http_url_to_repo,
imported,
imported_from,
project,
raw_url,
ssh_url_to_repo,
title,
updated_at,
visibility_level,
web_url
FROM gitlab.snippets.snippets
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND author_id = '{{ author_id }}'
AND explore = '{{ explore }}'
AND project_id = '{{ project_id }}'
AND type = '{{ type }}'
AND visibility = '{{ visibility }}'
;
```
</TabItem>
</Tabs>
