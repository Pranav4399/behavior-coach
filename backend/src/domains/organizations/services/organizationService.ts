import { AppError } from '../../../common/middleware/errorHandler';
import { createDefaultRoles } from '../../user/services/roleService';
import * as organizationRepository from '../repositories/organizationRepository';
import { OrganizationType } from '../models/Organization';

interface CreateOrganizationData {
  name: string;
  type: OrganizationType;
  subscriptionTier: string;
  logoUrl?: string;
  customTerminology?: Record<string, string>;
  settings?: Record<string, any>;
}

/**
 * Get all organizations
 */
export const getAllOrganizations = async () => {
  try {
    return await organizationRepository.findAll();
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific organization by ID
 */
export const getOrganizationById = async (id: string) => {
  try {
    return await organizationRepository.findById(id);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new organization with default roles
 */
export const createOrganization = async (data: CreateOrganizationData) => {
  try {
    return await organizationRepository.createWithRoles(data, createDefaultRoles);
  } catch (error) {
    throw error;
  }
};

/**
 * List all organizations with pagination and filters
 */
export const listOrganizations = async (
  page = 1,
  limit = 10,
  filters: {
    type?: OrganizationType;
    search?: string;
  } = {}
) => {
  try {
    return await organizationRepository.findWithFilters(page, limit, filters);
  } catch (error) {
    throw error;
  }
};

/**
 * Update an organization
 */
export const updateOrganization = async (
  id: string,
  data: {
    name?: string;
    type?: OrganizationType;
    subscriptionTier?: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
    settings?: Record<string, any>;
  }
) => {
  try {
    return await organizationRepository.update(id, data);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an organization (for admin use only)
 */
export const deleteOrganization = async (id: string) => {
  try {
    await organizationRepository.remove(id);
  } catch (error) {
    throw error;
  }
};

/**
 * Approve an expert organization (for admin use only)
 */
export const approveExpertOrganization = async (id: string) => {
  try {
    const organization = await organizationRepository.findById(id);
    
    if (organization.type !== 'expert') {
      throw new AppError('Only expert organizations can be approved', 400);
    }
    
    // This is a placeholder - you might want to update a status field in your actual implementation
    return await organizationRepository.update(id, {
      settings: {
        ...organization.settings,
        approved: true,
        approvedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
}; 