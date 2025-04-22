// Base API client for making requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
};

// Helper function to build URL with query parameters
const buildUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

// Main API client function
export async function apiClient<T>(
  endpoint: string,
  { method = 'GET', headers = {}, body, params }: RequestOptions = {}
): Promise<T> {
  const url = buildUrl(endpoint, params);
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
  };
  
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, requestOptions);
  
  // Handle API errors
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
  
  return response.json();
} 