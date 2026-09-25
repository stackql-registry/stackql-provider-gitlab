--- 
title: group_merge_requests
hide_title: false
hide_table_of_contents: false
keywords:
  - group_merge_requests
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

Gets or lists a <code>group_merge_requests</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_merge_requests" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.merge_requests.group_merge_requests" /></td></tr>
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
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-assignee_username"><code>assignee_username</code></a>, <a href="#parameter-assignee_wildcard_id"><code>assignee_wildcard_id</code></a>, <a href="#parameter-author_username"><code>author_username</code></a>, <a href="#parameter-closed_after"><code>closed_after</code></a>, <a href="#parameter-closed_before"><code>closed_before</code></a>, <a href="#parameter-created_after"><code>created_after</code></a>, <a href="#parameter-created_before"><code>created_before</code></a>, <a href="#parameter-deployed_after"><code>deployed_after</code></a>, <a href="#parameter-deployed_before"><code>deployed_before</code></a>, <a href="#parameter-deployment_id"><code>deployment_id</code></a>, <a href="#parameter-draft"><code>draft</code></a>, <a href="#parameter-environment_name"><code>environment_name</code></a>, <a href="#parameter-include_archived"><code>include_archived</code></a>, <a href="#parameter-include_subgroups"><code>include_subgroups</code></a>, <a href="#parameter-merged_after"><code>merged_after</code></a>, <a href="#parameter-merged_before"><code>merged_before</code></a>, <a href="#parameter-merged_by"><code>merged_by</code></a>, <a href="#parameter-milestone_title"><code>milestone_title</code></a>, <a href="#parameter-milestone_wildcard_id"><code>milestone_wildcard_id</code></a>, <a href="#parameter-my_reaction_emoji"><code>my_reaction_emoji</code></a>, <a href="#parameter-release_tag"><code>release_tag</code></a>, <a href="#parameter-reviewer_username"><code>reviewer_username</code></a>, <a href="#parameter-reviewer_wildcard_id"><code>reviewer_wildcard_id</code></a>, <a href="#parameter-search"><code>search</code></a>, <a href="#parameter-sort"><code>sort</code></a>, <a href="#parameter-state"><code>state</code></a>, <a href="#parameter-subscribed"><code>subscribed</code></a>, <a href="#parameter-updated_after"><code>updated_after</code></a>, <a href="#parameter-updated_before"><code>updated_before</code></a></td>
    <td>Merge requests for projects in this group. Generated from the GitLab GraphQL schema field Group.mergeRequests (connection of MergeRequest nodes).</td>
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
    <td>Full path of the group, for example gitlab-org</td>
</tr>
<tr id="parameter-host">
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>GitLab host, with an optional port (default gitlab.com). Resolved from the GITLAB_HOST environment variable when it is set (x-stackQL-envVar); a WHERE host value always takes precedence. Self-managed instances: the provider is generated from the gitlab.com schema, so older instances may reject fields they do not serve. (default: gitlab.com, x-stackQL-envVar: GITLAB_HOST)</td>
</tr>
<tr id="parameter-assignee_username">
    <td><CopyableCode code="assignee_username" /></td>
    <td><code>string</code></td>
    <td>Username of the assignee.</td>
</tr>
<tr id="parameter-assignee_wildcard_id">
    <td><CopyableCode code="assignee_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by assignee presence. Incompatible with assigneeUsernames and assigneeUsername.</td>
</tr>
<tr id="parameter-author_username">
    <td><CopyableCode code="author_username" /></td>
    <td><code>string</code></td>
    <td>Username of the author.</td>
</tr>
<tr id="parameter-closed_after">
    <td><CopyableCode code="closed_after" /></td>
    <td><code>string</code></td>
    <td>Merge requests closed after the date.</td>
</tr>
<tr id="parameter-closed_before">
    <td><CopyableCode code="closed_before" /></td>
    <td><code>string</code></td>
    <td>Merge requests closed before the date.</td>
</tr>
<tr id="parameter-created_after">
    <td><CopyableCode code="created_after" /></td>
    <td><code>string</code></td>
    <td>Merge requests created after the timestamp.</td>
</tr>
<tr id="parameter-created_before">
    <td><CopyableCode code="created_before" /></td>
    <td><code>string</code></td>
    <td>Merge requests created before the timestamp.</td>
</tr>
<tr id="parameter-deployed_after">
    <td><CopyableCode code="deployed_after" /></td>
    <td><code>string</code></td>
    <td>Merge requests deployed after the timestamp.</td>
</tr>
<tr id="parameter-deployed_before">
    <td><CopyableCode code="deployed_before" /></td>
    <td><code>string</code></td>
    <td>Merge requests deployed before the timestamp.</td>
</tr>
<tr id="parameter-deployment_id">
    <td><CopyableCode code="deployment_id" /></td>
    <td><code>string</code></td>
    <td>ID of the deployment.</td>
</tr>
<tr id="parameter-draft">
    <td><CopyableCode code="draft" /></td>
    <td><code>boolean</code></td>
    <td>Limit result to draft merge requests.</td>
