# ABCD Behavior Coach - Journey Builder

## 1. Overview

The Journey Builder is a core feature of the ABCD Behavior Coach platform that enables Training Managers and Content Specialists to create structured behavioral coaching experiences. It provides a visual canvas for designing journey flows, connecting touchpoints, configuring branching logic, and linking content modules to create effective coaching pathways for workers.

### 1.1 Purpose & Business Value

The Journey Builder serves several critical business needs:

1. **Structured Learning Experiences**: Creates coherent, progressive coaching experiences that build worker capabilities over time
2. **Behavioral Change Focus**: Enables the design of interventions specifically targeted at changing behaviors
3. **Consistency at Scale**: Ensures all workers receive consistent, high-quality coaching experiences
4. **Personalization**: Allows for branching logic to create adaptive learning paths based on worker responses
5. **Measurement & Optimization**: Provides frameworks for testing different approaches and measuring outcomes
6. **Content Reusability**: Promotes the reuse of effective content across different journeys and programs

### 1.2 Feature Highlights

* Visual canvas for journey design with drag-and-drop functionality
* Phase-based organization for logical grouping of touchpoints
* Diverse touchpoint types (messages, quizzes, assessments, etc.)
* Conditional branching based on worker responses and attributes
* Integration with content library for easy content selection
* Journey simulation for testing before deployment
* Analytics integration for journey effectiveness measurement

## 2. Key Concepts

### 2.1 Journey Blueprints

Journey Blueprints are reusable templates that structure sequences of content, rules, branching, and pacing logic. They serve as the foundation for Programs but don't directly link to worker progress.

**Key attributes of Journey Blueprints:**
- **ID**: Unique identifier
- **Title**: Name of the journey
- **Description**: Detailed explanation of the journey's purpose and content
- **Organization ID**: The organization that owns the journey
- **Created By**: User who created the journey
- **Updated By**: User who last updated the journey
- **Created At**: Creation timestamp
- **Updated At**: Last update timestamp
- **Tags**: Optional categorization labels
- **Status**: Draft, Published, Archived

### 2.2 Phases

Phases are large sections within a Journey Blueprint that organize touchpoints into logical groups (e.g., "Onboarding", "Core Training", "Assessment").

**Key attributes of Phases:**
- **ID**: Unique identifier
- **Journey Blueprint ID**: Parent journey
- **Name**: Phase name
- **Sequence Order**: Position within the journey (determines flow)
- **Description**: Optional explanation of the phase's purpose

### 2.3 Touchpoints

Touchpoints are discrete steps within phases that reference specific content items and may include rule logic for branching or specialized conditions.

**Key attributes of Touchpoints:**
- **ID**: Unique identifier
- **Phase ID**: Parent phase
- **Content ID**: Reference to the content module
- **Touchpoint Type**: Message, Quiz, Assessment, etc.
- **Rule Logic**: JSON or text representation of branching conditions
- **Sequence Order**: Position within the phase
- **Wait Duration**: Optional time delay before this touchpoint activates
- **Required**: Whether completion is mandatory to proceed
- **Created At**: Creation timestamp
- **Updated At**: Last update timestamp

### 2.4 Program Deployment

Journey Blueprints are deployed to workers through Programs, which assign journeys to specific segments, handle scheduling, and track worker progress.

**The deployment process:**
1. Program Manager selects one or more Journey Blueprints
2. Workers/segments are assigned to the program
3. Start/end dates and scheduling parameters are configured
4. Program is activated, making journeys available to workers
5. Worker progress is tracked at the touchpoint level

## 3. User Roles & Permissions

The Journey Builder is primarily used by different user roles within the platform, each with specific responsibilities and permissions related to creating and managing journeys.

### 3.1 Training Manager

Training Managers are primarily responsible for designing and curating effective learning journeys.

**Primary responsibilities:**
- Creating and maintaining the organization's library of Journey Blueprints
- Ensuring journeys align with learning/behavioral objectives
- Designing journey flows and sequencing content effectively
- Testing journey effectiveness through simulations
- Reviewing and approving journeys created by Content Specialists
- Creating journey templates for consistent organizational design patterns

**Permissions:**
- Create, edit, delete, and publish Journey Blueprints
- Create and manage phases and touchpoints
- Configure branching logic and conditions
- Link content modules to touchpoints
- Run journey simulations
- View journey analytics
- Import/export journey templates
- Create and manage journey-level experiments
- Set organizational standards for journeys

### 3.2 Content Specialist

Content Specialists focus on creating effective content and integrating it into journey flows.

**Primary responsibilities:**
- Creating content that fits within journey structures
- Designing specific touchpoints that utilize content effectively
- Ensuring content flow is logical within journey phases
- Testing content effectiveness in journey simulations
- Suggesting improvements to journey structures

**Permissions:**
- Create and edit Journey Blueprints (may require approval to publish)
- Create and manage phases and touchpoints
- Link content to touchpoints
- Run journey simulations
- View content performance within journeys
- Suggest journey improvements

### 3.3 Program Manager

Program Managers focus on deploying journeys to worker segments and monitoring their effectiveness.

**Primary responsibilities:**
- Selecting appropriate Journey Blueprints for program deployment
- Monitoring journey effectiveness in active programs
- Identifying journey improvements based on worker progress
- Making journey recommendations to Training Managers

**Permissions:**
- View Journey Blueprints
- Use Journey Blueprints in Programs
- View journey structure and content
- View journey analytics
- Export journey data for reporting

### 3.4 Organization Admin

Organization Admins have overall governance responsibility for the platform, including journey management.

**Primary responsibilities:**
- Setting standards for journey design within the organization
- Managing journey access and permissions
- Overseeing journey quality and effectiveness
- Making strategic decisions about journey approaches

**Permissions:**
- All Training Manager permissions
- Manage journey templates across the organization
- Set journey standards and templates
- Access organizational journey analytics
- Manage user permissions related to journeys
- Approve journeys for marketplace publication (if applicable)

### 3.5 Permissions Implementation

Journey-related permissions are controlled through the platform's role-based access control system:

```tsx
// Example permission check implementation in components
const useJourneyPermissions = () => {
  const { user } = useAuth();
  
  return {
    canCreate: ['training_manager', 'content_specialist', 'organization_admin'].includes(user.role),
    canEdit: ['training_manager', 'content_specialist', 'organization_admin'].includes(user.role),
    canDelete: ['training_manager', 'organization_admin'].includes(user.role),
    canPublish: ['training_manager', 'organization_admin'].includes(user.role),
    canManageTemplates: ['training_manager', 'organization_admin'].includes(user.role),
    canRunSimulations: ['training_manager', 'content_specialist', 'program_manager', 'organization_admin'].includes(user.role),
    canCreateExperiments: ['training_manager', 'organization_admin'].includes(user.role),
  };
};

// Usage in a component
const JourneyActions = ({ journeyId }) => {
  const permissions = useJourneyPermissions();
  
  return (
    <div className="journey-actions">
      {permissions.canEdit && (
        <Button onClick={() => handleEdit(journeyId)}>Edit</Button>
      )}
      {permissions.canDelete && (
        <Button variant="danger" onClick={() => handleDelete(journeyId)}>Delete</Button>
      )}
      {permissions.canPublish && journeyStatus === 'draft' && (
        <Button variant="primary" onClick={() => handlePublish(journeyId)}>Publish</Button>
      )}
    </div>
  );
};
```

## 4. Pages & Components

The Journey Builder feature consists of multiple pages and components that work together to provide a comprehensive journey creation and management experience.

### 4.1 Journey List Page

The Journey List Page displays all Journey Blueprints available in the organization with filtering and search capabilities.

#### 4.1.1 Route

```
/journeys
```

#### 4.1.2 Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Journey Blueprints")                  [Create Journey]   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ JourneyMetricsCards                                                 │ │
│ │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐              │ │
│ │ │ Total Journeys│ │ Published     │ │ Used in       │              │ │
│ │ │ 24            │ │ Journeys: 18  │ │ Programs: 15  │              │ │
│ │ │ └───────────────┘ └───────────────┘ └───────────────┘              │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FilterBar                                                           │ │
│ │ ┌────────────┐ ┌────────────┐ ┌────────────────┐ ┌───────────────┐ │ │
│ │ │ Search     │ │ Status ▼   │ │ Created By ▼   │ │ Sort By ▼     │ │ │
│ │ └────────────┘ └────────────┘ └────────────────┘ └───────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ JourneyList                                                         │ │
│ │ ┌───────────────────────────────────────────────────────────────┐   │ │
│ │ │ JourneyCard                                             [···] │   │ │
│ │ │ Title: Onboarding Excellence                                  │   │ │
│ │ │ Status: Published | Phases: 4 | Touchpoints: 12               │   │ │
│ │ │ Created: Jan 15, 2023 | Last edited: Mar 3, 2023              │   │ │
│ │ │ [View] [Edit] [Duplicate]                                     │   │ │
│ │ └───────────────────────────────────────────────────────────────┘   │ │
│ │                                                                     │ │
│ │ ┌───────────────────────────────────────────────────────────────┐   │ │
│ │ │ JourneyCard                                             [···] │   │ │
│ │ │ Title: Customer Service Training                              │   │ │
│ │ │ Status: Draft | Phases: 3 | Touchpoints: 8                    │   │ │
│ │ │ Created: Feb 10, 2023 | Last edited: Feb 28, 2023             │   │ │
│ │ │ [View] [Edit] [Duplicate]                                     │   │ │
│ │ └───────────────────────────────────────────────────────────────┘   │ │
│ │                                                                     │ │
│ │ [ ... more journey cards ... ]                                      │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Pagination                                                          │ │
│ │ [< Prev] [1] [2] [3] [Next >]                 Showing 1-10 of 24   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 4.1.3 Components

1. **PageHeader**
   - Title "Journey Blueprints"
   - "Create Journey" button (primary action button)

2. **JourneyMetricsCards**
   - Set of cards displaying key metrics:
     - Total journey count
     - Published journeys count
     - Journeys in active programs count

3. **FilterBar**
   - Search input for journey title/description
   - Status filter dropdown (All, Draft, Published, Archived)
   - Created By filter dropdown
   - Sort By dropdown (Newest, Oldest, A-Z, Z-A, Most Used)

4. **JourneyList**
   - Grid or list of JourneyCard components
   - Pagination controls at the bottom

5. **JourneyCard**
   - Journey title
   - Status indicator (Draft, Published, Archived)
   - Phase and touchpoint counts
   - Creation and last edit dates
   - Action buttons (View, Edit, Duplicate)
   - Overflow menu (...) for additional actions (Delete, Archive)

#### 4.1.4 State Management

```tsx
// Main page state
const [journeys, setJourneys] = useState<Journey[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  createdBy: 'all',
  sortBy: 'newest'
});
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0
});

// Filter handlers
const handleSearchChange = (search: string) => {
  setFilters(prev => ({ ...prev, search }));
  setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
};

const handleStatusChange = (status: string) => {
  setFilters(prev => ({ ...prev, status }));
  setPagination(prev => ({ ...prev, page: 1 }));
};

const handleCreatedByChange = (createdBy: string) => {
  setFilters(prev => ({ ...prev, createdBy }));
  setPagination(prev => ({ ...prev, page: 1 }));
};

const handleSortChange = (sortBy: string) => {
  setFilters(prev => ({ ...prev, sortBy }));
};

// Pagination handlers
const handlePageChange = (page: number) => {
  setPagination(prev => ({ ...prev, page }));
};

// Journey actions
const handleCreateJourney = () => {
  router.push('/journeys/create');
};

const handleViewJourney = (journeyId: string) => {
  router.push(`/journeys/${journeyId}`);
};

const handleEditJourney = (journeyId: string) => {
  router.push(`/journeys/builder/${journeyId}`);
};

const handleDuplicateJourney = async (journeyId: string) => {
  // Implementation for duplicating a journey
};

const handleDeleteJourney = async (journeyId: string) => {
  // Implementation for deleting a journey
};
```

#### 4.1.5 API Integration

The Journey List page interacts with the following API endpoints:

1. **GET /journeys**: Fetch journeys list with filtering, pagination, sorting.
   ```tsx
   // Using React Query for data fetching with custom hook
   const useJourneys = (filters, pagination) => {
     return useQuery(
       ['journeys', filters, pagination],
       () => fetchJourneys(filters, pagination),
       {
         keepPreviousData: true,
         staleTime: 30000,
       }
     );
   };
   
   // In the component:
   const { data, isLoading, error } = useJourneys(filters, pagination);
   ```

2. **POST /journeys/{journeyId}/duplicate**: Duplicate a journey blueprint.
   ```tsx
   const { mutate: duplicateJourney, isLoading: isDuplicating } = useMutation(
     (journeyId) => duplicateJourneyApi(journeyId),
     {
       onSuccess: () => {
         toast.success('Journey duplicated successfully');
         queryClient.invalidateQueries(['journeys']);
       },
       onError: (error) => {
         toast.error('Failed to duplicate journey');
         console.error(error);
       }
     }
   );
   ```

3. **DELETE /journeys/{journeyId}**: Delete a journey blueprint.
   ```tsx
   const { mutate: deleteJourney, isLoading: isDeleting } = useMutation(
     (journeyId) => deleteJourneyApi(journeyId),
     {
       onSuccess: () => {
         toast.success('Journey deleted successfully');
         queryClient.invalidateQueries(['journeys']);
       },
       onError: (error) => {
         toast.error('Failed to delete journey');
         console.error(error);
       }
     }
   );
   ```

#### 4.1.6 Implementation Details

