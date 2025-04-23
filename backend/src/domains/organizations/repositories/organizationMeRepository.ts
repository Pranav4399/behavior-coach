import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { Organization } from '../models/Organization';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import * as organizationRepository from './organizationRepository';

/**
 * Find organization by user ID
 */
export const findByUserId = async (userId: string): Promise<Organization> => {
  console.log('userId', userId);
  // Fetch the user to get their organization ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true }
  });
  
  if (!user || !user.organizationId) {
    throw new AppError('User does not belong to any organization', 404);
  }
  
  // Fetch the organization with details
  return await organizationRepository.findById(user.organizationId);
};

/**
 * Get organization settings
 */
export const getSettings = async (id: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: { 
      settings: true,
      customTerminology: true,
      type: true
    }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Include organization type in the settings response
  return {
    settings: organization.settings || {},
    customTerminology: organization.customTerminology || {},
    organizationType: organization.type
  };
};

/**
 * Update organization settings
 */
export const updateSettings = async (
  id: string,
  settings: Record<string, any>
): Promise<{ settings: any; organizationType: string }> => {
  // Get the organization to check its type
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: { 
      settings: true,
      type: true
    }
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // Filter settings based on organization type if needed
  let filteredSettings = { ...settings };
  
  // For example, if there are Expert-only settings
  if (organization.type === 'client') {
    // Remove expert-only settings
    const expertOnlySettings = ['marketplaceSettings', 'publisherSettings'];
    expertOnlySettings.forEach(key => {
      if (filteredSettings[key]) {
        delete filteredSettings[key];
      }
    });
  }
  
  // Merge existing settings with new settings
  const updatedSettings = {
    ...(organization.settings as object || {}),
    ...filteredSettings
  };
  
  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data: { settings: updatedSettings }
  });
  
  return {
    settings: updatedOrganization.settings,
    organizationType: organization.type
  };
};