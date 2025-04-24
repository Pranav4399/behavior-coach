import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';
import {
  Role,
  RolesResponse,
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest
} from '@/types/roles';

/**
 * Hook to get all roles for current organization
 */
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => apiClient<ApiResponse<RolesResponse>>('/roles'),
  });
}

/**
 * Hook to get all roles across all organizations (platform admin only)
 */
export function useAdminRoles() {
  return useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => apiClient<ApiResponse<RolesResponse>>('/roles/admin/all'),
  });
}

/**
 * Hook to get a specific role by ID
 */
export function useRole(id: string | undefined) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => apiClient<ApiResponse<RoleResponse>>(`/roles/${id}`),
    enabled: !!id,
  });
}

/**
 * Hook to create a new role
 */
export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => 
      apiClient<ApiResponse<RoleResponse>>('/roles', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
  });
}

/**
 * Hook to update an existing role
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => 
      apiClient<ApiResponse<RoleResponse>>(`/roles/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
  });
}

/**
 * Hook to delete a role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, organizationId }: { id: string; organizationId?: string }) => {
      // If organizationId is provided, include it as a query parameter
      const url = organizationId
        ? `/roles/${id}?organizationId=${organizationId}`
        : `/roles/${id}`;

      return apiClient<ApiResponse<void>>(url, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
  });
}

/**
 * Hook to check if a role has any associated users
 */
export function useCheckRoleHasUsers(roleId: string | undefined, organizationId?: string) {
  return useQuery({
    queryKey: ['role', roleId, 'has-users', organizationId],
    queryFn: () => {
      if (!roleId) {
        return Promise.resolve({ status: 'success', data: { hasUsers: false } });
      }
      
      // Build the URL with optional organizationId parameter
      let url = `/roles/${roleId}/has-users`;
      if (organizationId) {
        url += `?organizationId=${organizationId}`;
      }
      
      return apiClient<ApiResponse<{ hasUsers: boolean }>>(url);
    },
    // Don't run the query if roleId is not provided
    enabled: !!roleId,
  });
} 