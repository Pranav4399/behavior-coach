import { AppError } from '../../../common/middleware/errorHandler';

export interface UserProps {
  id: string;
  email: string;
  password?: string; // Optional because we might not always need to expose password
  name?: string | null;
  roleId: string;
  organizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  status?: 'active' | 'inactive' | 'pending';
  lastLoginAt?: Date | null;
  preferences?: Record<string, any> | null;
  roleDisplayName?: string;
  organizationName?: string | null;
}

export class User {
  id: string;
  email: string;
  password?: string;
  name: string | null;
  roleId: string;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt: Date | null;
  preferences: Record<string, any> | null;
  roleDisplayName?: string;
  organizationName?: string | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.name = props.name || null;
    this.roleId = props.roleId;
    this.organizationId = props.organizationId || null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.status = props.status || 'pending';
    this.lastLoginAt = props.lastLoginAt || null;
    this.preferences = props.preferences || null;
    this.roleDisplayName = props.roleDisplayName;
    this.organizationName = props.organizationName;
  }

  /**
   * Validate user data
   * @throws AppError if validation fails
   */
  validate(): void {
    // Email validation
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new AppError('Valid email address is required', 400);
    }
    
    // Password validation (when creating a user)
    if (this.id === 'temp' && this.password && this.password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // Role validation
    if (!this.roleId) {
      throw new AppError('Role ID is required', 400);
    }
  }

  /**
   * Validate an email address format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get sanitized user data (remove sensitive fields)
   */
  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      roleId: this.roleId,
      roleDisplayName: this.roleDisplayName,
      organizationId: this.organizationId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
      lastLoginAt: this.lastLoginAt,
      preferences: this.preferences,
      organizationName: this.organizationName
    };
  }

  /**
   * Update user with new data
   */
  update(data: Partial<UserProps>): void {
    if (data.email) {
      if (!this.isValidEmail(data.email)) {
        throw new AppError('Valid email address is required', 400);
      }
      this.email = data.email;
    }

    if (data.name !== undefined) {
      this.name = data.name;
    }

    if (data.roleId) {
      this.roleId = data.roleId;
    }

    if (data.organizationId !== undefined) {
      this.organizationId = data.organizationId;
    }

    if (data.status) {
      this.status = data.status;
    }

    if (data.preferences) {
      this.preferences = { ...this.preferences, ...data.preferences };
    }

    this.updatedAt = new Date();
  }
} 