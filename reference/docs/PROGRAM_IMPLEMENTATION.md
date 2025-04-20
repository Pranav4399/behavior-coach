# Program Implementation Guide

## Table of Contents

1. [Introduction](#introduction)
   - [Purpose of Programs](#purpose-of-programs)
   - [Program Life Cycle](#program-life-cycle)
   - [Relationship to Other Platform Components](#relationship-to-other-platform-components)

2. [Program Architecture & Core Concepts](#program-architecture--core-concepts)
   - [Program Data Model](#program-data-model)
   - [Program States](#program-states)
   - [Program-Worker Assignment](#program-worker-assignment)
   - [Worker Progress Tracking](#worker-progress-tracking)

3. [Program Management Workflow](#program-management-workflow)
   - [Creating Programs](#creating-programs)
   - [Configuring Programs](#configuring-programs)
   - [Deploying Programs](#deploying-programs)
   - [Monitoring Program Execution](#monitoring-program-execution)
   - [Adjusting Programs](#adjusting-programs)
   - [Analyzing Program Outcomes](#analyzing-program-outcomes)

4. [Program UI Implementation](#program-ui-implementation)
   - [Program Listing Page](#program-listing-page)
   - [Program Creation Wizard](#program-creation-wizard)
   - [Program Detail Dashboard](#program-detail-dashboard)
   - [Program Settings Pages](#program-settings-pages)
   - [Program-Worker Progress View](#program-worker-progress-view)
   - [Program Analytics Dashboard](#program-analytics-dashboard)

5. [API Integration](#api-integration)
   - [Program Endpoints](#program-endpoints)
   - [Error Handling](#error-handling)
   - [Performance Considerations](#performance-considerations)

6. [Advanced Program Features](#advanced-program-features)
   - [Follow-up Rules Configuration](#follow-up-rules-configuration)
   - [Conflict Resolution Strategies](#conflict-resolution-strategies)
   - [Program Feedback Management](#program-feedback-management)
   - [Program Experiments](#program-experiments)
   - [Integration with Projects & Funders](#integration-with-projects--funders)

7. [Best Practices & Guidelines](#best-practices--guidelines)
   - [Program Design Principles](#program-design-principles)
   - [Performance Optimization](#performance-optimization)
   - [Accessibility Considerations](#accessibility-considerations)
   - [Testing Strategy](#testing-strategy)

## Introduction

Programs are a central operational entity within the Behavioral Coaching Platform that bridge the gap between abstract Journey Blueprints and real-world behavioral coaching interventions. While Journey Blueprints define the structure, content, and logic of a coaching intervention, Programs are the actual instances that deploy these blueprints to specific worker audiences, with defined schedules, operational parameters, and monitoring capabilities.

### Purpose of Programs

Programs serve several critical purposes within the platform:

1. **Operational Execution**: Programs transform theoretical Journey Blueprints into practical, scheduled coaching interventions that can be deployed to workers.

2. **Audience Targeting**: Programs connect Journey Blueprints to specific worker segments, allowing organizations to target interventions to the right audiences based on role, location, performance, or other segmentation criteria.

3. **Temporal Management**: Programs manage the scheduling aspects of coaching interventions, including start dates, end dates, pacing, and delivery windows.

4. **Progress Tracking**: Programs track individual worker progress through journeys, including touchpoint completion, quiz results, feedback, and overall engagement.

5. **Impact Measurement**: Programs gather and aggregate data on intervention effectiveness, enabling organizations to measure behavioral changes, knowledge acquisition, and other key performance indicators.

6. **Operational Control**: Programs provide mechanisms for controlling intervention execution, such as pausing, resuming, or prematurely ending programs as organizational needs change.

7. **Resource Optimization**: Programs help organizations manage messaging quotas, content delivery, and other resources to maximize impact while operating within platform constraints.

Programs are primarily managed by Program Managers within Client Organizations, though they may be configured based on Journey Blueprints created by Training Managers or Content Specialists, potentially including content sourced from Expert Organizations via the Marketplace.

### Program Life Cycle

A Program typically progresses through the following stages in its lifecycle:

1. **Creation**: A Program Manager selects one or more Journey Blueprints to deploy, assigns target segments or individual workers, and configures initial program parameters.

2. **Configuration**: The Program is fully configured with scheduling information, delivery parameters, follow-up rules, conflict resolution strategies, and other operational settings.

3. **Scheduled**: The Program is scheduled for future deployment, waiting for its start date to begin worker enrollment and touchpoint delivery.

4. **Active**: The Program is actively sending touchpoints to enrolled workers based on journey progression rules, collecting responses, and tracking progress.

5. **Paused** (Optional): The Program may be temporarily halted, suspending new touchpoint delivery while maintaining worker state and progress data.

6. **Resumed** (Optional): A paused Program may be resumed, continuing touchpoint delivery from where workers left off.

7. **Completed**: The Program reaches its scheduled end date or all enrolled workers complete their journeys.

8. **Terminated** (Optional): The Program is manually ended before its scheduled completion, typically due to changing priorities or effectiveness issues.

9. **Archived**: After completion or termination, the Program transitions to an archived state where it's no longer active but its data remains available for analysis and reporting.

Throughout this lifecycle, the Program maintains state information about each enrolled worker's progress, collects response data, and provides analytics on overall effectiveness.

### Relationship to Other Platform Components

Programs interconnect with several key components of the Behavioral Coaching Platform:

1. **Journey Blueprints**: Programs are operational implementations of Journey Blueprints. While a Journey Blueprint defines the structure, content, and rules of an intervention, the Program applies these to specific audiences with concrete scheduling and deployment parameters. Multiple Programs can utilize the same Journey Blueprint with different target audiences or scheduling parameters.

2. **Workers & Segments**: Programs target specific workers, either directly or through segments. The segmentation engine determines which workers receive which programs, and Programs track individual worker progress through their assigned journeys.

3. **Content**: Programs deliver content modules to workers through journey touchpoints. The content may include text messages, rich media, quizzes, reflections, or other interactive elements defined in the Journey Blueprint.

4. **Wellbeing**: Programs can incorporate wellbeing assessments and track wellbeing indicators as workers progress through journeys. Significant wellbeing changes may trigger alerts or modified journey paths.

5. **Experiments**: Programs can be part of experiments, where different variants of the same program (with modified content, timing, or delivery parameters) are tested with different worker subgroups to determine optimal approaches.

6. **Gamification**: Programs can integrate with the gamification system, awarding badges, points, or other rewards based on worker progress and achievement within the program.

7. **Analytics**: Programs generate data that feeds into the analytics system, enabling organizations to measure intervention effectiveness, worker engagement, and overall program impact.

8. **Projects & Funders**: Programs can be associated with organizational projects and funding sources, allowing for aligned reporting and impact measurement.

The program management functionality must be designed to facilitate seamless integration with all these components while providing Program Managers with the tools they need to effectively create, deploy, monitor, and optimize behavioral coaching interventions.

In the following sections, we'll explore the implementation details for the Program Management functionality, including UI components, state management approaches, API integration patterns, and best practices for creating an effective Program Management experience within the platform.

## Program Architecture & Core Concepts

To effectively implement the Program Management functionality in the frontend, it's essential to understand the underlying data model, states, and relationships that define Programs within the platform.

### Program Data Model

The core Program data model consists of several key entities that work together to define, track, and manage the operational aspects of behavioral coaching interventions:

#### Program Entity

The primary Program entity contains the following key attributes:

```typescript
interface Program {
  id: string;                 // Unique identifier for the program
  organization_id: string;    // Organization that owns this program
  name: string;               // Human-readable program name
  description: string;        // Optional detailed description
  status: ProgramStatus;      // Current program status (scheduled, active, paused, etc.)
  start_date: Date;           // When the program should start
  end_date: Date | null;      // When the program should end (if specified)
  created_by: string;         // User ID of the creator
  updated_by: string;         // User ID of the last updater
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
  settings: ProgramSettings;  // Program-specific settings object
}

type ProgramStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'terminated' | 'archived';

interface ProgramSettings {
  delivery_window: {
    start_hour: number;       // Hour of day (0-23) when messages can start being sent
    end_hour: number;         // Hour of day (0-23) when messages stop being sent
    timezone_strategy: 'worker_local' | 'program_default' | 'organization_default';
    default_timezone: string; // Default timezone if not using worker local
  };
  message_frequency: {
    max_per_day: number;      // Maximum messages per day to a worker
    max_per_week: number;     // Maximum messages per week to a worker
    min_hours_between: number; // Minimum hours between messages
  };
  follow_up_rules: FollowUpRules; // Rules for following up on non-responses
  conflict_strategy: ConflictStrategy; // How to handle conflicts with other programs
}

interface FollowUpRules {
  enabled: boolean;
  strategies: Array<{
    touchpoint_types: string[];  // Types of touchpoints this applies to
    reminder_delay_hours: number; // Hours before sending a reminder
    max_reminders: number;       // Maximum number of reminders
    escalation_threshold: number; // After how many missed touchpoints to escalate
    escalation_action: 'notify_manager' | 'change_channel' | 'none';
  }>;
}

interface ConflictStrategy {
  priority_level: number;     // Higher number means higher priority
  handling_strategy: 'queue' | 'interrupt' | 'merge' | 'cancel_lower_priority';
  delay_threshold_hours: number; // How many hours to delay before applying strategy
}
```

#### Program Blueprint Relationship

Programs are connected to Journey Blueprints through a linking entity that defines which Journey Blueprints are included in the Program and in what order:

```typescript
interface ProgramBlueprint {
  id: string;                   // Unique identifier
  program_id: string;           // Reference to the Program
  journey_blueprint_id: string; // Reference to the Journey Blueprint
  order_in_program: number;     // Sequence order if multiple blueprints
  settings: {                   // Blueprint-specific overrides
    delay_days: number;         // Days to wait before starting this journey
    conditional_start: {        // Optional conditions for starting this journey
      condition_type: 'completion' | 'score_threshold';
      reference_blueprint_id?: string; // Which previous blueprint this depends on
      threshold_value?: number;        // Score threshold if applicable
    } | null;
  };
}
```

#### Worker Assignment

The connection between Programs and Workers is maintained through Worker Assignments:

```typescript
interface WorkerAssignment {
  id: string;                 // Unique identifier
  program_id: string;         // Reference to the Program
  worker_id: string;          // Reference to the Worker
  status: WorkerAssignmentStatus; // Current status in the program
  enrollment_date: Date;      // When the worker was enrolled
  completion_date: Date | null; // When the worker completed (if applicable)
  current_blueprint_id: string | null; // Current journey blueprint worker is in
  current_phase_id: string | null;     // Current phase worker is in
  current_touchpoint_id: string | null; // Current touchpoint worker is at
  last_interaction_date: Date | null;   // Last time worker interacted
  metadata: {                 // Additional tracking data
    percent_complete: number;   // Overall completion percentage
    engagement_score: number;   // Calculated engagement score
    total_touchpoints_delivered: number;
    total_touchpoints_completed: number;
    quiz_average_score: number | null;
  };
}

type WorkerAssignmentStatus = 
  | 'pending'      // Enrolled but not yet started
  | 'active'       // Actively participating
  | 'at_risk'      // Flagged for low engagement
  | 'on_hold'      // Temporarily suspended
  | 'completed'    // Successfully completed
  | 'dropped_out'; // Stopped participating
```

#### Worker Progress

Detailed tracking of worker progress through individual touchpoints:

```typescript
interface WorkerProgress {
  id: string;                 // Unique identifier
  worker_assignment_id: string; // Reference to Worker Assignment
  touchpoint_id: string;      // Reference to the Touchpoint
  started_at: Date | null;    // When this touchpoint was started
  completed_at: Date | null;  // When this touchpoint was completed
  response_data: any;         // Structured data from worker's response
  score: number | null;       // Score if this was a quiz/assessment
  feedback_text: string | null; // Any feedback provided by worker
  delivery_attempts: number;  // Number of delivery attempts
  delivery_status: 'pending' | 'delivered' | 'failed' | 'expired';
  interaction_duration_seconds: number | null; // Time spent if trackable
}
```

In the frontend implementation, TypeScript interfaces should be defined to match these data structures, typically in `src/lib/types/` or more specifically in `src/lib/types/program.ts`. This ensures type safety when working with Program data throughout the application.

### Program States

Programs can exist in several states throughout their lifecycle, each with specific UI representations and available actions:

1. **Draft**
   - **Definition**: The program is being created but is not yet ready for deployment.
   - **UI Representation**: Often shown with a "Draft" badge, muted colors, or in a separate "Drafts" section.
   - **Available Actions**: Edit, Delete, Publish (to move to Scheduled).
   - **Transition Triggers**: Manual user action to publish.

2. **Scheduled**
   - **Definition**: The program is configured and scheduled to start at a future date.
   - **UI Representation**: Clock or calendar icon, "Scheduled" badge, countdown to start.
   - **Available Actions**: Edit, Cancel, Start Now (to override scheduled start).
   - **Transition Triggers**: Reaching start date (automatic) or manual early start.

3. **Active**
   - **Definition**: The program is currently running, sending touchpoints to workers.
   - **UI Representation**: Green status indicator, "Active" badge, progress indicators.
   - **Available Actions**: Pause, End Early, View Progress, Send Broadcast.
   - **Transition Triggers**: Manual pause/end or reaching end date.

4. **Paused**
   - **Definition**: The program has been temporarily halted but can be resumed.
   - **UI Representation**: Pause icon, "Paused" badge, amber/yellow status.
   - **Available Actions**: Resume, End, Edit (limited).
   - **Transition Triggers**: Manual resume or end.

5. **Completed**
   - **Definition**: The program has reached its scheduled end date or all workers have completed it.
   - **UI Representation**: Checkmark icon, "Completed" badge, results summary.
   - **Available Actions**: View Results, Archive, Clone/Recreate.
   - **Transition Triggers**: Manual archive.

6. **Terminated**
   - **Definition**: The program was manually ended before its scheduled completion.
   - **UI Representation**: Stop icon, "Terminated" badge, reason indicators.
   - **Available Actions**: View Partial Results, Archive, Clone/Recreate.
   - **Transition Triggers**: Manual archive.

7. **Archived**
   - **Definition**: The program is no longer active but its data is preserved for reference.
   - **UI Representation**: Archive icon, "Archived" badge, often in a separate section.
   - **Available Actions**: Unarchive, Clone/Recreate, Export Data.
   - **Transition Triggers**: Manual unarchive (rare).

State transitions should be managed through explicit API calls rather than directly manipulating state in the frontend. Each state change may trigger cascading effects in worker assignments, notification systems, or other platform components.

### Program-Worker Assignment

The mechanism for assigning workers to programs is a critical aspect of the platform's architecture, involving both direct assignments and segment-based assignments:

#### Direct Worker Assignment

Individual workers can be directly assigned to a program:

```typescript
interface DirectWorkerAssignment {
  program_id: string;
  worker_ids: string[];  // Array of worker IDs to assign
}
```

This approach is used for small-scale programs or when specific workers need to be assigned regardless of their segment membership.

#### Segment-Based Assignment

More commonly, programs target entire segments of workers:

```typescript
interface SegmentAssignment {
  program_id: string;
  segment_ids: string[];  // Array of segment IDs to target
  dynamic_membership: boolean;  // Whether to include workers who join segment later
}
```

When using segment-based assignment, the platform periodically synchronizes program enrollments with segment membership, potentially adding new workers who join the segment or removing workers who leave (if `dynamic_membership` is true).

#### Assignment Rules

The assignment system handles several complex scenarios:

1. **Overlapping Segments**: Workers may belong to multiple segments assigned to the same program. The system must ensure each worker is only enrolled once.

2. **Assignment Timing**: 
   - For scheduled programs, workers are typically enrolled at the program start date
   - For dynamic membership, workers may be enrolled when they join a segment
   - For immediate assignments, workers are enrolled as soon as the assignment is created

3. **Capacity Limits**: Programs may have maximum worker capacity limits based on organizational subscription tiers or operational constraints.

4. **Eligibility Filtering**: Not all workers in a segment may be eligible for a program. Additional filters can be applied:
   ```typescript
   interface EligibilityFilters {
     exclude_completed_similar: boolean;  // Exclude workers who completed similar programs
     exclude_active_in_programs: string[]; // Program IDs to check for conflicts
     minimum_days_between_programs: number; // Cooling off period
     custom_filters: Record<string, any>;  // Custom criteria
   }
   ```

5. **Prioritization**: If a worker qualifies for multiple programs but cannot be enrolled in all due to capacity or conflict constraints, priority rules determine which programs take precedence.

In the frontend implementation, these assignment mechanisms should be exposed through clear, intuitive interfaces that help Program Managers understand the implications of their assignment choices and preview the effective worker audience before finalizing program deployment.

### Worker Progress Tracking

The platform maintains detailed records of worker progress through programs, enabling real-time monitoring and intervention:

#### Progress Data Structure

Worker progress data includes:

1. **Touchpoint-Level Progress**: For each touchpoint in a journey, the system tracks delivery status, completion status, response data, scores (for quizzes/assessments), and timing information.

2. **Phase-Level Aggregation**: Progress is aggregated at the phase level, showing completion percentages, average scores, and time-to-completion metrics.

3. **Journey-Level Aggregation**: Overall journey progress is tracked, including start/end dates, completion percentage, cumulative scores, and engagement metrics.

4. **Program-Level Summary**: For programs with multiple journeys, combined progress metrics provide an overall view of worker engagement and achievement.

#### Progress Visualization

The UI offers several views of worker progress:

1. **Individual Worker View**: Detailed progress timeline for a specific worker, showing touchpoint-by-touchpoint progress.

2. **Cohort View**: Aggregated progress for groups of workers, often visualized through progress distributions, completion funnels, or comparative charts.

3. **Timeline View**: Time-based visualization showing touchpoint delivery and completion over time.

4. **Achievement View**: Focus on scores, badges earned, or assessment results.

#### Progress Alerts

The system can generate alerts based on progress patterns:

1. **Engagement Alerts**: Flagging workers with low response rates or extended periods of inactivity.

2. **Performance Alerts**: Identifying workers with quiz scores below thresholds or declining performance trends.

3. **Completion Alerts**: Highlighting journey completions, both positive (early completion) and concerning (stuck at certain touchpoints).

4. **Wellbeing Alerts**: Connected to the wellbeing system, flagging concerning patterns in wellbeing responses during program participation.

Progress tracking is tightly integrated with the platform's analytics system, feeding into dashboards, reports, and insights that help Program Managers optimize their interventions.

In the frontend implementation, progress tracking requires efficient data loading patterns (pagination, virtualization for large worker cohorts), real-time or near-real-time updates, and clear visualizations that help Program Managers identify patterns and take appropriate actions.

The next sections will explore how these core concepts translate into concrete UI implementations, API integration patterns, and workflow designs within the platform frontend.

## Program Management Workflow

The Program Management module must support a comprehensive workflow that enables Program Managers to create, configure, deploy, monitor, adjust, and analyze behavioral coaching interventions. This section outlines the key workflows that the frontend implementation must enable.

### Creating Programs

The program creation process is the entry point to the Program Management workflow and requires careful design to ensure usability and effectiveness.

#### Creation Workflow

The program creation process typically follows these steps:

1. **Initiation**:
   - User navigates to Programs section and clicks "Create Program" button
   - System presents the first step of the creation wizard
   - Required authorization: Program Manager role or above

2. **Basic Information**:
   - User enters program name, description, and basic categorization
   - System validates input and enables progression to next step
   - Key fields: name (required), description, tags/categories (optional)

3. **Journey Blueprint Selection**:
   - User selects one or more Journey Blueprints to include in the program
   - System presents available blueprints with filtering/search options
   - If multiple blueprints are selected, user can specify sequence and dependencies

4. **Audience Selection**:
   - User selects target audience through segments and/or individual workers
   - System provides segment selection interface with previews of audience size
   - Options for dynamic vs. static segment membership should be presented

5. **Schedule Configuration**:
   - User sets program start and end dates/times
   - System validates schedule against organizational constraints
   - Options for immediate start vs. future scheduled start

6. **Review & Confirm**:
   - User reviews all program settings with a summary view
   - System shows preview of affected workers and resource usage estimates
   - Confirmation creates the program in draft or scheduled state

#### UI Components Needed

1. **Creation Wizard**:
   - Multi-step wizard with progress indicator
   - Consistent next/back/cancel navigation
   - Validation feedback for each step
   - Summary view for final confirmation

2. **Blueprint Selector**:
   - Filterable list/grid of available Journey Blueprints
   - Preview capability for blueprint content and structure
   - Multi-select mechanism with ordering controls
   - Dependencies configuration for multi-blueprint programs

3. **Audience Selector**:
   - Segment browser with selection checkboxes
   - Search/filter capabilities for segments
   - Audience size estimation display
   - Option toggles for dynamic membership
   - Individual worker picker for direct assignments

4. **Schedule Picker**:
   - Date and time selection for start/end
   - Timezone configuration
   - Visual calendar representation
   - Validation against organizational limits

#### State Management

During the creation process, the frontend needs to maintain complex state:

```typescript
interface ProgramCreationState {
  step: number;
  basicInfo: {
    name: string;
    description: string;
    tags: string[];
  };
  blueprints: {
    selectedBlueprintIds: string[];
    orderMapping: Record<string, number>;
    dependencies: Array<{
      blueprintId: string;
      dependsOnBlueprintId: string | null;
      conditionType: string | null;
      thresholdValue: number | null;
    }>;
  };
  audience: {
    segmentIds: string[];
    workerIds: string[];
    dynamicMembership: boolean;
    estimatedAudienceSize: number;
  };
  schedule: {
    startDate: Date | null;
    endDate: Date | null;
    timezone: string;
  };
  validationErrors: Record<string, string[]>;
}
```

This state can be managed using React's `useState` for simpler implementations or using a more structured approach like `useReducer` for complex wizards.

#### API Integration

The creation process interacts with several API endpoints:

1. **Blueprint Listing**: `GET /journeys` with appropriate filters to show available blueprints
2. **Segment Listing**: `GET /segments` to populate the audience selector
3. **Audience Estimation**: `POST /programs/estimate-audience` to preview audience size based on selected segments/workers
4. **Program Creation**: `POST /programs` to create the program with all specified settings

Error handling is particularly important during creation, with clear validation feedback at each step and appropriate recovery mechanisms for API failures.

### Configuring Programs

After initial creation, programs often require detailed configuration before deployment. This section focuses on the specialized configuration interfaces needed.

#### Basic Settings Configuration

The program settings interface allows modification of core program parameters:

1. **General Settings**:
   - Program name, description, and categorization
   - Start and end dates/times
   - Status controls (draft, scheduled, etc.)

2. **Delivery Settings**:
   - Message delivery windows (time of day constraints)
   - Frequency limits (maximum messages per day/week)
   - Timezone strategy (worker local vs. program default)

#### Advanced Configuration Areas

Several specialized configuration areas require dedicated interfaces:

1. **Follow-up Rules Configuration**:
   - Settings for automated reminders for non-responsive workers
   - Escalation thresholds and actions
   - Fallback channel configurations
   - Touchpoint-specific override rules

2. **Conflict Resolution Strategy**:
   - Program priority levels
   - Conflict handling approach (queue, interrupt, merge, cancel)
   - Delay thresholds and resolution rules
   - Worker experience preview during conflicts

3. **Notification Configuration**:
   - Program Manager notification settings
   - Milestone alerts configuration
   - Performance threshold notifications
   - Escalation routing rules

#### Blueprint-Specific Settings

For each Journey Blueprint included in the program, specific settings can be configured:

1. **Blueprint Timing**:
   - Start delay after program initiation
   - Conditional start based on other blueprint completion
   - Pacing adjustments (delivery spacing)

2. **Blueprint Customization**:
   - Content variant selection
   - Touchpoint inclusion/exclusion
   - Assessment threshold adjustments
   - Branch probability modifications

#### UI Components Needed

1. **Settings Panel**:
   - Organized in tabs or expandable sections
   - Form inputs appropriate to each setting type
   - Validation feedback
   - Save/cancel controls with dirty state tracking

2. **Follow-up Rules Editor**:
   - Rule creation interface
   - Condition builder for rule application
   - Action configuration
   - Visual timeline preview of follow-up behavior

3. **Conflict Simulator**:
   - Visual representation of program conflicts
   - Scenario testing interface
   - Resolution preview
   - Configuration controls tied to visual outcomes

4. **Blueprint Settings Panel**:
   - Per-blueprint configuration sections
   - Dependency visualization and configuration
   - Timeline preview of blueprint sequence

#### API Integration

Configuration interfaces interact with these key endpoints:

1. **Settings Retrieval**: `GET /programs/{programId}` and `GET /programs/{programId}/settings`
2. **Settings Update**: `PATCH /programs/{programId}` and `PATCH /programs/{programId}/settings`
3. **Follow-up Rules**: `GET/PATCH /programs/{programId}/follow-up-config`
4. **Conflict Config**: `GET/PATCH /programs/{programId}/conflict-config`
5. **Blueprint Settings**: `GET/PATCH /programs/{programId}/blueprints/{blueprintId}`

Changes to program configuration should be validated on the server to ensure they don't violate organizational constraints or create inconsistent states.

### Deploying Programs

Program deployment is the process of transitioning a program from draft/scheduled state to active execution.

#### Deployment Workflows

Programs can be deployed through several paths:

1. **Scheduled Deployment**:
   - Program automatically activates at the configured start date/time
   - System performs pre-deployment validation
   - Worker assignments are created based on segment membership at start time
   - Initial touchpoints are queued for delivery

2. **Manual Deployment**:
   - User triggers immediate deployment from the program details page
   - Confirmation dialog explains implications of early start
   - System performs pre-deployment validation
   - Worker assignments and touchpoint delivery begin immediately

3. **Phased Deployment**:
   - Program is deployed to a subset of workers initially
   - Performance is monitored for a specified period
   - If performance meets criteria, deployment expands to remaining workers
   - Requires additional configuration of phase criteria and expansion rules

#### Pre-Deployment Validation

Before deployment, the system validates:

1. **Resource Availability**:
   - Message quota sufficiency for projected program needs
   - Storage capacity for expected response data
   - Processing capacity for scheduled touchpoints

2. **Content Readiness**:
   - All referenced content is published and available
   - WhatsApp templates have approval if required
   - Media assets are accessible and properly formatted

3. **Scheduling Conflicts**:
   - Worker overlap with other active programs
   - Organization-wide program limits
   - Delivery window conflicts

4. **Worker Eligibility**:
   - Workers have required profile information
   - Communication channel availability (phone numbers, etc.)
   - Segment membership validation

#### Deployment UI Components

1. **Deployment Readiness Indicator**:
   - Visual status showing readiness for deployment
   - Checklist of validation criteria with pass/fail status
   - Remediation actions for failed validations

2. **Deployment Confirmation Dialog**:
   - Summary of deployment impact (worker count, resource usage)
   - Schedule confirmation
   - Explicit user confirmation requirement
   - Option to schedule vs. deploy immediately

3. **Phased Deployment Configuration**:
   - Cohort definition controls
   - Performance criteria settings
   - Expansion rule configuration
   - Timeline visualization of phased approach

#### API Integration

Deployment workflows utilize these endpoints:

1. **Deployment Validation**: `POST /programs/{programId}/validate-deployment`
2. **Manual Deployment**: `POST /programs/{programId}/actions/start`
3. **Deployment Status Check**: `GET /programs/{programId}/deployment-status`
4. **Phased Deployment Config**: `POST /programs/{programId}/phased-deployment`

Deployment status should be tracked with appropriate loading states and error handling for failed deployments.

### Monitoring Program Execution

Once deployed, programs require continuous monitoring to track progress, identify issues, and measure effectiveness.

#### Monitoring Dashboards

The primary program monitoring interface should include:

1. **Program Overview Dashboard**:
   - Current status and key metrics
   - Timeline showing program progress against schedule
   - Completion metrics (overall percentage, by phase)
   - Engagement metrics (response rates, time-to-completion)
   - Performance metrics (quiz scores, outcome measures)

2. **Worker Progress Dashboard**:
   - List view of enrolled workers with status indicators
   - Filtering by progress status, segment, performance
   - Sortable columns for key metrics
   - Quick actions for individual worker management

3. **Journey Progress Visualization**:
   - Funnel view showing progression through touchpoints
   - Dropout points identification
   - Time-to-completion distribution
   - Response rate visualization

4. **Messaging Activity Dashboard**:
   - Recent message activity log
   - Delivery success/failure tracking
   - Response patterns over time
   - Channel performance metrics

#### Real-time Monitoring Features

For active programs, real-time monitoring features enhance management capabilities:

1. **Activity Feed**:
   - Real-time feed of program events (completions, escalations)
   - Filterable by event type, worker, journey phase
   - Notification integration

2. **Alert Monitoring**:
   - Visualization of triggered alerts (engagement, performance)
   - Alert management interface (acknowledge, resolve)
   - Escalation tracking

3. **Resource Usage Monitor**:
   - Real-time tracking of message quotas
   - Storage utilization
   - API call volumes
   - Projection of resource needs vs. available limits

#### Worker-Level Monitoring

Detailed monitoring of individual worker progress:

1. **Worker Journey Timeline**:
   - Visualization of worker's journey progression
   - Touchpoint completion status with timestamps
   - Response content for completed touchpoints
   - Performance metrics on quizzes/assessments

2. **Worker Engagement Metrics**:
   - Response time patterns
   - Completion rates
   - Interaction depth metrics
   - Comparison to program averages

3. **Worker Communication Log**:
   - Timeline of all communications sent/received
   - Delivery status tracking
   - Full message content review
   - Manual message capability

#### UI Components Needed

1. **Metric Cards**:
   - Standardized display of key metrics with appropriate visualizations
   - Trend indicators showing change over time
   - Thresholds with color-coding for performance levels

2. **Progress Tables**:
   - Data tables with worker progress information
   - Sortable/filterable columns
   - Status indicators using appropriate iconography
   - Inline actions for common management tasks

3. **Journey Funnel Visualization**:
   - Sankey or funnel chart showing worker flow through journeys
   - Interactive elements for drilling into specific stages
   - Comparative view options (by segment, time period)

4. **Timeline Visualizations**:
   - Gantt-style views of program execution timeline
   - Worker-specific journey timelines
   - Milestone markers and critical path indicators

5. **Activity Streams**:
   - Real-time or near-real-time event feeds
   - Filtering controls
   - Notification integration
   - Action buttons for responding to events

#### API Integration

Monitoring interfaces interact with various endpoints:

1. **Program Status**: `GET /programs/{programId}` 
2. **Program Metrics**: `GET /programs/{programId}/analytics`
3. **Worker Listing**: `GET /programs/{programId}/workers`
4. **Worker Details**: `GET /programs/{programId}/workers/{workerId}/state`
5. **Message Logs**: `GET /programs/{programId}/messaging/log`
6. **Activity Feed**: `GET /programs/{programId}/activities` (potentially with WebSocket for real-time)

Performance considerations are critical for monitoring interfaces, especially for programs with large worker cohorts. Approaches like pagination, data aggregation, and incremental loading should be employed.

### Adjusting Programs

During program execution, various adjustments may be needed to optimize performance, respond to issues, or adapt to changing circumstances.

#### Program Control Actions

Basic control actions for active programs:

1. **Pause Program**:
   - Temporarily halts new touchpoint delivery
   - Maintains current worker state and progress data
   - Can be applied to entire program or specific segments
   - Requires reason selection and optional duration

2. **Resume Program**:
   - Continues program execution from paused state
   - Can apply adjustments to timing to account for pause duration
   - May require confirmation of resource availability

3. **End Program Early**:
   - Prematurely terminates the program before scheduled end
   - Requires confirmation and reason selection
   - Options for handling in-progress workers (continue or terminate)
   - Final status notification to participants

#### Worker-Level Adjustments

Interventions for individual worker management:

1. **Pause Worker Participation**:
   - Places specific worker on hold without affecting others
   - Maintains current progress state
   - Can be scheduled to automatically resume after period

2. **Update Worker Journey State**:
   - Manual override of worker's position in journey
   - Options to mark touchpoints as complete, skip sections
   - Audit trail of manual interventions

3. **Remove Worker from Program**:
   - Unenroll specific worker from program
   - Data retention options
   - Confirmation requirement for permanent removal

4. **Send Manual Touchpoint**:
   - Ad-hoc touchpoint delivery outside normal journey flow
   - Template selection or custom message creation
   - Delivery tracking and response handling

#### Program Parameter Adjustments

Modifications to program parameters during execution:

1. **Schedule Adjustments**:
   - Extending or shortening program duration
   - Modifying delivery windows or frequency
   - Rescheduling specific journey phases

2. **Audience Adjustments**:
   - Adding new segments or workers to program
   - Removing segments from remaining touchpoints
   - Modifying dynamic membership rules

3. **Content Adjustments**:
   - Updating message templates
   - Modifying quiz/assessment content
   - Adjusting branch logic or scoring thresholds

#### UI Components Needed

1. **Control Action Panels**:
   - Clearly labeled action buttons for major control functions
   - Confirmation dialogs with impact explanation
   - Reason selection for audit purposes
   - Status feedback during action processing

2. **Worker Management Interface**:
   - Batch selection mechanisms for multi-worker actions
   - Individual worker control menus
   - Status indicators showing current worker state
   - Logs of previous interventions

3. **Parameter Adjustment Forms**:
   - Setting-specific edit interfaces
   - Validation against program constraints
   - Preview of impact before confirming changes
   - Version tracking of parameter changes

4. **Manual Communication Interface**:
   - Message composer with template access
   - Recipient selector (individual or groups)
   - Delivery scheduling options
   - Tracking and response management

#### API Integration

Program adjustment interfaces interact with these endpoints:

1. **Program Control**: 
   - `POST /programs/{programId}/actions/pause`
   - `POST /programs/{programId}/actions/resume`
   - `POST /programs/{programId}/actions/end`

2. **Worker Management**:
   - `PATCH /programs/{programId}/workers/{workerId}/state`
   - `DELETE /programs/{programId}/workers/{workerId}`
   - `POST /programs/{programId}/workers/{workerId}/pause`
   - `POST /programs/{programId}/workers/{workerId}/resume`

3. **Parameter Updates**:
   - `PATCH /programs/{programId}` (for basic settings)
   - `PATCH /programs/{programId}/schedule`
   - `POST /programs/{programId}/workers` (for adding workers)

4. **Manual Communications**:
   - `POST /programs/{programId}/send-manual-touchpoint`

All adjustment actions should be tracked in an audit log, with appropriate permissions controls to restrict sensitive operations.

### Analyzing Program Outcomes

After program completion (or during execution for long-running programs), analysis tools help organizations understand program effectiveness and extract actionable insights.

#### Results Dashboard

The primary program results interface should include:

1. **Completion Metrics**:
   - Overall completion rate
   - Phase-level completion rates
   - Time-to-completion distributions
   - Dropout analysis by touchpoint

2. **Performance Metrics**:
   - Quiz/assessment score distributions
   - Knowledge gain measurements (pre/post)
   - Behavioral change indicators
   - Wellbeing impact metrics

3. **Engagement Metrics**:
   - Response rates by touchpoint type
   - Response timing patterns
   - Interaction depth metrics
   - Channel effectiveness comparison

4. **Outcome Metrics**:
   - Primary program goals achievement
   - Secondary benefit indicators
   - Return on investment calculations
   - Comparative effectiveness vs. previous programs

#### Segment Comparison Analysis

Tools for comparing program effectiveness across different audience segments:

1. **Segment Performance Comparison**:
   - Side-by-side metrics for different segments
   - Statistical significance indicators
   - Visual highlighting of key differences
   - Filtering by metric category

2. **Demographic Analysis**:
   - Performance breakdown by worker attributes
   - Identification of high/low-performing subgroups
   - Correlation analysis with worker characteristics
   - Recommendation engine for future targeting

3. **Location-Based Analysis**:
   - Geographic visualization of program effectiveness
   - Regional comparison tools
   - Location-specific factor identification
   - Map-based filtering and exploration

#### Content Effectiveness Analysis

Analysis focused on journey content performance:

1. **Touchpoint Effectiveness Ranking**:
   - Engagement rates by touchpoint
   - Impact scores based on subsequent behavior
   - Time investment vs. impact analysis
   - Recommendation for content optimization

2. **Message Analysis**:
   - Response rate analysis by message characteristics
   - A/B test results integration
   - Language effectiveness evaluation
   - Media type performance comparison

3. **Quiz/Assessment Analysis**:
   - Question-level difficulty analysis
   - Distractor effectiveness for multiple choice
   - Knowledge gap identification
   - Learning curve visualization

#### Export and Reporting

Tools for sharing program results with stakeholders:

1. **Report Generator**:
   - Templated reports for different stakeholder types
   - Metric selection and layout customization
   - Narrative section inclusion
   - Export to PDF, PowerPoint, or other formats

2. **Raw Data Export**:
   - Structured data export options (CSV, Excel)
   - Customizable field selection
   - Filtering options before export
   - Scheduling regular exports

3. **Dashboard Sharing**:
   - Shareable dashboard links with permission controls
   - Embedded view options for other systems
   - Scheduled snapshot distribution
   - Annotation capability for collaborative analysis

4. **Report Builder**:
   - Funder-specific report templates
   - Metric and evidence selection
   - Narrative section editor
   - Preview and export controls

## Program UI Implementation

This section details the specific UI components, layouts, and interactions required to implement the Program Management functionality within the frontend. Each page and component is described with its purpose, layout, behavior, and integration requirements.

### Program Listing Page

The Program Listing Page serves as the entry point to the Program Management functionality, providing an overview of all programs and access to program creation and management features.

#### URL and Routing

- **Route**: `/programs`
- **Layout**: Main application layout with sidebar, header, and content area
- **Auth Requirements**: Authenticated users with Program Manager role or above

#### Component Structure

```typescript
// Page Component
const ProgramListPage: React.FC = () => {
  // Component implementation
};

// Program List Component
interface ProgramListProps {
  programs: Program[];
  isLoading: boolean;
  onProgramSelect: (programId: string) => void;
  onCreateProgram: () => void;
  onProgramActionTriggered: (programId: string, action: ProgramAction) => void;
}

const ProgramList: React.FC<ProgramListProps> = (props) => {
  // Component implementation
};

// Program Card Component
interface ProgramCardProps {
  program: Program;
  onSelect: () => void;
  onActionTriggered: (action: ProgramAction) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = (props) => {
  // Component implementation
};
```

#### Layout Design

The Program Listing Page typically follows this layout structure:

1. **Page Header**:
   - Page title ("Programs")
   - Create Program button
   - Filter and view options (grid/list toggle, etc.)
   - Search input for programs

2. **Filter Panel**:
   - Status filter (Draft, Scheduled, Active, etc.)
   - Date range selectors (start date, end date)
   - Blueprint filter (by Journey Blueprint)
   - Tag/category filter
   - Sort options (newest, alphabetical, status, etc.)

3. **Program Grid/List**:
   - Program cards in grid view (default)
   - Program rows in list view (optional)
   - Pagination controls
   - Empty state for no results

4. **Program Card/Row Elements**:
   - Program name and status badge
   - Brief description (truncated)
   - Key metrics (worker count, completion rate)
   - Timeline indicators (start/end dates, progress)
   - Action menu (View Details, Edit, Clone, etc.)
   - Visual status indicators (progress bar, charts)

#### UI States

The page handles multiple states:

1. **Loading State**:
   - Skeleton UI or loading indicator while fetching program data
   - Placeholder cards/rows with shimmer effect

2. **Loaded State**:
   - Grid/list of program cards/rows
   - Responsive layout adapting to screen size
   - Interactive elements for sorting, filtering, pagination

3. **Empty State**:
   - When no programs exist or match filters
   - Encouraging message and Create Program button
   - First-time user guidance if appropriate

4. **Error State**:
   - Error message if program data fetch fails
   - Retry action
   - Fallback options

#### Interactions

Key interactions on this page include:

1. **Program Creation**:
   - Clicking Create Program button navigates to Program Creation Wizard
   - Keyboard shortcut for quick access (e.g., Alt+N)

2. **Program Selection**:
   - Clicking a program card navigates to Program Detail Dashboard
   - Keyboard navigation between program cards

3. **Program Actions**:
   - Action menu (ellipsis or dedicated buttons) for operations like:
     - Edit Program
     - Duplicate/Clone
     - Pause/Resume (for active programs)
     - Archive (for completed programs)
     - Delete (for draft programs)

4. **Filtering & Sorting**:
   - Filter controls update program list in real-time
   - URL parameters reflect current filter state for shareable links
   - Sort options affect the order of displayed programs

5. **Search**:
   - Typeahead search for finding programs by name or description
   - Results highlight matching text
   - Empty search results have helpful suggestions

#### API Integration

The page integrates with these endpoints:

1. **Program Listing**: `GET /programs` with query parameters for:
   - Pagination (`page`, `limit`)
   - Filtering (`status`, `date_range`, `blueprint_id`, etc.)
   - Sorting (`sort_by`, `sort_direction`)
   - Search (`search_term`)

2. **Program Actions**: Various endpoints for program operations:
   - `PATCH /programs/{programId}` for updates
   - `POST /programs/{programId}/actions/pause` for pausing
   - `POST /programs/{programId}/actions/resume` for resuming
   - `DELETE /programs/{programId}` for deletion (draft programs only)

#### Implementation Considerations

1. **Performance**:
   - Use virtualization for long program lists
   - Consider pagination or infinite scroll for organizations with many programs
   - Implement optimistic UI updates for common actions

2. **Responsiveness**:
   - Grid view adapts to screen size (1-4 columns based on viewport)
   - List view for more compact display on smaller screens
   - Touch-friendly targets for mobile devices

3. **Accessibility**:
   - Keyboard navigation between cards/rows
   - Screen reader announcements for dynamic content updates
   - Sufficient color contrast for status indicators

4. **State Management**:
   - Use React Query for program data fetching and caching
   - Filter state maintained in URL parameters
   - Consider local storage for persisting view preferences

#### Component Implementation

The ProgramList component should be implemented as follows:

```typescript
// src/components/features/programs/ProgramList.tsx
import React, { useState } from 'react';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { useRouter } from 'next/navigation';
import { ProgramCard } from './ProgramCard';
import { ProgramListFilter } from './ProgramListFilter';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { PlusIcon, ViewGridIcon, ViewListIcon } from '@/components/ui/icons';

export const ProgramList: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    status: [],
    dateRange: null,
    blueprintIds: [],
    searchTerm: '',
    page: 1,
    limit: 12,
    sortBy: 'updated_at',
    sortDirection: 'desc' as 'asc' | 'desc'
  });
  
  const { 
    programs, 
    isLoading, 
    isError, 
    error, 
    pagination 
  } = useProgramsApi.usePrograms(filters);
  
  const handleCreateProgram = () => {
    router.push('/programs/create');
  };
  
  const handleProgramSelect = (programId: string) => {
    router.push(`/programs/${programId}`);
  };
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };
  
  const handleViewToggle = () => {
    setView(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  if (isError) {
    return (
      <div className="error-container">
        <h3>Error loading programs</h3>
        <p>{error?.message || 'An unexpected error occurred'}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="program-list-container">
      <div className="program-list-header">
        <h1>Programs</h1>
        <div className="program-list-actions">
          <Button 
            onClick={handleViewToggle} 
            variant="ghost" 
            aria-label={`Switch to ${view === 'grid' ? 'list' : 'grid'} view`}
          >
            {view === 'grid' ? <ViewListIcon /> : <ViewGridIcon />}
          </Button>
          <Button 
            onClick={handleCreateProgram}
            variant="primary"
            className="create-program-button"
          >
            <PlusIcon className="mr-2" />
            Create Program
          </Button>
        </div>
      </div>
      
      <ProgramListFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {isLoading ? (
        <div className="program-list-loading">
          {/* Show skeleton cards/rows based on view type */}
          {Array.from({ length: filters.limit }).map((_, i) => (
            <div key={i} className={`program-skeleton ${view}`}></div>
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="program-list-empty">
          <h3>No programs found</h3>
          <p>
            {filters.searchTerm || filters.status.length > 0 ? 
              'Try adjusting your filters' : 
              'Create your first program to get started'
            }
          </p>
          <Button onClick={handleCreateProgram} variant="primary">
            Create Program
          </Button>
        </div>
      ) : (
        <div className={`program-list-${view}`}>
          {programs.map(program => (
            <ProgramCard
              key={program.id}
              program={program}
              view={view}
              onSelect={() => handleProgramSelect(program.id)}
            />
          ))}
        </div>
      )}
      
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
```

This implementation showcases a complete Program List page with filtering, view toggling, pagination, and proper loading/error states.

### Program Creation Wizard

The Program Creation Wizard guides users through the process of creating a new program, ensuring all required information is collected in a structured, user-friendly manner.

#### URL and Routing

- **Route**: `/programs/create`
- **Layout**: Main application layout, potentially with modified header/footer
- **Auth Requirements**: Authenticated users with Program Manager role or above

#### Component Structure

```typescript
// Page Component
const ProgramCreationPage: React.FC = () => {
  // Component implementation
};

// Wizard Component
interface ProgramCreationWizardProps {
  onComplete: (programId: string) => void;
  onCancel: () => void;
}

const ProgramCreationWizard: React.FC<ProgramCreationWizardProps> = (props) => {
  // Component implementation
};

// Step Components
interface WizardStepProps {
  stepData: any;
  onStepComplete: (stepData: any) => void;
  onStepBack: () => void;
  isSubmitting: boolean;
}

const BasicInfoStep: React.FC<WizardStepProps> = (props) => {
  // Component implementation
};

const BlueprintSelectionStep: React.FC<WizardStepProps> = (props) => {
  // Component implementation
};

const AudienceSelectionStep: React.FC<WizardStepProps> = (props) => {
  // Component implementation
};

const ScheduleConfigurationStep: React.FC<WizardStepProps> = (props) => {
  // Component implementation
};

const ReviewConfirmStep: React.FC<WizardStepProps> = (props) => {
  // Component implementation
};
```

#### Layout Design

The Program Creation Wizard typically follows this layout structure:

1. **Wizard Header**:
   - Wizard title ("Create New Program")
   - Step indicator showing current position in workflow
   - Close/cancel button

2. **Step Content Area**:
   - Dynamic content based on current step
   - Form elements appropriate to the step
   - Contextual help/information

3. **Navigation Controls**:
   - Back button (disabled on first step)
   - Next/Continue button
   - Cancel button
   - Skip button (for optional steps, if applicable)

4. **Progress Indicator**:
   - Visual representation of steps (numbered circles, progress bar)
   - Completed steps marked distinctly
   - Current step highlighted

#### Step Layouts

Each step has a specific layout:

1. **Basic Information Step**:
   - Program name field (required)
   - Description field (multiline text)
   - Tags/categories selection
   - Required fields marked with asterisk

2. **Journey Blueprint Selection Step**:
   - Filterable grid/list of available blueprints
   - Blueprint preview capability
   - Selection mechanism (checkboxes for multi-select)
   - Ordering controls for selected blueprints
   - Dependencies configuration interface

3. **Audience Selection Step**:
   - Segment selection interface
   - Direct worker selection option
   - Audience size estimation display
   - Dynamic membership toggle
   - Eligibility criteria settings

4. **Schedule Configuration Step**:
   - Start date/time picker
   - End date/time picker (optional)
   - Timezone selection
   - Delivery window configuration
   - Frequency settings

5. **Review & Confirm Step**:
   - Summary of all selected options
   - Program preview visualization
   - Resource usage estimates
   - Final confirmation controls
   - Option to go back and edit any section

#### UI States

The wizard handles these states:

1. **Step Navigation**:
   - Current step content displayed in main area
   - Completed steps can be revisited
   - Validation prevents advancing with incomplete required fields

2. **Loading States**:
   - When fetching dependent data (blueprints, segments)
   - When processing step transitions
   - When submitting the final program creation

3. **Validation States**:
   - Field-level validation feedback
   - Step-level validation summaries
   - Preventing advancement with validation errors

4. **Preview States**:
   - Blueprint preview modals/panels
   - Audience preview visualizations
   - Timeline preview for scheduling

#### API Integration

The wizard integrates with these endpoints:

1. **Blueprint Listing**: `GET /journeys` for blueprint selection
2. **Segment Listing**: `GET /segments` for audience selection
3. **Audience Estimation**: `POST /programs/estimate-audience` for audience preview
4. **Program Creation**: `POST /programs` for final submission

#### Implementation Considerations

1. **State Management**:
   - Complex wizard state requires structured approach
   - Use `useReducer` for managing step data and transitions
   - Consider React Context for sharing wizard state across components

2. **Validation**:
   - Implement both client-side and server-side validation
   - Provide immediate feedback for validation errors
   - Allow graceful recovery from validation failures

3. **Persistence**:
   - Save wizard progress in localStorage to prevent data loss
   - Confirm before discarding unsaved changes
   - Consider draft API endpoints for server-side progress saving

4. **Accessibility**:
   - Ensure focus management between steps
   - Provide keyboard navigation through wizard
   - Announce step transitions for screen readers

#### Component Implementation

The main wizard component should be implemented like this:

```typescript
// src/components/features/programs/ProgramCreationWizard.tsx
import React, { useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { BasicInfoStep } from './wizard-steps/BasicInfoStep';
import { BlueprintSelectionStep } from './wizard-steps/BlueprintSelectionStep';
import { AudienceSelectionStep } from './wizard-steps/AudienceSelectionStep';
import { ScheduleConfigurationStep } from './wizard-steps/ScheduleConfigurationStep';
import { ReviewConfirmStep } from './wizard-steps/ReviewConfirmStep';
import { WizardProgress } from '@/components/ui/wizard-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';

// Define wizard steps
const WIZARD_STEPS = [
  { id: 'basic-info', label: 'Basic Information' },
  { id: 'blueprint-selection', label: 'Journey Blueprint Selection' },
  { id: 'audience-selection', label: 'Audience Selection' },
  { id: 'schedule-configuration', label: 'Schedule Configuration' },
  { id: 'review-confirm', label: 'Review & Confirm' }
];

// Initial state
const initialState = {
  currentStepIndex: 0,
  basicInfo: {
    name: '',
    description: '',
    tags: []
  },
  blueprints: {
    selectedBlueprintIds: [],
    orderMapping: {},
    dependencies: []
  },
  audience: {
    segmentIds: [],
    workerIds: [],
    dynamicMembership: true,
    estimatedAudienceSize: 0
  },
  schedule: {
    startDate: null,
    endDate: null,
    timezone: '',
    deliveryWindow: {
      startHour: 9,
      endHour: 17
    },
    messageFrequency: {
      maxPerDay: 3,
      maxPerWeek: 15
    }
  },
  validationErrors: {}
};

// Reducer for wizard state management
function wizardReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStepIndex: action.payload };
    case 'UPDATE_STEP_DATA':
      return { 
        ...state, 
        [action.payload.step]: {
          ...state[action.payload.step],
          ...action.payload.data
        }
      };
    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.payload
      };
    case 'RESET_WIZARD':
      return initialState;
    default:
      return state;
  }
}

export const ProgramCreationWizard: React.FC<ProgramCreationWizardProps> = ({ 
  onComplete,
  onCancel
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const { createProgram, isCreating } = useProgramsApi.useCreateProgram();
  
  // Load saved progress from localStorage if exists
  useEffect(() => {
    const savedProgress = localStorage.getItem('program_creation_progress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        Object.keys(parsedProgress).forEach(key => {
          if (key !== 'currentStepIndex') {
            dispatch({
              type: 'UPDATE_STEP_DATA',
              payload: { step: key, data: parsedProgress[key] }
            });
          }
        });
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, []);
  
  // Save progress to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('program_creation_progress', JSON.stringify({
      basicInfo: state.basicInfo,
      blueprints: state.blueprints,
      audience: state.audience,
      schedule: state.schedule
    }));
  }, [state.basicInfo, state.blueprints, state.audience, state.schedule]);
  
  const currentStep = WIZARD_STEPS[state.currentStepIndex];
  
  const handleNext = () => {
    if (state.currentStepIndex < WIZARD_STEPS.length - 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStepIndex + 1 });
    }
  };
  
  const handleBack = () => {
    if (state.currentStepIndex > 0) {
      dispatch({ type: 'SET_STEP', payload: state.currentStepIndex - 1 });
    }
  };
  
  const handleStepComplete = (stepId, data) => {
    dispatch({
      type: 'UPDATE_STEP_DATA',
      payload: { step: stepId, data }
    });
    handleNext();
  };
  
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      localStorage.removeItem('program_creation_progress');
      onCancel();
    }
  };
  
  const handleCreateProgram = async () => {
    try {
      const programData = {
        name: state.basicInfo.name,
        description: state.basicInfo.description,
        tags: state.basicInfo.tags,
        blueprints: state.blueprints.selectedBlueprintIds.map(id => ({
          journey_blueprint_id: id,
          order_in_program: state.blueprints.orderMapping[id] || 0,
          settings: {
            // Map dependencies to the expected format
            conditional_start: state.blueprints.dependencies.find(d => d.blueprintId === id)
          }
        })),
        audience: {
          segment_ids: state.audience.segmentIds,
          worker_ids: state.audience.workerIds,
          dynamic_membership: state.audience.dynamicMembership
        },
        schedule: {
          start_date: state.schedule.startDate,
          end_date: state.schedule.endDate,
          timezone: state.schedule.timezone,
          delivery_window: state.schedule.deliveryWindow,
          message_frequency: state.schedule.messageFrequency
        }
      };
      
      const newProgram = await createProgram(programData);
      
      // Clear saved progress
      localStorage.removeItem('program_creation_progress');
      
      toast({
        title: 'Program Created',
        description: `Program "${newProgram.name}" has been created successfully.`,
        variant: 'success'
      });
      
      onComplete(newProgram.id);
    } catch (error) {
      toast({
        title: 'Error Creating Program',
        description: error.message || 'An unexpected error occurred while creating the program.',
        variant: 'error'
      });
      
      // Set validation errors if returned from API
      if (error.errors) {
        dispatch({
          type: 'SET_VALIDATION_ERRORS',
          payload: error.errors
        });
      }
    }
  };
  
  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 'basic-info':
        return (
          <BasicInfoStep
            stepData={state.basicInfo}
            validationErrors={state.validationErrors.basicInfo || {}}
            onStepComplete={(data) => handleStepComplete('basicInfo', data)}
            onStepBack={handleBack}
            isSubmitting={false}
          />
        );
      case 'blueprint-selection':
        return (
          <BlueprintSelectionStep
            stepData={state.blueprints}
            validationErrors={state.validationErrors.blueprints || {}}
            onStepComplete={(data) => handleStepComplete('blueprints', data)}
            onStepBack={handleBack}
            isSubmitting={false}
          />
        );
      case 'audience-selection':
        return (
          <AudienceSelectionStep
            stepData={state.audience}
            validationErrors={state.validationErrors.audience || {}}
            onStepComplete={(data) => handleStepComplete('audience', data)}
            onStepBack={handleBack}
            isSubmitting={false}
          />
        );
      case 'schedule-configuration':
        return (
          <ScheduleConfigurationStep
            stepData={state.schedule}
            validationErrors={state.validationErrors.schedule || {}}
            onStepComplete={(data) => handleStepComplete('schedule', data)}
            onStepBack={handleBack}
            isSubmitting={false}
          />
        );
      case 'review-confirm':
        return (
          <ReviewConfirmStep
            wizardData={state}
            validationErrors={state.validationErrors}
            onStepBack={handleBack}
            onConfirm={handleCreateProgram}
            isSubmitting={isCreating}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="program-creation-wizard">
      <div className="wizard-header">
        <h1>Create New Program</h1>
        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>
      
      <WizardProgress
        steps={WIZARD_STEPS}
        currentStepIndex={state.currentStepIndex}
        onStepClick={(index) => {
          // Only allow clicking on completed steps
          if (index < state.currentStepIndex) {
            dispatch({ type: 'SET_STEP', payload: index });
          }
        }}
      />
      
      <div className="wizard-content">
        {renderCurrentStep()}
      </div>
      
      <div className="wizard-footer">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={state.currentStepIndex === 0}
        >
          Back
        </Button>
        
        {state.currentStepIndex < WIZARD_STEPS.length - 1 ? (
          <Button
            variant="primary"
            onClick={handleNext}
            // Disable if current step has validation errors
            disabled={Object.keys(state.validationErrors[Object.keys(state)[state.currentStepIndex + 1]] || {}).length > 0}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleCreateProgram}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Program'}
          </Button>
        )}
      </div>
    </Card>
  );
};
```

Each step component would be implemented similarly, with form elements specific to that step's data requirements, validation logic, and appropriate UI components. The complete wizard provides a structured flow for program creation with persistence, validation, and a smooth user experience.

### Program Detail Dashboard

The Program Detail Dashboard provides a comprehensive view of a single program, serving as the central hub for monitoring and managing program execution.

#### URL and Routing

- **Route**: `/programs/:programId`
- **Layout**: Main application layout with sidebar, header, and content area
- **Auth Requirements**: Authenticated users with Program Manager role or above

#### Component Structure

```typescript
// Page Component
const ProgramDetailPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Dashboard Component
interface ProgramDashboardProps {
  program: Program;
  isLoading: boolean;
  onActionTriggered: (action: ProgramAction) => void;
}

const ProgramDashboard: React.FC<ProgramDashboardProps> = (props) => {
  // Component implementation
};

// Metric Section Components
interface MetricSectionProps {
  program: Program;
  metrics: ProgramMetrics;
  isLoading: boolean;
}

const CompletionMetrics: React.FC<MetricSectionProps> = (props) => {
  // Component implementation
};

const EngagementMetrics: React.FC<MetricSectionProps> = (props) => {
  // Component implementation
};

// Worker Progress Components
interface WorkerProgressTableProps {
  programId: string;
  filters: WorkerProgressFilters;
  onFilterChange: (filters: Partial<WorkerProgressFilters>) => void;
}

const WorkerProgressTable: React.FC<WorkerProgressTableProps> = (props) => {
  // Component implementation
};
```

#### Layout Design

The Program Detail Dashboard typically follows this layout structure:

1. **Page Header**:
   - Program name and status badge
   - Program timeline indicator (dates, progress)
   - Action buttons (Pause/Resume, End, Edit, etc.)
   - Tabs for different dashboard sections

2. **Overview Section**:
   - Program description and basic information
   - Key metrics in card format
   - Status timeline visualization
   - Quick action buttons for common operations

3. **Metrics Dashboard**:
   - Progress metrics (completion rates, timeline)
   - Engagement metrics (response rates, timing)
   - Performance metrics (quiz scores, assessments)
   - Wellbeing metrics (if applicable)

4. **Worker Progress Section**:
   - Filterable table of enrolled workers
   - Progress status indicators
   - Quick action buttons for worker-level operations
   - Batch action tools for multiple workers

5. **Activity Feed**:
   - Recent events and activities
   - Filterable by activity type
   - Timestamp and activity description
   - Action links for relevant activities

#### Tab Structure

The dashboard may use tabs to organize content:

1. **Overview Tab** (default):
   - Program summary and key metrics
   - High-level visualizations
   - Current status information

2. **Workers Tab**:
   - Detailed worker progress table
   - Individual worker management tools
   - Batch operations interface

3. **Journey Progress Tab**:
   - Detailed journey phase/touchpoint progress
   - Completion funnel visualization
   - Content performance metrics

4. **Messages Tab**:
   - Message delivery log
   - Delivery success/failure tracking
   - Message template performance

5. **Analytics Tab**:
   - Detailed program analytics
   - Comparative visualizations
   - Export and reporting tools

#### UI States

The dashboard handles these states:

1. **Loading State**:
   - Skeleton UI or loading indicators while fetching program data
   - Progressive loading of different sections

2. **Program Status-Based States**:
   - Different layouts/elements based on program status
   - Status-specific action buttons
   - Visual indicators of current state

3. **Error States**:
   - Component-level error handling
   - Retry mechanisms
   - Fallback content when data unavailable

4. **Empty States**:
   - Appropriate messaging when no workers are enrolled
   - Guidance for next steps based on program state

#### Key Interactive Elements

1. **Program Control Panel**:
   - Status control buttons (Pause/Resume/End)
   - Edit Program button leading to settings
   - Clone Program button
   - Export/Report generation buttons

2. **Worker Action Tools**:
   - Individual worker progress management
   - Batch selection tools for multi-worker operations
   - Send Message interface for manual communications
   - Worker status override tools

3. **Timeline Controls**:
   - Date range selectors for metrics
   - Timeline zoom/pan controls
   - Event marker toggles

4. **Filter Controls**:
   - Status filters for worker table
   - Segment filters
   - Performance threshold filters
   - Search by worker name/ID

#### API Integration

The dashboard integrates with these endpoints:

1. **Program Detail**: `GET /programs/{programId}`
2. **Program Metrics**: `GET /programs/{programId}/analytics`
3. **Worker Listing**: `GET /programs/{programId}/workers`
4. **Message Log**: `GET /programs/{programId}/messaging/log`
5. **Program Control**: 
   - `POST /programs/{programId}/actions/pause`
   - `POST /programs/{programId}/actions/resume`
   - `POST /programs/{programId}/actions/end`

#### Implementation Example

```typescript
// src/components/features/programs/ProgramDashboard.tsx
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { ProgramHeader } from './ProgramHeader';
import { ProgramOverview } from './ProgramOverview';
import { ProgramMetricsSection } from './ProgramMetricsSection';
import { WorkerProgressTable } from './WorkerProgressTable';
import { ProgramActivityFeed } from './ProgramActivityFeed';
import { ProgramMessageLog } from './ProgramMessageLog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const ProgramDashboard: React.FC = () => {
  const { programId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'pause' | 'resume' | 'end' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });
  
  const { program, isLoading, error, refetch } = useProgramsApi.useProgram(programId);
  const { programMetrics, isLoading: isLoadingMetrics } = useProgramsApi.useProgramMetrics(
    programId,
    { enabled: !!program && !isLoading }
  );
  
  const { 
    pauseProgram, 
    resumeProgram, 
    endProgram,
    isPausing,
    isResuming,
    isEnding
  } = useProgramsApi.useProgramControl(programId);
  
  if (isLoading) {
    return (
      <div className="program-dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Loading program details...</p>
      </div>
    );
  }
  
  if (error || !program) {
    return (
      <div className="program-dashboard-error">
        <h2>Error Loading Program</h2>
        <p>{error?.message || 'The program could not be loaded.'}</p>
        <Button onClick={() => refetch()}>Retry</Button>
        <Button variant="outline" onClick={() => router.push('/programs')}>
          Back to Programs
        </Button>
      </div>
    );
  }
  
  const handlePauseProgram = async () => {
    try {
      await pauseProgram();
      toast({
        title: 'Program Paused',
        description: `${program.name} has been paused successfully.`,
        variant: 'success'
      });
      setConfirmAction({ type: null, isOpen: false });
    } catch (error) {
      toast({
        title: 'Error Pausing Program',
        description: error.message || 'An unexpected error occurred.',
        variant: 'error'
      });
    }
  };
  
  const handleResumeProgram = async () => {
    try {
      await resumeProgram();
      toast({
        title: 'Program Resumed',
        description: `${program.name} has been resumed successfully.`,
        variant: 'success'
      });
      setConfirmAction({ type: null, isOpen: false });
    } catch (error) {
      toast({
        title: 'Error Resuming Program',
        description: error.message || 'An unexpected error occurred.',
        variant: 'error'
      });
    }
  };
  
  const handleEndProgram = async () => {
    try {
      await endProgram();
      toast({
        title: 'Program Ended',
        description: `${program.name} has been ended successfully.`,
        variant: 'success'
      });
      setConfirmAction({ type: null, isOpen: false });
    } catch (error) {
      toast({
        title: 'Error Ending Program',
        description: error.message || 'An unexpected error occurred.',
        variant: 'error'
      });
    }
  };
  
  const handleEditProgram = () => {
    router.push(`/programs/${programId}/settings`);
  };
  
  const renderActionConfirmation = () => {
    if (!confirmAction.type) return null;
    
    const actions = {
      pause: {
        title: 'Pause Program',
        description: 'Pausing will temporarily stop new touchpoints from being sent. Workers will maintain their current progress. You can resume the program later.',
        action: handlePauseProgram,
        isLoading: isPausing
      },
      resume: {
        title: 'Resume Program',
        description: 'Resuming will continue touchpoint delivery from where workers left off.',
        action: handleResumeProgram,
        isLoading: isResuming
      },
      end: {
        title: 'End Program',
        description: 'This will permanently end the program before its scheduled completion date. This action cannot be undone.',
        action: handleEndProgram,
        isLoading: isEnding
      }
    };
    
    const currentAction = actions[confirmAction.type];
    
    return (
      <AlertDialog
        open={confirmAction.isOpen}
        onOpenChange={(isOpen) => setConfirmAction({ ...confirmAction, isOpen })}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>{currentAction.title}</AlertDialog.Title>
            <AlertDialog.Description>
              {currentAction.description}
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action 
              onClick={currentAction.action}
              disabled={currentAction.isLoading}
            >
              {currentAction.isLoading ? 'Processing...' : confirmAction.type}
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  };
  
  return (
    <div className="program-dashboard">
      <ProgramHeader
        program={program}
        onActionTriggered={(action) => {
          if (action === 'pause') {
            setConfirmAction({ type: 'pause', isOpen: true });
          } else if (action === 'resume') {
            setConfirmAction({ type: 'resume', isOpen: true });
          } else if (action === 'end') {
            setConfirmAction({ type: 'end', isOpen: true });
          } else if (action === 'edit') {
            handleEditProgram();
          }
        }}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="journey">Journey Progress</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="program-overview-container">
            <ProgramOverview program={program} />
            <ProgramMetricsSection 
              program={program}
              metrics={programMetrics}
              isLoading={isLoadingMetrics}
            />
            <ProgramActivityFeed programId={programId} />
          </Card>
        </TabsContent>
        
        <TabsContent value="workers">
          <Card className="program-workers-container">
            <WorkerProgressTable programId={programId} />
          </Card>
        </TabsContent>
        
        <TabsContent value="journey">
          <Card className="program-journey-container">
            {/* Journey progress components */}
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card className="program-messages-container">
            <ProgramMessageLog programId={programId} />
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="program-analytics-container">
            {/* Analytics components */}
          </Card>
        </TabsContent>
      </Tabs>
      
      {renderActionConfirmation()}
    </div>
  );
};
```

This implementation demonstrates a complete Program Dashboard with tabs for different views, control actions, and proper loading/error states. Component complexity is managed by splitting into smaller, focused components for specific dashboard sections.

### Program Settings Pages

Program Settings pages provide interfaces for configuring various aspects of a program after its initial creation. These pages allow for fine-tuning program parameters and specialized configurations.

#### URL and Routing

- **Main Settings**: `/programs/:programId/settings`
- **Follow-up Rules**: `/programs/:programId/follow-up`
- **Conflict Settings**: `/programs/:programId/conflicts`
- **Feedback Management**: `/programs/:programId/feedback`

#### Component Structure

```typescript
// Main Settings Page
const ProgramSettingsPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Follow-up Rules Page
const ProgramFollowUpPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Conflict Settings Page
const ProgramConflictsPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Feedback Management Page
const ProgramFeedbackPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Settings Components
interface ProgramSettingsFormProps {
  program: Program;
  onSave: (settings: ProgramSettings) => Promise<void>;
  isLoading: boolean;
}

const ProgramSettingsForm: React.FC<ProgramSettingsFormProps> = (props) => {
  // Component implementation
};

interface FollowUpRulesEditorProps {
  programId: string;
  rules: FollowUpRules;
  onSave: (rules: FollowUpRules) => Promise<void>;
  isLoading: boolean;
}

const FollowUpRulesEditor: React.FC<FollowUpRulesEditorProps> = (props) => {
  // Component implementation
};

interface ConflictStrategyEditorProps {
  programId: string;
  strategy: ConflictStrategy;
  onSave: (strategy: ConflictStrategy) => Promise<void>;
  isLoading: boolean;
}

const ConflictStrategyEditor: React.FC<ConflictStrategyEditorProps> = (props) => {
  // Component implementation
};
```

#### Main Settings Layout

The Program Settings page typically follows this layout structure:

1. **Page Header**:
   - "Program Settings" title
   - Back to program button
   - Save/Cancel buttons

2. **Basic Settings Section**:
   - Program name field
   - Description field
   - Tags/categories

3. **Schedule Settings Section**:
   - Start/end date configuration
   - Timezone settings
   - Runtime date adjustments

4. **Delivery Settings Section**:
   - Message delivery windows
   - Frequency limits
   - Channel preferences

5. **Blueprint Settings Section**:
   - Blueprint order configuration
   - Blueprint-specific settings
   - Dependency configuration

6. **Advanced Settings Section**:
   - Links to specialized setting pages
   - Danger zone for destructive actions

#### Follow-up Rules Layout

The Follow-up Rules page layout includes:

1. **Page Header**:
   - "Follow-up Rules" title
   - Back to program button
   - Save/Cancel buttons

2. **Rules Overview**:
   - Global enable/disable toggle
   - Summary of existing rules
   - Add rule button

3. **Rule Editor**:
   - Touchpoint type selection
   - Reminder timing configuration
   - Maximum reminders setting
   - Escalation threshold configuration
   - Escalation action selection

4. **Rule Visualization**:
   - Timeline showing follow-up behavior
   - Preview of worker experience
   - Simulated scenarios

5. **Testing Tools**:
   - Rule testing interface
   - Simulation controls
   - Validation feedback

#### Conflict Strategy Layout

The Conflict Strategy page layout includes:

1. **Page Header**:
   - "Conflict Resolution Strategy" title
   - Back to program button
   - Save/Cancel buttons

2. **Strategy Configuration**:
   - Priority level setting
   - Handling strategy selection
   - Delay threshold configuration

3. **Conflict Simulator**:
   - Program overlap visualization
   - Worker experience preview
   - Conflict resolution examples

4. **Program Comparison**:
   - Table of potentially conflicting programs
   - Comparison of priority levels
   - Overlap analysis

#### Feedback Management Layout

The Feedback Management page layout includes:

1. **Page Header**:
   - "Program Feedback" title
   - Back to program button
   - Action buttons

2. **Feedback Listing**:
   - Filterable table of feedback items
   - Status indicators (read, responded)
   - Priority markers
   - Worker information

3. **Feedback Detail View**:
   - Full feedback content
   - Context (touchpoint, journey phase)
   - Response interface
   - Follow-up actions

4. **Analytics Section**:
   - Feedback trends
   - Common topics
   - Sentiment analysis
   - Response time metrics

#### UI States and Interactions

Program Settings pages handle these states:

1. **Form States**:
   - Pristine (unchanged)
   - Dirty (modified)
   - Validating
   - Submitting
   - Success
   - Error

2. **Permission-Based UI**:
   - Different controls based on user role
   - Disabled fields for read-only access
   - Hidden sections for restricted features

3. **Program Status-Based UI**:
   - Restricted edits for active programs
   - Read-only for completed programs
   - Full editing for draft/scheduled programs

Key interactions include:

1. **Save Operations**:
   - Form validation before submission
   - Optimistic UI updates
   - Success/error feedback
   - Dirty form warnings on navigation

2. **Rule Configurations**:
   - Add/edit/delete rules
   - Drag-and-drop reordering
   - Rule testing simulations
   - Preview generation

3. **Conflict Resolution**:
   - Interactive conflict visualization
   - What-if scenario testing
   - Priority adjustment tools
   - Overlap identification

#### API Integration

Settings pages integrate with these endpoints:

1. **Settings Management**:
   - `GET /programs/{programId}` for basic info
   - `PATCH /programs/{programId}` for updates
   - `GET /programs/{programId}/settings`
   - `PATCH /programs/{programId}/settings`

2. **Follow-up Rules**:
   - `GET /programs/{programId}/follow-up-config`
   - `PATCH /programs/{programId}/follow-up-config`

3. **Conflict Configuration**:
   - `GET /programs/{programId}/conflict-config`
   - `PATCH /programs/{programId}/conflict-config`

4. **Feedback Management**:
   - `GET /programs/{programId}/feedback`
   - `GET /programs/{programId}/feedback/{feedbackId}`
   - `POST /programs/{programId}/feedback/{feedbackId}/respond`

#### Implementation Example

Here's an example implementation of the Follow-up Rules editor:

```typescript
// src/components/features/programs/FollowUpRulesEditor.tsx
import React, { useState, useEffect } from 'react';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusIcon, TrashIcon } from '@/components/ui/icons';
import { useToast } from '@/hooks/useToast';
import { FollowUpRule, TouchpointType, EscalationAction } from '@/lib/types/program';

interface FollowUpRulesEditorProps {
  programId: string;
}

export const FollowUpRulesEditor: React.FC<FollowUpRulesEditorProps> = ({ programId }) => {
  const { toast } = useToast();
  const { 
    followUpRules,
    isLoading,
    error,
    updateFollowUpRules,
    isUpdating
  } = useProgramsApi.useFollowUpRules(programId);
  
  const [localRules, setLocalRules] = useState<{
    enabled: boolean;
    strategies: FollowUpRule[];
  }>({
    enabled: false,
    strategies: []
  });
  
  const [isDirty, setIsDirty] = useState(false);
  
  useEffect(() => {
    if (followUpRules && !isLoading) {
      setLocalRules(followUpRules);
      setIsDirty(false);
    }
  }, [followUpRules, isLoading]);
  
  const handleToggleEnabled = () => {
    setLocalRules(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
    setIsDirty(true);
  };
  
  const handleAddStrategy = () => {
    const newStrategy: FollowUpRule = {
      touchpoint_types: ['message'],
      reminder_delay_hours: 24,
      max_reminders: 2,
      escalation_threshold: 3,
      escalation_action: 'notify_manager'
    };
    
    setLocalRules(prev => ({
      ...prev,
      strategies: [...prev.strategies, newStrategy]
    }));
    setIsDirty(true);
  };
  
  const handleRemoveStrategy = (index: number) => {
    setLocalRules(prev => ({
      ...prev,
      strategies: prev.strategies.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };
  
  const handleStrategyChange = (index: number, field: keyof FollowUpRule, value: any) => {
    setLocalRules(prev => ({
      ...prev,
      strategies: prev.strategies.map((strategy, i) => {
        if (i === index) {
          return { ...strategy, [field]: value };
        }
        return strategy;
      })
    }));
    setIsDirty(true);
  };
  
  const handleSave = async () => {
    try {
      await updateFollowUpRules(localRules);
      setIsDirty(false);
      toast({
        title: 'Follow-up Rules Saved',
        description: 'The follow-up rules have been updated successfully.',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error Saving Rules',
        description: error.message || 'An unexpected error occurred.',
        variant: 'error'
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <p>Loading follow-up rules...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-red-500">Error loading follow-up rules: {error.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }
  
  const touchpointTypes: TouchpointType[] = [
    'message',
    'quiz',
    'reflection',
    'media',
    'assessment'
  ];
  
  const escalationActions: Record<EscalationAction, string> = {
    'notify_manager': 'Notify Program Manager',
    'change_channel': 'Try Alternative Channel',
    'none': 'No Escalation'
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Rules Configuration</CardTitle>
        <p className="text-muted-foreground">
          Configure how the system should follow up with workers who don't respond to touchpoints.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Label htmlFor="enable-followups" className="text-base font-medium">
              Enable Follow-up Rules
            </Label>
            <p className="text-sm text-muted-foreground">
              When enabled, the system will automatically send reminders based on the rules below.
            </p>
          </div>
          <Switch
            id="enable-followups"
            checked={localRules.enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>
        
        <div className="space-y-6">
          {localRules.strategies.map((strategy, index) => (
            <div 
              key={index} 
              className="bg-muted p-4 rounded-lg relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveStrategy(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              
              <h3 className="font-medium mb-4">Strategy {index + 1}</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label>Touchpoint Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {touchpointTypes.map(type => (
                      <Button
                        key={type}
                        variant={strategy.touchpoint_types.includes(type) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newTypes = strategy.touchpoint_types.includes(type)
                            ? strategy.touchpoint_types.filter(t => t !== type)
                            : [...strategy.touchpoint_types, type];
                          handleStrategyChange(index, 'touchpoint_types', newTypes);
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`reminder-delay-${index}`}>
                      Reminder Delay (hours)
                    </Label>
                    <Input
                      id={`reminder-delay-${index}`}
                      type="number"
                      min={1}
                      max={168}
                      value={strategy.reminder_delay_hours}
                      onChange={(e) => handleStrategyChange(
                        index, 
                        'reminder_delay_hours', 
                        parseInt(e.target.value)
                      )}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`max-reminders-${index}`}>
                      Maximum Reminders
                    </Label>
                    <Input
                      id={`max-reminders-${index}`}
                      type="number"
                      min={0}
                      max={10}
                      value={strategy.max_reminders}
                      onChange={(e) => handleStrategyChange(
                        index, 
                        'max_reminders', 
                        parseInt(e.target.value)
                      )}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`escalation-threshold-${index}`}>
                      Escalation Threshold
                    </Label>
                    <Input
                      id={`escalation-threshold-${index}`}
                      type="number"
                      min={1}
                      max={20}
                      value={strategy.escalation_threshold}
                      onChange={(e) => handleStrategyChange(
                        index, 
                        'escalation_threshold', 
                        parseInt(e.target.value)
                      )}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of missed touchpoints before escalation
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor={`escalation-action-${index}`}>
                      Escalation Action
                    </Label>
                    <Select
                      value={strategy.escalation_action}
                      onValueChange={(value) => handleStrategyChange(
                        index, 
                        'escalation_action', 
                        value as EscalationAction
                      )}
                    >
                      <SelectTrigger id={`escalation-action-${index}`} className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(escalationActions).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleAddStrategy}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Strategy
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Rules'}
        </Button>
      </CardFooter>
    </Card>
  );
};
```

This implementation demonstrates a complete Follow-up Rules editor with rule management, validation, and a clean UI. Similar approaches would be used for other settings pages, with specialized interfaces for each configuration domain.

### Program-Worker Progress View

The Program-Worker Progress View provides a detailed interface for monitoring and managing individual worker progress within a program. This view allows Program Managers to drill down into specific worker journeys, review responses, and take targeted actions.

#### URL and Routing

- **Worker Progress List**: `/programs/:programId/workers`
- **Individual Worker View**: `/programs/:programId/workers/:workerId`

#### Component Structure

```typescript
// Worker List Page
const ProgramWorkersPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Individual Worker Page
const ProgramWorkerDetailPage: React.FC = () => {
  // Component implementation using programId and workerId from route params
};

// Worker Progress Components
interface WorkerProgressTableProps {
  programId: string;
  filters: WorkerProgressFilters;
  onFilterChange: (filters: Partial<WorkerProgressFilters>) => void;
  onWorkerSelect: (workerId: string) => void;
}

const WorkerProgressTable: React.FC<WorkerProgressTableProps> = (props) => {
  // Component implementation
};

interface WorkerJourneyTimelineProps {
  programId: string;
  workerId: string;
  journeyBlueprintId?: string;
}

const WorkerJourneyTimeline: React.FC<WorkerJourneyTimelineProps> = (props) => {
  // Component implementation
};

interface WorkerCommunicationLogProps {
  programId: string;
  workerId: string;
  limit?: number;
}

const WorkerCommunicationLog: React.FC<WorkerCommunicationLogProps> = (props) => {
  // Component implementation
};
```

#### Worker List Layout

The Worker Progress List page typically follows this layout structure:

1. **Page Header**:
   - "Program Workers" title
   - Back to program button
   - Search and filter controls
   - Batch action buttons

2. **Filter Panel**:
   - Status filter (Active, At Risk, Completed, etc.)
   - Segment filter
   - Progress threshold filter
   - Date range filters
   - Performance filters (quiz scores, etc.)

3. **Worker Table**:
   - Worker name/ID column
   - Status indicator column
   - Progress percentage column
   - Last activity timestamp column
   - Current position column (phase/touchpoint)
   - Performance metrics columns
   - Action menu column

4. **Batch Action Tools**:
   - Select all/none controls
   - Actions for selected workers:
     - Send message
     - Pause participation
     - Resume participation
     - Remove from program

#### Individual Worker Layout

The Individual Worker Progress page typically follows this layout structure:

1. **Page Header**:
   - Worker name and program name
   - Back to workers list button
   - Worker status badge
   - Action buttons

2. **Worker Overview Panel**:
   - Worker profile summary (name, ID, contact)
   - Program enrollment details (date, status)
   - Progress summary (completion percentage, current phase)
   - Key metrics (engagement score, quiz average)

3. **Journey Timeline Visualization**:
   - Visual representation of the worker's journey progress
   - Completed touchpoints with timestamps
   - Current position indicator
   - Upcoming touchpoints
   - Branching path visualization if applicable

4. **Response History Panel**:
   - Collapsible sections for each touchpoint
   - Response content (text, media, quiz answers)
   - Submission timestamps
   - Performance metrics (scores, time spent)
   - Worker feedback if provided

5. **Communication Log**:
   - Complete message history
   - Delivery status indicators
   - Response linking
   - Message content preview/details

6. **Action Panel**:
   - Send manual message interface
   - Update progress interface (skip touchpoint, mark complete)
   - Pause/resume controls
   - Remove from program option

#### UI States and Interactions

Worker progress views handle these states:

1. **Filtering States**:
   - Applied filters with clear indicators
   - Empty results messaging
   - Filter clearing options

2. **Selection States**:
   - Individual row selection
   - Bulk selection (all, none, filtered)
   - Selected items count and summary

3. **Loading States**:
   - Progressive loading of worker data
   - Pagination loading indicators
   - Lazy loading of detailed response data

4. **Action States**:
   - Confirmation dialogs for significant actions
   - Loading indicators during action processing
   - Success/error feedback after actions complete

Key interactions include:

1. **Worker Navigation**:
   - Clicking a worker row navigates to individual view
   - Back button returns to list with filters preserved
   - Keyboard navigation between workers

2. **Timeline Interaction**:
   - Clickable touchpoints to view details
   - Pan/zoom controls for complex journeys
   - Expand/collapse journey phases

3. **Response Viewing**:
   - Expanding touchpoint entries to view full responses
   - Media playback for audio/video responses
   - Quiz answer review with correct/incorrect marking

4. **Manual Interventions**:
   - Message composition interface with templates
   - Progress update tools with audit logging
   - Status override controls with confirmation

#### API Integration

Worker progress views integrate with these endpoints:

1. **Worker Listing**:
   - `GET /programs/{programId}/workers` with filtering and pagination
   - `POST /programs/{programId}/workers/actions/batch` for bulk operations

2. **Individual Worker**:
   - `GET /programs/{programId}/workers/{workerId}/state` for progress state
   - `GET /programs/{programId}/workers/{workerId}/timeline` for journey timeline
   - `GET /programs/{programId}/workers/{workerId}/responses` for response history
   - `GET /programs/{programId}/workers/{workerId}/messages` for message log

3. **Worker Actions**:
   - `POST /programs/{programId}/workers/{workerId}/actions/send-message`
   - `POST /programs/{programId}/workers/{workerId}/actions/pause`
   - `POST /programs/{programId}/workers/{workerId}/actions/resume`
   - `PATCH /programs/{programId}/workers/{workerId}/state` for progress updates
   - `DELETE /programs/{programId}/workers/{workerId}` for removal

#### Implementation Example

Here's an example implementation of the Worker Journey Timeline component:

```typescript
// src/components/features/programs/WorkerJourneyTimeline.tsx
import React, { useState } from 'react';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  AlertTriangleIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@/components/ui/icons';
import { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface WorkerJourneyTimelineProps {
  programId: string;
  workerId: string;
  journeyBlueprintId?: string;
}

export const WorkerJourneyTimeline: React.FC<WorkerJourneyTimelineProps> = ({
  programId,
  workerId,
  journeyBlueprintId
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [expandedTouchpoint, setExpandedTouchpoint] = useState<string | null>(null);
  
  const { 
    workerTimeline, 
    isLoading, 
    error 
  } = useProgramsApi.useWorkerTimeline(programId, workerId, { 
    journeyBlueprintId 
  });
  
  const { 
    workerResponses, 
    isLoading: isLoadingResponses 
  } = useProgramsApi.useWorkerResponses(
    programId, 
    workerId, 
    expandedTouchpoint ? { touchpointId: expandedTouchpoint } : null
  );
  
  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };
  
  const selectTouchpoint = (touchpointId: string) => {
    setExpandedTouchpoint(prev => prev === touchpointId ? null : touchpointId);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <LoadingSpinner />
          <p className="ml-2">Loading worker journey...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !workerTimeline) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-red-500">Error loading worker journey: {error?.message || 'Unknown error'}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const { journeys, currentPosition } = workerTimeline;
  
  const getTouchpointStatusIcon = (touchpoint) => {
    if (touchpoint.completed_at) {
      return <CheckCircleIcon className="h-5 w-5 text-success" />;
    }
    
    if (touchpoint.id === currentPosition?.touchpoint_id) {
      return <ClockIcon className="h-5 w-5 text-primary animate-pulse" />;
    }
    
    if (touchpoint.delivery_attempts > 0 && !touchpoint.completed_at) {
      return <AlertTriangleIcon className="h-5 w-5 text-warning" />;
    }
    
    return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Journey Progress</CardTitle>
      </CardHeader>
      
      <CardContent>
        {journeys.map(journey => (
          <div key={journey.id} className="mb-8">
            <h3 className="text-lg font-medium mb-4">{journey.title}</h3>
            
            <div className="space-y-4">
              {journey.phases.map(phase => (
                <div 
                  key={phase.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-4 bg-muted cursor-pointer"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center">
                      <Badge variant={phase.is_completed ? "success" : phase.is_current ? "primary" : "outline"}>
                        {phase.is_completed ? 'Completed' : phase.is_current ? 'Current' : 'Upcoming'}
                      </Badge>
                      <h4 className="font-medium ml-3">{phase.name}</h4>
                      <p className="text-sm text-muted-foreground ml-3">
                        {phase.completion_percentage}% complete
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expandedPhases[phase.id] ? 
                        <ChevronDownIcon className="h-4 w-4" /> : 
                        <ChevronRightIcon className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  
                  {expandedPhases[phase.id] && (
                    <div className="p-2">
                      <div className="space-y-1">
                        {phase.touchpoints.map(touchpoint => (
                          <div 
                            key={touchpoint.id}
                            className={`
                              p-3 rounded-md flex items-start justify-between
                              ${touchpoint.id === expandedTouchpoint ? 'bg-muted' : 'hover:bg-muted/50'}
                              ${touchpoint.id === currentPosition?.touchpoint_id ? 'border-l-4 border-primary pl-2' : ''}
                              cursor-pointer
                            `}
                            onClick={() => selectTouchpoint(touchpoint.id)}
                          >
                            <div className="flex items-start">
                              <div className="mr-3 mt-1">
                                {getTouchpointStatusIcon(touchpoint)}
                              </div>
                              <div>
                                <div className="font-medium">{touchpoint.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {touchpoint.type}
                                  {touchpoint.delivery_date && (
                                    <span className="ml-2">
                                      Delivered: {formatDate(touchpoint.delivery_date)}
                                    </span>
                                  )}
                                  {touchpoint.completed_at && (
                                    <span className="ml-2">
                                      Completed: {formatDate(touchpoint.completed_at)}
                                    </span>
                                  )}
                                  {touchpoint.delivery_attempts > 1 && (
                                    <span className="ml-2 text-warning">
                                      {touchpoint.delivery_attempts} attempts
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Implementation for marking touchpoint as complete/incomplete
                                    }}
                                  >
                                    {touchpoint.completed_at ? 
                                      <CheckCircleIcon className="h-4 w-4 text-success" /> : 
                                      <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                    }
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {touchpoint.completed_at ? 
                                    'Mark as incomplete' : 
                                    'Mark as complete'
                                  }
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {expandedTouchpoint && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Touchpoint Details</h3>
            
            {isLoadingResponses ? (
              <div className="flex justify-center p-4">
                <LoadingSpinner size="small" />
                <p className="ml-2">Loading response data...</p>
              </div>
            ) : workerResponses && workerResponses.length > 0 ? (
              <Tabs defaultValue="response">
                <TabsList>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="response">
                  <Card>
                    <CardContent className="p-4">
                      {workerResponses.map(response => (
                        <div key={response.id} className="space-y-4">
                          <div>
                            <h4 className="font-medium">Response Data</h4>
                            {response.text_response && (
                              <p className="mt-2 p-3 bg-muted rounded-md">
                                {response.text_response}
                              </p>
                            )}
                            {response.media_url && (
                              <div className="mt-2">
                                {response.media_type?.includes('image') ? (
                                  <img 
                                    src={response.media_url} 
                                    alt="Worker response" 
                                    className="max-w-full h-auto rounded-md"
                                  />
                                ) : response.media_type?.includes('video') ? (
                                  <video
                                    src={response.media_url}
                                    controls
                                    className="max-w-full rounded-md"
                                  />
                                ) : response.media_type?.includes('audio') ? (
                                  <audio
                                    src={response.media_url}
                                    controls
                                    className="w-full"
                                  />
                                ) : (
                                  <a 
                                    href={response.media_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                  >
                                    View attached file
                                  </a>
                                )}
                              </div>
                            )}
                            {response.quiz_answers && (
                              <div className="mt-2 space-y-2">
                                {response.quiz_answers.map((answer, index) => (
                                  <div 
                                    key={index}
                                    className={`
                                      p-2 rounded-md
                                      ${answer.is_correct ? 'bg-success/10' : 'bg-destructive/10'}
                                    `}
                                  >
                                    <p className="font-medium">{answer.question}</p>
                                    <p>
                                      Answer: {answer.response}
                                      {answer.is_correct !== undefined && (
                                        <Badge 
                                          variant={answer.is_correct ? "success" : "destructive"}
                                          className="ml-2"
                                        >
                                          {answer.is_correct ? 'Correct' : 'Incorrect'}
                                        </Badge>
                                      )}
                                    </p>
                                    {!answer.is_correct && answer.correct_answer && (
                                      <p className="text-sm text-muted-foreground">
                                        Correct answer: {answer.correct_answer}
                                      </p>
                                    )}
                                  </div>
                                ))}
                                {response.score !== undefined && (
                                  <div className="mt-2">
                                    <p className="font-medium">
                                      Score: {response.score}%
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Response Metadata</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Submitted</p>
                                <p>{formatDate(response.submitted_at)}</p>
                              </div>
                              {response.response_time_seconds !== undefined && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Response Time</p>
                                  <p>{Math.floor(response.response_time_seconds / 60)}m {response.response_time_seconds % 60}s</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="content">
                  <Card>
                    <CardContent className="p-4">
                      {/* Content that was delivered to the worker */}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="delivery">
                  <Card>
                    <CardContent className="p-4">
                      {/* Delivery status information */}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <p>No response data available for this touchpoint.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

This implementation demonstrates a complete Worker Journey Timeline component with touchpoint visualization, response viewing, and interactive elements for exploring worker progress in detail.

### Program Analytics Dashboard

The Program Analytics Dashboard provides comprehensive visualizations and metrics to evaluate program effectiveness, identify trends, and extract actionable insights.

#### URL and Routing

- **Main Analytics**: `/programs/:programId/analytics`
- **Segment Comparison**: `/programs/:programId/analytics/segments`
- **Content Performance**: `/programs/:programId/analytics/content`
- **Export and Reports**: `/programs/:programId/analytics/reports`

#### Component Structure

```typescript
// Main Analytics Page
const ProgramAnalyticsPage: React.FC = () => {
  // Component implementation using programId from route params
};

// Analytics Components
interface ProgramMetricsDashboardProps {
  programId: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const ProgramMetricsDashboard: React.FC<ProgramMetricsDashboardProps> = (props) => {
  // Component implementation
};

interface SegmentComparisonProps {
  programId: string;
  selectedSegmentIds: string[];
  onSegmentSelectionChange: (segmentIds: string[]) => void;
}

const SegmentComparison: React.FC<SegmentComparisonProps> = (props) => {
  // Component implementation
};

interface ContentPerformanceAnalysisProps {
  programId: string;
  filters: ContentPerformanceFilters;
  onFilterChange: (filters: Partial<ContentPerformanceFilters>) => void;
}

const ContentPerformanceAnalysis: React.FC<ContentPerformanceAnalysisProps> = (props) => {
  // Component implementation
};

interface ReportGeneratorProps {
  programId: string;
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = (props) => {
  // Component implementation
};
```

#### Main Analytics Layout

The Program Analytics Dashboard typically follows this layout structure:

1. **Page Header**:
   - "Program Analytics" title
   - Back to program button
   - Date range selector
   - Export/Share buttons

2. **Key Metrics Overview**:
   - Completion rate card
   - Engagement rate card
   - Average quiz score card
   - Worker count card

3. **Progress Metrics Section**:
   - Completion funnel visualization
   - Timeline chart of completions
   - Phase-level completion rates
   - Time-to-completion distribution

4. **Engagement Metrics Section**:
   - Response rate by touchpoint
   - Response time distribution
   - Channel effectiveness comparison
   - Engagement score distribution

5. **Performance Metrics Section**:
   - Quiz score distribution
   - Knowledge gain visualization (pre/post)
   - Assessment outcome breakdown
   - Skill acquisition metrics

6. **Wellbeing Metrics Section** (if applicable):
   - Wellbeing index trends
   - Sentiment analysis
   - Risk indicators
   - Support referral rates

#### Segment Comparison Layout

The Segment Comparison view typically includes:

1. **Segment Selection Controls**:
   - Multi-select interface for segments
   - Segment filter/search
   - Comparison configuration options

2. **Comparative Visualizations**:
   - Side-by-side or overlaid charts
   - Statistical significance indicators
   - Difference highlighting
   - Normalization controls

3. **Metric Category Tabs**:
   - Completion metrics comparison
   - Engagement metrics comparison
   - Performance metrics comparison
   - Wellbeing metrics comparison

4. **Insight Callouts**:
   - Automatically identified significant differences
   - Potential causality suggestions
   - Optimization recommendations

#### Content Performance Layout

The Content Performance view typically includes:

1. **Content Effectiveness Ranking**:
   - Sortable table of touchpoints
   - Effectiveness score visualization
   - Key performance indicators
   - Trend indicators

2. **Engagement Analysis**:
   - Response rate by content type
   - Time spent by content type
   - Drop-off points visualization
   - Re-engagement patterns

3. **Message Analysis**:
   - Delivery success rates
   - Media type effectiveness
   - Message length impact
   - Timing effectiveness

4. **Quiz Performance**:
   - Question difficulty analysis
   - Answer distribution charts
   - Knowledge gap identification
   - Improvement opportunities

#### Reports and Exports Layout

The Reports and Exports view typically includes:

1. **Report Template Gallery**:
   - Pre-configured report templates
   - Preview thumbnails
   - Purpose descriptions
   - Target audience suggestions

2. **Report Customization Interface**:
   - Template selection
   - Section inclusion/exclusion
   - Metric selection
   - Visualization customization

3. **Export Options**:
   - Format selection (PDF, PowerPoint, Excel)
   - Data granularity options
   - Scheduled export configuration
   - Sharing and permission settings

4. **Saved Reports Library**:
   - Previously generated reports
   - Sharing status indicators
   - Download/regenerate options
   - Version history

#### UI States and Interactions

Analytics interfaces handle these states:

1. **Loading States**:
   - Initial data loading
   - Progressive visualization rendering
   - Background data fetching
   - Placeholder visualizations during computation

2. **Filtering States**:
   - Applied filters with visual indicators
   - Reset options
   - Filter combinations impact preview
   - Constraint enforcement

3. **View Configuration States**:
   - Chart type selection
   - Grouping/aggregation options
   - Scale adjustments (linear, logarithmic)
   - Color scheme selection

4. **Interaction States**:
   - Chart hover effects
   - Drill-down expansions
   - Element selection highlighting
   - Comparative selection

Key interactions include:

1. **Data Exploration**:
   - Zooming and panning on charts
   - Filtering by clicking chart elements
   - Tooltip expansions for details
   - Drill-down from overview to detail

2. **Comparison Selection**:
   - Adding/removing segments for comparison
   - A/B selection of alternatives
   - Before/after time period selection
   - Benchmark selection

3. **Report Generation**:
   - Template customization
   - Drag-and-drop report building
   - Live preview updates
   - Generation progress tracking

4. **Insight Interaction**:
   - Expanding automatic insights
   - Saving insights to report
   - Providing feedback on insight value
   - Requesting additional analysis

#### API Integration

Analytics interfaces integrate with these endpoints:

1. **Overall Analytics**:
   - `GET /programs/{programId}/analytics` with optional filters

2. **Segment Comparison**:
   - `GET /programs/{programId}/analytics/segments` with segment parameters

3. **Content Analysis**:
   - `GET /programs/{programId}/content-performance`

4. **Report Generation**:
   - `POST /programs/{programId}/reports`
   - `GET /programs/{programId}/reports/{reportId}`

5. **Export Functions**:
   - `POST /programs/{programId}/exports`
   - `GET /programs/{programId}/exports/{exportId}`

#### Implementation Example

Here's an example implementation of the Program Metrics Dashboard component:

```typescript
// src/components/features/programs/ProgramMetricsDashboard.tsx
import React, { useState } from 'react';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { 
  DownloadIcon, 
  RefreshIcon,
  Share2Icon
} from '@/components/ui/icons';
import { MetricCard } from '@/components/features/analytics/MetricCard';
import { CompletionFunnel } from '@/components/features/analytics/CompletionFunnel';
import { TimeSeriesChart } from '@/components/features/analytics/TimeSeriesChart';
import { DistributionChart } from '@/components/features/analytics/DistributionChart';
import { HeatmapChart } from '@/components/features/analytics/HeatmapChart';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPercentage, formatNumber } from '@/lib/utils';

interface ProgramMetricsDashboardProps {
  programId: string;
}

export const ProgramMetricsDashboard: React.FC<ProgramMetricsDashboardProps> = ({
  programId
}) => {
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    programMetrics, 
    isLoading, 
    error,
    refetch
  } = useProgramsApi.useProgramMetrics(programId, {
    startDate: dateRange.from,
    endDate: dateRange.to
  });
  
  const {
    exportMetrics,
    isExporting
  } = useProgramsApi.useExportMetrics(programId);
  
  const handleExport = async () => {
    try {
      await exportMetrics({
        format: 'excel',
        dateRange,
        metricGroups: ['completion', 'engagement', 'performance', 'wellbeing']
      });
    } catch (error) {
      console.error('Export failed:', error);
      // Show error toast
    }
  };
  
  const handleShareDashboard = () => {
    // Implementation for sharing dashboard (e.g., generate shareable link)
  };
  
  if (isLoading && !programMetrics) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
        <p className="ml-3">Loading program metrics...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive mb-4">Error loading metrics: {error.message}</p>
        <Button onClick={() => refetch()}>
          <RefreshIcon className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }
  
  const {
    completion = {},
    engagement = {},
    performance = {},
    wellbeing = {}
  } = programMetrics || {};
  
  return (
    <div className="program-metrics-dashboard">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Program Analytics</h2>
        
        <div className="flex items-center space-x-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            alignment="end"
          />
          
          <Button variant="outline" onClick={handleShareDashboard}>
            <Share2Icon className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={isExporting}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Completion Rate"
          value={formatPercentage(completion.overallCompletionRate)}
          trend={completion.completionRateTrend}
          trendLabel={`${formatPercentage(Math.abs(completion.completionRateTrend))} vs previous period`}
          icon="completion"
        />
        
        <MetricCard
          title="Engagement Rate"
          value={formatPercentage(engagement.overallEngagementRate)}
          trend={engagement.engagementRateTrend}
          trendLabel={`${formatPercentage(Math.abs(engagement.engagementRateTrend))} vs previous period`}
          icon="engagement"
        />
        
        <MetricCard
          title="Average Quiz Score"
          value={formatPercentage(performance.averageQuizScore)}
          trend={performance.quizScoreTrend}
          trendLabel={`${formatPercentage(Math.abs(performance.quizScoreTrend))} vs previous period`}
          icon="score"
        />
        
        <MetricCard
          title="Active Workers"
          value={formatNumber(completion.activeWorkerCount)}
          subtitle={`${formatPercentage(completion.workerCompletionRate)} completed`}
          icon="workers"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          {wellbeing.hasWellbeingData && (
            <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <CompletionFunnel data={completion.funnelData} height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart
                  data={completion.timeSeriesData}
                  height={300}
                  xAxisKey="date"
                  series={[
                    { key: 'completions', name: 'Completions', color: '#4C1D95' },
                    { key: 'activeWorkers', name: 'Active Workers', color: '#6D28D9' }
                  ]}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response Rates by Touchpoint Type</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={engagement.responseRatesByType}
                  height={300}
                  xAxisKey="type"
                  yAxisKey="rate"
                  colorKey="type"
                  tooltipFormatter={(value) => `${formatPercentage(value)} response rate`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quiz Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={performance.scoreDistribution}
                  height={300}
                  xAxisKey="scoreRange"
                  yAxisKey="count"
                  tooltipFormatter={(value, item) => `${item.count} workers (${formatPercentage(item.percentage)})`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completion">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion by Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={completion.phaseCompletionRates}
                  height={300}
                  xAxisKey="phase"
                  yAxisKey="completionRate"
                  tooltipFormatter={(value) => `${formatPercentage(value)} completion rate`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time to Completion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={completion.timeToCompletionDistribution}
                  height={300}
                  xAxisKey="daysRange"
                  yAxisKey="count"
                  tooltipFormatter={(value, item) => `${item.count} workers (${formatPercentage(item.percentage)})`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completion by Day of Week</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={completion.completionsByDayOfWeek}
                  height={300}
                  xAxisKey="day"
                  yAxisKey="count"
                  tooltipFormatter={(value) => `${value} completions`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completion by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={completion.completionsByHour}
                  height={300}
                  xAxisKey="hour"
                  yAxisKey="count"
                  tooltipFormatter={(value) => `${value} completions`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Rates by Touchpoint</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={engagement.responseRatesByTouchpoint}
                  height={300}
                  xAxisKey="touchpoint"
                  yAxisKey="responseRate"
                  tooltipFormatter={(value) => `${formatPercentage(value)} response rate`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={engagement.responseTimeDistribution}
                  height={300}
                  xAxisKey="timeRange"
                  yAxisKey="count"
                  tooltipFormatter={(value, item) => `${item.count} responses (${formatPercentage(item.percentage)})`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapChart
                  data={engagement.engagementHeatmap}
                  height={300}
                  xAxisKey="dayOfWeek"
                  yAxisKey="hourOfDay"
                  valueKey="responseCount"
                  tooltipFormatter={(value) => `${value} responses`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Message Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  data={engagement.deliveryPerformance}
                  height={300}
                  xAxisKey="status"
                  yAxisKey="count"
                  tooltipFormatter={(value, item) => `${item.count} messages (${formatPercentage(item.percentage)})`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          {/* Performance metrics visualizations */}
        </TabsContent>
        
        {wellbeing.hasWellbeingData && (
          <TabsContent value="wellbeing">
            {/* Wellbeing metrics visualizations */}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
```

This implementation demonstrates a comprehensive Program Metrics Dashboard with key metrics overview, tabbed visualization sections, interactive charts, and export functionality.

## API Integration

Effective integration with the platform's backend APIs is critical for the Program Management functionality. This section details the API integration patterns, error handling approaches, and performance considerations for Program-related features.

### Program Endpoints

The Program Management frontend interacts with several key API endpoints across different aspects of program functionality:

#### Core Program Operations

```typescript
// src/lib/api/endpoints/programs.ts

import { apiClient } from '@/lib/api/client';
import type { 
  Program, 
  ProgramCreateParams, 
  ProgramUpdateParams,
  ProgramFilters,
  PaginatedResponse 
} from '@/lib/types/program';

/**
 * Fetch programs with optional filtering, pagination, and sorting
 */
export const getPrograms = async (
  filters: ProgramFilters = {}
): Promise<PaginatedResponse<Program>> => {
  const queryParams = new URLSearchParams();
  
  // Add filter parameters
  if (filters.status && filters.status.length) {
    filters.status.forEach(status => queryParams.append('status', status));
  }
  
  if (filters.startDateFrom) {
    queryParams.append('start_date_from', filters.startDateFrom.toISOString());
  }
  
  if (filters.startDateTo) {
    queryParams.append('start_date_to', filters.startDateTo.toISOString());
  }
  
  // Add pagination parameters
  if (filters.page) {
    queryParams.append('page', filters.page.toString());
  }
  
  if (filters.limit) {
    queryParams.append('limit', filters.limit.toString());
  }
  
  // Add sorting parameters
  if (filters.sortBy) {
    queryParams.append('sort_by', filters.sortBy);
    queryParams.append('sort_direction', filters.sortDirection || 'asc');
  }
  
  // Add search term if provided
  if (filters.searchTerm) {
    queryParams.append('search', filters.searchTerm);
  }
  
  const response = await apiClient.get(`/programs?${queryParams.toString()}`);
  return response.data;
};

/**
 * Fetch details for a specific program
 */
export const getProgram = async (programId: string): Promise<Program> => {
  const response = await apiClient.get(`/programs/${programId}`);
  return response.data;
};

/**
 * Create a new program
 */
export const createProgram = async (
  params: ProgramCreateParams
): Promise<Program> => {
  const response = await apiClient.post('/programs', params);
  return response.data;
};

/**
 * Update an existing program
 */
export const updateProgram = async (
  programId: string,
  params: ProgramUpdateParams
): Promise<Program> => {
  const response = await apiClient.patch(`/programs/${programId}`, params);
  return response.data;
};

/**
 * Delete a program (draft only)
 */
export const deleteProgram = async (programId: string): Promise<void> => {
  await apiClient.delete(`/programs/${programId}`);
};

/**
 * Program control actions (pause, resume, end)
 */
export const pauseProgram = async (
  programId: string,
  reason?: string
): Promise<Program> => {
  const response = await apiClient.post(`/programs/${programId}/actions/pause`, {
    reason
  });
  return response.data;
};

export const resumeProgram = async (programId: string): Promise<Program> => {
  const response = await apiClient.post(`/programs/${programId}/actions/resume`);
  return response.data;
};

export const endProgram = async (
  programId: string,
  reason?: string
): Promise<Program> => {
  const response = await apiClient.post(`/programs/${programId}/actions/end`, {
    reason
  });
  return response.data;
};
```

#### Worker Management

```typescript
// src/lib/api/endpoints/programs-workers.ts

import { apiClient } from '@/lib/api/client';
import type { 
  WorkerAssignment, 
  WorkerProgress,
  WorkerTimeline,
  WorkerResponse,
  WorkerMessage,
  WorkerFilters,
  PaginatedResponse 
} from '@/lib/types/program';

/**
 * List workers enrolled in a program
 */
export const getProgramWorkers = async (
  programId: string,
  filters: WorkerFilters = {}
): Promise<PaginatedResponse<WorkerAssignment>> => {
  const queryParams = new URLSearchParams();
  
  // Add filter parameters
  if (filters.status && filters.status.length) {
    filters.status.forEach(status => queryParams.append('status', status));
  }
  
  if (filters.segmentIds && filters.segmentIds.length) {
    filters.segmentIds.forEach(id => queryParams.append('segment_id', id));
  }
  
  // Add pagination parameters
  if (filters.page) {
    queryParams.append('page', filters.page.toString());
  }
  
  if (filters.limit) {
    queryParams.append('limit', filters.limit.toString());
  }
  
  // Add search term if provided
  if (filters.searchTerm) {
    queryParams.append('search', filters.searchTerm);
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/workers?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get detailed state for a specific worker in a program
 */
export const getWorkerState = async (
  programId: string,
  workerId: string
): Promise<WorkerAssignment> => {
  const response = await apiClient.get(`/programs/${programId}/workers/${workerId}/state`);
  return response.data;
};

/**
 * Get worker journey timeline (phases, touchpoints, progress)
 */
export const getWorkerTimeline = async (
  programId: string,
  workerId: string,
  options: { journeyBlueprintId?: string } = {}
): Promise<WorkerTimeline> => {
  const queryParams = new URLSearchParams();
  
  if (options.journeyBlueprintId) {
    queryParams.append('journey_blueprint_id', options.journeyBlueprintId);
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/workers/${workerId}/timeline?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get worker responses to touchpoints
 */
export const getWorkerResponses = async (
  programId: string,
  workerId: string,
  options: { touchpointId?: string } = {}
): Promise<WorkerResponse[]> => {
  const queryParams = new URLSearchParams();
  
  if (options.touchpointId) {
    queryParams.append('touchpoint_id', options.touchpointId);
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/workers/${workerId}/responses?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get message history for a worker in a program
 */
export const getWorkerMessages = async (
  programId: string,
  workerId: string,
  options: { limit?: number; before?: string } = {}
): Promise<WorkerMessage[]> => {
  const queryParams = new URLSearchParams();
  
  if (options.limit) {
    queryParams.append('limit', options.limit.toString());
  }
  
  if (options.before) {
    queryParams.append('before', options.before);
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/workers/${workerId}/messages?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Update worker state in program (manual override)
 */
export const updateWorkerState = async (
  programId: string,
  workerId: string,
  update: {
    status?: string;
    currentTouchpointId?: string;
    completedTouchpointIds?: string[];
  }
): Promise<WorkerAssignment> => {
  const response = await apiClient.patch(
    `/programs/${programId}/workers/${workerId}/state`,
    update
  );
  return response.data;
};

/**
 * Send a manual message to a worker
 */
export const sendManualMessage = async (
  programId: string,
  workerId: string,
  message: {
    content: string;
    templateId?: string;
    mediaUrl?: string;
  }
): Promise<WorkerMessage> => {
  const response = await apiClient.post(
    `/programs/${programId}/workers/${workerId}/messages`,
    message
  );
  return response.data;
};

/**
 * Pause a worker's participation in a program
 */
export const pauseWorker = async (
  programId: string,
  workerId: string,
  options: { reason?: string; durationDays?: number } = {}
): Promise<WorkerAssignment> => {
  const response = await apiClient.post(
    `/programs/${programId}/workers/${workerId}/pause`,
    options
  );
  return response.data;
};

/**
 * Resume a worker's participation in a program
 */
export const resumeWorker = async (
  programId: string,
  workerId: string
): Promise<WorkerAssignment> => {
  const response = await apiClient.post(
    `/programs/${programId}/workers/${workerId}/resume`
  );
  return response.data;
};

/**
 * Remove a worker from a program
 */
export const removeWorker = async (
  programId: string,
  workerId: string,
  options: { reason?: string } = {}
): Promise<void> => {
  await apiClient.delete(
    `/programs/${programId}/workers/${workerId}`,
    { data: options }
  );
};
```

#### Program Analytics

```typescript
// src/lib/api/endpoints/program-analytics.ts

import { apiClient } from '@/lib/api/client';
import type { 
  ProgramMetrics, 
  SegmentComparison,
  ContentPerformance,
  AnalyticsFilters,
  ExportOptions,
  ReportOptions,
  ReportResult,
  ExportResult
} from '@/lib/types/program-analytics';

/**
 * Get overall program metrics and analytics
 */
export const getProgramMetrics = async (
  programId: string,
  filters: AnalyticsFilters = {}
): Promise<ProgramMetrics> => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) {
    queryParams.append('start_date', filters.startDate.toISOString());
  }
  
  if (filters.endDate) {
    queryParams.append('end_date', filters.endDate.toISOString());
  }
  
  if (filters.segmentIds && filters.segmentIds.length) {
    filters.segmentIds.forEach(id => queryParams.append('segment_id', id));
  }
  
  if (filters.journeyBlueprintIds && filters.journeyBlueprintIds.length) {
    filters.journeyBlueprintIds.forEach(id => 
      queryParams.append('journey_blueprint_id', id)
    );
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/analytics?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get segment comparison analytics
 */
export const getSegmentComparison = async (
  programId: string,
  segmentIds: string[],
  filters: AnalyticsFilters = {}
): Promise<SegmentComparison> => {
  const queryParams = new URLSearchParams();
  
  segmentIds.forEach(id => queryParams.append('segment_id', id));
  
  if (filters.startDate) {
    queryParams.append('start_date', filters.startDate.toISOString());
  }
  
  if (filters.endDate) {
    queryParams.append('end_date', filters.endDate.toISOString());
  }
  
  if (filters.metricCategories && filters.metricCategories.length) {
    filters.metricCategories.forEach(category => 
      queryParams.append('metric_category', category)
    );
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/analytics/segments?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get content performance analytics
 */
export const getContentPerformance = async (
  programId: string,
  filters: AnalyticsFilters = {}
): Promise<ContentPerformance> => {
  const queryParams = new URLSearchParams();
  
  if (filters.contentType) {
    queryParams.append('content_type', filters.contentType);
  }
  
  if (filters.phaseId) {
    queryParams.append('phase_id', filters.phaseId);
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/content-performance?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Generate an analytics export
 */
export const exportProgramAnalytics = async (
  programId: string,
  options: ExportOptions
): Promise<ExportResult> => {
  const response = await apiClient.post(
    `/programs/${programId}/exports`,
    options
  );
  return response.data;
};

/**
 * Generate a program report
 */
export const generateProgramReport = async (
  programId: string,
  options: ReportOptions
): Promise<ReportResult> => {
  const response = await apiClient.post(
    `/programs/${programId}/reports`,
    options
  );
  return response.data;
};

/**
 * Get a program report by ID
 */
export const getProgramReport = async (
  programId: string,
  reportId: string
): Promise<ReportResult> => {
  const response = await apiClient.get(
    `/programs/${programId}/reports/${reportId}`
  );
  return response.data;
};
```

#### Program Configuration

```typescript
// src/lib/api/endpoints/program-config.ts

import { apiClient } from '@/lib/api/client';
import type { 
  ProgramSettings, 
  FollowUpRules,
  ConflictStrategy,
  ProgramFeedback,
  FeedbackFilters,
  PaginatedResponse
} from '@/lib/types/program';

/**
 * Get program settings
 */
export const getProgramSettings = async (
  programId: string
): Promise<ProgramSettings> => {
  const response = await apiClient.get(`/programs/${programId}/settings`);
  return response.data;
};

/**
 * Update program settings
 */
export const updateProgramSettings = async (
  programId: string,
  settings: Partial<ProgramSettings>
): Promise<ProgramSettings> => {
  const response = await apiClient.patch(
    `/programs/${programId}/settings`,
    settings
  );
  return response.data;
};

/**
 * Get follow-up rules configuration
 */
export const getFollowUpRules = async (
  programId: string
): Promise<FollowUpRules> => {
  const response = await apiClient.get(`/programs/${programId}/follow-up-config`);
  return response.data;
};

/**
 * Update follow-up rules configuration
 */
export const updateFollowUpRules = async (
  programId: string,
  rules: FollowUpRules
): Promise<FollowUpRules> => {
  const response = await apiClient.patch(
    `/programs/${programId}/follow-up-config`,
    rules
  );
  return response.data;
};

/**
 * Get conflict resolution strategy
 */
export const getConflictStrategy = async (
  programId: string
): Promise<ConflictStrategy> => {
  const response = await apiClient.get(`/programs/${programId}/conflict-config`);
  return response.data;
};

/**
 * Update conflict resolution strategy
 */
export const updateConflictStrategy = async (
  programId: string,
  strategy: ConflictStrategy
): Promise<ConflictStrategy> => {
  const response = await apiClient.patch(
    `/programs/${programId}/conflict-config`,
    strategy
  );
  return response.data;
};

/**
 * Get program feedback entries
 */
export const getProgramFeedback = async (
  programId: string,
  filters: FeedbackFilters = {}
): Promise<PaginatedResponse<ProgramFeedback>> => {
  const queryParams = new URLSearchParams();
  
  if (filters.status) {
    queryParams.append('status', filters.status);
  }
  
  if (filters.type) {
    queryParams.append('type', filters.type);
  }
  
  if (filters.page) {
    queryParams.append('page', filters.page.toString());
  }
  
  if (filters.limit) {
    queryParams.append('limit', filters.limit.toString());
  }
  
  const response = await apiClient.get(
    `/programs/${programId}/feedback?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get a specific feedback entry
 */
export const getFeedbackEntry = async (
  programId: string,
  feedbackId: string
): Promise<ProgramFeedback> => {
  const response = await apiClient.get(
    `/programs/${programId}/feedback/${feedbackId}`
  );
  return response.data;
};

/**
 * Respond to a feedback entry
 */
export const respondToFeedback = async (
  programId: string,
  feedbackId: string,
  response: {
    message: string;
    actionTaken?: string;
  }
): Promise<ProgramFeedback> => {
  const apiResponse = await apiClient.post(
    `/programs/${programId}/feedback/${feedbackId}/respond`,
    response
  );
  return apiResponse.data;
};
```

### Custom API Hooks

To facilitate API integration throughout the Program Management UI, custom hooks are implemented that wrap the API endpoints and provide state management, caching, and error handling:

```typescript
// src/hooks/features/useProgramsApi.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPrograms, 
  getProgram, 
  createProgram,
  updateProgram,
  deleteProgram,
  pauseProgram,
  resumeProgram,
  endProgram 
} from '@/lib/api/endpoints/programs';
import { 
  getProgramWorkers,
  getWorkerState,
  getWorkerTimeline,
  getWorkerResponses,
  getWorkerMessages,
  updateWorkerState,
  sendManualMessage,
  pauseWorker,
  resumeWorker,
  removeWorker
} from '@/lib/api/endpoints/programs-workers';
import {
  getProgramMetrics,
  getSegmentComparison,
  getContentPerformance,
  exportProgramAnalytics,
  generateProgramReport
} from '@/lib/api/endpoints/program-analytics';
import {
  getProgramSettings,
  updateProgramSettings,
  getFollowUpRules,
  updateFollowUpRules,
  getConflictStrategy,
  updateConflictStrategy,
  getProgramFeedback,
  getFeedbackEntry,
  respondToFeedback
} from '@/lib/api/endpoints/program-config';

import type { 
  Program, 
  ProgramCreateParams,
  ProgramUpdateParams,
  ProgramFilters,
  WorkerFilters,
  AnalyticsFilters,
  ExportOptions,
  ReportOptions,
  FeedbackFilters
} from '@/lib/types/program';

/**
 * Hook for fetching all programs with filtering
 */
export const usePrograms = (filters: ProgramFilters = {}) => {
  return useQuery({
    queryKey: ['programs', filters],
    queryFn: () => getPrograms(filters),
    keepPreviousData: true
  });
};

/**
 * Hook for fetching a single program
 */
export const useProgram = (programId: string) => {
  return useQuery({
    queryKey: ['program', programId],
    queryFn: () => getProgram(programId),
    enabled: Boolean(programId)
  });
};

/**
 * Hook for creating a program
 */
export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (params: ProgramCreateParams) => createProgram(params),
    onSuccess: (newProgram) => {
      queryClient.invalidateQueries(['programs']);
      queryClient.setQueryData(['program', newProgram.id], newProgram);
    }
  });
  
  return {
    createProgram: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error
  };
};

/**
 * Hook for updating a program
 */
export const useUpdateProgram = (programId: string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (params: ProgramUpdateParams) => updateProgram(programId, params),
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries(['programs']);
      queryClient.setQueryData(['program', programId], updatedProgram);
    }
  });
  
  return {
    updateProgram: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error
  };
};

/**
 * Hook for controlling a program (pause, resume, end)
 */
export const useProgramControl = (programId: string) => {
  const queryClient = useQueryClient();
  
  const pauseMutation = useMutation({
    mutationFn: (reason?: string) => pauseProgram(programId, reason),
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries(['programs']);
      queryClient.setQueryData(['program', programId], updatedProgram);
    }
  });
  
  const resumeMutation = useMutation({
    mutationFn: () => resumeProgram(programId),
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries(['programs']);
      queryClient.setQueryData(['program', programId], updatedProgram);
    }
  });
  
  const endMutation = useMutation({
    mutationFn: (reason?: string) => endProgram(programId, reason),
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries(['programs']);
      queryClient.setQueryData(['program', programId], updatedProgram);
    }
  });
  
  return {
    pauseProgram: pauseMutation.mutateAsync,
    resumeProgram: resumeMutation.mutateAsync,
    endProgram: endMutation.mutateAsync,
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
    isEnding: endMutation.isPending,
    error: pauseMutation.error || resumeMutation.error || endMutation.error
  };
};

/**
 * Hook for fetching workers in a program
 */
export const useProgramWorkers = (
  programId: string,
  filters: WorkerFilters = {}
) => {
  return useQuery({
    queryKey: ['program', programId, 'workers', filters],
    queryFn: () => getProgramWorkers(programId, filters),
    keepPreviousData: true,
    enabled: Boolean(programId)
  });
};

/**
 * Hook for fetching worker timeline in a program
 */
export const useWorkerTimeline = (
  programId: string,
  workerId: string,
  options = {}
) => {
  return useQuery({
    queryKey: ['program', programId, 'worker', workerId, 'timeline', options],
    queryFn: () => getWorkerTimeline(programId, workerId, options),
    enabled: Boolean(programId) && Boolean(workerId)
  });
};

/**
 * Hook for fetching program metrics
 */
export const useProgramMetrics = (
  programId: string,
  filters: AnalyticsFilters = {}
) => {
  return useQuery({
    queryKey: ['program', programId, 'metrics', filters],
    queryFn: () => getProgramMetrics(programId, filters),
    enabled: Boolean(programId)
  });
};

/**
 * Hook for exporting program metrics
 */
export const useExportMetrics = (programId: string) => {
  const mutation = useMutation({
    mutationFn: (options: ExportOptions) => exportProgramAnalytics(programId, options)
  });
  
  return {
    exportMetrics: mutation.mutateAsync,
    isExporting: mutation.isPending,
    error: mutation.error,
    result: mutation.data
  };
};

/**
 * Hook for fetching and managing follow-up rules
 */
export const useFollowUpRules = (programId: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['program', programId, 'follow-up-rules'],
    queryFn: () => getFollowUpRules(programId),
    enabled: Boolean(programId)
  });
  
  const mutation = useMutation({
    mutationFn: (rules: any) => updateFollowUpRules(programId, rules),
    onSuccess: (updatedRules) => {
      queryClient.setQueryData(['program', programId, 'follow-up-rules'], updatedRules);
    }
  });
  
  return {
    followUpRules: query.data,
    isLoading: query.isPending,
    error: query.error,
    updateFollowUpRules: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error
  };
};

// Additional hooks would be implemented for remaining API endpoints

// Export hooks for use in components
export const useProgramsApi = {
  usePrograms,
  useProgram,
  useCreateProgram,
  useUpdateProgram,
  useProgramControl,
  useProgramWorkers,
  useWorkerTimeline,
  useProgramMetrics,
  useExportMetrics,
  useFollowUpRules,
  // Other hooks exported here
};
```

These hooks leverage React Query (TanStack Query) for efficient data fetching, caching, and state management, providing a clean interface for components to interact with the API.

### Error Handling

Proper error handling is critical for a robust Program Management implementation. The approach includes:

1. **Global Error Handler**:
   ```typescript
   // src/lib/api/client.ts (excerpt)
   
   apiClient.interceptors.response.use(
     response => response,
     error => {
       // Handle common error cases
       if (error.response) {
         // Server responded with non-2xx status
         const { status } = error.response;
         
         if (status === 401) {
           // Unauthorized - trigger logout or token refresh
           authStore.triggerLogout();
         }
         
         if (status === 403) {
           // Forbidden - handle permission issues
           console.error('Permission denied:', error.response.data.message);
         }
         
         if (status === 429) {
           // Rate limiting - handle accordingly
           console.error('Rate limit exceeded:', error.response.data.message);
         }
         
         // Enhance error with response data for more context
         error.message = error.response.data.message || error.message;
         error.errors = error.response.data.errors || {};
       } else if (error.request) {
         // Request made but no response received (network issues)
         error.message = 'Network error. Please check your connection.';
       }
       
       // Log error to monitoring service if needed
       if (process.env.NODE_ENV === 'production') {
         // logErrorToMonitoring(error);
       }
       
       return Promise.reject(error);
     }
   );
   ```

2. **Component-Level Error Handling**:
   ```tsx
   // Example error handling in a component
   
   const ProgramDetail: React.FC = () => {
     const { programId } = useParams();
     const { program, isLoading, error, refetch } = useProgramsApi.useProgram(programId);
     
     if (error) {
       return (
         <ErrorDisplay 
           error={error}
           title="Error Loading Program"
           retryAction={refetch}
           fallbackAction={{
             label: "Back to Programs",
             handler: () => router.push('/programs')
           }}
         />
       );
     }
     
     // Rest of component...
   };
   ```

3. **Mutation Error Handling**:
   ```tsx
   // Example mutation error handling
   
   const { updateProgram, isUpdating, error: updateError } = useProgramsApi.useUpdateProgram(programId);
   const { toast } = useToast();
   
   const handleSave = async (data) => {
     try {
       await updateProgram(data);
       toast({
         title: "Program Updated",
         description: "The program has been updated successfully.",
         variant: "success"
       });
     } catch (error) {
       toast({
         title: "Update Failed",
         description: error.message || "An unexpected error occurred.",
         variant: "error"
       });
       
       // Handle validation errors
       if (error.errors) {
         setValidationErrors(error.errors);
       }
     }
   };
   ```

4. **Error Boundary**:
   ```tsx
   // src/components/error-boundary.tsx
   
   import React, { Component, ErrorInfo, ReactNode } from 'react';
   import { Button } from '@/components/ui/button';
   
   interface ErrorBoundaryProps {
     children: ReactNode;
     fallback?: ReactNode;
   }
   
   interface ErrorBoundaryState {
     hasError: boolean;
     error?: Error;
   }
   
   export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
     constructor(props: ErrorBoundaryProps) {
       super(props);
       this.state = { hasError: false };
     }
   
     static getDerivedStateFromError(error: Error): ErrorBoundaryState {
       return { hasError: true, error };
     }
   
     componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
       console.error('Error caught by boundary:', error, errorInfo);
       // Log to monitoring service if needed
     }
   
     render(): ReactNode {
       if (this.state.hasError) {
         if (this.props.fallback) {
           return this.props.fallback;
         }
         
         return (
           <div className="error-boundary-fallback">
             <h2>Something went wrong</h2>
             <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
             <Button onClick={() => this.setState({ hasError: false })}>
               Try again
             </Button>
           </div>
         );
       }
   
       return this.props.children;
     }
   }
   ```

### Performance Considerations

For optimal performance in the Program Management module, several strategies are employed:

1. **Efficient Data Fetching**:
   - Use React Query's caching and background refetching
   - Implement pagination for large datasets (workers, message logs)
   - Use cursor-based pagination for better performance with large datasets
   - Apply appropriate query keys for effective cache invalidation

2. **Data Virtualization**:
   - Use virtualized lists/tables for large worker lists (react-window or similar)
   - Implement infinite scrolling for message logs and activity feeds
   - Progressively load details only when needed

3. **Optimized Rendering**:
   - Use React.memo for components that don't need frequent re-renders
   - Implement useCallback and useMemo for expensive computations and callbacks
   - Avoid prop drilling with judicious use of Context or state management

4. **Debouncing and Throttling**:
   - Debounce search inputs to reduce API calls
   - Throttle real-time updates to prevent UI jank
   - Batch updates for multiple worker operations

Implementation example:

```tsx
// Virtualized worker table implementation example

import { useVirtualizer } from '@tanstack/react-virtual';
import { useProgramsApi } from '@/hooks/features/useProgramsApi';

const VirtualizedWorkerTable: React.FC<{ programId: string }> = ({ programId }) => {
  const [filters, setFilters] = useState<WorkerFilters>({
    page: 1,
    limit: 100
  });
  
  const { workers, isLoading, pagination } = useProgramsApi.useProgramWorkers(
    programId, 
    filters
  );
  
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: workers?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // row height estimate in pixels
    overscan: 10
  });
  
  const loadMoreWorkers = useCallback(() => {
    if (pagination.hasNextPage && !isLoading) {
      setFilters(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  }, [pagination.hasNextPage, isLoading]);
  
  // Check if we need to load more items as the user scrolls
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;
    
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = scrollElement;
      // Load more when we get close to the bottom
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMoreWorkers();
      }
    };
    
    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [loadMoreWorkers]);
  
  return (
    <div
      ref={parentRef}
      className="worker-table-container"
      style={{ height: '600px', overflow: 'auto' }}
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
              className="worker-row"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              {/* Worker row content */}
              <div className="worker-name">{worker.name}</div>
              <div className="worker-status">{worker.status}</div>
              {/* Other worker information */}
            </div>
          );
        })}
      </div>
      
      {isLoading && <div className="loading-indicator">Loading more workers...</div>}
    </div>
  );
};
```

## Advanced Program Features

Beyond the core Program Management functionality, the platform includes several advanced features that enhance the capabilities and effectiveness of behavioral coaching interventions.

### Follow-up Rules Configuration

Follow-up rules define how the system responds when workers don't engage with touchpoints, including reminders, escalations, and alternative communication channels.

#### Key Concepts

1. **Follow-up Strategy**: A set of rules that determine how and when to follow up with non-responsive workers.
2. **Reminder Logic**: Configurations for timing, frequency, and content of reminders.
3. **Escalation Thresholds**: Conditions that trigger escalation to program managers or alternative channels.
4. **Channel Fallbacks**: Alternative communication methods when primary channels fail.

#### Implementation Requirements

1. **Rule Editor Interface**:
   - Create, edit, and delete follow-up rules
   - Configure touchpoint types, timing, frequency
   - Set escalation thresholds and actions

2. **Timeline Visualization**:
   - Visual representation of follow-up sequence
   - Preview of worker experience with follow-ups
   - Time-based view of reminders and escalations

3. **Testing Tools**:
   - Simulate follow-up scenarios
   - Preview message content and timing
   - Validate rule effectiveness

4. **Audience Targeting**:
   - Apply different follow-up strategies to different segments
   - Custom rules for high-priority workers
   - Exception handling for specific scenarios

#### Interface Design

The Follow-up Rules interface includes:

1. **Rule Management**:
   - Enable/disable global follow-up functionality
   - Add/edit/remove follow-up strategies
   - Priority ordering for strategy application

2. **Rule Configuration**:
   - Touchpoint type selection (message, quiz, reflection, etc.)
   - Reminder delay settings (hours, days)
   - Maximum reminder count settings
   - Escalation threshold configuration

3. **Action Configuration**:
   - Reminder template selection
   - Escalation action selection (notify manager, change channel, etc.)
   - Custom escalation message configuration
   - Notification routing settings

4. **Preview & Testing**:
   - Timeline visualization of follow-up sequence
   - Message preview for reminders
   - What-if scenario testing for different response patterns

### Conflict Resolution Strategies

Conflict resolution strategies manage how the system handles situations where multiple programs target the same workers, potentially causing message overload or confused experiences.

#### Key Concepts

1. **Program Priority**: Hierarchy determining which programs take precedence during conflicts.
2. **Conflict Types**: Different kinds of conflicts (scheduling, content, sequencing, etc.).
3. **Resolution Approaches**: Strategies like queuing, interrupting, merging, or canceling.
4. **Worker Experience**: How conflicts affect the end-user experience and the approach to maintaining coherence.

#### Implementation Requirements

1. **Conflict Identification**:
   - Detect potential program overlaps
   - Identify worker cohorts affected by conflicts
   - Visualize conflict points and severity

2. **Strategy Configuration**:
   - Set program priority levels
   - Select handling strategies (queue, interrupt, merge, cancel)
   - Configure delay thresholds
   - Define program-specific override rules

3. **Conflict Simulation**:
   - Test conflict scenarios with sample workers
   - Preview message sequencing during conflicts
   - Evaluate impact on worker experience

4. **Monitoring Tools**:
   - Track real-time conflict occurrences
   - Measure impact on worker experience
   - Alert on severe or unexpected conflicts

#### Interface Design

The Conflict Resolution interface includes:

1. **Program Priority Settings**:
   - Numeric priority level selection
   - Relative priority visualization
   - Program comparison tool

2. **Strategy Selection**:
   - Handling strategy options with explanations
   - Parameter configuration for each strategy
   - Exception rules for specific program combinations

3. **Conflict Simulator**:
   - Visual timeline showing program overlaps
   - Message sequence preview
   - Worker experience simulation
   - Resolution preview based on selected strategy

4. **Conflict Monitoring**:
   - Affected worker count metrics
   - Resolution outcome tracking
   - Strategy effectiveness metrics

### Program Feedback Management

Program Feedback Management provides tools for collecting, reviewing, and responding to worker feedback, including help requests, content feedback, and general observations.

#### Key Concepts

1. **Feedback Types**: Different categories of feedback (help requests, content issues, general feedback).
2. **Feedback Collection**: Methods for workers to provide feedback during program participation.
3. **Feedback Workflow**: Process for reviewing, categorizing, and responding to feedback.
4. **Feedback Analytics**: Aggregation and analysis of feedback to identify trends and opportunities.

#### Implementation Requirements

1. **Feedback Listing**:
   - View all feedback with filtering and sorting
   - Categorize by type, priority, and status
   - Assign feedback to team members for follow-up
