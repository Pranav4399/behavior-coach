import bcrypt from 'bcryptjs';
import prisma from '../../../../prisma/prisma';
import { generateToken } from '../utils/jwt';

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
    role: string;
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
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name || null,
        organizationId: userData.organizationId || null,
      }
    });

    // Generate token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId
      },
      token
    };
  }

  /**
   * Authenticate a user
   * @param email User email
   * @param password User password
   * @returns User object and JWT token if authentication successful
   */
  async login(email: string, password: string): Promise<AuthResult> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId
      },
      token
    };
  }

  /**
   * Get user by ID
   * @param userId User ID
   * @returns User object if found
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId
    };
  }
} 