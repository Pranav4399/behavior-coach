import { apiRequest, apiClient } from '../client'
import { API_PATHS } from './api-paths'

// Types
export interface Organization {
  id: string
  name: string
  type: 'client' | 'expert'
  subscriptionTier: string
  logoUrl?: string
  customTerminology?: Record<string, string>
  settings?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationData {
  name: string
  type: 'client' | 'expert'
  subscriptionTier: string
  logoUrl?: string
  customTerminology?: Record<string, string>
  settings?: Record<string, any>
}

export interface UpdateOrganizationData {
  name?: string
  subscriptionTier?: string
  logoUrl?: string
  customTerminology?: Record<string, string>
  settings?: Record<string, any>
}

// Get all organizations
export const getAllOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get(API_PATHS.ORGANIZATIONS.BASE)
  return response.data.data.organizations
}

// Get organization by ID
export const getOrganizationById = async (id: string): Promise<Organization> => {
  const response = await apiClient.get(API_PATHS.ORGANIZATIONS.DETAIL(id))
  return response.data.data.organization
}

// Create a new organization
export const createOrganization = async (data: CreateOrganizationData): Promise<Organization> => {
  const response = await apiClient.post(API_PATHS.ORGANIZATIONS.BASE, data)
  return response.data.data.organization
}

// Update an organization
export const updateOrganization = async (
  id: string,
  data: UpdateOrganizationData
): Promise<Organization> => {
  const response = await apiClient.put(API_PATHS.ORGANIZATIONS.DETAIL(id), data)
  return response.data.data.organization
}

// Delete an organization
export const deleteOrganization = async (id: string): Promise<void> => {
  await apiClient.delete(API_PATHS.ORGANIZATIONS.DETAIL(id))
}

// Get current user's organization
export const getCurrentOrganization = async (): Promise<Organization> => {
  const response = await apiClient.get(API_PATHS.ORGANIZATIONS.CURRENT)
  return response.data.data.organization
}

// Update current user's organization
export const updateCurrentOrganization = async (
  data: UpdateOrganizationData
): Promise<Organization> => {
  const response = await apiClient.patch(API_PATHS.ORGANIZATIONS.CURRENT, data)
  return response.data.data.organization
}

// Get organization settings
export const getOrganizationSettings = async (): Promise<any> => {
  const response = await apiClient.get(API_PATHS.ORGANIZATIONS.SETTINGS)
  return response.data.data
}

// Update organization settings
export const updateOrganizationSettings = async (data: any): Promise<any> => {
  const response = await apiClient.patch(API_PATHS.ORGANIZATIONS.SETTINGS, data)
  return response.data.data
}

// Get organization roles
export const getOrganizationRoles = async (): Promise<any> => {
  const response = await apiClient.get(API_PATHS.ORGANIZATIONS.ROLES)
  return response.data.data
}

// Get organization permissions
export const getOrganizationPermissions = async (): Promise<any> => {
  const response = await apiClient.get(API_PATHS.ORGANIZATIONS.PERMISSIONS)
  return response.data.data
} 