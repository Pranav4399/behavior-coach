/**
 * User interfaces aligned with backend schemas
 */

export interface User {
  id: string;
  email: string;
  name?: string | null;
  roleDisplayName?: string;
  roleId?: string | null;
  organizationName?: string | null;
  organizationId?: string | null;
  status?: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  avatarUrl?: string;
  preferences?: Record<string, any> | null;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponse {
  user: User;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: "active" | "inactive" | "pending";
  page?: number;
  limit?: number;
  organizationId?: string;
}

export interface InviteUserData {
  email: string;
  name?: string;
  roleId: string;
  organizationId?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  role?: string;
  status?: "active" | "inactive" | "pending";
  preferences?: Record<string, any>;
  organizationId?: string;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  timezone?: string;
  dateFormat?: string;
  customSettings?: Record<string, any>;
}
