export type OrganizationType = 'client' | 'expert';
export type SubscriptionTier = 'basic' | 'premium' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  subscriptionTier: SubscriptionTier;
  logoUrl: string;
  customTerminology: Record<string, string>;
  settings: OrganizationSettings;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  theme: 'light' | 'dark';
  enableNotifications: boolean;
  isPlatformAdmin?: boolean;
}

export interface CreateOrganizationData {
  name: string;
  type: OrganizationType;
  description?: string;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  logoUrl?: string;
  customTerminology?: Record<string, string>;
  settings: {
    theme: 'light' | 'dark';
    enableNotifications: boolean;
  };
}

export interface OrganizationsResponse {
  organizations: Organization[];
}

export interface OrganizationResponse {
  organization: Organization;
} 