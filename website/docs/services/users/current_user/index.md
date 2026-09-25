--- 
title: current_user
hide_title: false
hide_table_of_contents: false
keywords:
  - current_user
  - users
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

Gets or lists a <code>current_user</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="current_user" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.users.current_user" /></td></tr>
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
    <td>Global ID of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Human-readable name of the user. Returns `****` if the user is a project bot and the requester does not have permission to view the project.</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the user is active.</td>
</tr>
<tr>
    <td><CopyableCode code="admin" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the user is an instance administrator.</td>
</tr>
<tr>
    <td><CopyableCode code="avatar_url" /></td>
    <td><code>string</code></td>
    <td>URL of the user's avatar.</td>
</tr>
<tr>
    <td><CopyableCode code="bio" /></td>
    <td><code>string</code></td>
    <td>Bio of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="bot" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the user is a bot.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_email" /></td>
    <td><code>string</code></td>
    <td>User's default commit email.</td>
</tr>
<tr>
    <td><CopyableCode code="composite_identity_enforced" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if composite identity is enforced for the user.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the user was created.</td>
</tr>
<tr>
    <td><CopyableCode code="discord" /></td>
    <td><code>string</code></td>
    <td>Discord ID of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="duo_classic_chat_available" /></td>
    <td><code>boolean</code></td>
    <td>User access to GitLab Duo Chat (non-agentic) feature.</td>
</tr>
<tr>
    <td><CopyableCode code="github" /></td>
    <td><code>string</code></td>
    <td>GitHub profile name of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="gitpod_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether Ona is enabled at the user level.</td>
</tr>
<tr>
    <td><CopyableCode code="group_count" /></td>
    <td><code>integer</code></td>
    <td>Group count for the user.</td>
</tr>
<tr>
    <td><CopyableCode code="human" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the user is a regular user.</td>
</tr>
<tr>
    <td><CopyableCode code="job_title" /></td>
    <td><code>string</code></td>
    <td>Job title of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="last_activity_on" /></td>
    <td><code>string</code></td>
    <td>Date the user last performed any actions.</td>
</tr>
<tr>
    <td><CopyableCode code="linkedin" /></td>
    <td><code>string</code></td>
    <td>LinkedIn profile name of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="location" /></td>
    <td><code>string</code></td>
    <td>Location of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="namespace" /></td>
    <td><code>object</code></td>
    <td>Namespace identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="organization" /></td>
    <td><code>string</code></td>
    <td>Who the user represents or works for.</td>
</tr>
<tr>
    <td><CopyableCode code="preferences_gitpod_path" /></td>
    <td><code>string</code></td>
    <td>Web path to the Ona section within user preferences.</td>
</tr>
<tr>
    <td><CopyableCode code="profile_enable_gitpod_path" /></td>
    <td><code>string</code></td>
    <td>Web path to enable Ona for the user.</td>
</tr>
<tr>
    <td><CopyableCode code="project_count" /></td>
    <td><code>integer</code></td>
    <td>Project count for the user.</td>
</tr>
<tr>
    <td><CopyableCode code="pronouns" /></td>
    <td><code>string</code></td>
    <td>Pronouns of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="public_email" /></td>
    <td><code>string</code></td>
    <td>User's public email.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the user. (active, blocked, deactivated, banned, ldap_blocked, blocked_pending_approval)</td>
</tr>
<tr>
    <td><CopyableCode code="twitter" /></td>
    <td><code>string</code></td>
    <td>X (formerly Twitter) username of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of the user. (HUMAN, SUPPORT_BOT, ALERT_BOT, VISUAL_REVIEW_BOT, SERVICE_USER, GHOST, PROJECT_BOT, SECURITY_BOT, AUTOMATION_BOT, SECURITY_POLICY_BOT, ADMIN_BOT, SERVICE_ACCOUNT, PLACEHOLDER, DUO_CODE_REVIEW_BOT, IMPORT_USER)</td>
</tr>
<tr>
    <td><CopyableCode code="username" /></td>
    <td><code>string</code></td>
    <td>Username of the user. Unique within the instance of GitLab.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the user.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the user.</td>
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
    <td></td>
    <td>Get information about current user. Generated from the GitLab GraphQL schema field Query.currentUser (CurrentUser).</td>
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

Get information about current user. Generated from the GitLab GraphQL schema field Query.currentUser (CurrentUser).

```sql
SELECT
id,
name,
active,
admin,
avatar_url,
bio,
bot,
commit_email,
composite_identity_enforced,
created_at,
discord,
duo_classic_chat_available,
github,
gitpod_enabled,
group_count,
human,
job_title,
last_activity_on,
linkedin,
location,
namespace,
organization,
preferences_gitpod_path,
profile_enable_gitpod_path,
project_count,
pronouns,
public_email,
state,
twitter,
type,
username,
web_path,
web_url
FROM gitlab.users.current_user
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
