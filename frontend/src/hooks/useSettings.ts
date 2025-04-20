'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserSettings,
  updateUserSettings,
  getAppSettings,
  updateAppSettings,
  type UserSettings,
  type UpdateUserSettingsData,
  type AppSettings,
} from '@/lib/api/endpoints/settings'
import { useAuthState } from './useAuth'

// Hook to get user settings
export const useUserSettings = () => {
  return useQuery({
    queryKey: ['settings', 'user'],
    queryFn: getUserSettings,
  })
}

// Hook to update user settings
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateUserSettingsData) => updateUserSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'user'] })
    },
  })
}

// Hook to get app settings (admin only)
export const useAppSettings = () => {
  const { user } = useAuthState()
  const isAdmin = user?.role === 'admin'
  
  return useQuery({
    queryKey: ['settings', 'app'],
    queryFn: getAppSettings,
    enabled: isAdmin, // Only fetch if user is admin
  })
}

// Hook to update app settings (admin only)
export const useUpdateAppSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<AppSettings>) => updateAppSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'app'] })
    },
  })
} 