# ABCD Frontend Build Repository Structure

## Overview

This document outlines the repository structure for the `abcd-frontend-build` directory at the root level. The structure is designed based on the specifications in the root `Repo.md` (specifically the "Next.js Pages" section), the `Behavioral-Coach-background/Docs/API & Pages.md` document, the general project rules provided, and inferred patterns from the existing root `src` directory. It utilizes the Next.js App Router and emphasizes a feature-first organization.

## Structure Benefits

- **Modern Next.js**: Leverages the App Router for improved layouts, loading states, and Server Components.
- **Feature-First Organization**: Groups components, hooks, and potentially styles by feature/domain for better maintainability and team collaboration (Rule 1.3).
- **Clear Separation of Concerns**: Distinct directories for UI components, hooks, API logic, utilities, configuration, and routing.
- **Scalability**: Designed to accommodate the growth of the platform by adding new features/domains within the established patterns.
- **Alignment with Documentation**: Directly maps to the pages and API endpoints outlined in `API & Pages.md` and the component/hook structure suggested in `Repo.md`.
- **Path Aliases**: Facilitates cleaner imports using aliases like `@components`, `@hooks`, `@lib` (Rule 1.4).
- **Minimal Context**: Adheres to the rule of using React Context sparingly for truly global state (Rule 4.1).

## Proposed Directory Structure

