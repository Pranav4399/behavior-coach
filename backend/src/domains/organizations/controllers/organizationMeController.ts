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
    console.log('req.user', req.user);
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