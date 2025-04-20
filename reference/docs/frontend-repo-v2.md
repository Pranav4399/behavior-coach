# ABCD Frontend Build Repository Structure - V2 (Comprehensive)

## Overview

This document outlines the **updated and comprehensive** repository structure for the `abcd-frontend-build` directory. The structure is designed based on the specifications in the root `Repo.md`, the `Behavioral-Coach-background/Docs/API & Pages.md` document, `ARCHITECTURE.md`, `COMPONENTS.md`, the original `frontend-repo.md`, the general project rules, and inferred patterns. It utilizes the Next.js App Router and emphasizes a feature-first organization, incorporating all necessary components for a multi-tenant SaaS platform with specialized features like Wellbeing, Gamification, Projects/Funders, Marketplace, and robust WhatsApp integration.

## Structure Benefits

-   **Modern Next.js**: Leverages the App Router for improved layouts, loading states, Server Components, and API routes.
-   **Feature-First Organization**: Groups components, hooks, styles, tests, and logic by feature/domain for enhanced maintainability and team collaboration (Rule 1.3).
-   **Clear Separation of Concerns**: Distinct directories for UI components, hooks, API logic, state management, utilities, configuration, and routing.
-   **Scalability**: Designed to accommodate platform growth by adding new features/domains within established patterns.
-   **Alignment with Documentation**: Directly maps to the pages and API endpoints outlined in `PAGE_LIST.MD` and component/hook structure from `COMPONENTS.md` and `ARCHITECTURE.md`.
-   **Path Aliases**: Facilitates cleaner imports using aliases like `@components`, `@hooks`, `@lib`, `@features`, `@store` (Rule 1.4).
-   **Multi-Tenant Ready**: Incorporates specific structures and considerations for multi-tenant data isolation and context management.
-   **Comprehensive Feature Support**: Includes structures for all documented features, including Wellbeing, Gamification, Projects/Funders, Marketplace, and Experimentation.

## Proposed Directory Structure V2

