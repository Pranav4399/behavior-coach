# Enhanced API Endpoint Specification: ABCD Behavior Coach v3.0

## Overview

This document provides an enhanced and more comprehensive list of potential backend API endpoints required to support the full functionality of the ABCD Behavior Coach frontend, as described in `Product Overview.md` and the detailed repository structures (`Repo.md`, `frontend-repo.md`). It expands significantly upon the initial list in `API & Pages.md` to cover identified gaps, particularly around program execution, worker interaction, wellbeing, administration, billing, and other detailed features.

**Assumptions:**

*   Base Path: `/api/v1` (or similar versioned path)
*   Authentication: All endpoints (unless explicitly public like login/register) require authentication (e.g., JWT Bearer token).
*   Authorization: Role-based access control is enforced server-side based on the authenticated user's role and organization.
*   Tenancy: All organization-specific resources are automatically scoped to the authenticated user's `organization_id`.
*   Standard Practices: Use of standard HTTP methods (GET, POST, PUT, PATCH, DELETE), consistent JSON request/response formats, standardized error handling, pagination (`?page=`, `?limit=`), sorting (`?sortBy=`), and filtering (`?filter[status]=active`) where applicable.

---

## A. Authentication & Onboarding (`/auth`)

1.  **POST** `/auth/register`
    *   **Purpose**: Register a new Client Organization and its initial Admin user.
    *   **Payload**: Org details (name, type), admin user info (email, password), potential tier selection/payment info.
2.  **POST** `/auth/login`
    *   **Purpose**: Authenticate a user (any role).
    *   **Payload**: Email, password.
    *   **Response**: Access token (JWT), refresh token, user details (id, role, orgId).
3.  **POST** `/auth/refresh`
    *   **Purpose**: Obtain a new access token using a refresh token.
    *   **Payload**: Refresh token.
4.  **POST** `/auth/forgot-password`
    *   **Purpose**: Initiate password reset flow.
    *   **Payload**: Email address.
5.  **POST** `/auth/reset-password`
    *   **Purpose**: Set a new password using a reset token.
    *   **Payload**: Reset token, new password.
6.  **POST** `/auth/logout`
    *   **Purpose**: Invalidate current session/token (server-side if possible, plus client-side cleanup).
7.  **GET** `/auth/me`
    *   **Purpose**: Get details of the currently authenticated user.
    *   **Response**: User ID, name, email, role, organization ID, permissions, etc.
8.  **POST** `/auth/expert-register` (Admin Only or Specific Flow)
    *   **Purpose**: Register an Expert Organization (may require ABCD Admin approval).
    *   **Payload**: Similar to client registration, potentially different fields.

---

## B. Organizations (`/organizations`)

1.  **GET** `/organizations/me`
    *   **Purpose**: Retrieve details for the current user's organization.
    *   **Response**: Org ID, name, type, logo URL, subscription tier, custom branding settings.
2.  **PATCH** `/organizations/me`
    *   **Purpose**: Update details for the current user's organization (Org Admin).
    *   **Payload**: Fields to update (name, logo, custom terminology).
3.  **GET** `/organizations/me/subscription`
    *   **Purpose**: Get current subscription tier details and limits (Org Admin).
4.  **POST** `/organizations/me/subscription/upgrade`
    *   **Purpose**: Request subscription tier upgrade (Org Admin).
    *   **Payload**: Target tier, potential payment info.
5.  **POST** `/organizations/me/subscription/request-boost`
    *   **Purpose**: Request temporary resource limit increase (Org Admin).
    *   **Payload**: Reason, duration, requested limits.
6.  **GET** `/organizations/me/usage`
    *   **Purpose**: Get current resource usage metrics (messages, storage, workers, etc.) vs. limits (Org Admin).
7.  **GET** `/organizations/me/billing/history`
    *   **Purpose**: Get billing history/invoices (Org Admin).
8.  **GET** `/organizations/me/billing/methods`
    *   **Purpose**: List payment methods (Org Admin).
9.  **POST** `/organizations/me/billing/methods`
    *   **Purpose**: Add a new payment method (Org Admin).
10. **DELETE** `/organizations/me/billing/methods/{methodId}`
    *   **Purpose**: Remove a payment method (Org Admin).
11. **GET** `/organizations/me/settings`
    *   **Purpose**: Retrieve organization-specific settings (e.g., default experiment params, custom terminology).
12. **PATCH** `/organizations/me/settings`
    *   **Purpose**: Update organization-specific settings.
13. **GET** `/organizations/me/billing/forecasts`
    *   **Purpose**: Get billing/resource usage forecasts (Org Admin).
14. **GET** `/organizations/me/activity`
    *   **Purpose**: Get activity log specific to the user's organization.
15. **GET** `/organizations/me/branding`
    *   **Purpose**: Get organization-specific branding settings (colors, logo, etc.).
16. **PATCH** `/organizations/me/branding`
    *   **Purpose**: Update organization-specific branding settings.
17. **POST** `/organizations/me/branding/reset`
    *   **Purpose**: Reset organization branding to platform defaults.
18. **GET** `/organizations/me/integrations`
    *   **Purpose**: List configured integrations for the organization (WhatsApp, SMS, etc.).
19. **GET** `/organizations/me/integrations/{integrationType}`
    *   **Purpose**: Get configuration details for a specific integration.
20. **PATCH** `/organizations/me/integrations/{integrationType}`
    *   **Purpose**: Update the configuration for a specific integration.
21. **POST** `/organizations/me/integrations/{integrationType}/test`
    *   **Purpose**: Test the connection for a configured integration.
22. **DELETE** `/organizations/me/integrations/{integrationType}`
    *   **Purpose**: Remove/disconnect an integration.
23. **GET** `/organizations/me/roles`
    *   **Purpose**: Get organization-specific role definitions.
24. **POST** `/organizations/me/roles`
    *   **Purpose**: Create a new custom role within the organization.
    *   **Payload**: Role definition (name, permissions).
25. **PATCH** `/organizations/me/roles/{roleId}`
    *   **Purpose**: Update an existing custom role definition.
26. **DELETE** `/organizations/me/roles/{roleId}`
    *   **Purpose**: Delete a custom role.
27. **GET** `/organizations/me/permissions`
    *   **Purpose**: Get the permission matrix available for roles within the organization.
28. **GET** `/organizations/me/billing/history/{invoiceId}/pdf`
    *   **Purpose**: Download a specific invoice as a PDF.
29. **POST** `/organizations/me/usage/forecast/simulate`
    *   **Purpose**: Run a custom usage forecast simulation based on provided parameters.
    *   **Payload**: Simulation parameters (e.g., expected worker growth, program launches).
30. **GET** `/organizations/me/recommendations`
    *   **Purpose**: Get subscription tier or usage recommendations based on current patterns.
31. **GET** `/organizations/me/allocations`
    *   **Purpose**: Get current resource allocation data (e.g., allocations per program).
32. **PATCH** `/organizations/me/allocations`
    *   **Purpose**: Update resource allocations.
    *   **Payload**: Allocation updates.
33. **GET** `/organizations/me/allocations/history`
    *   **Purpose**: Get the history of resource allocation changes.
34. **GET** `/organizations/me/usage/alerts`
    *   **Purpose**: Get configured usage alert rules.
35. **POST** `/organizations/me/usage/alerts`
    *   **Purpose**: Create a new usage alert rule.
    *   **Payload**: Alert rule definition (resource type, threshold, notification settings).
