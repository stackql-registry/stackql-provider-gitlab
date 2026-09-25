--- 
title: vulnerabilities
hide_title: false
hide_table_of_contents: false
keywords:
  - vulnerabilities
  - security
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

Gets or lists a <code>vulnerabilities</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="vulnerabilities" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.security.vulnerabilities" /></td></tr>
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
    <td>GraphQL ID of the vulnerability.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name or title of the object.</td>
</tr>
<tr>
    <td><CopyableCode code="ai_resolution_available" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the type of vulnerability can be resolved with AI.</td>
</tr>
<tr>
    <td><CopyableCode code="ai_resolution_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the specific vulnerability can be resolved with AI.</td>
</tr>
<tr>
    <td><CopyableCode code="confirmed_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the vulnerability state was changed to confirmed.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of the vulnerability.</td>
</tr>
<tr>
    <td><CopyableCode code="detected_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the vulnerability was first detected.</td>
</tr>
<tr>
    <td><CopyableCode code="dismissal_reason" /></td>
    <td><code>string</code></td>
    <td>Reason for dismissal. Returns `null` for states other than `dismissed`. (ACCEPTABLE_RISK, FALSE_POSITIVE, MITIGATING_CONTROL, USED_IN_TESTS, NOT_APPLICABLE)</td>
</tr>
<tr>
    <td><CopyableCode code="dismissed_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the vulnerability state was changed to dismissed.</td>
</tr>
<tr>
    <td><CopyableCode code="false_positive" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the vulnerability is a false positive.</td>
</tr>
<tr>
    <td><CopyableCode code="has_remediations" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether there is a remediation available for the vulnerability.</td>
</tr>
<tr>
    <td><CopyableCode code="present_on_default_branch" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the vulnerability is present on the default branch or not.</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="removed_from_code" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the vulnerability is present in the code or not.</td>
</tr>
<tr>
    <td><CopyableCode code="report_type" /></td>
    <td><code>string</code></td>
    <td>Type of the security report that found the vulnerability (SAST, DEPENDENCY_SCANNING, CONTAINER_SCANNING, DAST, SECRET_DETECTION, COVERAGE_FUZZING, API_FUZZING, CLUSTER_IMAGE_SCANNING, CONTAINER_SCANNING_FOR_REGISTRY, SARIF, GENERIC). `Scan Type` in the UI. (SAST, DEPENDENCY_SCANNING, CONTAINER_SCANNING, DAST, SECRET_DETECTION, COVERAGE_FUZZING, API_FUZZING, CLUSTER_IMAGE_SCANNING, CONTAINER_SCANNING_FOR_REGISTRY, SARIF, GENERIC)</td>
</tr>
<tr>
    <td><CopyableCode code="resolved_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the vulnerability state was changed to resolved.</td>
</tr>
<tr>
    <td><CopyableCode code="resolved_on_default_branch" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the vulnerability is fixed on the default branch or not.</td>
</tr>
<tr>
    <td><CopyableCode code="severity" /></td>
    <td><code>string</code></td>
    <td>Severity of the vulnerability (INFO, UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL) (INFO, UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL)</td>
</tr>
<tr>
    <td><CopyableCode code="solution" /></td>
    <td><code>string</code></td>
    <td>Recommended solution for the vulnerability.</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>State of the vulnerability (DETECTED, CONFIRMED, RESOLVED, DISMISSED) (CONFIRMED, DETECTED, DISMISSED, RESOLVED)</td>
</tr>
<tr>
    <td><CopyableCode code="state_comment" /></td>
    <td><code>string</code></td>
    <td>Comment given for the vulnerability state change.</td>
</tr>
<tr>
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Title of the vulnerability.</td>
</tr>
<tr>
    <td><CopyableCode code="unverified" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the finding was detected without an identified source (untrusted input).</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the vulnerability was last updated.</td>
</tr>
<tr>
    <td><CopyableCode code="user_notes_count" /></td>
    <td><code>integer</code></td>
    <td>Number of user notes attached to the vulnerability.</td>