**JourneyCard Component:**
```tsx
interface JourneyCardProps {
  journey: Journey;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const JourneyCard: React.FC<JourneyCardProps> = ({
  journey,
  onView,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const { id, title, status, phaseCount, touchpointCount, createdAt, updatedAt } = journey;
  const permissions = useJourneyPermissions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format dates for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="journey-card">
      <CardContent>
        <div className="journey-card-header">
          <Typography variant="h6">{title}</Typography>
          <Dropdown>
            <DropdownTrigger>
              <IconButton>
                <MoreVerticalIcon />
              </IconButton>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onClick={() => onView(id)}>View</DropdownItem>
              {permissions.canEdit && (
                <DropdownItem onClick={() => onEdit(id)}>Edit</DropdownItem>
              )}
              {permissions.canCreate && (
                <DropdownItem onClick={() => onDuplicate(id)}>Duplicate</DropdownItem>
              )}
              {permissions.canDelete && (
                <DropdownItem 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive"
                >
                  Delete
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        
        <div className="journey-card-status">
          <Badge 
            variant={
              status === 'published' ? 'success' : 
              status === 'draft' ? 'secondary' : 'default'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <div className="journey-card-metrics">
            <span>{phaseCount} Phases</span>
            <span>•</span>
            <span>{touchpointCount} Touchpoints</span>
          </div>
        </div>
        
        <div className="journey-card-dates">
          <Typography variant="caption">
            Created: {formatDate(createdAt)}
          </Typography>
          <Typography variant="caption">
            Last edited: {formatDate(updatedAt)}
          </Typography>
        </div>
        
        <div className="journey-card-actions">
          <Button variant="ghost" onClick={() => onView(id)}>View</Button>
          {permissions.canEdit && (
            <Button variant="outline" onClick={() => onEdit(id)}>Edit</Button>
          )}
          {permissions.canCreate && (
            <Button variant="outline" onClick={() => onDuplicate(id)}>Duplicate</Button>
          )}
        </div>
      </CardContent>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journey</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(id);
                setShowDeleteConfirm(false);
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
```

**Journey Metrics Component:**
```tsx
interface JourneyMetricsCardsProps {
  metrics: {
    total: number;
    published: number;
    inPrograms: number;
  };
  isLoading: boolean;
}

const JourneyMetricsCards: React.FC<JourneyMetricsCardsProps> = ({
  metrics,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2">
            <Typography variant="h4">{metrics.total}</Typography>
            <Typography variant="subtitle2">Total Journeys</Typography>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2">
            <Typography variant="h4">{metrics.published}</Typography>
            <Typography variant="subtitle2">Published Journeys</Typography>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2">
            <Typography variant="h4">{metrics.inPrograms}</Typography>
            <Typography variant="subtitle2">Used in Programs</Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

#### 4.1.7 Responsive Behavior

The Journey List page adapts to different screen sizes:

1. **Desktop (≥1024px)**: 
   - Full grid layout with 3 cards per row
   - All metrics cards displayed in a single row
   - Full set of action buttons visible

2. **Tablet (768px-1023px)**:
   - Grid layout with 2 cards per row
   - Metrics cards may adjust to fit screen width
   - Some action buttons may collapse into dropdown menus

3. **Mobile (<768px)**:
   - Single-column layout (1 card per row)
   - Metrics cards stack vertically
   - Simplified action buttons with more actions in dropdown
   - Filters collapse into a dropdown or accordion

### 4.2 Journey Creation Page

The Journey Creation page provides an interface for creating a new Journey Blueprint by defining basic metadata.

#### 4.2.1 Route

```
/journeys/create
```

#### 4.2.2 Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Create Journey Blueprint")          [Cancel] [Continue]  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Basic Information")                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Title*                                                          │ │ │
│ │ │ [                                                             ] │ │ │
│ │ │                                                                 │ │ │
│ │ │ Description                                                     │ │ │
│ │ │ [                                                             ] │ │ │
│ │ │ [                                                             ] │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Tags & Categorization")                                │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Tags                                                            │ │ │
│ │ │ [Dropdown with multi-select and create new tag option]          │ │ │
│ │ │                                                                 │ │ │
│ │ │ Selected tags: [Onboarding] [Training] [Customer Service]       │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormSection("Templates") - Optional                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Start from template (optional)                                  │ │ │
│ │ │                                                                 │ │ │
│ │ │ ○ Start from scratch                                           │ │ │
│ │ │ ○ Use template                                                 │ │ │
│ │ │                                                                 │ │ │
│ │ │ [Dropdown with available templates - appears when selected]     │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 4.2.3 Components

1. **PageHeader**
   - Title "Create Journey Blueprint"
   - "Cancel" button (secondary action)
   - "Continue" button (primary action)

2. **FormSection: Basic Information**
   - Title input field (required)
   - Description text area

3. **FormSection: Tags & Categorization**
   - Tags multi-select dropdown with ability to create new tags
   - Selected tags display

4. **FormSection: Templates** (Optional)
   - Radio buttons to choose between starting from scratch or using a template
   - Template selection dropdown (conditionally displayed)

#### 4.2.4 State Management

```tsx
// Form state
const [journeyData, setJourneyData] = useState({
  title: '',
  description: '',
  tags: [],
  useTemplate: false,
  templateId: null
});

// Validation state
const [errors, setErrors] = useState({
  title: ''
});

// Form handlers
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setJourneyData(prev => ({ ...prev, [name]: value }));
  
  // Clear error when field is updated
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const handleTagsChange = (selectedTags) => {
  setJourneyData(prev => ({ ...prev, tags: selectedTags }));
};

const handleTemplateOptionChange = (useTemplate) => {
  setJourneyData(prev => ({ 
    ...prev, 
    useTemplate,
    templateId: useTemplate ? prev.templateId : null
  }));
};

const handleTemplateChange = (templateId) => {
  setJourneyData(prev => ({ ...prev, templateId }));
};

// Form submission
const validateForm = () => {
  const newErrors = {
    title: journeyData.title.trim() ? '' : 'Title is required'
  };
  
  setErrors(newErrors);
  return !Object.values(newErrors).some(error => error);
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    const response = await createJourney(journeyData);
    router.push(`/journeys/builder/${response.id}`);
  } catch (error) {
    toast.error('Failed to create journey');
    console.error(error);
  }
};

const handleCancel = () => {
  router.push('/journeys');
};
```

#### 4.2.5 API Integration

The Journey Creation page interacts with the following API endpoints:

1. **POST /journeys**: Create a new Journey Blueprint.
   ```tsx
   const { mutate: createJourney, isLoading } = useMutation(
     (data) => createJourneyApi(data),
     {
       onSuccess: (response) => {
         toast.success('Journey created successfully');
         router.push(`/journeys/builder/${response.id}`);
       },
       onError: (error) => {
         toast.error('Failed to create journey');
         console.error(error);
       }
     }
   );
   ```

2. **GET /content/tags**: Fetch available tags for the tags dropdown.
   ```tsx
   const { data: availableTags, isLoading: isLoadingTags } = useQuery(
     ['content-tags'],
     fetchContentTags
   );
   ```

3. **GET /journeys/templates**: Fetch available journey templates.
   ```tsx
   const { data: templates, isLoading: isLoadingTemplates } = useQuery(
     ['journey-templates'],
     fetchJourneyTemplates,
     {
       enabled: journeyData.useTemplate,
     }
   );
   ```

### 4.3 Journey Detail Page

The Journey Detail page provides a read-only view of a Journey Blueprint's structure, metadata, and analytics.

#### 4.3.1 Route

```
/journeys/{journeyId}
```

### 4.4 Journey Builder Canvas Page

The Journey Builder Canvas is the core feature of the platform, providing a visual interface for designing journey flows with phases and touchpoints.

#### 4.4.1 Route

```
/journeys/builder/{journeyId}
```

#### 4.4.2 Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Edit Journey: Customer Service Training")               │ │
│ │                              [Discard] [Save Draft] [Publish]       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ BuilderToolbar                                                      │ │
│ │ ┌──────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────────┐ ┌─────┐ │ │
│ │ │ Undo │ │ Phases │ │ Zoom - │ │ Zoom + │ │ Simulation  │ │ 75% │ │ │
│ │ └──────┘ └────────┘ └────────┘ └─────────┘ └─────────────┘ └─────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────┐┌───────────────────────────────────────────────────────┐ │
│ │ PhasesPanel││ BuilderCanvas                                         │ │
│ │            ││                                                       │ │
│ │ + New Phase││ ┌───────────────────┐                                 │ │
│ │            ││ │ Phase: Onboarding │                                 │ │
│ │ Onboarding ││ └───────────────────┘                                 │ │
│ │ ▼          ││     │                                                 │ │
│ │            ││     ▼                                                 │ │
│ │ Core       ││ ┌──────────────────────┐                              │ │
│ │ Training   ││ │ Welcome Message      │                              │ │
│ │ ▼          ││ │ Type: Message       ┌───┐                           │ │
│ │            ││ │ Content: Welcome... │...│                           │ │
│ │ Assessment ││ └──────────────────────┘───┘                          │ │
│ │ ▼          ││     │                                                 │ │
│ │            ││     ▼                                                 │ │
│ │ Feedback   ││ ┌──────────────────────┐                              │ │
│ │ ▼          ││ │ Initial Assessment   │                              │ │
│ │            ││ │ Type: Quiz           │                              │ │
│ │            ││ │ Questions: 5        ┌───┐                           │ │
│ │            ││ └──────────────────────┘───┘                          │ │
│ │            ││     │                                                 │ │
│ │            ││     ├─────────────┬─────────────┐                     │ │
│ │            ││     │ Score < 50% │ Score ≥ 50% │                     │ │
│ │            ││     ▼             │             ▼                     │ │
│ │            ││ ┌──────────────┐  │  ┌──────────────────┐             │ │
│ │            ││ │ Remedial     │  │  │ Advanced         │             │ │
│ │            ││ │ Training     │  │  │ Training         │             │ │
│ │            ││ └──────────────┘  │  └──────────────────┘             │ │
│ │            ││     │             │       │                           │ │
│ │            ││     └─────────────┴───────┘                           │ │
│ │            ││                   │                                   │ │
│ │            ││                   ▼                                   │ │
│ │            ││ ┌──────────────────────┐                              │ │
│ │            ││ │ Phase: Core Training │                              │ │
│ │            ││ └──────────────────────┘                              │ │
│ │            ││                                                       │ │
│ │            ││ [ ... additional touchpoints and connections ... ]    │ │
│ │            ││                                                       │ │
│ └────────────┘└───────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PropertiesPanel (appears when a touchpoint or phase is selected)    │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Welcome Message (Touchpoint)                               [×]  │ │ │
│ │ ├─────────────────────────────────────────────────────────────────┤ │ │
│ │ │ Type: Message                                                   │ │ │
│ │ │ [Dropdown]                                                      │ │ │
│ │ │                                                                 │ │ │
│ │ │ Content:                                                        │ │ │
│ │ │ [Select Content]                                                │ │ │
│ │ │                                                                 │ │ │
│ │ │ Wait Duration:                                                  │ │ │
│ │ │ [Input] [Dropdown: Minutes/Hours/Days]                          │ │ │
│ │ │                                                                 │ │ │
│ │ │ Required to Proceed: [Checkbox]                                 │ │ │
│ │ │                                                                 │ │ │
│ │ │ Conditional Rules:                                              │ │ │
│ │ │ [+ Add Rule]                                                    │ │ │
│ │ │                                                                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 4.4.3 Components

1. **PageHeader**
   - Journey title (in edit mode)
   - Action buttons:
     - "Discard" (secondary action)
     - "Save Draft" (secondary action)
     - "Publish" (primary action)

2. **BuilderToolbar**
   - Undo/Redo buttons
   - Phases button (toggle phases panel)
   - Zoom controls
   - Simulation button (launch journey simulation)
   - Zoom percentage display

3. **PhasesPanel**
   - List of phases with drag and drop reordering
   - "New Phase" button
   - Visual indicators for each phase
   - Collapsible for mobile views

4. **BuilderCanvas**
   - Main work area with phases and touchpoints
   - Visual representation of the journey flow
   - Connection lines between touchpoints
   - Drag and drop functionality
   - Pan and zoom capabilities

5. **PropertiesPanel**
   - Contextual panel that appears when a touchpoint or phase is selected
   - Displays properties of the selected item
   - Provides fields to edit properties
   - Changes based on touchpoint type

#### 4.4.4 State Management

The Journey Builder Canvas uses a complex state management approach to handle the interactive nature of the interface. The main state structures include:

```tsx
// Canvas control state
const [canvasState, setCanvasState] = useState({
  scale: 1,                  // Zoom level
  position: { x: 0, y: 0 },  // Pan position
  selectedItemId: null,      // Currently selected item
  selectedItemType: null,    // 'phase' or 'touchpoint'
  isDragging: false,         // Whether the user is currently dragging an item
  history: [],               // Undo/redo history
  historyIndex: -1,          // Current index in history
});

// Journey structure state
const [journeyState, setJourneyState] = useState({
  id: journeyId,
  title: '',
  description: '',
  status: 'draft',
  phases: [],
  touchpoints: [],
  connections: [],
});

// Derived state for the canvas UI
const phasePositions = useMemo(() => {
  // Calculate positions for phases based on their order
  // ...
}, [journeyState.phases]);

const touchpointPositions = useMemo(() => {
  // Calculate positions for touchpoints within their phases
  // ...
}, [journeyState.phases, journeyState.touchpoints]);