36. **PATCH** `/organizations/me/usage/alerts/{alertId}`
    *   **Purpose**: Update an existing usage alert rule.
37. **DELETE** `/organizations/me/usage/alerts/{alertId}`
    *   **Purpose**: Delete a usage alert rule.
38. **POST** `/organizations/me/usage/alerts/{alertId}/test`
    *   **Purpose**: Send a test notification for a usage alert rule.

---

## C. Users (`/users`)

1.  **GET** `/users`
    *   **Purpose**: List users within the current organization (Org Admin). Supports pagination, filtering by role/status.
2.  **POST** `/users` (Invite)
    *   **Purpose**: Invite a new user to the organization (Org Admin).
    *   **Payload**: Email, role.
3.  **GET** `/users/{userId}`
    *   **Purpose**: Get details for a specific user (Org Admin or self).
4.  **PATCH** `/users/{userId}`
    *   **Purpose**: Update user details (role, status - Org Admin; profile info - self).
    *   **Payload**: Fields to update.
5.  **DELETE** `/users/{userId}`
    *   **Purpose**: Deactivate a user account (Org Admin).
6.  **POST** `/users/{userId}/resend-invite`
    *   **Purpose**: Resend invitation email if user hasn't accepted (Org Admin).
7.  **GET** `/users/roles`
    *   **Purpose**: Get a list of available user roles and their permissions.
8.  **GET** `/users/{userId}/activity`
    *   **Purpose**: Get the activity log for a specific user (Org Admin).
9.  **GET** `/users/{userId}/sessions`
    *   **Purpose**: List active login sessions for a specific user (Org Admin).
10. **DELETE** `/users/{userId}/sessions/{sessionId}`
    *   **Purpose**: Terminate a specific login session for a user (Org Admin).

---

## D. Workers / Audience (`/workers`)

1.  **GET** `/workers`
    *   **Purpose**: List all workers in the organization. Supports pagination, search, filtering (by segment, status, custom fields).
2.  **POST** `/workers`
    *   **Purpose**: Create a single new worker record.
    *   **Payload**: Worker details (name, phone, language, custom fields).
3.  **POST** `/workers/bulk-import`
    *   **Purpose**: Initiate bulk import of workers from CSV/spreadsheet. Returns job ID.
    *   **Payload**: File upload or reference.
4.  **GET** `/workers/bulk-import/{jobId}`
    *   **Purpose**: Get status and results of a bulk import job.
5.  **POST** `/workers/bulk-update`
    *   **Purpose**: Update attributes for multiple workers in a single request.
    *   **Payload**: `{ workerIds: string[], updates: object }`
6.  **POST** `/workers/bulk-delete`
    *   **Purpose**: Delete multiple worker records.
    *   **Payload**: `{ workerIds: string[] }`
7.  **GET** `/workers/{workerId}`
    *   **Purpose**: Retrieve detailed profile for a specific worker. Includes assigned segments, active programs, key metrics, wellbeing status.
8.  **PATCH** `/workers/{workerId}`
    *   **Purpose**: Update worker details (profile fields, language preference).
9.  **DELETE** `/workers/{workerId}`
    *   **Purpose**: Deactivate or delete a worker record.
10. **POST** `/workers/{workerId}/tags`
    *   **Purpose**: Add one or more tags to a specific worker.
    *   **Payload**: `{ tags: string[] }`
11. **DELETE** `/workers/{workerId}/tags/{tagValue}`
    *   **Purpose**: Remove a specific tag from a worker.
12. **GET** `/workers/{workerId}/programs`
    *   **Purpose**: List programs the worker is currently enrolled in.
13. **GET** `/workers/{workerId}/segments`
    *   **Purpose**: List segments the worker currently belongs to.
14. **GET** `/workers/{workerId}/journey-state`
    *   **Purpose**: Get the worker's current state across all active journeys/programs (current step, history snippet).
15. **GET** `/workers/{workerId}/gamification`
    *   **Purpose**: Get worker's points, earned badges, challenge progress.
16. **GET** `/workers/{workerId}/points`
    *   **Purpose**: Retrieve the current point balance for a specific worker.
17. **POST** `/workers/{workerId}/points/adjust`
    *   **Purpose**: Manually adjust the point balance for a specific worker.
    *   **Payload**: `{ amount: number, reason: string }`
18. **GET** `/workers/{workerId}/points/history`
    *   **Purpose**: Get the point transaction history for a worker.
19. **GET** `/workers/{workerId}/badges`
    *   **Purpose**: Retrieve the badges earned by a specific worker.
20. **GET** `/workers/{workerId}/challenges`
    *   **Purpose**: Retrieve the challenges a specific worker is participating in or has completed.
21. **GET** `/workers/{workerId}/wellbeing`
    *   **Purpose**: Get worker's latest wellbeing indicators and assessment history.
22. **GET** `/workers/schema`
    *   **Purpose**: Get the schema for worker custom fields defined by the organization.
23. **PATCH** `/workers/schema`
    *   **Purpose**: Update the schema for worker custom fields (Org Admin).
24. **GET** `/reports/workers`
    *   **Purpose**: Retrieve general worker reports (e.g., counts, status distribution).
25. **GET** `/reports/workers/demographics`
    *   **Purpose**: Retrieve reports focused on worker demographic data.
26. **GET** `/reports/workers/engagement`
    *   **Purpose**: Retrieve reports focused on worker engagement metrics across programs.

---

## E. Segments (`/segments`)

1.  **GET** `/segments`
    *   **Purpose**: List all segments defined in the organization. Supports pagination, filtering by type.
2.  **POST** `/segments`
    *   **Purpose**: Create a new segment.
    *   **Payload**: Name, type (static, rule-based), description, rule definition (if applicable).
3.  **GET** `/segments/{segmentId}`
    *   **Purpose**: Get details of a specific segment, including its rules or static members.
4.  **PATCH** `/segments/{segmentId}`
    *   **Purpose**: Update segment details (name, description, rules).
5.  **DELETE** `/segments/{segmentId}`
    *   **Purpose**: Delete a segment.
6.  **GET** `/segments/{segmentId}/workers`
    *   **Purpose**: List workers currently belonging to this segment (supports pagination).
7.  **POST** `/segments/{segmentId}/workers` (for Static Segments)
    *   **Purpose**: Manually add workers to a static segment.
    *   **Payload**: Array of `{workerId}`.
8.  **DELETE** `/segments/{segmentId}/workers/{workerId}` (for Static Segments)
    *   **Purpose**: Manually remove a worker from a static segment.
9.  **POST** `/segments/{segmentId}/sync` (for Rule-Based Segments)
    *   **Purpose**: Manually trigger a recalculation of membership for a rule-based segment.
10. **GET** `/segments/{segmentId}/sync/{jobId}`
    *   **Purpose**: Check the status of a background segment synchronization job.
11. **GET** `/segments/{segmentId}/analytics`
    *   **Purpose**: Get comparative analytics for this segment (engagement, completion rates vs. org average).
12. **POST** `/segments/{segmentId}/test-rule`
    *   **Purpose**: Test the segment rule definition against the worker database.
    *   **Payload**: Rule definition.
    *   **Response**: Count of matching workers, sample list.
13. **GET** `/segments/types`
    *   **Purpose**: Get available segment types (Organizational, Location, Performance, etc.) and rule attributes.
14. **GET** `/segments/conflicts`
    *   **Purpose**: Identify potential conflicts or overlaps between segments used in active programs.
