import { Request, Response, NextFunction } from 'express';
import * as organizationMeService from '../services/organizationMeService';

/**
 * Get the current user's organization
 * @route GET /api/organizations/me
 */
export const getCurrentOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await organizationMeService.getCurrentUserOrganization(req.user!.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        organization
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the current user's organization
 * @route PATCH /api/organizations/me
 */
export const updateCurrentOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, logoUrl, customTerminology } = req.body;
    
    const updatedOrganization = await organizationMeService.updateCurrentUserOrganization(
      req.user!.id,
      { name, logoUrl, customTerminology }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        organization: updatedOrganization
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization settings
 * @route GET /api/organizations/me/settings
 */
export const getSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Using the organization from the request instead of fetching it again
    const settings = await organizationMeService.getOrganizationSettings(req.organization!.id);
    
    res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update organization settings
 * @route PATCH /api/organizations/me/settings
 */
export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the settings from the request body
    const settings = req.body;
    
    // Using the organization from the request
    const updatedSettings = await organizationMeService.updateOrganizationSettings(
      req.organization!.id,
      settings
    );
    
    res.status(200).json({
      status: 'success',
      data: updatedSettings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization roles
 * @route GET /api/organizations/me/roles
 */
export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Using the organization from the request
    const rolesData = await organizationMeService.getOrganizationRoles(req.organization!.id);
    
    res.status(200).json({
      status: 'success',
      results: rolesData.roles.length,
      data: {
        roles: rolesData.roles,
        organizationType: rolesData.organizationType
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new organization role
 * @route POST /api/organizations/me/roles
 */
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, displayName, permissions } = req.body;
    
    // Using the organization from the request
    const newRole = await organizationMeService.createOrganizationRole(
      req.organization!.id,
      { name, displayName, permissions }
    );
    
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
 * Update an organization role
 * @route PATCH /api/organizations/me/roles/:roleId
 */
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.roleId;
    
    const { name, displayName, permissions } = req.body;
    
    // Using the organization from the request
    const updatedRole = await organizationMeService.updateOrganizationRole(
      req.organization!.id,
      roleId,
      { name, displayName, permissions }
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
 * Delete an organization role
 * @route DELETE /api/organizations/me/roles/:roleId
 */
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.roleId;
    
    // Using the organization from the request
    await organizationMeService.deleteOrganizationRole(req.organization!.id, roleId);
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization permissions
 * @route GET /api/organizations/me/permissions
 */
export const getPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Using the organization from the request
    const permissions = await organizationMeService.getOrganizationPermissions(req.organization!.id);
    
    res.status(200).json({
      status: 'success',
      data: permissions
    });
  } catch (error) {
    next(error);
  }
}; 