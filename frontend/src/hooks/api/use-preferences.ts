import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';

// Valid theme values
export type ThemeType = 'light' | 'dark' | 'system';

// User preferences schema matching the backend
export interface UserPreferences {
  id: string;
  userId: string;
  theme: ThemeType;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  timezone: string;
  dateFormat: string;
  customSettings?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

// API response interface
export interface UserPreferencesResponse {
  preferences: UserPreferences;
}

// Update data interface for preferences
export interface UpdateUserPreferencesData {
  theme?: ThemeType;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  timezone?: string;
  dateFormat?: string;
  customSettings?: Record<string, any>;
}

// Get user preferences
export function useUserPreferences(userId: string) {
  return useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: () => apiClient<ApiResponse<UserPreferencesResponse>>(`/users/${userId}/preferences`),
    enabled: !!userId,
  });
}

// Update user preferences
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserPreferencesData }) =>
      apiClient<ApiResponse<UserPreferencesResponse>>(`/users/${userId}/preferences`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
} 