import { AppError } from '../../../common/middleware/errorHandler';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import * as organizationRepository from '../repositories/organizationRepository';
import * as organizationMeRepository from '../repositories/organizationMeRepository';

// Define resource type for permissions matrix
interface PermissionResource {
  name: string;
  actions: string[];
  description: string;
}

/**
 * Get the current user's organization
 * Note: This is a placeholder. In a real app with authentication,
 * we would get the organizationId from the authenticated user.
 */
export const getCurrentUserOrganization = async (userId: string) => {
  try {
    return await organizationMeRepository.findByUserId(userId);
  } catch (error) {
    throw error;
  }
};

/**
 * Update the current user's organization
 */
export const updateCurrentUserOrganization = async (
  userId: string,
  data: {
    name?: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
  }
) => {
  try {
    // Get the user's organization
    const organization = await organizationMeRepository.findByUserId(userId);
    
    // Update the organization
    return await organizationRepository.update(organization.id, data);
  } catch (error) {
    throw error;
  }
};

/**
 * Get organization settings
 */
export const getOrganizationSettings = async (organizationId: string) => {
  try {
    return await organizationMeRepository.getSettings(organizationId);
  } catch (error) {
    throw error;
  }
};

/**
 * Update organization settings
 */
export const updateOrganizationSettings = async (
  organizationId: string,
  settings: Record<string, any>
) => {
  try {
    return await organizationMeRepository.updateSettings(organizationId, settings);
  } catch (error) {
    throw error;
  }
};