const connectionPaths = useMemo(() => {
  // Calculate SVG paths for connections between touchpoints
  // ...
}, [journeyState.connections, touchpointPositions]);
```

#### 4.4.5 Key Interactions

1. **Adding a Phase**
```tsx
const handleAddPhase = () => {
  // Create a new phase with default properties
  const newPhase = {
    id: generateId(),
    name: `New Phase ${journeyState.phases.length + 1}`,
    sequenceOrder: journeyState.phases.length,
    journeyId: journeyId,
  };
  
  // Add to journey state
  const updatedPhases = [...journeyState.phases, newPhase];
  
  // Save to history for undo/redo
  saveToHistory({
    ...journeyState,
    phases: updatedPhases
  });
  
  // Update state
  setJourneyState(prev => ({
    ...prev,
    phases: updatedPhases
  }));
};
```

2. **Adding a Touchpoint**
```tsx
const handleAddTouchpoint = (phaseId) => {
  // Create a new touchpoint with default properties
  const newTouchpoint = {
    id: generateId(),
    phaseId: phaseId,
    type: 'message',
    name: 'New Touchpoint',
    contentId: null,
    sequenceOrder: journeyState.touchpoints.filter(t => t.phaseId === phaseId).length,
    waitDuration: 0,
    required: true,
    ruleLogic: null,
  };
  
  // Add to journey state
  const updatedTouchpoints = [...journeyState.touchpoints, newTouchpoint];
  
  // Save to history for undo/redo
  saveToHistory({
    ...journeyState,
    touchpoints: updatedTouchpoints
  });
  
  // Update state
  setJourneyState(prev => ({
    ...prev,
    touchpoints: updatedTouchpoints
  }));
  
  // Select the new touchpoint for editing
  setCanvasState(prev => ({
    ...prev,
    selectedItemId: newTouchpoint.id,
    selectedItemType: 'touchpoint'
  }));
};
```

3. **Creating a Connection**
```tsx
const handleCreateConnection = (sourceId, targetId) => {
  // Check if connection already exists
  const connectionExists = journeyState.connections.some(
    c => c.sourceId === sourceId && c.targetId === targetId
  );
  
  if (connectionExists) return;
  
  // Create a new connection
  const newConnection = {
    id: generateId(),
    sourceId: sourceId,
    targetId: targetId,
    condition: null, // Optional condition for branching
  };
  
  // Add to journey state
  const updatedConnections = [...journeyState.connections, newConnection];
  
  // Save to history for undo/redo
  saveToHistory({
    ...journeyState,
    connections: updatedConnections
  });
  
  // Update state
  setJourneyState(prev => ({
    ...prev,
    connections: updatedConnections
  }));
};
```

4. **Editing a Touchpoint**
```tsx
const handleTouchpointPropertyChange = (touchpointId, property, value) => {
  // Find the touchpoint to update
  const touchpointIndex = journeyState.touchpoints.findIndex(t => t.id === touchpointId);
  
  if (touchpointIndex === -1) return;
  
  // Create updated touchpoints array
  const updatedTouchpoints = [...journeyState.touchpoints];
  updatedTouchpoints[touchpointIndex] = {
    ...updatedTouchpoints[touchpointIndex],
    [property]: value
  };
  
  // Save to history for undo/redo
  saveToHistory({
    ...journeyState,
    touchpoints: updatedTouchpoints
  });
  
  // Update state
  setJourneyState(prev => ({
    ...prev,
    touchpoints: updatedTouchpoints
  }));
};
```

5. **Reordering Phases**
```tsx
const handlePhaseReorder = (phaseId, newOrder) => {
  // Get all phases and sort them by current sequence order
  const sortedPhases = [...journeyState.phases].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  
  // Find the phase being moved
  const phaseIndex = sortedPhases.findIndex(p => p.id === phaseId);
  
  if (phaseIndex === -1 || phaseIndex === newOrder) return;
  
  // Remove the phase from its current position
  const phase = sortedPhases.splice(phaseIndex, 1)[0];
  
  // Insert it at the new position
  sortedPhases.splice(newOrder, 0, phase);
  
  // Update sequence orders
  const updatedPhases = sortedPhases.map((phase, index) => ({
    ...phase,
    sequenceOrder: index
  }));
  
  // Save to history for undo/redo
  saveToHistory({
    ...journeyState,
    phases: updatedPhases
  });
  
  // Update state
  setJourneyState(prev => ({
    ...prev,
    phases: updatedPhases
  }));
};
```

#### 4.4.6 API Integration

The Journey Builder Canvas interacts with multiple API endpoints:

1. **GET /journeys/{journeyId}**
   - Load the complete journey structure with phases, touchpoints, and connections
   
2. **PATCH /journeys/{journeyId}**
   - Update journey metadata (title, description)
   
3. **POST /journeys/{journeyId}/phases**
   - Add a new phase to the journey

4. **PATCH /journeys/{journeyId}/phases/{phaseId}**
   - Update phase details (name, order)

5. **DELETE /journeys/{journeyId}/phases/{phaseId}**
   - Remove a phase

6. **POST /journeys/{journeyId}/phases/{phaseId}/touchpoints**
   - Add a new touchpoint to a phase

7. **PATCH /journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}**
   - Update touchpoint details

8. **DELETE /journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}**
   - Remove a touchpoint

9. **GET /content**
   - Fetch content modules for touchpoint configuration

10. **GET /journeys/{journeyId}/rules/schema**
    - Get available rules for touchpoint conditions

Example API integration for saving the journey:

```tsx
const handleSaveJourney = async (publish = false) => {
  setIsSaving(true);
  
  try {
    // Create a transformed version of the journey state for the API
    const journeyData = transformJourneyStateForApi(journeyState);
    
    // Update journey metadata
    await updateJourneyApi(journeyId, {
      title: journeyData.title,
      description: journeyData.description,
      status: publish ? 'published' : 'draft'
    });
    
    // Save phases (create, update, or delete as needed)
    await Promise.all([
      // Handle phases to create
      Promise.all(journeyData.phasesToCreate.map(phase => 
        createPhaseApi(journeyId, phase)
      )),
      
      // Handle phases to update
      Promise.all(journeyData.phasesToUpdate.map(phase => 
        updatePhaseApi(journeyId, phase.id, phase)
      )),
      
      // Handle phases to delete
      Promise.all(journeyData.phasesToDelete.map(phaseId => 
        deletePhaseApi(journeyId, phaseId)
      ))
    ]);
    
    // Save touchpoints (create, update, or delete as needed)
    await Promise.all([
      // Handle touchpoints to create
      Promise.all(journeyData.touchpointsToCreate.map(touchpoint => 
        createTouchpointApi(journeyId, touchpoint.phaseId, touchpoint)
      )),
      
      // Handle touchpoints to update
      Promise.all(journeyData.touchpointsToUpdate.map(touchpoint => 
        updateTouchpointApi(journeyId, touchpoint.phaseId, touchpoint.id, touchpoint)
      )),
      
      // Handle touchpoints to delete
      Promise.all(journeyData.touchpointsToDelete.map(({ phaseId, touchpointId }) => 
        deleteTouchpointApi(journeyId, phaseId, touchpointId)
      ))
    ]);
    
    // Refresh the journey data from the server
    await refetchJourney();
    
    toast.success(publish ? 'Journey published successfully' : 'Journey saved successfully');
  } catch (error) {
    console.error('Failed to save journey:', error);
    toast.error('Failed to save journey');
  } finally {
    setIsSaving(false);
  }
};
```

#### 4.4.7 Core Components Implementation

**BuilderCanvas Component:**
```tsx
interface BuilderCanvasProps {
  journeyState: JourneyState;
  canvasState: CanvasState;
  phasePositions: Record<string, Position>;
  touchpointPositions: Record<string, Position>;
  connectionPaths: ConnectionPath[];
  onPhaseSelect: (phaseId: string) => void;
  onTouchpointSelect: (touchpointId: string) => void;
  onPhaseDrop: (phaseId: string, position: Position) => void;
  onTouchpointDrop: (touchpointId: string, position: Position) => void;
  onConnectionStart: (touchpointId: string) => void;
  onConnectionEnd: (touchpointId: string) => void;
  onCanvasClick: () => void;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  journeyState,
  canvasState,
  phasePositions,
  touchpointPositions,
  connectionPaths,
  onPhaseSelect,
  onTouchpointSelect,
  onPhaseDrop,
  onTouchpointDrop,
  onConnectionStart,
  onConnectionEnd,
  onCanvasClick,
}) => {
  // State for tracking drag operations
  const [dragState, setDragState] = useState({
    isDragging: false,
    itemType: null,
    itemId: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
  });
  
  // Reference to the canvas element for position calculations
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Handle canvas click (deselect everything)
  const handleCanvasClick = (e) => {
    // Only trigger if canvas itself was clicked (not a child element)
    if (e.target === canvasRef.current) {
      onCanvasClick();
    }
  };
  
  // Render phases
  const renderPhases = () => {
    return journeyState.phases.map(phase => (
      <PhaseBox
        key={phase.id}
        phase={phase}
        position={phasePositions[phase.id]}
        isSelected={canvasState.selectedItemId === phase.id && canvasState.selectedItemType === 'phase'}
        onSelect={() => onPhaseSelect(phase.id)}
        onDragStart={(position) => {
          setDragState({
            isDragging: true,
            itemType: 'phase',
            itemId: phase.id,
            startPosition: position,
            currentPosition: position,
          });
        }}
        onDrag={(position) => {
          setDragState(prev => ({
            ...prev,
            currentPosition: position,
          }));
        }}
        onDragEnd={(position) => {
          onPhaseDrop(phase.id, position);
          setDragState({
            isDragging: false,
            itemType: null,
            itemId: null,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
          });
        }}
      />
    ));
  };
  
  // Render touchpoints
  const renderTouchpoints = () => {
    return journeyState.touchpoints.map(touchpoint => (
      <TouchpointNode
        key={touchpoint.id}
        touchpoint={touchpoint}
        position={touchpointPositions[touchpoint.id]}
        isSelected={canvasState.selectedItemId === touchpoint.id && canvasState.selectedItemType === 'touchpoint'}
        onSelect={() => onTouchpointSelect(touchpoint.id)}
        onDragStart={(position) => {
          setDragState({
            isDragging: true,
            itemType: 'touchpoint',
            itemId: touchpoint.id,
            startPosition: position,
            currentPosition: position,
          });
        }}
        onDrag={(position) => {
          setDragState(prev => ({
            ...prev,
            currentPosition: position,
          }));
        }}
        onDragEnd={(position) => {
          onTouchpointDrop(touchpoint.id, position);
          setDragState({
            isDragging: false,
            itemType: null,
            itemId: null,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
          });
        }}
        onConnectionStart={() => onConnectionStart(touchpoint.id)}
        onConnectionEnd={() => onConnectionEnd(touchpoint.id)}
      />
    ));
  };
  
  // Render connections between touchpoints
  const renderConnections = () => {
    return connectionPaths.map((connection) => (
      <ConnectionLine
        key={connection.id}
        path={connection.path}
        hasCondition={!!connection.condition}
        label={connection.label}
        isSelected={canvasState.selectedItemId === connection.id && canvasState.selectedItemType === 'connection'}
        onSelect={() => {
          // Handle connection selection
        }}
      />
    ));
  };
  
  return (
    <div
      ref={canvasRef}
      className="journey-builder-canvas"
      style={{
        transform: `scale(${canvasState.scale})`,
        transformOrigin: '0 0',
        transition: 'transform 0.1s ease-in-out',
      }}
      onClick={handleCanvasClick}
    >
      {/* SVG layer for connections */}
      <svg className="connections-layer">
        {renderConnections()}
        {/* Render active connection being created */}
        {canvasState.connectionStart && (
          <ActiveConnectionLine
            start={touchpointPositions[canvasState.connectionStart]}
            end={canvasState.cursorPosition}
          />
        )}
      </svg>
      
      {/* Render phases */}
      <div className="phases-layer">
        {renderPhases()}
      </div>
      
      {/* Render touchpoints */}
      <div className="touchpoints-layer">
        {renderTouchpoints()}
      </div>
      
      {/* Render drag ghost if dragging */}
      {dragState.isDragging && (
        <DragGhost
          itemType={dragState.itemType}
          position={dragState.currentPosition}
          item={
            dragState.itemType === 'phase'
              ? journeyState.phases.find(p => p.id === dragState.itemId)
              : journeyState.touchpoints.find(t => t.id === dragState.itemId)
          }
        />
      )}
    </div>
  );
};
```

**TouchpointPropertiesPanel Component:**
```tsx
interface TouchpointPropertiesPanelProps {
  touchpoint: Touchpoint;
  onClose: () => void;
  onPropertyChange: (property: string, value: any) => void;
  onRuleChange: (ruleLogic: RuleLogic) => void;
  onDelete: () => void;
}

