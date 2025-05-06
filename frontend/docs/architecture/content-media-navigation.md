# Content and Media Navigation Design

## Overview

This document outlines the navigation design between content creation/editing and media management in the Behavior Coach platform. Effective navigation is critical for maintaining context and providing a seamless user experience when working with content and associated media assets.

## Navigation Principles

1. **Contextual Awareness**: Navigation maintains user context between content and media workflows
2. **Minimal Disruption**: Transitions between contexts minimize disruption to workflow
3. **Consistent Patterns**: Similar navigation patterns are used throughout the application
4. **Progressive Disclosure**: Navigation options revealed based on current task context
5. **Clear Returns**: Obvious ways to return to previous context after navigation

## Navigation Map

The following diagram illustrates the primary navigation paths between content and media interfaces:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                     Main Navigation                        │
│                                                            │
└───────────────────────────┬─────────────────────────────┬──┘
                            │                             │
                 ┌──────────▼─────────────┐   ┌───────────▼──────────┐
                 │                        │   │                      │
                 │    Content Library     │   │    Media Library     │
                 │                        │   │                      │
                 └────┬─────────┬─────────┘   └─────────┬────────────┘
                      │         │                       │
          ┌───────────▼─┐   ┌───▼────────────┐    ┌─────▼───────────┐
┌─────────┤             │   │                │    │                 │
│         │Content Detail│   │Content Creation│    │Media Detail View│
│         │             │   │                │    │                 │
│         └──────┬──────┘   └───────┬────────┘    └────┬────────────┘
│                │                  │                   │
│                │   ┌──────────────▼───────────────┐   │
│                └───►                              ◄───┘
│                    │      Media Selection         │
│                    │          Dialog              │
│                    │                              │
│                    └──────────────┬───────────────┘
│                                   │
│                     ┌─────────────▼─────────────┐
└────────────────────►                            │
                      │     Media Upload Dialog   │
                      │                           │
                      └───────────────────────────┘
```

## Primary Navigation Paths

### 1. Content Library to Content Creation

**Access Points:**
- "Create Content" button in library header
- Content type-specific creation buttons

**Transition:**
- Clear indication of content type selection
- Content form initialization with default values
- Optional pre-selection of media based on context

### 2. Content Creation to Media Selection

**Access Points:**
- "Choose from Media" buttons in media sections
- Media selection zones in content forms
- "More..." options in inline media selectors

**Transition:**
- Content form state preserved
- Media selection dialog appears as modal overlay
- Recently used media prominently displayed
- Current content type context passed to media selection

### 3. Media Selection to Media Library

**Access Points:**
- "Manage Media Library" link in media selection dialog
- "Advanced Search" option in selection dialog

**Transition:**
- Content and selection context preserved
- Media library opens with current filters applied
- Clear return path to content creation

### 4. Media Library to Content Creation

**Access Points:**
- "Create Content with this Media" action on media items
- "Back to Content" when accessed from content creation

**Transition:**
- Media automatically selected in content form
- Content form restored with previous inputs
- Clear indication of which media was selected

### 5. Content Detail to Media Management

**Access Points:**
- "Manage Media" button in content details
- Media thumbnail click in content preview
- Edit media metadata option

**Transition:**
- Content context preserved
- Media detail panel opened with selected media
- Option to select different media

## Navigation Components

### 1. Breadcrumb Navigation

Displayed at the top of the page to show hierarchical context and provide navigation points.

```
┌────────────────────────────────────────────────────────────┐
│ Home > Content Library > Image Content > Edit > Media      │
└────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Tracks full navigation path
- Each segment is clickable
- Current location highlighted
- Truncates with ellipsis when space constrained

### 2. Navigation History State

Manages browser history for proper back/forward button functionality.

**Implementation:**
- Pushes new history state for main context changes
- Uses query parameters to track sub-contexts
- Handles direct URL access to specific states
- Preserves form data between navigation events

### 3. Context Indicators

Visual elements that indicate the current context and relationship to other areas.

**Implementation:**
- Location indicator in sidebar navigation
- Highlighted tabs for current section
- Page titles showing parent-child relationships
- Content type indicators in media interfaces

### 4. Transition Animations

Subtle animations that reinforce navigation direction and context changes.

**Implementation:**
- Slide transitions for horizontal navigation
- Fade transitions for modal overlays
- Scale transitions for expanding/collapsing sections
- Progress indicators for longer transitions

## Special Navigation Cases

### 1. Deep Linking to Media from Content

When a specific media asset needs to be accessed from content context:

```
┌────────────────────────────────────────────────────────────┐
│ Content Form                                               │
│                                                            │
│ ...                                                        │
│                                                            │
│ Selected Media:                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Image.jpg                                    [Change] │   │
│ │ ┌───────────────┐                                    │   │
│ │ │               │  Title: Beach Sunset       [Edit]  │   │
│ │ │   [Thumbnail] │  Alt: Sunset at the beach          │   │
│ │ │               │                                    │   │
│ │ │ [Details >]   │  [Update Media Metadata]           │   │
│ │ └───────────────┘                                    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
│ ...                                                        │
└────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Inline metadata editing for quick changes
- "Details" link opens media detail view with return path
- Changes to media immediately reflected in content preview

### 2. Batch Operations Across Contexts

When performing operations that affect both content and media:

```
┌────────────────────────────────────────────────────────────┐
│ Media Library                        [Back to Content List] │
│                                                            │
│ [✓] Select All  [Delete] [Tag] [Download]                  │
│                                                            │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │
│ │Media 1 │ │Media 2 │ │Media 3 │ │Media 4 │ ← Selected    │
│ │  [✓]   │ │  [✓]   │ │  [✓]   │ │  [ ]   │   media       │
│ └────────┘ └────────┘ └────────┘ └────────┘               │
│                                                            │
│ Content Using Selected Media:                              │
│ - Image Content A                                          │
│ - Image Content B                                          │
│ - Video Content C                                          │
│                                                            │
│ [Apply Changes to Content] [Apply Changes to Media Only]   │
└────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Shows content impact of media operations
- Provides options for scope of changes
- Confirms changes that affect multiple items
- Updates all relevant contexts after operation

### 3. Creation Flow Navigation

When creating content with new media in a single flow:

```
┌────────────────────────────────────────────────────────────┐
│ Create Image Content                                       │
│                                                            │
│ Step 1: Upload Media > Step 2: Edit Content > Step 3: Review│
│ ━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━      │
│                                                            │
│ [< Previous Step]                         [Next Step >]    │
└────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Step indicator shows progress in multi-step flows
- Previous/Next navigation maintains data between steps
- Option to save draft at any point
- Skip steps when appropriate (e.g., when media already selected)

## Mobile Navigation Considerations

For mobile interfaces, navigation is adapted to address limited screen space:

### 1. Bottom Navigation Bar

```
┌────────────────────────────────────────────────────────────┐
│ Content Creation                                           │
│                                                            │
│ ...                                                        │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│ │          │  │          │  │          │  │          │    │
│ │ Content  │  │  Media   │  │  Preview │  │   Save   │    │
│ │          │  │          │  │          │  │          │    │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Bottom tabs for primary navigation
- Swipe gestures for moving between sections
- Full-screen modal for media selection
- Slide-up panels for quick media options

### 2. Back Navigation Pattern

```
┌────────────────────────────────────────────────────────────┐
│ ← Media Selection                                          │
│                                                            │
│ ...                                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Consistent back button in top-left
- Swipe-back gesture support
- Breadcrumb collapsed to current location with back button
- Context title clearly displayed

## State Preservation Strategies

### 1. Form State Persistence

When navigating away from content forms:

**Implementation:**
- Auto-save to local draft when navigating
- Restore form state when returning
- Warning when leaving with unsaved changes
- Option to discard changes or continue editing

### 2. Selection State Preservation

When selecting media across different interfaces:

**Implementation:**
- Selection maintained in grid view
- Selected items highlighted clearly
- Count of selected items visible
- Clear all selection option easily accessible

### 3. Filter State Persistence

When setting filters in media selection:

**Implementation:**
- Filter settings maintained between dialog and library
- Last used filters remembered for user session
- Quick reset to default filters
- Filter state visible in UI

## Technical Approach

### 1. Route Configuration

```typescript
const routes = [
  {
    path: '/content',
    component: ContentLibrary,
    children: [
      { path: 'create/:type', component: ContentCreation },
      { path: ':id', component: ContentDetail },
      { path: ':id/edit', component: ContentEdit }
    ]
  },
  {
    path: '/media',
    component: MediaLibrary,
    children: [
      { path: ':id', component: MediaDetail }
    ]
  }
];
```

### 2. Navigation Context

```typescript
interface NavigationContext {
  previousPath: string;
  returnPath: string;
  contentId?: string;
  mediaId?: string;
  activeFilters?: FilterState;
  formState?: FormState;
  viewMode?: 'grid'; // Default to grid view
}
```

### 3. Navigation Service

```typescript
class NavigationService {
  // Navigate to media selection with content context
  navigateToMediaSelection(contentId: string, callback: (selectedMedia: MediaAsset) => void): void;

  // Return to content with selected media
  returnToContent(contentId: string, selectedMedia?: MediaAsset): void;
  
  // Navigate to full media library with return path
  navigateToMediaLibrary(returnPath: string, filters?: FilterState): void;
  
  // Create new content with pre-selected media
  createContentWithMedia(mediaId: string, contentType: ContentType): void;
}
```

## Next Steps

1. Implement core navigation components (breadcrumbs, history management)
2. Create context-aware navigation service
3. Build navigation state persistence mechanism for grid view
4. Develop mobile-specific navigation adaptations
5. Implement deep linking and specialized navigation cases
6. Gather user feedback on workflow experience for future list view implementation 