```
abcd-frontend-build/               # Root directory for the frontend build
    ├── .eslintrc.js                # ESLint configuration
    ├── .gitignore                  # Git ignore rules
    ├── .prettierrc.js              # Prettier configuration
    ├── next-env.d.ts               # Next.js environment types
    ├── next.config.js              # Next.js configuration (incl. redirects, env vars)
    ├── package.json                # Project dependencies and scripts
    ├── README.md                   # Frontend specific documentation
    ├── frontend-repo.md            # This file - repository structure documentation
    ├── tsconfig.json               # TypeScript configuration (incl. path aliases like @components/*)
    │
    ├── docs/                       # Comprehensive frontend documentation
    │   ├── ARCHITECTURE.md         # System architecture & technical foundation
    │   ├── COMPONENTS.md           # Design system & component library documentation
    │   ├── DEVELOPMENT_WORKFLOW.md # Development workflow & quality assurance
    │   ├── JOURNEY_BUILDER.md      # Journey builder implementation guide
    │   ├── PROGRAM_IMPLEMENTATION.md # Program management implementation guide
    │   ├── SEGMENTATION.md         # Audience & segmentation engine documentation
    │   ├── CONTENT_MANAGEMENT.md   # Content management system & templates
    │   ├── EXPERIMENTATION.md      # Analytics & experimentation framework
    │   ├── SPECIALIZED_FEATURES.md # Specialized features implementation (wellbeing, gamification, etc.)
    │   └── ACCESSIBILITY_GUIDE.md  # User experience & accessibility playbook
    │
    ├── public/                     # Static assets (favicon, fonts, images) - Mirrored from root /public
    │   ├── assets/
    │   └── fonts/
    │
    └── src/                        # Source code root
        ├── app/                    # Next.js App Router directory
        │   ├── layout.tsx          # Root layout (html, body tags)
        │   ├── page.tsx            # Root page (e.g., redirect to login or dashboard)
        │   │
        │   ├── (auth)/             # Authentication routes (Route Group - public)
        │   │   ├── layout.tsx      # Optional layout for auth pages
        │   │   ├── login/
        │   │   │   └── page.tsx    # LoginPage component defined elsewhere
        │   │   ├── register/
        │   │   │   └── page.tsx    # RegisterPage component
        │   │   ├── forgot-password/
        │   │   │   └── page.tsx    # ForgotPasswordPage component
        │   │   └── reset-password/
        │   │       └── page.tsx    # ResetPasswordPage component
        │   │
        │   ├── (app)/              # Main application routes (Route Group - requires auth)
        │   │   ├── layout.tsx      # Main application layout (e.g., with Sidebar, Header)
        │   │   │
        │   │   ├── dashboard/      # Main dashboard
        │   │   │   └── page.tsx    # DashboardPage component
        │   │   │
        │   │   ├── organizations/  # Organization management (accessible by Org Admins)
        │   │   │   ├── page.tsx       # Org settings overview page component (may combine settings/users/billing nav)
        │   │   │   ├── settings/      # Org settings page
        │   │   │   │   └── page.tsx
        │   │   │   ├── billing/       # Org billing page component
        │   │   │   │   ├── page.tsx   # Billing history/overview
        │   │   │   │   ├── methods/   # Payment methods
        │   │   │   │   │   └── page.tsx
        │   │   │   │   ├── usage/     # Detailed usage breakdown (replaces /organizations/me/usage endpoint call)
        │   │   │   │   │   └── page.tsx
        │   │   │   │   └── forecasts/ # Usage forecasts (new)
        │   │   │   │       └── page.tsx
        │   │   │   └── users/         # User management page component
        │   │   │       └── page.tsx
        │   │   │
        │   │   ├── workers/        # Worker/Audience Management
        │   │   │   ├── page.tsx       # WorkerListPage component
        │   │   │   ├── [workerId]/
        │   │   │   │   ├── page.tsx   # WorkerProfilePage component (overview)
        │   │   │   │   └── wellbeing/ # Worker-specific wellbeing details (new)
        │   │   │   │       └── page.tsx
        │   │   │   ├── create/
        │   │   │   │   └── page.tsx   # CreateWorkerPage component
        │   │   │   └── import/
        │   │   │       └── page.tsx   # ImportWorkersPage component
        │   │   │
        │   │   ├── segments/       # Segmentation Management
        │   │   │   ├── page.tsx       # SegmentListPage component
        │   │   │   ├── [segmentId]/
        │   │   │   │   └── page.tsx   # SegmentDetailPage component
        │   │   │   ├── create/
        │   │   │   │   └── page.tsx   # CreateSegmentPage (or redirect to builder)
        │   │   │   ├── builder/
        │   │   │   │   └── page.tsx   # SegmentBuilderPage component
        │   │   │   └── experiments/   # Optional: UI for segment-specific experiments
        │   │   │       └── ...
        │   │   │
        │   │   ├── journeys/       # Journey Blueprint Management
        │   │   │   ├── page.tsx       # JourneyListPage component
        │   │   │   ├── [journeyId]/
        │   │   │   │   └── page.tsx   # JourneyDetailPage component
        │   │   │   ├── create/
        │   │   │   │   └── page.tsx   # CreateJourneyPage component
        │   │   │   ├── builder/[journeyId]/ # Journey Builder UI
        │   │   │   │   └── page.tsx   # JourneyBuilderPage component
        │   │   │   └── experiments/   # Optional: UI for journey-specific experiments
        │   │   │       └── ...
        │   │   │
        │   │   ├── programs/       # Program Management
        │   │   │   ├── page.tsx       # ProgramListPage component
        │   │   │   ├── [programId]/
        │   │   │   │   ├── page.tsx   # ProgramDetailPage component (Overview, Workers Progress)
        │   │   │   │   ├── settings/  # Advanced program config (schedule, assignments) (clarified)
        │   │   │   │   │   └── page.tsx
        │   │   │   │   ├── follow-up/ # Follow-up rules config (new/clarified)
        │   │   │   │   │   └── page.tsx
        │   │   │   │   ├── conflicts/ # Conflict strategy config (new/clarified)
        │   │   │   │   │   └── page.tsx
        │   │   │   │   └── feedback/  # View worker feedback for this program (new/clarified)
        │   │   │   │       └── page.tsx
        │   │   │   ├── create/
        │   │   │   │   └── page.tsx   # CreateProgramPage component
        │   │   │   └── experiments/   # Optional: UI for program-specific experiments
        │   │   │       └── ...
        │   │   │
        │   │   ├── content/        # Content Management
        │   │   │   ├── page.tsx       # ContentLibraryPage component
        │   │   │   ├── [contentId]/
        │   │   │   │   └── page.tsx   # ContentDetailPage component
        │   │   │   ├── create/
        │   │   │   │   └── page.tsx   # CreateContentPage component
        │   │   │   ├── editor/[contentId]/
        │   │   │   │   └── page.tsx   # ContentEditorPage component
        │   │   │   ├── media/
        │   │   │   │   └── page.tsx   # MediaLibraryPage component (if needed)
        │   │   │   ├── templates/     # Content Template Management (clarified)
        │   │   │   │   ├── page.tsx   # List templates
        │   │   │   │   ├── [templateId]/
        │   │   │   │   │   └── page.tsx # View/Edit template
        │   │   │   │   ├── create/
        │   │   │   │   │   └── page.tsx # Create template
        │   │   │   │   └── approvals/ # WhatsApp HSM Approval Workflow UI (new)
        │   │   │   │       └── page.tsx
        │   │   │   └── experiments/   # Optional: UI for content-specific experiments
        │   │   │       └── ...
        │   │   │
        │   │   ├── wellbeing/      # Wellbeing Domain (NEW)
        │   │   │   ├── page.tsx       # Wellbeing Dashboard/Overview
        │   │   │   ├── indicators/    # Manage Wellbeing Indicators
        │   │   │   │   └── page.tsx
        │   │   │   ├── assessments/   # Manage Wellbeing Assessments
        │   │   │   │   ├── page.tsx   # List/Schedule Assessments
        │   │   │   │   ├── [assessmentId]/
        │   │   │   │   │   └── page.tsx # View Assessment Details/Results
        │   │   │   │   └── create/
        │   │   │   │       └── page.tsx # Create Assessment Template
        │   │   │   ├── interventions/ # Manage Wellbeing Interventions/Resources
        │   │   │   │   ├── page.tsx   # List Interventions/Resources
        │   │   │   │   ├── [interventionId]/
        │   │   │   │   │   └── page.tsx # View Intervention Details
        │   │   │   │   └── create/
        │   │   │   │       └── page.tsx # Create Intervention Template
        │   │   │   └── alerts/        # View Wellbeing Alerts
        │   │   │       └── page.tsx
        │   │   │
        │   │   ├── projects/       # Projects & Funders Domain (NEW)
        │   │   │   ├── page.tsx       # Project List Page
        │   │   │   ├── [projectId]/
        │   │   │   │   ├── page.tsx   # Project Detail/Overview
        │   │   │   │   ├── programs/  # View/Link Programs
        │   │   │   │   │   └── page.tsx
        │   │   │   │   ├── funders/   # View/Link Funders
        │   │   │   │   │   └── page.tsx
        │   │   │   │   ├── evidence/  # Manage Project Evidence
        │   │   │   │   │   └── page.tsx
        │   │   │   │   └── reporting/ # Project Reporting / Donor Reports
        │   │   │   │       └── page.tsx
        │   │   │   ├── create/
        │   │   │   │   └── page.tsx   # Create Project Page
        │   │   │   └── funders/       # Top-level Funder Management
        │   │   │       ├── page.tsx   # List Funders
        │   │   │       ├── [funderId]/
        │   │   │       │   └── page.tsx # View/Edit Funder Details
        │   │   │       └── create/
        │   │   │           └── page.tsx # Create Funder Page
        │   │   │
        │   │   ├── experiments/    # Top-level Experiment Management
        │   │   │   ├── page.tsx       # ExperimentListPage component
        │   │   │   ├── [experimentId]/
        │   │   │   │   └── page.tsx   # ExperimentDetailPage component
        │   │   │   └── create/
        │   │   │       └── page.tsx   # CreateExperimentPage component
        │   │   │
        │   │   ├── gamification/   # Gamification Configuration
        │   │   │   ├── page.tsx       # GamificationDashboardPage component
        │   │   │   ├── badges/
        │   │   │   │   └── page.tsx   # ManageBadgesPage component
        │   │   │   ├── challenges/
        │   │   │   │   └── page.tsx   # ManageChallengesPage component
        │   │   │   ├── leaderboards/
        │   │   │   │   └── page.tsx   # ManageLeaderboardsPage component
        │   │   │   ├── rewards/
        │   │   │   │   └── page.tsx   # ManageRewardsPage component
        │   │   │   └── experiments/   # Optional: UI for gamification experiments
        │   │   │       └── ...
        │   │   │
        │   │   ├── marketplace/    # Optional Marketplace UI
        │   │   │   ├── page.tsx       # MarketplaceBrowsePage component
        │   │   │   ├── listings/[listingId]/
        │   │   │   │   └── page.tsx   # MarketplaceListingDetailPage component
        │   │   │   ├── publish/
        │   │   │   │   └── page.tsx   # MarketplacePublishPage component
        │   │   │   └── acquisitions/
        │   │   │       └── page.tsx   # MarketplaceAcquisitionsPage component
        │   │   │
        │   │   ├── analytics/      # Analytics Dashboards
        │   │   │   ├── page.tsx       # AnalyticsMainDashboardPage component
        │   │   │   ├── workers/
        │   │   │   │   └── page.tsx   # AnalyticsWorkersPage component
        │   │   │   ├── journeys/
        │   │   │   │   └── page.tsx   # AnalyticsJourneysPage component
        │   │   │   ├── programs/
        │   │   │   │   └── page.tsx   # AnalyticsProgramsPage component
        │   │   │   ├── wellbeing/
        │   │   │   │   └── page.tsx   # AnalyticsWellbeingPage component
        │   │   │   ├── experiments/
        │   │   │   │   └── page.tsx   # AnalyticsExperimentsPage component
        │   │   │   └── reports/
        │   │   │       └── page.tsx   # AnalyticsReportsPage component
        │   │   │
        │   │   ├── admin/          # ABCD Platform Admin UI (if built here)
        │   │   │   ├── page.tsx       # AdminDashboardPage component
        │   │   │   ├── organizations/
        │   │   │   │   └── page.tsx   # AdminOrganizationsPage component
        │   │   │   ├── approvals/
        │   │   │   │   └── page.tsx   # AdminApprovalsPage component
        │   │   │   ├── resources/
        │   │   │   │   └── page.tsx   # AdminResourcesPage component
        │   │   │   ├── billing/
        │   │   │   │   └── page.tsx   # AdminBillingPage component
        │   │   │   ├── limits/
        │   │   │   │   └── page.tsx   # AdminLimitsPage component
        │   │   │   └── settings/
        │   │   │       └── page.tsx   # AdminSettingsPage component
        │   │   │
        │   │   ├── notifications/  # View Notifications (NEW)
        │   │   │   └── page.tsx       # NotificationListPage / History
        │   │   │
        │   │   └── settings/       # User/Organization Settings
        │   │       ├── page.tsx       # SettingsOverviewPage component
        │   │       ├── account/
        │   │       │   └── page.tsx   # SettingsAccountPage component
        │   │       ├── notifications/ # Notification Preferences (existing, renamed route slightly)
        │   │       │   └── page.tsx
        │   │       └── integrations/
        │   │           └── page.tsx   # SettingsIntegrationsPage component
        │   │
        │   ├── api/                    # Next.js API Routes (e.g., for NextAuth, BFF patterns)
        │   │   └── auth/
        │   │       └── [...nextauth]/
        │   │           └── route.ts    # NextAuth.js handler using App Router convention
        │   │
        │   ├── loading.tsx             # Root loading UI for the app routes
        │   ├── error.tsx               # Root error UI for the app routes
        │   └── global-error.tsx        # Global error boundary (catches errors in root layout)
        │
        ├── components/                 # Reusable UI components (grouped by feature)
        │   ├── ui/                     # Base UI primitives (inspired by Shadcn/ui)
        │   │   ├── button.tsx          # Reusable Button component
        │   │   ├── input.tsx           # Reusable Input component
        │   │   ├── card.tsx            # Reusable Card component
        │   │   ├── table.tsx           # Reusable Table component
        │   │   ├── modal.tsx           # Reusable Modal component
        │   │   ├── dropdown-menu.tsx   # Reusable Dropdown
        │   │   ├── select.tsx          # Reusable Select
        │   │   ├── checkbox.tsx        # Reusable Checkbox
        │   │   ├── date-picker.tsx     # Reusable Date Picker
        │   │   ├── data-table.tsx      # Enhanced Table (sorting, pagination)
        │   │   ├── radio-group.tsx     # Reusable Radio Group
        │   │   ├── toast.tsx           # Reusable Toast Notification
        │   │   ├── tooltip.tsx         # Reusable Tooltip
        │   │   ├── tabs.tsx            # Reusable Tabs
        │   │   ├── alert.tsx           # Reusable Alert
        │   │   ├── badge.tsx           # Reusable Badge
        │   │   ├── skeleton.tsx        # Reusable Skeleton Loader
        │   │
        │   ├── layout/                 # Layout-related components
        │   │   ├── AppShell.tsx        # Main application shell (combines Sidebar, Header, Content)
        │   │   ├── Sidebar.tsx         # Navigation sidebar
        │   │   ├── Header.tsx          # Top header bar
        │   │   └── PageHeader.tsx      # Standard header for pages with title/actions
        │   │
        │   ├── features/               # Feature-specific composite components
        │   │   ├── auth/               # Components for Authentication pages
        │   │   │   ├── LoginForm.tsx
        │   │   │   └── RegisterForm.tsx
        │   │   ├── organizations/      # Components for Organization management
        │   │   │   ├── OrganizationSettingsForm.tsx
        │   │   │   └── UserManagementTable.tsx
        │   │   ├── workers/            # Components for Worker management
        │   │   │   ├── WorkerList.tsx
        │   │   │   ├── WorkerProfileCard.tsx
        │   │   │   └── WorkerImportWizard.tsx
        │   │   ├── segments/           # Components for Segment management
        │   │   │   ├── SegmentList.tsx
        │   │   │   └── SegmentRuleBuilderUI.tsx
        │   │   ├── journeys/           # Components for Journey management
        │   │   │   ├── JourneyList.tsx
        │   │   │   ├── JourneyBuilderUI.tsx
        │   │   │   └── TouchpointCard.tsx
        │   │   ├── programs/           # Components for Program management
        │   │   │   ├── ProgramList.tsx
        │   │   │   └── ProgramDashboardWidgets.tsx
        │   │   ├── content/            # Components for Content management
        │   │   │   ├── ContentLibraryItem.tsx
        │   │   │   ├── ContentEditor.tsx
        │   │   │   ├── QuizPlayer.tsx
        │   │   │   └── TemplateManager.tsx # Component for template list/approval (new)
        │   │   ├── wellbeing/          # Components for Wellbeing features (NEW)
        │   │   │   ├── WellbeingDashboard.tsx
        │   │   │   ├── AssessmentForm.tsx
        │   │   │   └── IndicatorChart.tsx
        │   │   ├── projects/           # Components for Projects/Funders features (NEW)
        │   │   │   ├── ProjectList.tsx
        │   │   │   ├── FunderCard.tsx
        │   │   │   └── EvidenceUploader.tsx
        │   │   ├── experiments/        # Components for Experiment management
        │   │   │   ├── ExperimentCard.tsx
        │   │   │   ├── ExperimentSetupForm.tsx
        │   │   │   └── ResultsChart.tsx
        │   │   ├── gamification/       # Components for Gamification features
        │   │   │   ├── BadgeList.tsx   # List of badges
        │   │   │   ├── ChallengeCard.tsx # Card displaying a challenge
        │   │   │   └── LeaderboardTable.tsx
        │   │   ├── marketplace/        # Components for Marketplace features
        │   │   │   ├── ListingCard.tsx
        │   │   │   └── MarketplaceFilters.tsx
        │   │   ├── analytics/          # Components for Analytics dashboards
        │   │   │   ├── ReportChart.tsx
        │   │   │   └── MetricDisplay.tsx
        │   │   ├── admin/              # Components for Admin UI
        │   │   │   ├── AdminDataTable.tsx
        │   │   │   └── ApprovalQueueItem.tsx
        │   │   ├── billing/            # Components for Billing UI
        │   │   │   ├── InvoiceList.tsx
        │   │   │   ├── SubscriptionCard.tsx
        │   │   │   └── UsageChart.tsx  # Component for usage/forecasts (new)
        │   │   ├── notifications/      # Components for Notifications page (NEW)
        │   │   │   └── NotificationList.tsx
        │   │   └── settings/           # Components for Settings pages
        │   │       ├── AccountForm.tsx
        │   │       └── NotificationSettingsForm.tsx # Renamed for clarity
        │
        ├── hooks/                      # Custom React hooks (grouped by feature/domain)
        │   ├── useApi.ts               # Base hook for API calls (wraps react-query/SWR)
        │   ├── useAuth.ts              # Hook for accessing auth state/actions
        │   ├── useDebounce.ts          # Utility hook for debouncing input
        │   ├── useTableControls.ts     # Hook managing state for data tables (sort, filter, page)
        │   ├── useTenant.ts            # Hook for accessing tenant context
        │   │
        │   ├── features/               # Feature-specific hooks encapsulating logic
        │   │   ├── useWorkersApi.ts    # Custom hooks for worker data fetching/mutation
        │   │   ├── useSegmentsApi.ts   # Custom hooks for segment data/logic
        │   │   ├── useJourneysApi.ts   # Custom hooks for journey data/builder logic
        │   │   ├── useProgramsApi.ts   # Custom hooks for program data/logic
        │   │   ├── useContentApi.ts    # Custom hooks for content data/logic
        │   │   ├── useWellbeingApi.ts  # Custom hooks for wellbeing data (NEW)
        │   │   ├── useProjectsApi.ts   # Custom hooks for projects/funders data (NEW)
        │   │   ├── useExperimentsApi.ts# Custom hooks for experiment data/logic
        │   │   ├── useGamificationApi.ts # Custom hooks for gamification data
        │   │   ├── useAnalyticsApi.ts  # Custom hooks for analytics data
        │   │   ├── useNotificationsApi.ts# Custom hooks for notifications data (NEW)
        │   │   ├── useOrganizationApi.ts # Custom hooks for organization data
        │   │   ├── useUsersApi.ts      # Custom hooks for user management data
        │   │   ├── useBillingApi.ts    # Custom hooks for billing/subscription data
        │   │   ├── useMarketplaceApi.ts# Custom hooks for marketplace data
        │   │   └── useAdminApi.ts      # Custom hooks for admin data
        │   │   └── ...                 # Other domain-specific hooks as needed
        │
        ├── context/                    # React context providers (kept minimal)
        │   ├── AuthProvider.tsx        # Provides auth state, user info, login/logout functions
        │   ├── TenantProvider.tsx      # Provides current organization ID/context
        │   ├── ThemeProvider.tsx       # Manages UI theme (light/dark)
        │   └── AppSettingsProvider.tsx # Optional: For other genuinely global settings
        │
        ├── lib/                        # Core libraries, utilities, API clients, types
        │   ├── api/                    # API client configuration and endpoint definitions
        │   │   ├── client.ts           # Base fetch/axios instance, interceptors (auth, tenant)
        │   │   ├── endpoints/          # Functions making specific API calls, grouped by domain
        │   │   │   ├── auth.ts
        │   │   │   ├── workers.ts
        │   │   │   ├── segments.ts
        │   │   │   ├── journeys.ts
        │   │   │   ├── programs.ts
        │   │   │   ├── content.ts
        │   │   │   ├── wellbeing.ts    # Wellbeing API functions (NEW)
        │   │   │   ├── projects.ts     # Projects API functions (NEW)
        │   │   │   ├── experiments.ts  # Experiments API functions
        │   │   │   ├── gamification.ts # Gamification API functions
        │   │   │   ├── marketplace.ts  # Marketplace API functions
        │   │   │   ├── analytics.ts    # Analytics API functions
        │   │   │   ├── admin.ts        # Admin API functions
        │   │   │   ├── billing.ts      # Billing API functions
        │   │   │   └── organizations.ts # Organization API functions (includes users)
        │   │   └── types.ts            # Shared API type definitions (request/response bodies)
        │   │
        │   ├── constants.ts            # Application-wide constants (e.g., roles, limits)
        │   ├── utils.ts                # General utility functions (date formatting, string manipulation)
        │   ├── config.ts               # Frontend-specific configuration (e.g., feature flags read from env)
        │   ├── types/                  # Global TypeScript interfaces and types
        │   │   └── index.ts            # Exports all global types
        │   └── validation/             # Data validation schemas (e.g., using Zod)
        │       ├── auth.ts             # Validation schemas for auth forms
        │       ├── worker.ts           # Validation schemas for worker forms/import
        │       ├── segment.ts          # Validation schemas for segment creation
        │       ├── wellbeing.ts        # Validation schemas for wellbeing (NEW)
        │       ├── project.ts          # Validation schemas for projects (NEW)
        │       ├── program.ts          # Validation schemas for program creation
        │       ├── journey.ts          # Validation schemas for journey creation
        │       ├── content.ts          # Validation schemas for content creation
        │       ├── experiment.ts       # Validation schemas for experiment setup
        │       ├── gamification.ts     # Validation schemas for gamification setup
        │       ├── organization.ts     # Validation schemas for organization settings
        │       └── user.ts             # Validation schemas for user creation/invites
        │
        └── styles/                     # Global styles and theming configuration
            ├── globals.css             # Global styles, Tailwind base/directives
            └── theme.config.ts         # Configuration for theming (e.g., Tailwind theme extensions)

```