const TouchpointPropertiesPanel: React.FC<TouchpointPropertiesPanelProps> = ({
  touchpoint,
  onClose,
  onPropertyChange,
  onRuleChange,
  onDelete,
}) => {
  // Fetch available content for the selected touchpoint type
  const { data: contentModules, isLoading: isLoadingContent } = useQuery(
    ['content', touchpoint.type],
    () => fetchContentByType(touchpoint.type),
    {
      enabled: !!touchpoint.type,
    }
  );
  
  // Fetch rule schema for building conditions
  const { data: ruleSchema, isLoading: isLoadingRuleSchema } = useQuery(
    ['rule-schema'],
    fetchRuleSchema,
  );
  
  return (
    <div className="touchpoint-properties-panel">
      <div className="panel-header">
        <h3>{touchpoint.name || 'Untitled Touchpoint'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="panel-content">
        <div className="form-group">
          <Label htmlFor="touchpoint-name">Name</Label>
          <Input
            id="touchpoint-name"
            value={touchpoint.name}
            onChange={(e) => onPropertyChange('name', e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="touchpoint-type">Type</Label>
          <Select
            id="touchpoint-type"
            value={touchpoint.type}
            onValueChange={(value) => onPropertyChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message">Message</SelectItem>
              <SelectItem value="quiz">Quiz/Assessment</SelectItem>
              <SelectItem value="reflection">Reflection</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="form-group">
          <Label htmlFor="touchpoint-content">Content</Label>
          {isLoadingContent ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <ContentSelector
              contentModules={contentModules || []}
              selectedContentId={touchpoint.contentId}
              onSelect={(contentId) => onPropertyChange('contentId', contentId)}
            />
          )}
        </div>
        
        <div className="form-group">
          <Label htmlFor="touchpoint-wait">Wait Duration</Label>
          <div className="flex gap-2">
            <Input
              id="touchpoint-wait"
              type="number"
              min="0"
              value={touchpoint.waitDuration}
              onChange={(e) => onPropertyChange('waitDuration', parseInt(e.target.value))}
              className="w-24"
            />
            <Select
              value={touchpoint.waitDurationUnit || 'hours'}
              onValueChange={(value) => onPropertyChange('waitDurationUnit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="form-group">
          <div className="flex items-center gap-2">
            <Checkbox
              id="touchpoint-required"
              checked={touchpoint.required}
              onCheckedChange={(checked) => onPropertyChange('required', checked)}
            />
            <Label htmlFor="touchpoint-required">Required to Proceed</Label>
          </div>
        </div>
        
        <div className="form-group">
          <Label>Conditional Rules</Label>
          {isLoadingRuleSchema ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <RuleBuilder
              ruleLogic={touchpoint.ruleLogic}
              schema={ruleSchema}
              onChange={onRuleChange}
            />
          )}
        </div>
        
        <div className="panel-actions">
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            Delete Touchpoint
          </Button>
        </div>
      </div>
    </div>
  );
};
```

#### 4.4.8 Responsive Behavior

The Journey Builder Canvas adapts to different screen sizes:

1. **Desktop (≥1024px)**: 
   - Full canvas with side panels
   - Detailed property panels
   - Enhanced touchpoint and phase visualizations

2. **Tablet (768px-1023px)**:
   - Collapsible side panels
   - Simplified property panels
   - Touch-friendly controls with larger hit areas

3. **Mobile (<768px)**:
   - Single panel view (switch between canvas and properties)
   - Simplified touchpoint display
   - Limited canvas functionality with focus on basic properties

### 4.5 Journey Simulation Page

The Journey Simulation Page allows users to test a journey flow with a simulated worker profile before deploying it in a program.

#### 4.5.1 Route

```
/journeys/simulation/{journeyId}
```

#### 4.5.2 Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Journey Simulation: Customer Service Training")         │ │
│ │                                         [Back to Editor]            │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ SimulationToolbar                                                   │ │
│ │ ┌─────────────┐ ┌────────────┐ ┌───────────┐ ┌───────────────────┐ │ │
│ │ │ Reset      │ │ Step Back │ │ Step Next │ │ Auto Play/Pause   │ │ │
│ │ └─────────────┘ └────────────┘ └───────────┘ └───────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌────────────────┐┌───────────────────────────────────────────────────┐ │
│ │ WorkerProfile ││ SimulationCanvas                                   │ │
│ │                ││                                                   │ │
│ │ Name:         ││ ┌───────────────────┐                             │ │
│ │ Test Worker   ││ │ Phase: Onboarding │                             │ │
│ │                ││ └───────────────────┘                             │ │
│ │ Attributes:    ││     │                                             │ │
│ │ Role: Agent    ││     ▼                                             │ │
│ │ Location: NYC  ││ ┌──────────────────────┐                          │ │
│ │ Performance: 85││ │ Welcome Message      │                          │ │
│ │                ││ │ Type: Message        │                          │ │
│ │ Edit Attributes││ └──────────────────────┘                          │ │
│ │ [Edit]         ││     │                                             │ │
│ │                ││     ▼                                             │ │
│ │ Simulate       ││ ┌──────────────────────┐                          │ │
│ │ Response:      ││ │ Initial Assessment   │ ← Current Step           │ │
│ │ [Text Input]   ││ │ Type: Quiz           │                          │ │
│ │                ││ └──────────────────────┘                          │ │
│ │ Predefined     ││                                                   │ │
│ │ Responses:     ││                                                   │ │
│ │ [A] Yes        ││                                                   │ │
│ │ [B] No         ││                                                   │ │
│ │ [C] Maybe      ││                                                   │ │
│ │                ││                                                   │ │
│ │ Submit         ││                                                   │ │
│ │ [Submit]       ││                                                   │ │
│ │                ││                                                   │ │
│ └────────────────┘└───────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ SimulationInfo                                                      │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Current Touchpoint: Initial Assessment                          │ │ │
│ │ │                                                                 │ │ │
│ │ │ This quiz assesses the worker's current knowledge. Based on     │ │ │
│ │ │ their score, they will be routed to either remedial or advanced │ │ │
│ │ │ training content.                                               │ │ │
│ │ │                                                                 │ │ │
│ │ │ Question: What is the first step in handling a customer         │ │ │
│ │ │ complaint?                                                      │ │ │
│ │ │                                                                 │ │ │
│ │ │ Options:                                                        │ │ │
│ │ │ A. Listen actively and acknowledge the concern                  │ │ │
│ │ │ B. Offer a refund immediately                                   │ │ │
│ │ │ C. Refer to a manager                                           │ │ │
│ │ │                                                                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ SimulationLog                                                       │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Simulation Log:                                                 │ │ │
│ │ │                                                                 │ │ │
│ │ │ 10:42:15 | Started journey simulation                           │ │ │
│ │ │ 10:42:15 | Entered Onboarding phase                             │ │ │
│ │ │ 10:42:20 | Completed Welcome Message touchpoint                 │ │ │
│ │ │ 10:42:25 | Currently at Initial Assessment touchpoint           │ │ │
│ │ │                                                                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 4.5.3 Components

1. **PageHeader**
   - Journey title in simulation mode
   - "Back to Editor" button to return to the builder

2. **SimulationToolbar**
   - "Reset" button to restart the simulation
   - "Step Back" button to move to the previous touchpoint
   - "Step Next" button to move to the next touchpoint
   - "Auto Play/Pause" toggle for automatic progression

3. **WorkerProfile**
   - Simulated worker attributes panel
   - Attribute editing interface
   - Response input for current touchpoint
   - Predefined response options (contextual to touchpoint type)
   - Submit button for worker response

4. **SimulationCanvas**
   - Simplified view of the journey flow
   - Visual indicator for current touchpoint
   - Visualization of the path taken so far

5. **SimulationInfo**
   - Detailed information about the current touchpoint
   - Content preview (text, quiz questions, etc.)
   - Expected behavior description

6. **SimulationLog**
   - Chronological log of simulation events
   - Timestamps and action descriptions
   - Potentially exportable for review

#### 4.5.4 State Management

```tsx
// Main simulation state
const [simulationState, setSimulationState] = useState({
  workerId: 'simulation-worker',
  currentTouchpointId: null,
  currentPhaseId: null,
  completedTouchpoints: [],
  path: [],
  responses: {},
  isAutoPlay: false,
  autoPlayInterval: null,
  isComplete: false,
  logs: [],
});

// Simulated worker profile
const [workerProfile, setWorkerProfile] = useState({
  name: 'Test Worker',
  attributes: {
    role: 'Agent',
    location: 'New York',
    performance: 85,
    experience: 'Intermediate',
    // Other attributes can be added as needed
  }
});

// Current response input
const [currentResponse, setCurrentResponse] = useState('');

// Derived state
const currentTouchpoint = useMemo(() => {
  if (!simulationState.currentTouchpointId) return null;
  return journeyData.touchpoints.find(t => t.id === simulationState.currentTouchpointId);
}, [simulationState.currentTouchpointId, journeyData.touchpoints]);

const currentPhase = useMemo(() => {
  if (!simulationState.currentPhaseId) return null;
  return journeyData.phases.find(p => p.id === simulationState.currentPhaseId);
}, [simulationState.currentPhaseId, journeyData.phases]);

const availableResponses = useMemo(() => {
  if (!currentTouchpoint) return [];
  
  // Generate response options based on touchpoint type
  switch (currentTouchpoint.type) {
    case 'quiz':
      return extractQuizOptions(currentTouchpoint.content);
    case 'message':
      return ['Acknowledge']; // Simple acknowledgment for messages
    // Other touchpoint types...
    default:
      return [];
  }
}, [currentTouchpoint]);
```

#### 4.5.5 Key Interactions

1. **Starting the Simulation**
```tsx
const handleStartSimulation = () => {
  // Find the first touchpoint
  const firstPhase = journeyData.phases.sort((a, b) => a.sequenceOrder - b.sequenceOrder)[0];
  const firstTouchpoint = journeyData.touchpoints
    .filter(t => t.phaseId === firstPhase.id)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)[0];
  
  // Initialize simulation state
  setSimulationState({
    ...simulationState,
    currentPhaseId: firstPhase.id,
    currentTouchpointId: firstTouchpoint.id,
    completedTouchpoints: [],
    path: [],
    responses: {},
    isComplete: false,
    logs: [
      { timestamp: new Date().toISOString(), message: 'Started journey simulation' },
      { timestamp: new Date().toISOString(), message: `Entered ${firstPhase.name} phase` },
      { timestamp: new Date().toISOString(), message: `Currently at ${firstTouchpoint.name} touchpoint` }
    ]
  });
};
```

2. **Submitting a Response**
```tsx
const handleSubmitResponse = () => {
  if (!currentTouchpoint) return;
  
  // Process response
  const updatedResponses = {
    ...simulationState.responses,
    [currentTouchpoint.id]: currentResponse
  };
  
  // Add to completed touchpoints
  const updatedCompletedTouchpoints = [
    ...simulationState.completedTouchpoints,
    currentTouchpoint.id
  ];
  
  // Add to path
  const updatedPath = [
    ...simulationState.path,
    {
      touchpointId: currentTouchpoint.id,
      response: currentResponse,
      timestamp: new Date().toISOString()
    }
  ];
  
  // Add log entry
  const updatedLogs = [
    ...simulationState.logs,
    {
      timestamp: new Date().toISOString(),
      message: `Completed ${currentTouchpoint.name} touchpoint with response: ${currentResponse}`
    }
  ];
  
  // Determine next touchpoint based on response and journey logic
  const nextTouchpoint = determineNextTouchpoint(
    currentTouchpoint,
    currentResponse,
    journeyData,
    workerProfile.attributes
  );
  
  if (nextTouchpoint) {
    // Check if next touchpoint is in a different phase
    const nextPhase = journeyData.phases.find(p => p.id === nextTouchpoint.phaseId);
    const phaseChanged = nextPhase.id !== simulationState.currentPhaseId;
    
    // Add phase change to logs if applicable
    const logsWithPhaseChange = phaseChanged
      ? [...updatedLogs, {
          timestamp: new Date().toISOString(),
          message: `Entered ${nextPhase.name} phase`
        }]
      : updatedLogs;
    
    // Update simulation state with next touchpoint
    setSimulationState({
      ...simulationState,
      currentTouchpointId: nextTouchpoint.id,
      currentPhaseId: nextTouchpoint.phaseId,
      completedTouchpoints: updatedCompletedTouchpoints,
      path: updatedPath,
      responses: updatedResponses,
      logs: [
        ...logsWithPhaseChange,
        {
          timestamp: new Date().toISOString(),
          message: `Currently at ${nextTouchpoint.name} touchpoint`
        }
      ]
    });
  } else {
    // Journey is complete
    setSimulationState({
      ...simulationState,
      currentTouchpointId: null,
      completedTouchpoints: updatedCompletedTouchpoints,
      path: updatedPath,
      responses: updatedResponses,
      isComplete: true,
      logs: [
        ...updatedLogs,
        {
          timestamp: new Date().toISOString(),
          message: 'Journey simulation completed'
        }
      ]
    });
  }
  
  // Clear current response
  setCurrentResponse('');
};
```

3. **Determining the Next Touchpoint**
```tsx
const determineNextTouchpoint = (
  currentTouchpoint,
  response,
  journeyData,
  workerAttributes
) => {
  // Find all connections from this touchpoint
  const connections = journeyData.connections.filter(
    conn => conn.sourceId === currentTouchpoint.id
  );
  
  if (connections.length === 0) {
    // No outgoing connections, look for next touchpoint in sequence
    const touchpointsInPhase = journeyData.touchpoints
      .filter(t => t.phaseId === currentTouchpoint.phaseId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    
    const currentIndex = touchpointsInPhase.findIndex(t => t.id === currentTouchpoint.id);
    
    if (currentIndex < touchpointsInPhase.length - 1) {
      // Return next touchpoint in same phase
      return touchpointsInPhase[currentIndex + 1];
    } else {
      // End of phase, look for next phase
      const phases = journeyData.phases.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
      const currentPhaseIndex = phases.findIndex(p => p.id === currentTouchpoint.phaseId);
      
      if (currentPhaseIndex < phases.length - 1) {
        // Get first touchpoint of next phase
        const nextPhase = phases[currentPhaseIndex + 1];
        const firstTouchpointInNextPhase = journeyData.touchpoints
          .filter(t => t.phaseId === nextPhase.id)
          .sort((a, b) => a.sequenceOrder - b.sequenceOrder)[0];
        
        return firstTouchpointInNextPhase;
      } else {
        // End of journey
        return null;
      }
    }
  } else if (connections.length === 1) {
    // Single connection without conditions
    const targetId = connections[0].targetId;
    return journeyData.touchpoints.find(t => t.id === targetId);
  } else {
    // Multiple connections with conditions
    // Find the first matching condition
    for (const connection of connections) {
      if (!connection.condition) continue;
      
      // Evaluate the condition against response and worker attributes
      const conditionMet = evaluateCondition(
        connection.condition,
        response,
        workerAttributes
      );
      
      if (conditionMet) {
        return journeyData.touchpoints.find(t => t.id === connection.targetId);
      }
    }
    
    // No matching condition, try to find default/fallback connection
    const defaultConnection = connections.find(conn => !conn.condition);
    if (defaultConnection) {
      return journeyData.touchpoints.find(t => t.id === defaultConnection.targetId);
    }
    
    // No default connection, end the journey
    return null;
  }
};
```

4. **Editing Worker Profile**
```tsx
const handleWorkerAttributeChange = (attribute, value) => {
  setWorkerProfile(prev => ({
    ...prev,
    attributes: {
      ...prev.attributes,
      [attribute]: value
    }
  }));
};
```

5. **Controlling Simulation Flow**
```tsx
const handleReset = () => {
  // Reset to the beginning
  handleStartSimulation();
};

const handleStepBack = () => {
  // Get the previous touchpoint from the path
  const previousEntry = simulationState.path[simulationState.path.length - 1];
  if (!previousEntry) return;
  
  // Remove the last entry from path and completed touchpoints
  const updatedPath = [...simulationState.path.slice(0, -1)];
  const updatedCompletedTouchpoints = [...simulationState.completedTouchpoints.slice(0, -1)];
  
  // Get the touchpoint before that
  const newCurrentTouchpointId = updatedPath.length > 0
    ? updatedPath[updatedPath.length - 1].touchpointId
    : journeyData.touchpoints
        .filter(t => t.phaseId === journeyData.phases[0].id)
        .sort((a, b) => a.sequenceOrder - b.sequenceOrder)[0].id;
  
  // Get the phase for the new current touchpoint
  const newCurrentTouchpoint = journeyData.touchpoints.find(t => t.id === newCurrentTouchpointId);
  const newCurrentPhaseId = newCurrentTouchpoint.phaseId;
  
  // Update logs
  const updatedLogs = [
    ...simulationState.logs,
    {
      timestamp: new Date().toISOString(),
      message: `Stepped back to ${newCurrentTouchpoint.name} touchpoint`
    }
  ];
  
  // Update state
  setSimulationState({
    ...simulationState,
    currentTouchpointId: newCurrentTouchpointId,
    currentPhaseId: newCurrentPhaseId,
    completedTouchpoints: updatedCompletedTouchpoints,
    path: updatedPath,
    isComplete: false,
    logs: updatedLogs
  });
};

const toggleAutoPlay = () => {
  if (simulationState.isAutoPlay) {
    // Stop auto-play
    if (simulationState.autoPlayInterval) {
      clearInterval(simulationState.autoPlayInterval);
    }
    
    setSimulationState({
      ...simulationState,
      isAutoPlay: false,
      autoPlayInterval: null
    });
  } else {
    // Start auto-play
    const interval = setInterval(() => {
      // Auto-generate a response and submit
      if (currentTouchpoint && !simulationState.isComplete) {
        const autoResponse = generateAutoResponse(currentTouchpoint, availableResponses);
        setCurrentResponse(autoResponse);
        handleSubmitResponse();
      } else {
        // Stop if complete
        clearInterval(interval);
        setSimulationState(prev => ({
          ...prev,
          isAutoPlay: false,
          autoPlayInterval: null
        }));
      }
    }, 3000); // Advance every 3 seconds
    
    setSimulationState({
      ...simulationState,
      isAutoPlay: true,
      autoPlayInterval: interval
    });
  }
};
```

#### 4.5.6 API Integration

The Journey Simulation interacts with the following API endpoint:

1. **POST /journeys/{journeyId}/simulate**
   ```tsx
   const { mutate: simulateJourney, data: simulationResult } = useMutation(
     (simulationData) => simulateJourneyApi(journeyId, simulationData),
     {
       onSuccess: (data) => {
         // Handle successful simulation
         setSimulationState({
           ...simulationState,
           path: data.path,
           isComplete: true,
           logs: [
             ...simulationState.logs,
             {
               timestamp: new Date().toISOString(),
               message: 'Server-side simulation completed'
             }
           ]
         });
       },
       onError: (error) => {
         toast.error('Failed to run journey simulation');
         console.error(error);
       }
     }
   );
   
   // Function to run server-side simulation
   const handleServerSimulation = () => {
     simulateJourney({
       workerAttributes: workerProfile.attributes,
       simulatedResponses: simulationState.responses
     });
   };
   ```

## 5. API Integration

The Journey Builder feature integrates with multiple backend API endpoints to manage journeys, phases, touchpoints, and related functionality.

### 5.1 Journey Management Endpoints

#### 5.1.1 List & Retrieval

1. **GET** `/journeys`
   - **Purpose**: List all Journey Blueprints in the organization.
   - **Query Parameters**:
     - `search`: Filter by title/description
     - `status`: Filter by status (draft, published, archived)
     - `createdBy`: Filter by creator
     - `sortBy`: Sort order
     - `page`: Page number
     - `limit`: Results per page
   - **Response**: Paginated list of journey blueprints with basic metadata

   ```tsx
   // Example React Query implementation
   const useJourneys = (filters, pagination) => {
     return useQuery(
       ['journeys', filters, pagination],
       () => fetchJourneys(filters, pagination),
       {
         keepPreviousData: true,
         staleTime: 30000,
       }
     );
   };
   ```

2. **GET** `/journeys/{journeyId}`
   - **Purpose**: Get the full structure of a Journey Blueprint.
   - **Response**: Complete journey data including phases, touchpoints, rules, and linked content

   ```tsx
   // Example React Query implementation
   const useJourneyDetails = (journeyId) => {
     return useQuery(
       ['journey', journeyId],
       () => fetchJourneyDetails(journeyId),
       {
         enabled: !!journeyId,
         staleTime: 10000,
       }
     );
   };
   ```

#### 5.1.2 Creation & Updates

3. **POST** `/journeys`
   - **Purpose**: Create a new Journey Blueprint.
   - **Payload**:
     ```json
     {
       "title": "Customer Service Training",
       "description": "A comprehensive journey for training customer service representatives",
       "tags": ["training", "customer-service"]
     }
     ```
   - **Response**: Created journey blueprint data with ID

   ```tsx
   // Example React Query implementation
   const useCreateJourney = () => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (journeyData) => createJourney(journeyData),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journeys']);
           return response;
         }
       }
     );
   };
   ```

4. **PATCH** `/journeys/{journeyId}`
   - **Purpose**: Update Journey Blueprint metadata.
   - **Payload**:
     ```json
     {
       "title": "Updated Customer Service Training",
       "description": "Revised journey for training customer service representatives",
       "status": "published"
     }
     ```
   - **Response**: Updated journey blueprint data

   ```tsx
   // Example React Query implementation
   const useUpdateJourney = (journeyId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (data) => updateJourney(journeyId, data),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           queryClient.invalidateQueries(['journeys']);
           return response;
         }
       }
     );
   };
   ```

5. **DELETE** `/journeys/{journeyId}`
   - **Purpose**: Delete or archive a Journey Blueprint.
   - **Response**: Success status

   ```tsx
   // Example React Query implementation
   const useDeleteJourney = () => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (journeyId) => deleteJourney(journeyId),
       {
         onSuccess: () => {
           queryClient.invalidateQueries(['journeys']);
         }
       }
     );
   };
   ```

#### 5.1.3 Duplication & Templates

6. **POST** `/journeys/{journeyId}/duplicate`
   - **Purpose**: Create a copy of an existing journey blueprint.
   - **Payload**:
     ```json
     {
       "title": "Copy of Customer Service Training",
       "createAsDraft": true
     }
     ```
   - **Response**: Newly created journey blueprint data

   ```tsx
   // Example React Query implementation
   const useDuplicateJourney = () => {
     const queryClient = useQueryClient();
     
     return useMutation(
       ({ journeyId, data }) => duplicateJourney(journeyId, data),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journeys']);
           return response;
         }
       }
     );
   };
   ```

### 5.2 Phase Management Endpoints

1. **POST** `/journeys/{journeyId}/phases`
   - **Purpose**: Add a new phase to the journey.
   - **Payload**:
     ```json
     {
       "name": "Onboarding",
       "sequenceOrder": 1,
       "description": "Initial introduction to the training program"
     }
     ```
   - **Response**: Created phase data with ID

   ```tsx
   // Example React Query implementation
   const useCreatePhase = (journeyId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (phaseData) => createPhase(journeyId, phaseData),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           return response;
         }
       }
     );
   };
   ```

2. **PATCH** `/journeys/{journeyId}/phases/{phaseId}`
   - **Purpose**: Update phase details.
   - **Payload**:
     ```json
     {
       "name": "Updated Onboarding",
       "sequenceOrder": 2
     }
     ```
   - **Response**: Updated phase data

   ```tsx
   // Example React Query implementation
   const useUpdatePhase = (journeyId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       ({ phaseId, data }) => updatePhase(journeyId, phaseId, data),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           return response;
         }
       }
     );
   };
   ```

3. **DELETE** `/journeys/{journeyId}/phases/{phaseId}`
   - **Purpose**: Remove a phase.
   - **Response**: Success status

   ```tsx
   // Example React Query implementation
   const useDeletePhase = (journeyId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (phaseId) => deletePhase(journeyId, phaseId),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           return response;
         }
       }
     );
   };
   ```

### 5.3 Touchpoint Management Endpoints

1. **POST** `/journeys/{journeyId}/phases/{phaseId}/touchpoints`
   - **Purpose**: Add a new touchpoint to a phase.
   - **Payload**:
     ```json
     {
       "contentId": "550e8400-e29b-41d4-a716-446655440000",
       "touchpointType": "message",
       "sequenceOrder": 1,
       "waitDuration": 86400,
       "required": true,
       "ruleLogic": null
     }
     ```
   - **Response**: Created touchpoint data with ID

   ```tsx
   // Example React Query implementation
   const useCreateTouchpoint = (journeyId, phaseId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (touchpointData) => createTouchpoint(journeyId, phaseId, touchpointData),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           return response;
         }
       }
     );
   };
   ```

2. **PATCH** `/journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}`
   - **Purpose**: Update touchpoint details.
   - **Payload**:
     ```json
     {
       "contentId": "660e8400-e29b-41d4-a716-446655440000",
       "sequenceOrder": 2,
       "ruleLogic": {
         "condition": "and",
         "rules": [
           {"field": "previous_response", "operator": "equals", "value": "Yes"}
         ]
       }
     }
     ```
   - **Response**: Updated touchpoint data

   ```tsx
   // Example React Query implementation
   const useUpdateTouchpoint = (journeyId, phaseId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       ({ touchpointId, data }) => updateTouchpoint(journeyId, phaseId, touchpointId, data),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           return response;
         }
       }
     );
   };
   ```

3. **DELETE** `/journeys/{journeyId}/phases/{phaseId}/touchpoints/{touchpointId}`
   - **Purpose**: Remove a touchpoint.
   - **Response**: Success status

   ```tsx
   // Example React Query implementation
   const useDeleteTouchpoint = (journeyId, phaseId) => {
     const queryClient = useQueryClient();
     
     return useMutation(
       (touchpointId) => deleteTouchpoint(journeyId, phaseId, touchpointId),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['journey', journeyId]);
           return response;
         }
       }
     );
   };
   ```

### 5.4 Simulation & Testing Endpoints

1. **POST** `/journeys/{journeyId}/simulate**
   - **Purpose**: Simulate the journey flow for a hypothetical worker profile.
   - **Payload**:
     ```json
     {
       "workerAttributes": {
         "location": "New York",
         "role": "Sales",
         "performance": 85
       },
       "simulatedResponses": {
         "touchpoint1": "Yes",
         "touchpoint2": "Option B"
       }
     }
     ```
   - **Response**: Simulated path through the journey with touchpoint sequence

   ```tsx
   // Example React Query implementation
   const useSimulateJourney = (journeyId) => {
     return useMutation(
       (simulationData) => simulateJourney(journeyId, simulationData)
     );
   };
   ```

