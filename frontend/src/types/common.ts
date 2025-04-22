// Common types used across the application

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

// Error response type
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
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