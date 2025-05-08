import { API_BASE_URL, apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';
import {
  MediaAssetFilterOptions,
  MediaAssetListResponse,
  MediaAssetResponse,
  MediaUploadProgress,
  MediaUploadRequest,
  UpdateMediaAssetDto
} from '@/types/mediaAsset';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Get a list of media assets with filtering
 */
export function useMediaAssets(options: MediaAssetFilterOptions = {}) {
  return useQuery({
    queryKey: ['mediaAssets', options],
    queryFn: () => apiClient<MediaAssetListResponse>('/mediaAssets', {
      method: 'GET',
      params: options as Record<string, string>,
    }),
  });
}

/**
 * Get a single media asset by ID
 */
export function useMediaAsset(id: string, organizationId?: string) {
  return useQuery({
    queryKey: ['mediaAssets', id, organizationId],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (organizationId) {
        params.organizationId = organizationId;
      }

      return apiClient<MediaAssetResponse>(`/mediaAssets/${id}`, {
        method: 'GET',
        params,
      });
    },
    enabled: !!id,
  });
}

/**
 * Upload a media asset
 * Note: This doesn't use onProgress tracking as React Query doesn't directly support it
 * For progress tracking, see useMediaUploadWithProgress below
 */
export function useMediaAssetUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MediaUploadRequest) => {
      const { file, organizationId, altText, uploadedById, metadata } = request;
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', organizationId);
      
      if (altText) {
        formData.append('altText', altText);
      }
      
      if (uploadedById) {
        formData.append('uploadedById', uploadedById);
      }
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      // Use fetch for the upload - always include credentials for cookie auth
      const response = await fetch(`${API_BASE_URL}/mediaAssets`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Always include cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

/**
 * Custom hook for media upload with progress tracking
 * This hook doesn't use React Query as it needs to track upload progress
 */
export function useMediaUploadWithProgress() {
  const queryClient = useQueryClient();
  
  const uploadMedia = async (
    request: MediaUploadRequest,
    onProgress?: (progress: MediaUploadProgress) => void
  ): Promise<MediaAssetResponse> => {
    const { file, organizationId, altText, uploadedById, metadata } = request;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('organizationId', organizationId);
    
    if (altText) {
      formData.append('altText', altText);
    }
    
    if (uploadedById) {
      formData.append('uploadedById', uploadedById);
    }
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
              status: 'uploading'
            });
          }
        });
      }
      
      // Handle successful upload
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            
            if (onProgress) {
              onProgress({
                loaded: 100,
                total: 100,
                percentage: 100,
                status: 'complete'
              });
            }
            
            // Invalidate queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
            
            resolve(response);
          } catch (error) {
            if (onProgress) {
              onProgress({
                loaded: 0,
                total: 0,
                percentage: 0,
                status: 'error',
                error: 'Failed to parse response'
              });
            }
            reject(new Error('Failed to parse response'));
          }
        } else {
          let errorMessage = 'Upload failed';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.message || errorMessage;
          } catch (e) {
            // Use default error message if parsing fails
          }
          
          if (onProgress) {
            onProgress({
              loaded: 0,
              total: 0,
              percentage: 0,
              status: 'error',
              error: errorMessage
            });
          }
          reject(new Error(errorMessage));
        }
      });
      
      // Handle network errors
      xhr.addEventListener('error', () => {
        if (onProgress) {
          onProgress({
            loaded: 0,
            total: 0,
            percentage: 0,
            status: 'error',
            error: 'Network error during upload'
          });
        }
        reject(new Error('Network error during upload'));
      });
      
      // Handle aborted uploads
      xhr.addEventListener('abort', () => {
        if (onProgress) {
          onProgress({
            loaded: 0,
            total: 0,
            percentage: 0,
            status: 'error',
            error: 'Upload was aborted'
          });
        }
        reject(new Error('Upload was aborted'));
      });
      
      // Open and send the request
      xhr.open('POST', `${API_BASE_URL}/mediaAssets`);
      
      // Enable credentials to include cookies for authentication
      xhr.withCredentials = true;
      
      xhr.send(formData);
    });
  };
  
  return { uploadMedia };
}

/**
 * Update a media asset's metadata
 */
export function useUpdateMediaAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaAssetDto }) =>
      apiClient<MediaAssetResponse>(`/mediaAssets/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

/**
 * Delete a media asset
 */
export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<ApiResponse<null>>(`/mediaAssets/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}

/**
 * Get a pre-signed URL for a media asset
 */
export function usePresignedUrl(id: string, expiresIn: number = 3600) {
  return useQuery({
    queryKey: ['mediaAssets', id, 'presignedUrl', expiresIn],
    queryFn: () => apiClient<{ success: boolean; presignedUrl: string; }>(`/mediaAssets/${id}/presigned-url`, {
      method: 'GET',
      params: { expiresIn: expiresIn.toString() },
    }).then(response => response.presignedUrl),
    enabled: !!id,
  });
}

/**
 * Get usage information for a media asset
 */
export function useMediaAssetUsage(id: string) {
  return useQuery({
    queryKey: ['mediaAssets', id, 'usage'],
    queryFn: () => apiClient<{ success: boolean; usages: any[]; }>(`/mediaAssets/${id}/usage`, {
      method: 'GET',
    }).then(response => response.usages),
    enabled: !!id,
  });
}

/**
 * Validate a file before uploading
 * This is a utility function, not a hook
 */
export function validateMediaFile(file: File): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Get file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Check file size (max 16MB as per WhatsApp limits for most media)
  if (file.size > 16 * 1024 * 1024) {
    errors.fileSize = 'File is too large. Maximum size is 16MB.';
  }
  
  // Check file type
  if (file.type.startsWith('image/')) {
    // Additional image validation could be done here
  } else if (file.type.startsWith('video/')) {
    // Video validation
    if (file.size > 16 * 1024 * 1024) {
      errors.fileSize = 'Video is too large. Maximum size is 16MB for WhatsApp compatibility.';
    }
  } else if (file.type.startsWith('audio/')) {
    // Audio validation
    if (file.size > 16 * 1024 * 1024) {
      errors.fileSize = 'Audio is too large. Maximum size is 16MB for WhatsApp compatibility.';
    }
  } else if (file.type === 'application/pdf') {
    // PDF validation
    if (file.size > 20 * 1024 * 1024) {
      errors.fileSize = 'PDF is too large. Maximum size is 20MB.';
    }
  } else {
    errors.fileType = 'Unsupported file type. Please upload an image, video, audio, or PDF file.';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
} 