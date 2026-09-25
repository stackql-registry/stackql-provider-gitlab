--- 
title: project_pipeline_schedules
hide_title: false
hide_table_of_contents: false
keywords:
  - project_pipeline_schedules
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

Gets or lists a <code>project_pipeline_schedules</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_pipeline_schedules" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.ci.project_pipeline_schedules" /></td></tr>
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
    <td>ID of the pipeline schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the pipeline schedule is active.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the pipeline schedule was created.</td>
</tr>
<tr>
    <td><CopyableCode code="cron" /></td>
    <td><code>string</code></td>
    <td>Cron notation for the schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="cron_timezone" /></td>
    <td><code>string</code></td>
    <td>Timezone for the pipeline schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the pipeline schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="edit_path" /></td>
    <td><code>string</code></td>
    <td>Edit path of the pipeline schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="for_tag" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a pipelines schedule belongs to a tag.</td>
</tr>
<tr>
    <td><CopyableCode code="next_run_at" /></td>
    <td><code>string</code></td>
    <td>Time when the next pipeline will run.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="real_next_run" /></td>
    <td><code>string</code></td>
    <td>Time when the next pipeline will run.</td>
</tr>
<tr>
    <td><CopyableCode code="ref" /></td>
    <td><code>string</code></td>
    <td>Ref of the pipeline schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="ref_for_display" /></td>
    <td><code>string</code></td>
    <td>Git ref for the pipeline schedule.</td>
</tr>
<tr>
    <td><CopyableCode code="ref_path" /></td>
    <td><code>string</code></td>
    <td>Path to the ref that triggered the pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the pipeline schedule was last updated.</td>
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
    <td><a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-status"><code>status</code></a></td>
    <td>Pipeline schedules of the project. This field can only be resolved for one project per request. Generated from the GitLab GraphQL schema field Project.pipelineSchedules (connection of PipelineSchedule nodes).</td>
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
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>List pipeline schedules by sort order. Default is `id_desc`.</td>
</tr>
<tr id="parameter-status">
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Filter pipeline schedules by active status.</td>
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

Pipeline schedules of the project. This field can only be resolved for one project per request. Generated from the GitLab GraphQL schema field Project.pipelineSchedules (connection of PipelineSchedule nodes).

```sql
SELECT
id,
active,
created_at,
cron,
cron_timezone,
description,
edit_path,
for_tag,
next_run_at,
project,
real_next_run,
ref,
ref_for_display,
ref_path,
updated_at
FROM gitlab.ci.project_pipeline_schedules
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND sort = '{{ sort }}'
AND status = '{{ status }}'
;
```
</TabItem>
</Tabs>
