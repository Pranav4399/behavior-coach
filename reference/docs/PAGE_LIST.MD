# ABCD Platform Page List

This document outlines the necessary pages for the ABCD Behavioral Coaching Platform frontend, categorized by functional domain and user role. For each page, the corresponding backend API endpoints are listed.

## 1. Core & Authentication

-   **Route**: `/login`
    **Page Name**: Login Page
    **Description**: Allows users to authenticate with their credentials.
    **APIs**:
    - `POST /auth/login` - Authenticate a user with email and password
    - `POST /auth/refresh` - Obtain a new access token using refresh token

-   **Route**: `/signup`
    **Page Name**: Signup/Registration Page
    **Description**: Allows new organizations (Client or Expert) to register. May involve an approval workflow.
    **APIs**:
    - `POST /auth/register` - Register a new Client Organization and its initial Admin user
    - `POST /auth/expert-register` - Register an Expert Organization (may require ABCD Admin approval)

-   **Route**: `/forgot-password`
    **Page Name**: Forgot Password Page
    **Description**: Allows users to initiate the password reset process.
    **APIs**:
    - `POST /auth/forgot-password` - Initiate password reset flow

-   **Route**: `/reset-password`
    **Page Name**: Password Reset Page
    **Description**: Allows users to set a new password using a reset token.
    **APIs**:
    - `POST /auth/reset-password` - Set a new password using a reset token

-   **Route**: `/dashboard`
    **Page Name**: Main Dashboard
    **Description**: Central landing page after login, potentially customized based on user role.
    **APIs**:
    - `GET /auth/me` - Get details of the currently authenticated user
    - `GET /organizations/me` - Retrieve details for the current user's organization
    - `GET /config/frontend` - Provide necessary backend config to the frontend

-   **Route**: `/unauthorized`
    **Page Name**: Unauthorized Access Page
    **Description**: Displayed when a user attempts to access a page they don't have permission for.
    **APIs**: No specific API needed (client-side page)

## 2. Platform Administration (ABCD Admins)

-   **Route**: `/admin`
    **Page Name**: Platform Admin Dashboard
    **Description**: Overview of platform health, activity, pending approvals, and system metrics for platform administrators.
    **APIs**:
    - `GET /admin/approvals/pending` - Get a consolidated list of items needing admin approval
    - `GET /admin/activity/recent` - Get a log of recent significant platform-wide admin actions
    - `GET /admin/system/health` - Get system health status overview
    - `GET /admin/resources/usage/platform` - Get platform-wide resource usage overview

-   **Route**: `/admin/organizations`
    **Page Name**: Organization List (Platform Admin View)
    **Description**: View, search, filter, and manage all organizations on the platform.
    **APIs**:
    - `GET /admin/organizations` - List all organizations on the platform with filtering options

-   **Route**: `/admin/organizations/create`
    **Page Name**: Create Organization (Platform Admin)
    **Description**: Form for platform admins to manually create new organizations.
    **APIs**: 
    - No direct API endpoint specified, but could use organization creation API with admin scope

-   **Route**: `/admin/organizations/{orgId}`
    **Page Name**: Organization Detail (Platform Admin View)
    **Description**: Detailed view and management interface for a specific organization from the platform admin perspective. Includes tabs for Profile, Users, Subscription, Resources, Activity, Support.
    **APIs**:
    - `GET /admin/organizations/{orgId}` - Get details for a specific organization
    - `GET /admin/organizations/{orgId}/users` - List users within a specific organization
    - `GET /admin/organizations/{orgId}/subscription` - Get subscription details for a specific organization
    - `GET /admin/organizations/{orgId}/resources` - Get resource usage/limits
    - `GET /admin/organizations/{orgId}/activity` - Get the activity log
    - `PATCH /admin/organizations/{orgId}/status` - Activate/deactivate an organization

-   **Route**: `/admin/approvals/organizations`
    **Page Name**: Organization Approval Queue
    **Description**: Interface for reviewing and approving/rejecting new organization registrations.
    **APIs**:
    - `GET /admin/approvals/organizations` - List organizations pending approval
    - `POST /admin/organizations/{orgId}/approve` - Approve an organization
    - `POST /admin/organizations/{orgId}/reject` - Reject an organization with a reason
    - `GET /admin/approvals/history` - View the history of approval decisions

-   **Route**: `/admin/subscriptions/tiers`
    **Page Name**: Subscription Tier List
    **Description**: View and manage the different subscription tiers available on the platform.
    **APIs**:
    - `GET /admin/subscriptions/tiers` - List subscription tier definitions

-   **Route**: `/admin/subscriptions/tiers/create`
    **Page Name**: Create Subscription Tier
    **Description**: Form for defining a new subscription tier.
    **APIs**: 
    - No direct endpoint specified, but would need subscription tier creation API

-   **Route**: `/admin/subscriptions/tiers/{tierId}`
    **Page Name**: Subscription Tier Detail/Edit
    **Description**: Interface for viewing and editing the configuration of a specific subscription tier.
    **APIs**:
    - `PATCH /admin/subscriptions/tiers/{tierId}` - Update tier definitions (features, limits)

-   **Route**: `/admin/settings/platform`
    **Page Name**: General Platform Settings
    **Description**: Configure global platform settings like identity, defaults, security, email, integrations, and legal documents.
    **APIs**:
    - `GET /admin/settings/platform` - Get global platform settings
    - `PATCH /admin/settings/platform` - Update global platform settings

-   **Route**: `/admin/settings/features`
    **Page Name**: Feature Flag Management
    **Description**: Interface for managing feature flags for the platform.
    **APIs**: 
    - No specific endpoints mentioned, but would be part of platform settings

-   **Route**: `/admin/settings/announcements`
    **Page Name**: System Announcements Management
    **Description**: Create, edit, and manage platform-wide system announcements.
    **APIs**:
    - `GET /admin/settings/announcements` - List system-wide announcements
    - `POST /admin/settings/announcements` - Create a new system announcement
    - `PATCH /admin/settings/announcements/{announcementId}` - Update an existing system announcement
    - `DELETE /admin/settings/announcements/{announcementId}` - Delete a system announcement

-   **Route**: `/admin/marketplace/submissions`
    **Page Name**: Marketplace Submission Queue
    **Description**: Interface for reviewing and approving/rejecting content/journey submissions to the marketplace.
    **APIs**:
    - `GET /admin/marketplace/submissions` - List marketplace items pending approval
    - `POST /admin/marketplace/submissions/{listingId}/approve` - Approve a marketplace listing
    - `POST /admin/marketplace/submissions/{listingId}/reject` - Reject a marketplace listing

