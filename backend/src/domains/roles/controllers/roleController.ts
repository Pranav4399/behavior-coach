import { Request, Response, NextFunction } from 'express';
import * as roleService from '../services/roleService';
import { AppError } from '../../../common/middleware/errorHandler';

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
    const user = req.user as { organizationId: string };
    if (!user || !user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roles = await roleService.getRoles(user.organizationId);
    
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
 * Get a specific role by ID
 * @route GET /api/roles/:id
 */
export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { organizationId: string };
    if (!user || !user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    const role = await roleService.getRole(roleId, user.organizationId);
    
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
    const user = req.user as { organizationId: string };
    if (!user || !user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const { name, displayName, permissions, description, isDefault } = req.body;
    
    const newRole = await roleService.createRole(user.organizationId, {
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
    const user = req.user as { organizationId: string };
    if (!user || !user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    const { name, displayName, permissions, description, isDefault } = req.body;
    
    const updatedRole = await roleService.updateRole(
      roleId,
      user.organizationId,
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
    const user = req.user as { organizationId: string };
    if (!user || !user.organizationId) {
      throw new AppError('Unauthorized: Missing organization ID', 401);
    }
    
    const roleId = req.params.id;
    
    await roleService.deleteRole(roleId, user.organizationId);
    
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
    // Check if user is platform admin
    if (req.user?.role !== 'platform_admin') {
      throw new AppError('Unauthorized: Only platform admins can access this resource', 403);
    }
    
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