## Detailed Explanations

1.  **`src/app/` (App Router)**:
    *   Adopts the standard Next.js App Router for improved routing, layout composition, loading/error states, and potential use of Server Components.
    *   **Route Groups (`(auth)`, `(app)`)**: Separate public authentication pages from the main protected application sections without affecting URL paths. `(app)` has its own `layout.tsx` likely containing the main sidebar/header structure.
    *   **Page Mapping**: The directory structure directly maps to the required pages identified in `API & Pages.md`. Dynamic routes (`[workerId]`, `[segmentId]`, etc.) are used for detail pages. Each `page.tsx` will import and render the main component for that view (e.g., `LoginPage`, `WorkerListPage`).

2.  **`docs/` (Documentation)**:
    *   Contains 10 comprehensive documentation files each focused on a specific aspect of the frontend implementation.
    *   Documentation is maintained alongside code and follows the same version control process.
    *   Files are in Markdown format and limited to 1000 lines each for readability and maintainability.
    *   Covers everything from system architecture to accessibility guidelines, providing a complete reference for developers.

3.  **`src/components/`**:
    *   **`ui/`**: Contains base, unstyled or minimally styled primitive components (Button, Input, Card, etc.), often sourced from or inspired by libraries like Shadcn/ui or Radix UI. Promotes consistency.
    *   **`layout/`**: Holds components responsible for the overall page structure (Sidebar, Header, PageHeader, potentially an `AppShell` component combining these).
    *   **`features/`**: This is key for Rule 1.3 (Feature-First Organization). Composite components specific to a feature/domain (like `WorkerList`, `SegmentRuleBuilderUI`, `JourneyBuilderUI`) reside here, grouped by their respective feature. This makes finding feature-related UI code easier.

