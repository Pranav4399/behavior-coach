import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';
import { 
  User, 
  UsersResponse, 
  UserResponse, 
  UserFilters, 
  InviteUserData,
  UpdateUserData 
} from '@/types/user';

// Fetch all users with optional filtering
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => apiClient<ApiResponse<UsersResponse>>('/users', {
      params: filters as Record<string, string>
    }),
  });
}

// Get user by ID
export function useUser(id: string, organizationId?: string) {
  return useQuery({
    queryKey: ['users', id, organizationId],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (organizationId) {
        params.organizationId = organizationId;
      }
      
      return apiClient<ApiResponse<UserResponse>>(`/users/${id}`, {
        params
      });
    },
    enabled: !!id,
  });
}

// Invite a new user
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserData) =>
      apiClient<ApiResponse<UserResponse>>('/users', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      apiClient<ApiResponse<UserResponse>>(`/users/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Delete/deactivate user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<ApiResponse<null>>(`/users/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Resend invitation
export function useResendInvitation() {
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<ApiResponse<null>>(`/users/${id}/resend-invite`, {
        method: 'POST',
      }),
  });
}

// Update user preferences
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, preferences }: { id: string; preferences: Record<string, any> }) =>
      apiClient<ApiResponse<UserResponse>>(`/users/${id}/preferences`, {
        method: 'PATCH',
        body: { preferences },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
} 