import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';
import {
  Organization,
  CreateOrganizationData,
  OrganizationsResponse,
  OrganizationResponse,
} from '@/types/organization';

// Fetch all organizations
export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => apiClient<ApiResponse<OrganizationsResponse>>('/organizations'),
  });
}

// Create a new organization
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationData) =>
      apiClient<ApiResponse<OrganizationResponse>>('/organizations', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

// Get organization by ID
export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => apiClient<ApiResponse<OrganizationResponse>>(`/organizations/${id}`),
    enabled: !!id, // Only run the query if ID is provided
  });
} 