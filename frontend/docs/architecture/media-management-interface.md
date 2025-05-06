# Simplified Media Management Interface

## Overview

This document outlines the plan for implementing a simplified media management interface within the Behavior Coach platform's content module. Rather than creating a completely separate media management module, this approach integrates essential media management functionality directly into the content creation and editing workflows, while still providing specialized tools when needed.

## Design Principles

1. **Integration First**: Media management should be seamlessly integrated into content creation flows
2. **Progressive Complexity**: Start with simple inline management, expand to dedicated views when needed
3. **Context Preservation**: Switching between content editing and media management should maintain context
4. **Focused Functionality**: Provide only the most relevant media tools within content workflows
5. **Consistent Experience**: Maintain visual and interaction consistency between content and media interfaces

## Media Management Levels

The media management interface is designed with three levels of complexity:

### Level 1: Inline Media Management

Embedded directly within content creation forms for quick media selection and basic uploads.

```
┌─────────────────────────────────────────────────────────┐
│ Content Creation Form                                   │
│ ...                                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Select Media                                [Upload] │ │
│ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │ │
│ │ │Recently│ │Recently│ │Recently│ │ More...│        │ │
│ │ │Used 1  │ │Used 2  │ │Used 3  │ │        │        │ │
│ │ └────────┘ └────────┘ └────────┘ └────────┘        │ │
│ └─────────────────────────────────────────────────────┘ │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Display of recently used media
- Quick upload button
- "More..." option to access Level 2
- Immediate selection of media for current content
- Basic metadata editing for newly uploaded media

### Level 2: Media Selection Dialog

Modal overlay that provides more comprehensive browsing and filtering without leaving the content context.

```
┌─────────────────────────────────────────────────────────┐
│ Select Media                                     [X]    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Search media...]    [Type ▼]  [Date ▼]  [Upload +] │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Recently Used                                           │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │Media 1 │ │Media 2 │ │Media 3 │ │Media 4 │            │
│ └────────┘ └────────┘ └────────┘ └────────┘            │
│                                                         │
│ All Media                                               │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │Media 1 │ │Media 2 │ │Media 3 │ │Media 4 │ │Media 5 │ │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
│                                                         │
│ [< Prev]                     [1][2][3][4][5] [Next >]  │
│                                                         │
│  [Manage Media Library]         [Cancel]    [Select]    │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Search and filter options
- Recently used media section
- Pagination for browsing larger collection
- Upload new media option
- Quick preview on hover/select
- Link to Level 3 full media library management

### Level 3: Media Library Manager

A dedicated interface for comprehensive media management while still maintaining connection to content context.

```
┌─────────────────────────────────────────────────────────┐
│ Media Library                  [Back to Content] [Upload]│
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Search media...]  [Type ▼] [Date ▼]                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌──────────────────────────┐ ┌─────────────────────────┐│
│ │                          │ │                         ││
│ │                          │ │ File Information        ││
│ │                          │ │ ───────────────────     ││
│ │                          │ │ Name: example.jpg       ││
│ │     Media Grid View      │ │ Type: Image/JPEG        ││
│ │     with selection       │ │ Size: 1.2 MB            ││
│ │                          │ │ Dimensions: 1200x800    ││
│ │                          │ │ Uploaded: 01/15/2024    ││
│ │                          │ │                         ││
│ │                          │ │ Metadata                ││
│ │                          │ │ ───────────────────     ││
│ │                          │ │ Title: [_____________]  ││
│ │                          │ │ Alt: [______________]   ││
│ │                          │ │ Desc: [_____________]   ││
│ │                          │ │                         ││
│ │                          │ │ Usage                   ││
│ │                          │ │ ───────────────────     ││
│ │                          │ │ Used in 3 content items ││
│ │                          │ │ [View Usage Details]    ││
│ │                          │ │                         ││
│ │                          │ │ [Delete] [Update]       ││
│ └──────────────────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Full-featured media management
- Grid view for visual browsing
- Detailed metadata viewing and editing
- Media usage tracking
- Bulk operations (select multiple, delete, tag)
- Advanced filtering and sorting
- Clear path back to content creation/editing

## Integration Approaches

### Within Content Creation/Editing

1. **Inline Selection Component**:
   - Displays recently used media and quick upload option
   - Minimal UI to keep focus on content creation
   - One-click selection process
   - Immediately expands selected media's properties

2. **Media Selection Dialog**:
   - Triggered by "Choose from Media" or "More..." options
   - Allows more comprehensive browsing without full context switch
   - Returns to exact same point in content form after selection

3. **Upload Components**:
   - Simplified upload within content form
   - More advanced upload in selection dialog
   - Full-featured upload in media library

### Media Library Access Points

1. **Global Navigation**:
   - Optional direct access to media library from main navigation
   - Not required for basic content workflows

2. **Content-to-Media Navigation**:
   - "Manage Media" button in content list actions
   - "Manage Media Library" link in media selection dialog
   - Media management icon in rich text editors

3. **Media-to-Content Navigation**:
   - "Back to Content" from media library
   - "Create Content with this Media" action on media items
   - Usage links showing which content uses selected media

## Technical Architecture

### Component Structure

```
MediaManagement/
├── Inline/
│   ├── InlineMediaSelector.tsx
│   ├── QuickMediaUploader.tsx
│   └── RecentMediaGallery.tsx
├── Dialog/
│   ├── MediaSelectionDialog.tsx
│   ├── MediaSelectionGrid.tsx
│   └── MediaUploadForm.tsx
└── Library/
    ├── MediaLibraryPage.tsx
    ├── MediaDetailPanel.tsx
    ├── MediaFilters.tsx
    ├── MediaGrid.tsx
    └── MediaUsageList.tsx
```

### State Management

1. **Shared Media State**:
   - Media selection state is accessible across all three levels
   - Upload progress tracking across contexts
   - Recently used media cache shared between components

2. **Context Preservation**:
   - Content form state preserved when navigating to media library
   - Filter/search preferences remembered between sessions
   - Selection state maintained across dialogs

## User Flows

### Content Creation with New Media

1. User starts content creation for image content
2. In the media section, user clicks "Upload"
3. User uploads new image through simplified uploader
4. User adds basic metadata (alt text, title)
5. Image is automatically selected for the content
6. User completes content creation form and saves

### Content Creation with Existing Media

1. User starts content creation
2. In media section, user sees recently used media and can select directly
3. If needed, user clicks "More..." to open selection dialog
4. User browses/searches for media in the dialog
5. User selects media and clicks "Select"
6. Dialog closes and selected media is added to content form
7. User completes content creation and saves

### Media Library Management

1. User clicks "Manage Media Library" from selection dialog
2. Media library opens with current filters/search preserved
3. User performs bulk operations or detailed metadata editing
4. User clicks "Back to Content" to return to content creation
5. Content form state is restored with any media changes applied

## Implementation Priority

1. **First Phase**:
   - Inline media selection with recently used display
   - Basic media selection dialog
   - Simple upload functionality
   - Grid view for media browsing

2. **Second Phase**:
   - Enhanced media selection dialog with filtering
   - Improved upload with progress tracking
   - Basic metadata editing
   - Advanced grid features (selection, hover states)

3. **Third Phase**:
   - Full media library implementation
   - Advanced filtering and search
   - Usage tracking and bulk operations
   - Consider list view implementation based on user feedback

## Next Steps

1. Implement core shared components needed for all levels
2. Build inline media selection for content creation forms
3. Create media selection dialog with grid view
4. Develop simplified upload experience with proper validation
5. Implement navigation between content and media contexts
6. Gather user feedback for future improvements including potential list view 