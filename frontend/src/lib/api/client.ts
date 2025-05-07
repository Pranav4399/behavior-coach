import { ApiError } from "@/types/common";
import { useAuthStore } from "@/store/auth";
import logger from "./logging";

// Configuration constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000; // 1 second

// Request interceptor type
export type RequestInterceptor = (config: RequestOptions) => RequestOptions | Promise<RequestOptions>;

// Response interceptor type
export type ResponseInterceptor<T = any> = (
  response: T,
  request: RequestOptions
) => T | Promise<T>;

// Error interceptor type
export type ErrorInterceptor = (
  error: ApiError,
  request: RequestOptions
) => ApiError | Promise<ApiError>;

// Cache configuration
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  key?: string; // Custom cache key, defaults to URL + params
}

// Enhanced request options
export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
  timeout?: number;
  retry?: {
    maxRetries?: number;
    delayMs?: number;
    retryCondition?: (error: Error) => boolean;
  };
  cacheConfig?: CacheConfig;
  withAuth?: boolean;
  endpoint?: string; // Added for compatibility with interceptors
};

// In-memory cache
const apiCache = new Map<string, { data: any; timestamp: number }>();

// Collection of interceptors
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

/**
 * Add a request interceptor
 */
export function addRequestInterceptor(interceptor: RequestInterceptor): void {
  requestInterceptors.push(interceptor);
}

/**
 * Add a response interceptor
 */
export function addResponseInterceptor<T>(interceptor: ResponseInterceptor<T>): void {
  responseInterceptors.push(interceptor as ResponseInterceptor);
}

/**
 * Add an error interceptor
 */
export function addErrorInterceptor(interceptor: ErrorInterceptor): void {
  errorInterceptors.push(interceptor);
}

