import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { UserPreferences, UserPreferencesProps } from '../models/UserPreferences';

/**
 * Find preferences by user ID
 */
export const findByUserId = async (userId: string, organizationId?: string): Promise<UserPreferences | null> => {
  // First get the user to verify organization access if needed
  if (organizationId) {
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        organizationId 
      }
    });
    
    if (!user) {
      throw new AppError('User not found or not accessible', 404);
    }
  }
  
  const preferences = await prisma.userPreferences.findUnique({
    where: { userId }
  });
  
  if (!preferences) {
    return null;
  }
  
  return new UserPreferences(preferences);
};

/**
 * Create user preferences
 */
export const create = async (data: Omit<UserPreferencesProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPreferences> => {
  // Create a temporary instance to validate
  const tempPreferences = new UserPreferences({
    id: 'temp',
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Validate before saving
  tempPreferences.validate();
  
  // Check if preferences already exist
  const existingPreferences = await prisma.userPreferences.findUnique({
    where: { userId: data.userId }
  });
  
  if (existingPreferences) {
    throw new AppError('User preferences already exist', 409);
  }
  
  // Create in database
  const preferences = await prisma.userPreferences.create({
    data: {
      userId: data.userId,
      theme: data.theme || 'system',
      language: data.language || 'en',
      emailNotifications: data.emailNotifications ?? true,
      pushNotifications: data.pushNotifications ?? true,
      timezone: data.timezone || 'UTC',
      dateFormat: data.dateFormat || 'YYYY-MM-DD',
      customSettings: data.customSettings || {}
    }
  });
  
  return new UserPreferences(preferences);
};

/**
 * Update user preferences
 */
export const update = async (
  userId: string, 
  data: Partial<UserPreferencesProps>,
  organizationId?: string
): Promise<UserPreferences> => {
  // First check if the user exists and belongs to the organization if provided
  if (organizationId) {
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        organizationId 
      }
    });
    
    if (!user) {
      throw new AppError('User not found or not accessible', 404);
    }
  }
  
  // Find existing preferences
  const existingPreferences = await prisma.userPreferences.findUnique({
    where: { userId }
  });
  
  if (!existingPreferences) {
    // Create new preferences if they don't exist
    return await create({
      userId,
      ...data
    });
  }
  
  // Update preferences instance and validate
  const preferencesInstance = new UserPreferences(existingPreferences);
  preferencesInstance.update(data);
  
  // Update in database
  const updatedPreferences = await prisma.userPreferences.update({
    where: { userId },
    data: {
      theme: preferencesInstance.theme,
      language: preferencesInstance.language,
      emailNotifications: preferencesInstance.emailNotifications,
      pushNotifications: preferencesInstance.pushNotifications,
      timezone: preferencesInstance.timezone,
      dateFormat: preferencesInstance.dateFormat,
      customSettings: preferencesInstance.customSettings,
      updatedAt: new Date()
    }
  });
  
  return new UserPreferences(updatedPreferences);
};

/**
 * Delete user preferences
 */
export const remove = async (userId: string, organizationId?: string): Promise<void> => {
  // First check if the user exists and belongs to the organization if provided
  if (organizationId) {
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        organizationId 
      }
    });
    
    if (!user) {
      throw new AppError('User not found or not accessible', 404);
    }
  }
  
  // Delete preferences
  await prisma.userPreferences.delete({
    where: { userId }
  });
}; 