-   **Route**: `/admin/marketplace/listings`
    **Page Name**: Marketplace Listing Management
    **Description**: View, manage, and moderate all listings currently in the marketplace.
    **APIs**:
    - `GET /admin/marketplace/listings` - List and manage all marketplace listings
    - `PATCH /admin/marketplace/listings/{listingId}/status` - Update the status of a marketplace listing
    - `PATCH /admin/marketplace/listings/{listingId}/featured` - Toggle the featured status of a marketplace listing
    - `DELETE /admin/marketplace/listings/{listingId}` - Remove a marketplace listing

-   **Route**: `/admin/marketplace/settings`
    **Page Name**: Marketplace Configuration
    **Description**: Configure global marketplace settings, categories, commissions, and policies.
    **APIs**:
    - `GET /admin/marketplace/settings` - Get global marketplace configuration settings
    - `PATCH /admin/marketplace/settings` - Update global marketplace configuration settings
    - `GET /admin/marketplace/categories` - Get the marketplace category hierarchy
    - `POST /admin/marketplace/categories` - Create a new marketplace category
    - `PATCH /admin/marketplace/categories/{categoryId}` - Update a marketplace category
    - `DELETE /admin/marketplace/categories/{categoryId}` - Delete a marketplace category

-   **Route**: `/admin/system/health`
    **Page Name**: System Health Dashboard
    **Description**: Monitor the status and performance of critical platform services and components.
    **APIs**:
    - `GET /admin/system/health` - Get system health status overview

-   **Route**: `/admin/system/errors`
    **Page Name**: Error Monitoring
    **Description**: View and manage system errors reported across the platform.
    **APIs**:
    - `GET /admin/system/errors` - List system errors reported across the platform
    - `GET /admin/system/errors/{errorId}` - Get details of a specific system error
    - `PATCH /admin/system/errors/{errorId}/status` - Update the status of a system error

-   **Route**: `/admin/system/performance`
    **Page Name**: Performance Analytics
    **Description**: Analyze detailed performance metrics for platform components.
    **APIs**:
    - `GET /admin/system/performance` - Analyze detailed performance metrics for platform components
    - `GET /admin/system/performance/{metricGroup}` - Get performance metrics for a specific group

-   **Route**: `/admin/system/maintenance`
    **Page Name**: Scheduled Maintenance Management
    **Description**: Schedule and manage planned platform maintenance windows.
    **APIs**:
    - `GET /admin/system/maintenance` - List scheduled platform maintenance events
    - `POST /admin/system/maintenance` - Schedule a new platform maintenance event
    - `PATCH /admin/system/maintenance/{eventId}` - Update an existing maintenance event
    - `DELETE /admin/system/maintenance/{eventId}` - Cancel a scheduled maintenance event
    - `POST /admin/system/maintenance/{eventId}/notify` - Send maintenance notifications

## 3. Organization Management (Org Admins & Authorized Users)

-   **Route**: `/organizations` or `/organizations/dashboard`
    **Page Name**: Organization Dashboard
    **Description**: Overview dashboard for organization administrators showing key metrics and status specific to their organization.
    **APIs**:
    - `GET /organizations/me` - Retrieve details for the current user's organization
    - `GET /organizations/me/subscription` - Get current subscription tier details and limits
    - `GET /organizations/me/usage` - Get current resource usage metrics vs. limits

-   **Route**: `/organizations/settings`
    **Page Name**: General Organization Settings
    **Description**: View and edit the organization's profile, regional settings, default behaviors, custom terminology, and feature toggles.
    **APIs**:
    - `GET /organizations/me` - Retrieve details for the current user's organization
    - `PATCH /organizations/me` - Update details for the current user's organization
    - `GET /organizations/me/settings` - Retrieve organization-specific settings
    - `PATCH /organizations/me/settings` - Update organization-specific settings

-   **Route**: `/organizations/settings/branding`
    **Page Name**: Organization Branding Settings
    **Description**: Customize the organization's branding (colors, logo, fonts).
    **APIs**:
    - `GET /organizations/me/branding` - Get organization-specific branding settings
    - `PATCH /organizations/me/branding` - Update organization-specific branding settings
    - `POST /organizations/me/branding/reset` - Reset organization branding to platform defaults

-   **Route**: `/organizations/settings/integrations`
    **Page Name**: Organization Integration Settings
    **Description**: Configure integrations with third-party services (WhatsApp, SMS, etc.).
    **APIs**:
    - `GET /organizations/me/integrations` - List configured integrations for the organization
    - `GET /organizations/me/integrations/{integrationType}` - Get configuration details for a specific integration
    - `PATCH /organizations/me/integrations/{integrationType}` - Update the configuration for a specific integration
    - `POST /organizations/me/integrations/{integrationType}/test` - Test the connection for a configured integration
    - `DELETE /organizations/me/integrations/{integrationType}` - Remove/disconnect an integration

-   **Route**: `/organizations/settings/permissions`
    **Page Name**: Organization Roles & Permissions
    **Description**: Define and manage user roles and their permissions within the organization.
    **APIs**:
    - `GET /organizations/me/roles` - Get organization-specific role definitions
    - `POST /organizations/me/roles` - Create a new custom role within the organization
    - `PATCH /organizations/me/roles/{roleId}` - Update an existing custom role definition
    - `DELETE /organizations/me/roles/{roleId}` - Delete a custom role
    - `GET /organizations/me/permissions` - Get the permission matrix available for roles

-   **Route**: `/organizations/users`
    **Page Name**: User List (Org Admin View)
    **Description**: View, search, filter, and manage user accounts within the organization.
    **APIs**:
    - `GET /users` - List users within the current organization
    - `GET /users/roles` - Get a list of available user roles and their permissions

-   **Route**: `/organizations/users/invite`
    **Page Name**: User Invitation Page
    **Description**: Interface for inviting new users to the organization.
    **APIs**:
    - `POST /users` - Invite a new user to the organization

-   **Route**: `/organizations/users/{userId}`
    **Page Name**: User Detail/Edit (Org Admin View)
    **Description**: View and edit details for a specific user within the organization.
    **APIs**:
    - `GET /users/{userId}` - Get details for a specific user
    - `PATCH /users/{userId}` - Update user details
    - `DELETE /users/{userId}` - Deactivate a user account
    - `POST /users/{userId}/resend-invite` - Resend invitation email if user hasn't accepted
    - `GET /users/{userId}/activity` - Get the activity log for a specific user
    - `GET /users/{userId}/sessions` - List active login sessions for a specific user
    - `DELETE /users/{userId}/sessions/{sessionId}` - Terminate a specific login session for a user

-   **Route**: `/organizations/billing`
    **Page Name**: Subscription Overview Page
    **Description**: View current subscription, payment information, and billing history.
    **APIs**:
    - `GET /organizations/me/subscription` - Get current subscription tier details and limits

-   **Route**: `/organizations/billing/change`
    **Page Name**: Subscription Change Page
    **Description**: Interface for upgrading or downgrading the organization's subscription tier.
    **APIs**:
    - `POST /organizations/me/subscription/upgrade` - Request subscription tier upgrade

