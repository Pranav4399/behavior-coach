import { ROLE_PERMISSIONS } from '../config/permissions';
import { AppError } from '../middleware/errorHandler';
import prisma, { type PrismaClient } from '../../prisma/prisma';

/**
 * Creates default roles for a new organization based on its type
 * @param organizationId - ID of the organization
 * @param organizationType - Type of the organization (client or expert)
 */
export const createDefaultRoles = async (
  organizationId: string,
  organizationType: 'client' | 'expert'
) => {
  try {
    const rolesToCreate = [];
    
    // Add organization admin role for all organization types
    rolesToCreate.push({
      name: 'org_admin',
      displayName: 'Organization Admin',
      permissions: ROLE_PERMISSIONS.ORG_ADMIN,
      organizationId,
    });
    
    if (organizationType === 'client') {
      // Add client organization specific roles
      rolesToCreate.push({
        name: 'program_manager',
        displayName: 'Program Manager',
        permissions: ROLE_PERMISSIONS.CLIENT.PROGRAM_MANAGER,
        organizationId,
      });
      
      rolesToCreate.push({
        name: 'training_manager',
        displayName: 'Training Manager',
        permissions: ROLE_PERMISSIONS.CLIENT.TRAINING_MANAGER,
        organizationId,
      });
      
      rolesToCreate.push({
        name: 'content_specialist',
        displayName: 'Content Specialist',
        permissions: ROLE_PERMISSIONS.CLIENT.CONTENT_SPECIALIST,
        organizationId,
      });
    } else if (organizationType === 'expert') {
      // Add expert organization specific roles
      rolesToCreate.push({
        name: 'content_specialist',
        displayName: 'Content Specialist',
        permissions: ROLE_PERMISSIONS.EXPERT.CONTENT_SPECIALIST,
        organizationId,
      });
      
      rolesToCreate.push({
        name: 'publisher',
        displayName: 'Publisher',
        permissions: ROLE_PERMISSIONS.EXPERT.PUBLISHER,
        organizationId,
      });
    }
    
    // Create all roles in a transaction
    const createdRoles = await prisma.$transaction(
      rolesToCreate.map(role => 
        prisma.role.create({
          data: {
            name: role.name,
            displayName: role.displayName,
            permissions: role.permissions,
            organization: {
              connect: { id: role.organizationId }
            }
          }
        })
      )
    );
    
    return createdRoles;
  } catch (error) {
    throw error;
  }
};

/**
 * Validates if a role name is valid within an organization
 * @param organizationId - ID of the organization
 * @param roleName - Name of the role to validate
 */
export const validateRoleName = async (organizationId: string, roleName: string) => {
  try {
    const role = await prisma.role.findFirst({
      where: {
        organizationId,
        name: roleName
      }
    });
    
    if (!role) {
      throw new AppError(`Role '${roleName}' does not exist in this organization`, 400);
    }
    
    return role;
  } catch (error) {
    throw error;
  }
}; 