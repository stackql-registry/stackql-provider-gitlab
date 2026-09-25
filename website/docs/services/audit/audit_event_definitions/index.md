--- 
title: audit_event_definitions
hide_title: false
hide_table_of_contents: false
keywords:
  - audit_event_definitions
  - audit
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

Creates, updates, deletes, gets or lists an <code>audit_event_definitions</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="audit_event_definitions" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gitlab.audit.audit_event_definitions" /></td></tr>
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
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Key name of the audit event.</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>Description of what action the audit event tracks.</td>
</tr>
<tr>
    <td><CopyableCode code="feature_category" /></td>
    <td><code>string</code></td>
    <td>Feature category associated with the event.</td>
</tr>
<tr>
    <td><CopyableCode code="introduced_by_issue" /></td>
    <td><code>string</code></td>
    <td>Link to the issue introducing the event. For olderaudit events, it can be a commit URL rather than amerge request URL.</td>
</tr>
<tr>
    <td><CopyableCode code="introduced_by_mr" /></td>
    <td><code>string</code></td>
    <td>Link to the merge request introducing the event. Forolder audit events, it can be a commit URL rather thana merge request URL.</td>
</tr>
<tr>
    <td><CopyableCode code="milestone" /></td>
    <td><code>string</code></td>
    <td>Milestone the event was introduced in.</td>
</tr>
<tr>
    <td><CopyableCode code="saved_to_database" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the event is saved to PostgreSQL database.</td>
</tr>
<tr>
    <td><CopyableCode code="streamed" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the event is streamed to an external destination.</td>
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
    <td></td>
    <td>Definitions for all audit events available on the instance. Generated from the GitLab GraphQL schema field Query.auditEventDefinitions (connection of AuditEventDefinition nodes).</td>
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

Definitions for all audit events available on the instance. Generated from the GitLab GraphQL schema field Query.auditEventDefinitions (connection of AuditEventDefinition nodes).

```sql
SELECT
name,
description,
feature_category,
introduced_by_issue,
introduced_by_mr,
milestone,
saved_to_database,
streamed
FROM gitlab.audit.audit_event_definitions
WHERE host = '{{ host }}' -- required (defaults to gitlab.com; or set GITLAB_HOST)
;
```
</TabItem>
</Tabs>
