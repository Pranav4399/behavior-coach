# Database Schema Documentation

> Automatically generated from Prisma schema at 5/5/2025, 10:41:40 PM

## Table of Contents

### Models

- [Organization](#organization)
- [User](#user)
- [UserPreferences](#userpreferences)
- [Role](#role)
- [Integration](#integration)
- [Worker](#worker)
- [WorkerContact](#workercontact)
- [WorkerEmployment](#workeremployment)
- [WorkerEngagement](#workerengagement)
- [WorkerWellbeing](#workerwellbeing)
- [WorkerGamification](#workergamification)
- [Segment](#segment)
- [SegmentMembership](#segmentmembership)
- [SegmentSyncJob](#segmentsyncjob)
- [Content](#content)
- [TextContent](#textcontent)
- [ImageContent](#imagecontent)
- [VideoContent](#videocontent)
- [AudioContent](#audiocontent)
- [DocumentContent](#documentcontent)
- [QuizContent](#quizcontent)
- [ReflectionContent](#reflectioncontent)
- [TemplateContent](#templatecontent)
- [MediaAsset](#mediaasset)
- [ContentVersion](#contentversion)
- [Tag](#tag)
- [ContentTag](#contenttag)
- [Collection](#collection)
- [CollectionItem](#collectionitem)

### Enums

- [OrganizationType](#organizationtype)
- [Gender](#gender)
- [OptInStatus](#optinstatus)
- [EmploymentStatus](#employmentstatus)
- [EmploymentType](#employmenttype)
- [DeactivationReason](#deactivationreason)
- [SegmentType](#segmenttype)
- [SegmentSyncStatus](#segmentsyncstatus)
- [ContentStatus](#contentstatus)
- [ContentType](#contenttype)
- [MediaType](#mediatype)

## Models

### Organization

Table: `organizations`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| name | String | Yes |  |  |
| description | String? | No | //, Organization, description |  |
| website | String? | No | //, Organization, website, URL |  |
| type | OrganizationType | Yes |  |  |
| subscriptionTier | String | Yes | @map("subscription_tier") |  |
| logoUrl | String? | No | @map("logo_url") |  |
| customTerminology | Json? | No | @map("custom_terminology"), //, Stored, as, JSON |  |
| settings | Json? | No | //, Organization-specific, settings |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| users | User[] | Yes |  |  |
| roles | Role[] | Yes |  |  |
| integrations | Integration[] | Yes |  |  |
| workers | Worker[] | Yes | //, Relation, to, Worker |  |
| segments | Segment[] | Yes | //, Relation, to, Segment |  |
| contents | Content[] | Yes |  |  |
| mediaAssets | MediaAsset[] | Yes |  |  |
| tags | Tag[] | Yes |  |  |
| collections | Collection[] | Yes |  |  |

#### Relations

- `type`: One-to-one relation with [OrganizationType](#organizationtype)
- `users`: One-to-many relation with [User](#user)
- `roles`: One-to-many relation with [Role](#role)
- `integrations`: One-to-many relation with [Integration](#integration)
- `workers`: One-to-many relation with [Worker](#worker)
- `segments`: One-to-many relation with [Segment](#segment)
- `contents`: One-to-many relation with [Content](#content)
- `mediaAssets`: One-to-many relation with [MediaAsset](#mediaasset)
- `tags`: One-to-many relation with [Tag](#tag)
- `collections`: One-to-many relation with [Collection](#collection)

### User

Table: `users`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| email | String | Yes | @unique |  |
| name | String? | No |  |  |
| password | String | Yes |  |  |
| status | String? | No | @default("active") |  |
| lastLoginAt | DateTime? | No | @map("last_login_at") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String? | No | @map("organization_id") | Relation to Organization |
| organization | Organization? | No | @relation(fields:, [organizationId],, references:, [id]) |  |
| roleId | String? | No | @map("role_id") | Relation to Role |
| role | Role? | No | @relation(fields:, [roleId],, references:, [id]) |  |
| preferences | UserPreferences? | No |  | Relation to UserPreferences |
| createdSegments | Segment[] | Yes | @relation("CreatedBy") | Relation to segments (for created/modified by) |
| updatedSegments | Segment[] | Yes | @relation("UpdatedBy") |  |
| createdContents | Content[] | Yes | @relation("ContentCreatedBy") | Content relations |
| updatedContents | Content[] | Yes | @relation("ContentUpdatedBy") |  |
| mediaUploads | MediaAsset[] | Yes |  |  |
| contentVersions | ContentVersion[] | Yes |  |  |
| collections | Collection[] | Yes |  |  |

#### Relations

- `organization`: One-to-one relation with [Organization](#organization)
- `role`: One-to-one relation with [Role](#role)
- `preferences`: One-to-one relation with [UserPreferences](#userpreferences)
- `createdSegments`: One-to-many relation with [Segment](#segment)
- `updatedSegments`: One-to-many relation with [Segment](#segment)
- `createdContents`: One-to-many relation with [Content](#content)
- `updatedContents`: One-to-many relation with [Content](#content)
- `mediaUploads`: One-to-many relation with [MediaAsset](#mediaasset)
- `contentVersions`: One-to-many relation with [ContentVersion](#contentversion)
- `collections`: One-to-many relation with [Collection](#collection)

### UserPreferences

Table: `user_preferences`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| userId | String | Yes | @unique, @map("user_id") |  |
| user | User | Yes | @relation(fields:, [userId],, references:, [id]) |  |
| theme | String | Yes | @default("system") |  |
| language | String | Yes | @default("en") |  |
| emailNotifications | Boolean | Yes | @default(true), @map("email_notifications") |  |
| pushNotifications | Boolean | Yes | @default(true), @map("push_notifications") |  |
| timezone | String | Yes | @default("UTC") |  |
| dateFormat | String | Yes | @default("YYYY-MM-DD"), @map("date_format") |  |
| customSettings | Json? | No | @map("custom_settings") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `user`: One-to-one relation with [User](#user)

### Role

Table: `roles`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| name | String | Yes |  |  |
| displayName | String | Yes | @map("display_name") |  |
| description | String? | No | @default("") |  |
| isDefault | Boolean | Yes | @default(false), @map("is_default") |  |
| permissions | Json | Yes | //, Stored, as, JSON, array, of, permission, strings |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Relation to Organization |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| users | User[] | Yes |  | Relation to Users |

#### Relations

- `organization`: One-to-one relation with [Organization](#organization)
- `users`: One-to-many relation with [User](#user)

### Integration

Table: `integrations`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| type | String | Yes |  |  |
| config | Json | Yes |  |  |
| status | String | Yes | @default("inactive") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Relation to Organization |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |

#### Relations

- `organization`: One-to-one relation with [Organization](#organization)

### Worker

Core Worker model - contains only essential worker information

Table: `workers`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| externalId | String? | No | @map("external_id") |  |
| firstName | String | Yes | @map("first_name") |  |
| lastName | String | Yes | @map("last_name") |  |
| dateOfBirth | DateTime? | No | @map("date_of_birth") |  |
| gender | Gender? | No |  |  |
| tags | String[] | Yes |  |  |
| customFields | Json? | No | @map("custom_fields"), //, Moving, customFields, back, to, the, core, Worker, model |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") | Timestamps |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Relationships |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| contact | WorkerContact? | No |  | Relations to other worker-related tables |
| employment | WorkerEmployment? | No |  |  |
| engagement | WorkerEngagement? | No |  |  |
| wellbeing | WorkerWellbeing? | No |  |  |
| gamification | WorkerGamification? | No |  |  |
| supervisorId | String? | No | @map("supervisor_id") | Self-relation for supervisor (kept in core table for simplicity) |
| supervisor | Worker? | No | @relation("WorkerToSupervisor",, fields:, [supervisorId],, references:, [id]) |  |
| supervisees | Worker[] | Yes | @relation("WorkerToSupervisor") |  |
| segmentMemberships | SegmentMembership[] | Yes |  | Relation to segments |
| isActive | Boolean | Yes | @default(true) |  |
| deactivationReason | DeactivationReason? | No |  |  |

#### Relations

- `gender`: One-to-one relation with [Gender](#gender)
- `organization`: One-to-one relation with [Organization](#organization)
- `contact`: One-to-one relation with [WorkerContact](#workercontact)
- `employment`: One-to-one relation with [WorkerEmployment](#workeremployment)
- `engagement`: One-to-one relation with [WorkerEngagement](#workerengagement)
- `wellbeing`: One-to-one relation with [WorkerWellbeing](#workerwellbeing)
- `gamification`: One-to-one relation with [WorkerGamification](#workergamification)
- `supervisor`: One-to-one relation with [Worker](#worker)
- `supervisees`: One-to-many relation with [Worker](#worker)
- `segmentMemberships`: One-to-many relation with [SegmentMembership](#segmentmembership)
- `deactivationReason`: One-to-one relation with [DeactivationReason](#deactivationreason)

### WorkerContact

Worker contact information

Table: `worker_contacts`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| workerId | String | Yes | @unique, @map("worker_id") |  |
| worker | Worker | Yes | @relation(fields:, [workerId],, references:, [id],, onDelete:, Cascade) |  |
| locationCity | String? | No | @map("location_city") | Location |
| locationStateProvince | String? | No | @map("location_state_province") |  |
| locationCountry | String? | No | @map("location_country") |  |
| primaryPhoneNumber | String | Yes | @unique, @map("primary_phone_number") | Contact & Communication |
| whatsappOptInStatus | OptInStatus | Yes | @map("whatsapp_opt_in_status") |  |
| preferredLanguage | String | Yes | @map("preferred_language") |  |
| communicationConsent | Boolean | Yes | @default(false), @map("communication_consent") |  |
| emailAddress | String? | No | @map("email_address") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") | Timestamps |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `worker`: One-to-one relation with [Worker](#worker)
- `whatsappOptInStatus`: One-to-one relation with [OptInStatus](#optinstatus)

### WorkerEmployment

Worker employment information

Table: `worker_employments`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| workerId | String | Yes | @unique, @map("worker_id") |  |
| worker | Worker | Yes | @relation(fields:, [workerId],, references:, [id],, onDelete:, Cascade) |  |
| jobTitle | String? | No | @map("job_title") | Employment & Organizational Data |
| department | String? | No |  |  |
| team | String? | No |  |  |
| hireDate | DateTime? | No | @map("hire_date") |  |
| employmentStatus | EmploymentStatus | Yes | @default(active), @map("employment_status") |  |
| employmentType | EmploymentType? | No | @map("employment_type") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") | Timestamps |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `worker`: One-to-one relation with [Worker](#worker)
- `employmentStatus`: One-to-one relation with [EmploymentStatus](#employmentstatus)
- `employmentType`: One-to-one relation with [EmploymentType](#employmenttype)

### WorkerEngagement

Worker platform engagement data

Table: `worker_engagements`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| workerId | String | Yes | @unique, @map("worker_id") |  |
| worker | Worker | Yes | @relation(fields:, [workerId],, references:, [id],, onDelete:, Cascade) |  |
| lastActiveAt | DateTime? | No | @map("last_active_at") | Platform Engagement |
| lastInteractionDate | DateTime? | No | @map("last_interaction_date") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") | Timestamps |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `worker`: One-to-one relation with [Worker](#worker)

### WorkerWellbeing

Worker wellbeing assessment data

Table: `worker_wellbeings`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| workerId | String | Yes | @unique, @map("worker_id") |  |
| worker | Worker | Yes | @relation(fields:, [workerId],, references:, [id],, onDelete:, Cascade) |  |
| lastWellbeingAssessmentDate | DateTime? | No | @map("last_wellbeing_assessment_date") | Wellbeing Data |
| overallWellbeingScore | Float? | No | @map("overall_wellbeing_score") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") | Timestamps |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `worker`: One-to-one relation with [Worker](#worker)

### WorkerGamification

Worker gamification data

Table: `worker_gamifications`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| workerId | String | Yes | @unique, @map("worker_id") |  |
| worker | Worker | Yes | @relation(fields:, [workerId],, references:, [id],, onDelete:, Cascade) |  |
| pointsBalance | Int | Yes | @default(0), @map("points_balance") | Gamification Data |
| badgesEarnedCount | Int | Yes | @default(0), @map("badges_earned_count") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") | Timestamps |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `worker`: One-to-one relation with [Worker](#worker)

### Segment

Segment model

Table: `segments`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| name | String | Yes |  |  |
| description | String? | No |  |  |
| type | SegmentType | Yes |  |  |
| ruleDefinition | Json? | No | @map("rule_definition"), //, JSON, object, containing, rule, definition, for, rule-based, segments |  |
| workerCount | Int | Yes | @default(0), @map("worker_count") |  |
| lastSyncAt | DateTime? | No | @map("last_sync_at"), //, When, segment, membership, was, last, recalculated, (for, rule-based, segments) |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Organization relation |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| createdById | String? | No | @map("created_by_id") | User audit relations |
| createdBy | User? | No | @relation("CreatedBy",, fields:, [createdById],, references:, [id]) |  |
| updatedById | String? | No | @map("updated_by_id") |  |
| updatedBy | User? | No | @relation("UpdatedBy",, fields:, [updatedById],, references:, [id]) |  |
| members | SegmentMembership[] | Yes |  | Worker membership relation |
| syncJobs | SegmentSyncJob[] | Yes |  | Sync job relation |

#### Relations

- `type`: One-to-one relation with [SegmentType](#segmenttype)
- `organization`: One-to-one relation with [Organization](#organization)
- `createdBy`: One-to-one relation with [User](#user)
- `updatedBy`: One-to-one relation with [User](#user)
- `members`: One-to-many relation with [SegmentMembership](#segmentmembership)
- `syncJobs`: One-to-many relation with [SegmentSyncJob](#segmentsyncjob)

### SegmentMembership

Worker-Segment membership model

Table: `segment_memberships`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| workerId | String | Yes | @map("worker_id") |  |
| worker | Worker | Yes | @relation(fields:, [workerId],, references:, [id],, onDelete:, Cascade) |  |
| segmentId | String | Yes | @map("segment_id") |  |
| segment | Segment | Yes | @relation(fields:, [segmentId],, references:, [id],, onDelete:, Cascade) |  |
| ruleMatch | Boolean | Yes | @default(false), @map("rule_match"), //, Whether, membership, is, due, to, rule, match, (true), or, manual, assignment, (false) |  |
| ruleMatchReason | String? | No | @map("rule_match_reason"), //, Description, of, which, rules, matched,, stored, as, text |  |
| addedAt | DateTime | Yes | @default(now()), @map("added_at") |  |

#### Relations

- `worker`: One-to-one relation with [Worker](#worker)
- `segment`: One-to-one relation with [Segment](#segment)

### SegmentSyncJob

Segment synchronization job model

Table: `segment_sync_jobs`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| segmentId | String | Yes | @map("segment_id") |  |
| segment | Segment | Yes | @relation(fields:, [segmentId],, references:, [id],, onDelete:, Cascade) |  |
| status | SegmentSyncStatus | Yes | @default(pending) |  |
| startedAt | DateTime? | No | @map("started_at") |  |
| completedAt | DateTime? | No | @map("completed_at") |  |
| processedCount | Int | Yes | @default(0), @map("processed_count"), //, Number, of, workers, processed |  |
| matchCount | Int | Yes | @default(0), @map("match_count"), //, Number, of, workers, matching, the, rules |  |
| errorMessage | String? | No | @map("error_message") |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |

#### Relations

- `segment`: One-to-one relation with [Segment](#segment)
- `status`: One-to-one relation with [SegmentSyncStatus](#segmentsyncstatus)

### Content

Content Model - Base table with common fields

Table: `contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| title | String | Yes |  |  |
| description | String? | No |  |  |
| status | ContentStatus | Yes | @default(draft) |  |
| type | ContentType | Yes |  |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Organization relation |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| createdById | String? | No | @map("created_by_id") | Creator relation |
| createdBy | User? | No | @relation("ContentCreatedBy",, fields:, [createdById],, references:, [id]) |  |
| updatedById | String? | No | @map("updated_by_id") | Last editor relation |
| updatedBy | User? | No | @relation("ContentUpdatedBy",, fields:, [updatedById],, references:, [id]) |  |
| versions | ContentVersion[] | Yes |  | Versioning relation |
| textContent | TextContent? | No |  | Content type relations |
| imageContent | ImageContent? | No |  |  |
| videoContent | VideoContent? | No |  |  |
| audioContent | AudioContent? | No |  |  |
| documentContent | DocumentContent? | No |  |  |
| quizContent | QuizContent? | No |  |  |
| reflectionContent | ReflectionContent? | No |  |  |
| templateContent | TemplateContent? | No |  |  |
| contentTags | ContentTag[] | Yes |  | Content tag relation |
| collectionItems | CollectionItem[] | Yes |  | Content collection relation |

#### Relations

- `status`: One-to-one relation with [ContentStatus](#contentstatus)
- `type`: One-to-one relation with [ContentType](#contenttype)
- `organization`: One-to-one relation with [Organization](#organization)
- `createdBy`: One-to-one relation with [User](#user)
- `updatedBy`: One-to-one relation with [User](#user)
- `versions`: One-to-many relation with [ContentVersion](#contentversion)
- `textContent`: One-to-one relation with [TextContent](#textcontent)
- `imageContent`: One-to-one relation with [ImageContent](#imagecontent)
- `videoContent`: One-to-one relation with [VideoContent](#videocontent)
- `audioContent`: One-to-one relation with [AudioContent](#audiocontent)
- `documentContent`: One-to-one relation with [DocumentContent](#documentcontent)
- `quizContent`: One-to-one relation with [QuizContent](#quizcontent)
- `reflectionContent`: One-to-one relation with [ReflectionContent](#reflectioncontent)
- `templateContent`: One-to-one relation with [TemplateContent](#templatecontent)
- `contentTags`: One-to-many relation with [ContentTag](#contenttag)
- `collectionItems`: One-to-many relation with [CollectionItem](#collectionitem)

### TextContent

Text Content type

Table: `text_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| text | String | Yes | @db.Text, //, Full, text, content |  |
| formatting | Json? | No | //, Optional, formatting, data, (markup,, styling) |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)

### ImageContent

Image Content type

Table: `image_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| mediaAssetId | String | Yes | @map("media_asset_id") |  |
| mediaAsset | MediaAsset | Yes | @relation(fields:, [mediaAssetId],, references:, [id]) |  |
| altText | String? | No | @map("alt_text") |  |
| caption | String? | No |  |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)
- `mediaAsset`: One-to-one relation with [MediaAsset](#mediaasset)

### VideoContent

Video Content type

Table: `video_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| mediaAssetId | String | Yes | @map("media_asset_id") |  |
| mediaAsset | MediaAsset | Yes | @relation(fields:, [mediaAssetId],, references:, [id]) |  |
| caption | String? | No |  |  |
| transcript | String? | No | @db.Text |  |
| duration | Int? | No | //, Duration, in, seconds |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)
- `mediaAsset`: One-to-one relation with [MediaAsset](#mediaasset)

### AudioContent

Audio Content type

Table: `audio_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| mediaAssetId | String | Yes | @map("media_asset_id") |  |
| mediaAsset | MediaAsset | Yes | @relation(fields:, [mediaAssetId],, references:, [id]) |  |
| caption | String? | No |  |  |
| transcript | String? | No | @db.Text |  |
| duration | Int? | No | //, Duration, in, seconds |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)
- `mediaAsset`: One-to-one relation with [MediaAsset](#mediaasset)

### DocumentContent

Document Content type

Table: `document_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| mediaAssetId | String | Yes | @map("media_asset_id") |  |
| mediaAsset | MediaAsset | Yes | @relation(fields:, [mediaAssetId],, references:, [id]) |  |
| description | String? | No |  |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)
- `mediaAsset`: One-to-one relation with [MediaAsset](#mediaasset)

### QuizContent

Quiz Content type

Table: `quiz_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| questions | Json | Yes | //, Array, of, questions, with, options, and, correct, answers |  |
| scoringType | String? | No | @map("scoring_type"), //, How, quiz, is, scored |  |
| timeLimit | Int? | No | @map("time_limit"), //, Time, limit, in, seconds,, if, applicable |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)

### ReflectionContent

Reflection Content type

Table: `reflection_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| promptText | String | Yes | @map("prompt_text"), @db.Text, //, The, reflection, prompt |  |
| guidanceText | String? | No | @map("guidance_text"), @db.Text, //, Optional, guidance, for, reflection |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)

### TemplateContent

Template Content type

Table: `template_contents`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @unique, @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| templateText | String | Yes | @map("template_text"), @db.Text, //, Template, with, variables |  |
| variables | Json | Yes | //, Defined, variables, with, descriptions |  |
| channel | String | Yes | //, Target, channel, (whatsapp,, sms,, email) |  |
| approvalStatus | String? | No | @map("approval_status"), //, External, approval, status, (for, WhatsApp, HSM) |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)

### MediaAsset

Media Asset model

Table: `media_assets`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| fileName | String | Yes | @map("file_name") |  |
| fileSize | Int | Yes | @map("file_size"), //, Size, in, bytes |  |
| mimeType | String | Yes | @map("mime_type") |  |
| type | MediaType | Yes |  |  |
| url | String | Yes | //, Storage, URL |  |
| thumbnailUrl | String? | No | @map("thumbnail_url"), //, Thumbnail, URL, for, previews |  |
| altText | String? | No | @map("alt_text") |  |
| metadata | Json? | No | //, Additional, metadata, (dimensions,, duration,, etc.) |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Organization relation |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| uploadedById | String? | No | @map("uploaded_by_id") | Uploader relation |
| uploadedBy | User? | No | @relation(fields:, [uploadedById],, references:, [id]) |  |
| imageContents | ImageContent[] | Yes |  | Content relations |
| videoContents | VideoContent[] | Yes |  |  |
| audioContents | AudioContent[] | Yes |  |  |
| documentContents | DocumentContent[] | Yes |  |  |

#### Relations

- `type`: One-to-one relation with [MediaType](#mediatype)
- `organization`: One-to-one relation with [Organization](#organization)
- `uploadedBy`: One-to-one relation with [User](#user)
- `imageContents`: One-to-many relation with [ImageContent](#imagecontent)
- `videoContents`: One-to-many relation with [VideoContent](#videocontent)
- `audioContents`: One-to-many relation with [AudioContent](#audiocontent)
- `documentContents`: One-to-many relation with [DocumentContent](#documentcontent)

### ContentVersion

Content Version model

Table: `content_versions`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| versionNumber | Int | Yes | @map("version_number") |  |
| versionData | Json | Yes | //, Full, copy, of, content, at, this, version |  |
| changeNote | String? | No | @map("change_note"), //, Description, of, changes, in, this, version |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| createdById | String? | No | @map("created_by_id") | Creator relation |
| createdBy | User? | No | @relation(fields:, [createdById],, references:, [id]) |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)
- `createdBy`: One-to-one relation with [User](#user)

### Tag

Tag model

Table: `tags`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| name | String | Yes |  |  |
| color | String? | No | //, Optional, color, for, UI, display |  |
| organizationId | String | Yes | @map("organization_id") | Organization relation |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| contentTags | ContentTag[] | Yes |  | Content tag relation |

#### Relations

- `organization`: One-to-one relation with [Organization](#organization)
- `contentTags`: One-to-many relation with [ContentTag](#contenttag)

### ContentTag

Content-Tag relationship model

Table: `content_tags`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| contentId | String | Yes | @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| tagId | String | Yes | @map("tag_id") |  |
| tag | Tag | Yes | @relation(fields:, [tagId],, references:, [id],, onDelete:, Cascade) |  |

#### Relations

- `content`: One-to-one relation with [Content](#content)
- `tag`: One-to-one relation with [Tag](#tag)

### Collection

Collection model for organizing content

Table: `collections`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| name | String | Yes |  |  |
| description | String? | No |  |  |
| createdAt | DateTime | Yes | @default(now()), @map("created_at") |  |
| updatedAt | DateTime | Yes | @updatedAt, @map("updated_at") |  |
| organizationId | String | Yes | @map("organization_id") | Organization relation |
| organization | Organization | Yes | @relation(fields:, [organizationId],, references:, [id]) |  |
| createdById | String? | No | @map("created_by_id") | Creator relation |
| createdBy | User? | No | @relation(fields:, [createdById],, references:, [id]) |  |
| items | CollectionItem[] | Yes |  | Collection items relation |

#### Relations

- `organization`: One-to-one relation with [Organization](#organization)
- `createdBy`: One-to-one relation with [User](#user)
- `items`: One-to-many relation with [CollectionItem](#collectionitem)

### CollectionItem

Collection Item model for content in collections

Table: `collection_items`

| Field | Type | Required | Attributes | Description |
| ----- | ---- | -------- | ---------- | ----------- |
| id | String | Yes | @id, @default(uuid()) |  |
| collectionId | String | Yes | @map("collection_id") |  |
| collection | Collection | Yes | @relation(fields:, [collectionId],, references:, [id],, onDelete:, Cascade) |  |
| contentId | String | Yes | @map("content_id") |  |
| content | Content | Yes | @relation(fields:, [contentId],, references:, [id],, onDelete:, Cascade) |  |
| order | Int | Yes | //, Order, within, collection |  |
| addedAt | DateTime | Yes | @default(now()), @map("added_at") |  |

#### Relations

- `collection`: One-to-one relation with [Collection](#collection)
- `content`: One-to-one relation with [Content](#content)

## Enums

### OrganizationType

Enum for organization type

| Value | Description |
| ----- | ----------- |
| client |  |
| expert |  |

### Gender

Worker-related enums

| Value | Description |
| ----- | ----------- |
| male |  |
| female |  |
| non_binary |  |
| other |  |
| prefer_not_say |  |

### OptInStatus

| Value | Description |
| ----- | ----------- |
| opted_in |  |
| opted_out |  |
| pending |  |
| failed |  |

### EmploymentStatus

| Value | Description |
| ----- | ----------- |
| active |  |
| inactive |  |
| on_leave |  |
| terminated |  |

### EmploymentType

| Value | Description |
| ----- | ----------- |
| full_time |  |
| part_time |  |
| contractor |  |
| temporary |  |

### DeactivationReason

| Value | Description |
| ----- | ----------- |
| voluntary_resignation |  |
| performance_issues |  |
| policy_violation |  |
| redundancy |  |
| retirement |  |
| end_of_contract |  |
| other |  |

### SegmentType

Segment-related enums

| Value | Description |
| ----- | ----------- |
| static     // Manually defined with explicit membership |  |
| rule_based // Dynamically calculated based on rules |  |

### SegmentSyncStatus

| Value | Description |
| ----- | ----------- |
| pending |  |
| processing |  |
| completed |  |
| failed |  |

### ContentStatus

Content-related enums

| Value | Description |
| ----- | ----------- |
| draft |  |
| review |  |
| approved |  |
| published |  |
| archived |  |

### ContentType

| Value | Description |
| ----- | ----------- |
| text |  |
| image |  |
| video |  |
| audio |  |
| document |  |
| quiz |  |
| reflection |  |
| template |  |

### MediaType

| Value | Description |
| ----- | ----------- |
| image |  |
| video |  |
| audio |  |
| document |  |
