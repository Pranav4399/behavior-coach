# ABCD Behavior Coach - Experimentation Framework

## Table of Contents
1. [Introduction](#introduction)
2. [Experimentation Architecture](#experimentation-architecture)
   - [System Overview](#system-overview)
   - [Core Components](#core-components)
   - [Data Flow](#data-flow)
   - [Technical Foundations](#technical-foundations)
3. [Types of Experiments](#types-of-experiments)
   - [Journey-level Experiments](#journey-level-experiments)
   - [Program-level Experiments](#program-level-experiments)
4. [Experiment Lifecycle](#experiment-lifecycle)
5. [Experimentation UI/UX](#experimentation-uiux)
   - [Experiment List/Dashboard](#experiment-listdashboard)
   - [Experiment Creation/Setup](#experiment-creationsetup)
   - [Experiment Detail & Results](#experiment-detail--results)
6. [API Integration](#api-integration)
7. [Component Architecture](#component-architecture)
8. [User Flows](#user-flows)
9. [Metrics & Analysis](#metrics--analysis)
10. [Integration with Other Domains](#integration-with-other-domains)
    - [Content Management](#content-management)
    - [Journey Builder](#journey-builder)
    - [Program Implementation](#program-implementation)
    - [Segmentation](#segmentation)
    - [Marketplace](#marketplace)
    - [Specialized Features](#specialized-features)
11. [Best Practices](#best-practices)
12. [Technical Implementation](#technical-implementation)
13. [Testing Strategy](#testing-strategy)
14. [Future Enhancements](#future-enhancements)

## Introduction

The Experimentation framework in the ABCD Behavior Coach platform enables systematic, data-driven optimization of behavioral coaching content and implementation strategies. The platform supports two distinct experiment types: Journey-level experiments (content-focused) and Program-level experiments (implementation-focused). 

This documentation provides a comprehensive guide to the experimentation system's architecture, UI components, API integration, user flows, and interaction with other platform domains. It serves as the reference for building and maintaining the experimentation features in the frontend application.

## Experimentation Architecture

### System Overview

The experimentation system is built on a dual-tier architecture that clearly separates content experimentation from implementation experimentation while providing unified interfaces for experiment management and analysis. This design allows organizations to systematically test and optimize both what content is delivered and how it is delivered, creating a comprehensive optimization framework.

The architecture follows these key principles:

1. **Separation of Concerns**: Journey-level (content) experiments and Program-level (implementation) experiments are separately defined, managed, and analyzed, but share common infrastructure.

2. **Unified Management**: Despite the separation, both experiment types are managed through a consistent UI, creating a seamless user experience.

3. **Domain Integration**: The experimentation system integrates with multiple domains (Content, Journey, Program, Segments) to provide contextual experimentation.

4. **Statistical Rigor**: Built-in statistical analysis tools ensure that experiment results are valid and meaningful.

5. **Role-Based Access**: Training Managers primarily conduct Journey-level experiments, while Program Managers focus on Program-level experiments.

### Core Components

The experimentation framework consists of these core components:

1. **Experiment Registry**: Central registry that tracks all experiments in the system, their status, and relationships to other entities.

2. **Variant Management System**: Handles the creation, storage, and delivery of content variants (for Journey experiments) and implementation variants (for Program experiments).

3. **Assignment Engine**: Manages the assignment of workers to experiment variants, ensuring consistent experiences and proper randomization or stratification.

4. **Metrics Collection Pipeline**: Gathers and processes experiment-specific metrics from various platform activities.

5. **Statistical Analysis Engine**: Processes experiment data to determine statistical significance and identify winning variants.

6. **Experiment Lifecycle Manager**: Oversees the execution of experiments through their complete lifecycle from creation to conclusion.

7. **Unified Experiment UI**: Provides interfaces for creating, monitoring, and analyzing experiments across both tiers.

### Data Flow

The data flow in the experimentation system follows this pattern:

1. **Experiment Definition**: Users define experiments, specifying variants, target audiences, metrics, and success criteria.

2. **Variant Creation**: For Journey experiments, content variants are created in the Content system. For Program experiments, implementation strategy variants are defined.

3. **Audience Assignment**: When an experiment begins, the Assignment Engine allocates workers to variants according to the specified distribution strategy.

4. **Variant Delivery**: During execution, workers receive their assigned variants (different content in Journey experiments, different implementation strategies in Program experiments).

5. **Metrics Collection**: As workers interact with variants, the metrics collection pipeline gathers data on key performance indicators.

6. **Real-time Analysis**: The Statistical Analysis Engine processes incoming data to provide ongoing insight into experiment performance.

7. **Conclusion & Implementation**: When an experiment concludes (due to statistical significance or manual termination), a winning variant may be identified and can be implemented as the new standard.

### Technical Foundations

The experimentation system is built on robust technical foundations:

1. **Database Design**: The system uses a specialized schema optimized for experiment data, variant tracking, and metrics storage.

2. **API Layer**: RESTful API endpoints provide programmatic access to experiment functionality for both the frontend and potential external integrations.

3. **Integration Patterns**: Event-driven communication ensures that experiment-related events (e.g., worker assignment, metric recording) are properly captured across the system.

4. **Frontend Architecture**: The React-based UI uses dedicated components for experiment management and visualization, integrated with the broader application UI.

5. **Service Boundaries**: The experimentation domain maintains clear boundaries with other domains, interacting through well-defined interfaces.

## Types of Experiments

### Journey-level Experiments

Journey-level experiments focus on testing different content variants within a Journey Blueprint. These experiments allow Training Managers to optimize the content itself to identify which messaging, media, or interaction types are most effective.

#### Key Characteristics

1. **Focus**: Content optimization - testing what is delivered to workers.
2. **Owner**: Typically created and managed by Training Managers or Content Specialists.
3. **Scope**: Applied at the Journey Blueprint level, before deployment in Programs.
4. **Variants**: Different versions of content (text, media, quizzes, etc.) within the same Journey structure.
5. **Target**: Specific touchpoints or phases within a Journey Blueprint.
6. **Metrics**: Primarily engagement, completion, and learning/behavioral outcomes.

#### Common Use Cases

1. **Message Testing**: Testing different wording, tone, or framing of text messages to identify which resonates best.
2. **Media Format Comparison**: Comparing effectiveness of text vs. images vs. video for conveying information.
3. **Quiz Question Optimization**: Testing different quiz formats or question phrasing for better retention.
4. **Engagement Strategy Testing**: Comparing different interactive elements to increase worker participation.
5. **Narrative Structure Testing**: Testing different storytelling approaches or sequence of content delivery.
6. **Cultural Adaptation Testing**: Comparing variants tailored to different cultural contexts.

#### Implementation Details

When a Journey-level experiment is created:

1. The original touchpoint content is preserved as the control variant.
2. One or more alternative content variants are created specifically for the experiment.
3. When the Journey is deployed in a Program, workers are randomly assigned to receive either the control or a test variant.
4. Variant assignment is consistent throughout the journey - a worker assigned to Variant A for one touchpoint will receive Variant A content for all touchpoints included in the experiment.
5. Metrics are collected on worker interactions with each variant.
6. Statistical analysis determines which variant performs best against defined success metrics.

#### Technical Considerations

1. **Content Storage**: Variants need to be stored alongside the original content but clearly marked as experiment variants.
2. **Journey Integration**: The Journey Builder UI must support creating and managing variants.
3. **Asset Management**: Media assets for different variants need proper organization and tracking.
4. **Consistent Experience**: The system must ensure a worker consistently sees the same variant throughout a journey.
5. **Multilingual Support**: Variants often need to be created across multiple languages when serving diverse audiences.

### Program-level Experiments

Program-level experiments focus on implementation strategies, testing aspects like message timing, delivery channels, segmentation strategies, and follow-up approaches. These experiments allow Program Managers to optimize how content is deployed.

#### Key Characteristics

1. **Focus**: Implementation optimization - testing how content is delivered to workers.
2. **Owner**: Typically created and managed by Program Managers.
3. **Scope**: Applied at the Program level, during operational deployment.
4. **Variants**: Different delivery strategies, schedules, follow-up rules, or engagement approaches.
5. **Target**: The entire Program implementation or specific operational aspects.
6. **Metrics**: Primarily completion rates, time-to-completion, response times, and overall program effectiveness.

#### Common Use Cases

1. **Timing Optimization**: Testing different message delivery schedules (time of day, days of week, frequency).
2. **Reminder Strategy Testing**: Comparing different approaches to follow-up reminders for incomplete activities.
3. **Channel Comparison**: Testing primary delivery via WhatsApp vs. SMS or other channels.
4. **Segmentation Strategy**: Testing different audience segmentation approaches for the same content.
5. **Incentive Testing**: Comparing different gamification or incentive structures.
6. **Support Model Testing**: Testing different escalation pathways or human coaching intervention triggers.
7. **Messaging Sequence**: Testing the order or pacing of message delivery.

#### Implementation Details

When a Program-level experiment is created:

1. The standard implementation approach is defined as the control variant.
2. One or more alternative implementation variants are configured.
3. Workers are randomly assigned to receive either the control or a test variant.
4. The content remains identical across variants - only the implementation strategy differs.
5. Metrics are collected on program completion, timing, and effectiveness for each variant.
6. Statistical analysis determines which implementation strategy performs best.

#### Technical Considerations

1. **Scheduler Integration**: The program scheduling system must support variant-specific schedules.
2. **Follow-up Rule Configuration**: The follow-up system needs to handle variant-specific rules.
3. **Segmentation Engine**: The segmentation system must integrate with experiment variants.
4. **Channel Management**: Different delivery channels must be configurable per variant.
5. **Program State Tracking**: The system must track program progress differently for each variant.
6. **Conflict Resolution**: When workers are enrolled in multiple programs, the system must handle potential conflicts between experiment variants.

### Hybrid Experiments

In some cases, organizations may need to test both content and implementation strategies simultaneously. The platform supports these advanced scenarios through careful coordination between Journey-level and Program-level experiments.

#### Implementation Approach

1. First, create a Journey-level experiment to test content variants.
2. Then, create a Program-level experiment that works with the Journey experiment.
3. The system ensures that workers receive consistent experiences while properly tracking which combination of content and implementation variants they received.
4. Analysis can determine both the best content and the best implementation strategy, as well as identify any interaction effects.

Hybrid experiments are advanced and typically require more careful design and larger sample sizes to achieve statistically significant results across all variant combinations.

## Experiment Lifecycle

The experimentation system manages experiments through a structured lifecycle that ensures proper setup, execution, monitoring, and conclusion. This lifecycle provides a consistent framework for both Journey-level and Program-level experiments.

### 1. Creation & Design

The experiment lifecycle begins with creation and design, where users define the experiment parameters:

#### Key Activities

1. **Experiment Definition**:
   - Naming the experiment
   - Selecting the experiment type (Journey-level or Program-level)
   - Writing a clear hypothesis to be tested
   - Selecting the target Journey or Program
   - Defining the scope (specific touchpoints or entire Journey/Program)

2. **Variant Definition**:
   - Creating control and experimental variants
   - For Journey experiments: designing alternative content
   - For Program experiments: configuring alternative implementation strategies

3. **Audience Selection**:
   - Choosing target segments or individual workers
   - Determining sample size requirements
   - Setting distribution ratios between variants (e.g., 50/50, 33/33/33)

4. **Metrics Configuration**:
   - Selecting primary success metrics
   - Setting up secondary metrics
   - Configuring custom metrics if needed
   - Defining thresholds for statistical significance

5. **Timeline Planning**:
   - Setting experiment start date/time
   - Determining experiment duration or end conditions
   - Planning analysis checkpoints

#### UI/UX Considerations

- Guided wizard interface for experiment creation
- Contextual help explaining statistical concepts
- Sample size calculator to ensure valid results
- Preview of variants before deployment
- Validation to prevent common experiment design errors

### 2. Preparation & Validation

Before an experiment begins, several preparation and validation steps occur:

#### Key Activities

1. **Content Preparation**:
   - Journey experiments: Finalizing and approving all content variants
   - Program experiments: Validating all implementation strategies

2. **Technical Validation**:
   - System checks to ensure experiment setup is technically feasible
   - Validation of metrics collection mechanisms
   - Confirmation that sufficient audience size is available

3. **Collision Detection**:
   - Identifying any potential conflicts with other active experiments
   - Resolving conflicts through experiment prioritization or audience subdivision

4. **Pre-launch Review**:
   - Optional review/approval workflow for stakeholders
   - Final confirmation of experiment parameters

#### UI/UX Considerations

- Validation status indicators
- Clear error messages for setup issues
- Collision visualization when conflicts detected
- Pre-launch checklist with status indicators

### 3. Execution & Monitoring

Once launched, the experiment enters the execution and monitoring phase:

#### Key Activities

1. **Experiment Initialization**:
   - System prepares all necessary resources
   - Audience assignment to variants occurs
   - Initial state is recorded

2. **Variant Delivery**:
   - Workers receive their assigned variants
   - Journey experiments: content variants delivered through programs
   - Program experiments: implementation variants applied

3. **Data Collection**:
   - Continuous gathering of interaction data
   - Metric calculation based on worker activities
   - Periodic data aggregation and processing

4. **Progress Monitoring**:
   - Real-time dashboards showing experiment progress
   - Alerts for potential issues (low engagement, technical problems)
   - Interim results calculation with confidence intervals

5. **Adjustments (if necessary)**:
   - Pause capability for unexpected issues
   - Ability to extend duration if more data needed
   - Option to increase sample size if results inconclusive

#### UI/UX Considerations

- Real-time experiment dashboards
- Visual progress indicators
- Early trend visualization
- Anomaly highlighting
- Notification system for significant developments

### 4. Analysis & Conclusion

The final phase involves analyzing results and concluding the experiment:

#### Key Activities

1. **Results Compilation**:
   - Final gathering of all experiment data
   - Comprehensive metrics calculation
   - Statistical significance testing
   - Confidence interval determination

2. **Comparative Analysis**:
   - Head-to-head comparison of variants
   - Segment-specific performance analysis
   - Time-series analysis for temporal patterns
   - Conversion funnel analysis

3. **Conclusion Determination**:
   - Identifying winning variant (if any)
   - Calculating improvement percentages
   - Determining if results are conclusive
   - Documenting findings

4. **Recommendations**:
   - System-generated suggestions based on results
   - Potential follow-up experiment ideas
   - Implementation recommendations

#### UI/UX Considerations

- Comprehensive results dashboard
- Visualizations showing variant performance
- Statistical significance indicators
- Export functionality for reports
- Annotation capabilities for insights

### 5. Implementation & Knowledge Sharing

After conclusion, the experiment enters the final implementation and knowledge sharing phase:

#### Key Activities

1. **Winner Implementation**:
   - Option to automatically implement winning variant
   - Scheduled rollout of winning variant
   - Monitoring post-implementation performance

2. **Knowledge Capture**:
   - Documenting experiment results and insights
   - Saving to organizational knowledge base
   - Tagging and categorizing for future reference

3. **Sharing & Reporting**:
   - Creating shareable reports for stakeholders
   - Publishing insights to relevant teams
   - Optional: sharing anonymized results to marketplace

4. **Follow-up Planning**:
   - Identifying next experiment opportunities
   - Linking to future experiment designs
   - Creating experiment roadmaps

#### UI/UX Considerations

- Implementation wizard
- Knowledge repository integration
- Report generation tools
- Sharing controls and permissions
- Follow-up experiment suggestions

### Lifecycle State Management

The experiment lifecycle is tracked through a state machine with these primary states:

1. **Draft**: Initial creation, incomplete setup
2. **Ready**: Fully configured, validated, awaiting start
3. **Running**: Active experiment, collecting data
4. **Paused**: Temporarily halted, can be resumed
5. **Analyzing**: Execution complete, final analysis in progress
6. **Concluded**: Analysis complete, results available
7. **Implemented**: Winning variant has been applied
8. **Archived**: No longer active, preserved for reference

Each state transition triggers appropriate system actions and notifications to relevant stakeholders.

## Experimentation UI/UX

[This section will be restored in a subsequent edit.]

## API Integration

The experimentation UI integrates with the backend services through a set of dedicated API endpoints. These endpoints facilitate all aspects of experiment management, from creation to analysis, ensuring a seamless experience for users while maintaining data integrity and security.

### API Endpoint Overview

The primary experimentation API endpoints follow RESTful patterns and are available under the `/api/v1/experiments` base path. Core API endpoints include:

1. **GET** `/experiments`
   - **Purpose**: List all experiments in the organization.
   - **Query Parameters**:
     - `status`: Filter by experiment status (draft, ready, running, paused, analyzing, concluded, implemented, archived)
     - `type`: Filter by experiment type (journey, program)
     - `target`: Filter by target Journey or Program ID
     - `dateFrom`, `dateTo`: Filter by creation or execution date range
     - `page`, `limit`: Pagination controls
     - `sortBy`, `sortOrder`: Sorting options
   - **Response**: Paginated list of experiment summary objects.

2. **POST** `/experiments`
   - **Purpose**: Create a new experiment definition.
   - **Payload**:
     ```typescript
     {
       name: string;                     // Experiment name
       description?: string;             // Optional description
       type: 'journey' | 'program';      // Experiment type
       hypothesis: string;               // What's being tested
       targetId: string;                 // Journey or Program ID
       targetType: 'journey' | 'program'; // Type of target
       scope?: {                         // Optional scope limitation
         touchpointIds?: string[];       // For Journey experiments
         parameters?: string[];          // For Program experiments
       };
       startDate?: string;               // Optional scheduled start
       endDate?: string;                 // Optional scheduled end
       // Additional setup fields omitted for brevity
     }
     ```
   - **Response**: Created experiment object with ID.

3. **GET** `/experiments/{experimentId}`
   - **Purpose**: Get detailed experiment information and configuration.
   - **Response**: Complete experiment object including variants, audience, and metrics configuration.

4. **PATCH** `/experiments/{experimentId}`
   - **Purpose**: Update experiment configuration (when in Draft or Ready state).
   - **Payload**: Partial experiment object with fields to update.
   - **Response**: Updated experiment object.

5. **GET** `/experiments/{experimentId}/variants`
   - **Purpose**: Get all variants for an experiment.
   - **Response**: Array of variant objects with their configurations.

6. **POST** `/experiments/{experimentId}/variants`
   - **Purpose**: Create a new variant for the experiment.
   - **Payload**: Variant configuration object.
   - **Response**: Created variant object with ID.

7. **GET** `/experiments/{experimentId}/audience`
   - **Purpose**: Get audience configuration and assignment data.
   - **Response**: Audience configuration and current assignment statistics.

8. **PATCH** `/experiments/{experimentId}/audience`
   - **Purpose**: Update audience configuration (when in Draft or Ready state).
   - **Payload**: Updated audience configuration.
   - **Response**: Updated audience object.

9. **GET** `/experiments/{experimentId}/metrics`
   - **Purpose**: Get metrics configuration and current values.
   - **Response**: Metrics configuration and current data if experiment is running/concluded.

10. **PATCH** `/experiments/{experimentId}/metrics`
    - **Purpose**: Update metrics configuration (when in Draft or Ready state).
    - **Payload**: Updated metrics configuration.
    - **Response**: Updated metrics object.

11. **GET** `/experiments/{experimentId}/results`
    - **Purpose**: Get experiment results and analysis.
    - **Response**: Comprehensive results object with metric values, statistical analysis, and recommendations.

12. **POST** `/experiments/{experimentId}/actions/start`
    - **Purpose**: Start an experiment that is in Ready state.
    - **Response**: Updated experiment with Running status.

13. **POST** `/experiments/{experimentId}/actions/pause`
    - **Purpose**: Pause a running experiment.
    - **Response**: Updated experiment with Paused status.

14. **POST** `/experiments/{experimentId}/actions/resume`
    - **Purpose**: Resume a paused experiment.
    - **Response**: Updated experiment with Running status.

15. **POST** `/experiments/{experimentId}/actions/conclude`
    - **Purpose**: Manually conclude a running or paused experiment.
    - **Response**: Updated experiment with Analyzing status (transitioning to Concluded).

16. **POST** `/experiments/{experimentId}/actions/implement`
    - **Purpose**: Implement the winning variant as the standard.
    - **Payload**: 
    ```typescript
    {
      variantId: string;  // ID of variant to implement
      schedule?: string;  // Optional scheduled implementation date
    }
    ```
    - **Response**: Updated experiment with Implemented status.

### API Integration in Frontend Components

The primary frontend integration with these APIs occurs through custom React hooks that abstract the API calls and manage data fetching, caching, and state. The key hooks include:

#### 1. useExperimentsApi

This core hook provides access to the experiment listing API and common operations:

```typescript
// In src/hooks/features/useExperimentsApi.ts
import { useApi } from '@/hooks/useApi';
import { ExperimentFilter, Experiment, PaginatedResponse } from '@/lib/types';

export function useExperimentsApi() {
  const api = useApi();
  
  const getExperiments = async (filters: ExperimentFilter = {}) => {
    return api.get<PaginatedResponse<Experiment>>('/experiments', { params: filters });
  };
  
  const createExperiment = async (experimentData: Partial<Experiment>) => {
    return api.post<Experiment>('/experiments', experimentData);
  };
  
  // Additional methods omitted for brevity
  
  return {
    getExperiments,
    createExperiment,
    // Other methods
  };
}
```

#### 2. useExperimentDetails

This hook manages a specific experiment's details and operations:

```typescript
// In src/hooks/features/useExperimentDetails.ts
import { useApi } from '@/hooks/useApi';
import { Experiment, ExperimentVariant, ExperimentAudience, ExperimentMetrics } from '@/lib/types';

export function useExperimentDetails(experimentId: string) {
  const api = useApi();
  
  const getExperiment = async () => {
    return api.get<Experiment>(`/experiments/${experimentId}`);
  };
  
  const updateExperiment = async (updates: Partial<Experiment>) => {
    return api.patch<Experiment>(`/experiments/${experimentId}`, updates);
  };
  
  const getVariants = async () => {
    return api.get<ExperimentVariant[]>(`/experiments/${experimentId}/variants`);
  };
  
  // Additional methods for managing audience, metrics, actions (start, pause, etc.)
  
  return {
    getExperiment,
    updateExperiment,
    getVariants,
    // Additional methods
  };
}
```

#### 3. useExperimentResults

This specialized hook focuses on fetching and processing experiment results:

```typescript
// In src/hooks/features/useExperimentResults.ts
import { useApi } from '@/hooks/useApi';
import { ExperimentResults, VariantPerformance } from '@/lib/types';

export function useExperimentResults(experimentId: string) {
  const api = useApi();
  
  const getResults = async () => {
    return api.get<ExperimentResults>(`/experiments/${experimentId}/results`);
  };
  
  const exportResults = async (format: 'csv' | 'json' = 'csv') => {
    return api.get(`/experiments/${experimentId}/results/export`, {
      params: { format },
      responseType: 'blob'
    });
  };
  
  // Additional methods for results analysis
  
  return {
    getResults,
    exportResults,
    // Additional methods
  };
}
```

### Integration with React Query

These hooks are typically wrapped using React Query to provide caching, background refreshing, and optimistic updates:

```typescript
// In src/components/features/experiments/ExperimentList.tsx
import { useQuery } from 'react-query';
import { useExperimentsApi } from '@/hooks/features/useExperimentsApi';

export function ExperimentList() {
  const { getExperiments } = useExperimentsApi();
  const [filters, setFilters] = useState<ExperimentFilter>({});
  
  const { data, isLoading, error } = useQuery(
    ['experiments', filters],
    () => getExperiments(filters),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
    }
  );
  
  // Component rendering logic
}
```

### API Error Handling

The experimentation UI implements consistent error handling for API interactions:

1. **Network-Level Errors**: Handled by the base API client, showing appropriate notifications for connection issues.

2. **Authentication Errors**: 401/403 responses redirect to login or show permission errors.

3. **Validation Errors**: Form submission errors are mapped to the corresponding form fields with descriptive messages.

4. **Business Logic Errors**: Specific error codes from the API are translated into user-friendly messages:
   - Experiment collision errors
   - Insufficient sample size warnings
   - Invalid state transition errors

Example error handling implementation:

```typescript
// In src/components/features/experiments/ExperimentActions.tsx
import { useMutation } from 'react-query';
import { useExperimentDetails } from '@/hooks/features/useExperimentDetails';
import { toast } from '@/components/ui/toast';

export function ExperimentActions({ experimentId }) {
  const { startExperiment } = useExperimentDetails(experimentId);
  
  const startMutation = useMutation(startExperiment, {
    onSuccess: () => {
      toast.success('Experiment started successfully');
      // Refresh data
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        // Collision with another experiment
        toast.error('This experiment conflicts with another active experiment');
      } else if (error.response?.data?.code === 'INSUFFICIENT_AUDIENCE') {
        toast.error('Insufficient audience size to start this experiment');
      } else {
        toast.error('Failed to start experiment');
      }
    }
  });
  
  // Component rendering logic
}
```

### API Data Transformations

The experimentation UI often needs to transform API data for presentation:

1. **Date Formatting**: Converting ISO timestamps to user-friendly formats

2. **Stat Formatting**: Transforming raw statistical values (e.g., p-values, confidence intervals) into user-friendly displays

3. **Chart Data Preparation**: Converting API result data into formats suitable for visualization libraries

Example transformation utility:

```typescript
// In src/lib/utils/experimentTransforms.ts
import { ExperimentResults, ChartData } from '@/lib/types';

export function prepareChartData(results: ExperimentResults): ChartData {
  // Transform API results into chart-friendly format
  const labels = results.variants.map(v => v.name);
  const data = results.variants.map(v => v.metrics.primaryMetric.value);
  
  return {
    labels,
    datasets: [{
      label: 'Primary Metric',
      data,
      backgroundColor: results.variants.map(getVariantColor),
      // Additional chart configuration
    }]
  };
}

// Additional utility functions
```

### Real-time Updates

For ongoing experiments, the UI supports real-time or near-real-time updates using:

1. **Polling**: React Query's polling mechanism for active experiment details

2. **Websockets** (if implemented): For instant updates on experiment status changes

Example polling configuration:

```typescript
// In src/components/features/experiments/ExperimentDetail.tsx
import { useQuery } from 'react-query';
import { useExperimentDetails } from '@/hooks/features/useExperimentDetails';

export function ExperimentDetail({ experimentId }) {
  const { getExperiment } = useExperimentDetails(experimentId);
  
  const { data, isLoading } = useQuery(
    ['experiment', experimentId],
    getExperiment,
    {
      // For running experiments, poll every 30 seconds
      refetchInterval: (data) => 
        data?.status === 'running' ? 30000 : false,
    }
  );
  
  // Component rendering logic
}
```

## Component Architecture

The experimentation feature is built using a modular component architecture that promotes reusability, maintainability, and a consistent user experience. This section details the component structure, relationships, and design patterns used in the implementation.

### Component Hierarchy

The experimentation components follow a hierarchical structure that mirrors the functional organization of the feature:

```
ExperimentModule
├── ExperimentList
│   ├── ExperimentFilters
│   ├── ExperimentCard
│   │   └── ExperimentStatusBadge
│   └── PaginationControls
├── ExperimentCreationWizard
│   ├── BasicInfoStep
│   ├── VariantDefinitionStep
│   │   ├── JourneyVariantEditor (for Journey experiments)
│   │   │   └── ContentVariantForm
│   │   └── ProgramVariantEditor (for Program experiments)
│   │       └── ParameterConfigForm
│   ├── AudienceSelectionStep
│   │   ├── SegmentSelector
│   │   └── DistributionControls
│   ├── MetricsConfigurationStep
│   │   └── MetricSelector
│   └── ReviewStep
├── ExperimentDetail
│   ├── ExperimentHeader
│   │   └── ExperimentActions
│   ├── ExperimentOverview
│   │   ├── ExperimentSummary
│   │   └── StatusTimeline
│   ├── VariantsView
│   │   ├── JourneyVariantComparison (for Journey experiments)
│   │   └── ProgramVariantComparison (for Program experiments)
│   ├── AudienceView
│   │   ├── AllocationChart
│   │   └── SegmentBreakdown
│   ├── ResultsView
│   │   ├── MetricComparison
│   │   ├── StatisticalSignificance
│   │   ├── SegmentPerformance
│   │   └── TimeSeriesAnalysis
│   ├── HistoryView
│   │   └── EventTimeline
│   └── LogsView
└── Shared Components
    ├── ExperimentTypeSelector
    ├── ConfidenceDisplay
    ├── SampleSizeCalculator
    ├── VariantComparisonChart
    ├── ExperimentProgressBar
    └── ValidationIndicator
```

### Core Component Types

The experimentation components can be categorized into several functional types:

#### 1. Container Components

Container components manage state, fetch data via hooks, and coordinate interactions between child components:

- **ExperimentList**: Manages experiment listing, filtering, and pagination
- **ExperimentDetail**: Orchestrates the detailed view of a single experiment
- **ExperimentCreationWizard**: Manages the multi-step creation process

```typescript
// ExperimentList.tsx example
import { useQuery } from 'react-query';
import { useExperimentsApi } from '@/hooks/features/useExperimentsApi';
import { ExperimentCard } from './ExperimentCard';
import { ExperimentFilters } from './ExperimentFilters';
import { PaginationControls } from '@/components/ui/PaginationControls';

export function ExperimentList() {
  const { getExperiments } = useExperimentsApi();
  const [filters, setFilters] = useState<ExperimentFilter>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading, error } = useQuery(
    ['experiments', filters, page, pageSize],
    () => getExperiments({ ...filters, page, limit: pageSize }),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
    }
  );
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <div className="experiment-list">
      <ExperimentFilters 
        filters={filters} 
        onChange={setFilters} 
      />
      
      <div className="experiment-grid">
        {data?.items.map(experiment => (
          <ExperimentCard 
            key={experiment.id} 
            experiment={experiment} 
          />
        ))}
      </div>
      
      <PaginationControls
        currentPage={page}
        totalPages={data?.meta.totalPages || 1}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

#### 2. Presentational Components

Presentational components focus on rendering UI elements based on props, with minimal internal state:

- **ExperimentCard**: Displays experiment summary information
- **ExperimentStatusBadge**: Shows experiment status with appropriate styling
- **MetricComparison**: Visualizes experiment results

```typescript
// ExperimentCard.tsx example
import { Link } from 'next/link';
import { ExperimentStatusBadge } from './ExperimentStatusBadge';
import { ExperimentProgressBar } from '../shared/ExperimentProgressBar';
import { formatDate } from '@/lib/utils/dateUtils';
import { Experiment } from '@/lib/types';

interface ExperimentCardProps {
  experiment: Experiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const {
    id,
    name,
    status,
    type,
    target,
    createdAt,
    startDate,
    endDate,
    progress
  } = experiment;
  
  return (
    <Link href={`/experiments/${id}`}>
      <div className="experiment-card">
        <ExperimentStatusBadge status={status} />
        
        <h3 className="experiment-card__title">{name}</h3>
        
        <div className="experiment-card__meta">
          <span className="experiment-card__type">{type}</span>
          <span className="experiment-card__target">{target?.name}</span>
        </div>
        
        <div className="experiment-card__dates">
          {status === 'draft' || status === 'ready' ? (
            <span>Created: {formatDate(createdAt)}</span>
          ) : (
            <span>
              {startDate && `Started: ${formatDate(startDate)}`}
              {endDate && ` - Ends: ${formatDate(endDate)}`}
            </span>
          )}
        </div>
        
        {progress !== undefined && (
          <ExperimentProgressBar 
            progress={progress} 
            status={status} 
          />
        )}
      </div>
    </Link>
  );
}
```

#### 3. Form Components

Form components handle user input and maintain form state:

- **BasicInfoStep**: Collects basic experiment information
- **VariantDefinitionStep**: Interface for creating experiment variants
- **MetricsConfigurationStep**: Configures experiment metrics

```typescript
// BasicInfoStep.tsx example
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Input, 
  Textarea, 
  Select, 
  DatePicker 
} from '@/components/ui';
import { ExperimentTypeSelector } from '../shared/ExperimentTypeSelector';
import { JourneyProgramSelector } from '../shared/JourneyProgramSelector';

const basicInfoSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['journey', 'program']),
  hypothesis: z.string().min(10, 'Please enter a clear hypothesis'),
  targetId: z.string().uuid('Please select a valid target'),
  targetType: z.enum(['journey', 'program']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoStepProps {
  initialData?: Partial<BasicInfoFormData>;
  onSubmit: (data: BasicInfoFormData) => void;
  onBack?: () => void;
}

export function BasicInfoStep({ 
  initialData = {}, 
  onSubmit, 
  onBack 
}: BasicInfoStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData,
    mode: 'onChange'
  });
  
  const selectedType = watch('type');
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="experiment-form">
      <div className="form-group">
        <label htmlFor="name">Experiment Name</label>
        <Input
          id="name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="E.g., Test different message formats"
        />
      </div>
      
      <div className="form-group">
        <label>Experiment Type</label>
        <ExperimentTypeSelector
          value={selectedType}
          onChange={(type) => setValue('type', type, { shouldValidate: true })}
          error={errors.type?.message}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="hypothesis">Hypothesis</label>
        <Textarea
          id="hypothesis"
          {...register('hypothesis')}
          error={errors.hypothesis?.message}
          placeholder="E.g., Using video instead of text will increase completion rates by 20%"
        />
      </div>
      
      <div className="form-group">
        <label>Target {selectedType === 'journey' ? 'Journey' : 'Program'}</label>
        <JourneyProgramSelector
          type={selectedType}
          value={watch('targetId')}
          onChange={(id, type) => {
            setValue('targetId', id, { shouldValidate: true });
            setValue('targetType', type, { shouldValidate: true });
          }}
          error={errors.targetId?.message}
        />
      </div>
      
      {/* Additional form elements for dates and description */}
      
      <div className="form-actions">
        {onBack && (
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={!isValid}>
          Next
        </button>
      </div>
    </form>
  );
}
```

#### 4. Visualization Components

Visualization components render charts, graphs, and interactive data displays:

- **VariantComparisonChart**: Bar chart comparing variant performance
- **StatisticalSignificance**: Visual representation of confidence intervals
- **AllocationChart**: Pie chart showing audience distribution

```typescript
// VariantComparisonChart.tsx example
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ExperimentVariant } from '@/lib/types';
import { getVariantColor } from '@/lib/utils/experimentUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VariantComparisonChartProps {
  variants: ExperimentVariant[];
  metricKey: string;
  metricName: string;
  higherIsBetter?: boolean;
}

export function VariantComparisonChart({
  variants,
  metricKey,
  metricName,
  higherIsBetter = true
}: VariantComparisonChartProps) {
  const chartData = useMemo(() => {
    const labels = variants.map(v => v.name);
    const data = variants.map(v => v.metrics[metricKey]?.value || 0);
    const backgroundColor = variants.map((v, i) => 
      getVariantColor(v, variants[0], higherIsBetter)
    );
    
    return {
      labels,
      datasets: [
        {
          label: metricName,
          data,
          backgroundColor,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
        }
      ]
    };
  }, [variants, metricKey, metricName, higherIsBetter]);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${metricName} by Variant`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const variant = variants[context.dataIndex];
            const value = variant.metrics[metricKey]?.value || 0;
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'percent',
              maximumFractionDigits: 2
            }).format(value);
            
            return `${variant.name}: ${formattedValue}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'percent',
              maximumFractionDigits: 1
            }).format(value);
          }
        }
      }
    }
  };
  
  return (
    <div className="variant-comparison-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
}
```

#### 5. Utility Components

Utility components provide specialized functionality that can be reused across different contexts:

- **SampleSizeCalculator**: Helps determine adequate sample sizes for experiments
- **ValidationIndicator**: Shows validation status with appropriate feedback
- **ExperimentTypeSelector**: Specialized control for selecting experiment types

```typescript
// SampleSizeCalculator.tsx example
import { useState, useEffect } from 'react';
import { 
  Select, 
  Slider, 
  Input, 
  InfoTooltip 
} from '@/components/ui';
import { calculateRequiredSampleSize } from '@/lib/utils/statistics';

interface SampleSizeCalculatorProps {
  currentSize?: number;
  onSampleSizeChange?: (size: number) => void;
}

export function SampleSizeCalculator({
  currentSize,
  onSampleSizeChange
}: SampleSizeCalculatorProps) {
  // Default statistical parameters
  const [baselineConversion, setBaselineConversion] = useState(0.2); // 20%
  const [minimumDetectableEffect, setMinimumDetectableEffect] = useState(0.15); // 15%
  const [confidenceLevel, setConfidenceLevel] = useState(0.95); // 95%
  const [power, setPower] = useState(0.8); // 80%
  
  // Calculate required sample size
  const [requiredSampleSize, setRequiredSampleSize] = useState(0);
  
  useEffect(() => {
    const size = calculateRequiredSampleSize(
      baselineConversion,
      minimumDetectableEffect,
      confidenceLevel,
      power
    );
    
    setRequiredSampleSize(size);
    if (onSampleSizeChange) {
      onSampleSizeChange(size);
    }
  }, [
    baselineConversion, 
    minimumDetectableEffect, 
    confidenceLevel, 
    power, 
    onSampleSizeChange
  ]);
  
  return (
    <div className="sample-size-calculator">
      <h3>Sample Size Calculator</h3>
      
      <div className="calculator-row">
        <label>
          Baseline Conversion Rate
          <InfoTooltip content="Your current conversion rate before running the experiment" />
        </label>
        <div className="calculator-control">
          <Slider
            value={baselineConversion}
            onChange={setBaselineConversion}
            min={0.01}
            max={0.99}
            step={0.01}
          />
          <Input
            type="number"
            value={Math.round(baselineConversion * 100)}
            onChange={(e) => setBaselineConversion(Number(e.target.value) / 100)}
            min={1}
            max={99}
            suffix="%"
          />
        </div>
      </div>
      
      {/* Similar rows for other parameters */}
      
      <div className="calculator-result">
        <div className="required-size">
          <h4>Required Sample Size (per variant)</h4>
          <div className="size-value">{Math.ceil(requiredSampleSize)}</div>
        </div>
        
        {currentSize !== undefined && (
          <div className={`current-size ${currentSize >= requiredSampleSize ? 'sufficient' : 'insufficient'}`}>
            <h4>Current Available Size</h4>
            <div className="size-value">{currentSize}</div>
            {currentSize < requiredSampleSize && (
              <div className="warning">
                Your current audience size may be too small for statistically significant results
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Component Design Principles

The experiment components adhere to these design principles:

#### 1. Composition Over Inheritance

Components are designed to be composable, with clear boundaries and specific responsibilities. This allows for:

- Easier testing of individual components
- Flexible recombination for different views or layouts
- Clearer separation of concerns

```typescript
// Example of composition
function ExperimentDetail({ experimentId }) {
  // Shared data fetching and state
  const { data, isLoading } = useExperimentData(experimentId);
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="experiment-detail">
      <ExperimentHeader 
        experiment={data} 
        actions={<ExperimentActions experimentId={experimentId} />} 
      />
      
      <Tabs>
        <TabPane tab="Overview">
          <ExperimentOverview experiment={data} />
        </TabPane>
        <TabPane tab="Variants">
          {data.type === 'journey' ? (
            <JourneyVariantComparison variants={data.variants} />
          ) : (
            <ProgramVariantComparison variants={data.variants} />
          )}
        </TabPane>
        {/* Additional tab panes */}
      </Tabs>
    </div>
  );
}
```

#### 2. Conditional Rendering Patterns

Experiment components often need to adapt their UI based on experiment state, type, or other factors. This is handled through:

- Early returns for loading/error states
- Component selection based on experiment type
- Conditional content rendering based on experiment status

```typescript
// Early return pattern for loading/error states
function ExperimentResults({ experimentId }) {
  const { data, isLoading, error } = useExperimentResults(experimentId);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <EmptyState message="No results available" />;
  
  // Conditional rendering based on result state
  if (data.status === 'insufficient_data') {
    return <InsufficientDataDisplay threshold={data.threshold} current={data.sampleSize} />;
  }
  
  return (
    <div className="experiment-results">
      {/* Results content */}
    </div>
  );
}
```

#### 3. Progressive Enhancement

Complex experiment features are presented through progressive enhancement, where:

- Basic functionality is immediately accessible to all users
- Advanced options are progressively revealed as needed
- Feature complexity scales with user expertise

```typescript
// Progressive disclosure example
function AdvancedMetricsConfiguration({ onChange, initialConfig }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <div className="metrics-configuration">
      {/* Basic metrics UI always visible */}
      <PrimaryMetricSelector 
        value={initialConfig.primaryMetric}
        onChange={(metric) => onChange({ ...initialConfig, primaryMetric: metric })}
      />
      
      {/* Advanced options revealed on demand */}
      <button 
        className="toggle-advanced" 
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
      </button>
      
      {showAdvanced && (
        <div className="advanced-options">
          <SecondaryMetricsSelector 
            values={initialConfig.secondaryMetrics}
            onChange={(metrics) => onChange({ ...initialConfig, secondaryMetrics: metrics })}
          />
          
          <StatisticalConfigurationForm
            config={initialConfig.stats}
            onChange={(stats) => onChange({ ...initialConfig, stats })}
          />
        </div>
      )}
    </div>
  );
}
```

#### 4. Responsive Adaptation

Experiment components adapt to different screen sizes through:

- Flexible layouts using CSS Grid and Flexbox
- Component-specific responsive behaviors
- Adaptive information density based on screen real estate

```typescript
// Responsive component example
function ExperimentListResponsive() {
  const { data } = useExperiments();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="experiment-list">
      {isSmallScreen ? (
        // Compact vertical layout for small screens
        <div className="experiment-list--compact">
          {data?.map(experiment => (
            <ExperimentCardCompact key={experiment.id} experiment={experiment} />
          ))}
        </div>
      ) : (
        // Grid layout for larger screens
        <div className="experiment-list--grid">
          {data?.map(experiment => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Component Integration with Other Domains

The experimentation components integrate with other domain components through well-defined interfaces:

#### 1. Journey Builder Integration

When creating Journey-level experiments, the experiment components integrate with Journey Builder components:

```typescript
// JourneyExperimentIntegration.tsx example
import { JourneyTouchpointSelector } from '@/components/features/journeys/JourneyTouchpointSelector';
import { ContentEditor } from '@/components/features/content/ContentEditor';

function JourneyVariantEditor({ journeyId, onVariantCreate }) {
  const [selectedTouchpoints, setSelectedTouchpoints] = useState([]);
  const [variantContent, setVariantContent] = useState({});
  
  return (
    <div className="journey-variant-editor">
      <h3>Select Touchpoints to Test</h3>
      <JourneyTouchpointSelector 
        journeyId={journeyId}
        selection={selectedTouchpoints}
        onSelectionChange={setSelectedTouchpoints}
      />
      
      {selectedTouchpoints.length > 0 && (
        <>
          <h3>Create Variant Content</h3>
          {selectedTouchpoints.map(touchpoint => (
            <div key={touchpoint.id} className="touchpoint-variant">
              <h4>{touchpoint.name}</h4>
              <ContentEditor
                originalContent={touchpoint.content}
                onChange={(content) => {
                  setVariantContent(prev => ({
                    ...prev,
                    [touchpoint.id]: content
                  }));
                }}
              />
            </div>
          ))}
          
          <button 
            onClick={() => onVariantCreate({ 
              touchpoints: selectedTouchpoints, 
              content: variantContent 
            })}
            disabled={Object.keys(variantContent).length === 0}
            className="btn-primary"
          >
            Create Variant
          </button>
        </>
      )}
    </div>
  );
}
```

#### 2. Program Management Integration

Program-level experiments integrate with Program Management components:

```typescript
// ProgramExperimentIntegration.tsx example
import { ProgramSettingsEditor } from '@/components/features/programs/ProgramSettingsEditor';
import { ScheduleConfiguration } from '@/components/features/programs/ScheduleConfiguration';

function ProgramVariantEditor({ programId, onVariantCreate }) {
  const [variantSettings, setVariantSettings] = useState({});
  const [variantSchedule, setVariantSchedule] = useState({});
  
  return (
    <div className="program-variant-editor">
      <h3>Configure Implementation Variant</h3>
      <ProgramSettingsEditor
        programId={programId}
        onChange={setVariantSettings}
      />
      
      <h3>Configure Variant Schedule</h3>
      <ScheduleConfiguration
        programId={programId}
        onChange={setVariantSchedule}
      />
      
      <button 
        onClick={() => onVariantCreate({ 
          settings: variantSettings, 
          schedule: variantSchedule 
        })}
        className="btn-primary"
      >
        Create Variant
      </button>
    </div>
  );
}
```

#### 3. Segmentation Integration

Experiment audience selection integrates with the Segmentation domain:

```typescript
// ExperimentAudienceIntegration.tsx example
import { SegmentSelector } from '@/components/features/segments/SegmentSelector';
import { SegmentPreview } from '@/components/features/segments/SegmentPreview';

function ExperimentAudienceConfiguration({ onChange, value }) {
  const [selectedSegments, setSelectedSegments] = useState(value?.segments || []);
  
  const handleSegmentChange = (segments) => {
    setSelectedSegments(segments);
    onChange({ ...value, segments });
  };
  
  return (
    <div className="experiment-audience">
      <h3>Select Target Audience</h3>
      <SegmentSelector
        value={selectedSegments}
        onChange={handleSegmentChange}
        allowMultiple
      />
      
      {selectedSegments.length > 0 && (
        <div className="audience-preview">
          <h4>Audience Preview</h4>
          <SegmentPreview
            segmentIds={selectedSegments}
            showOverlap
          />
          <SampleSizeCalculator
            currentSize={value?.estimatedSize}
            onSampleSizeChange={(size) => onChange({ ...value, requiredSampleSize: size })}
          />
        </div>
      )}
    </div>
  );
}
```

### Component Implementation Best Practices

The experimentation component implementation follows these best practices:

#### 1. State Management

- **Local Component State**: Used for UI-specific state using React's `useState` hook
- **Form State**: Managed using `react-hook-form` for complex forms
- **API State**: Handled via React Query with appropriate caching and stale-time settings
- **Shared State**: Passed down via props or context for component trees

#### 2. Performance Optimization

- **Memoization**: React.memo for expensive components that don't need frequent re-renders
- **useMemo/useCallback**: For complex calculations or event handlers passed as props
- **Virtualization**: For long lists (e.g., experiment history) using `react-window`
- **Incremental Loading**: For large datasets (e.g., detailed result logs)

#### 3. Accessibility

- **Keyboard Navigation**: All interactive components fully keyboard accessible
- **ARIA Attributes**: Properly labeled for screen readers
- **Focus Management**: Appropriate focus handling for modal dialogs, forms
- **Color Contrast**: Ensuring sufficient contrast for status indicators, chart elements

#### 4. Error Handling

- **Graceful Degradation**: Components handle missing or partial data gracefully
- **Error Boundaries**: Used to contain failures in specific component trees
- **Fallback UI**: Appropriate fallback UI when data is unavailable
- **Validation Feedback**: Clear, accessible validation messages for user input

## User Flows

The experimentation system supports several key user flows that enable the creation, management, analysis, and implementation of experiments. This section details these flows, highlighting the user interactions, system responses, and integration points with other domains.

### 1. Creating a New Journey-level Experiment

This flow allows a Training Manager to create and configure a Journey-level experiment to test different content variants.

#### Actors
- Primary: Training Manager
- Secondary: Content Specialist (may assist with content creation)

#### Preconditions
- User has appropriate permissions
- At least one Journey Blueprint exists in the system
- Target Journey has touchpoints with content that can be varied

#### Steps

1. **Initiate Experiment Creation**
   - User navigates to Experiments list page
   - User clicks "Create New Experiment" button
   - System presents experiment type selection

2. **Select Journey Experiment**
   - User selects "Journey-level Experiment"
   - System presents the basic info form (first step of wizard)

3. **Enter Basic Information**
   - User enters experiment name
   - User writes hypothesis statement
   - User selects target Journey Blueprint
   - User optionally enters description and scheduled dates
   - User clicks "Next"

4. **Configure Content Variants**
   - System displays Journey structure with touchpoints
   - User selects touchpoints to include in the experiment
   - For each selected touchpoint:
     - User views original content (control variant)
     - User creates alternative content variant(s)
     - User previews how variants will appear
   - User clicks "Next"

5. **Define Target Audience**
   - User selects target segments for the experiment
   - System displays estimated audience size
   - User configures distribution between variants (e.g., 50/50 split)
   - User reviews sample size calculator results
   - User clicks "Next"

6. **Configure Metrics**
   - User selects primary success metric
   - User optionally selects secondary metrics
   - User configures success criteria and confidence level
   - User clicks "Next"

7. **Review and Launch**
   - System displays summary of experiment configuration
   - System reports any validation issues or warnings
   - User reviews all settings
   - User decides to:
     - Save as draft (if not ready to launch)
     - Schedule for future date
     - Launch immediately

#### Postconditions
- New experiment is created in Draft, Ready, or Running state
- Experiment is listed in the Experiments Dashboard
- Content variants are created and stored

#### Integration Points
- Journey Builder: Accessing Journey structure and touchpoints
- Content Management: Creating and storing content variants
- Segmentation: Selecting target audience segments

### 2. Creating a New Program-level Experiment

This flow allows a Program Manager to create and configure a Program-level experiment to test different implementation strategies.

#### Actors
- Primary: Program Manager

#### Preconditions
- User has appropriate permissions
- At least one Program exists in the system or can be created
- Content is ready for deployment

#### Steps

1. **Initiate Experiment Creation**
   - User navigates to Experiments list page
   - User clicks "Create New Experiment" button
   - System presents experiment type selection

2. **Select Program Experiment**
   - User selects "Program-level Experiment"
   - System presents the basic info form (first step of wizard)

3. **Enter Basic Information**
   - User enters experiment name
   - User writes hypothesis statement
   - User selects target Program or Journey Blueprint to deploy as a Program
   - User optionally enters description and scheduled dates
   - User clicks "Next"

4. **Configure Implementation Variants**
   - User defines the control variant (standard implementation)
   - User creates alternative implementation variants by configuring:
     - Delivery timing parameters
     - Follow-up strategies
     - Channel preferences
     - Notification frequency
     - Other implementation variables
   - User clicks "Next"

5. **Define Target Audience**
   - User selects target segments for the experiment
   - System displays estimated audience size
   - User configures distribution between variants
   - User reviews sample size calculator results
   - User clicks "Next"

6. **Configure Metrics**
   - User selects primary success metric (e.g., completion rate, time-to-completion)
   - User optionally selects secondary metrics
   - User configures success criteria and confidence level
   - User clicks "Next"

7. **Review and Launch**
   - System displays summary of experiment configuration
   - System reports any validation issues or warnings
   - User reviews all settings
   - User decides to:
     - Save as draft (if not ready to launch)
     - Schedule for future date
     - Launch immediately

#### Postconditions
- New experiment is created in Draft, Ready, or Running state
- Experiment is listed in the Experiments Dashboard
- Program implementation variants are configured

#### Integration Points
- Program Management: Creating program variants with different implementation strategies
- Journey Builder: Accessing Journey content to be deployed in the program
- Segmentation: Selecting target audience segments

### 3. Monitoring an Active Experiment

This flow enables users to monitor the progress and interim results of an active experiment.

#### Actors
- Training Manager (for Journey experiments)
- Program Manager (for Program experiments)

#### Preconditions
- Experiment is in Running state
- Sufficient data collection has begun

#### Steps

1. **Access Experiment Dashboard**
   - User navigates to Experiments list page
   - User locates the active experiment
   - User clicks on the experiment card to view details

2. **Review Progress Overview**
   - System displays experiment runtime information
   - System shows participation metrics (workers per variant)
   - System presents interim results for primary and secondary metrics
   - User reviews current status and trends

3. **Analyze Interim Results**
   - User navigates to Results tab
   - System displays current performance metrics for each variant
   - System shows confidence intervals and statistical significance indicators
   - User examines comparative performance

4. **Check Audience Distribution**
   - User navigates to Audience tab
   - System displays actual audience allocation
   - System shows drop-off rates by variant
   - User verifies balanced distribution

5. **Monitor Individual Variants**
   - User navigates to Variants tab
   - User reviews detailed performance of each variant
   - User examines variant-specific metrics

6. **Optional Actions**
   - User may decide to:
     - Continue monitoring without changes
     - Pause experiment if issues are detected
     - Extend experiment duration if more data needed
     - Conclude experiment early if clear winner emerges
     - Adjust experiment parameters (limited options while running)

#### Postconditions
- User has up-to-date information on experiment progress
- Any requested actions (pause, extend, conclude) are applied

#### Integration Points
- Analytics: Real-time data processing and visualization
- Journey or Program: Runtime state tracking
- Notification System: Alerts about experiment status changes

### 4. Analyzing and Implementing Experiment Results

This flow allows users to review final experiment results, draw conclusions, and implement winning variants.

#### Actors
- Training Manager (for Journey experiments)
- Program Manager (for Program experiments)

#### Preconditions
- Experiment is in Concluded state
- Sufficient data has been collected for analysis

#### Steps

1. **Access Completed Experiment**
   - User navigates to Experiments list page
   - User filters for Concluded experiments
   - User selects the target experiment

2. **Review Final Results**
   - System displays comprehensive results dashboard
   - System highlights whether a statistically significant winner was identified
   - System presents performance metrics for all variants
   - User reviews performance across primary and secondary metrics

3. **Analyze Segment-Specific Results**
   - User navigates to segment analysis section
   - System displays performance breakdown by segment
   - User identifies any segment-specific patterns or preferences

4. **Export Results (Optional)**
   - User selects export option
   - User chooses export format (CSV, PDF, etc.)
   - System generates and downloads report

5. **Make Implementation Decision**
   - Based on results, user decides whether to:
     - Implement winning variant
     - Conduct follow-up experiment with refinements
     - Maintain original version
     - Implement different variants for different segments

6. **Implement Winning Variant (If Applicable)**
   - User clicks "Implement Variant" button
   - User selects which variant to implement
   - User configures implementation details:
     - Immediate or scheduled implementation
     - Apply to all or specific audiences
     - Create permanent update or temporary change
   - User confirms implementation

7. **Document Findings**
   - User adds notes and learning insights
   - User tags experiment with relevant categories
   - User shares results with team members

#### Postconditions
- Experiment is moved to Implemented state if a variant was implemented
- Selected variant becomes the new standard for the Journey or Program
- Experiment results are stored for future reference

#### Integration Points
- Journey Builder: Updating Journey Blueprint with winning content
- Program Management: Updating Program implementation with winning strategy
- Knowledge Repository: Storing experiment results and insights
- Marketplace: Optionally sharing anonymized results with the marketplace

### 5. Managing the Experiment Lifecycle

This flow covers the overall management of experiments through their complete lifecycle.

#### Actors
- Training Manager
- Program Manager

#### Preconditions
- User has appropriate permissions
- One or more experiments exist in various states

#### Steps

1. **Browse Experiments**
   - User navigates to Experiments list page
   - User applies filters to find relevant experiments:
     - By status (Draft, Ready, Running, Paused, Concluded, etc.)
     - By type (Journey, Program)
     - By target (specific Journey or Program)
     - By date range

2. **Manage Draft Experiments**
   - For experiments in Draft state:
     - User can continue setup from where they left off
     - User can edit any aspect of the configuration
     - User can delete the draft if no longer needed

3. **Manage Ready Experiments**
   - For experiments in Ready state:
     - User can review configuration
     - User can make final adjustments
     - User can schedule start date/time
     - User can start the experiment immediately

4. **Manage Running Experiments**
   - For experiments in Running state:
     - User can monitor progress and interim results
     - User can pause execution if needed
     - User can add notes or observations
     - User can extend duration or increase sample size

5. **Manage Paused Experiments**
   - For experiments in Paused state:
     - User can review the reason for pausing
     - User can resume execution
     - User can conclude the experiment early
     - User can make limited adjustments before resuming

6. **Manage Concluded Experiments**
   - For experiments in Concluded state:
     - User can review final results and analysis
     - User can export reports
     - User can implement winning variants
     - User can create follow-up experiments

7. **Manage Implemented Experiments**
   - For experiments in Implemented state:
     - User can view implementation details
     - User can monitor post-implementation performance
     - User can revert to original if needed
     - User can archive when no longer relevant

8. **Archive Management**
   - User can view archived experiments
   - User can restore from archive if needed
   - User can permanently delete (with appropriate permissions)

#### Postconditions
- Experiments progress through their lifecycle states
- Appropriate actions are taken at each stage

#### Integration Points
- Authentication: Permission checks for lifecycle actions
- Notification System: Alerts about state changes
- Audit System: Tracking of all lifecycle actions for compliance

### 6. Creating a Hybrid Experiment

This advanced flow enables testing both content and implementation variables simultaneously through coordinated experiments.

#### Actors
- Training Manager
- Program Manager

#### Preconditions
- User has advanced permissions
- Understanding of experimental design
- Sufficient audience size for complex testing

#### Steps

1. **Plan Hybrid Experiment Strategy**
   - Users collaborate to design a coordinated experiment approach
   - Users identify content variables to test (Journey-level)
   - Users identify implementation variables to test (Program-level)
   - Users determine how to coordinate the experiments

2. **Create Journey-level Experiment**
   - Training Manager follows the Journey experiment creation flow
   - Creates content variants as needed
   - Marks the experiment as part of a hybrid experiment
   - Links to the associated Program experiment (to be created)

3. **Create Program-level Experiment**
   - Program Manager follows the Program experiment creation flow
   - Creates implementation variants as needed
   - Marks the experiment as part of a hybrid experiment
   - Links to the associated Journey experiment

4. **Configure Coordinated Audience Assignment**
   - Users access the hybrid experiment coordination interface
   - Configure how variants across both experiments will be assigned:
     - Factorial design (all combinations)
     - Nested design (specific combinations)
     - Independent assignment
   - Review estimated sample sizes for each combination

5. **Launch Coordinated Experiments**
   - System validates the hybrid setup
   - Users review all settings
   - Users launch both experiments simultaneously

6. **Monitor Multi-dimensional Results**
   - System provides a specialized dashboard for hybrid experiments
   - Users can view performance metrics across both content and implementation dimensions
   - System presents interaction effects and cross-variant analysis

7. **Analyze Complex Findings**
   - Users navigate to the hybrid analysis view
   - System displays multi-dimensional analysis
   - Users identify optimal combinations of content and implementation

8. **Implement Multi-factor Results**
   - Users select the optimal combination of content and implementation
   - Users implement changes across both Journey and Program levels

#### Postconditions
- Both content and implementation aspects are optimized
- Interaction effects are documented
- Complex insights are captured for future reference

#### Integration Points
- Journey and Program domains: Coordinated implementation
- Analytics: Multi-dimensional analysis
- Segmentation: Complex audience allocation

## Metrics & Analysis

The metrics and analysis system is a crucial component of the experimentation framework, providing the statistical foundation for evaluating experiment outcomes and making data-driven decisions. This section details the metrics available for experiments, how they are collected, analyzed, and visualized.

### Available Metrics

The experimentation system supports a comprehensive set of metrics that can be used to evaluate experiment success. These metrics fall into several categories:

#### 1. Engagement Metrics

Metrics that measure how workers interact with content:

- **Open Rate**: Percentage of workers who open/view a piece of content.
- **Interaction Rate**: Percentage of workers who interact with content (click, respond).
- **Response Time**: Average time taken to respond to a prompt or message.
- **Session Duration**: Time spent engaging with content.
- **Repeat Views**: Number of times content is accessed multiple times.
- **Depth of Engagement**: How far into content workers progress (e.g., scroll depth, video watch percentage).

#### 2. Completion Metrics

Metrics that measure progress and completion:

- **Touchpoint Completion Rate**: Percentage of workers who complete a specific touchpoint.
- **Phase Completion Rate**: Percentage of workers who complete an entire phase.
- **Journey Completion Rate**: Percentage of workers who complete the entire journey.
- **Time to Completion**: Average time taken to complete touchpoints, phases, or journeys.
- **Dropout Points**: Specific points where workers commonly abandon the journey.
- **Completion Pattern**: Distribution of completion times (early/steady/last-minute).

#### 3. Learning & Knowledge Metrics

Metrics that measure knowledge acquisition and retention:

- **Quiz Score**: Average or distribution of scores on knowledge assessments.
- **Answer Accuracy**: Percentage of correct answers on specific questions.
- **Knowledge Retention**: Performance on follow-up assessments over time.
- **Confidence Level**: Self-reported confidence in understanding material.
- **Application Success**: Ability to apply concepts in practical scenarios.

#### 4. Behavioral Metrics

Metrics that measure real-world behavior changes:

- **Behavior Adoption Rate**: Percentage of workers implementing target behaviors.
- **Behavior Frequency**: How often a target behavior is performed.
- **Behavior Duration**: How long behavioral changes persist.
- **Habit Formation**: Indicators of automaticity in behavior performance.
- **Performance Improvement**: Quantifiable improvements in job performance.

#### 5. Wellbeing Metrics

Metrics related to worker wellbeing:

- **Wellbeing Score**: Composite measure of worker wellbeing.
- **Stress Level**: Self-reported or inferred stress measurements.
- **Job Satisfaction**: Sentiment toward role and responsibilities.
- **Burnout Indicators**: Early warning signs of burnout.
- **Resilience Metrics**: Ability to cope with challenges.

#### 6. Operational Metrics

Metrics related to program delivery and implementation:

- **Delivery Success Rate**: Percentage of messages successfully delivered.
- **Technical Error Rate**: Frequency of technical issues.
- **Support Request Frequency**: Number of help requests from workers.
- **Resource Utilization**: System resources required for different variants.
- **Cost Per Completion**: Financial efficiency of different approaches.

### Metric Collection

The experimentation system collects metrics through various mechanisms:

#### Data Sources

1. **Direct Interactions**: 
   - Response timestamps from messaging platforms
   - Click tracking in interactive content
   - Form submissions and quiz responses
   - Media playback events (start, pause, complete)

2. **Derived Measurements**:
   - Calculated completion rates
   - Time differentials between events
   - Pattern analysis of response sequences
   - Aggregated scores and performance indices

3. **External Integrations**:
   - Performance data from organizational systems
   - Observational data from supervisors
   - Self-reported data from surveys
   - IoT or mobile app sensor data (when available)

#### Collection Methods

1. **Real-time Tracking**:
   - Event-based tracking for immediate actions (clicks, views)
   - State changes in worker journey progression
   - Error and exception tracking

2. **Periodic Assessments**:
   - Scheduled quizzes and knowledge checks
   - Wellbeing pulse surveys
   - Performance evaluation imports

3. **Retrospective Analysis**:
   - Post-completion surveys
   - Longitudinal behavior tracking
   - Follow-up assessments after program completion

### Analysis Methodologies

The experimentation system employs rigorous statistical methods to analyze results:

#### Statistical Techniques

1. **Hypothesis Testing**:
   - Student's t-tests for comparing means between variants
   - Chi-square tests for categorical data
   - ANOVA for multi-variant experiments
   - Non-parametric alternatives when appropriate

2. **Significance Calculation**:
   - P-value determination for statistical significance
   - Confidence interval calculation
   - Effect size estimation
   - Statistical power assessment

3. **Advanced Analysis**:
   - Segmentation analysis to identify demographic patterns
   - Regression analysis for predictive insights
   - Multivariate analysis for complex experiment designs
   - Time-series analysis for temporal patterns

#### Analysis Considerations

1. **Sample Size Adequacy**:
   - Minimum sample size determination
   - Statistical power calculations
   - Early stopping rules based on significance
   - Sample size warnings for underpowered experiments

2. **Bias Prevention**:
   - Randomization verification
   - Sample balance checking
   - Controlling for confounding variables
   - Multiple testing correction

3. **Result Validation**:
   - Cross-validation with holdout samples
   - Sensitivity analysis for key assumptions
   - Robustness checks with alternative methods
   - Consistency verification across metrics

### Visualization & Reporting

The experimentation system provides rich visualization tools to interpret results:

#### Visualization Types

1. **Comparative Charts**:
   - Bar charts for variant comparison
   - Line charts for time-series data
   - Radar charts for multi-metric comparison
   - Funnel visualizations for completion stages

2. **Statistical Visualizations**:
   - Confidence interval plots
   - Significance level indicators
   - Effect size visualizations
   - Distribution curves

3. **Segmentation Visualizations**:
   - Heat maps for segment-by-variant performance
   - Treemaps for hierarchical segment analysis
   - Scatter plots for correlation analysis
   - Geographic visualizations when location data is available

4. **Dashboard Integrations**:
   - Real-time KPI displays
   - Experiment summary cards
   - Trend indicators with alerting
   - Comparative benchmarks

#### Reporting Features

1. **Standard Reports**:
   - Experiment summary reports
   - Variant comparison reports
   - Segment analysis reports
   - Statistical significance reports

2. **Interactive Analysis**:
   - Drill-down capabilities
   - Filter and segment controls
   - Temporal range selection
   - Metric weighting and customization

3. **Export Options**:
   - PDF export for presentations
   - CSV/Excel export for further analysis
   - API access for integration with external systems
   - Scheduled report delivery

### Metrics Implementation in UI

The experimentation UI implements metrics and analysis through several dedicated components:

#### Metric Selection Components

1. **MetricSelector**:
   - Allows users to choose primary and secondary metrics
   - Provides context-aware metric suggestions
   - Displays metric definitions and calculation methods
   - Validates metric compatibility with experiment type

2. **CustomMetricBuilder**:
   - Interface for defining custom composite metrics
   - Formula editor with validation
   - Preview of calculation results
   - Template library of common custom metrics

#### Analysis Components

1. **ResultsComparison**:
   - Side-by-side visualization of variant performance
   - Statistical significance indicators
   - Relative improvement calculations
   - Confidence interval visualization

2. **SegmentAnalyzer**:
   - Breakdown of results by segment
   - Identification of segment-specific patterns
   - Comparative segment performance
   - Segment size adequacy warnings

3. **StatisticalInsights**:
   - Automated analysis of statistical significance
   - Plain-language interpretation of results
   - Warnings for potential statistical issues
   - Recommendation generation based on results

#### Reporting Components

1. **ReportGenerator**:
   - Templated report creation
   - Selection of metrics and visualizations to include
   - Annotation and comment capabilities
   - Export format selection

2. **InsightCards**:
   - Automatically generated key insights
   - Anomaly detection and highlighting
   - Trend identification
   - Comparative benchmarking

### Integration with Other Systems

The metrics and analysis system integrates with other platform components:

1. **Analytics Domain**:
   - Sharing experiment results with the broader analytics system
   - Incorporating organizational KPIs into experiment analysis
   - Leveraging analytics infrastructure for computation
   - Contributing to organizational knowledge base

2. **Marketplace Integration**:
   - Anonymized performance benchmarks for marketplace listings
   - Evidence-based effectiveness ratings
   - Comparative analytics across organizations (privacy-preserving)
   - Best practice generation from aggregated results

3. **Machine Learning Integration**:
   - Predictive modeling based on experiment results
   - Automated segment discovery
   - Early outcome prediction
   - Intelligent experiment suggestion

## Integration with Other Domains

The experimentation framework is designed to integrate seamlessly with other domains in the ABCD Behavior Coach platform. This integration allows experiments to leverage capabilities from across the platform and ensures that experiment results drive improvements throughout the system.

### Content Management

The experimentation system integrates with the Content Management domain to enable testing of different content variations.

#### Integration Points

1. **Content Variant Creation**
   - Journey-level experiments need to create content variants
   - ContentEditor component is used within the experiment creation workflow
   - Content variants are stored in the Content Management system with experiment metadata
   - Media assets for variants are managed through the Content Management system

2. **Content Performance Metrics**
   - Content engagement metrics feed into experiment analysis
   - Content-specific metrics (e.g., video view completion rate) are accessible to experiments
   - Content interaction history provides baseline data for experiment design

3. **Template Integration**
   - WhatsApp message templates can be varied for testing
   - Template approval status is tracked within experiments
   - Template effectiveness metrics are captured for variants

4. **Content Implementation**
   - Winning content variants can be promoted to standard content
   - Content versioning tracks experiment-driven changes
   - Content library organizes original and variant content

#### Implementation Details

The key technical integrations between Experimentation and Content Management include:

```typescript
// In src/components/features/experiments/JourneyVariantEditor.tsx
import { ContentEditor } from '@/components/features/content/ContentEditor';
import { useContentApi } from '@/hooks/features/useContentApi';

function JourneyVariantEditor({ experimentId, touchpointId, originalContent }) {
  const { createContentVariant } = useContentApi();
  const [variantContent, setVariantContent] = useState(originalContent);
  
  // Integration with Content Editor component
  return (
    <div className="variant-editor">
      <h3>Create Content Variant</h3>
      
      <ContentEditor
        initialContent={originalContent}
        onChange={setVariantContent}
        experimentContext={{ experimentId, isVariant: true }}
      />
      
      <button 
        onClick={() => createContentVariant({
          originalContentId: originalContent.id,
          experimentId,
          touchpointId,
          content: variantContent
        })}
        className="btn-primary"
      >
        Save Variant
      </button>
    </div>
  );
}
```

When implementing winning content variants:

```typescript
// In src/components/features/experiments/ImplementWinnerAction.tsx
import { useContentApi } from '@/hooks/features/useContentApi';

function ImplementWinnerAction({ experiment, winningVariantId }) {
  const { implementContentVariant } = useContentApi();
  
  const handleImplement = async () => {
    // Promotes variant content to replace original
    await implementContentVariant({
      experimentId: experiment.id,
      variantId: winningVariantId,
      touchpointIds: experiment.touchpoints.map(t => t.id)
    });
  };
  
  return (
    <button onClick={handleImplement} className="btn-success">
      Implement Winning Content
    </button>
  );
}
```

### Journey Builder

The experimentation system integrates with the Journey Builder domain to enable testing at the Journey level and implementing winning variants.

#### Integration Points

1. **Journey Structure Access**
   - Experiment creation accesses Journey structure (phases, touchpoints)
   - Touchpoint selection interface embedded in experiment setup
   - Journey metadata available for experiment configuration

2. **Touchpoint Variant Management**
   - Touchpoint content variants linked to experiments
   - Variant display logic incorporated into Journey execution
   - Touchpoint performance metrics feed into experiment analysis

3. **Journey Implementation**
   - Winning variants can update Journey Blueprint touchpoints
   - Journey versioning tracks experiment-driven changes
   - Journey cloning for variant-specific Journeys (if needed)

4. **Experiment Visualization**
   - Journey visualization shows experiment touchpoints
   - Variant performance overlay on Journey map
   - Journey analytics includes experiment context

#### Implementation Details

Key technical integrations between Experimentation and Journey Builder include:

```typescript
// In src/components/features/experiments/JourneyExperimentSetup.tsx
import { JourneyStructureViewer } from '@/components/features/journeys/JourneyStructureViewer';
import { TouchpointSelector } from '@/components/features/journeys/TouchpointSelector';
import { useJourneysApi } from '@/hooks/features/useJourneysApi';

function JourneyExperimentSetup({ journeyId, onTouchpointsSelected }) {
  const { getJourneyStructure } = useJourneysApi();
  const { data: journey, isLoading } = useQuery(
    ['journey', journeyId],
    () => getJourneyStructure(journeyId)
  );
  
  const [selectedTouchpoints, setSelectedTouchpoints] = useState([]);
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="journey-experiment-setup">
      <h3>Select Touchpoints to Test</h3>
      
      <JourneyStructureViewer
        journey={journey}
        highlightTouchpoints={selectedTouchpoints}
      />
      
      <TouchpointSelector
        journey={journey}
        selected={selectedTouchpoints}
        onChange={(touchpoints) => {
          setSelectedTouchpoints(touchpoints);
          onTouchpointsSelected(touchpoints);
        }}
      />
    </div>
  );
}
```

For implementing winning variants:

```typescript
// In src/hooks/features/useJourneyExperiment.ts
import { useJourneysApi } from '@/hooks/features/useJourneysApi';
import { useExperimentResults } from '@/hooks/features/useExperimentResults';

export function useJourneyExperiment(experimentId) {
  const { updateJourneyTouchpoints } = useJourneysApi();
  const { getWinningVariant } = useExperimentResults(experimentId);
  
  const implementWinningVariant = async () => {
    const winningVariant = await getWinningVariant();
    
    if (winningVariant) {
      // Updates Journey Blueprint with winning content
      await updateJourneyTouchpoints({
        journeyId: experiment.journeyId,
        touchpointUpdates: winningVariant.content.map(c => ({
          touchpointId: c.touchpointId,
          contentId: c.contentId
        }))
      });
    }
  };
  
  return {
    implementWinningVariant
  };
}
```

### Program Implementation

The experimentation system integrates with the Program Implementation domain to enable testing of different program delivery strategies and implementing winning approaches.

#### Integration Points

1. **Program Configuration Access**
   - Experiment creation accesses Program settings
   - Implementation parameters available for experiment variation
   - Program metadata available for experiment configuration

2. **Program Variant Execution**
   - Program execution engine handles variant-specific rules
   - Worker assignment to variants affects program behavior
   - Program state tracking incorporates variant context

3. **Program Performance Metrics**
   - Program completion metrics feed into experiment analysis
   - Implementation-specific metrics captured for variants
   - Operational metrics provide comparison data

4. **Program Implementation**
   - Winning variants can update Program settings
   - Program templating for variant-specific configurations
   - Program cloning for testing without affecting production

#### Implementation Details

Key technical integrations between Experimentation and Program Implementation include:

```typescript
// In src/components/features/experiments/ProgramExperimentSetup.tsx
import { ProgramSettingsPanel } from '@/components/features/programs/ProgramSettingsPanel';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';

function ProgramExperimentSetup({ programId, onVariantConfigured }) {
  const { getProgramSettings } = useProgramsApi();
  const { data: baseSettings, isLoading } = useQuery(
    ['program-settings', programId],
    () => getProgramSettings(programId)
  );
  
  const [variantSettings, setVariantSettings] = useState({});
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="program-experiment-setup">
      <h3>Configure Program Variant</h3>
      
      <ProgramSettingsPanel
        baseSettings={baseSettings}
        onChange={setVariantSettings}
        experimentContext={{ isVariant: true }}
      />
      
      <button 
        onClick={() => onVariantConfigured(variantSettings)}
        disabled={Object.keys(variantSettings).length === 0}
        className="btn-primary"
      >
        Save Variant Configuration
      </button>
    </div>
  );
}
```

For implementing winning variants:

```typescript
// In src/hooks/features/useProgramExperiment.ts
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { useExperimentResults } from '@/hooks/features/useExperimentResults';

export function useProgramExperiment(experimentId) {
  const { updateProgramSettings } = useProgramsApi();
  const { getWinningVariant } = useExperimentResults(experimentId);
  
  const implementWinningVariant = async () => {
    const winningVariant = await getWinningVariant();
    
    if (winningVariant) {
      // Updates Program with winning implementation settings
      await updateProgramSettings({
        programId: experiment.programId,
        settings: winningVariant.settings
      });
    }
  };
  
  return {
    implementWinningVariant
  };
}
```

### Segmentation

The experimentation system integrates with the Segmentation domain to enable targeted experiment audience selection and segment-specific analysis.

#### Integration Points

1. **Audience Selection**
   - Segment selector component embedded in experiment setup
   - Segment size estimation for statistical validity
   - Segment overlap detection for experiment design

2. **Participant Assignment**
   - Segmentation engine identifies eligible workers
   - Cross-segment distribution ensures balanced testing
   - Segment changes during experiments are handled appropriately

3. **Segment-specific Analysis**
   - Results can be analyzed by segment
   - Segment-specific winning variants can be identified
   - Demographic analysis leverages segment data

4. **Experiment-based Segments**
   - Segments can be created based on experiment participation
   - Variant-specific segments for targeted follow-up
   - Performance-based segments from experiment results

#### Implementation Details

Key technical integrations between Experimentation and Segmentation include:

```typescript
// In src/components/features/experiments/AudienceSelectionStep.tsx
import { SegmentSelector } from '@/components/features/segments/SegmentSelector';
import { SegmentSizeEstimator } from '@/components/features/segments/SegmentSizeEstimator';
import { useSegmentsApi } from '@/hooks/features/useSegmentsApi';

function AudienceSelectionStep({ onAudienceSelected }) {
  const [selectedSegments, setSelectedSegments] = useState([]);
  const { estimateSize } = useSegmentsApi();
  
  const { data: audienceSize, isLoading } = useQuery(
    ['segment-size', selectedSegments],
    () => estimateSize(selectedSegments),
    { enabled: selectedSegments.length > 0 }
  );
  
  return (
    <div className="audience-selection">
      <h3>Select Target Audience</h3>
      
      <SegmentSelector
        selected={selectedSegments}
        onChange={setSelectedSegments}
        multiSelect
      />
      
      {selectedSegments.length > 0 && !isLoading && (
        <div className="audience-preview">
          <SegmentSizeEstimator size={audienceSize} />
          <SampleSizeCalculator currentSize={audienceSize} />
          
          <button
            onClick={() => onAudienceSelected({
              segments: selectedSegments,
              estimatedSize: audienceSize
            })}
            disabled={audienceSize < 30} // Minimum viable sample
            className="btn-primary"
          >
            Confirm Audience Selection
          </button>
        </div>
      )}
    </div>
  );
}
```

For segment-specific analysis:

```typescript
// In src/components/features/experiments/SegmentAnalysis.tsx
import { SegmentPerformanceChart } from '../analytics/SegmentPerformanceChart';
import { useExperimentResults } from '@/hooks/features/useExperimentResults';

function SegmentAnalysis({ experimentId }) {
  const { getSegmentResults } = useExperimentResults(experimentId);
  const { data, isLoading } = useQuery(
    ['experiment-segment-results', experimentId],
    () => getSegmentResults()
  );
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="segment-analysis">
      <h3>Performance by Segment</h3>
      
      <SegmentPerformanceChart data={data.segments} />
      
      <div className="segment-insights">
        {data.insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
```

### Marketplace

The experimentation system integrates with the Marketplace domain to enable sharing of proven experiments and validating the effectiveness of marketplace content.

#### Integration Points

1. **Evidence-based Listing**
   - Experiment results can validate marketplace listings
   - Effectiveness metrics can be included in listings
   - Comparative performance data can be shared (anonymized)

2. **Experiment Templates**
   - Successful experiments can be templated for marketplace sharing
   - Best practices from experiments can be documented
   - Experiment designs can be imported from marketplace

3. **Comparative Benchmarking**
   - Experiment results can be compared to marketplace benchmarks
   - Industry standards can be derived from aggregated experiments
   - Anonymized cross-organization insights are possible

4. **Expert Organization Tools**
   - Expert organizations can publish experiment findings
   - Methodological rigor can be highlighted
   - Proven variants can be packaged for distribution

#### Implementation Details

Key technical integrations between Experimentation and Marketplace include:

```typescript
// In src/components/features/experiments/PublishExperimentFindings.tsx
import { useMarketplaceApi } from '@/hooks/features/useMarketplaceApi';
import { useExperimentResults } from '@/hooks/features/useExperimentResults';

function PublishExperimentFindings({ experimentId }) {
  const { getDetailedResults } = useExperimentResults(experimentId);
  const { publishFindings } = useMarketplaceApi();
  
  const [publishConfig, setPublishConfig] = useState({
    anonymizeData: true,
    includeSegmentBreakdown: false,
    includeTechnicalDetails: true
  });
  
  const handlePublish = async () => {
    const results = await getDetailedResults();
    
    await publishFindings({
      experimentId,
      results,
      config: publishConfig
    });
  };
  
  return (
    <div className="publish-findings">
      <h3>Share Findings to Marketplace</h3>
      
      <PublishConfigForm
        value={publishConfig}
        onChange={setPublishConfig}
      />
      
      <button onClick={handlePublish} className="btn-primary">
        Publish Findings
      </button>
    </div>
  );
}
```

For incorporating marketplace benchmarks:

```typescript
// In src/components/features/experiments/MarketplaceBenchmarks.tsx
import { useMarketplaceApi } from '@/hooks/features/useMarketplaceApi';

function MarketplaceBenchmarks({ experimentType, metrics }) {
  const { getBenchmarks } = useMarketplaceApi();
  
  const { data, isLoading } = useQuery(
    ['marketplace-benchmarks', experimentType, metrics],
    () => getBenchmarks({ experimentType, metrics })
  );
  
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.benchmarks.length === 0) return null;
  
  return (
    <div className="marketplace-benchmarks">
      <h3>Industry Benchmarks</h3>
      
      <BenchmarkComparison
        benchmarks={data.benchmarks}
        currentMetrics={metrics}
      />
    </div>
  );
}
```

### Specialized Features

The experimentation system integrates with Specialized Features domains like Gamification and Wellbeing to enable specialized experiments and measurements.

#### Integration with Gamification

1. **Gamification as Experiment Variable**
   - Different gamification strategies can be tested
   - Badge/reward systems can be varied
   - Leaderboard visibility can be toggled

2. **Gamification Metrics**
   - Engagement with gamification features can be measured
   - Motivational impact can be quantified
   - Long-term effectiveness can be tracked

3. **Implementation Integration**
   - Winning gamification approaches can be implemented
   - Points systems can be calibrated based on experiments
   - Challenge difficulty can be optimized

#### Integration with Wellbeing

1. **Wellbeing Metrics**
   - Wellbeing indicators can be experiment outcomes
   - Stress reduction approaches can be tested
   - Resilience-building techniques can be compared

2. **Intervention Testing**
   - Different wellbeing interventions can be tested
   - Support mechanisms can be optimized
   - Early warning systems can be calibrated

3. **Personalization**
   - Segment-specific wellbeing approaches can be identified
   - Individual differences in response can be measured
   - Adaptive wellbeing systems can be developed

#### Implementation Details

Key technical integrations with Specialized Features include:

```typescript
// In src/components/features/experiments/GamificationExperimentVariant.tsx
import { GamificationSettingsEditor } from '@/components/features/gamification/GamificationSettingsEditor';
import { useGamificationApi } from '@/hooks/features/useGamificationApi';

function GamificationExperimentVariant({ experimentId, programId }) {
  const { getGamificationSettings } = useGamificationApi();
  const { data: baseSettings, isLoading } = useQuery(
    ['gamification-settings', programId],
    () => getGamificationSettings(programId)
  );
  
  const [variantSettings, setVariantSettings] = useState({});
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="gamification-variant">
      <h3>Configure Gamification Variant</h3>
      
      <GamificationSettingsEditor
        baseSettings={baseSettings}
        onChange={setVariantSettings}
      />
      
      {/* Variant creation controls */}
    </div>
  );
}
```

For wellbeing integration:

```typescript
// In src/components/features/experiments/WellbeingMetricsSelector.tsx
import { WellbeingIndicatorSelector } from '@/components/features/wellbeing/WellbeingIndicatorSelector';
import { useWellbeingApi } from '@/hooks/features/useWellbeingApi';

function WellbeingMetricsSelector({ onMetricsSelected }) {
  const { getAvailableIndicators } = useWellbeingApi();
  const { data: indicators, isLoading } = useQuery(
    'wellbeing-indicators',
    () => getAvailableIndicators()
  );
  
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div className="wellbeing-metrics">
      <h3>Select Wellbeing Metrics</h3>
      
      <WellbeingIndicatorSelector
        indicators={indicators}
        selected={selectedIndicators}
        onChange={setSelectedIndicators}
      />
      
      <button
        onClick={() => onMetricsSelected(selectedIndicators)}
        disabled={selectedIndicators.length === 0}
        className="btn-primary"
      >
        Use Selected Indicators
      </button>
    </div>
  );
}
```

## Best Practices

[Best Practices section to be expanded...]

### 4.5 Experiment Documentation

Thorough documentation is crucial for the long-term value of experimentation:

1. **Hypothesis Documentation**: Capture precise hypotheses before running experiments
   ```typescript
   // Example: Structured hypothesis form
   interface ExperimentHypothesis {
     statement: string;         // "Video tutorials will increase completion rates compared to text-only instructions"
     independent: string;       // "Content format (video vs. text)"
     dependent: string;         // "Touchpoint completion rate"
     expectedEffect: string;    // "Increase of at least 15%"
     rationale: string;         // "Based on previous feedback indicating preference for visual learning"
   }
   ```

2. **Decision Log**: Record key decisions made during the experiment
   ```typescript
   // Example: Decision log component
   function DecisionLogEntry({ experimentId, entry }) {
     return (
       <div className="decision-log-entry">
         <div className="entry-header">
           <span className="timestamp">{formatDate(entry.timestamp)}</span>
           <span className="author">{entry.author}</span>
         </div>
         <div className="decision">
           <strong>Decision:</strong> {entry.decision}
         </div>
         <div className="rationale">
           <strong>Rationale:</strong> {entry.rationale}
         </div>
       </div>
     );
   }
   ```

3. **Institutional Knowledge**: Create experiment summaries for institutional learning
   ```typescript
   // Example: Knowledge repository integration
   function saveExperimentLearnings(experimentId, learnings) {
     return knowledgeApi.create({
       source: { type: 'experiment', id: experimentId },
       title: learnings.title,
       summary: learnings.summary,
       keyInsights: learnings.insights,
       recommendations: learnings.recommendations,
       topics: learnings.tags
     });
   }
   ```

4. **Implementation Notes**: Document how winning variants were implemented
   ```typescript
   // Example: Implementation record
   interface ImplementationRecord {
     experimentId: string;
     variantId: string;
     implementationDate: string;
     affectedAreas: Array<{
       type: 'journey' | 'program' | 'content';
       id: string;
       name: string;
     }>;
     implementationNotes: string;
     verificationMethod: string;
   }
   ```

### 4.6 Ethical Considerations

Consider these ethical principles when designing and running experiments:

1. **Informed Participation**: Be transparent with workers about experimentation
   ```typescript
   // Example: Participant information component
   function ParticipationStatement({ experimentType }) {
     const statements = {
       journey: "We're testing different content formats to help you learn more effectively.",
       program: "We're trying different delivery schedules to find what works best for you."
     };
     
     return (
       <InfoAlert>
         {statements[experimentType] || "We're running tests to improve your experience."}
       </InfoAlert>
     );
   }
   ```

2. **Fair Treatment**: Avoid negative impacts on experiment participants
   ```typescript
   // Example: Risk assessment utility
   function assessExperimentRisks(experimentConfig) {
     const risks = [];
     
     // Check for potential negative outcomes
     if (hasReducedSupport(experimentConfig)) {
       risks.push({
         type: 'support_reduction',
         severity: 'high',
         mitigation: 'Add fallback support mechanism for all variants'
       });
     }
     
     // Additional checks for other risk types
     
     return {
       hasHighRisks: risks.some(r => r.severity === 'high'),
       risks,
       mitigationRequired: risks.length > 0
     };
   }
   ```

3. **Privacy Protection**: Safeguard participant data in experiment analysis
   ```typescript
   // Example: Privacy-preserving analytics
   function prepareExperimentDataForSharing(results) {
     return {
       ...results,
       segments: anonymizeSegmentData(results.segments),
       participants: summarizeParticipantData(results.participants),
       // Remove individual identifiers
       individualResponses: undefined
     };
   }
   ```

4. **Inclusive Design**: Ensure experiments account for diverse worker populations
   ```typescript
   // Example: Inclusivity check component
   function InclusivityCheck({ experimentConfig }) {
     const checks = [
       { 
         id: 'language',
         label: 'Content available in all worker languages',
         passed: hasAllLanguages(experimentConfig)
       },
       { 
         id: 'accessibility',
         label: 'All variants meet accessibility requirements',
         passed: meetsAccessibilityStandards(experimentConfig)
       },
       // Additional checks
     ];
     
     return (
       <div className="inclusivity-checklist">
         <h4>Inclusivity Check</h4>
         {checks.map(check => (
           <CheckItem 
             key={check.id}
             passed={check.passed}
             label={check.label}
           />
         ))}
       </div>
     );
   }
   ```

### 4.7 Scaling Experimentation

As your experimentation program matures, consider these practices for scale:

1. **Experimentation Roadmap**: Plan a coordinated series of experiments
   ```typescript
   // Example: Roadmap planning component
   function ExperimentRoadmap({ domainId, experimentType }) {
     const { data: plannedExperiments } = useExperimentRoadmap(domainId, experimentType);
     
     return (
       <div className="experiment-roadmap">
         <h3>Experiment Roadmap</h3>
         <Timeline>
           {plannedExperiments?.map(exp => (
             <TimelineItem
               key={exp.id}
               title={exp.name}
               date={exp.plannedStart}
               description={exp.hypothesis}
               status={exp.status}
             />
           ))}
         </Timeline>
         <button className="btn-secondary">
           Add Planned Experiment
         </button>
       </div>
     );
   }
   ```

2. **Multi-variate Testing**: Advance from A/B to multi-variate testing when appropriate
   ```typescript
   // Example: Multi-variate experiment configuration
   function configureMultivariateTest(factors) {
     // Generate all combinations of factor levels
     const variants = generateFactorialDesign(factors);
     
     // Estimate required sample size based on factors and levels
     const requiredSampleSize = calculateMultivariateRequiredSample(
       factors.length,
       factors.map(f => f.levels.length),
       0.05,  // significance level
       0.8    // power
     );
     
     return {
       variants,
       requiredSampleSize,
       // Recommend whether MVT is feasible with current audience
       isRecommended: currentAudienceSize >= requiredSampleSize
     };
   }
   ```

3. **Continuous Experimentation**: Embed experimentation in regular workflow
   ```typescript
   // Example: Auto-suggestion of experiment opportunities
   function ExperimentOpportunityNotification() {
     const { data: opportunities } = useExperimentOpportunities();
     
     if (!opportunities || opportunities.length === 0) return null;
     
     return (
       <NotificationPanel>
         {opportunities.map(opp => (
           <OpportunityCard 
             key={opp.id}
             title={opp.title}
             description={opp.description}
             impact={opp.estimatedImpact}
             effort={opp.estimatedEffort}
             onCreateExperiment={() => createFromOpportunity(opp.id)}
           />
         ))}
       </NotificationPanel>
     );
   }
   ```

4. **Experiment Governance**: Establish review processes for larger organizations
   ```typescript
   // Example: Experiment approval workflow
   function ExperimentApprovalWorkflow({ experimentId }) {
     const { requestApproval, approvalState } = useExperimentApprovals(experimentId);
     
     return (
       <div className="approval-workflow">
         <ApprovalStagesVisualizer 
           stages={[
             { id: 'draft', label: 'Draft', status: 'completed' },
             { id: 'submitted', label: 'Submitted', status: approvalState.submitted ? 'completed' : 'pending' },
             { id: 'reviewed', label: 'Reviewed', status: approvalState.reviewed ? 'completed' : 'pending' },
             { id: 'approved', label: 'Approved', status: approvalState.approved ? 'completed' : 'pending' }
           ]}
         />
         
         {!approvalState.submitted && (
           <button onClick={() => requestApproval()} className="btn-primary">
             Submit for Approval
           </button>
         )}
         
         {approvalState.comments.length > 0 && (
           <ApprovalComments comments={approvalState.comments} />
         )}
       </div>
     );
   }
   ```

### 4.8 Integration with Other Platform Features

Leverage connections between experimentation and other platform capabilities:

1. **Analytics Integration**: Connect experiments to broader analytics
   ```typescript
   // Example: Adding experiment context to analytics data
   function trackWithExperimentContext(event, properties) {
     const experimentAssignments = useExperimentAssignments();
     
     analytics.track(event, {
       ...properties,
       experiments: experimentAssignments.map(assignment => ({
         id: assignment.experimentId,
         variant: assignment.variantName
       }))
     });
   }
   ```

2. **Wellbeing Monitoring**: Ensure experiments don't negatively impact wellbeing
   ```typescript
   // Example: Wellbeing monitoring during experiments
   function WellbeingMonitoringDashboard({ experimentId }) {
     const { data: wellbeingTrends } = useExperimentWellbeingMetrics(experimentId);
     
     return (
       <div className="wellbeing-monitoring">
         <h3>Wellbeing Impact Monitoring</h3>
         
         <WellbeingTrendChart 
           data={wellbeingTrends}
           baseline={wellbeingTrends?.baseline}
           alertThreshold={wellbeingTrends?.alertThreshold}
         />
         
         {wellbeingTrends?.alerts.length > 0 && (
           <WellbeingAlerts alerts={wellbeingTrends.alerts} />
         )}
       </div>
     );
   }
   ```

3. **Gamification Experiments**: Test different incentive and reward approaches
   ```typescript
   // Example: Gamification variant configuration
   function GamificationVariantConfig({ onChange, currentConfig }) {
     return (
       <div className="gamification-experiment-config">
         <h3>Configure Gamification Variant</h3>
         
         <FormField label="Points per Completion">
           <Slider
             min={0}
             max={100}
             value={currentConfig.pointsPerCompletion || 10}
             onChange={value => onChange({
               ...currentConfig,
               pointsPerCompletion: value
             })}
           />
         </FormField>
         
         <FormField label="Badge Strategy">
           <Select
             options={[
               { value: 'milestone', label: 'Milestone Badges' },
               { value: 'achievement', label: 'Achievement Badges' },
               { value: 'surprise', label: 'Surprise Badges' }
             ]}
             value={currentConfig.badgeStrategy || 'milestone'}
             onChange={value => onChange({
               ...currentConfig,
               badgeStrategy: value
             })}
           />
         </FormField>
         
         <FormField label="Leaderboard Visibility">
           <Select
             options={[
               { value: 'none', label: 'No Leaderboard' },
               { value: 'self', label: 'Personal Ranking Only' },
               { value: 'team', label: 'Team Leaderboard' },
               { value: 'global', label: 'Global Leaderboard' }
             ]}
             value={currentConfig.leaderboardVisibility || 'none'}
             onChange={value => onChange({
               ...currentConfig,
               leaderboardVisibility: value
             })}
           />
         </FormField>
       </div>
     );
   }
   ```

4. **Projects & Funders Alignment**: Connect experiments to organizational goals
   ```typescript
   // Example: Project alignment component
   function ExperimentProjectAlignment({ experimentId, onAlignmentChange }) {
     const { data: projects } = useOrganizationProjects();
     const { data: experiment } = useExperiment(experimentId);
     
     return (
       <div className="project-alignment">
         <h3>Align with Organizational Projects</h3>
         
         <Select
           label="Related Project"
           options={projects?.map(p => ({ value: p.id, label: p.name }))}
           value={experiment?.projectId}
           onChange={projectId => onAlignmentChange({ projectId })}
         />
         
         {experiment?.projectId && (
           <>
             <ProjectGoalsAlignment 
               projectId={experiment.projectId}
               experimentId={experimentId}
             />
             
             <FunderReportingOptions 
               projectId={experiment.projectId}
               experimentId={experimentId}
             />
           </>
         )}
       </div>
     );
   }
   ```

## 12. Technical Implementation

This section details the technical implementation of the experimentation framework in the frontend, focusing on practical patterns, key considerations, and code examples.

### 12.1 State Management Architecture

The experimentation framework uses a tiered state management approach:

#### 12.1.1 API State with React Query

React Query provides the backbone for all experiment-related server state:

```typescript
// src/hooks/features/useExperiments.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { experimentsApi } from '@/lib/api/endpoints/experiments';
import { toast } from '@/components/ui/toast';

export function useExperiments(filters = {}) {
  return useQuery(['experiments', filters], () => experimentsApi.getExperiments(filters), {
    keepPreviousData: true,
    staleTime: 30000, // 30s cache before refetching
  });
}

export function useExperiment(id: string) {
  return useQuery(['experiment', id], () => experimentsApi.getExperiment(id), {
    enabled: !!id,
    // If experiment is running, poll every minute for updates
    refetchInterval: (data) => data?.status === 'running' ? 60000 : false,
  });
}

export function useCreateExperiment() {
  const queryClient = useQueryClient();
  
  return useMutation(experimentsApi.createExperiment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['experiments']);
      toast.success('Experiment created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create experiment: ${error.message}`);
    }
  });
}
```

#### 12.1.2 Local Form State with React Hook Form

Complex experiment setup forms use React Hook Form with Zod validation:

```typescript
// src/components/features/experiments/ExperimentForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const experimentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['journey', 'program']),
  hypothesis: z.string().min(10, 'Please enter a clear hypothesis'),
  targetId: z.string().uuid('Please select a valid target'),
  // Additional fields omitted for brevity
});

type ExperimentFormValues = z.infer<typeof experimentSchema>;

export function ExperimentForm({ onSubmit, initialData = {} }) {
  const {
    register,
    handleSubmit,
    control, // For controlled components
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ExperimentFormValues>({
    resolver: zodResolver(experimentSchema),
    defaultValues: initialData,
  });
  
  const selectedType = watch('type');
  
  // Form rendering logic with appropriate field components
}
```

#### 12.1.3 Complex UI State with Reducers

For complex UI state like multi-step wizards, useReducer provides more maintainable state transitions:

```typescript
// src/components/features/experiments/ExperimentWizard.tsx
import { useReducer } from 'react';

type WizardState = {
  currentStep: number;
  totalSteps: number;
  stepsCompleted: Record<number, boolean>;
  formData: {
    basicInfo?: BasicInfoData;
    variants?: VariantData[];
    audience?: AudienceData;
    metrics?: MetricsData;
  };
};

type WizardAction = 
  | { type: 'NEXT_STEP' } 
  | { type: 'PREV_STEP' } 
  | { type: 'GOTO_STEP'; payload: number }
  | { type: 'SET_STEP_DATA'; payload: { step: number; data: any } };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case 'GOTO_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'SET_STEP_DATA':
      return {
        ...state,
        stepsCompleted: {
          ...state.stepsCompleted,
          [action.payload.step]: true,
        },
        formData: {
          ...state.formData,
          ...action.payload.data,
        },
      };
    default:
      return state;
  }
}

export function ExperimentWizard() {
  const [state, dispatch] = useReducer(wizardReducer, {
    currentStep: 1,
    totalSteps: 4,
    stepsCompleted: {},
    formData: {},
  });
  
  // Wizard steps rendering based on state.currentStep
}
```

#### 12.1.4 Context for Shared Experiment Data

For complex experiment details pages, React Context provides efficient access to experiment data:

```typescript
// src/contexts/ExperimentContext.tsx
import { createContext, useContext, useMemo } from 'react';
import { useExperiment } from '@/hooks/features/useExperiments';

interface ExperimentContextType {
  experiment: Experiment | null;
  isLoading: boolean;
  error: Error | null;
  // Helper derived data
  isRunning: boolean;
  isPaused: boolean;
  hasResults: boolean;
}

const ExperimentContext = createContext<ExperimentContextType | null>(null);

export function ExperimentProvider({ 
  experimentId, 
  children 
}: { 
  experimentId: string; 
  children: React.ReactNode;
}) {
  const { data: experiment, isLoading, error } = useExperiment(experimentId);
  
  const value = useMemo(() => ({
    experiment,
    isLoading,
    error,
    isRunning: experiment?.status === 'running',
    isPaused: experiment?.status === 'paused',
    hasResults: experiment?.status === 'concluded' || experiment?.status === 'implemented',
  }), [experiment, isLoading, error]);
  
  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperimentContext() {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperimentContext must be used within an ExperimentProvider');
  }
  return context;
}
```

### 12.2 Data Fetching & Caching Strategies

#### 12.2.1 Optimized Query Keys

Structuring query keys properly enables efficient cache invalidation:

```typescript
// Key structures for experiment data
const experimentListKey = (filters) => ['experiments', filters];
const experimentDetailKey = (id) => ['experiment', id];
const experimentResultsKey = (id) => ['experiment', id, 'results'];
const experimentVariantsKey = (id) => ['experiment', id, 'variants'];
const experimentAudienceKey = (id) => ['experiment', id, 'audience'];
```

#### 12.2.2 Prefetching for User Experience

Prefetching experiment details when hovering over list items improves perceived performance:

```typescript
// src/components/features/experiments/ExperimentCard.tsx
import { useQueryClient } from 'react-query';
import { experimentsApi } from '@/lib/api/endpoints/experiments';

export function ExperimentCard({ experiment }) {
  const queryClient = useQueryClient();
  
  const prefetchExperimentDetails = () => {
    queryClient.prefetchQuery(
      ['experiment', experiment.id],
      () => experimentsApi.getExperiment(experiment.id)
    );
  };
  
  return (
    <div 
      className="experiment-card"
      onMouseEnter={prefetchExperimentDetails}
    >
      {/* Card content */}
    </div>
  );
}
```

#### 12.2.3 Infinite Query for Large Result Sets

For experiment history or logs, infinite queries provide better performance:

```typescript
// src/hooks/features/useExperimentLogs.ts
import { useInfiniteQuery } from 'react-query';
import { experimentsApi } from '@/lib/api/endpoints/experiments';

export function useExperimentLogs(experimentId: string) {
  return useInfiniteQuery(
    ['experiment', experimentId, 'logs'],
    ({ pageParam = 1 }) => experimentsApi.getExperimentLogs(experimentId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined;
      },
      enabled: !!experimentId,
    }
  );
}
```

#### 12.2.4 Optimistic Updates

Optimistic updates provide instant feedback for experiment actions:

```typescript
// src/hooks/features/useExperimentActions.ts
import { useMutation, useQueryClient } from 'react-query';
import { experimentsApi } from '@/lib/api/endpoints/experiments';

export function useExperimentActions(experimentId: string) {
  const queryClient = useQueryClient();
  
  const startExperiment = useMutation(
    () => experimentsApi.startExperiment(experimentId),
    {
      // Update experiment status immediately in the cache
      onMutate: async () => {
        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries(['experiment', experimentId]);
        
        // Snapshot the previous value
        const previousExperiment = queryClient.getQueryData(['experiment', experimentId]);
        
        // Optimistically update to the new value
        queryClient.setQueryData(['experiment', experimentId], (old: any) => ({
          ...old,
          status: 'running',
          startDate: new Date().toISOString(),
        }));
        
        // Return a context object with the snapshot
        return { previousExperiment };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, variables, context) => {
        queryClient.setQueryData(
          ['experiment', experimentId],
          context?.previousExperiment
        );
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.invalidateQueries(['experiment', experimentId]);
      },
    }
  );
  
  // Similar mutations for pause, resume, conclude, etc.
  
  return {
    startExperiment,
    // Other actions
  };
}
```

### 12.3 Component Implementation Strategies

#### 12.3.1 Lazy Loading Experiment Components

Use dynamic imports for less frequently accessed experiment components:

```typescript
// src/app/(app)/experiments/page.tsx
import dynamic from 'next/dynamic';

// Statically import frequently used components
import { ExperimentList } from '@/components/features/experiments/ExperimentList';

// Lazily load less frequently used components
const ExperimentCreationWizard = dynamic(
  () => import('@/components/features/experiments/ExperimentCreationWizard'),
  { 
    loading: () => <ExperimentWizardSkeleton />,
    ssr: false // If the component uses browser-only APIs
  }
);

export default function ExperimentsPage() {
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <div className="experiments-page">
      <PageHeader 
        title="Experiments" 
        actions={
          <Button onClick={() => setIsCreating(true)}>
            Create Experiment
          </Button>
        }
      />
      
      {isCreating ? (
        <ExperimentCreationWizard 
          onComplete={() => setIsCreating(false)}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <ExperimentList />
      )}
    </div>
  );
}
```

#### 12.3.2 Results Visualization Performance

For complex results visualization, use memoization and virtualized lists:

```typescript
// src/components/features/experiments/ExperimentResultsTable.tsx
import { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { useExperimentResults } from '@/hooks/features/useExperimentResults';

export function ExperimentResultsTable({ experimentId }) {
  const { data, isLoading } = useExperimentResults(experimentId);
  
  // Memoize processed results to avoid recalculations on re-render
  const processedResults = useMemo(() => {
    if (!data) return [];
    
    return data.variants.map(variant => ({
      id: variant.id,
      name: variant.name,
      isControl: variant.isControl,
      primaryMetric: variant.metrics.primary?.value || 0,
      improvement: variant.metrics.primary?.improvement || 0,
      isWinner: variant.isWinner,
      // Other metrics processing...
    }));
  }, [data]);
  
  if (isLoading) return <LoadingSkeleton />;
  
  // Virtualized list for potentially large result sets
  return (
    <div className="results-table-container">
      <FixedSizeList
        height={500}
        width="100%"
        itemCount={processedResults.length}
        itemSize={60}
      >
        {({ index, style }) => (
          <ResultRow 
            result={processedResults[index]} 
            style={style}
          />
        )}
      </FixedSizeList>
    </div>
  );
}
```

#### 12.3.3 Chart Rendering Optimization

For chart components, use resizing observers and debounced rendering:

```typescript
// src/components/features/experiments/ResultsChart.tsx
import { useRef, useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { debounce } from '@/lib/utils/debounce';

export function ResultsChart({ data }) {
  const chartRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  // Setup chart on initial render
  useEffect(() => {
    if (!canvasRef.current) return;
    
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // Additional chart configuration
      }
    });
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);
  
  // Update chart data when it changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    chartRef.current.data.labels = data.labels;
    chartRef.current.data.datasets = data.datasets;
    chartRef.current.update();
  }, [data]);
  
  // Handle container resizing
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const container = canvasRef.current.parentElement;
    if (!container) return;
    
    const resizeObserver = new ResizeObserver(
      debounce((entries) => {
        const { width } = entries[0].contentRect;
        setContainerWidth(width);
        if (chartRef.current) {
          chartRef.current.resize();
        }
      }, 100)
    );
    
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  return (
    <div className="chart-container" style={{ height: '400px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
```

### 12.4 Error Handling Patterns

#### 12.4.1 Component-Level Error Boundaries

Use error boundaries to isolate failures in experiment components:

```typescript
// src/components/features/experiments/ExperimentErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ExperimentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Experiment component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="experiment-error">
          <h3>Something went wrong in the experiment component.</h3>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="btn-secondary"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### 12.4.2 Result-Specific Error States

Implement specialized error handling for experiment results:

```typescript
// src/components/features/experiments/ResultsErrorHandler.tsx
import { useExperimentContext } from '@/contexts/ExperimentContext';

export function ResultsErrorHandler({ children }) {
  const { experiment, error } = useExperimentContext();
  
  if (error) {
    return (
      <div className="results-error">
        <h3>Error loading experiment results</h3>
        <p>{error.message}</p>
        {/* Provide potential recovery actions based on error type */}
        {error.code === 'INSUFFICIENT_DATA' && (
          <div className="error-action">
            <p>The experiment doesn't have enough data for meaningful results yet.</p>
            <button className="btn-primary">Extend Experiment Duration</button>
          </div>
        )}
      </div>
    );
  }
  
  if (experiment?.status === 'draft' || experiment?.status === 'ready') {
    return (
      <div className="results-pending">
        <h3>Experiment hasn't started yet</h3>
        <p>Results will be available once the experiment is running.</p>
      </div>
    );
  }
  
  return children;
}
```

#### 12.4.3 API Error Mapping

Map API error codes to user-friendly messages:

```typescript
// src/lib/utils/experimentErrorMapper.ts
const ERROR_MESSAGES = {
  // Generic errors
  'NETWORK_ERROR': 'Network connection issue. Please check your internet connection.',
  
  // Experiment-specific errors
  'EXPERIMENT_NOT_FOUND': 'The requested experiment could not be found.',
  'INSUFFICIENT_PERMISSIONS': 'You don\'t have permission to perform this action.',
  'INVALID_STATE_TRANSITION': 'The experiment cannot be changed to the requested state.',
  'EXPERIMENT_CONFLICT': 'This experiment conflicts with another active experiment.',
  'INSUFFICIENT_AUDIENCE': 'The selected audience is too small for this experiment.',
  'INVALID_VARIANT_CONFIG': 'One or more variant configurations are invalid.',
  
  // Default fallback
  'DEFAULT': 'An unexpected error occurred. Please try again or contact support.'
};

export function mapExperimentError(error: any): string {
  // Extract error code from response if available
  const errorCode = error?.response?.data?.code || 'DEFAULT';
  
  // Return mapped message or fallback to the error message itself
  return ERROR_MESSAGES[errorCode] || error.message || ERROR_MESSAGES.DEFAULT;
}
```

### 12.5 Mobile & WhatsApp Optimization

#### 12.5.1 Responsive Experiment Interface

Implement responsive layouts for mobile access:

```typescript
// src/components/features/experiments/ExperimentDetailResponsive.tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ExperimentDetailResponsive({ experimentId }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="experiment-detail">
      {isMobile ? (
        <MobileExperimentView experimentId={experimentId} />
      ) : (
        <DesktopExperimentView experimentId={experimentId} />
      )}
    </div>
  );
}

function MobileExperimentView({ experimentId }) {
  // Mobile-optimized tabs with simplified content
  return (
    <div className="mobile-experiment-view">
      <ExperimentHeader compact />
      
      <Accordion>
        <AccordionItem title="Overview">
          <ExperimentOverview compact />
        </AccordionItem>
        <AccordionItem title="Results">
          <ExperimentResults simplified />
        </AccordionItem>
        {/* Other sections */}
      </Accordion>
    </div>
  );
}

function DesktopExperimentView({ experimentId }) {
  // Full desktop layout with side-by-side panels
  return (
    <div className="desktop-experiment-view">
      <ExperimentHeader />
      
      <div className="experiment-content">
        <Tabs>
          <TabPane tab="Overview">
            <ExperimentOverview />
          </TabPane>
          <TabPane tab="Results">
            <ExperimentResults />
          </TabPane>
          {/* Other tabs */}
        </Tabs>
      </div>
    </div>
  );
}
```

#### 12.5.2 WhatsApp Preview Components

Create specialized preview components for WhatsApp content:

```typescript
// src/components/features/experiments/WhatsAppPreview.tsx
export function WhatsAppPreview({ message, variant }) {
  return (
    <div className="whatsapp-preview">
      <div className="whatsapp-header">
        <div className="whatsapp-avatar" />
        <div className="whatsapp-info">
          <span className="whatsapp-name">ABCD Coach</span>
          <span className="whatsapp-status">WhatsApp Business</span>
        </div>
      </div>
      
      <div className="whatsapp-chat">
        <div className="whatsapp-message">
          <div className="whatsapp-bubble">
            {message.type === 'text' && (
              <div className="whatsapp-text">{message.content}</div>
            )}
            
            {message.type === 'image' && (
              <div className="whatsapp-media">
                <img src={message.url} alt="Message image" />
                {message.caption && (
                  <div className="whatsapp-caption">{message.caption}</div>
                )}
              </div>
            )}
            
            {/* Other message types */}
          </div>
          <span className="whatsapp-time">10:45 AM</span>
        </div>
      </div>
      
      <div className="variant-label">
        {variant === 'control' ? 'Control Variant' : `Variant ${variant}`}
      </div>
    </div>
  );
}
```

#### 12.5.3 Mobile-Specific Performance Optimizations

Implement performance optimizations specifically for mobile:

```typescript
// src/components/features/experiments/MobileOptimizedResults.tsx
import { useState } from 'react';
import { 
  ExperimentSummaryCard,
  WinnerBadge,
  SimpleMetricDisplay
} from '@/components/features/experiments/mobile';

export function MobileOptimizedResults({ results }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Only show basic metrics on initial load for better mobile performance
  const metrics = showDetails 
    ? results.allMetrics 
    : results.metrics.slice(0, 3);
  
  return (
    <div className="mobile-results">
      {/* Fixed header with winner summary */}
      <ExperimentSummaryCard
        winner={results.winner}
        improvement={results.improvement}
        confidence={results.confidence}
      />
      
      {/* Simple list of metrics */}
      <div className="metrics-list">
        {metrics.map(metric => (
          <SimpleMetricDisplay
            key={metric.id}
            name={metric.name}
            value={metric.value}
            change={metric.change}
          />
        ))}
      </div>
      
      {!showDetails && results.metrics.length > 3 && (
        <button 
          className="load-more"
          onClick={() => setShowDetails(true)}
        >
          Show All Metrics
        </button>
      )}
      
      {/* Simplified actions */}
      <div className="mobile-actions">
        <button className="btn-primary">Implement Winner</button>
        <button className="btn-secondary">Share Results</button>
      </div>
    </div>
  );
}
```

### 12.6 Testing Strategy for Experimentation Components

#### 12.6.1 Unit Testing Experiment Hooks

Test custom hooks with React Testing Library:

```typescript
// src/hooks/features/useExperiments.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useExperiments, useExperiment } from './useExperiments';
import { experimentsApi } from '@/lib/api/endpoints/experiments';

// Mock the API module
jest.mock('@/lib/api/endpoints/experiments');

describe('useExperiments hook', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Mock implementation
    (experimentsApi.getExperiments as jest.Mock).mockResolvedValue({
      items: [
        { id: '1', name: 'Test Experiment 1', status: 'running' },
        { id: '2', name: 'Test Experiment 2', status: 'draft' },
      ],
      meta: { totalItems: 2, totalPages: 1, currentPage: 1 }
    });
  });
  
  it('should fetch experiments with provided filters', async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    
    const filters = { status: 'running' };
    
    const { result, waitFor } = renderHook(() => useExperiments(filters), { wrapper });
    
    // Initially in loading state
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve
    await waitFor(() => !result.current.isLoading);
    
    // Verify data is returned
    expect(result.current.data.items).toHaveLength(2);
    
    // Verify API was called with correct filters
    expect(experimentsApi.getExperiments).toHaveBeenCalledWith(filters);
  });
  
  // Additional tests for other hooks...
});
```

#### 12.6.2 Integration Testing Experiment Components

Test components with mocked API responses:

```typescript
// src/components/features/experiments/ExperimentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ExperimentList } from './ExperimentList';
import { experimentsApi } from '@/lib/api/endpoints/experiments';

jest.mock('@/lib/api/endpoints/experiments');

describe('ExperimentList component', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Mock API response
    (experimentsApi.getExperiments as jest.Mock).mockResolvedValue({
      items: [
        { id: '1', name: 'Test Experiment 1', status: 'running', type: 'journey' },
        { id: '2', name: 'Test Experiment 2', status: 'draft', type: 'program' },
      ],
      meta: { totalItems: 2, totalPages: 1, currentPage: 1 }
    });
  });
  
  test('renders experiment list with correct items', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExperimentList />
      </QueryClientProvider>
    );
    
    // Check loading state
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
    
    // Check that experiments are rendered
    expect(screen.getByText('Test Experiment 1')).toBeInTheDocument();
    expect(screen.getByText('Test Experiment 2')).toBeInTheDocument();
    
    // Check status badges
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
  
  test('filters experiments when filter is changed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExperimentList />
      </QueryClientProvider>
    );
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
    
    // Setup mock for filtered response
    (experimentsApi.getExperiments as jest.Mock).mockResolvedValue({
      items: [
        { id: '1', name: 'Test Experiment 1', status: 'running', type: 'journey' },
      ],
      meta: { totalItems: 1, totalPages: 1, currentPage: 1 }
    });
    
    // Use filter
    const filterSelect = screen.getByLabelText('Status');
    userEvent.selectOptions(filterSelect, 'running');
    
    // Verify API called with correct filters
    await waitFor(() => {
      expect(experimentsApi.getExperiments).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'running' })
      );
    });
  });
  
  // Additional tests...
});
```

#### 12.6.3 Visual Regression Testing

Set up visual regression tests for experiment components:

```typescript
// src/components/features/experiments/ExperimentResults.visual.test.tsx
import { render } from '@testing-library/react';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer from 'puppeteer';
import { ExperimentResults } from './ExperimentResults';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: { threshold: 0.1 },
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
});

expect.extend({ toMatchImageSnapshot });

describe('ExperimentResults visual regression', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  test('renders results visualizations correctly', async () => {
    // Mock results data
    const mockResults = {
      variants: [
        { name: 'Control', primaryMetric: 0.42, isWinner: false },
        { name: 'Variant A', primaryMetric: 0.53, isWinner: true },
      ],
      significanceLevel: 0.95,
      // Additional data...
    };
    
    // Load component in Puppeteer
    await page.goto(`http://localhost:3000/visual-test?component=ExperimentResults`);
    
    // Set component props
    await page.evaluate((data) => {
      window.setComponentProps(data);
    }, mockResults);
    
    // Wait for rendering to complete
    await page.waitForSelector('.results-visualization');
    
    // Take screenshot
    const screenshot = await page.screenshot();
    
    // Compare to baseline
    expect(screenshot).toMatchImageSnapshot();
  });
  
  // Additional visual tests for different states
  test('renders mobile view correctly', async () => {
    // Set viewport to mobile size
    await page.setViewport({ width: 375, height: 667 });
    
    // Similar test logic...
  });
});
```

#### 12.6.4 User Flow Testing

Use Cypress to test complete experiment user flows:

```typescript
// cypress/integration/experiments/create_experiment.spec.ts
describe('Experiment Creation Flow', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/v1/journeys', { fixture: 'journeys.json' });
    cy.intercept('GET', '/api/v1/segments', { fixture: 'segments.json' });
    cy.intercept('POST', '/api/v1/experiments', (req) => {
      // Validate request payload
      expect(req.body).to.have.property('name');
      expect(req.body).to.have.property('type');
      expect(req.body).to.have.property('hypothesis');
      
      // Return mock response
      req.reply({
        statusCode: 201,
        body: {
          id: 'new-exp-123',
          name: req.body.name,
          status: 'draft',
          // Additional response fields...
        }
      });
    }).as('createExperiment');
    
    // Login and navigate to experiments page
    cy.login('program_manager@example.com', 'password');
    cy.visit('/experiments');
  });
  
  it('completes journey experiment creation workflow', () => {
    // Click create button
    cy.contains('button', 'Create Experiment').click();
    
    // Step 1: Basic Info
    cy.contains('h2', 'Basic Information').should('be.visible');
    cy.get('input[name="name"]').type('Test Journey Experiment');
    cy.get('textarea[name="hypothesis"]').type('Video content will increase completion rates by 20%');
    cy.get('[data-testid="experiment-type-journey"]').click();
    cy.get('button').contains('Select Journey').click();
    cy.get('[data-testid="journey-option-123"]').click();
    cy.contains('button', 'Next').click();
    
    // Step 2: Variants
    cy.contains('h2', 'Define Variants').should('be.visible');
    // Select touchpoints
    cy.get('[data-testid="touchpoint-checkbox-1"]').click();
    cy.get('[data-testid="touchpoint-checkbox-3"]').click();
    
    // Create variant
    cy.contains('button', 'Create Variant').click();
    cy.get('input[name="variant-name"]').type('Video Variant');
    // Configure content for each touchpoint
    cy.get('[data-testid="touchpoint-1-editor"]').within(() => {
      cy.get('select').select('video');
      cy.get('input[type="file"]').attachFile('test-video.mp4');
      cy.get('input[name="caption"]').type('Instructional Video');
    });
    cy.get('[data-testid="touchpoint-3-editor"]').within(() => {
      // Configure another touchpoint
    });
    cy.contains('button', 'Save Variant').click();
    cy.contains('button', 'Next').click();
    
    // Step 3: Audience
    cy.contains('h2', 'Select Audience').should('be.visible');
    cy.get('[data-testid="segment-checkbox-1"]').click();
    cy.contains('button', 'Next').click();
    
    // Step 4: Metrics
    cy.contains('h2', 'Configure Metrics').should('be.visible');
    cy.get('select[name="primaryMetric"]').select('completion_rate');
    cy.contains('button', 'Review').click();
    
    // Review and Create
    cy.contains('h2', 'Review Experiment').should('be.visible');
    cy.contains('button', 'Create Experiment').click();
    
    // Verify API call
    cy.wait('@createExperiment');
    
    // Verify redirect to experiment detail
    cy.url().should('include', '/experiments/new-exp-123');
  });
});
```

### 12.7 Performance Optimization Techniques

#### 12.7.1 Component Memoization

Memoize expensive components:

```typescript
import { memo } from 'react';

// Memoize a complex chart component to prevent unnecessary re-renders
export const ExperimentVariantChart = memo(function ExperimentVariantChart({
  data,
  height,
  width,
}: ExperimentVariantChartProps) {
  // Complex chart rendering logic
  return (
    // Chart implementation
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for deep equality check of chart data
  return (
    prevProps.height === nextProps.height &&
    prevProps.width === nextProps.width &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});
```

#### 12.7.2 Windowing for Long Lists

Use windowing for long experiment history lists:

```typescript
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export function ExperimentHistoryList({ items }) {
  return (
    <div className="history-list" style={{ height: '500px' }}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={items.length}
            itemSize={60}
          >
            {({ index, style }) => (
              <div style={style}>
                <HistoryItem 
                  item={items[index]} 
                  isEven={index % 2 === 0} 
                />
              </div>
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}
```

#### 12.7.3 Web Workers for Statistical Calculations

Offload complex statistical calculations to web workers:

```typescript
// src/workers/statistics.worker.ts
// This file will be processed by worker-loader or similar
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch(type) {
    case 'CALCULATE_SIGNIFICANCE':
      const result = calculateStatisticalSignificance(data);
      self.postMessage({ type: 'SIGNIFICANCE_RESULT', result });
      break;
    case 'SIMULATE_EXPERIMENT':
      const simulation = runMonteCarloSimulation(data);
      self.postMessage({ type: 'SIMULATION_RESULT', simulation });
      break;
    // Other calculation types
  }
};

function calculateStatisticalSignificance(data) {
  // Computationally intensive statistical calculations
  // t-tests, chi-square tests, etc.
  return {
    pValue: /* calculated p-value */,
    confidenceInterval: /* calculated CI */,
    // Other results
  };
}

function runMonteCarloSimulation(data) {
  // Run thousands of simulations to estimate outcomes
  // Potentially very CPU intensive
  return {
    projectedOutcome: /* simulation results */,
    confidenceBounds: /* confidence bounds */,
    // Other results
  };
}

// In the React component:
// src/hooks/useStatisticalWorker.ts
import { useState, useEffect } from 'react';
// @ts-ignore - Add proper typing for worker
import StatisticsWorker from '../workers/statistics.worker?worker';

export function useStatisticalWorker() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Initialize worker
  useEffect(() => {
    const w = new StatisticsWorker();
    
    w.onmessage = (e) => {
      const { type, result } = e.data;
      
      if (type === 'SIGNIFICANCE_RESULT' || type === 'SIMULATION_RESULT') {
        setResults(result);
        setIsCalculating(false);
      }
    };
    
    setWorker(w);
    
    return () => {
      w.terminate();
    };
  }, []);
  
  const calculateSignificance = (data) => {
    if (!worker) return;
    
    setIsCalculating(true);
    setResults(null);
    
    worker.postMessage({
      type: 'CALCULATE_SIGNIFICANCE',
      data
    });
  };
  
  const runSimulation = (data) => {
    if (!worker) return;
    
    setIsCalculating(true);
    setResults(null);
    
    worker.postMessage({
      type: 'SIMULATE_EXPERIMENT',
      data
    });
  };
  
  return {
    calculateSignificance,
    runSimulation,
    results,
    isCalculating,
  };
}
```

#### 12.7.4 Serialized Form State

For complex experiment creator forms, serialize state to enable restoration:

```typescript
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function ExperimentFormWithPersistence({ onSubmit, formKey = 'experiment' }) {
  const { register, handleSubmit, watch, setValue, formState } = useForm();
  
  // Watch all form values for changes
  const formValues = watch();
  
  // Save form state to localStorage when it changes
  useEffect(() => {
    const save = () => {
      localStorage.setItem(
        `experiment_draft_${formKey}`,
        JSON.stringify(formValues)
      );
    };
    
    // Debounce to avoid too many writes
    const timeoutId = setTimeout(save, 500);
    return () => clearTimeout(timeoutId);
  }, [formValues, formKey]);
  
  // Load saved form state on initialization
  useEffect(() => {
    const savedState = localStorage.getItem(`experiment_draft_${formKey}`);
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // Set each field individually to work with react-hook-form
        Object.entries(parsedState).forEach(([field, value]) => {
          setValue(field, value);
        });
      } catch (err) {
        console.error('Error restoring form state:', err);
      }
    }
  }, [formKey, setValue]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

This comprehensive technical implementation section provides a detailed explanation of how the experimentation framework is implemented in the frontend, focusing on practical patterns, key considerations, and providing clear code examples that address common challenges in experiment creation, monitoring, results analysis, and implementation. These implementation details follow the development patterns defined in the project requirements and ensure the experimentation system is robust, performant, and maintainable.
