import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { Organization, OrganizationType } from '../models/Organization';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import type { PrismaClient } from '@prisma/client';

/**
 * Get all organizations
 */
export const findAll = async (): Promise<Organization[]> => {
  const organizations = await prisma.organization.findMany();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return organizations.map((org: any) => new Organization(org));
};

/**
 * Find organization by ID
 */
export const findById = async (id: string): Promise<Organization> => {
  console.log('id', id);
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      roles: true,
      users: true,
    },
  });
  
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Organization(organization as any);
};

/**
 * Check if an organization with the given name already exists
 */
export const existsByName = async (name: string): Promise<boolean> => {
  const count = await prisma.organization.count({
    where: { 
      name: {
        equals: name,
        mode: 'insensitive' // Case insensitive comparison
      }
    }
  });
  
  return count > 0;
};

/**
 * Create new organization
 */
export const create = async (data: {
  name: string;
  type: OrganizationType;
  subscriptionTier: string;
  logoUrl?: string;
  customTerminology?: Record<string, string>;
  settings?: Record<string, any>;
}): Promise<Organization> => {
  // Check if organization with the same name already exists
  const exists = await existsByName(data.name);
  if (exists) {
    throw new AppError(`An organization with the name "${data.name}" already exists`, 400);
  }
  
  // Create a temporary Organization instance to validate
  const tempOrg = new Organization({
    id: 'temp',
    name: data.name,
    type: data.type,
    subscriptionTier: data.subscriptionTier,
    logoUrl: data.logoUrl,
    customTerminology: data.customTerminology,
    settings: data.settings,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Validate before attempting to save
  tempOrg.validate();
  
  // Create the organization
  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      type: data.type,
      subscriptionTier: data.subscriptionTier,
      logoUrl: data.logoUrl,
      customTerminology: data.customTerminology || {},
      settings: data.settings || {},
    },
  });
  
  return new Organization(organization);
};

/**
 * Update organization
 */
export const update = async (
  id: string,
  data: {
    name?: string;
    type?: OrganizationType;
    subscriptionTier?: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
    settings?: Record<string, any>;
  }
): Promise<Organization> => {
  // Check if organization exists
  const existingOrg = await findById(id);
  
  // If name is being updated, check if the new name already exists for another organization
  if (data.name && data.name !== existingOrg.name) {
    const exists = await prisma.organization.count({
      where: { 
        name: {
          equals: data.name,
          mode: 'insensitive' // Case insensitive comparison
        },
        id: {
          not: id // Exclude the current organization
        }
      }
    });
    
    if (exists > 0) {
      throw new AppError(`An organization with the name "${data.name}" already exists`, 400);
    }
  }
  
  // Update the organization instance and validate
  existingOrg.update(data);
  
  // Save to database
  const updatedOrganization = await prisma.organization.update({
    where: { id },
    data,
  });
  
  return new Organization(updatedOrganization);
};

/**
 * Delete organization and related data
 */
export const remove = async (id: string): Promise<void> => {
  // Check if organization exists
  await findById(id);
  
  // Delete the organization and related data in a transaction
  await prisma.$transaction([
    // Delete roles
    prisma.role.deleteMany({
      where: { organizationId: id },
    }),
    // Delete users
    prisma.user.deleteMany({
      where: { organizationId: id },
    }),
    // Delete organization
    prisma.organization.delete({
      where: { id },
    }),
  ]);
};


/**
 * List organizations with pagination and filters
 */
export const findWithFilters = async (
  page = 1,
  limit = 10,
  filters: {
    type?: OrganizationType;
    search?: string;
  } = {}
) => {
  const skip = (page - 1) * limit;
  
  // Build filters
  const where: any = {};
  
  if (filters.type) {
    where.type = filters.type;
  }
  
  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }
  
  // Get count of matching organizations
  const totalCount = await prisma.organization.count({ where });
  
  // Get paginated results
  const organizations = await prisma.organization.findMany({
    where,
    skip,
    take: limit,
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: organizations.map((org: any) => new Organization(org)),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
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