-   **Route**: `/organizations/billing/methods`
    **Page Name**: Payment Methods Management
    **Description**: Add, view, and manage the organization's payment methods.
    **APIs**:
    - `GET /organizations/me/billing/methods` - List payment methods
    - `POST /organizations/me/billing/methods` - Add a new payment method
    - `DELETE /organizations/me/billing/methods/{methodId}` - Remove a payment method

-   **Route**: `/organizations/billing/history`
    **Page Name**: Billing History Page
    **Description**: View and download past invoices and payment history.
    **APIs**:
    - `GET /organizations/me/billing/history` - Get billing history/invoices
    - `GET /organizations/me/billing/history/{invoiceId}/pdf` - Download a specific invoice as a PDF

-   **Route**: `/organizations/billing/usage`
    **Page Name**: Usage Overview Page
    **Description**: Monitor resource consumption (workers, messages, storage) against subscription limits.
    **APIs**:
    - `GET /organizations/me/usage` - Get current resource usage metrics vs. limits

-   **Route**: `/organizations/billing/forecast`
    **Page Name**: Usage Forecast Page
    **Description**: View projected future resource usage based on current trends.
    **APIs**:
    - `GET /organizations/me/billing/forecasts` - Get billing/resource usage forecasts
    - `POST /organizations/me/usage/forecast/simulate` - Run a custom usage forecast simulation

-   **Route**: `/organizations/billing/allocation`
    **Page Name**: Resource Allocation Page
    **Description**: View and potentially manage resource allocation across programs/features.
    **APIs**:
    - `GET /organizations/me/allocations` - Get current resource allocation data
    - `PATCH /organizations/me/allocations` - Update resource allocations
    - `GET /organizations/me/allocations/history` - Get the history of resource allocation changes

-   **Route**: `/organizations/billing/alerts`
    **Page Name**: Usage Alerts Configuration
    **Description**: Configure alerts for resource usage thresholds.
    **APIs**:
    - `GET /organizations/me/usage/alerts` - Get configured usage alert rules
    - `POST /organizations/me/usage/alerts` - Create a new usage alert rule
    - `PATCH /organizations/me/usage/alerts/{alertId}` - Update an existing usage alert rule
    - `DELETE /organizations/me/usage/alerts/{alertId}` - Delete a usage alert rule
    - `POST /organizations/me/usage/alerts/{alertId}/test` - Send a test notification for a usage alert rule

## 4. User Settings (All Authenticated Users)

-   **Route**: `/settings/account`
    **Page Name**: Account Settings
    **Description**: Allows individual users to manage their personal profile information, password, security settings (2FA), and connected accounts.
    **APIs**:
    - `GET /auth/me` - Get details of the currently authenticated user
    - `PATCH /users/{userId}` - Update user details (self)

-   **Route**: `/settings/notifications`
    **Page Name**: Notification Preferences
    **Description**: Allows users to configure how and when they receive notifications from the platform.
    **APIs**:
    - `GET /notifications/preferences` - Get user's notification preferences
    - `PATCH /notifications/preferences` - Update user's notification preferences
    - `POST /notifications/preferences/channels/verify` - Initiate verification for a notification channel

-   **Route**: `/settings/interface`
    **Page Name**: Interface Preferences
    **Description**: Allows users to customize UI aspects like theme, density, accessibility settings, and default views.
    **APIs**: No specific APIs listed, likely stored in user preferences

## 5. Worker Management

-   **Route**: `/workers`
    **Page Name**: Worker List Page
    **Description**: View, search, filter, and manage all workers within the organization. Includes bulk actions, import/export.
    **APIs**:
    - `GET /workers` - List all workers in the organization with filtering options
    - `POST /workers/bulk-update` - Update attributes for multiple workers
    - `POST /workers/bulk-delete` - Delete multiple worker records

-   **Route**: `/workers/create`
    **Page Name**: Worker Creation Page
    **Description**: Form for adding a new individual worker to the system.
    **APIs**:
    - `POST /workers` - Create a single new worker record
    - `GET /workers/schema` - Get the schema for worker custom fields

-   **Route**: `/workers/import`
    **Page Name**: Worker Import Page
    **Description**: Multi-step wizard for bulk importing workers via CSV or Excel file.
    **APIs**:
    - `POST /workers/bulk-import` - Initiate bulk import of workers
    - `GET /workers/bulk-import/{jobId}` - Get status and results of a bulk import job

-   **Route**: `/workers/{workerId}`
    **Page Name**: Worker Profile Page
    **Description**: Comprehensive view of a single worker's details, including profile, programs, segments, wellbeing, and activity.
    **APIs**:
    - `GET /workers/{workerId}` - Retrieve detailed profile for a specific worker
    - `GET /workers/{workerId}/programs` - List programs the worker is enrolled in
    - `GET /workers/{workerId}/segments` - List segments the worker belongs to
    - `GET /workers/{workerId}/journey-state` - Get the worker's current state across all active journeys
    - `GET /workers/{workerId}/wellbeing` - Get worker's latest wellbeing indicators
    - `GET /workers/{workerId}/gamification` - Get worker's points, badges, challenge progress
    - `GET /workers/{workerId}/points` - Retrieve the current point balance
    - `GET /workers/{workerId}/points/history` - Get the point transaction history
    - `GET /workers/{workerId}/badges` - Retrieve the badges earned
    - `GET /workers/{workerId}/challenges` - Retrieve the challenges participation data

-   **Route**: `/workers/{workerId}/edit`
    **Page Name**: Worker Edit Page
    **Description**: Form for editing an existing worker's details (potentially combined with Profile page).
    **APIs**:
    - `PATCH /workers/{workerId}` - Update worker details
    - `POST /workers/{workerId}/tags` - Add one or more tags to a specific worker
    - `DELETE /workers/{workerId}/tags/{tagValue}` - Remove a specific tag from a worker

-   **Route**: `/workers/reports`
    **Page Name**: Worker Reporting & Analytics Page
    **Description**: View reports and analytics related to worker demographics, engagement, and system usage.
    **APIs**:
    - `GET /reports/workers` - Retrieve general worker reports
    - `GET /reports/workers/demographics` - Retrieve reports on worker demographic data
    - `GET /reports/workers/engagement` - Retrieve reports on worker engagement metrics

## 6. Segmentation

-   **Route**: `/segments`
    **Page Name**: Segment List Page
    **Description**: View, search, filter, and manage all worker segments within the organization.
    **APIs**:
    - `GET /segments` - List all segments defined in the organization
    - `GET /segments/types` - Get available segment types and rule attributes
    - `GET /segments/conflicts` - Identify potential conflicts or overlaps between segments

