--- 
title: project
hide_title: false
hide_table_of_contents: false
keywords:
  - project
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

Gets or lists a <code>project</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project" /></td></tr>
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
    <td>ID of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the project without the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="actual_repository_size_limit" /></td>
    <td><code>number</code></td>
    <td>Size limit for the repository in bytes.</td>
</tr>
<tr>
    <td><CopyableCode code="admin_edit_path" /></td>
    <td><code>string</code></td>
    <td>Admin path for editing project. Only available to admins.</td>
</tr>
<tr>
    <td><CopyableCode code="admin_show_path" /></td>
    <td><code>string</code></td>
    <td>Admin path of the project. Only available to admins.</td>
</tr>
<tr>
    <td><CopyableCode code="allow_merge_on_skipped_pipeline" /></td>
    <td><code>boolean</code></td>
    <td>If `only_allow_merge_if_pipeline_succeeds` is true, indicates if merge requests of the project can also be merged with skipped jobs.</td>
</tr>
<tr>
    <td><CopyableCode code="allows_multiple_merge_request_assignees" /></td>
    <td><code>boolean</code></td>
    <td>Project allows assigning multiple users to a merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="allows_multiple_merge_request_reviewers" /></td>
    <td><code>boolean</code></td>
    <td>Project allows assigning multiple reviewers to a merge request.</td>
</tr>
<tr>
    <td><CopyableCode code="archived" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the project or any ancestor is archived.</td>
</tr>
<tr>
    <td><CopyableCode code="autoclose_referenced_issues" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if issues referenced by merge requests and commits within the default branch are closed automatically.</td>
</tr>
<tr>
    <td><CopyableCode code="avatar_url" /></td>
    <td><code>string</code></td>
    <td>Avatar URL of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="ci_config_path_or_default" /></td>
    <td><code>string</code></td>
    <td>Path of the CI configuration file.</td>
</tr>
<tr>
    <td><CopyableCode code="container_registry_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Container registry is enabled for the current user</td>
</tr>
<tr>
    <td><CopyableCode code="container_scanning_for_registry_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether container scanning for registry is enabled or not for the project. Returns `null` if unauthorized.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the project creation.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Short description of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="edit_path" /></td>
    <td><code>string</code></td>
    <td>Path for editing project.</td>
</tr>
<tr>
    <td><CopyableCode code="forks_count" /></td>
    <td><code>integer</code></td>
    <td>Number of times the project has been forked.</td>
</tr>
<tr>
    <td><CopyableCode code="full_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="group_" /></td>
    <td><code>object</code></td>
    <td>Group identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="has_jira_vulnerability_issue_creation_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether Jira issue creation from vulnerabilities is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="http_url_to_repo" /></td>
    <td><code>string</code></td>
    <td>URL to connect to the project via HTTPS.</td>
</tr>
<tr>
    <td><CopyableCode code="import_status" /></td>
    <td><code>string</code></td>
    <td>Status of import background job of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="is_forked" /></td>
    <td><code>boolean</code></td>
    <td>Project is forked.</td>
</tr>
<tr>
    <td><CopyableCode code="issues_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Issues are enabled for the current user</td>
</tr>
<tr>
    <td><CopyableCode code="jira_import_status" /></td>
    <td><code>string</code></td>
    <td>Status of Jira import background job of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="jobs_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if CI/CD pipeline jobs are enabled for the current user.</td>
</tr>
<tr>
    <td><CopyableCode code="last_activity_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of the project last activity.</td>
</tr>
<tr>
    <td><CopyableCode code="lfs_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the project has Large File Storage (LFS) enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_commit_template" /></td>
    <td><code>string</code></td>
    <td>Template used to create merge commit message in merge requests.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_request_title_regex" /></td>
    <td><code>string</code></td>
    <td>Regex used to validate the title of merge requests.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_request_title_regex_description" /></td>
    <td><code>string</code></td>
    <td>Description of the regex used to validate the title of merge requests.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_disable_committers_approval" /></td>
    <td><code>boolean</code></td>
    <td>Indicates that committers of the given merge request cannot approve.</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Merge requests are enabled for the current user</td>
</tr>
<tr>
    <td><CopyableCode code="merge_requests_ff_only_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if no merge commits should be created and all merges should instead be fast-forwarded, which means that merging is only allowed if the branch could be fast-forwarded.</td>
</tr>
<tr>
    <td><CopyableCode code="name_with_namespace" /></td>
    <td><code>string</code></td>
    <td>Name of the project including the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="namespace" /></td>
    <td><code>object</code></td>
    <td>Namespace identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="only_allow_merge_if_all_discussions_are_resolved" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if merge requests of the project can only be merged when all the discussions are resolved.</td>
</tr>
<tr>
    <td><CopyableCode code="only_allow_merge_if_all_status_checks_passed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates that merges of merge requests should be blocked unless all status checks have passed.</td>
</tr>
<tr>
    <td><CopyableCode code="only_allow_merge_if_pipeline_succeeds" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if merge requests of the project can only be merged with successful jobs.</td>
</tr>
<tr>
    <td><CopyableCode code="open_issues_count" /></td>
    <td><code>integer</code></td>
    <td>Number of open issues for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="open_merge_requests_count" /></td>
    <td><code>integer</code></td>
    <td>Number of open merge requests for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="pages_force_https" /></td>
    <td><code>boolean</code></td>
    <td>Project's Pages site redirects unsecured connections to HTTPS.</td>
