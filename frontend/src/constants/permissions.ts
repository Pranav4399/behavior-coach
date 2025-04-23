
export const IS_PLATFORM_ADMIN = "is_platform_admin";

// Permissions by resource and action
export const PERMISSIONS = {
  // Organization related permissions
  ORGANIZATION: {
    CREATE: 'organization:create', // Permission to create new organizations
    VIEW: 'organization:view', // Permission to view organizations
    EDIT: 'organization:edit', // Permission to edit organizations
    DELETE: 'organization:delete', // Permission to delete organizations
    MANAGE_SETTINGS: 'organization:manage_settings', // Permission to manage organization settings
    VIEW_USAGE: 'organization:view_usage', // Permission to view organization usage
    VIEW_BILLING: 'organization:view_billing', // Permission to view organization billing
    MANAGE_BILLING: 'organization:manage_billing', // Permission to manage organization billing
    VIEW_BRANDING: 'organization:view_branding',
    MANAGE_BRANDING: 'organization:manage_branding',
  },
  
  // User management permissions
  USER: {
    VIEW: 'user:view',
    CREATE: 'user:create',
    EDIT: 'user:edit',
    DELETE: 'user:delete',
    MANAGE_ROLES: 'user:manage_roles',
  },
  
  // Role management permissions
  ROLE: {
    VIEW: 'role:view',
    CREATE: 'role:create',
    EDIT: 'role:edit',
    DELETE: 'role:delete',
  },
  
  // Program management permissions (for client organizations)
  PROGRAM: {
    VIEW: 'program:view',
    CREATE: 'program:create',
    EDIT: 'program:edit',
    DELETE: 'program:delete',
    ASSIGN_JOURNEYS: 'program:assign_journeys',
  },
  
  // Journey management permissions
  JOURNEY: {
    VIEW: 'journey:view',
    CREATE: 'journey:create',
    EDIT: 'journey:edit',
    DELETE: 'journey:delete',
    PUBLISH: 'journey:publish',
  },
  
  // Content management permissions
  CONTENT: {
    VIEW: 'content:view',
    CREATE: 'content:create',
    EDIT: 'content:edit',
    DELETE: 'content:delete',
  },
  
  // Integration permissions
  INTEGRATION: {
    VIEW: 'integration:view',
    SETUP: 'integration:setup',
    EDIT: 'integration:edit',
    DELETE: 'integration:delete',
  },
  
  // Marketplace permissions (for expert organizations)
  MARKETPLACE: {
    PUBLISH: 'marketplace:publish',
    MANAGE_LISTINGS: 'marketplace:manage_listings',
  },
  
  // Reporting permissions
  REPORT: {
    VIEW: 'report:view',
    EXPORT: 'report:export',
    CREATE: 'report:create',
  },
};

// Flatten all permissions into a single array for validation
export const ALL_PERMISSIONS = Object.values(PERMISSIONS)
  .flatMap(resource => Object.values(resource));

// Resource to display name mapping
export const RESOURCE_DISPLAY_NAMES = {
  organization: 'Organization',
  user: 'User',
  role: 'Role',
  program: 'Program',
  journey: 'Journey',
  content: 'Content',
  integration: 'Integration',
  marketplace: 'Marketplace',
  report: 'Report',
};

// Action to display name mapping
export const ACTION_DISPLAY_NAMES = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  manage_settings: 'Manage Settings',
  view_usage: 'View Usage',
  view_billing: 'View Billing',
  manage_billing: 'Manage Billing',
  view_branding: 'View Branding',
  manage_branding: 'Manage Branding',
  manage_roles: 'Manage Roles',
  assign_journeys: 'Assign Journeys',
  publish: 'Publish',
  setup: 'Setup',
  manage_listings: 'Manage Listings',
  export: 'Export',
};