```
abcd-frontend-build/               # Root directory for the frontend build
    ├── .env.local                  # Local environment variables (ignored by Git)
    ├── .eslintrc.js                # ESLint configuration
    ├── .gitignore                  # Git ignore rules
    ├── .prettierrc.js              # Prettier configuration
    ├── next-env.d.ts               # Next.js environment types
    ├── next.config.js              # Next.js configuration (incl. redirects, env vars, bundle analyzer)
    ├── package.json                # Project dependencies and scripts
    ├── README.md                   # Frontend specific documentation entry point
    ├── frontend-repo-v2.md         # This file - repository structure documentation
    ├── tsconfig.json               # TypeScript configuration (incl. path aliases)
    │
    ├── docs/                       # Comprehensive frontend documentation (as before)
    │   ├── ARCHITECTURE.md         # System architecture & technical foundation
    │   ├── COMPONENTS.md           # Design system & component library documentation
    │   ├── DEVELOPMENT_WORKFLOW.md # Development workflow & quality assurance
    │   ├── JOURNEY_BUILDER.md      # Journey builder implementation guide
    │   ├── PROGRAM_IMPLEMENTATION.md # Program management implementation guide
    │   ├── SEGMENTATION.md         # Audience & segmentation engine documentation
    │   ├── CONTENT_MANAGEMENT.md   # Content management system & templates
    │   ├── EXPERIMENTATION.md      # Analytics & experimentation framework
    │   ├── SPECIALIZED_FEATURES.md # Specialized features implementation (wellbeing, gamification, etc.)
    │   ├── MULTI_TENANCY.md        # Multi-tenant implementation details (NEW)
    │   ├── WHATSAPP_INTEGRATION.md # WhatsApp integration specifics (NEW)
    │   ├── ACCESSIBILITY_GUIDE.md  # User experience & accessibility playbook
    │   └── PERFORMANCE_GUIDE.md    # Performance optimization strategies (NEW)
    │
    ├── public/                     # Static assets (favicon, fonts, images, etc.)
    │   ├── assets/                 # General assets like logos
    │   ├── fonts/                  # Font files
    │   └── icons/                  # SVG icons if not using a library
    │
    └── src/                        # Source code root
        ├── app/                    # Next.js App Router directory
        │   ├── layout.tsx          # Root layout (html, body, global providers)
        │   ├── page.tsx            # Root page (e.g., redirect to login or dashboard)
        │   │
        │   ├── (auth)/             # Authentication routes (Route Group - public)
        │   │   ├── layout.tsx      # Auth-specific layout (e.g., centered card)
        │   │   ├── login/page.tsx
        │   │   ├── register/page.tsx
        │   │   ├── forgot-password/page.tsx
        │   │   └── reset-password/page.tsx
        │   │
        │   ├── (app)/              # Main application routes (Route Group - requires auth & tenant context)
        │   │   ├── layout.tsx      # Main application layout (AppShell: Sidebar, Header)
        │   │   │
        │   │   ├── dashboard/page.tsx
        │   │   │
        │   │   ├── organizations/  # Organization management (Org Admins)
        │   │   │   ├── layout.tsx     # Org management specific layout/nav
        │   │   │   ├── page.tsx       # Org dashboard/overview page
        │   │   │   ├── settings/      # General Org Settings
        │   │   │   │   ├── page.tsx   # Main settings
        │   │   │   │   ├── branding/page.tsx # Branding settings
        │   │   │   │   └── permissions/page.tsx # Roles & Permissions
        │   │   │   ├── billing/       # Org Billing
        │   │   │   │   ├── page.tsx   # Overview/History
        │   │   │   │   ├── methods/page.tsx
        │   │   │   │   ├── usage/page.tsx
        │   │   │   │   └── forecasts/page.tsx
        │   │   │   ├── users/         # User Management
        │   │   │   │   ├── page.tsx   # User list
        │   │   │   │   ├── [userId]/page.tsx # User details
        │   │   │   │   └── invite/page.tsx
        │   │   │   └── integrations/  # Integrations Settings
        │   │   │       ├── page.tsx   # List/overview of integrations
        │   │   │       ├── whatsapp/  # WhatsApp specific integration settings (NEW)
        │   │   │       │   └── page.tsx
        │   │   │       └── sms/       # SMS specific integration settings (NEW)
        │   │   │           └── page.tsx
        │   │   │
        │   │   ├── workers/        # Worker/Audience Management
        │   │   │   ├── page.tsx
        │   │   │   ├── [workerId]/
        │   │   │   │   ├── page.tsx   # Overview/Profile
        │   │   │   │   ├── wellbeing/page.tsx
        │   │   │   │   ├── journey-state/page.tsx # Detailed journey state (NEW)
        │   │   │   │   └── gamification/page.tsx # Points, badges, challenges (NEW)
        │   │   │   ├── create/page.tsx
        │   │   │   └── import/page.tsx
        │   │   │
        │   │   ├── segments/       # Segmentation Management
        │   │   │   ├── page.tsx
        │   │   │   ├── [segmentId]/
        │   │   │   │   ├── page.tsx   # Detail/Analytics
        │   │   │   │   └── workers/page.tsx # List workers in segment
        │   │   │   ├── builder/[segmentId]/page.tsx # Rule Builder UI (could be combined with create/edit)
        │   │   │   └── create/page.tsx
        │   │   │
        │   │   ├── journeys/       # Journey Blueprint Management
        │   │   │   ├── page.tsx
        │   │   │   ├── [journeyId]/
        │   │   │   │   ├── page.tsx   # Detail/Analytics
        │   │   │   │   └── versions/page.tsx # Version history (NEW)
        │   │   │   ├── builder/[journeyId]/page.tsx
        │   │   │   ├── create/page.tsx
        │   │   │   └── simulation/[journeyId]/page.tsx # Journey Simulation (NEW)
        │   │   │
        │   │   ├── programs/       # Program Implementation/Management
        │   │   │   ├── page.tsx
        │   │   │   ├── [programId]/
        │   │   │   │   ├── layout.tsx # Program specific layout/tabs
        │   │   │   │   ├── page.tsx   # Dashboard/Overview
        │   │   │   │   ├── workers/   # Enrolled workers
        │   │   │   │   │   ├── page.tsx # List/Manage
        │   │   │   │   │   └── [workerId]/page.tsx # Individual progress
        │   │   │   │   ├── journey-progress/page.tsx # Aggregated progress view (NEW)
        │   │   │   │   ├── messages/page.tsx # Message logs/communication (NEW)
        │   │   │   │   ├── analytics/page.tsx # Program-specific analytics
        │   │   │   │   ├── settings/page.tsx
        │   │   │   │   ├── follow-up/page.tsx
        │   │   │   │   ├── conflicts/page.tsx
        │   │   │   │   └── feedback/page.tsx
        │   │   │   ├── create/page.tsx
        │   │   │   └── deploy/[journeyId]/page.tsx # Start program creation from journey (NEW)
        │   │   │
        │   │   ├── content/        # Content Management
        │   │   │   ├── page.tsx       # Content Library
        │   │   │   ├── [contentId]/
        │   │   │   │   ├── page.tsx   # Detail/Preview/Usage
        │   │   │   │   └── versions/page.tsx # Version history (NEW)
        │   │   │   ├── editor/[contentId]/page.tsx
        │   │   │   ├── create/page.tsx   # Select content type
        │   │   │   ├── create/[contentType]/page.tsx # Specific type creation form
        │   │   │   ├── media/page.tsx   # Media Library
        │   │   │   └── templates/     # Message Template Management (WhatsApp, SMS, Email)
        │   │   │       ├── page.tsx   # List templates
        │   │   │       ├── [templateId]/page.tsx # View/Edit/Approval Status
        │   │   │       ├── create/page.tsx
        │   │   │       └── approvals/ # WhatsApp HSM Approval Workflow UI
        │   │   │           └── page.tsx
        │   │   │
        │   │   ├── wellbeing/      # Wellbeing Domain
        │   │   │   ├── layout.tsx     # Wellbeing specific layout/nav
        │   │   │   ├── page.tsx       # Dashboard/Overview
        │   │   │   ├── indicators/    # Manage Wellbeing Indicators
        │   │   │   │   ├── page.tsx   # List/Manage
        │   │   │   │   ├── [indicatorId]/page.tsx # Detail/Trends
        │   │   │   │   └── create/page.tsx
        │   │   │   ├── assessments/   # Manage Wellbeing Assessments
        │   │   │   │   ├── page.tsx   # List/Schedule
        │   │   │   │   ├── [assessmentId]/
        │   │   │   │   │   ├── page.tsx # Details/Results
        │   │   │   │   │   └── builder/page.tsx # Edit assessment template
        │   │   │   │   │   └── create/page.tsx # Create Assessment Template
        │   │   │   │   └── interventions/ # Manage Wellbeing Interventions
        │   │   │   │   ├── page.tsx   # List/Manage
        │   │   │   │   ├── [interventionId]/page.tsx # Detail/Effectiveness
        │   │   │   │   └── create/page.tsx
        │   │   │   ├── alerts/        # Manage Wellbeing Alerts
        │   │   │   │   ├── page.tsx   # List/Manage Alerts
        │   │   │   │   ├── [alertId]/page.tsx # Alert details/response
        │   │   │   │   └── configure/page.tsx # Configure alert rules
        │   │   │   └── analytics/page.tsx # Detailed Wellbeing Analytics
        │   │   │
        │   │   ├── projects/       # Projects & Funders Domain
        │   │   │   ├── layout.tsx     # Projects specific layout/nav
        │   │   │   ├── page.tsx       # Project List Page
        │   │   │   ├── [projectId]/
        │   │   │   │   ├── layout.tsx # Project detail tabs layout
        │   │   │   │   ├── page.tsx   # Overview/Dashboard
        │   │   │   │   ├── programs/page.tsx
        │   │   │   │   ├── funders/page.tsx
        │   │   │   │   ├── evidence/
        │   │   │   │   │   ├── page.tsx # List/Manage Evidence
        │   │   │   │   │   └── create/page.tsx # Add evidence
        │   │   │   │   ├── reports/
        │   │   │   │   │   ├── page.tsx # List/Generate Reports
        │   │   │   │   │   └── generate/page.tsx # Report generation UI
        │   │   │   │   └── edit/page.tsx # Edit Project Details
        │   │   │   ├── create/page.tsx
        │   │   │   └── funders/       # Funder Management (Top-level)
        │   │   │       ├── page.tsx   # List Funders
        │   │   │       ├── [funderId]/page.tsx # View/Edit Funder
        │   │   │       └── create/page.tsx
        │   │   │
        │   │   ├── experiments/    # Experimentation Management
        │   │   │   ├── page.tsx       # List/Dashboard
        │   │   │   ├── [experimentId]/
        │   │   │   │   ├── page.tsx   # Detail/Configuration/Status
        │   │   │   │   └── results/page.tsx # Detailed Results Visualization (NEW)
        │   │   │   └── create/page.tsx # Creation Wizard
        │   │   │
        │   │   ├── gamification/   # Gamification Configuration
        │   │   │   ├── layout.tsx     # Gamification specific layout/nav
        │   │   │   ├── page.tsx       # Dashboard/Overview
        │   │   │   ├── badges/
        │   │   │   │   ├── page.tsx   # List/Manage Badges
        │   │   │   │   ├── [badgeId]/page.tsx # Detail/Stats
        │   │   │   │   └── create/page.tsx
        │   │   │   ├── challenges/
        │   │   │   │   ├── page.tsx   # List/Manage Challenges
        │   │   │   │   ├── [challengeId]/page.tsx # Detail/Progress
        │   │   │   │   └── create/page.tsx
        │   │   │   ├── leaderboards/
        │   │   │   │   ├── page.tsx   # List/Manage Leaderboards
        │   │   │   │   ├── [leaderboardId]/page.tsx # Detail/Rankings
        │   │   │   │   └── create/page.tsx
        │   │   │   ├── rewards/
        │   │   │   │   ├── page.tsx   # List/Manage Rewards Catalog
        │   │   │   │   ├── [rewardId]/page.tsx # Detail/Redemption
        │   │   │   │   └── create/page.tsx
        │   │   │   └── analytics/page.tsx # Gamification specific analytics (NEW)
        │   │   │
        │   │   ├── marketplace/    # Marketplace UI (Client & Expert views)
        │   │   │   ├── layout.tsx     # Marketplace layout/nav
        │   │   │   ├── page.tsx       # Browse Listings
        │   │   │   ├── listings/[listingId]/
        │   │   │   │   ├── page.tsx   # Listing Detail/Preview
        │   │   │   │   └── review/page.tsx # Submit/View Reviews
        │   │   │   ├── publish/page.tsx # Wizard for Experts to publish
        │   │   │   ├── my-listings/page.tsx # For Experts to manage their listings
        │   │   │   └── acquisitions/page.tsx # For Clients to manage acquired items
        │   │   │
        │   │   ├── analytics/      # Consolidated Analytics Dashboards
        │   │   │   ├── layout.tsx     # Analytics layout/nav
        │   │   │   ├── page.tsx       # Main Overview Dashboard
        │   │   │   ├── workers/page.tsx
        │   │   │   ├── journeys/page.tsx
        │   │   │   ├── programs/page.tsx
        │   │   │   ├── wellbeing/page.tsx # Duplicate? Already under /wellbeing/analytics
        │   │   │   ├── experiments/page.tsx
        │   │   │   ├── engagement/page.tsx # Specific engagement analytics (NEW)
        │   │   │   ├── messaging/page.tsx # Messaging performance analytics (NEW)
        │   │   │   ├── comparative/page.tsx # Comparative analysis (e.g., segment vs segment) (NEW)
        │   │   │   └── reports/       # Custom Report Builder/List
        │   │   │       ├── page.tsx   # List saved/generated reports
        │   │   │       ├── builder/page.tsx # Custom report builder UI (NEW)
        │   │   │       └── [reportId]/page.tsx # View specific report
        │   │   │
        │   │   ├── admin/          # ABCD Platform Admin UI
        │   │   │   ├── layout.tsx     # Admin layout/nav
        │   │   │   ├── page.tsx       # Dashboard
        │   │   │   ├── organizations/
        │   │   │   │   ├── page.tsx   # List/Manage Orgs
        │   │   │   │   └── [orgId]/page.tsx # Org details (Admin view)
        │   │   │   ├── approvals/     # Approval Queues
        │   │   │   │   ├── page.tsx   # Overview of queues
        │   │   │   │   ├── organizations/page.tsx
        │   │   │   │   └── marketplace/page.tsx
        │   │   │   ├── subscriptions/ # Subscription Tier Management
        │   │   │   │   ├── page.tsx   # List/Manage Tiers
        │   │   │   │   ├── [tierId]/page.tsx
        │   │   │   │   └── create/page.tsx
        │   │   │   ├── marketplace/   # Marketplace Management (Admin)
        │   │   │   │   ├── page.tsx   # Overview/Settings
        │   │   │   │   ├── listings/page.tsx # Manage all listings
        │   │   │   │   └── categories/page.tsx # Manage categories
        │   │   │   ├── system/        # System Health & Maintenance (Admin)
        │   │   │   │   ├── page.tsx   # Health Overview
        │   │   │   │   ├── performance/page.tsx # Performance Metrics (NEW)
        │   │   │   │   ├── errors/page.tsx # Error Monitoring (NEW)
        │   │   │   │   └── maintenance/page.tsx # Schedule Maintenance (NEW)
        │   │   │   └── settings/      # Platform Settings (Admin)
        │   │   │       ├── page.tsx   # General Settings
        │   │   │       ├── features/page.tsx # Feature Flags
        │   │   │       └── announcements/page.tsx # System Announcements
        │   │   │
        │   │   ├── notifications/  # User Notifications Center
        │   │   │   └── page.tsx       # List/History
        │   │   │
        │   │   └── settings/       # User Settings (Individual)
        │   │       ├── layout.tsx     # User settings layout/nav
        │   │       ├── page.tsx       # Overview/Redirect
        │   │       ├── account/page.tsx
        │   │       ├── notifications/page.tsx # Notification Preferences
        │   │       └── interface/page.tsx # UI Preferences (Theme, Density)
        │   │
        │   ├── api/                    # Next.js API Routes (BFF, Webhooks, Auth)
        │   │   ├── auth/               # NextAuth.js or custom auth endpoints
        │   │   │   └── [...nextauth]/route.ts
        │   │   ├── webhooks/           # Webhook handlers (e.g., Twilio, Stripe)
        │   │   │   ├── twilio/route.ts
        │   │   │   └── stripe/route.ts
        │   │   └── trpc/               # Optional: tRPC router endpoint if used
        │   │       └── [trpc]/route.ts
        │   │
        │   ├── loading.tsx             # Root loading UI (Suspense fallback) for (app) routes
        │   ├── error.tsx               # Root error boundary UI for (app) routes
        │   └── global-error.tsx        # Global error boundary (catches root layout errors)
        │
        ├── components/                 # Reusable UI components
        │   ├── ui/                     # Base UI primitives (Button, Input, Card, Table, etc. - as before)
        │   ├── layout/                 # Layout components (AppShell, Sidebar, Header, etc. - as before)
        │   ├── features/               # Feature-specific composite components (grouped by feature - expanded)
        │   │   ├── auth/
        │   │   ├── organizations/
        │   │   ├── workers/
        │   │   ├── segments/
        │   │   ├── journeys/           # (Incl. Builder UI parts, TouchpointCard, Simulation Controls)
        │   │   ├── programs/           # (Incl. Dashboard Widgets, Worker Progress Views)
        │   │   ├── content/            # (Incl. Editor, QuizPlayer, TemplateManager, Media Uploader)
        │   │   ├── wellbeing/          # (Incl. Dashboard, AssessmentForm, IndicatorChart, AlertItem)
        │   │   ├── projects/           # (Incl. ProjectList, FunderCard, EvidenceUploader, ReportGenerator)
        │   │   ├── experiments/        # (Incl. ExperimentCard, SetupForm, ResultsChart/Table)
        │   │   ├── gamification/       # (Incl. BadgeList, ChallengeCard, LeaderboardTable, RewardItem)
        │   │   ├── marketplace/        # (Incl. ListingCard, Filters, ReviewForm, PublishForm)
        │   │   ├── analytics/          # (Incl. ReportChart, MetricDisplay, CustomReportBuilderUI)
        │   │   ├── admin/              # (Incl. AdminDataTable, ApprovalQueueItem, OrgAdminCard)
        │   │   ├── billing/            # (Incl. InvoiceList, SubscriptionCard, UsageChart)
        │   │   ├── notifications/      # (Incl. NotificationList, NotificationItem)
        │   │   ├── settings/           # (Incl. AccountForm, NotificationSettingsForm, ThemeToggle)
        │   │   ├── multi-tenant/       # Components specifically handling tenant context/display (NEW)
        │   │   │   └── TenantSwitcher.tsx
        │   │   └── whatsapp/           # Components specific to WhatsApp features (NEW)
        │   │       ├── WhatsAppTemplatePreview.tsx
        │   │       └── WhatsAppApprovalStatusBadge.tsx
        │
        ├── hooks/                      # Custom React hooks
        │   ├── useApi.ts               # Base hook for API calls (wrapping React Query)
        │   ├── useAuth.ts              # Access auth state/actions
        │   ├── useDebounce.ts
        │   ├── useTableControls.ts
        │   ├── useTenant.ts            # Access tenant context (crucial for multi-tenancy)
        │   ├── useFeatureFlag.ts       # Hook for checking feature flags (NEW)
        │   ├── useResponsive.ts        # Hook for responsive design checks (NEW)
        │   │
        │   └── features/               # Feature-specific hooks (grouped by feature - expanded)
        │       ├── useWorkersApi.ts
        │       ├── useSegmentsApi.ts
        │       ├── useJourneysApi.ts   # (Incl. builder state management)
        │       ├── useProgramsApi.ts
        │       ├── useContentApi.ts    # (Incl. template management)
        │       ├── useWellbeingApi.ts
        │       ├── useProjectsApi.ts   # (Incl. funders, evidence)
        │       ├── useExperimentsApi.ts# (Incl. results fetching/analysis)
        │       ├── useGamificationApi.ts
        │       ├── useAnalyticsApi.ts  # (Incl. report generation)
        │       ├── useNotificationsApi.ts
        │       ├── useOrganizationApi.ts
        │       ├── useUsersApi.ts
        │       ├── useBillingApi.ts
        │       ├── useMarketplaceApi.ts
        │       ├── useAdminApi.ts
        │       ├── useWhatsAppApi.ts   # Hooks specific to WhatsApp integration (NEW)
        │       └── ...                 # Other domain-specific hooks
        │
        ├── context/                    # React context providers (minimal use)
        │   ├── AuthProvider.tsx        # (Manages auth state, user info)
        │   ├── TenantProvider.tsx      # (Manages current organization context - essential)
        │   ├── ThemeProvider.tsx       # (Manages UI theme)
        │   ├── QueryClientProvider.tsx # Setup for React Query
        │   └── WebSocketProvider.tsx   # Optional: For real-time features (NEW)
        │
        ├── store/                      # Global state management (e.g., Zustand)
        │   ├── index.ts                # Root store setup/exports
        │   ├── authStore.ts            # Alternative/Complement to AuthProvider context
        │   ├── tenantStore.ts          # Alternative/Complement to TenantProvider context
        │   ├── journeyBuilderStore.ts  # Complex state for Journey Builder UI (NEW)
        │   ├── programStateStore.ts    # State for active program interactions (NEW)
        │   └── experimentConfigStore.ts# State for experiment setup UI (NEW)
        │
        ├── lib/                        # Core libraries, utilities, API clients, types
        │   ├── api/                    # API client configuration and endpoint definitions
        │   │   ├── client.ts           # Base fetch/axios instance, interceptors (auth, tenant)
        │   │   ├── endpoints/          # Functions making specific API calls (grouped by domain - comprehensive)
        │   │   │   ├── auth.ts
        │   │   │   ├── workers.ts
        │   │   │   ├── segments.ts
        │   │   │   ├── journeys.ts
        │   │   │   ├── programs.ts
        │   │   │   ├── content.ts      # (Incl. templates, media)
        │   │   │   ├── wellbeing.ts
        │   │   │   ├── projects.ts     # (Incl. funders, evidence)
        │   │   │   ├── experiments.ts
        │   │   │   ├── gamification.ts
        │   │   │   ├── marketplace.ts
        │   │   │   ├── analytics.ts    # (Incl. reports)
        │   │   │   ├── admin.ts        # (Incl. system health, approvals)
        │   │   │   ├── billing.ts
        │   │   │   ├── organizations.ts# (Incl. users, settings, integrations)
        │   │   │   ├── notifications.ts
        │   │   │   └── whatsapp.ts     # Specific WhatsApp endpoints (NEW)
        │   │   └── types.ts            # Shared API type definitions (requests/responses)
        │   │
        │   ├── constants/              # Application-wide constants
        │   │   ├── index.ts
        │   │   ├── roles.ts
        │   │   └── permissions.ts
        │   ├── utils/                  # General utility functions
        │   │   ├── index.ts
        │   │   ├── date.ts
        │   │   ├── string.ts
        │   │   ├── cn.ts               # Classname merging utility
        │   │   ├── tenant.ts           # Utilities for handling tenant context (NEW)
        │   │   ├── whatsapp.ts         # Utilities for WhatsApp formatting/parsing (NEW)
        │   │   ├── analytics.ts        # Utilities for processing analytics data (NEW)
        │   │   └── visualization.ts    # Utilities for journey/flow visualization (NEW)
        │   ├── config/                 # Frontend-specific configuration
        │   │   ├── index.ts
        │   │   └── featureFlags.ts     # Feature flag definitions/accessors (NEW)
        │   ├── types/                  # Global TypeScript interfaces and types
        │   │   ├── index.ts            # Exports all global types (domains, common types)
        │   │   ├── domain/             # Domain-specific types (Worker, Journey, Program etc.)
        │   │   └── common.ts           # Common types like PaginatedResponse, UserProfile
        │   ├── validation/             # Data validation schemas (Zod) - Comprehensive
        │   │   ├── index.ts
        │   │   ├── auth.ts
        │   │   ├── worker.ts
        │   │   ├── segment.ts
        │   │   ├── journey.ts
        │   │   ├── program.ts
        │   │   ├── content.ts
        │   │   ├── wellbeing.ts
        │   │   ├── project.ts
        │   │   ├── experiment.ts
        │   │   ├── gamification.ts
        │   │   ├── organization.ts
        │   │   ├── user.ts
        │   │   ├── billing.ts
        │   │   ├── marketplace.ts
        │   │   └── admin.ts
        │   └── integrations/           # Client-side logic for external integrations (NEW)
        │       ├── whatsapp/           # WhatsApp Business API helpers
        │       ├── stripe/             # Stripe.js integration helpers
        │       └── analyticsService/   # Integration with external analytics platform
        │
        ├── styles/                     # Global styles and theming configuration
        │   ├── globals.css             # Global styles, Tailwind base/directives, CSS variables
        │   ├── fonts.ts                # Font definitions using next/font
        │   └── theme.config.ts         # Tailwind theme extensions (colors, spacing, etc.)
        │
        ├── locales/                    # Internationalization (i18n) files
        │   ├── en.json
        │   └── es.json
        │
        └── __tests__/                  # Testing configuration and mocks
            ├── jest.setup.ts           # Jest setup file
            ├── jest.config.js          # Jest configuration
            └── __mocks__/              # Mocks for libraries/modules
                ├── fileMock.js
                └── styleMock.js

```

