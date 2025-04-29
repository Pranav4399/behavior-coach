import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Segment,
  SegmentCreateData,
  SegmentFilterOptions,
  SegmentUpdateData,
  SegmentListResponse,
  SegmentResponse,
  SegmentAddWorkersData,
  SegmentTestResponse,
  SegmentAnalyticsData,
  SegmentInsightsData,
  SegmentComparisonData,
  SegmentOverlappingData,
  SegmentRule
} from '@/types/segment';
import { useAuth } from '../useAuth';
import { apiClient } from '@/lib/api/client';
import { transformRuleToBackendFormat, transformRuleToFrontendFormat } from '@/lib/segments/rule-formatter';

/**
 * Hook for fetching a paginated list of segments with filtering options
 */
export function useSegments(
  page = 1,
  limit = 10,
  filters?: SegmentFilterOptions
) {
  const { user } = useAuth();
  const orgId = user?.organizationId;

  // Build query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  // Add filter params if provided
  if (filters) {
    if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
    if (filters.type) queryParams.append('type', filters.type);
  }

  return useQuery<SegmentListResponse>({
    queryKey: ['segments', orgId, page, limit, filters],
    queryFn: async () => {
      const response = await apiClient<{
        status: string;
        data: {
          segments: Array<{
            id: string;
            name: string;
            description: string | null;
            type: 'static' | 'rule_based';
            ruleDefinition: any;
            workerCount: number;
            lastSyncAt: string | null;
            organizationId: string;
            createdById: string;
            updatedById: string;
            createdAt: string;
            updatedAt: string;
          }>;
          pagination: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          };
        };
      }>(`/segments?${queryParams.toString()}`);
      
      // Transform the response to match our expected format, converting rule definitions to frontend format
      const transformedSegments: Segment[] = response.data.segments.map(segment => ({
        id: segment.id,
        name: segment.name,
        description: segment.description || undefined,
        organizationId: segment.organizationId,
        type: segment.type,
        ruleDefinition: segment.ruleDefinition 
          ? (transformRuleToFrontendFormat(segment.ruleDefinition) || undefined)
          : undefined,
        memberCount: segment.workerCount,
        createdAt: segment.createdAt,
        updatedAt: segment.updatedAt,
        lastSyncAt: segment.lastSyncAt || undefined
      }));
      
      return {
        segments: transformedSegments,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
        limit: response.data.pagination.pageSize
      };
    },
    enabled: !!orgId,
    staleTime: 30000,
    gcTime: 60000
  });
}

/**
 * Hook for fetching a single segment by ID
 */
export function useSegment(segmentId: string) {
  return useQuery<SegmentResponse>({
    queryKey: ['segments', segmentId],
    queryFn: async () => {
      const response = await apiClient<SegmentResponse>(`/segments/${segmentId}`);
      
      // Transform the rule definition to frontend format if present
      if (response.data?.segment?.ruleDefinition) {
        const transformedRule = transformRuleToFrontendFormat(
          response.data.segment.ruleDefinition
        );
        if (transformedRule) {
          response.data.segment.ruleDefinition = transformedRule;
        } else {
          response.data.segment.ruleDefinition = undefined;
        }
      }
      
      return response;
    },
    enabled: !!segmentId
  });
}

/**
 * Hook for creating a new segment
 */
