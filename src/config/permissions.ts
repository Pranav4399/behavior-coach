// Permissions by resource and action
export const PERMISSIONS = {
  // Organization related permissions
  ORGANIZATION: {
    VIEW: 'organization:view',
    EDIT: 'organization:edit',
    MANAGE_SETTINGS: 'organization:manage_settings',
    VIEW_USAGE: 'organization:view_usage',
    VIEW_BILLING: 'organization:view_billing',
    MANAGE_BILLING: 'organization:manage_billing',
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

// Predefined role permission sets
export const ROLE_PERMISSIONS = {
  // Organization admin has all permissions
  ORG_ADMIN: ALL_PERMISSIONS,
  
  // Client organization roles
  CLIENT: {
    PROGRAM_MANAGER: [
      // Organization permissions
      PERMISSIONS.ORGANIZATION.VIEW,
      PERMISSIONS.ORGANIZATION.VIEW_USAGE,
      
      // User permissions
      PERMISSIONS.USER.VIEW,
      
      // Program permissions
      PERMISSIONS.PROGRAM.VIEW,
      PERMISSIONS.PROGRAM.CREATE,
      PERMISSIONS.PROGRAM.EDIT,
      PERMISSIONS.PROGRAM.DELETE,
      PERMISSIONS.PROGRAM.ASSIGN_JOURNEYS,
      
      // Journey permissions (limited)
      PERMISSIONS.JOURNEY.VIEW,
      
      // Report permissions
      PERMISSIONS.REPORT.VIEW,
      PERMISSIONS.REPORT.EXPORT,
      PERMISSIONS.REPORT.CREATE,
    ],
    
    TRAINING_MANAGER: [
      // Organization permissions
      PERMISSIONS.ORGANIZATION.VIEW,
      
      // Journey permissions
      PERMISSIONS.JOURNEY.VIEW,
      PERMISSIONS.JOURNEY.CREATE,
      PERMISSIONS.JOURNEY.EDIT,
      PERMISSIONS.JOURNEY.DELETE,
      
      // Content permissions
      PERMISSIONS.CONTENT.VIEW,
      PERMISSIONS.CONTENT.CREATE,
      PERMISSIONS.CONTENT.EDIT,
      PERMISSIONS.CONTENT.DELETE,
      
      // Report permissions (limited)
      PERMISSIONS.REPORT.VIEW,
    ],
    
    CONTENT_SPECIALIST: [
      // Content permissions
      PERMISSIONS.CONTENT.VIEW,
      PERMISSIONS.CONTENT.CREATE,
      PERMISSIONS.CONTENT.EDIT,
      PERMISSIONS.CONTENT.DELETE,
    ],
  },
  
  // Expert organization roles
  EXPERT: {
    CONTENT_SPECIALIST: [
      // Organization permissions
      PERMISSIONS.ORGANIZATION.VIEW,
      
      // Content permissions
      PERMISSIONS.CONTENT.VIEW,
      PERMISSIONS.CONTENT.CREATE,
      PERMISSIONS.CONTENT.EDIT,
      PERMISSIONS.CONTENT.DELETE,
      
      // Journey permissions
      PERMISSIONS.JOURNEY.VIEW,
      PERMISSIONS.JOURNEY.CREATE,
      PERMISSIONS.JOURNEY.EDIT,
      PERMISSIONS.JOURNEY.DELETE,
    ],
    
    PUBLISHER: [
      // Organization permissions
      PERMISSIONS.ORGANIZATION.VIEW,
      
      // Content and journey view permissions
      PERMISSIONS.CONTENT.VIEW,
      PERMISSIONS.JOURNEY.VIEW,
      
      // Marketplace permissions
      PERMISSIONS.MARKETPLACE.PUBLISH,
      PERMISSIONS.MARKETPLACE.MANAGE_LISTINGS,
    ],
  },
}; 