15. **GET** `/segments/{segmentId}/programs`
    *   **Purpose**: List the programs that are currently using a specific segment for targeting.

---

## F. Content (`/content`)

1.  **GET** `/content`
    *   **Purpose**: List content modules in the library. Supports pagination, filtering (type, tag, language, license), search.
2.  **POST** `/content`
    *   **Purpose**: Create a new content module.
    *   **Payload**: Type (text, video, quiz, reflection, etc.), title, description, tags, language, initial content data (text, media URL, quiz questions).
3.  **GET** `/content/{contentId}`
    *   **Purpose**: Get details of a specific content module, including its full data (quiz structure, reflection prompt).
4.  **PATCH** `/content/{contentId}`
    *   **Purpose**: Update content module details or data.
5.  **DELETE** `/content/{contentId}`
    *   **Purpose**: Delete or archive a content module.
6.  **POST** `/content/{contentId}/versions`
    *   **Purpose**: Create a new version of a content module.
    *   **Payload**: Content data, version notes.
7.  **GET** `/content/{contentId}/versions`
    *   **Purpose**: List versions of a content module.
8.  **POST** `/content/{contentId}/versions/{versionId}/revert`
    *   **Purpose**: Revert a content module to a specific previous version.
    *   **Payload**: Optional notes about the reversion.
9.  **POST** `/content/media/upload`
    *   **Purpose**: Upload media files (image, video, audio, document). Returns URL/reference.
    *   **Payload**: File data.
10. **GET** `/content/media`
    *   **Purpose**: List uploaded media assets (media library).
11. **GET** `/content/templates`
    *   **Purpose**: List message templates (including WhatsApp HSM).
12. **POST** `/content/templates`
    *   **Purpose**: Create a new message template.
    *   **Payload**: Name, content, language, variables, channel type (WhatsApp, SMS), potentially HSM details.
13. **GET** `/content/templates/{templateId}`
    *   **Purpose**: Get template details.
14. **PATCH** `/content/templates/{templateId}`
    *   **Purpose**: Update template details.
15. **DELETE** `/content/templates/{templateId}`
    *   **Purpose**: Delete a message template.
16. **POST** `/content/templates/{templateId}/request-approval` (for WhatsApp HSM)
    *   **Purpose**: Submit WhatsApp template for approval via provider.
17. **GET** `/content/templates/{templateId}/approval-status` (for WhatsApp HSM)
    *   **Purpose**: Check approval status.
18. **GET** `/content/types`
    *   **Purpose**: Get available content types and their schemas/capabilities.
19. **GET** `/content/tags`
    *   **Purpose**: Get list of tags used across content.
20. **POST** `/content/tags`
    *   **Purpose**: Create a new tag for content organization.
    *   **Payload**: `{ name: string, description?: string }`
21. **DELETE** `/content/tags/{tagId}`
    *   **Purpose**: Delete an existing tag.
22. **POST** `/content/{contentId}/license`
    *   **Purpose**: Set or update licensing terms for a content module (e.g., for Marketplace).
23. **GET** `/content/{contentId}/usage`
    *   **Purpose**: Get analytics on how often this content is used in journeys/programs.
24. **POST** `/content/collections`
    *   **Purpose**: Create a new collection of content items.
    *   **Payload**: Name, description, optional initial content items.
25. **GET** `/content/collections`
    *   **Purpose**: List all content collections for the organization.
26. **GET** `/content/collections/{collectionId}`
    *   **Purpose**: Get details of a specific content collection, including its items.
27. **PATCH** `/content/collections/{collectionId}`
    *   **Purpose**: Update the details (name, description) of a content collection.
28. **DELETE** `/content/collections/{collectionId}`
    *   **Purpose**: Delete a content collection.
29. **POST** `/content/collections/{collectionId}/items`
    *   **Purpose**: Add one or more content items to a collection.
    *   **Payload**: `{ contentIds: string[] }`
30. **DELETE** `/content/collections/{collectionId}/items/{contentId}`
    *   **Purpose**: Remove a content item from a collection.
31. **GET** `/content/types`
    *   **Purpose**: Get available content types and their schemas/capabilities.
32. **PATCH** `/content/media/{mediaId}`
    *   **Purpose**: Update metadata for an existing media item (e.g., alt text, caption).
    *   **Payload**: Metadata fields to update.
33. **DELETE** `/content/media/{mediaId}`
    *   **Purpose**: Delete a media item from the library.
34. **GET** `/content/media/{mediaId}/usage`
    *   **Purpose**: Find where a specific media item is being used (e.g., in which content modules or journeys).

---

## G. Journey Blueprints (`/journeys`)

1.  **GET** `/journeys`
    *   **Purpose**: List all Journey Blueprints in the organization. Supports pagination, filtering, search.
2.  **POST** `/journeys`
    *   **Purpose**: Create a new, empty Journey Blueprint.
    *   **Payload**: Name, description, tags.
3.  **GET** `/journeys/{journeyId}`
    *   **Purpose**: Get the full structure of a Journey Blueprint (phases, touchpoints, rules, linked content).
4.  **PATCH** `/journeys/{journeyId}`
    *   **Purpose**: Update Journey Blueprint metadata (name, description).
5.  **DELETE** `/journeys/{journeyId}`
    *   **Purpose**: Delete or archive a Journey Blueprint.
6.  **PUT** `/journeys/{journeyId}/publish`
    *   **Purpose**: Publish a draft journey blueprint, making it available for use in programs.
    *   **Payload**: Optional version notes.
7.  **POST** `/journeys/{journeyId}/phases`
    *   **Purpose**: Add a new phase to the journey.
    *   **Payload**: Phase name, order.
8.  **PATCH** `/journeys/{journeyId}/phases/{phaseId}`
    *   **Purpose**: Update phase details (name, order).
9.  **DELETE** `/journeys/{journeyId}/phases/{phaseId}`
    *   **Purpose**: Remove a phase.
10. **POST** `/journeys/{journeyId}/phases/{phaseId}/touchpoints`
    *   **Purpose**: Add a new touchpoint to a phase.
    *   **Payload**: Touchpoint type, linked contentId, order, rules/conditions.
11. **PATCH** `/journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}`
    *   **Purpose**: Update touchpoint details (content link, rules, order).
12. **DELETE** `/journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}`
    *   **Purpose**: Remove a touchpoint.
13. **POST** `/journeys/{journeyId}/connections`
    *   **Purpose**: Create connections (edges) between touchpoints in the journey graph.
    *   **Payload**: `{ sourceId: string, targetId: string, condition?: ConnectionCondition, label?: string }`
14. **PATCH** `/journeys/{journeyId}/connections/{connectionId}`
    *   **Purpose**: Update details of a connection (e.g., condition, label).
15. **DELETE** `/journeys/{journeyId}/connections/{connectionId}`
    *   **Purpose**: Delete a connection between touchpoints.
16. **POST** `/journeys/{journeyId}/simulate`
    *   **Purpose**: Simulate the journey flow for a hypothetical worker profile.
    *   **Payload**: Worker attributes (optional).
    *   **Response**: Simulated path through the journey.
17. **POST** `/journeys/{journeyId}/simulate/response`
    *   **Purpose**: Submit a simulated response to a touchpoint during a journey simulation.
    *   **Payload**: `{ simulationId: string, touchpointId: string, response: any }`