-   **Route**: `/segments/create`
    **Page Name**: Segment Creation Page
    **Description**: Interface for creating a new segment (static or rule-based).
    **APIs**:
    - `POST /segments` - Create a new segment
    - `POST /segments/{segmentId}/test-rule` - Test the segment rule definition against the worker database
    - `GET /segments/types` - Get available segment types and rule attributes

-   **Route**: `/segments/{segmentId}`
    **Page Name**: Segment Detail Page
    **Description**: View details, rules, metrics, membership, and program usage for a specific segment.
    **APIs**:
    - `GET /segments/{segmentId}` - Get details of a specific segment
    - `GET /segments/{segmentId}/workers` - List workers belonging to this segment
    - `GET /segments/{segmentId}/analytics` - Get comparative analytics for this segment
    - `GET /segments/{segmentId}/programs` - List the programs using this segment

-   **Route**: `/segments/{segmentId}/edit`
    **Page Name**: Segment Edit Page
    **Description**: Interface for editing an existing segment's properties or rules (likely uses the same builder UI as creation).
    **APIs**:
    - `PATCH /segments/{segmentId}` - Update segment details (name, description, rules)
    - `POST /segments/{segmentId}/workers` - Manually add workers to a static segment
    - `DELETE /segments/{segmentId}/workers/{workerId}` - Manually remove a worker from a static segment
    - `POST /segments/{segmentId}/sync` - Manually trigger recalculation of membership for a rule-based segment
    - `GET /segments/{segmentId}/sync/{jobId}` - Check the status of a segment synchronization job

## 7. Content Management

-   **Route**: `/content`
    **Page Name**: Content Library
    **Description**: Browse, search, filter, and manage content modules (text, media, quizzes, etc.).
    **APIs**:
    - `GET /content` - List content modules in the library
    - `GET /content/types` - Get available content types and their schemas
    - `GET /content/tags` - Get list of tags used across content
    - `GET /content/collections` - List all content collections for the organization

-   **Route**: `/content/create`
    **Page Name**: Content Creation Page (Type Selection)
    **Description**: Initial step to select the type of content to create.
    **APIs**:
    - `GET /content/types` - Get available content types and their schemas

-   **Route**: `/content/create/{contentType}`
    **Page Name**: Content Creation Form (Specific Type)
    **Description**: Form interface tailored for creating a specific type of content module (e.g., text editor, quiz builder).
    **APIs**:
    - `POST /content` - Create a new content module
    - `POST /content/media/upload` - Upload media files (if needed for content)

-   **Route**: `/content/{contentId}`
    **Page Name**: Content Detail View
    **Description**: View details, preview, metadata, usage, and version history for a specific content module.
    **APIs**:
    - `GET /content/{contentId}` - Get details of a specific content module
    - `GET /content/{contentId}/versions` - List versions of a content module
    - `GET /content/{contentId}/usage` - Get analytics on how often this content is used
    - `GET /content/{contentId}/license` - View licensing terms for the content

-   **Route**: `/content/editor/{contentId}`
    **Page Name**: Content Editor Page
    **Description**: Rich editing interface for modifying existing content modules.
    **APIs**:
    - `PATCH /content/{contentId}` - Update content module details or data
    - `POST /content/{contentId}/versions` - Create a new version of a content module
    - `POST /content/{contentId}/versions/{versionId}/revert` - Revert to a previous version

-   **Route**: `/content/media`
    **Page Name**: Media Library
    **Description**: Repository for managing uploaded media assets (images, videos, audio, documents).
    **APIs**:
    - `GET /content/media` - List uploaded media assets
    - `POST /content/media/upload` - Upload media files
    - `PATCH /content/media/{mediaId}` - Update metadata for an existing media item
    - `DELETE /content/media/{mediaId}` - Delete a media item from the library
    - `GET /content/media/{mediaId}/usage` - Find where a specific media item is used

-   **Route**: `/content/templates`
    **Page Name**: Message Templates List
    **Description**: View, search, filter, and manage message templates (WhatsApp, SMS, Email).
    **APIs**:
    - `GET /content/templates` - List message templates

-   **Route**: `/content/templates/create`
    **Page Name**: Create Template Page
    **Description**: Form for creating a new message template.
    **APIs**:
    - `POST /content/templates` - Create a new message template

-   **Route**: `/content/templates/{templateId}`
    **Page Name**: Template Detail/Edit Page
    **Description**: View and edit details for a specific message template, including approval status for WhatsApp templates.
    **APIs**:
    - `GET /content/templates/{templateId}` - Get template details
    - `PATCH /content/templates/{templateId}` - Update template details
    - `DELETE /content/templates/{templateId}` - Delete a message template
    - `POST /content/templates/{templateId}/request-approval` - Submit WhatsApp template for approval
    - `GET /content/templates/{templateId}/approval-status` - Check approval status

## 8. Journey Builder

-   **Route**: `/journeys`
    **Page Name**: Journey List Page
    **Description**: View, search, filter, and manage Journey Blueprints.
    **APIs**:
    - `GET /journeys` - List all Journey Blueprints in the organization
    - `GET /journeys/templates` - List available journey templates

-   **Route**: `/journeys/create`
    **Page Name**: Journey Creation Page
    **Description**: Initial step for creating a new Journey Blueprint (defining basic info).
    **APIs**:
    - `POST /journeys` - Create a new, empty Journey Blueprint
    - `GET /journeys/rules/schema` - Get the available conditions and actions for journey rules engine

-   **Route**: `/journeys/{journeyId}`
    **Page Name**: Journey Detail Page
    **Description**: Read-only view of a Journey Blueprint's structure, metadata, and analytics.
    **APIs**:
    - `GET /journeys/{journeyId}` - Get the full structure of a Journey Blueprint
    - `GET /journeys/{journeyId}/analytics` - Get analytics on usage and effectiveness

-   **Route**: `/journeys/builder/{journeyId}`
    **Page Name**: Journey Builder Canvas Page
    **Description**: Visual canvas interface for designing and editing journey flows, phases, touchpoints, and branching logic.
    **APIs**:
    - `PATCH /journeys/{journeyId}` - Update Journey Blueprint metadata
    - `POST /journeys/{journeyId}/phases` - Add a new phase to the journey
    - `PATCH /journeys/{journeyId}/phases/{phaseId}` - Update phase details
    - `DELETE /journeys/{journeyId}/phases/{phaseId}` - Remove a phase
    - `POST /journeys/{journeyId}/phases/{phaseId}/touchpoints` - Add a new touchpoint
    - `PATCH /journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}` - Update touchpoint details
    - `DELETE /journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}` - Remove a touchpoint
    - `POST /journeys/{journeyId}/connections` - Create connections between touchpoints
    - `PATCH /journeys/{journeyId}/connections/{connectionId}` - Update details of a connection
    - `DELETE /journeys/{journeyId}/connections/{connectionId}` - Delete a connection

