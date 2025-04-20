# Administration & Settings - ABCD Behavioral Coaching Platform

## 1. Introduction

### 1.1 Purpose & Scope

The Administration module of the ABCD Behavioral Coaching Platform provides comprehensive management capabilities for platform administrators, organization administrators, and users with appropriate permissions. This document details the design, implementation, and integration requirements for the administrative features of the platform.

Administration in the ABCD platform serves several critical purposes:

1. **Platform Governance**: Enables ABCD administrators to manage the entire platform ecosystem, including organization approvals, system health, and resource allocation.

2. **Organization Management**: Provides tools for Organization Admins to configure their organization settings, manage users, and monitor subscription usage.

3. **User Self-Service**: Allows individual users to manage their personal settings, notification preferences, and account details.

4. **Cross-Cutting Concerns**: Addresses platform-wide needs such as multi-tenancy implementation, subscription enforcement, and system monitoring that intersect with all other modules.

This document describes the frontend implementation of these administrative features, including UI/UX design, component architecture, state management, and integration with backend APIs. It aligns with the multi-tenant architecture described in the broader platform documentation and follows the established design patterns and development practices.

### 1.2 Admin User Types

The ABCD platform implements a hierarchical administration model with distinct user types, each with specific capabilities and responsibilities:

#### 1.2.1 ABCD Platform Admin

**Role**: Global administrators who manage the entire platform ecosystem.

**Responsibilities**:
- Approving new Client and Expert Organizations
- Managing subscription tiers and global resource limits
- Monitoring platform-wide usage and system health
- Reviewing and approving marketplace content submissions
- Configuring platform-wide settings and feature flags
- Managing support requests and critical issues

**Access Level**: Has complete access to all administrative functions across the platform, including organization data. Can view and modify all settings, but typically accesses client organization data only for support purposes.

**Implementation Note**: This role exists outside the standard multi-tenant model as a system-level administration function.

#### 1.2.2 Organization Admin

**Role**: Administrators responsible for managing a specific Client or Expert Organization.

**Responsibilities**:
- Creating and managing user accounts within their organization
- Assigning appropriate roles and permissions to users
- Managing the organization's subscription and billing information
- Monitoring resource usage against subscription limits
- Configuring organization-specific settings (branding, terminology, defaults)
- For Expert Organizations: managing content publication to the marketplace

**Access Level**: Has full administrative control within their specific organization's boundaries but cannot access data from other organizations due to tenant isolation.

#### 1.2.3 Other Admin Roles

Several specialized roles have limited administrative capabilities focused on specific domains:

**Program Manager**:
- Can configure program-specific settings
- Manages worker assignments and program execution
- Views program-related analytics and performance metrics

**Training Manager**:
- Administers journey blueprints and content collections
- Configures learning-related settings and default behaviors
- Manages content sharing and marketplace integration

**Content Specialist** (Expert Organizations):
- Manages content creation and publication workflows
- Configures content-specific settings and templates
- Submits content for marketplace approval

### 1.3 Key Admin Functions

The administrative module encompasses several key functional areas that enable effective platform governance and organization management:

#### 1.3.1 Organization Management and Approval

- Organization registration workflow and approval process
- Organization profile management (name, logo, contact information)
- Organization type configuration (Client vs Expert Organization)
- Organization status management (active, suspended, pending)
- Custom branding and terminology settings
- Organization deletion or archival process

#### 1.3.2 User Management and Permission Control

- User invitation and registration workflow
- Role assignment and permission management
- User profile management and status control (active, inactive)
- Authentication configuration (password policies, MFA settings)
- User session management and auditing
- Bulk user operations for larger organizations

#### 1.3.3 Subscription and Billing Management

- Subscription tier enrollment and changes
- Payment method management and invoice history
- Usage monitoring against subscription limits
- Temporary resource boost requests and approvals
- Billing forecast and budget planning tools
- Subscription renewal and expiration management

#### 1.3.4 Resource Allocation and Usage Monitoring

- Worker count and segment monitoring
- Message volume tracking (WhatsApp and other channels)
- Storage usage monitoring (media, content, records)
- Processing capacity allocation and usage tracking
- Usage reporting and trend analysis
- Quota management and enforcement

#### 1.3.5 Platform Settings Configuration

- Global platform defaults and behaviors
- Feature flag management for gradual rollout
- System-wide announcements and notifications
- Default content and journey templates
- Integration settings for external services
- Regional and language configurations

#### 1.3.6 Marketplace Content Approval

- Submission review queue management
- Content evaluation against quality guidelines
- Licensing and pricing review
- Approval/rejection workflow with feedback
- Dispute resolution process
- Featured content curation

#### 1.3.7 System Health Monitoring

- Service status monitoring and alerting
- Error rate tracking and analysis
- Performance metrics visualization
- Database health and optimization
- Integration status monitoring
- Security event monitoring and response

### 1.4 Key Design Principles

The administration module follows these core design principles:

1. **Role-Based Access Control**: All administrative functions are protected by a comprehensive RBAC system that enforces appropriate access based on user role.

2. **Multi-Tenant Isolation**: Organization administrators can only access data within their own organization boundary, enforced at both UI and API levels.

3. **Progressive Disclosure**: Administrative interfaces expose functionality progressively based on user role and context, avoiding overwhelming complexity.

4. **Audit Trail**: Administrative actions that modify system state are logged with user attribution, timestamp, and relevant details for accountability.

5. **Responsive Design**: Admin interfaces are fully responsive and functional across desktop and tablet devices, with critical functions available on mobile.

6. **Configuration Over Code**: The system favors configurable behaviors over hard-coded functionality to enable flexibility without code changes.

7. **Validation and Safety**: Critical administrative actions require confirmation and implement safeguards against accidental data loss or security issues.

8. **Consistency**: Administrative interfaces maintain visual and interaction consistency with the rest of the platform while indicating administrative context.

## 2. ABCD Platform Admin Interface

The ABCD Platform Admin interface provides a specialized set of tools and views for platform-level administrators to manage the entire ecosystem. This section details the pages, components, interactions, and technical implementation required for effective platform administration.

### 2.1 Platform Admin Dashboard

The Platform Admin Dashboard serves as the central control point for ABCD administrators, providing a comprehensive overview of platform health, activity, and attention items.

#### 2.1.1 Page Design

**Route**: `/admin`

**Layout**:
- Main layout with specialized admin navigation sidebar
- Header with platform instance identifier and admin user information
- Primary content area with dashboard widgets arranged in a responsive grid

**Key Components**:
- `AdminHeader`: Displays current admin user, environment (production/staging), and quick actions
- `AdminSidebar`: Specialized navigation for platform admin functions
- `AdminDashboardGrid`: Responsive grid layout for dashboard widgets
- Various dashboard widgets (described below)

#### 2.1.2 Dashboard Widgets

1. **Organization Summary Widget**
   - Count of active, pending, and suspended organizations
   - Distribution chart of organization types (Client vs Expert)
   - Quick links to organization management
   - API: `GET /admin/organizations/summary`

2. **Pending Approvals Widget**
   - List of items requiring admin approval:
     - New organization registrations
     - Marketplace submissions
     - Resource extension requests
   - Action buttons for quick approve/reject/view
   - API: `GET /admin/approvals/pending`

3. **System Health Widget**
   - Status indicators for critical services (API, database, integrations)
   - Error rate trend chart (24h)
   - Performance metrics (response times, queue lengths)
   - API: `GET /admin/system/health`

4. **Resource Usage Widget**
   - Platform-wide resource usage visualization
   - Highlighted organizations approaching/exceeding limits
   - Storage, message, and processing usage charts
   - API: `GET /admin/resources/usage/platform`

5. **Recent Activity Widget**
   - Timeline of significant admin actions across the platform
   - New organizations, status changes, critical config updates
   - Filterable by action type and time range
   - API: `GET /admin/activity/recent`

#### 2.1.3 State Management

- Use React Query for fetching dashboard widget data with appropriate refetch intervals
- Implement independent loading states for each widget to prevent full-page blocking
- Store widget configuration preferences in local storage for persistence

#### 2.1.4 Implementation Notes

- Dashboard should auto-refresh critical metrics (e.g., system health) at appropriate intervals
- Provide manual refresh option for all widgets
- Support collapsible/expandable widgets and customizable layouts
- Ensure error states gracefully degrade without breaking the entire dashboard

### 2.2 Organization Management

The Organization Management interface allows platform administrators to view, create, edit, and manage all organizations within the platform.

#### 2.2.1 Organization List Page

**Route**: `/admin/organizations`

**Layout**:
- Admin layout with sidebar and header
- Search and filter controls at the top
- Enhanced data table of organizations
- Pagination and bulk action controls

**Key Components**:
- `OrganizationFilterBar`: Controls for filtering by type, status, subscription tier
- `AdminDataTable`: Enhanced table component with sorting, filtering, pagination
- `OrganizationStatusBadge`: Visual indicator of organization status
- `OrganizationQuickActions`: Dropdown menu for common organization actions

**Data Display**:
- Organization name and ID
- Type (Client/Expert)
- Status (Active/Pending/Suspended)
- Creation date
- Subscription tier
- User count
- Resource usage indicators (visual)
- Action menu

**Actions**:
- View organization details
- Edit organization profile
- Approve pending organization
- Suspend/reactivate organization
- Manage subscription tier
- Impersonate organization admin (for support)

**API Integration**:
- `GET /admin/organizations`: List organizations with filtering, pagination
- `PATCH /admin/organizations/{orgId}/status`: Update organization status
- `GET /admin/organizations/{orgId}/usage`: Get organization resource usage

#### 2.2.2 Organization Detail Page

**Route**: `/admin/organizations/{orgId}`

**Layout**:
- Admin layout with sidebar and header
- Organization header with name, type, status, and key metrics
- Tab navigation for different organization aspects
- Content area for selected tab

**Tabs**:
1. **Profile**: Basic organization information and settings
2. **Users**: Users within this organization and their roles
3. **Subscription**: Tier details, payment history, usage
4. **Resources**: Detailed resource allocation and usage
5. **Activity**: Audit log of significant actions
6. **Support**: Support tickets and admin notes

**Key Components**:
- `OrganizationDetailHeader`: Shows org name, type, status with quick actions
- `AdminTabNav`: Tab navigation with consistent styling
- Tab-specific components for each section
- `AdminActionButton`: Styled button for admin actions with confirmation

**Profile Tab Components**:
- `OrganizationProfileForm`: Editable form for organization details
- `OrganizationStatusControls`: UI for changing organization status with reason
- `OrganizationCustomFields`: Display/edit of custom organization metadata

**Users Tab Components**:
- `OrganizationUserTable`: List of users with roles and status
- `UserInviteForm`: Interface for inviting new users
- `UserRoleEditor`: Controls for changing user roles
- `UserStatusToggle`: Switch for activating/deactivating users

**Subscription Tab Components**:
- `SubscriptionTierDisplay`: Current tier with features and limits
- `SubscriptionTierSelector`: Interface for changing subscription tier
- `PaymentHistoryTable`: Record of past invoices/payments
- `BillingContactForm`: Management of billing contacts

**Resources Tab Components**:
- `ResourceUsageCharts`: Visualizations of resource usage over time
- `ResourceLimitAdjuster`: Admin controls to override standard limits
- `ResourceAllocationTable`: Detailed breakdown of limit allocations
- `ResourceUsageExport`: Controls to export usage data

**API Integration**:
- `GET /admin/organizations/{orgId}`: Get organization details
- `PATCH /admin/organizations/{orgId}`: Update organization details
- `GET /admin/organizations/{orgId}/users`: Get organization users
- `GET /admin/organizations/{orgId}/subscription`: Get subscription details
- `PATCH /admin/organizations/{orgId}/subscription`: Update subscription
- `GET /admin/organizations/{orgId}/resources`: Get resource allocation
- `PATCH /admin/organizations/{orgId}/resources`: Update resource limits
- `GET /admin/organizations/{orgId}/activity`: Get activity log

#### 2.2.3 Organization Creation

**Route**: `/admin/organizations/create`

**Layout**:
- Admin layout with sidebar and header
- Multi-step form with progress indicator
- Action buttons for navigation and submission

**Steps**:
1. **Organization Type**: Selection between Client and Expert organization
2. **Basic Details**: Name, industry, region, description
3. **Admin User**: Details for the initial organization admin
4. **Subscription**: Select initial subscription tier
5. **Resource Allocation**: Configure initial resource limits
6. **Review & Create**: Summary and final creation

**Key Components**:
- `OrganizationTypeSelector`: Visual selection between org types
- `StepProgressIndicator`: Shows current step and navigation
- `OrganizationDetailsForm`: Form for basic organization details
- `AdminUserForm`: Form to create initial admin user
- `SubscriptionSelectionGrid`: Visual tier selection with comparison
- `ResourceAllocationForm`: Controls for setting initial limits
- `CreationSummary`: Review screen with all selections

**State Management**:
- Multi-step form state managed with React Hook Form and Zod validation
- Step navigation with URL params or local state
- Separate validated sections for each step

**API Integration**:
- `POST /admin/organizations`: Create new organization with all details
- `GET /admin/subscriptions/tiers`: Get available subscription tiers
- `GET /admin/resources/templates`: Get default resource allocation templates

#### 2.2.4 Organization Approval Workflow

**Route**: `/admin/approvals/organizations`

**Layout**:
- Admin layout with sidebar and header
- Queue of pending organization approvals
- Detailed review panel for selected organization
- Action buttons for approval decisions

**Key Components**:
- `ApprovalQueue`: List of pending organizations with key details
- `OrganizationReviewPanel`: Detailed view of organization to be approved
- `ExpertOrganizationVerification`: Additional verification for Expert orgs
- `ApprovalDecisionForm`: Form for approval/rejection with reason
- `ApprovalHistoryLog`: Record of previous approval actions

**API Integration**:
- `GET /admin/approvals/organizations`: Get pending organizations
- `POST /admin/organizations/{orgId}/approve`: Approve organization
- `POST /admin/organizations/{orgId}/reject`: Reject organization with reason
- `GET /admin/approvals/history`: Get approval decision history

### 2.3 Subscription Tier Configuration

The Subscription Tier Configuration interface allows platform administrators to define, edit, and manage the subscription tiers available to organizations.

#### 2.3.1 Subscription Tier List

**Route**: `/admin/subscriptions/tiers`

**Layout**:
- Admin layout with sidebar and header
- List of current subscription tiers in card format
- Summary metrics for each tier
- Actions for managing tiers

**Key Components**:
- `SubscriptionTierCard`: Visual card showing tier details
- `TierFeatureList`: List of features included in each tier
- `TierLimitBadges`: Visual indicators of resource limits
- `TierUsageSummary`: Count of organizations using each tier
- `TierQuickActions`: Actions available for each tier

**Data Display**:
- Tier name and ID
- Price point (if applicable)
- Feature availability matrix
- Resource limits summary
- Organization count using this tier
- Active/Inactive status

**Actions**:
- View tier details
- Edit tier configuration
- Create new tier
- Archive/unarchive tier
- View organizations using a tier

**API Integration**:
- `GET /admin/subscriptions/tiers`: List all subscription tiers
- `PATCH /admin/subscriptions/tiers/{tierId}/status`: Update tier status

#### 2.3.2 Subscription Tier Detail/Edit

**Route**: `/admin/subscriptions/tiers/{tierId}`

**Layout**:
- Admin layout with sidebar and header
- Tier header with name and status
- Form sections for different aspects of tier configuration
- Save/cancel actions at bottom

**Form Sections**:
1. **Basic Information**: Name, description, pricing
2. **Feature Enablement**: Toggle switches for features
3. **Resource Limits**: Configuration of various limits
4. **Marketplace Settings**: Marketplace access and commission rates
5. **Support Level**: Available support channels and SLAs

