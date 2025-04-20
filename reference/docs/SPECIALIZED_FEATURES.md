# Specialized Features: Wellbeing & Gamification

## Table of Contents

1. [Introduction](#introduction)
   - [Purpose and Scope](#purpose-and-scope)
   - [Integration with Core Platform](#integration-with-core-platform)
   - [Key Stakeholders and User Roles](#key-stakeholders-and-user-roles)

2. [Wellbeing System](#wellbeing-system)
   - [Architecture Overview](#wellbeing-architecture-overview)
   - [Wellbeing Indicators](#wellbeing-indicators)
   - [Assessments Management](#assessments-management)
   - [Interventions Management](#interventions-management)
   - [Alerts and Monitoring](#alerts-and-monitoring)
   - [Wellbeing Analytics](#wellbeing-analytics)

3. [Gamification System](#gamification-system)
   - [Architecture Overview](#gamification-architecture-overview)
   - [Badges and Achievements](#badges-and-achievements)
   - [Challenges Management](#challenges-management)
   - [Leaderboards](#leaderboards)
   - [Rewards System](#rewards-system)
   - [Points and Progression](#points-and-progression)

4. [UI/UX Implementation](#uiux-implementation)
   - [Wellbeing Pages](#wellbeing-pages)
   - [Gamification Pages](#gamification-pages)
   - [Component Specifications](#component-specifications)
   - [User Flows and Interactions](#user-flows-and-interactions)
   - [Mobile and WhatsApp Considerations](#mobile-and-whatsapp-considerations)

5. [API Integration](#api-integration)
   - [Wellbeing API Endpoints](#wellbeing-api-endpoints)
   - [Gamification API Endpoints](#gamification-api-endpoints)
   - [Integration with Other Platform APIs](#integration-with-other-platform-apis)

6. [Implementation Guidelines](#implementation-guidelines)
   - [Development Considerations](#development-considerations)
   - [Testing Strategies](#testing-strategies)
   - [Performance Optimization](#performance-optimization)
   - [Accessibility Considerations](#accessibility-considerations)
   - [Security and Privacy](#security-and-privacy)

## Introduction

### Purpose and Scope

This document provides comprehensive specifications for implementing the Wellbeing and Gamification features within the ABCD Behavioral Coaching Platform. These specialized features enhance the core functionality of the platform by:

1. **Wellbeing System**: Monitoring and supporting worker mental health and wellbeing through assessments, indicators, interventions, and alerts.

2. **Gamification System**: Increasing engagement and motivation through badges, challenges, leaderboards, and rewards.

### Integration with Core Platform

Both Wellbeing and Gamification features are deeply integrated with the core platform components:

- **Content Management**: Wellbeing assessments and interventions are specialized content types
- **Journey Builder**: Journeys incorporate wellbeing checkpoints and gamification elements
- **Program Implementation**: Programs leverage wellbeing data and gamification to drive engagement
- **Marketplace**: Wellbeing content and gamification elements can be shared between organizations
- **Segmentation**: Workers can be segmented based on wellbeing metrics or gamification progress

### Key Stakeholders and User Roles

Different platform users interact with these features in specific ways:

- **Training Manager**: Configures wellbeing assessments and gamification elements
- **Program Manager**: Monitors wellbeing indicators and uses gamification to improve program outcomes
- **Workers**: Complete wellbeing assessments and participate in gamified experiences
- **Organization Admin**: Reviews wellbeing analytics and gamification effectiveness

## Wellbeing System

### Wellbeing Architecture Overview

The Wellbeing system is designed as a modular component within the platform architecture that focuses on monitoring, assessing, and improving the mental health and wellbeing of workers. It consists of four primary sub-modules:

1. **Indicators Management**: Defines and tracks specific metrics related to worker wellbeing
2. **Assessment Management**: Creates, schedules, and analyzes wellbeing assessments
3. **Intervention Management**: Develops and deploys targeted wellbeing support resources
4. **Alert System**: Monitors indicators for concerning patterns and triggers notifications

#### System Interactions

The Wellbeing system interacts with other platform components:

- **Journey Builder**: Wellbeing assessments and interventions can be incorporated as touchpoints in journey phases
- **Program Implementation**: Programs can schedule regular wellbeing check-ins and trigger interventions
- **Content Management**: Wellbeing assessments and interventions are specialized content types
- **Segmentation**: Workers can be grouped based on wellbeing indicators for targeted support
- **Analytics**: Wellbeing data feeds into broader program effectiveness and worker performance metrics

#### Data Flow

```
Worker Responses → Assessments → Indicator Updates → (Optional) Alert Triggers → Interventions
```

### Wellbeing Indicators

Wellbeing indicators are quantifiable metrics that measure different aspects of worker wellbeing. They serve as early warning signs and progress trackers.

#### Core Capabilities

1. **Standard Indicators**: Pre-defined wellbeing metrics based on established psychological frameworks:
   - Work satisfaction (1-10 scale)
   - Stress levels (1-10 scale)
   - Energy/burnout (1-10 scale)
   - Social connection (1-10 scale)
   - Overall wellbeing score (composite index)

2. **Custom Indicators**: Organization-specific metrics that can be tailored to particular worker populations or contexts:
   - Domain-specific satisfaction metrics
   - Cultural or community-specific wellbeing factors
   - Role-specific stressors

3. **Indicator Management**: 
   - Creation and modification of custom indicators
   - Setting thresholds for alerts (individual and group levels)
   - Mapping indicators to assessment questions
   - Establishing baselines and targets

#### User Interface Requirements

The Wellbeing Indicators UI requires:

1. **Indicator Dashboard**:
   - Summary view of all configured indicators
   - Status indicators for metrics requiring attention
   - Quick filters for viewing by category or alert status

2. **Indicator Detail View**:
   - Configuration options (name, description, scale, thresholds)
   - Mapping to specific assessment questions
   - Trend visualization across organization/segments
   - Distribution comparison against benchmarks

3. **Indicator Creation Form**:
   - Fields for name, description, scale definition
   - Threshold configuration options
   - Association with assessment questions

#### Component Specifications

1. **IndicatorList Component**:
   - Displays all configured indicators in a data table
   - Provides sorting, filtering, and search capabilities
   - Shows indicator status with visual indicators (green/yellow/red)
   - Offers quick actions (edit, delete, view details)
   - Props: `indicators`, `onEdit`, `onDelete`, `onViewDetails`

2. **IndicatorDetail Component**:
   - Renders detailed view of an individual indicator
   - Shows configuration, thresholds, and mapping to assessments
   - Displays trend charts and distribution visualizations
   - Props: `indicator`, `assessmentMappings`, `trendData`, `distributionData`

3. **IndicatorForm Component**:
   - Form for creating/editing indicators
   - Validates input for required fields and logical constraints
   - Handles submission and error display
   - Props: `indicator`, `onSubmit`, `errors`, `isSubmitting`

### Assessments Management

Wellbeing assessments are structured questionnaires or interactive activities designed to gather data about worker wellbeing, which then update indicator values.

#### Core Capabilities

1. **Assessment Template Creation**:
   - Standard templates based on psychological frameworks
   - Custom template builder with various question types
   - Indicator mapping for response scoring
   - Branching logic based on responses

2. **Assessment Scheduling**:
   - Regular interval scheduling (weekly, monthly)
   - Event-triggered assessments
   - Integration with programs and journeys
   - Target population selection (all workers or segments)

3. **Assessment Results Analysis**:
   - Individual response review
   - Aggregated results by segment
   - Trend analysis over time
   - Automatic indicator updates

4. **Response Management**:
   - Automatic follow-up based on responses
   - Manual intervention flagging
   - Historical response tracking

#### Assessment Types

1. **Quick Check-ins**: 1-3 questions for frequent, low-friction monitoring
2. **Standard Assessments**: 5-10 questions covering core wellbeing domains
3. **Comprehensive Evaluations**: In-depth assessments (10+ questions) with detailed domain coverage
4. **Interactive Assessments**: Activity-based evaluations beyond simple questionnaires

#### User Interface Requirements

The Assessment Management UI requires:

1. **Assessment Library View**:
   - Grid/list view of all assessment templates
   - Filtering by type, status, and usage
   - Preview capabilities
   - Usage statistics

2. **Assessment Builder**:
   - Intuitive question creation interface
   - Question type selection (multiple choice, slider, text response)
   - Branching logic configuration
   - Indicator mapping interface
   - Preview functionality

3. **Assessment Scheduler**:
   - Calendar-based scheduling interface
   - Recurrence pattern configuration
   - Target population selection
   - Notification settings

4. **Results Dashboard**:
   - Overview of recent assessment completions
   - Highlight of concerning responses
   - Trend visualizations
   - Drill-down capabilities to individual responses

#### Component Specifications

1. **AssessmentList Component**:
   - Displays assessment templates in grid or list view
   - Shows key metadata (question count, usage, last modified)
   - Provides preview, edit, and duplicate actions
   - Props: `assessments`, `view`, `onPreview`, `onEdit`, `onDuplicate`

2. **AssessmentBuilder Component**:
   - Multi-step interface for creating/editing assessments
   - Question management interface with drag-and-drop reordering
   - Branching logic definition UI
   - Indicator mapping controls
   - Props: `assessment`, `indicators`, `onSave`, `errors`

3. **QuestionEditor Component**:
   - Interface for creating/editing individual questions
   - Type-specific configuration options
   - Validation settings
   - Props: `question`, `onChange`, `onDelete`, `errors`

4. **AssessmentScheduler Component**:
   - Calendar interface for scheduling assessments
   - Recurrence pattern configuration controls
   - Segment selection interface
   - Notification configuration
   - Props: `assessment`, `segments`, `onSchedule`, `existingSchedules`

5. **AssessmentResults Component**:
   - Dashboard view of assessment results
   - Filterable by time period, segment, and assessment
   - Trend charts and distribution visualizations
   - Drill-down to individual responses
   - Props: `assessmentId`, `timeRange`, `segmentId`, `results`

### Interventions Management

Wellbeing interventions are resources, activities, or communications designed to support and improve worker wellbeing, particularly in response to concerning assessment results.

#### Core Capabilities

1. **Intervention Template Creation**:
   - Resource-based interventions (articles, videos, guides)
   - Activity-based interventions (exercises, reflections)
   - Communication-based interventions (check-in messages, referrals)
   - Multi-step intervention paths

2. **Intervention Targeting**:
   - Indicator threshold-based triggering
   - Manual assignment to individuals
   - Segment-based assignment
   - Self-selection by workers

3. **Effectiveness Tracking**:
   - Completion rates
   - Pre/post indicator changes
   - Worker feedback
   - Engagement metrics

#### Intervention Types

1. **Educational Resources**: Informational content about wellbeing topics
2. **Self-Help Tools**: Interactive activities for personal wellbeing improvement
3. **Guided Support**: Structured programs with step-by-step guidance
4. **Social Support**: Connection to peers or professionals
5. **External Referrals**: Links to specialized services outside the platform

#### User Interface Requirements

The Interventions Management UI requires:

1. **Intervention Library View**:
   - Grid/list view of intervention templates
   - Filtering by type, target indicators, and usage
   - Preview capabilities
   - Effectiveness metrics

2. **Intervention Creator**:
   - Template selection interface
   - Content/activity configuration
   - Targeting rules definition
   - Integration with content management system

3. **Assignment Dashboard**:
   - Overview of active interventions
   - Assignment interface for manual targeting
   - Status tracking of assignments
   - Effectiveness metrics

#### Component Specifications

1. **InterventionList Component**:
   - Displays intervention templates in grid or list view
   - Shows key metadata (type, target indicators, effectiveness)
   - Provides preview, edit, and assign actions
   - Props: `interventions`, `view`, `onPreview`, `onEdit`, `onAssign`

2. **InterventionCreator Component**:
   - Interface for creating/editing intervention templates
   - Template type selection
   - Content configuration based on type
   - Targeting rule definition
   - Props: `intervention`, `indicators`, `contentLibrary`, `onSave`, `errors`

3. **InterventionAssignment Component**:
   - Interface for manually assigning interventions
   - Worker/segment selection
   - Schedule configuration
   - Notification settings
   - Props: `intervention`, `workers`, `segments`, `onAssign`, `errors`

4. **InterventionEffectiveness Component**:
   - Dashboard showing intervention effectiveness metrics
   - Completion rate charts
   - Pre/post indicator change visualization
   - Feedback summary
   - Props: `interventionId`, `timeRange`, `metrics`

### Alerts and Monitoring

The Alerts and Monitoring system proactively identifies concerning wellbeing patterns and facilitates timely responses.

#### Core Capabilities

1. **Alert Configuration**:
   - Threshold-based alerts on indicators
   - Pattern recognition alerts (rapid changes, sustained low scores)
   - Response-based alerts from assessments
   - Custom alert rules

2. **Alert Notifications**:
   - Role-based alert routing
   - Notification priority levels
   - Delivery methods (in-app, email, SMS)
   - Escalation paths

3. **Alert Management**:
   - Alert review interface
   - Status tracking (new, in-progress, resolved)
   - Response documentation
   - Follow-up scheduling

#### Alert Types

1. **Threshold Alerts**: Triggered when indicators cross defined thresholds
2. **Trend Alerts**: Triggered by concerning patterns over time
3. **Response Alerts**: Triggered by specific assessment responses
4. **Inactivity Alerts**: Triggered when workers don't engage with wellbeing tools
5. **Custom Alerts**: Organization-defined alert rules

#### User Interface Requirements

The Alerts and Monitoring UI requires:

1. **Alerts Dashboard**:
   - Overview of active alerts by priority
   - Filtering by type, status, and worker/segment
   - Quick-action capabilities
   - Historical alert tracking

2. **Alert Configuration Interface**:
   - Rule builder for defining alert conditions
   - Notification routing settings
   - Threshold adjustment tools
   - Testing capabilities

3. **Alert Detail View**:
   - Comprehensive information about the alert trigger
   - Historical context for the worker/segment
   - Response action interface
   - Documentation tools

#### Component Specifications

1. **AlertsDashboard Component**:
   - Displays active alerts in prioritized list
   - Provides filtering and search capabilities
   - Shows alert status and age indicators
   - Enables quick actions (assign, resolve, intervene)
   - Props: `alerts`, `onAssign`, `onResolve`, `onIntervene`

2. **AlertConfiguration Component**:
   - Interface for creating/editing alert rules
   - Condition builder with logical operators
   - Notification routing settings
   - Testing tool for rule validation
   - Props: `alertRule`, `indicators`, `onSave`, `errors`

3. **AlertDetail Component**:
   - Comprehensive view of an individual alert
   - Historical context visualization
   - Response action interface
   - Documentation tools for tracking interventions
   - Props: `alert`, `worker`, `history`, `onUpdateStatus`, `onDocument`

### Wellbeing Analytics

Wellbeing Analytics provides insights into organizational and segment-level wellbeing trends, intervention effectiveness, and potential areas for improvement.

#### Core Capabilities

1. **Trend Analysis**:
   - Organization-wide wellbeing indicators over time
   - Segment comparison charts
   - Correlation with external factors
   - Seasonal pattern identification

2. **Impact Assessment**:
   - Program impact on wellbeing metrics
   - Intervention effectiveness comparison
   - Return on investment calculations
   - Comparison to benchmarks

3. **Predictive Insights**:
   - Early warning pattern identification
   - Risk factor analysis
   - Recommended focus areas
   - Forecasting tools

4. **Custom Reporting**:
   - Report builder with wellbeing metrics
   - Export capabilities for stakeholder reporting
   - Integration with project/funder reporting
   - Scheduled report delivery

#### User Interface Requirements

The Wellbeing Analytics UI requires:

1. **Analytics Dashboard**:
   - High-level overview of organizational wellbeing
   - Key trend visualizations
   - Performance against benchmarks
   - Highlighted insights and recommendations

2. **Detailed Analysis Tools**:
   - Interactive chart building
   - Segment comparison tools
   - Correlation analysis interface
   - Time period selection and comparison

3. **Report Builder**:
   - Metric selection interface
   - Visualization type selection
   - Layout configuration
   - Export and scheduling options

#### Component Specifications

1. **WellbeingDashboard Component**:
   - Displays high-level wellbeing metrics and trends
   - Shows key insights and recommendations
   - Provides navigation to detailed analysis tools
   - Props: `metrics`, `trends`, `insights`, `timeRange`

2. **TrendAnalyzer Component**:
   - Interactive chart building interface
   - Segment comparison capabilities
   - Correlation analysis tools
   - Time period selection controls
   - Props: `indicators`, `segments`, `timeRange`, `comparisonType`

3. **WellbeingReportBuilder Component**:
   - Interface for creating custom wellbeing reports
   - Metric selection tools
   - Visualization configuration
   - Layout adjustment capabilities
   - Export and schedule options
   - Props: `metrics`, `visualizationTypes`, `layouts`, `onGenerate`, `onSchedule`

## Gamification System

### Gamification Architecture Overview

The Gamification system is designed to increase engagement and motivation through badges, challenges, leaderboards, and rewards. It consists of several key components:

1. **Badges and Achievements**: Recognition for completing tasks or achieving milestones
2. **Challenges Management**: Structured tasks or activities to encourage progress
3. **Leaderboards**: Competition and recognition for top performers
4. **Rewards System**: Incentives for completing tasks or achieving goals
5. **Points and Progression**: Tracking progress and rewarding achievements

### Badges and Achievements

Badges and achievements are visual symbols of accomplishment or recognition. They serve as motivational incentives and progress markers.

#### Core Capabilities

1. **Badge Template Creation**:
   - Standard templates based on psychological frameworks
   - Custom template builder with various design options
   - Indicator mapping for badge attainment
   - Branching logic based on achievements

2. **Achievement Tracking**:
   - Completion rates
   - Pre/post indicator changes
   - Worker feedback
   - Engagement metrics

#### User Interface Requirements

The Badges and Achievements UI requires:

1. **Badge Library View**:
   - Grid/list view of all badge templates
   - Filtering by type, status, and usage
   - Preview capabilities
   - Usage statistics

2. **Badge Creator**:
   - Template selection interface
   - Design configuration
   - Indicator mapping interface
   - Preview functionality

3. **Achievement Tracker**:
   - Interface for tracking completed achievements
   - Progress visualization
   - Feedback summary
   - Props: `achievements`, `onTrack`, `onFeedback`

### Challenges Management

Challenges are structured tasks or activities designed to encourage progress and achievement.

#### Core Capabilities

1. **Challenge Template Creation**:
   - Standard templates based on psychological frameworks
   - Custom template builder with various question types
   - Indicator mapping for response scoring
   - Branching logic based on responses

2. **Challenge Scheduling**:
   - Regular interval scheduling (weekly, monthly)
   - Event-triggered challenges
   - Integration with programs and journeys
   - Target population selection (all workers or segments)

3. **Challenge Results Analysis**:
   - Individual response review
   - Aggregated results by segment
   - Trend analysis over time
   - Automatic indicator updates

4. **Response Management**:
   - Automatic follow-up based on responses
   - Manual intervention flagging
   - Historical response tracking

#### Challenge Types

1. **Quick Challenges**: 1-3 questions for frequent, low-friction progress
2. **Standard Challenges**: 5-10 questions covering core progress domains
3. **Comprehensive Challenges**: In-depth challenges (10+ questions) with detailed domain coverage
4. **Interactive Challenges**: Activity-based progress beyond simple questionnaires

#### User Interface Requirements

The Challenges Management UI requires:

1. **Challenge Library View**:
   - Grid/list view of all challenge templates
   - Filtering by type, status, and usage
   - Preview capabilities
   - Usage statistics

2. **Challenge Builder**:
   - Intuitive question creation interface
   - Question type selection (multiple choice, slider, text response)
   - Branching logic configuration
   - Indicator mapping interface
   - Preview functionality

3. **Challenge Scheduler**:
   - Calendar-based scheduling interface
   - Recurrence pattern configuration
   - Target population selection
   - Notification settings

4. **Results Dashboard**:
   - Overview of recent challenge completions
   - Highlight of concerning responses
   - Trend visualizations
   - Drill-down capabilities to individual responses

#### Component Specifications

1. **ChallengeList Component**:
   - Displays challenge templates in grid or list view
   - Shows key metadata (question count, usage, last modified)
   - Provides preview, edit, and duplicate actions
   - Props: `challenges`, `view`, `onPreview`, `onEdit`, `onDuplicate`

2. **ChallengeBuilder Component**:
   - Multi-step interface for creating/editing challenges
   - Question management interface with drag-and-drop reordering
   - Branching logic definition UI
   - Indicator mapping controls
   - Props: `challenge`, `indicators`, `onSave`, `errors`

3. **QuestionEditor Component**:
   - Interface for creating/editing individual questions
   - Type-specific configuration options
   - Validation settings
   - Props: `question`, `onChange`, `onDelete`, `errors`

4. **ChallengeScheduler Component**:
   - Calendar interface for scheduling challenges
   - Recurrence pattern configuration controls
   - Segment selection interface
   - Notification configuration
   - Props: `challenge`, `segments`, `onSchedule`, `existingSchedules`

5. **ChallengeResults Component**:
   - Dashboard view of challenge results
   - Filterable by time period, segment, and challenge
   - Trend charts and distribution visualizations
   - Drill-down to individual responses
   - Props: `challengeId`, `timeRange`, `segmentId`, `results`

### Leaderboards

Leaderboards are competitive rankings of top performers in various areas.

#### Core Capabilities

1. **Leaderboard Configuration**:
   - Ranking criteria definition
   - Segment selection
   - Time period configuration
   - Custom leaderboard types

2. **Leaderboard Display**:
   - Display of top performers
   - Ranking comparison across segments
   - Historical performance tracking

3. **Leaderboard Management**:
   - Interface for managing leaderboard configurations
   - Leaderboard update and refresh capabilities
   - Historical leaderboard tracking

#### User Interface Requirements

The Leaderboards UI requires:

1. **Leaderboard Dashboard**:
   - Overview of active leaderboards
   - Filtering by type, status, and segment
   - Quick-action capabilities
   - Historical leaderboard tracking

2. **Leaderboard Configuration Interface**:
   - Rule builder for defining leaderboard criteria
   - Segment selection tools
   - Time period configuration
   - Testing capabilities

3. **Leaderboard Detail View**:
   - Comprehensive information about the leaderboard criteria
   - Historical context for the segment
   - Ranking comparison tools
   - Historical performance tracking

#### Component Specifications

1. **LeaderboardDashboard Component**:
   - Displays active leaderboards in prioritized list
   - Provides filtering and search capabilities
   - Shows leaderboard status and age indicators
   - Enables quick actions (update, refresh)
   - Props: `leaderboards`, `onUpdate`, `onRefresh`

2. **LeaderboardConfiguration Component**:
   - Interface for creating/editing leaderboard criteria
   - Criteria builder with logical operators
   - Segment selection tools
   - Time period configuration
   - Testing tool for rule validation
   - Props: `leaderboardCriteria`, `segments`, `timeRange`, `onSave`, `errors`

3. **LeaderboardDetail Component**:
   - Comprehensive view of an individual leaderboard
   - Historical context visualization
   - Ranking comparison tools
   - Historical performance tracking
   - Props: `leaderboard`, `segment`, `timeRange`, `onUpdate`, `onTrack`

### Rewards System

The Rewards system is designed to incentivize and recognize achievements.

#### Core Capabilities

1. **Reward Template Creation**:
   - Standard templates based on psychological frameworks
   - Custom template builder with various design options
   - Indicator mapping for reward attainment
   - Branching logic based on achievements

2. **Reward Distribution**:
   - Automated distribution based on achievement criteria
   - Manual distribution for exceptional achievements
   - Historical reward tracking

3. **Reward Management**:
   - Interface for managing reward templates
   - Reward distribution capabilities
   - Historical reward tracking

#### User Interface Requirements

The Rewards System UI requires:

1. **Reward Library View**:
   - Grid/list view of all reward templates
   - Filtering by type, status, and usage
   - Preview capabilities
   - Usage statistics

2. **Reward Creator**:
   - Template selection interface
   - Design configuration
   - Indicator mapping interface
   - Preview functionality

3. **Reward Distribution Interface**:
   - Interface for distributing rewards
   - Reward selection tools
   - Distribution logic configuration
   - Historical reward tracking

#### Component Specifications

1. **RewardList Component**:
   - Displays reward templates in grid or list view
   - Shows key metadata (type, status, usage)
   - Provides preview, edit, and assign actions
   - Props: `rewards`, `view`, `onPreview`, `onEdit`, `onAssign`

2. **RewardCreator Component**:
   - Interface for creating/editing reward templates
   - Template type selection
   - Design configuration
   - Indicator mapping interface
   - Props: `reward`, `indicators`, `onSave`, `errors`

3. **RewardDistribution Component**:
   - Interface for distributing rewards
   - Reward selection tools
   - Distribution logic configuration
   - Historical reward tracking
   - Props: `rewards`, `segments`, `onDistribute`, `errors`

### Points and Progression

Points and progression are used to track and reward progress in various areas.

#### Core Capabilities

1. **Point Template Creation**:
   - Standard templates based on psychological frameworks
   - Custom template builder with various point types
   - Indicator mapping for point attainment
   - Branching logic based on achievements

2. **Point Distribution**:
   - Automated distribution based on achievement criteria
   - Manual distribution for exceptional achievements
   - Historical point tracking

3. **Progress Visualization**:
   - Interface for visualizing progress
   - Progress bar visualization
   - Historical progress tracking

#### User Interface Requirements

The Points and Progression UI requires:

1. **Point Library View**:
   - Grid/list view of all point templates
   - Filtering by type, status, and usage
   - Preview capabilities
   - Usage statistics

2. **Point Creator**:
   - Template selection interface
   - Point type selection
   - Indicator mapping interface
   - Preview functionality

3. **Progress Tracker**:
   - Interface for tracking progress
   - Progress bar visualization
   - Historical progress tracking
   - Props: `points`, `onTrack`, `onFeedback`

#### Component Specifications

1. **PointList Component**:
   - Displays point templates in grid or list view
   - Shows key metadata (type, status, usage)
   - Provides preview, edit, and assign actions
   - Props: `points`, `view`, `onPreview`, `onEdit`, `onAssign`

2. **PointCreator Component**:
   - Interface for creating/editing point templates
   - Point type selection
   - Indicator mapping interface
   - Props: `point`, `onSave`, `errors`

3. **ProgressTracker Component**:
   - Interface for tracking progress
   - Progress bar visualization
   - Historical progress tracking
   - Props: `points`, `onTrack`, `onFeedback`

## UI/UX Implementation

### Wellbeing Pages

The Wellbeing feature consists of several key pages, each with specific layouts, components, and functionality. These pages are designed to provide a comprehensive view of worker wellbeing while ensuring intuitive navigation and logical workflow.

#### Wellbeing Dashboard (`/wellbeing` route)

The main entry point for the Wellbeing feature, providing an overview of organizational wellbeing.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Wellbeing Dashboard"                                |
|   Actions: [Date Range Selector] [Export] [Settings]          |
+--------------------------------------------------------------+
| Summary Metrics                                               |
|  +-------------+  +-------------+  +-------------+            |
|  | Avg Overall |  | Alert Count |  | Completion  |            |
|  | Wellbeing   |  | (by Priority)|  | Rate        |           |
|  +-------------+  +-------------+  +-------------+            |
+--------------------------------------------------------------+
| Trending Indicators                                           |
|  [Chart showing key indicators over selected time period]     |
+--------------------------------------------------------------+
| Recent Alerts                                                |
|  [DataTable with recent/high priority wellbeing alerts]       |
+--------------------------------------------------------------+
| Segment Comparison                                           |
|  [Horizontal bar chart comparing segments by wellbeing score] |
+--------------------------------------------------------------+
| Insights & Recommendations                                    |
|  [Card displaying AI-generated insights and actions]          |
+--------------------------------------------------------------+
```

**Key Components:**
1. **WellbeingDashboard**: Container component managing the overall layout and data fetching.
2. **MetricCard**: Displays a single summary metric with icon, value, and change indicator.
3. **TrendChart**: Line chart showing wellbeing indicators over time with interactive legend.
4. **AlertsTable**: Data table showing recent or high-priority alerts with action buttons.
5. **SegmentComparisonChart**: Bar chart comparing wellbeing metrics across segments.
6. **InsightsCard**: Card displaying AI-generated insights and recommended actions.

**State and Data Requirements:**
- Time period selection (default: last 30 days)
- Aggregated wellbeing metrics by organization and segment
- Alert counts by priority level
- Trending indicator data
- Recent/priority alerts
- Segment comparison data
- AI-generated insights based on current data

**API Endpoints Utilized:**
- `GET /wellbeing/dashboard` - Retrieve dashboard summary data
- `GET /wellbeing/alerts?limit=5&sort=priority` - Recent alerts
- `GET /wellbeing/indicators/trends?period={period}` - Trending data
- `GET /wellbeing/segments/comparison` - Segment comparison data

#### Indicators Management (`/wellbeing/indicators` route)

Page for managing wellbeing indicators, including creation, editing, and monitoring.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Wellbeing Indicators"                               |
|   Actions: [Create Indicator] [Import] [Export]               |
+--------------------------------------------------------------+
| Filters                                                       |
|  [Search] [Type Filter] [Status Filter] [Category Filter]     |
+--------------------------------------------------------------+
| Indicators Table                                              |
|  +------+------------+--------+---------+----------+--------+ |
|  | Name | Category   | Status | Trend   | Threshold| Actions| |
|  +------+------------+--------+---------+----------+--------+ |
|  | ...  | ...        | ...    | [Spark] | ...      | [...]  | |
|  +------+------------+--------+---------+----------+--------+ |
+--------------------------------------------------------------+
```

**On indicator selection, display detail panel:**
```
+--------------------------------------------------------------+
| Indicator Detail                                              |
|   Name: "Work Satisfaction"                                   |
|   Description: "Measures overall satisfaction with work..."   |
|   +------------------+ +-------------------+                  |
|   | Configuration    | | Trend             |                  |
|   | - Scale: 1-10    | | [Line chart with  |                  |
|   | - Thresholds     | |  6 month history] |                  |
|   | - Categories     | +-------------------+                  |
|   +------------------+ +-------------------+                  |
|   +------------------+ +-------------------+                  |
|   | Mapped Questions | | Distribution      |                  |
|   | - Question 1     | | [Histogram of     |                  |
|   | - Question 2     | |  current values]  |                  |
|   +------------------+ +-------------------+                  |
|   Actions: [Edit] [Archive] [View Full Analytics]             |
+--------------------------------------------------------------+
```

**Key Components:**
1. **IndicatorList**: Data table showing all indicators with filters and sorting.
2. **IndicatorDetail**: Detailed view of a selected indicator.
3. **IndicatorForm**: Form for creating or editing indicators.
4. **IndicatorTrendChart**: Line chart showing indicator trends over time.
5. **IndicatorDistributionChart**: Histogram showing distribution of current indicator values.
6. **QuestionMappingPanel**: Shows which assessment questions map to this indicator.

**State and Data Requirements:**
- List of all indicators with metadata
- Filtering and sorting state
- Selected indicator details
- Trend data for indicators
- Distribution data for indicator values
- Question mapping data

**API Endpoints Utilized:**
- `GET /wellbeing/indicators` - Retrieve list of indicators
- `GET /wellbeing/indicators/{id}` - Retrieve specific indicator details
- `POST /wellbeing/indicators` - Create new indicator
- `PATCH /wellbeing/indicators/{id}` - Update indicator
- `GET /wellbeing/indicators/{id}/trend` - Get indicator trend data
- `GET /wellbeing/indicators/{id}/distribution` - Get value distribution

#### Assessments Management (`/wellbeing/assessments` route)

Page for managing wellbeing assessments, including creation, scheduling, and results analysis.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Wellbeing Assessments"                              |
|   Actions: [Create Assessment] [Schedule] [Import] [Export]   |
+--------------------------------------------------------------+
| Tabs                                                          |
|  [Assessment Library] [Scheduled] [In Progress] [Completed]   |
+--------------------------------------------------------------+
| Filters                                                       |
|  [Search] [Type Filter] [Status Filter] [Date Range]          |
+--------------------------------------------------------------+
| Assessments Table/Grid                                        |
|  +------+-----------+--------+----------+-------------+       |
|  | Name | Type      | Length | Last Used| Completion %|       |
|  +------+-----------+--------+----------+-------------+       |
|  | ...  | ...       | ...    | ...      | ...         |       |
|  +------+-----------+--------+----------+-------------+       |
+--------------------------------------------------------------+
```

**Assessment Detail/Results View:**
```
+--------------------------------------------------------------+
| Assessment Detail                                             |
|   Name: "Monthly Wellbeing Check-in"                          |
|   Description: "Standard monthly assessment of key domains"   |
|   +------------------+ +-------------------+                  |
|   | Assessment Info  | | Completion Metrics|                  |
|   | - Type: Standard | | - Rate: 78%       |                  |
|   | - Questions: 8   | | - Avg Time: 3m12s |                  |
|   | - Last Edit: ... | | - Abandonment: 5% |                  |
|   +------------------+ +-------------------+                  |
|   +---------------------------------------------------+       |
|   | Response Summary                                  |       |
|   | [Question-by-question response visualization]     |       |
|   | - Q1: Work Satisfaction [Distribution chart]      |       |
|   | - Q2: Stress Levels [Distribution chart]          |       |
|   +---------------------------------------------------+       |
|   Actions: [Edit] [Schedule] [Export Results] [Preview]       |
+--------------------------------------------------------------+
```

**Assessment Builder/Editor:**
```
+--------------------------------------------------------------+
| Assessment Builder                                            |
|   +-------------------------+ +-------------------------+     |
|   | Question List           | | Question Editor         |     |
|   | [Dragable list of       | | Type: [Select]          |     |
|   |  questions with types]  | | Question: [Text field]  |     |
|   |                         | | Options: [Fields based  |     |
|   | + Add Question          | |          on type]       |     |
|   |                         | | Indicator Mapping:      |     |
|   |                         | | [Select indicator]      |     |
|   |                         | |                         |     |
|   |                         | | Logic:                  |     |
|   |                         | | [Conditional display    |     |
|   |                         | |  rules builder]         |     |
|   +-------------------------+ +-------------------------+     |
|   +---------------------------------------------------+      |
|   | Assessment Preview                                |      |
|   | [Live preview of assessment as worker would see it]|      |
|   +---------------------------------------------------+      |
+--------------------------------------------------------------+
```

**Key Components:**
1. **AssessmentList**: Data table or grid showing all assessment templates.
2. **AssessmentDetail**: Detailed view of a selected assessment, including results if available.
3. **AssessmentBuilder**: Interface for creating or editing assessment templates.
4. **QuestionEditor**: Component for editing individual assessment questions.
5. **ResponseSummary**: Visualization of assessment responses aggregated across workers.
6. **AssessmentPreview**: Live preview of the assessment as workers would see it.
7. **ScheduleModal**: Interface for scheduling assessment deployments.

**State and Data Requirements:**
- List of all assessment templates
- Scheduled, in-progress, and completed assessment instances
- Assessment completion metrics
- Aggregated response data
- Question and option configuration
- Indicator mappings for questions
- Logic rules for conditional questions

**API Endpoints Utilized:**
- `GET /wellbeing/assessments` - Retrieve assessment templates
- `GET /wellbeing/assessments/{id}` - Get specific assessment details
- `POST /wellbeing/assessments` - Create new assessment
- `PATCH /wellbeing/assessments/{id}` - Update assessment
- `GET /wellbeing/assessments/{id}/results` - Get aggregated results
- `POST /wellbeing/assessments/{id}/schedule` - Schedule assessment deployment

#### Interventions Management (`/wellbeing/interventions` route)

Page for managing wellbeing interventions, including creation, assignment, and effectiveness tracking.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Wellbeing Interventions"                            |
|   Actions: [Create Intervention] [Import] [Export]            |
+--------------------------------------------------------------+
| Tabs                                                          |
|  [Intervention Library] [Active] [Completed] [Effectiveness]  |
+--------------------------------------------------------------+
| Filters                                                       |
|  [Search] [Type Filter] [Target Indicator] [Status]           |
+--------------------------------------------------------------+
| Interventions Grid/Table                                      |
|  +------+-------------+--------------+-------------+          |
|  | Name | Type        | Target Areas | Effectiveness|         |
|  +------+-------------+--------------+-------------+          |
|  | ...  | ...         | ...          | [Rating]    |          |
|  +------+-------------+--------------+-------------+          |
+--------------------------------------------------------------+
```

**Intervention Detail View:**
```
+--------------------------------------------------------------+
| Intervention Detail                                           |
|   Name: "Stress Management Toolkit"                           |
|   Description: "Resources and activities for stress reduction"|
|   +------------------+ +-------------------+                  |
|   | Intervention Info| | Usage Metrics     |                  |
|   | - Type: Resource | | - Assigned: 156   |                  |
|   | - Format: Mixed  | | - Completed: 89   |                  |
|   | - Duration: 2 wks| | - In Progress: 43 |                  |
|   +------------------+ +-------------------+                  |
|   +------------------+ +-------------------+                  |
|   | Target Indicators| | Effectiveness     |                  |
|   | - Stress Level   | | - Pre/Post: +2.4  |                  |
|   | - Energy/Burnout | | - Feedback: 4.2/5 |                  |
|   +------------------+ +-------------------+                  |
|   +---------------------------------------------------+       |
|   | Intervention Content Preview                      |       |
|   | [Carousel/tabs of the intervention content]       |       |
|   +---------------------------------------------------+       |
|   Actions: [Edit] [Assign] [Export Data] [Preview]            |
+--------------------------------------------------------------+
```

**Intervention Builder/Editor:**
```
+--------------------------------------------------------------+
| Intervention Builder                                          |
|   +-------------------------+ +-------------------------+     |
|   | Basic Information       | | Targeting Rules         |     |
|   | Name: [Text field]      | | Trigger Conditions:     |     |
|   | Description: [Text area]| | [Rule builder for       |     |
|   | Type: [Select]          | |  automatic assignment]  |     |
|   | Format: [Select]        | |                         |     |
|   | Duration: [Input]       | | Target Indicators:      |     |
|   |                         | | [Multi-select indicators]|     |
|   +-------------------------+ +-------------------------+     |
|   +---------------------------------------------------+      |
|   | Content Configuration                              |      |
|   | [Interface varies by intervention type]            |      |
|   | - For resources: Content selection from library    |      |
|   | - For activities: Exercise configuration           |      |
|   | - For communication: Message template configuration |      |
|   +---------------------------------------------------+      |
+--------------------------------------------------------------+
```

**Intervention Assignment Modal:**
```
+--------------------------------------------------------------+
| Assign Intervention                                           |
|   Intervention: "Stress Management Toolkit"                   |
|   +-------------------+ +---------------------------+         |
|   | Target Selection  | | Schedule & Notifications  |         |
|   | [Tabs]            | | Start: [Date picker]      |         |
|   | [By Worker]       | | End: [Date picker]        |         |
|   | [By Segment]      | | Reminders: [Select]       |         |
|   | [By Condition]    | | Notification Message:     |         |
|   |                   | | [Text editor]             |         |
|   +-------------------+ +---------------------------+         |
|   +---------------------------------------------------+       |
|   | Targeting Preview                                  |       |
|   | Workers targeted: 83                               |       |
|   | Estimated completion rate: 76%                     |       |
|   | Potential conflicts: 2 [View]                      |       |
|   +---------------------------------------------------+       |
|   Actions: [Cancel] [Schedule for Later] [Assign Now]          |
+--------------------------------------------------------------+
```

**Key Components:**
1. **InterventionList**: Grid or table listing intervention templates.
2. **InterventionDetail**: Detailed view of an intervention, including effectiveness metrics.
3. **InterventionBuilder**: Interface for creating or editing intervention templates.
4. **InterventionContentEditor**: Type-specific editor for intervention content.
5. **TargetingRuleBuilder**: Interface for configuring automatic assignment rules.
6. **InterventionAssignmentModal**: Interface for manually assigning interventions.
7. **EffectivenessChart**: Visualization of pre/post intervention indicator changes.

**State and Data Requirements:**
- List of intervention templates with metadata
- Active and completed intervention assignments
- Effectiveness metrics by intervention
- Content configuration based on intervention type
- Target indicator mappings
- Assignment rules
- Usage and completion statistics

**API Endpoints Utilized:**
- `GET /wellbeing/interventions` - Retrieve intervention templates
- `GET /wellbeing/interventions/{id}` - Get specific intervention details
- `POST /wellbeing/interventions` - Create new intervention
- `PATCH /wellbeing/interventions/{id}` - Update intervention
- `GET /wellbeing/interventions/{id}/effectiveness` - Get effectiveness metrics
- `POST /wellbeing/interventions/{id}/assign` - Assign intervention to workers/segments

#### Alerts Management (`/wellbeing/alerts` route)

Page for managing wellbeing alerts, including configuration and response.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Wellbeing Alerts"                                   |
|   Actions: [Configure Alerts] [Export] [History]              |
+--------------------------------------------------------------+
| Alert Summary                                                 |
|  +-----------+ +-----------+ +-----------+                    |
|  | Critical  | | Moderate  | | Low       |                    |
|  | Count: 7  | | Count: 18 | | Count: 32 |                    |
|  +-----------+ +-----------+ +-----------+                    |
+--------------------------------------------------------------+
| Filters                                                       |
|  [Priority] [Type] [Status] [Date Range] [Segment]            |
+--------------------------------------------------------------+
| Alerts Table                                                  |
|  +----------+-------+--------+--------+----------+---------+  |
|  | Priority | Type  | Worker | Trigger| Timestamp| Actions |  |
|  +----------+-------+--------+--------+----------+---------+  |
|  | Critical | ... | ... | ... | ... | [Respond] |  |
|  +----------+-------+--------+--------+----------+---------+  |
+--------------------------------------------------------------+
```

**Alert Detail/Response View:**
```
+--------------------------------------------------------------+
| Alert Details                                                 |
|   Priority: Critical | Type: Threshold Alert | Status: New    |
|   +------------------+ +-------------------+                  |
|   | Alert Information| | Worker Information|                  |
|   | - Trigger: Stress| | - Name: John Doe  |                  |
|   |   Level > 8      | | - Segment: Field  |                  |
|   | - Detected: 12/20| | - Role: Supervisor|                  |
|   | - Previous: None | | - Program: Mngmt  |                  |
|   +------------------+ +-------------------+                  |
|   +---------------------------------------------------+       |
|   | Historical Context                                |       |
|   | [Line chart showing related indicator history]    |       |
|   +---------------------------------------------------+       |
|   +---------------------------------------------------+       |
|   | Response Actions                                  |       |
|   | [Select Intervention] [Schedule Check-in]         |       |
|   | [Assign to User] [Mark Resolved] [Add Notes]      |       |
|   +---------------------------------------------------+       |
+--------------------------------------------------------------+
```

**Alert Configuration Screen:**
```
+--------------------------------------------------------------+
| Alert Configuration                                           |
|   +-------------------------+ +-------------------------+     |
|   | Alert Rules             | | Rule Editor             |     |
|   | [List of existing rules]| | Name: [Text field]      |     |
|   | - Threshold Alerts      | | Description: [Text]     |     |
|   | - Trend Alerts          | | Condition Builder:      |     |
|   | - Response Alerts       | | [Visual rule builder]   |     |
|   | - Inactivity Alerts     | | IF [Indicator] [>] [Val]|     |
|   |                         | | Priority: [Select]      |     |
|   | + Add Rule              | | Notification Routing:   |     |
|   |                         | | [User role selection]   |     |
|   +-------------------------+ +-------------------------+     |
|   +---------------------------------------------------+      |
|   | Global Alert Settings                              |      |
|   | Notification Methods: [Checkboxes for delivery]     |      |
|   | Escalation Rules: [Configuration for auto-escalation]|      |
|   | Alert Retention: [Setting for how long to keep alerts]|      |
|   +---------------------------------------------------+      |
+--------------------------------------------------------------+
```

**Key Components:**
1. **AlertDashboard**: Main view showing alert summaries and filtered list.
2. **AlertTable**: Data table displaying alerts with filtering and sorting.
3. **AlertDetail**: Detailed view of a specific alert with context and response options.
4. **AlertResponsePanel**: Interface for responding to alerts with various actions.
5. **AlertRuleList**: List of configured alert rules.
6. **AlertRuleEditor**: Interface for creating or editing alert rules.
7. **RuleConditionBuilder**: Visual builder for alert triggering conditions.
8. **NotificationRoutingConfig**: Configuration for alert notification routing.

**State and Data Requirements:**
- Current alerts with priority, type, and status
- Alert rule configurations
- Worker context data for alerts
- Historical indicator data for context
- Available intervention options
- Notification routing settings
- Alert history data

**API Endpoints Utilized:**
- `GET /wellbeing/alerts` - Retrieve current alerts
- `GET /wellbeing/alerts/{id}` - Get specific alert details
- `PATCH /wellbeing/alerts/{id}` - Update alert status/response
- `GET /wellbeing/alert-rules` - Get alert rule configurations
- `POST /wellbeing/alert-rules` - Create new alert rule
- `PATCH /wellbeing/alert-rules/{id}` - Update alert rule
- `GET /workers/{workerId}/indicators/history` - Get historical indicator data

### Gamification Pages

The Gamification feature consists of several key pages that enable the configuration and management of engagement features. These pages work together to create a cohesive experience for administrators and users.

#### Gamification Dashboard (`/gamification` route)

The main entry point for the Gamification feature, providing an overview of engagement metrics and gamification elements.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Gamification Dashboard"                             |
|   Actions: [Date Range Selector] [Export] [Settings]          |
+--------------------------------------------------------------+
| Engagement Summary                                            |
|  +-------------+  +-------------+  +-------------+            |
|  | Participation|  | Points     |  | Achievement |            |
|  | Rate: 73%    |  | Earned: 45K|  | Rate: 68%   |            |
|  +-------------+  +-------------+  +-------------+            |
+--------------------------------------------------------------+
| Active Challenges                                             |
|  [Card grid of currently active challenges with progress]     |
+--------------------------------------------------------------+
| Top Performers                                               |
|  [Leaderboard preview showing top 5 workers]                 |
+--------------------------------------------------------------+
| Recent Achievements                                          |
|  [Timeline of recent badge/achievement unlocks]              |
+--------------------------------------------------------------+
| Impact Metrics                                               |
|  [Chart showing correlation between engagement and outcomes] |
+--------------------------------------------------------------+
```

**Key Components:**
1. **GamificationDashboard**: Container component managing the overall layout and data fetching.
2. **EngagementMetricCard**: Displays a single engagement metric with icon, value, and change indicator.
3. **ChallengePreviewGrid**: Grid of active challenges with progress indicators.
4. **LeaderboardPreview**: Compact leaderboard showing top performers.
5. **AchievementTimeline**: Timeline visualization of recent achievements.
6. **ImpactChart**: Chart showing correlation between gamification engagement and program outcomes.

**State and Data Requirements:**
- Time period selection (default: last 30 days)
- Engagement summary metrics
- List of active challenges with completion data
- Leaderboard data for top performers
- Recent achievement data
- Impact correlation data

**API Endpoints Utilized:**
- `GET /gamification/dashboard` - Retrieve dashboard summary data
- `GET /gamification/challenges?status=active` - Active challenges
- `GET /gamification/leaderboards/top` - Top performers data
- `GET /gamification/achievements/recent` - Recent achievements
- `GET /gamification/impact` - Impact correlation data

#### Badges Management (`/gamification/badges` route)

Page for managing badges and achievements that can be awarded to workers.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Badges & Achievements"                              |
|   Actions: [Create Badge] [Import] [Export]                   |
+--------------------------------------------------------------+
| Filters                                                       |
|  [Search] [Category] [Status] [Difficulty]                    |
+--------------------------------------------------------------+
| Badges Grid                                                   |
|  +------+  +------+  +------+  +------+                       |
|  |[Icon]|  |[Icon]|  |[Icon]|  |[Icon]|                       |
|  |Name  |  |Name  |  |Name  |  |Name  |                       |
|  |Desc. |  |Desc. |  |Desc. |  |Desc. |                       |
|  +------+  +------+  +------+  +------+                       |
+--------------------------------------------------------------+
```

**Badge Detail View:**
```
+--------------------------------------------------------------+
| Badge Detail                                                  |
|   +------------------+ +-------------------+                  |
|   | Badge Information| | Badge Preview     |                  |
|   | Name: [Text]     | | [Large icon/visual|                  |
|   | Category: [Text] | |  preview of badge]|                  |
|   | Difficulty: [Text]| |                  |                  |
|   | Description: [Txt]| |                  |                  |
|   +------------------+ +-------------------+                  |
|   +------------------+ +-------------------+                  |
|   | Earning Criteria | | Award Statistics  |                  |
|   | [Criteria config]| | - Earned: 127     |                  |
|   | - Action: [Select]| | - Completion: 23%|                  |
|   | - Threshold: [Num]| | - Avg Time: 12d  |                  |
|   | - Variations     | | - By Segment [Chart]|                |
|   +------------------+ +-------------------+                  |
|   Actions: [Edit] [Duplicate] [Archive] [Preview]             |
+--------------------------------------------------------------+
```

**Badge Creator/Editor:**
```
+--------------------------------------------------------------+
| Badge Builder                                                 |
|   +-------------------------+ +-------------------------+     |
|   | Badge Details           | | Badge Design           |     |
|   | Name: [Text field]      | | [Visual editor or      |     |
|   | Description: [Text area]| |  upload interface      |     |
|   | Category: [Select]      | |  for badge design]     |     |
|   | Difficulty: [Select]    | |                        |     |
|   | Points Value: [Number]  | | Preview:               |     |
|   |                         | | [Badge preview]        |     |
|   +-------------------------+ +-------------------------+     |
|   +---------------------------------------------------+      |
|   | Earning Criteria                                  |      |
|   | [Multi-step configuration based on badge type]    |      |
|   | - Activity Completion                             |      |
|   | - Points Threshold                                |      |
|   | - Streak/Consistency                              |      |
|   | - Assessment Score                                |      |
|   | - Custom Logic Builder                            |      |
|   +---------------------------------------------------+      |
+--------------------------------------------------------------+
```

**Key Components:**
1. **BadgeGrid**: Visual grid display of available badges.
2. **BadgeDetail**: Detailed view of a selected badge.
3. **BadgeBuilder**: Interface for creating or editing badges.
4. **BadgeDesignEditor**: Visual editor or upload interface for badge graphics.
5. **CriteriaBuilder**: Configuration interface for badge earning criteria.
6. **BadgeStatistics**: Charts and metrics showing badge acquisition patterns.

**State and Data Requirements:**
- List of all badges with metadata
- Badge design assets
- Earning criteria configurations
- Badge award statistics
- Segment-based completion data

**API Endpoints Utilized:**
- `GET /gamification/badges` - Retrieve list of badges
- `GET /gamification/badges/{id}` - Get specific badge details
- `POST /gamification/badges` - Create new badge
- `PATCH /gamification/badges/{id}` - Update badge
- `GET /gamification/badges/{id}/statistics` - Get badge award statistics

#### Challenges Management (`/gamification/challenges` route)

Page for managing challenges that drive specific behaviors or activities.

**Layout Structure:**
```
+--------------------------------------------------------------+
| PageHeader                                                    |
|   Title: "Challenges"                                         |
|   Actions: [Create Challenge] [Import] [Export]               |
+--------------------------------------------------------------+
| Tabs                                                          |
|  [All] [Active] [Scheduled] [Completed] [Drafts]              |
+--------------------------------------------------------------+
| Filters                                                       |
|  [Search] [Type] [Difficulty] [Status] [Target Segment]       |
+--------------------------------------------------------------+
| Challenges Table                                              |
|  +------+--------+----------+------------+---------+-------+  |
|  | Name | Type   | Duration | Participants| Progress| Actions| |
|  +------+--------+----------+------------+---------+-------+  |
|  | ...  | ...    | ...      | ...        | [Progress Bar] |...| |
|  +------+--------+----------+------------+---------+-------+  |
+--------------------------------------------------------------+
```

**Challenge Detail View:**
```
+--------------------------------------------------------------+
| Challenge Detail                                              |
|   Name: "30-Day Wellness Streak"                              |
|   Type: Streak Challenge | Status: Active | Duration: 30 days |
|   +------------------+ +-------------------+                  |
|   | Challenge Info   | | Participation     |                  |
|   | - Start: [Date]  | | - Invited: 250    |                  |
|   | - End: [Date]    | | - Joined: 187     |                  |
|   | - Description    | | - Completed: 43   |                  |
|   | - Instructions   | | - In Progress: 144|                  |
|   +------------------+ +-------------------+                  |
|   +---------------------------------------------------+       |
|   | Progress Breakdown                                |       |
|   | [Chart showing daily/stage completion metrics]    |       |
|   +---------------------------------------------------+       |
|   +---------------------------------------------------+       |
|   | Rewards                                           |       |
|   | - Points: 500                                     |       |
|   | - Badges: "Wellness Warrior" Badge                |       |
|   | - Other: [Any additional rewards]                 |       |
|   +---------------------------------------------------+       |
|   Actions: [Edit] [Duplicate] [End Early] [Extend] [Send Reminder]
+--------------------------------------------------------------+
```

**Challenge Creator/Editor:**
```
+--------------------------------------------------------------+
| Challenge Builder                                             |
|   +-------------------------+ +-------------------------+     |
|   | Basic Information       | | Challenge Timeline      |     |
|   | Name: [Text field]      | | Start: [Date picker]    |     |
|   | Description: [Text area]| | End: [Date picker]      |     |
|   | Type: [Select]          | | or                      |     |
|   | - Streak                | | Duration: [Number] days |     |
|   | - Points Goal           | |                         |     |
|   | - Activity Completion   | | Milestone Frequency:    |     |
|   | - Competition           | | [Daily/Weekly/Custom]   |     |
|   +-------------------------+ +-------------------------+     |
|   +-------------------------+ +-------------------------+     |
|   | Challenge Requirements  | | Rewards Configuration  |     |
|   | [Varies by type]        | | Points: [Number]       |     |
|   | - For Streak: Activity  | | Badges: [Select badge] |     |
|   |   selection, frequency  | | Special Rewards:       |     |
|   | - For Points: Threshold,| | [Custom reward config] |     |
|   |   eligible activities   | |                        |     |
|   | - For Completion: Tasks | |                        |     |
|   +-------------------------+ +-------------------------+     |
|   +---------------------------------------------------+      |
|   | Targeting                                         |      |
|   | Eligible Segments: [Multi-select segments]        |      |
|   | Max Participants: [Number or "Unlimited"]         |      |
|   | Visibility: [Public/Private/Invitation Only]      |      |
|   +---------------------------------------------------+      |
+--------------------------------------------------------------+
```

**Key Components:**
1. **ChallengeList**: Data table showing all challenges with status and progress.
2. **ChallengeDetail**: Detailed view of a selected challenge with participation data.
3. **ChallengeBuilder**: Interface for creating or editing challenges.
4. **ChallengeRequirementsEditor**: Type-specific editor for challenge requirements.
5. **ChallengeRewardsEditor**: Configuration interface for challenge rewards.
6. **ChallengeProgressChart**: Visualization of challenge completion metrics.
7. **ParticipantList**: Table of challenge participants with individual progress.

**State and Data Requirements:**
- List of challenges with type and status
- Challenge configuration details
- Participation and progress metrics
- Associated rewards (points, badges)
- Targeting configuration (segments, visibility)
- Timeline and milestone settings

**API Endpoints Utilized:**
- `GET /gamification/challenges` - Retrieve list of challenges
- `GET /gamification/challenges/{id}` - Get specific challenge details
- `POST /gamification/challenges` - Create new challenge
- `PATCH /gamification/challenges/{id}` - Update challenge
- `GET /gamification/challenges/{id}/progress` - Get challenge progress data
- `POST /gamification/challenges/{id}/remind` - Send reminders to participants

#### Leaderboards Endpoints

```
GET /api/v1/gamification/leaderboards
```
- **Purpose**: Retrieve a list of configured leaderboards
- **Query Parameters**:
  - `limit`: Number of leaderboards to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `type`: Filter by leaderboard type
  - `status`: Filter by status (active/inactive)
- **Response**: Array of leaderboard configuration objects
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/gamification/leaderboards/{leaderboardId}
```
- **Purpose**: Retrieve details for a specific leaderboard configuration
- **Path Parameters**:
  - `leaderboardId`: UUID of the leaderboard
- **Response**: Detailed leaderboard configuration object
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/leaderboards
```
- **Purpose**: Create a new leaderboard configuration
- **Request Body**:
  - `name`: Leaderboard name (required)
  - `description`: Leaderboard description
  - `type`: Leaderboard type (points/badges/specific challenge)
  - `scope`: Scope settings (organization/segment/program)
  - `scopeIds`: IDs relevant to the selected scope
  - `timeframe`: Timeframe settings (all-time/weekly/monthly/custom)
  - `visibilitySettings`: Configuration for who can view the leaderboard
- **Response**: Created leaderboard configuration with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/gamification/leaderboards/{leaderboardId}
```
- **Purpose**: Update an existing leaderboard configuration
- **Path Parameters**:
  - `leaderboardId`: UUID of the leaderboard
- **Request Body**: Any leaderboard properties to update
- **Response**: Updated leaderboard configuration
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/gamification/leaderboards/{leaderboardId}/rankings
```
- **Purpose**: Retrieve current rankings for a specific leaderboard
- **Path Parameters**:
  - `leaderboardId`: UUID of the leaderboard
- **Query Parameters**:
  - `limit`: Number of ranks to return (default: 10)
  - `offset`: Pagination offset (default: 0)
- **Response**: Array of ranked entries with worker details and scores
- **Auth Requirements**: Requires authentication; depends on leaderboard visibility settings

#### Rewards Endpoints

```
GET /api/v1/gamification/rewards
```
- **Purpose**: Retrieve a list of configurable rewards
- **Query Parameters**:
  - `limit`: Number of rewards to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `type`: Filter by reward type
  - `status`: Filter by status (active/inactive)
- **Response**: Array of reward objects with metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/gamification/rewards/{rewardId}
```
- **Purpose**: Retrieve details for a specific reward
- **Path Parameters**:
  - `rewardId`: UUID of the reward
- **Response**: Detailed reward object
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/rewards
```
- **Purpose**: Create a new reward
- **Request Body**:
  - `name`: Reward name (required)
  - `description`: Reward description
  - `type`: Reward type (digital/physical/recognition)
  - `cost`: Point cost if redeemable
  - `inventory`: Inventory settings if limited
  - `eligibilityRules`: Rules for who can earn/redeem this reward
- **Response**: Created reward object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
POST /api/v1/gamification/rewards/{rewardId}/distribute
```
- **Purpose**: Distribute rewards to workers
- **Path Parameters**:
  - `rewardId`: UUID of the reward
- **Request Body**:
  - `targetType`: Type of targeting (workers/segment)
  - `targetIds`: Array of worker IDs or segment IDs
  - `message`: Optional message to include with the reward
- **Response**: Distribution confirmation
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Worker Gamification Endpoints

```
GET /api/v1/workers/{workerId}/badges
```
- **Purpose**: Retrieve badges earned by a specific worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Response**: Array of earned badge objects with award dates
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/workers/{workerId}/points
```
- **Purpose**: Retrieve point balance and history for a worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Query Parameters**:
  - `timeRange`: Optional time range for history
- **Response**: Point balance and transaction history
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/workers/{workerId}/points/adjust
```
- **Purpose**: Manually adjust points for a worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Request Body**:
  - `amount`: Point amount (positive or negative)
  - `reason`: Reason for adjustment
  - `note`: Optional admin note
- **Response**: Updated point balance
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/workers/{workerId}/challenges
```
- **Purpose**: Retrieve challenge participation for a worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Query Parameters**:
  - `status`: Filter by status (active/completed/all)
- **Response**: Array of challenge participation objects with progress
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Gamification Dashboard Endpoints

```
GET /api/v1/gamification/dashboard
```
- **Purpose**: Retrieve summary data for the gamification dashboard
- **Query Parameters**:
  - `timeRange`: Time range for metrics (e.g., "30d", default: "30d")
  - `segmentId`: Optional segment ID for filtering
- **Response**: Dashboard data including engagement metrics, challenge summaries, and impact data
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

### Integration with Other Platform APIs

The Wellbeing and Gamification features integrate extensively with other platform components to create a cohesive experience. These integration points include:

#### Content Management Integration

Wellbeing and Gamification features leverage the Content Management system for:

1. **Storing Assessment Question Types**:
   ```
   GET /api/v1/content/types?category=wellbeing-assessment
   ```
   - Retrieves available question types for wellbeing assessments

2. **Managing Intervention Content**:
   ```
   GET /api/v1/content/media
   ```
   - Used to browse and select media for interventions

3. **Creating Message Templates**:
   ```
   POST /api/v1/content/templates
   ```
   - Creates message templates for wellbeing interventions or gamification notifications

4. **Retrieving Content for Challenges**:
   ```
   GET /api/v1/content?type=challenge-material
   ```
   - Retrieves content associated with gamification challenges

#### Journey Builder Integration

Wellbeing assessments and gamification elements are incorporated into journeys via:

1. **Adding Assessment Touchpoints**:
   ```
   POST /api/v1/journeys/{journeyId}/phases/{phaseId}/touchpoints
   ```
   - Creates touchpoints that reference wellbeing assessments
   - Payload includes `contentType: "wellbeing-assessment"` and `contentId: "{assessmentId}"`

2. **Adding Badge Award Touchpoints**:
   ```
   POST /api/v1/journeys/{journeyId}/phases/{phaseId}/touchpoints
   ```
   - Creates touchpoints that award badges upon completion
   - Payload includes `action: "award-badge"` and `badgeId: "{badgeId}"`

3. **Configuring Conditional Logic**:
   ```
   PATCH /api/v1/journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}
   ```
   - Updates touchpoint logic to include wellbeing indicator conditions
   - Example: Show different content based on stress level indicator

#### Program Implementation Integration

Programs leverage wellbeing data and gamification elements via:

1. **Configuring Wellbeing Monitoring**:
   ```
   PATCH /api/v1/programs/{programId}/wellbeing-config
   ```
   - Configures wellbeing monitoring settings for a program
   - Includes alert thresholds, assessment frequency, and intervention triggers

2. **Incorporating Challenges**:
   ```
   POST /api/v1/programs/{programId}/challenges
   ```
   - Associates challenges with a specific program
   - Configures program-specific challenge settings

3. **Reporting Program Impact on Wellbeing**:
   ```
   GET /api/v1/programs/{programId}/analytics/wellbeing
   ```
   - Retrieves analytics showing program impact on wellbeing indicators

#### Segmentation Integration

Wellbeing and gamification data can be used for segmentation via:

1. **Creating Wellbeing-based Segments**:
   ```
   POST /api/v1/segments
   ```
   - Creates segments based on wellbeing indicator values
   - Example rule: `{ "type": "indicator", "indicatorId": "stress-level", "operator": ">", "value": 7 }`

2. **Creating Engagement-based Segments**:
   ```
   POST /api/v1/segments
   ```
   - Creates segments based on gamification engagement metrics
   - Example rule: `{ "type": "gamification", "metric": "points-earned", "timeframe": "30d", "operator": "<", "value": 100 }`

3. **Targeting by Wellbeing Status**:
   ```
   POST /api/v1/programs/{programId}/workers
   ```
   - Assigns workers to programs based on wellbeing segments
   - Enables targeted interventions for at-risk workers

#### Marketplace Integration

Wellbeing content and gamification elements can be shared via the marketplace:

1. **Publishing Wellbeing Assessments**:
   ```
   POST /api/v1/marketplace/publish
   ```
   - Publishes wellbeing assessment templates to the marketplace
   - Includes categorization as "wellbeing-assessment"

2. **Browsing Wellbeing Content**:
   ```
   GET /api/v1/marketplace/listings?category=wellbeing
   ```
   - Retrieves wellbeing-related content from the marketplace

3. **Acquiring Gamification Packages**:
   ```
   POST /api/v1/marketplace/listings/{listingId}/acquire
   ```
   - Acquires pre-configured gamification elements (badges, challenges)
   - Imports them into the organization's library

## API Integration

### Wellbeing API Endpoints

The Wellbeing feature requires a comprehensive set of API endpoints to support its functionality. These endpoints facilitate data retrieval, creation, updating, and analysis of wellbeing-related information.

#### Indicators Endpoints

```
GET /api/v1/wellbeing/indicators
```
- **Purpose**: Retrieve a list of wellbeing indicators
- **Query Parameters**:
  - `limit`: Number of indicators to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `search`: Search term for indicator name/description
  - `status`: Filter by indicator status (active/archived)
  - `category`: Filter by indicator category
- **Response**: Array of indicator objects with metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/indicators/{indicatorId}
```
- **Purpose**: Retrieve details for a specific indicator
- **Path Parameters**:
  - `indicatorId`: UUID of the indicator
- **Response**: Detailed indicator object including configuration, thresholds, and mappings
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/wellbeing/indicators
```
- **Purpose**: Create a new wellbeing indicator
- **Request Body**:
  - `name`: Indicator name (required)
  - `description`: Indicator description
  - `category`: Indicator category
  - `scale`: Object defining scale properties (min, max, steps)
  - `thresholds`: Array of threshold configurations (value, label, action)
- **Response**: Created indicator object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/wellbeing/indicators/{indicatorId}
```
- **Purpose**: Update an existing indicator
- **Path Parameters**:
  - `indicatorId`: UUID of the indicator
- **Request Body**: Any indicator properties to update
- **Response**: Updated indicator object
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/wellbeing/indicators/{indicatorId}/trend
```
- **Purpose**: Retrieve trend data for an indicator
- **Path Parameters**:
  - `indicatorId`: UUID of the indicator
- **Query Parameters**:
  - `timeRange`: Time range for trend data (e.g., "30d", "6m")
  - `segmentId`: Optional segment ID for filtering
- **Response**: Time series data for the indicator
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/indicators/{indicatorId}/distribution
```
- **Purpose**: Retrieve distribution data for an indicator
- **Path Parameters**:
  - `indicatorId`: UUID of the indicator
- **Query Parameters**:
  - `segmentId`: Optional segment ID for filtering
- **Response**: Distribution data for the indicator (histogram)
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Assessments Endpoints

```
GET /api/v1/wellbeing/assessments
```
- **Purpose**: Retrieve a list of wellbeing assessment templates
- **Query Parameters**:
  - `limit`: Number of assessments to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `search`: Search term for assessment name/description
  - `type`: Filter by assessment type
  - `status`: Filter by status (draft/active/archived)
- **Response**: Array of assessment template objects
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/assessments/{assessmentId}
```
- **Purpose**: Retrieve details for a specific assessment template
- **Path Parameters**:
  - `assessmentId`: UUID of the assessment
- **Response**: Detailed assessment object including questions, logic, and metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/wellbeing/assessments
```
- **Purpose**: Create a new assessment template
- **Request Body**:
  - `name`: Assessment name (required)
  - `description`: Assessment description
  - `type`: Assessment type (quick/standard/comprehensive)
  - `questions`: Array of question objects
- **Response**: Created assessment object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/wellbeing/assessments/{assessmentId}
```
- **Purpose**: Update an existing assessment template
- **Path Parameters**:
  - `assessmentId`: UUID of the assessment
- **Request Body**: Any assessment properties to update
- **Response**: Updated assessment object
- **Auth Requirements**: Requires authentication; Training Manager role

```
POST /api/v1/wellbeing/assessments/{assessmentId}/schedule
```
- **Purpose**: Schedule an assessment for delivery
- **Path Parameters**:
  - `assessmentId`: UUID of the assessment
- **Request Body**:
  - `startDate`: Start date for the assessment
  - `endDate`: Optional end date for the assessment
  - `recurringPattern`: Optional recurring pattern configuration
  - `targetType`: Type of targeting (segment/workers)
  - `targetIds`: Array of segment IDs or worker IDs
  - `notificationSettings`: Configuration for notifications
- **Response**: Created schedule object with ID
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/assessments/{assessmentId}/results
```
- **Purpose**: Retrieve aggregated results for an assessment
- **Path Parameters**:
  - `assessmentId`: UUID of the assessment
- **Query Parameters**:
  - `scheduleId`: Optional schedule ID to filter by specific deployment
  - `segmentId`: Optional segment ID for filtering
  - `timeRange`: Time range for results (e.g., "30d", "all")
- **Response**: Aggregated results data including completion rates and response distributions
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Interventions Endpoints

```
GET /api/v1/wellbeing/interventions
```
- **Purpose**: Retrieve a list of wellbeing intervention templates
- **Query Parameters**:
  - `limit`: Number of interventions to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `search`: Search term for intervention name/description
  - `type`: Filter by intervention type
  - `targetIndicator`: Filter by target indicator
- **Response**: Array of intervention template objects
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/interventions/{interventionId}
```
- **Purpose**: Retrieve details for a specific intervention
- **Path Parameters**:
  - `interventionId`: UUID of the intervention
- **Response**: Detailed intervention object including content, targeting rules, and metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/wellbeing/interventions
```
- **Purpose**: Create a new intervention template
- **Request Body**:
  - `name`: Intervention name (required)
  - `description`: Intervention description
  - `type`: Intervention type (resource/activity/communication)
  - `targetIndicators`: Array of indicator IDs this intervention targets
  - `content`: Content configuration based on intervention type
  - `triggerRules`: Optional automatic triggering rules
- **Response**: Created intervention object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/wellbeing/interventions/{interventionId}
```
- **Purpose**: Update an existing intervention
- **Path Parameters**:
  - `interventionId`: UUID of the intervention
- **Request Body**: Any intervention properties to update
- **Response**: Updated intervention object
- **Auth Requirements**: Requires authentication; Training Manager role

```
POST /api/v1/wellbeing/interventions/{interventionId}/assign
```
- **Purpose**: Assign an intervention to workers or segments
- **Path Parameters**:
  - `interventionId`: UUID of the intervention
- **Request Body**:
  - `targetType`: Type of targeting (segment/workers)
  - `targetIds`: Array of segment IDs or worker IDs
  - `startDate`: Start date for the intervention
  - `endDate`: Optional end date for the intervention
  - `notificationSettings`: Configuration for notifications
- **Response**: Created assignment object with ID
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/interventions/{interventionId}/effectiveness
```
- **Purpose**: Retrieve effectiveness metrics for an intervention
- **Path Parameters**:
  - `interventionId`: UUID of the intervention
- **Query Parameters**:
  - `timeRange`: Time range for metrics (e.g., "30d", "all")
  - `segmentId`: Optional segment ID for filtering
- **Response**: Effectiveness metrics including completion rates, pre/post changes, and feedback
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Alerts Endpoints

```
GET /api/v1/wellbeing/alerts
```
- **Purpose**: Retrieve a list of wellbeing alerts
- **Query Parameters**:
  - `limit`: Number of alerts to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `priority`: Filter by alert priority (critical/moderate/low)
  - `type`: Filter by alert type
  - `status`: Filter by status (new/in-progress/resolved)
  - `segmentId`: Filter by segment
  - `timeRange`: Filter by time range
- **Response**: Array of alert objects
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/alerts/{alertId}
```
- **Purpose**: Retrieve details for a specific alert
- **Path Parameters**:
  - `alertId`: UUID of the alert
- **Response**: Detailed alert object including trigger details, worker info, and response history
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
PATCH /api/v1/wellbeing/alerts/{alertId}
```
- **Purpose**: Update an alert (e.g., change status, add response)
- **Path Parameters**:
  - `alertId`: UUID of the alert
- **Request Body**:
  - `status`: New status for the alert
  - `assignedTo`: User ID to assign the alert to
  - `responseAction`: Action taken in response to the alert
  - `notes`: Notes about the response
- **Response**: Updated alert object
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/alert-rules
```
- **Purpose**: Retrieve configured alert rules
- **Response**: Array of alert rule objects
- **Auth Requirements**: Requires authentication; Training Manager role

```
POST /api/v1/wellbeing/alert-rules
```
- **Purpose**: Create a new alert rule
- **Request Body**:
  - `name`: Rule name (required)
  - `description`: Rule description
  - `type`: Rule type (threshold/trend/response/inactivity)
  - `conditions`: Conditions configuration based on rule type
  - `priority`: Alert priority (critical/moderate/low)
  - `notificationRouting`: Configuration for alert routing
- **Response**: Created rule object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/wellbeing/alert-rules/{ruleId}
```
- **Purpose**: Update an existing alert rule
- **Path Parameters**:
  - `ruleId`: UUID of the rule
- **Request Body**: Any rule properties to update
- **Response**: Updated rule object
- **Auth Requirements**: Requires authentication; Training Manager role

#### Wellbeing Dashboard Endpoints

```
GET /api/v1/wellbeing/dashboard
```
- **Purpose**: Retrieve summary data for the wellbeing dashboard
- **Query Parameters**:
  - `timeRange`: Time range for metrics (e.g., "30d", default: "30d")
  - `segmentId`: Optional segment ID for filtering
- **Response**: Dashboard data including summary metrics, trends, and insights
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/wellbeing/analytics
```
- **Purpose**: Retrieve detailed analytics data for wellbeing
- **Query Parameters**:
  - `timeRange`: Time range for analytics (e.g., "30d", "6m")
  - `segmentId`: Optional segment ID for filtering
  - `indicators`: Optional comma-separated list of indicator IDs to include
  - `groupBy`: Optional grouping parameter (segment/program/time)
- **Response**: Detailed analytics data based on query parameters
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

### Gamification API Endpoints

The Gamification feature requires a comprehensive set of API endpoints to support badges, challenges, leaderboards, rewards, and engagement tracking.

#### Badges Endpoints

```
GET /api/v1/gamification/badges
```
- **Purpose**: Retrieve a list of badges/achievements
- **Query Parameters**:
  - `limit`: Number of badges to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `search`: Search term for badge name/description
  - `category`: Filter by badge category
  - `status`: Filter by status (active/archived)
- **Response**: Array of badge objects with metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/gamification/badges/{badgeId}
```
- **Purpose**: Retrieve details for a specific badge
- **Path Parameters**:
  - `badgeId`: UUID of the badge
- **Response**: Detailed badge object including criteria, design assets, and statistics
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/badges
```
- **Purpose**: Create a new badge
- **Request Body**:
  - `name`: Badge name (required)
  - `description`: Badge description
  - `category`: Badge category
  - `difficulty`: Badge difficulty level
  - `pointsValue`: Points awarded for earning the badge
  - `criteria`: Object defining earning criteria
  - `design`: Badge design configuration or asset references
- **Response**: Created badge object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/gamification/badges/{badgeId}
```
- **Purpose**: Update an existing badge
- **Path Parameters**:
  - `badgeId`: UUID of the badge
- **Request Body**: Any badge properties to update
- **Response**: Updated badge object
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/gamification/badges/{badgeId}/statistics
```
- **Purpose**: Retrieve statistics for a badge
- **Path Parameters**:
  - `badgeId`: UUID of the badge
- **Query Parameters**:
  - `timeRange`: Time range for statistics (e.g., "30d", "all")
  - `segmentId`: Optional segment ID for filtering
- **Response**: Statistics including earned count, completion rate, average time to earn
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Challenges Endpoints

```
GET /api/v1/gamification/challenges
```
- **Purpose**: Retrieve a list of challenges
- **Query Parameters**:
  - `limit`: Number of challenges to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `search`: Search term for challenge name/description
  - `type`: Filter by challenge type
  - `status`: Filter by status (draft/active/scheduled/completed)
- **Response**: Array of challenge objects with metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/gamification/challenges/{challengeId}
```
- **Purpose**: Retrieve details for a specific challenge
- **Path Parameters**:
  - `challengeId`: UUID of the challenge
- **Response**: Detailed challenge object including requirements, rewards, and participation data
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/challenges
```
- **Purpose**: Create a new challenge
- **Request Body**:
  - `name`: Challenge name (required)
  - `description`: Challenge description
  - `type`: Challenge type (streak/points/activity/competition)
  - `startDate`: Start date for the challenge
  - `endDate`: End date for the challenge
  - `requirements`: Object defining challenge requirements based on type
  - `rewards`: Object defining rewards for completion
  - `targeting`: Object defining eligible participants
- **Response**: Created challenge object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/gamification/challenges/{challengeId}
```
- **Purpose**: Update an existing challenge
- **Path Parameters**:
  - `challengeId`: UUID of the challenge
- **Request Body**: Any challenge properties to update
- **Response**: Updated challenge object
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/gamification/challenges/{challengeId}/progress
```
- **Purpose**: Retrieve progress data for a challenge
- **Path Parameters**:
  - `challengeId`: UUID of the challenge
- **Query Parameters**:
  - `segmentId`: Optional segment ID for filtering
- **Response**: Progress data including participation metrics and completion breakdown
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/challenges/{challengeId}/remind
```
- **Purpose**: Send reminders to challenge participants
- **Path Parameters**:
  - `challengeId`: UUID of the challenge
- **Request Body**:
  - `targetType`: Type of targeting (all/inactive/segment)
  - `targetIds`: Array of worker IDs if specific targeting
  - `message`: Custom reminder message (optional)
- **Response**: Confirmation of reminders sent
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Leaderboards Endpoints

```
GET /api/v1/gamification/leaderboards
```
- **Purpose**: Retrieve a list of configured leaderboards
- **Query Parameters**:
  - `limit`: Number of leaderboards to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `type`: Filter by leaderboard type
  - `status`: Filter by status (active/inactive)
- **Response**: Array of leaderboard configuration objects
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/gamification/leaderboards/{leaderboardId}
```
- **Purpose**: Retrieve details for a specific leaderboard configuration
- **Path Parameters**:
  - `leaderboardId`: UUID of the leaderboard
- **Response**: Detailed leaderboard configuration object
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/leaderboards
```
- **Purpose**: Create a new leaderboard configuration
- **Request Body**:
  - `name`: Leaderboard name (required)
  - `description`: Leaderboard description
  - `type`: Leaderboard type (points/badges/specific challenge)
  - `scope`: Scope settings (organization/segment/program)
  - `scopeIds`: IDs relevant to the selected scope
  - `timeframe`: Timeframe settings (all-time/weekly/monthly/custom)
  - `visibilitySettings`: Configuration for who can view the leaderboard
- **Response**: Created leaderboard configuration with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
PATCH /api/v1/gamification/leaderboards/{leaderboardId}
```
- **Purpose**: Update an existing leaderboard configuration
- **Path Parameters**:
  - `leaderboardId`: UUID of the leaderboard
- **Request Body**: Any leaderboard properties to update
- **Response**: Updated leaderboard configuration
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/gamification/leaderboards/{leaderboardId}/rankings
```
- **Purpose**: Retrieve current rankings for a specific leaderboard
- **Path Parameters**:
  - `leaderboardId`: UUID of the leaderboard
- **Query Parameters**:
  - `limit`: Number of ranks to return (default: 10)
  - `offset`: Pagination offset (default: 0)
- **Response**: Array of ranked entries with worker details and scores
- **Auth Requirements**: Requires authentication; depends on leaderboard visibility settings

#### Rewards Endpoints

```
GET /api/v1/gamification/rewards
```
- **Purpose**: Retrieve a list of configurable rewards
- **Query Parameters**:
  - `limit`: Number of rewards to return (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `type`: Filter by reward type
  - `status`: Filter by status (active/inactive)
- **Response**: Array of reward objects with metadata
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/gamification/rewards/{rewardId}
```
- **Purpose**: Retrieve details for a specific reward
- **Path Parameters**:
  - `rewardId`: UUID of the reward
- **Response**: Detailed reward object
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/gamification/rewards
```
- **Purpose**: Create a new reward
- **Request Body**:
  - `name`: Reward name (required)
  - `description`: Reward description
  - `type`: Reward type (digital/physical/recognition)
  - `cost`: Point cost if redeemable
  - `inventory`: Inventory settings if limited
  - `eligibilityRules`: Rules for who can earn/redeem this reward
- **Response**: Created reward object with ID
- **Auth Requirements**: Requires authentication; Training Manager role

```
POST /api/v1/gamification/rewards/{rewardId}/distribute
```
- **Purpose**: Distribute rewards to workers
- **Path Parameters**:
  - `rewardId`: UUID of the reward
- **Request Body**:
  - `targetType`: Type of targeting (workers/segment)
  - `targetIds`: Array of worker IDs or segment IDs
  - `message`: Optional message to include with the reward
- **Response**: Distribution confirmation
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Worker Gamification Endpoints

```
GET /api/v1/workers/{workerId}/badges
```
- **Purpose**: Retrieve badges earned by a specific worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Response**: Array of earned badge objects with award dates
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
GET /api/v1/workers/{workerId}/points
```
- **Purpose**: Retrieve point balance and history for a worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Query Parameters**:
  - `timeRange`: Optional time range for history
- **Response**: Point balance and transaction history
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

```
POST /api/v1/workers/{workerId}/points/adjust
```
- **Purpose**: Manually adjust points for a worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Request Body**:
  - `amount`: Point amount (positive or negative)
  - `reason`: Reason for adjustment
  - `note`: Optional admin note
- **Response**: Updated point balance
- **Auth Requirements**: Requires authentication; Training Manager role

```
GET /api/v1/workers/{workerId}/challenges
```
- **Purpose**: Retrieve challenge participation for a worker
- **Path Parameters**:
  - `workerId`: UUID of the worker
- **Query Parameters**:
  - `status`: Filter by status (active/completed/all)
- **Response**: Array of challenge participation objects with progress
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

#### Gamification Dashboard Endpoints

```
GET /api/v1/gamification/dashboard
```
- **Purpose**: Retrieve summary data for the gamification dashboard
- **Query Parameters**:
  - `timeRange`: Time range for metrics (e.g., "30d", default: "30d")
  - `segmentId`: Optional segment ID for filtering
- **Response**: Dashboard data including engagement metrics, challenge summaries, and impact data
- **Auth Requirements**: Requires authentication; Training Manager or Program Manager role

### Integration with Other Platform APIs

The Wellbeing and Gamification features integrate extensively with other platform components to create a cohesive experience. These integration points include:

#### Content Management Integration

Wellbeing and Gamification features leverage the Content Management system for:

1. **Storing Assessment Question Types**:
   ```
   GET /api/v1/content/types?category=wellbeing-assessment
   ```
   - Retrieves available question types for wellbeing assessments

2. **Managing Intervention Content**:
   ```
   GET /api/v1/content/media
   ```
   - Used to browse and select media for interventions

3. **Creating Message Templates**:
   ```
   POST /api/v1/content/templates
   ```
   - Creates message templates for wellbeing interventions or gamification notifications

4. **Retrieving Content for Challenges**:
   ```
   GET /api/v1/content?type=challenge-material
   ```
   - Retrieves content associated with gamification challenges

#### Journey Builder Integration

Wellbeing assessments and gamification elements are incorporated into journeys via:

1. **Adding Assessment Touchpoints**:
   ```
   POST /api/v1/journeys/{journeyId}/phases/{phaseId}/touchpoints
   ```
   - Creates touchpoints that reference wellbeing assessments
   - Payload includes `contentType: "wellbeing-assessment"` and `contentId: "{assessmentId}"`

2. **Adding Badge Award Touchpoints**:
   ```
   POST /api/v1/journeys/{journeyId}/phases/{phaseId}/touchpoints
   ```
   - Creates touchpoints that award badges upon completion
   - Payload includes `action: "award-badge"` and `badgeId: "{badgeId}"`

3. **Configuring Conditional Logic**:
   ```
   PATCH /api/v1/journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}
   ```
   - Updates touchpoint logic to include wellbeing indicator conditions
   - Example: Show different content based on stress level indicator

#### Program Implementation Integration

Programs leverage wellbeing data and gamification elements via:

1. **Configuring Wellbeing Monitoring**:
   ```
   PATCH /api/v1/programs/{programId}/wellbeing-config
   ```
   - Configures wellbeing monitoring settings for a program
   - Includes alert thresholds, assessment frequency, and intervention triggers

2. **Incorporating Challenges**:
   ```
   POST /api/v1/programs/{programId}/challenges
   ```
   - Associates challenges with a specific program
   - Configures program-specific challenge settings

3. **Reporting Program Impact on Wellbeing**:
   ```
   GET /api/v1/programs/{programId}/analytics/wellbeing
   ```
   - Retrieves analytics showing program impact on wellbeing indicators

#### Segmentation Integration

Wellbeing and gamification data can be used for segmentation via:

1. **Creating Wellbeing-based Segments**:
   ```
   POST /api/v1/segments
   ```
   - Creates segments based on wellbeing indicator values
   - Example rule: `{ "type": "indicator", "indicatorId": "stress-level", "operator": ">", "value": 7 }`

2. **Creating Engagement-based Segments**:
   ```
   POST /api/v1/segments
   ```
   - Creates segments based on gamification engagement metrics
   - Example rule: `{ "type": "gamification", "metric": "points-earned", "timeframe": "30d", "operator": "<", "value": 100 }`

3. **Targeting by Wellbeing Status**:
   ```
   POST /api/v1/programs/{programId}/workers
   ```
   - Assigns workers to programs based on wellbeing segments
   - Enables targeted interventions for at-risk workers

#### Marketplace Integration

Wellbeing content and gamification elements can be shared via the marketplace:

1. **Publishing Wellbeing Assessments**:
   ```
   POST /api/v1/marketplace/publish
   ```
   - Publishes wellbeing assessment templates to the marketplace
   - Includes categorization as "wellbeing-assessment"

2. **Browsing Wellbeing Content**:
   ```
   GET /api/v1/marketplace/listings?category=wellbeing
   ```
   - Retrieves wellbeing-related content from the marketplace

3. **Acquiring Gamification Packages**:
   ```
   POST /api/v1/marketplace/listings/{listingId}/acquire
   ```
   - Acquires pre-configured gamification elements (badges, challenges)
   - Imports them into the organization's library

## Implementation Guidelines

### Development Considerations

#### Code Organization

For both Wellbeing and Gamification features, follow the established project structure:

1. **Component Organization**:
   - Place components under `src/components/features/wellbeing/` and `src/components/features/gamification/`
   - Create subdirectories for logical grouping (e.g., `indicators`, `assessments`, `badges`, `challenges`)
   - Keep files under 400 lines by breaking down complex components

2. **API Integration**:
   - Define API functions in `src/lib/api/endpoints/wellbeing.ts` and `src/lib/api/endpoints/gamification.ts`
   - Create custom hooks in `src/hooks/features/useWellbeingApi.ts` and `src/hooks/features/useGamificationApi.ts`
   - Use React Query for data fetching, caching, and mutations

3. **Routing Structure**:
   - Define routes in `src/app/(app)/wellbeing/` and `src/app/(app)/gamification/`
   - Follow Next.js App Router conventions with `page.tsx`, `layout.tsx`, etc.

4. **State Management**:
   - Use React Query for server state management
   - Use React state and context for UI state
   - Consider specialized stores (Zustand) for complex state like assessment builder

#### Development Workflow

1. **Component Development**:
   - Start with low-level components (cards, form elements)
   - Build up to page-level components
   - Use Storybook for isolated component development
   - Document component props with JSDoc

2. **Feature Implementation**:
   - Implement API integration first
   - Develop UI components with mock data
   - Connect components to real API
   - Add error handling and loading states

3. **Testing Strategy**:
   - Unit test utilities and hooks
   - Component tests for key interactions
   - Integration tests for critical flows
   - Manual testing for complex interactions

### Performance Optimization

1. **Component Memoization**:
   - Use `React.memo` for list items and repetitive components
   - Use `useMemo` for expensive computations (e.g., data transformations)
   - Use `useCallback` for functions passed to child components

2. **Data Handling**:
   - Implement pagination for large data sets
   - Use infinite scrolling for long lists
   - Consider virtual scrolling for very large lists

3. **Rendering Optimization**:
   - Use skeleton loaders for better perceived performance
   - Implement lazy loading for charts and visualizations
   - Defer non-critical component rendering

### Accessibility Considerations

1. **Screen Reader Support**:
   - Use semantic HTML elements
   - Provide ARIA attributes for custom components
   - Test with screen readers

2. **Keyboard Navigation**:
   - Ensure all interactive elements are keyboard accessible
   - Use proper focus management
   - Provide keyboard shortcuts for common actions

3. **Visual Accessibility**:
   - Maintain WCAG AA minimum contrast ratios
   - Provide text alternatives for charts and visualizations
   - Support zoom and text resizing

### Mobile and WhatsApp Integration

1. **Responsive Design**:
   - Implement mobile-first layouts
   - Use fluid typography and spacing
   - Test on various screen sizes

2. **WhatsApp Considerations**:
   - Keep messages under 1,000 characters
   - Use simple formatting for assessment questions
   - Design interventions that work well in messaging context

3. **Offline Support**:
   - Cache critical data for offline access
   - Queue interactions when offline
   - Sync when connection is restored

### Integration with Other Features

1. **Journey Builder Integration**:
   - Create touchpoint types for wellbeing assessments and interventions
   - Support badge awards and point allocations in journeys
   - Enable condition branching based on wellbeing indicators or gamification progress

2. **Program Implementation Integration**:
   - Allow wellbeing monitoring configuration in programs
   - Enable challenge association with programs
   - Provide wellbeing and engagement metrics in program dashboards

3. **Segmentation Integration**:
   - Support segment creation based on wellbeing indicators
   - Enable targeting by engagement metrics
   - Provide wellbeing and gamification data in segment analytics

4. **Marketplace Integration**:
   - Enable assessment templates and intervention resources to be shared
   - Support badge and challenge templates in marketplace
   - Provide licensing options for wellbeing content

### Security and Privacy

1. **Data Protection**:
   - Treat wellbeing data as sensitive
   - Implement proper access controls
   - Encrypt data in transit and at rest

2. **User Consent**:
   - Obtain explicit consent for wellbeing monitoring
   - Allow opting out of specific assessments
   - Provide clear privacy policies

3. **Regulatory Compliance**:
   - Consider health information regulations
   - Implement data retention policies
   - Support data export and deletion

## Conclusion

The Wellbeing and Gamification features provide essential tools for monitoring and improving worker wellbeing while increasing engagement through motivational elements. By implementing these features according to the specifications in this document, the platform will deliver:

1. **Comprehensive Wellbeing Support**:
   - Early detection of wellbeing issues
   - Targeted interventions
   - Analytics to measure effectiveness

2. **Engaging Gamification Elements**:
   - Motivation through badges and challenges
   - Recognition via leaderboards
   - Rewards for achieving goals

3. **Integrated Experience**:
   - Seamless connection with core platform features
   - Consistent user experience
   - Data-driven insights

These specialized features significantly enhance the platform's ability to support frontline workers and drive behavior change, ultimately achieving the core mission of improving worker outcomes through effective behavioral coaching.