-   **Route**: `/journeys/simulation/{journeyId}`
    **Page Name**: Journey Simulation Page
    **Description**: Interface for testing a journey flow with a simulated worker profile.
    **APIs**:
    - `POST /journeys/{journeyId}/simulate` - Simulate the journey flow
    - `POST /journeys/{journeyId}/simulate/response` - Submit a simulated response during simulation

-   **Route**: `/journeys/deploy/{journeyId}`
    **Page Name**: Journey Deployment Page
    **Description**: Interface for configuring and deploying a Journey Blueprint as a Program (may link to Program creation).
    **APIs**:
    - `PUT /journeys/{journeyId}/publish` - Publish a draft journey blueprint
    - `POST /programs` - Create a new program using this journey

## 9. Program Implementation

-   **Route**: `/programs`
    **Page Name**: Program Listing Page
    **Description**: View, search, filter, and manage all deployed programs.
    **APIs**:
    - `GET /programs` - List all programs (active, scheduled, completed)

-   **Route**: `/programs/create`
    **Page Name**: Program Creation Wizard
    **Description**: Multi-step wizard for creating a new program by selecting journeys, audiences, and configuring settings.
    **APIs**:
    - `POST /programs/estimate-audience` - Estimate the number of workers matching selected segments/filters
    - `POST /programs` - Create a new program
    - `POST /programs/{programId}/validate-deployment` - Check if configuration is valid and ready

-   **Route**: `/programs/{programId}`
    **Page Name**: Program Detail Dashboard
    **Description**: Central dashboard for monitoring and managing a specific active or completed program. Includes tabs for Overview, Workers, Journey Progress, Messages, Analytics.
    **APIs**:
    - `GET /programs/{programId}` - Get program details, configuration, and high-level status
    - `GET /programs/{programId}/deployment-status` - Get the current status of program deployment
    - `GET /programs/{programId}/activities` - Get a feed of recent activities or events
    - `GET /programs/{programId}/blueprints` - Get the list of Journey Blueprints for this program

-   **Route**: `/programs/{programId}/settings`
    **Page Name**: Program Settings Page
    **Description**: Interface for viewing and editing the main settings of a program.
    **APIs**:
    - `PATCH /programs/{programId}` - Update program configuration
    - `PATCH /programs/{programId}/blueprints/{blueprintId}` - Update blueprint-specific settings

-   **Route**: `/programs/{programId}/follow-up`
    **Page Name**: Program Follow-up Rules Page
    **Description**: Interface for configuring automated follow-up rules for non-responsive workers.
    **APIs**:
    - `GET /programs/{programId}/follow-up-config` - Get the follow-up rule configuration
    - `PATCH /programs/{programId}/follow-up-config` - Update the follow-up rule configuration

-   **Route**: `/programs/{programId}/conflicts`
    **Page Name**: Program Conflict Settings Page
    **Description**: Interface for configuring conflict resolution strategies with other programs.
    **APIs**:
    - `GET /programs/{programId}/conflicts` - Get details about detected conflicts
    - `GET /programs/{programId}/conflict-config` - Get the conflict strategy/configuration
    - `PATCH /programs/{programId}/conflict-config` - Update the conflict strategy/configuration

-   **Route**: `/programs/{programId}/feedback`
    **Page Name**: Program Feedback Management Page
    **Description**: View and manage feedback received from workers within a program.
    **APIs**:
    - `GET /programs/{programId}/feedback` - List worker-initiated feedback
    - `GET /programs/{programId}/feedback/{feedbackId}` - Retrieve details of specific feedback
    - `POST /programs/{programId}/feedback/{feedbackId}/respond` - Respond to specific worker feedback

-   **Route**: `/programs/{programId}/workers`
    **Page Name**: Program Worker List Page
    **Description**: View and manage workers enrolled in a specific program.
    **APIs**:
    - `GET /programs/{programId}/workers` - List workers enrolled in the program
    - `POST /programs/{programId}/send-manual-touchpoint` - Send an ad-hoc message to specific workers
    - `DELETE /programs/{programId}/workers/{workerId}` - Remove a worker from the program

-   **Route**: `/programs/{programId}/workers/{workerId}`
    **Page Name**: Individual Worker Progress View
    **Description**: Detailed view of a single worker's progress, responses, and interactions within a specific program.
    **APIs**:
    - `GET /programs/{programId}/workers/{workerId}/state` - Get detailed current state for a worker
    - `GET /programs/{programId}/workers/{workerId}/timeline` - Retrieve the detailed journey progress timeline
    - `GET /programs/{programId}/workers/{workerId}/responses` - Get the history of responses submitted
    - `GET /programs/{programId}/workers/{workerId}/messages` - Get the log of messages sent/received
    - `PATCH /programs/{programId}/workers/{workerId}/state` - Manually adjust a worker's state
    - `POST /programs/{programId}/workers/{workerId}/pause` - Temporarily pause participation
    - `POST /programs/{programId}/workers/{workerId}/resume` - Resume a paused worker's participation

-   **Route**: `/programs/{programId}/analytics`
    **Page Name**: Program Analytics Dashboard
    **Description**: Detailed analytics and reporting specifically for a program's performance and outcomes.
    **APIs**:
    - `GET /programs/{programId}/analytics` - Get aggregated analytics for the program
    - `GET /programs/{programId}/analytics/segments` - Get analytics broken down by segment
    - `GET /programs/{programId}/analytics/wellbeing` - Retrieve wellbeing-specific analytics
    - `GET /programs/{programId}/content-performance` - Get analytics on content performance
    - `GET /programs/{programId}/reports` - Get previously generated reports
    - `POST /programs/{programId}/reports` - Initiate generation of a program report
    - `GET /programs/{programId}/reports/{reportId}` - Retrieve a program report
    - `POST /programs/{programId}/exports` - Initiate the export of program data
    - `GET /programs/{programId}/exports/{exportId}` - Retrieve a program data export

## 10. Projects & Funders

-   **Route**: `/projects`
    **Page Name**: Projects List Page
    **Description**: View, search, filter, and manage organizational projects.
    **APIs**:
    - `GET /projects` - List all projects within the organization

-   **Route**: `/projects/create`
    **Page Name**: Project Creation Page
    **Description**: Multi-step wizard for defining a new project, its objectives, timeline, budget, and linking funders/programs.
    **APIs**:
    - `POST /projects` - Create a new project
    - `GET /funders` - List all funders associated with the organization

-   **Route**: `/projects/{projectId}`
    **Page Name**: Project Detail Page (Overview)
    **Description**: Main detail view for a project, showing summary, key metrics, description, and objectives. Default tab.
    **APIs**:
    - `GET /projects/{projectId}` - Get project details, including linked programs and high-level outcomes
    - `GET /projects/{projectId}/analytics` - Get aggregated analytics at the project level

