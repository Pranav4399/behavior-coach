import { apiClient } from './client';

interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      roleId?: string;
      organizationId?: string;
    };
    token: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface PermissionsResponse {
  status: string;
  data: {
    permissions: string[];
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  const responseData = await response.json();
  
  return {
    ...responseData,
    data: {
      ...responseData.data,
      token: 'HTTP_ONLY_COOKIE'
    }
  };
}

/**
 * Fetches the current user's permissions from the server
 * @returns Promise resolving to the user's permissions array
 */
export async function getUserPermissions(): Promise<string[]> {
  try {
    const response = await apiClient<PermissionsResponse>('/auth/permissions');
    return response.data.permissions;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

/**
 * Logs out the current user by clearing the auth cookie
 * @returns Promise resolving to the logout response
 */
export async function logout(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Include cookies in the request
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to logout');
  }

  return response.json();
}

/**
 * Refreshes the authentication token by requesting a new one
 * @returns Promise resolving to the refresh response
 */
export async function refreshToken(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // Include cookies in the request
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to refresh token');
  }

  return response.json();
} 