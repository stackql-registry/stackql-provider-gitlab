--- 
title: project_sentry_detailed_error
hide_title: false
hide_table_of_contents: false
keywords:
  - project_sentry_detailed_error
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

Gets or lists a <code>project_sentry_detailed_error</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_sentry_detailed_error" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_sentry_detailed_error" /></td></tr>
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
    <td>ID (global ID) of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="sentry_id" /></td>
    <td><code>string</code></td>
    <td>ID (Sentry ID) of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="sentry_project_id" /></td>
    <td><code>string</code></td>
    <td>ID of the project (Sentry project).</td>
</tr>
<tr>
    <td><CopyableCode code="short_id" /></td>
    <td><code>string</code></td>
    <td>Short ID (Sentry ID) of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="sentry_project_name" /></td>
    <td><code>string</code></td>
    <td>Name of the project affected by the error.</td>
</tr>
<tr>
    <td><CopyableCode code="count" /></td>
    <td><code>integer</code></td>
    <td>Count of occurrences.</td>
</tr>
<tr>
    <td><CopyableCode code="culprit" /></td>
    <td><code>string</code></td>
    <td>Culprit of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="external_base_url" /></td>
    <td><code>string</code></td>
    <td>External Base URL of the Sentry Instance.</td>
</tr>
<tr>
    <td><CopyableCode code="external_url" /></td>
    <td><code>string</code></td>
    <td>External URL of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="first_release_last_commit" /></td>
    <td><code>string</code></td>
    <td>Commit the error was first seen.</td>
</tr>
<tr>
    <td><CopyableCode code="first_release_short_version" /></td>
    <td><code>string</code></td>
    <td>Release short version the error was first seen.</td>
</tr>
<tr>
    <td><CopyableCode code="first_release_version" /></td>
    <td><code>string</code></td>
    <td>Release version the error was first seen.</td>
</tr>
<tr>
    <td><CopyableCode code="first_seen" /></td>
    <td><code>string</code></td>
    <td>Timestamp when the error was first seen.</td>
</tr>
<tr>
    <td><CopyableCode code="gitlab_commit" /></td>
    <td><code>string</code></td>
    <td>GitLab commit SHA attributed to the Error based on the release version.</td>
</tr>
<tr>
    <td><CopyableCode code="gitlab_commit_path" /></td>
    <td><code>string</code></td>
    <td>Path to the GitLab page for the GitLab commit attributed to the error.</td>
</tr>
<tr>
    <td><CopyableCode code="gitlab_issue_path" /></td>
    <td><code>string</code></td>
    <td>URL of GitLab Issue.</td>
</tr>
<tr>
    <td><CopyableCode code="integrated" /></td>
    <td><code>boolean</code></td>
    <td>Error tracking backend.</td>
</tr>
<tr>
    <td><CopyableCode code="last_release_last_commit" /></td>
    <td><code>string</code></td>
    <td>Commit the error was last seen.</td>
</tr>
<tr>
    <td><CopyableCode code="last_release_short_version" /></td>
    <td><code>string</code></td>
    <td>Release short version the error was last seen.</td>
</tr>
<tr>
    <td><CopyableCode code="last_release_version" /></td>
    <td><code>string</code></td>
    <td>Release version the error was last seen.</td>
</tr>
<tr>
    <td><CopyableCode code="last_seen" /></td>
    <td><code>string</code></td>
    <td>Timestamp when the error was last seen.</td>
</tr>
<tr>
    <td><CopyableCode code="message" /></td>
    <td><code>string</code></td>
    <td>Sentry metadata message of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="sentry_project_slug" /></td>
    <td><code>string</code></td>
    <td>Slug of the project affected by the error.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the error. (RESOLVED, RESOLVED_IN_NEXT_RELEASE, UNRESOLVED, IGNORED)</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of the error.</td>
</tr>
<tr>
    <td><CopyableCode code="user_count" /></td>
    <td><code>integer</code></td>
    <td>Count of users affected by the error.</td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-id"><code>id</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Detailed version of a Sentry error on the project. Generated from the GitLab GraphQL schema field Project.sentryDetailedError (SentryDetailedError).</td>
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
<tr id="parameter-id">
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>ID of the Sentry issue.</td>
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

Detailed version of a Sentry error on the project. Generated from the GitLab GraphQL schema field Project.sentryDetailedError (SentryDetailedError).

```sql
SELECT
id,
sentry_id,
sentry_project_id,
short_id,
sentry_project_name,
count,
culprit,
external_base_url,
external_url,
first_release_last_commit,
first_release_short_version,
first_release_version,
first_seen,
gitlab_commit,
gitlab_commit_path,
gitlab_issue_path,
integrated,
last_release_last_commit,
last_release_short_version,
last_release_version,
last_seen,
message,
sentry_project_slug,
status,
title,
type,
user_count
FROM gitlab.projects.project_sentry_detailed_error
WHERE full_path = '{{ full_path }}' -- required
AND id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
