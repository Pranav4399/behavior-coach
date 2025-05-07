import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';
import {
  Content,
  ContentFilterOptions,
  ContentListResponse,
  ContentResponse,
  ContentStatus,
  ContentType,
  ContentWithDetails,
  CreateContentDto,
  UpdateContentDto,
  TextContent,
  ImageContent,
  VideoContent,
  AudioContent,
  DocumentContent,
  QuizContent,
  ReflectionContent,
  TemplateContent
} from '@/types/content';
import { ContentMediaCreateRequest } from '@/types/contentMedia';
import { toast } from '@/components/ui/toast';

/**
 * Hook to fetch content list with filtering options
 */
export function useContents(options: ContentFilterOptions = {}) {
  return useQuery({
    queryKey: ['contents', options],
    queryFn: () => apiClient<ContentListResponse>('/contents', {
      method: 'GET',
      params: options as Record<string, string>,
    }),
    enabled: !!options.organizationId,
  });
}

/**
 * Hook to fetch a single content item by ID
 */
export function useContent(id: string, organizationId?: string) {
  return useQuery({
    queryKey: ['contents', id, organizationId],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (organizationId) {
        params.organizationId = organizationId;
      }

      return apiClient<ContentResponse>(`/contents/${id}`, {
        method: 'GET',
        params,
      });
    },
    enabled: !!id,
  });
}

/**
 * Direct function to fetch a single content item by ID (not a hook)
 */
export const getContent = async (id: string, organizationId?: string): Promise<ContentResponse> => {
  const params: Record<string, string> = {};
  if (organizationId) {
    params.organizationId = organizationId;
  }

  return apiClient<ContentResponse>(`/contents/${id}`, {
    method: 'GET',
    params,
  });
};

/**
 * Hook to update content - basic update operation
 */
