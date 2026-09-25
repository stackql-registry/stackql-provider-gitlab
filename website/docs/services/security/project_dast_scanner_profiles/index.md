--- 
title: project_dast_scanner_profiles
hide_title: false
hide_table_of_contents: false
keywords:
  - project_dast_scanner_profiles
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

Gets or lists a <code>project_dast_scanner_profiles</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="project_dast_scanner_profiles" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.security.project_dast_scanner_profiles" /></td></tr>
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
    <td>ID of the DAST scanner profile.</td>
</tr>
<tr>
    <td><CopyableCode code="profile_name" /></td>
    <td><code>string</code></td>
    <td>Name of the DAST scanner profile.</td>
</tr>
<tr>
    <td><CopyableCode code="edit_path" /></td>
    <td><code>string</code></td>
    <td>Relative web path to the edit page of a scanner profile.</td>
</tr>
<tr>
    <td><CopyableCode code="referenced_in_security_policies" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="scan_type" /></td>
    <td><code>string</code></td>
    <td>Indicates the type of DAST scan that will run. Either a Passive Scan or an Active Scan. (PASSIVE, ACTIVE)</td>
</tr>
<tr>
    <td><CopyableCode code="show_debug_messages" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if debug messages should be included in DAST console output. True to include the debug messages.</td>
</tr>
<tr>
    <td><CopyableCode code="spider_timeout" /></td>
    <td><code>integer</code></td>
    <td>Maximum number of minutes allowed for the spider to traverse the site.</td>
</tr>
<tr>
    <td><CopyableCode code="target_timeout" /></td>
    <td><code>integer</code></td>
    <td>Maximum number of seconds allowed for the site under test to respond to a request.</td>
</tr>
<tr>
    <td><CopyableCode code="use_ajax_spider" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the AJAX spider should be used to crawl the target site. True to run the AJAX spider in addition to the traditional spider, and false to run only the traditional spider.</td>
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
    <td></td>
    <td>DAST scanner profiles associated with the project. Generated from the GitLab GraphQL schema field Project.dastScannerProfiles (connection of DastScannerProfile nodes).</td>
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
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

DAST scanner profiles associated with the project. Generated from the GitLab GraphQL schema field Project.dastScannerProfiles (connection of DastScannerProfile nodes).

```sql
SELECT
id,
profile_name,
edit_path,
referenced_in_security_policies,
scan_type,
show_debug_messages,
spider_timeout,
target_timeout,
use_ajax_spider
FROM gitlab.security.project_dast_scanner_profiles
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