2. **GET** `/journeys/{journeyId}/rules/schema**
   - **Purpose**: Get the available conditions and actions for journey rules engine.
   - **Response**: Schema of available fields, operators, and actions for building rules

   ```tsx
   // Example React Query implementation
   const useRuleSchema = (journeyId) => {
     return useQuery(
       ['rule-schema', journeyId],
       () => fetchRuleSchema(journeyId),
       {
         staleTime: 3600000, // 1 hour
       }
     );
   };
   ```

### 5.5 Content Integration Endpoints

These endpoints integrate with the content management system.

1. **GET** `/content**
   - **Purpose**: Fetch content modules for touchpoint configuration.
   - **Query Parameters**:
     - `contentType`: Filter by content type (message, quiz, video, etc.)
     - `search`: Search by title or description
     - `status`: Filter by status (draft, published)
   - **Response**: List of content modules matching the criteria

   ```tsx
   // Example React Query implementation
   const useContentSearch = (filters) => {
     return useQuery(
       ['content', filters],
       () => fetchContent(filters),
       {
         staleTime: 60000, // 1 minute
       }
     );
   };
   ```

### 5.6 Advanced Implementation Details

#### 5.6.1 Batch Processing

For complex journey updates requiring multiple API calls, implement batch processing to reduce network overhead:

