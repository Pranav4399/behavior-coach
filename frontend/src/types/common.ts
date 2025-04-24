// Common types used across the application

// API standard response format
export interface ApiResponse<T> {
  status: string;
  results: number;
  data: T;
}

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Custom API error class to include the full error response
export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// API result type with loading, error, and data states
export type ApiResult<T> = {
  data?: T;
  isLoading: boolean;
  error?: Error | null;
}; 