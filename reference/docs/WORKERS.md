# ABCD Behavior Coach - Worker Management System

## 1. Introduction

The Worker Management system forms a critical foundation of the ABCD Behavior Coach platform, enabling organizations to effectively manage their workforce and associate workers with interventions based on various criteria. This document provides comprehensive guidance on the implementation, design principles, and technical architecture of the Worker Management features within the frontend application.

### 1.1 Purpose

The Worker Management system serves several essential purposes:

- **Worker Management**: Establish a central repository of all frontline workers/audience members within an organization.
- **Demographic Tracking**: Capture and maintain relevant demographic data, contact information, and custom attributes.
- **Progress Monitoring**: Track individual and group progress through programs and journeys.
- **Wellbeing Assessment**: Monitor wellbeing indicators and enable appropriate interventions.
- **Performance Analysis**: Analyze performance metrics across different worker groups.

### 1.2 Key Users & Use Cases

The primary users of the Worker Management system include:

- **Program Managers**: Need to identify appropriate audience segments for program deployments, understand audience composition, and monitor program effectiveness across segments.
- **Training Managers**: Require insights into training needs and preferences across different audience groups.
- **Organization Administrators**: Need a comprehensive view of the entire workforce and the ability to manage bulk operations and integrations.
- **Content Specialists**: Benefit from understanding audience demographics to create appropriate content.

### 1.3 Design Principles

The design of the Worker Management system adheres to the following principles:

- **User-Centric**: Prioritize the needs and workflows of the primary users in the interface design.
- **Scalability**: Support organizations of varying sizes, from hundreds to millions of workers.
- **Flexibility**: Accommodate diverse worker data schemas through customizable attributes.
- **Performance**: Optimize for speed with large datasets, including efficient worker filtering, searching, and loading.
- **Data Security**: Implement robust data protection through proper access controls and tenant isolation.
- **Accessibility**: Ensure the system is usable by all, regardless of abilities or disabilities.

### 1.4 Key Terminology

To ensure clarity throughout this document, the following terminology is defined:

- **Worker**: An individual frontline worker in an organization, the primary audience for programs and interventions.
- **Worker Profile**: The comprehensive set of data associated with a worker, including demographics, contact details, and custom attributes.
- **Custom Attribute**: Organization-defined data fields associated with workers (e.g., location, department, job role, tenure).
- **Import**: The process of bulk adding workers to the system through file upload.
- **Export**: The process of downloading worker data from the system.
- **Tags**: Simple labels that can be manually assigned to workers for quick filtering and organization.

## 2. Worker Management

### 2.1 Worker List Page

#### 2.1.1 Purpose

The Worker List page serves as the central hub for managing all workers within an organization. It allows users to:

- View a comprehensive list of all workers within the organization
- Search and filter workers based on various criteria
- Access individual worker profiles
- Perform bulk actions on selected workers
- Import new workers and export worker data

#### 2.1.2 Page Structure & Components

The Worker List page includes the following components:

1. **Header Bar**
   - Page title with worker count
   - Import workers button
   - Export workers button
   - Add new worker button

2. **Search & Filter Panel**
   - Global search input for finding workers by name, ID, or other attributes
   - Advanced filter controls to filter workers by:
     - Demographics (age, gender, location)
     - Contact information (phone status, signup date)
     - Custom attributes
   - Save filter option to create reusable filters

3. **Worker Table**
   - Sortable columns for key worker attributes
   - Bulk selection checkboxes
   - Quick action buttons (view, edit, etc.)
   - Pagination controls
   - Display density toggle (compact/comfortable)

4. **Bulk Actions Menu**
   - Actions that can be performed on multiple selected workers:
     - Add/remove tags
     - Export selected
     - Delete selected
     - Send messages

5. **Worker Detail Drawer**
   - Quickly view full worker details without leaving the list
   - Appears when a worker row is clicked

#### 2.1.3 Key Interactions

- **Searching**: As users type in the search box, results filter in real-time
- **Filtering**: Applied filters instantly update the worker list display
- **Sorting**: Clicking column headers sorts the list by that attribute
- **Bulk Selection**: Users can select all visible workers or specific individuals
- **Quick View**: Clicking a worker row opens a side drawer with detailed information
- **Actions**: Users can perform individual or bulk actions on workers

#### 2.1.4 Technical Implementation

- Implement virtualized list rendering for performance with large datasets
- Use client-side caching for frequently accessed worker data
- Implement server-side sorting and filtering for large organizations
- Optimize API queries to fetch only necessary worker fields

### 2.2 Individual Worker Profile

#### 2.2.1 Purpose

The Worker Profile page provides a comprehensive view of a single worker, including all attributes, interaction history, and associated data. It serves as both a viewing and editing interface for worker management.