## Detailed Explanations for V2 Additions/Changes

1.  **Documentation (`docs/`)**: Added placeholders for `MULTI_TENANCY.md`, `WHATSAPP_INTEGRATION.md`, and `PERFORMANCE_GUIDE.md` to reflect the need for documenting these critical aspects.
2.  **App Router (`app/`) Structure**:
    *   **Layouts**: Added more specific `layout.tsx` files within feature domains (e.g., `organizations`, `wellbeing`, `projects`, `gamification`, `marketplace`, `analytics`, `admin`, `settings`) to handle nested navigation and context specific to those areas.
    *   **Detailed Sub-Routes**: Added more granular routes based on `PAGE_LIST.MD` and required functionality (e.g., worker sub-details, journey versions/simulation, program message logs/journey progress, content versions/type-specific creation, detailed wellbeing/projects/gamification management, WhatsApp integration settings, admin system health details, analytics breakdowns, report builder).
    *   **API Routes (`api/`)**: Added specific examples for webhooks and potential tRPC usage.
3.  **Components (`components/features/`)**:
    *   **New Categories**: Added `multi-tenant/` and `whatsapp/` directories for components specifically related to these cross-cutting concerns.
    *   **Expanded Examples**: Added more specific component examples within each feature directory (e.g., Simulation Controls, AssessmentForm, ReportGenerator, WhatsAppTemplatePreview).
