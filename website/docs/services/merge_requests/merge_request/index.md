--- 
title: merge_request
hide_title: false
hide_table_of_contents: false
keywords:
  - merge_request
  - merge_requests
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

Gets or lists a <code>merge_request</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="merge_request" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.merge_requests.merge_request" /></td></tr>
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
    <td>ID of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name or title of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="project_id" /></td>
    <td><code>integer</code></td>
    <td>ID of the merge request project.</td>
</tr>
<tr>
    <td><CopyableCode code="source_project_id" /></td>
    <td><code>integer</code></td>
    <td>ID of the merge request source project.</td>
</tr>
<tr>
    <td><CopyableCode code="target_project_id" /></td>
    <td><code>integer</code></td>
    <td>ID of the merge request target project.</td>
</tr>
<tr>
    <td><CopyableCode code="allow_collaboration" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if members of the target project can push to the fork.</td>
</tr>
<tr>
    <td><CopyableCode code="allows_multiple_assignees" /></td>
    <td><code>boolean</code></td>
    <td>Allows assigning multiple users to a merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="allows_multiple_reviewers" /></td>
    <td><code>boolean</code></td>
    <td>Allows assigning multiple reviewers to a merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="approvals_left" /></td>
    <td><code>integer</code></td>
    <td>Number of approvals left.</td>
</tr>
<tr>
    <td><CopyableCode code="approvals_required" /></td>
    <td><code>integer</code></td>
    <td>Number of approvals required.</td>
</tr>
<tr>
    <td><CopyableCode code="approved" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request has all the required approvals.</td>
</tr>
<tr>
    <td><CopyableCode code="author" /></td>
    <td><code>object</code></td>
    <td>MergeRequestAuthor identity (id, username, name)</td>
</tr>
<tr>
    <td><CopyableCode code="auto_merge_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if auto merge is enabled for the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_merge_strategy" /></td>
    <td><code>string</code></td>
    <td>Selected auto merge strategy.</td>
</tr>
<tr>
    <td><CopyableCode code="closed_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the merge request was closed, null if not closed.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_count" /></td>
    <td><code>integer</code></td>
    <td>Number of commits in the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="conflicts" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request has conflicts.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the merge request was created.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the merge request (Markdown rendered as HTML for caching).</td>
</tr>
<tr>
    <td><CopyableCode code="detailed_merge_status" /></td>
    <td><code>string</code></td>
    <td>Detailed merge status of the merge request. (UNCHECKED, CHECKING, MERGEABLE, COMMITS_STATUS, CI_MUST_PASS, CI_STILL_RUNNING, DISCUSSIONS_NOT_RESOLVED, DRAFT_STATUS, NOT_OPEN, NOT_APPROVED, BLOCKED_STATUS, EXTERNAL_STATUS_CHECKS, PREPARING, JIRA_ASSOCIATION, CONFLICT, NEED_REBASE, APPROVALS_SYNCING, LOCKED_PATHS, LOCKED_LFS_FILES, MERGE_TIME, SECURITY_POLICIES_VIOLATIONS, TITLE_NOT_MATCHING, REQUESTED_CHANGES, SECURITY_POLICY_PIPELINE_CHECK)</td>
</tr>
<tr>
    <td><CopyableCode code="discussion_locked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if comments on the merge request are locked to members only.</td>
</tr>
<tr>
    <td><CopyableCode code="downvotes" /></td>
    <td><code>integer</code></td>
    <td>Number of downvotes for the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="draft" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request is a draft.</td>
</tr>
<tr>
    <td><CopyableCode code="force_remove_source_branch" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the project settings will lead to source branch deletion after merge.</td>
</tr>
<tr>
    <td><CopyableCode code="has_ci" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request has CI.</td>
</tr>
<tr>
    <td><CopyableCode code="hidden" /></td>
    <td><code>boolean</code></td>
    <td>Indicates the merge request is hidden because the author has been banned.</td>
</tr>
<tr>
    <td><CopyableCode code="human_time_estimate" /></td>
    <td><code>string</code></td>
    <td>Human-readable time estimate of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="human_total_time_spent" /></td>
    <td><code>string</code></td>
    <td>Human-readable total time reported as spent on the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="iid" /></td>
    <td><code>string</code></td>
    <td>Internal ID of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="in_progress_merge_commit_sha" /></td>
    <td><code>string</code></td>
    <td>Commit SHA of the merge request if merge is in progress.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_after" /></td>
    <td><code>string</code></td>
    <td>Date after which the merge request can be merged.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_commit_sha" /></td>
    <td><code>string</code></td>
    <td>SHA of the merge request commit (set once merged).</td>
