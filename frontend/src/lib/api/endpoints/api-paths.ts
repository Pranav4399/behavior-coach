/**
 * Central file for all API endpoint paths
 * Use these constants in API call functions for consistent endpoint management
 */

export const API_PATHS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    CURRENT_USER: '/auth/me',
    PASSWORD_RESET_REQUEST: '/auth/reset-password-request',
    PASSWORD_RESET: '/auth/reset-password',
  },
  
  // User endpoints
  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    INVITE: '/users/invite',
  },
  
  // Organization endpoints
  ORGANIZATIONS: {
    BASE: '/organizations',
    DETAIL: (id: string) => `/organizations/${id}`,
    CURRENT: '/organizations/me',
    SETTINGS: '/organizations/me/settings',
    ROLES: '/organizations/me/roles',
    PERMISSIONS: '/organizations/me/permissions',
  },
  
  // Settings endpoints
  SETTINGS: {
    USER: '/settings/user',
    APP: '/settings/app',
  },
} 