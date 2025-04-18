import { AppError } from '../middleware/errorHandler';
import { ALL_PERMISSIONS } from '../config/permissions';
import prisma from '../prisma';

// Define resource type for permissions matrix
interface PermissionResource {
  name: string;
  actions: string[];
  description: string;
}

/**
 * Get the current user's organization
 * Note: This is a placeholder. In a real app with authentication,
 * we would get the organizationId from the authenticated user.
 */
export const getCurrentUserOrganization = async (userId: string) => {
  try {
    // Fetch the user to get their organization ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true }
    });
    
    if (!user || !user.organizationId) {
      throw new AppError('User does not belong to any organization', 404);
    }
    
    // Fetch the organization with details
    const organization = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      include: { 
        users: true,
        roles: true
      }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    return organization;
  } catch (error) {
    throw error;
  }
};

/**
 * Update the current user's organization
 */
export const updateCurrentUserOrganization = async (
  userId: string,
  data: {
    name?: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
  }
) => {
  try {
    // Fetch the user to get their organization ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true }
    });
    
    if (!user || !user.organizationId) {
      throw new AppError('User does not belong to any organization', 404);
    }
    
    // Prepare update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.logoUrl) updateData.logoUrl = data.logoUrl;
    if (data.customTerminology) updateData.customTerminology = data.customTerminology;
    
    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: user.organizationId },
      data: updateData
    });
    
    return updatedOrganization;
  } catch (error) {
    throw error;
  }
};

/**
 * Get organization settings
 */
export const getOrganizationSettings = async (organizationId: string) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
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
  } catch (error) {
    throw error;
  }
};

/**
 * Update organization settings
 */
export const updateOrganizationSettings = async (
  organizationId: string,
  settings: Record<string, any>
) => {
  try {
    // Get the organization to check its type
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
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
      where: { id: organizationId },
      data: { settings: updatedSettings }
    });
    
    return {
      settings: updatedOrganization.settings,
      organizationType: organization.type
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get organization roles
 */
export const getOrganizationRoles = async (organizationId: string) => {
  try {
    // Get the organization type first
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { type: true }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    // Fetch roles for this organization
    const roles = await prisma.role.findMany({
      where: { organizationId }
    });
    
    return {
      roles,
      organizationType: organization.type
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new organization role
 */
export const createOrganizationRole = async (
  organizationId: string,
  data: {
    name: string;
    displayName: string;
    permissions: string[];
  }
) => {
  try {
    // Get the organization type first
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
    
    // Check if role with same name already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        organizationId,
        name: data.name
      }
    });
    
    if (existingRole) {
      throw new AppError(`A role with name '${data.name}' already exists`, 400);
    }
    
    // Create the new role
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
  } catch (error) {
    throw error;
  }
};

/**
 * Update an organization role
 */
export const updateOrganizationRole = async (
  organizationId: string,
  roleId: string,
  data: {
    name?: string;
    displayName?: string;
    permissions?: string[];
  }
) => {
  try {
    // Get the organization type
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { type: true }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
    
    // Check if role belongs to organization
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      select: { organizationId: true, name: true }
    });
    
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    
    if (role.organizationId !== organizationId) {
      throw new AppError('Role does not belong to this organization', 403);
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
    if (data.name) {
      const existingRole = await prisma.role.findFirst({
        where: {
          organizationId,
          name: data.name,
          id: { not: roleId } // Exclude current role
        }
      });
      
      if (existingRole) {
        throw new AppError(`A role with name '${data.name}' already exists`, 400);
      }
    }
    
    // Update the role
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data
    });
    
    return updatedRole;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an organization role
 */
export const deleteOrganizationRole = async (
  organizationId: string,
  roleId: string
) => {
  try {
    // Check if role belongs to organization
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      select: { organizationId: true, name: true }
    });
    
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    
    if (role.organizationId !== organizationId) {
      throw new AppError('Role does not belong to this organization', 403);
    }
    
    // Prevent deletion of built-in roles
    const builtInRoles = ['org_admin', 'program_manager', 'training_manager', 'content_specialist', 'publisher'];
    if (builtInRoles.includes(role.name)) {
      throw new AppError(`Cannot delete the built-in '${role.name}' role`, 400);
    }
    
    // Check if any users are currently using this role
    const usersWithRole = await prisma.user.count({
      where: {
        organizationId,
        role: role.name
      }
    });
    
    if (usersWithRole > 0) {
      throw new AppError(`Cannot delete role '${role.name}' because it is assigned to ${usersWithRole} user(s)`, 400);
    }
    
    // Delete the role
    await prisma.role.delete({
      where: { id: roleId }
    });
    
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Get organization permissions matrix
 * Returns available permissions based on organization type
 */
export const getOrganizationPermissions = async (organizationId: string) => {
  try {
    // Get the organization type
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { type: true }
    });
    
    if (!organization) {
      throw new AppError('Organization not found', 404);
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
      organizationType: organization.type
    };
  } catch (error) {
    throw error;
  }
}; 