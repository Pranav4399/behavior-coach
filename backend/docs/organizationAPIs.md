# Organization API Endpoints Checklist

## Basic Organization Endpoints
- [x] GET `/api/organizations` - Retrieve all organizations
- [x] GET `/api/organizations/:id` - Get an organization by ID
- [x] POST `/api/organizations` - Create a new organization
- [x] PUT `/api/organizations/:id` - Update an organization
- [x] DELETE `/api/organizations/:id` - Delete an organization

## Organization Details Endpoints
- [x] GET `/api/organizations/me` - Retrieve details for the current user's organization
- [x] PATCH `/api/organizations/me` - Update details for the current user's organization

## Settings & Configuration
- [x] GET `/api/organizations/me/settings` - Retrieve organization-specific settings
- [x] PATCH `/api/organizations/me/settings` - Update organization-specific settings
- [x] GET `/api/organizations/me/roles` - Get organization-specific role definitions
- [x] POST `/api/organizations/me/roles` - Create a new custom role within the organization
- [x] PATCH `/api/organizations/me/roles/:roleId` - Update an existing custom role definition
- [x] DELETE `/api/organizations/me/roles/:roleId` - Delete a custom role
- [x] GET `/api/organizations/me/permissions` - Get the permission matrix available for roles within the organization

## Integration Management
- [] GET `/api/organizations/me/integrations` - List configured integrations for the organization
- [] GET `/api/organizations/me/integrations/:integrationType` - Get configuration details for a specific integration
- [] PATCH `/api/organizations/me/integrations/:integrationType` - Update the configuration for a specific integration
- [] POST `/api/organizations/me/integrations/:integrationType/test` - Test the connection for a configured integration
- [] DELETE `/api/organizations/me/integrations/:integrationType` - Remove/disconnect an integration

## Subscription & Billing (Not Implementing Now)
- [ ] GET `/api/organizations/me/subscription` - Get current subscription tier details and limits
- [ ] POST `/api/organizations/me/subscription/upgrade` - Request subscription tier upgrade
- [ ] POST `/api/organizations/me/subscription/request-boost` - Request temporary resource limit increase
- [ ] GET `/api/organizations/me/billing/history` - Get billing history/invoices
- [ ] GET `/api/organizations/me/billing/methods` - List payment methods
- [ ] POST `/api/organizations/me/billing/methods` - Add a new payment method
- [ ] DELETE `/api/organizations/me/billing/methods/:methodId` - Remove a payment method
- [ ] GET `/api/organizations/me/billing/forecasts` - Get billing/resource usage forecasts
- [ ] GET `/api/organizations/me/billing/history/:invoiceId/pdf` - Download a specific invoice as a PDF

## Usage & Analytics (Not Implementing Now)
- [ ] GET `/api/organizations/me/usage` - Get current resource usage metrics vs. limits
- [ ] GET `/api/organizations/me/activity` - Get activity log specific to the user's organization
- [ ] POST `/api/organizations/me/usage/forecast/simulate` - Run a custom usage forecast simulation
- [ ] GET `/api/organizations/me/recommendations` - Get subscription tier or usage recommendations
- [ ] GET `/api/organizations/me/allocations` - Get current resource allocation data
- [ ] PATCH `/api/organizations/me/allocations` - Update resource allocations
- [ ] GET `/api/organizations/me/allocations/history` - Get the history of resource allocation changes
- [ ] GET `/api/organizations/me/usage/alerts` - Get configured usage alert rules
- [ ] POST `/api/organizations/me/usage/alerts` - Create a new usage alert rule
- [ ] PATCH `/api/organizations/me/usage/alerts/:alertId` - Update an existing usage alert rule
- [ ] DELETE `/api/organizations/me/usage/alerts/:alertId` - Delete a usage alert rule
- [ ] POST `/api/organizations/me/usage/alerts/:alertId/test` - Send a test notification for a usage alert rule

## Branding & Customization (Not Implementing Now)
- [ ] GET `/api/organizations/me/branding` - Get organization-specific branding settings
- [ ] PATCH `/api/organizations/me/branding` - Update organization-specific branding settings
- [ ] POST `/api/organizations/me/branding/reset` - Reset organization branding to platform defaults 