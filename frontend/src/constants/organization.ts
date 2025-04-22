import { OrganizationType, SubscriptionTier } from '@/types/organization';

export const SUBSCRIPTION_COLORS: Record<SubscriptionTier, string> = {
  basic: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-green-100 text-green-800',
} as const;

export const ORGANIZATION_TYPE_COLORS: Record<OrganizationType, string> = {
  client: 'bg-orange-100 text-orange-800',
  expert: 'bg-cyan-100 text-cyan-800',
} as const;

// Add other organization-related constants here as needed
export const DEFAULT_ORGANIZATION_SETTINGS = {
  theme: 'light' as const,
  enableNotifications: true,
} as const; 