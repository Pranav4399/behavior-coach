import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { Organization, OrganizationType } from '../models/Organization';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import type { PrismaClient } from '@prisma/client';

/**
 * Get all organizations
 */
export const findAll = async (): Promise<Organization[]> => {
  const organizations = await prisma.organization.findMany();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return organizations.map((org: any) => new Organization(org));
};

/**
 * Find organization by ID
 */
export const findById = async (id: string): Promise<Organization> => {
  console.log('id', id);
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      roles: true,
      users: true,
    },
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Organization(organization as any);
};

/**
 * Create new organization
 */
export const create = async (data: {
  name: string;
  type: OrganizationType;
  subscriptionTier: string;
  logoUrl?: string;
  customTerminology?: Record<string, string>;
  settings?: Record<string, any>;
}): Promise<Organization> => {
  // Create a temporary Organization instance to validate
  const tempOrg = new Organization({
    id: 'temp',
    name: data.name,
    type: data.type,
    subscriptionTier: data.subscriptionTier,
    logoUrl: data.logoUrl,
    customTerminology: data.customTerminology,
    settings: data.settings,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Validate before attempting to save
  tempOrg.validate();
  
  // Create the organization
  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      type: data.type,
      subscriptionTier: data.subscriptionTier,
      logoUrl: data.logoUrl,
      customTerminology: data.customTerminology || {},
      settings: data.settings || {},
    },
  });
  
  return new Organization(organization);
};

/**
 * Update organization
 */
export const update = async (
  id: string,
  data: {
    name?: string;
    type?: OrganizationType;
    subscriptionTier?: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
    settings?: Record<string, any>;
  }
): Promise<Organization> => {
  // Check if organization exists
  const existingOrg = await findById(id);
  
  // Update the organization instance and validate
  existingOrg.update(data);
  
  // Save to database
  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data,
  });
  
  return new Organization(updatedOrganization);
};

/**
 * Delete organization and related data
 */
export const remove = async (id: string): Promise<void> => {
  // Check if organization exists
  await findById(id);
  
  // Delete the organization and related data in a transaction
  await prisma.$transaction([
    // Delete roles
    prisma.role.deleteMany({
      where: { organizationId: id },
    }),
    // Delete users
    prisma.user.deleteMany({
      where: { organizationId: id },
    }),
    // Delete organization
    prisma.organization.delete({
      where: { id },
    }),
  ]);
};

/**
 * Create organization with default roles in transaction
 */
export const createWithRoles = async (
  data: {
    name: string;
    type: OrganizationType;
    subscriptionTier: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
    settings?: Record<string, any>;
  },
  createDefaultRolesFn: (orgId: string, type: OrganizationType) => Promise<any[]>
): Promise<{ organization: Organization; roles: any[] }> => {
  // Validate the organization data
  const tempOrg = new Organization({
    id: 'temp',
    name: data.name,
    type: data.type,
    subscriptionTier: data.subscriptionTier,
    logoUrl: data.logoUrl,
    customTerminology: data.customTerminology,
    settings: data.settings,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  tempOrg.validate();
  
  // Create the organization first
  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      type: data.type,
      subscriptionTier: data.subscriptionTier,
      logoUrl: data.logoUrl,
      customTerminology: data.customTerminology || {},
      settings: data.settings || {},
    },
  });
  
  try {
    // Now create the roles for the organization after it exists
    const roles = await createDefaultRolesFn(organization.id, data.type);
    
    return { 
      organization: new Organization(organization), 
      roles 
    };
  } catch (error) {
    // If role creation fails, clean up by deleting the organization
    await prisma.organization.delete({
      where: { id: organization.id }
    });
    throw error;
  }
};

/**
 * List organizations with pagination and filters
 */
export const findWithFilters = async (
  page = 1,
  limit = 10,
  filters: {
    type?: OrganizationType;
    search?: string;
  } = {}
) => {
  const skip = (page - 1) * limit;
  
  // Build filters
  const where: any = {};
  
  if (filters.type) {
    where.type = filters.type;
  }
  
  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }
  
  // Get count of matching organizations
  const totalCount = await prisma.organization.count({ where });
  
  // Get paginated results
  const organizations = await prisma.organization.findMany({
    where,
    skip,
    take: limit,
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: organizations.map((org: any) => new Organization(org)),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
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