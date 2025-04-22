import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { Organization } from '../models/Organization';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import * as organizationRepository from './organizationRepository';

/**
 * Find organization by user ID
 */
export const findByUserId = async (userId: string): Promise<Organization> => {
  console.log('userId', userId);
  // Fetch the user to get their organization ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true }
  });
  
  if (!user || !user.organizationId) {
    throw new AppError('User does not belong to any organization', 404);
  }
  
  // Fetch the organization with details
  return await organizationRepository.findById(user.organizationId);
};

/**
 * Get organization settings
 */
export const getSettings = async (id: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: { 
      settings: true,
      customTerminology: true,
      type: true
    }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Include organization type in the settings response
  return {
    settings: organization.settings || {},
    customTerminology: organization.customTerminology || {},
    organizationType: organization.type
  };
};

/**
 * Update organization settings
 */
export const updateSettings = async (
  id: string,
  settings: Record<string, any>
): Promise<{ settings: any; organizationType: string }> => {
  // Get the organization to check its type
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: { 
      settings: true,
      type: true
    }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Filter settings based on organization type if needed
  let filteredSettings = { ...settings };
  
  // For example, if there are Expert-only settings
  if (organization.type === 'client') {
    // Remove expert-only settings
    const expertOnlySettings = ['marketplaceSettings', 'publisherSettings'];
    expertOnlySettings.forEach(key => {
      if (filteredSettings[key]) {
        delete filteredSettings[key];
      }
    });
  }
  
  // Merge existing settings with new settings
  const updatedSettings = {
    ...(organization.settings as object || {}),
    ...filteredSettings
  };
  
  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data: { settings: updatedSettings }
  });
  
  return {
    settings: updatedOrganization.settings,
    organizationType: organization.type
  };
};

/**
 * Get organization roles
 */
export const getRoles = async (id: string) => {
  // Get the organization type first
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: { type: true }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Fetch roles for this organization
  const roles = await prisma.role.findMany({
    where: { organizationId: id }
  });
  
  return {
    roles,
    organizationType: organization.type
  };
};

/**
 * Create organization role
 */
export const createRole = async (
  organizationId: string,
  data: {
    name: string;
    displayName: string;
    permissions: string[];
  }
) => {
  // Validate basic requirements
  if (!data.name || !data.displayName) {
    throw new AppError('Role name and display name are required', 400);
  }
  
  // Get organization type to validate permissions
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { type: true }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Validate that all permissions exist in our system
  const invalidPermissions = data.permissions.filter(
    permission => !ALL_PERMISSIONS.includes(permission)
  );
  
  if (invalidPermissions.length > 0) {
    throw new AppError(`Invalid permissions: ${invalidPermissions.join(', ')}`, 400);
  }
  
  // Filter out type-specific permissions that don't apply to this org type
  let validatedPermissions = [...data.permissions];
  
  if (organization.type === 'client') {
    // Remove expert-only permissions
    validatedPermissions = validatedPermissions.filter(permission => 
      !permission.startsWith('marketplace:')
    );
  } else if (organization.type === 'expert') {
    // Remove client-only permissions
    validatedPermissions = validatedPermissions.filter(permission => 
      !permission.startsWith('program:')
    );
  }
  
  // Check if a role with this name already exists
  const existingRole = await prisma.role.findFirst({
    where: {
      organizationId,
      name: data.name
    }
  });
  
  if (existingRole) {
    throw new AppError(`A role with the name "${data.name}" already exists`, 400);
  }
  
  // Create the role
  const newRole = await prisma.role.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      permissions: validatedPermissions,
      organization: {
        connect: { id: organizationId }
      }
    }
  });
  
  return newRole;
};

/**
 * Update organization role
 */
