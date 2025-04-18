import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import prisma from '../prisma';

// Extended Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        organizationId?: string;
        role: string;
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
 * Authentication middleware to verify the user is authenticated
 * In a real app, this would verify JWT tokens or session cookies
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For this example, we're using the x-user-id header
    // In a real app, you would extract the user ID from a JWT token or session
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return next(new AppError('Authentication required', 401));
    }
    
    // Find the user and include their organization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // If user has an organization, fetch their role details to get permissions
    let permissions: string[] = [];
    if (user.organizationId && user.role) {
      const role = await prisma.role.findFirst({
        where: {
          organizationId: user.organizationId,
          name: user.role,
        },
      });
      
      if (role) {
        // Parse permissions from JSON
        permissions = role.permissions as string[];
      }
    }
    
    // Add user and organization to the request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      organizationId: user.organizationId || undefined,
      role: user.role,
      permissions,
    };
    
    if (user.organization) {
      req.organization = {
        id: user.organization.id,
        name: user.organization.name,
        type: user.organization.type,
        subscriptionTier: user.organization.subscriptionTier,
      };
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware to check if the user has the required permissions
 * @param requiredPermissions - Array of permissions required for the route
 */
export const authorize = (requiredPermissions: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists on the request
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }
      
      // If no specific permissions required, allow access
      if (requiredPermissions.length === 0) {
        return next();
      }
      
      // Check if the user has the platform_admin role
      if (req.user.role === 'platform_admin') {
        return next(); // Platform admins have access to everything
      }
      
      // Check if the user has all the required permissions
      const hasAllPermissions = requiredPermissions.every(permission => 
        req.user!.permissions.includes(permission)
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
 * Middleware to check if the user has the org_admin role
 */
export const requireOrgAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user exists on the request
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    // Check if the user has the org_admin role
    if (req.user.role !== 'org_admin' && req.user.role !== 'platform_admin') {
      return next(new AppError('Only organization administrators can perform this action', 403));
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access based on organization type
 * @param allowedTypes - Array of organization types allowed
 */
export const restrictToOrgType = (allowedTypes: ('client' | 'expert')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if organization exists on the request
      if (!req.organization) {
        return next(new AppError('Organization information required', 400));
      }
      
      // Check if the organization type is allowed
      if (!allowedTypes.includes(req.organization.type)) {
        return next(new AppError('This action is not available for your organization type', 403));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}; 