18. **GET** `/journeys/{journeyId}/rules/schema`
    *   **Purpose**: Get the available conditions and actions for journey rules engine.
19. **POST** `/journeys/{journeyId}/duplicate`
    *   **Purpose**: Create a copy of an existing journey blueprint.
20. **GET** `/journeys/templates`
    *   **Purpose**: List available journey templates for creating new blueprints.
21. **GET** `/journeys/{journeyId}/analytics`
    *   **Purpose**: Get analytics on the usage and effectiveness of a specific journey blueprint across programs.

---

## H. Programs (`/programs`)

1.  **GET** `/programs`
    *   **Purpose**: List all programs (active, scheduled, completed). Supports pagination, filtering, search.
2.  **POST** `/programs`
    *   **Purpose**: Create a new program.
    *   **Payload**: Name, description, linked journeyId(s), assigned segmentId(s) or workerId(s), schedule (start/end), reminder settings, follow-up rules, conflict resolution strategy.
3.  **GET** `/programs/{programId}`
    *   **Purpose**: Get program details, configuration, and high-level status.
4.  **PATCH** `/programs/{programId}`
    *   **Purpose**: Update program configuration (schedule, assignments, settings).
5.  **DELETE** `/programs/{programId}`
    *   **Purpose**: Delete or archive a program.
6.  **POST** `/programs/{programId}/actions/start`
    *   **Purpose**: Manually start a scheduled program.
7.  **POST** `/programs/{programId}/actions/pause`
    *   **Purpose**: Pause an active program.
8.  **POST** `/programs/{programId}/actions/resume`
    *   **Purpose**: Resume a paused program.
9.  **POST** `/programs/{programId}/actions/end`
    *   **Purpose**: End an active program prematurely.
10. **POST** `/programs/estimate-audience`
    *   **Purpose**: Estimate the number of workers matching selected segments/filters before creating a program.
    *   **Payload**: `{ segmentIds?: string[], workerIds?: string[], eligibilityFilters?: object }`
11. **POST** `/programs/{programId}/validate-deployment`
    *   **Purpose**: Check if a program configuration is valid and ready for deployment.
12. **GET** `/programs/{programId}/deployment-status`
    *   **Purpose**: Get the current status of a program's deployment, especially relevant for phased rollouts.
13. **POST** `/programs/{programId}/phased-deployment`
    *   **Purpose**: Configure or manage phased deployment rules for a program.
    *   **Payload**: Phased deployment configuration object.
14. **GET** `/programs/{programId}/workers`
    *   **Purpose**: List workers enrolled in the program, along with their current status/progress. Supports pagination, filtering.
15. **GET** `/programs/{programId}/workers/{workerId}/state`
    *   **Purpose**: Get detailed current state for a specific worker within this program (current touchpoint, history, next scheduled interaction).
16. **PATCH** `/programs/{programId}/workers/{workerId}/state` (Internal/Careful Use)
    *   **Purpose**: Manually adjust a worker's state (e.g., skip a step, mark complete). Use with caution.
17. **POST** `/programs/{programId}/workers/{workerId}/pause`
    *   **Purpose**: Temporarily pause a specific worker's participation in the program.
    *   **Payload**: `{ reason?: string, resumeDate?: string }`
18. **POST** `/programs/{programId}/workers/{workerId}/resume`
    *   **Purpose**: Resume a paused worker's participation in the program.
19. **DELETE** `/programs/{programId}/workers/{workerId}`
    *   **Purpose**: Remove a worker from the program.
20. **GET** `/programs/{programId}/workers/{workerId}/timeline`
    *   **Purpose**: Retrieve the detailed journey progress timeline for a specific worker in this program.
21. **GET** `/programs/{programId}/workers/{workerId}/responses`
    *   **Purpose**: Get the history of responses submitted by a worker for touchpoints within this program.
22. **GET** `/programs/{programId}/workers/{workerId}/messages`
    *   **Purpose**: Get the log of messages sent/received for a specific worker within this program.
23. **POST** `/programs/{programId}/send-manual-touchpoint`
    *   **Purpose**: Send an ad-hoc message or touchpoint to specific workers within a program.
    *   **Payload**: `{ workerIds: string[], contentId?: string, messageText?: string }`
24. **GET** `/programs/{programId}/analytics`
    *   **Purpose**: Get aggregated analytics for the program (completion rates, engagement metrics, quiz score distributions, wellbeing trends).
25. **GET** `/programs/{programId}/analytics/segments`
    *   **Purpose**: Get program analytics broken down by assigned segment.
26. **GET** `/programs/{programId}/analytics/wellbeing`
    *   **Purpose**: Retrieve wellbeing-specific analytics for this program.
27. **GET** `/programs/{programId}/content-performance`
    *   **Purpose**: Get analytics on the performance of content used within this program.
28. **GET** `/programs/{programId}/feedback`
    *   **Purpose**: List worker-initiated feedback (help requests, observations) received within this program. Supports pagination, filtering.
29. **GET** `/programs/{programId}/feedback/{feedbackId}`
    *   **Purpose**: Retrieve details of a specific feedback entry related to this program.
30. **POST** `/programs/{programId}/feedback/{feedbackId}/respond`
    *   **Purpose**: Allow a manager to respond to specific worker feedback.
31. **GET** `/programs/{programId}/messaging/log`
    *   **Purpose**: Get a log of messages sent/received within the program context.
32. **GET** `/programs/{programId}/conflicts`
    *   **Purpose**: Get details about detected conflicts (overlaps, throttling) with other programs for enrolled workers.
33. **GET** `/programs/{programId}/follow-up-config`
    *   **Purpose**: Get the specific follow-up rule configuration for this program.
34. **PATCH** `/programs/{programId}/follow-up-config`
    *   **Purpose**: Update the specific follow-up rule configuration for this program.
    *   **Payload**: Follow-up rules definition.
35. **GET** `/programs/{programId}/conflict-config`
    *   **Purpose**: Get the specific conflict strategy/configuration for this program.
36. **PATCH** `/programs/{programId}/conflict-config`
    *   **Purpose**: Update the specific conflict strategy/configuration for this program.
    *   **Payload**: Conflict strategy definition.
37. **POST** `/programs/{programId}/reports`
    *   **Purpose**: Initiate the generation of a program report.
    *   **Payload**: Report configuration object.
38. **GET** `/programs/{programId}/reports/{reportId}`
    *   **Purpose**: Retrieve a previously generated program report.
39. **POST** `/programs/{programId}/exports`
    *   **Purpose**: Initiate the export of program data.
    *   **Payload**: Export configuration object.
40. **GET** `/programs/{programId}/exports/{exportId}`
    *   **Purpose**: Retrieve a generated program data export file or status.
41. **GET** `/programs/{programId}/blueprints`
    *   **Purpose**: Get the list of Journey Blueprints associated with this program.
42. **PATCH** `/programs/{programId}/blueprints/{blueprintId}`
    *   **Purpose**: Update blueprint-specific settings within the context of this program.
43. **GET** `/programs/{programId}/activities`
    *   **Purpose**: Get a feed of recent activities or events related to this program.
44. **POST** `/programs/{programId}/validate-deployment`
    *   **Purpose**: Check if a program's configuration is valid and ready for deployment.
45. **GET** `/programs/{programId}/deployment-status`
    *   **Purpose**: Get the current deployment status, especially relevant for phased rollouts.
46. **POST** `/programs/{programId}/phased-deployment`
    *   **Purpose**: Configure or manage phased deployment rules for a program.

