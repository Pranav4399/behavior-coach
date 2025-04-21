import { AppError } from '../../../common/middleware/errorHandler';

export interface UserProps {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  role: string;
  organizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: string;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.name = props.name || null;
    this.role = props.role;
    this.organizationId = props.organizationId || null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
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
    if (this.id === 'temp' && (!this.password || this.password.length < 6)) {
      throw new AppError('Password must be at least 6 characters', 400);
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
      role: this.role,
      organizationId: this.organizationId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 