--- 
title: package
hide_title: false
hide_table_of_contents: false
keywords:
  - package
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

Gets or lists a <code>package</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="package" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.packages.package" /></td></tr>
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
    <td>ID of the package.</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Name of the package.</td>
</tr>
<tr>
    <td><CopyableCode code="composer_config_repository_url" /></td>
    <td><code>string</code></td>
    <td>Url of the Composer setup endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="composer_url" /></td>
    <td><code>string</code></td>
    <td>Url of the Composer endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="conan_url" /></td>
    <td><code>string</code></td>
    <td>Url of the Conan project endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string</code></td>
    <td>Date of creation.</td>
</tr>
<tr>
    <td><CopyableCode code="last_downloaded_at" /></td>
    <td><code>string</code></td>
    <td>Last time that a file of the package was downloaded.</td>
</tr>
<tr>
    <td><CopyableCode code="maven_url" /></td>
    <td><code>string</code></td>
    <td>Url of the Maven project endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="npm_url" /></td>
    <td><code>string</code></td>
    <td>Url of the NPM project endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="nuget_url" /></td>
    <td><code>string</code></td>
    <td>Url of the Nuget project endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="package_type" /></td>
    <td><code>string</code></td>
    <td>Package type. (MAVEN, NPM, CONAN, NUGET, PYPI, COMPOSER, GENERIC, GOLANG, DEBIAN, RUBYGEMS, HELM, TERRAFORM_MODULE, RPM, ML_MODEL, CARGO)</td>
</tr>
<tr>
    <td><CopyableCode code="project" /></td>
    <td><code>object</code></td>
    <td>Project identity (id, full_path, name)</td>
</tr>
<tr>
    <td><CopyableCode code="protection_rule_exists" /></td>
    <td><code>boolean</code></td>
    <td>Whether any matching package protection rule exists for the package.</td>
</tr>
<tr>
    <td><CopyableCode code="public_package" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if there is public access to the package.</td>
</tr>
<tr>
    <td><CopyableCode code="pypi_setup_url" /></td>
    <td><code>string</code></td>
    <td>Url of the PyPi project setup endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="pypi_url" /></td>
    <td><code>string</code></td>
    <td>Url of the PyPi project endpoint.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>Package status. (DEFAULT, HIDDEN, PROCESSING, ERROR, PENDING_DESTRUCTION, DEPRECATED)</td>
</tr>
<tr>
    <td><CopyableCode code="status_message" /></td>
    <td><code>string</code></td>
    <td>Status message.</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string</code></td>
    <td>Date of most recent update.</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>Version string.</td>
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
    <td>Find a package. This field can only be resolved for one query in any single request. Returns `null` if a package has no `default` status. Generated from the GitLab GraphQL schema field Query.package (PackageDetailsType).</td>
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
    <td>Global ID of the package.</td>
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

Find a package. This field can only be resolved for one query in any single request. Returns `null` if a package has no `default` status. Generated from the GitLab GraphQL schema field Query.package (PackageDetailsType).

```sql
SELECT
id,
name,
composer_config_repository_url,
composer_url,
conan_url,
created_at,
last_downloaded_at,
maven_url,
npm_url,
nuget_url,
package_type,
project,
protection_rule_exists,
public_package,
pypi_setup_url,
pypi_url,
status,
status_message,
updated_at,
version
FROM gitlab.packages.package
WHERE id = '{{ id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
