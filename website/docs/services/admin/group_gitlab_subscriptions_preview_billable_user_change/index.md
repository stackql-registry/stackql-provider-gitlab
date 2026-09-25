--- 
title: group_gitlab_subscriptions_preview_billable_user_change
hide_title: false
hide_table_of_contents: false
keywords:
  - group_gitlab_subscriptions_preview_billable_user_change
  - admin
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

Gets or lists a <code>group_gitlab_subscriptions_preview_billable_user_change</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_gitlab_subscriptions_preview_billable_user_change" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.admin.group_gitlab_subscriptions_preview_billable_user_change" /></td></tr>
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
    <td><CopyableCode code="new_billable_user_count" /></td>
    <td><code>integer</code></td>
    <td>Total number of billable users after change.</td>
</tr>
<tr>
    <td><CopyableCode code="seats_in_subscription" /></td>
    <td><code>integer</code></td>
    <td>Number of seats in subscription.</td>
</tr>
<tr>
    <td><CopyableCode code="will_increase_overage" /></td>
    <td><code>boolean</code></td>
    <td> If the group will have an increased overage after change.</td>
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
    <td><a href="#parameter-full_path"><code>full_path</code></a>, <a href="#parameter-role"><code>role</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td><a href="#parameter-add_group_id"><code>add_group_id</code></a>, <a href="#parameter-member_role_id"><code>member_role_id</code></a></td>
    <td>Preview Billable User Changes Generated from the GitLab GraphQL schema field Group.gitlabSubscriptionsPreviewBillableUserChange (PreviewBillableUserChange).</td>
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
<tr id="parameter-role">
    <td><CopyableCode code="role" /></td>
    <td><code>string</code></td>
    <td>Role of users being added to group.</td>
</tr>
<tr id="parameter-add_group_id">
    <td><CopyableCode code="add_group_id" /></td>
    <td><code>integer</code></td>
    <td>Group ID to add.</td>
</tr>
<tr id="parameter-member_role_id">
    <td><CopyableCode code="member_role_id" /></td>
    <td><code>integer</code></td>
    <td>Custom role assigned to the users.</td>
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

Preview Billable User Changes Generated from the GitLab GraphQL schema field Group.gitlabSubscriptionsPreviewBillableUserChange (PreviewBillableUserChange).

```sql
SELECT
new_billable_user_count,
seats_in_subscription,
will_increase_overage
FROM gitlab.admin.group_gitlab_subscriptions_preview_billable_user_change
WHERE full_path = '{{ full_path }}' -- required
AND role = '{{ role }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
AND add_group_id = '{{ add_group_id }}'
AND member_role_id = '{{ member_role_id }}'
;
```
</TabItem>
</Tabs>
