import { apiRequest } from '../client'
import { API_PATHS } from './api-paths'

export interface User {
  id: string
  email: string
  name?: string
  role: string
  organizationId?: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
}

export interface CreateUserData {
  email: string
  name?: string
  role: string
  password?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
  status?: 'active' | 'inactive'
}

// Fetch all users
export const getAllUsers = async (): Promise<User[]> => {
  return apiRequest<User[]>({
    method: 'GET',
    url: API_PATHS.USERS.BASE,
  })
}

// Fetch a specific user by ID
export const getUserById = async (id: string): Promise<User> => {
  return apiRequest<User>({
    method: 'GET',
    url: API_PATHS.USERS.DETAIL(id),
  })
}

// Create a new user
export const createUser = async (data: CreateUserData): Promise<User> => {
  return apiRequest<User>({
    method: 'POST',
    url: API_PATHS.USERS.BASE,
    data,
  })
}

// Update an existing user
export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  return apiRequest<User>({
    method: 'PATCH',
    url: API_PATHS.USERS.DETAIL(id),
    data,
  })
}

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  return apiRequest<void>({
    method: 'DELETE',
    url: API_PATHS.USERS.DETAIL(id),
  })
}

// Invite a user
export const inviteUser = async (data: { email: string; role: string }): Promise<void> => {
  return apiRequest<void>({
    method: 'POST',
    url: API_PATHS.USERS.INVITE,
    data,
  })
} 