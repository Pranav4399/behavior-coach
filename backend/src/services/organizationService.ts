import { AppError } from '../middleware/errorHandler';
import { createDefaultRoles } from './roleService';
import prisma from '../prisma';

interface CreateOrganizationData {
  name: string;
  type: 'client' | 'expert';
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
    const organizations = await prisma.organization.findMany();
    return organizations;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific organization by ID
 */
export const getOrganizationById = async (id: string) => {
  try {
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
    
    return organization;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new organization with default roles
 */
export const createOrganization = async (data: CreateOrganizationData) => {
  try {
    // Create the organization within a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the organization
      const organization = await tx.organization.create({
        data: {
          name: data.name,
          type: data.type,
          subscriptionTier: data.subscriptionTier,
          logoUrl: data.logoUrl,
          customTerminology: data.customTerminology || {},
          settings: data.settings || {},
        },
      });
      
      // 2. Create default roles for the organization
      const roles = await createDefaultRoles(organization.id, data.type);
      
      return { organization, roles };
    });
    
    return result;
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
    type?: 'client' | 'expert';
    search?: string;
  } = {}
) => {
  try {
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
      results: organizations,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
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
    subscriptionTier?: string;
    logoUrl?: string;
    customTerminology?: Record<string, string>;
    settings?: Record<string, any>;
  }
) => {
  try {
    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
    });
    
    if (!existingOrg) {
      throw new AppError('Organization not found', 404);
    }
    
    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data,
    });
    
    return updatedOrganization;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an organization (for admin use only)
 */
export const deleteOrganization = async (id: string) => {
  try {
    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
    });
    
    if (!existingOrg) {
      throw new AppError('Organization not found', 404);
    }
    
    // Delete the organization and related data in a transaction
    await prisma.$transaction([
      // Delete roles
      prisma.role.deleteMany({
        where: { organizationId: id },
      }),
      // Delete users (in a real app, you might want to archive them instead)
      prisma.user.deleteMany({
        where: { organizationId: id },
      }),
      // Delete integrations
      prisma.integration.deleteMany({
        where: { organizationId: id },
      }),
      // Finally delete the organization
      prisma.organization.delete({
        where: { id },
      }),
    ]);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Approve an expert organization (platform admin only)
 */
export const approveExpertOrganization = async (id: string) => {
  try {
    // Check if organization exists and is expert type
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
    });
    
    if (!existingOrg) {
      throw new AppError('Organization not found', 404);
    }
    
    if (existingOrg.type !== 'expert') {
      throw new AppError('Only expert organizations can be approved', 400);
    }
    
    // Update the organization settings to mark it as approved
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: {
        settings: {
          ...(existingOrg.settings as object || {}),
          approved: true,
          approvedAt: new Date().toISOString(),
        },
      },
    });
    
    return updatedOrganization;
  } catch (error) {
    throw error;
  }
}; 