// Helper function to build URL with query parameters
export const buildUrl = (endpoint: string, params?: Record<string, string>) => {
  let url: URL;
  if (endpoint.startsWith('http')) {
    url = new URL(endpoint);
  } else {
    url = new URL(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, window.location.origin);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  return url.toString();
};

// Helper function to get auth token
export const getAuthToken = () => {
  try {
    return useAuthStore.getState().token;
  } catch (error) {
    console.error('Error reading auth token:', error);
  }
  return null;
};

/**
 * Generate a cache key for the request
 */
function generateCacheKey(endpoint: string, options: RequestOptions): string {
  if (options.cacheConfig?.key) {
    return options.cacheConfig.key;
  }
  
  // Create a cache key based on the URL and body data
  const url = buildUrl(endpoint, options.params);
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${options.method || 'GET'}-${url}-${body}`;
}

/**
 * Check if cached data is valid
 */
function getCachedData(endpoint: string, options: RequestOptions): any {
  if (!options.cacheConfig?.enabled) return null;

  const cacheKey = generateCacheKey(endpoint, options);
  const cached = apiCache.get(cacheKey);

  if (!cached) return null;

  // Check if cache is expired
  const now = Date.now();
  if (now - cached.timestamp > (options.cacheConfig.ttl || 0)) {
    apiCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

/**
 * Set data in the cache
 */
function setCacheData(endpoint: string, options: RequestOptions, data: any): void {
  if (!options.cacheConfig?.enabled) return;

  const cacheKey = generateCacheKey(endpoint, options);
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clear the entire cache or specific items
 */
export function clearCache(key?: string): void {
  if (key) {
    apiCache.delete(key);
  } else {
    apiCache.clear();
  }
}

/**
 * Apply request interceptors
 */
async function applyRequestInterceptors(options: RequestOptions): Promise<RequestOptions> {
  let modifiedOptions = { ...options };
  
  for (const interceptor of requestInterceptors) {
    modifiedOptions = await interceptor(modifiedOptions);
  }
  
  return modifiedOptions;
}

/**
 * Apply response interceptors
 */
async function applyResponseInterceptors<T>(response: T, request: RequestOptions): Promise<T> {
  let modifiedResponse = response;
  
  for (const interceptor of responseInterceptors) {
    modifiedResponse = await interceptor(modifiedResponse, request);
  }
  
  return modifiedResponse;
}

/**
 * Apply error interceptors
 */
async function applyErrorInterceptors(error: ApiError, request: RequestOptions): Promise<ApiError> {
  let modifiedError = error;
  
  for (const interceptor of errorInterceptors) {
    modifiedError = await interceptor(modifiedError, request);
  }
  
  return modifiedError;
}

/**
 * Execute the API request with timeout, retries, and error handling
 */
async function executeRequest<T>(
  endpoint: string,
  options: RequestOptions,
  retryCount = 0
): Promise<T> {
  const timeoutMs = options.timeout || DEFAULT_TIMEOUT_MS;
  const url = buildUrl(endpoint, options.params);
  const method = options.method || 'GET';

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth token if required
  if (options.withAuth !== false) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  // Add body data if present and not a GET request
  if (options.body && method !== 'GET') {
    requestOptions.body = JSON.stringify(options.body);
  }

  // Log the request
  logger.apiRequest(method, url, options.body);

  // Create a timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new ApiError(`Request timeout after ${timeoutMs}ms`, 408));
    }, timeoutMs);
  });

  try {
    // Race the fetch against the timeout
    const response = await Promise.race([
      fetch(url, requestOptions),
      timeoutPromise,
    ]) as Response;

    // Handle authentication errors
    if (response.status === 401) {
      // Clear auth data
      useAuthStore.getState().clearAuth();
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        useAuthStore.getState().setRedirectUrl(window.location.pathname);
        window.location.href = '/login';
      }
      
      const authError = new ApiError('Session expired. Please login again.', 401);
      logger.apiError(method, url, authError);
      throw authError;
    }

    // Handle other API errors
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Response might not contain valid JSON
      }

      const apiError = new ApiError(
        (errorData as any).message || `API Error: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      );
      
      logger.apiError(method, url, apiError);
      throw apiError;
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      logger.apiResponse(method, url, 204);
      return {} as T;
    }

    // Parse JSON response
    const data = await response.json();
    
    // Log successful response
    logger.apiResponse(method, url, response.status, data);
    
    // Apply response interceptors
    const processedData = await applyResponseInterceptors<T>(data, options);
    
    // Cache the result if needed
    if (options.cacheConfig?.enabled) {
      setCacheData(endpoint, options, processedData);
    }
    
    return processedData;
  } catch (error) {
    // Handle and process errors
    let apiError: ApiError;
    
    if (error instanceof ApiError) {
      apiError = error;
    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      apiError = new ApiError('Network error. Please check your connection.', 0);
      logger.apiError(method, url, apiError);
    } else {
      apiError = new ApiError((error as Error).message || 'Unknown error', 0);
      logger.apiError(method, url, apiError);
    }
    
    // Apply error interceptors
    const processedError = await applyErrorInterceptors(apiError, options);
    
    // Handle retries if configured
    const maxRetries = options.retry?.maxRetries ?? MAX_RETRIES;
    const shouldRetry = options.retry?.retryCondition ? 
      options.retry.retryCondition(processedError) : 
      retryCount < maxRetries && (processedError.status >= 500 || processedError.status === 0);
    
    if (shouldRetry) {
      const delayMs = options.retry?.delayMs ?? RETRY_DELAY_MS;
      logger.info(`Retrying request (${retryCount + 1}/${maxRetries}) after ${delayMs}ms: ${method} ${url}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      // Retry the request
      return executeRequest<T>(endpoint, options, retryCount + 1);
    }
    
    throw processedError;
  }
}

// Enhanced Main API client function
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Check if we have cached data
  const cachedData = getCachedData(endpoint, options);
  if (cachedData) {
    return cachedData as T;
  }

  // Add endpoint to options for interceptors
  options.endpoint = endpoint;

  // Apply request interceptors
  const processedOptions = await applyRequestInterceptors(options);
  
  // Execute the request
  return executeRequest<T>(endpoint, processedOptions);
}

// Add default interceptors
addRequestInterceptor(config => {
  // Add default headers or manipulate request
  return config;
});

addResponseInterceptor(response => {
  // Process successful responses
  return response;
});

addErrorInterceptor(error => {
  // Handle and transform errors
  return error;
}); 