# State Management Strategy

This document outlines the state management approach for the Behavior Coach application, defining how data flows through the application and how different types of state are handled.

## State Categories

We classify application state into the following categories:

### 1. Server State (Remote Data)
Data fetched from APIs that represents the source of truth on the server.

**Examples:**
- Organization data
- User listings
- Role definitions
- Activity logs

**Management Strategy:** React Query
- Benefits:
  - Built-in caching
  - Background refetching
  - Optimistic updates
  - Mutation handling
  - Loading/error states
  - Pagination support

### 2. Global UI State
Application-wide UI state that multiple components need access to.

**Examples:**
- Authentication state
- Current organization context
- Theme settings
- Notification state

**Management Strategy:** Zustand stores
- Benefits:
  - Simple API
  - No boilerplate
  - Highly performant
  - TypeScript support
  - Flexible middleware

### 3. Local Component State
State specific to a single component that doesn't need to be shared.

**Examples:**
- Form input values
- Toggle states
- Modal open/closed state
- Accordion expanded state

**Management Strategy:** React's useState or useReducer hooks
- When to use useState:
  - Simple, independent state values
  - Few state transitions
- When to use useReducer:
  - Complex state logic
  - Multiple related state values
  - Many state transitions

### 4. Form State
State related to form inputs, validation, and submission.

**Examples:**
- Input values
- Validation errors
- Form submission state
- Touched/dirty fields

**Management Strategy:** React Hook Form
- Benefits:
  - Performant (uncontrolled components)
  - Built-in validation with Zod
  - Focus management
  - Error handling

## State Management Implementation

### React Query Setup

```typescript
// src/lib/api/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Zustand Store Example

```typescript
// src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

### Custom Hooks for API Calls

```typescript
// src/hooks/api/useOrganization.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Organization } from '@/types/organization';

// Get current organization
export function useCurrentOrganization() {
  return useQuery({
    queryKey: ['organization', 'me'],
    queryFn: () => apiClient<{ organization: Organization }>('/api/organizations/me').then(res => res.organization),
  });
}

// Update organization
export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Organization>) => 
      apiClient<{ organization: Organization }>('/api/organizations/me', {
        method: 'PATCH',
        body: data,
      }).then(res => res.organization),
    onSuccess: (data) => {
      queryClient.setQueryData(['organization', 'me'], data);
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
  });
}
```

## Data Flow Patterns

### 1. Server Data Flow
1. Component mounts and calls a React Query hook (e.g., `useCurrentOrganization`)
2. React Query checks cache for data
3. If not in cache or stale, React Query fetches from API
4. Component receives data with loading/error states
5. Updates are handled through mutation hooks that update cache

### 2. Global UI State Flow
1. Component imports a Zustand store hook (e.g., `useAuthStore`)
2. Component reads state or calls actions from the store
3. Store updates trigger re-renders in all components using that state
4. Persistent state is automatically saved to localStorage

### 3. Form State Flow
1. Component creates a form using React Hook Form
2. User inputs are captured and validated
3. Form submission is handled with a mutation hook
4. Success/error states update UI accordingly
5. React Query cache is invalidated or updated optimistically

## Performance Considerations

1. **Selective Rendering**
   - Use fine-grained selectors with Zustand to prevent unnecessary re-renders
   
2. **Query Optimization**
   - Configure appropriate stale times and cache invalidation strategies
   - Use query keys effectively for cache management
   
3. **Lazy Loading**
   - Only fetch data when needed (e.g., on tab change)
   
4. **Batched Updates**
   - Group related state changes to minimize re-renders

5. **Memoization**
   - Use React.memo, useMemo, and useCallback appropriately for expensive calculations

This state management strategy provides a consistent and scalable approach to handling various types of state throughout the application, ensuring good performance and maintainability. 