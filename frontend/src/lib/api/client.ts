import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@/store'
import { logout } from '@/store/auth/authSlice'

// API error response interface
interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}

// Create an Axios instance with a base URL and default headers
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const { auth } = store.getState()
    if (auth.token) {
      config.headers['Authorization'] = `Bearer ${auth.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorData>) => {
    const { status } = error.response || {}

    // Handle authentication errors
    if (status === 401) {
      // Dispatch logout action to clear credentials
      store.dispatch(logout())
      // Redirect to login page if in browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Standardize error format
    const errorResponse = {
      status: status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || {},
    }

    return Promise.reject(errorResponse)
  }
)

// Type for API response
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error'
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// Generic API request function
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient(config)
    return response.data.data as T
  } catch (error) {
    throw error
  }
} 