**Key Components**:
- `TierBasicInfoForm`: Form for name, description, etc.
- `FeatureToggleGrid`: Matrix of features with enable/disable toggles
- `ResourceLimitFields`: Numeric inputs for different limit types
- `MarketplaceAccessSettings`: Controls for marketplace permissions
- `SupportLevelConfig`: Configuration for support entitlements

**API Integration**:
- `GET /admin/subscriptions/tiers/{tierId}`: Get tier details
- `PATCH /admin/subscriptions/tiers/{tierId}`: Update tier configuration
- `GET /admin/organizations?tier={tierId}`: Get organizations using tier

#### 2.3.3 Create New Subscription Tier

**Route**: `/admin/subscriptions/tiers/create`

**Layout**:
- Admin layout with sidebar and header
- Similar to edit interface but for new tier creation
- Option to clone from existing tier

**Special Components**:
- `TierTemplateSelector`: Start from scratch or clone existing tier
- `TierAvailabilitySettings`: Controls for when tier is available

**API Integration**:
- `POST /admin/subscriptions/tiers`: Create new subscription tier
- `GET /admin/subscriptions/tiers/{sourceTierId}`: Get source tier for cloning

### 2.4 Platform Settings

The Platform Settings interface provides control over global configuration options that affect the entire platform's behavior.

#### 2.4.1 General Settings

**Route**: `/admin/settings/platform`

**Layout**:
- Admin layout with sidebar and header
- Settings organized in expandable sections
- Save button that becomes active when changes are made

**Settings Sections**:
1. **Platform Identity**: Name, logo, contact information
2. **Default Configurations**: Default language, timezone, locale
3. **Security Settings**: Password policies, session timeouts, IP restrictions
4. **Email Configuration**: Email templates, sender addresses, SMTP settings
5. **Integration Defaults**: Default API keys and configuration for integrations
6. **Legal Documents**: Terms of service, privacy policy, content guidelines

**Key Components**:
- `SettingsSection`: Expandable section with title and save capability
- `SettingField`: Consistent layout for setting label, control, and help text
- `SettingToggle`: Switch control for boolean settings
- `SettingTextInput`: Text input for string settings
- `SettingSelect`: Dropdown for selection settings
- `SettingNumericInput`: Numeric input with validation
- `SettingCodeEditor`: Code editor for template editing

**State Management**:
- Form state with React Hook Form
- Dirty state tracking to enable/disable save button
- Settings grouped by functional area

**API Integration**:
- `GET /admin/settings/platform`: Get all platform settings
- `PATCH /admin/settings/platform`: Update platform settings

#### 2.4.2 Feature Flags

**Route**: `/admin/settings/features`

**Layout**:
- Admin layout with sidebar and header
- List of feature flags with status and description
- Filters for viewing different types of flags

**Key Components**:
- `FeatureFlagList`: Table of all feature flags
- `FeatureFlagToggle`: Switch for enabling/disabling features
- `FeatureFlagDetailPanel`: Expanded view with more controls
- `FeatureFlagFilters`: Filter controls for feature categories

**Feature Flag Controls**:
- Basic on/off toggle
- Percentage rollout slider
- Organization allowlist management
- Scheduled activation/deactivation
- A/B test configuration

**API Integration**:
- `GET /admin/settings/features`: Get all feature flags
- `PATCH /admin/settings/features/{flagId}`: Update feature flag status

#### 2.4.3 System Announcements

**Route**: `/admin/settings/announcements`

**Layout**:
- Admin layout with sidebar and header
- Current and scheduled announcements list
- Announcement creation/edit form

**Key Components**:
- `AnnouncementList`: Table of current and scheduled announcements
- `AnnouncementForm`: Creation/editing form for announcements
- `AnnouncementPreview`: Preview of how announcement will appear
- `AnnouncementTargeting`: Controls for who sees the announcement

**Announcement Settings**:
- Message content (supports basic formatting)
- Severity level (info, warning, critical)
- Start and end dates/times
- Target audience (all users, specific roles, specific organizations)
- Dismissible setting (can users dismiss the notice)

**API Integration**:
- `GET /admin/settings/announcements`: List announcements
- `POST /admin/settings/announcements`: Create announcement
- `PATCH /admin/settings/announcements/{announcementId}`: Update announcement
- `DELETE /admin/settings/announcements/{announcementId}`: Delete announcement

### 2.5 Marketplace Administration

The Marketplace Administration interface enables platform administrators to manage the content marketplace, including approvals, featured content, and marketplace policies.

#### 2.5.1 Submission Queue

**Route**: `/admin/marketplace/submissions`

**Layout**:
- Admin layout with sidebar and header
- Filterable list of pending submissions
- Detailed review panel for selected submission
- Approval/rejection controls

**Key Components**:
- `SubmissionQueue`: Table of pending submissions with filters
- `SubmissionDetail`: Detailed view of selected submission
- `ContentPreview`: Preview of submitted content or journey
- `SubmissionDecisionForm`: Form for approval decision and feedback

**Submission Review Process**:
1. Administrator selects submission from queue
2. System displays comprehensive details about the submission
3. Admin can preview the actual content/journey being submitted
4. Admin can request revisions or approve/reject with comments
5. Decision is logged and submitter is notified

**API Integration**:
- `GET /admin/marketplace/submissions`: List pending submissions
- `GET /admin/marketplace/submissions/{submissionId}`: Get submission details
- `POST /admin/marketplace/submissions/{submissionId}/approve`: Approve submission
- `POST /admin/marketplace/submissions/{submissionId}/reject`: Reject submission
- `POST /admin/marketplace/submissions/{submissionId}/request-changes`: Request changes

#### 2.5.2 Marketplace Management

**Route**: `/admin/marketplace/listings`

**Layout**:
- Admin layout with sidebar and header
- Filterable data table of all marketplace listings
- Sort, search, and filter controls
- Bulk and individual action capabilities

**Key Components**:
- `MarketplaceListingTable`: Enhanced data table of listings
- `ListingStatusBadge`: Visual indicator of listing status
- `ListingMetrics`: Display of key metrics (purchases, ratings)
- `ListingQuickActions`: Action menu for each listing

**Data Display**:
- Content/Journey name
- Publisher organization
- Category and tags
- Publication date
- Status (active, suspended, etc.)
- Review rating average
- Purchase/license count
- Featured status

**Actions**:
- View listing details
- Edit listing metadata
- Suspend/reactivate listing
- Remove listing
- Feature/unfeature listing
- View purchase history

**API Integration**:
- `GET /admin/marketplace/listings`: List all marketplace listings
- `PATCH /admin/marketplace/listings/{listingId}/status`: Update listing status
- `PATCH /admin/marketplace/listings/{listingId}/featured`: Toggle featured status
- `DELETE /admin/marketplace/listings/{listingId}`: Remove listing

#### 2.5.3 Marketplace Configuration

**Route**: `/admin/marketplace/settings`

**Layout**:
- Admin layout with sidebar and header
- Settings form organized in sections
- Save button for committing changes

**Settings Sections**:
1. **General Configuration**: Enable/disable marketplace, visibility settings
2. **Submission Guidelines**: Content review criteria and requirements
3. **Marketplace Categories**: Manage content categories and taxonomy
4. **Commission Rates**: Configure platform fees for marketplace transactions
5. **Featured Content**: Controls for featuring selected content
6. **Review Policies**: Configuration for review display and moderation

**Key Components**:
- `MarketplaceGeneralSettings`: Core marketplace configuration
- `SubmissionGuidelinesEditor`: Rich text editor for guidelines
- `CategoryManager`: Interface for editing category hierarchy
- `CommissionRateForm`: Configuration of fee structure
- `FeaturedContentManager`: Tool for managing featured content slots
- `ReviewPolicySettings`: Configuration of review system

**API Integration**:
- `GET /admin/marketplace/settings`: Get marketplace configuration
- `PATCH /admin/marketplace/settings`: Update marketplace configuration
- `GET /admin/marketplace/categories`: Get category hierarchy
- `POST /admin/marketplace/categories`: Create new category
- `PATCH /admin/marketplace/categories/{categoryId}`: Update category
- `DELETE /admin/marketplace/categories/{categoryId}`: Delete category

### 2.6 System Health Monitoring

The System Health Monitoring interface provides platform administrators with tools to monitor the health, performance, and reliability of the platform.

#### 2.6.1 System Status Dashboard

**Route**: `/admin/system/health`

**Layout**:
- Admin layout with sidebar and header
- Critical status indicators at the top
- Detailed status panels for different system components
- Time range selector for metrics
- Alerting configuration controls

**Key Components**:
- `SystemStatusSummary`: High-level status indicators
- `ServiceStatusPanel`: Status details for each service component
- `MetricsTimeRangeSelector`: Controls for time period display
- `AlertingStatusPanel`: Current alerting configuration
- `MetricsChartGrid`: Layout for multiple metric visualizations

**System Components Monitored**:
1. **API Services**: Availability, response times, error rates
2. **Database**: Connection pool, query performance, replication lag
3. **Message Queue**: Queue lengths, processing rates, failed messages
4. **Storage**: Usage, operation latency, error rates
5. **External Integrations**: WhatsApp, payment gateways, email service
6. **Background Jobs**: Success rates, execution times, job queue health

**API Integration**:
- `GET /admin/system/health`: Get overall system health status
- `GET /admin/system/health/{component}`: Get specific component health
- `GET /admin/system/metrics?component={component}&timeRange={range}`: Get metrics

#### 2.6.2 Error Monitoring

**Route**: `/admin/system/errors`

**Layout**:
- Admin layout with sidebar and header
- Error trend charts at the top
- Filterable table of error occurrences
- Detail panel for selected error

**Key Components**:
- `ErrorTrendChart`: Visualization of error frequency over time
- `ErrorTable`: Filterable list of error occurrences
- `ErrorDetailPanel`: Stack traces and context for selected error
- `ErrorFilters`: Controls for filtering by type, source, severity

**Error Information Displayed**:
- Error type and message
- Timestamp and frequency
- Source component/service
- Affected organization/user (if applicable)
- Stack trace
- Request context (when available)
- Similar errors

**API Integration**:
- `GET /admin/system/errors`: List errors with filtering
- `GET /admin/system/errors/{errorId}`: Get detailed error information
- `PATCH /admin/system/errors/{errorId}/status`: Update error status (acknowledged)

#### 2.6.3 Performance Analytics

**Route**: `/admin/system/performance`

**Layout**:
- Admin layout with sidebar and header
- Performance metric visualization dashboard
- Configurable chart panels
- Time range and aggregation controls

**Key Components**:
- `PerformanceMetricChart`: Visualization component for metrics
- `PerformanceChartGrid`: Layout manager for multiple charts
- `MetricSelector`: Controls for selecting metrics to display
- `AggregationControls`: Selection for time-based aggregation

**Key Metrics**:
- API response times (by endpoint category)
- Database query performance
- Resource usage (CPU, memory, storage, network)
- Request throughput
- Background job execution metrics
- External integration performance

**API Integration**:
- `GET /admin/system/performance`: Get performance metrics
- `GET /admin/system/performance/{metricGroup}`: Get specific metric group
- `GET /admin/system/performance/custom`: Get custom metric selection

#### 2.6.4 Scheduled Maintenance

**Route**: `/admin/system/maintenance`

**Layout**:
- Admin layout with sidebar and header
- List of past and upcoming maintenance events
- Maintenance scheduling form
- Notification preview and configuration

**Key Components**:
- `MaintenanceEventList`: Table of maintenance events
- `MaintenanceScheduler`: Form for scheduling maintenance
- `MaintenanceNotificationPreview`: Preview of user notifications
- `MaintenanceImpactAssessment`: Tool for evaluating impact

**Maintenance Configuration**:
- Scheduled start and end time
- Affected services
- Expected impact level
- Notification message
- Target audience for notifications
- Pre-maintenance and post-maintenance tasks

**API Integration**:
- `GET /admin/system/maintenance`: List maintenance events
- `POST /admin/system/maintenance`: Schedule new maintenance
- `PATCH /admin/system/maintenance/{eventId}`: Update maintenance event
- `DELETE /admin/system/maintenance/{eventId}`: Cancel maintenance event
- `POST /admin/system/maintenance/{eventId}/notify`: Send maintenance notifications

## 3. Organization Admin Interface

The Organization Admin Interface provides the primary administrative controls for organization administrators to manage their specific tenant within the platform. Unlike the ABCD Platform Admin interface, this is scoped to a single organization's data and is accessible to users with the Organization Admin role.

### 3.1 Organization Dashboard

The Organization Dashboard provides organization administrators with a centralized view of key metrics, status information, and actionable insights specific to their organization.

#### 3.1.1 Page Design

**Route**: `/organizations` or `/organizations/dashboard`

**Layout**:
- Main application layout with standard header and sidebar
- Header with organization name and admin badge
- Responsive grid layout for dashboard widgets
- Quick action buttons for common administrative tasks

**Key Components**:
- `OrganizationHeader`: Displays organization name, type, subscription tier
- `OrganizationDashboardGrid`: Responsive widget layout system
- Various dashboard widgets (described below)
- `QuickActionBar`: Row of buttons for frequently used admin actions

#### 3.1.2 Dashboard Widgets

1. **Subscription Status Widget**
   - Current subscription tier with visual indicator
   - Renewal date and status (if applicable)
   - Subscription health indicators (within limits/approaching limits)
   - Quick link to subscription management
   - API: `GET /organizations/me/subscription`

2. **Resource Usage Widget**
   - Visual gauges showing current usage versus limits for key resources:
     - Workers/audience members count
     - Message volume (WhatsApp)
     - Storage utilization
     - Active programs
   - Trend indicators showing usage direction
   - API: `GET /organizations/me/usage`

3. **User Summary Widget**
   - Count of active users by role
   - Recent user additions
   - Pending invitations
   - Quick link to user management
   - API: `GET /users`

4. **Program Status Widget**
   - Count of active, scheduled, and completed programs
   - Programs requiring attention (unusual metrics, feedback)
   - Quick link to program management
   - API: `GET /programs?summary=true`

5. **Recent Activity Widget**
   - Timeline of significant actions within the organization
   - User additions/role changes
   - Program launches/completions
   - Configuration changes
   - API: `GET /organizations/me/activity`

#### 3.1.3 State Management

- Use React Query for fetching dashboard widget data with appropriate caching
- Implement independent loading states for each widget
- Store widget configuration preferences in local storage

#### 3.1.4 Implementation Notes

- Ensure all data is scoped to the current organization (tenant)
- Use responsive design to rearrange widgets appropriately on different screen sizes
- Provide error states for each widget that don't disrupt the entire dashboard
- Include manual refresh capability and show data freshness indicators

### 3.2 User Management

The User Management interface allows organization administrators to create, edit, and manage user accounts within their organization.

#### 3.2.1 User List Page

**Route**: `/organizations/users`

**Layout**:
- Main application layout with standard header and sidebar
- Search and filter controls at the top
- Data table of user accounts
- Action buttons for adding users and bulk operations

**Key Components**:
- `UserSearchFilter`: Search field and role/status filters
- `UserTable`: Enhanced data table with sorting and pagination
- `UserStatusBadge`: Visual indicator of user status
- `UserRoleBadge`: Visual indicator of user role
- `UserActionsMenu`: Dropdown for per-user actions

**Data Display**:
- User name and email
- Role (Organization Admin, Program Manager, etc.)
- Status (Active, Pending, Inactive)
- Last login date
- Creation date
- Action menu

**Actions**:
- View user details
- Edit user role or profile
- Deactivate/reactivate user
- Resend invitation
- Reset password (trigger email)

**API Integration**:
- `GET /users`: List users with filtering and pagination
- `PATCH /users/{userId}`: Update user status or role
- `POST /users/{userId}/resend-invite`: Resend invitation email
- `POST /users/{userId}/reset-password`: Trigger password reset email

