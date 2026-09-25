--- 
title: project_push_rules
hide_title: false
hide_table_of_contents: false
keywords:
  - project_push_rules
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

Gets or lists a <code>project_push_rules</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_push_rules" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.projects.project_push_rules" /></td></tr>
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
    <td><CopyableCode code="author_email_regex" /></td>
    <td><code>string</code></td>
    <td>All commit author emails must match the regular expression.</td>
</tr>
<tr>
    <td><CopyableCode code="branch_name_regex" /></td>
    <td><code>string</code></td>
    <td>All branch names must match the regular expression.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_committer_check" /></td>
    <td><code>boolean</code></td>
    <td>Only allow commits where the committer email matches a verified GitLab user email.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_committer_name_check" /></td>
    <td><code>boolean</code></td>
    <td>Only allow commits where the author name matches the GitLab user name.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_message_negative_regex" /></td>
    <td><code>string</code></td>
    <td>No commit message is allowed to match the regular expression.</td>
</tr>
<tr>
    <td><CopyableCode code="commit_message_regex" /></td>
    <td><code>string</code></td>
    <td>All commit messages must match the regular expression.</td>
</tr>
<tr>
    <td><CopyableCode code="deny_delete_tag" /></td>
    <td><code>boolean</code></td>
    <td>Deny deleting a tag with `git push`.</td>
</tr>
<tr>
    <td><CopyableCode code="file_name_regex" /></td>
    <td><code>string</code></td>
    <td>All committed filenames must not match the regular expression.</td>
</tr>
<tr>
    <td><CopyableCode code="max_file_size" /></td>
    <td><code>integer</code></td>
    <td>Maximum file size (MB).</td>
</tr>
<tr>
    <td><CopyableCode code="member_check" /></td>
    <td><code>boolean</code></td>
    <td>Restrict commits by author (email) to existing GitLab users.</td>
</tr>
<tr>
    <td><CopyableCode code="prevent_secrets" /></td>
    <td><code>boolean</code></td>
    <td>GitLab rejects any files that are likely to contain secrets.</td>
</tr>
<tr>
    <td><CopyableCode code="reject_non_dco_commits" /></td>
    <td><code>boolean</code></td>
    <td>Reject commit when it is not DCO certified.</td>
</tr>
<tr>
    <td><CopyableCode code="reject_unsigned_commits" /></td>
    <td><code>boolean</code></td>
    <td>Reject commit when it is not signed through GPG.</td>
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
    <td>Project's push rules settings. Generated from the GitLab GraphQL schema field Project.pushRules (PushRules).</td>
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

Project's push rules settings. Generated from the GitLab GraphQL schema field Project.pushRules (PushRules).

```sql
SELECT
author_email_regex,
branch_name_regex,
commit_committer_check,
commit_committer_name_check,
commit_message_negative_regex,
commit_message_regex,
deny_delete_tag,
file_name_regex,
max_file_size,
member_check,
prevent_secrets,
reject_non_dco_commits,
reject_unsigned_commits
FROM gitlab.projects.project_push_rules
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