#### 2.2.2 Page Structure & Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PageHeader ("Worker Profile: [Name]")                                    │
│                                                      ┌───────┐ ┌───────┐ │
│                                                      │Edit   │ │Actions↓│ │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌───────────────────────────────────────┐   │
│ │                         │ │ Personal Information                   │   │
│ │                         │ │ ┌────────────┬───────────────────────┐│   │
│ │                         │ │ │Phone       │ +1-234-567-8910       ││   │
│ │                         │ │ ├────────────┼───────────────────────┤│   │
│ │         Avatar          │ │ │Email       │ john.doe@example.com  ││   │
│ │                         │ │ ├────────────┼───────────────────────┤│   │
│ │                         │ │ │Location    │ New York, USA         ││   │
│ │                         │ │ ├────────────┼───────────────────────┤│   │
│ │                         │ │ │Language    │ English               ││   │
│ │                         │ │ ├────────────┼───────────────────────┤│   │
│ │                         │ │ │Status      │ Active                ││   │
│ └─────────────────────────┘ │ └────────────┴───────────────────────┘│   │
│ ┌─────────────────────────┐ │ ┌─────────────────────────────────────┐   │
│ │   Status Indicators     │ │ │ Custom Fields                       │   │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ │ │ │ ┌────────────┬───────────────────────┐   │
│ │ │     │ │     │ │     │ │ │ │ │Department  │ Operations           │   │
│ │ │Badge│ │Badge│ │Badge│ │ │ │ ├────────────┼───────────────────────┤   │
│ │ └─────┘ └─────┘ └─────┘ │ │ │ │Hire Date   │ 01/15/2022           │   │
│ └─────────────────────────┘ │ └────────────┴───────────────────────┘│   │
│                             └───────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Tabs: Overview | Programs | Segments | Wellbeing                    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [Tab Content - See sections below]                                  │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Core Components:**

1. **PageHeader**: Displays the worker's name with breadcrumb navigation and actions.
   - **Props**: `title: string`, `breadcrumbs: Breadcrumb[]`, `actions: Action[]`
   - **Actions**: "Edit Worker", "Actions" dropdown (Deactivate, Add to Segment, etc.)

2. **WorkerProfileHeader**: Displays avatar and key information about the worker.
   - **Props**: `worker: Worker`, `avatarSize?: 'sm' | 'md' | 'lg'`, `showBadges?: boolean`
   - **Features**: Status indicators, badges earned, basic contact info

3. **PersonalInfoCard**: Displays personal details of the worker.
   - **Props**: `worker: Worker`
   - **Fields**: Phone, email, location, language, status

4. **CustomFieldsCard**: Displays organization-specific custom fields.
   - **Props**: `worker: Worker`, `schema: CustomFieldSchema[]`
   - **Features**: Renders different field types based on schema (text, date, select, etc.)

5. **TabNavigation**: Allows navigation between different sections of the worker profile.
   - **Props**: `tabs: Tab[]`, `activeTab: string`, `onTabChange: (tab: string) => void`
   - **Tabs**: "Overview", "Programs", "Segments", "Wellbeing"

6. **ProgramList**: Displays programs the worker is enrolled in (Programs tab).
   - **Props**: `workerId: string`, `status?: 'active' | 'completed' | 'all'`
   - **Features**: Program name, status, progress, start/end dates

7. **SegmentList**: Displays segments the worker belongs to (Segments tab).
   - **Props**: `workerId: string`
   - **Features**: Segment name, type, rule match reason (for dynamic segments)

8. **WellbeingDashboard**: Displays wellbeing metrics and history (Wellbeing tab).
   - **Props**: `workerId: string`, `timeRange?: TimeRange`
   - **Features**: Wellbeing score trend, assessment history, interventions

#### 2.2.3 State Management

The Worker Profile page requires management of several state elements:

1. **Worker Data**:
   ```tsx
   const { workerId } = useParams<{ workerId: string }>();
   
   const { data: worker, isLoading, isError, error } = useWorkersApi.useWorker(workerId);
   ```

2. **Active Tab**:
   ```tsx
   const [activeTab, setActiveTab] = useState<string>('overview');
   ```

3. **Custom Field Schema**:
   ```tsx
   const { data: schema } = useWorkersApi.useWorkerSchema();
   ```

4. **Wellbeing Time Range** (for Wellbeing tab):
   ```tsx
   const [wellbeingTimeRange, setWellbeingTimeRange] = useState<TimeRange>({
     start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
     end: new Date()
   });
   ```

#### 2.2.4 API Integration

The Worker Profile page integrates with the following API endpoints:

1. **GET /api/v1/workers/{workerId}**: Fetch worker details.
   ```tsx
   export const useWorker = (workerId: string) => {
     return useQuery<Worker, Error>(
       ['worker', workerId],
       () => api.endpoints.workers.getWorker(workerId),
       {
         enabled: !!workerId,
         staleTime: 60000 // Data is fresh for 1 minute
       }
     );
   };
   ```

2. **GET /api/v1/workers/schema**: Fetch custom field schema.
   ```tsx
   export const useWorkerSchema = () => {
     return useQuery<CustomFieldSchema[], Error>(
       ['workerSchema'],
       () => api.endpoints.workers.getWorkerSchema(),
       {
         staleTime: 300000 // Data is fresh for 5 minutes
       }
     );
   };
   ```