#### 3.2.2 User Creation / Invitation

**Route**: `/organizations/users/invite`

**Layout**:
- Main application layout with standard header and sidebar
- Single or batch invitation form
- Role selection interface
- Custom message field
- Submit and cancel buttons

**Key Components**:
- `UserInviteForm`: Form for inviting new users
- `RoleSelector`: Interface for selecting user role with descriptions
- `BatchEmailInput`: Special input for entering multiple email addresses
- `InvitationMessageEditor`: Template-based editor for invitation message

**Invitation Process**:
1. Admin enters one or more email addresses
2. Admin selects role for the new user(s)
3. Optional: Admin customizes invitation message
4. System sends invitation emails with registration links
5. Recipients click link and complete registration

**API Integration**:
- `POST /users`: Create/invite new user(s)
- `GET /users/roles`: Get available roles and descriptions

#### 3.2.3 User Detail / Edit Page

**Route**: `/organizations/users/{userId}`

**Layout**:
- Main application layout with standard header and sidebar
- User header with name, email, and status
- Tabbed interface for different user aspects
- Edit forms or displays based on selected tab

**Tabs**:
1. **Profile**: Basic user information
2. **Permissions**: Role and specific permissions
3. **Activity**: Log of user's significant actions
4. **Sessions**: Active/recent login sessions

**Key Components**:
- `UserDetailHeader`: Shows user name, email, status with actions
- `UserTabNavigation`: Tab navigation for user details
- `UserProfileForm`: Edit form for user profile
- `UserRoleSelector`: Interface for changing user role
- `UserPermissionsDisplay`: View of permissions based on role
- `UserActivityLog`: Timeline of user's activities
- `UserSessionsTable`: List of user's login sessions with details

**API Integration**:
- `GET /users/{userId}`: Get detailed user information
- `PATCH /users/{userId}`: Update user details
- `GET /users/{userId}/activity`: Get user activity log
- `GET /users/{userId}/sessions`: Get user session information
- `DELETE /users/{userId}/sessions/{sessionId}`: Terminate a specific session

### 3.3 Subscription Management

The Subscription Management interface enables organization administrators to view, modify, and manage their organization's subscription to the platform.

#### 3.3.1 Subscription Overview Page

**Route**: `/organizations/billing`

**Layout**:
- Main application layout with standard header and sidebar
- Current subscription summary at the top
- Subscription details and features
- Payment information section
- Usage summary with alerts
- Billing history section

**Key Components**:
- `SubscriptionSummaryCard`: Shows current tier, status, renewal
- `SubscriptionFeaturesList`: Lists features included in current tier
- `PaymentMethodDisplay`: Shows current payment method information
- `SubscriptionActionButtons`: Upgrade, downgrade, cancel buttons
- `UsageSummaryPanel`: Overview of usage relative to subscription limits
- `BillingHistoryTable`: Table of past invoices and payments

**Data Display**:
- Current subscription tier and status
- Renewal date (if applicable)
- Monthly/annual cost
- Included features list
- Current payment method
- Recent invoices and payment status

**Actions**:
- View detailed usage
- Change subscription tier
- Update payment method
- Download invoices
- Contact billing support

**API Integration**:
- `GET /organizations/me/subscription`: Get subscription details
- `GET /organizations/me/billing/methods`: Get payment methods
- `GET /organizations/me/billing/history`: Get billing/invoice history

#### 3.3.2 Subscription Change Page

**Route**: `/organizations/billing/change`

**Layout**:
- Main application layout with standard header and sidebar
- Current subscription reminder at top
- Comparison table of available tiers
- Selection controls for desired tier
- Confirmation section with cost difference
- Submit and cancel buttons

**Key Components**:
- `CurrentSubscriptionBanner`: Reminder of current tier and cost
- `SubscriptionTierComparisonTable`: Side-by-side comparison of tiers
- `TierSelectionCards`: Visual selection of desired tier
- `SubscriptionChangeSummary`: Summary of changes and cost implications
- `EffectiveDateSelector`: Controls for when change takes effect

**Change Process Flow**:
1. Admin views side-by-side comparison of available tiers
2. Admin selects desired new tier
3. System shows cost difference and effective date options
4. Admin confirms change
5. System processes subscription change

**Special Cases**:
- Upgrade: Immediate access to new tier, prorated billing
- Downgrade: Scheduled for end of current billing period
- Within trial: Transition from trial to paid subscription

**API Integration**:
- `GET /organizations/me/subscription/options`: Get available tier options
- `POST /organizations/me/subscription/upgrade`: Upgrade subscription
- `POST /organizations/me/subscription/downgrade`: Schedule downgrade

#### 3.3.3 Payment Methods Management

**Route**: `/organizations/billing/methods`

**Layout**:
- Main application layout with standard header and sidebar
- List of saved payment methods
- Default payment method indicator
- Add new payment method form
- Action buttons for each payment method

**Key Components**:
- `PaymentMethodList`: List of saved payment methods
- `PaymentMethodCard`: Visual display of payment method details
- `DefaultPaymentBadge`: Indicator for default payment method
- `AddPaymentMethodForm`: Secure form for adding new payment method
- `PaymentMethodActions`: Actions for each payment method

**Payment Method Operations**:
- Add new payment method
- Set default payment method
- Remove payment method
- Update payment method details

**API Integration**:
- `GET /organizations/me/billing/methods`: List payment methods
- `POST /organizations/me/billing/methods`: Add new payment method
- `PATCH /organizations/me/billing/methods/{methodId}`: Update method (e.g., set default)
- `DELETE /organizations/me/billing/methods/{methodId}`: Remove payment method

#### 3.3.4 Billing History Page

**Route**: `/organizations/billing/history`

**Layout**:
- Main application layout with standard header and sidebar
- Date range filter controls
- Sortable table of invoices and payments
- Download/export controls
- Detail view for selected invoice

**Key Components**:
- `DateRangeFilter`: Controls for filtering billing history by date
- `BillingHistoryTable`: Enhanced table of billing events
- `InvoiceStatusBadge`: Visual indicator of invoice status
- `InvoiceDetailPanel`: Expanded view of selected invoice
- `InvoiceDownloadButton`: Control for downloading invoice PDF

**Data Display**:
- Invoice/transaction ID
- Date
- Amount
- Status (Paid, Pending, Failed, etc.)
- Description
- Payment method used
- Actions (view, download)

**API Integration**:
- `GET /organizations/me/billing/history`: Get billing history with filters
- `GET /organizations/me/billing/history/{invoiceId}`: Get detailed invoice information
- `GET /organizations/me/billing/history/{invoiceId}/pdf`: Download invoice PDF

### 3.4 Organization Settings

The Organization Settings interface allows organization administrators to configure organization-wide settings that affect behavior, appearance, and defaults.

#### 3.4.1 General Settings Page

**Route**: `/organizations/settings`

**Layout**:
- Main application layout with standard header and sidebar
- Settings form organized in collapsible sections
- Save button that activates when changes are made
- Status messages for save operations

**Settings Sections**:
1. **Organization Profile**: Name, description, logo, contact information
2. **Regional Settings**: Timezone, date/time format, primary language
3. **Default Behaviors**: Default visibility, sharing, and privacy settings
4. **Custom Terminology**: Customizable terms for key platform concepts
5. **Feature Toggles**: Organization-level feature enable/disable

**Key Components**:
- `SettingSection`: Collapsible section with title and help text
- `SettingField`: Consistent layout for setting label, control, and description
- `OrganizationLogoUploader`: Interface for uploading/cropping organization logo
- `TerminologyCustomizer`: Interface for customizing platform terminology
- `FeatureToggleGrid`: UI for enabling/disabling available features

**State Management**:
- Form state with React Hook Form
- Dirty state tracking to enable/disable save button
- Settings grouped by section with validation

**API Integration**:
- `GET /organizations/me`: Get organization profile and settings
- `PATCH /organizations/me`: Update organization profile
- `GET /organizations/me/settings`: Get detailed organization settings
- `PATCH /organizations/me/settings`: Update organization settings

#### 3.4.2 Branding Settings Page

**Route**: `/organizations/settings/branding`

**Layout**:
- Main application layout with standard header and sidebar
- Visual preview panel showing branding application
- Branding configuration form
- Color picker and font selector tools
- Save and reset buttons

**Key Components**:
- `BrandingPreview`: Live preview of branding applied to UI elements
- `ColorPaletteSelector`: Interface for selecting/customizing colors
- `PrimaryColorPicker`: Color picker for primary brand color
- `SecondaryColorPicker`: Color picker for secondary brand color
- `FontFamilySelector`: Selection tool for permitted font families
- `BrandingResetButton`: Reset to default/theme defaults

**Branding Configuration Options**:
- Primary color (with accessible contrast checking)
- Secondary color
- Accent colors
- Font selections (from approved list)
- Button styles
- Logo placement options
- Email template appearance

**API Integration**:
- `GET /organizations/me/branding`: Get organization branding settings
- `PATCH /organizations/me/branding`: Update organization branding
- `POST /organizations/me/branding/reset`: Reset branding to defaults

#### 3.4.3 Integration Settings Page

**Route**: `/organizations/settings/integrations`

**Layout**:
- Main application layout with standard header and sidebar
- List of available integrations with status indicators
- Configuration panels for each integration
- Test connection controls
- Auth/key management security practices

**Key Components**:
- `IntegrationsList`: List of available integrations with status
- `IntegrationCard`: Card showing integration details and status
- `IntegrationConfigForm`: Configuration form for specific integration
- `ApiKeyManager`: Secure interface for API key management
- `ConnectionTestButton`: Control to test integration connection
- `OAuthConnector`: Flow for OAuth-based integrations

**Typical Integrations**:
- WhatsApp Business API configuration
- SMS gateway settings
- Email service provider connection
- Analytics/tracking integrations
- CRM/ERP connections
- Custom webhook configurations

**API Integration**:
- `GET /organizations/me/integrations`: List available/configured integrations
- `GET /organizations/me/integrations/{integrationType}`: Get specific integration config
- `PATCH /organizations/me/integrations/{integrationType}`: Update integration config
- `POST /organizations/me/integrations/{integrationType}/test`: Test integration connection
- `DELETE /organizations/me/integrations/{integrationType}`: Remove integration

#### 3.4.4 Organization Users & Permissions Page

**Route**: `/organizations/settings/permissions`

**Layout**:
- Main application layout with standard header and sidebar
- Role definitions and configuration
- Permission matrix view
- Import/export capabilities
- Custom role creation (if supported by subscription tier)

**Key Components**:
- `RoleDefinitionList`: List of roles with descriptions
- `PermissionMatrixGrid`: Visual matrix of permissions by role
- `CustomRoleBuilder`: Interface for creating custom roles
- `PermissionGroupAccordion`: Expandable groups of related permissions
- `RoleTemplateSelector`: Starter templates for custom roles

**Permission Configuration**:
- View/edit permission settings by role
- Create custom roles based on templates
- Define role hierarchy and inheritance
- Configure resource-specific permissions

**API Integration**:
- `GET /organizations/me/roles`: Get organization role definitions
- `PATCH /organizations/me/roles/{roleId}`: Update role definition
- `POST /organizations/me/roles`: Create custom role
- `DELETE /organizations/me/roles/{roleId}`: Delete custom role
- `GET /organizations/me/permissions`: Get permission matrix

### 3.5 Resource Usage Monitoring

The Resource Usage Monitoring interface provides organization administrators with visibility into their resource consumption relative to subscription limits.

#### 3.5.1 Usage Overview Page

**Route**: `/organizations/usage`

**Layout**:
- Main application layout with standard header and sidebar
- Time period selector at the top
- Summary cards for key resources
- Usage trend charts
- Alert indicators for resources near limits
- Detailed breakdown tables

**Key Components**:
- `TimePeriodSelector`: Controls for selecting analysis period
- `ResourceSummaryCard`: Card showing current usage, limit, and trend
- `UsageTrendChart`: Line chart showing usage over time
- `ResourceAlertBadge`: Visual indicator of usage level (normal, warning, critical)
- `CategoryUsageTable`: Detailed breakdown of usage by category

**Key Resources Monitored**:
1. **Workers / Audience Members**:
   - Total active workers
   - Workers by segment
   - Worker creation trend

2. **Messaging Volume**:
   - WhatsApp message count
   - Message types (text, media, interactive)
   - Messages by program

3. **Storage Usage**:
   - Total storage used
   - Media storage (images, videos, audio)
   - Content storage
   - Database storage

4. **Processing Resources**:
   - API request volume
   - Background job execution
   - Analysis/report generation usage

**API Integration**:
- `GET /organizations/me/usage`: Get usage summary
- `GET /organizations/me/usage/{resourceType}`: Get specific resource usage
- `GET /organizations/me/usage/{resourceType}/trend`: Get usage trend data
- `GET /organizations/me/usage/{resourceType}/breakdown`: Get detailed usage breakdown

#### 3.5.2 Usage Forecast Page

**Route**: `/organizations/usage/forecast`

**Layout**:
- Main application layout with standard header and sidebar
- Current usage summary
- Forecast visualizations
- Projection controls
- Limit threshold indicators
- Upgrade recommendations

**Key Components**:
- `CurrentUsageSummary`: Overview of current usage metrics
- `ForecastChart`: Projection chart showing expected usage trend
- `ProjectionControls`: Interface for adjusting forecast variables
- `LimitThresholdMarker`: Visual indicators for approaching limits
- `TierRecommender`: Suggestions for appropriate subscription tiers

**Forecast Features**:
- Usage projections based on current growth rates
- What-if scenarios for planned program launches
- Limit breach predictions with dates
- Cost implications of current trajectory
- Recommended actions to manage resource usage

**API Integration**:
- `GET /organizations/me/usage/forecast`: Get usage forecast data
- `POST /organizations/me/usage/forecast/simulate`: Run custom forecast simulation
- `GET /organizations/me/recommendations`: Get tier/usage recommendations

#### 3.5.3 Resource Allocation Page

**Route**: `/organizations/usage/allocation`

**Layout**:
- Main application layout with standard header and sidebar
- Allocation overview at the top
- Resource allocation by program/feature
- Allocation adjustment interface
- Historical allocation changes

**Key Components**:
- `AllocationOverview`: Summary of current resource allocation
- `ProgramAllocationTable`: Breakdown of allocations by program
- `AllocationAdjuster`: Interface for redistributing allocations
- `AllocationHistoryLog`: Record of allocation changes
- `ReservedPoolIndicator`: Display of unallocated/reserved resources

**Allocation Management Features**:
- View resource allocation across programs
- Redistribute resources between programs
- Reserve resources for future programs
- Set allocation warnings and notifications
- Track historical allocation changes

**API Integration**:
- `GET /organizations/me/allocations`: Get resource allocation data
- `PATCH /organizations/me/allocations`: Update resource allocations
- `GET /organizations/me/allocations/history`: Get allocation change history

#### 3.5.4 Usage Alerts Configuration

**Route**: `/organizations/usage/alerts`

**Layout**:
- Main application layout with standard header and sidebar
- Current alerts summary
- Alert configuration form
- Notification recipients management
- Test alert controls

**Key Components**:
- `AlertSummary`: Overview of configured alerts
- `AlertConfigurationForm`: Interface for setting up alerts
- `ThresholdSelector`: Controls for setting alert thresholds
- `NotificationMethodSelector`: Options for alert delivery (email, in-app, etc.)
- `RecipientManager`: Interface for managing alert recipients
- `TestAlertButton`: Control to send test alerts

**Alert Configuration Options**:
- Resource-specific threshold levels (percentage of limit)
- Alert severity levels
- Notification channels (email, in-app, webhook)
- Recipient selection (roles, specific users)
- Alert frequency and cooldown periods
- Automated action triggers (optional)