4.  **`src/hooks/`**:
    *   Contains general-purpose custom hooks (`useDebounce`, `useTableControls`).
    *   **`features/`**: Mirrors the component structure for feature-specific hooks (Rule 3.1). Hooks encapsulating API calls (`useWorkersApi`), complex UI state (`useJourneyBuilderState`), or domain-specific logic live here, grouped by feature. `useApi` likely wraps a data fetching library like `react-query` or `SWR`.

5.  **`src/context/`**:
    *   Used sparingly for global state (Rule 4.1). Authentication, Tenant ID, and potentially Theme are good candidates. Feature-specific state should typically be managed locally, via hooks, or state management libraries scoped to the feature if necessary.

6.  **`src/lib/`**:
    *   Acts as a central place for shared code that isn't components or hooks.
    *   **`api/`**: Defines how the frontend communicates with the backend. `client.ts` configures the base HTTP client (e.g., `fetch` or `axios`) with interceptors for adding auth tokens and potentially tenant IDs. `endpoints/` contains typed functions for each API call defined in `API & Pages.md`, making interactions predictable.
    *   **`validation/`**: Holds validation schemas (e.g., Zod) used for forms and API payloads (Rule 8.2).
    *   `utils.ts`, `constants.ts`, `types/`: Standard locations for shared utilities, constants, and global TypeScript types.

