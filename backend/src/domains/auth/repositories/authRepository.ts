import prisma from '../../../../prisma/prisma';
import { AppError } from '../../../common/middleware/errorHandler';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

/**
 * Find a user by ID
 */
export const findById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return new User(user);
};

/**
 * Find a user by email
 */
export const findByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    return null;
  }
  
  return new User(user);
};

/**
 * Create a new user
 */
export const create = async (userData: {
  email: string;
  password: string;
  name?: string;
  organizationId?: string;
}): Promise<User> => {
  // Create a temporary User instance to validate
  const tempUser = new User({
    id: 'temp',
    email: userData.email,
    password: userData.password,
    name: userData.name,
    role: 'user', // Default role
    organizationId: userData.organizationId,
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
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name || null,
      organizationId: userData.organizationId || null,
    }
  });
  
  return new User(user);
};

/**
 * Verify user credentials
 */
export const verifyCredentials = async (
  email: string,
  password: string
): Promise<User> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }
  
  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }
  
  return new User(user);
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
 * Get user permissions based on their role
 */
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user || !user.organizationId || !user.roleId) {
    return [];
  }
  
  const role = await prisma.role.findFirst({
    where: {
      organizationId: user.organizationId,
      id: user.roleId
    }
  });
  
  if (!role) {
    return [];
  }
  
  return role.permissions as string[];
}; 