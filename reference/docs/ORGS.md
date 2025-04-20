# Organizations & Users Management Implementation Guide

## Table of Contents

1. [Overview](#1-overview)
2. [Organization Types & User Roles](#2-organization-types--user-roles)
3. [Data Models & Entity Relationships](#3-data-models--entity-relationships)
4. [API Integration](#4-api-integration)
5. [Organization Management Pages](#5-organization-management-pages)
   - [Organization Settings Overview](#51-organization-settings-overview)
   - [Organization Profile](#52-organization-profile)
   - [Billing & Subscription](#53-billing--subscription)
   - [Usage Tracking](#54-usage-tracking)
   - [Usage Forecasts](#55-usage-forecasts)
6. [User Management Pages](#6-user-management-pages)
   - [User List Page](#61-user-list-page)
   - [User Invite Flow](#62-user-invite-flow)
   - [User Detail/Edit Page](#63-user-detailedit-page)
7. [Component Library](#7-component-library)
8. [State Management](#8-state-management)
9. [Validation & Error Handling](#9-validation--error-handling)
10. [Responsive Design](#10-responsive-design)
11. [Permissions & Access Control](#11-permissions--access-control)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Implementation Checklist](#13-implementation-checklist)

## 1. Overview

The Organizations & Users feature of the ABCD Behavioral Coaching Platform is a critical component that handles the multi-tenant structure, organizational settings, user management, and subscription controls. This document provides comprehensive implementation guidance for building the frontend features related to organization management and user administration.

Organizations in the platform come in two primary types (Client Organizations and Expert Organizations), each with specific roles, permissions, and capabilities. The UI must be flexible enough to accommodate both types while maintaining consistency and adhering to design standards.

Primary tasks supported by these features include:
- Organization profile management
- User invitations and role assignments
- Subscription tier management
- Usage tracking and forecasting
- Billing administration
- Custom terminology configuration

## 2. Organization Types & User Roles

### Organization Types

**Client Organizations:**
- Primary consumers of the platform
- Focus on deploying behavioral coaching programs
- Manage workers/audience members
- Track program implementation and effectiveness

**Expert Organizations:**
- Content creators and providers
- Focus on developing journey blueprints and content
- Can publish content to the Marketplace
- Require administrative approval

### User Roles

**Shared Roles (Both Organization Types):**
- **Organization Admin:** Full administrative control over the organization settings, users, billing, etc.

**Client Organization Roles:**
- **Program Manager:** Creates and manages programs, assigns journeys to segments, monitors progress
- **Training Manager:** Manages journey blueprints, content, and training materials
- **Content Specialist:** Creates and manages content modules

**Expert Organization Roles:**
- **Content Specialist:** Creates and curates content, journey blueprints for publication
- **Publisher:** Manages marketplace listings and licensing

**Platform Roles:**
- **ABCD Platform Admin:** Manages all organizations, approves Expert Organization registrations

Each role has specific permissions that should be enforced both in the backend and through UI visibility controls.

## 3. Data Models & Entity Relationships

### Organization Model

Based on the ERD, the Organization entity contains:

```typescript
interface Organization {
  id: string;                 // UUID primary key
  name: string;               // Organization name
  type: 'client' | 'expert';  // Organization type
  subscription_tier: 'basic' | 'standard' | 'premium'; // Subscription level
  logo_url?: string;          // Organization logo
  custom_terminology?: Record<string, string>; // Custom terminology settings
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
}
```

### User Model

```typescript
interface User {
  id: string;                 // UUID primary key
  organization_id: string;    // Foreign key to Organization
  email: string;              // User email (unique)
  role: string;               // User role in the organization
  display_name: string;       // User's display name
  status: 'active' | 'invited' | 'inactive'; // User account status
  created_at: Date;           // Creation timestamp
  updated_at: Date;           // Last update timestamp
}
```

### Relationships
- An Organization has many Users (one-to-many)
- Users belong to one Organization
- Organizations have subscription and billing information
- Organizations own resources like Workers, Segments, Content, etc.

## 4. API Integration

### Organization API Endpoints

The frontend will need to integrate with the following API endpoints for organization management:

```typescript
// Organization API Client in src/lib/api/endpoints/organizations.ts

/**
 * Gets current organization details
 */
export const getOrganization = async (): Promise<Organization> => {
  return apiClient.get('/organizations/me');
};

/**
 * Updates organization profile
 */
export const updateOrganization = async (data: OrganizationUpdateData): Promise<Organization> => {
  return apiClient.patch('/organizations/me', data);
};

/**
 * Get organization subscription details
 */
export const getSubscription = async (): Promise<Subscription> => {
  return apiClient.get('/organizations/me/subscription');
};

/**
 * Request subscription upgrade
 */
export const requestUpgrade = async (data: UpgradeRequest): Promise<SubscriptionUpgradeResponse> => {
  return apiClient.post('/organizations/me/subscription/upgrade', data);
};

/**
 * Get organization usage metrics
 */
export const getUsage = async (params?: UsageParams): Promise<UsageData> => {
  return apiClient.get('/organizations/me/usage', { params });
};

/**
 * Get organization usage forecasts
 */
export const getForecasts = async (params?: ForecastParams): Promise<ForecastData> => {
  return apiClient.get('/organizations/me/billing/forecasts', { params });
};

/**
 * Get billing history/invoices
 */
export const getBillingHistory = async (params?: BillingHistoryParams): Promise<BillingHistory> => {
  return apiClient.get('/organizations/me/billing/history', { params });
};

/**
 * Get payment methods
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  return apiClient.get('/organizations/me/billing/methods');
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (data: PaymentMethodData): Promise<PaymentMethod> => {
  return apiClient.post('/organizations/me/billing/methods', data);
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  return apiClient.delete(`/organizations/me/billing/methods/${methodId}`);
};

/**
 * Get organization settings
 */
export const getSettings = async (): Promise<OrganizationSettings> => {
  return apiClient.get('/organizations/me/settings');
};

/**
 * Update organization settings
 */
export const updateSettings = async (data: OrganizationSettingsUpdate): Promise<OrganizationSettings> => {
  return apiClient.patch('/organizations/me/settings', data);
};
```

### User API Endpoints

```typescript
// User API Client in src/lib/api/endpoints/users.ts

/**
 * Get users list
 */
export const getUsers = async (params?: UserListParams): Promise<PaginatedResponse<User>> => {
  return apiClient.get('/users', { params });
};

/**
 * Invite new user
 */
export const inviteUser = async (data: UserInviteData): Promise<User> => {
  return apiClient.post('/users', data);
};

/**
 * Get user details
 */
export const getUser = async (userId: string): Promise<User> => {
  return apiClient.get(`/users/${userId}`);
};

/**
 * Update user
 */
export const updateUser = async (userId: string, data: UserUpdateData): Promise<User> => {
  return apiClient.patch(`/users/${userId}`, data);
};

/**
 * Deactivate user
 */
export const deactivateUser = async (userId: string): Promise<void> => {
  return apiClient.delete(`/users/${userId}`);
};

/**
 * Resend invitation
 */
export const resendInvite = async (userId: string): Promise<void> => {
  return apiClient.post(`/users/${userId}/resend-invite`);
};

/**
 * Get available roles
 */
export const getRoles = async (): Promise<Role[]> => {
  return apiClient.get('/users/roles');
};
```

### Custom Hooks

Create custom hooks to leverage these API endpoints:

```typescript
// src/hooks/features/useOrganizationApi.ts
export const useOrganization = () => {
  return useQuery(['organization'], () => getOrganization());
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: OrganizationUpdateData) => updateOrganization(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organization']);
      },
    }
  );
};

// Similar hooks for other organization endpoints...

// src/hooks/features/useUsersApi.ts
export const useUsers = (params?: UserListParams) => {
  return useQuery(['users', params], () => getUsers(params));
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: UserInviteData) => inviteUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    }
  );
};

// Similar hooks for other user endpoints...
```

## 5. Organization Management Pages

### 5.1 Organization Settings Overview

**Path:** `/organizations`

**Purpose:** Central hub for managing organization settings, with navigation to specific settings areas.

**Layout:**
- Main `PageHeader` with title "Organization Settings" and organization name
- Tabs or card-based navigation to sub-areas:
  - Profile
  - Users
  - Billing & Subscription
  - Usage
  - Settings

**Component Structure:**
```tsx
// src/app/(app)/organizations/page.tsx
export default function OrganizationSettingsPage() {
  return (
    <>
      <PageHeader title="Organization Settings" />
      <TabsNav
        tabs={[
          { label: 'Profile', href: '/organizations/settings' },
          { label: 'Users', href: '/organizations/users' },
          { label: 'Billing & Subscription', href: '/organizations/billing' },
          { label: 'Usage', href: '/organizations/billing/usage' },
          { label: 'Settings', href: '/organizations/settings' },
        ]}
      />
      <Card>
        <CardContent>
          <OrganizationSummary />
        </CardContent>
      </Card>
    </>
  );
}
```

**Key Components:**
- `OrganizationSummary`: Displays key organization information (name, type, subscription tier, user count)
- `TabsNav`: Custom component for tab-based navigation
- Standard layout components (`PageHeader`, `Card`, `CardContent`)

### 5.2 Organization Profile

**Path:** `/organizations/settings`

**Purpose:** View and edit basic organization details.

**Layout:**
- `PageHeader` with title "Organization Profile"
- Form with organization details
- Logo upload area
- Save button

**Component Structure:**
```tsx
// src/app/(app)/organizations/settings/page.tsx
export default function OrganizationProfilePage() {
  return (
    <>
      <PageHeader title="Organization Profile" />
      <Card>
        <CardContent>
          <OrganizationSettingsForm />
        </CardContent>
      </Card>
    </>
  );
}

// src/components/features/organizations/OrganizationSettingsForm.tsx
export function OrganizationSettingsForm() {
  const { data: organization, isLoading } = useOrganization();
  const updateMutation = useUpdateOrganization();
  
  const form = useForm<OrganizationFormValues>({
    defaultValues: {
      name: organization?.name || '',
      // other fields
    },
    resolver: zodResolver(organizationSchema)
  });
  
  const onSubmit = async (values: OrganizationFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Organization updated successfully");
    } catch (error) {
      toast.error("Failed to update organization");
    }
  };
  
  if (isLoading) return <Skeleton />;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          label="Organization Name"
          render={({ field }) => (
            <Input {...field} placeholder="Enter organization name" />
          )}
        />
        
        <LogoUploader
          currentLogo={organization?.logo_url}
          onUpload={(url) => form.setValue('logo_url', url)}
        />
        
        <Button type="submit" loading={updateMutation.isLoading}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
```

**Key Components:**
- `OrganizationSettingsForm`: Form for editing organization details
- `LogoUploader`: Custom component for logo upload with preview
- Form components (`Form`, `FormField`, `Input`)
- `Button` with loading state

### 5.3 Billing & Subscription

**Path:** `/organizations/billing`

**Purpose:** View and manage billing information, subscription tier, and payment methods.

**Layout:**
- `PageHeader` with title "Billing & Subscription"
- Current subscription info card
- Upgrade options (if not on highest tier)
- Payment methods section
- Invoice history section

**Component Structure:**
```tsx
// src/app/(app)/organizations/billing/page.tsx
export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing & Subscription" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionCard />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Options</CardTitle>
          </CardHeader>
          <CardContent>
            <UpgradeOptions />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodList />
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setShowAddPaymentMethod(true)}>
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceList />
        </CardContent>
      </Card>
      
      <AddPaymentMethodModal
        isOpen={showAddPaymentMethod}
        onClose={() => setShowAddPaymentMethod(false)}
      />
    </>
  );
}
```

**Key Components:**
- `SubscriptionCard`: Displays current subscription information
- `UpgradeOptions`: Shows available upgrade paths and handles upgrade requests
- `PaymentMethodList`: Lists saved payment methods with options to delete
- `InvoiceList`: Table of previous invoices with download options
- `AddPaymentMethodModal`: Modal for adding new payment methods

### 5.4 Usage Tracking

**Path:** `/organizations/billing/usage`

**Purpose:** Visualize current resource usage against limits.

**Layout:**
- `PageHeader` with title "Resource Usage"
- Usage metrics cards/charts
- Date range filter
- Resource type filter (messages, storage, users, etc.)

**Component Structure:**
```tsx
// src/app/(app)/organizations/billing/usage/page.tsx
export default function UsagePage() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: subMonths(new Date(), 1), to: new Date() });
  
  return (
    <>
      <PageHeader title="Resource Usage" />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <Select
              label="Resource Type"
              options={[
                { label: "All Resources", value: "all" },
                { label: "Messages", value: "messages" },
                { label: "Storage", value: "storage" },
                { label: "Users", value: "users" },
                { label: "Workers", value: "workers" }
              ]}
              onChange={(value) => setResourceType(value)}
            />
            
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UsageMetricCard
          title="WhatsApp Messages"
          used={5280}
          limit={10000}
          unit="messages"
          icon={<MessageIcon />}
        />
        
        <UsageMetricCard
          title="Storage"
          used={1.7}
          limit={5}
          unit="GB"
          icon={<StorageIcon />}
        />
        
        <UsageMetricCard
          title="Active Workers"
          used={850}
          limit={1000}
          unit="workers"
          icon={<WorkerIcon />}
        />
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageChart
            resourceType={resourceType}
            dateRange={dateRange}
          />
        </CardContent>
      </Card>
    </>
  );
}
```

**Key Components:**
- `UsageMetricCard`: Displays a single resource metric with progress visualization
- `UsageChart`: Time-series chart of usage over the selected period
- `DateRangePicker`: Component for selecting date range
- Filter components (`Select`)

### 5.5 Usage Forecasts

**Path:** `/organizations/billing/forecasts`

**Purpose:** Predict future resource usage to help with capacity planning.

**Layout:**
- `PageHeader` with title "Usage Forecasts"
- Forecast period selector
- Resource type filter
- Forecast charts with projected limits
- Recommendations

**Component Structure:**
```tsx
// src/app/(app)/organizations/billing/forecasts/page.tsx
export default function ForecastsPage() {
  return (
    <>
      <PageHeader title="Usage Forecasts" />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <Select
              label="Resource Type"
              options={[
                { label: "All Resources", value: "all" },
                { label: "Messages", value: "messages" },
                { label: "Storage", value: "storage" },
                { label: "Workers", value: "workers" }
              ]}
              onChange={(value) => setResourceType(value)}
            />
            
            <Select
              label="Forecast Period"
              options={[
                { label: "Next 30 days", value: "30d" },
                { label: "Next 3 months", value: "3m" },
                { label: "Next 6 months", value: "6m" }
              ]}
              onChange={(value) => setForecastPeriod(value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Projected Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ForecastChart
            resourceType={resourceType}
            forecastPeriod={forecastPeriod}
          />
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ForecastRecommendations />
        </CardContent>
      </Card>
    </>
  );
}
```

**Key Components:**
- `ForecastChart`: Visualization of projected usage with confidence intervals
- `ForecastRecommendations`: Actionable suggestions based on forecasts
- Filter components (`Select`)

## 6. User Management Pages

### 6.1 User List Page

**Path:** `/organizations/users`

**Purpose:** List, filter, and manage all users in the organization.

**Layout:**
- `PageHeader` with title "Users" and "Invite User" action button
- Filter and search controls
- Data table of users with role, status, actions
- Pagination

**Component Structure:**
```tsx
// src/app/(app)/organizations/users/page.tsx
export default function UsersPage() {
  const [filter, setFilter] = useState({ search: '', role: '', status: '' });
  const [page, setPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  return (
    <>
      <PageHeader 
        title="Users" 
        actions={
          <Button onClick={() => setShowInviteModal(true)}>
            Invite User
          </Button>
        }
      />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Search users..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              startIcon={<SearchIcon />}
              className="w-64"
            />
            
            <Select
              placeholder="Filter by role"
              value={filter.role}
              onChange={(value) => setFilter({ ...filter, role: value })}
              options={[
                { label: "All Roles", value: "" },
                { label: "Admin", value: "admin" },
                { label: "Program Manager", value: "program_manager" },
                { label: "Training Manager", value: "training_manager" },
                { label: "Content Specialist", value: "content_specialist" }
              ]}
              className="w-48"
            />
            
            <Select
              placeholder="Filter by status"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
              options={[
                { label: "All Statuses", value: "" },
                { label: "Active", value: "active" },
                { label: "Invited", value: "invited" },
                { label: "Inactive", value: "inactive" }
              ]}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>
      
      <UserManagementTable 
        filter={filter}
        page={page}
        onPageChange={setPage}
        onEdit={(userId) => router.push(`/organizations/users/${userId}`)}
        onResendInvite={(userId) => handleResendInvite(userId)}
        onDeactivate={(userId) => handleDeactivate(userId)}
      />
      
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </>
  );
}
```

**Key Components:**
- `UserManagementTable`: Data table displaying users with pagination and actions
- `InviteUserModal`: Modal dialog for inviting new users
- Filter controls (`Input`, `Select`)
- Action handling for user operations (edit, resend invite, deactivate)

### 6.2 User Invite Flow

**Component:** `InviteUserModal`

**Purpose:** Create and send invitations to new users.

**Structure:**
```tsx
// src/components/features/organizations/InviteUserModal.tsx
export function InviteUserModal({ isOpen, onClose }) {
  const { data: roles } = useRoles();
  const inviteMutation = useInviteUser();
  
  const form = useForm<UserInviteFormValues>({
    defaultValues: {
      email: '',
      role: '',
      displayName: ''
    },
    resolver: zodResolver(userInviteSchema)
  });
  
  const onSubmit = async (values: UserInviteFormValues) => {
    try {
      await inviteMutation.mutateAsync(values);
      toast.success("Invitation sent successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New User">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            label="Email Address"
            render={({ field }) => (
              <Input {...field} placeholder="user@example.com" type="email" />
            )}
          />
          
          <FormField
            control={form.control}
            name="displayName"
            label="Display Name (Optional)"
            render={({ field }) => (
              <Input {...field} placeholder="John Doe" />
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            label="Role"
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select role"
                options={roles?.map(role => ({
                  label: role.displayName,
                  value: role.id
                })) || []}
              />
            )}
          />
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={inviteMutation.isLoading}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
```

**Key Components:**
- `Modal`: Reusable modal component
- Form components for user invite data
- Role selection
- Validation with zod schema
- Success/error handling with toast notifications

### 6.3 User Detail/Edit Page

**Path:** `/organizations/users/[userId]`

**Purpose:** View and edit details for an existing user.

**Layout:**
- `PageHeader` with title "User Details" and back button
- User information form
- Status controls (deactivate/reactivate user)
- Role management
- Save button

**Component Structure:**
```tsx
// src/app/(app)/organizations/users/[userId]/page.tsx
export default function UserDetailPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  
  return (
    <>
      <PageHeader 
        title="User Details" 
        backButton={{ href: '/organizations/users', label: 'Back to Users' }}
      />
      
      <Card>
        <CardContent>
          <UserDetailForm userId={userId} />
        </CardContent>
      </Card>
    </>
  );
}

// src/components/features/organizations/UserDetailForm.tsx
export function UserDetailForm({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  const { data: roles } = useRoles();
  const updateMutation = useUpdateUser();
  
  const form = useForm<UserUpdateFormValues>({
    defaultValues: {
      displayName: user?.display_name || '',
      role: user?.role || '',
      status: user?.status || 'active'
    },
    resolver: zodResolver(userUpdateSchema)
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.display_name,
        role: user.role,
        status: user.status
      });
    }
  }, [user, form]);
  
  const onSubmit = async (values: UserUpdateFormValues) => {
    try {
      await updateMutation.mutateAsync({ userId, ...values });
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };
  
  if (isLoading) return <Skeleton />;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="displayName"
            label="Display Name"
            render={({ field }) => (
              <Input {...field} />
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            label="Role"
            render={({ field }) => (
              <Select
                {...field}
                options={roles?.map(role => ({
                  label: role.displayName,
                  value: role.id
                })) || []}
              />
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            label="Status"
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" }
                ]}
              />
            )}
          />
          
          <Button type="submit" loading={updateMutation.isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

**Key Components:**
- `UserDetailForm`: Form for editing user details
- Form components for user data fields
- Dynamic loading of user data
- Success/error handling

## 7. Component Library

For implementing organization and user management pages, the following components from `src/components/ui/` will be used:

### Basic UI Components
- `Button`: Primary action buttons with variants and loading states
- `Input`: Text input fields with optional icons and states
- `Select`: Dropdown selection component
- `Card`, `CardHeader`, `CardContent`, `CardFooter`: Container components
- `Modal`: Dialog component for forms and confirmation
- `Form`, `FormField`: Form handling components
- `DataTable`: Enhanced table with sorting, filtering, pagination
- `Tabs`: Tab navigation component
- `DateRangePicker`: Date range selection
- `Skeleton`: Loading placeholder
- `Toast`: Notification system

### Organization Feature Components
- `PageHeader`: Consistent page headers with title, actions, back button
- `LogoUploader`: Component for uploading and cropping organization logos
- `SubscriptionCard`: Displays subscription tier information
- `UpgradeOptions`: Card-based display of available upgrade paths
- `PaymentMethodList`: List of payment methods with actions
- `InvoiceList`: Table of invoice history
- `UsageMetricCard`: Displays resource usage with visual indicator
- `UsageChart`: Time-series chart for usage visualization
- `ForecastChart`: Line chart with projections and confidence intervals

### User Feature Components
- `UserManagementTable`: Data table specifically for user listing and actions
- `InviteUserModal`: Modal for inviting new users
- `UserDetailForm`: Form for editing user details
- `RoleSelector`: Enhanced select for role assignment with descriptions

## 8. State Management

### Organization State
Organization data is primarily fetched and managed through React Query:

```typescript
// in Organization components
const { data: organization, isLoading, error } = useOrganization();
```

For form state, use React Hook Form:

```typescript
// in form components
const form = useForm<OrganizationFormValues>({
  defaultValues: { 
    name: organization?.name || '',
    // other fields
  },
  resolver: zodResolver(organizationSchema)
});
```

### User Management State
User listing uses React Query with pagination parameters:

```typescript
// in UserList component
const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
const [filters, setFilters] = useState({ search: '', role: '', status: '' });

const { data, isLoading, error } = useUsers({
  page: pagination.page,
  limit: pagination.pageSize,
  search: filters.search,
  role: filters.role,
  status: filters.status
});
```

For modals, use local component state:

```typescript
const [showInviteModal, setShowInviteModal] = useState(false);
```

## 9. Validation & Error Handling

### Form Validation
Use Zod schemas for validation:

```typescript
// src/lib/validation/organization.ts
export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(255),
  logo_url: z.string().optional(),
  // other fields
});

// src/lib/validation/user.ts
export const userInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().optional(),
  role: z.string().min(1, "Role is required")
});

export const userUpdateSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["active", "inactive"])
});
```

### Error Handling
Handle API errors with consistent error boundaries and toast notifications:

```typescript
try {
  await mutationFunction(data);
  toast.success("Operation completed successfully");
} catch (error) {
  console.error("Error:", error);
  
  // Get error message from API or use default
  const errorMessage = error.response?.data?.message || "An unexpected error occurred";
  toast.error(errorMessage);
  
  // For form errors
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach((err) => {
      form.setError(err.field, { 
        type: "server", 
        message: err.message 
      });
    });
  }
}
```

Use error boundaries for component-level error handling:

```tsx
// src/app/(app)/organizations/page.tsx
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function OrganizationSettingsPage() {
  return (
    <ErrorBoundary fallback={<OrganizationErrorFallback />}>
      {/* Page content */}
    </ErrorBoundary>
  );
}
```

## 10. Responsive Design

Implement responsive layouts using the following patterns:

### Responsive Grids
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards or content */}
</div>
```

### Responsive Tables
For the UserManagementTable and similar data tables:
- Use horizontal scrolling on small screens
- Hide less important columns
- Stack certain cell content

```tsx
// In UserManagementTable component
const columns = useMemo(() => [
  {
    accessorKey: 'display_name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
    // Hide on smaller screens
    meta: {
      skipHideOnMobile: false,
    }
  },
  // More columns
], []);

// In DataTable component implementation
const visibleColumns = useBreakpointValue({
  base: columns.filter(col => col.meta?.skipHideOnMobile !== false),
  md: columns,
});
```

### Responsive Forms
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField name="name" label="Name" />
  <FormField name="email" label="Email" />
</div>
```

### Responsive Modals
```tsx
// Adjust modal width based on screen size
<Modal
  isOpen={isOpen}
  onClose={onClose}
  className="w-full max-w-xs sm:max-w-md md:max-w-lg"
>
  {/* Modal content */}
</Modal>
```

## 11. Permissions & Access Control

### Role-Based UI Visibility
Show or hide UI elements based on user roles:

```tsx
// src/components/features/organizations/OrganizationSettingsForm.tsx
export function OrganizationSettingsForm() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'org_admin';
  
  return (
    <Form>
      {/* Basic fields visible to all */}
      
      {/* Advanced settings only visible to admins */}
      {isAdmin && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          {/* Admin-only settings */}
        </div>
      )}
    </Form>
  );
}
```

### Route Protection
Implement route protection in the layout for organization pages:

```tsx
// src/app/(app)/organizations/layout.tsx
export default function OrganizationLayout({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user has permission to access org settings
    if (currentUser && !hasOrgManagementPermission(currentUser)) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);
  
  if (!currentUser || !hasOrgManagementPermission(currentUser)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
}

// Helper function
function hasOrgManagementPermission(user) {
  return user.role === 'org_admin';
}
```

### Button/Action Disabling
Disable actions based on permissions:

```tsx
<Button 
  onClick={handleInviteUser}
  disabled={!canInviteUsers(currentUser.role)}
>
  Invite User
</Button>
```

## 12. Accessibility Requirements

### Keyboard Navigation
Ensure all interactive elements are keyboard accessible:

```tsx
// Make sure modals trap focus correctly
<Modal
  isOpen={isOpen}
  onClose={onClose}
  initialFocus={initialFocusRef}
  returnFocusOnClose={true}
>
  {/* Modal content */}
</Modal>

// Ensure form controls can be navigated with keyboard
<Button onKeyDown={handleKeyDown}>
  Action
</Button>
```

### Screen Reader Support
Include proper ARIA attributes:

```tsx
<div role="status" aria-live="polite">
  {statusMessage}
</div>

<Button
  aria-label="Add new payment method"
  onClick={handleAddPayment}
>
  <PlusIcon />
</Button>
```

### Color Contrast
Maintain sufficient color contrast for all text elements (WCAG AA 4.5:1 minimum) (Rule 11.4).

### Focus Indicators
Ensure visible focus indicators for all interactive elements:

```css
/* In global CSS */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

## 13. Implementation Checklist

### Organization Pages
- [ ] Organization Settings Overview page
- [ ] Organization Profile page
- [ ] Billing & Subscription page
- [ ] Usage Tracking page
- [ ] Usage Forecasts page

### User Management Pages
- [ ] User List page
- [ ] User Invite flow
- [ ] User Detail/Edit page

### API Integration
- [ ] Organization API endpoints
- [ ] User API endpoints
- [ ] Custom hooks for data fetching/mutations

### Components
- [ ] Organization components
- [ ] User management components
- [ ] Form validation schemas

### Testing
- [ ] Unit tests for critical components
- [ ] Integration tests for forms and API interactions
- [ ] Accessibility testing

### Documentation
- [ ] Component documentation
- [ ] API integration documentation
- [ ] User flows documentation

By following this implementation guide, you will create a comprehensive Organizations & Users management system in the ABCD Behavioral Coaching Platform frontend. This system will allow for proper multi-tenant management, user administration, and subscription control while adhering to the project's architectural and design standards. 