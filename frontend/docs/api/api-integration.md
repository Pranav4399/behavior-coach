# API Integration Strategy

This document outlines the approach for integrating with backend APIs in the Behavior Coach application, ensuring consistent data fetching, error handling, and state management.

## Architecture Overview

```
┌────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│   UI Component │       │  Custom Hooks    │      │   API Client    │
│                │──────▶│  (React Query)   │─────▶│                 │
└────────────────┘       └─────────────────┘      └─────────────────┘
        ▲                        │                         │
        │                        │                         │
        └────────────────────────┘                         ▼
               Data Flow                          ┌─────────────────┐
                                                 │   Backend API    │
                                                 │                  │
                                                 └─────────────────┘
```

## Core Components

### 1. API Client

The base API client is a thin wrapper around `fetch` that handles common concerns:

- Base URL configuration
- Authentication headers
- Request/response formatting
- Error handling
- Content type negotiation

```typescript
// src/lib/api/client.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
};

export async function apiClient<T>(
  endpoint: string,
  { method = 'GET', headers = {}, body, params }: RequestOptions = {}
): Promise<T> {
  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  // Configure request options
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
  };
  
  // Add JWT auth token from store if available
  const token = localStorage.getItem('auth-storage') ? 
    JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token : null;
  
  if (token) {
    requestOptions.headers = {
      ...requestOptions.headers,
      Authorization: `Bearer ${token}`
    };
  }
  
  // Add request body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }
  
  // Make the request
  const response = await fetch(url.toString(), requestOptions);
  
  // Handle HTTP errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API Error: ${response.status} ${response.statusText}`
    );
  }
  
  // Return empty object for 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  // Parse and return JSON response
  return response.json();
}
```

### 2. Domain-Specific API Hooks

We create custom hooks for each domain entity, using React Query for data fetching and caching:

```typescript
// src/hooks/api/useOrganizations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Organization } from '@/types/organization';

// List organizations (for admins)
export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => apiClient<{ organizations: Organization[] }>('/api/organizations')
      .then(res => res.organizations),
  });
}

// Get current user's organization
export function useMyOrganization() {
  return useQuery({
    queryKey: ['organizations', 'me'],
    queryFn: () => apiClient<{ organization: Organization }>('/api/organizations/me')
      .then(res => res.organization),
  });
}

// Create a new organization
export function useCreateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Organization>) => 
      apiClient<{ organization: Organization }>('/api/organizations', {
        method: 'POST',
        body: data,
      }).then(res => res.organization),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

// Similar hooks for updating and deleting organizations
```

## Integration Patterns

### 1. Data Fetching in Components

Components use the custom hooks to fetch and display data:

```tsx
// src/components/organization/OrganizationProfile.tsx
'use client';

import { useMyOrganization } from '@/hooks/api/useOrganizations';

export function OrganizationProfile() {
  const { data: organization, isLoading, error } = useMyOrganization();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error.message} />;
  if (!organization) return <EmptyState message="No organization found" />;
  
  return (
    <div>
      <h1>{organization.name}</h1>
      <Badge>{organization.type}</Badge>
      {/* More organization details */}
    </div>
  );
}
```

### 2. Form Submission with Mutations

Forms use React Hook Form with mutation hooks for submissions:

```tsx
// src/components/organization/CreateOrganizationForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateOrganization } from '@/hooks/api/useOrganizations';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['client', 'expert']),
  subscriptionTier: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function CreateOrganizationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'client',
      subscriptionTier: 'basic',
    },
  });
  
  const createMutation = useCreateOrganization();
  
  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data, {
      onSuccess: (newOrganization) => {
        // Handle success (e.g., redirect to new organization)
        router.push(`/organizations/${newOrganization.id}`);
      },
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit" isLoading={createMutation.isPending}>
        Create Organization
      </Button>
      
      {createMutation.isError && (
        <Alert variant="error">{createMutation.error.message}</Alert>
      )}
    </form>
  );
}
```

## Error Handling Strategy

We implement a comprehensive error handling strategy:

1. **API Level Errors**
   - Network errors
   - HTTP status errors
   - Authentication errors
   - Validation errors

2. **UI Error States**
   - Loading indicators
   - Error boundaries
   - Inline error messages
   - Toast notifications for operations

3. **Retry Mechanisms**
   - Automatic retries for network issues
   - Manual retry options for user-initiated actions

```tsx
// Example error handling in a component
function UserListing() {
  const { data, isLoading, error, refetch } = useUsers();
  
  if (isLoading) return <LoadingIndicator />;
  
  if (error) {
    return (
      <ErrorDisplay 
        message="Could not load users" 
        details={error.message}
        retryAction={() => refetch()}
      />
    );
  }
  
  // Render the user list
}
```

## Optimistic Updates

For responsive UI, we implement optimistic updates for common actions:

```typescript
// Example of optimistic update with rollback
export function useUpdateOrganizationName() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => 
      apiClient(`/api/organizations/${id}`, {
        method: 'PATCH',
        body: { name },
      }),
    
    // Optimistically update the cache
    onMutate: async ({ id, name }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['organizations', id] });
      
      // Save the previous value
      const previousOrg = queryClient.getQueryData(['organizations', id]);
      
      // Optimistically update the cache
      queryClient.setQueryData(['organizations', id], (old: any) => ({
        ...old,
        name,
      }));
      
      // Return the previous value for rollback
      return { previousOrg };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ['organizations', context.previousOrg.id],
        context.previousOrg
      );
    },
    
    // Always refetch after error or success to make sure cache is in sync
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
  });
}
```

## Data Mocking for Development

During early development, we provide mock implementations of API hooks:

```typescript
// src/hooks/api/useOrganizationsMock.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { Organization } from '@/types/organization';

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    type: 'client',
    subscriptionTier: 'premium',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  // More mock organizations
];

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => Promise.resolve(MOCK_ORGANIZATIONS),
  });
}

// Mock implementations of other hooks
```

## Request Caching and Invalidation

We establish clear caching rules based on entity relationships:

1. **Query Keys Structure**
   - Use array format: `['entity', 'id', 'relation']`
   - Example: `['organizations', '123', 'users']`

2. **Invalidation Patterns**
   - Invalidate collections when items are added/removed
   - Invalidate related data when parent entities change

```typescript
// Example of coordinated cache invalidation
export function useAddUserToOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string, userId: string }) =>
      apiClient(`/api/organizations/${organizationId}/users`, {
        method: 'POST',
        body: { userId },
      }),
    
    onSuccess: (data, variables) => {
      // Invalidate the affected organization's user list
      queryClient.invalidateQueries({ 
        queryKey: ['organizations', variables.organizationId, 'users'] 
      });
      
      // Invalidate the user's organizations
      queryClient.invalidateQueries({ 
        queryKey: ['users', variables.userId, 'organizations'] 
      });
    },
  });
}
```

This API integration strategy ensures consistent, reliable, and performant data handling throughout the application. 