7.  **`src/styles/`**:
    *   `globals.css` is standard for global styles and Tailwind CSS setup. Component-level styles are ideally handled via Tailwind utility classes directly in the JSX or via CSS Modules co-located with their components (e.g., `WorkerList.module.css`).

8.  **Root Directory (`abcd-frontend-build/`)**:
    *   Contains standard project configuration files (`package.json`, `tsconfig.json`, `next.config.js`, linting/formatting configs).
    *   `tsconfig.json` will define path aliases (`@components/*`, `@hooks/*`, `@lib/*`, etc.) for cleaner imports (Rule 1.4).
    *   Includes this `frontend-repo.md` document and the docs directory with comprehensive documentation.

9.  **Wellbeing (`src/app/(app)/wellbeing/`, `src/components/features/wellbeing/`, `src/hooks/features/useWellbeingApi.ts` etc.)**:
    *   A top-level route group and corresponding component/hook/API structures for managing Wellbeing features as described in `Product Overview.md`. This includes pages for dashboards, configuring indicators, managing assessments and interventions, and viewing alerts. Worker-specific wellbeing details are accessible via a sub-route under the worker profile.

10. **Projects & Funders (`src/app/(app)/projects/`, `src/components/features/projects/`, `src/hooks/features/useProjectsApi.ts` etc.)**:
    *   A top-level route group and associated structures for managing Projects, linking Programs and Funders, collecting evidence, and generating donor-specific reports, addressing the requirements from `Product Overview.md`. Includes sub-routes for project details and top-level funder management.