</tr>
<tr>
    <td><CopyableCode code="pages_use_unique_domain" /></td>
    <td><code>boolean</code></td>
    <td>Project's Pages site uses a unique subdomain.</td>
</tr>
<tr>
    <td><CopyableCode code="path" /></td>
    <td><code>string</code></td>
    <td>Path of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="pre_receive_secret_detection_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether secret push protection is on or not for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="prevent_merge_without_jira_issue_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if an associated issue from Jira is required.</td>
</tr>
<tr>
    <td><CopyableCode code="printing_merge_request_link_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if a link to create or view a merge request should display after a push to Git repositories of the project from the command line.</td>
</tr>
<tr>
    <td><CopyableCode code="public_jobs" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if there is public access to pipelines and job details of the project, including output logs and artifacts.</td>
</tr>
<tr>
    <td><CopyableCode code="remove_source_branch_after_merge" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if `Delete source branch` option should be enabled by default for all new merge requests of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="repository_size_excess" /></td>
    <td><code>number</code></td>
    <td>Size of repository that exceeds the limit in bytes.</td>
</tr>
<tr>
    <td><CopyableCode code="request_access_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if users can request member access to the project.</td>
</tr>
<tr>
    <td><CopyableCode code="secret_push_protection_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether secret push protection is on or not for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="security_configuration_path" /></td>
    <td><code>string</code></td>
    <td>Path to project's security configuration.</td>
</tr>
<tr>
    <td><CopyableCode code="security_dashboard_path" /></td>
    <td><code>string</code></td>
    <td>Path to project's security dashboard.</td>
</tr>
<tr>
    <td><CopyableCode code="service_desk_address" /></td>
    <td><code>string</code></td>
    <td>E-mail address of the Service Desk.</td>
</tr>
<tr>
    <td><CopyableCode code="service_desk_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the project has Service Desk enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="shared_runners_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if shared runners are enabled for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="snippets_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Snippets are enabled for the current user</td>
</tr>
<tr>
    <td><CopyableCode code="squash_commit_template" /></td>
    <td><code>string</code></td>
    <td>Template used to create squash commit message in merge requests.</td>
</tr>
<tr>
    <td><CopyableCode code="squash_read_only" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if `squashReadOnly` is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="ssh_url_to_repo" /></td>
    <td><code>string</code></td>
    <td>URL to connect to the project via SSH.</td>
</tr>
<tr>
    <td><CopyableCode code="star_count" /></td>
    <td><code>integer</code></td>
    <td>Number of times the project has been starred.</td>
</tr>
<tr>
    <td><CopyableCode code="suggestion_commit_message" /></td>
    <td><code>string</code></td>
    <td>Commit message used to apply merge request suggestions.</td>
</tr>
<tr>
    <td><CopyableCode code="topics" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the project was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="visibility" /></td>
    <td><code>string</code></td>
    <td>Visibility of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="web_path" /></td>
    <td><code>string</code></td>
    <td>Web path of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>Web URL of the project.</td>
</tr>
<tr>
    <td><CopyableCode code="wiki_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if Wikis are enabled for the current user</td>
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
    <td>Find a project. Generated from the GitLab GraphQL schema field Query.project (Project).</td>
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
    <td>Full path of the project. For example, `gitlab-org/gitlab-foss`.</td>
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

Find a project. Generated from the GitLab GraphQL schema field Query.project (Project).

```sql
SELECT
id,
name,
actual_repository_size_limit,
admin_edit_path,
admin_show_path,
allow_merge_on_skipped_pipeline,
allows_multiple_merge_request_assignees,
allows_multiple_merge_request_reviewers,
archived,
autoclose_referenced_issues,
avatar_url,
ci_config_path_or_default,
container_registry_enabled,
container_scanning_for_registry_enabled,
created_at,
description,
edit_path,
forks_count,
full_path,
group_,
has_jira_vulnerability_issue_creation_enabled,
http_url_to_repo,
import_status,
is_forked,
issues_enabled,
jira_import_status,
jobs_enabled,
last_activity_at,
lfs_enabled,
merge_commit_template,
merge_request_title_regex,
merge_request_title_regex_description,
merge_requests_disable_committers_approval,
merge_requests_enabled,
merge_requests_ff_only_enabled,
name_with_namespace,
namespace,
only_allow_merge_if_all_discussions_are_resolved,
only_allow_merge_if_all_status_checks_passed,
only_allow_merge_if_pipeline_succeeds,
open_issues_count,
open_merge_requests_count,
pages_force_https,
pages_use_unique_domain,
path,
pre_receive_secret_detection_enabled,
prevent_merge_without_jira_issue_enabled,
printing_merge_request_link_enabled,
public_jobs,
remove_source_branch_after_merge,
repository_size_excess,
request_access_enabled,
secret_push_protection_enabled,
security_configuration_path,
security_dashboard_path,
service_desk_address,
service_desk_enabled,
shared_runners_enabled,
snippets_enabled,
squash_commit_template,
squash_read_only,
ssh_url_to_repo,
star_count,
suggestion_commit_message,
topics,
updated_at,
visibility,
web_path,
web_url,
wiki_enabled
FROM gitlab.projects.project
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
