# Projects and Funders

## Table of Contents
- [1. Overview](#1-overview)
- [2. Core Concepts](#2-core-concepts)
- [3. User Roles and Permissions](#3-user-roles-and-permissions)
- [4. Feature Integration](#4-feature-integration)
- [5. Data Model](#5-data-model)
- [6. API Integration](#6-api-integration)
- [7. UI Components and Pages](#7-ui-components-and-pages)
  - [7.1 Projects List Page](#71-projects-list-page)
  - [7.2 Project Creation Page](#72-project-creation-page)
  - [7.3 Project Detail Page](#73-project-detail-page)
  - [7.4 Project-Programs Page](#74-project-programs-page)
  - [7.5 Project-Funders Page](#75-project-funders-page)
  - [7.6 Project Evidence Page](#76-project-evidence-page)
  - [7.7 Project Reporting Page](#77-project-reporting-page)
  - [7.8 Funders List Page](#78-funders-list-page)
  - [7.9 Funder Creation Page](#79-funder-creation-page)
  - [7.10 Funder Detail Page](#710-funder-detail-page)
- [8. Analytics and Reporting](#8-analytics-and-reporting)
- [9. User Flows](#9-user-flows)
- [10. Testing Strategy](#10-testing-strategy)
- [11. Future Enhancements](#11-future-enhancements)

## 1. Overview
The Projects and Funders domain is a critical component of the ABCD Behavioral Coaching Platform that enables organizations to manage projects, track funding sources, demonstrate impact, and generate reports for donors or funders. This domain bridges the operational aspects of program execution with the strategic and financial elements of project management and donor relations.

Projects serve as organizational containers that group related programs together under a common objective, timeframe, and funding source. Funders represent external stakeholders who provide financial support for projects and require evidence of impact and outcomes.

This document provides comprehensive guidance for implementing the Projects and Funders features in the frontend application, detailing the necessary components, pages, API integrations, and user flows.

## 2. Core Concepts
Projects and Funders introduces several key concepts to the platform:

- **Projects**: Strategic initiatives with defined objectives, timelines, and funding sources. Projects typically encompass multiple programs and are used to organize and track outcomes at a higher level.

- **Funders**: External entities (donors, grant-makers, investors) who provide financial support to the organization's projects. Funders have specific reporting requirements and impact metrics they wish to track.

- **Evidence**: Qualitative and quantitative data that demonstrates the impact and outcomes of a project. Evidence can include testimonials, case studies, media files, and aggregated analytics.

- **Donor Reports**: Customized reports generated for specific funders, highlighting the outcomes, impact, and evidence relevant to their interests and investment.

## 3. User Roles and Permissions
The Projects and Funders domain includes specific role-based permissions to ensure appropriate access control and separation of duties. This section defines which user roles can access, create, modify, and report on projects and funders.

### 3.1 Organization Admin

Organization Admins have the highest level of access to Projects and Funders within their organization:

- **Projects Permissions**:
  - Create, edit, archive, and delete projects
  - View all projects within the organization
  - Link any program to any project
  - Access full project analytics and reporting
  - Generate and export donor reports
  - Manage evidence collection for all projects

- **Funders Permissions**:
  - Create, edit, and delete funder records
  - View all funders within the organization
  - Link funders to projects
  - Configure funder-specific reporting templates
  - Manage funder communication settings

### 3.2 Program Manager

Program Managers have significant access to projects but with some limitations on financial and strategic aspects:

- **Projects Permissions**:
  - View all projects within the organization
  - Create and edit projects (but cannot delete)
  - Link programs they manage to projects
  - Access project analytics and reporting
  - Generate donor reports for projects they manage
  - Contribute evidence to projects they're associated with

- **Funders Permissions**:
  - View funders linked to projects they manage
  - Cannot create or delete funder records
  - Request linking funders to projects (requires Admin approval in some cases)
  - Access funder-specific reporting templates
  - Generate reports for funders linked to their projects

### 3.3 Training Manager

Training Managers have limited access focused on content and journey aspects relevant to projects:

- **Projects Permissions**:
  - View projects that include programs with their journey blueprints
  - Cannot create, edit, or delete projects
  - Cannot link programs to projects
  - View limited project analytics related to journey effectiveness
  - Contribute evidence related to journey outcomes

- **Funders Permissions**:
  - View basic funder information for projects they contribute to
  - No ability to create, edit, or link funders
  - Limited access to funder reporting templates
  - No direct report generation capabilities

### 3.4 Content Specialist (Expert Organization)

Content Specialists in Expert Organizations have access only to projects that utilize their marketplace content:

- **Projects Permissions**:
  - View limited project information for projects using their content
  - Cannot create, edit, or delete projects
  - Access anonymized analytics on content effectiveness within projects
  - Contribute evidence related to their content's impact

- **Funders Permissions**:
  - No direct access to funder information
  - No ability to create, edit, or link funders
  - No access to funder reporting templates or report generation

### 3.5 Donor / Funder (Read-Only Access)

If enabled, external funders may receive limited read-only access to specific project information:

- **Projects Permissions**:
  - View only projects they are funding
  - Access to a customized dashboard showing project progress and outcomes
  - View evidence shared specifically with them
  - No ability to create, edit, or delete any information

- **Funders Permissions**:
  - View only their own funder profile
  - No ability to edit information
  - Access only to reports specifically generated for them

### 3.6 Permission Implementation Details

These role-based permissions are implemented through several mechanisms:

1. **Frontend Route Guards**:
   - Routes under `/projects` and `/funders` check user role before rendering
   - UI components adjust based on permissions (hiding action buttons, etc.)
   - Navigation items are filtered based on role

2. **API Authorization**:
   - Backend endpoints validate user role and permissions before processing requests
   - Endpoints return 403 Forbidden for unauthorized access attempts
   - Organization scoping ensures users only access their organization's data

3. **Action Buttons and UI Elements**:
   - Create/Edit/Delete buttons only appear for authorized roles
   - Tooltips explain why certain actions are unavailable when hovered
   - Form submissions validate permissions server-side as well as client-side

4. **Conditional Rendering**:
   - Sensitive information (financial details, funder contacts) only renders for appropriate roles
   - Analytics and metrics display different levels of detail based on role
   - Report generation options vary by role

## 4. Feature Integration

The Projects and Funders domain integrates with multiple other domains within the platform to provide a comprehensive project management and donor reporting solution. This section details the specific integrations with each domain and how they function together.

### 4.1 Integration with Programs Domain

The Programs domain is the most closely connected to Projects, as Programs represent the operational implementation of strategic Projects.

#### 4.1.1 Program Linking

- Projects can link to one or more Programs, establishing a parent-child relationship.
- Programs remain independently manageable but inherit project-level objectives and are included in project-level reporting.
- When viewing a Project, associated Programs appear with their key metrics and status.
- When viewing a Program, its associated Project is displayed with a link to navigate to the Project view.

#### 4.1.2 Data Flow

- **Program → Project**: Program completion rates, engagement metrics, and outcomes flow up to the Project level.
- **Project → Program**: Project objectives, funder requirements, and reporting needs flow down to Programs.

#### 4.1.3 Implementation Details

- The `/projects/{projectId}/programs` API endpoint manages the relationship.
- A linking UI within both Program and Project pages enables creating and managing the relationship.
- Programs can be associated with multiple Projects if needed, with a primary Project designation.
- Project analytics automatically incorporate data from linked Programs.

### 4.2 Integration with Organizations Domain

Projects and Funders exist within the context of an Organization and respect the multi-tenant architecture of the platform.

#### 4.2.1 Organizational Scoping

- All Projects and Funders are scoped to their parent Organization.
- Organization settings affect Project and Funder behavior (e.g., fiscal year settings, custom fields).
- Organization Admins have full access to manage Projects and Funders.

#### 4.2.2 Data Flow

- **Organization → Project**: Organization-level settings, custom fields, and access controls.
- **Project → Organization**: Project outcomes contribute to organization-level analytics.

#### 4.2.3 Implementation Details

- Every Project and Funder API request includes the `organization_id` for data isolation.
- Organization settings API provides configuration values used in Project management.
- Organization-level analytics incorporate aggregated Project data.

### 4.3 Integration with Workers Domain

Workers (audience members) are the ultimate beneficiaries of Projects, and their data is crucial for impact measurement.

#### 4.3.1 Worker Data Usage

- Worker engagement and outcome metrics from Programs are aggregated at the Project level.
- Worker demographics can be used to filter and segment Project analytics.
- Worker feedback and testimonials can be captured as Project Evidence.

#### 4.3.2 Data Flow

- **Worker → Project**: Individual and aggregated performance, well-being, and engagement metrics.
- **Project → Worker**: No direct flow, but Project priorities may influence Program delivery.

#### 4.3.3 Implementation Details

- Project analytics APIs access worker data through Program associations.
- Privacy controls ensure appropriate anonymization and aggregation of worker data.
- Evidence collection forms can reference specific workers with appropriate consent management.

### 4.4 Integration with Content and Journeys Domain

Content and Journey Blueprints are used within Programs linked to Projects, providing insight into effective approaches.

#### 4.4.1 Content Effectiveness

- Projects track which content and journey approaches were most effective across Programs.
- Content usage and effectiveness can be reported at the Project level.
- Project Evidence can showcase particularly effective content.

#### 4.4.2 Data Flow

- **Content/Journeys → Project**: Usage statistics, effectiveness metrics.
- **Project → Content/Journeys**: No direct flow, but project outcomes may inform content development.

#### 4.4.3 Implementation Details

- Project analytics incorporate content effectiveness data via Program relationships.
- Report generation includes options to highlight most effective content.
- Evidence collection tools can reference specific content or journeys.

### 4.5 Integration with Marketplace Domain

The Marketplace allows sharing and acquiring content, which can have implications for Project management and reporting.

#### 4.5.1 Marketplace Content in Projects

- Projects can track and report on the effectiveness of acquired marketplace content.
- Project Evidence may reference or credit content acquired from the Marketplace.
- Licensing costs for marketplace content can be associated with Project budgets.

#### 4.5.2 Data Flow

- **Marketplace → Project**: Content acquisition, licensing information.
- **Project → Marketplace**: Usage statistics, effectiveness metrics (anonymized).

#### 4.5.3 Implementation Details

- Project detail views show marketplace content usage.
- Project cost tracking includes marketplace licensing fees.
- Reporting to funders includes attribution of marketplace content where appropriate.

### 4.6 Integration with Analytics Domain

The Analytics domain provides the foundation for Project reporting and outcome measurement.

#### 4.6.1 Project-Level Analytics

- Projects have dedicated analytics views that aggregate data from associated Programs.
- Custom Project-specific metrics can be defined and tracked.
- Analytics views support filtering and segmentation specific to funder interests.

#### 4.6.2 Data Flow

- **Analytics → Project**: Processed metrics, visualizations, and insights.
- **Project → Analytics**: Project structure, objectives, and KPIs to be measured.

#### 4.6.3 Implementation Details

- Project analytics API endpoints provide aggregated data views.
- Custom report builders integrate with Projects data models.
- Real-time dashboards incorporate Project metrics.

### 4.7 Integration with Segmentation Domain

Segmentation allows for more nuanced analysis of Project outcomes across different audience groups.

#### 4.7.1 Segment-Level Project Outcomes

- Project outcomes can be analyzed by segment to identify differential impacts.
- Segments can be project-specific or cross-project.
- Funder reports often require segment-specific outcome reporting.

#### 4.7.2 Data Flow

- **Segmentation → Project**: Segment definitions, membership for analysis.
- **Project → Segmentation**: No direct flow, but project requirements may influence segmentation needs.

#### 4.7.3 Implementation Details

- Project analytics support segment-based filtering.
- Report builders include segment-specific views and comparisons.
- Evidence collection can be tagged with relevant segments.

### 4.8 Integration with Wellbeing Domain

Worker wellbeing data provides critical impact metrics for Projects focused on psychosocial outcomes.

#### 4.8.1 Wellbeing Metrics in Projects

- Projects can include wellbeing metrics as key performance indicators.
- Wellbeing improvements can be highlighted in funder reports.
- Wellbeing assessment tools can be deployed as part of Project evidence collection.

#### 4.8.2 Data Flow

- **Wellbeing → Project**: Aggregated wellbeing metrics, assessment results.
- **Project → Wellbeing**: No direct flow, but project objectives may influence wellbeing monitoring priorities.

#### 4.8.3 Implementation Details

- Project analytics incorporate wellbeing metrics from linked Programs.
- Report builders include wellbeing visualization options.
- Evidence collection includes wellbeing testimonials and case studies.

### 4.9 Integration with Experiments Domain

Experiments provide insights into optimizing project approaches and demonstrating impact.

#### 4.9.1 Experiments in Project Context

- Projects can include experiment results as evidence of iterative improvement.
- Experiment outcomes inform project strategy and future program design.
- Funders often value experimental approaches to demonstrating impact.

#### 4.9.2 Data Flow

- **Experiments → Project**: Experiment results, validated approaches.
- **Project → Experiments**: Strategic priorities that experiments should address.

#### 4.9.3 Implementation Details

- Project reporting includes experiment results.
- Evidence collection can reference experiment outcomes.
- Project analytics incorporate experiment variants and results.

### 4.10 Integration Architecture Summary

The Projects and Funders domain acts as a strategic layer that connects multiple operational domains. This integration is implemented through:

1. **Data Relationships**: Defined database relationships between entities (e.g., Project-Program links).
2. **API Endpoints**: Dedicated endpoints for managing relationships and accessing cross-domain data.
3. **UI Components**: Interface elements that visualize and manage these relationships.
4. **Analytics Pipeline**: Data flows that aggregate and analyze information across domains.
5. **Permission Model**: Cross-domain access controls that respect role-based permissions.

## 5. Data Model

This section describes the core data entities, their attributes, and relationships within the Projects and Funders domain. Understanding this data model is essential for frontend developers working with these features.

### 5.1 Core Entities

#### 5.1.1 Project Entity

The `Project` entity represents a strategic initiative with defined objectives, timelines, and associated funders and programs.

**Key Attributes:**
```typescript
interface Project {
  id: string;                 // UUID
  organization_id: string;    // Foreign key to Organization
  name: string;               // Project name
  description: string;        // Detailed description
  objectives: string[];       // Array of project objectives
  start_date: Date;           // Project start date
  end_date: Date;             // Project end date (planned or actual)
  status: ProjectStatus;      // Enum: 'planned', 'active', 'completed', 'archived'
  created_by: string;         // Foreign key to User who created
  updated_by: string;         // Foreign key to User who last updated
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
  total_budget?: number;      // Optional total budget amount
  currency_code?: string;     // Optional currency code (e.g., 'USD')
  custom_fields?: Record<string, any>; // Organization-specific custom fields
  tags?: string[];            // Optional tags for categorization
}

enum ProjectStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}
```

#### 5.1.2 Funder Entity

The `Funder` entity represents an external party providing financial or other support to projects.

**Key Attributes:**
```typescript
interface Funder {
  id: string;                 // UUID
  organization_id: string;    // Foreign key to Organization
  name: string;               // Funder name
  type: FunderType;           // Enum: 'donor', 'grant_provider', 'investor', 'partner'
  description?: string;       // Optional detailed description
  contact_name?: string;      // Optional primary contact person name
  contact_email?: string;     // Optional primary contact email
  contact_phone?: string;     // Optional primary contact phone
  website?: string;           // Optional funder website URL
  reporting_frequency?: ReportingFrequency; // Enum: 'monthly', 'quarterly', 'biannual', 'annual'
  reporting_requirements?: string; // Optional specific reporting requirements
  created_by: string;         // Foreign key to User who created
  updated_by: string;         // Foreign key to User who last updated
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
  custom_fields?: Record<string, any>; // Organization-specific custom fields
  tags?: string[];            // Optional tags for categorization
}

enum FunderType {
  DONOR = 'donor',
  GRANT_PROVIDER = 'grant_provider',
  INVESTOR = 'investor',
  PARTNER = 'partner'
}

enum ReportingFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual'
}
```

#### 5.1.3 ProjectFunder Entity (Join Table)

The `ProjectFunder` entity manages the many-to-many relationship between Projects and Funders, including funding-specific details.

**Key Attributes:**
```typescript
interface ProjectFunder {
  project_id: string;         // Foreign key to Project
  funder_id: string;          // Foreign key to Funder
  amount?: number;            // Optional funding amount
  currency_code?: string;     // Optional currency code (e.g., 'USD')
  start_date?: Date;          // Optional funding start date
  end_date?: Date;            // Optional funding end date
  status: FundingStatus;      // Enum: 'proposed', 'approved', 'active', 'completed'
  grant_reference?: string;   // Optional reference/ID for the grant
  notes?: string;             // Optional notes about the funding
  created_by: string;         // Foreign key to User who created
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
}

enum FundingStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
```

#### 5.1.4 ProjectProgram Entity (Join Table)

The `ProjectProgram` entity manages the many-to-many relationship between Projects and Programs.

**Key Attributes:**
```typescript
interface ProjectProgram {
  project_id: string;         // Foreign key to Project
  program_id: string;         // Foreign key to Program
  is_primary: boolean;        // Whether this is the primary project for the program
  allocation_percentage?: number; // Optional percentage of program allocated to this project
  created_by: string;         // Foreign key to User who created
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
}
```

#### 5.1.5 Evidence Entity

The `Evidence` entity represents qualitative or quantitative proof of project impact and outcomes.

**Key Attributes:**
```typescript
interface Evidence {
  id: string;                 // UUID
  project_id: string;         // Foreign key to Project
  type: EvidenceType;         // Enum: 'testimonial', 'case_study', 'media', 'metric', 'document'
  title: string;              // Short descriptive title
  description: string;        // Detailed description
  source?: string;            // Optional source information
  collected_date: Date;       // When the evidence was collected
  worker_id?: string;         // Optional foreign key to Worker (for testimonials)
  program_id?: string;        // Optional foreign key to Program (related program)
  media_url?: string;         // Optional URL to media file
  document_url?: string;      // Optional URL to document
  metrics_data?: Record<string, any>; // Optional structured metrics data
  is_public: boolean;         // Whether evidence can be shared publicly
  permission_status?: PermissionStatus; // Optional enum: 'pending', 'approved', 'denied'
  created_by: string;         // Foreign key to User who created
  updated_by: string;         // Foreign key to User who last updated
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
  tags?: string[];            // Optional tags for categorization
}

enum EvidenceType {
  TESTIMONIAL = 'testimonial',
  CASE_STUDY = 'case_study',
  MEDIA = 'media',
  METRIC = 'metric',
  DOCUMENT = 'document'
}

enum PermissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied'
}
```

#### 5.1.6 DonorReport Entity

The `DonorReport` entity represents a generated report for a specific funder about one or more projects.

**Key Attributes:**
```typescript
interface DonorReport {
  id: string;                 // UUID
  organization_id: string;    // Foreign key to Organization
  funder_id: string;          // Foreign key to Funder
  title: string;              // Report title
  description?: string;       // Optional description
  report_period_start: Date;  // Start of reporting period
  report_period_end: Date;    // End of reporting period
  generated_date: Date;       // When the report was generated
  report_url?: string;        // Optional URL to generated report file
  report_data?: Record<string, any>; // Optional structured report data
  status: ReportStatus;       // Enum: 'draft', 'submitted', 'approved'
  created_by: string;         // Foreign key to User who created
  updated_by: string;         // Foreign key to User who last updated
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
}

enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved'
}
```

#### 5.1.7 DonorReportProject Entity (Join Table)

The `DonorReportProject` entity links donor reports to the specific projects they cover.

**Key Attributes:**
```typescript
interface DonorReportProject {
  report_id: string;          // Foreign key to DonorReport
  project_id: string;         // Foreign key to Project
  created_at: Date;           // Creation timestamp
}
```

### 5.2 Entity Relationships

The Projects and Funders data model includes several key relationships:

1. **Organization to Projects/Funders**: One-to-many. Each Organization can have multiple Projects and Funders.

2. **Projects to Programs**: Many-to-many. A Project can include multiple Programs, and a Program can be associated with multiple Projects (though typically with a primary Project relationship).

3. **Projects to Funders**: Many-to-many. A Project can have multiple Funders, and a Funder can support multiple Projects.

4. **Projects to Evidence**: One-to-many. Each Project can have multiple pieces of Evidence.

5. **Funders to DonorReports**: One-to-many. Each Funder can have multiple DonorReports.

6. **DonorReports to Projects**: Many-to-many. A DonorReport can cover multiple Projects, and a Project can be included in multiple DonorReports.

**Entity Relationship Diagram (Simplified):**

```
Organization 1──* Project
Organization 1──* Funder

Project *──* Program (via ProjectProgram join table)
Project *──* Funder (via ProjectFunder join table)
Project 1──* Evidence

Funder 1──* DonorReport
DonorReport *──* Project (via DonorReportProject join table)
```

### 5.3 Data Validation

Frontend form validation should follow these rules for Projects and Funders data:

#### 5.3.1 Project Validation

```typescript
// Example Zod schema for Project validation
const projectSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10),
  objectives: z.array(z.string()).min(1),
  start_date: z.date(),
  end_date: z.date().min(z.lazy(() => startDate)),
  status: z.enum(['planned', 'active', 'completed', 'archived']),
  total_budget: z.number().positive().optional(),
  currency_code: z.string().length(3).optional(),
  tags: z.array(z.string()).optional()
});
```

#### 5.3.2 Funder Validation

```typescript
// Example Zod schema for Funder validation
const funderSchema = z.object({
  name: z.string().min(3).max(255),
  type: z.enum(['donor', 'grant_provider', 'investor', 'partner']),
  description: z.string().optional(),
  contact_email: z.string().email().optional(),
  website: z.string().url().optional(),
  reporting_frequency: z.enum(['monthly', 'quarterly', 'biannual', 'annual']).optional(),
  tags: z.array(z.string()).optional()
});
```

### 5.4 Frontend Data Management

The frontend should handle Project and Funder data using these patterns:

1. **Data Fetching**: Use `react-query` or similar for efficient data fetching, caching, and refetching.

```typescript
// Example React Query hook for Projects
export function useProjects() {
  return useQuery(['projects'], async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  });
}

// Example React Query hook for a single Project
export function useProject(projectId: string) {
  return useQuery(['project', projectId], async () => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  }, {
    enabled: !!projectId
  });
}
```

2. **Mutations**: Use mutation hooks for creating, updating, or deleting data.

```typescript
// Example mutation hook for creating a Project
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (newProject) => {
      const response = await apiClient.post('/projects', newProject);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      }
    }
  );
}
```

3. **Relationship Management**: Use specialized hooks for managing relationships.

```typescript
// Example hook for linking Programs to a Project
export function useLinkProgramsToProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ projectId, programIds }) => {
      const response = await apiClient.post(`/projects/${projectId}/programs`, {
        program_ids: programIds
      });
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['project', variables.projectId]);
        queryClient.invalidateQueries(['project-programs', variables.projectId]);
      }
    }
  );
}
```

### 5.5 Data Display Patterns

Frontend components should follow these patterns for displaying Projects and Funders data:

1. **Lists**: Use virtualized lists for large collections of Projects or Funders.
2. **Cards**: Display Project or Funder summaries in card components with key metrics.
3. **Detail Views**: Show comprehensive information with tabs for different sections (Overview, Programs, Funders, Evidence, etc.).
4. **Relationships**: Visualize relationships using charts, diagrams, or linked card components.
5. **Forms**: Implement multi-step forms for complex data entry (Project creation with Programs and Funders linking).

## 6. API Integration

This section details the API endpoints required to implement the Projects and Funders domain, the expected request/response formats, and recommended frontend implementation approaches.

### 6.1 Projects API Endpoints

#### 6.1.1 List Projects

**Endpoint**: `GET /api/v1/projects`

**Description**: Retrieves a paginated list of projects for the current organization.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (`planned`, `active`, `completed`, `archived`)
- `search`: Search term to filter by name or description
- `start_date_from`: Filter projects starting after this date
- `start_date_to`: Filter projects starting before this date
- `end_date_from`: Filter projects ending after this date
- `end_date_to`: Filter projects ending before this date
- `funder_id`: Filter projects associated with a specific funder
- `sort_by`: Field to sort by (default: `updated_at`)
- `sort_order`: Sort direction (`asc` or `desc`, default: `desc`)

**Example Response**:
```json
{
  "data": [
    {
      "id": "project-123",
      "name": "Rural Health Initiative",
      "description": "Improving health outcomes in rural communities",
      "status": "active",
      "start_date": "2023-01-15T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "created_at": "2023-01-10T15:30:45Z",
      "updated_at": "2023-06-22T09:15:30Z",
      "funder_count": 2,
      "program_count": 3,
      "total_budget": 120000,
      "currency_code": "USD",
      "tags": ["health", "rural"]
    }
    // Additional projects...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 45,
    "total_pages": 3
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getProjects(params: ProjectQueryParams = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryString.append(key, String(value));
  });
  
  const response = await apiClient.get(`/projects?${queryString.toString()}`);
  return response.data;
}

// React Query hook
export function useProjects(params: ProjectQueryParams = {}) {
  return useQuery(
    ['projects', params],
    () => getProjects(params),
    {
      keepPreviousData: true,
      staleTime: 30000 // 30 seconds
    }
  );
}
```

#### 6.1.2 Create Project

**Endpoint**: `POST /api/v1/projects`

**Description**: Creates a new project.

**Request Body**:
```json
{
  "name": "Rural Health Initiative",
  "description": "Improving health outcomes in rural communities",
  "objectives": [
    "Increase access to healthcare in rural areas",
    "Train community health workers",
    "Improve maternal health outcomes"
  ],
  "start_date": "2023-01-15T00:00:00Z",
  "end_date": "2024-12-31T00:00:00Z",
  "status": "planned",
  "total_budget": 120000,
  "currency_code": "USD",
  "tags": ["health", "rural"],
  "custom_fields": {
    "priority_level": "high",
    "impact_area": "healthcare"
  }
}
```

**Example Response**:
```json
{
  "data": {
    "id": "project-123",
    "name": "Rural Health Initiative",
    "description": "Improving health outcomes in rural communities",
    "objectives": [
      "Increase access to healthcare in rural areas",
      "Train community health workers",
      "Improve maternal health outcomes"
    ],
    "start_date": "2023-01-15T00:00:00Z",
    "end_date": "2024-12-31T00:00:00Z",
    "status": "planned",
    "created_by": "user-456",
    "updated_by": "user-456",
    "created_at": "2023-08-15T10:30:45Z",
    "updated_at": "2023-08-15T10:30:45Z",
    "total_budget": 120000,
    "currency_code": "USD",
    "tags": ["health", "rural"],
    "custom_fields": {
      "priority_level": "high",
      "impact_area": "healthcare"
    }
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function createProject(projectData: CreateProjectRequest) {
  const response = await apiClient.post('/projects', projectData);
  return response.data;
}

// React Query mutation hook
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (projectData: CreateProjectRequest) => createProject(projectData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
        showSuccessToast('Project created successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to create project');
        console.error('Project creation error:', error);
      }
    }
  );
}
```

#### 6.1.3 Get Project Details

**Endpoint**: `GET /api/v1/projects/{projectId}`

**Description**: Retrieves detailed information about a specific project.

**Example Response**:
```json
{
  "data": {
    "id": "project-123",
    "name": "Rural Health Initiative",
    "description": "Improving health outcomes in rural communities",
    "objectives": [
      "Increase access to healthcare in rural areas",
      "Train community health workers",
      "Improve maternal health outcomes"
    ],
    "start_date": "2023-01-15T00:00:00Z",
    "end_date": "2024-12-31T00:00:00Z",
    "status": "active",
    "created_by": {
      "id": "user-456",
      "name": "Jane Smith"
    },
    "updated_by": {
      "id": "user-789",
      "name": "John Doe"
    },
    "created_at": "2023-01-10T15:30:45Z",
    "updated_at": "2023-06-22T09:15:30Z",
    "total_budget": 120000,
    "currency_code": "USD",
    "tags": ["health", "rural"],
    "custom_fields": {
      "priority_level": "high",
      "impact_area": "healthcare"
    },
    "metrics": {
      "program_count": 3,
      "worker_count": 150,
      "completion_rate": 68.5,
      "evidence_count": 12
    }
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getProject(projectId: string) {
  const response = await apiClient.get(`/projects/${projectId}`);
  return response.data;
}

// React Query hook
export function useProject(projectId: string) {
  return useQuery(
    ['project', projectId],
    () => getProject(projectId),
    {
      enabled: !!projectId,
      staleTime: 30000
    }
  );
}
```

#### 6.1.4 Update Project

**Endpoint**: `PATCH /api/v1/projects/{projectId}`

**Description**: Updates an existing project.

**Request Body** (partial updates supported):
```json
{
  "name": "Expanded Rural Health Initiative",
  "status": "active",
  "end_date": "2025-06-30T00:00:00Z",
  "total_budget": 150000
}
```

**Example Response**:
```json
{
  "data": {
    "id": "project-123",
    "name": "Expanded Rural Health Initiative",
    "description": "Improving health outcomes in rural communities",
    "objectives": [
      "Increase access to healthcare in rural areas",
      "Train community health workers",
      "Improve maternal health outcomes"
    ],
    "start_date": "2023-01-15T00:00:00Z",
    "end_date": "2025-06-30T00:00:00Z",
    "status": "active",
    "updated_by": "user-789",
    "updated_at": "2023-08-15T14:25:10Z",
    "total_budget": 150000,
    "currency_code": "USD"
    // Other fields remain unchanged
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function updateProject(projectId: string, updateData: UpdateProjectRequest) {
  const response = await apiClient.patch(`/projects/${projectId}`, updateData);
  return response.data;
}

// React Query mutation hook
export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation(
    (updateData: UpdateProjectRequest) => updateProject(projectId, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId]);
        queryClient.invalidateQueries(['projects']);
        showSuccessToast('Project updated successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to update project');
        console.error('Project update error:', error);
      }
    }
  );
}
```

#### 6.1.5 Delete Project

**Endpoint**: `DELETE /api/v1/projects/{projectId}`

**Description**: Archives or deletes a project. This may be a soft delete for data integrity.

**Example Response**:
```json
{
  "success": true,
  "message": "Project successfully deleted"
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function deleteProject(projectId: string) {
  const response = await apiClient.delete(`/projects/${projectId}`);
  return response.data;
}

// React Query mutation hook
export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (projectId: string) => deleteProject(projectId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
        showSuccessToast('Project deleted successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to delete project');
        console.error('Project deletion error:', error);
      }
    }
  );
}
```

#### 6.1.6 Get Project Programs

**Endpoint**: `GET /api/v1/projects/{projectId}/programs`

**Description**: Retrieves programs associated with a specific project.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by program status

**Example Response**:
```json
{
  "data": [
    {
      "program_id": "program-789",
      "name": "Community Health Worker Training",
      "status": "active",
      "start_date": "2023-02-01T00:00:00Z",
      "end_date": "2023-12-31T00:00:00Z",
      "is_primary": true,
      "allocation_percentage": 100,
      "metrics": {
        "worker_count": 75,
        "completion_rate": 72.5
      }
    }
    // Additional programs...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 3,
    "total_pages": 1
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getProjectPrograms(projectId: string, params = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryString.append(key, String(value));
  });
  
  const response = await apiClient.get(`/projects/${projectId}/programs?${queryString.toString()}`);
  return response.data;
}

// React Query hook
export function useProjectPrograms(projectId: string, params = {}) {
  return useQuery(
    ['project-programs', projectId, params],
    () => getProjectPrograms(projectId, params),
    {
      enabled: !!projectId,
      keepPreviousData: true
    }
  );
}
```

#### 6.1.7 Link Programs to Project

**Endpoint**: `POST /api/v1/projects/{projectId}/programs`

**Description**: Links one or more programs to a specific project.

**Request Body**:
```json
{
  "program_ids": ["program-789", "program-456"],
  "primary_program_id": "program-789"
}
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "project_id": "project-123",
      "program_id": "program-789",
      "is_primary": true,
      "created_at": "2023-08-15T15:30:20Z"
    },
    {
      "project_id": "project-123",
      "program_id": "program-456",
      "is_primary": false,
      "created_at": "2023-08-15T15:30:20Z"
    }
  ]
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function linkProgramsToProject(projectId: string, data: { program_ids: string[], primary_program_id?: string }) {
  const response = await apiClient.post(`/projects/${projectId}/programs`, data);
  return response.data;
}

// React Query mutation hook
export function useLinkProgramsToProject(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: { program_ids: string[], primary_program_id?: string }) => 
      linkProgramsToProject(projectId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project-programs', projectId]);
        queryClient.invalidateQueries(['project', projectId]);
        showSuccessToast('Programs linked to project successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to link programs to project');
        console.error('Program linking error:', error);
      }
    }
  );
}
```

### 6.2 Funders API Endpoints

#### 6.2.1 List Funders

**Endpoint**: `GET /api/v1/funders`

**Description**: Retrieves a paginated list of funders for the current organization.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Filter by funder type
- `search`: Search term to filter by name or description
- `project_id`: Filter funders associated with a specific project
- `sort_by`: Field to sort by (default: `name`)
- `sort_order`: Sort direction (`asc` or `desc`, default: `asc`)

**Example Response**:
```json
{
  "data": [
    {
      "id": "funder-123",
      "name": "Global Health Foundation",
      "type": "donor",
      "description": "Supporting health initiatives worldwide",
      "contact_name": "Alice Johnson",
      "website": "https://globalhealthfoundation.org",
      "reporting_frequency": "quarterly",
      "created_at": "2023-01-05T12:30:45Z",
      "updated_at": "2023-06-10T09:45:30Z",
      "project_count": 3,
      "tags": ["health", "global"]
    }
    // Additional funders...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 15,
    "total_pages": 1
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getFunders(params: FunderQueryParams = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryString.append(key, String(value));
  });
  
  const response = await apiClient.get(`/funders?${queryString.toString()}`);
  return response.data;
}

// React Query hook
export function useFunders(params: FunderQueryParams = {}) {
  return useQuery(
    ['funders', params],
    () => getFunders(params),
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  );
}
```

#### 6.2.2 Create Funder

**Endpoint**: `POST /api/v1/funders`

**Description**: Creates a new funder record.

**Request Body**:
```json
{
  "name": "Global Health Foundation",
  "type": "donor",
  "description": "Supporting health initiatives worldwide",
  "contact_name": "Alice Johnson",
  "contact_email": "alice@globalhealthfoundation.org",
  "contact_phone": "+1-555-123-4567",
  "website": "https://globalhealthfoundation.org",
  "reporting_frequency": "quarterly",
  "reporting_requirements": "Detailed outcome metrics with testimonials",
  "tags": ["health", "global"],
  "custom_fields": {
    "preferred_language": "English",
    "donation_currency": "USD"
  }
}
```

**Example Response**:
```json
{
  "data": {
    "id": "funder-123",
    "name": "Global Health Foundation",
    "type": "donor",
    "description": "Supporting health initiatives worldwide",
    "contact_name": "Alice Johnson",
    "contact_email": "alice@globalhealthfoundation.org",
    "contact_phone": "+1-555-123-4567",
    "website": "https://globalhealthfoundation.org",
    "reporting_frequency": "quarterly",
    "reporting_requirements": "Detailed outcome metrics with testimonials",
    "created_by": "user-456",
    "updated_by": "user-456",
    "created_at": "2023-08-15T16:42:30Z",
    "updated_at": "2023-08-15T16:42:30Z",
    "tags": ["health", "global"],
    "custom_fields": {
      "preferred_language": "English",
      "donation_currency": "USD"
    }
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function createFunder(funderData: CreateFunderRequest) {
  const response = await apiClient.post('/funders', funderData);
  return response.data;
}

// React Query mutation hook
export function useCreateFunder() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (funderData: CreateFunderRequest) => createFunder(funderData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['funders']);
        showSuccessToast('Funder created successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to create funder');
        console.error('Funder creation error:', error);
      }
    }
  );
}
```

#### 6.2.3 Get Funder Details

**Endpoint**: `GET /api/v1/funders/{funderId}`

**Description**: Retrieves detailed information about a specific funder.

**Example Response**:
```json
{
  "data": {
    "id": "funder-123",
    "name": "Global Health Foundation",
    "type": "donor",
    "description": "Supporting health initiatives worldwide",
    "contact_name": "Alice Johnson",
    "contact_email": "alice@globalhealthfoundation.org",
    "contact_phone": "+1-555-123-4567",
    "website": "https://globalhealthfoundation.org",
    "reporting_frequency": "quarterly",
    "reporting_requirements": "Detailed outcome metrics with testimonials",
    "created_by": {
      "id": "user-456",
      "name": "Jane Smith"
    },
    "updated_by": {
      "id": "user-789",
      "name": "John Doe"
    },
    "created_at": "2023-01-05T12:30:45Z",
    "updated_at": "2023-06-10T09:45:30Z",
    "tags": ["health", "global"],
    "custom_fields": {
      "preferred_language": "English",
      "donation_currency": "USD"
    },
    "metrics": {
      "project_count": 3,
      "total_funding": 350000,
      "currency_code": "USD",
      "active_projects": 2
    }
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getFunder(funderId: string) {
  const response = await apiClient.get(`/funders/${funderId}`);
  return response.data;
}

// React Query hook
export function useFunder(funderId: string) {
  return useQuery(
    ['funder', funderId],
    () => getFunder(funderId),
    {
      enabled: !!funderId,
      staleTime: 30000
    }
  );
}
```

#### 6.2.4 Update Funder

**Endpoint**: `PATCH /api/v1/funders/{funderId}`

**Description**: Updates an existing funder record.

**Request Body** (partial updates supported):
```json
{
  "contact_email": "newalice@globalhealthfoundation.org",
  "reporting_frequency": "monthly",
  "reporting_requirements": "Updated requirements with more detailed metrics"
}
```

**Example Response**:
```json
{
  "data": {
    "id": "funder-123",
    "name": "Global Health Foundation",
    "contact_email": "newalice@globalhealthfoundation.org",
    "reporting_frequency": "monthly",
    "reporting_requirements": "Updated requirements with more detailed metrics",
    "updated_by": "user-789",
    "updated_at": "2023-08-15T17:05:10Z"
    // Other fields remain unchanged
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function updateFunder(funderId: string, updateData: UpdateFunderRequest) {
  const response = await apiClient.patch(`/funders/${funderId}`, updateData);
  return response.data;
}

// React Query mutation hook
export function useUpdateFunder(funderId: string) {
  const queryClient = useQueryClient();
  
  return useMutation(
    (updateData: UpdateFunderRequest) => updateFunder(funderId, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['funder', funderId]);
        queryClient.invalidateQueries(['funders']);
        showSuccessToast('Funder updated successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to update funder');
        console.error('Funder update error:', error);
      }
    }
  );
}
```

#### 6.2.5 Delete Funder

**Endpoint**: `DELETE /api/v1/funders/{funderId}`

**Description**: Deletes a funder record. This may be a soft delete for data integrity.

**Example Response**:
```json
{
  "success": true,
  "message": "Funder successfully deleted"
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function deleteFunder(funderId: string) {
  const response = await apiClient.delete(`/funders/${funderId}`);
  return response.data;
}

// React Query mutation hook
export function useDeleteFunder() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (funderId: string) => deleteFunder(funderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['funders']);
        showSuccessToast('Funder deleted successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to delete funder');
        console.error('Funder deletion error:', error);
      }
    }
  );
}
```

### 6.3 Project-Funder Relationship API Endpoints

#### 6.3.1 Get Project Funders

**Endpoint**: `GET /api/v1/projects/{projectId}/funders`

**Description**: Retrieves funders associated with a specific project.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Filter by funder type

**Example Response**:
```json
{
  "data": [
    {
      "funder_id": "funder-123",
      "name": "Global Health Foundation",
      "type": "donor",
      "amount": 100000,
      "currency_code": "USD",
      "start_date": "2023-01-15T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "status": "active",
      "grant_reference": "GHF-2023-0456"
    }
    // Additional funders...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 2,
    "total_pages": 1
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getProjectFunders(projectId: string, params = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryString.append(key, String(value));
  });
  
  const response = await apiClient.get(`/projects/${projectId}/funders?${queryString.toString()}`);
  return response.data;
}

// React Query hook
export function useProjectFunders(projectId: string, params = {}) {
  return useQuery(
    ['project-funders', projectId, params],
    () => getProjectFunders(projectId, params),
    {
      enabled: !!projectId,
      keepPreviousData: true
    }
  );
}
```

#### 6.3.2 Link Funders to Project

**Endpoint**: `POST /api/v1/projects/{projectId}/funders`

**Description**: Links one or more funders to a specific project.

**Request Body**:
```json
{
  "funders": [
    {
      "funder_id": "funder-123",
      "amount": 100000,
      "currency_code": "USD",
      "start_date": "2023-01-15T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "status": "active",
      "grant_reference": "GHF-2023-0456",
      "notes": "Primary funding source for rural activities"
    },
    {
      "funder_id": "funder-456",
      "amount": 50000,
      "currency_code": "USD",
      "status": "proposed"
    }
  ]
}
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "project_id": "project-123",
      "funder_id": "funder-123",
      "amount": 100000,
      "currency_code": "USD",
      "start_date": "2023-01-15T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "status": "active",
      "grant_reference": "GHF-2023-0456",
      "notes": "Primary funding source for rural activities",
      "created_at": "2023-08-15T17:30:20Z"
    },
    {
      "project_id": "project-123",
      "funder_id": "funder-456",
      "amount": 50000,
      "currency_code": "USD",
      "status": "proposed",
      "created_at": "2023-08-15T17:30:20Z"
    }
  ]
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function linkFundersToProject(projectId: string, data: { funders: ProjectFunderLink[] }) {
  const response = await apiClient.post(`/projects/${projectId}/funders`, data);
  return response.data;
}

// React Query mutation hook
export function useLinkFundersToProject(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: { funders: ProjectFunderLink[] }) => linkFundersToProject(projectId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project-funders', projectId]);
        queryClient.invalidateQueries(['project', projectId]);
        showSuccessToast('Funders linked to project successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to link funders to project');
        console.error('Funder linking error:', error);
      }
    }
  );
}
```

### 6.4 Evidence API Endpoints

#### 6.4.1 List Project Evidence

**Endpoint**: `GET /api/v1/projects/{projectId}/evidence`

**Description**: Retrieves evidence items associated with a specific project.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Filter by evidence type (`testimonial`, `case_study`, `media`, `metric`, `document`)
- `search`: Search term to filter by title or description
- `is_public`: Filter by public status (`true` or `false`)

**Example Response**:
```json
{
  "data": [
    {
      "id": "evidence-123",
      "type": "testimonial",
      "title": "Community Health Worker Testimonial",
      "description": "Positive feedback from a trained community health worker",
      "collected_date": "2023-06-15T00:00:00Z",
      "worker_id": "worker-789",
      "worker_name": "James Wilson",
      "program_id": "program-456",
      "program_name": "Community Health Worker Training",
      "is_public": true,
      "created_at": "2023-06-16T10:30:45Z",
      "tags": ["training", "success-story"]
    }
    // Additional evidence items...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 12,
    "total_pages": 1
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getProjectEvidence(projectId: string, params = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryString.append(key, String(value));
  });
  
  const response = await apiClient.get(`/projects/${projectId}/evidence?${queryString.toString()}`);
  return response.data;
}

// React Query hook
export function useProjectEvidence(projectId: string, params = {}) {
  return useQuery(
    ['project-evidence', projectId, params],
    () => getProjectEvidence(projectId, params),
    {
      enabled: !!projectId,
      keepPreviousData: true
    }
  );
}
```

#### 6.4.2 Create Evidence

**Endpoint**: `POST /api/v1/projects/{projectId}/evidence`

**Description**: Creates a new evidence item for a project.

**Request Body**:
```json
{
  "type": "testimonial",
  "title": "Community Health Worker Testimonial",
  "description": "Positive feedback from a trained community health worker",
  "source": "Interview conducted by Program Manager",
  "collected_date": "2023-06-15T00:00:00Z",
  "worker_id": "worker-789",
  "program_id": "program-456",
  "is_public": true,
  "tags": ["training", "success-story"]
}
```

**Example Response**:
```json
{
  "data": {
    "id": "evidence-123",
    "project_id": "project-123",
    "type": "testimonial",
    "title": "Community Health Worker Testimonial",
    "description": "Positive feedback from a trained community health worker",
    "source": "Interview conducted by Program Manager",
    "collected_date": "2023-06-15T00:00:00Z",
    "worker_id": "worker-789",
    "program_id": "program-456",
    "is_public": true,
    "created_by": "user-456",
    "updated_by": "user-456",
    "created_at": "2023-08-15T18:15:30Z",
    "updated_at": "2023-08-15T18:15:30Z",
    "tags": ["training", "success-story"]
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function createEvidence(projectId: string, evidenceData: CreateEvidenceRequest) {
  const response = await apiClient.post(`/projects/${projectId}/evidence`, evidenceData);
  return response.data;
}

// React Query mutation hook
export function useCreateEvidence(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation(
    (evidenceData: CreateEvidenceRequest) => createEvidence(projectId, evidenceData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project-evidence', projectId]);
        queryClient.invalidateQueries(['project', projectId]);
        showSuccessToast('Evidence added successfully');
      },
      onError: (error) => {
        showErrorToast('Failed to add evidence');
        console.error('Evidence creation error:', error);
      }
    }
  );
}
```

### 6.5 Donor Report API Endpoints

#### 6.5.1 List Donor Reports

**Endpoint**: `GET /api/v1/donors/{funderId}/reports`

**Description**: Retrieves reports generated for a specific funder.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by report status (`draft`, `submitted`, `approved`)
- `project_id`: Filter by specific project

**Example Response**:
```json
{
  "data": [
    {
      "id": "report-123",
      "title": "Q2 2023 Progress Report",
      "description": "Quarterly progress report for Global Health Foundation",
      "report_period_start": "2023-04-01T00:00:00Z",
      "report_period_end": "2023-06-30T00:00:00Z",
      "generated_date": "2023-07-10T14:30:00Z",
      "status": "submitted",
      "report_url": "https://example.com/reports/report-123.pdf",
      "created_at": "2023-07-10T14:30:00Z",
      "updated_at": "2023-07-10T14:30:00Z",
      "project_count": 2
    }
    // Additional reports...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 4,
    "total_pages": 1
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function getDonorReports(funderId: string, params = {}) {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) queryString.append(key, String(value));
  });
  
  const response = await apiClient.get(`/donors/${funderId}/reports?${queryString.toString()}`);
  return response.data;
}

// React Query hook
export function useDonorReports(funderId: string, params = {}) {
  return useQuery(
    ['donor-reports', funderId, params],
    () => getDonorReports(funderId, params),
    {
      enabled: !!funderId,
      keepPreviousData: true
    }
  );
}
```

#### 6.5.2 Generate Donor Report

**Endpoint**: `POST /api/v1/projects/{projectId}/reports/donor/{funderId}`

**Description**: Generates a report for a specific funder about a project.

**Request Body**:
```json
{
  "title": "Q2 2023 Progress Report",
  "description": "Quarterly progress report for Global Health Foundation",
  "report_period_start": "2023-04-01T00:00:00Z",
  "report_period_end": "2023-06-30T00:00:00Z",
  "sections": ["overview", "progress", "financials", "challenges", "next_steps"],
  "include_evidence_types": ["testimonial", "metric", "media"],
  "format": "pdf"
}
```

**Example Response**:
```json
{
  "data": {
    "id": "report-123",
    "title": "Q2 2023 Progress Report",
    "description": "Quarterly progress report for Global Health Foundation",
    "report_period_start": "2023-04-01T00:00:00Z",
    "report_period_end": "2023-06-30T00:00:00Z",
    "generated_date": "2023-08-15T18:45:10Z",
    "status": "draft",
    "report_url": "https://example.com/reports/report-123.pdf",
    "created_by": "user-456",
    "created_at": "2023-08-15T18:45:10Z",
    "updated_at": "2023-08-15T18:45:10Z"
  }
}
```

**Frontend Implementation**:
```typescript
// API client function
export async function generateDonorReport(
  projectId: string, 
  funderId: string, 
  reportData: GenerateReportRequest
) {
  const response = await apiClient.post(`/projects/${projectId}/reports/donor/${funderId}`, reportData);
  return response.data;
}

// React Query mutation hook
export function useGenerateDonorReport(projectId: string, funderId: string) {
  return useMutation(
    (reportData: GenerateReportRequest) => generateDonorReport(projectId, funderId, reportData),
    {
      onSuccess: (data) => {
        showSuccessToast('Report generated successfully');
        // Potentially open the report in a new tab
        if (data.data?.report_url) {
          window.open(data.data.report_url, '_blank');
        }
      },
      onError: (error) => {
        showErrorToast('Failed to generate report');
        console.error('Report generation error:', error);
      }
    }
  );
}
```

### 6.6 API Endpoint Summary

The Projects and Funders domain requires the following API endpoints:

1. **Projects**:
   - `GET /projects` - List projects
   - `POST /projects` - Create project
   - `GET /projects/{projectId}` - Get project details
   - `PATCH /projects/{projectId}` - Update project
   - `DELETE /projects/{projectId}` - Delete project
   - `GET /projects/{projectId}/programs` - Get project programs
   - `POST /projects/{projectId}/programs` - Link programs to project

2. **Funders**:
   - `GET /funders` - List funders
   - `POST /funders` - Create funder
   - `GET /funders/{funderId}` - Get funder details
   - `PATCH /funders/{funderId}` - Update funder
   - `DELETE /funders/{funderId}` - Delete funder

3. **Project-Funder Relationships**:
   - `GET /projects/{projectId}/funders` - Get project funders
   - `POST /projects/{projectId}/funders` - Link funders to project

4. **Evidence**:
   - `GET /projects/{projectId}/evidence` - List project evidence
   - `POST /projects/{projectId}/evidence` - Create evidence
   - `GET /projects/{projectId}/evidence/{evidenceId}` - Get evidence details
   - `PATCH /projects/{projectId}/evidence/{evidenceId}` - Update evidence
   - `DELETE /projects/{projectId}/evidence/{evidenceId}` - Delete evidence

5. **Donor Reports**:
   - `GET /donors/{funderId}/reports` - List donor reports
   - `POST /projects/{projectId}/reports/donor/{funderId}` - Generate donor report
   - `GET /donors/{funderId}/reports/{reportId}` - Get report details

## 7. UI Components and Pages

This section provides detailed specifications for the user interface components and pages required to implement the Projects and Funders domain. Each page is described with its purpose, layout, components, interactions, and responsive design considerations.

### 7.1 Projects List Page

The Projects List Page serves as the main entry point to the Projects and Funders domain, displaying all projects within the organization with filtering and sorting capabilities.

#### 7.1.1 Page Specifications

**Route**: `/projects`  
**Layout**: `src/app/(app)/projects/page.tsx`  
**Access Control**: Available to Organization Admins and Program Managers; read-only for Training Managers.

#### 7.1.2 Page Layout

The Projects List Page follows a standard layout structure with the following elements:

```
+-------------------------------------------------------+
| [Page Header with title, search, and action buttons]  |
+-------------------------------------------------------+
| [Filter Panel]                                        |
+-------------------------------------------------------+
| [Projects Grid/List View Toggle]                      |
+-------------------------------------------------------+
| [Projects Data Display (Grid or List)]                |
|                                                       |
|  +---------------------+  +---------------------+     |
|  | Project Card        |  | Project Card        |     |
|  +---------------------+  +---------------------+     |
|                                                       |
|  +---------------------+  +---------------------+     |
|  | Project Card        |  | Project Card        |     |
|  +---------------------+  +---------------------+     |
|                                                       |
+-------------------------------------------------------+
| [Pagination Controls]                                 |
+-------------------------------------------------------+
```

#### 7.1.3 Main Components

##### PageHeader Component

The page header contains the title, search functionality, and primary action buttons.

```tsx
// src/components/features/projects/ProjectsPageHeader.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function ProjectsPageHeader() {
  const router = useRouter();
  const canCreateProject = usePermissions('projects.create');
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-muted-foreground">Manage your organization's projects and their funding</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
        <Input 
          type="search" 
          placeholder="Search projects..." 
          className="w-full sm:w-[250px]"
          onChange={(e) => {/* Handle search */}}
        />
        
        {canCreateProject && (
          <Button 
            variant="primary" 
            onClick={() => router.push('/projects/create')}
          >
            Create Project
          </Button>
        )}
      </div>
    </div>
  );
}
```

##### FilterPanel Component

The filter panel allows users to filter projects by various criteria.

```tsx
// src/components/features/projects/ProjectsFilterPanel.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

export function ProjectsFilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    status: '',
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
    funderId: ''
  });
  
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleReset = () => {
    const resetFilters = {
      status: '',
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      funderId: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={[
                { label: 'All', value: '' },
                { label: 'Planned', value: 'planned' },
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
                { label: 'Archived', value: 'archived' }
              ]}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date From</label>
            <DatePicker
              value={filters.startDateFrom}
              onChange={(date) => handleFilterChange('startDateFrom', date)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date To</label>
            <DatePicker
              value={filters.startDateTo}
              onChange={(date) => handleFilterChange('startDateTo', date)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Funder</label>
            <FunderSelect
              value={filters.funderId}
              onChange={(value) => handleFilterChange('funderId', value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={handleReset} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

##### ProjectCard Component

Each project is displayed as a card with key information and actions.

```tsx
// src/components/features/projects/ProjectCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MoreVertical, Calendar, Users, CreditCard } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: 'planned' | 'active' | 'completed' | 'archived';
    start_date: string;
    end_date: string;
    funder_count: number;
    program_count: number;
    total_budget?: number;
    currency_code?: string;
    tags?: string[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const canEditProject = usePermissions('projects.edit');
  const canDeleteProject = usePermissions('projects.delete');
  
  const statusColors = {
    planned: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-purple-100 text-purple-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  
  const handleViewProject = () => {
    router.push(`/projects/${project.id}`);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={statusColors[project.status] || 'bg-gray-100'}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          
          {(canEditProject || canDeleteProject) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEditProject && (
                  <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/edit`)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {canDeleteProject && (
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mt-2 cursor-pointer hover:text-primary" onClick={handleViewProject}>
          {project.name}
        </h3>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {project.program_count} Program{project.program_count !== 1 ? 's' : ''}
            </span>
          </div>
          
          {project.total_budget && (
            <div className="flex items-center gap-2 col-span-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Budget: {formatCurrency(project.total_budget, project.currency_code || 'USD')}
              </span>
            </div>
          )}
        </div>
        
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" onClick={handleViewProject}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
```

##### ProjectList Component

The projects data can be displayed as a list for more compact viewing.

```tsx
// src/components/features/projects/ProjectList.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: Array<{
    id: string;
    name: string;
    status: 'planned' | 'active' | 'completed' | 'archived';
    start_date: string;
    end_date: string;
    funder_count: number;
    program_count: number;
    total_budget?: number;
    currency_code?: string;
  }>;
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  
  const statusColors = {
    planned: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-purple-100 text-purple-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  
  const handleRowClick = (projectId) => {
    router.push(`/projects/${projectId}`);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Programs</TableHead>
            <TableHead>Funders</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {projects.map(project => (
            <TableRow 
              key={project.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(project.id)}
            >
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>
                <Badge className={statusColors[project.status] || 'bg-gray-100'}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(project.start_date)} - {formatDate(project.end_date)}
              </TableCell>
              <TableCell>{project.program_count}</TableCell>
              <TableCell>{project.funder_count}</TableCell>
              <TableCell>
                {project.total_budget
                  ? formatCurrency(project.total_budget, project.currency_code || 'USD')
                  : '-'}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${project.id}`);
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No projects found. Try adjusting your filters or create a new project.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

##### Projects Page Implementation

The main page component that combines all these elements:

```tsx
// src/app/(app)/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ProjectsPageHeader } from "@/components/features/projects/ProjectsPageHeader";
import { ProjectsFilterPanel } from "@/components/features/projects/ProjectsFilterPanel";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { ProjectList } from "@/components/features/projects/ProjectList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/features/useProjectsApi";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, List } from "lucide-react";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12
  });
  
  const { data, isLoading, isError } = useProjects({
    ...filters,
    page: pagination.page,
    limit: pagination.limit
  });
  
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };
  
  return (
    <div className="container mx-auto py-6">
      <ProjectsPageHeader />
      
      <ProjectsFilterPanel onFilterChange={handleFilterChange} />
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {data?.pagination?.total_items
            ? `Showing ${data.pagination.total_items} projects`
            : 'Loading projects...'}
        </div>
        
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load projects. Please try again later.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data?.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
              
              {data?.data?.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No projects found. Try adjusting your filters or create a new project.</p>
                </div>
              )}
            </div>
          ) : (
            <ProjectList projects={data?.data || []} />
          )}
          
          {(data?.pagination?.total_pages || 0) > 1 && (
            <Pagination
              className="mt-6"
              currentPage={pagination.page}
              totalPages={data?.pagination?.total_pages || 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
```

#### 7.1.4 Responsive Design Considerations

The Projects List Page is designed to be fully responsive:

1. **Mobile View (< 640px)**:
   - Header stacks elements vertically (title and search/action buttons).
   - Filter panel stacks all filters in a single column.
   - Grid view shows one card per row, full width.
   - List view switches to a more compact representation with fewer columns.

2. **Tablet View (640px - 1024px)**:
   - Header displays horizontally with title on left, actions on right.
   - Filter panel shows filters in 2-3 columns.
   - Grid view shows two cards per row.
   - List view retains all columns but with compact styling.

3. **Desktop View (> 1024px)**:
   - Full layout as designed.
   - Grid view shows three cards per row.
   - List view shows all columns with comfortable spacing.

#### 7.1.5 State Management

The Projects List Page manages several pieces of state:

1. **View Mode**: Toggling between grid and list views.
2. **Filters**: Managing filter criteria for projects.
3. **Pagination**: Tracking current page and items per page.
4. **Project Data**: Fetched from the API using React Query.

#### 7.1.6 Error States

The page handles several error states:

1. **Loading State**: Displays skeleton loaders while data is being fetched.
2. **Empty State**: Shows appropriate messaging when no projects match the filters.
3. **Error State**: Displays an error message with retry option if API request fails.

#### 7.1.7 Accessibility Considerations

The Projects List Page implements these accessibility features:

1. **Keyboard Navigation**: Fully navigable via keyboard, with logical tab order.
2. **Screen Reader Support**: Proper aria labels and roles on interactive elements.
3. **Color Contrast**: All text meets WCAG AA standards for contrast.
4. **Focus Indicators**: Visible focus states for keyboard navigation.
5. **Responsive Text Sizing**: Text scales appropriately at different viewport sizes.

### 7.2 Project Creation Page

The Project Creation Page allows users to define a new project with all required details, objectives, timeline, and potentially link it to funders and programs.

#### 7.2.1 Page Specifications

**Route**: `/projects/create`  
**Layout**: `src/app/(app)/projects/create/page.tsx`  
**Access Control**: Available to Organization Admins and Program Managers.

#### 7.2.2 Page Layout

The Project Creation Page follows a multi-step form layout with the following structure:

```
+-------------------------------------------------------+
| [Page Header with title and navigation controls]      |
+-------------------------------------------------------+
| [Progress Indicator showing current step]             |
+-------------------------------------------------------+
| [Step Content]                                        |
|                                                       |
|   Step 1: Basic Information                           |
|   - Project name, description, objectives             |
|                                                       |
|   Step 2: Timeline & Budget                           |
|   - Start/end dates, budget amount, currency          |
|                                                       |
|   Step 3: Link Funders (Optional)                     |
|   - Select funders, add funding details               |
|                                                       |
|   Step 4: Link Programs (Optional)                    |
|   - Select programs to include in this project        |
|                                                       |
|   Step 5: Review                                      |
|   - Review all information before submission          |
|                                                       |
+-------------------------------------------------------+
| [Navigation Buttons (Previous, Next, Submit)]         |
+-------------------------------------------------------+
```

#### 7.2.3 Main Components

##### CreateProjectHeader Component

The header displays the page title and provides navigation back to the projects list.

```tsx
// src/components/features/projects/CreateProjectHeader.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateProjectHeader() {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between p-4 mb-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/projects')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Create New Project</h1>
          <p className="text-muted-foreground">Define a new strategic initiative for your organization</p>
        </div>
      </div>
    </div>
  );
}
```

##### ProjectFormStepper Component

The stepper shows progress through the multi-step form and allows navigation between steps.

```tsx
// src/components/features/projects/ProjectFormStepper.tsx
import { CheckIcon } from "lucide-react";

interface StepItem {
  id: number;
  label: string;
}

interface ProjectFormStepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function ProjectFormStepper({
  steps,
  currentStep,
  onStepClick
}: ProjectFormStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {/* Connecting line */}
        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-muted -z-10" />
        
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center cursor-pointer ${
              step.id < currentStep
                ? "text-primary"
                : step.id === currentStep
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                step.id < currentStep
                  ? "bg-primary border-primary text-white"
                  : step.id === currentStep
                  ? "bg-white border-primary"
                  : "bg-white border-muted"
              }`}
            >
              {step.id < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

##### BasicInfoStep Component

The first step collects basic project information.

```tsx
// src/components/features/projects/steps/BasicInfoStep.tsx
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DynamicObjectivesList } from "@/components/features/projects/DynamicObjectivesList";

export function BasicInfoStep() {
  const { control } = useFormContext();
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Project Name</FormLabel>
                <Input {...field} placeholder="e.g., Rural Health Initiative" />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Description</FormLabel>
                <Textarea
                  {...field}
                  placeholder="Describe the purpose and scope of this project"
                  rows={4}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <h3 className="text-base font-medium mb-2">Project Objectives</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Define the key outcomes this project aims to achieve
            </p>
            
            <FormField
              control={control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <DynamicObjectivesList
                    objectives={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <div className="flex flex-wrap gap-2">
                  <TagsInput
                    tags={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add a tag and press Enter"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

##### TimelineBudgetStep Component

The second step collects timeline and budget information.

```tsx
// src/components/features/projects/steps/TimelineBudgetStep.tsx
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function TimelineBudgetStep() {
  const { control, watch } = useFormContext();
  const startDate = watch('start_date');
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Start Date</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>End Date</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    minDate={startDate ? new Date(startDate) : undefined}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Initial Status</FormLabel>
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: 'Planned', value: 'planned' },
                    { label: 'Active', value: 'active' }
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="total_budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget (Optional)</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber || '')}
                    placeholder="e.g., 150000"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="currency_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    value={field.value || 'USD'}
                    onChange={field.onChange}
                    options={[
                      { label: 'USD - US Dollar', value: 'USD' },
                      { label: 'EUR - Euro', value: 'EUR' },
                      { label: 'GBP - British Pound', value: 'GBP' },
                      // Add more currencies as needed
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

##### LinkFundersStep Component

The third step allows linking funders to the project.

```tsx
// src/components/features/projects/steps/LinkFundersStep.tsx
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFunders } from "@/hooks/features/useProjectsApi";
import { FunderSelectionTable } from "@/components/features/projects/FunderSelectionTable";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewFunderForm } from "@/components/features/funders/NewFunderForm";

export function LinkFundersStep() {
  const { control, setValue, watch } = useFormContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const selectedFunders = watch('funders') || [];
  
  const { data: fundersData, isLoading } = useFunders();
  const funders = fundersData?.data || [];
  
  const handleFunderCreate = (newFunder) => {
    setIsCreateDialogOpen(false);
    // The new funder would typically be returned from the API and added to the list
    // This would also be handled by React Query cache updates
  };
  
  const handleFundersChange = (selectedFunders) => {
    setValue('funders', selectedFunders, { shouldValidate: true });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Link Funders</CardTitle>
            <CardDescription>
              Associate funders with this project to track funding sources
            </CardDescription>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Funder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Funder</DialogTitle>
              </DialogHeader>
              <NewFunderForm onSuccess={handleFunderCreate} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {funders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No funders found in your organization.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Create Your First Funder
                </Button>
              </div>
            ) : (
              <FunderSelectionTable
                funders={funders}
                selectedFunders={selectedFunders}
                onChange={handleFundersChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

##### LinkProgramsStep Component

The fourth step allows linking existing programs to the project.

```tsx
// src/components/features/projects/steps/LinkProgramsStep.tsx
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePrograms } from "@/hooks/features/useProgramsApi";
import { ProgramSelectionTable } from "@/components/features/projects/ProgramSelectionTable";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export function LinkProgramsStep() {
  const router = useRouter();
  const { control, setValue, watch } = useFormContext();
  
  const selectedPrograms = watch('programs') || [];
  
  const { data: programsData, isLoading } = usePrograms({
    status: 'active,planned' // Only show active or planned programs
  });
  const programs = programsData?.data || [];
  
  const handleProgramsChange = (selectedPrograms) => {
    setValue('programs', selectedPrograms, { shouldValidate: true });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Link Programs</CardTitle>
            <CardDescription>
              Connect existing programs to this project for unified tracking and reporting
            </CardDescription>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/programs')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage Programs
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {programs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No active or planned programs found in your organization.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/programs/create')}
                >
                  Create a New Program
                </Button>
              </div>
            ) : (
              <ProgramSelectionTable
                programs={programs}
                selectedPrograms={selectedPrograms}
                onChange={handleProgramsChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

##### ReviewStep Component

The final step shows a summary of all entered information for review before submission.

```tsx
// src/components/features/projects/steps/ReviewStep.tsx
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ReviewStep() {
  const { watch } = useFormContext();
  
  const {
    name,
    description,
    objectives,
    tags,
    start_date,
    end_date,
    status,
    total_budget,
    currency_code,
    funders,
    programs
  } = watch();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Project Details</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-base font-medium mb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Project Name</div>
              <div className="font-medium">{name}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge>{status}</Badge>
            </div>
            
            <div className="col-span-full">
              <div className="text-sm text-muted-foreground">Description</div>
              <div>{description}</div>
            </div>
            
            <div className="col-span-full">
              <div className="text-sm text-muted-foreground">Objectives</div>
              <ul className="list-disc list-inside">
                {objectives?.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
            
            {tags?.length > 0 && (
              <div className="col-span-full">
                <div className="text-sm text-muted-foreground">Tags</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-base font-medium mb-2">Timeline & Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Start Date</div>
              <div>{formatDate(start_date)}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">End Date</div>
              <div>{formatDate(end_date)}</div>
            </div>
            
            {total_budget && (
              <div>
                <div className="text-sm text-muted-foreground">Budget</div>
                <div>{formatCurrency(total_budget, currency_code || 'USD')}</div>
              </div>
            )}
          </div>
        </div>
        
        {funders?.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-base font-medium mb-2">Linked Funders</h3>
              <ul className="space-y-1">
                {funders.map(funder => (
                  <li key={funder.funder_id} className="flex items-center justify-between">
                    <span>{funder.name}</span>
                    {funder.amount && (
                      <Badge variant="outline">
                        {formatCurrency(funder.amount, funder.currency_code || currency_code || 'USD')}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        
        {programs?.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-base font-medium mb-2">Linked Programs</h3>
              <ul className="space-y-1">
                {programs.map(program => (
                  <li key={program.program_id}>{program.name}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

##### Create Project Page Implementation

The main page component that manages the multi-step form:

```tsx
// src/app/(app)/projects/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateProjectHeader } from "@/components/features/projects/CreateProjectHeader";
import { ProjectFormStepper } from "@/components/features/projects/ProjectFormStepper";
import { BasicInfoStep } from "@/components/features/projects/steps/BasicInfoStep";
import { TimelineBudgetStep } from "@/components/features/projects/steps/TimelineBudgetStep";
import { LinkFundersStep } from "@/components/features/projects/steps/LinkFundersStep";
import { LinkProgramsStep } from "@/components/features/projects/steps/LinkProgramsStep";
import { ReviewStep } from "@/components/features/projects/steps/ReviewStep";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/features/useProjectsApi";

// Form validation schema (using Zod)
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  start_date: z.date(),
  end_date: z.date().min(z.lazy(() => new Date()), "End date must be in the future"),
  status: z.enum(["planned", "active"]),
  total_budget: z.number().positive().optional(),
  currency_code: z.string().length(3).optional(),
  tags: z.array(z.string()).optional(),
  funders: z
    .array(
      z.object({
        funder_id: z.string(),
        name: z.string(),
        amount: z.number().positive().optional(),
        currency_code: z.string().length(3).optional(),
        status: z.enum(["proposed", "approved", "active"]).optional()
      })
    )
    .optional(),
  programs: z
    .array(
      z.object({
        program_id: z.string(),
        name: z.string(),
        is_primary: z.boolean().optional()
      })
    )
    .optional()
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const steps = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Timeline" },
  { id: 3, label: "Funders" },
  { id: 4, label: "Programs" },
  { id: 5, label: "Review" }
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "planned",
      objectives: [""],
      currency_code: "USD",
      funders: [],
      programs: []
    }
  });
  
  const { mutate: createProject, isLoading: isSubmitting } = useCreateProject();
  
  const onSubmit = (data: ProjectFormValues) => {
    const payload = {
      ...data,
      // Transform data as needed for the API
      funders: data.funders?.map(f => ({
        funder_id: f.funder_id,
        amount: f.amount,
        currency_code: f.currency_code,
        status: f.status || "proposed"
      })),
      programs: data.programs?.map(p => ({
        program_id: p.program_id,
        is_primary: p.is_primary || false
      }))
    };
    
    createProject(payload, {
      onSuccess: (response) => {
        toast.success("Project created successfully");
        router.push(`/projects/${response.data.id}`);
      },
      onError: (error) => {
        toast.error("Failed to create project. Please try again.");
        console.error("Project creation error:", error);
      }
    });
  };
  
  const goToStep = (step: number) => {
    // Only allow going to steps that are valid (previous steps are complete)
    const isValid = validateStepsUpTo(step - 1);
    if (isValid || step < currentStep) {
      setCurrentStep(step);
    }
  };
  
  const validateStepsUpTo = (stepNumber: number) => {
    let isValid = true;
    
    // Define which fields need to be validated for each step
    const fieldsToValidateByStep = {
      1: ["name", "description", "objectives"],
      2: ["start_date", "end_date", "status"],
      3: [], // Funders are optional
      4: []  // Programs are optional
    };
    
    // Validate all steps up to the specified step
    for (let i = 1; i <= stepNumber; i++) {
      const fields = fieldsToValidateByStep[i];
      if (fields.length > 0) {
        const stepValid = methods.trigger(fields as any);
        isValid = isValid && stepValid;
      }
    }
    
    return isValid;
  };
  
  const goToNext = async () => {
    // For steps before the last one, validate current step and move forward
    if (currentStep < steps.length) {
      const fieldsToValidate = currentStep === 1
        ? ["name", "description", "objectives"]
        : currentStep === 2
        ? ["start_date", "end_date", "status"]
        : [];
      
      const isStepValid = fieldsToValidate.length > 0
        ? await methods.trigger(fieldsToValidate as any)
        : true;
      
      if (isStepValid) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
    
    // On the last step, submit the form
    if (currentStep === steps.length) {
      methods.handleSubmit(onSubmit)();
    }
  };
  
  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <CreateProjectHeader />
      
      <FormProvider {...methods}>
        <form>
          <ProjectFormStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
          
          <div className="mb-8">
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <TimelineBudgetStep />}
            {currentStep === 3 && <LinkFundersStep />}
            {currentStep === 4 && <LinkProgramsStep />}
            {currentStep === 5 && <ReviewStep />}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              type="button"
              onClick={goToNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  {currentStep === steps.length ? 'Creating...' : 'Next'}
                </>
              ) : (
                currentStep === steps.length ? 'Create Project' : 'Next'
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
```

#### 7.2.4 Supporting Components

##### DynamicObjectivesList Component

Allows adding and removing project objectives.

```tsx
// src/components/features/projects/DynamicObjectivesList.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface DynamicObjectivesListProps {
  objectives: string[];
  onChange: (objectives: string[]) => void;
}

export function DynamicObjectivesList({
  objectives = [""],
  onChange
}: DynamicObjectivesListProps) {
  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    onChange(newObjectives);
  };
  
  const handleAddObjective = () => {
    onChange([...objectives, ""]);
  };
  
  const handleRemoveObjective = (index: number) => {
    if (objectives.length > 1) {
      const newObjectives = objectives.filter((_, i) => i !== index);
      onChange(newObjectives);
    }
  };
  
  return (
    <div className="space-y-2">
      {objectives.map((objective, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={objective}
            onChange={(e) => handleObjectiveChange(index, e.target.value)}
            placeholder={`Objective ${index + 1}`}
            className="flex-grow"
          />
          {objectives.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveObjective(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
          {index === objectives.length - 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddObjective}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

##### TagsInput Component

Allows adding and removing project tags.

```tsx
// src/components/features/projects/TagsInput.tsx
import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagsInput({
  tags = [],
  onChange,
  placeholder = "Add tag..."
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Prevent duplicates
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        onChange(newTags);
        setInputValue("");
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };
  
  return (
    <div className="flex flex-wrap gap-2 w-full p-2 border rounded-md bg-background">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => removeTag(tag)}
          />
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
```

##### FunderSelectionTable Component

Displays funders with selection controls and funding details.

```tsx
// src/components/features/projects/FunderSelectionTable.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Funder {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface SelectedFunder {
  funder_id: string;
  name: string;
  amount?: number;
  currency_code?: string;
  status?: 'proposed' | 'approved' | 'active';
}

interface FunderSelectionTableProps {
  funders: Funder[];
  selectedFunders: SelectedFunder[];
  onChange: (selectedFunders: SelectedFunder[]) => void;
}

export function FunderSelectionTable({
  funders,
  selectedFunders,
  onChange
}: FunderSelectionTableProps) {
  const handleToggleFunder = (funder: Funder, isChecked: boolean) => {
    if (isChecked) {
      // Add to selected funders
      const newSelectedFunders = [
        ...selectedFunders,
        {
          funder_id: funder.id,
          name: funder.name,
          status: 'proposed'
        }
      ];
      onChange(newSelectedFunders);
    } else {
      // Remove from selected funders
      const newSelectedFunders = selectedFunders.filter(
        sf => sf.funder_id !== funder.id
      );
      onChange(newSelectedFunders);
    }
  };
  
  const updateFunderDetails = (funderId: string, field: string, value: any) => {
    const newSelectedFunders = selectedFunders.map(sf => {
      if (sf.funder_id === funderId) {
        return { ...sf, [field]: value };
      }
      return sf;
    });
    onChange(newSelectedFunders);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Funder</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {funders.map(funder => {
            const isSelected = selectedFunders.some(sf => sf.funder_id === funder.id);
            const selectedFunder = selectedFunders.find(sf => sf.funder_id === funder.id);
            
            return (
              <TableRow key={funder.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleToggleFunder(funder, checked as boolean)}
                  />
                </TableCell>
                <TableCell>{funder.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{funder.type}</Badge>
                </TableCell>
                <TableCell>
                  {isSelected && (
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={selectedFunder?.amount || ''}
                      onChange={(e) => updateFunderDetails(
                        funder.id,
                        'amount',
                        e.target.valueAsNumber || undefined
                      )}
                      placeholder="e.g., 50000"
                      className="w-28"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isSelected && (
                    <Select
                      value={selectedFunder?.currency_code || 'USD'}
                      onChange={(value) => updateFunderDetails(
                        funder.id,
                        'currency_code',
                        value
                      )}
                      options={[
                        { label: 'USD', value: 'USD' },
                        { label: 'EUR', value: 'EUR' },
                        { label: 'GBP', value: 'GBP' }
                      ]}
                      className="w-24"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isSelected && (
                    <Select
                      value={selectedFunder?.status || 'proposed'}
                      onChange={(value) => updateFunderDetails(
                        funder.id,
                        'status',
                        value
                      )}
                      options={[
                        { label: 'Proposed', value: 'proposed' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Active', value: 'active' }
                      ]}
                      className="w-28"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          
          {funders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No funders available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

#### 7.2.5 Responsive Design Considerations

The Project Creation Page implements responsive design:

1. **Mobile View (< 640px)**:
   - Form fields stack vertically.
   - Stepper labels may be hidden, showing only step numbers.
   - Navigation buttons remain at the bottom with appropriate spacing.

2. **Tablet View (640px - 1024px)**:
   - Some form fields may appear side-by-side (e.g., start/end dates).
   - Selection tables adjust columns for readability.
   - Stepper shows full labels but is more compact.

3. **Desktop View (> 1024px)**:
   - Full layout as designed.
   - Form fields utilize grid layouts for optimal presentation.
   - Tables and selection interfaces show all columns.

#### 7.2.6 State Management

The Project Creation Page manages several state elements:

1. **Form State**: Using React Hook Form to manage the entire form state, including validation.
2. **Step Navigation**: Managing the current step and validation between steps.
3. **Dynamic Lists**: Managing dynamic arrays for objectives and tags.
4. **Selection State**: Managing selected funders and programs with their details.

#### 7.2.7 Accessibility Considerations

The Project Creation Page implements these accessibility features:

1. **Form Labels**: All form inputs have proper labels with optional/required indicators.
2. **Error Messaging**: Form validation errors are clearly displayed with descriptive messages.
3. **Focus Management**: Proper focus handling between steps, especially for error states.
4. **Keyboard Navigation**: Full keyboard support for all form interactions.
5. **ARIA Attributes**: Appropriate ARIA attributes for complex form components.

### 7.3 Project Detail Page

The Project Detail Page displays comprehensive information about a specific project, including its basic details, linked programs and funders, evidence, and analytics. This page serves as the central hub for managing all aspects of a project.

#### 7.3.1 Page Specifications

**Route**: `/projects/[projectId]`  
**Layout**: `src/app/(app)/projects/[projectId]/page.tsx`  
**Access Control**: Available to Organization Admins and Program Managers; read-only for Training Managers.

#### 7.3.2 Page Layout

The Project Detail Page follows a tabbed layout with the following structure:

```
+-------------------------------------------------------+
| [Page Header with title, status, and action buttons]  |
+-------------------------------------------------------+
| [Project Summary Card]                                |
+-------------------------------------------------------+
| [Tab Navigation]                                      |
| | Overview | Programs | Funders | Evidence | Reports | |
+-------------------------------------------------------+
| [Tab Content]                                         |
|                                                       |
| Each tab displays different information:              |
| - Overview: Key metrics, description, objectives      |
| - Programs: Linked programs with status and progress  |
| - Funders: Associated funders and funding details     |
| - Evidence: Collected evidence of project impact      |
| - Reports: Generated reports and analytics            |
|                                                       |
+-------------------------------------------------------+
```

#### 7.3.3 Main Components

##### ProjectDetailHeader Component

The header displays the project title, status badge, and action buttons.

```tsx
// src/components/features/projects/ProjectDetailHeader.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MoreVertical, Edit, Trash, Calendar, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDeleteProject } from "@/hooks/features/useProjectsApi";

interface ProjectDetailHeaderProps {
  project: {
    id: string;
    name: string;
    status: 'planned' | 'active' | 'completed' | 'archived';
  };
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteProject, isLoading: isDeleting } = useDeleteProject();
  
  const canEditProject = usePermissions('projects.edit');
  const canDeleteProject = usePermissions('projects.delete');
  
  const statusColors = {
    planned: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-purple-100 text-purple-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  
  const handleDeleteProject = () => {
    deleteProject(project.id, {
      onSuccess: () => {
        router.push('/projects');
        toast.success('Project deleted successfully');
      },
      onError: (error) => {
        console.error('Delete project error:', error);
        toast.error('Failed to delete project');
        setIsDeleteDialogOpen(false);
      }
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/projects')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <Badge className={statusColors[project.status] || 'bg-gray-100'}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex mt-4 sm:mt-0 space-x-2">
        {canEditProject && (
          <Button 
            variant="outline"
            onClick={() => router.push(`/projects/${project.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => router.push(`/projects/${project.id}/evidence/create`)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Evidence
            </DropdownMenuItem>
            
            {project.status !== 'archived' && canEditProject && (
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive Project
              </DropdownMenuItem>
            )}
            
            {canDeleteProject && (
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project "{project.name}" and remove all of its associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteProject}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
```

##### ProjectSummaryCard Component

Displays a summary of key project information and metrics.

```tsx
// src/components/features/projects/ProjectSummaryCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Users, CreditCard, Target } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

interface ProjectSummaryCardProps {
  project: {
    start_date: string;
    end_date: string;
    total_budget?: number;
    currency_code?: string;
    metrics: {
      program_count: number;
      worker_count: number;
      completion_rate: number;
    }
  }
}

export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  // Calculate project timeline progress
  const startDate = new Date(project.start_date).getTime();
  const endDate = new Date(project.end_date).getTime();
  const today = new Date().getTime();
  
  const totalDuration = endDate - startDate;
  const elapsed = today - startDate;
  const timeProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Timeline</span>
            </div>
            <div className="font-medium">
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{Math.round(timeProgress)}%</span>
              </div>
              <Progress value={timeProgress} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Target className="h-4 w-4 mr-2" />
              <span>Completion</span>
            </div>
            <div className="font-medium">
              {project.metrics.completion_rate}% Complete
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{project.metrics.completion_rate}%</span>
              </div>
              <Progress value={project.metrics.completion_rate} className="bg-muted" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>Programs & Workers</span>
            </div>
            <div className="font-medium">
              {project.metrics.program_count} Programs
            </div>
            <div className="text-sm text-muted-foreground">
              {project.metrics.worker_count} Workers Enrolled
            </div>
          </div>
          
          {project.total_budget && (
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Budget</span>
              </div>
              <div className="font-medium">
                {formatCurrency(project.total_budget, project.currency_code || 'USD')}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Allocated
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

##### ProjectTabNav Component

Navigation tabs for different project sections.

```tsx
// src/components/features/projects/ProjectTabNav.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

interface ProjectTabNavProps {
  projectId: string;
  activeTab: string;
}

export function ProjectTabNav({ projectId, activeTab }: ProjectTabNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleTabChange = (value: string) => {
    if (value === 'overview') {
      router.push(`/projects/${projectId}`);
    } else {
      router.push(`/projects/${projectId}/${value}`);
    }
  };
  
  return (
    <Tabs value={activeTab} className="mb-6" onValueChange={handleTabChange}>
      <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="funders">Funders</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

##### Project Overview Tab Content

The main content displayed on the Overview tab.

```tsx
// src/components/features/projects/tabs/ProjectOverviewTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProjectMetricCharts } from "@/components/features/projects/ProjectMetricCharts";

interface ProjectOverviewTabProps {
  project: {
    description: string;
    objectives: string[];
    tags?: string[];
    metrics: {
      program_count: number;
      worker_count: number;
      completion_rate: number;
      evidence_count: number;
      // Additional metrics for charts
      completion_over_time: Array<{ date: string; value: number }>;
      worker_engagement: number;
      // Any other metrics for visualizations
    }
  }
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-base font-medium mb-2">Objectives</h3>
            <ul className="list-disc list-inside space-y-1">
              {project.objectives.map((objective, index) => (
                <li key={index} className="text-muted-foreground">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          {project.tags && project.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-base font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectMetricCharts metrics={project.metrics} />
        </CardContent>
      </Card>
    </div>
  );
}
```

##### Project Detail Page Implementation

The main page component putting everything together:

```tsx
// src/app/(app)/projects/[projectId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { ProjectDetailHeader } from "@/components/features/projects/ProjectDetailHeader";
import { ProjectSummaryCard } from "@/components/features/projects/ProjectSummaryCard";
import { ProjectTabNav } from "@/components/features/projects/ProjectTabNav";
import { ProjectOverviewTab } from "@/components/features/projects/tabs/ProjectOverviewTab";
import { useProject } from "@/hooks/features/useProjectsApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ProjectDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectId as string;
  
  // Determine active tab from the pathname
  const activeTab = pathname.endsWith(`/projects/${projectId}`) 
    ? 'overview'
    : pathname.split('/').pop() || 'overview';
  
  const { data: projectData, isLoading, isError, error } = useProject(projectId);
  const project = projectData?.data;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  if (isError || !project) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Project
          </h2>
          <p className="text-red-700">
            {error?.message || "The project could not be found or you don't have permission to view it."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <ProjectDetailHeader project={project} />
      
      <ProjectSummaryCard project={project} />
      
      <ProjectTabNav projectId={projectId} activeTab={activeTab} />
      
      {activeTab === 'overview' && <ProjectOverviewTab project={project} />}
      {/* Other tabs will be separate routes with their own page components */}
    </div>
  );
}
```

#### 7.3.4 Supporting Components

##### ProjectMetricCharts Component

Visualizes project metrics with charts.

```tsx
// src/components/features/projects/ProjectMetricCharts.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, BarChart, PieChart } from "@/components/ui/charts"; // Assume we have chart components

interface ProjectMetricChartsProps {
  metrics: {
    completion_over_time: Array<{ date: string; value: number }>;
    worker_engagement: number;
    // Other metrics for visualization
  }
}

export function ProjectMetricCharts({ metrics }: ProjectMetricChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-base font-medium mb-4">Completion Progress Over Time</h3>
          <LineChart
            data={metrics.completion_over_time}
            xField="date"
            yField="value"
            height={200}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-base font-medium mb-4">Worker Engagement</h3>
          <div className="flex items-center justify-center h-[200px]">
            <PieChart
              data={[
                { name: 'Engaged', value: metrics.worker_engagement },
                { name: 'Not Engaged', value: 100 - metrics.worker_engagement }
              ]}
              nameField="name"
              valueField="value"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 7.3.5 File Structure for Tab Routes

Each tab (except Overview) is implemented as a nested route:

```
src/app/(app)/projects/[projectId]/
├── page.tsx                 # Main detail page (Overview tab)
├── programs/
│   └── page.tsx             # Programs tab
├── funders/
│   └── page.tsx             # Funders tab
├── evidence/
│   ├── page.tsx             # Evidence list
│   └── create/
│       └── page.tsx         # Create evidence form
└── reports/
    └── page.tsx             # Reports tab
```

#### 7.3.6 Responsive Design Considerations

The Project Detail Page is responsive:

1. **Mobile View (< 640px)**:
   - Header stacks title and actions vertically.
   - Summary card displays metrics in a single column.
   - Tabs become a scrollable row or collapse into a two-row grid.
   - Detail cards and charts stack vertically.

2. **Tablet View (640px - 1024px)**:
   - Header displays horizontally.
   - Summary card shows metrics in a 2x2 grid.
   - Tabs remain in a single row with adjusted widths.
   - Charts may display 1 or 2 per row depending on available space.

3. **Desktop View (> 1024px)**:
   - Full layout as designed.
   - Summary card displays all metrics in a single row.
   - Full tab navigation visible.
   - Multiple charts per row where appropriate.

## 8. Analytics and Reporting

## 9. User Flows

## 10. Testing Strategy

## 11. Future Enhancements 