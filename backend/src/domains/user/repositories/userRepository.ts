import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { User, UserProps } from '../models/User';
import bcrypt from 'bcryptjs';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
    theme?: string;
    language?: string;
  };
}

/**
 * Find a user by ID
 */
export const findById = async (id: string, organizationId?: string): Promise<User> => {
  const query: any = { id };
  
  // Add organization filter for tenant isolation if provided
  if (organizationId) {
    query.organizationId = organizationId;
  }
  
  const user = await prisma.user.findUnique({
    where: query
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return new User(user);
};

/**
 * Find a user by email
 */
export const findByEmail = async (email: string, organizationId?: string): Promise<User | null> => {
  const query: any = { email };
  
  // Add organization filter for tenant isolation if provided
  if (organizationId) {
    query.organizationId = organizationId;
  }
  
  const user = await prisma.user.findUnique({
    where: query
  });
  
  if (!user) {
    return null;
  }
  
  return new User(user);
};

/**
 * Find all users in an organization
 */
export const findAll = async (
  organizationId: string,
  page = 1,
  limit = 20,
  filters: {
    search?: string;
    role?: string;
    status?: 'active' | 'inactive' | 'pending';
  } = {}
) => {
  const skip = (page - 1) * limit;
  
  // Build where clause
  const where: any = { organizationId };
  
  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  
  if (filters.role) {
    where.role = filters.role;
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  // Get total count for pagination
  const totalCount = await prisma.user.count({ where });
  
  // Get users with pagination
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
  
  return {
    users: users.map((user: any) => new User(user)),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

/**
 * Create a new user
 */
export const create = async (userData: {
  email: string;
  password?: string;
  name?: string;
  role: string;
  organizationId: string;
  status?: 'active' | 'inactive' | 'pending';
}): Promise<User> => {
  // Create a temporary User instance to validate
  const tempUser = new User({
    id: 'temp',
    email: userData.email,
    password: userData.password,
    name: userData.name,
    role: userData.role,
    organizationId: userData.organizationId,
    status: userData.status || 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Validate before saving
  tempUser.validate();
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });
  
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }
  
  // Hash password if provided
  let hashedPassword = undefined;
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(userData.password, salt);
  }
  
  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name || null,
      role: userData.role,
      organizationId: userData.organizationId,
      status: userData.status || 'pending'
    }
  });
  
  return new User(user);
};

/**
 * Update an existing user
 */
export const update = async (
  id: string,
  data: Partial<UserProps>,
  organizationId?: string
): Promise<User> => {
  // Find the user first
  const existingUser = await findById(id, organizationId);
  
  // Update user instance and validate
  existingUser.update(data);
  
  // Handle password updates separately
  let updateData: any = {
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
    status: existingUser.status,
    updatedAt: new Date()
  };
  
  // Only update password if provided
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(data.password, salt);
  }
  
  // Update in database
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData
  });
  
  return new User(updatedUser);
};

/**
 * Delete a user
 */
export const remove = async (id: string, organizationId?: string): Promise<void> => {
  // Check if user exists and belongs to organization if provided
  await findById(id, organizationId);
  
  // Delete user
  await prisma.user.delete({
    where: { id }
  });
};

/**
 * Get user with organization details
 */
export const findWithOrganization = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      organization: true
    }
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return {
    user: new User(user),
    organization: user.organization
  };
};

/**
 * Update user last login time
 */
export const updateLastLogin = async (id: string): Promise<User> => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      lastLoginAt: new Date()
    }
  });
  
  return new User(updatedUser);
};

export const userRepository = {
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async getUserProfile(userId: string) {
    const user = await this.findById(userId);

    // Return only the necessary profile data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      organizationId: user.organizationId,
      preferences: user.preferences || {
        notifications: {
          email: true,
          push: true,
        },
        theme: 'light',
        language: 'en',
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  async updateProfile(userId: string, profileData: ProfileUpdateData) {
    const user = await this.findById(userId);
    
    // Update user information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.name !== undefined ? profileData.name : user.name,
        email: profileData.email !== undefined ? profileData.email : user.email,
        preferences: profileData.preferences ? {
          ...(user.preferences as any || {}),
          ...profileData.preferences,
        } : user.preferences,
      },
    });

    return updatedUser;
  }
}; 