</tr>
<tr id="parameter-environment_name">
    <td><CopyableCode code="environment_name" /></td>
    <td><code>string</code></td>
    <td>Environment merge requests have been deployed to.</td>
</tr>
<tr id="parameter-include_archived">
    <td><CopyableCode code="include_archived" /></td>
    <td><code>boolean</code></td>
    <td>Return merge requests from archived projects</td>
</tr>
<tr id="parameter-include_subgroups">
    <td><CopyableCode code="include_subgroups" /></td>
    <td><code>boolean</code></td>
    <td>Include merge requests belonging to subgroups</td>
</tr>
<tr id="parameter-merged_after">
    <td><CopyableCode code="merged_after" /></td>
    <td><code>string</code></td>
    <td>Merge requests merged after the date.</td>
</tr>
<tr id="parameter-merged_before">
    <td><CopyableCode code="merged_before" /></td>
    <td><code>string</code></td>
    <td>Merge requests merged before the date.</td>
</tr>
<tr id="parameter-merged_by">
    <td><CopyableCode code="merged_by" /></td>
    <td><code>string</code></td>
    <td>Username of the merger.</td>
</tr>
<tr id="parameter-milestone_title">
    <td><CopyableCode code="milestone_title" /></td>
    <td><code>string</code></td>
    <td>Title of the milestone. Incompatible with milestoneWildcardId.</td>
</tr>
<tr id="parameter-milestone_wildcard_id">
    <td><CopyableCode code="milestone_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter issues by milestone ID wildcard. Incompatible with milestoneTitle.</td>
</tr>
<tr id="parameter-my_reaction_emoji">
    <td><CopyableCode code="my_reaction_emoji" /></td>
    <td><code>string</code></td>
    <td>Filter by your reaction emoji.</td>
</tr>
<tr id="parameter-release_tag">
    <td><CopyableCode code="release_tag" /></td>
    <td><code>string</code></td>
    <td>Filter by release tag.</td>
</tr>
<tr id="parameter-reviewer_username">
    <td><CopyableCode code="reviewer_username" /></td>
    <td><code>string</code></td>
    <td>Username of the reviewer.</td>
</tr>
<tr id="parameter-reviewer_wildcard_id">
    <td><CopyableCode code="reviewer_wildcard_id" /></td>
    <td><code>string</code></td>
    <td>Filter by reviewer presence. Incompatible with reviewerUsername.</td>
</tr>
<tr id="parameter-search">
    <td><CopyableCode code="search" /></td>
    <td><code>string</code></td>
    <td>Search query for title or description.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>Sort merge requests by the criteria.</td>
</tr>
<tr id="parameter-state">
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Merge request state. If provided, all resolved merge requests will have the state.</td>
</tr>
<tr id="parameter-subscribed">
    <td><CopyableCode code="subscribed" /></td>
    <td><code>string</code></td>
    <td>Merge requests the current user is subscribed to.</td>
</tr>
<tr id="parameter-updated_after">
    <td><CopyableCode code="updated_after" /></td>
    <td><code>string</code></td>
    <td>Merge requests updated after the timestamp.</td>
</tr>
<tr id="parameter-updated_before">
    <td><CopyableCode code="updated_before" /></td>
    <td><code>string</code></td>
    <td>Merge requests updated before the timestamp.</td>
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

Merge requests for projects in this group. Generated from the GitLab GraphQL schema field Group.mergeRequests (connection of MergeRequest nodes).

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
FROM gitlab.merge_requests.group_merge_requests
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND assignee_username = '{{ assignee_username }}'
AND assignee_wildcard_id = '{{ assignee_wildcard_id }}'
AND author_username = '{{ author_username }}'
AND closed_after = '{{ closed_after }}'
AND closed_before = '{{ closed_before }}'
AND created_after = '{{ created_after }}'
AND created_before = '{{ created_before }}'
AND deployed_after = '{{ deployed_after }}'
AND deployed_before = '{{ deployed_before }}'
AND deployment_id = '{{ deployment_id }}'
AND draft = '{{ draft }}'
AND environment_name = '{{ environment_name }}'
AND include_archived = '{{ include_archived }}'
AND include_subgroups = '{{ include_subgroups }}'
AND merged_after = '{{ merged_after }}'
AND merged_before = '{{ merged_before }}'
AND merged_by = '{{ merged_by }}'
AND milestone_title = '{{ milestone_title }}'
AND milestone_wildcard_id = '{{ milestone_wildcard_id }}'
AND my_reaction_emoji = '{{ my_reaction_emoji }}'
AND release_tag = '{{ release_tag }}'
AND reviewer_username = '{{ reviewer_username }}'
AND reviewer_wildcard_id = '{{ reviewer_wildcard_id }}'
AND search = '{{ search }}'
AND sort = '{{ sort }}'
AND state = '{{ state }}'
AND subscribed = '{{ subscribed }}'
AND updated_after = '{{ updated_after }}'
AND updated_before = '{{ updated_before }}'
;
```
</TabItem>
</Tabs>
