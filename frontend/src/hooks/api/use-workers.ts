import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Worker,
  WorkerCreateData,
  WorkerFilterOptions,
  WorkerUpdateData,
  WorkerListResponse,
  WorkerResponse,
  WorkerBulkImportData,
  WorkerBulkUpdateData,
  WorkerBulkDeleteData,
  WorkerTagsData
} from '@/types/worker';
import { useAuth } from '../useAuth';
import { apiClient } from '@/lib/api/client';

/**
 * Hook for fetching a paginated list of workers with filtering options
 */
export function useWorkers(
  page = 1,
  limit = 10,
  filters?: WorkerFilterOptions,
  organizationId?: string
) {
  const { user } = useAuth();
  const orgId = organizationId || user?.organizationId;

  // Build query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  // Add filter params if provided
  if (filters) {
    if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
    if (filters.employmentStatus) queryParams.append('employmentStatus', filters.employmentStatus);
    if (filters.department) queryParams.append('department', filters.department);
    if (filters.team) queryParams.append('team', filters.team);
    if (filters.hiredAfter) queryParams.append('hiredAfter', filters.hiredAfter);
    if (filters.hiredBefore) queryParams.append('hiredBefore', filters.hiredBefore);
    if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
  }

  return useQuery<WorkerListResponse>({
    queryKey: ['workers', orgId, page, limit, filters],
    queryFn: async () => {
      const url = orgId 
        ? `/workers?${queryParams.toString()}`
        : `/workers/${orgId}?${queryParams.toString()}`;
      
      return apiClient<WorkerListResponse>(url);
    },
    enabled: !!orgId,
    staleTime: 30000,
    gcTime: 60000
  });
}

/**
 * Hook for fetching a single worker by ID
 */
export function useWorker(workerId: string) {
  return useQuery<WorkerResponse>({
    queryKey: ['workers', workerId],
    queryFn: async () => {
      return apiClient<WorkerResponse>(`/workers/${workerId}`);
    },
    enabled: !!workerId
  });
}

/**
 * Hook for creating a new worker
 */
export function useCreateWorker() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (workerData: WorkerCreateData) => {
      // If organizationId is not provided, use the current user's organization
      if (!workerData.organizationId && user?.organizationId) {
        workerData.organizationId = user.organizationId;
      }
      
      return apiClient<WorkerResponse>('/workers', {
        method: 'POST',
        body: workerData
      });
    },
    onSuccess: () => {
      // Invalidate workers list query to refetch
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });
}

/**
 * Hook for updating an existing worker
 */
export function useUpdateWorker(workerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: WorkerUpdateData) => {
      return apiClient<WorkerResponse>(`/workers/${workerId}`, {
        method: 'PATCH',
        body: updateData
      });
    },
    onSuccess: () => {
      // Invalidate specific worker query and list
      queryClient.invalidateQueries({ queryKey: ['workers', workerId] });
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });
}

/**
 * Hook for deleting a worker
 */
export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workerId: string) => {
      return apiClient<WorkerResponse>(`/workers/${workerId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      // Invalidate workers list query
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });
}

/**
 * Hook for bulk importing workers
 */
export function useBulkImportWorkers() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (importData: WorkerBulkImportData) => {
      // If organizationId is not provided, use the current user's organization
      if (!importData.organizationId && user?.organizationId) {
        importData.organizationId = user.organizationId;
      }
      
      return apiClient<{success: boolean; count: number}>(`/workers/bulk-import`, {
        method: 'POST',
        body: importData
      });
    },
    onSuccess: () => {
      // Invalidate workers list query
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });
}

/**
 * Hook for bulk updating workers
 */
export function useBulkUpdateWorkers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: WorkerBulkUpdateData) => {
      return apiClient<{success: boolean; count: number}>(`/workers/bulk-update`, {
        method: 'PATCH',
        body: updateData
      });
    },
    onSuccess: () => {
      // Invalidate workers list query
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });
}

/**
 * Hook for bulk deleting workers
 */
export function useBulkDeleteWorkers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deleteData: WorkerBulkDeleteData) => {
      return apiClient<{success: boolean; count: number}>(`/workers/bulk-delete`, {
        method: 'DELETE',
        body: deleteData
      });
    },
    onSuccess: () => {
      // Invalidate workers list query
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });
}

/**
 * Hook for adding tags to a worker
 */
export function useAddWorkerTags(workerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagsData: WorkerTagsData) => {
      return apiClient<WorkerResponse>(`/workers/${workerId}/tags`, {
        method: 'POST',
        body: tagsData
      });
    },
    onSuccess: () => {
      // Invalidate specific worker query
      queryClient.invalidateQueries({ queryKey: ['workers', workerId] });
    }
  });
}

/**
 * Hook for removing a tag from a worker
 */
export function useRemoveWorkerTag(workerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: string) => {
      return apiClient<WorkerResponse>(`/workers/${workerId}/tags/${tag}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      // Invalidate specific worker query
      queryClient.invalidateQueries({ queryKey: ['workers', workerId] });
    }
  });
} 