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
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  return response.json();
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