4.  **Hooks (`hooks/`)**:
    *   **New Utility Hooks**: Added `useFeatureFlag`, `useResponsive`.
    *   **New Feature Hooks**: Added `useWhatsAppApi` and expanded descriptions for others (e.g., journey builder state, experiment results).
5.  **State Management (`store/`)**: Introduced a dedicated `store/` directory (using Zustand as an example) for complex, cross-component state management, particularly for UI-heavy features like the Journey Builder, active program state, and experiment configuration.
6.  **Library (`lib/`)**:
    *   **API Endpoints**: Explicitly mentioned the need for comprehensive endpoint functions matching `PAGE_LIST.MD`. Added a specific `whatsapp.ts` endpoint file.
    *   **Utilities**: Added new utility files/categories: `tenant.ts`, `whatsapp.ts`, `analytics.ts`, `visualization.ts`.
    *   **Configuration**: Added `featureFlags.ts`.
    *   **Types**: Introduced `domain/` and `common.ts` subdirectories for better type organization.
    *   **Validation**: Ensured validation schemas cover all domains listed.
    *   **Integrations**: Added a client-side `integrations/` directory for helpers related to external services like Stripe.js or specific analytics platforms.
7.  **Internationalization (`locales/`)**: Added a standard directory for i18n files.
8.  **Testing (`__tests__/`)**: Included standard Jest configuration and mock directories. (Actual test files would ideally live alongside the code they test, e.g., in `src/components/ui/__tests__/button.test.tsx` or using a separate `tests/` root directory mirroring `src/`).

This V2 structure aims to be a comprehensive guide, reflecting the complexity and feature set of the ABCD Behavior Coach platform as described in the provided documents. 