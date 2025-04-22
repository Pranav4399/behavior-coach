# User Management Pages Wireframes

This document outlines the UI structure and component hierarchy for the user-related pages based on the reference UI designs.

## User Profile Page

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

#### Main Content for User Profile
- User header with:
  - User avatar
  - User name
  - Role badge
  - Email address
  - Last active timestamp
  - Quick action buttons (Edit, etc.)
- Tab navigation:
  - Personal Details
  - Workspace
  - Activities
  - Security
- Tab Content: Personal Details
  - Profile photo upload
  - Name fields (First, Last)
  - Email address
  - Phone number
  - Job title
  - Department
  - Save button
- Tab Content: Workspace
  - Theme preferences
  - Notification settings
  - Language preferences
  - Time zone
  - Date format preferences

## User Management Page

### Layout Structure
```
+------------------------------------------------------+
|                     HEADER                           |
+------------------------------------------------------+
|        |                                             |
|        |  FILTER BAR & SEARCH                        |
|        |------------------------------------------------
|        |                                             |
|  SIDE  |                                             |
|  BAR   |              USER LISTING TABLE             |
|        |                                             |
|        |                                             |
|        |                                             |
|        |                                             |
+------------------------------------------------------+
|                     FOOTER                           |
+------------------------------------------------------+
```

### Components

#### Filter Bar & Search
- Search input
- Filter dropdown (Role, Status, Department)
- Add User button
- Bulk actions dropdown
- View toggle (Table/Grid)

#### User Listing Table
- Column headers with sorting
  - Name/Email (with avatar)
  - Role
  - Department
  - Status
  - Last Active
  - Actions
- Row per user with:
  - Selection checkbox
  - User avatar and name
  - Email address (smaller text)
  - Role badge
  - Department text
  - Status indicator (Active/Inactive/Pending)
  - Last active timestamp
  - Actions menu (Edit, Delete, Impersonate, etc.)
- Pagination controls

## User Invitation / Creation Modal

### Components
- Modal header with title
- Form fields:
  - Email address
  - First name
  - Last name
  - Role dropdown
  - Department dropdown
  - Send invitation checkbox
  - Custom message textarea (if sending invitation)
- Action buttons:
  - Cancel
  - Create User / Send Invitation

## User Role Assignment

### Components
- Role selection dropdown
  - Displays current role
  - Lists available roles with descriptions
- Custom permissions section (for admin users)
  - Permission category accordions
  - Individual permission checkboxes
  - "Select all" options
- Save button

## Design Elements

### User Status Indicators
- Active: Green dot with "Active" text
- Inactive: Gray dot with "Inactive" text
- Pending: Yellow dot with "Pending" text
- Locked: Red dot with "Locked" text

### Role Badges
- Admin: Purple badge
- Member: Blue badge
- Guest: Gray badge
- Custom roles: Various colors

### Activity Timeline
- Vertical timeline with dots
- Activity cards showing:
  - Icon for activity type
  - Activity description
  - Timestamp
  - Related entity link (if applicable)

### Form Element Styles
- Input fields: White background, light gray border, rounded corners
- Dropdowns: Custom styled with chevron icon
- Checkboxes: Custom styled with brand color
- Buttons consistent with organization pages 