-   **Route**: `/projects/{projectId}/programs`
    **Page Name**: Project Programs Page
    **Description**: Tab within Project Detail view showing programs linked to the project.
    **APIs**:
    - `GET /projects/{projectId}/programs` - List programs associated with this project
    - `POST /projects/{projectId}/programs` - Link existing programs to this project
    - `DELETE /projects/{projectId}/programs/{programId}` - Unlink a program from a project

-   **Route**: `/projects/{projectId}/funders`
    **Page Name**: Project Funders Page
    **Description**: Tab within Project Detail view showing funders associated with the project.
    **APIs**:
    - `GET /projects/{projectId}/funders` - List funders associated with this project
    - `POST /projects/{projectId}/funders` - Link funders to this project
    - `PATCH /projects/{projectId}/funders/{funderId}` - Update the details of the funding relationship
    - `DELETE /projects/{projectId}/funders/{funderId}` - Unlink a funder from a project

-   **Route**: `/projects/{projectId}/evidence`
    **Page Name**: Project Evidence Page
    **Description**: Tab within Project Detail view for managing and viewing evidence of project impact.
    **APIs**:
    - `GET /projects/{projectId}/evidence` - List evidence collected for this project
    - `GET /projects/{projectId}/evidence/{evidenceId}` - Get details of a specific piece of evidence
    - `PATCH /projects/{projectId}/evidence/{evidenceId}` - Update details of evidence
    - `DELETE /projects/{projectId}/evidence/{evidenceId}` - Delete evidence

-   **Route**: `/projects/{projectId}/evidence/create`
    **Page Name**: Add Evidence Page
    **Description**: Form for adding new evidence items (testimonial, case study, etc.) to a project.
    **APIs**:
    - `POST /projects/{projectId}/evidence` - Upload/link evidence to this project

-   **Route**: `/projects/{projectId}/reports`
    **Page Name**: Project Reports Page
    **Description**: Tab within Project Detail view for generating and viewing reports related to the project.
    **APIs**:
    - `GET /projects/{projectId}/reports/donor/{funderId}` - Generate a report for a specific donor

-   **Route**: `/projects/{projectId}/reports/generate`
    **Page Name**: Generate Report Page
    **Description**: Interface for configuring and generating donor or internal reports for a project.
    **APIs**:
    - No specific API listed, but would use report generation APIs

-   **Route**: `/projects/{projectId}/edit`
    **Page Name**: Project Edit Page
    **Description**: Form for editing the details of an existing project.
    **APIs**:
    - `PATCH /projects/{projectId}` - Update project details

-   **Route**: `/funders`
    **Page Name**: Funders List Page
    **Description**: View, search, filter, and manage funder records.
    **APIs**:
    - `GET /funders` - List all funders associated with the organization

-   **Route**: `/funders/create`
    **Page Name**: Funder Creation Page
    **Description**: Form for adding a new funder record to the system.
    **APIs**:
    - `POST /funders` - Add a new funder record

-   **Route**: `/funders/{funderId}`
    **Page Name**: Funder Detail Page
    **Description**: View detailed information about a specific funder, including linked projects and reporting requirements.
    **APIs**:
    - `GET /funders/{funderId}` - Get details for a specific funder
    - `GET /donors/{funderId}/reports` - List reports generated for a specific funder
    - `GET /donors/{funderId}/reports/{reportId}` - Retrieve a specific donor report

-   **Route**: `/funders/{funderId}/edit`
    **Page Name**: Funder Edit Page
    **Description**: Form for editing the details of an existing funder.
    **APIs**:
    - `PATCH /funders/{funderId}` - Update funder details
    - `DELETE /funders/{funderId}` - Delete a funder record

## 11. Marketplace

-   **Route**: `/marketplace`
    **Page Name**: Marketplace Browsing Page
    **Description**: Main interface for discovering shared content modules and journey blueprints.
    **APIs**:
    - `GET /marketplace/listings` - Browse available listings with filtering, search, sorting
    - `GET /marketplace/categories` - Retrieve the list of available categories
    - `GET /marketplace/featured` - Retrieve featured listings for display

-   **Route**: `/marketplace/listings/{listingId}`
    **Page Name**: Listing Detail Page
    **Description**: Detailed view of a specific marketplace listing, including preview, reviews, and license terms.
    **APIs**:
    - `GET /marketplace/listings/{listingId}` - Get details of a specific listing
    - `GET /marketplace/listings/{listingId}/reviews` - Retrieve reviews for a listing
    - `POST /marketplace/listings/{listingId}/report` - Report a listing for issues
    - `POST /marketplace/listings/{listingId}/acquire` - Acquire (license/purchase) a marketplace item

-   **Route**: `/marketplace/publish`
    **Page Name**: Publish Listing Wizard
    **Description**: Multi-step wizard for expert organizations to publish their content or journeys to the marketplace.
    **APIs**:
    - `POST /marketplace/publish` - Submit content or journey for listing
    - `GET /content` - List content modules that could be published
    - `GET /journeys` - List journeys that could be published

-   **Route**: `/marketplace/my-listings`
    **Page Name**: My Listings Management Page
    **Description**: Interface for expert organizations to manage their published listings, view analytics, and respond to reviews.
    **APIs**:
    - `GET /marketplace/my-listings` - List items published by the organization
    - `PATCH /marketplace/my-listings/{listingId}` - Update own marketplace listing
    - `DELETE /marketplace/my-listings/{listingId}` - Delete own listing
    - `POST /marketplace/my-listings/{listingId}/unpublish` - Unpublish/withdraw listing
    - `POST /marketplace/listings/{listingId}/reviews/{reviewId}/respond` - Respond to a review

-   **Route**: `/marketplace/acquisitions`
    **Page Name**: My Acquisitions Management Page
    **Description**: Interface for client organizations to view and manage content/journeys they have acquired from the marketplace.
    **APIs**:
    - `GET /marketplace/acquisitions` - List items acquired from the marketplace
    - `POST /marketplace/acquisitions/{acquisitionId}/import` - Import acquired content/journey

-   **Route**: `/marketplace/reviews/submit/{listingId}`
    **Page Name**: Review Submission Page
    **Description**: Form for submitting a review for an acquired marketplace item (could potentially be a modal).
    **APIs**:
    - `POST /marketplace/listings/{listingId}/review` - Submit a review/rating
    - `PATCH /marketplace/listings/{listingId}/reviews/{reviewId}` - Update own review
    - `POST /marketplace/reviews/{reviewId}/flag` - Flag a review for moderation

## 12. Experimentation

-   **Route**: `/experiments`
    **Page Name**: Experiment List/Dashboard
    **Description**: View, filter, and manage all experiments (Journey-level and Program-level).
    **APIs**:
    - `GET /experiments` - List all experiments
    - `GET /experiments/types` - Get available experiment types
    - `GET /experiments/conflicts` - Check for potential conflicts between experiments