**API Integration**:
- `GET /organizations/me/usage/alerts`: Get alert configurations
- `POST /organizations/me/usage/alerts`: Create new alert
- `PATCH /organizations/me/usage/alerts/{alertId}`: Update alert configuration
- `DELETE /organizations/me/usage/alerts/{alertId}`: Delete alert
- `POST /organizations/me/usage/alerts/{alertId}/test`: Send test alert

## 4. User Settings Interface

The User Settings Interface provides individual users with the ability to manage their personal account settings, preferences, and configurations regardless of their role within the platform. This section covers the implementation of user-level settings pages accessible to all authenticated users.

### 4.1 Account Settings

The Account Settings page allows users to manage their personal profile information, authentication details, and account security.

#### 4.1.1 Page Design

**Route**: `/settings/account`

**Layout**:
- Main application layout with standard header and sidebar
- Personal details section
- Authentication section
- Account security section
- Connected accounts section (if applicable)
- Delete account section (if applicable)

**Key Components**:
- `PersonalDetailsForm`: Form for editing name, email, profile photo
- `PasswordChangeForm`: Form for changing password with validation
- `TwoFactorAuthToggle`: Controls for enabling/disabling 2FA
- `TwoFactorSetupFlow`: Wizard for setting up two-factor authentication
- `ConnectedAccountsList`: List of third-party connected accounts
- `SessionsList`: List of active login sessions
- `AccountDeleteConfirmation`: Confirmation flow for account deletion

#### 4.1.2 Personal Details Management

**Key Fields**:
- Full name
- Email address (may require verification flow for changes)
- Profile photo
- Job title/role description
- Contact information
- Language preference

**Implementation Notes**:
- Email changes should require verification before taking effect
- Profile photo should support upload, cropping, and removal
- Form should validate input and show appropriate error messages
- Changes should be autosaved or have explicit save button

**API Integration**:
- `GET /auth/me`: Get current user profile
- `PATCH /auth/me`: Update user profile
- `POST /auth/me/email`: Initiate email change process
- `POST /auth/me/avatar`: Upload profile photo

#### 4.1.3 Password & Security

**Security Features**:
- Password change with current password verification
- Two-factor authentication setup/management
- Recovery codes generation and management
- Active sessions viewing and termination
- Account activity log review

**Implementation Notes**:
- Password strength meter should provide guidance
- Two-factor authentication setup should include clear instructions
- Recovery codes should be clearly presented for user to save
- Session list should show device, location, and time information

**API Integration**:
- `POST /auth/me/password`: Change password
- `GET /auth/me/2fa/status`: Check 2FA status
- `POST /auth/me/2fa/enable`: Enable two-factor authentication
- `POST /auth/me/2fa/disable`: Disable two-factor authentication
- `GET /auth/me/2fa/recovery-codes`: Get recovery codes
- `POST /auth/me/2fa/recovery-codes/regenerate`: Regenerate recovery codes
- `GET /auth/me/sessions`: Get active sessions
- `DELETE /auth/me/sessions/{sessionId}`: Terminate a specific session
- `DELETE /auth/me/sessions`: Terminate all other sessions

#### 4.1.4 Connected Accounts

**If the platform supports third-party authentication or integrations, this section allows users to manage those connections.**

**Features**:
- View connected third-party accounts (Google, Microsoft, etc.)
- Add new connected accounts
- Remove connected accounts
- Set primary login method

**Implementation Notes**:
- Show clear status of each connection
- Provide easy way to add/remove connections
- Warn users about implications of removing connections

**API Integration**:
- `GET /auth/me/connections`: Get connected accounts
- `POST /auth/me/connections/{provider}`: Add new connection
- `DELETE /auth/me/connections/{provider}`: Remove connection
- `PATCH /auth/me/connections/{provider}/primary`: Set as primary

### 4.2 Notification Preferences

The Notification Preferences page allows users to control when and how they receive notifications from the platform.

#### 4.2.1 Page Design

**Route**: `/settings/notifications`

**Layout**:
- Main application layout with standard header and sidebar
- Notification channels section (email, in-app, mobile push)
- Notification categories section with toggle controls
- Delivery schedule/quiet hours section
- Digest settings section

**Key Components**:
- `NotificationChannelToggles`: Controls for enabling/disabling notification channels
- `NotificationCategoryAccordion`: Expandable sections for notification categories
- `NotificationToggleGrid`: Matrix of notification types and channels
- `QuietHoursSelector`: Time range selector for notification quiet hours
- `DigestFrequencySelector`: Controls for notification digest frequency

#### 4.2.2 Notification Channels

**Channel Options**:
- In-app notifications
- Email notifications
- Mobile push notifications (if mobile app exists)
- SMS notifications (for critical alerts, if applicable)

**Implementation Notes**:
- Each channel should have master enable/disable toggle
- Show verification status for channels requiring verification (email, phone)
- Provide way to update/verify channel destinations (email address, phone number)

**API Integration**:
- `GET /notifications/preferences/channels`: Get notification channel settings
- `PATCH /notifications/preferences/channels`: Update notification channel settings
- `POST /notifications/preferences/channels/verify`: Send verification message to channel

#### 4.2.3 Notification Categories

**Typical Categories**:
- Account & Security (password changes, login alerts)
- Activity & Mentions (mentions, comments, shares)
- System Updates (maintenance, new features)
- Program Events (program starts, completions, issues)
- Worker Feedback (help requests, critical responses)
- Content Updates (new content, updates to existing content)
- Administrative Alerts (approvals, resource limits)

**Implementation Notes**:
- Categories should be organized logically and clearly labeled
- Each category should have description explaining types of notifications
- Categories should be expandable to show fine-grained control
- Critical security notifications should be marked as non-optional

**API Integration**:
- `GET /notifications/preferences/categories`: Get notification category settings
- `PATCH /notifications/preferences/categories`: Update category settings
- `GET /notifications/preferences/categories/{categoryId}`: Get specific category settings
- `PATCH /notifications/preferences/categories/{categoryId}`: Update specific category

#### 4.2.4 Delivery Schedule

**Schedule Features**:
- Quiet hours specification (do not disturb times)
- Workday/weekend differentiation
- Time zone consideration
- Notification bundling options
- Digest frequency (daily, weekly, real-time)

**Implementation Notes**:
- Time selectors should respect user's time zone
- Show clear indication of current time and time zone
- Explain that critical notifications may override quiet hours
- Preview how bundled/digest notifications will appear

**API Integration**:
- `GET /notifications/preferences/schedule`: Get delivery schedule settings
- `PATCH /notifications/preferences/schedule`: Update delivery schedule
- `GET /notifications/preferences/digest`: Get digest settings
- `PATCH /notifications/preferences/digest`: Update digest settings

### 4.3 Interface Preferences

The Interface Preferences page allows users to customize aspects of the user interface to suit their preferences.

#### 4.3.1 Page Design

**Route**: `/settings/interface`

**Layout**:
- Main application layout with standard header and sidebar
- Theme selection section
- Layout preferences section
- Accessibility settings section
- Display preferences section
- Default view settings section

**Key Components**:
- `ThemeSelector`: Controls for selecting UI theme (light, dark, system)
- `DensitySelector`: Controls for UI density (compact, comfortable, spacious)
- `ColorBlindModeToggle`: Toggle for color blind assistance mode
- `FontSizeControls`: Adjustments for base font size
- `MotionReducerToggle`: Toggle to reduce UI animations
- `DefaultViewSelector`: Controls for default landing pages and views

#### 4.3.2 Theme Preferences

**Theme Options**:
- Light theme
- Dark theme
- System preference-based
- High contrast (accessibility)

**Implementation Notes**:
- Show visual preview of each theme option
- Apply theme changes immediately for preview
- Save preference to user settings
- Implement with CSS variables and/or Tailwind themes

**API Integration**:
- `GET /settings/interface/theme`: Get theme settings
- `PATCH /settings/interface/theme`: Update theme settings

#### 4.3.3 Layout Preferences

**Layout Options**:
- Density controls (compact, comfortable, spacious)
- Sidebar width/collapsed state
- Card vs. list view preferences for supported views
- Table row count preferences

**Implementation Notes**:
- Show visual examples of density options
- Apply changes immediately for preview
- Consider device/screen size in applying preferences
- Save preferences to user settings

**API Integration**:
- `GET /settings/interface/layout`: Get layout preferences
- `PATCH /settings/interface/layout`: Update layout preferences

#### 4.3.4 Accessibility Settings

**Accessibility Options**:
- Font size adjustment
- Motion reduction (reduced animations)
- Color blind mode
- Screen reader optimization
- Keyboard navigation enhancements

**Implementation Notes**:
- Ensure accessibility options are themselves accessible
- Provide clear descriptions of what each option changes
- Apply changes immediately for preview
- Consider using system settings as defaults

**API Integration**:
- `GET /settings/interface/accessibility`: Get accessibility settings
- `PATCH /settings/interface/accessibility`: Update accessibility settings

#### 4.3.5 Default View Settings

**Default Options**:
- Landing page after login
- Default sorting options for lists
- Default filters for data views
- Default layout for dashboards
- Module-specific default views

**Implementation Notes**:
- Show preview of selections where possible
- Group by functional area of the application
- Provide reset to default option
- Consider role-based defaults

**API Integration**:
- `GET /settings/interface/defaults`: Get default view settings
- `PATCH /settings/interface/defaults`: Update default settings
- `POST /settings/interface/defaults/reset`: Reset to system defaults

## 5. API Integration

This section details the API integration points necessary for implementing the administrative features of the platform. It covers the endpoints, request/response patterns, and usage examples for interactions with the backend services.

### 5.1 Admin API Endpoints

These endpoints are restricted to users with ABCD Platform Admin role and provide platform-wide administrative capabilities.

#### 5.1.1 Organizations Management

**List Organizations**

```typescript
// Get list of organizations with filtering and pagination
const fetchOrganizations = async (filters?: OrganizationFilters, page = 1, limit = 20) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filters?.type && { type: filters.type }),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.tier && { tier: filters.tier }),
    ...(filters?.search && { search: filters.search })
  });
  
  return api.get(`/admin/organizations?${queryParams}`);
};
```

**Example response:**
```json
{
  "data": [
    {
      "id": "org-123",
      "name": "Sample NGO",
      "type": "client",
      "status": "active",
      "subscription_tier": "standard",
      "created_at": "2023-01-15T13:45:30Z",
      "user_count": 12,
      "resource_usage": {
        "workers": { "used": 450, "limit": 500 },
        "storage": { "used": 2.4, "limit": 5, "unit": "GB" },
        "messages": { "used": 8500, "limit": 10000 }
      }
    },
    // More organizations...
  ],
  "pagination": {
    "total": 143,
    "pages": 8,
    "current_page": 1,
    "per_page": 20
  }
}
```

**Get Organization Details**

```typescript
// Get detailed information about a specific organization
const fetchOrganizationDetails = async (organizationId: string) => {
  return api.get(`/admin/organizations/${organizationId}`);
};
```

**Update Organization Status**

```typescript
// Update organization status (active, suspended, etc.)
const updateOrganizationStatus = async (
  organizationId: string, 
  status: OrganizationStatus,
  reason?: string
) => {
  return api.patch(`/admin/organizations/${organizationId}/status`, {
    status,
    reason
  });
};
```

**Get Organization Resource Usage**

```typescript
// Get detailed resource usage metrics for an organization
const fetchOrganizationUsage = async (
  organizationId: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month'
) => {
  return api.get(`/admin/organizations/${organizationId}/usage?timeRange=${timeRange}`);
};
```

#### 5.1.2 Subscription Management

**List Subscription Tiers**

```typescript
// Get list of all available subscription tiers
const fetchSubscriptionTiers = async (includeArchived = false) => {
  return api.get(`/admin/subscriptions/tiers?includeArchived=${includeArchived}`);
};
```

**Get Subscription Tier Details**

```typescript
// Get detailed information about a specific tier
const fetchTierDetails = async (tierId: string) => {
  return api.get(`/admin/subscriptions/tiers/${tierId}`);
};
```

**Update Subscription Tier**

```typescript
// Update subscription tier configuration
const updateSubscriptionTier = async (tierId: string, tierData: SubscriptionTierUpdateData) => {
  return api.patch(`/admin/subscriptions/tiers/${tierId}`, tierData);
};
```

**Create Subscription Tier**

```typescript
// Create a new subscription tier
const createSubscriptionTier = async (tierData: SubscriptionTierCreateData) => {
  return api.post(`/admin/subscriptions/tiers`, tierData);
};
```

#### 5.1.3 Platform Settings

**Get Platform Settings**

```typescript
// Get global platform settings
const fetchPlatformSettings = async () => {
  return api.get(`/admin/settings/platform`);
};
```

**Update Platform Settings**

```typescript
// Update global platform settings
const updatePlatformSettings = async (settings: PlatformSettingsData) => {
  return api.patch(`/admin/settings/platform`, settings);
};
```

**Get Feature Flags**

```typescript
// Get all feature flags with their statuses
const fetchFeatureFlags = async () => {
  return api.get(`/admin/settings/features`);
};
```

**Update Feature Flag**

```typescript
// Update a specific feature flag
const updateFeatureFlag = async (flagId: string, flagData: FeatureFlagData) => {
  return api.patch(`/admin/settings/features/${flagId}`, flagData);
};
```

#### 5.1.4 System Health

**Get System Health Status**

```typescript
// Get overall system health status
const fetchSystemHealth = async () => {
  return api.get(`/admin/system/health`);
};
```

**Get Component Health**

```typescript
// Get health status for a specific system component
const fetchComponentHealth = async (component: SystemComponent) => {
  return api.get(`/admin/system/health/${component}`);
};
```

**Get System Metrics**

```typescript
// Get system performance metrics
const fetchSystemMetrics = async (
  component: SystemComponent,
  timeRange: 'hour' | 'day' | 'week' = 'day',
  metrics: string[] = []
) => {
  const queryParams = new URLSearchParams({
    component,
    timeRange,
    ...(metrics.length > 0 && { metrics: metrics.join(',') })
  });
  
  return api.get(`/admin/system/metrics?${queryParams}`);
};
```

#### 5.1.5 Marketplace Administration

**Get Pending Submissions**

```typescript
// Get list of marketplace submissions pending review
const fetchPendingSubmissions = async (page = 1, limit = 20) => {
  return api.get(`/admin/marketplace/submissions?page=${page}&limit=${limit}`);
};
```

**Get Submission Details**

```typescript
// Get detailed information about a specific submission
const fetchSubmissionDetails = async (submissionId: string) => {
  return api.get(`/admin/marketplace/submissions/${submissionId}`);
};
```

**Approve Submission**

```typescript
// Approve a marketplace submission
const approveSubmission = async (submissionId: string, feedback?: string) => {
  return api.post(`/admin/marketplace/submissions/${submissionId}/approve`, { feedback });
};
```

**Reject Submission**

```typescript
// Reject a marketplace submission
const rejectSubmission = async (submissionId: string, reason: string) => {
  return api.post(`/admin/marketplace/submissions/${submissionId}/reject`, { reason });
};
```

### 5.2 Organization API Endpoints

These endpoints are accessible to Organization Administrators to manage their own organization and are scoped to the authenticated user's organization context.

#### 5.2.1 Organization Management

**Get Organization Profile**

```typescript
// Get current organization profile
const fetchOrganizationProfile = async () => {
  return api.get(`/organizations/me`);
};
```

**Update Organization Profile**

```typescript
// Update organization profile information
const updateOrganizationProfile = async (profileData: OrganizationProfileData) => {
  return api.patch(`/organizations/me`, profileData);
};
```

**Get Organization Settings**

