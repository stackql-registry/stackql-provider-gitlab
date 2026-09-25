--- 
title: security_configuration
hide_title: false
hide_table_of_contents: false
keywords:
  - security_configuration
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

Gets or lists a <code>security_configuration</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="security_configuration" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.security.security_configuration" /></td></tr>
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
    <td><CopyableCode code="auto_devops_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether Auto DevOps is enabled for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_devops_help_page_path" /></td>
    <td><code>string</code></td>
    <td>Path to Auto DevOps help documentation.</td>
</tr>
<tr>
    <td><CopyableCode code="auto_devops_path" /></td>
    <td><code>string</code></td>
    <td>Path to Auto DevOps settings.</td>
</tr>
<tr>
    <td><CopyableCode code="can_apply_profiles" /></td>
    <td><code>boolean</code></td>
    <td>Whether the current user can apply security profiles.</td>
</tr>
<tr>
    <td><CopyableCode code="can_enable_auto_devops" /></td>
    <td><code>boolean</code></td>
    <td>Whether the current user can enable Auto DevOps.</td>
</tr>
<tr>
    <td><CopyableCode code="can_manage_attributes" /></td>
    <td><code>boolean</code></td>
    <td>Whether the current user can manage security attributes.</td>
</tr>
<tr>
    <td><CopyableCode code="can_read_attributes" /></td>
    <td><code>boolean</code></td>
    <td>Whether the current user can read security attributes.</td>
</tr>
<tr>
    <td><CopyableCode code="container_scanning_for_registry_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether container scanning for registry is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="gitlab_ci_history_path" /></td>
    <td><code>string</code></td>
    <td>Path to the GitLab CI configuration file history.</td>
</tr>
<tr>
    <td><CopyableCode code="gitlab_ci_present" /></td>
    <td><code>boolean</code></td>
    <td>Whether a GitLab CI configuration file exists in the project.</td>
</tr>
<tr>
    <td><CopyableCode code="group_full_path" /></td>
    <td><code>string</code></td>
    <td>Full path of the root ancestor group.</td>
</tr>
<tr>
    <td><CopyableCode code="group_manage_attributes_path" /></td>
    <td><code>string</code></td>
    <td>Path to manage group security attributes.</td>
</tr>
<tr>
    <td><CopyableCode code="help_page_path" /></td>
    <td><code>string</code></td>
    <td>Path to application security help documentation.</td>
</tr>
<tr>
    <td><CopyableCode code="latest_pipeline_path" /></td>
    <td><code>string</code></td>
    <td>Path to the latest pipeline on the default branch.</td>
</tr>
<tr>
    <td><CopyableCode code="license_configuration_source" /></td>
    <td><code>string</code></td>
    <td>Source of license configuration.</td>
</tr>
<tr>
    <td><CopyableCode code="license_scanning_for_cyclonedx_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether license scanning for CycloneDX SBOM files is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="max_tracked_refs" /></td>
    <td><code>integer</code></td>
    <td>Maximum number of refs that can be tracked for security scanning.</td>
</tr>
<tr>
    <td><CopyableCode code="secret_detection_configuration_path" /></td>
    <td><code>string</code></td>
    <td>Path to secret detection configuration.</td>
</tr>
<tr>
    <td><CopyableCode code="secret_push_protection_available" /></td>
    <td><code>boolean</code></td>
    <td>Whether secret push protection is available for projects in the instance.</td>
</tr>
<tr>
    <td><CopyableCode code="secret_push_protection_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether secret push protection is enabled for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="secret_push_protection_enforced" /></td>
    <td><code>boolean</code></td>
    <td>Whether secret push protection is automatically enforced for all projects in the instance.</td>
</tr>
<tr>
    <td><CopyableCode code="security_scan_profiles_licensed" /></td>
    <td><code>boolean</code></td>
    <td>Whether the project has a license for security scan profiles.</td>
</tr>
<tr>
    <td><CopyableCode code="security_training_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether security training is available for the project.</td>
</tr>
<tr>
    <td><CopyableCode code="upgrade_path" /></td>
    <td><code>string</code></td>
    <td>Path to upgrade security features.</td>
</tr>
<tr>
    <td><CopyableCode code="user_is_project_admin" /></td>
    <td><code>boolean</code></td>
    <td>Whether the current user has admin permissions for security testing.</td>
</tr>
<tr>
    <td><CopyableCode code="validity_checks_available" /></td>
    <td><code>boolean</code></td>
    <td>Whether secret detection validity checks are available.</td>
</tr>
<tr>
    <td><CopyableCode code="validity_checks_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether secret detection validity checks are enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="vulnerability_archive_export_path" /></td>
    <td><code>string</code></td>
    <td>Path to export vulnerability archives via API.</td>
</tr>
<tr>
    <td><CopyableCode code="vulnerability_training_docs_path" /></td>
    <td><code>string</code></td>
    <td>Path to vulnerability training documentation.</td>
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
    <td><a href="#parameter-project_id"><code>project_id</code></a>, <a href="#parameter-host"><code>host</code></a></td>
    <td></td>
    <td>Security configuration for the project Generated from the GitLab GraphQL schema field Query.securityConfiguration (SecurityConfiguration).</td>
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
<tr id="parameter-project_id">
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>Project to get the security configuration for.</td>
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

Security configuration for the project Generated from the GitLab GraphQL schema field Query.securityConfiguration (SecurityConfiguration).

```sql
SELECT
auto_devops_enabled,
auto_devops_help_page_path,
auto_devops_path,
can_apply_profiles,
can_enable_auto_devops,
can_manage_attributes,
can_read_attributes,
container_scanning_for_registry_enabled,
gitlab_ci_history_path,
gitlab_ci_present,
group_full_path,
group_manage_attributes_path,
help_page_path,
latest_pipeline_path,
license_configuration_source,
license_scanning_for_cyclonedx_enabled,
max_tracked_refs,
secret_detection_configuration_path,
secret_push_protection_available,
secret_push_protection_enabled,
secret_push_protection_enforced,
security_scan_profiles_licensed,
security_training_enabled,
upgrade_path,
user_is_project_admin,
validity_checks_available,
validity_checks_enabled,
vulnerability_archive_export_path,
vulnerability_training_docs_path
FROM gitlab.security.security_configuration
WHERE project_id = '{{ project_id }}' -- required
AND host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