export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContentDto }) =>
      apiClient<ContentResponse>(`/contents/${id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      
      // Show success toast
      toast({
        title: "Content Updated",
        description: "The content was successfully updated.",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to update type-specific content data
 */
export function useUpdateTypeSpecificContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient<ContentResponse>(`/contents/${id}/data`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      
      // Show success toast
      toast({
        title: "Content Updated",
        description: "The content details were successfully updated.",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update content details",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to update content status
 */
export function useUpdateContentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiClient<ContentResponse>(`/contents/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      
      // Show success toast
      toast({
        title: "Status Updated",
        description: `Content status was changed to ${variables.status}`,
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Status Update Failed",
        description: error instanceof Error ? error.message : "Failed to update content status",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to delete content
 */
export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<ApiResponse<null>>(`/contents/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      
      // Show success toast
      toast({
        title: "Content Deleted",
        description: "The content was successfully deleted.",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update text content
 */
export function useTextContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<TextContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<TextContent>>(`/contents/${contentId}/text`, {
          method: 'PUT',
          body: data,
        });
      }
      // Otherwise it's a creation operation (POST)
      return apiClient<ContentResponse>('/contents/text', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Text Content Updated",
          description: "The text content was successfully updated.",
          variant: "success",
        });
      } else {
        // Show success toast for creation
        toast({
          title: "Text Content Created",
          description: "New text content was successfully created.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: variables?.contentId ? "Update Failed" : "Creation Failed",
        description: error.message || "Failed to save text content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update image content
 */
export function useImageContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<ImageContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<ImageContent>>(`/contents/${contentId}/image`, {
          method: 'PUT',
          body: data,
        });
      }
      // Otherwise it's a creation operation (POST)
      return apiClient<ContentResponse>('/contents/image', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Image Content Updated",
          description: "The image content was successfully updated.",
          variant: "success",
        });
      } else {
        // Show success toast for creation
        toast({
          title: "Image Content Created",
          description: "New image content was successfully created.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: variables?.contentId ? "Update Failed" : "Creation Failed",
        description: error.message || "Failed to save image content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update video content
 */
export function useVideoContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<VideoContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<VideoContent>>(`/contents/${contentId}/video`, {
          method: 'PUT',
          body: data,
        });
      }
      // Otherwise it's a creation operation (POST)
      return apiClient<ContentResponse>('/contents/video', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Video Content Updated",
          description: "The video content was successfully updated.",
          variant: "success",
        });
      } else {
        // Show success toast for creation
        toast({
          title: "Video Content Created",
          description: "New video content was successfully created.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: variables?.contentId ? "Update Failed" : "Creation Failed",
        description: error.message || "Failed to save video content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update audio content
 */
export function useAudioContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<AudioContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<AudioContent>>(`/contents/${contentId}/audio`, {
          method: 'PUT',
          body: data,
        });
      }
      // Otherwise it's a creation operation (POST)
      return apiClient<ContentResponse>('/contents/audio', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Audio Content Updated",
          description: "The audio content was successfully updated.",
          variant: "success",
        });
      } else {
        // Show success toast for creation
        toast({
          title: "Audio Content Created",
          description: "New audio content was successfully created.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: variables?.contentId ? "Update Failed" : "Creation Failed",
        description: error.message || "Failed to save audio content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update document content
 */
export function useDocumentContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<DocumentContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<DocumentContent>>(`/contents/${contentId}/document`, {
          method: 'PUT',
          body: data,
        });
      }
      // Otherwise it's a creation operation (POST)
      return apiClient<ContentResponse>('/contents/document', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Document Content Updated",
          description: "The document content was successfully updated.",
          variant: "success",
        });
      } else {
        // Show success toast for creation
        toast({
          title: "Document Content Created",
          description: "New document content was successfully created.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: variables?.contentId ? "Update Failed" : "Creation Failed",
        description: error.message || "Failed to save document content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update quiz content
 */
export function useQuizContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<QuizContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<QuizContent>>(`/contents/${contentId}/quiz`, {
          method: 'PUT',
          body: data,
        });
      }
      // For creating new quiz content
      return apiClient<ContentResponse>('/contents/quiz', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Quiz Content Updated",
          description: "The quiz content was successfully updated.",
          variant: "success",
        });
      } else {
        // Show success toast for creation
        toast({
          title: "Quiz Content Created",
          description: "New quiz content was successfully created.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: variables?.contentId ? "Update Failed" : "Creation Failed",
        description: error.message || "Failed to save quiz content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update reflection content
 */
export function useReflectionContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<ReflectionContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<ReflectionContent>>(`/contents/${contentId}/reflection`, {
          method: 'PUT',
          body: data,
        });
      }
      // No POST endpoint for reflection content yet, would need to be implemented
      throw new Error('Direct creation of reflection content is not implemented yet');
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Reflection Content Updated",
          description: "The reflection content was successfully updated.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Update Failed",
        description: error.message || "Failed to save reflection content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to create or update template content
 */
export function useTemplateContent() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { contentId?: string; data: Partial<TemplateContent> & Partial<CreateContentDto> }>({
    mutationFn: ({ contentId, data }) => {
      // If contentId is provided, it's an update operation (PUT)
      if (contentId) {
        return apiClient<ApiResponse<TemplateContent>>(`/contents/${contentId}/template`, {
          method: 'PUT',
          body: data,
        });
      }
      // No POST endpoint for template content yet, would need to be implemented
      throw new Error('Direct creation of template content is not implemented yet');
    },
    onSuccess: (_, variables) => {
      if (variables.contentId) {
        queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
        
        // Show success toast for update
        toast({
          title: "Template Content Updated",
          description: "The template content was successfully updated.",
          variant: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Update Failed",
        description: error.message || "Failed to save template content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to fetch draft contents for the current user
 */
export function useUserDraftContents(userId?: string, organizationId?: string) {
  return useQuery({
    queryKey: ['contents', 'drafts', userId, organizationId],
    queryFn: () => {
      const params: Record<string, string> = {
        status: ContentStatus.DRAFT,
      };
      
      if (userId) {
        params.createdById = userId;
      }
      
      if (organizationId) {
        params.organizationId = organizationId;
      }

      return apiClient<ContentListResponse>('/contents', {
        method: 'GET',
        params,
      });
    },
    enabled: !!(userId || organizationId),
  });
}

/**
 * Hook to create content with media in a single request
 * This combines content creation with media attachment
 */
export function useCreateContentWithMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ContentMediaCreateRequest) =>
      apiClient<ContentResponse>('/contents/with-media', {
        method: 'POST',
        body: request,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      
      // Show success toast
      toast({
        title: "Content Created",
        description: "Content with media was successfully created",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create content with media",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to attach media to existing content
 */
export function useAttachMediaToContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      contentId, 
      mediaAssetId,
      metadata 
    }: { 
      contentId: string; 
      mediaAssetId: string;
      metadata?: {
        altText?: string;
        caption?: string;
        transcript?: string;
        description?: string;
      }
    }) =>
      apiClient<ContentResponse>(`/contents/${contentId}/media/${mediaAssetId}`, {
        method: 'PUT',
        body: metadata || {},
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
      queryClient.invalidateQueries({ queryKey: ['mediaAssets', variables.mediaAssetId, 'usage'] });
      
      // Show success toast
      toast({
        title: "Media Attached",
        description: "Media was successfully attached to content",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Media Attachment Failed",
        description: error instanceof Error ? error.message : "Failed to attach media to content",
        variant: "error",
      });
    }
  });
}

/**
 * Hook to detach media from content
 */
export function useDetachMediaFromContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, mediaAssetId }: { contentId: string; mediaAssetId: string }) =>
      apiClient<ContentResponse>(`/contents/${contentId}/media/${mediaAssetId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents', variables.contentId] });
      queryClient.invalidateQueries({ queryKey: ['mediaAssets', variables.mediaAssetId, 'usage'] });
      
      // Show success toast
      toast({
        title: "Media Detached",
        description: "Media was successfully detached from content",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Media Detachment Failed",
        description: error instanceof Error ? error.message : "Failed to detach media from content",
        variant: "error",
      });
    }
  });
}

/**
 * Helper function to get default data structure for type-specific content
 * @param contentType The type of content
 * @returns A default data object for the content type
 */
export function getDefaultContentData(contentType: ContentType): any {
  switch (contentType) {
    case ContentType.TEXT:
      return { text: '' };
    case ContentType.IMAGE:
      return { 
        mediaAssetId: '',
        altText: '',
        caption: '' 
      };
    case ContentType.VIDEO:
      return { 
        mediaAssetId: '',
        caption: '',
        transcript: '' 
      };
    case ContentType.AUDIO:
      return { 
        mediaAssetId: '',
        caption: '',
        transcript: '' 
      };
    case ContentType.DOCUMENT:
      return { 
        mediaAssetId: '',
        description: '' 
      };
    case ContentType.QUIZ:
      return { 
        questions: [],
        scoringType: 'standard',
        timeLimit: null 
      };
    case ContentType.REFLECTION:
      return { 
        promptText: '',
        guidanceText: '' 
      };
    case ContentType.TEMPLATE:
      return { 
        templateText: '',
        variables: [],
        channel: 'whatsapp' 
      };
    default:
      return {};
  }
}

/**
 * Hook to create content - provides a general create method for all content types
 */
export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: any) =>
      apiClient<ContentResponse>('/contents', {
        method: 'POST',
        body: request,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      
      // Show success toast
      toast({
        title: "Content Created",
        description: "New content was successfully created",
        variant: "success",
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create content",
        variant: "error",
      });
    }
  });
} 