3. **GET /api/v1/workers/{workerId}/programs**: Fetch programs for the worker.
   ```tsx
   export const useWorkerPrograms = (workerId: string, status?: string) => {
     return useQuery<WorkerProgram[], Error>(
       ['workerPrograms', workerId, status],
       () => api.endpoints.workers.getWorkerPrograms(workerId, status),
       {
         enabled: !!workerId,
         staleTime: 60000 // Data is fresh for 1 minute
       }
     );
   };
   ```

4. **GET /api/v1/workers/{workerId}/segments**: Fetch segments for the worker.
   ```tsx
   export const useWorkerSegments = (workerId: string) => {
     return useQuery<WorkerSegment[], Error>(
       ['workerSegments', workerId],
       () => api.endpoints.workers.getWorkerSegments(workerId),
       {
         enabled: !!workerId,
         staleTime: 60000 // Data is fresh for 1 minute
       }
     );
   };
   ```

5. **GET /api/v1/workers/{workerId}/wellbeing**: Fetch wellbeing data for the worker.
   ```tsx
   export const useWorkerWellbeing = (workerId: string, timeRange: TimeRange) => {
     return useQuery<WorkerWellbeing, Error>(
       ['workerWellbeing', workerId, timeRange],
       () => api.endpoints.workers.getWorkerWellbeing(workerId, timeRange),
       {
         enabled: !!workerId,
         staleTime: 60000 // Data is fresh for 1 minute
       }
     );
   };
   ```

#### 2.2.5 User Interactions & Actions

The Worker Profile page supports the following interactions:

1. **Edit Worker**: Navigate to the Worker Edit page.
2. **Actions Dropdown**: Perform actions like deactivate/activate, add to segment, etc.
3. **Tab Navigation**: Switch between different sections of the profile.
4. **Wellbeing Time Range**: Adjust the time range for wellbeing data visualization.
5. **Program Details**: View details of a specific program the worker is enrolled in.
6. **Segment Details**: View details of a specific segment the worker belongs to.

#### 2.2.6 Responsive Behavior

The Worker Profile page adapts to different screen sizes:

1. **Desktop (≥1024px)**: Full layout with side-by-side profile header and details.
2. **Tablet (768px-1023px)**:
   - Profile header and details stack vertically.
   - Tabs remain horizontally scrollable.
3. **Mobile (<768px)**:
   - All sections stack vertically.
   - Tabs might convert to a dropdown selector to save space.
   - Action buttons collapse into a single menu.

### 2.3 Worker Creation Page

#### 2.3.1 Purpose

The Worker Creation page allows administrators and managers to add new individual workers to the system. It provides a form interface for entering all required and optional worker information, including standard fields and custom organization-specific fields.

#### 2.3.2 Page Structure & Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PageHeader ("Add New Worker")                                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ FormContainer                                                        │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Personal Information                                             │ │ │
│ │ │ ┌─────────────────────┐ ┌─────────────────────┐                 │ │ │
│ │ │ │ Full Name *         │ │ Phone Number *      │                 │ │ │
│ │ │ │ [                 ] │ │ [                 ] │                 │ │ │
│ │ │ └─────────────────────┘ └─────────────────────┘                 │ │ │
│ │ │ ┌─────────────────────┐ ┌─────────────────────┐                 │ │ │
│ │ │ │ Email               │ │ Language            │                 │ │ │
│ │ │ │ [                 ] │ │ [    Dropdown     ↓] │                 │ │ │
│ │ │ └─────────────────────┘ └─────────────────────┘                 │ │ │
│ │ │ ┌─────────────────────┐ ┌─────────────────────┐                 │ │ │
│ │ │ │ Location            │ │ Status              │                 │ │ │
│ │ │ │ [                 ] │ │ [    Dropdown     ↓] │                 │ │ │
│ │ │ └─────────────────────┘ └─────────────────────┘                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Custom Fields                                                    │ │ │
│ │ │ ┌─────────────────────┐ ┌─────────────────────┐                 │ │ │
│ │ │ │ Department          │ │ Position            │                 │ │ │
│ │ │ │ [                 ] │ │ [                 ] │                 │ │ │
│ │ │ └─────────────────────┘ └─────────────────────┘                 │ │ │
│ │ │ ┌─────────────────────┐ ┌─────────────────────┐                 │ │ │
│ │ │ │ Hire Date           │ │ [Custom Field]      │                 │ │ │
│ │ │ │ [   Date Picker   ] │ │ [                 ] │                 │ │ │
│ │ │ └─────────────────────┘ └─────────────────────┘                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Initial Segment Assignments                                      │ │ │
│ │ │ ┌───────────────────────────────────────────────────────────────┐ │ │
│ │ │ │ [✓] All New Workers                                           │ │ │
│ │ │ │ [ ] Sales Team                                                │ │ │
│ │ │ │ [ ] New Hires                                                 │ │ │
│ │ │ │ [ ] Management                                                │ │ │
│ │ │ │                                                               │ │ │
│ │ │ │ Select Segment...  ┌─Add─┐                                    │ │ │
│ │ │ └───────────────────────────────────────────────────────────────┘ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │                                        ┌────────┐ ┌───────────┐ │ │ │
│ │ │                                        │ Cancel │ │ Save      │ │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Core Components:**