```tsx
const saveTouchpoints = async (journeyId, phaseId, touchpoints) => {
  // Split touchpoints into create, update, and delete operations
  const touchpointsToCreate = touchpoints.filter(t => !t.id || t.id.startsWith('temp_'));
  const touchpointsToUpdate = touchpoints.filter(t => t.id && !t.id.startsWith('temp_') && t.hasChanges);
  const touchpointIdsToDelete = deletedTouchpointIds;
  
  // Process in batches
  await Promise.all([
    // Create new touchpoints
    ...touchpointsToCreate.map(touchpoint => 
      createTouchpoint(journeyId, phaseId, touchpoint)
    ),
    
    // Update existing touchpoints
    ...touchpointsToUpdate.map(touchpoint => 
      updateTouchpoint(journeyId, phaseId, touchpoint.id, touchpoint)
    ),
    
    // Delete touchpoints
    ...touchpointIdsToDelete.map(touchpointId => 
      deleteTouchpoint(journeyId, phaseId, touchpointId)
    )
  ]);
};
```

#### 5.6.2 Optimistic Updates

Implement optimistic updates for a more responsive user experience:

```tsx
const useUpdateTouchpointOptimistic = (journeyId, phaseId) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ touchpointId, data }) => updateTouchpoint(journeyId, phaseId, touchpointId, data),
    {
      // Update the cache optimistically
      onMutate: async ({ touchpointId, data }) => {
        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries(['journey', journeyId]);
        
        // Snapshot the previous value
        const previousJourney = queryClient.getQueryData(['journey', journeyId]);
        
        // Optimistically update to the new value
        queryClient.setQueryData(['journey', journeyId], old => {
          const updated = {...old};
          
          // Find and update the touchpoint
          const touchpointIndex = updated.touchpoints.findIndex(t => t.id === touchpointId);
          if (touchpointIndex !== -1) {
            updated.touchpoints[touchpointIndex] = {
              ...updated.touchpoints[touchpointIndex],
              ...data
            };
          }
          
          return updated;
        });
        
        // Return the snapshot for rollback in case of error
        return { previousJourney };
      },
      
      // If the mutation fails, roll back to the previous value
      onError: (err, variables, context) => {
        if (context?.previousJourney) {
          queryClient.setQueryData(['journey', journeyId], context.previousJourney);
        }
      },
      
      // Always refetch after error or success to ensure cache consistency
      onSettled: () => {
        queryClient.invalidateQueries(['journey', journeyId]);
      }
    }
  );
};
```

#### 5.6.3 Error Handling

Implement consistent error handling across API operations:

```tsx
// Helper for API error handling
const handleApiError = (error, defaultMessage = 'An error occurred') => {
  // Extract the error message from the response if available
  const errorMessage = error.response?.data?.message || defaultMessage;
  
  // Log detailed error info for debugging
  console.error('API Error:', error);
  
  // Display user-friendly message
  toast.error(errorMessage);
  
  // Return error for further handling if needed
  return error;
};

// Example usage in an API hook
const useUpdateTouchpoint = (journeyId, phaseId) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ touchpointId, data }) => updateTouchpoint(journeyId, phaseId, touchpointId, data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['journey', journeyId]);
        toast.success('Touchpoint updated successfully');
        return response;
      },
      onError: (error) => {
        handleApiError(error, 'Failed to update touchpoint');
      }
    }
  );
};
```

### 4.6 Journey Deployment Page

The Journey Deployment Page allows administrators to deploy journey blueprints as programs to specific worker segments.

#### 4.6.1 Route

```
/journeys/deploy/{journeyId}
```

#### 4.6.2 Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ PageHeader("Deploy Journey: Customer Service Training")             │ │
│ │                                         [Back to Journey]           │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌───────────────────────────────┐┌───────────────────────────────────┐ │
│ │ DeploymentForm                ││ PreviewPanel                      │ │
│ │ ┌─────────────────────────┐  ││ ┌─────────────────────────────┐   │ │
│ │ │ Program Name            │  ││ │ Journey Preview              │   │ │
│ │ │ [Input Field]           │  ││ │                             │   │ │
│ │ └─────────────────────────┘  ││ │ ┌─────────────────────────┐ │   │ │
│ │                              ││ │ │ Phase: Onboarding       │ │   │ │
│ │ ┌─────────────────────────┐  ││ │ └─────────────────────────┘ │   │ │
│ │ │ Program Description     │  ││ │         │                   │   │ │
│ │ │ [Textarea]              │  ││ │         ▼                   │   │ │
│ │ └─────────────────────────┘  ││ │ ┌─────────────────────────┐ │   │ │
│ │                              ││ │ │ Welcome Message         │ │   │ │
│ │ ┌─────────────────────────┐  ││ │ └─────────────────────────┘ │   │ │
│ │ │ Target Workers          │  ││ │         │                   │   │ │
│ │ │ ● All Workers           │  ││ │         ▼                   │   │ │
│ │ │ ○ By Worker Segment     │  ││ │ ┌─────────────────────────┐ │   │ │
│ │ └─────────────────────────┘  ││ │ │ Initial Assessment      │ │   │ │
│ │                              ││ │ └─────────────────────────┘ │   │ │
│ │ ┌─────────────────────────┐  ││ │            ...              │   │ │
│ │ │ Worker Segments         │  ││ │                             │   │ │
│ │ │ [ ] Sales Team          │  ││ └─────────────────────────────┘   │ │
│ │ │ [✓] Customer Service    │  ││                                   │ │
│ │ │ [ ] Field Technicians   │  ││ ┌─────────────────────────────┐   │ │
│ │ └─────────────────────────┘  ││ │ Deployment Summary          │   │ │
│ │                              ││ │                             │   │ │
│ │ ┌─────────────────────────┐  ││ │ Total Workers: 125          │   │ │
│ │ │ Start Date              │  ││ │ Segments: Customer Service  │   │ │
│ │ │ [Date Picker]           │  ││ │ Start Date: 2023-06-15      │   │ │
│ │ └─────────────────────────┘  ││ │ Duration: 14 days           │   │ │
│ │                              ││ │ Touchpoints: 8              │   │ │
│ │ ┌─────────────────────────┐  ││ │                             │   │ │
│ │ │ End Date                │  ││ │ Status: Ready to deploy     │   │ │
│ │ │ [Date Picker]           │  ││ │                             │   │ │
│ │ └─────────────────────────┘  ││ └─────────────────────────────┘   │ │
│ │                              ││                                   │ │
│ │ ┌─────────────────────────┐  ││ ┌─────────────────────────────┐   │ │
│ │ │ Notifications           │  ││ │ Validation Messages         │   │ │
│ │ │ [✓] Send notifications  │  ││ │                             │   │ │
│ │ │ [ ] Allow reminders     │  ││ │ ✓ Journey is published      │   │ │
│ │ └─────────────────────────┘  ││ │ ✓ All content is published  │   │ │
│ │                              ││ │ ✓ Target segments defined   │   │ │
│ │ ┌─────────────────────────┐  ││ │ ✓ Valid timeframe selected  │   │ │
│ │ │ [Deploy Journey]         │  ││ │                             │   │ │
│ │ └─────────────────────────┘  ││ └─────────────────────────────┘   │ │
│ └───────────────────────────────┘└───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 4.6.3 Components

1. **PageHeader**
   - Journey title in deployment context
   - "Back to Journey" button to return to the journey details

2. **DeploymentForm**
   - Program name input field (required)
   - Program description textarea
   - Target worker selection (all vs. segments)
   - Worker segment selection checkboxes (when segments option selected)
   - Start date picker (required)
   - End date picker (optional)
   - Notification settings
   - Deploy button (with confirmation dialog)

3. **PreviewPanel**
   - Journey structure preview (simplified)
   - Deployment summary with key metrics:
     - Total workers targeted
     - Selected segments
     - Date range
     - Number of touchpoints
     - Validation status

4. **ValidationMessages**
   - List of validation checks and their status
   - Warnings about potential issues
   - Requirements for deployment

#### 4.6.4 State Management

```tsx
// Main deployment form state
const [deploymentForm, setDeploymentForm] = useState({
  programName: `${journey.title} Program`,
  programDescription: journey.description,
  targetType: 'segments', // 'all' or 'segments'
  selectedSegmentIds: [],
  startDate: new Date(Date.now() + 86400000), // Tomorrow
  endDate: null,
  sendNotifications: true,
  allowReminders: false
});

// Form validation state
const [formErrors, setFormErrors] = useState({
  programName: null,
  selectedSegmentIds: null,
  startDate: null,
  endDate: null
});

// Deployment summary calculations
const deploymentSummary = useMemo(() => {
  // Calculate total workers based on selected segments
  const totalWorkers = selectedSegmentIds.length > 0
    ? workerSegments
        .filter(segment => selectedSegmentIds.includes(segment.id))
        .reduce((sum, segment) => sum + segment.workerCount, 0)
    : totalWorkersCount;
  
  // Format segment names for display
  const segmentNames = selectedSegmentIds.length > 0
    ? workerSegments
        .filter(segment => selectedSegmentIds.includes(segment.id))
        .map(segment => segment.name)
        .join(', ')
    : 'All Workers';
  
  // Calculate journey duration if end date is set
  const durationDays = deploymentForm.endDate
    ? Math.ceil((deploymentForm.endDate - deploymentForm.startDate) / (1000 * 60 * 60 * 24))
    : null;
  
  // Count touchpoints in the journey
  const touchpointCount = journey.touchpoints.length;
  
  return {
    totalWorkers,
    segmentNames,
    startDate: deploymentForm.startDate.toISOString().split('T')[0],
    endDate: deploymentForm.endDate?.toISOString().split('T')[0] || 'Open-ended',
    durationDays,
    touchpointCount
  };
}, [deploymentForm, selectedSegmentIds, workerSegments, totalWorkersCount, journey.touchpoints]);

// Validation checks
const validationChecks = useMemo(() => {
  return [
    {
      id: 'journey_published',
      label: 'Journey is published',
      passed: journey.status === 'published',
      required: true
    },
    {
      id: 'content_published',
      label: 'All content is published',
      passed: journey.touchpoints.every(t => t.content?.status === 'published'),
      required: true
    },
    {
      id: 'segments_selected',
      label: 'Target segments defined',
      passed: deploymentForm.targetType === 'all' || deploymentForm.selectedSegmentIds.length > 0,
      required: true
    },
    {
      id: 'valid_timeframe',
      label: 'Valid timeframe selected',
      passed: !!deploymentForm.startDate && (!deploymentForm.endDate || deploymentForm.endDate > deploymentForm.startDate),
      required: true
    }
  ];
}, [journey, deploymentForm]);

// Derived deployment readiness state
const canDeploy = useMemo(() => {
  return (
    // Form validation
    !formErrors.programName &&
    !formErrors.selectedSegmentIds &&
    !formErrors.startDate &&
    !formErrors.endDate &&
    
    // Required validation checks
    validationChecks.filter(check => check.required).every(check => check.passed)
  );
}, [formErrors, validationChecks]);
```

#### 4.6.5 Key Interactions

1. **Handling Form Changes**
```tsx
const handleInputChange = (field, value) => {
  setDeploymentForm(prev => ({
    ...prev,
    [field]: value
  }));
  
  // Validate the field
  validateField(field, value);
};

const validateField = (field, value) => {
  let error = null;
  
  switch (field) {
    case 'programName':
      if (!value || value.trim() === '') {
        error = 'Program name is required';
      }
      break;
    
    case 'selectedSegmentIds':
      if (deploymentForm.targetType === 'segments' && (!value || value.length === 0)) {
        error = 'At least one segment must be selected';
      }
      break;
    
    case 'startDate':
      if (!value) {
        error = 'Start date is required';
      } else if (new Date(value) < new Date()) {
        error = 'Start date cannot be in the past';
      }
      break;
    
    case 'endDate':
      if (value && new Date(value) <= new Date(deploymentForm.startDate)) {
        error = 'End date must be after start date';
      }
      break;
  }
  
  setFormErrors(prev => ({
    ...prev,
    [field]: error
  }));
};
```

2. **Handling Target Worker Type Selection**
```tsx
const handleTargetTypeChange = (targetType) => {
  setDeploymentForm(prev => ({
    ...prev,
    targetType,
    // Reset segment selection if switching to 'all'
    selectedSegmentIds: targetType === 'all' ? [] : prev.selectedSegmentIds
  }));
  
  // Validate segments if switching to segments mode
  if (targetType === 'segments') {
    validateField('selectedSegmentIds', deploymentForm.selectedSegmentIds);
  } else {
    // Clear segment validation error if switching to 'all'
    setFormErrors(prev => ({
      ...prev,
      selectedSegmentIds: null
    }));
  }
};
```

3. **Handling Segment Selection**
```tsx
const handleSegmentToggle = (segmentId) => {
  const updatedSegments = deploymentForm.selectedSegmentIds.includes(segmentId)
    ? deploymentForm.selectedSegmentIds.filter(id => id !== segmentId)
    : [...deploymentForm.selectedSegmentIds, segmentId];
  
  setDeploymentForm(prev => ({
    ...prev,
    selectedSegmentIds: updatedSegments
  }));
  
  validateField('selectedSegmentIds', updatedSegments);
};
```

