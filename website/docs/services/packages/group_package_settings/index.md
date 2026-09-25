--- 
title: group_package_settings
hide_title: false
hide_table_of_contents: false
keywords:
  - group_package_settings
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

Gets or lists a <code>group_package_settings</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="group_package_settings" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.packages.group_package_settings" /></td></tr>
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
    <td><CopyableCode code="audit_events_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether audit events are created when publishing or deleting a package in the namespace (Premium and Ultimate only).</td>
</tr>
<tr>
    <td><CopyableCode code="generic_duplicate_exception_regex" /></td>
    <td><code>string</code></td>
    <td>When generic_duplicates_allowed is false, you can publish duplicate packages with names that match this regex. Otherwise, this setting has no effect.</td>
</tr>
<tr>
    <td><CopyableCode code="generic_duplicates_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether duplicate generic packages are allowed for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="lock_maven_package_requests_forwarding" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether Maven package forwarding is locked for all descendent namespaces.</td>
</tr>
<tr>
    <td><CopyableCode code="lock_npm_package_requests_forwarding" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether npm package forwarding is locked for all descendent namespaces.</td>
</tr>
<tr>
    <td><CopyableCode code="lock_pypi_package_requests_forwarding" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether PyPI package forwarding is locked for all descendent namespaces.</td>
</tr>
<tr>
    <td><CopyableCode code="maven_duplicate_exception_regex" /></td>
    <td><code>string</code></td>
    <td>When maven_duplicates_allowed is false, you can publish duplicate packages with names that match this regex. Otherwise, this setting has no effect.</td>
</tr>
<tr>
    <td><CopyableCode code="maven_duplicates_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether duplicate Maven packages are allowed for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="maven_package_requests_forwarding" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether Maven package forwarding is allowed for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="maven_package_requests_forwarding_locked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether Maven package forwarding settings are locked by a parent namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="npm_package_requests_forwarding" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether npm package forwarding is allowed for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="npm_package_requests_forwarding_locked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether npm package forwarding settings are locked by a parent namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="nuget_duplicate_exception_regex" /></td>
    <td><code>string</code></td>
    <td>When nuget_duplicates_allowed is false, you can publish duplicate packages with names that match this regex. Otherwise, this setting has no effect. </td>
</tr>
<tr>
    <td><CopyableCode code="nuget_duplicates_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether duplicate NuGet packages are allowed for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="nuget_symbol_server_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the NuGet symbol server is enabled for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="pypi_package_requests_forwarding" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether PyPI package forwarding is allowed for the namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="pypi_package_requests_forwarding_locked" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether PyPI package forwarding settings are locked by a parent namespace.</td>
</tr>
<tr>
    <td><CopyableCode code="terraform_module_duplicate_exception_regex" /></td>
    <td><code>string</code></td>
    <td>When terraform_module_duplicates_allowed is false, you can publish duplicate packages with names that match this regex. Otherwise, this setting has no effect.</td>
</tr>
<tr>
    <td><CopyableCode code="terraform_module_duplicates_allowed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether duplicate Terraform packages are allowed for the namespace.</td>
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
    <td>Package settings for the namespace. Generated from the GitLab GraphQL schema field Group.packageSettings (PackageSettings).</td>
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

Package settings for the namespace. Generated from the GitLab GraphQL schema field Group.packageSettings (PackageSettings).

```sql
SELECT
audit_events_enabled,
generic_duplicate_exception_regex,
generic_duplicates_allowed,
lock_maven_package_requests_forwarding,
lock_npm_package_requests_forwarding,
lock_pypi_package_requests_forwarding,
maven_duplicate_exception_regex,
maven_duplicates_allowed,
maven_package_requests_forwarding,
maven_package_requests_forwarding_locked,
npm_package_requests_forwarding,
npm_package_requests_forwarding_locked,
nuget_duplicate_exception_regex,
nuget_duplicates_allowed,
nuget_symbol_server_enabled,
pypi_package_requests_forwarding,
pypi_package_requests_forwarding_locked,
terraform_module_duplicate_exception_regex,
terraform_module_duplicates_allowed
FROM gitlab.packages.group_package_settings
WHERE full_path = '{{ full_path }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