export const updateRole = async (
  organizationId: string,
  roleId: string,
  data: {
    name?: string;
    displayName?: string;
    permissions?: string[];
  }
) => {
  // Get the organization type
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { type: true }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Check if role belongs to organization
  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
      organizationId
    }
  });
  
  if (!role) {
    throw new AppError('Role not found or does not belong to the organization', 404);
  }
  
  // Prevent updates to built-in roles
  const builtInRoles = ['org_admin', 'program_manager', 'training_manager', 'content_specialist', 'publisher'];
  if (builtInRoles.includes(role.name) && (data.name || data.permissions)) {
    throw new AppError(`Cannot modify the name or permissions of the built-in '${role.name}' role`, 400);
  }
  
  // If updating permissions, validate them
  if (data.permissions) {
    // Validate that all permissions exist in our system
    const invalidPermissions = data.permissions.filter(
      permission => !ALL_PERMISSIONS.includes(permission)
    );
    
    if (invalidPermissions.length > 0) {
      throw new AppError(`Invalid permissions: ${invalidPermissions.join(', ')}`, 400);
    }
    
    // Filter out type-specific permissions that don't apply to this org type
    let validatedPermissions = [...data.permissions];
    
    if (organization.type === 'client') {
      // Remove expert-only permissions
      validatedPermissions = validatedPermissions.filter(permission => 
        !permission.startsWith('marketplace:')
      );
    } else if (organization.type === 'expert') {
      // Remove client-only permissions
      validatedPermissions = validatedPermissions.filter(permission => 
        !permission.startsWith('program:')
      );
    }
    
    // Update the data to use validated permissions
    data.permissions = validatedPermissions;
  }
  
  // If changing name, check for duplicates
  if (data.name && data.name !== role.name) {
    const duplicateRole = await prisma.role.findFirst({
      where: {
        organizationId,
        name: data.name,
        id: { not: roleId } // Exclude the current role
      }
    });
    
    if (duplicateRole) {
      throw new AppError(`A role with the name "${data.name}" already exists`, 400);
    }
  }
  
  // Update the role
  const updatedRole = await prisma.role.update({
    where: { id: roleId },
    data
  });
  
  return updatedRole;
};

/**
 * Delete organization role
 */
export const deleteRole = async (organizationId: string, roleId: string) => {
  // Check if the role exists and belongs to the organization
  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
      organizationId
    }
  });
  
  if (!role) {
    throw new AppError('Role not found or does not belong to the organization', 404);
  }
  
  // Prevent deletion of built-in roles
  const builtInRoles = ['org_admin', 'program_manager', 'training_manager', 'content_specialist', 'publisher'];
  if (builtInRoles.includes(role.name)) {
    throw new AppError(`Cannot delete the built-in '${role.name}' role`, 400);
  }
  
  // Check if any users are assigned this role
  const usersWithRole = await prisma.user.count({
    where: {
      organizationId,
      role: role.name
    }
  });
  
  if (usersWithRole > 0) {
    throw new AppError(`Cannot delete role. It is assigned to ${usersWithRole} user(s)`, 400);
  }
  
  // Delete the role
  await prisma.role.delete({
    where: { id: roleId }
  });
  
  return { success: true };
};

/**
 * Get all available permissions for an organization
 */
export const getPermissions = async (organizationId: string) => {
  // Get the organization type
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { type: true }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Define resource type
  interface PermissionResource {
    name: string;
    actions: string[];
    description: string;
  }
  
  // Define resources common to all organization types
  const commonResources: PermissionResource[] = [
    {
      name: 'organization',
      actions: ['view', 'edit', 'manage_settings', 'view_usage', 'view_billing', 'manage_billing', 'view_branding', 'manage_branding'],
      description: 'Organization management'
    },
    {
      name: 'user',
      actions: ['view', 'create', 'edit', 'delete', 'manage_roles'],
      description: 'User management'
    },
    {
      name: 'role',
      actions: ['view', 'create', 'edit', 'delete'],
      description: 'Role management'
    },
    {
      name: 'content',
      actions: ['view', 'create', 'edit', 'delete'],
      description: 'Content management'
    },
    {
      name: 'integration',
      actions: ['view', 'setup', 'edit', 'delete'],
      description: 'Integration management'
    },
    {
      name: 'report',
      actions: ['view', 'export', 'create'],
      description: 'Reporting tools'
    }
  ];
  
  // Define resources specific to organization types
  let typeSpecificResources: PermissionResource[] = [];
  
  if (organization.type === 'client') {
    typeSpecificResources = [
      {
        name: 'program',
        actions: ['view', 'create', 'edit', 'delete', 'assign_journeys'],
        description: 'Program management'
      },
      {
        name: 'journey',
        actions: ['view', 'create', 'edit', 'delete'],
        description: 'Journey management'
      }
    ];
  } else if (organization.type === 'expert') {
    typeSpecificResources = [
      {
        name: 'journey',
        actions: ['view', 'create', 'edit', 'delete', 'publish'],
        description: 'Journey creation and management'
      },
      {
        name: 'marketplace',
        actions: ['publish', 'manage_listings'],
        description: 'Marketplace publishing and management'
      }
    ];
  }
  
  return {
    resources: [...commonResources, ...typeSpecificResources],
    permissions: ALL_PERMISSIONS,
    organizationType: organization.type
  };
}; 