1. **PageHeader**: Displays the page title with breadcrumb navigation.
   - **Props**: `title: string`, `breadcrumbs: Breadcrumb[]`

2. **WorkerForm**: The main form container for worker creation.
   - **Props**: `onSubmit: (data: WorkerFormData) => void`, `initialData?: Partial<WorkerFormData>`, `isLoading?: boolean`, `customFieldSchema?: CustomFieldSchema[]`
   - **Features**: Form validation, field grouping, responsive layout

3. **FormSection**: A visual container for grouping related form fields.
   - **Props**: `title: string`, `description?: string`, `children: React.ReactNode`

4. **TextField**: Input field for text-based worker information.
   - **Props**: `name: string`, `label: string`, `value: string`, `onChange: (value: string) => void`, `error?: string`, `required?: boolean`

5. **SelectField**: Dropdown field for enumerated values.
   - **Props**: `name: string`, `label: string`, `value: string`, `options: Option[]`, `onChange: (value: string) => void`, `error?: string`, `required?: boolean`

6. **DateField**: Date picker for date values.
   - **Props**: `name: string`, `label: string`, `value: Date | null`, `onChange: (value: Date | null) => void`, `error?: string`, `required?: boolean`

7. **SegmentSelectionList**: Multi-select list of segments for initial assignment.
   - **Props**: `selectedSegments: string[]`, `onSegmentToggle: (segmentId: string, selected: boolean) => void`, `allSegments: Segment[]`

8. **ButtonGroup**: Container for action buttons.
   - **Props**: `children: React.ReactNode`, `alignment?: 'left' | 'center' | 'right'`

#### 2.3.3 State Management

The Worker Creation page requires management of several state elements:

1. **Form State** (using React Hook Form):
   ```tsx
   const { schema } = useWorkersApi.useWorkerSchema();
   
   const formMethods = useForm<WorkerFormData>({
     resolver: zodResolver(workersValidation.createWorkerSchema),
     defaultValues: {
       fullName: '',
       phoneNumber: '',
       email: '',
       location: '',
       language: 'english',
       status: 'active',
       customFields: {},
       segmentIds: []
     }
   });
   
   const { handleSubmit, control, formState: { errors, isSubmitting } } = formMethods;
   ```

2. **Available Segments**:
   ```tsx
   const { data: segments, isLoading: isLoadingSegments } = useSegmentsApi.useSegments();
   ```

3. **Selected Segments**:
   ```tsx
   const { fields: selectedSegments, append, remove } = useFieldArray({
     control,
     name: 'segmentIds'
   });
   ```

#### 2.3.4 API Integration

The Worker Creation page integrates with the following API endpoints:

1. **POST /api/v1/workers**: Create a new worker.
   ```tsx
   export const useCreateWorker = () => {
     const queryClient = useQueryClient();
     const navigate = useNavigate();
     
     return useMutation<Worker, Error, WorkerFormData>(
       (data) => api.endpoints.workers.createWorker(data),
       {
         onSuccess: (worker) => {
           queryClient.invalidateQueries(['workers']);
           toast.success('Worker created successfully');
           navigate(`/workers/${worker.id}`);
         },
         onError: (error) => {
           toast.error(`Failed to create worker: ${error.message}`);
         }
       }
     );
   };
   ```

2. **GET /api/v1/workers/schema**: Fetch custom field schema.
   ```tsx
   // Same as in Worker Profile page
   ```

3. **GET /api/v1/segments**: Fetch available segments for assignment.
   ```tsx
   export const useSegments = (params?: SegmentQueryParams) => {
     return useQuery<Segment[], Error>(
       ['segments', params],
       () => api.endpoints.segments.getSegments(params),
       {
         staleTime: 60000 // Data is fresh for 1 minute
       }
     );
   };
   ```

#### 2.3.5 Form Validation

The Worker Creation page employs form validation using Zod schema:

```tsx
// src/lib/validation/worker.ts
export const createWorkerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required')
    .regex(/^[0-9+\-\(\)\s]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  location: z.string().optional(),
  language: z.string(),
  status: z.enum(['active', 'inactive', 'on_leave']),
  customFields: z.record(z.string(), z.any()),
  segmentIds: z.array(z.string().uuid())
});
```

#### 2.3.6 User Interactions & Actions

The Worker Creation page supports the following interactions:

1. **Form Filling**: Users can fill out standard and custom fields for the new worker.
2. **Form Validation**: Real-time validation with error messages for invalid inputs.
3. **Segment Assignment**: Users can select segments to assign the worker to upon creation.
4. **Save**: Submit the form to create the worker and navigate to their profile.
5. **Cancel**: Discard changes and return to the Worker List page.

#### 2.3.7 Responsive Behavior

The Worker Creation page adapts to different screen sizes:

1. **Desktop (≥1024px)**: Two-column form layout with fields side by side.
2. **Tablet (768px-1023px)**:
   - Form sections remain two columns but narrower.
   - Segment selection might wrap to multiple rows.
