# Content Management System Component Architecture

## Overview

This document outlines the component architecture for the Behavior Coach platform's content management system. The architecture follows a modular, composable approach with clear separation of concerns while maintaining cohesive user experiences.

## Architecture Principles

1. **Component Composition**: Complex interfaces built from smaller, reusable components
2. **Separation of Concerns**: Clear boundaries between UI, state management, and business logic
3. **Single Responsibility**: Each component has a defined purpose and scope
4. **Progressive Enhancement**: Basic functionality with optional advanced features
5. **Consistent Patterns**: Similar interfaces follow the same patterns across the application

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Pages                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Content     │ │ Content     │ │ Content Creation &  │   │
│  │ Library     │ │ Detail      │ │ Editing             │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│         │              │                   │                │
│         ▼              ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Feature Modules                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ Content     │ │ Media       │ │ Content     │   │   │
│  │  │ Library     │ │ Management  │ │ Editors     │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │         │              │                │          │   │
│  │         ▼              ▼                ▼          │   │
│  │  ┌─────────────────────────────────────────────┐  │   │
│  │  │                                             │  │   │
│  │  │  Shared Components                          │  │   │
│  │  │  ┌─────────────┐ ┌─────────────────────┐   │  │   │
│  │  │  │ UI Elements │ │ Functional Components│   │  │   │
│  │  │  └─────────────┘ └─────────────────────┘   │  │   │
│  │  │                                             │  │   │
│  │  └─────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Services & Hooks                                   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ API Services│ │ State Hooks │ │ Utility     │   │   │
│  │  │             │ │             │ │ Functions   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Categories

### Pages

These are top-level route components that compose feature modules to create complete pages.

- **ContentLibraryPage**: Main content browsing and management page
- **ContentDetailPage**: Displays details of a specific content item
- **ContentCreationPage**: Creates new content items
- **ContentEditPage**: Edits existing content items
- **MediaManagementPage**: Accessed within the content module for media management

### Feature Modules

Reusable, self-contained features that can be composed into pages.

#### Content Library Module

- **ContentLibraryHeader**: Search, filtering, and view controls
- **ContentGrid**: Grid view of content items
- **ContentTable**: Table view of content items
- **ContentListItem**: Individual content item in list/grid
- **ContentFilter**: Advanced filtering panel
- **ContentSorter**: Sorting controls
- **ContentPagination**: Pagination controls

#### Media Management Module

- **MediaLibraryHeader**: Search, filtering, and view controls for media
- **MediaGrid**: Grid view of media assets
- **MediaDetailPanel**: View and edit media asset details
- **MediaUploader**: File upload with validation and progress
- **MediaSelector**: Component for selecting existing media
- **MediaFilter**: Filtering options for media assets
- **MediaUsageList**: Shows where media is used across content

#### Content Editor Module

- **ContentTypeSelector**: Selects the type of content to create
- **ContentEditorBase**: Base component for all content editors
- **ContentMetadataEditor**: Edit title, description, status, tags
- **TextContentEditor**: Rich text editing
- **ImageContentEditor**: Image content editing with media selection
- **VideoContentEditor**: Video content editing with media selection
- **AudioContentEditor**: Audio content editing with media selection
- **DocumentContentEditor**: Document content editing with media selection
- **QuizContentEditor**: Quiz creation and editing
- **ReflectionContentEditor**: Reflection content creation
- **TemplateContentEditor**: Template content creation

### Shared Components

#### UI Elements (built on shadcn/ui)

- **Button**: Various button styles
- **Input**: Text input fields
- **Select**: Dropdown selection
- **Checkbox**: Checkboxes
- **RadioGroup**: Radio button groups
- **Tabs**: Tabbed interfaces
- **Card**: Card containers
- **Dialog**: Modal dialogs
- **Tooltip**: Tooltips
- **Badge**: Status badges
- **Toast**: Notification toasts

#### Functional Components

- **WhatsAppPreview**: Preview content as it will appear in WhatsApp
- **MediaPreview**: Preview different media types
- **DropZone**: Drag and drop file upload area
- **ProgressBar**: Upload/processing progress indicator
- **TagInput**: Tag creation and selection
- **SearchBar**: Search input with suggestions
- **SortableList**: Drag-to-reorder lists
- **ErrorDisplay**: Standardized error display
- **LoadingSpinner**: Loading indicators

### Services & Hooks

#### API Services

- **BaseApiService**: Common functionality for API calls
- **ContentService**: Content CRUD operations
- **MediaService**: Media asset operations
- **TagService**: Tag management operations
- **AuthService**: Authentication and authorization

#### State Hooks