export function useCreateSegment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<
    SegmentResponse,
    Error,
    SegmentCreateData,
    { prevSegments: any }
  >({
    mutationFn: async (segmentData: SegmentCreateData) => {
      // If organizationId is not provided, use the current user's organization
      if (!segmentData.organizationId && user?.organizationId) {
        segmentData.organizationId = user.organizationId;
      }
      
      // For rule-based segments, validate that a rule definition is provided
      if (segmentData.type === 'rule_based' && !segmentData.ruleDefinition) {
        throw new Error('Rule definition is required for rule-based segments');
      }
      
      // Create a backend-compatible version of the create data
      const backendCreateData: any = { ...segmentData };
      
      // If it's a rule-based segment, transform the rule definition to backend format
      if (segmentData.type === 'rule_based' && segmentData.ruleDefinition) {
        backendCreateData.ruleDefinition = transformRuleToBackendFormat(segmentData.ruleDefinition);
      }
      
      return apiClient<SegmentResponse>('/segments', {
        method: 'POST',
        body: backendCreateData
      });
    },
    onMutate: async (newSegment) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['segments'] });
      
      // Snapshot the previous value
      const prevSegments = queryClient.getQueryData(['segments']);
      
      return { prevSegments };
    },
    onError: (err, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.prevSegments) {
        queryClient.setQueryData(['segments'], context.prevSegments);
      }
    },
    onSuccess: () => {
      // Invalidate segments list query to refetch
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    }
  });
}

/**
 * Hook for updating an existing segment
 */
export function useUpdateSegment(segmentId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    SegmentResponse,
    Error,
    SegmentUpdateData,
    { prevSegment: any }
  >({
    mutationFn: async (updateData: SegmentUpdateData) => {
      // If changing to rule-based type, ensure rule definition is provided
      if (updateData.type === 'rule_based' && !updateData.ruleDefinition) {
        // Get the current segment to check if it already has a rule definition
        const currentSegmentResponse = await queryClient.fetchQuery({
          queryKey: ['segments', segmentId],
          queryFn: () => apiClient<SegmentResponse>(`/segments/${segmentId}`)
        });
        
        const currentSegment = currentSegmentResponse.data.segment;
        
        // If changing from static to rule-based and no rule definition exists or is provided, throw error
        if (currentSegment.type === 'static' && !currentSegment.ruleDefinition) {
          throw new Error('Rule definition is required when changing segment type to rule-based');
        }
      }
      
      // Create a backend-compatible version of the update data
      const backendUpdateData: any = { ...updateData };
      
      // If updating a rule definition, transform it to backend format
      if (updateData.ruleDefinition) {
        backendUpdateData.ruleDefinition = transformRuleToBackendFormat(updateData.ruleDefinition);
      }
      
      return apiClient<SegmentResponse>(`/segments/${segmentId}`, {
        method: 'PATCH',
        body: backendUpdateData
      });
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['segments', segmentId] });
      
      // Snapshot the previous segment
      const prevSegment = queryClient.getQueryData(['segments', segmentId]);
      
      return { prevSegment };
    },
    onError: (err, _, context) => {
      // Roll back to the previous segment on error
      if (context?.prevSegment) {
        queryClient.setQueryData(['segments', segmentId], context.prevSegment);
      }
    },
    onSuccess: () => {
      // Invalidate specific segment query and list
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId] });
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    }
  });
}

/**
 * Hook for deleting a segment
 */
export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (segmentId: string) => {
      return apiClient<{ success: boolean; message: string }>(`/segments/${segmentId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      // Invalidate segments list query
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    }
  });
}

/**
 * Hook for fetching workers in a segment
 */
export function useSegmentWorkers(
  segmentId: string,
  page = 1,
  limit = 10,
  searchTerm?: string
) {
  // Build query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  if (searchTerm) {
    queryParams.append('searchTerm', searchTerm);
  }

  return useQuery({
    queryKey: ['segments', segmentId, 'workers', page, limit, searchTerm],
    queryFn: async () => {
      return apiClient(`/segments/${segmentId}/workers?${queryParams.toString()}`);
    },
    enabled: !!segmentId
  });
}

/**
 * Hook for adding workers to a segment
 */
export function useAddWorkersToSegment(segmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SegmentAddWorkersData) => {
      return apiClient(`/segments/${segmentId}/workers`, {
        method: 'POST',
        body: data
      });
    },
    onSuccess: () => {
      // Invalidate segment workers query
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId, 'workers'] });
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId] });
    }
  });
}

/**
 * Hook for removing a worker from a segment
 */
export function useRemoveWorkerFromSegment(segmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workerId: string) => {
      return apiClient(`/segments/${segmentId}/workers/${workerId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      // Invalidate segment workers query
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId, 'workers'] });
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId] });
    }
  });
}