---

## I. Program Execution / Worker Interaction (May use Webhooks or dedicated endpoints)

*These might not be traditional REST endpoints called directly by the frontend UI but are crucial backend capabilities potentially exposed via specific APIs or handled internally based on webhooks.*

1.  **POST** `/webhooks/whatsapp` (or similar, e.g., `/interactions/whatsapp`)
    *   **Purpose**: Receive incoming messages/responses from workers via WhatsApp (or other channels). Backend processes this, updates worker state in the relevant program, and determines next action.
    *   **Payload**: Provider-specific webhook format (e.g., Twilio).
2.  **GET** `/interactions/worker/{workerId}/next-touchpoint` (Potentially internal or triggered by backend)
    *   **Purpose**: Determine the next touchpoint/message for a worker based on their current program state and journey rules.
    *   **Response**: ContentId/TemplateId to send, variables, schedule time.
3.  **POST** `/interactions/send` (Potentially internal or triggered by backend)
    *   **Purpose**: Queue a message for sending to a worker via the appropriate channel.
    *   **Payload**: workerId, programId, contentId/templateId, variables.

---

## J. Experiments (`/experiments`)

1.  **GET** `/experiments`
    *   **Purpose**: List all experiments. Supports pagination, filtering (type: journey/program/content, status: running/completed).
2.  **POST** `/experiments`
    *   **Purpose**: Create a new experiment definition.
    *   **Payload**: Name, description, type, hypothesis, target (journeyId, programId, contentId), variants definition, audience allocation, metrics definition, start/end conditions.
3.  **GET** `/experiments/{experimentId}`
    *   **Purpose**: Get experiment details, configuration, and status.
4.  **PATCH** `/experiments/{experimentId}`
    *   **Purpose**: Update experiment configuration (before start).
5.  **DELETE** `/experiments/{experimentId}`
    *   **Purpose**: Delete an experiment definition.
6.  **POST** `/experiments/{experimentId}/actions/start`
    *   **Purpose**: Start a defined experiment.
7.  **POST** `/experiments/{experimentId}/actions/pause`
    *   **Purpose**: Pause a running experiment.
8.  **POST** `/experiments/{experimentId}/actions/resume`
    *   **Purpose**: Resume a paused experiment.
9.  **POST** `/experiments/{experimentId}/actions/conclude`
    *   **Purpose**: Conclude an experiment and calculate final results.
10. **POST** `/experiments/{experimentId}/actions/archive`
    *   **Purpose**: Archive a concluded experiment.
11. **POST** `/experiments/{experimentId}/actions/unarchive`
    *   **Purpose**: Restore an archived experiment.
12. **PATCH** `/experiments/{experimentId}/variants/{variantId}`
    *   **Purpose**: Update the configuration of a specific experiment variant.
13. **DELETE** `/experiments/{experimentId}/variants/{variantId}`
    *   **Purpose**: Delete a variant from an experiment (if not started).
14. **GET** `/experiments/{experimentId}/results`
    *   **Purpose**: Get analysis results for an experiment (metrics per variant, statistical significance, winner recommendation).
15. **GET** `/experiments/{experimentId}/results/export`
    *   **Purpose**: Export experiment results in a specified format (e.g., CSV, JSON).
16. **GET** `/experiments/{experimentId}/participants`
    *   **Purpose**: List participants and their assigned variant.
17. **GET** `/experiments/{experimentId}/history`
    *   **Purpose**: Retrieve the event history or log for an experiment.
18. **GET** `/experiments/metrics/schema`
    *   **Purpose**: Get available metrics that can be tracked in experiments.
19. **GET** `/experiments/types`
    *   **Purpose**: Get available experiment types (Journey-level, Program-level, etc.).
20. **GET** `/experiments/conflicts`
    *   **Purpose**: Check for potential conflicts between a planned experiment and existing active ones.
    *   **Payload**: Experiment definition or criteria.
21. **POST** `/experiments/{experimentId}/duplicate`
    *   **Purpose**: Create a new experiment based on an existing one.
22. **GET** `/experiments/{experimentId}/variants`
    *   **Purpose**: Get all variants defined for an experiment.
23. **POST** `/experiments/{experimentId}/variants`
    *   **Purpose**: Create a new variant for the experiment.
    *   **Payload**: Variant configuration details.
24. **GET** `/experiments/{experimentId}/audience`
    *   **Purpose**: Get the audience configuration and assignment details for an experiment.
25. **PATCH** `/experiments/{experimentId}/audience`
    *   **Purpose**: Update the audience configuration for an experiment (before start).
26. **GET** `/experiments/{experimentId}/metrics`
    *   **Purpose**: Get the metrics configuration for an experiment.
27. **PATCH** `/experiments/{experimentId}/metrics`
    *   **Purpose**: Update the metrics configuration for an experiment (before start).

---

## K. Gamification (`/gamification`)

1.  **GET** `/gamification/badges`
    *   **Purpose**: List available badges for the organization.
2.  **POST** `/gamification/badges`
    *   **Purpose**: Create a new badge definition.
    *   **Payload**: Name, description, icon, awarding criteria/rules.
3.  **PATCH** `/gamification/badges/{badgeId}`
    *   **Purpose**: Update badge definition.
4.  **DELETE** `/gamification/badges/{badgeId}`
    *   **Purpose**: Delete a badge definition.
5.  **GET** `/gamification/badges/{badgeId}/statistics`
    *   **Purpose**: Retrieve statistics about the awarding of a specific badge.
6.  **GET** `/gamification/challenges`
    *   **Purpose**: List available challenges.
7.  **POST** `/gamification/challenges`
    *   **Purpose**: Create a new challenge definition.
    *   **Payload**: Name, description, type (individual/group), goal/metric, timeframe, associated rewards/points.
8.  **PATCH** `/gamification/challenges/{challengeId}`
    *   **Purpose**: Update challenge definition.
9.  **DELETE** `/gamification/challenges/{challengeId}`
    *   **Purpose**: Delete a challenge definition.
10. **GET** `/gamification/challenges/{challengeId}/progress`
    *   **Purpose**: Retrieve progress data for participants in a specific challenge.
11. **POST** `/gamification/challenges/{challengeId}/remind`
    *   **Purpose**: Send reminders to participants of a challenge.
12. **GET** `/gamification/leaderboards`
    *   **Purpose**: List defined leaderboards.
13. **POST** `/gamification/leaderboards`
    *   **Purpose**: Create a new leaderboard definition.
    *   **Payload**: Name, description, metric, timeframe, target segment (optional).
14. **PATCH** `/gamification/leaderboards/{leaderboardId}`
    *   **Purpose**: Update leaderboard definition.
15. **DELETE** `/gamification/leaderboards/{leaderboardId}`
    *   **Purpose**: Delete a leaderboard definition.
16. **GET** `/gamification/leaderboards/{leaderboardId}/rankings`
    *   **Purpose**: Get current rankings for a specific leaderboard.
17. **GET** `/gamification/rewards`
    *   **Purpose**: List available rewards in the catalog.
18. **POST** `/gamification/rewards`
    *   **Purpose**: Create a new reward definition.
    *   **Payload**: Name, description, type (digital/physical), cost (points), eligibility rules.
19. **PATCH** `/gamification/rewards/{rewardId}`
    *   **Purpose**: Update reward definition.
20. **DELETE** `/gamification/rewards/{rewardId}`
    *   **Purpose**: Delete a reward definition.
