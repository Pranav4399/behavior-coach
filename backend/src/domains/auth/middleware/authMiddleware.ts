import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import { verifyToken } from '../utils/jwt';
import { AuthService } from '../services/authService';
import prisma from '../../../../prisma/prisma';
import { IS_PLATFORM_ADMIN } from '../../../config/permissions';

const authService = new AuthService();

// Extended Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        organizationId?: string;
        roleId: string | null;
        permissions: string[];
      };
      organization?: {
        id: string;
        name: string;
        type: 'client' | 'expert';
        subscriptionTier: string;
      };
    }
  }
}

/**
 * JWT Authentication middleware - verifies the JWT token and attaches user to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // Verify token
    const decoded = verifyToken(token);

    try {
      // Get user with organization
      const { user, organization } = await authService.getUserWithOrganization(decoded.id);

      // Get user permissions
      const permissions = await authService.getUserPermissions(decoded.id);

      // Add user to request
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        organizationId: user.organizationId || undefined,
        roleId: user.roleId,
        permissions,
      };

      // Add organization if user has one
      if (organization) {
        req.organization = {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          subscriptionTier: organization.subscriptionTier,
        };
      }

      next();
    } catch (error) {
      return next(new AppError('User not found or no longer exists.', 401));
    }
  } catch (error) {
    return next(new AppError('Invalid authentication token. Please log in again.', 401));
  }
};

/**
 * Authorization middleware to check if the user has the required permissions
 * @param requiredPermissions - Array of permissions required for the route
 */
export const authorize = (requiredPermissions: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists on the request
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }
      
      // If no specific permissions required, allow access
      if (requiredPermissions.length === 0) {
        return next();
      }

      const permissions = await authService.getUserPermissions(req.user!.id);
      // Check if the user has all required permissions
      const hasAllPermissions = requiredPermissions.every(permission => 
        permissions.includes(permission)
      );
      
      if (!hasAllPermissions) {
        return next(new AppError('You do not have permission to perform this action', 403));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to restrict access to specific organization types
 * @param allowedTypes - Array of organization types allowed for the route
 */
export const restrictToOrgType = (allowedTypes: ('client' | 'expert')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists on the request
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }
      
      // Check if the user has an organization
      if (!req.organization) {
        return next(new AppError('You are not a member of any organization', 403));
      }
      
      // Check if the user's organization type is allowed
      if (!allowedTypes.includes(req.organization.type)) {
        return next(new AppError(`This action is only available to ${allowedTypes.join(' or ')} organizations`, 403));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to restrict org admins to only access/modify resources in their own organization
 * This ensures org admins cannot edit users or organizations outside their scope
 */
export const restrictToSameOrganization = (resourceId: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists on the request
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }
      
      const permissions = await authService.getUserPermissions(req.user!.id);
      // Allow platform admins to bypass organization restriction
      if (permissions.includes(IS_PLATFORM_ADMIN)) {
        return next();
      }
      
      // Check if the user has an organization
      if (!req.user.organizationId) {
        return next(new AppError('You are not a member of any organization', 403));
      }
      
      // For body data with organizationId, check if it matches the user's org
      if (req.body && req.body.organizationId && 
          req.body.organizationId !== req.user.organizationId) {
        return next(new AppError('You can only modify resources within your organization', 403));
      }
      
      // For url params with resourceId, extract the resource and check its org
      if (req.params && req.params[resourceId]) {
        const resourceOrgId = await getResourceOrganizationId(req.params[resourceId], resourceId);
        
        if (resourceOrgId && resourceOrgId !== req.user.organizationId) {
          return next(new AppError('You can only access resources within your organization', 403));
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper function to get the organization ID for a resource
 */
async function getResourceOrganizationId(id: string, resourceType: string): Promise<string | null> {
  try {
    if (resourceType === 'userId') {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { organizationId: true }
      });
      return user?.organizationId || null;
    } else if (resourceType === 'organizationId') {
      return id; // The ID itself is the organization ID
    }
    // Add more resource types as needed
    return null;
  } catch (error) {
    return null;
  }
} 