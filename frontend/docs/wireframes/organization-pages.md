# Organization Pages Wireframes

This document outlines the UI structure and component hierarchy for the organization-related pages based on the reference UI designs.

## Organization Profile Page

### Layout Structure
```
+------------------------------------------------------+
|                     HEADER                           |
+------------------------------------------------------+
|        |                                             |
|        |                                             |
|        |                                             |
|        |                                             |
|  SIDE  |               MAIN CONTENT                  |
|  BAR   |                                             |
|        |                                             |
|        |                                             |
|        |                                             |
|        |                                             |
+------------------------------------------------------+
|                     FOOTER                           |
+------------------------------------------------------+
```

### Components

#### Header
- Organization logo/name (left)
- Navigation links (center)
- User profile dropdown (right)
- Notifications icon (right)

#### Sidebar
- Organization name and type
- Navigation menu with icons
  - Dashboard
  - Users
  - Settings
  - Roles & Permissions
  - Subscription
  - Resources

#### Main Content for Organization Profile
- Organization header with:
  - Cover image/color banner
  - Organization logo
  - Organization name
  - Type badge (Client/Expert)
  - Quick action buttons (Edit, etc.)
- Information cards
  - Basic details
  - Subscription information
  - User count and limits
- Tabs for different sections:
  - Overview
  - Members
  - Settings
  - Activity

### Admin vs Member View Differences
The admin view includes:
- Edit organization buttons
- User management actions
- Access to all settings and billing

The member view is more restricted:
- View-only for organization details
- Limited settings access
- No billing or subscription management

## Create Organization Page

### Layout Structure
```
+------------------------------------------------------+
|                     HEADER                           |
+------------------------------------------------------+
|                                                      |
|                                                      |
|                  MULTI-STEP FORM                     |
|                                                      |
|                                                      |
+------------------------------------------------------+
|                     FOOTER                           |
+------------------------------------------------------+
```

### Components

#### Multi-step Form
- Progress indicator showing steps
- Step 1: Basic Information
  - Organization name input
  - Organization type selection (Client/Expert)
  - Description textarea
- Step 2: Organization Details
  - Industry dropdown
  - Size selection
  - Location inputs
- Step 3: Branding
  - Logo upload
  - Color theme selection
- Step 4: Review & Create
  - Summary of all information
  - Terms & conditions checkbox
  - Create button

## Organization Settings Page

### Layout Structure
```
+------------------------------------------------------+
|                     HEADER                           |
+------------------------------------------------------+
|        |                                             |
|        |                                             |
|  SIDE  |    SETTINGS SIDEBAR  |  SETTINGS CONTENT    |
|  BAR   |                      |                      |
|        |                      |                      |
+------------------------------------------------------+
|                     FOOTER                           |
+------------------------------------------------------+
```

### Components

#### Settings Sidebar
- Profile
- Branding
- Integrations
- Team Management
- Roles & Permissions
- Subscription & Billing
- Notifications
- Advanced Settings

#### Settings Content Areas
Each section will have its own form or interface:
- Profile: Organization details editing form
- Branding: Logo upload, color picker
- Team Management: Member listing with invite functionality
- Roles: Role creation/editing with permission selection

## Color Schemes and Design Elements

### Color Palette
Based on the reference images:
- Primary: #5B21B6 (deep purple)
- Secondary: #2563EB (blue)
- Accent: #10B981 (green)
- Background: #F9FAFB (light gray)
- Card background: #FFFFFF (white)
- Text primary: #111827 (near black)
- Text secondary: #6B7280 (gray)

### Typography
- Headings: Inter or similar sans-serif, bold
- Body text: Inter or similar sans-serif, regular
- Font sizes:
  - Heading 1: 24px - 32px
  - Heading 2: 20px - 24px
  - Body: 14px - 16px
  - Small text: 12px

### UI Elements
- Cards with subtle shadows
- Rounded corners (8px typical)
- Thin dividers (1px, #E5E7EB)
- Icons: Line style, consistent size
- Buttons:
  - Primary: Filled, purple background
  - Secondary: Outlined, purple border
  - Tertiary: Text only, no background 