21. **POST** `/gamification/rewards/{rewardId}/distribute`
    *   **Purpose**: Manually distribute a specific reward to workers/segments.
22. **POST** `/workers/{workerId}/rewards/redeem`
    *   **Purpose**: Allow a worker (or manager on behalf) to redeem points for a reward.
    *   **Payload**: rewardId.
23. **GET** `/gamification/dashboard`
    *   **Purpose**: Retrieve summary data for the main gamification dashboard.
24. **GET** `/workers/{workerId}/points/history`
    *   **Purpose**: Get the point transaction history for a specific worker.
25. **POST** `/workers/{workerId}/rewards/redeem`
    *   **Purpose**: Allow a worker (or manager on behalf) to redeem points for a reward.
    *   **Payload**: `{ rewardId: string }`

---

## L. Wellbeing (`/wellbeing`)

1.  **GET** `/wellbeing/indicators`
    *   **Purpose**: List all configured wellbeing indicators.
2.  **POST** `/wellbeing/indicators`
    *   **Purpose**: Create a new custom wellbeing indicator.
    *   **Payload**: Name, description, scale, thresholds, etc.
3.  **PATCH** `/wellbeing/indicators/{indicatorId}`
    *   **Purpose**: Update an existing wellbeing indicator.
4.  **GET** `/wellbeing/indicators/schema`
    *   **Purpose**: Get the schema for available wellbeing indicators (standard + org-defined).
5.  **PATCH** `/wellbeing/indicators/schema` (Org Admin)
    *   **Purpose**: Add/update organization-specific wellbeing indicators.
6.  **GET** `/wellbeing/indicators/{indicatorId}/trend`
    *   **Purpose**: Retrieve trend data for a specific indicator.
7.  **GET** `/wellbeing/indicators/{indicatorId}/distribution`
    *   **Purpose**: Retrieve the current distribution of values for an indicator.
8.  **GET** `/workers/{workerId}/wellbeing/indicators`
    *   **Purpose**: Get the latest values for wellbeing indicators for a specific worker.
9.  **POST** `/workers/{workerId}/wellbeing/indicators` (Maybe via specific interaction)
    *   **Purpose**: Record new wellbeing indicator data for a worker (e.g., from a self-assessment touchpoint).
    *   **Payload**: Indicator values.
10. **GET** `/wellbeing/assessments`
    *   **Purpose**: List defined wellbeing assessment templates.
11. **POST** `/wellbeing/assessments`
    *   **Purpose**: Create a new assessment template.
    *   **Payload**: Name, questions, scoring logic.
12. **GET** `/wellbeing/assessments/{assessmentId}`
    *   **Purpose**: Get details of a specific assessment template.
13. **GET** `/wellbeing/assessments/{assessmentId}/results`
    *   **Purpose**: Retrieve aggregated results for a specific wellbeing assessment.
14. **PATCH** `/wellbeing/assessments/{assessmentId}`
    *   **Purpose**: Update an assessment template.
15. **DELETE** `/wellbeing/assessments/{assessmentId}`
    *   **Purpose**: Delete an assessment template.
16. **POST** `/wellbeing/assessments/schedule`
    *   **Purpose**: Schedule periodic wellbeing assessments for segments/workers.
    *   **Payload**: assessmentId, target segmentId/workerId, frequency.
17. **GET** `/workers/{workerId}/wellbeing/assessments/history`
    *   **Purpose**: Get history of completed wellbeing assessments for a worker.
18. **GET** `/wellbeing/interventions`
    *   **Purpose**: List available wellbeing intervention templates/resources.
19. **POST** `/wellbeing/interventions`
    *   **Purpose**: Create a new intervention template.
    *   **Payload**: Name, description, content, trigger rules (optional).
20. **GET** `/wellbeing/interventions/{interventionId}`
    *   **Purpose**: Get details of a specific intervention template/resource.
21. **GET** `/wellbeing/interventions/{interventionId}/effectiveness`
    *   **Purpose**: Retrieve metrics on the effectiveness of a specific intervention.
22. **PATCH** `/wellbeing/interventions/{interventionId}`
    *   **Purpose**: Update an intervention template/resource.
23. **DELETE** `/wellbeing/interventions/{interventionId}`
    *   **Purpose**: Delete an intervention template/resource.
24. **POST** `/workers/{workerId}/wellbeing/interventions/assign`
    *   **Purpose**: Manually assign a wellbeing intervention/resource to a worker.
    *   **Payload**: interventionId.
25. **GET** `/wellbeing/analytics/trends`
    *   **Purpose**: Get aggregated wellbeing trends across the organization or segments.
26. **GET** `/wellbeing/analytics`
    *   **Purpose**: Retrieve detailed, filterable wellbeing analytics data.
27. **GET** `/wellbeing/alerts`
    *   **Purpose**: List workers flagged based on critical wellbeing thresholds.
28. **GET** `/wellbeing/alerts/{alertId}`
    *   **Purpose**: Retrieve details of a specific wellbeing alert.
29. **PATCH** `/wellbeing/alerts/{alertId}`
    *   **Purpose**: Update the status or response details of an alert.
30. **GET** `/wellbeing/alert-rules`
    *   **Purpose**: Retrieve the list of configured alert rules.
31. **POST** `/wellbeing/alert-rules`
    *   **Purpose**: Create a new alert rule.
    *   **Payload**: Rule conditions, severity, notification settings.
32. **PATCH** `/wellbeing/alert-rules/{ruleId}`
    *   **Purpose**: Update an existing alert rule.
33. **GET** `/wellbeing/dashboard`
    *   **Purpose**: Get consolidated data for the main Wellbeing dashboard.
34. **GET** `/workers/{workerId}/wellbeing/indicators`
    *   **Purpose**: Get the latest values for wellbeing indicators for a specific worker.
35. **GET** `/wellbeing/assessments/types`
    *   **Purpose**: Get available assessment types (e.g., quick check-in, standard).

---

## M. Marketplace (`/marketplace`)

1.  **GET** `/marketplace/listings`
    *   **Purpose**: Browse available listings (journeys, content). Supports filtering, search, sorting.
2.  **GET** `/marketplace/listings/{listingId}`
    *   **Purpose**: Get details of a specific listing (preview, creator info, license, price, reviews, experiment results).
3.  **POST** `/marketplace/publish` (Expert Org Admin/Content Specialist)
    *   **Purpose**: Submit content or a journey blueprint for listing in the marketplace.
    *   **Payload**: contentId/journeyId, description, preview info, license terms, price.
4.  **GET** `/marketplace/my-listings` (Expert Org)
    *   **Purpose**: List items published by the current expert organization.
5.  **PATCH** `/marketplace/my-listings/{listingId}` (Expert Org)
    *   **Purpose**: Update own marketplace listing.
6.  **DELETE** `/marketplace/my-listings/{listingId}` (Expert Org)
    *   **Purpose**: Allow a publisher to delete their own listing.
7.  **POST** `/marketplace/my-listings/{listingId}/unpublish` (Expert Org)
    *   **Purpose**: Allow a publisher to unpublish/withdraw their listing.
8.  **POST** `/marketplace/listings/{listingId}/acquire` (Client Org Admin/Manager)
    *   **Purpose**: Acquire (license/purchase) a marketplace item.
    *   **Response**: Status, potentially triggers import.
9.  **GET** `/marketplace/acquisitions` (Client Org)
    *   **Purpose**: List items acquired from the marketplace by the current organization.
