import { API_BASE_URL } from '@/config';

interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      organizationId?: string;
    };
    token: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
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