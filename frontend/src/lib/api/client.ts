import { ApiError } from "@/types/common";

// Base API client for making requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
};

// Helper function to build URL with query parameters
const buildUrl = (endpoint: string, params?: Record<string, string>) => {
  let url: URL;
  if (endpoint.startsWith('http')) {
    url = new URL(endpoint);
  } else {
    url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

// Helper function to get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error reading auth token:', error);
  }
  return null;
};

// Main API client function
export async function apiClient<T>(
  endpoint: string,
  { method = 'GET', headers = {}, body, params }: RequestOptions = {}
): Promise<T> {
  const url = buildUrl(endpoint, params);
  
  // Get auth token
  const token = getAuthToken();
  
  const requestOptions: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers
    },
  };
  
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, requestOptions);
    
    // Handle unauthorized access
    if (response.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth-storage');
      
      // Redirect to login if not already on login page
      if (!window.location.pathname.startsWith('/login')) {
        // Store the current path for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
      }
      
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle other API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `API Error: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      );
    }
    
    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('API request failed:', error);
    throw error;
  }
} 