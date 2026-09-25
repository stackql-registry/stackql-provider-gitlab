--- 
title: runners
hide_title: false
hide_table_of_contents: false
keywords:
  - runners
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

Gets or lists a <code>runners</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="runners" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.runners" /></td></tr>
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
    <td>ID of the runner.</td>
</tr>
<tr>
    <td><CopyableCode code="access_level" /></td>
    <td><code>string</code></td>
    <td>Access level of the runner. (NOT_PROTECTED, REF_PROTECTED)</td>
</tr>
<tr>
    <td><CopyableCode code="admin_url" /></td>
    <td><code>string</code></td>
    <td>Admin URL of the runner. Only available for administrators.</td>
</tr>
<tr>
    <td><CopyableCode code="contacted_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of last contact from the runner.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of creation of the runner.</td>
</tr>
<tr>
    <td><CopyableCode code="creation_state" /></td>
    <td><code>string</code></td>
    <td>Runner creation state. Used to determine if a runner has been registered and has contacted the GitLab instance. (STARTED, FINISHED)</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the runner.</td>
</tr>
<tr>
    <td><CopyableCode code="edit_admin_url" /></td>
    <td><code>string</code></td>
    <td>Admin form URL of the runner. Only available for administrators.</td>
</tr>
<tr>
    <td><CopyableCode code="job_execution_status" /></td>
    <td><code>string</code></td>
    <td>Job execution status of the runner. (IDLE, ACTIVE)</td>
</tr>
<tr>
    <td><CopyableCode code="locked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the runner is locked.</td>
</tr>
<tr>
    <td><CopyableCode code="maintenance_note" /></td>
    <td><code>string</code></td>
    <td>Runner's maintenance notes.</td>
</tr>
<tr>
    <td><CopyableCode code="maximum_timeout" /></td>
    <td><code>integer</code></td>
    <td>Maximum timeout (in seconds) for jobs processed by the runner.</td>
</tr>
<tr>
    <td><CopyableCode code="paused" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the runner is paused and not available to run jobs.</td>
</tr>
<tr>
    <td><CopyableCode code="private_projects_minutes_cost_factor" /></td>
    <td><code>number</code></td>
    <td>Private projects' "compute cost factor" associated with the runner (GitLab.com only).</td>
</tr>
<tr>
    <td><CopyableCode code="public_projects_minutes_cost_factor" /></td>
    <td><code>number</code></td>
    <td>Public projects' "compute cost factor" associated with the runner (GitLab.com only).</td>
</tr>
<tr>
    <td><CopyableCode code="register_admin_url" /></td>
    <td><code>string</code></td>
    <td>URL of the temporary registration page of the runner. Only available before the runner is registered. Only available for administrators.</td>
</tr>
<tr>
    <td><CopyableCode code="run_untagged" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the runner is able to run untagged jobs.</td>
</tr>
<tr>
    <td><CopyableCode code="runner_type" /></td>
    <td><code>string</code></td>
    <td>Type of the runner. (INSTANCE_TYPE, GROUP_TYPE, PROJECT_TYPE)</td>
</tr>
<tr>
    <td><CopyableCode code="short_sha" /></td>
    <td><code>string</code></td>
    <td>First eight characters of the runner's token used to authenticate new job requests. Used as the runner's unique ID.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the runner. (ONLINE, OFFLINE, STALE, NEVER_CONTACTED)</td>
</tr>
<tr>
    <td><CopyableCode code="tag_list" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="token_expires_at" /></td>
    <td><code>string</code></td>
    <td>Runner token expiration time.</td>
</tr>
<tr>
    <td><CopyableCode code="upgrade_status" /></td>
    <td><code>string</code></td>
    <td>Availability of upgrades for the runner. (INVALID, NOT_AVAILABLE, AVAILABLE, RECOMMENDED)</td>
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
    <td><a href="#parameter-creator_id"><code>creator_id</code></a>, <a href="#parameter-creator_username"><code>creator_username</code></a>, <a href="#parameter-paused"><code>paused</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-status"><code>status</code></a>, <a href="#parameter-type"><code>type</code></a>, <a href="#parameter-upgrade_status"><code>upgrade_status</code></a>, <a href="#parameter-version_prefix"><code>version_prefix</code></a></td>
    <td>Get all runners in the GitLab instance (project and shared). Access is restricted to users with administrator access. Generated from the GitLab GraphQL schema field Query.runners (connection of CiRunner nodes).</td>
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
<tr id="parameter-creator_id">
    <td><CopyableCode code="creator_id" /></td>
    <td><code>string</code></td>
    <td>Filter runners by creator ID.</td>
</tr>
<tr id="parameter-creator_username">
    <td><CopyableCode code="creator_username" /></td>
    <td><code>string</code></td>
    <td>Filter runners by creator username.</td>
</tr>
<tr id="parameter-paused">
    <td><CopyableCode code="paused" /></td>
    <td><code>boolean</code></td>
    <td>Filter runners by `paused` (true) or `active` (false) status.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Filter by full token or partial text in description field.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort order of results.</td>
</tr>
<tr id="parameter-status">
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Filter runners by status.</td>
</tr>
<tr id="parameter-type">
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Filter runners by type.</td>
</tr>
<tr id="parameter-upgrade_status">
    <td><CopyableCode code="upgrade_status" /></td>
    <td><code>string</code></td>
    <td>Filter by upgrade status.</td>
</tr>
<tr id="parameter-version_prefix">
    <td><CopyableCode code="version_prefix" /></td>
    <td><code>string</code></td>
    <td>Filter runners by version. Runners that contain runner managers with the version at the start of the search term are returned. For example, the search term '14.' returns runner managers with versions '14.11.1' and '14.2.3'.</td>
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

Get all runners in the GitLab instance (project and shared). Access is restricted to users with administrator access. Generated from the GitLab GraphQL schema field Query.runners (connection of CiRunner nodes).

```sql
SELECT
id,
access_level,
admin_url,
contacted_at,
created_at,
creation_state,
description,
edit_admin_url,
job_execution_status,
locked,
maintenance_note,
maximum_timeout,
paused,
private_projects_minutes_cost_factor,
public_projects_minutes_cost_factor,
register_admin_url,
run_untagged,
runner_type,
short_sha,
status,
tag_list,
token_expires_at,
upgrade_status
FROM gitlab.ci.runners
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND creator_id = '{{ creator_id }}'
AND creator_username = '{{ creator_username }}'
AND paused = '{{ paused }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
AND status = '{{ status }}'
AND type = '{{ type }}'
AND upgrade_status = '{{ upgrade_status }}'
AND version_prefix = '{{ version_prefix }}'
;
```
</TabItem>
</Tabs>