-   **Route**: `/experiments/create`
    **Page Name**: Experiment Creation Wizard
    **Description**: Multi-step wizard for creating a new experiment, starting with selecting the experiment type (Journey or Program).
    **APIs**:
    - `POST /experiments` - Create a new experiment definition
    - `GET /experiments/metrics/schema` - Get available metrics for experiments
    - `GET /experiments/types` - Get available experiment types

-   **Route**: `/experiments/{experimentId}`
    **Page Name**: Experiment Detail & Results Page
    **Description**: Comprehensive view of an experiment's configuration, status, real-time monitoring (if running), and detailed results/analysis.
    **APIs**:
    - `GET /experiments/{experimentId}` - Get experiment details, configuration, and status
    - `GET /experiments/{experimentId}/variants` - Get all variants defined for experiment
    - `GET /experiments/{experimentId}/audience` - Get audience configuration and assignment
    - `GET /experiments/{experimentId}/metrics` - Get metrics configuration
    - `GET /experiments/{experimentId}/results` - Get analysis results (metrics per variant)
    - `GET /experiments/{experimentId}/results/export` - Export experiment results
    - `GET /experiments/{experimentId}/participants` - List participants and assigned variant
    - `GET /experiments/{experimentId}/history` - Retrieve event history/log for experiment
    - `POST /experiments/{experimentId}/actions/start` - Start a defined experiment
    - `POST /experiments/{experimentId}/actions/pause` - Pause a running experiment
    - `POST /experiments/{experimentId}/actions/resume` - Resume a paused experiment
    - `POST /experiments/{experimentId}/actions/conclude` - Conclude and calculate final results
    - `POST /experiments/{experimentId}/actions/archive` - Archive a concluded experiment
    - `POST /experiments/{experimentId}/actions/unarchive` - Restore an archived experiment

## 13. Analytics & Reporting (Consolidated/Cross-Domain)

*(Note: Many analytics are embedded within specific domain pages like Program Detail or Project Detail. These are potential dedicated analytics pages.)*

-   **Route**: `/analytics/program/{programId}`
    **Page Name**: Program Analytics Dashboard (Same as `/programs/{programId}/analytics`)
    **Description**: Detailed analytics for a specific program.
    **APIs**:
    - `GET /programs/{programId}/analytics` - Get aggregated analytics for the program
    - `GET /programs/{programId}/analytics/segments` - Program analytics broken down by segment
    - `GET /programs/{programId}/analytics/wellbeing` - Wellbeing-specific analytics
    - `GET /programs/{programId}/content-performance` - Analytics on content performance

-   **Route**: `/analytics/project/{projectId}`
    **Page Name**: Project Analytics Dashboard
    **Description**: Detailed analytics aggregating data for a specific project.
    **APIs**:
    - `GET /projects/{projectId}/analytics` - Get aggregated analytics at project level

-   **Route**: `/analytics/segment/{segmentId}`
    **Page Name**: Segment Analytics Dashboard
    **Description**: Detailed analytics for a specific worker segment across programs/journeys.
    **APIs**:
    - `GET /segments/{segmentId}/analytics` - Get comparative analytics for this segment

-   **Route**: `/analytics/content/{contentId}`
    **Page Name**: Content Analytics Dashboard
    **Description**: Detailed analytics on the performance and usage of a specific content module.
    **APIs**:
    - `GET /content/{contentId}/usage` - Get analytics on content usage in journeys/programs

-   **Route**: `/analytics/custom-reports`
    **Page Name**: Custom Report Builder/List
    **Description**: Interface for creating, managing, and viewing custom reports combining data from various domains.
    **APIs**:
    - `GET /analytics/dashboard` - Get data for the main analytics dashboard
    - `GET /analytics/reports` - List previously generated or saved custom reports
    - `POST /analytics/reports/custom` - Generate a custom report based on parameters
    - `GET /analytics/reports/{reportId}` - Retrieve a specific custom report
    - `PATCH /analytics/reports/{reportId}` - Update a saved custom report definition
    - `DELETE /analytics/reports/{reportId}` - Delete a saved custom report

## 14. Specialized Features

### 14.1 Wellbeing

-   **Route**: `/wellbeing`
    **Page Name**: Wellbeing Dashboard
    **Description**: Overview of organizational wellbeing metrics, trends, and active alerts.
    **APIs**:
    - `GET /wellbeing/dashboard` - Get consolidated data for the Wellbeing dashboard
    - `GET /wellbeing/analytics/trends` - Get aggregated wellbeing trends
    - `GET /wellbeing/alerts` - List workers flagged based on critical thresholds

-   **Route**: `/wellbeing/indicators`
    **Page Name**: Indicators Management Page
    **Description**: View, create, and manage wellbeing indicators.
    **APIs**:
    - `GET /wellbeing/indicators` - List all configured wellbeing indicators
    - `GET /wellbeing/indicators/schema` - Get the schema for available indicators

-   **Route**: `/wellbeing/indicators/create`
    **Page Name**: Create Indicator Page
    **Description**: Form for defining a new wellbeing indicator.
    **APIs**:
    - `POST /wellbeing/indicators` - Create a new custom wellbeing indicator

-   **Route**: `/wellbeing/indicators/{indicatorId}`
    **Page Name**: Indicator Detail Page
    **Description**: View details, configuration, and trend data for a specific indicator.
    **APIs**:
    - `GET /wellbeing/indicators/{indicatorId}/trend` - Retrieve trend data for an indicator
    - `GET /wellbeing/indicators/{indicatorId}/distribution` - Retrieve distribution of values
    - `PATCH /wellbeing/indicators/{indicatorId}` - Update an existing wellbeing indicator

-   **Route**: `/wellbeing/assessments`
    **Page Name**: Assessments Management Page
    **Description**: Manage wellbeing assessment templates and deployments.
    **APIs**:
    - `GET /wellbeing/assessments` - List defined wellbeing assessment templates
    - `GET /wellbeing/assessments/types` - Get available assessment types

-   **Route**: `/wellbeing/assessments/create`
    **Page Name**: Create Assessment Page
    **Description**: Form/builder for creating a new wellbeing assessment template.
    **APIs**:
    - `POST /wellbeing/assessments` - Create a new assessment template

-   **Route**: `/wellbeing/assessments/{assessmentId}`
    **Page Name**: Assessment Detail/Results Page
    **Description**: View details of an assessment template and analyze results from its deployments.
    **APIs**:
    - `GET /wellbeing/assessments/{assessmentId}` - Get details of a specific assessment
    - `GET /wellbeing/assessments/{assessmentId}/results` - Retrieve aggregated results
    - `POST /wellbeing/assessments/schedule` - Schedule periodic assessments