11. **Notifications (`src/app/(app)/notifications/`, `src/components/features/notifications/`, `src/hooks/features/useNotificationsApi.ts` etc.)**:
    *   A dedicated page `/notifications` under the main app layout for viewing notification history. The existing `/settings/notifications` route is clarified to be specifically for *preference* management. Corresponding components and hooks are added.

12. **Content Templates (`src/app/(app)/content/templates/`)**:
    *   The structure under `/content` is clarified with a dedicated `/templates` sub-route. This includes pages for listing, creating, viewing/editing templates, and specifically a page for the WhatsApp HSM template approval workflow UI.

13. **Program Configuration (`src/app/(app)/programs/[programId]/...`)**:
    *   Sub-routes like `/settings`, `/follow-up`, `/conflicts`, and `/feedback` are added under the program detail page to provide explicit locations for managing advanced configuration aspects and viewing program-specific feedback, as mentioned in `Product Overview.md`.

14. **Billing Details (`src/app/(app)/organizations/billing/...`)**:
    *   Sub-routes `/usage` and `/forecasts` are added under the organization billing page to provide dedicated views for detailed usage breakdowns and forecasts, aligning better with `Product Overview.md` descriptions. Corresponding components (`UsageChart`) are noted.

This updated structure now more comprehensively reflects the feature set outlined in `Product Overview.md` by explicitly incorporating pages and organization for the Wellbeing and Projects/Funders domains, clarifying template management, and providing designated areas for advanced configurations and detailed views.

This structure provides a robust foundation for building the ABCD Behavior Coach frontend at the new location (`abcd-frontend-build/`), aligning with the provided requirements and promoting maintainability and scalability. 