4. **Deploying the Journey**
```tsx
const handleDeployJourney = async () => {
  if (!canDeploy) return;
  
  // Show confirmation dialog
  const confirmed = await showConfirmDialog({
    title: 'Deploy Journey',
    message: `Are you sure you want to deploy "${deploymentForm.programName}" to ${deploymentSummary.totalWorkers} workers?`,
    confirmText: 'Deploy',
    cancelText: 'Cancel'
  });
  
  if (!confirmed) return;
  
  try {
    // Start loading state
    setIsDeploying(true);
    
    // Create the program from the journey
    const result = await createProgramFromJourney({
      journeyId: journey.id,
      name: deploymentForm.programName,
      description: deploymentForm.programDescription,
      targetAll: deploymentForm.targetType === 'all',
      segmentIds: deploymentForm.selectedSegmentIds,
      startDate: deploymentForm.startDate.toISOString(),
      endDate: deploymentForm.endDate ? deploymentForm.endDate.toISOString() : null,
      notificationSettings: {
        sendNotifications: deploymentForm.sendNotifications,
        allowReminders: deploymentForm.allowReminders
      }
    });
    
    // Show success message
    toast.success(`Journey successfully deployed as program "${deploymentForm.programName}"`);
    
    // Redirect to the new program
    router.push(`/programs/${result.programId}`);
  } catch (error) {
    // Handle error
    console.error('Deployment error:', error);
    toast.error(`Failed to deploy journey: ${error.message || 'Unknown error'}`);
  } finally {
    setIsDeploying(false);
  }
};
```

#### 4.6.6 API Integration

The Journey Deployment page interacts with these API endpoints:

1. **GET** `/worker-segments`
   ```tsx
   const { data: workerSegments, isLoading: isLoadingSegments } = useQuery(
     ['worker-segments'],
     fetchWorkerSegments,
     {
       staleTime: 300000, // 5 minutes
       onError: (error) => {
         toast.error('Failed to load worker segments');
         console.error(error);
       }
     }
   );
   ```

2. **GET** `/workers/count`
   ```tsx
   const { data: totalWorkersCount, isLoading: isLoadingWorkerCount } = useQuery(
     ['workers-count'],
     fetchTotalWorkersCount,
     {
       staleTime: 300000, // 5 minutes
     }
   );
   ```

3. **POST** `/programs`
   ```tsx
   const { mutate: createProgramFromJourney, isLoading: isDeploying } = useMutation(
     (programData) => createProgram(programData),
     {
       onSuccess: (result) => {
         toast.success(`Journey successfully deployed as program "${programData.name}"`);
         router.push(`/programs/${result.programId}`);
       },
       onError: (error) => {
         toast.error(`Failed to deploy journey: ${error.message || 'Unknown error'}`);
         console.error('Deployment error:', error);
       }
     }
   );
   ```

## 6. Data Models and TypeScript Interfaces

This section defines the core TypeScript interfaces for the journey builder system, which ensure type safety and provide comprehensive documentation for the components.

### 6.1 Journey Model

```tsx
/**
 * Represents a journey blueprint, which is a template for a behavior coaching journey
 */
export interface Journey {
  /** Unique identifier for the journey */
  id: string;
  
  /** Organization ID this journey belongs to */
  organizationId: string;
  
  /** Journey title */
  title: string;
  
  /** Detailed description of the journey's purpose and content */
  description: string;
  
  /** Current status of the journey */
  status: 'draft' | 'published' | 'archived';
  
  /** Array of tags for categorization */
  tags: string[];
  
  /** User who created the journey */
  createdBy: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last updated timestamp */
  updatedAt: string;
  
  /** User who last updated the journey */
  updatedBy: string;
  
  /** Phases contained in this journey */
  phases: Phase[];
  
  /** Touchpoints in this journey */
  touchpoints: Touchpoint[];
  
  /** Connections between touchpoints */
  connections: Connection[];
}

/**
 * Simplified journey data returned in list endpoints
 */
export interface JourneySummary {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  phaseCount: number;
  touchpointCount: number;
  programCount: number;
}
```

### 6.2 Phase Model

```tsx
/**
 * Represents a logical grouping of touchpoints within a journey
 */
export interface Phase {
  /** Unique identifier for the phase */
  id: string;
  
  /** Journey this phase belongs to */
  journeyId: string;
  
  /** Phase name */
  name: string;
  
  /** Detailed description of the phase's purpose */
  description: string;
  
  /** Ordering within the journey */
  sequenceOrder: number;
  
  /** Optional color for UI representation */
  color?: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last updated timestamp */
  updatedAt: string;
}
```

### 6.3 Touchpoint Model

```tsx
/**
 * Represents a specific interaction point within a journey phase
 */
export interface Touchpoint {
  /** Unique identifier for the touchpoint */
  id: string;
  
  /** Phase this touchpoint belongs to */
  phaseId: string;
  
  /** Journey this touchpoint belongs to */
  journeyId: string;
  
  /** Reference to the content item */
  contentId: string;
  
  /** Display name for the touchpoint */
  name: string;
  
  /** Type of touchpoint */
  touchpointType: TouchpointType;
  
  /** Ordering within the phase */
  sequenceOrder: number;
  
  /** Time to wait before sending this touchpoint (seconds) */
  waitDuration: number;
  
  /** Whether worker must complete this touchpoint to proceed */
  required: boolean;
  
  /** Optional rule logic for conditional display */
  ruleLogic?: RuleLogic | null;
  
  /** X position on canvas */
  positionX: number;
  
  /** Y position on canvas */
  positionY: number;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last updated timestamp */
  updatedAt: string;
  
  /** Optional nested content data (populated in GET responses) */
  content?: ContentItem;
}

/**
 * Types of touchpoints available in the system
 */
export type TouchpointType = 
  | 'message'   // Simple WhatsApp message
  | 'quiz'      // Assessment with question(s)
  | 'video'     // Video content
  | 'audio'     // Audio content
  | 'image'     // Image content
  | 'survey'    // Multi-question feedback
  | 'document'  // PDF or other document
  | 'link'      // External URL
  | 'activity'; // Interactive activity
```

### 6.4 Connection Model

```tsx
/**
 * Represents a connection between touchpoints defining the journey flow
 */
export interface Connection {
  /** Unique identifier for the connection */
  id: string;
  
  /** Journey this connection belongs to */
  journeyId: string;
  
  /** Source touchpoint ID */
  sourceId: string;
  
  /** Target touchpoint ID */
  targetId: string;
  
  /** Optional condition for this connection to be followed */
  condition?: ConnectionCondition | null;
  
  /** Label for the connection */
  label?: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Condition determining when a connection should be followed
 */
export interface ConnectionCondition {
  /** Type of condition */
  type: 'response' | 'attribute' | 'score' | 'completion';
  
  /** Field to evaluate */
  field: string;
  
  /** Comparison operator */
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  
  /** Value to compare against */
  value: string | number | boolean;
}
```

### 6.5 Rule Logic Model

```tsx
/**
 * Rule logic for conditional touchpoint display
 */
export interface RuleLogic {
  /** Condition operator */
  condition: 'and' | 'or';
  
  /** Array of rules */
  rules: Rule[];
}

/**
 * Individual rule definition
 */
export interface Rule {
  /** Field to evaluate */
  field: string;
  
  /** Comparison operator */
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  
  /** Value to compare against */
  value: string | number | boolean | Array<string | number>;
}
```

### 6.6 Content Models

```tsx
/**
 * Represents a content item that can be attached to touchpoints
 */
export interface ContentItem {
  /** Unique identifier for the content */
  id: string;
  
  /** Organization ID this content belongs to */
  organizationId: string;
  
  /** Content title */
  title: string;
  
  /** Content type */
  contentType: TouchpointType;
  
  /** Current status of the content */
  status: 'draft' | 'published' | 'archived';
  
  /** Content data (type depends on contentType) */
  data: MessageContent | QuizContent | MediaContent | SurveyContent | DocumentContent | LinkContent | ActivityContent;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last updated timestamp */
  updatedAt: string;
  
  /** User who created the content */
  createdBy: string;
}

/**
 * Simple message content
 */
export interface MessageContent {
  /** WhatsApp compatible message text */
  text: string;
  
  /** Optional template ID for WhatsApp templates */
  templateId?: string;
  
  /** Optional template parameters */
  templateParams?: Record<string, string>;
}

/**
 * Quiz content for assessments
 */
export interface QuizContent {
  /** Introduction text */
  introduction?: string;
  
  /** Array of questions */
  questions: {
    id: string;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'open_ended';
    options?: {
      id: string;
      text: string;
      isCorrect?: boolean;
    }[];
    correctAnswer?: string;
  }[];
  
  /** Feedback configuration */
  feedback: {
    showCorrectAnswers: boolean;
    passThreshold?: number;
    passMessage?: string;
    failMessage?: string;
  };
}

// Other content type interfaces omitted for brevity
```

### 6.7 Program Models

```tsx
/**
 * Represents an operational deployment of a journey to workers
 */
export interface Program {
  /** Unique identifier for the program */
  id: string;
  
  /** Organization ID this program belongs to */
  organizationId: string;
  
  /** Reference to the journey blueprint */
  journeyId: string;
  
  /** Program name */
  name: string;
  
  /** Program description */
  description: string;
  
  /** Current status of the program */
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  
  /** Program start date */
  startDate: string;
  
  /** Optional program end date */
  endDate?: string | null;
  
  /** Whether program targets all workers */
  targetAll: boolean;
  
  /** Target segment IDs if not targeting all */
  segmentIds: string[];
  
  /** Notification settings */
  notificationSettings: {
    sendNotifications: boolean;
    allowReminders: boolean;
  };
  
  /** Total number of workers enrolled */
  workerCount: number;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last updated timestamp */
  updatedAt: string;
  
  /** User who created the program */
  createdBy: string;
}
```

### 6.8 Journey Builder State Interfaces

```tsx
/**
 * Main state for the journey builder canvas
 */
export interface JourneyBuilderState {
  /** Currently loaded journey data */
  journey: Journey | null;
  
  /** Loading status for journey data */
  isLoading: boolean;
  
  /** Any errors encountered */
  error: Error | null;
  
  /** Selected items on canvas */
  selection: {
    type: 'touchpoint' | 'phase' | 'connection' | null;
    ids: string[];
  };
  
  /** Canvas view state */
  canvas: {
    zoom: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    dragStartX: number;
    dragStartY: number;
  };
  
  /** Current tool selected */
  activeTool: 'select' | 'connection' | 'touchpoint' | 'pan';
  
  /** Pending connection being created */
  pendingConnection: {
    sourceId: string | null;
    sourceX: number;
    sourceY: number;
    cursorX: number;
    cursorY: number;
  } | null;
  
  /** Undo/redo history */
  history: {
    past: JourneyHistoryState[];
    future: JourneyHistoryState[];
    current: JourneyHistoryState;
  };
  
  /** Dirty state indicating unsaved changes */
  isDirty: boolean;
  
  /** Last save timestamp */
  lastSaved: string | null;
}

/**
 * State snapshot for undo/redo functionality
 */
export interface JourneyHistoryState {
  phases: Phase[];
  touchpoints: Touchpoint[];
  connections: Connection[];
}

/**
 * Properties panel context for touchpoints
 */
export interface TouchpointPanelProps {
  touchpoint: Touchpoint;
  phase: Phase;
  onUpdate: (touchpointId: string, updates: Partial<Touchpoint>) => void;
  onDelete: (touchpointId: string) => void;
  availableContent: ContentItem[];
  isLoadingContent: boolean;
}
```

## 7. Journey Builder API Endpoints

This section documents the API endpoints used by the Journey Builder feature.

### 7.1 Journey Endpoints

#### 7.1.1 GET /journeys

Retrieves a paginated list of journeys for the organization.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 20)
- `status` (string, optional): Filter by journey status ('draft', 'published', 'archived')
- `search` (string, optional): Search term for journey title/description
- `tags` (string[], optional): Filter by tags (comma-separated)
- `sort` (string, optional): Sort field (default: 'updatedAt')
- `order` (string, optional): Sort order ('asc' or 'desc', default: 'desc')

**Response:**
```json
{
  "data": [
    {
      "id": "journey-123",
      "title": "Customer Service Training",
      "description": "Journey for training customer service representatives",
      "status": "published",
      "tags": ["customer service", "onboarding"],
      "createdBy": "user-456",
      "createdAt": "2023-01-15T14:22:31Z",
      "updatedAt": "2023-01-16T10:15:22Z",
      "phaseCount": 3,
      "touchpointCount": 12,
      "programCount": 2
    },
    // More journey summaries...
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 45,
    "totalPages": 3
  }
}
```

#### 7.1.2 GET /journeys/{journeyId}

Retrieves the complete details of a specific journey.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey to retrieve

**Response:**
```json
{
  "data": {
    "id": "journey-123",
    "organizationId": "org-789",
    "title": "Customer Service Training",
    "description": "Journey for training customer service representatives",
    "status": "published",
    "tags": ["customer service", "onboarding"],
    "createdBy": "user-456",
    "createdAt": "2023-01-15T14:22:31Z",
    "updatedAt": "2023-01-16T10:15:22Z",
    "updatedBy": "user-456",
    "phases": [
      {
        "id": "phase-1",
        "journeyId": "journey-123",
        "name": "Introduction",
        "description": "Introduction to customer service principles",
        "sequenceOrder": 1,
        "color": "#4285F4",
        "createdAt": "2023-01-15T14:23:45Z",
        "updatedAt": "2023-01-15T14:23:45Z"
      },
      // More phases...
    ],
    "touchpoints": [
      {
        "id": "touchpoint-1",
        "phaseId": "phase-1",
        "journeyId": "journey-123",
        "contentId": "content-345",
        "name": "Welcome Message",
        "touchpointType": "message",
        "sequenceOrder": 1,
        "waitDuration": 0,
        "required": true,
        "positionX": 150,
        "positionY": 200,
        "createdAt": "2023-01-15T14:25:12Z",
        "updatedAt": "2023-01-15T14:25:12Z",
        "content": {
          "id": "content-345",
          "title": "Welcome to Customer Service Training",
          "contentType": "message",
          "status": "published",
          "data": {
            "text": "Welcome to your customer service training journey! Over the next few weeks, we'll help you build essential skills for great customer service."
          }
        }
      },
      // More touchpoints...
    ],
    "connections": [
      {
        "id": "connection-1",
        "journeyId": "journey-123",
        "sourceId": "touchpoint-1",
        "targetId": "touchpoint-2",
        "label": "Next",
        "createdAt": "2023-01-15T14:30:22Z",
        "updatedAt": "2023-01-15T14:30:22Z"
      },
      // More connections...
    ]
  }
}
```