10. **POST** `/marketplace/acquisitions/{acquisitionId}/import` (Client Org)
    *   **Purpose**: Import acquired content/journey into the organization's library.
11. **GET** `/marketplace/listings/{listingId}/reviews`
    *   **Purpose**: Retrieve reviews for a specific marketplace listing.
12. **POST** `/marketplace/listings/{listingId}/review` (Client Org)
    *   **Purpose**: Submit a review/rating for an acquired item.
    *   **Payload**: Rating, comment.
13. **PATCH** `/marketplace/listings/{listingId}/reviews/{reviewId}`
    *   **Purpose**: Allow a user to update their own review.
14. **POST** `/marketplace/listings/{listingId}/reviews/{reviewId}/respond`
    *   **Purpose**: Allow the publisher of a listing to respond to a review.
    *   **Payload**: `{ responseText: string }`
15. **POST** `/marketplace/reviews/{reviewId}/flag`
    *   **Purpose**: Allow users to flag a review for moderation.
    *   **Payload**: `{ reason: string }`
16. **GET** `/marketplace/categories`
    *   **Purpose**: Retrieve the list of available categories for filtering listings.
17. **GET** `/marketplace/featured`
    *   **Purpose**: Retrieve featured listings for display on the marketplace homepage.
18. **POST** `/marketplace/listings/{listingId}/report`
    *   **Purpose**: Allow users to report a listing for issues (inaccuracy, violation, etc.).
    *   **Payload**: `{ reason: string, details?: string }`

---

## N. Analytics (`/analytics`)

1.  **GET** `/analytics/dashboard`
    *   **Purpose**: Get data for the main analytics dashboard (key metrics overview).
2.  **GET** `/analytics/workers`
    *   **Purpose**: Get data for worker performance analytics dashboard. Requires query params for filters (date range, segment).
3.  **GET** `/analytics/journeys`
    *   **Purpose**: Get data for journey effectiveness analytics dashboard. Filters needed.
4.  **GET** `/analytics/programs`
    *   **Purpose**: Get data for program outcomes analytics dashboard. Filters needed.
5.  **GET** `/analytics/wellbeing`
    *   **Purpose**: Get data for wellbeing trends analytics dashboard. Filters needed.
6.  **GET** `/analytics/experiments`
    *   **Purpose**: Get data for experiment overview analytics dashboard. Filters needed.
7.  **POST** `/analytics/reports/custom`
    *   **Purpose**: Generate a custom report based on provided parameters.
    *   **Payload**: Metrics, dimensions, filters, date range.
    *   **Response**: Report data or link to download.
8.  **GET** `/analytics/reports`
    *   **Purpose**: List previously generated or saved custom reports.
9.  **GET** `/analytics/reports/{reportId}`
    *   **Purpose**: Retrieve a specific custom report definition or results.
10. **PATCH** `/analytics/reports/{reportId}`
    *   **Purpose**: Update a saved custom report definition.
11. **DELETE** `/analytics/reports/{reportId}`
    *   **Purpose**: Delete a saved custom report.

---

## O. Projects & Funders (`/projects`) - NEW DOMAIN

1.  **GET** `/projects`
    *   **Purpose**: List all projects within the organization.
2.  **POST** `/projects`
    *   **Purpose**: Create a new project.
    *   **Payload**: Name, description, goals, associated funder(s), timeframe.
3.  **GET** `/projects/{projectId}`
    *   **Purpose**: Get project details, including linked programs and high-level outcomes.
4.  **PATCH** `/projects/{projectId}`
    *   **Purpose**: Update project details.
5.  **DELETE** `/projects/{projectId}`
    *   **Purpose**: Delete or archive a project.
6.  **GET** `/projects/{projectId}/programs`
    *   **Purpose**: List programs associated with this project.
7.  **POST** `/projects/{projectId}/programs`
    *   **Purpose**: Link existing programs to this project.
    *   **Payload**: Array of `{programId}`.
8.  **DELETE** `/projects/{projectId}/programs/{programId}`
    *   **Purpose**: Unlink a program from a project.
9.  **GET** `/projects/{projectId}/funders`
    *   **Purpose**: List funders associated with this project.
10. **POST** `/projects/{projectId}/funders`
    *   **Purpose**: Link funders to this project.
    *   **Payload**: Array of `{funderId}`.
11. **PATCH** `/projects/{projectId}/funders/{funderId}`
    *   **Purpose**: Update the details of the funding relationship (e.g., amount, status, notes).
12. **DELETE** `/projects/{projectId}/funders/{funderId}`
    *   **Purpose**: Unlink a funder from a project.
13. **GET** `/projects/{projectId}/analytics`
    *   **Purpose**: Get aggregated analytics rolled up to the project level (impact metrics, ROI).
14. **GET** `/projects/{projectId}/evidence`
    *   **Purpose**: List evidence collected for this project (testimonials, media).
15. **POST** `/projects/{projectId}/evidence`
    *   **Purpose**: Upload/link evidence to this project.
    *   **Payload**: Evidence type, data/URL, description, tags.
16. **GET** `/projects/{projectId}/evidence/{evidenceId}`
    *   **Purpose**: Get details of a specific piece of evidence.
17. **PATCH** `/projects/{projectId}/evidence/{evidenceId}`
    *   **Purpose**: Update details of a specific piece of evidence.
18. **DELETE** `/projects/{projectId}/evidence/{evidenceId}`
    *   **Purpose**: Delete a specific piece of evidence.
19. **GET** `/funders`
    *   **Purpose**: List all funders associated with the organization.
20. **POST** `/funders`
    *   **Purpose**: Add a new funder record.
    *   **Payload**: Funder name, contact info, grant details (optional).
21. **GET** `/funders/{funderId}`
    *   **Purpose**: Get details for a specific funder.
22. **PATCH** `/funders/{funderId}`
    *   **Purpose**: Update funder details.
23. **DELETE** `/funders/{funderId}`
    *   **Purpose**: Delete a funder record.
24. **GET** `/projects/{projectId}/reports/donor/{funderId}`
    *   **Purpose**: Generate a report tailored for a specific donor for this project.
25. **GET** `/donors/{funderId}/reports`
    *   **Purpose**: List reports generated for a specific funder.
26. **GET** `/donors/{funderId}/reports/{reportId}`
    *   **Purpose**: Retrieve a specific donor report.
27. **GET** `/projects/{projectId}/analytics`
    *   **Purpose**: Get aggregated analytics rolled up to the project level.
28. **PATCH** `/projects/{projectId}/funders/{funderId}`
    *   **Purpose**: Update the details of a specific project-funder relationship (amount, status, notes).
    *   **Payload**: Fields to update for the relationship.
29. **DELETE** `/projects/{projectId}/funders/{funderId}`
    *   **Purpose**: Unlink a funder from a project.
30. **GET** `/projects/{projectId}/evidence/{evidenceId}`
    *   **Purpose**: Get details of a specific piece of evidence.
31. **PATCH** `/projects/{projectId}/evidence/{evidenceId}`
    *   **Purpose**: Update details of a specific piece of evidence.
32. **DELETE** `/projects/{projectId}/evidence/{evidenceId}`
    *   **Purpose**: Delete a specific piece of evidence.

---

## P. Notifications (`/notifications`)

1.  **GET** `/notifications`
    *   **Purpose**: Get unread notifications for the current user (e.g., new feedback, experiment complete, limit warnings). Supports pagination.
