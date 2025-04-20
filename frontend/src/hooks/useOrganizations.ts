'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getCurrentOrganization,
  updateCurrentOrganization,
  getOrganizationSettings,
  updateOrganizationSettings,
  getOrganizationRoles,
  getOrganizationPermissions,
  type Organization,
  type CreateOrganizationData,
  type UpdateOrganizationData,
} from '@/lib/api/endpoints/organizations'

// Hook to fetch all organizations
export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganizations,
  })
}

// Hook to fetch a specific organization by ID
export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  })
}

// Hook to create a new organization
export const useCreateOrganization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateOrganizationData) => createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}

// Hook to update an organization
export const useUpdateOrganization = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateOrganizationData) => updateOrganization(id, data),
    onSuccess: (updatedOrg) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['organizations', id] })
    },
  })
}

// Hook to delete an organization
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['organizations', id] })
    },
  })
}

// Hook to fetch the current user's organization
export const useCurrentOrganization = () => {
  return useQuery({
    queryKey: ['organizations', 'me'],
    queryFn: getCurrentOrganization,
  })
}

// Hook to update the current user's organization
export const useUpdateCurrentOrganization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateOrganizationData) => updateCurrentOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', 'me'] })
    },
  })
}

// Hook to fetch organization settings
export const useOrganizationSettings = () => {
  return useQuery({
    queryKey: ['organizations', 'me', 'settings'],
    queryFn: getOrganizationSettings,
  })
}

// Hook to update organization settings
export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => updateOrganizationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', 'me', 'settings'] })
    },
  })
}

// Hook to fetch organization roles
export const useOrganizationRoles = () => {
  return useQuery({
    queryKey: ['organizations', 'me', 'roles'],
    queryFn: getOrganizationRoles,
  })
}

// Hook to fetch organization permissions
export const useOrganizationPermissions = () => {
  return useQuery({
    queryKey: ['organizations', 'me', 'permissions'],
    queryFn: getOrganizationPermissions,
  })
} 