--- 
title: project_ci_cd_settings
hide_title: false
hide_table_of_contents: false
keywords:
  - project_ci_cd_settings
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

Gets or lists a <code>project_ci_cd_settings</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_ci_cd_settings" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.project_ci_cd_settings" /></td></tr>
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
    <td><CopyableCode code="cross_project_push_for_job_token_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the ability to push to this repository using a job token from an allowlisted project</td>
</tr>
<tr>
    <td><CopyableCode code="display_pipeline_variables" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether pipeline variables can be displayed in the UI.</td>
</tr>
<tr>
    <td><CopyableCode code="group_runners_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether group runners are enabled for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="inbound_job_token_scope_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether CI/CD job tokens generated in other projects have restricted access to this project.</td>
</tr>
<tr>
    <td><CopyableCode code="job_token_scope_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether CI/CD job tokens generated in this project have restricted access to other projects.</td>
</tr>
<tr>
    <td><CopyableCode code="keep_latest_artifact" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the latest artifact should be kept for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="max_pipelines_per_merge_train" /></td>
    <td><code>integer</code></td>
    <td>Maximum number of parallel pipelines per merge train. When null, the plan limit applies.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_pipelines_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether merged results pipelines are enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_train_enforcement" /></td>
    <td><code>string</code></td>
    <td>Merge train enforcement level for the project. Ignored unless the `merge_train_enforcement` feature flag is enabled. (ALLOW_BYPASS, ENFORCE_FOR_ALL_USERS, ENFORCE_WITH_OWNER_OVERRIDE)</td>
</tr>
<tr>
    <td><CopyableCode code="merge_trains_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether merge trains are enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_trains_skip_train_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Whether merge immediately is allowed for merge trains.</td>
</tr>
<tr>
    <td><CopyableCode code="pipeline_variables_minimum_override_role" /></td>
    <td><code>string</code></td>
    <td>Minimum role required to set variables when creating a pipeline or running a job.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="push_repository_for_job_token_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the ability to push to the original project repository using a job token</td>
</tr>
<tr>
    <td><CopyableCode code="resource_group_default_process_mode" /></td>
    <td><code>string</code></td>
    <td>Default process mode for resource groups. (UNORDERED, OLDEST_FIRST, NEWEST_FIRST, NEWEST_READY_FIRST)</td>
</tr>
<tr>
    <td><CopyableCode code="skip_branch_pipelines_for_mrs" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether branch pipelines are skipped if a merge request is open.</td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>CI/CD settings for the project. Generated from the GitLab GraphQL schema field Project.ciCdSettings (ProjectCiCdSetting).</td>
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

CI/CD settings for the project. Generated from the GitLab GraphQL schema field Project.ciCdSettings (ProjectCiCdSetting).

```sql
SELECT
cross_project_push_for_job_token_allowed,
display_pipeline_variables,
group_runners_enabled,
inbound_job_token_scope_enabled,
job_token_scope_enabled,
keep_latest_artifact,
max_pipelines_per_merge_train,
merge_pipelines_enabled,
merge_train_enforcement,
merge_trains_enabled,
merge_trains_skip_train_allowed,
pipeline_variables_minimum_override_role,
project,
push_repository_for_job_token_allowed,
resource_group_default_process_mode,
skip_branch_pipelines_for_mrs
FROM gitlab.ci.project_ci_cd_settings
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