2.  **POST** `/notifications/mark-read`
    *   **Purpose**: Mark specific notifications as read.
    *   **Payload**: Array of `{notificationId}`.
3.  **GET** `/notifications/preferences`
    *   **Purpose**: Get user's notification preferences.
4.  **PATCH** `/notifications/preferences`
    *   **Purpose**: Update user's notification preferences.
5.  **POST** `/notifications/preferences/channels/verify`
    *   **Purpose**: Initiate verification for a notification channel (e.g., send email/SMS code).
    *   **Payload**: `{ channelType: 'email' | 'sms', channelAddress: string }`

---

## Q. Administration (ABCD Platform Admin - potentially separate API scope `/admin/v1`)

1.  **GET** `/admin/organizations`
    *   **Purpose**: List all organizations on the platform. Filters for type, tier, status.
2.  **GET** `/admin/organizations/{orgId}`
    *   **Purpose**: Get details for a specific organization (including usage, limits).
3.  **PATCH** `/admin/organizations/{orgId}/status`
    *   **Purpose**: Activate/deactivate an organization.
4.  **POST** `/admin/organizations/{orgId}/approve-expert`
    *   **Purpose**: Approve a pending Expert Organization registration.
5.  **GET** `/admin/organizations/{orgId}/users`
    *   **Purpose**: List users within a specific organization.
6.  **GET** `/admin/subscriptions/tiers`
    *   **Purpose**: List subscription tier definitions.
7.  **PATCH** `/admin/subscriptions/tiers/{tierId}`
    *   **Purpose**: Update tier definitions (features, limits).
8.  **GET** `/admin/resources/usage/platform`
    *   **Purpose**: Get platform-wide resource usage overview.
9.  **GET** `/admin/marketplace/submissions`
    *   **Purpose**: List marketplace items pending approval.
10. **POST** `/admin/marketplace/submissions/{listingId}/approve`
    *   **Purpose**: Approve a marketplace listing.
11. **POST** `/admin/marketplace/submissions/{listingId}/reject`
    *   **Purpose**: Reject a marketplace listing.
12. **GET** `/admin/settings/platform`
    *   **Purpose**: Get global platform settings.
13. **PATCH** `/admin/settings/platform`
    *   **Purpose**: Update global platform settings.
14. **GET** `/admin/system/health`
    *   **Purpose**: Get system health status overview.
15. **GET** `/admin/approvals/pending`
    *   **Purpose**: Get a consolidated list of items needing admin approval (orgs, marketplace content, etc.) for the dashboard.
16. **GET** `/admin/activity/recent`
    *   **Purpose**: Get a log of recent significant platform-wide admin actions for the dashboard.
17. **GET** `/admin/organizations/{orgId}/subscription`
    *   **Purpose**: Get subscription details for a specific organization (Admin view).
18. **GET** `/admin/organizations/{orgId}/resources`
    *   **Purpose**: Get resource usage/limits for a specific organization (Admin view).
19. **GET** `/admin/organizations/{orgId}/activity`
    *   **Purpose**: Get the activity log for a specific organization (Admin view).
20. **GET** `/admin/organizations/{orgId}/support`
    *   **Purpose**: Get support ticket information related to a specific organization (Admin view).
21. **GET** `/admin/approvals/organizations`
    *   **Purpose**: List organizations pending approval.
22. **POST** `/admin/organizations/{orgId}/approve`
    *   **Purpose**: Approve an organization.
23. **POST** `/admin/organizations/{orgId}/reject`
    *   **Purpose**: Reject an organization with a reason.
    *   **Payload**: `{ reason: string }`
24. **GET** `/admin/approvals/history`
    *   **Purpose**: View the history of approval decisions (e.g., for organizations).
25. **GET** `/admin/settings/announcements`
    *   **Purpose**: List system-wide announcements.
26. **POST** `/admin/settings/announcements`
    *   **Purpose**: Create a new system announcement.
    *   **Payload**: Announcement details (content, target, schedule).
27. **PATCH** `/admin/settings/announcements/{announcementId}`
    *   **Purpose**: Update an existing system announcement.
28. **DELETE** `/admin/settings/announcements/{announcementId}`
    *   **Purpose**: Delete a system announcement.
29. **GET** `/admin/marketplace/listings`
    *   **Purpose**: List and manage all marketplace listings (Admin view).
30. **PATCH** `/admin/marketplace/listings/{listingId}/status`
    *   **Purpose**: Update the status (e.g., suspend, reactivate) of a marketplace listing.
    *   **Payload**: `{ status: string }`
31. **PATCH** `/admin/marketplace/listings/{listingId}/featured`
    *   **Purpose**: Toggle the featured status of a marketplace listing.
    *   **Payload**: `{ isFeatured: boolean }`
32. **DELETE** `/admin/marketplace/listings/{listingId}`
    *   **Purpose**: Remove a marketplace listing.
33. **GET** `/admin/marketplace/settings`
    *   **Purpose**: Get global marketplace configuration settings.
34. **PATCH** `/admin/marketplace/settings`
    *   **Purpose**: Update global marketplace configuration settings.
35. **GET** `/admin/marketplace/categories`
    *   **Purpose**: Get the marketplace category hierarchy.
36. **POST** `/admin/marketplace/categories`
    *   **Purpose**: Create a new marketplace category.
    *   **Payload**: Category details (name, parentId).
37. **PATCH** `/admin/marketplace/categories/{categoryId}`
    *   **Purpose**: Update a marketplace category.
38. **DELETE** `/admin/marketplace/categories/{categoryId}`
    *   **Purpose**: Delete a marketplace category.
39. **GET** `/admin/system/errors`
    *   **Purpose**: List system errors reported across the platform.
40. **GET** `/admin/system/errors/{errorId}`
    *   **Purpose**: Get details of a specific system error.
41. **PATCH** `/admin/system/errors/{errorId}/status`
    *   **Purpose**: Update the status of a system error (e.g., acknowledged, resolved).
    *   **Payload**: `{ status: string, resolutionNotes?: string }`
42. **GET** `/admin/system/performance`
    *   **Purpose**: Analyze detailed performance metrics for platform components.
43. **GET** `/admin/system/performance/{metricGroup}`
    *   **Purpose**: Get performance metrics for a specific group (e.g., database, API).
44. **GET** `/admin/system/maintenance`
    *   **Purpose**: List scheduled platform maintenance events.
45. **POST** `/admin/system/maintenance`
    *   **Purpose**: Schedule a new platform maintenance event.
    *   **Payload**: Maintenance details (schedule, scope, message).
46. **PATCH** `/admin/system/maintenance/{eventId}`
    *   **Purpose**: Update an existing maintenance event.
47. **DELETE** `/admin/system/maintenance/{eventId}`
    *   **Purpose**: Cancel a scheduled maintenance event.
48. **POST** `/admin/system/maintenance/{eventId}/notify`
    *   **Purpose**: Send maintenance notifications to affected users/organizations.

---

## R. Miscellaneous

1.  **GET** `/health`
    *   **Purpose**: Public health check endpoint for monitoring.
2.  **GET** `/config/frontend`
    *   **Purpose**: Provide necessary backend config to the frontend (e.g., feature flags, public keys).

---

This enhanced list provides a much more solid foundation for building the full-featured Behavioral Coaching Platform frontend. Remember that specific payload/response structures, detailed query parameters, and exact route naming conventions will need further refinement during implementation. 