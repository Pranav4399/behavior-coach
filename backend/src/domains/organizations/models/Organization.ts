import { AppError } from '../../../common/middleware/errorHandler';

export type OrganizationType = 'client' | 'expert';

interface OrganizationProps {
  id: string;
  name: string;
  description?: string;
  website?: string;
  type: OrganizationType;
  subscriptionTier: string;
  logoUrl?: string;
  customTerminology?: Record<string, string>;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  // Related entities (optional for now)
  roles?: any[];
  users?: any[];
}

export class Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  type: OrganizationType;
  subscriptionTier: string;
  logoUrl?: string;
  customTerminology: Record<string, string>;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  roles?: any[];
  users?: any[];

  constructor(props: OrganizationProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.website = props.website;
    this.type = props.type;
    this.subscriptionTier = props.subscriptionTier;
    this.logoUrl = props.logoUrl;
    this.customTerminology = props.customTerminology || {};
    this.settings = props.settings || {};
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.roles = props.roles;
    this.users = props.users;
  }

  /**
   * Validate organization data
   * @throws AppError if validation fails
   */
  validate(): void {
    // Name validation
    if (!this.name || this.name.trim() === '') {
      throw new AppError('Organization name is required', 400);
    }
    
    // Type validation
    if (!this.type || !['client', 'expert'].includes(this.type)) {
      throw new AppError('Organization type must be either "client" or "expert"', 400);
    }
    
    // Subscription tier validation
    if (!this.subscriptionTier || this.subscriptionTier.trim() === '') {
      throw new AppError('Subscription tier is required', 400);
    }
  }

  /**
   * Update organization properties with validation
   */
  update(props: Partial<Omit<OrganizationProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      this.name = props.name;
    }
    
    if (props.description !== undefined) {
      this.description = props.description;
    }
    
    if (props.website !== undefined) {
      this.website = props.website;
    }
    
    if (props.type !== undefined) {
      this.type = props.type;
    }
    
    if (props.subscriptionTier !== undefined) {
      this.subscriptionTier = props.subscriptionTier;
    }
    
    if (props.logoUrl !== undefined) {
      this.logoUrl = props.logoUrl;
    }
    
    if (props.customTerminology !== undefined) {
      this.customTerminology = props.customTerminology;
    }
    
    if (props.settings !== undefined) {
      this.settings = props.settings;
    }
    
    // Validate after update
    this.validate();
  }
} 