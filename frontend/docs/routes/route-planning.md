# Frontend Route Planning

This document outlines the frontend routes for the Behavior Coach application, aligned with the backend API endpoints.

## Route Structure

The application uses Next.js App Router with the following route structure:

```
app/
├── page.tsx                      # Landing/home page
├── auth/
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── forgot-password/          # Forgot password page
│   ├── reset-password/           # Reset password page
│   └── verify-email/             # Email verification page
├── dashboard/                    # Dashboard (authenticated)
├── organizations/                # Organizations module
│   ├── create/                   # Create organization
│   ├── [id]/                     # Organization by ID
│   │   ├── profile/              # Organization profile
│   │   ├── settings/             # Organization settings
│   │   ├── members/              # Organization members
│   │   ├── roles/                # Organization roles
│   │   └── subscription/         # Organization subscription
├── users/                        # Users module
│   ├── [id]/                     # User by ID
│   │   ├── profile/              # User profile
│   │   └── settings/             # User settings
├── settings/                     # Current user settings
│   ├── profile/                  # Personal profile
│   ├── workspace/                # Workspace settings
│   ├── notifications/            # Notification settings
│   └── security/                 # Security settings
└── api/                          # Frontend API endpoints
```

## Route to API Endpoint Mapping

Each frontend route is mapped to one or more API endpoints.

### Authentication Routes

| Frontend Route | API Endpoint | Description |
|----------------|--------------|-------------|
| `/auth/login` | `POST /api/auth/login` | User login |
| `/auth/register` | `POST /api/auth/signup` | User registration |
| `/auth/forgot-password` | `POST /api/auth/forgot-password` | Request password reset |
| `/auth/reset-password` | `POST /api/auth/reset-password` | Reset password with token |
| `/auth/verify-email` | `GET /api/auth/verify-email` | Verify email with token |

### Dashboard Routes

| Frontend Route | API Endpoint | Description |
|----------------|--------------|-------------|
| `/dashboard` | `GET /api/organizations/me`<br>`GET /api/users/me` | Dashboard overview |

### Organization Routes

| Frontend Route | API Endpoint | Description |
|----------------|--------------|-------------|
| `/organizations/create` | `POST /api/organizations` | Create new organization |
| `/organizations/[id]` | `GET /api/organizations/[id]` | Organization details |
| `/organizations/[id]/profile` | `GET /api/organizations/[id]`<br>`PATCH /api/organizations/[id]` | View/edit organization profile |
| `/organizations/[id]/settings` | `GET /api/organizations/[id]/settings`<br>`PATCH /api/organizations/[id]/settings` | Organization settings |
| `/organizations/[id]/members` | `GET /api/organizations/[id]/users` | Organization members |
| `/organizations/[id]/roles` | `GET /api/organizations/[id]/roles`<br>`POST /api/organizations/[id]/roles` | Organization roles |
| `/organizations/[id]/subscription` | `GET /api/organizations/[id]/subscription` | Organization subscription |

### Current Organization Routes

These routes use the `/me` endpoint pattern for the current user's organization.

| Frontend Route | API Endpoint | Description |
|----------------|--------------|-------------|
| `/dashboard/organization` | `GET /api/organizations/me` | Current organization overview |
| `/dashboard/organization/settings` | `GET /api/organizations/me/settings`<br>`PATCH /api/organizations/me/settings` | Current organization settings |
| `/dashboard/organization/members` | `GET /api/organizations/me/users` | Current organization members |
| `/dashboard/organization/roles` | `GET /api/organizations/me/roles` | Current organization roles |

### User Routes

| Frontend Route | API Endpoint | Description |
|----------------|--------------|-------------|
| `/users` | `GET /api/users` | User listing |
| `/users/[id]` | `GET /api/users/[id]` | User details |
| `/users/[id]/profile` | `GET /api/users/[id]`<br>`PATCH /api/users/[id]` | User profile |
| `/users/[id]/settings` | `GET /api/users/[id]/preferences`<br>`PATCH /api/users/[id]/preferences` | User preferences |

### Current User Routes

| Frontend Route | API Endpoint | Description |
|----------------|--------------|-------------|
| `/settings/profile` | `GET /api/auth/me`<br>`PATCH /api/users/me` | Current user profile |
| `/settings/workspace` | `GET /api/users/me/preferences`<br>`PATCH /api/users/me/preferences` | Current user workspace settings |
| `/settings/notifications` | `GET /api/users/me/preferences`<br>`PATCH /api/users/me/preferences` | Notification settings |
| `/settings/security` | `PATCH /api/auth/password` | Change password, security settings |

## Protected Routes

Routes that require authentication:

- `/dashboard/*`
- `/organizations/*`
- `/users/*`
- `/settings/*`

## Role-Based Access Control

Access to certain routes is restricted based on user roles:

| Route | Required Role/Permission |
|-------|--------------------------|
| `/users` | `user:view` |
| `/organizations/[id]/settings` | `organization:edit` |
| `/organizations/[id]/members` | `user:view` |
| `/organizations/[id]/roles` | `role:view` |
| `/dashboard/organization/settings` | `organization:edit` |

## Layout Structure

Routes are organized into layouts for consistent UI:

- `RootLayout`: Applied to all routes
- `AuthLayout`: Applied to all `/auth/*` routes
- `AppLayout`: Applied to all authenticated routes
  - `DashboardLayout`: Applied to dashboard routes
  - `OrganizationLayout`: Applied to organization routes
  - `UserLayout`: Applied to user routes
  - `SettingsLayout`: Applied to settings routes

## Route Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `id` | Organization or user ID | `/organizations/550e8400-e29b-41d4-a716-446655440000` |
| `token` | Verification token | `/auth/verify-email?token=xyz123` |

## Query Parameters

| Parameter | Routes | Description |
|-----------|--------|-------------|
| `page` | List views | Pagination page number |
| `limit` | List views | Items per page |
| `search` | List views | Search query |
| `sort` | List views | Sort field and direction |
| `filter` | List views | Filter criteria |

## Route Implementation with Next.js App Router

### Example: Organization Profile Page

```typescript
// app/organizations/[id]/profile/page.tsx
import { OrganizationProfilePage } from '@/components/organization/OrganizationProfilePage';
import { getOrganization } from '@/lib/api/server/organizations';

export default async function OrganizationProfile({ params }: { params: { id: string } }) {
  // Server component: fetch data on the server
  const organization = await getOrganization(params.id);
  
  return <OrganizationProfilePage organization={organization} />;
}
```

### Example: Protected Route with Client Component

```typescript
// app/settings/profile/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProfileSettings } from '@/components/settings/ProfileSettings';

export default function ProfileSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/settings/profile');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }
  
  return <ProfileSettings />;
}
```

## 404 and Error Handling

- Custom 404 page for non-existent routes: `app/not-found.tsx`
- Error boundaries for runtime errors: `app/error.tsx`
- API error handling in components with appropriate feedback

## Route Metadata

Each route will include appropriate metadata for SEO:

```typescript
export const metadata = {
  title: 'Organization Profile | Behavior Coach',
  description: 'View and manage organization profile',
};
```

This routing structure aligns with the backend API endpoints and provides a logical organization of features within the application. 