/**
 * Hook for testing a segment rule against workers
 */
export function useTestSegmentRule(segmentId: string) {
  return useMutation({
    mutationFn: async (options: { limit?: number } = {}) => {
      return apiClient<SegmentTestResponse>(`/segments/${segmentId}/test-rule`, {
        method: 'POST',
        body: options
      });
    }
  });
}

/**
 * Hook for testing a custom rule against workers
 */
export function useTestRule() {
  return useMutation<
    { success: boolean; data: SegmentTestResponse },
    Error,
    { rule: SegmentRule; limit?: number }
  >({
    mutationFn: async ({ rule, limit = 10 }: { rule: SegmentRule; limit?: number }) => {
      // Transform rule to backend format before sending
      const transformedRule = transformRuleToBackendFormat(rule);
      
      const response = await apiClient<{ success: boolean; data: SegmentTestResponse }>('/segments/test-rule', {
        method: 'POST',
        body: { rule: transformedRule, limit }
      });
      return response;
    }
  });
}

/**
 * Hook for validating a rule definition without testing against workers
 */
export function useValidateRule() {
  return useMutation<
    { success: boolean; valid: boolean; errors?: string[] },
    Error,
    SegmentRule
  >({
    mutationFn: async (rule: SegmentRule) => {
      // Transform rule to backend format before sending
      const transformedRule = transformRuleToBackendFormat(rule);
      
      return apiClient('/segments/validate-rule', {
        method: 'POST',
        body: { rule: transformedRule }
      });
    }
  });
}

/**
 * Hook for explaining why a worker matches or doesn't match a rule
 */
export function useExplainWorkerRuleMatch() {
  return useMutation<
    any,
    Error,
    { workerId: string; rule: SegmentRule }
  >({
    mutationFn: async ({ workerId, rule }: { workerId: string; rule: SegmentRule }) => {
      // Transform rule to backend format
      const transformedRule = transformRuleToBackendFormat(rule);
      
      return apiClient('/segments/explain-worker-match', {
        method: 'POST',
        body: { workerId, rule: transformedRule }
      });
    }
  });
}

/**
 * Hook for explaining why a worker matches or doesn't match a segment
 */
export function useExplainWorkerSegmentMatch(segmentId: string, workerId: string) {
  return useQuery({
    queryKey: ['segments', segmentId, 'workers', workerId, 'explain'],
    queryFn: async () => {
      const response = await apiClient<{
        status: string;
        data: {
          explanation: {
            ruleDetails?: any;
            [key: string]: any;
          };
          membershipStatus?: any;
        };
      }>(`/segments/${segmentId}/workers/${workerId}/explain`);
      
      // Transform explanation rule details to frontend format if present
      if (response.data?.explanation?.ruleDetails) {
        const transformedRule = transformRuleToFrontendFormat(
          response.data.explanation.ruleDetails
        );
        if (transformedRule) {
          response.data.explanation.ruleDetails = transformedRule;
        }
      }
      
      return response;
    },
    enabled: !!segmentId && !!workerId
  });
}

/**
 * Hook for manually triggering a segment sync
 */
export function useSyncSegment(segmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiClient(`/segments/${segmentId}/sync`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      // Invalidate segment and segment sync status
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId] });
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId, 'sync'] });
    }
  });
}

/**
 * Hook for getting segment sync status
 */
export function useSegmentSyncStatus(segmentId: string) {
  return useQuery({
    queryKey: ['segments', segmentId, 'sync'],
    queryFn: async () => {
      return apiClient(`/segments/${segmentId}/sync/status`);
    },
    enabled: !!segmentId,
    refetchInterval: 900000 // Refetch every 15 minutes while active
  });
}