- **useContent**: Content data and operations
- **useMediaAssets**: Media asset data and operations
- **useContentForm**: Form state for content creation/editing
- **useMediaUpload**: Media upload state and operations
- **useContentFilters**: Content filtering state
- **useContentPagination**: Pagination state for content lists

#### Utility Functions

- **mediaUtils**: Media handling utilities
- **validationUtils**: Form validation utilities
- **formatUtils**: Data formatting utilities
- **urlUtils**: URL handling utilities

## Component Hierarchy

### Content Library Page
```
ContentLibraryPage
├── ContentLibraryHeader
│   ├── SearchBar
│   ├── ContentFilter
│   └── ViewToggle (Grid/Table)
├── ContentGrid / ContentTable
│   └── ContentListItem (multiple)
│       ├── ContentTypeIcon
│       ├── StatusBadge
│       └── ContentActions
└── ContentPagination
```

### Content Detail Page
```
ContentDetailPage
├── ContentDetailHeader
│   ├── ContentTypeIcon
│   ├── StatusBadge
│   └── ActionButtons
├── ContentBody (type-specific)
│   └── MediaPreview (if applicable)
└── ContentMetadataSidebar
    ├── CreationInfo
    ├── TagsList
    └── UsageStats
```

### Content Creation Page
```
ContentCreationPage
├── ContentTypeSelector (initial only)
└── ContentEditor (type-specific)
    ├── ContentEditorBase
    │   ├── ContentMetadataEditor
    │   └── Type-specific editor (one of):
    │       ├── TextContentEditor
    │       ├── ImageContentEditor
    │       │   ├── MediaSelector / MediaUploader
    │       │   └── ImageMetadataForm
    │       ├── VideoContentEditor
    │       ├── AudioContentEditor
    │       ├── DocumentContentEditor
    │       ├── QuizContentEditor
    │       ├── ReflectionContentEditor
    │       └── TemplateContentEditor
    └── WhatsAppPreview
```

### Media Management Components
```
MediaManagement
├── MediaLibraryHeader
│   ├── SearchBar
│   ├── MediaFilter
│   └── UploadButton
├── MediaGrid
│   └── MediaGridItem (multiple)
│       ├── MediaThumbnail
│       ├── MediaTypeIcon
│       └── MediaActions
└── MediaDetailPanel (when item selected)
    ├── MediaPreview
    ├── MediaMetadataForm
    └── MediaUsageList
```

## State Management

### Content State
- Global content list state for browsing
- Local content detail state for viewing/editing
- Form state for content creation/editing

### Media State
- Media upload state (progress, errors, metadata)
- Media selection state for content editors
- Media list state for browsing

### UI State
- Current view modes (grid/list)
- Filter and sort preferences
- Pagination state
- Selection state (for bulk operations)

## Component Communication Patterns

1. **Parent-Child Props**: For direct parent-child relationships
2. **Context API**: For deeper component hierarchies
3. **Custom Hooks**: For shared state and behavior
4. **Event-Based**: For cross-component communication

## Reusability Strategy

1. **Composition**: Build complex components from smaller, reusable ones
2. **Higher-Order Components**: Enhance components with shared functionality
3. **Render Props**: Share behavior between components
4. **Custom Hooks**: Share stateful logic between components

## Implementation Guidelines

1. **File Structure**:
   ```
   /src
     /components
       /ui               # Base UI components
       /content          # Content-specific components
         /library        # Content library components
         /editors        # Content editors
         /detail         # Content detail components
       /media            # Media-related components
       /shared           # Shared components
     /hooks              # Custom hooks
     /services           # API services
     /utils              # Utility functions
     /pages              # Page components
   ```

2. **Naming Conventions**:
   - Components: PascalCase (e.g., ContentEditor)
   - Hooks: camelCase with "use" prefix (e.g., useMediaUpload)
   - Services: camelCase with "Service" suffix (e.g., contentService)
   - Utils: camelCase (e.g., formatDateTime)

3. **Component Documentation**:
   - Each component should have:
     - Brief description
     - Props interface
     - Usage examples
     - Known limitations

4. **Testing Strategy**:
   - Unit tests for individual components
   - Integration tests for component combinations
   - E2E tests for critical user flows

## Accessibility Considerations

1. **Keyboard Navigation**: All components should be fully keyboard accessible
2. **Screen Reader Support**: ARIA attributes and semantic HTML
3. **Focus Management**: Proper focus handling in modals and dynamic content
4. **Color Contrast**: Ensure sufficient contrast for all text and UI elements

## Performance Considerations

1. **Lazy Loading**: Load components only when needed
2. **Memoization**: Prevent unnecessary re-renders
3. **Code Splitting**: Split code along route boundaries
4. **Virtual Rendering**: For long lists of content or media items 