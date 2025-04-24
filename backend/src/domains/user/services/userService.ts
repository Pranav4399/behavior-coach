import * as userRepository from '../repositories/userRepository';
import * as userPreferencesRepository from '../repositories/userPreferencesRepository';
import { User, UserProps } from '../models/User';
import { AppError } from '../../../common/middleware/errorHandler';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  bio?: string;
  phoneNumber?: string;
  [key: string]: any;
}

export interface UserPreferences {
  notificationEnabled?: boolean;
  darkMode?: boolean;
  language?: string;
  [key: string]: any;
}

export class UserService {
  /**
   * Get all users for an organization with pagination and filtering
   */
  async getAllUsers(
    organizationId: string,
    page = 1,
    limit = 20,
    filters: {
      search?: string;
      roleId?: string;
      status?: 'active' | 'inactive' | 'pending';
    } = {}
  ) {
    try {
      return await userRepository.findAll(organizationId, page, limit, filters);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(userId: string, organizationId?: string) {
    try {
      const user = await userRepository.findById(userId, organizationId);
      return user.toSafeObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password?: string;
    name?: string;
    roleId: string;
    organizationId: string;
    status?: 'active' | 'inactive' | 'pending';
  }) {
    try {
      const user = await userRepository.create(userData);
      return user.toSafeObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(
    userId: string,
    data: Partial<UserProps>,
    organizationId?: string
  ) {
    try {
      const user = await userRepository.update(userId, data, organizationId);
      return user.toSafeObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string, organizationId?: string) {
    try {
      await userRepository.remove(userId, organizationId);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user with organization details
   */
  async getUserWithOrganization(userId: string) {
    try {
      const { user, organization } = await userRepository.findWithOrganization(userId);
      return {
        user: user.toSafeObject(),
        organization
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Invite a new user to the organization
   */
  async inviteUser(userData: {
    email: string;
    name?: string;
    roleId: string;
    organizationId: string;
  }) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);

      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Create user with pending status
      const user = await userRepository.create({
        ...userData,
        status: 'pending'
      });

      // TODO: Send invitation email (will be implemented in a separate task)

      return user.toSafeObject();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend invitation to a pending user
   */
  async resendInvitation(userId: string, organizationId: string) {
    try {
      const user = await userRepository.findById(userId, organizationId);

      if (user.status !== 'pending') {
        throw new AppError('Cannot resend invitation to an active user', 400);
      }

      // TODO: Resend invitation email (will be implemented in a separate task)

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    return userRepository.userRepository.getUserProfile(userId);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profileData: ProfileUpdateData) {
    // Validate the email if it's being updated
    if (profileData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        throw new AppError('Invalid email format', 400);
      }

      // Check if email is already in use by another user
      const existingUser = await userRepository.findByEmail(profileData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new AppError('Email already in use', 409);
      }
    }

    return userRepository.userRepository.updateProfile(userId, profileData);
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string, organizationId?: string) {
    return userPreferencesRepository.findByUserId(userId, organizationId);
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: UserPreferences, organizationId?: string) {
    return userPreferencesRepository.update(userId, preferences, organizationId);
  }

  /**
   * Update user last login time
   */
  async updateLastLogin(userId: string) {
    try {
      await userRepository.updateLastLogin(userId);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
} 