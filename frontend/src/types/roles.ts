export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  organizationId: string;
  organizationName?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  displayName?: string;
  description?: string;
  permissions?: string[];
}

export interface RolesResponse {
  roles: Role[];
}

export interface RoleResponse {
  role: Role;
} 