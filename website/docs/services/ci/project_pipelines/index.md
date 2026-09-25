--- 
title: project_pipelines
hide_title: false
hide_table_of_contents: false
keywords:
  - project_pipelines
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

Gets or lists a <code>project_pipelines</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_pipelines" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.project_pipelines" /></td></tr>
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
    <td>ID of the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the pipeline is active.</td>
</tr>
<tr>
    <td><CopyableCode code="before_sha" /></td>
    <td><code>string</code></td>
    <td>Base SHA of the source branch.</td>
</tr>
<tr>
    <td><CopyableCode code="cancelable" /></td>
    <td><code>boolean</code></td>
    <td>Specifies if a pipeline can be canceled.</td>
</tr>
<tr>
    <td><CopyableCode code="child" /></td>
    <td><code>boolean</code></td>
    <td>If the pipeline is a child or not.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_path" /></td>
    <td><code>string</code></td>
    <td>Path to the commit that triggered the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="committed_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the pipeline's commit.</td>
</tr>
<tr>
    <td><CopyableCode code="complete" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a pipeline is complete.</td>
</tr>
<tr>
    <td><CopyableCode code="compute_minutes" /></td>
    <td><code>number</code></td>
    <td>Total minutes consumed by the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="config_source" /></td>
    <td><code>string</code></td>
    <td>Configuration source of the pipeline (UNKNOWN_SOURCE, REPOSITORY_SOURCE, AUTO_DEVOPS_SOURCE, WEBIDE_SOURCE, REMOTE_SOURCE, EXTERNAL_PROJECT_SOURCE, BRIDGE_SOURCE, PARAMETER_SOURCE, COMPLIANCE_SOURCE, SECURITY_POLICIES_DEFAULT_SOURCE, PIPELINE_EXECUTION_POLICY_FORCED, SECURITY_SCAN_PROFILES_SOURCE) (UNKNOWN_SOURCE, REPOSITORY_SOURCE, AUTO_DEVOPS_SOURCE, WEBIDE_SOURCE, REMOTE_SOURCE, EXTERNAL_PROJECT_SOURCE, BRIDGE_SOURCE, PARAMETER_SOURCE, COMPLIANCE_SOURCE, SECURITY_POLICIES_DEFAULT_SOURCE, PIPELINE_EXECUTION_POLICY_FORCED, SECURITY_SCAN_PROFILES_SOURCE)</td>
</tr>
<tr>
    <td><CopyableCode code="coverage" /></td>
    <td><code>number</code></td>
    <td>Coverage percentage.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the pipeline's creation.</td>
</tr>
<tr>
    <td><CopyableCode code="duration" /></td>
    <td><code>integer</code></td>
    <td>Duration of the pipeline in seconds.</td>
</tr>
<tr>
    <td><CopyableCode code="failed_jobs_count" /></td>
    <td><code>integer</code></td>
    <td>Number of failed jobs in the pipeline, including trigger jobs and external jobs.</td>
</tr>
<tr>
    <td><CopyableCode code="failure_reason" /></td>
    <td><code>string</code></td>
    <td>Reason why the pipeline failed.</td>
</tr>
<tr>
    <td><CopyableCode code="finished_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the pipeline's completion.</td>
</tr>
<tr>
    <td><CopyableCode code="has_manual_actions" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the pipeline has manual actions.</td>
</tr>
<tr>
    <td><CopyableCode code="has_scheduled_actions" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the pipeline has scheduled actions.</td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="latest" /></td>
    <td><code>boolean</code></td>
    <td>If the pipeline is the latest one or not.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_request_event_type" /></td>
    <td><code>string</code></td>
    <td>Event type of the pipeline associated with a merge request. (MERGED_RESULT, DETACHED, MERGE_TRAIN)</td>
</tr>
<tr>
    <td><CopyableCode code="path" /></td>
    <td><code>string</code></td>
    <td>Relative path to the pipeline's page.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="queued_duration" /></td>
    <td><code>string</code></td>
    <td>How long the pipeline was queued before starting.</td>
</tr>
<tr>
    <td><CopyableCode code="ref" /></td>
    <td><code>string</code></td>
    <td>Reference to the branch from which the pipeline was triggered.</td>
</tr>
<tr>
    <td><CopyableCode code="ref_path" /></td>
    <td><code>string</code></td>
    <td>Reference path to the branch from which the pipeline was triggered.</td>
</tr>
<tr>
    <td><CopyableCode code="ref_text" /></td>
    <td><code>string</code></td>
    <td>Reference text from the presenter.</td>
</tr>
<tr>
    <td><CopyableCode code="retryable" /></td>
    <td><code>boolean</code></td>
    <td>Specifies if a pipeline's jobs can be retried.</td>
</tr>
<tr>
    <td><CopyableCode code="sha" /></td>
    <td><code>string</code></td>
    <td>SHA of the pipeline's commit.</td>
</tr>
<tr>
    <td><CopyableCode code="source" /></td>
    <td><code>string</code></td>
    <td>Source of the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="started_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp when the pipeline was started.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Status of the pipeline (CREATED, WAITING_FOR_RESOURCE, PREPARING, WAITING_FOR_CALLBACK, PENDING, RUNNING, FAILED, SUCCESS, CANCELED, CANCELING, SKIPPED, MANUAL, SCHEDULED) (CREATED, WAITING_FOR_RESOURCE, PREPARING, WAITING_FOR_CALLBACK, PENDING, RUNNING, FAILED, SUCCESS, CANCELING, CANCELED, SKIPPED, MANUAL, SCHEDULED)</td>