-   **Route**: `/wellbeing/assessments/{assessmentId}/builder`
    **Page Name**: Assessment Builder Page
    **Description**: Interface for editing the questions and logic of an assessment template.
    **APIs**:
    - `PATCH /wellbeing/assessments/{assessmentId}` - Update an assessment template
    - `DELETE /wellbeing/assessments/{assessmentId}` - Delete an assessment template

-   **Route**: `/wellbeing/interventions`
    **Page Name**: Interventions Management Page
    **Description**: Manage wellbeing intervention templates and assignments.
    **APIs**:
    - `GET /wellbeing/interventions` - List available wellbeing intervention templates

-   **Route**: `/wellbeing/interventions/create`
    **Page Name**: Create Intervention Page
    **Description**: Form/builder for creating a new wellbeing intervention.
    **APIs**:
    - `POST /wellbeing/interventions` - Create a new intervention template

-   **Route**: `/wellbeing/interventions/{interventionId}`
    **Page Name**: Intervention Detail Page
    **Description**: View details, content, targeting rules, and effectiveness metrics for an intervention.
    **APIs**:
    - `GET /wellbeing/interventions/{interventionId}` - Get details of intervention
    - `GET /wellbeing/interventions/{interventionId}/effectiveness` - Retrieve effectiveness metrics
    - `PATCH /wellbeing/interventions/{interventionId}` - Update intervention template
    - `DELETE /wellbeing/interventions/{interventionId}` - Delete intervention template

-   **Route**: `/wellbeing/alerts`
    **Page Name**: Alerts Management Page
    **Description**: View, manage, and respond to triggered wellbeing alerts.
    **APIs**:
    - `GET /wellbeing/alerts` - List workers flagged based on thresholds
    - `GET /wellbeing/alerts/{alertId}` - Retrieve details of a specific alert
    - `PATCH /wellbeing/alerts/{alertId}` - Update the status or response details

-   **Route**: `/wellbeing/alerts/configure`
    **Page Name**: Alert Configuration Page
    **Description**: Interface for defining and managing alert rules.
    **APIs**:
    - `GET /wellbeing/alert-rules` - Retrieve the list of configured alert rules
    - `POST /wellbeing/alert-rules` - Create a new alert rule
    - `PATCH /wellbeing/alert-rules/{ruleId}` - Update an existing alert rule

-   **Route**: `/wellbeing/analytics`
    **Page Name**: Wellbeing Analytics Dashboard
    **Description**: Detailed analytics focused specifically on wellbeing trends and intervention impact.
    **APIs**:
    - `GET /wellbeing/analytics` - Retrieve detailed, filterable wellbeing analytics data
    - `GET /wellbeing/analytics/trends` - Get aggregated wellbeing trends

### 14.2 Gamification

-   **Route**: `/gamification`
    **Page Name**: Gamification Dashboard
    **Description**: Overview of gamification engagement metrics, active challenges, and leaderboards.
    **APIs**:
    - `GET /gamification/dashboard` - Retrieve summary data for the gamification dashboard

-   **Route**: `/gamification/badges`
    **Page Name**: Badges Management Page
    **Description**: View, create, and manage badges and achievements.
    **APIs**:
    - `GET /gamification/badges` - List available badges for the organization

-   **Route**: `/gamification/badges/create`
    **Page Name**: Create Badge Page
    **Description**: Form/builder for designing a new badge and its earning criteria.
    **APIs**:
    - `POST /gamification/badges` - Create a new badge definition

-   **Route**: `/gamification/badges/{badgeId}`
    **Page Name**: Badge Detail Page
    **Description**: View details, design, criteria, and award statistics for a specific badge.
    **APIs**:
    - `GET /gamification/badges/{badgeId}/statistics` - Retrieve statistics about badge awards
    - `PATCH /gamification/badges/{badgeId}` - Update badge definition
    - `DELETE /gamification/badges/{badgeId}` - Delete a badge definition

-   **Route**: `/gamification/challenges`
    **Page Name**: Challenges Management Page
    **Description**: View, create, and manage gamified challenges.
    **APIs**:
    - `GET /gamification/challenges` - List available challenges

-   **Route**: `/gamification/challenges/create`
    **Page Name**: Create Challenge Page
    **Description**: Form/builder for defining a new challenge, its requirements, and rewards.
    **APIs**:
    - `POST /gamification/challenges` - Create a new challenge definition

-   **Route**: `/gamification/challenges/{challengeId}`
    **Page Name**: Challenge Detail Page
    **Description**: View details, progress, participation, and rewards for a specific challenge.
    **APIs**:
    - `GET /gamification/challenges/{challengeId}/progress` - Retrieve progress data for participants
    - `POST /gamification/challenges/{challengeId}/remind` - Send reminders to participants
    - `PATCH /gamification/challenges/{challengeId}` - Update challenge definition
    - `DELETE /gamification/challenges/{challengeId}` - Delete a challenge definition

-   **Route**: `/gamification/leaderboards`
    **Page Name**: Leaderboards Management Page
    **Description**: View and manage different leaderboards.
    **APIs**:
    - `GET /gamification/leaderboards` - List defined leaderboards

-   **Route**: `/gamification/leaderboards/create`
    **Page Name**: Create Leaderboard Page
    **Description**: Form for configuring a new leaderboard (criteria, scope, timeframe).
    **APIs**:
    - `POST /gamification/leaderboards` - Create a new leaderboard definition

-   **Route**: `/gamification/leaderboards/{leaderboardId}`
    **Page Name**: Leaderboard Detail Page
    **Description**: View the rankings and configuration for a specific leaderboard.
    **APIs**:
    - `GET /gamification/leaderboards/{leaderboardId}/rankings` - Get current rankings
    - `PATCH /gamification/leaderboards/{leaderboardId}` - Update leaderboard definition
    - `DELETE /gamification/leaderboards/{leaderboardId}` - Delete a leaderboard definition

-   **Route**: `/gamification/rewards`
    **Page Name**: Rewards Management Page
    **Description**: View, create, and manage rewards that can be earned or redeemed.
    **APIs**:
    - `GET /gamification/rewards` - List available rewards in the catalog

-   **Route**: `/gamification/rewards/create`
    **Page Name**: Create Reward Page
    **Description**: Form for defining a new reward.
    **APIs**:
    - `POST /gamification/rewards` - Create a new reward definition

-   **Route**: `/gamification/rewards/{rewardId}`
    **Page Name**: Reward Detail Page
    **Description**: View details and redemption/distribution information for a specific reward.
    **APIs**:
    - `PATCH /gamification/rewards/{rewardId}` - Update reward definition
    - `DELETE /gamification/rewards/{rewardId}` - Delete a reward definition
    - `POST /gamification/rewards/{rewardId}/distribute` - Manually distribute a reward

This list provides a comprehensive mapping between frontend pages and their corresponding backend API endpoints. Some pages might be implemented as modals or sections within other pages depending on the final UX design.
