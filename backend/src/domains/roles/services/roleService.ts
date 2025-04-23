import { AppError } from '../../../common/middleware/errorHandler';
import * as roleRepository from '../repositories/roleRepository';

interface CreateRoleData {
  name: string;
  displayName: string;
  permissions: string[];
  description?: string;
  isDefault?: boolean;
}

interface UpdateRoleData {
  name?: string;
  displayName?: string;
  permissions?: string[];
  description?: string;
  isDefault?: boolean;
}

/**
 * Get all roles for an organization
 */
export const getRoles = async (organizationId: string) => {
  try {
    return await roleRepository.findAllByOrganization(organizationId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific role by ID
 */
export const getRole = async (id: string, organizationId: string) => {
  try {
    return await roleRepository.findById(id, organizationId);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new role
 */
export const createRole = async (organizationId: string, data: CreateRoleData) => {
  try {
    // Format the data for repository
    const roleData = {
      ...data,
      organizationId
    };
    
    return await roleRepository.create(roleData);
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing role
 */
export const updateRole = async (id: string, organizationId: string, data: UpdateRoleData) => {
  try {
    // Ensure the role exists
    const role = await roleRepository.findById(id, organizationId);
    
    if (role.isDefault) {
      // Check if trying to modify permissions of a default role
      if (data.permissions && JSON.stringify(data.permissions) !== JSON.stringify(role.permissions)) {
        throw new AppError('Cannot modify permissions of default roles', 400);
      }
    }
    
    return await roleRepository.update(id, organizationId, data);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a role
 */
export const deleteRole = async (id: string, organizationId: string) => {
  try {
    // Ensure the role exists
    const role = await roleRepository.findById(id, organizationId);
    
    if (role.isDefault) {
      throw new AppError('Cannot delete default roles', 400);
    }
    
    // Repository will throw an error if the role is assigned to users
    await roleRepository.remove(id, organizationId);
  } catch (error) {
    // Pass through specific AppErrors
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to delete role: ${(error as Error).message}`, 500);
  }
};

/**
 * Get all roles across all organizations (platform admin only)
 */
export const getAllRolesAdmin = async () => {
  try {
    return await roleRepository.findAll();
  } catch (error) {
    throw error;
  }
}; 