```typescript
// Get organization-specific settings
const fetchOrganizationSettings = async () => {
  return api.get(`/organizations/me/settings`);
};
```

**Update Organization Settings**

```typescript
// Update organization-specific settings
const updateOrganizationSettings = async (settings: OrganizationSettingsData) => {
  return api.patch(`/organizations/me/settings`, settings);
};
```

#### 5.2.2 Subscription Management

**Get Subscription Details**

```typescript
// Get details about the current subscription
const fetchSubscription = async () => {
  return api.get(`/organizations/me/subscription`);
};
```

**Get Available Subscription Options**

```typescript
// Get available subscription tier options for upgrade/downgrade
const fetchSubscriptionOptions = async () => {
  return api.get(`/organizations/me/subscription/options`);
};
```

**Request Subscription Upgrade**

```typescript
// Request an upgrade to a higher subscription tier
const requestSubscriptionUpgrade = async (newTierId: string, paymentMethodId?: string) => {
  return api.post(`/organizations/me/subscription/upgrade`, {
    tier_id: newTierId,
    payment_method_id: paymentMethodId
  });
};
```

**Request Subscription Downgrade**

```typescript
// Request a downgrade to a lower subscription tier
const requestSubscriptionDowngrade = async (newTierId: string, effectiveDate?: string) => {
  return api.post(`/organizations/me/subscription/downgrade`, {
    tier_id: newTierId,
    effective_date: effectiveDate
  });
};
```

#### 5.2.3 Resource Management

**Get Resource Usage**

```typescript
// Get current resource usage statistics
const fetchResourceUsage = async () => {
  return api.get(`/organizations/me/usage`);
};
```

**Get Resource Usage Trends**

```typescript
// Get resource usage trends over time
const fetchResourceUsageTrend = async (
  resourceType: ResourceType,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month'
) => {
  return api.get(`/organizations/me/usage/${resourceType}/trend?timeRange=${timeRange}`);
};
```

**Get Resource Breakdown**

```typescript
// Get detailed breakdown of resource usage by category
const fetchResourceBreakdown = async (resourceType: ResourceType) => {
  return api.get(`/organizations/me/usage/${resourceType}/breakdown`);
};
```

**Get Usage Forecast**

```typescript
// Get usage forecast projections
const fetchUsageForecast = async (
  resourceType: ResourceType,
  projectionMonths = 3
) => {
  return api.get(`/organizations/me/usage/forecast?resourceType=${resourceType}&months=${projectionMonths}`);
};
```

#### 5.2.4 Billing Management

**Get Billing History**

```typescript
// Get billing history/invoices
const fetchBillingHistory = async (
  startDate?: string,
  endDate?: string,
  page = 1,
  limit = 20
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(startDate && { startDate }),
    ...(endDate && { endDate })
  });
  
  return api.get(`/organizations/me/billing/history?${queryParams}`);
};
```

**Get Payment Methods**

```typescript
// Get saved payment methods
const fetchPaymentMethods = async () => {
  return api.get(`/organizations/me/billing/methods`);
};
```

**Add Payment Method**

```typescript
// Add a new payment method
const addPaymentMethod = async (paymentMethodData: PaymentMethodData) => {
  return api.post(`/organizations/me/billing/methods`, paymentMethodData);
};
```

**Update Payment Method**

```typescript
// Update a payment method (e.g., set as default)
const updatePaymentMethod = async (methodId: string, updates: PaymentMethodUpdates) => {
  return api.patch(`/organizations/me/billing/methods/${methodId}`, updates);
};
```

**Delete Payment Method**

```typescript
// Delete a payment method
const deletePaymentMethod = async (methodId: string) => {
  return api.delete(`/organizations/me/billing/methods/${methodId}`);
};
```

### 5.3 User API Endpoints

These endpoints are used for managing user accounts within an organization and are accessible to Organization Administrators and in some cases regular users for self-management.

#### 5.3.1 User Management

**List Organization Users**

```typescript
// Get list of users in the organization
const fetchOrganizationUsers = async (filters?: UserFilters, page = 1, limit = 20) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filters?.role && { role: filters.role }),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.search && { search: filters.search })
  });
  
  return api.get(`/users?${queryParams}`);
};
```

**Get User Details**

```typescript
// Get detailed information about a specific user
const fetchUserDetails = async (userId: string) => {
  return api.get(`/users/${userId}`);
};
```

**Invite New User**

```typescript
// Invite a new user to the organization
const inviteUser = async (userData: UserInviteData) => {
  return api.post(`/users`, userData);
};
```

**Update User**

```typescript
// Update user details (role, status, etc.)
const updateUser = async (userId: string, updates: UserUpdateData) => {
  return api.patch(`/users/${userId}`, updates);
};
```

**Deactivate User**

```typescript
// Deactivate a user account
const deactivateUser = async (userId: string) => {
  return api.patch(`/users/${userId}`, { status: 'inactive' });
};
```

**Resend Invitation**

```typescript
// Resend invitation email to a pending user
const resendInvitation = async (userId: string) => {
  return api.post(`/users/${userId}/resend-invite`);
};
```

#### 5.3.2 User Profile Management

**Get Current User Profile**

```typescript
// Get profile of the currently authenticated user
const fetchCurrentUserProfile = async () => {
  return api.get(`/auth/me`);
};
```

**Update Current User Profile**

```typescript
// Update the current user's profile
const updateCurrentUserProfile = async (profileData: UserProfileData) => {
  return api.patch(`/auth/me`, profileData);
};
```

**Change Password**

```typescript
// Change the current user's password
const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  return api.post(`/auth/me/password`, {
    current_password: currentPassword,
    new_password: newPassword
  });
};
```

**Upload Profile Photo**

```typescript
// Upload a new profile photo
const uploadProfilePhoto = async (photoFile: File) => {
  const formData = new FormData();
  formData.append('avatar', photoFile);
  
  return api.post(`/auth/me/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
```

#### 5.3.3 User Sessions & Security

**Get User Sessions**

```typescript
// Get active sessions for the current user
const fetchUserSessions = async () => {
  return api.get(`/auth/me/sessions`);
};
```

**Terminate Session**

```typescript
// Terminate a specific session
const terminateSession = async (sessionId: string) => {
  return api.delete(`/auth/me/sessions/${sessionId}`);
};
```

**Terminate All Other Sessions**

```typescript
// Terminate all sessions except the current one
const terminateOtherSessions = async () => {
  return api.delete(`/auth/me/sessions`);
};
```

**Enable Two-Factor Authentication**

```typescript
// Enable two-factor authentication
const enableTwoFactorAuth = async () => {
  // Step 1: Initiate setup (returns secret and QR code data)
  const setup = await api.post(`/auth/me/2fa/enable`);
  
  // Step 2: Verify with code (from authenticator app)
  const verify = (code: string) => {
    return api.post(`/auth/me/2fa/verify`, { code });
  };
  
  return { setup, verify };
};
```

**Disable Two-Factor Authentication**

```typescript
// Disable two-factor authentication
const disableTwoFactorAuth = async (password: string) => {
  return api.post(`/auth/me/2fa/disable`, { password });
};
```

### 5.4 Settings API Endpoints

These endpoints manage various settings related to user preferences, notifications, and interface customization.

#### 5.4.1 Notification Preferences

**Get Notification Preferences**

```typescript
// Get the current user's notification preferences
const fetchNotificationPreferences = async () => {
  return api.get(`/notifications/preferences`);
};
```

**Update Notification Preferences**

```typescript
// Update notification preferences
const updateNotificationPreferences = async (preferences: NotificationPreferenceData) => {
  return api.patch(`/notifications/preferences`, preferences);
};
```

**Get Notification Channels**

```typescript
// Get notification channel settings
const fetchNotificationChannels = async () => {
  return api.get(`/notifications/preferences/channels`);
};
```

**Update Notification Channels**

```typescript
// Update notification channel settings
const updateNotificationChannels = async (channelSettings: NotificationChannelData) => {
  return api.patch(`/notifications/preferences/channels`, channelSettings);
};
```

**Get Category Preferences**

```typescript
// Get notification preferences for specific categories
const fetchCategoryPreferences = async () => {
  return api.get(`/notifications/preferences/categories`);
};
```

**Update Category Preferences**

```typescript
// Update preferences for specific notification categories
const updateCategoryPreferences = async (categoryId: string, preferences: CategoryPreferenceData) => {
  return api.patch(`/notifications/preferences/categories/${categoryId}`, preferences);
};
```

#### 5.4.2 Interface Preferences

**Get Interface Preferences**

```typescript
// Get user interface preferences
const fetchInterfacePreferences = async () => {
  return api.get(`/settings/interface`);
};
```

**Update Interface Preferences**

```typescript
// Update user interface preferences
const updateInterfacePreferences = async (preferences: InterfacePreferenceData) => {
  return api.patch(`/settings/interface`, preferences);
};
```

**Get Theme Settings**

```typescript
// Get user theme preferences
const fetchThemeSettings = async () => {
  return api.get(`/settings/interface/theme`);
};
```

**Update Theme Settings**

```typescript
// Update user theme preferences
const updateThemeSettings = async (themeSettings: ThemeSettingsData) => {
  return api.patch(`/settings/interface/theme`, themeSettings);
};
```

**Get Accessibility Settings**

```typescript
// Get user accessibility settings
const fetchAccessibilitySettings = async () => {
  return api.get(`/settings/interface/accessibility`);
};
```

**Update Accessibility Settings**

```typescript
// Update user accessibility settings
const updateAccessibilitySettings = async (settings: AccessibilitySettingsData) => {
  return api.patch(`/settings/interface/accessibility`, settings);
};
```

#### 5.4.3 Default View Settings

**Get Default View Settings**

```typescript
// Get user default view settings
const fetchDefaultViewSettings = async () => {
  return api.get(`/settings/interface/defaults`);
};
```

**Update Default View Settings**

```typescript
// Update user default view settings
const updateDefaultViewSettings = async (settings: DefaultViewSettingsData) => {
  return api.patch(`/settings/interface/defaults`, settings);
};
```

**Reset Default View Settings**

```typescript
// Reset default view settings to system defaults
const resetDefaultViewSettings = async () => {
  return api.post(`/settings/interface/defaults/reset`);
};
```

### 5.5 API Implementation Patterns

#### 5.5.1 Authentication & Authorization

All API requests should include proper authentication via JWT token in the Authorization header. The token is obtained during login and should be refreshed as needed.

```typescript
// Example of request interceptor adding auth token
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

For ABCD Platform Admin APIs, additional verification may be required:

```typescript
// Example of admin verification header
if (isAdminEndpoint(url)) {
  config.headers['X-Admin-Access'] = getAdminVerificationToken();
}
```

#### 5.5.2 Error Handling

Standardized error handling for API responses:

```typescript
// Error interceptor example
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    
    // Auth errors
    if (status === 401) {
      // Token expired or invalid
      triggerTokenRefresh();
    }
    
    // Permission errors
    if (status === 403) {
      notifyPermissionError();
    }
    
    // Not found
    if (status === 404) {
      // Handle resource not found
    }
    
    // Validation errors
    if (status === 422) {
      // Extract validation errors from response
      const validationErrors = error.response?.data?.errors || {};
      return Promise.reject({ validationErrors, ...error });
    }
    
    // Server errors
    if (status >= 500) {
      notifyServerError();
    }
    
    return Promise.reject(error);
  }
);
```

#### 5.5.3 Data Caching with React Query

Implement data caching and state management using React Query:

```typescript
// Example of React Query hook for fetching organization users
export const useOrganizationUsers = (filters, page = 1, limit = 20) => {
  return useQuery(
    ['users', filters, page, limit],
    () => fetchOrganizationUsers(filters, page, limit),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true
    }
  );
};

// Example of mutation hook for inviting users
export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(inviteUser, {
    onSuccess: () => {
      // Invalidate users query to refresh list
      queryClient.invalidateQueries('users');
    }
  });
};
```

#### 5.5.4 Request/Response Types

Define TypeScript interfaces for API requests and responses:

```typescript
// Example of organization API types
interface OrganizationProfileData {
  name: string;
  description?: string;
  logo_url?: string;
  industry?: string;
  website?: string;
  contact_email?: string;
}

interface OrganizationResponse {
  id: string;
  name: string;
  type: 'client' | 'expert';
  status: 'active' | 'pending' | 'suspended';
  subscription_tier: string;
  description: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

// Example of user API types
interface UserInviteData {
  email: string;
  role: string;
  name?: string;
  custom_message?: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  last_login?: string;
  created_at: string;
  updated_at: string;
}
```

## 6. Component Design & Implementation

This section details the design and implementation of key components used throughout the administrative interfaces. It covers component structure, props, state management, and reusability patterns to ensure consistent and maintainable UI components.

### 6.1 Admin Dashboard Components

#### 6.1.1 AdminDashboardGrid

A responsive grid layout system for organizing dashboard widgets with consistent spacing and alignment.

**Component Location**: `src/components/features/admin/AdminDashboardGrid.tsx`

**Props Interface**:
```typescript
interface AdminDashboardGridProps {
  children: React.ReactNode;
  columns?: number; // Default: 3 on desktop, responsive
  spacing?: 'normal' | 'compact' | 'wide'; // Default: 'normal'
  equalHeight?: boolean; // Default: false
}
```

**Implementation Details**:
- Uses CSS Grid for layout with responsive breakpoints
- Adjusts columns based on screen size (1 column on mobile, 2 on tablet, 3+ on desktop)
- Provides consistent padding and gap between widgets
- Optionally enforces equal height rows

**Usage Example**:
```tsx
<AdminDashboardGrid columns={3} spacing="normal">
  <OrganizationSummaryWidget />
  <PendingApprovalsWidget />
  <SystemHealthWidget />
  <ResourceUsageWidget />
</AdminDashboardGrid>
```

#### 6.1.2 DashboardWidget

A base container component for dashboard widgets with consistent styling, header, and optional actions.

**Component Location**: `src/components/features/admin/DashboardWidget.tsx`

**Props Interface**:
```typescript
interface DashboardWidgetProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  className?: string;
  minHeight?: string | number;
}
```

**Implementation Details**:
- Consistent card-like appearance with shadow and rounded corners
- Header with title, optional icon, and action buttons
- Loading state with skeleton placeholder
- Error state with retry option
- Refresh button if onRefresh handler provided
- Collapsible functionality (optional)

**Usage Example**:
```tsx
<DashboardWidget 
  title="Organization Summary" 
  icon={<BuildingIcon />}
  actions={<FilterButton />}
  loading={isLoading}
  error={error}
  onRefresh={refetch}
>
  <OrganizationSummaryContent data={data} />
</DashboardWidget>
```

#### 6.1.3 MetricCard

A compact card displaying a single metric with value, label, trend indicator, and optional icon.

**Component Location**: `src/components/features/admin/MetricCard.tsx`

**Props Interface**:
```typescript
interface MetricCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    isPositive: boolean; // Whether up is good or bad
  };
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}
```

**Implementation Details**:
- Compact, clickable card design
- Large, prominent display of metric value
- Descriptive label below the value
- Color-coded trend indicator with percentage
- Optional icon in the top-right
- Skeleton loader for loading state

**Usage Example**:
```tsx
<MetricCard
  value={activeOrganizationsCount}
  label="Active Organizations"
  icon={<BuildingIcon />}
  trend={{
    direction: 'up',
    percentage: 12,
    isPositive: true
  }}
  onClick={() => navigate('/admin/organizations?status=active')}
  loading={isLoading}
/>
```

#### 6.1.4 StatusIndicator

A component to display status information with appropriate color coding and icon.

**Component Location**: `src/components/features/admin/StatusIndicator.tsx`

**Props Interface**:
```typescript
interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  label?: string;
  showIcon?: boolean; // Default: true
  showLabel?: boolean; // Default: true
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
  className?: string;
}
```

