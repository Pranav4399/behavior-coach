import * as authRepository from '../repositories/authRepository';
import { generateToken } from '../utils/jwt';
import { User } from '../models/User';

interface SignupData {
  email: string;
  password: string;
  name?: string;
  organizationId?: string;
}

interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string | null;
    roleId: string | null;
    organizationId: string | null;
  };
  token: string;
}

export class AuthService {
  /**
   * Register a new user
   * @param userData User data for registration
   * @returns User object and JWT token
   */
  async signup(userData: SignupData): Promise<AuthResult> {
    try {
      // Create user using repository
      const user = await authRepository.create(userData);
      
      // Generate token
      const token = generateToken(user.id);
      
      return {
        user: user.toSafeObject(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticate a user
   * @param email User email
   * @param password User password
   * @returns User object and JWT token if authentication successful
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Verify credentials using repository
      const user = await authRepository.verifyCredentials(email, password);
      
      // Generate token
      const token = generateToken(user.id);
      
      return {
        user: user.toSafeObject(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param userId User ID
   * @returns User object if found
   */
  async getUserById(userId: string) {
    try {
      const user = await authRepository.findById(userId);
      return user.toSafeObject();
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user with organization details
   * @param userId User ID
   * @returns User and organization objects
   */
  async getUserWithOrganization(userId: string) {
    try {
      const { user, organization } = await authRepository.findWithOrganization(userId);
      return {
        user: user.toSafeObject(),
        organization
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user permissions
   * @param userId User ID
   * @returns Array of permission strings
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      return await authRepository.getUserPermissions(userId);
    } catch (error) {
      throw error;
    }
  }
} 