</tr>
<tr>
    <td><CopyableCode code="stuck" /></td>
    <td><code>boolean</code></td>
    <td>If the pipeline is stuck.</td>
</tr>
<tr>
    <td><CopyableCode code="total_jobs" /></td>
    <td><code>integer</code></td>
    <td>Total number of jobs in the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="trigger" /></td>
    <td><code>boolean</code></td>
    <td>If the pipeline was created by a Trigger request.</td>
</tr>
<tr>
    <td><CopyableCode code="triggered_by_path" /></td>
    <td><code>string</code></td>
    <td>Path that triggered the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="troubleshoot_job_with_ai" /></td>
    <td><code>boolean</code></td>
    <td>If the user can troubleshoot jobs of a pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the pipeline's last activity.</td>
</tr>
<tr>
    <td><CopyableCode code="user" /></td>
    <td><code>object</code></td>
    <td>UserCore identity (id, username, name)</td>
</tr>
<tr>
    <td><CopyableCode code="uses_needs" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the pipeline has jobs with `needs` dependencies.</td>
</tr>
<tr>
    <td><CopyableCode code="warnings" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a pipeline has warnings.</td>
</tr>
<tr>
    <td><CopyableCode code="yaml_error_messages" /></td>
    <td><code>string</code></td>
    <td>Pipeline YAML errors.</td>
</tr>
<tr>
    <td><CopyableCode code="yaml_errors" /></td>
    <td><code>boolean</code></td>
    <td>If the pipeline has YAML errors.</td>
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
    <td><a href="#parameter-ref"><code>ref</code></a>, <a href="#parameter-ref_type"><code>ref_type</code></a>, <a href="#parameter-scope"><code>scope</code></a>, <a href="#parameter-sha"><code>sha</code></a>, <a href="#parameter-source"><code>source</code></a>, <a href="#parameter-status"><code>status</code></a>, <a href="#parameter-updated_after"><code>updated_after</code></a>, <a href="#parameter-updated_before"><code>updated_before</code></a>, <a href="#parameter-username"><code>username</code></a></td>
    <td>Pipelines of the project. Generated from the GitLab GraphQL schema field Project.pipelines (connection of Pipeline nodes).</td>
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
<tr id="parameter-ref">
    <td><CopyableCode code="ref" /></td>
    <td><code>string</code></td>
    <td>Filter pipelines by the ref they are run for.</td>
</tr>
<tr id="parameter-ref_type">
    <td><CopyableCode code="ref_type" /></td>
    <td><code>string</code></td>
    <td>Type of ref.</td>
</tr>
<tr id="parameter-scope">
    <td><CopyableCode code="scope" /></td>
    <td><code>string</code></td>
    <td>Filter pipelines by scope.</td>
</tr>
<tr id="parameter-sha">
    <td><CopyableCode code="sha" /></td>
    <td><code>string</code></td>
    <td>Filter pipelines by the sha of the commit they are run for.</td>
</tr>
<tr id="parameter-source">
    <td><CopyableCode code="source" /></td>
    <td><code>string</code></td>
    <td>Filter pipelines by their source.</td>
</tr>
<tr id="parameter-status">
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Filter pipelines by their status.</td>
</tr>
<tr id="parameter-updated_after">
    <td><CopyableCode code="updated_after" /></td>
    <td><code>string</code></td>
    <td>Pipelines updated after the date.</td>
</tr>
<tr id="parameter-updated_before">
    <td><CopyableCode code="updated_before" /></td>
    <td><code>string</code></td>
    <td>Pipelines updated before the date.</td>
</tr>
<tr id="parameter-username">
    <td><CopyableCode code="username" /></td>
    <td><code>string</code></td>
    <td>Filter pipelines by the user that triggered the pipeline.</td>
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

Pipelines of the project. Generated from the GitLab GraphQL schema field Project.pipelines (connection of Pipeline nodes).

```sql
SELECT
id,
name,
active,
before_sha,
cancelable,
child,
commit_path,
committed_at,
complete,
compute_minutes,
config_source,
coverage,
created_at,
duration,
failed_jobs_count,
failure_reason,
finished_at,
has_manual_actions,
has_scheduled_actions,
iid,
latest,
merge_request_event_type,
path,
project,
queued_duration,
ref,
ref_path,
ref_text,
retryable,
sha,
source,
started_at,
status,
stuck,
total_jobs,
trigger,
triggered_by_path,
troubleshoot_job_with_ai,
type,
updated_at,
user,
uses_needs,
warnings,
yaml_error_messages,
yaml_errors
FROM gitlab.ci.project_pipelines
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND ref = '{{ ref }}'
AND ref_type = '{{ ref_type }}'
AND scope = '{{ scope }}'
AND sha = '{{ sha }}'
AND source = '{{ source }}'
AND status = '{{ status }}'
AND updated_after = '{{ updated_after }}'
AND updated_before = '{{ updated_before }}'
AND username = '{{ username }}'
;
```
</TabItem>
</Tabs>
