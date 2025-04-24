import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { Role } from '../models/role';

/**
 * Get all roles for an organization
 */
export const findAllByOrganization = async (organizationId: string): Promise<Role[]> => {
  const roles = await prisma.role.findMany({
    where: { organizationId },
    include: {
      organization: {
        select: {
          name: true,
          type: true
        }
      }
    }
  });
  
  return roles.map((role: any) => new Role({
    ...role,
    // Add organization name for display in UI
    description: role.description || '',
    organizationName: role.organization?.name || ''
  }));
};

/**
 * Find role by ID
 */
export const findById = async (id: string, organizationId: string): Promise<Role> => {
  console.log('id', id);
  console.log('organizationId', organizationId);
  const role = await prisma.role.findFirst({
    where: { 
      id,
      organizationId 
    },
    include: {
      organization: {
        select: {
          name: true,
          type: true
        }
      }
    }
  });
  
  if (!role) {
    throw new AppError('Role not found', 404);
  }
  
  return new Role({
    ...role,
    description: role.description || '',
    organizationName: role.organization?.name || ''
  });
};

/**
 * Create new role
 */
export const create = async (data: {
  name: string;
  displayName: string;
  permissions: string[];
  organizationId: string;
  description?: string;
  isDefault?: boolean;
}): Promise<Role> => {
  // Create a temporary Role instance to validate
  const tempRole = new Role({
    id: 'temp',
    name: data.name,
    displayName: data.displayName,
    permissions: data.permissions,
    organizationId: data.organizationId,
    description: data.description,
    isDefault: data.isDefault,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Validate before attempting to save
  tempRole.validate();
  
  // Create the role
  const role = await prisma.role.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      permissions: data.permissions,
      organizationId: data.organizationId,
      description: data.description,
      isDefault: data.isDefault || false
    }
  });
  
  return new Role(role);
};

/**
 * Update role
 */
export const update = async (
  id: string,
  organizationId: string,
  data: {
    name?: string;
    displayName?: string;
    permissions?: string[];
    description?: string;
    isDefault?: boolean;
  }
): Promise<Role> => {
  // Check if role exists
  const existingRole = await findById(id, organizationId);
  
  // Update the role
  const updatedRole = await prisma.role.update({
    where: { id },
    data
  });
  
  return new Role(updatedRole);
};

/**
 * Check if a role has any associated users
 */
export const hasAssociatedUsers = async (id: string): Promise<boolean> => {
  const count = await prisma.user.count({
    where: { roleId: id }
  });
  
  return count > 0;
};

/**
 * Delete role
 */
export const remove = async (id: string, organizationId: string): Promise<void> => {
  // Check if role exists
  await findById(id, organizationId);
  
  // Check if role has associated users
  const hasUsers = await hasAssociatedUsers(id);
  if (hasUsers) {
    throw new AppError('Cannot delete role that is assigned to users', 400);
  }
  
  // Delete the role
  await prisma.role.delete({
    where: { id }
  });
};

/**
 * Get all roles from all organizations (for platform admin)
 */
export const findAll = async (): Promise<Role[]> => {
  const roles = await prisma.role.findMany({
    include: {
      organization: {
        select: {
          name: true,
          type: true
        }
      }
    }
  });
  
  return roles.map((role: any) => new Role({
    ...role,
    // Add organization name for display in UI
    description: role.description || '',
    organizationName: role.organization?.name || ''
  }));
}; 