3. **Mobile (<768px)**:
   - Single column form layout with fields stacked.
   - All sections stack vertically.
   - Action buttons span full width.

### 2.4 Worker Import Page

#### 2.4.1 Purpose

The Worker Import page enables administrators to bulk import multiple workers simultaneously via spreadsheet or CSV file. It provides a multi-step wizard interface for uploading, mapping columns, validating data, and confirming the import operation.

#### 2.4.2 Page Structure & Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PageHeader ("Import Workers")                                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ImportStepperProgress                                               │ │
│ │ ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐        │ │
│ │ │ Upload  │────▶│ Map     │────▶│ Validate│────▶│ Confirm │        │ │
│ │ │ File    │     │ Columns │     │ Data    │     │ Import  │        │ │
│ │ └─────────┘     └─────────┘     └─────────┘     └─────────┘        │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [Step content - changes based on current step]                      │ │
│ │                                                                     │ │
│ │ [Step 1: File Upload]                                               │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Drag and drop your CSV or Excel file here, or click to browse    │ │ │
│ │ │                                                                  │ │ │
│ │ │                       ┌──────────────┐                           │ │ │
│ │ │                       │  Upload File  │                          │ │ │
│ │ │                       └──────────────┘                           │ │ │
│ │ │                                                                  │ │ │
│ │ │ Supported formats: CSV, XLSX, XLS                                │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ [OR Step 2: Map Columns]                                            │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Map your spreadsheet columns to worker fields                    │ │ │
│ │ │ ┌────────────────┬────────────────────────────────────┐         │ │ │
│ │ │ │ Worker Field   │ Spreadsheet Column                 │         │ │ │
│ │ │ ├────────────────┼────────────────────────────────────┤         │ │ │
│ │ │ │ Full Name *    │ [          Column A: Name        ↓]│         │ │ │
│ │ │ ├────────────────┼────────────────────────────────────┤         │ │ │
│ │ │ │ Phone Number * │ [          Column B: Phone       ↓]│         │ │ │
│ │ │ ├────────────────┼────────────────────────────────────┤         │ │ │
│ │ │ │ Email          │ [          Column C: Email       ↓]│         │ │ │
│ │ │ ├────────────────┼────────────────────────────────────┤         │ │ │
│ │ │ │ Location       │ [          Column D: City        ↓]│         │ │ │
│ │ │ ├────────────────┼────────────────────────────────────┤         │ │ │
│ │ │ │ Language       │ [             Not Mapped         ↓]│         │ │ │
│ │ │ ├────────────────┼────────────────────────────────────┤         │ │ │
│ │ │ │ Hire Date      │ [          Column E: Hired       ↓]│         │ │ │
│ │ │ └────────────────┴────────────────────────────────────┘         │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ [OR Step 3: Validate Data]                                          │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Validation Results                                               │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ ✓ 245 valid records ready to import                         │ │ │ │
│ │ │ │ ✗ 5 records have errors                                     │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                                 │ │ │
│ │ │ Records with errors:                                           │ │ │
│ │ │ ┌──────┬────────────┬───────────┬────────────────────────────┐ │ │ │
│ │ │ │ Row  │ Field      │ Value     │ Error                      │ │ │ │
│ │ │ ├──────┼────────────┼───────────┼────────────────────────────┤ │ │ │
│ │ │ │ 14   │ Phone      │ abc-123   │ Invalid phone format       │ │ │ │
│ │ │ ├──────┼────────────┼───────────┼────────────────────────────┤ │ │ │
│ │ │ │ 27   │ Email      │ not@valid │ Invalid email format       │ │ │ │
│ │ │ └──────┴────────────┴───────────┴────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ [OR Step 4: Confirm Import]                                         │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Import Summary                                                   │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ 245 workers will be imported                                │ │ │ │
│ │ │ │ 5 workers with errors will be skipped                       │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                                 │ │ │
│ │ │ Segment Assignments                                             │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ [✓] Assign all imported workers to:                         │ │ │ │
│ │ │ │     [    New Workers     ↓]                                 │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                           ┌──────┐ ┌──────┐ ┌────────────┐         │ │
│ │                           │Cancel│ │ Back │ │Next/Import │         │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Core Components:**

1. **PageHeader**: Displays the page title "Import Workers" with breadcrumb navigation.
   - **Props**: `title: string`, `breadcrumbs: Breadcrumb[]`

2. **ImportStepperProgress**: Visual indicator showing the current step in the import process.
   - **Props**: `steps: Step[]`, `currentStep: number`, `onStepClick?: (step: number) => void`
   - **Features**: Highlights current step, shows completed steps, optionally allows navigation between steps

3. **FileUploader**: Interface for uploading CSV or Excel files.
   - **Props**: `onFileUpload: (file: File) => void`, `acceptedFileTypes: string[]`, `isLoading?: boolean`, `error?: string`
   - **Features**: Drag and drop, file browser, upload progress indicator, error handling

4. **ColumnMapper**: Interface for mapping spreadsheet columns to worker fields.
   - **Props**: `columns: string[]`, `requiredFields: string[]`, `optionalFields: string[]`, `customFields: CustomFieldSchema[]`, `mappings: Record<string, string>`, `onMappingChange: (field: string, column: string) => void`
   - **Features**: Auto-mapping based on column names, required field indicators, preview data