#### 7.1.3 POST /journeys

Creates a new journey.

**Request Body:**
```json
{
  "title": "Customer Service Excellence",
  "description": "Journey for developing customer service excellence skills",
  "tags": ["customer service", "advanced"]
}
```

**Response:**
```json
{
  "data": {
    "id": "journey-456",
    "organizationId": "org-789",
    "title": "Customer Service Excellence",
    "description": "Journey for developing customer service excellence skills",
    "status": "draft",
    "tags": ["customer service", "advanced"],
    "createdBy": "user-456",
    "createdAt": "2023-06-10T09:45:30Z",
    "updatedAt": "2023-06-10T09:45:30Z",
    "updatedBy": "user-456",
    "phases": [],
    "touchpoints": [],
    "connections": []
  }
}
```

#### 7.1.4 PUT /journeys/{journeyId}

Updates an existing journey.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey to update

**Request Body:**
```json
{
  "title": "Customer Service Excellence 2.0",
  "description": "Updated journey for developing customer service excellence skills",
  "tags": ["customer service", "advanced", "2.0"]
}
```

**Response:**
```json
{
  "data": {
    "id": "journey-456",
    "title": "Customer Service Excellence 2.0",
    "description": "Updated journey for developing customer service excellence skills",
    "tags": ["customer service", "advanced", "2.0"],
    "updatedAt": "2023-06-10T10:15:22Z",
    "updatedBy": "user-456"
    // Other journey fields...
  }
}
```

#### 7.1.5 DELETE /journeys/{journeyId}

Deletes a journey.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey to delete

**Response:**
```json
{
  "success": true,
  "message": "Journey successfully deleted"
}
```

#### 7.1.6 PUT /journeys/{journeyId}/publish

Publishes a journey, making it available for deployment.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey to publish

**Response:**
```json
{
  "data": {
    "id": "journey-456",
    "status": "published",
    "updatedAt": "2023-06-10T11:30:15Z",
    "updatedBy": "user-456"
    // Other journey fields...
  }
}
```

#### 7.1.7 POST /journeys/{journeyId}/duplicate

Creates a duplicate copy of a journey.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey to duplicate

**Request Body:**
```json
{
  "title": "Customer Service Excellence - Copy",
  "description": "Duplicate of Customer Service Excellence journey"
}
```

**Response:**
```json
{
  "data": {
    "id": "journey-789",
    "title": "Customer Service Excellence - Copy",
    "description": "Duplicate of Customer Service Excellence journey",
    "status": "draft",
    // Other journey fields with duplicated content...
  }
}
```

### 7.2 Phase Endpoints

#### 7.2.1 POST /journeys/{journeyId}/phases

Creates a new phase in a journey.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey

**Request Body:**
```json
{
  "name": "Advanced Techniques",
  "description": "Advanced customer service techniques and scenarios",
  "sequenceOrder": 3,
  "color": "#34A853"
}
```

**Response:**
```json
{
  "data": {
    "id": "phase-789",
    "journeyId": "journey-456",
    "name": "Advanced Techniques",
    "description": "Advanced customer service techniques and scenarios",
    "sequenceOrder": 3,
    "color": "#34A853",
    "createdAt": "2023-06-10T14:22:31Z",
    "updatedAt": "2023-06-10T14:22:31Z"
  }
}
```

#### 7.2.2 PUT /phases/{phaseId}

Updates an existing phase.

**Path Parameters:**
- `phaseId` (string, required): ID of the phase to update

**Request Body:**
```json
{
  "name": "Advanced Techniques & Strategies",
  "description": "Updated description for advanced techniques",
  "color": "#4285F4"
}
```

**Response:**
```json
{
  "data": {
    "id": "phase-789",
    "name": "Advanced Techniques & Strategies",
    "description": "Updated description for advanced techniques",
    "color": "#4285F4",
    "updatedAt": "2023-06-10T15:10:45Z"
    // Other phase fields...
  }
}
```

#### 7.2.3 DELETE /phases/{phaseId}

Deletes a phase.

**Path Parameters:**
- `phaseId` (string, required): ID of the phase to delete

**Response:**
```json
{
  "success": true,
  "message": "Phase successfully deleted"
}
```

### 7.3 Touchpoint Endpoints

#### 7.3.1 POST /journeys/{journeyId}/touchpoints

Creates a new touchpoint in a journey.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey

**Request Body:**
```json
{
  "phaseId": "phase-789",
  "contentId": "content-456",
  "name": "Customer Empathy Exercise",
  "touchpointType": "activity",
  "sequenceOrder": 2,
  "waitDuration": 86400,
  "required": true,
  "positionX": 350,
  "positionY": 250
}
```

**Response:**
```json
{
  "data": {
    "id": "touchpoint-234",
    "journeyId": "journey-456",
    "phaseId": "phase-789",
    "contentId": "content-456",
    "name": "Customer Empathy Exercise",
    "touchpointType": "activity",
    "sequenceOrder": 2,
    "waitDuration": 86400,
    "required": true,
    "positionX": 350,
    "positionY": 250,
    "createdAt": "2023-06-11T09:20:15Z",
    "updatedAt": "2023-06-11T09:20:15Z"
  }
}
```

#### 7.3.2 PUT /touchpoints/{touchpointId}

Updates an existing touchpoint.

**Path Parameters:**
- `touchpointId` (string, required): ID of the touchpoint to update

**Request Body:**
```json
{
  "name": "Customer Empathy Simulation",
  "contentId": "content-789",
  "waitDuration": 43200,
  "required": false,
  "positionX": 400,
  "positionY": 300
}
```

**Response:**
```json
{
  "data": {
    "id": "touchpoint-234",
    "name": "Customer Empathy Simulation",
    "contentId": "content-789",
    "waitDuration": 43200,
    "required": false,
    "positionX": 400,
    "positionY": 300,
    "updatedAt": "2023-06-11T10:15:30Z"
    // Other touchpoint fields...
  }
}
```

#### 7.3.3 DELETE /touchpoints/{touchpointId}

Deletes a touchpoint.

**Path Parameters:**
- `touchpointId` (string, required): ID of the touchpoint to delete

**Response:**
```json
{
  "success": true,
  "message": "Touchpoint successfully deleted"
}
```

#### 7.3.4 PUT /touchpoints/{touchpointId}/rules

Updates the rule logic for a touchpoint.

**Path Parameters:**
- `touchpointId` (string, required): ID of the touchpoint

**Request Body:**
```json
{
  "ruleLogic": {
    "condition": "and",
    "rules": [
      {
        "field": "worker.department",
        "operator": "equals",
        "value": "Customer Service"
      },
      {
        "field": "worker.experience_years",
        "operator": "greater_than",
        "value": 2
      }
    ]
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "touchpoint-234",
    "ruleLogic": {
      "condition": "and",
      "rules": [
        {
          "field": "worker.department",
          "operator": "equals",
          "value": "Customer Service"
        },
        {
          "field": "worker.experience_years",
          "operator": "greater_than",
          "value": 2
        }
      ]
    },
    "updatedAt": "2023-06-11T11:05:45Z"
    // Other touchpoint fields...
  }
}
```

### 7.4 Connection Endpoints

#### 7.4.1 POST /journeys/{journeyId}/connections

Creates a new connection between touchpoints.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey

**Request Body:**
```json
{
  "sourceId": "touchpoint-123",
  "targetId": "touchpoint-234",
  "label": "Next Step"
}
```

**Response:**
```json
{
  "data": {
    "id": "connection-456",
    "journeyId": "journey-456",
    "sourceId": "touchpoint-123",
    "targetId": "touchpoint-234",
    "label": "Next Step",
    "createdAt": "2023-06-11T13:30:22Z",
    "updatedAt": "2023-06-11T13:30:22Z"
  }
}
```

#### 7.4.2 PUT /connections/{connectionId}

Updates an existing connection.

**Path Parameters:**
- `connectionId` (string, required): ID of the connection to update

**Request Body:**
```json
{
  "label": "If Passed",
  "condition": {
    "type": "response",
    "field": "quiz_result",
    "operator": "greater_than",
    "value": 80
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "connection-456",
    "label": "If Passed",
    "condition": {
      "type": "response",
      "field": "quiz_result",
      "operator": "greater_than",
      "value": 80
    },
    "updatedAt": "2023-06-11T14:15:30Z"
    // Other connection fields...
  }
}
```

#### 7.4.3 DELETE /connections/{connectionId}

Deletes a connection.

**Path Parameters:**
- `connectionId` (string, required): ID of the connection to delete

**Response:**
```json
{
  "success": true,
  "message": "Connection successfully deleted"
}
```

### 7.5 Journey Simulation Endpoints

#### 7.5.1 POST /journeys/{journeyId}/simulate

Simulates a journey flow for a specific worker or sample worker profile.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey to simulate

**Request Body:**
```json
{
  "workerId": "worker-123",  // Optional - can provide a workerId or custom worker attributes
  "workerAttributes": {      // Optional - custom worker attributes for simulation
    "name": "John Doe",
    "department": "Sales",
    "experience_years": 3,
    "performance_rating": 4.2
  },
  "startTouchpointId": "touchpoint-123",  // Optional - specify starting touchpoint
  "simulationType": "full_path"  // "full_path" or "single_step"
}
```

**Response:**
```json
{
  "data": {
    "simulationId": "sim-789",
    "journeyId": "journey-456",
    "workerProfile": {
      "id": "worker-123",
      "name": "John Doe",
      "department": "Sales",
      "experience_years": 3,
      "performance_rating": 4.2
      // Other worker attributes...
    },
    "touchpoints": [
      {
        "touchpointId": "touchpoint-123",
        "name": "Welcome Message",
        "type": "message",
        "content": {
          "text": "Welcome to your customer service training journey!"
        },
        "eligible": true,
        "eligibilityReason": null
      },
      {
        "touchpointId": "touchpoint-234",
        "name": "Customer Empathy Simulation",
        "type": "activity",
        "content": {
          // Content details...
        },
        "eligible": true,
        "eligibilityReason": null
      },
      // More touchpoints in the simulated path...
    ],
    "path": [
      "touchpoint-123",
      "touchpoint-234",
      // Additional touchpoints in sequence...
    ],
    "rulesEvaluation": [
      {
        "touchpointId": "touchpoint-345",
        "eligible": false,
        "eligibilityReason": "Rule 'department equals Customer Service' not satisfied"
      }
      // Other rule evaluations...
    ]
  }
}
```

#### 7.5.2 POST /journeys/{journeyId}/simulate/response

Simulates a worker response to a touchpoint in an active simulation.

**Path Parameters:**
- `journeyId` (string, required): ID of the journey being simulated

**Request Body:**
```json
{
  "simulationId": "sim-789",
  "touchpointId": "touchpoint-234",
  "response": {
    "type": "quiz",
    "answers": [
      {
        "questionId": "q-123",
        "selectedOptionId": "opt-456"
      },
      {
        "questionId": "q-124",
        "value": "Customer-focused solution"
      }
    ],
    "score": 85
  }
}
```

**Response:**
```json
{
  "data": {
    "simulationId": "sim-789",
    "currentTouchpointId": "touchpoint-345",
    "previousTouchpointId": "touchpoint-234",
    "responseProcessed": true,
    "feedback": {
      "correct": true,
      "message": "Great job! You've demonstrated good understanding of customer empathy principles."
    },
    "nextTouchpoint": {
      "touchpointId": "touchpoint-345",
      "name": "De-escalation Techniques",
      "type": "video",
      "content": {
        // Content details...
      }
    }
  }
}
```

### 7.6 Deployment Endpoints

#### 7.6.1 POST /programs

Creates a new program from a journey.

**Request Body:**
```json
{
  "journeyId": "journey-456",
  "name": "Customer Service Training - June 2023",
  "description": "June 2023 cohort for customer service training",
  "targetAll": false,
  "segmentIds": ["segment-123", "segment-456"],
  "startDate": "2023-06-15T00:00:00Z",
  "endDate": "2023-06-29T23:59:59Z",
  "notificationSettings": {
    "sendNotifications": true,
    "allowReminders": true
  }
}
```

**Response:**
```json
{
  "data": {
    "programId": "program-789",
    "journeyId": "journey-456",
    "name": "Customer Service Training - June 2023",
    "description": "June 2023 cohort for customer service training",
    "status": "scheduled",
    "targetAll": false,
    "segmentIds": ["segment-123", "segment-456"],
    "startDate": "2023-06-15T00:00:00Z",
    "endDate": "2023-06-29T23:59:59Z",
    "notificationSettings": {
      "sendNotifications": true,
      "allowReminders": true
    },
    "workerCount": 125,
    "createdAt": "2023-06-12T09:45:30Z",
    "createdBy": "user-456"
  }
}
```
