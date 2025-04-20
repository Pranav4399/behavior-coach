import { apiClient } from '../client'
import { User } from '@/store/auth/authSlice'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  organizationName: string
  organizationType: 'client' | 'expert'
}

export interface AuthResponse {
  user: User
  token: string
}

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data.data
}

// Register
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data)
  return response.data.data
}

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me')
  return response.data.data.user
}

// Logout
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/auth/forgot-password', { email })
}

// Reset password
export const resetPassword = async (token: string, password: string): Promise<void> => {
  await apiClient.post('/auth/reset-password', { token, password })
} 