5. **ValidationResults**: Displays the results of data validation.
   - **Props**: `validCount: number`, `invalidCount: number`, `errors: ImportError[]`, `onFixError?: (row: number) => void`
   - **Features**: Summary statistics, detailed error listings, error filtering

6. **ImportConfirmation**: Final step showing import summary and options.
   - **Props**: `validCount: number`, `invalidCount: number`, `segments: Segment[]`, `selectedSegmentId: string`, `onSegmentChange: (segmentId: string) => void`
   - **Features**: Option to assign imported workers to segments, final confirmation

7. **StepNavigation**: Controls for moving between steps in the import process.
   - **Props**: `currentStep: number`, `totalSteps: number`, `onNext: () => void`, `onBack: () => void`, `onCancel: () => void`, `isNextDisabled?: boolean`, `isProcessing?: boolean`
   - **Features**: Contextual button labels (Next/Import), loading state during processing

#### 2.4.3 State Management

The Worker Import page requires management of several state elements:

1. **Import Steps**:
   ```tsx
   const [currentStep, setCurrentStep] = useState<number>(0);
   const [importFile, setImportFile] = useState<File | null>(null);
   const [columns, setColumns] = useState<string[]>([]);
   const [mappings, setMappings] = useState<Record<string, string>>({});
   const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
   const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
   ```

2. **Import Process Status**:
   ```tsx
   const [isProcessing, setIsProcessing] = useState<boolean>(false);
   const [importError, setImportError] = useState<string | null>(null);
   ```

3. **Available Segments**:
   ```tsx
   const { data: segments, isLoading: isLoadingSegments } = useSegmentsApi.useSegments();
   ```

#### 2.4.4 API Integration

The Worker Import page integrates with the following API endpoints:

1. **POST /api/v1/workers/bulk-import**: Upload file and start import job.
   ```tsx
   export const useWorkerImport = () => {
     const queryClient = useQueryClient();
     
     return useMutation<ImportJobResponse, Error, ImportJobRequest>(
       (data) => api.endpoints.workers.importWorkers(data),
       {
         onSuccess: (response) => {
           queryClient.invalidateQueries(['workers']);
           return response;
         }
       }
     );
   };
   ```

2. **GET /api/v1/workers/bulk-import/{jobId}**: Get status and results of an import job.
   ```tsx
   export const useImportJobStatus = (jobId: string) => {
     return useQuery<ImportJobStatus, Error>(
       ['importJob', jobId],
       () => api.endpoints.workers.getImportJobStatus(jobId),
       {
         enabled: !!jobId,
         refetchInterval: (data) => 
           data && ['completed', 'failed'].includes(data.status) ? false : 3000
       }
     );
   };
   ```

3. **GET /api/v1/workers/schema**: Fetch custom field schema.
   ```tsx
   // Same as in Worker Profile page
   ```

4. **GET /api/v1/segments**: Fetch available segments for assignment.
   ```tsx
   // Same as in Worker Creation page
   ```

#### 2.4.5 User Interactions & Workflow

The Worker Import page implements a step-by-step workflow:

1. **Step 1: File Upload**
   - User uploads a CSV or Excel file.
   - System validates file format and initial readability.
   - On success, extracts column headers and proceeds to next step.

2. **Step 2: Column Mapping**
   - User maps spreadsheet columns to worker fields.
   - System attempts automatic mapping based on column names.
   - Required fields are clearly marked.
   - Validation ensures all required fields are mapped before proceeding.

3. **Step 3: Data Validation**
   - System analyzes all rows for data validity.
   - Displays count of valid and invalid records.
   - Shows detailed error information for invalid records.
   - User can choose to proceed with valid records only.

4. **Step 4: Confirmation**
   - Displays summary of import operation.
   - Allows assigning all imported workers to a segment.
   - Final confirmation before processing the import.
   - Shows progress during the import operation.

5. **Post-Import**
   - Displays success message with stats (X imported, Y skipped).
   - Option to view detailed import log.
   - Option to return to Worker List to see imported workers.

#### 2.4.6 Error Handling

The Worker Import page handles various error scenarios:

1. **File Format Errors**: Invalid file type, corrupt file, encoding issues.
2. **Mapping Errors**: Missing required field mappings, duplicate mappings.
3. **Validation Errors**: Invalid data formats, duplicate phone numbers, etc.
4. **Processing Errors**: Server-side issues during import processing.

Each error type has appropriate user feedback and recovery options.

#### 2.4.7 Responsive Behavior

The Worker Import page adapts to different screen sizes:

1. **Desktop (≥1024px)**: Full-width stepper, spacious layout for column mapping and validation results.
2. **Tablet (768px-1023px)**: 
   - Stepper may convert to a more compact form.
   - Column mapping interface adapts to narrower width.
3. **Mobile (<768px)**:
   - Stepper converts to a simpler indicator or dropdown.
   - All content stacks vertically with full width.
   - Tables become scrollable horizontally or adapt to card-based views.

