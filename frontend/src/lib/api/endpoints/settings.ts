import { apiRequest } from '../client'
import { API_PATHS } from './api-paths'

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  preferences: {
    language: string
    timezone: string
  }
  updatedAt: string
}

export interface UpdateUserSettingsData {
  theme?: 'light' | 'dark' | 'system'
  notifications?: {
    email?: boolean
    push?: boolean
    inApp?: boolean
  }
  preferences?: {
    language?: string
    timezone?: string
  }
}

export interface AppSettings {
  securitySettings: {
    mfaRequired: boolean
    passwordPolicy: {
      minLength: number
      requireSpecialChars: boolean
      requireNumbers: boolean
      requireUppercase: boolean
    }
    sessionTimeout: number
  }
  organizationSettings: {
    maxUsersPerOrg: number
    allowPublicSharing: boolean
    defaultRole: string
  }
}

// Get current user settings
export const getUserSettings = async (): Promise<UserSettings> => {
  return apiRequest<UserSettings>({
    method: 'GET',
    url: API_PATHS.SETTINGS.USER,
  })
}

// Update user settings
export const updateUserSettings = async (data: UpdateUserSettingsData): Promise<UserSettings> => {
  return apiRequest<UserSettings>({
    method: 'PATCH',
    url: API_PATHS.SETTINGS.USER,
    data,
  })
}

// Get application settings (admin only)
export const getAppSettings = async (): Promise<AppSettings> => {
  return apiRequest<AppSettings>({
    method: 'GET',
    url: API_PATHS.SETTINGS.APP,
  })
}

// Update application settings (admin only)
export const updateAppSettings = async (data: Partial<AppSettings>): Promise<AppSettings> => {
  return apiRequest<AppSettings>({
    method: 'PATCH',
    url: API_PATHS.SETTINGS.APP,
    data,
  })
} 