**Implementation Details**:
- Color-coded based on status (green for healthy, yellow for warning, red for critical)
- Consistent icon for each status type
- Optional text label
- Adjustable size for different contexts
- Accessible with appropriate aria attributes

**Usage Example**:
```tsx
<StatusIndicator 
  status="warning" 
  label="Database Performance"
  size="medium"
/>
```

#### 6.1.5 PendingItemsList

A component to display a list of items requiring attention or approval.

**Component Location**: `src/components/features/admin/PendingItemsList.tsx`

**Props Interface**:
```typescript
interface PendingItem {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

interface PendingItemsListProps {
  items: PendingItem[];
  onItemClick: (itemId: string) => void;
  onApprove?: (itemId: string) => void;
  onReject?: (itemId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
}
```

**Implementation Details**:
- List of pending items with consistent styling
- Item highlighting based on priority
- Quick action buttons for approve/reject
- Loading skeleton state
- Empty state with message
- "View all" option for seeing more items
- Virtualized list if many items present

**Usage Example**:
```tsx
<PendingItemsList
  items={pendingApprovals}
  onItemClick={(id) => navigateToApproval(id)}
  onApprove={handleApprove}
  onReject={handleReject}
  loading={isLoading}
  emptyMessage="No pending approvals"
  maxItems={5}
  showViewAll={true}
  onViewAllClick={() => navigate('/admin/approvals')}
/>
```

### 6.2 Organization Management Components

#### 6.2.1 OrganizationList

A component for displaying and managing a list of organizations with filtering, sorting, and pagination.

**Component Location**: `src/components/features/admin/organizations/OrganizationList.tsx`

**Props Interface**:
```typescript
interface OrganizationListProps {
  organizations: Organization[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortField: string, sortDirection: 'asc' | 'desc') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: OrganizationFilters;
  onFilterChange: (filters: OrganizationFilters) => void;
  onViewOrganization: (organizationId: string) => void;
  loading: boolean;
}
```

**Implementation Details**:
- Enhanced data table with fixed header
- Column sorting with indicator
- Customizable columns (show/hide)
- Quick filters for organization type and status
- Status badges with appropriate colors
- Action menu for each organization
- Pagination controls with page size options
- Loading state with skeleton rows

**Usage Example**:
```tsx
<OrganizationList
  organizations={organizations}
  totalCount={totalCount}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  sortField={sortField}
  sortDirection={sortDirection}
  onSortChange={handleSortChange}
  filters={filters}
  onFilterChange={setFilters}
  onViewOrganization={handleViewOrganization}
  loading={isLoading}
/>
```

#### 6.2.2 OrganizationFilterBar

A component providing filtering controls for organizations.

**Component Location**: `src/components/features/admin/organizations/OrganizationFilterBar.tsx`

**Props Interface**:
```typescript
interface OrganizationFilters {
  search?: string;
  type?: 'client' | 'expert' | '';
  status?: 'active' | 'pending' | 'suspended' | '';
  tier?: string;
  dateRange?: [Date | null, Date | null];
}

interface OrganizationFilterBarProps {
  filters: OrganizationFilters;
  onFilterChange: (filters: OrganizationFilters) => void;
  availableTiers: {value: string, label: string}[];
  loading?: boolean;
  onClearFilters: () => void;
}
```

**Implementation Details**:
- Search input for name/ID search
- Dropdown selects for type, status, and tier
- Date range picker for creation date filtering
- Clear filters button
- Responsive design (collapses to dropdown on mobile)
- Filter chips showing active filters with remove option

**Usage Example**:
```tsx
<OrganizationFilterBar
  filters={filters}
  onFilterChange={setFilters}
  availableTiers={subscriptionTiers}
  loading={isLoadingTiers}
  onClearFilters={() => setFilters({})}
/>
```

#### 6.2.3 OrganizationForm

A form component for creating or editing organization details.

**Component Location**: `src/components/features/admin/organizations/OrganizationForm.tsx`

**Props Interface**:
```typescript
interface OrganizationFormProps {
  initialData?: Partial<OrganizationFormData>;
  onSubmit: (data: OrganizationFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  serverErrors?: Record<string, string[]>;
}
```

**Implementation Details**:
- Form fields for organization profile (name, description, etc.)
- Type selection (client vs expert organization)
- Logo upload with preview and cropping
- Industry selection dropdown
- Form validation with React Hook Form
- Error message display (both client and server validation)
- Save and cancel buttons

**Usage Example**:
```tsx
<OrganizationForm
  initialData={organizationData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isSubmitting={isSubmitting}
  mode="edit"
  serverErrors={apiErrors}
/>
```

#### 6.2.4 SubscriptionTierSelector

A component for selecting subscription tiers with visual comparison.

**Component Location**: `src/components/features/admin/organizations/SubscriptionTierSelector.tsx`

**Props Interface**:
```typescript
interface SubscriptionTierSelectorProps {
  tiers: SubscriptionTier[];
  selectedTierId: string | null;
  onSelect: (tierId: string) => void;
  viewMode?: 'cards' | 'table'; // Default: 'cards'
  compareMode?: boolean; // Default: true
  loading?: boolean;
}
```

**Implementation Details**:
- Visual cards for each subscription tier
- Highlight for selected tier
- Feature comparison table (in table mode)
- Resource limit comparison
- Price display with billing period
- Recommended tier indicator (if applicable)
- Loading skeleton state

**Usage Example**:
```tsx
<SubscriptionTierSelector
  tiers={availableTiers}
  selectedTierId={selectedTier}
  onSelect={setSelectedTier}
  viewMode="cards"
  compareMode={true}
  loading={isLoadingTiers}
/>
```

#### 6.2.5 ResourceLimitEditor

A component for managing resource limits for an organization.

**Component Location**: `src/components/features/admin/organizations/ResourceLimitEditor.tsx`

**Props Interface**:
```typescript
interface ResourceLimit {
  resourceType: string;
  currentLimit: number;
  defaultLimit: number;
  used: number;
  unit?: string;
}

interface ResourceLimitEditorProps {
  resourceLimits: ResourceLimit[];
  onLimitChange: (resourceType: string, newLimit: number) => void;
  loading?: boolean;
  readOnly?: boolean;
}
```

**Implementation Details**:
- Table of resource types with current limits
- Editable number inputs for each limit
- Visual indication of usage vs limit
- Reset to default button for each limit
- Unit display (e.g., GB, counts)
- Validation to prevent setting limits below current usage

**Usage Example**:
```tsx
<ResourceLimitEditor
  resourceLimits={organizationResources}
  onLimitChange={handleLimitChange}
  loading={isLoading}
  readOnly={!hasEditPermission}
/>
```

### 6.3 User Management Components

#### 6.3.1 UserTable

A table component for displaying and managing users.

**Component Location**: `src/components/features/admin/users/UserTable.tsx`

**Props Interface**:
```typescript
interface UserTableProps {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortField: string, sortDirection: 'asc' | 'desc') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onViewUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onDeactivateUser: (userId: string) => void;
  onReactivateUser: (userId: string) => void;
  onResendInvite: (userId: string) => void;
  canEditUsers: boolean;
  loading: boolean;
}
```

**Implementation Details**:
- Enhanced data table with user information
- Status badges for user status (active, pending, inactive)
- Role badges for user roles
- Action menu with context-specific options
- Pagination controls
- Column sorting functionality
- Loading skeleton state

**Usage Example**:
```tsx
<UserTable
  users={users}
  totalCount={totalCount}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  sortField={sortField}
  sortDirection={sortDirection}
  onSortChange={handleSortChange}
  onViewUser={handleViewUser}
  onEditUser={handleEditUser}
  onDeactivateUser={handleDeactivateUser}
  onReactivateUser={handleReactivateUser}
  onResendInvite={handleResendInvite}
  canEditUsers={hasEditPermission}
  loading={isLoading}
/>
```

#### 6.3.2 UserInviteForm

A form component for inviting new users to the organization.

**Component Location**: `src/components/features/admin/users/UserInviteForm.tsx`

**Props Interface**:
```typescript
interface UserInviteFormProps {
  onSubmit: (data: UserInviteData | UserInviteData[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  availableRoles: {value: string, label: string}[];
  mode: 'single' | 'batch'; // Default: 'single'
  serverErrors?: Record<string, string[]>;
}
```

**Implementation Details**:
- Email input field(s) with validation
- Role selection dropdown with descriptions
- Batch mode for inviting multiple users at once
- Custom invitation message editor (optional)
- Form validation with React Hook Form
- Error message display
- Submit and cancel buttons
- Toggle between single and batch mode

**Usage Example**:
```tsx
<UserInviteForm
  onSubmit={handleInviteSubmit}
  onCancel={handleCancel}
  isSubmitting={isSubmitting}
  availableRoles={roles}
  mode="single"
  serverErrors={apiErrors}
/>
```

#### 6.3.3 RoleSelector

A component for selecting a user role with descriptions.

**Component Location**: `src/components/features/admin/users/RoleSelector.tsx`

**Props Interface**:
```typescript
interface Role {
  value: string;
  label: string;
  description: string;
  permissions?: string[];
}

interface RoleSelectorProps {
  roles: Role[];
  selectedRole: string;
  onChange: (role: string) => void;
  error?: string;
  disabled?: boolean;
  showDescriptions?: boolean; // Default: true
  showPermissions?: boolean; // Default: false
}
```

**Implementation Details**:
- Radio group or dropdown selector for roles
- Role descriptions to help with selection
- Optional display of permissions for each role
- Visual highlighting of selected role
- Error state display
- Support for disabled state

**Usage Example**:
```tsx
<RoleSelector
  roles={availableRoles}
  selectedRole={selectedRole}
  onChange={setSelectedRole}
  error={formErrors.role}
  disabled={isSubmitting}
  showDescriptions={true}
  showPermissions={true}
/>
```

#### 6.3.4 UserProfileForm

A form component for editing user profile information.

**Component Location**: `src/components/features/admin/users/UserProfileForm.tsx`

**Props Interface**:
```typescript
interface UserProfileFormProps {
  initialData: Partial<UserProfileData>;
  onSubmit: (data: UserProfileData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  serverErrors?: Record<string, string[]>;
  mode: 'create' | 'edit';
  isCurrentUser: boolean; // Whether this is the current user editing their own profile
}
```

**Implementation Details**:
- Form fields for user profile (name, email, job title, etc.)
- Avatar upload with preview and cropping
- Email change with verification flow (if not current user)
- Role selection (if admin and not current user)
- Form validation with React Hook Form
- Error message display
- Save and cancel buttons

**Usage Example**:
```tsx
<UserProfileForm
  initialData={userData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isSubmitting={isSubmitting}
  serverErrors={apiErrors}
  mode="edit"
  isCurrentUser={isCurrentUser}
/>
```

#### 6.3.5 UserActivityLog

A component displaying a timeline of user activities.

**Component Location**: `src/components/features/admin/users/UserActivityLog.tsx`

**Props Interface**:
```typescript
interface ActivityLogItem {
  id: string;
  action: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
  location?: string;
}

interface UserActivityLogProps {
  activities: ActivityLogItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}
```

**Implementation Details**:
- Chronological timeline of user activities
- Activity categorization and icons
- Time formatting with relative time
- Grouping by day
- "Load more" functionality for pagination
- Loading skeleton state
- Empty state when no activities

**Usage Example**:
```tsx
<UserActivityLog
  activities={activityLog}
  loading={isLoading}
  onLoadMore={fetchMoreActivities}
  hasMore={hasMoreActivities}
  isLoadingMore={isLoadingMore}
/>
```

### 6.4 Settings Form Components

#### 6.4.1 SettingsSection

A container component for grouping related settings with a title and optional description.

**Component Location**: `src/components/features/settings/SettingsSection.tsx`

**Props Interface**:
```typescript
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  expanded?: boolean; // Default: true
  toggleable?: boolean; // Default: true
  id?: string;
  className?: string;
}
```

**Implementation Details**:
- Collapsible section with header and content
- Toggle button for expand/collapse
- Consistent styling with padding and borders
- Accessibility attributes for expandable sections
- Optional description text below title

**Usage Example**:
```tsx
<SettingsSection
  title="General Settings"
  description="Basic configuration options for your organization"
  expanded={true}
  toggleable={true}
  id="general-settings"
>
  <SettingField
    label="Organization Name"
    name="organizationName"
    control={<Input value={name} onChange={handleNameChange} />}
    description="The name displayed throughout the platform"
  />
  {/* More setting fields */}
</SettingsSection>
```

#### 6.4.2 SettingField

A component for displaying a single setting with label, control, and description.

**Component Location**: `src/components/features/settings/SettingField.tsx`

**Props Interface**:
```typescript
interface SettingFieldProps {
  label: string;
  name: string;
  control: React.ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}
```

**Implementation Details**:
- Consistent layout for settings fields
- Label with optional required indicator
- Control area for input component
- Help text/description below the control
- Error message display
- Proper accessibility attributes

**Usage Example**:
```tsx
<SettingField
  label="Default Language"
  name="defaultLanguage"
  control={
    <Select
      value={defaultLanguage}
      onChange={handleLanguageChange}
      options={languageOptions}
    />
  }
  description="The default language for new users in your organization"
  error={errors.defaultLanguage}
  required={true}
/>
```

#### 6.4.3 SettingToggle

A toggle switch component optimized for boolean settings.

**Component Location**: `src/components/features/settings/SettingToggle.tsx`

**Props Interface**:
```typescript
interface SettingToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
  className?: string;
}
```

**Implementation Details**:
- Switch toggle with clear on/off states
- Animated transition
- Size variants for different contexts
- Accessible keyboard navigation
- Support for disabled state
- Optional inline label

**Usage Example**:
```tsx
<SettingToggle
  checked={enableFeature}
  onChange={setEnableFeature}
  label="Enable this feature"
  disabled={isSubmitting}
  name="enableFeature"
  size="medium"
/>
```

#### 6.4.4 ColorPicker

A component for selecting and previewing colors in settings.

**Component Location**: `src/components/features/settings/ColorPicker.tsx`

**Props Interface**:
```typescript
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  showHexInput?: boolean; // Default: true
  showPreview?: boolean; // Default: true
  disabled?: boolean;
  format?: 'hex' | 'rgb' | 'hsl'; // Default: 'hex'
}
```

**Implementation Details**:
- Color picker with hue, saturation, and lightness controls
- Hex input field with validation
- Color preview
- Preset color palette options
- Accessibility considerations for color selection
- Support for different color formats

**Usage Example**:
```tsx
<ColorPicker
  color={primaryColor}
  onChange={setPrimaryColor}
  presetColors={brandColorPalette}
  showHexInput={true}
  showPreview={true}
  format="hex"
/>
```

#### 6.4.5 ApiKeyManager

A component for managing API keys and secrets securely.

**Component Location**: `src/components/features/settings/ApiKeyManager.tsx`

**Props Interface**:
```typescript
interface ApiKey {
  id: string;
  name: string;
  lastFourChars: string;
  createdAt: string;
  expiresAt?: string;
}

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  onCreateKey: (name: string) => Promise<string>;
  onDeleteKey: (keyId: string) => Promise<void>;
  loading?: boolean;
  maxKeys?: number;
}
```

**Implementation Details**:
- List of existing API keys with metadata
- Create new key form with name input
- Secure display of new keys with copy functionality
- Delete key confirmation dialog
- Copy to clipboard functionality
- Expiration countdown for keys with expiry

**Usage Example**:
```tsx
<ApiKeyManager
  apiKeys={apiKeys}
  onCreateKey={handleCreateKey}
  onDeleteKey={handleDeleteKey}
  loading={isLoading}
  maxKeys={5}
/>
```

### 6.5 Resource Monitoring Components

#### 6.5.1 ResourceUsageChart