</tr>
<tr>
    <td><CopyableCode code="uuid" /></td>
    <td><code>string</code></td>
    <td>UUID of the vulnerability finding. Can be used to look up the associated security report finding.</td>
</tr>
<tr>
    <td><CopyableCode code="vulnerability_path" /></td>
    <td><code>string</code></td>
    <td>Path to the vulnerability's details page.</td>
</tr>
<tr>
    <td><CopyableCode code="web_url" /></td>
    <td><code>string</code></td>
    <td>URL to the vulnerability's details page.</td>
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
    <td><a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-has_ai_resolution"><code>has_ai_resolution</code></a>, <a href="#parameter-has_issues"><code>has_issues</code></a>, <a href="#parameter-has_merge_request"><code>has_merge_request</code></a>, <a href="#parameter-has_remediations"><code>has_remediations</code></a>, <a href="#parameter-has_resolution"><code>has_resolution</code></a>, <a href="#parameter-identifier_name"><code>identifier_name</code></a>, <a href="#parameter-sort"><code>sort</code></a></td>
    <td>Vulnerabilities reported on projects on the current user's instance security dashboard. Generated from the GitLab GraphQL schema field Query.vulnerabilities (connection of Vulnerability nodes).</td>
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
<tr id="parameter-has_ai_resolution">
    <td><CopyableCode code="has_ai_resolution" /></td>
    <td><code>boolean</code></td>
    <td>Returns only the vulnerabilities which can likely be resolved by GitLab Duo Vulnerability Resolution.</td>
</tr>
<tr id="parameter-has_issues">
    <td><CopyableCode code="has_issues" /></td>
    <td><code>boolean</code></td>
    <td>Returns only the vulnerabilities which have linked issues.</td>
</tr>
<tr id="parameter-has_merge_request">
    <td><CopyableCode code="has_merge_request" /></td>
    <td><code>boolean</code></td>
    <td>Returns only the vulnerabilities which have linked merge requests.</td>
</tr>
<tr id="parameter-has_remediations">
    <td><CopyableCode code="has_remediations" /></td>
    <td><code>boolean</code></td>
    <td>Returns only the vulnerabilities which have remediations.</td>
</tr>
<tr id="parameter-has_resolution">
    <td><CopyableCode code="has_resolution" /></td>
    <td><code>boolean</code></td>
    <td>Returns only the vulnerabilities which have been resolved on default branch.</td>
</tr>
<tr id="parameter-identifier_name">
    <td><CopyableCode code="identifier_name" /></td>
    <td><code>string</code></td>
    <td>Filter vulnerabilities by identifier name. Ignored when applied on instance security dashboard queries.</td>
</tr>
<tr id="parameter-sort">
    <td><CopyableCode code="sort" /></td>
    <td><code>string</code></td>
    <td>List vulnerabilities by sort order.</td>
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

Vulnerabilities reported on projects on the current user's instance security dashboard. Generated from the GitLab GraphQL schema field Query.vulnerabilities (connection of Vulnerability nodes).

```sql
SELECT
id,
name,
ai_resolution_available,
ai_resolution_enabled,
confirmed_at,
description,
detected_at,
dismissal_reason,
dismissed_at,
false_positive,
has_remediations,
present_on_default_branch,
project,
removed_from_code,
report_type,
resolved_at,
resolved_on_default_branch,
severity,
solution,
state,
state_comment,
title,
unverified,
updated_at,
user_notes_count,
uuid,
vulnerability_path,
web_url
FROM gitlab.security.vulnerabilities
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND has_ai_resolution = '{{ has_ai_resolution }}'
AND has_issues = '{{ has_issues }}'
AND has_merge_request = '{{ has_merge_request }}'
AND has_remediations = '{{ has_remediations }}'
AND has_resolution = '{{ has_resolution }}'
AND identifier_name = '{{ identifier_name }}'
AND sort = '{{ sort }}'
;
```
</TabItem>
</Tabs>