</tr>
<tr>
    <td><CopyableCode code="merge_error" /></td>
    <td><code>string</code></td>
    <td>Error message due to a merge error.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_ongoing" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a merge is currently occurring.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_status_enum" /></td>
    <td><code>string</code></td>
    <td>Merge status of the merge request. (UNCHECKED, CHECKING, CAN_BE_MERGED, CANNOT_BE_MERGED, CANNOT_BE_MERGED_RECHECK)</td>
</tr>
<tr>
    <td><CopyableCode code="mergeable" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request is mergeable.</td>
</tr>
<tr>
    <td><CopyableCode code="merged_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the merge request was merged, null if not merged.</td>
</tr>
<tr>
    <td><CopyableCode code="milestone" /></td>
    <td><code>object</code></td>
    <td>Milestone identity (id, title)</td>
</tr>
<tr>
    <td><CopyableCode code="prepared_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the merge request was prepared.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="rebase_commit_sha" /></td>
    <td><code>string</code></td>
    <td>Rebase commit SHA of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="reference" /></td>
    <td><code>string</code></td>
    <td>Internal reference of the merge request. Returned in shortened format by default.</td>
</tr>
<tr>
    <td><CopyableCode code="resolvable_discussions_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user discussions that are resolvable in the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="resolved_discussions_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user discussions that are resolved in the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="retargeted" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if merge request was retargeted.</td>
</tr>
<tr>
    <td><CopyableCode code="should_remove_source_branch" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the source branch of the merge request will be deleted after merge.</td>
</tr>
<tr>
    <td><CopyableCode code="source_branch" /></td>
    <td><code>string</code></td>
    <td>Source branch of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="squash" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request is set to be squashed when merged. &#91;Project settings&#93;(https:​//docs.gitlab.com/user/project/merge_requests/squash_and_merge/#configure-squash-options-for-a-project) may override this value. Use `squash_on_merge` instead to take project squash options into account.</td>
</tr>
<tr>
    <td><CopyableCode code="squash_on_merge" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request will be squashed when merged.</td>
</tr>
<tr>
    <td><CopyableCode code="squash_read_only" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if `squashReadOnly` is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the merge request. (merged, opened, closed, locked, all)</td>
</tr>
<tr>
    <td><CopyableCode code="supports_lock_on_merge" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the merge request supports locked labels.</td>
</tr>
<tr>
    <td><CopyableCode code="target_branch" /></td>
    <td><code>string</code></td>
    <td>Target branch of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="target_branch_exists" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the target branch of the merge request exists.</td>
</tr>
<tr>
    <td><CopyableCode code="target_branch_path" /></td>
    <td><code>string</code></td>
    <td>Path to the target branch of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="time_estimate" /></td>
    <td><code>integer</code></td>
    <td>Time estimate of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="total_time_spent" /></td>
    <td><code>integer</code></td>
    <td>Total time (in seconds) reported as spent on the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the merge request was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="upvotes" /></td>
    <td><code>integer</code></td>
    <td>Number of upvotes for the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="user_discussions_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user discussions in the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="user_notes_count" /></td>
    <td><code>integer</code></td>
    <td>User notes count of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the merge request.</td>
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
    <td>Find a merge request. Generated from the GitLab GraphQL schema field Query.mergeRequest (MergeRequest).</td>
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
    <td>Global ID of the merge request.</td>
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

Find a merge request. Generated from the GitLab GraphQL schema field Query.mergeRequest (MergeRequest).

```sql
SELECT
id,
name,
project_id,
source_project_id,
target_project_id,
allow_collaboration,
allows_multiple_assignees,
allows_multiple_reviewers,
approvals_left,
approvals_required,
approved,
author,
auto_merge_enabled,
auto_merge_strategy,
closed_at,
commit_count,
conflicts,
created_at,
description,
detailed_merge_status,
discussion_locked,
downvotes,
draft,
force_remove_source_branch,
has_ci,
hidden,
human_time_estimate,
human_total_time_spent,
iid,
in_progress_merge_commit_sha,
merge_after,
merge_commit_sha,
merge_error,
merge_ongoing,
merge_status_enum,
mergeable,
merged_at,
milestone,
prepared_at,
project,
rebase_commit_sha,
reference,
resolvable_discussions_count,
resolved_discussions_count,
retargeted,
should_remove_source_branch,
source_branch,
squash,
squash_on_merge,
squash_read_only,
state,
supports_lock_on_merge,
target_branch,
target_branch_exists,
target_branch_path,
time_estimate,
title,
total_time_spent,
updated_at,
upvotes,
user_discussions_count,
user_notes_count,
web_path,
web_url
FROM gitlab.merge_requests.merge_request
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