A chart component for visualizing resource usage over time.

**Component Location**: `src/components/features/admin/resources/ResourceUsageChart.tsx`

**Props Interface**:
```typescript
interface UsageDataPoint {
  timestamp: string;
  value: number;
}

interface ResourceUsageChartProps {
  title: string;
  data: UsageDataPoint[];
  limit?: number;
  unit?: string;
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange?: (range: 'day' | 'week' | 'month' | 'year') => void;
  loading?: boolean;
  height?: number | string; // Default: 300
  showLegend?: boolean; // Default: true
  secondaryData?: UsageDataPoint[]; // For comparison
  secondaryLabel?: string;
}
```

**Implementation Details**:
- Line chart showing usage over time
- Limit line if limit is provided
- Time range selector buttons
- Appropriate date/time formatting on axis
- Tooltips for detailed information on hover
- Loading skeleton state
- Support for comparing two data series
- Responsive design that adapts to container width

**Usage Example**:
```tsx
<ResourceUsageChart
  title="Message Volume"
  data={messageUsageData}
  limit={messageLimit}
  unit="messages"
  timeRange={timeRange}
  onTimeRangeChange={setTimeRange}
  loading={isLoading}
  height={300}
  showLegend={true}
  secondaryData={previousPeriodData}
  secondaryLabel="Previous Period"
/>
```

#### 6.5.2 UsageGauge

A gauge component for visualizing current resource usage against a limit.

**Component Location**: `src/components/features/admin/resources/UsageGauge.tsx`

**Props Interface**:
```typescript
interface UsageGaugeProps {
  value: number;
  limit: number;
  unit?: string;
  label: string;
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
  showPercentage?: boolean; // Default: true
  thresholds?: {
    warning: number; // Default: 0.7 (70%)
    critical: number; // Default: 0.9 (90%)
  };
  loading?: boolean;
}
```

**Implementation Details**:
- Circular or semi-circular gauge visualization
- Color coding based on usage thresholds
- Clear display of current value vs limit
- Percentage calculation and display
- Size variants for different contexts
- Loading skeleton state
- Responsive scaling

**Usage Example**:
```tsx
<UsageGauge
  value={activeWorkers}
  limit={workerLimit}
  unit="workers"
  label="Active Workers"
  size="medium"
  showPercentage={true}
  thresholds={{ warning: 0.7, critical: 0.85 }}
  loading={isLoading}
/>
```

#### 6.5.3 ResourceBreakdownTable

A table component for displaying detailed resource usage breakdown by category.

**Component Location**: `src/components/features/admin/resources/ResourceBreakdownTable.tsx`

**Props Interface**:
```typescript
interface ResourceCategory {
  id: string;
  name: string;
  value: number;
  percentage: number;
  change?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

interface ResourceBreakdownTableProps {
  categories: ResourceCategory[];
  total: number;
  unit?: string;
  loading?: boolean;
  showTrend?: boolean; // Default: true
  sortable?: boolean; // Default: true
  emptyMessage?: string;
}
```

**Implementation Details**:
- Table showing resource usage by category
- Sortable columns (by value, name, change)
- Percentage bar visualization for each category
- Change/trend indicators
- Total row at bottom
- Loading skeleton state
- Empty state with message

**Usage Example**:
```tsx
<ResourceBreakdownTable
  categories={storageBreakdown}
  total={totalStorage}
  unit="GB"
  loading={isLoading}
  showTrend={true}
  sortable={true}
  emptyMessage="No storage usage data available"
/>
```

#### 6.5.4 ResourceForecastChart

A chart component for visualizing projected resource usage.

**Component Location**: `src/components/features/admin/resources/ResourceForecastChart.tsx`

**Props Interface**:
```typescript
interface ForecastDataPoint {
  timestamp: string;
  value: number;
  isProjected: boolean;
}

interface ResourceForecastChartProps {
  title: string;
  historicalData: ForecastDataPoint[];
  forecastData: ForecastDataPoint[];
  limit?: number;
  unit?: string;
  projectionMonths?: number; // Default: 3
  onProjectionMonthsChange?: (months: number) => void;
  showConfidenceBand?: boolean; // Default: true
  confidenceBandData?: {
    upper: ForecastDataPoint[];
    lower: ForecastDataPoint[];
  };
  loading?: boolean;
  height?: number | string; // Default: 300
}
```

**Implementation Details**:
- Line chart with historical and projected data
- Clear visual distinction between historical and projected data
- Confidence band for projection uncertainty
- Limit line with breach prediction
- Projection time range controls
- Tooltips for detailed information
- Loading skeleton state

**Usage Example**:
```tsx
<ResourceForecastChart
  title="Worker Growth Forecast"
  historicalData={historicalWorkerData}
  forecastData={projectedWorkerData}
  limit={workerLimit}
  unit="workers"
  projectionMonths={3}
  onProjectionMonthsChange={setProjectionMonths}
  showConfidenceBand={true}
  confidenceBandData={{ upper: upperBand, lower: lowerBand }}
  loading={isLoading}
  height={350}
/>
```

#### 6.5.5 ResourceAllocationTable

A table component for viewing and managing resource allocation across programs.

**Component Location**: `src/components/features/admin/resources/ResourceAllocationTable.tsx`

**Props Interface**:
```typescript
interface ResourceAllocation {
  id: string;
  programName: string;
  resourceType: string;
  allocated: number;
  used: number;
  percentage: number;
  limit?: number;
}

interface ResourceAllocationTableProps {
  allocations: ResourceAllocation[];
  resourceType: string;
  unit?: string;
  editable?: boolean;
  onAllocationChange?: (id: string, newAllocation: number) => void;
  loading?: boolean;
  totalAllocated?: number;
  totalAvailable?: number;
}
```

**Implementation Details**:
- Table showing resource allocation by program
- Progress bars showing usage vs allocation
- Editable allocation amounts (if editable)
- Validation to prevent over-allocation
- Summary row showing total allocation vs available
- Loading skeleton state
- Warning indicators for near-limit programs

**Usage Example**:
```tsx
<ResourceAllocationTable
  allocations={messageAllocations}
  resourceType="Message Quota"
  unit="messages"
  editable={hasEditPermission}
  onAllocationChange={handleAllocationChange}
  loading={isLoading}
  totalAllocated={totalAllocatedMessages}
  totalAvailable={availableMessages}
/>
```

## 7. State Management

This section details the state management patterns and implementation for the administrative interfaces. It covers global state contexts, server state management, and form state handling to ensure consistent and maintainable state across the application.

### 7.1 Admin State Context

For application-wide administrative state that needs to be shared across components, a dedicated AdminContext is implemented. This context is kept minimal and focused specifically on admin-related global state.

#### 7.1.1 AdminContext Definition

**Location**: `src/context/AdminProvider.tsx`

```typescript
// Type definitions
interface AdminContextState {
  // Admin preferences and UI state
  sidebarExpanded: boolean;
  adminView: 'platform' | 'organization';
  selectedOrganizationId: string | null;
  adminPreferences: AdminPreferences;
  
  // Actions
  toggleSidebar: () => void;
  setAdminView: (view: 'platform' | 'organization') => void;
  selectOrganization: (orgId: string | null) => void;
  updateAdminPreferences: (preferences: Partial<AdminPreferences>) => void;
}

interface AdminPreferences {
  dashboardLayout: {
    [widgetId: string]: {
      visible: boolean;
      position: number;
    };
  };
  tablePreferences: {
    [tableId: string]: {
      visibleColumns: string[];
      pageSize: number;
      defaultSort: { field: string; direction: 'asc' | 'desc' };
    };
  };
  dateFormat: string;
  timeFormat: string;
}

// Context and Provider
const AdminContext = React.createContext<AdminContextState | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State implementations
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [adminView, setAdminView] = useState<'platform' | 'organization'>('platform');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [adminPreferences, setAdminPreferences] = useState<AdminPreferences>(defaultAdminPreferences);
  
  // Action implementations
  const toggleSidebar = useCallback(() => {
    setSidebarExpanded(prev => !prev);
  }, []);
  
  const updateAdminPreferences = useCallback((preferences: Partial<AdminPreferences>) => {
    setAdminPreferences(prev => ({
      ...prev,
      ...preferences
    }));
    
    // Persist to localStorage
    localStorage.setItem('adminPreferences', JSON.stringify({
      ...adminPreferences,
      ...preferences
    }));
  }, [adminPreferences]);

  // Effect to initialize from localStorage
  useEffect(() => {
    const storedPreferences = localStorage.getItem('adminPreferences');
    if (storedPreferences) {
      try {
        const parsed = JSON.parse(storedPreferences);
        setAdminPreferences(parsed);
      } catch (error) {
        console.error('Failed to parse admin preferences', error);
      }
    }
  }, []);
  
  // Context value
  const contextValue = {
    sidebarExpanded,
    adminView,
    selectedOrganizationId,
    adminPreferences,
    toggleSidebar,
    setAdminView,
    selectOrganization: setSelectedOrganizationId,
    updateAdminPreferences
  };
  
  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook for using the context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
```

#### 7.1.2 Usage Patterns

The AdminContext should be used sparingly and only for state that truly needs to be shared across admin components. Examples of appropriate usage include:

1. **UI State Persistence**:
   - Sidebar expanded/collapsed state
   - Dashboard widget layout preferences
   - Table column visibility preferences

2. **Admin Navigation Context**:
   - Current organization being managed/viewed
   - Admin view mode (platform vs organization admin)

3. **Admin Preferences**:
   - Date/time format preferences
   - Default sorting/filtering preferences
   - UI density/theme preferences specific to admin

**Example Usage**:

```tsx
// In a component
import { useAdmin } from '@/context/AdminProvider';

const AdminDashboard = () => {
  const { 
    sidebarExpanded, 
    adminPreferences, 
    toggleSidebar,
    updateAdminPreferences 
  } = useAdmin();
  
  const updateWidgetVisibility = (widgetId: string, visible: boolean) => {
    updateAdminPreferences({
      dashboardLayout: {
        ...adminPreferences.dashboardLayout,
        [widgetId]: {
          ...adminPreferences.dashboardLayout[widgetId],
          visible
        }
      }
    });
  };
  
  return (
    <div className={sidebarExpanded ? 'dashboard-expanded' : 'dashboard-collapsed'}>
      <button onClick={toggleSidebar}>
        {sidebarExpanded ? 'Collapse' : 'Expand'} Sidebar
      </button>
      
      <AdminDashboardGrid>
        {Object.entries(adminPreferences.dashboardLayout)
          .filter(([_, config]) => config.visible)
          .sort(([_, a], [_, b]) => a.position - b.position)
          .map(([widgetId, _]) => (
            <AdminWidget 
              key={widgetId} 
              id={widgetId} 
              onToggleVisibility={() => updateWidgetVisibility(widgetId, false)}
            />
          ))}
      </AdminDashboardGrid>
    </div>
  );
};
```

### 7.2 Server State Management with React Query

React Query is used for managing server state throughout the admin interfaces, providing a consistent pattern for data fetching, caching, and mutations.

#### 7.2.1 API Hooks Implementation

**Location**: `src/hooks/features/admin/*`

```typescript
// Example of React Query implementation for organizations
import { useQuery, useMutation, useQueryClient } from 'react-query';
import * as organizationsApi from '@/lib/api/endpoints/admin/organizations';

// List organizations
export const useOrganizations = (filters = {}, page = 1, limit = 20) => {
  return useQuery(
    ['admin', 'organizations', { filters, page, limit }],
    () => organizationsApi.fetchOrganizations(filters, page, limit),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true
    }
  );
};

// Get organization details
export const useOrganizationDetails = (organizationId: string) => {
  return useQuery(
    ['admin', 'organizations', organizationId],
    () => organizationsApi.fetchOrganizationDetails(organizationId),
    {
      enabled: !!organizationId,
      staleTime: 60000 // 1 minute
    }
  );
};

// Update organization
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ organizationId, data }: { organizationId: string, data: any }) => 
      organizationsApi.updateOrganization(organizationId, data),
    {
      onSuccess: (_, { organizationId }) => {
        // Invalidate specific queries
        queryClient.invalidateQueries(['admin', 'organizations', organizationId]);
        queryClient.invalidateQueries(['admin', 'organizations']);
      }
    }
  );
};

// Update organization status
export const useUpdateOrganizationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ organizationId, status, reason }: { organizationId: string, status: string, reason?: string }) => 
      organizationsApi.updateOrganizationStatus(organizationId, status, reason),
    {
      onSuccess: (_, { organizationId }) => {
        queryClient.invalidateQueries(['admin', 'organizations', organizationId]);
        queryClient.invalidateQueries(['admin', 'organizations']);
      }
    }
  );
};
```

#### 7.2.2 Query Key Structure

A consistent query key structure is crucial for proper cache management and invalidation. The following structure is recommended:

- **Platform Admin Queries**: `['admin', entityType, entityId?, params?]`
- **Organization Admin Queries**: `['organization', entityType, entityId?, params?]`
- **User-Level Queries**: `['user', entityType, entityId?, params?]`

**Examples**:
- `['admin', 'organizations']` - List of all organizations
- `['admin', 'organizations', organizationId]` - Specific organization details
- `['organization', 'users']` - Users within current organization
- `['user', 'sessions']` - Current user's sessions

#### 7.2.3 Cache Time & Stale Time Configuration

Different types of data have different freshness requirements. Use these guidelines:

- **Reference Data** (rarely changes): Long cache and stale times
  ```typescript
  {
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
    staleTime: 60 * 60 * 1000 // 1 hour
  }
  ```

- **Entity Data** (moderate change frequency): Medium cache and stale times
  ```typescript
  {
    cacheTime: 60 * 60 * 1000, // 1 hour
    staleTime: 5 * 60 * 1000 // 5 minutes
  }
  ```

- **Dynamic Data** (frequently changes): Short cache and stale times
  ```typescript
  {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 30 * 1000 // 30 seconds
  }
  ```

#### 7.2.4 Optimistic Updates

For better UX, implement optimistic updates for common operations:

```typescript
export const useToggleFeatureFlag = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ flagId, enabled }: { flagId: string, enabled: boolean }) => 
      featureFlagsApi.updateFeatureFlag(flagId, { enabled }),
    {
      // Optimistically update the cache
      onMutate: async ({ flagId, enabled }) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(['admin', 'features']);
        
        // Snapshot the previous value
        const previousFlags = queryClient.getQueryData(['admin', 'features']);
        
        // Optimistically update
        queryClient.setQueryData(['admin', 'features'], (old: any) => {
          return {
            ...old,
            data: old.data.map((flag: any) => 
              flag.id === flagId ? { ...flag, enabled } : flag
            )
          };
        });
        
        // Return context with the previous value
        return { previousFlags };
      },
      
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, { flagId }, context) => {
        queryClient.setQueryData(['admin', 'features'], context?.previousFlags);
      },
      
      // Always refetch after error or success
      onSettled: () => {
        queryClient.invalidateQueries(['admin', 'features']);
      }
    }
  );
};
```

#### 7.2.5 Dependent Queries

Handle dependent data fetching gracefully:

```typescript
// Get subscription tier details after fetching organization
export const useOrganizationWithSubscription = (organizationId: string) => {
  const { data: organization, ...organizationQuery } = useOrganizationDetails(organizationId);
  
  const tierId = organization?.subscription_tier_id;
  
  const subscriptionQuery = useQuery(
    ['admin', 'subscriptions', 'tiers', tierId],
    () => subscriptionApi.fetchTierDetails(tierId!),
    {
      enabled: !!tierId,
      staleTime: 60 * 60 * 1000 // 1 hour
    }
  );
  
  return {
    organization,
    subscriptionTier: subscriptionQuery.data,
    isLoading: organizationQuery.isLoading || subscriptionQuery.isLoading,
    isError: organizationQuery.isError || subscriptionQuery.isError,
    error: organizationQuery.error || subscriptionQuery.error
  };
};
```

