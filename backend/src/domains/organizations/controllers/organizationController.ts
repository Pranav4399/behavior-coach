import { Request, Response, NextFunction } from 'express';
import * as organizationService from '../services/organizationService';

/**
 * Get all organizations
 * @route GET /api/organizations
 */
export const getAllOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizations = await organizationService.getAllOrganizations();
    
    res.status(200).json({
      status: 'success',
      results: organizations.length,
      data: {
        organizations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific organization by ID
 * @route GET /api/organizations/:id
 */
export const getOrganizationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.params.id;
    const organization = await organizationService.getOrganizationById(organizationId);
    
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
 * Create a new organization
 * @route POST /api/organizations
 */
export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, subscriptionTier } = req.body;
    const newOrganization = await organizationService.createOrganization({
      name,
      type,
      subscriptionTier
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        organization: newOrganization
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an organization
 * @route PUT /api/organizations/:id
 */
export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.params.id;
    const { name, type, subscriptionTier } = req.body;
    
    const updatedOrganization = await organizationService.updateOrganization(
      organizationId,
      { name, subscriptionTier }
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
 * Delete an organization
 * @route DELETE /api/organizations/:id
 */
export const deleteOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.params.id;
    await organizationService.deleteOrganization(organizationId);
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 