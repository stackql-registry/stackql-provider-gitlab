--- 
title: project_container_tags_expiration_policy
hide_title: false
hide_table_of_contents: false
keywords:
  - project_container_tags_expiration_policy
  - packages
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

Gets or lists a <code>project_container_tags_expiration_policy</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_container_tags_expiration_policy" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.packages.project_container_tags_expiration_policy" /></td></tr>
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
    <td><CopyableCode code="cadence" /></td>
    <td><code>string</code></td>
    <td>Schedule of the container expiration policy. (EVERY_DAY, EVERY_WEEK, EVERY_TWO_WEEKS, EVERY_MONTH, EVERY_THREE_MONTHS)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the container expiration policy was created.</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the container expiration policy is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="keep_n" /></td>
    <td><code>string</code></td>
    <td>Number of tags to retain. (ONE_TAG, FIVE_TAGS, TEN_TAGS, TWENTY_FIVE_TAGS, FIFTY_TAGS, ONE_HUNDRED_TAGS)</td>
</tr>
<tr>
    <td><CopyableCode code="name_regex" /></td>
    <td><code>string</code></td>
    <td>Tags with names matching the regex pattern will expire.</td>
</tr>
<tr>
    <td><CopyableCode code="name_regex_keep" /></td>
    <td><code>string</code></td>
    <td>Tags with names matching the regex pattern will be preserved.</td>
</tr>
<tr>
    <td><CopyableCode code="next_run_at" /></td>
    <td><code>string</code></td>
    <td>Next time that the container expiration policy will get executed.</td>
</tr>
<tr>
    <td><CopyableCode code="older_than" /></td>
    <td><code>string</code></td>
    <td>Tags older than the given age will expire. (ONE_DAY, THREE_DAYS, SEVEN_DAYS, FOURTEEN_DAYS, THIRTY_DAYS, SIXTY_DAYS, NINETY_DAYS, ONE_HUNDRED_EIGHTY_DAYS, THREE_HUNDRED_SIXTY_FIVE_DAYS, SEVEN_HUNDRED_THIRTY_DAYS, ONE_THOUSAND_NINETY_FIVE_DAYS)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Timestamp of when the container expiration policy was updated.</td>
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
    <td>Container tags expiration policy of the project. Generated from the GitLab GraphQL schema field Project.containerTagsExpirationPolicy (ContainerTagsExpirationPolicy).</td>
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

Container tags expiration policy of the project. Generated from the GitLab GraphQL schema field Project.containerTagsExpirationPolicy (ContainerTagsExpirationPolicy).

```sql
SELECT
cadence,
created_at,
enabled,
keep_n,
name_regex,
name_regex_keep,
next_run_at,
older_than,
updated_at
FROM gitlab.packages.project_container_tags_expiration_policy
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