### 7.3 Form State Management

Form state in admin interfaces is managed using React Hook Form with Zod for validation, providing a consistent approach to form handling.

#### 7.3.1 Basic Form Pattern

**Location**: Examples from various form components

```typescript
// Example organization settings form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schema with Zod
const organizationSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  contactEmail: z.string().email('Must be a valid email'),
  timezone: z.string(),
  defaultLanguage: z.string(),
  logoUrl: z.string().optional()
});

type OrganizationSettingsFormData = z.infer<typeof organizationSettingsSchema>;

interface OrganizationSettingsFormProps {
  initialData: Partial<OrganizationSettingsFormData>;
  onSubmit: (data: OrganizationSettingsFormData) => void;
  isSubmitting: boolean;
}

const OrganizationSettingsForm: React.FC<OrganizationSettingsFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<OrganizationSettingsFormData>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: initialData
  });
  
  // Reset form when initialData changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SettingsSection title="Organization Details">
        <SettingField
          label="Organization Name"
          name="name"
          error={errors.name?.message}
          required
          control={
            <Input
              {...register('name')}
              placeholder="Enter organization name"
              disabled={isSubmitting}
            />
          }
        />
        
        <SettingField
          label="Description"
          name="description"
          control={
            <Textarea
              {...register('description')}
              placeholder="Enter organization description"
              disabled={isSubmitting}
            />
          }
        />
        
        {/* More fields */}
      </SettingsSection>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => reset(initialData)}
          disabled={!isDirty || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          loading={isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};
```

#### 7.3.2 Multi-Step Form Pattern

For complex forms like wizards, manage form state across steps:

```typescript
// Organization creation wizard example
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define schema for each step
const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['client', 'expert'], {
    required_error: 'Organization type is required'
  }),
  industry: z.string().optional()
});

const adminSchema = z.object({
  adminName: z.string().min(2, 'Name must be at least 2 characters'),
  adminEmail: z.string().email('Must be a valid email'),
  adminRole: z.string()
});

const subscriptionSchema = z.object({
  tierId: z.string(),
  billingCycle: z.enum(['monthly', 'annual'])
});

// Combined schema for all steps
const organizationCreationSchema = z.object({
  ...basicInfoSchema.shape,
  ...adminSchema.shape,
  ...subscriptionSchema.shape
});

type OrganizationCreationData = z.infer<typeof organizationCreationSchema>;

const OrganizationCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm<OrganizationCreationData>({
    resolver: zodResolver(organizationCreationSchema),
    mode: 'onBlur',
    defaultValues: {
      type: 'client',
      billingCycle: 'monthly'
    }
  });
  
  const { handleSubmit, trigger } = methods;
  
  // Function to go to next step, validating current step first
  const handleNextStep = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'type', 'industry'];
        break;
      case 2:
        fieldsToValidate = ['adminName', 'adminEmail', 'adminRole'];
        break;
      // Add cases for other steps
    }
    
    const isStepValid = await trigger(fieldsToValidate as any);
    
    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Go to previous step (no validation needed)
  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Final submission handler
  const onSubmit = (data: OrganizationCreationData) => {
    console.log('Form submitted with:', data);
    // Submit to API
  };
  
  return (
    <FormProvider {...methods}>
      <form>
        <StepIndicator 
          steps={['Basic Info', 'Admin User', 'Subscription', 'Review']} 
          currentStep={currentStep} 
        />
        
        {currentStep === 1 && <BasicInfoStep />}
        {currentStep === 2 && <AdminUserStep />}
        {currentStep === 3 && <SubscriptionStep />}
        {currentStep === 4 && <ReviewStep data={methods.getValues()} />}
        
        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          )}
          
          {currentStep < 4 ? (
            <Button type="button" onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Create Organization
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

// Example of a step component
const BasicInfoStep = () => {
  const { register, formState: { errors } } = useFormContext<OrganizationCreationData>();
  
  return (
    <div className="space-y-4">
      <SettingField
        label="Organization Name"
        name="name"
        error={errors.name?.message}
        required
        control={
          <Input
            {...register('name')}
            placeholder="Enter organization name"
          />
        }
      />
      
      <SettingField
        label="Organization Type"
        name="type"
        error={errors.type?.message}
        required
        control={
          <RadioGroup {...register('type')}>
            <Radio value="client">Client Organization</Radio>
            <Radio value="expert">Expert Organization</Radio>
          </RadioGroup>
        }
      />
      
      {/* More fields */}
    </div>
  );
};
```

#### 7.3.3 Form Error Handling

Handle both client-side validation and server-side errors:

```typescript
// Component with server error handling
const OrganizationForm = ({ initialData, onSubmit }) => {
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: initialData
  });
  
  // Submit handler that processes server errors
  const handleFormSubmit = async (data: OrganizationFormData) => {
    try {
      setServerErrors({});
      await onSubmit(data);
    } catch (error) {
      if (error.validationErrors) {
        // Map server validation errors to form fields
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          setError(field as any, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages
          });
        });
        
        setServerErrors(error.validationErrors);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Form fields */}
      
      {/* General server error display */}
      {serverErrors.general && (
        <Alert variant="error" className="mt-4">
          {serverErrors.general.join('. ')}
        </Alert>
      )}
    </form>
  );
};
```

#### 7.3.4 Dynamic Form Fields

Handle dynamic form fields for complex settings:

```typescript
// Example of dynamic field array for notification channels
const NotificationSettingsForm = () => {
  const { control, register, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'notificationChannels'
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end space-x-3">
            <div className="flex-1">
              <label>Channel Type</label>
              <Select
                {...register(`notificationChannels.${index}.type`)}
                options={[
                  { value: 'email', label: 'Email' },
                  { value: 'slack', label: 'Slack' },
                  { value: 'webhook', label: 'Webhook' }
                ]}
              />
            </div>
            
            <div className="flex-1">
              <label>Destination</label>
              <Input
                {...register(`notificationChannels.${index}.destination`)}
                placeholder="Enter destination"
              />
            </div>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              className="mb-1"
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ type: 'email', destination: '' })}
        >
          Add Notification Channel
        </Button>
      </div>
      
      <Button type="submit" className="mt-6">
        Save Settings
      </Button>
    </form>
  );
};
```

## 8. Security & Access Control

This section outlines the security considerations and access control mechanisms for administrative interfaces. It covers role-based access control, permission enforcement, and audit logging to ensure secure administration of the platform.

### 8.1 Role-Based Access Control

The ABCD platform implements a comprehensive role-based access control (RBAC) system to restrict access to administrative interfaces based on user role.

#### 8.1.1 Role Hierarchy

The platform defines the following administrative role hierarchy:

1. **ABCD Platform Admin**: Full access to all platform administration features.
2. **Organization Admin**: Full administrative access within a specific organization.
3. **Program Manager**: Limited administrative access focused on program management.
4. **Training Manager**: Limited administrative access focused on content and journeys.
5. **Content Specialist**: Limited administrative access focused on content creation.

#### 8.1.2 Role Implementation

**Location**: `src/lib/auth/roles.ts`

```typescript
// Role definitions
export enum UserRole {
  PlatformAdmin = 'platform_admin',
  OrganizationAdmin = 'organization_admin',
  ProgramManager = 'program_manager',
  TrainingManager = 'training_manager',
  ContentSpecialist = 'content_specialist',
  User = 'user'
}

// Role mapping to permissions
export const rolePermissions: Record<UserRole, string[]> = {
  [UserRole.PlatformAdmin]: [
    'admin.*', // All platform-wide admin permissions
  ],
  [UserRole.OrganizationAdmin]: [
    'org.admin', // Organization administration
    'org.users.*', // User management within organization
    'org.billing.*', // Billing management
    'org.settings.*', // Organization settings
    // And all permissions of roles below
    ...rolePermissions[UserRole.ProgramManager],
    ...rolePermissions[UserRole.TrainingManager],
  ],
  [UserRole.ProgramManager]: [
    'programs.create',
    'programs.edit',
    'programs.delete',
    'programs.execute',
    'segments.*',
    'workers.*',
  ],
  [UserRole.TrainingManager]: [
    'journeys.create',
    'journeys.edit',
    'journeys.delete',
    'content.manage',
  ],
  [UserRole.ContentSpecialist]: [
    'content.create',
    'content.edit',
    'content.delete',
  ],
  [UserRole.User]: [
    'profile.view',
    'profile.edit',
  ]
};
```

#### 8.1.3 Route Protection

**Route Guards**:

```typescript
// src/components/auth/RequireAuth.tsx
export const RequireAuth: React.FC<{
  children: React.ReactNode;
  requiredPermissions?: string[];
}> = ({ children, requiredPermissions = [] }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const hasPermission = useMemo(() => {
    if (!user || !requiredPermissions.length) return false;
    return requiredPermissions.some(permission => 
      checkPermission(user, permission)
    );
  }, [user, requiredPermissions]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
    } else if (!isLoading && !hasPermission) {
      router.replace('/unauthorized');
    }
  }, [user, isLoading, hasPermission, router]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user || !hasPermission) {
    return null;
  }
  
  return <>{children}</>;
};
```

**Example Usage**:

```tsx
// In app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth requiredPermissions={['admin.access']}>
      <AdminProvider>
        <AdminHeader />
        <div className="admin-container">
          <AdminSidebar />
          <main className="admin-content">{children}</main>
        </div>
      </AdminProvider>
    </RequireAuth>
  );
}
```

### 8.2 Permission Enforcement

Beyond route-level protection, permission checks are implemented at the component level to conditionally render UI elements and enforce access restrictions.

#### 8.2.1 Permission Checking Hook

**Location**: `src/hooks/usePermissions.ts`

```typescript
export function usePermissions() {
  const { user } = useAuth();
  
  const checkPermission = useCallback(
    (permission: string | string[]) => {
      if (!user) return false;
      
      const permissions = Array.isArray(permission) ? permission : [permission];
      
      return permissions.some(p => {
        // Check if user has this exact permission
        if (user.permissions.includes(p)) return true;
        
        // Check wildcard permissions (e.g., 'org.*' includes 'org.users.create')
        return user.permissions.some(userPerm => {
          if (userPerm.endsWith('.*')) {
            const prefix = userPerm.slice(0, -2);
            return p.startsWith(prefix);
          }
          return false;
        });
      });
    },
    [user]
  );
  
  return { checkPermission };
}
```

#### 8.2.2 Conditional Rendering

**Example Usage**:

```tsx
const AdminActions = ({ organizationId }: { organizationId: string }) => {
  const { checkPermission } = usePermissions();
  
  const canManageUsers = checkPermission('org.users.manage');
  const canDeleteOrganization = checkPermission('admin.organizations.delete');
  
  return (
    <div className="admin-actions">
      {canManageUsers && (
        <Button onClick={() => navigate(`/admin/organizations/${organizationId}/users`)}>
          Manage Users
        </Button>
      )}
      
      {canDeleteOrganization && (
        <Button 
          variant="danger"
          onClick={() => handleDeleteOrganization(organizationId)}
        >
          Delete Organization
        </Button>
      )}
    </div>
  );
};
```

#### 8.2.3 API Access Control

In addition to UI-level permissions, API access is protected through backend middleware. The frontend cooperates by:

1. Sending the authentication token with all API requests
2. Handling 403 Forbidden responses gracefully
3. Not displaying UI elements for actions the user cannot perform

```typescript
// Example of handling permission errors in API responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      // Permission denied
      toast.error('You do not have permission to perform this action');
      
      // Log for potential security analysis
      console.warn('Permission denied for action', {
        url: error.config.url,
        method: error.config.method,
        timestamp: new Date().toISOString()
      });
    }
    return Promise.reject(error);
  }
);
```

### 8.3 Admin Audit Logging

Administrative actions are logged for security, compliance, and troubleshooting purposes. The frontend cooperates with the backend to ensure proper audit trail generation.

#### 8.3.1 Audit Log Structure

**Audit Record Fields**:
- `userId`: ID of the user performing the action
- `action`: Type of action performed (e.g., 'organization.create', 'user.delete')
- `resourceType`: Type of resource affected (e.g., 'organization', 'user', 'program')
- `resourceId`: Identifier of the affected resource
- `timestamp`: When the action occurred
- `ipAddress`: Client IP address (captured by backend)
- `userAgent`: Browser/client information (captured by backend)
- `details`: Additional context-specific details
- `previousState`: Optional snapshot of resource state before change
- `newState`: Optional snapshot of resource state after change

#### 8.3.2 Frontend Integration

The frontend integrates with the audit logging system by:

1. Including an audit context in relevant API calls
2. Displaying audit logs in administrative interfaces
3. Providing filtering and search capabilities for audit review

**API Integration Example**:

```typescript
// When making significant administrative changes, include audit context
const updateOrganizationStatus = async (
  organizationId: string,
  status: OrganizationStatus,
  reason: string
) => {
  return api.patch(`/admin/organizations/${organizationId}/status`, {
    status,
    reason,
    _audit: {
      action: 'organization.status.update',
      details: { reason }
    }
  });
};
```

#### 8.3.3 Audit Log Viewer

A dedicated audit log viewer component displays administrative activity:

**Location**: `src/components/features/admin/AuditLogViewer.tsx`

```typescript
interface AuditLogViewerProps {
  resourceType?: string;
  resourceId?: string;
  userId?: string;
  limit?: number;
  showFilters?: boolean;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  resourceType,
  resourceId,
  userId,
  limit = 50,
  showFilters = true
}) => {
  const [filters, setFilters] = useState({
    resourceType,
    resourceId,
    userId,
    dateRange: null as [Date | null, Date | null] | null,
    actions: [] as string[]
  });
  
  const { data, isLoading, error } = useAuditLogs(filters, 1, limit);
  
  return (
    <div className="audit-log-viewer">
      {showFilters && (
        <AuditLogFilters 
          filters={filters} 
          onFilterChange={setFilters} 
        />
      )}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <div className="audit-log-timeline">
          {data?.items.map(log => (
            <AuditLogEntry key={log.id} log={log} />
          ))}
          
          {data?.items.length === 0 && (
            <EmptyState message="No audit logs found matching these criteria" />
          )}
        </div>
      )}
      
      {data?.hasMore && (
        <Button variant="outline" onClick={() => loadMore()}>
          Load More
        </Button>
      )}
    </div>
  );
};
```

#### 8.3.4 Sensitive Action Confirmation

For sensitive administrative actions, the UI implements confirmation dialogs that explain the action's impact and potentially require additional authentication:

```tsx
const DeleteOrganizationDialog: React.FC<{
  organizationId: string;
  organizationName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ organizationId, organizationName, isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  
  const confirmDisabled = confirmText !== organizationName;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Organization">
      <div className="space-y-4">
        <Alert variant="danger">
          This action cannot be undone. It will permanently delete the organization,
          all its users, workers, content, and data.
        </Alert>
        
        <p>
          To confirm deletion, please type the organization name:
          <strong>{organizationName}</strong>
        </p>
        
        <Input
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="Type organization name to confirm"
        />
        
        <div className="mt-4">
          <label>Reason for deletion (required for audit log):</label>
          <Textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Enter reason for deletion"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={confirmDisabled || !reason.trim()}
            onClick={() => {
              // Include reason in audit context
              onConfirm();
              onClose();
            }}
          >
            Delete Organization
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

## 9. Integration with Other Modules

### 9.1 Organizations Module
### 9.2 Marketplace Module
### 9.3 Projects & Funders Module
### 9.4 Content & Journey Management
### 9.5 Program Implementation
### 9.6 Specialized Features

## 10. Testing & Quality Assurance

### 10.1 Admin Component Testing
### 10.2 Integration Testing
### 10.3 Permission Testing 