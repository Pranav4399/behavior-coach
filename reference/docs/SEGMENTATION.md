# Segmentation Engine Documentation

## Table of Contents

1. [Introduction](#1-introduction)
   1. [Purpose](#11-purpose)
   2. [Key Concepts](#12-key-concepts)
   3. [Segmentation in the Behavioral Coaching Platform](#13-segmentation-in-the-behavioral-coaching-platform)

2. [Architecture Overview](#2-architecture-overview)
   1. [Segmentation Domain](#21-segmentation-domain)
   2. [Relationship to Other Domains](#22-relationship-to-other-domains)
   3. [Data Flow](#23-data-flow)

3. [API Integration](#3-api-integration)
   1. [Endpoints Overview](#31-endpoints-overview)
   2. [Data Models](#32-data-models)
   3. [API Hooks](#33-api-hooks)

4. [User Personas and Workflows](#4-user-personas-and-workflows)
   1. [Program Manager](#41-program-manager)
   2. [Training Manager](#42-training-manager)
   3. [Organization Admin](#43-organization-admin)
   4. [Common User Journeys](#44-common-user-journeys)

5. [UI Components and Design Patterns](#5-ui-components-and-design-patterns)
   1. [Reusable Components](#51-reusable-components)
   2. [Design Guidelines](#52-design-guidelines)
   3. [Layout Patterns](#53-layout-patterns)

6. [Page Designs and Implementations](#6-page-designs-and-implementations)
   1. [Segment List Page](#61-segment-list-page)
   2. [Segment Builder/Creation Page](#62-segment-buildercreation-page)
   3. [Segment Detail/Worker Membership Page](#63-segment-detailworker-membership-page)

7. [State Management and Data Flow](#7-state-management-and-data-flow)
   1. [Local vs. Global State](#71-local-vs-global-state)
   2. [API State Management](#72-api-state-management)
   3. [Form State](#73-form-state)

8. [Validation and Error Handling](#8-validation-and-error-handling)
   1. [Form Validation](#81-form-validation)
   2. [API Error Handling](#82-api-error-handling)
   3. [User Feedback](#83-user-feedback)

9. [Testing Strategy](#9-testing-strategy)
   1. [Component Testing](#91-component-testing)
   2. [Integration Testing](#92-integration-testing)
   3. [E2E Testing](#93-e2e-testing)

10. [Accessibility Considerations](#10-accessibility-considerations)
    1. [Keyboard Navigation](#101-keyboard-navigation)
    2. [Screen Reader Support](#102-screen-reader-support)
    3. [Color Contrast](#103-color-contrast)

11. [Performance Considerations](#11-performance-considerations)
    1. [Large Data Sets](#111-large-data-sets)
    2. [Complex Rule Evaluation](#112-complex-rule-evaluation)
    3. [Optimization Strategies](#113-optimization-strategies)

12. [Future Enhancements and Roadmap](#12-future-enhancements-and-roadmap)
    1. [Planned Features](#121-planned-features)
    2. [Potential Improvements](#122-potential-improvements)

## 1. Introduction

### 1.1 Purpose

This document provides comprehensive documentation for the Segmentation feature within the ABCD Behavioral Coaching Platform. It covers the architecture, API integration, UI components, page designs, state management, validation, testing strategies, accessibility considerations, and performance optimizations specific to segmentation functionality.

The primary audience for this document includes:
- Frontend developers implementing segmentation features
- Backend developers building segmentation APIs
- Product managers defining segmentation requirements
- QA engineers testing segmentation functionality
- UX designers creating segmentation interfaces

### 1.2 Key Concepts

Segmentation is a core feature of the platform that enables organizations to group workers (audience members) based on various criteria. These segments can then be targeted for specific programs, content, or experiments.

**Key segmentation concepts include:**

- **Segments**: Collections of workers that match specific criteria, used for targeting programs and experiments.
- **Static Segments**: Manually defined groups where workers are explicitly added or removed.
- **Dynamic Segments**: Rule-based groups where membership is automatically determined by evaluating conditions against worker attributes.
- **Segment Rules**: Logical expressions defining the conditions for inclusion in a dynamic segment.
- **Rule Groups**: Sets of conditions combined with logical operators (AND/OR) to create complex segmentation logic.
- **Worker Attributes**: Properties of workers that can be used in segmentation rules (e.g., location, performance metrics, custom fields).
- **Segment Membership**: The relationship between workers and segments, which can be direct (static) or rule-based (dynamic).
- **Segment Sync**: The process of recalculating membership for dynamic segments based on current worker data.

### 1.3 Segmentation in the Behavioral Coaching Platform

In the ABCD Behavioral Coaching Platform, segmentation plays a critical role in targeting interventions and programs to specific subsets of workers based on organizational structure, location, performance metrics, behavior patterns, and other customizable criteria.

**Types of segments within the platform:**

1. **Organizational Segments**: Based on organizational structure, department, team, role, or location.
   - Example: "Sales Team", "New York Branch", "Store Managers"

2. **Performance-based Segments**: Based on performance metrics, assessment scores, or completion rates.
   - Example: "High Performers", "Needs Improvement", "Certification Complete"

3. **Behavioral Segments**: Based on engagement patterns, response rates, or observed behaviors.
   - Example: "Highly Engaged", "At Risk", "Survey Respondents"

4. **Temporal Segments**: Based on time-related attributes like tenure, hire date, or program participation.
   - Example: "New Hires", "5+ Year Veterans", "Current Program Participants"

5. **Custom Segments**: Based on organization-specific attributes and custom fields.
   - Example: Segments based on custom worker attributes defined by the organization

**Segment usage in the platform:**

- **Program Targeting**: Assigning specific segments to behavioral coaching programs
- **Journey Customization**: Tailoring journey content based on segment membership
- **Experiment Allocation**: Assigning segments to different experiment variants
- **Analytics Aggregation**: Analyzing performance metrics by segment
- **Message Personalization**: Customizing communication based on segment attributes

## 2. Architecture Overview

### 2.1 Segmentation Domain

The Segmentation domain is a distinct functional area within the platform that includes components, APIs, and logic for creating, managing, and utilizing worker segments.

**Domain Structure:**

```
src/
└── domains/
    └── segments/
        ├── components/    # UI components specific to segments
        ├── hooks/         # Custom React hooks for segment functionality
        ├── api/           # API integration for segment operations
        ├── utils/         # Utility functions for segment manipulation
        ├── types/         # TypeScript definitions for segment models
        └── validation/    # Schema validation for segment operations
```

**Key Components:**

1. **Segment List**: Main interface for viewing and managing segments
2. **Segment Builder**: Interface for creating and editing segmentation rules
3. **Segment Details**: Interface for viewing segment membership and properties
4. **Rule Builder**: Component for constructing complex rule conditions
5. **Membership Management**: Interface for manually adding/removing workers (static segments)

**Technical Characteristics:**

- The Segmentation domain implements a rich UI for rule building with drag-and-drop capabilities.
- It provides robust validation of rule logic to prevent invalid combinations.
- The domain includes caching strategies for efficient retrieval of segment data.
- It supports both server-side and client-side evaluation of segment rules in appropriate contexts.

### 2.2 Relationship to Other Domains

Segmentation interfaces with several other domains, including Workers, Programs, Experiments, and Content, providing the foundation for targeted interventions and audience analysis.

**Workers Domain Integration:**
- Segments group workers based on attributes defined in the Workers domain
- Worker profile changes may trigger re-evaluation of segment membership
- Worker bulk operations can include segment assignment options
- Worker detail views show segment membership

**Programs Domain Integration:**
- Programs target specific segments for enrollment
- Program creation/editing interfaces allow segment selection
- Program analytics can be filtered and grouped by segment
- Conflict resolution between programs considers segment overlap

**Experiments Domain Integration:**
- Experiments can target specific segments or use segments for variant assignment
- Experiment results can be analyzed by segment for deeper insights
- Segment-based experiments compare effectiveness across different audience groups

**Content Domain Integration:**
- Content can be tailored for specific segments
- Content analytics can be filtered by segment to measure effectiveness
- Content recommendations may consider segment attributes

**Wellbeing Domain Integration:**
- Wellbeing indicators can be used as criteria for segment rules
- Wellbeing interventions can be targeted to specific segments
- Wellbeing analytics can be analyzed by segment

### 2.3 Data Flow

Data flows between the Segmentation domain and other parts of the system through well-defined interfaces and API contracts, ensuring consistent and reliable segmentation capabilities.

**Segment Creation Flow:**
1. User defines segment name, description, and type (static or dynamic)
2. For dynamic segments, user constructs rule conditions using the Rule Builder
3. Frontend validates rule consistency and logical structure
4. API endpoint creates the segment in the database
5. For dynamic segments, backend evaluates rules against worker data to determine initial membership
6. Membership data is stored and made available for use in other domains

**Segment Update Flow:**
1. User modifies segment properties or rules
2. Frontend validates changes
3. API endpoint updates the segment definition
4. Backend re-evaluates membership based on updated rules (for dynamic segments)
5. Updated membership data propagates to other domains (Programs, Experiments)

**Segment Usage Flow:**
1. Other domains (Programs, Experiments) request available segments
2. User selects segments for targeting
3. Backend resolves worker IDs based on segment membership
4. Operations are applied to the resolved worker set

**Worker Attribute Update Flow:**
1. Worker attributes are updated through the Workers domain
2. Changes trigger re-evaluation of segment membership for dynamic segments
3. Updated membership affects active programs, experiments, etc.

**Real-time vs. Batch Processing:**
- Small-scale segment membership changes are processed in real-time
- Large-scale re-evaluation (e.g., after bulk worker import) uses background processing
- APIs include status endpoints to track processing of large membership updates

## 3. API Integration

### 3.1 Endpoints Overview

The Segmentation feature integrates with several backend API endpoints to manage segment data and operations. These endpoints follow RESTful conventions and include comprehensive error handling.

**Core Segment Endpoints:**

1. **GET /api/v1/segments**
   - **Purpose**: List all segments for the organization, with optional filtering.
   - **Query Parameters**:
     - `type`: Filter by segment type (static, rule-based)
     - `search`: Search by segment name
     - `page`: Page number for pagination
     - `limit`: Items per page
     - `sort`: Sort field and direction
   - **Response**: Array of segment objects with pagination metadata

2. **POST /api/v1/segments**
   - **Purpose**: Create a new segment.
   - **Request Body**:
     - `name`: Segment name
     - `description`: Optional description
     - `type`: Segment type (static, rule-based)
     - `rule_definition`: Rule definition (for rule-based segments)
   - **Response**: Created segment object

3. **GET /api/v1/segments/{segmentId}**
   - **Purpose**: Retrieve details for a specific segment.
   - **Response**: Detailed segment object including rules and metadata

4. **PATCH /api/v1/segments/{segmentId}**
   - **Purpose**: Update segment details or rules.
   - **Request Body**: Fields to update (name, description, rule_definition)
   - **Response**: Updated segment object

5. **DELETE /api/v1/segments/{segmentId}**
   - **Purpose**: Delete a segment.
   - **Response**: Success confirmation

**Segment Membership Endpoints:**

6. **GET /api/v1/segments/{segmentId}/workers**
   - **Purpose**: List workers in the segment.
   - **Query Parameters**:
     - `page`: Page number for pagination
     - `limit`: Items per page
     - `search`: Search by worker name
   - **Response**: Array of worker objects with pagination metadata

7. **POST /api/v1/segments/{segmentId}/workers** (for Static Segments)
   - **Purpose**: Add workers to a static segment.
   - **Request Body**: Array of worker IDs
   - **Response**: Success confirmation with count

8. **DELETE /api/v1/segments/{segmentId}/workers/{workerId}** (for Static Segments)
   - **Purpose**: Remove a worker from a static segment.
   - **Response**: Success confirmation

**Segment Operations Endpoints:**

9. **POST /api/v1/segments/{segmentId}/sync**
   - **Purpose**: Manually trigger recalculation of membership for a rule-based segment.
   - **Response**: Job ID for tracking the sync operation

10. **GET /api/v1/segments/{segmentId}/sync/{jobId}**
    - **Purpose**: Check status of a segment sync operation.
    - **Response**: Status information (pending, processing, complete, failed)

11. **POST /api/v1/segments/{segmentId}/test-rule**
    - **Purpose**: Test a rule definition against the worker database without saving.
    - **Request Body**: Rule definition to test
    - **Response**: Count of matching workers, sample of matching workers

12. **GET /api/v1/segments/types**
    - **Purpose**: Get available segment types and rule attributes.
    - **Response**: Array of segment types and available rule attributes

13. **GET /api/v1/segments/conflicts**
    - **Purpose**: Identify potential conflicts between segments used in active programs.
    - **Response**: Array of conflict information between segments

**Usage in Other Domains:**

14. **GET /api/v1/workers/{workerId}/segments**
    - **Purpose**: List segments the worker belongs to.
    - **Response**: Array of segment objects

15. **GET /api/v1/programs/{programId}/segments**
    - **Purpose**: List segments assigned to a program.
    - **Response**: Array of segment objects

16. **GET /api/v1/segments/{segmentId}/analytics**
    - **Purpose**: Get analytics data for the segment.
    - **Response**: Analytics data specific to the segment

### 3.2 Data Models

The Segmentation feature relies on several key data models for representing segments, rules, and membership.

**Segment Model:**

```typescript
interface Segment {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  type: 'static' | 'rule-based';
  rule_definition?: RuleDefinition;
  worker_count: number;
  created_at: string;
  updated_at: string;
  last_sync_at?: string;
}
```

**Rule Definition Model:**

```typescript
interface RuleDefinition {
  condition: 'and' | 'or';
  rules: Array<Rule | RuleGroup>;
}

interface RuleGroup {
  condition: 'and' | 'or';
  rules: Array<Rule | RuleGroup>;
}

interface Rule {
  field: string;
  operator: RuleOperator;
  value: any;
}

type RuleOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'less_than'
  | 'greater_than_or_equal' 
  | 'less_than_or_equal'
  | 'between'
  | 'not_between'
  | 'in'
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty';
```

**Worker Membership Model:**

```typescript
interface WorkerSegment {
  segment_id: string;
  worker_id: string;
  assigned_at: string;
  rule_match?: boolean; // True if membership is due to rule match
  rule_match_reason?: string; // Description of which rule(s) caused the match
}
```

**Rule Field Schema:**

```typescript
interface RuleField {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select';
  operators: RuleOperator[];
  source: 'system' | 'custom'; // Whether field is system-defined or custom
  options?: Array<{
    value: string;
    label: string;
  }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

**Segment Analytics Model:**

```typescript
interface SegmentAnalytics {
  segment_id: string;
  segment_name: string;
  total_workers: number;
  active_workers: number;
  program_participation: {
    total_programs: number;
    active_programs: number;
    average_completion_rate: number;
  };
  engagement_metrics: {
    message_response_rate: number;
    average_response_time: number;
    completion_rate: number;
  };
  wellbeing_metrics?: {
    average_score: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}
```

### 3.3 API Hooks

The Segmentation feature provides several custom React hooks that simplify integration with the segmentation API endpoints.

**Core Hooks:**

1. **useSegments**:
   ```typescript
   export const useSegments = (params?: SegmentQueryParams) => {
     return useQuery<SegmentListResponse, Error>(
       ['segments', params],
       () => api.endpoints.segments.getSegments(params),
       {
         staleTime: 60000, // Data is fresh for 1 minute
         keepPreviousData: true, // Keep previous data while fetching more
       }
     );
   };
   ```

2. **useSegment**:
   ```typescript
   export const useSegment = (segmentId: string) => {
     return useQuery<Segment, Error>(
       ['segment', segmentId],
       () => api.endpoints.segments.getSegment(segmentId),
       {
         enabled: !!segmentId,
         staleTime: 60000, // Data is fresh for 1 minute
       }
     );
   };
   ```

3. **useCreateSegment**:
   ```typescript
   export const useCreateSegment = () => {
     const queryClient = useQueryClient();
     const navigate = useNavigate();
     
     return useMutation<Segment, Error, CreateSegmentRequest>(
       (data) => api.endpoints.segments.createSegment(data),
       {
         onSuccess: (segment) => {
           queryClient.invalidateQueries(['segments']);
           toast.success('Segment created successfully');
           navigate(`/segments/${segment.id}`);
         },
         onError: (error) => {
           toast.error(`Failed to create segment: ${error.message}`);
         }
       }
     );
   };
   ```

4. **useUpdateSegment**:
   ```typescript
   export const useUpdateSegment = (segmentId: string) => {
     const queryClient = useQueryClient();
     
     return useMutation<Segment, Error, UpdateSegmentRequest>(
       (data) => api.endpoints.segments.updateSegment(segmentId, data),
       {
         onSuccess: (segment) => {
           queryClient.invalidateQueries(['segment', segmentId]);
           queryClient.invalidateQueries(['segments']);
           toast.success('Segment updated successfully');
         },
         onError: (error) => {
           toast.error(`Failed to update segment: ${error.message}`);
         }
       }
     );
   };
   ```

5. **useDeleteSegment**:
   ```typescript
   export const useDeleteSegment = () => {
     const queryClient = useQueryClient();
     const navigate = useNavigate();
     
     return useMutation<void, Error, string>(
       (segmentId) => api.endpoints.segments.deleteSegment(segmentId),
       {
         onSuccess: () => {
           queryClient.invalidateQueries(['segments']);
           toast.success('Segment deleted successfully');
           navigate('/segments');
         },
         onError: (error) => {
           toast.error(`Failed to delete segment: ${error.message}`);
         }
       }
     );
   };
   ```

**Membership Hooks:**

6. **useSegmentWorkers**:
   ```typescript
   export const useSegmentWorkers = (
     segmentId: string, 
     params?: WorkerQueryParams
   ) => {
     return useQuery<WorkerListResponse, Error>(
       ['segmentWorkers', segmentId, params],
       () => api.endpoints.segments.getSegmentWorkers(segmentId, params),
       {
         enabled: !!segmentId,
         keepPreviousData: true,
         staleTime: 60000, // Data is fresh for 1 minute
       }
     );
   };
   ```

7. **useAddWorkersToSegment**:
   ```typescript
   export const useAddWorkersToSegment = (segmentId: string) => {
     const queryClient = useQueryClient();
     
     return useMutation<void, Error, string[]>(
       (workerIds) => api.endpoints.segments.addWorkersToSegment(segmentId, workerIds),
       {
         onSuccess: () => {
           queryClient.invalidateQueries(['segmentWorkers', segmentId]);
           queryClient.invalidateQueries(['segment', segmentId]);
           toast.success('Workers added to segment successfully');
         },
         onError: (error) => {
           toast.error(`Failed to add workers to segment: ${error.message}`);
         }
       }
     );
   };
   ```

8. **useRemoveWorkerFromSegment**:
   ```typescript
   export const useRemoveWorkerFromSegment = (segmentId: string) => {
     const queryClient = useQueryClient();
     
     return useMutation<void, Error, string>(
       (workerId) => api.endpoints.segments.removeWorkerFromSegment(segmentId, workerId),
       {
         onSuccess: () => {
           queryClient.invalidateQueries(['segmentWorkers', segmentId]);
           queryClient.invalidateQueries(['segment', segmentId]);
           toast.success('Worker removed from segment successfully');
         },
         onError: (error) => {
           toast.error(`Failed to remove worker from segment: ${error.message}`);
         }
       }
     );
   };
   ```

**Operations Hooks:**

9. **useSyncSegment**:
   ```typescript
   export const useSyncSegment = (segmentId: string) => {
     const queryClient = useQueryClient();
     
     return useMutation<SyncJobResponse, Error, void>(
       () => api.endpoints.segments.syncSegment(segmentId),
       {
         onSuccess: () => {
           toast.success('Segment sync started');
           // We can poll for sync completion or rely on websocket updates
           setTimeout(() => {
             queryClient.invalidateQueries(['segment', segmentId]);
             queryClient.invalidateQueries(['segmentWorkers', segmentId]);
           }, 3000); // Simple polling approach
         },
         onError: (error) => {
           toast.error(`Failed to sync segment: ${error.message}`);
         }
       }
     );
   };
   ```

10. **useTestSegmentRule**:
    ```typescript
    export const useTestSegmentRule = () => {
      return useMutation<TestRuleResponse, Error, TestRuleRequest>(
        (data) => api.endpoints.segments.testRule(data),
        {
          onError: (error) => {
            toast.error(`Failed to test rule: ${error.message}`);
          }
        }
      );
    };
    ```

11. **useSegmentTypes**:
    ```typescript
    export const useSegmentTypes = () => {
      return useQuery<SegmentTypesResponse, Error>(
        ['segmentTypes'],
        () => api.endpoints.segments.getSegmentTypes(),
        {
          staleTime: 3600000, // Cache for 1 hour - these rarely change
        }
      );
    };
    ```

**Usage in Other Domains:**

12. **useWorkerSegments**:
    ```typescript
    export const useWorkerSegments = (workerId: string) => {
      return useQuery<Segment[], Error>(
        ['workerSegments', workerId],
        () => api.endpoints.workers.getWorkerSegments(workerId),
        {
          enabled: !!workerId,
          staleTime: 60000 // Data is fresh for 1 minute
        }
      );
    };
    ```

## 4. User Personas and Workflows

### 4.1 Program Manager

Program Managers are the primary users of the segmentation feature, as they need to target specific worker groups for behavioral coaching programs and analyze their effectiveness.

**Key Characteristics:**
- Responsible for running and monitoring behavioral coaching programs
- Need to target the right workers with the right programs
- Often need to analyze program effectiveness by segment
- May need to create ad-hoc segments for special initiatives

**Goals and Needs:**
1. **Create Segments**: Define groups of workers based on specific criteria
2. **Manage Membership**: View and modify segment members
3. **Program Targeting**: Select segments when creating or editing programs
4. **Performance Analysis**: Analyze program effectiveness by segment
5. **Dynamic Updates**: Keep segments automatically updated as worker attributes change

**Primary Workflows:**
1. **Creating a New Segment**:
   - Navigate to Segments page
   - Click "Create Segment"
   - Choose between static or rule-based segment
   - Define segment rules or manually select workers
   - Save and view the new segment

2. **Using Segments in Programs**:
   - During program creation, select target segments
   - View overlapping workers between segments
   - Resolve conflicts in program assignment

3. **Analyzing Program Performance by Segment**:
   - View analytics dashboard
   - Filter results by segment
   - Compare performance across segments
   - Identify high and low performing segments

### 4.2 Training Manager

Training Managers focus on content and journey design, using segments to customize training experiences for different worker groups.

**Key Characteristics:**
- Responsible for designing training content and journey flows
- Need to understand segment composition to create relevant content
- Often design content variations for different segments
- May use segmentation for A/B testing of content effectiveness

**Goals and Needs:**
1. **Segment Analysis**: Understand the characteristics of different segments
2. **Content Customization**: Tailor content for specific segments
3. **Journey Design**: Create journey variations based on segment needs
4. **Experiment Design**: Use segments in content experiments

**Primary Workflows:**
1. **Analyzing Segment Composition**:
   - Select a segment to view
   - Examine demographic and behavioral data
   - Understand common attributes within the segment

2. **Creating Segment-Specific Content**:
   - Design content with segment characteristics in mind
   - Tag content for relevance to specific segments
   - Preview content from the perspective of segment members

3. **Designing Segment-Based Experiments**:
   - Create experiment variants targeted at specific segments
   - Analyze how different segments respond to content variations
   - Use segment-based metrics to evaluate experiment results

### 4.3 Organization Admin

Organization Admins have a broader view of segments and are concerned with organizational structure, data governance, and system maintenance.

**Key Characteristics:**
- Responsible for overall platform configuration and management
- Need visibility into all segments across the organization
- May need to create and maintain organizational structure segments
- Concerned with data quality and segment maintenance

**Goals and Needs:**
1. **Segment Governance**: Ensure segments are properly maintained and documented
2. **Organizational Structure**: Maintain segments that reflect organizational hierarchy
3. **System Performance**: Monitor and optimize segment-related system performance
4. **Access Control**: Manage who can create and edit segments

**Primary Workflows:**
1. **Managing Organizational Segments**:
   - Create and maintain standard organizational segments (e.g., departments, locations)
   - Update membership as organizational structure changes
   - Document segment purpose and usage

2. **Monitoring Segment Usage**:
   - View which segments are used in active programs
   - Identify unused or redundant segments
   - Analyze segment overlap and potential conflicts

3. **Performance Optimization**:
   - Monitor system performance for large segments
   - Optimize rule complexity for frequently used segments
   - Schedule maintenance for segment synchronization

### 4.4 Common User Journeys

#### 4.4.1 Creating a Dynamic (Rule-based) Segment

1. **Navigate to Segments List**:
   - User accesses the Segments page from the main navigation
   - System displays a list of existing segments with key metrics

2. **Initiate Segment Creation**:
   - User clicks the "Create Segment" button
   - System displays the segment creation interface

3. **Define Basic Segment Properties**:
   - User enters segment name and description
   - User selects "Rule-based" as the segment type
   - System enables the rule builder interface

4. **Build Segment Rules**:
   - User adds rule conditions using the rule builder
   - User combines conditions with AND/OR operators
   - System provides real-time validation of rule structure

5. **Test Rule Effectiveness**:
   - User clicks "Test Rule" to preview results
   - System displays count and sample of matching workers
   - User refines rules based on preview results

6. **Save and Process Segment**:
   - User saves the segment
   - System processes the rules against all workers
   - System displays the new segment with initial membership count

7. **Review Segment Members**:
   - User navigates to the segment detail page
   - System displays the list of workers in the segment
   - User can view why each worker matched the rules

#### 4.4.2 Creating a Static Segment

1. **Navigate to Segments List**:
   - User accesses the Segments page from the main navigation
   - System displays a list of existing segments with key metrics

2. **Initiate Segment Creation**:
   - User clicks the "Create Segment" button
   - System displays the segment creation interface

3. **Define Basic Segment Properties**:
   - User enters segment name and description
   - User selects "Static" as the segment type
   - System enables worker selection interface

4. **Add Workers to Segment**:
   - User searches for workers by name, ID, or attributes
   - User selects workers individually or in bulk
   - System shows running count of selected workers

5. **Save Segment**:
   - User saves the segment
   - System creates the segment with selected workers
   - System displays the new segment detail page

6. **Manage Segment Membership**:
   - User can add or remove workers from the segment
   - System provides search and filtering capabilities
   - User can export the segment membership list

#### 4.4.3 Using Segments in Program Creation

1. **Navigate to Program Creation**:
   - User initiates program creation
   - User completes program details and journey selection

2. **Select Target Segments**:
   - User reaches the target audience selection step
   - System displays available segments with key metrics
   - User selects one or more segments for the program

3. **Review Audience Coverage**:
   - System displays total worker count and potential overlaps
   - User reviews the audience size and composition
   - System highlights potential conflicts with other programs

4. **Configure Segment-specific Settings**:
   - User sets segment-specific program parameters if needed
   - System validates configuration for all selected segments
   - User completes program creation with segment targeting

5. **Monitor Segment Performance**:
   - After program launch, user views program dashboard
   - System displays metrics broken down by segment
   - User can compare performance across different segments

## 5. UI Components and Design Patterns

### 5.1 Reusable Components

The segmentation feature relies on several reusable UI components that follow the platform's design system while providing specialized functionality for segment management.

#### 5.1.1 SegmentsList

A component for displaying a list of segments with filtering, sorting, and pagination capabilities.

**Component Specification:**
```typescript
interface SegmentsListProps {
  segments: SegmentListResponse;
  isLoading: boolean;
  error?: Error;
  onCreateSegment: () => void;
  onSelectSegment: (segmentId: string) => void;
  onDeleteSegment: (segmentId: string) => void;
  onSearch: (query: string) => void;
  onFilter: (filters: SegmentFilters) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onPaginate: (page: number, limit: number) => void;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 🔍 Search segments...                       │ │ Filters ▾│ │ + Create│ │
│ └─────────────────────────────────────────────┘ └─────────┘ └─────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Name ▼          │ Type      │ Workers │ Last Updated  │ Actions     │ │
│ ├─────────────────┼───────────┼─────────┼───────────────┼─────────────┤ │
│ │ Sales Team      │ Static    │ 45      │ 2 days ago    │ ⋮ View Edit │ │
│ ├─────────────────┼───────────┼─────────┼───────────────┼─────────────┤ │
│ │ High Performers │ Rule-based│ 128     │ 1 week ago    │ ⋮ View Edit │ │
│ ├─────────────────┼───────────┼─────────┼───────────────┼─────────────┤ │
│ │ New York Branch │ Rule-based│ 76      │ 3 days ago    │ ⋮ View Edit │ │
│ ├─────────────────┼───────────┼─────────┼───────────────┼─────────────┤ │
│ │ Training Group A│ Static    │ 25      │ Today         │ ⋮ View Edit │ │
│ ├─────────────────┼───────────┼─────────┼───────────────┼─────────────┤ │
│ │ Northeast Region│ Rule-based│ 201     │ 5 days ago    │ ⋮ View Edit │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ◀ Previous │ 1 │ 2 │ 3 │ 4 │ 5 │ Next ▶     Items per page: 10 ▾    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Search functionality for finding segments by name
- Filters for segment type (static/rule-based), usage, and other attributes
- Sortable columns for easy organization
- Pagination for handling large numbers of segments
- Quick actions for viewing, editing, and deleting segments
- Visual indicators for recently updated segments
- Worker count display for each segment

#### 5.1.2 RuleBuilder

A powerful component for creating and editing segment rules with a visual, intuitive interface.

**Component Specification:**
```typescript
interface RuleBuilderProps {
  initialRules?: RuleDefinition;
  availableFields: RuleField[];
  onChange: (rules: RuleDefinition) => void;
  onTest?: (rules: RuleDefinition) => void;
  isReadOnly?: boolean;
  maxDepth?: number;
  testResults?: TestRuleResponse;
  isTestLoading?: boolean;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Match workers where [all ▾] of the following conditions are true:   │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [Location   ▾] [equals     ▾] [New York         ] [✓] [✕] [+]   │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [Department ▾] [equals     ▾] [Sales            ] [✓] [✕] [+]   │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [Performance▾] [greater than▾] [80               ] [✓] [✕] [+]   │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ [+ Add Condition] [+ Add Group]                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [Test Rule]                                        [Clear All Rules] │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Test Results: 45 workers match these conditions                      │ │
│ │                                                                     │ │
│ │ Sample matches:                                                     │ │
│ │ - John Smith (New York, Sales, Performance: 92)                     │ │
│ │ - Sarah Johnson (New York, Sales, Performance: 88)                  │ │
│ │ - Michael Brown (New York, Sales, Performance: 85)                  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Visual rule builder with drag-and-drop support
- Support for complex nested conditions with AND/OR operators
- Field selection from available worker attributes
- Context-aware operator options based on field type
- Value selection with appropriate inputs (text, number, date, dropdown)
- Real-time validation of rule structure and values
- Test functionality to preview matching workers
- Support for rule groups for complex logic

#### 5.1.3 SegmentDetailsPanel

A component for displaying detailed information about a segment, including properties, metrics, and usage.

**Component Specification:**
```typescript
interface SegmentDetailsPanelProps {
  segment: Segment;
  isLoading: boolean;
  error?: Error;
  analytics?: SegmentAnalytics;
  usageStats?: SegmentUsageStats;
  onEdit: () => void;
  onDelete: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Segment Details                                    [Edit] [Delete]   │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Name: High Performers                                               │ │
│ │ Type: Rule-based                                                    │ │
│ │ Created: June 15, 2023                                              │ │
│ │ Last Updated: July 2, 2023                                          │ │
│ │ Last Sync: July 5, 2023 (3 days ago)                [Sync Now]      │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Segment Rules                                                       │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Match workers where ALL of the following conditions are true:       │ │
│ │ - Performance score is greater than 80                              │ │
│ │ - Has completed at least 3 programs                                 │ │
│ │ - Department is Sales, Marketing, or Customer Service               │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Segment Metrics                                                     │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Total Workers: 128                                                  │ │
│ │ Active Workers: 125                                                 │ │
│ │ Average Completion Rate: 92%                                        │ │
│ │ Average Wellbeing Score: 87/100                                     │ │
│ │                                                                     │ │
│ │ [View Detailed Analytics]                                           │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Program Usage                                                       │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Currently used in 3 active programs:                                │ │
│ │ - Leadership Essentials (ends in 14 days)                           │ │
│ │ - Customer Excellence (ends in 30 days)                             │ │
│ │ - Advanced Sales Techniques (starts in 3 days)                      │ │
│ │                                                                     │ │
│ │ [View All Programs]                                                 │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Comprehensive display of segment properties and metadata
- Visual representation of segment rules in human-readable format
- Key metrics about worker composition and performance
- Usage information showing which programs use the segment
- Action buttons for common operations (edit, delete, sync)
- Links to related views (analytics, programs)

#### 5.1.4 WorkerListWithActions

A flexible component for displaying and managing workers in a segment, with support for various actions.

**Component Specification:**
```typescript
interface WorkerListWithActionsProps {
  workers: WorkerListResponse;
  isLoading: boolean;
  error?: Error;
  segmentType: 'static' | 'rule-based';
  onSearch: (query: string) => void;
  onFilter: (filters: WorkerFilters) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onPaginate: (page: number, limit: number) => void;
  onRemoveWorker?: (workerId: string) => void;
  onViewWorker: (workerId: string) => void;
  onAddWorkers?: () => void;
  allowSelection?: boolean;
  onSelectionChange?: (selectedWorkerIds: string[]) => void;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 🔍 Search workers...                        │ │ Filters ▾│ │ + Add   │ │
│ └─────────────────────────────────────────────┘ └─────────┘ └─────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [ ] │ Name          │ Location   │ Department │ Status    │ Actions │ │
│ ├─────┼───────────────┼────────────┼────────────┼───────────┼─────────┤ │
│ │ [✓] │ John Smith    │ New York   │ Sales      │ Active    │ View ⋮  │ │
│ ├─────┼───────────────┼────────────┼────────────┼───────────┼─────────┤ │
│ │ [ ] │ Sarah Johnson │ New York   │ Sales      │ Active    │ View ⋮  │ │
│ ├─────┼───────────────┼────────────┼────────────┼───────────┼─────────┤ │
│ │ [ ] │ Michael Brown │ New York   │ Sales      │ Active    │ View ⋮  │ │
│ ├─────┼───────────────┼────────────┼────────────┼───────────┼─────────┤ │
│ │ [✓] │ Emily Davis   │ Boston     │ Marketing  │ Active    │ View ⋮  │ │
│ ├─────┼───────────────┼────────────┼────────────┼───────────┼─────────┤ │
│ │ [ ] │ Robert Wilson │ Chicago    │ Sales      │ On Leave  │ View ⋮  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Selected: 2 workers    [Remove from Segment] [Add to Program]           │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ◀ Previous │ 1 │ 2 │ 3 │ 4 │ 5 │ Next ▶     Items per page: 10 ▾    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Display workers with key information in a tabular format
- Search and filter capabilities for finding specific workers
- Bulk selection for performing actions on multiple workers
- Context-specific actions based on segment type (static/rule-based)
- Pagination for handling large worker lists
- Sorting by any column
- Visual indicators for worker status
- Batch actions for selected workers

#### 5.1.5 SegmentSelectorWithPreview

A component for selecting segments with preview information about each segment.

**Component Specification:**
```typescript
interface SegmentSelectorWithPreviewProps {
  segments: Segment[];
  selectedSegmentIds: string[];
  onSegmentSelect: (segmentId: string, selected: boolean) => void;
  isLoading: boolean;
  error?: Error;
  showPreview?: boolean;
  maxSelection?: number;
  allowSearch?: boolean;
  onSearch?: (query: string) => void;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐                         │
│ │ 🔍 Search segments...                       │                         │
│ └─────────────────────────────────────────────┘                         │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [✓] Sales Team                                                      │ │
│ │     45 workers · Static · Created 3 months ago                      │ │
│ │                                                                     │ │
│ │ [ ] High Performers                                                 │ │
│ │     128 workers · Rule-based · Performance > 80                     │ │
│ │                                                                     │ │
│ │ [✓] New York Branch                                                 │ │
│ │     76 workers · Rule-based · Location = New York                   │ │
│ │                                                                     │ │
│ │ [ ] Training Group A                                                │ │
│ │     25 workers · Static · Created 1 week ago                        │ │
│ │                                                                     │ │
│ │ [ ] Northeast Region                                                │ │
│ │     201 workers · Rule-based · Location in (NY, MA, CT, RI, VT, NH) │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Selected: 2 segments (121 workers total, 8 workers overlap)             │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Multi-select capability for choosing multiple segments
- Preview information showing worker count and key attributes
- Search functionality for finding specific segments
- Worker count calculation with overlap detection
- Visual differentiation between static and rule-based segments
- Brief rule summary for rule-based segments
- Limit on maximum number of selectable segments if needed

### 5.2 Design Guidelines

#### 5.2.1 Visual Style

The segmentation feature follows the platform's design system while incorporating specialized elements for rule building and data visualization.

**Color Usage:**
- **Primary Action Blue**: (#003D63) Used for primary buttons, selected states, and key UI elements
- **Success Green**: (#04B27A) Used for success indicators, valid rules, and positive metrics
- **Warning Amber**: (#F3B649) Used for caution states, pending processes, and notifications
- **Error Red**: (#FF1744) Used for error states, validation failures, and critical alerts
- **Neutral Grays**: Used for backgrounds, borders, and text with appropriate contrast ratios

**Typography:**
- **Headers**: CabinetGrotesk, bold (700) for page titles and section headers
- **Body Text**: General_Sans (400) for general content, segment descriptions, and instructions
- **Small Text**: General_Sans (400) for metadata, counts, and supplementary information
- **Rule Text**: MonaSans (500) for rule conditions and technical content

**Iconography:**
- **Segment Icon**: Stacked layers or filter icon
- **Rule Icon**: Puzzle piece or logic gate icon
- **Worker Icon**: Person or group icon
- **Static Segment**: Pin or fixed position icon
- **Dynamic Segment**: Automation or refresh icon

#### 5.2.2 Component Patterns

**Data Tables:**
- Use consistent column headers with sort indicators
- Include row hover states for better usability
- Use checkboxes for multi-select functionality
- Implement responsive solutions for narrow viewports
- Use pagination with configurable page size

**Forms:**
- Group related inputs with clear section headers
- Use inline validation with helpful error messages
- Provide clear save/cancel actions at the bottom
- Implement autosave for complex editors where appropriate
- Show confirmation dialogs for destructive actions

**Rule Builder:**
- Use a hierarchical visual structure to represent rule nesting
- Provide drag handles for reordering rules
- Use appropriate input controls based on data type
- Implement clear add/remove actions for rules and groups
- Provide a natural language representation of complex rules

**Action Patterns:**
- Use primary buttons for main actions
- Provide dropdown menus for secondary actions
- Show confirmation dialogs for destructive actions
- Use toast notifications for async action results
- Implement undo capability for critical actions

#### 5.2.3 Motion and Interaction

**Transitions:**
- Use subtle fade transitions when showing/hiding components
- Implement smooth height transitions for expandable sections
- Use loading indicators for asynchronous operations
- Animate rule reordering for better visual tracking

**Drag and Drop:**
- Implement drag and drop for rule reordering
- Use visual indicators for drag targets
- Provide keyboard alternatives for all drag operations
- Show preview of drop result during drag

**Feedback:**
- Show immediate visual feedback for all user actions
- Use progress indicators for longer operations
- Provide success/error feedback via toast notifications
- Implement optimistic UI updates where appropriate

### 5.3 Layout Patterns

#### 5.3.1 List-Detail Pattern

The primary layout pattern for segment management, with a list of segments on the left and details on the right.

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────┐ ┌──────────────────────────────────────────┐  │
│ │ Segments             │ │ Segment Details                          │  │
│ │                      │ │                                          │  │
│ │ ┌──────────────────┐ │ │ Name: High Performers                    │  │
│ │ │ Search/Filter    │ │ │ Type: Rule-based                         │  │
│ │ └──────────────────┘ │ │ ...                                      │  │
│ │                      │ │                                          │  │
│ │ ┌──────────────────┐ │ │ ┌────────────────────────────────────┐  │  │
│ │ │ Segment List     │ │ │ │ Segment Rules                      │  │  │
│ │ │                  │ │ │ └────────────────────────────────────┘  │  │
│ │ │ - Sales Team     │ │ │                                         │  │
│ │ │ - High Performers│ │ │ ┌────────────────────────────────────┐  │  │
│ │ │ - New York Branch│ │ │ │ Segment Metrics                    │  │  │
│ │ │ - Training Group │ │ │ └────────────────────────────────────┘  │  │
│ │ │                  │ │ │                                         │  │
│ │ └──────────────────┘ │ │ ┌────────────────────────────────────┐  │  │
│ │                      │ │ │ Workers                            │  │  │
│ │ ┌──────────────────┐ │ │ └────────────────────────────────────┘  │  │
│ │ │ Pagination       │ │ │                                         │  │
│ │ └──────────────────┘ │ └─────────────────────────────────────────┘  │
│ └──────────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tablet Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────────────────┐│
│ │ Segments                                 [+ Create] [Filter] [Search] ││
│ └──────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐│
│ │ Sales Team           │  │ High Performers      │  │ New York Branch ││
│ │ 45 workers           │  │ 128 workers          │  │ 76 workers      ││
│ │ Static               │  │ Rule-based           │  │ Rule-based      ││
│ │                      │  │                      │  │                 ││
│ │     [View Details]   │  │     [View Details]   │  │   [View Details]││
│ └──────────────────────┘  └──────────────────────┘  └─────────────────┘│
│                                                                         │
│ ┌──────────────────────┐  ┌──────────────────────┐                     │
│ │ Training Group A     │  │ Northeast Region     │                     │
│ │ 25 workers           │  │ 201 workers          │                     │
│ │ Static               │  │ Rule-based           │                     │
│ │                      │  │                      │                     │
│ │     [View Details]   │  │     [View Details]   │                     │
│ └──────────────────────┘  └──────────────────────┘                     │
│                                                                         │
│ ┌──────────────────────────────────────────────────────────────────────┐│
│ │ ◀ Previous │ 1 │ 2 │ 3 │ Next ▶             Items per page: 10 ▾     ││
│ └──────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────────────────────────┐
│ Segments                [Filter][Search] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Sales Team                          │ │
│ │ 45 workers · Static                 │ │
│ │                      [View Details] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ High Performers                     │ │
│ │ 128 workers · Rule-based            │ │
│ │                      [View Details] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ New York Branch                     │ │
│ │ 76 workers · Rule-based             │ │
│ │                      [View Details] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ◀ Prev │ 1 │ 2 │ 3 │ Next ▶        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Create Segment]                      │
└─────────────────────────────────────────┘
```

#### 5.3.2 Builder Layout

A specialized layout for the segment builder, with rule construction area and preview/testing panel.

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Create Segment                                    [Cancel] [Save]    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌──────────────────────────────┐ ┌────────────────────────────────────┐ │
│ │ Segment Properties           │ │ Preview                            │ │
│ │                              │ │                                    │ │
│ │ Name: [High Performers     ] │ │ Matching Workers: 128              │ │
│ │                              │ │                                    │ │
│ │ Description:                 │ │ ┌────────────────────────────────┐ │ │
│ │ [Top performing workers    ] │ │ │ Sample Matches:                │ │ │
│ │ [across departments        ] │ │ │ - John Smith (Performance: 92) │ │ │
│ │                              │ │ │ - Sarah Johnson (Perf: 88)     │ │ │
│ │ Type: [Rule-based     ▾]     │ │ │ - Michael Brown (Perf: 85)     │ │ │
│ │                              │ │ └────────────────────────────────┘ │ │
│ └──────────────────────────────┘ │                                    │ │
│                                  │ ┌────────────────────────────────┐ │ │
│ ┌──────────────────────────────┐ │ │ Programs Using Similar Rules:  │ │ │
│ │ Rule Definition              │ │ │ - Leadership Development       │ │ │
│ │                              │ │ │ - Advanced Training Track      │ │ │
│ │ [Rule Builder Component    ] │ │ └────────────────────────────────┘ │ │
│ │                              │ │                                    │ │
│ │                              │ │ [Test Rules]                       │ │
│ └──────────────────────────────┘ └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tablet/Mobile Layout:**
```
┌─────────────────────────────────────────┐
│ Create Segment        [Cancel] [Save]   │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Segment Properties                  │ │
│ │                                     │ │
│ │ Name: [High Performers           ] │ │
│ │                                     │ │
│ │ Description:                        │ │
│ │ [Top performing workers          ] │ │
│ │ [across departments              ] │ │
│ │                                     │ │
│ │ Type: [Rule-based           ▾]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Rule Definition                     │ │
│ │                                     │ │
│ │ [Rule Builder Component           ] │ │
│ │                                     │ │
│ │ [Test Rules]                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Preview                             │ │
│ │                                     │ │
│ │ Matching Workers: 128               │ │
│ │                                     │ │
│ │ Sample Matches:                     │ │
│ │ - John Smith (Performance: 92)      │ │
│ │ - Sarah Johnson (Perf: 88)          │ │
│ │ - Michael Brown (Perf: 85)          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### 5.3.3 Detail View Layout

A comprehensive layout for viewing all aspects of a segment, including properties, rules, metrics, and membership.

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Segment: High Performers                       [Edit] [Delete]      │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────────┐│
│ │ Overview             │ │ Rules                 │ │ Metrics          ││
│ │                      │ │                       │ │                  ││
│ │ Type: Rule-based     │ │ Match ALL of:         │ │ Total: 128       ││
│ │ Created: June 15     │ │ - Performance > 80    │ │ Active: 125      ││
│ │ Updated: July 2      │ │ - Programs >= 3       │ │ Avg Completion││
│ │ Last Sync: 3 days ago │ │ - Department in       │ │ Rate: 92%      ││
│ │  [Sync Now]          │ │   (Sales, Marketing,  │ │ Wellbeing: 87/100││
│ │                      │ │    Customer Service)   │ │                  ││
│ └───────────────────────┘ └───────────────────────┘ └──────────────────┘│
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Workers                                                [+ Add Worker] │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [Worker List with Selection and Actions Component]              │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Program Usage                                                       │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Currently used in 3 active programs:                                │ │
│ │ - Leadership Essentials (ends in 14 days)                           │ │
│ │ - Customer Excellence (ends in 30 days)                             │ │
│ │ - Advanced Sales Techniques (starts in 3 days)                      │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tablet/Mobile Layout:**
```
┌─────────────────────────────────────────┐
│ ← Segment: High Performers              │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Overview          [Edit] [Delete]   │ │
│ │                                     │ │
│ │ Type: Rule-based                    │ │
│ │ Created: June 15, 2023              │ │
│ │ Updated: July 2, 2023               │ │
│ │ Last Sync: July 5, 2023             │ │
│ │ [Sync Now]                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Rules                               │ │
│ │                                     │ │
│ │ Match ALL of the following:         │ │
│ │ - Performance score > 80            │ │
│ │ - Completed programs >= 3           │ │
│ │ - Department in (Sales, Marketing,  │ │
│ │   Customer Service)                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Metrics                             │ │
│ │                                     │ │
│ │ Total Workers: 128                  │ │
│ │ Active Workers: 125                 │ │
│ │ Avg Completion: 92%                 │ │
│ │ Avg Wellbeing: 87/100               │ │
│ │                                     │ │
│ │ [View Detailed Analytics]           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Workers                 [+ Add]     │ │
│ │                                     │ │
│ │ [Worker List Component - Scrollable]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Program Usage                       │ │
│ │                                     │ │
│ │ Used in 3 active programs           │ │
│ │ [View Programs]                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 6. Page Designs and Implementations

This section details the specific pages within the segmentation feature, including their purpose, layout, components, state management, API integration, and responsive behavior.

### 6.1 Segment List Page

#### 6.1.1 Purpose

The Segment List page provides a comprehensive view of all segments in the organization, allowing users to search, filter, sort, and manage segments. It serves as the primary entry point to the segmentation functionality.

#### 6.1.2 Route

```
/segments
```

#### 6.1.3 Page Structure & Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Segments")                           [+ Create Segment]  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ KPI Cards                                                           │ │
│ │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────┐ │ │
│ │ │ Total Segments│ │ Static        │ │ Rule-based    │ │ Used in   │ │ │
│ │ │ 27            │ │ 12            │ │ 15            │ │ Programs  │ │ │
│ │ │               │ │               │ │               │ │ 18        │ │ │
│ │ └───────────────┘ └───────────────┘ └───────────────┘ └───────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────────────────────────┐ ┌─────────┐ ┌─────────────────┐ │ │
│ │ │ 🔍 Search segments...           │ │ Filters ▾│ │ Type: All     ▾ │ │ │
│ │ └─────────────────────────────────┘ └─────────┘ └─────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [SegmentsList Component]                                        │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Segments may be used to target specific workers for programs and    │ │
│ │ experiments. Static segments contain manually selected workers,     │ │
│ │ while rule-based segments automatically update based on conditions. │ │
│ │ [Learn more about segments]                                         │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Core Components:**

1. **PageHeader**: Standard header with breadcrumb and page title.
   - **Props**: `title: string`, `actions: React.ReactNode[]`

2. **KPICards**: Summary metrics about segments in the organization.
   - **Props**: `totalCount: number`, `staticCount: number`, `dynamicCount: number`, `usedInProgramsCount: number`

3. **SegmentsList**: Primary component for displaying segments (detailed in UI Components section).
   - **Props**: As defined in Section 5.1.1

4. **FilterControl**: Controls for filtering segments by type, usage, etc.
   - **Props**: `filters: SegmentFilters`, `onFilterChange: (filters: SegmentFilters) => void`

5. **SearchInput**: Search field for finding segments by name.
   - **Props**: `value: string`, `onChange: (value: string) => void`, `placeholder: string`

#### 6.1.4 State Management

The Segment List page manages the following state:

1. **API Data**:
   ```tsx
   const [searchQuery, setSearchQuery] = useState<string>('');
   const [filters, setFilters] = useState<SegmentFilters>({
     type: 'all',
     usedInPrograms: undefined,
     createdBy: undefined
   });
   const [pagination, setPagination] = useState<PaginationState>({
     page: 1,
     limit: 10
   });
   const [sorting, setSorting] = useState<SortingState>({
     field: 'updated_at',
     direction: 'desc'
   });

   const { 
     data: segmentsData, 
     isLoading,
     error 
   } = useSegments({
     search: searchQuery,
     ...filters,
     page: pagination.page,
     limit: pagination.limit,
     sortBy: sorting.field,
     sortDirection: sorting.direction
   });
   ```

2. **UI State**:
   ```tsx
   const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
   const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
   const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState<boolean>(false);
   ```

#### 6.1.5 API Integration

The Segment List page integrates with the following API endpoints:

1. **GET /api/v1/segments**: Fetch segments list with filtering, pagination, sorting.
   ```tsx
   // Handled by useSegments hook (see Section 3.3)
   ```

2. **DELETE /api/v1/segments/{segmentId}**: Delete a segment.
   ```tsx
   const { mutate: deleteSegment, isLoading: isDeleting } = useDeleteSegment();
   
   const handleDeleteSegment = (segmentId: string) => {
     setSelectedSegmentId(segmentId);
     setIsConfirmDeleteModalOpen(true);
   };
   
   const confirmDeleteSegment = () => {
     if (selectedSegmentId) {
       deleteSegment(selectedSegmentId);
       setIsConfirmDeleteModalOpen(false);
     }
   };
   ```

#### 6.1.6 User Interactions

The Segment List page supports the following interactions:

1. **Search**: Filter segments by name or description.
2. **Filter**: Filter segments by type, usage in programs, creation date.
3. **Sort**: Sort segments by name, creation date, update date, worker count.
4. **Pagination**: Navigate between pages of segments.
5. **Create**: Navigate to segment creation page.
6. **View Details**: Navigate to segment detail page.
7. **Edit**: Navigate to segment edit page.
8. **Delete**: Delete a segment after confirmation.

#### 6.1.7 Responsive Behavior

The Segment List page adapts to different screen sizes:

1. **Desktop (≥1024px)**: 
   - Full table layout with all columns visible
   - KPI cards displayed in a single row
   - Sidebar navigation visible

2. **Tablet (768px-1023px)**:
   - Card-based layout instead of table for segments
   - KPI cards may wrap to two rows
   - Condensed filters

3. **Mobile (<768px)**:
   - Stacked card layout for segments
   - KPI cards stack vertically or display as a scrollable row
   - Filters collapse into a dropdown menu
   - Full-width search and action buttons

### 6.2 Segment Builder/Creation Page

#### 6.2.1 Purpose

The Segment Builder page allows users to create new segments or edit existing ones. It provides interfaces for defining segment properties and building complex rule-based segments.

#### 6.2.2 Routes

```
/segments/create
/segments/{segmentId}/edit
```

#### 6.2.3 Page Structure & Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Create Segment")                       [Cancel] [Save]   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Basic Information")                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Name*                                                           │ │ │
│ │ │ [                                                             ] │ │ │
│ │ │                                                                 │ │ │
│ │ │ Description                                                     │ │ │
│ │ │ [                                                             ] │ │ │
│ │ │ [                                                             ] │ │ │
│ │ │                                                                 │ │ │
│ │ │ Segment Type*                                                   │ │ │
│ │ │ (•) Rule-based: Automatically include workers matching rules    │ │ │
│ │ │ ( ) Static: Manually specify which workers to include           │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Rule Definition")                                      │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [RuleBuilder Component]                                         │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Preview")                                              │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Matching Workers: 45                                            │ │ │
│ │ │                                                                 │ │ │
│ │ │ Sample Matches:                                                 │ │ │
│ │ │ - John Smith (New York, Sales, Performance: 92)                 │ │ │
│ │ │ - Sarah Johnson (New York, Sales, Performance: 88)              │ │ │
│ │ │ - Michael Brown (New York, Sales, Performance: 85)              │ │ │
│ │ │                                                                 │ │ │
│ │ │ [View All Matching Workers]                                     │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Worker Selection") - Only visible for Static Segments  │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ [WorkerSelectionList Component]                                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Core Components:**

1. **PageHeader**: Standard header with breadcrumb and page title.
   - **Props**: `title: string`, `actions: React.ReactNode[]`

2. **FormSection**: Container for grouping related form fields.
   - **Props**: `title: string`, `description?: string`, `children: React.ReactNode`

3. **TextField**: Input field for segment name and description.
   - **Props**: `name: string`, `label: string`, `value: string`, `onChange: (value: string) => void`, `required?: boolean`, `error?: string`

4. **RadioGroup**: For selecting segment type (rule-based/static).
   - **Props**: `name: string`, `options: RadioOption[]`, `value: string`, `onChange: (value: string) => void`

5. **RuleBuilder**: For building segment rules (detailed in UI Components section).
   - **Props**: As defined in Section 5.1.2

6. **WorkerSelectionList**: For selecting workers for static segments.
   - **Props**: `selectedWorkerIds: string[]`, `onWorkerSelect: (workerId: string, selected: boolean) => void`, `onSearchWorkers: (query: string) => void`

#### 6.2.4 State Management

The Segment Builder page manages the following state:

1. **Form State** (using React Hook Form):
   ```tsx
   const { segmentId } = useParams();
   const isEditMode = !!segmentId;
   
   const { data: existingSegment, isLoading: isLoadingSegment } = useSegment(
     segmentId || '',
     { enabled: isEditMode }
   );
   
   const { data: availableFields } = useSegmentTypes();
   
   const formMethods = useForm<SegmentFormData>({
     resolver: zodResolver(segmentValidation.segmentSchema),
     defaultValues: {
       name: '',
       description: '',
       type: 'rule-based',
       rule_definition: {
         condition: 'and',
         rules: []
       },
       worker_ids: []
     },
     mode: 'onChange'
   });
   
   const { handleSubmit, control, watch, setValue, formState: { errors, isDirty, isValid } } = formMethods;
   const segmentType = watch('type');
   ```

2. **Rule Testing State**:
   ```tsx
   const [isTestingRules, setIsTestingRules] = useState<boolean>(false);
   const [testResults, setTestResults] = useState<TestRuleResponse | null>(null);
   
   const { mutateAsync: testRule, isLoading: isLoadingTest } = useTestSegmentRule();
   
   const handleTestRules = async () => {
     const rules = watch('rule_definition');
     if (rules.rules.length === 0) return;
     
     setIsTestingRules(true);
     try {
       const results = await testRule({ rule_definition: rules });
       setTestResults(results);
     } catch (error) {
       console.error('Error testing rules:', error);
     } finally {
       setIsTestingRules(false);
     }
   };
   ```

3. **Worker Selection State** (for static segments):
   ```tsx
   const [workerSearchQuery, setWorkerSearchQuery] = useState<string>('');
   
   const { data: workers, isLoading: isLoadingWorkers } = useQuery(
     ['workers', workerSearchQuery],
     () => api.endpoints.workers.getWorkers({ search: workerSearchQuery }),
     {
       enabled: segmentType === 'static',
       staleTime: 30000
     }
   );
   ```

#### 6.2.5 API Integration

The Segment Builder page integrates with the following API endpoints:

1. **GET /api/v1/segments/{segmentId}**: Fetch existing segment for editing.
   ```tsx
   // Handled by useSegment hook (see Section 3.3)
   ```

2. **POST /api/v1/segments**: Create a new segment.
   ```tsx
   const { mutate: createSegment, isLoading: isCreating } = useCreateSegment();
   
   const onSubmit = handleSubmit((data) => {
     createSegment(data);
   });
   ```

3. **PATCH /api/v1/segments/{segmentId}**: Update an existing segment.
   ```tsx
   const { mutate: updateSegment, isLoading: isUpdating } = useUpdateSegment(segmentId || '');
   
   const onSubmit = handleSubmit((data) => {
     if (isEditMode && segmentId) {
       updateSegment(data);
     } else {
       createSegment(data);
     }
   });
   ```

4. **POST /api/v1/segments/{segmentId}/test-rule**: Test a rule definition.
   ```tsx
   // Handled in the Rule Testing State section above
   ```

5. **GET /api/v1/segments/types**: Get available field types for rules.
   ```tsx
   // Handled by useSegmentTypes hook (see Section 3.3)
   ```

6. **GET /api/v1/workers**: Fetch workers for static segment selection.
   ```tsx
   // Handled in the Worker Selection State section above
   ```

#### 6.2.6 User Interactions

The Segment Builder page supports the following interactions:

1. **Input Details**: Enter segment name, description.
2. **Select Type**: Choose between rule-based or static segment.
3. **Build Rules**: For rule-based segments, define conditions using the rule builder.
4. **Test Rules**: Preview the results of rule-based segments.
5. **Select Workers**: For static segments, search and select workers to include.
6. **Save**: Create a new segment or update an existing one.
7. **Cancel**: Discard changes and return to segments list.

#### 6.2.7 Responsive Behavior

The Segment Builder page adapts to different screen sizes:

1. **Desktop (≥1024px)**: 
   - Two-column layout for form sections
   - Side-by-side arrangement of rule builder and preview panel
   - Full-featured rule builder with all capabilities

2. **Tablet (768px-1023px)**:
   - Single-column layout for form sections
   - Preview panel below rule builder
   - Slightly simplified rule builder UI

3. **Mobile (<768px)**:
   - Single-column, stacked layout
   - Simplified rule builder with fewer visual elements
   - Collapsible sections to save space
   - Bottom-fixed action buttons (Save/Cancel)

### 6.3 Segment Detail/Worker Membership Page

#### 6.3.1 Purpose

The Segment Detail page provides a comprehensive view of a specific segment, showing its properties, rules, metrics, membership, and usage in programs. It also allows management of segment membership for static segments.

#### 6.3.2 Route

```
/segments/{segmentId}
```

#### 6.3.3 Page Structure & Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Segment: High Performers")    [Edit] [Delete] [Sync Now] │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ TabNavigation                                                       │ │
│ │ ┌───────────┐┌──────────────┐┌────────────────┐┌───────────────────┐│ │
│ │ │ Overview  ││ Workers      ││ Program Usage  ││ Analytics        ││ │
│ │ └───────────┘└──────────────┘└────────────────┘└───────────────────┘│ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [Tab Content - Changes based on selected tab]                       │ │
│ │                                                                     │ │
│ │ [Overview Tab]                                                      │ │
│ │ ┌───────────────────────┐ ┌───────────────────────────────────────┐│ │
│ │ │ Segment Properties    │ │ Segment Rules                         ││ │
│ │ │ Type: Rule-based      │ │ Match workers where ALL of:           ││ │
│ │ │ Created: June 15, 2023│ │ - Performance score > 80              ││ │
│ │ │ Updated: July 2, 2023 │ │ - Completed programs >= 3             ││ │
│ │ │ Last Sync: 3 days ago │ │ - Department in (Sales, Marketing,  ││ │
│ │ └───────────────────────┘ │   Customer Service)                   ││ │
│ │                          └───────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐│ │
│ │ │ Segment Metrics                                                 ││ │
│ │ │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          ││ │
│ │ │ │ Total Workers │ │ Active Programs│ │ Avg Completion│          ││ │
│ │ │ │ 128           │ │ 3             │ │ Rate: 92%     │          ││ │
│ │ │ └───────────────┘ └───────────────┘ └───────────────┘          ││ │
│ │ └─────────────────────────────────────────────────────────────────┘│ │
│ │                                                                     │ │
│ │ [OR Workers Tab]                                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐│ │
│ │ │ [WorkerListWithActions Component]                               ││ │
│ │ └─────────────────────────────────────────────────────────────────┘│ │
│ │                                                                     │ │
│ │ [OR Program Usage Tab]                                              │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐│ │
│ │ │ [Program List showing programs using this segment]              ││ │
│ │ └─────────────────────────────────────────────────────────────────┘│ │
│ │                                                                     │ │
│ │ [OR Analytics Tab]                                                  │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐│ │
│ │ │ [SegmentAnalyticsCharts Component]                              ││ │
│ │ └─────────────────────────────────────────────────────────────────┘│ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Core Components:**

1. **PageHeader**: Standard header with breadcrumb and page title.
   - **Props**: `title: string`, `actions: React.ReactNode[]`

2. **TabNavigation**: Tabbed interface for switching between different views.
   - **Props**: `tabs: Tab[]`, `activeTab: string`, `onTabChange: (tab: string) => void`

3. **SegmentDetailsPanel**: Displays segment properties and rules (detailed in UI Components section).
   - **Props**: As defined in Section 5.1.3

4. **WorkerListWithActions**: Displays workers in the segment (detailed in UI Components section).
   - **Props**: As defined in Section 5.1.4

5. **ProgramList**: Displays programs using this segment.
   - **Props**: `programs: Program[]`, `isLoading: boolean`, `error?: Error`, `onViewProgram: (programId: string) => void`

6. **SegmentAnalyticsCharts**: Data visualizations showing segment performance.
   - **Props**: `segmentId: string`, `timeRange: TimeRange`, `onTimeRangeChange: (range: TimeRange) => void`

#### 6.3.4 State Management

The Segment Detail page manages the following state:

1. **Tab Navigation State**:
   ```tsx
   const [activeTab, setActiveTab] = useState<string>('overview');
   ```

2. **Segment Data**:
   ```tsx
   const { segmentId } = useParams();
   
   const { 
     data: segment, 
     isLoading: isLoadingSegment,
     error: segmentError 
   } = useSegment(segmentId || '');
   
   const {
     data: segmentAnalytics,
     isLoading: isLoadingAnalytics
   } = useQuery(
     ['segmentAnalytics', segmentId],
     () => api.endpoints.segments.getSegmentAnalytics(segmentId || ''),
     {
       enabled: !!segmentId && activeTab === 'analytics',
       staleTime: 300000 // 5 minutes
     }
   );
   ```

3. **Workers Tab State**:
   ```tsx
   const [workerFilters, setWorkerFilters] = useState<WorkerFilters>({});
   const [workerSearch, setWorkerSearch] = useState<string>('');
   const [workerPagination, setWorkerPagination] = useState<PaginationState>({
     page: 1,
     limit: 10
   });
   
   const {
     data: workers,
     isLoading: isLoadingWorkers
   } = useSegmentWorkers(segmentId || '', {
     search: workerSearch,
     ...workerFilters,
     page: workerPagination.page,
     limit: workerPagination.limit
   });
   ```

4. **Programs Tab State**:
   ```tsx
   const {
     data: programs,
     isLoading: isLoadingPrograms
   } = useQuery(
     ['segmentPrograms', segmentId],
     () => api.endpoints.segments.getSegmentPrograms(segmentId || ''),
     {
       enabled: !!segmentId && activeTab === 'programs',
       staleTime: 300000 // 5 minutes
     }
   );
   ```

#### 6.3.5 API Integration

The Segment Detail page integrates with the following API endpoints:

1. **GET /api/v1/segments/{segmentId}**: Fetch segment details.
   ```tsx
   // Handled by useSegment hook (see Section 3.3)
   ```

2. **GET /api/v1/segments/{segmentId}/workers**: Fetch workers in the segment.
   ```tsx
   // Handled by useSegmentWorkers hook (see Section 3.3)
   ```

3. **POST /api/v1/segments/{segmentId}/sync**: Manually trigger segment synchronization.
   ```tsx
   const { mutate: syncSegment, isLoading: isSyncing } = useSyncSegment(segmentId || '');
   
   const handleSync = () => {
     syncSegment();
   };
   ```

4. **DELETE /api/v1/segments/{segmentId}**: Delete the segment.
   ```tsx
   const { mutate: deleteSegment, isLoading: isDeleting } = useDeleteSegment();
   const navigate = useNavigate();
   
   const handleDelete = () => {
     setIsConfirmDeleteModalOpen(true);
   };
   
   const confirmDelete = () => {
     deleteSegment(segmentId || '', {
       onSuccess: () => {
         navigate('/segments');
       }
     });
     setIsConfirmDeleteModalOpen(false);
   };
   ```

5. **POST /api/v1/segments/{segmentId}/workers**: Add workers to a static segment.
   ```tsx
   const { mutate: addWorkers, isLoading: isAddingWorkers } = useAddWorkersToSegment(segmentId || '');
   
   const handleAddWorkers = (workerIds: string[]) => {
     addWorkers(workerIds);
   };
   ```

6. **DELETE /api/v1/segments/{segmentId}/workers/{workerId}**: Remove a worker from a static segment.
   ```tsx
   const { mutate: removeWorker, isLoading: isRemovingWorker } = useRemoveWorkerFromSegment(segmentId || '');
   
   const handleRemoveWorker = (workerId: string) => {
     removeWorker(workerId);
   };
   ```

7. **GET /api/v1/segments/{segmentId}/analytics**: Get analytics data for the segment.
   ```tsx
   // Handled in the Segment Data section above
   ```

#### 6.3.6 User Interactions

The Segment Detail page supports the following interactions:

1. **Tab Navigation**: Switch between Overview, Workers, Program Usage, and Analytics tabs.
2. **Edit Segment**: Navigate to the segment edit page.
3. **Delete Segment**: Delete the segment after confirmation.
4. **Sync Segment**: Manually trigger recalculation of segment membership (for rule-based segments).
5. **Worker Management**: For static segments, add or remove workers.
6. **Worker Actions**: View worker details, add to program, etc.
7. **Program Viewing**: See details of programs using this segment.
8. **Analytics Exploration**: Explore segment performance data with different time ranges and metrics.

#### 6.3.7 Responsive Behavior

The Segment Detail page adapts to different screen sizes:

1. **Desktop (≥1024px)**: 
   - Multi-column layout for overview dashboard
   - Data tables for workers and programs
   - Full analytics visualizations

2. **Tablet (768px-1023px)**:
   - Two-column grid for overview metrics
   - Card-based layout for workers and programs
   - Simplified analytics charts

3. **Mobile (<768px)**:
   - Single-column, stacked layout throughout
   - Vertically stacked cards for all data
   - Tab navigation may convert to dropdown
   - Simplified charts with reduced detail level

## 7. State Management and Data Flow

### 7.1 Local vs. Global State

The Segmentation feature primarily uses local state management for page-specific concerns, with minimal global state. This approach follows the project's rule of using React Context sparingly for truly global state (Rule 4.1).

#### 7.1.1 Local State Pattern

Most state is managed at the component or page level using React's `useState` and `useReducer` hooks. This includes:

- Form state for segment creation/editing
- UI state like active tabs, open/closed panels, selected items
- Pagination, sorting, and filtering state for lists
- Rule builder state for segment conditions

**Example: Local State in Segment List Page:**
```tsx
// Component-level state management
const SegmentListPage: React.FC = () => {
  // UI state
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  
  // List control state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<SegmentFilters>({
    type: 'all',
    usedInPrograms: undefined,
    createdBy: undefined
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10
  });
  
  // Data fetching with API state management via React Query
  const { 
    data: segmentsData, 
    isLoading,
    error 
  } = useSegments({
    search: searchQuery,
    ...filters,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sorting.field,
    sortDirection: sorting.direction
  });
  
  // Rest of component...
};
```

#### 7.1.2 Global State Usage

The Segmentation feature interacts with the following global state:

1. **Authentication State**: Accessed via the `useAuth` hook to verify permissions and get current user info.
2. **Organization Context**: Accessed via the `useTenant` hook to get the current organization ID, which is needed for all API requests.
3. **Notification State**: Used for displaying toast notifications after operations like creating/updating segments.

**Example: Using Global State:**
```tsx
// Accessing global auth state
const { user, permissions } = useAuth();
const hasCreatePermission = permissions.includes('segments:create');

// Accessing organization context
const { organizationId } = useTenant();

// Interacting with notification state
const { toast } = useToast();
toast.success('Segment created successfully');
```

### 7.2 API State Management

The Segmentation feature uses React Query for API state management, following the recommended pattern in Rule 4.5. This provides caching, background refetching, loading/error states, and optimistic updates.

#### 7.2.1 Query Pattern

Queries for fetching data use the React Query pattern with custom hooks:

```tsx
// Define in hooks/features/useSegmentsApi.ts
export const useSegments = (params?: SegmentQueryParams) => {
  return useQuery<SegmentListResponse, Error>(
    ['segments', params], // Query key for caching
    () => api.endpoints.segments.getSegments(params),
    {
      staleTime: 60000, // Data is fresh for 1 minute
      keepPreviousData: true, // Keep previous data while fetching new
    }
  );
};

// Use in components
const { 
  data, 
  isLoading, 
  error, 
  refetch 
} = useSegments({ 
  search: searchQuery, 
  type: selectedType 
});
```

#### 7.2.2 Mutation Pattern

Mutations for creating, updating, or deleting data use the React Query mutation pattern:

```tsx
// Define in hooks/features/useSegmentsApi.ts
export const useCreateSegment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation<Segment, Error, CreateSegmentRequest>(
    (data) => api.endpoints.segments.createSegment(data),
    {
      onSuccess: (segment) => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['segments']);
        // Show success notification
        toast.success('Segment created successfully');
        // Navigate to the new segment
        navigate(`/segments/${segment.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create segment: ${error.message}`);
      }
    }
  );
};

// Use in components
const { mutate: createSegment, isLoading } = useCreateSegment();

const handleSubmit = (data: SegmentFormData) => {
  createSegment(data);
};
```

#### 7.2.3 Optimistic Updates

For better user experience, some operations use optimistic updates to immediately reflect changes in the UI:

```tsx
// Example: Optimistic update when removing a worker from a segment
export const useRemoveWorkerFromSegment = (segmentId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>(
    (workerId) => api.endpoints.segments.removeWorkerFromSegment(segmentId, workerId),
    {
      // Optimistically update the UI
      onMutate: async (workerId) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(['segmentWorkers', segmentId]);
        
        // Snapshot the previous value
        const previousWorkers = queryClient.getQueryData<WorkerListResponse>(['segmentWorkers', segmentId]);
        
        // Optimistically update to the new value
        if (previousWorkers) {
          queryClient.setQueryData<WorkerListResponse>(
            ['segmentWorkers', segmentId], 
            {
              ...previousWorkers,
              items: previousWorkers.items.filter(worker => worker.id !== workerId),
              total: previousWorkers.total - 1
            }
          );
        }
        
        // Return a context object with the snapshot
        return { previousWorkers };
      },
      // If the mutation fails, roll back
      onError: (err, workerId, context) => {
        if (context?.previousWorkers) {
          queryClient.setQueryData<WorkerListResponse>(
            ['segmentWorkers', segmentId],
            context.previousWorkers
          );
        }
        toast.error(`Failed to remove worker: ${err.message}`);
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.invalidateQueries(['segmentWorkers', segmentId]);
        queryClient.invalidateQueries(['segment', segmentId]);
      },
    }
  );
};
```

### 7.3 Form State

The Segmentation feature uses React Hook Form for form state management, as recommended in Rule 4.3. This provides validation, error handling, and efficient form state updates.

#### 7.3.1 Basic Form Pattern

Simple forms use the basic React Hook Form pattern:

```tsx
// Form state using React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm<SegmentFormData>({
  resolver: zodResolver(segmentSchema),
  defaultValues: {
    name: '',
    description: '',
    type: 'rule-based'
  }
});

// Form submission handler
const onSubmit = handleSubmit((data) => {
  createSegment(data);
});

// Form JSX
return (
  <form onSubmit={onSubmit}>
    <div className="form-group">
      <label htmlFor="name">Segment Name*</label>
      <input
        id="name"
        type="text"
        {...register('name')}
        className={errors.name ? 'input-error' : ''}
      />
      {errors.name && <span className="error">{errors.name.message}</span>}
    </div>
    
    {/* More form fields... */}
    
    <button type="submit">Create Segment</button>
  </form>
);
```

#### 7.3.2 Complex Form Pattern

More complex forms, like the segment rule builder, use a combination of React Hook Form and custom state management:

```tsx
// Form state using React Hook Form with watch for reactive updates
const { control, watch, setValue, handleSubmit } = useForm<SegmentFormData>({
  resolver: zodResolver(segmentSchema),
  defaultValues: {
    name: '',
    description: '',
    type: 'rule-based',
    rule_definition: {
      condition: 'and',
      rules: []
    }
  }
});

// Watch values for conditional rendering
const segmentType = watch('type');
const rules = watch('rule_definition');

// Custom handler for rule updates
const handleRuleChange = (newRules: RuleDefinition) => {
  setValue('rule_definition', newRules, {
    shouldValidate: true,
    shouldDirty: true
  });
};

// Form JSX with conditional fields
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Basic fields... */}
    
    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <RadioGroup
          label="Segment Type"
          options={[
            { value: 'rule-based', label: 'Rule-based' },
            { value: 'static', label: 'Static' }
          ]}
          {...field}
        />
      )}
    />
    
    {segmentType === 'rule-based' && (
      <RuleBuilder
        initialRules={rules}
        availableFields={availableFields || []}
        onChange={handleRuleChange}
        onTest={handleTestRules}
        testResults={testResults}
        isTestLoading={isTestingRules}
      />
    )}
    
    {segmentType === 'static' && (
      <WorkerSelectionList
        selectedWorkerIds={watch('worker_ids')}
        onWorkerSelect={(workerId, selected) => {
          const currentIds = watch('worker_ids');
          setValue(
            'worker_ids',
            selected
              ? [...currentIds, workerId]
              : currentIds.filter(id => id !== workerId),
            { shouldValidate: true }
          );
        }}
        onSearchWorkers={setWorkerSearchQuery}
      />
    )}
    
    <div className="form-actions">
      <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      <Button type="submit" isLoading={isSubmitting}>Save Segment</Button>
    </div>
  </form>
);
```

## 8. Validation and Error Handling

### 8.1 Form Validation

The segmentation feature implements robust form validation to ensure data integrity and provide clear feedback to users when they make mistakes.

#### 8.1.1 Validation Schema

The segmentation feature uses Zod for schema validation, as recommended in Rule 8.2. This provides type-safe and declarative validation rules.

```typescript
// src/lib/validation/segment.ts

import { z } from 'zod';

// Base rule validation
const ruleSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: z.string().min(1, 'Operator is required'),
  value: z.any()
});

// Recursive rule group schema for nested conditions
const ruleGroupSchema: z.ZodType<any> = z.lazy(() => 
  z.object({
    condition: z.enum(['and', 'or']),
    rules: z.array(
      z.union([ruleSchema, ruleGroupSchema])
    ).min(1, 'At least one rule is required')
  })
);

// Schema for creating or updating a segment
export const segmentSchema = z.object({
  name: z.string().min(1, 'Segment name is required').max(100, 'Segment name must be less than 100 characters'),
  description: z.string().optional(),
  type: z.enum(['static', 'rule-based']),
  rule_definition: z.preprocess(
    // Only validate rule_definition for rule-based segments
    (val, ctx) => {
      const type = (ctx.parent as any)?.type;
      if (type === 'rule-based') return val;
      return { condition: 'and', rules: [] };
    },
    ruleGroupSchema.optional()
  ),
  worker_ids: z.preprocess(
    // Only validate worker_ids for static segments
    (val, ctx) => {
      const type = (ctx.parent as any)?.type;
      if (type === 'static') return val;
      return [];
    },
    z.array(z.string().uuid('Invalid worker ID'))
      .min(1, 'At least one worker must be selected for a static segment')
  )
});

// Schema for testing a rule definition
export const testRuleSchema = z.object({
  rule_definition: ruleGroupSchema
});
```

#### 8.1.2 Form-Level Validation

Validation is applied at the form level using React Hook Form's integration with Zod:

```typescript
const formMethods = useForm<SegmentFormData>({
  resolver: zodResolver(segmentValidation.segmentSchema),
  defaultValues: {
    name: '',
    description: '',
    type: 'rule-based',
    rule_definition: {
      condition: 'and',
      rules: []
    },
    worker_ids: []
  },
  mode: 'onChange' // Validate on change for immediate feedback
});

const { errors } = formState;
```

#### 8.1.3 Field-Level Validation and Feedback

Each form field provides clear error feedback when validation fails:

```tsx
<div className="form-group">
  <label htmlFor="name">Segment Name*</label>
  <input
    id="name"
    type="text"
    {...register('name')}
    aria-invalid={errors.name ? 'true' : 'false'}
    className={errors.name ? 'input-error' : ''}
  />
  {errors.name && (
    <span className="error" role="alert">
      {errors.name.message}
    </span>
  )}
</div>
```

#### 8.1.4 Dynamic Validation

The RuleBuilder component also implements dynamic validation based on field types:

- Numeric fields validate that input values are numbers
- Date fields validate valid date formats
- Dropdown fields validate against available options
- Text fields validate against minimum/maximum length requirements

```tsx
// Dynamic validation based on field type
const validateRuleValue = (rule: Rule, availableFields: RuleField[]) => {
  const field = availableFields.find(f => f.id === rule.field);
  if (!field) return false;
  
  switch (field.type) {
    case 'number':
      return !isNaN(Number(rule.value));
    case 'date':
      return !isNaN(Date.parse(rule.value));
    case 'select':
    case 'multi-select':
      return field.options?.some(opt => opt.value === rule.value);
    default:
      return true;
  }
};
```

### 8.2 API Error Handling

The segmentation feature implements robust error handling for API interactions, ensuring users are properly informed when operations fail and allowing for appropriate recovery.

#### 8.2.1 API Response Error Structure

The backend API returns errors in a consistent format:

```typescript
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```

#### 8.2.2 API Client Error Handling

The API client is configured to transform and handle errors consistently:

```typescript
// src/lib/api/client.ts

import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling interceptor
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    // Standardize error format
    const apiError = new Error(
      error.response?.data?.message || 'An unexpected error occurred'
    ) as Error & {
      status?: number;
      code?: string;
      details?: Record<string, string[]>;
    };
    
    // Add additional error properties
    apiError.status = error.response?.status;
    apiError.code = error.response?.data?.code;
    apiError.details = error.response?.data?.details;
    
    // Special handling for specific error codes
    if (apiError.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
    } else if (apiError.status === 403) {
      // Handle forbidden (e.g., show permission denied message)
    } else if (apiError.status === 404) {
      // Handle not found (e.g., show resource not found message)
    }
    
    return Promise.reject(apiError);
  }
);

export default apiClient;
```

#### 8.2.3 React Query Error Handling

React Query's mutations include error handling in their configuration:

```typescript
export const useCreateSegment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return useMutation<Segment, Error, CreateSegmentRequest>(
    (data) => api.endpoints.segments.createSegment(data),
    {
      onSuccess: (segment) => {
        queryClient.invalidateQueries(['segments']);
        toast.success('Segment created successfully');
        navigate(`/segments/${segment.id}`);
      },
      onError: (error) => {
        // Display appropriate error message based on the error
        if (error.status === 400 && error.details) {
          // Handle validation errors
          const validationErrors = Object.values(error.details).flat();
          toast.error(validationErrors[0] || 'Invalid form data');
        } else if (error.status === 409) {
          // Handle conflict errors (e.g., duplicate name)
          toast.error('A segment with this name already exists');
        } else {
          // Handle generic errors
          toast.error(`Failed to create segment: ${error.message}`);
        }
      }
    }
  );
};
```

### 8.3 User Feedback

The segmentation feature provides clear and consistent feedback to users throughout their interactions with the system.

#### 8.3.1 Success Feedback

Successful operations are confirmed with toast notifications:

```typescript
// After successful segment creation
toast.success('Segment created successfully');

// After successful segment update
toast.success('Segment updated successfully');

// After successful segment deletion
toast.success('Segment deleted successfully');

// After successfully adding workers to a segment
toast.success(`Added ${workerIds.length} workers to the segment`);
```

#### 8.3.2 Progress Indicators

Long-running operations show loading indicators to provide visual feedback:

```tsx
// Button with loading state
<Button 
  type="submit" 
  variant="primary" 
  isLoading={isSubmitting}
  disabled={isSubmitting || !isValid}
>
  {isSubmitting ? 'Saving...' : 'Save Segment'}
</Button>

// Table with loading state
<DataTable 
  data={data?.items || []}
  columns={columns}
  isLoading={isLoading}
  LoadingComponent={<TableSkeleton columns={5} rows={10} />}
/>

// Page with loading state
{isLoadingSegment ? (
  <PageSkeleton />
) : (
  <SegmentDetailContent segment={segment} />
)}
```

#### 8.3.3 Confirmation Dialogs

Destructive or significant actions require confirmation to prevent accidental operations:

```tsx
// Delete confirmation dialog
<ConfirmationDialog
  isOpen={isConfirmDeleteModalOpen}
  onClose={() => setIsConfirmDeleteModalOpen(false)}
  onConfirm={confirmDelete}
  title="Delete Segment"
  description="Are you sure you want to delete this segment? This action cannot be undone and will remove this segment from all programs using it."
  confirmLabel="Delete"
  confirmVariant="danger"
  isLoading={isDeleting}
/>
```

#### 8.3.4 Inline Validation Feedback

Form fields provide immediate validation feedback as users type:

```tsx
<TextField
  label="Segment Name"
  error={errors.name?.message}
  {...register('name')}
  required
/>
```

#### 8.3.5 Empty States

When no data is available, informative empty states are displayed instead of blank areas:

```tsx
{segments.length === 0 ? (
  <EmptyState
    icon={<SegmentIcon size={64} />}
    title="No segments found"
    description="Create your first segment to start targeting specific groups of workers."
    action={
      hasCreatePermission && (
        <Button onClick={handleCreateSegment}>
          Create Segment
        </Button>
      )
    }
  />
) : (
  <SegmentsList segments={segments} />
)}
```

## 9. Testing Strategy

The segmentation feature implements a comprehensive testing strategy to ensure reliability, correctness, and quality.

### 9.1 Component Testing

Individual components are tested in isolation using React Testing Library, focusing on user interactions and expected behavior rather than implementation details.

#### 9.1.1 UI Component Tests

Basic UI components are tested for rendering, interactions, and accessibility:

```typescript
// src/components/features/segments/SegmentsList.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentsList } from './SegmentsList';

describe('SegmentsList', () => {
  const mockSegments = [
    { 
      id: '1', 
      name: 'Sales Team', 
      type: 'static', 
      worker_count: 45, 
      updated_at: '2023-07-01T12:00:00Z' 
    },
    { 
      id: '2', 
      name: 'High Performers', 
      type: 'rule-based', 
      worker_count: 128, 
      updated_at: '2023-06-15T10:30:00Z' 
    }
  ];
  
  const mockHandlers = {
    onCreateSegment: jest.fn(),
    onSelectSegment: jest.fn(),
    onDeleteSegment: jest.fn(),
    onSearch: jest.fn(),
    onFilter: jest.fn(),
    onSort: jest.fn(),
    onPaginate: jest.fn()
  };
  
  it('renders a list of segments', () => {
    render(
      <SegmentsList 
        segments={{ items: mockSegments, total: 2 }}
        isLoading={false}
        {...mockHandlers}
      />
    );
    
    // Check segment names are displayed
    expect(screen.getByText('Sales Team')).toBeInTheDocument();
    expect(screen.getByText('High Performers')).toBeInTheDocument();
    
    // Check segment types are displayed
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Rule-based')).toBeInTheDocument();
  });
  
  it('calls onSelectSegment when a segment is clicked', () => {
    render(
      <SegmentsList 
        segments={{ items: mockSegments, total: 2 }}
        isLoading={false}
        {...mockHandlers}
      />
    );
    
    fireEvent.click(screen.getByText('Sales Team'));
    expect(mockHandlers.onSelectSegment).toHaveBeenCalledWith('1');
  });
  
  it('shows loading state when isLoading is true', () => {
    render(
      <SegmentsList 
        segments={{ items: [], total: 0 }}
        isLoading={true}
        {...mockHandlers}
      />
    );
    
    expect(screen.getByTestId('segments-list-loading')).toBeInTheDocument();
  });
  
  it('shows empty state when no segments are available', () => {
    render(
      <SegmentsList 
        segments={{ items: [], total: 0 }}
        isLoading={false}
        {...mockHandlers}
      />
    );
    
    expect(screen.getByText('No segments found')).toBeInTheDocument();
  });
});
```

#### 9.1.2 Form Component Tests

Form components are tested for validation, submission, and error handling:

```typescript
// src/components/features/segments/SegmentForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentForm } from './SegmentForm';

describe('SegmentForm', () => {
  const mockHandlers = {
    onSubmit: jest.fn(),
    onCancel: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the form with empty values initially', () => {
    render(<SegmentForm {...mockHandlers} />);
    
    // Check form elements are rendered
    expect(screen.getByLabelText(/Segment Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rule-based/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Static/i)).toBeInTheDocument();
    
    // Check default radio button is selected
    expect(screen.getByLabelText(/Rule-based/i)).toBeChecked();
  });
  
  it('validates required fields', async () => {
    render(<SegmentForm {...mockHandlers} />);
    
    // Submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(submitButton);
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/Segment name is required/i)).toBeInTheDocument();
    });
    
    // Fill required fields and submit again
    await userEvent.type(screen.getByLabelText(/Segment Name/i), 'Test Segment');
    fireEvent.click(submitButton);
    
    // Check validation passes and onSubmit is called
    await waitFor(() => {
      expect(mockHandlers.onSubmit).toHaveBeenCalled();
    });
  });
  
  it('switches between rule-based and static segment types', async () => {
    render(<SegmentForm {...mockHandlers} />);
    
    // Initially rule builder should be shown
    expect(screen.getByText(/Match workers where/i)).toBeInTheDocument();
    
    // Switch to static type
    await userEvent.click(screen.getByLabelText(/Static/i));
    
    // Rule builder should be hidden, worker selection should be shown
    expect(screen.queryByText(/Match workers where/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Select workers/i)).toBeInTheDocument();
  });
});
```

#### 9.1.3 RuleBuilder Tests

Complex components like the RuleBuilder are thoroughly tested:

```typescript
// src/components/features/segments/RuleBuilder.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RuleBuilder } from './RuleBuilder';

describe('RuleBuilder', () => {
  const mockAvailableFields = [
    { 
      id: 'location', 
      label: 'Location', 
      type: 'string',
      operators: ['equals', 'not_equals', 'contains', 'not_contains']
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      type: 'number',
      operators: ['equals', 'greater_than', 'less_than', 'between']
    }
  ];
  
  const mockHandlers = {
    onChange: jest.fn(),
    onTest: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with initial empty rules', () => {
    render(
      <RuleBuilder
        initialRules={{ condition: 'and', rules: [] }}
        availableFields={mockAvailableFields}
        {...mockHandlers}
      />
    );
    
    // Check base condition selector
    expect(screen.getByText(/Match workers where/i)).toBeInTheDocument();
    expect(screen.getByText(/all/i)).toBeInTheDocument();
    
    // Check add buttons
    expect(screen.getByText(/Add Condition/i)).toBeInTheDocument();
  });
  
  it('adds a new condition when "Add Condition" is clicked', async () => {
    render(
      <RuleBuilder
        initialRules={{ condition: 'and', rules: [] }}
        availableFields={mockAvailableFields}
        {...mockHandlers}
      />
    );
    
    // Click add condition button
    await userEvent.click(screen.getByText(/Add Condition/i));
    
    // Check rule components are rendered
    expect(screen.getByRole('combobox', { name: /Field/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Operator/i })).toBeInTheDocument();
    
    // Check onChange was called with new rule structure
    expect(mockHandlers.onChange).toHaveBeenCalledWith({
      condition: 'and',
      rules: [{ field: '', operator: '', value: '' }]
    });
  });
  
  it('updates a rule when field, operator, or value changes', async () => {
    render(
      <RuleBuilder
        initialRules={{ 
          condition: 'and', 
          rules: [{ field: '', operator: '', value: '' }] 
        }}
        availableFields={mockAvailableFields}
        {...mockHandlers}
      />
    );
    
    // Select field
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Field/i }),
      'location'
    );
    
    // Check onChange was called with updated field
    expect(mockHandlers.onChange).toHaveBeenCalledWith({
      condition: 'and',
      rules: [{ field: 'location', operator: '', value: '' }]
    });
    
    // Select operator
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Operator/i }),
      'equals'
    );
    
    // Check onChange was called with updated operator
    expect(mockHandlers.onChange).toHaveBeenCalledWith({
      condition: 'and',
      rules: [{ field: 'location', operator: 'equals', value: '' }]
    });
    
    // Enter value
    await userEvent.type(
      screen.getByRole('textbox', { name: /Value/i }),
      'New York'
    );
    
    // Check onChange was called with updated value
    expect(mockHandlers.onChange).toHaveBeenCalledWith({
      condition: 'and',
      rules: [{ field: 'location', operator: 'equals', value: 'New York' }]
    });
  });
});
```

### 9.2 Integration Testing

Integration tests ensure that multiple components work together correctly, focusing on user workflows and data flow.

#### 9.2.1 Page Component Tests

Page components are tested for correct rendering, data fetching, and interaction with child components:

```typescript
// src/app/(app)/segments/[segmentId]/page.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentDetailPage } from './page';
import { useSegment, useSegmentWorkers } from '@/hooks/features/useSegmentsApi';
import { useDeleteSegment, useSyncSegment } from '@/hooks/features/useSegmentsApi';

// Mock the hooks
jest.mock('@/hooks/features/useSegmentsApi');

// Mock router
jest.mock('next/navigation', () => ({
  useParams: () => ({ segmentId: '123' }),
  useRouter: () => ({ push: jest.fn() })
}));

describe('SegmentDetailPage', () => {
  const mockSegment = {
    id: '123',
    name: 'Test Segment',
    type: 'rule-based',
    rule_definition: {
      condition: 'and',
      rules: [
        { field: 'location', operator: 'equals', value: 'New York' }
      ]
    },
    worker_count: 45,
    created_at: '2023-06-01T12:00:00Z',
    updated_at: '2023-07-02T10:30:00Z',
    last_sync_at: '2023-07-05T08:15:00Z'
  };
  
  const mockWorkers = {
    items: [
      { id: 'w1', full_name: 'John Smith', location: 'New York' },
      { id: 'w2', full_name: 'Sarah Johnson', location: 'New York' }
    ],
    total: 2
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock returns
    (useSegment as jest.Mock).mockReturnValue({
      data: mockSegment,
      isLoading: false,
      error: null
    });
    
    (useSegmentWorkers as jest.Mock).mockReturnValue({
      data: mockWorkers,
      isLoading: false,
      error: null
    });
    
    (useDeleteSegment as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false
    });
    
    (useSyncSegment as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false
    });
  });
  
  it('renders segment details correctly', async () => {
    render(<SegmentDetailPage />);
    
    // Check page title
    expect(screen.getByText('Segment: Test Segment')).toBeInTheDocument();
    
    // Check segment properties are displayed
    expect(screen.getByText('Rule-based')).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    
    // Check tabs are present
    expect(screen.getByRole('tab', { name: /Overview/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Workers/ })).toBeInTheDocument();
  });
  
  it('switches between tabs', async () => {
    render(<SegmentDetailPage />);
    
    // Initially Overview tab should be active
    expect(screen.getByRole('tab', { name: /Overview/ })).toHaveAttribute('aria-selected', 'true');
    
    // Switch to Workers tab
    await userEvent.click(screen.getByRole('tab', { name: /Workers/ }));
    
    // Workers tab should now be active
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Workers/ })).toHaveAttribute('aria-selected', 'true');
    });
    
    // Worker list should be visible
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });
  
  it('triggers sync when Sync Now button is clicked', async () => {
    render(<SegmentDetailPage />);
    
    // Click Sync Now button
    await userEvent.click(screen.getByRole('button', { name: /Sync Now/ }));
    
    // Check sync method was called
    await waitFor(() => {
      expect(useSyncSegment().mutate).toHaveBeenCalled();
    });
  });
});
```

#### 9.2.2 Workflow Tests

Key user workflows are tested end-to-end:

```typescript
// src/tests/integration/createSegment.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { createSegmentFlow } from '@/tests/workflows/createSegment';

// Mock server responses
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  // Mock segment types endpoint
  rest.get('/api/v1/segments/types', (req, res, ctx) => {
    return res(
      ctx.json({
        fields: [
          { 
            id: 'location', 
            label: 'Location', 
            type: 'string',
            operators: ['equals', 'not_equals', 'contains']
          },
          { 
            id: 'department', 
            label: 'Department', 
            type: 'select',
            operators: ['equals', 'not_equals', 'in'],
            options: [
              { value: 'sales', label: 'Sales' },
              { value: 'marketing', label: 'Marketing' }
            ]
          }
        ]
      })
    );
  }),
  
  // Mock segment creation endpoint
  rest.post('/api/v1/segments', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-segment-id',
        name: req.body.name,
        type: req.body.type,
        rule_definition: req.body.rule_definition,
        worker_count: 45,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    );
  }),
  
  // Mock test rule endpoint
  rest.post('/api/v1/segments/test-rule', (req, res, ctx) => {
    return res(
      ctx.json({
        count: 45,
        sample: [
          { id: 'w1', full_name: 'John Smith', location: 'New York', department: 'Sales' },
          { id: 'w2', full_name: 'Sarah Johnson', location: 'New York', department: 'Sales' }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Create Segment Flow', () => {
  it('allows creating a rule-based segment', async () => {
    // Setup router mock
    const push = jest.fn();
    const mockRouter = {
      push,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/segments/create',
      params: {},
      query: {},
      asPath: '',
      isFallback: false,
      isReady: true,
      isPreview: false
    };
    
    render(
      <AppRouterContext.Provider value={mockRouter as any}>
        {createSegmentFlow}
      </AppRouterContext.Provider>
    );
    
    // Fill in segment name
    await userEvent.type(screen.getByLabelText(/Segment Name/i), 'New York Sales Team');
    
    // Add description
    await userEvent.type(screen.getByLabelText(/Description/i), 'Sales team members in New York');
    
    // Verify rule-based is selected
    expect(screen.getByLabelText(/Rule-based/i)).toBeChecked();
    
    // Add first condition
    await userEvent.click(screen.getByText(/Add Condition/i));
    
    // Select location field
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Field/i }),
      'location'
    );
    
    // Select equals operator
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Operator/i }),
      'equals'
    );
    
    // Enter New York as value
    await userEvent.type(
      screen.getByRole('textbox', { name: /Value/i }),
      'New York'
    );
    
    // Add second condition
    await userEvent.click(screen.getByText(/Add Condition/i));
    
    // Configure second condition (Department = Sales)
    const fieldSelects = screen.getAllByRole('combobox', { name: /Field/i });
    await userEvent.selectOptions(fieldSelects[1], 'department');
    
    const operatorSelects = screen.getAllByRole('combobox', { name: /Operator/i });
    await userEvent.selectOptions(operatorSelects[1], 'equals');
    
    const valueSelects = screen.getAllByRole('combobox', { name: /Value/i });
    await userEvent.selectOptions(valueSelects[0], 'sales');
    
    // Test the rule
    await userEvent.click(screen.getByText(/Test Rule/i));
    
    // Wait for test results to appear
    await waitFor(() => {
      expect(screen.getByText(/45 workers match these conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    });
    
    // Save the segment
    await userEvent.click(screen.getByRole('button', { name: /Save Segment/i }));
    
    // Verify navigation to new segment detail page
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/segments/new-segment-id');
    });
  });
});
```

### 9.3 E2E Testing

End-to-end tests verify the entire application works correctly in a real browser environment.

```typescript
// cypress/e2e/segments.cy.ts

describe('Segments Feature', () => {
  beforeEach(() => {
    // Setup authentication
    cy.login('program_manager@example.com', 'password');
  });
  
  it('should list existing segments', () => {
    // Visit segments page
    cy.visit('/segments');
    
    // Check page loads correctly
    cy.contains('h1', 'Segments').should('exist');
    
    // Check segments are listed
    cy.contains('Sales Team').should('exist');
    cy.contains('High Performers').should('exist');
    
    // Check segment type badges
    cy.contains('Static').should('exist');
    cy.contains('Rule-based').should('exist');
  });
  
  it('should create a new rule-based segment', () => {
    // Visit segment creation page
    cy.visit('/segments/create');
    
    // Fill segment details
    cy.get('input[name="name"]').type('New Test Segment');
    cy.get('textarea[name="description"]').type('Description for test segment');
    
    // Ensure rule-based is selected
    cy.get('input[value="rule-based"]').should('be.checked');
    
    // Add a condition
    cy.contains('button', 'Add Condition').click();
    
    // Configure rule (Location = New York)
    cy.get('select[name="rules.0.field"]').select('location');
    cy.get('select[name="rules.0.operator"]').select('equals');
    cy.get('input[name="rules.0.value"]').type('New York');
    
    // Test the rule
    cy.contains('button', 'Test Rule').click();
    
    // Check test results appear
    cy.contains('workers match these conditions').should('exist');
    
    // Save the segment
    cy.contains('button', 'Save Segment').click();
    
    // Verify we're redirected to segment detail page
    cy.url().should('include', '/segments/');
    cy.contains('New Test Segment').should('exist');
  });
  
  it('should view and manage segment details', () => {
    // Visit a specific segment
    cy.visit('/segments');
    cy.contains('Sales Team').click();
    
    // Check detail page loads correctly
    cy.contains('h1', 'Segment: Sales Team').should('exist');
    
    // Check tabs work
    cy.contains('Workers').click();
    cy.get('table').should('exist');
    
    // For static segments, test adding a worker
    cy.contains('Static').should('exist').then(() => {
      cy.contains('Add Worker').click();
      cy.get('[role="dialog"]').should('exist');
      
      // Select a worker from the dialog
      cy.get('[role="dialog"]').contains('John Doe').click();
      cy.contains('button', 'Add Selected').click();
      
      // Verify worker was added
      cy.contains('John Doe').should('exist');
    });
  });
  
  it('should delete a segment', () => {
    // Visit segments page
    cy.visit('/segments');
    
    // Find a segment to delete
    cy.contains('Test Segment')
      .parent()
      .find('[aria-label="More actions"]')
      .click();
    
    // Click delete option
    cy.contains('Delete').click();
    
    // Confirm deletion
    cy.get('[role="dialog"]')
      .contains('button', 'Delete')
      .click();
    
    // Verify segment is removed
    cy.contains('Test Segment').should('not.exist');
    cy.contains('Segment deleted successfully').should('exist');
  });
});
```

## 10. Accessibility Considerations

The segmentation feature is designed with accessibility in mind, ensuring it's usable by everyone regardless of their abilities.

### 10.1 Keyboard Navigation

The segmentation feature is fully navigable using only a keyboard, allowing users who can't use a mouse to access all functionality.

#### 10.1.1 Focus Management

Key focus management principles implemented:

- **Focus Order**: UI elements have a logical tab order that follows the visual flow
- **Focus Indicators**: Visible focus indicators are provided for all interactive elements
- **Focus Trapping**: Modals and dialogs trap focus to prevent keyboard users from interacting with background content
- **Focus Restoration**: Focus is restored to a logical location when dialogs close

```tsx
// Example of focus management in a dialog
const DialogExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Track which element had focus before opening
  const previousFocus = useRef<HTMLElement | null>(null);
  
  const openDialog = () => {
    previousFocus.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  };
  
  const closeDialog = () => {
    setIsOpen(false);
    // Restore focus after dialog closes
    if (previousFocus.current) {
      previousFocus.current.focus();
    }
  };
  
  // Focus first interactive element when dialog opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);
  
  return (
    <>
      <button ref={openButtonRef} onClick={openDialog}>
        Open Dialog
      </button>
      
      {isOpen && (
        <FocusTrap>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <h2 id="dialog-title">Dialog Title</h2>
            <div>Dialog content...</div>
            <button onClick={closeDialog}>Close</button>
          </div>
        </FocusTrap>
      )}
    </>
  );
};
```

#### 10.1.2 Keyboard Shortcuts

The rule builder component supports keyboard shortcuts for common operations:

- **Enter**: Confirm a condition and move to the next field
- **Esc**: Cancel editing or close dialog
- **Tab**: Navigate between fields
- **Shift+Tab**: Navigate backwards between fields
- **Space**: Toggle checkboxes and buttons

#### 10.1.3 Skip Links

A skip link is provided to allow keyboard users to bypass the navigation and go directly to the main content:

```tsx
// In the main layout
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// ...later in the DOM
<main id="main-content">
  {/* Page content */}
</main>
```

### 10.2 Screen Reader Support

The segmentation feature includes appropriate ARIA attributes and semantic HTML to ensure screen reader users can understand and interact with the interface.

#### 10.2.1 Semantic HTML

The interface uses semantically appropriate HTML elements:

- **`<button>`** for interactive controls
- **`<nav>`** for navigation menus
- **`<table>`** for tabular data
- **`<form>`, `<fieldset>`, `<label>`** for form controls
- **`<h1>`, `<h2>`, etc.** for proper heading hierarchy

#### 10.2.2 ARIA Attributes

ARIA attributes are used to enhance semantics and provide additional context:

```tsx
// Example of ARIA attributes in the SegmentsList
<div role="region" aria-label="Segments list">
  <table aria-busy={isLoading}>
    <caption className="sr-only">List of segments in your organization</caption>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Type</th>
        <th scope="col">Workers</th>
        <th scope="col">Last Updated</th>
        <th scope="col">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {segments.map((segment) => (
        <tr key={segment.id}>
          <td>{segment.name}</td>
          <td>
            <span aria-label={`Type: ${segment.type}`}>
              {segment.type === 'static' ? 'Static' : 'Rule-based'}
            </span>
          </td>
          <td aria-label={`${segment.worker_count} workers`}>
            {segment.worker_count}
          </td>
          <td>
            <time dateTime={segment.updated_at}>
              {formatRelativeTime(segment.updated_at)}
            </time>
          </td>
          <td>
            <button
              aria-label={`View details for ${segment.name}`}
              onClick={() => onSelectSegment(segment.id)}
            >
              View
            </button>
            <button
              aria-label={`Delete ${segment.name}`}
              onClick={() => onDeleteSegment(segment.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

#### 10.2.3 Live Regions

Live regions are used to announce dynamic content changes:

```tsx
// Example of live regions for validation errors
<div role="alert" aria-live="assertive">
  {errors.name && <p className="error">{errors.name.message}</p>}
</div>

// Example of live regions for async operations
<div aria-live="polite" className="sr-only">
  {isLoading ? 'Loading segments...' : ''}
  {error ? `Error: ${error.message}` : ''}
  {data ? `${data.total} segments loaded.` : ''}
</div>
```

#### 10.2.4 Screen Reader Testing

Each component is tested with screen readers to ensure it works correctly:

- NVDA and JAWS on Windows
- VoiceOver on macOS and iOS
- TalkBack on Android

### 10.3 Color Contrast

The segmentation feature follows WCAG AA contrast requirements to ensure text and interactive elements are visible to users with low vision or color blindness.

#### 10.3.1 Text Contrast

All text meets the following contrast ratios:

- Normal text (less than 18pt): At least 4.5:1
- Large text (18pt or 14pt bold and larger): At least 3:1
- UI components and graphical objects: At least a 3:1 contrast ratio

#### 10.3.2 Non-Text Contrast

Interactive elements and information-carrying graphics maintain at least a 3:1 contrast ratio against adjacent colors.

#### 10.3.3 Color Independence

Information is never conveyed by color alone. Additional indicators are always used:

- **Form Validation**: Error messages include text descriptions and icons, not just red colored fields
- **Status Indicators**: Status badges include text labels, not just color coding
- **Charts and Graphs**: Patterns or textures accompany colors to distinguish data series
- **Links**: Underlined or otherwise distinguished beyond just color

#### 10.3.4 Contrast Testing

The UI is tested with tools like the WAVE browser extension, Chrome's Lighthouse, and axe DevTools to identify contrast issues.

## 11. Performance Considerations

The segmentation feature is designed to handle large datasets efficiently, ensuring smooth user experiences even with thousands of workers and complex rule evaluations.

### 11.1 Large Data Sets

The segmentation feature implements several strategies to handle large datasets efficiently.

#### 11.1.1 Virtualized Lists

For displaying large lists of segments or workers, virtualized lists are used to render only the visible items:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedWorkerList: React.FC<{ workers: Worker[] }> = ({ workers }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: workers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // approximate row height
    overscan: 5 // number of items to render before/after visible area
  });
  
  return (
    <div 
      ref={parentRef}
      className="workers-list-container"
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const worker = workers[virtualRow.index];
          return (
            <div
              key={worker.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <WorkerListItem worker={worker} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

#### 11.1.2 Pagination

Server-side pagination is used for all list views to limit the amount of data transferred and rendered:

```tsx
const { page, setPage, limit, setLimit } = usePagination({
  defaultPage: 1,
  defaultLimit: 10
});

const { data, isLoading } = useSegmentWorkers(segmentId, {
  page,
  limit,
  // other query params...
});

// Render paginated data
return (
  <>
    <WorkerList workers={data?.items || []} />
    
    <Pagination
      currentPage={page}
      totalPages={Math.ceil((data?.total || 0) / limit)}
      onPageChange={setPage}
      itemsPerPage={limit}
      onItemsPerPageChange={setLimit}
      itemsPerPageOptions={[10, 25, 50, 100]}
    />
  </>
);
```

#### 11.1.3 Infinite Scrolling

For more seamless user experiences, infinite scrolling is used where appropriate:

```tsx
const { 
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  error
} = useInfiniteQuery(
  ['segmentWorkers', segmentId, filters],
  ({ pageParam = 1 }) => api.endpoints.segments.getSegmentWorkers(segmentId, {
    ...filters,
    page: pageParam,
    limit: 20
  }),
  {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length < 20) return undefined;
      return pages.length + 1;
    }
  }
);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

// Render with infinite scroll
return (
  <div className="worker-list-container" onScroll={handleScroll}>
    {data?.pages.map((page, i) => (
      <React.Fragment key={i}>
        {page.items.map(worker => (
          <WorkerListItem key={worker.id} worker={worker} />
        ))}
      </React.Fragment>
    ))}
    
    {isFetchingNextPage && <LoadingIndicator />}
  </div>
);
```

### 11.2 Complex Rule Evaluation

The segmentation feature optimizes the evaluation and handling of complex segment rules.

#### 11.2.1 Client-Side Rule Builder Optimization

The rule builder component implements several optimizations:

- **Memoization**: React.memo, useMemo, and useCallback are used to prevent unnecessary re-renders
- **Debouncing**: Input changes are debounced to prevent excessive rule evaluations
- **Lazy Evaluation**: Complex validations are performed lazily only when needed

```tsx
// Example of optimized rule builder component
const RuleBuilderOptimized: React.FC<RuleBuilderProps> = React.memo(({
  initialRules,
  availableFields,
  onChange,
  onTest,
  testResults,
  isTestLoading
}) => {
  // Memoize availableFields map for quick lookups
  const fieldsMap = useMemo(() => {
    return availableFields.reduce((acc, field) => {
      acc[field.id] = field;
      return acc;
    }, {} as Record<string, RuleField>);
  }, [availableFields]);
  
  // Create a debounced onChange handler
  const debouncedOnChange = useMemo(() => {
    return debounce((rules: RuleDefinition) => {
      onChange(rules);
    }, 300);
  }, [onChange]);
  
  // Use memoized callbacks for event handlers
  const handleAddCondition = useCallback(() => {
    const newRules = {
      ...initialRules,
      rules: [
        ...initialRules.rules,
        { field: '', operator: '', value: '' }
      ]
    };
    debouncedOnChange(newRules);
  }, [initialRules, debouncedOnChange]);
  
  // Only validate if rules have actually changed
  const validateRules = useCallback(() => {
    if (!hasChanged) return true;
    
    // Validation logic here
    return isValid;
  }, [initialRules, hasChanged]);
  
  // Rest of component...
});
```

#### 11.2.2 Server-Side Rule Evaluation

For rule testing and evaluation, the following strategies are employed:

- **Progressive Loading**: Test results load incrementally, showing a sample of matches first
- **Caching**: Test results are cached for similar rule configurations
- **Background Processing**: Expensive evaluations are processed in the background
- **Query Optimization**: The backend optimizes database queries for rule evaluation

### 11.3 Optimization Strategies

Additional optimization strategies are implemented throughout the segmentation feature.

#### 11.3.1 Code Splitting

The segmentation feature uses code splitting to reduce initial bundle size:

```tsx
// Lazy load complex components
const RuleBuilder = React.lazy(() => import('./RuleBuilder'));
const SegmentAnalytics = React.lazy(() => import('./SegmentAnalytics'));

// Use Suspense for loading states
const SegmentBuilderPage: React.FC = () => {
  return (
    <div>
      <h1>Create Segment</h1>
      
      {/* Simple form fields render immediately */}
      <SegmentBasicForm />
      
      {/* Complex components load asynchronously */}
      <React.Suspense fallback={<LoadingSpinner />}>
        <RuleBuilder />
      </React.Suspense>
      
      <React.Suspense fallback={<LoadingPlaceholder />}>
        <SegmentAnalytics />
      </React.Suspense>
    </div>
  );
};
```

#### 11.3.2 Memoization and Caching

Memoization and caching are used extensively:

- **Component Memoization**: React.memo for pure components
- **Computed Value Memoization**: useMemo for expensive calculations
- **Handler Memoization**: useCallback for event handlers passed as props
- **Query Caching**: React Query for API result caching
- **Route-Based Prefetching**: Preloading data for likely navigation paths

```tsx
// Example of memoization in a component
const SegmentMetrics: React.FC<{ segment: Segment }> = React.memo(({ segment }) => {
  // Use useMemo for expensive calculations
  const metrics = useMemo(() => {
    return calculateSegmentMetrics(segment);
  }, [segment]);
  
  // Use useCallback for event handlers
  const handleRefresh = useCallback(() => {
    // Refresh logic
  }, []);
  
  return (
    <div>
      <MetricsDisplay metrics={metrics} />
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
});
```

#### 11.3.3 Optimized Rendering

Several rendering optimizations are implemented:

- **Progressive Loading**: Show important content first, load details later
- **Skeleton Screens**: Use skeleton placeholders during loading
- **Throttling**: Limit update frequency for real-time data
- **Deferred Rendering**: Use `useLayoutEffect` only when necessary, prefer `useEffect`
- **Windowing**: Virtualize large lists of data

#### 11.3.4 Network Optimization

Network requests are optimized:

- **Request Batching**: Combine multiple related requests where possible
- **Payload Minimization**: Request only needed fields from API endpoints
- **Incremental Loading**: Load data in chunks as needed
- **Prefetching**: Preload likely-to-be-needed data
- **Optimistic Updates**: Update UI before server confirmation for faster feedback

## 12. Future Enhancements and Roadmap

### 12.1 Planned Features

The segmentation feature has several planned enhancements to improve functionality and user experience.

#### 12.1.1 Advanced Segmentation Capabilities

1. **AI-Powered Segment Recommendations**
   - Analyze worker data to suggest potential segments
   - Identify patterns and groups that might not be obvious
   - Recommend optimizations for existing segments

2. **Predictive Segmentation**
   - Create segments based on predicted future behavior
   - Use machine learning models to identify workers likely to respond well to specific programs
   - Enable proactive interventions before issues arise

3. **Temporal Segmentation**
   - Define segments that automatically include/exclude workers based on time
   - Schedule workers to join or leave segments on specific dates
   - Create segments based on tenure milestones

4. **Behavioral Segmentation Enhancement**
   - Expand rule options to include more behavioral metrics
   - Add engagement pattern tracking
   - Include response time and sentiment analysis in rules

#### 12.1.2 Collaboration Features

1. **Segment Sharing and Permissions**
   - Allow sharing segments between teams with specific permissions
   - Enable commenting and feedback on segments
   - Implement approval workflows for segment creation

2. **Segment Templates**
   - Create reusable segment templates for common use cases
   - Share templates across the organization
   - Include best practices and documentation with templates

3. **Change History and Audit Logs**
   - Track all changes to segments
   - Show who made changes and when
   - Allow reverting to previous versions

#### 12.1.3 UI/UX Improvements

1. **Enhanced Rule Builder**
   - Add drag-and-drop interface for rules
   - Improve visualization of complex nested conditions
   - Add natural language rule definition

2. **Segment Visualization**
   - Add Venn diagram visualization for segment overlap
   - Show distribution charts for key worker attributes
   - Implement interactive segment exploration tools

3. **Guided Segment Creation**
   - Add step-by-step wizards for common segment types
   - Provide contextual help and examples
   - Implement intelligent form field suggestions

### 12.2 Potential Improvements

The following areas have been identified for potential future improvements.

#### 12.2.1 Performance Enhancements

1. **Distributed Rule Evaluation**
   - Implement server-side parallel processing for rule evaluation
   - Add background processing for large segment updates
   - Create cache warming strategies for frequently accessed segments

2. **Real-time Updates**
   - Add WebSocket support for live worker data updates
   - Implement real-time segment membership changes
   - Show live metrics on segment dashboards

3. **Improved Data Handling**
   - Enhance pagination and infinite scrolling implementations
   - Add better caching strategies for large datasets
   - Implement data compression for network transfers

#### 12.2.2 Integration Enhancements

1. **External Data Source Integration**
   - Allow segments based on data from external systems
   - Add connectors for CRM, HRIS, and other data sources
   - Implement unified worker profiles across systems

2. **Advanced Analytics Integration**
   - Enhance integration with the analytics system
   - Add funnel analysis for segments
   - Implement cohort comparison tools

3. **Enhanced Program Integration**
   - Improve targeting options in programs based on segments
   - Add segment-specific messaging templates
   - Implement segment-based personalization across the platform

#### 12.2.3 Accessibility and Internationalization

1. **Enhanced Accessibility**
   - Implement advanced screen reader support for complex UIs
   - Add more keyboard shortcuts and navigation options
   - Improve focus management in complex interfaces

2. **Full Internationalization**
   - Translate all segment-related UI elements
   - Support right-to-left languages in the rule builder
   - Add culturally appropriate example segments

3. **Cognitive Accessibility**
   - Add simplified views for complex interfaces
   - Provide more contextual help and tooltips
   - Implement progressive disclosure of advanced features