/**
 * Hook for getting segment analytics
 */
export function useSegmentAnalytics(segmentId: string) {
  return useQuery<{ success: boolean; data: SegmentAnalyticsData }>({
    queryKey: ['segments', segmentId, 'analytics'],
    queryFn: async () => {
      return apiClient(`/segments/${segmentId}/analytics`);
    },
    enabled: !!segmentId
  });
}

/**
 * Hook for getting segment insights
 */
export function useSegmentInsights(segmentId: string) {
  return useQuery<{ success: boolean; data: SegmentInsightsData }>({
    queryKey: ['segments', segmentId, 'insights'],
    queryFn: async () => {
      return apiClient(`/segments/${segmentId}/insights`);
    },
    enabled: !!segmentId
  });
}

/**
 * Hook for comparing segments
 */
export function useCompareSegments(segmentA: string, segmentB: string) {
  return useQuery<{ success: boolean; data: SegmentComparisonData }>({
    queryKey: ['segments', 'compare', segmentA, segmentB],
    queryFn: async () => {
      return apiClient(`/segments/compare?segmentA=${segmentA}&segmentB=${segmentB}`);
    },
    enabled: !!segmentA && !!segmentB
  });
}

/**
 * Hook for getting overlapping segments
 */
export function useOverlappingSegments(segmentId: string) {
  return useQuery<{ success: boolean; data: SegmentOverlappingData[] }>({
    queryKey: ['segments', segmentId, 'overlapping'],
    queryFn: async () => {
      return apiClient(`/segments/${segmentId}/overlapping`);
    },
    enabled: !!segmentId
  });
}

/**
 * Custom hook that combines rule validation with segment creation
 * This helps ensure that segments with invalid rules aren't created
 */
export function useCreateSegmentWithRuleValidation() {
  const createSegment = useCreateSegment();
  const validateRule = useValidateRule();
  const queryClient = useQueryClient();
  
  return useMutation<
    SegmentResponse,
    Error,
    SegmentCreateData,
    undefined
  >({
    mutationFn: async (segmentData: SegmentCreateData) => {
      // Only validate rule-based segments
      if (segmentData.type === 'rule_based' && segmentData.ruleDefinition) {
        // Validate the rule definition first (no need to transform here as validateRule already does it)
        const validationResult = await validateRule.mutateAsync(segmentData.ruleDefinition);
        
        // If rule is invalid, throw error with validation details
        if (!validationResult.valid) {
          const errorMessage = validationResult.errors?.join(', ') || 'Invalid rule definition';
          throw new Error(`Rule validation failed: ${errorMessage}`);
        }
      }
      
      // If validation passes or not needed, create the segment
      return createSegment.mutateAsync(segmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    }
  });
}

/**
 * Custom hook that combines rule validation with segment updating
 * This helps ensure that segments with invalid rules aren't updated
 */
export function useUpdateSegmentWithRuleValidation(segmentId: string) {
  const updateSegment = useUpdateSegment(segmentId);
  const validateRule = useValidateRule();
  const queryClient = useQueryClient();
  
  return useMutation<
    SegmentResponse,
    Error,
    SegmentUpdateData,
    undefined
  >({
    mutationFn: async (updateData: SegmentUpdateData) => {
      // Only validate if we're updating the rule definition
      if (updateData.ruleDefinition) {
        // Validate the rule definition first (no need to transform here as validateRule already does it)
        const validationResult = await validateRule.mutateAsync(updateData.ruleDefinition);
        
        // If rule is invalid, throw error with validation details
        if (!validationResult.valid) {
          const errorMessage = validationResult.errors?.join(', ') || 'Invalid rule definition';
          throw new Error(`Rule validation failed: ${errorMessage}`);
        }
      }
      
      // If validation passes or not needed, update the segment
      return updateSegment.mutateAsync(updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments', segmentId] });
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    }
  });
} 