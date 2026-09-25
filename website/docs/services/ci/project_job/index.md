--- 
title: project_job
hide_title: false
hide_table_of_contents: false
keywords:
  - project_job
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

Gets or lists a <code>project_job</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_job" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.project_job" /></td></tr>
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
    <td>ID of the job.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the job.</td>
</tr>
<tr>
    <td><CopyableCode code="ref_name" /></td>
    <td><code>string</code></td>
    <td>Ref name of the job.</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the job is active.</td>
</tr>
<tr>
    <td><CopyableCode code="allow_failure" /></td>
    <td><code>boolean</code></td>
    <td>Whether the job is allowed to fail.</td>
</tr>
<tr>
    <td><CopyableCode code="browse_artifacts_path" /></td>
    <td><code>string</code></td>
    <td>URL for browsing the artifact's archive.</td>
</tr>
<tr>
    <td><CopyableCode code="can_play_job" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the current user can play the job.</td>
</tr>
<tr>
    <td><CopyableCode code="cancelable" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the job can be canceled.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_path" /></td>
    <td><code>string</code></td>
    <td>Path to the commit that triggered the job.</td>
</tr>
<tr>
    <td><CopyableCode code="coverage" /></td>
    <td><code>number</code></td>
    <td>Coverage level of the job.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>When the job was created.</td>
</tr>
<tr>
    <td><CopyableCode code="created_by_tag" /></td>
    <td><code>boolean</code></td>
    <td>Whether the job was created by a tag.</td>
</tr>
<tr>
    <td><CopyableCode code="duration" /></td>
    <td><code>integer</code></td>
    <td>Duration of the job in seconds.</td>
</tr>
<tr>
    <td><CopyableCode code="erased_at" /></td>
    <td><code>string</code></td>
    <td>When the job was erased.</td>
</tr>
<tr>
    <td><CopyableCode code="exit_code" /></td>
    <td><code>integer</code></td>
    <td>Exit code of the job. Available for jobs that started after upgrading to GitLab 16.10 and failed with an exit code.</td>
</tr>
<tr>
    <td><CopyableCode code="failure_message" /></td>
    <td><code>string</code></td>
    <td>Message on why the job failed.</td>
</tr>
<tr>
    <td><CopyableCode code="finished_at" /></td>
    <td><code>string</code></td>
    <td>When a job has finished running.</td>
</tr>
<tr>
    <td><CopyableCode code="kind" /></td>
    <td><code>string</code></td>
    <td>Indicates the type of job. (BUILD, BRIDGE)</td>
</tr>
<tr>
    <td><CopyableCode code="manual_job" /></td>
    <td><code>boolean</code></td>
    <td>Whether the job has a manual action.</td>
</tr>
<tr>
    <td><CopyableCode code="play_path" /></td>
    <td><code>string</code></td>
    <td>Play path of the job.</td>
</tr>
<tr>
    <td><CopyableCode code="playable" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the job can be played.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="queued_at" /></td>
    <td><code>string</code></td>
    <td>When the job was enqueued and marked as pending.</td>
</tr>
<tr>
    <td><CopyableCode code="queued_duration" /></td>
    <td><code>string</code></td>
    <td>How long the job was enqueued before starting.</td>
</tr>
<tr>
    <td><CopyableCode code="ref_path" /></td>
    <td><code>string</code></td>
    <td>Path to the ref.</td>
</tr>
<tr>
    <td><CopyableCode code="retried" /></td>
    <td><code>boolean</code></td>
    <td>Indicates that the job has been retried.</td>
</tr>
<tr>
    <td><CopyableCode code="retry_path" /></td>
    <td><code>string</code></td>
    <td>Retry path of the job.</td>
</tr>
<tr>
    <td><CopyableCode code="retryable" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the job can be retried.</td>
</tr>
<tr>
    <td><CopyableCode code="scheduled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the job is scheduled.</td>
</tr>
<tr>
    <td><CopyableCode code="scheduled_at" /></td>
    <td><code>string</code></td>
    <td>Schedule for the build.</td>
</tr>
<tr>
    <td><CopyableCode code="scheduling_type" /></td>
    <td><code>string</code></td>
    <td>Type of job scheduling. Value is `dag` if the job uses the `needs` keyword, and `stage` otherwise.</td>
</tr>
<tr>
    <td><CopyableCode code="short_sha" /></td>
    <td><code>string</code></td>
    <td>Short SHA1 ID of the commit.</td>
</tr>
<tr>
    <td><CopyableCode code="source" /></td>
    <td><code>string</code></td>
    <td>Policy or action that initiated the job. If not set, the value is inherited from the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="started_at" /></td>
    <td><code>string</code></td>
    <td>When the job was started.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the job. (CREATED, WAITING_FOR_RESOURCE, PREPARING, WAITING_FOR_CALLBACK, PENDING, RUNNING, SUCCESS, FAILED, CANCELING, CANCELED, SKIPPED, MANUAL, SCHEDULED)</td>
</tr>
<tr>
    <td><CopyableCode code="stuck" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the job is stuck.</td>
</tr>
<tr>
    <td><CopyableCode code="tags" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="triggered" /></td>
    <td><code>boolean</code></td>
    <td>Whether the job was triggered.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the job.</td>
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
    <td>One job belonging to the project, selected by ID. Generated from the GitLab GraphQL schema field Project.job (CiJob).</td>
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
    <td>ID of the job.</td>
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

One job belonging to the project, selected by ID. Generated from the GitLab GraphQL schema field Project.job (CiJob).

```sql
SELECT
id,
name,
ref_name,
active,
allow_failure,
browse_artifacts_path,
can_play_job,
cancelable,
commit_path,
coverage,
created_at,
created_by_tag,
duration,
erased_at,
exit_code,
failure_message,
finished_at,
kind,
manual_job,
play_path,
playable,
project,
queued_at,
queued_duration,
ref_path,
retried,
retry_path,
retryable,
scheduled,
scheduled_at,
scheduling_type,
short_sha,
source,
started_at,
status,
stuck,
tags,
triggered,
web_path
FROM gitlab.ci.project_job
WHERE full_path = '{{ full_path }}' -- required
AND id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
