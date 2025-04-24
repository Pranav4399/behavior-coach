import { Request, Response, NextFunction } from 'express';
import * as roleService from '../services/roleService';
import * as roleRepository from '../repositories/roleRepository';
import { AppError } from '../../../common/middleware/errorHandler';
import { IS_PLATFORM_ADMIN } from '../../../config/permissions';

/**
 * Get all roles for the current organization
 * @route GET /api/roles
 */
export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId: userOrgId } = req.user as { organizationId: string };
    const targetOrgId = (req.query.organizationId as string) ?? userOrgId;

    if (!targetOrgId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }

    const roles = await roleService.getRoles(targetOrgId);

    res.status(200).json({
      status: 'success',
      data: { roles },
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Get a specific role by ID
 * @route GET /api/roles/:id
 */
export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { organizationId: string; permissions: string[] };
    const isPlatformAdmin = user.permissions?.includes(IS_PLATFORM_ADMIN);
    
    // Use organizationId from query params if platform admin, otherwise use user's organization
    let targetOrgId = user.organizationId;
    
    if (isPlatformAdmin && req.query.organizationId) {
      targetOrgId = req.query.organizationId as string;
    } else if (!user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    const role = await roleService.getRole(roleId, targetOrgId);
    
    res.status(200).json({
      status: 'success',
      data: {
        role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new role
 * @route POST /api/roles
 */
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { organizationId: string; permissions: string[] };
    const isPlatformAdmin = user.permissions.includes(IS_PLATFORM_ADMIN);
    
    // Use organizationId from request body if platform admin, otherwise use user's organization
    let targetOrgId = user.organizationId;
    
    if (isPlatformAdmin && req.body.organizationId) {
      targetOrgId = req.body.organizationId;
    } else if (!user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const { name, displayName, permissions, description, isDefault } = req.body;
    
    const newRole = await roleService.createRole(targetOrgId, {
      name,
      displayName,
      permissions,
      description,
      isDefault
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        role: newRole
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a role
 * @route PATCH /api/roles/:id
 */
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { organizationId: string; permissions: string[] };
    const isPlatformAdmin = user.permissions.includes(IS_PLATFORM_ADMIN);
    
    // Use organizationId from request body if platform admin, otherwise use user's organization
    let targetOrgId = user.organizationId;
    
    if (isPlatformAdmin && req.body.organizationId) {
      targetOrgId = req.body.organizationId;
      // Check if organizationId is changing
      const roleId = req.params.id;
      const role = await roleService.getRole(roleId, targetOrgId);
      
      if (req.body.organizationId !== role.organizationId) {
        // Check if role has associated users before changing organizationId
        const hasUsers = await roleRepository.hasAssociatedUsers(roleId);
        if (hasUsers) {
          throw new AppError('Cannot change organization for a role that has associated users', 400);
        }
      }
      
    } else if (!user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    const { name, displayName, permissions, description, isDefault } = req.body;
    
    const updatedRole = await roleService.updateRole(
      roleId,
      targetOrgId,
      { 
        name, 
        displayName, 
        permissions,
        description,
        isDefault
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        role: updatedRole
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a role
 * @route DELETE /api/roles/:id
 */
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { organizationId: string; permissions: string[] };
    const isPlatformAdmin = user.permissions.includes(IS_PLATFORM_ADMIN);
    
    // Use organizationId from query params if platform admin, otherwise use user's organization
    let targetOrgId = user.organizationId;
    
    if (isPlatformAdmin && req.query.organizationId) {
      targetOrgId = req.query.organizationId as string;
    } else if (!user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    
    // Check if role has associated users
    const hasUsers = await roleRepository.hasAssociatedUsers(roleId);
    if (hasUsers) {
      throw new AppError('Cannot delete a role that has associated users', 400);
    }
    
    await roleService.deleteRole(roleId, targetOrgId);
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    // Handle specific role deletion errors with appropriate HTTP status codes
    if (error instanceof AppError) {
      // The error already has status code and message
      next(error);
    } else {
      next(new AppError(`Failed to delete role: ${(error as Error).message}`, 500));
    }
  }
};

/**
 * Get all roles across all organizations (platform admin only)
 * @route GET /api/roles/admin/all
 */
export const getAllRolesAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const roles = await roleService.getAllRolesAdmin();
    
    res.status(200).json({
      status: 'success',
      data: {
        roles
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if a role has associated users
 * @route GET /api/roles/:id/has-users
 */
export const checkRoleHasUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { organizationId: string; permissions: string[] };
    const isPlatformAdmin = user.permissions.includes(IS_PLATFORM_ADMIN);
    
    // Use organizationId from query params if org admin, otherwise use user's organization
    let targetOrgId = user.organizationId;
    
    if (isPlatformAdmin && req.query.organizationId) {
      targetOrgId = req.query.organizationId as string;
    } else if (!user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    
    // Ensure the role exists and belongs to the target organization
    await roleService.getRole(roleId, targetOrgId);
    
    // Check if the role has associated users
    const hasUsers = await roleRepository.hasAssociatedUsers(roleId);
    
    res.status(200).json({
      status: 'success',
      data: {
        hasUsers
      }
    });
  } catch (error) {
    next(error);
  }
}; 