### 2.5 Bulk Worker Management

#### 2.5.1 Purpose

The Bulk Worker Management functionality enables administrators to perform actions on multiple workers simultaneously. This capability is crucial for efficiently managing large worker populations, saving time compared to individual worker operations.

#### 2.5.2 Key Capabilities

1. **Selection Mechanisms**
   - Select/deselect all workers on the current page
   - Select/deselect individual workers via checkboxes
   - Select workers across multiple pages
   - Selection persistence while navigating between pages

2. **Bulk Actions**
   - **Add/Remove Tags**: Apply or remove tags from selected workers
   - **Bulk Delete**: Remove multiple workers from the system
   - **Status Update**: Change status (active/inactive) for multiple workers
   - **Export Selected**: Export only the selected workers to CSV/Excel
   - **Assign to Segment**: Add selected workers to one or more segments

#### 2.5.3 UI Components

1. **BulkActionToolbar**: Appears when workers are selected, showing count and available actions.
   - **Props**: `selectedCount: number`, `actions: BulkAction[]`, `onAction: (action: string, data?: any) => void`
   - **Features**: Selected count display, floating position for visibility while scrolling

2. **BulkActionDialog**: Modal dialog for configuring bulk actions that require additional input.
   - **Props**: `action: BulkAction`, `selectedWorkerIds: string[]`, `onConfirm: (data: any) => void`, `onCancel: () => void`
   - **Features**: Dynamic form based on action type, validation, confirmation warning

3. **SelectionControls**: Checkboxes and selection status management components.
   - **Props**: `selectedItems: string[]`, `allItems: string[]`, `onSelectAll: () => void`, `onSelectNone: () => void`, `onSelectItem: (id: string, selected: boolean) => void`
   - **Features**: Indeterminate checkbox state, selection counters

#### 2.5.4 Implementation Considerations

1. **Performance Optimization**
   - Process bulk operations in batches when dealing with large numbers
   - Show progress indicators for long-running operations
   - Use Web Workers for client-side processing where appropriate

2. **Error Handling**
   - Provide aggregate success/failure reporting
   - Option to retry failed operations
   - Detailed logs for administrators

3. **Security and Validation**
   - Confirm destructive actions (delete) with additional verification
   - Respect user permissions for bulk operations
   - Validate all operations against business rules

#### 2.5.5 API Integration

Bulk operations are implemented using the following API endpoints:

1. **POST /api/v1/workers/bulk-update**: Update attributes for multiple workers.
   ```tsx
   export const useBulkUpdate = () => {
     const queryClient = useQueryClient();
     
     return useMutation<BulkUpdateResponse, Error, BulkUpdateRequest>(
       (data) => api.endpoints.workers.bulkUpdate(data),
       {
         onSuccess: () => {
           queryClient.invalidateQueries(['workers']);
           toast.success('Workers updated successfully');
         },
         onError: (error) => {
           toast.error(`Failed to update workers: ${error.message}`);
         }
       }
     );
   };
   ```

2. **POST /api/v1/workers/bulk-delete**: Delete multiple workers.
   ```tsx
   export const useBulkDelete = () => {
     const queryClient = useQueryClient();
     
     return useMutation<BulkDeleteResponse, Error, BulkDeleteRequest>(
       (data) => api.endpoints.workers.bulkDelete(data),
       {
         onSuccess: () => {
           queryClient.invalidateQueries(['workers']);
           toast.success('Workers deleted successfully');
         },
         onError: (error) => {
           toast.error(`Failed to delete workers: ${error.message}`);
         }
       }
     );
   };
   ```

### 2.6 Worker Reporting & Analytics

#### 2.6.1 Purpose

The Worker Reporting functionality provides insights into worker demographics, engagement, and other key metrics. These reports help organizations understand their workforce composition and make data-driven decisions.

#### 2.6.2 Key Reports

1. **Worker Demographics**
   - Distribution by location, language, and other key attributes
   - Custom attribute breakdowns
   - Visualizations through charts and maps

2. **Worker Engagement**
   - Program participation rates
   - Message response rates
   - Activity trends over time

3. **System Usage**
   - New workers added (daily/weekly/monthly)
   - Import/export activity
   - Worker data completeness

#### 2.6.3 UI Components

1. **ReportDashboard**: Main container for worker analytics displays.
   - **Props**: `timeRange: TimeRange`, `filters: ReportFilter[]`, `onFilterChange: (filters: ReportFilter[]) => void`
   - **Features**: Dashboard layout with multiple report widgets

2. **ReportWidget**: Individual report display component.
   - **Props**: `title: string`, `type: 'chart' | 'table' | 'map' | 'kpi'`, `data: any`, `isLoading?: boolean`, `error?: string`
   - **Features**: Multiple visualization options, export capability, full-screen mode

3. **ReportFilters**: Controls for filtering report data.
   - **Props**: `filters: ReportFilter[]`, `availableFilters: FilterOption[]`, `onFilterChange: (filters: ReportFilter[]) => void`
   - **Features**: Date range selection, attribute filtering, saved filter presets

#### 2.6.4 Implementation Considerations

1. **Performance Optimization**
   - Use aggregate data APIs for large datasets
   - Implement data caching for frequently accessed reports
   - Paginate large result sets

2. **Customization**
   - Allow users to create custom reports
   - Support report sharing and exports
   - Enable scheduled report generation

3. **Data Visualization**
   - Use appropriate chart types for different metrics
   - Implement responsive visualizations that work across devices
   - Provide data tables alongside visual representations

#### 2.6.5 API Integration

Worker reporting is implemented using the following API endpoints:

1. **GET /api/v1/reports/workers**: Fetch worker analytics data.
   ```tsx
   export const useWorkerReports = (params: ReportParams) => {
     return useQuery<ReportData, Error>(
       ['workerReports', params],
       () => api.endpoints.reports.getWorkerReports(params),
       {
         keepPreviousData: true,
         staleTime: 300000 // Data is fresh for 5 minutes
       }
     );
   };
   ```

2. **GET /api/v1/reports/workers/demographics**: Fetch demographic breakdown.
   ```tsx
   export const useWorkerDemographics = (params: DemographicParams) => {
     return useQuery<DemographicData, Error>(
       ['workerDemographics', params],
       () => api.endpoints.reports.getWorkerDemographics(params),
       {
         keepPreviousData: true,
         staleTime: 300000 // Data is fresh for 5 minutes
       }
     );
   };
   ```

3. **GET /api/v1/reports/workers/engagement**: Fetch worker engagement metrics.
   ```tsx
   export const useWorkerEngagement = (params: EngagementParams) => {
     return useQuery<EngagementData, Error>(
       ['workerEngagement', params],
       () => api.endpoints.reports.getWorkerEngagement(params),
       {
         keepPreviousData: true,
         staleTime: 300000 // Data is fresh for 5 minutes
       }
     );
   };
   ```

## 3. Technical Architecture

### 3.1 Data Models

#### 3.1.1 Worker Model

The core data structure representing a worker in the system:

```typescript
interface Worker {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  location?: string;
  language: string;
  status: 'active' | 'inactive' | 'on_leave';
  tags: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
  customFields: Record<string, any>;
}
```

#### 3.1.2 Custom Field Schema

Defines the structure of organization-specific worker fields:

```typescript
interface CustomFieldSchema {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}
```

### 3.2 Component Hierarchy

```
WorkerModule
│
├── WorkerList
│   ├── WorkerListHeader
│   ├── WorkerSearchFilter
│   ├── WorkerTable
│   │   ├── WorkerTableHeader
│   │   ├── WorkerTableRow
│   │   └── WorkerTablePagination
│   ├── BulkActionToolbar
│   └── WorkerDetailDrawer
│
├── WorkerProfile
│   ├── WorkerProfileHeader
│   ├── PersonalInfoCard
│   ├── CustomFieldsCard
│   └── WorkerTabs
│       ├── OverviewTab
│       ├── ProgramsTab
│       ├── SegmentsTab
│       └── WellbeingTab
│
├── WorkerForm
│   ├── PersonalInfoSection
│   ├── CustomFieldsSection
│   └── SegmentSelectionSection
│
├── WorkerImport
│   ├── ImportStepper
│   ├── FileUploader
│   ├── ColumnMapper
│   ├── ValidationResults
│   └── ImportConfirmation
│
└── WorkerReports
    ├── ReportDashboard
    ├── ReportFilters
    └── ReportWidgets
```

### 3.3 API Structure

The API for worker management follows RESTful principles with the following structure:

```
/api/v1/workers
├── GET /                      # List workers with filtering
├── POST /                     # Create worker
├── GET /:workerId             # Get worker details
├── PUT /:workerId             # Update worker
├── DELETE /:workerId          # Delete worker
├── GET /schema                # Get custom field schema
├── POST /bulk-import          # Import workers
├── GET /bulk-import/:jobId    # Get import job status
├── POST /bulk-update          # Update multiple workers
└── POST /bulk-delete          # Delete multiple workers

/api/v1/reports/workers
├── GET /                      # Get general worker reports
├── GET /demographics          # Get worker demographic data
└── GET /engagement            # Get worker engagement metrics
```

## 4. Future Enhancements

### 4.1 Planned Features

1. **Advanced Analytics**
   - Predictive analytics for worker engagement
   - Comparative analysis between worker segments
   - Custom report builder

2. **Integration Capabilities**
   - HRIS/HR system integrations
   - Real-time data synchronization
   - API-based worker management

3. **Enhanced User Experience**
   - Bulk editing interface
   - Drag-and-drop custom field configuration
   - Advanced filtering with saved views

### 4.2 Technical Roadmap

1. **Performance Optimizations**
   - Implement worker data pagination and infinite scroll
   - Optimize API queries for large worker datasets
   - Add worker data caching layer

2. **Advanced Customization**
   - Worker profile template customization
   - Organization-specific worker attributes
   - Custom validation rules

3. **Mobile Enhancements**
   - Optimize worker management interface for mobile users
   - Implement offline-first capabilities for field operations
   - Add progressive web app features
