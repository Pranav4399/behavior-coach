# Content Creation Workflow Design

## Overview

This document outlines the unified content creation workflow with integrated media handling for the Behavior Coach platform. The workflow is designed to provide a seamless experience for creating various content types while handling media assets efficiently.

## Core Principles

1. **Media-First When Appropriate**: For media-based content types (image, video, audio, document), the workflow encourages uploading or selecting media first, then enhancing with metadata.

2. **Integrated Yet Accessible**: Media handling is directly integrated into content creation flows, with access to more advanced media management when needed.

3. **Type-Specific Optimizations**: Each content type has optimized creation paths while maintaining consistency.

4. **Progressive Disclosure**: Complex options are revealed progressively to keep the interface simple initially.

5. **Consistent Validation**: Validation rules are applied consistently across all content types and follow backend requirements.

## Workflow Diagrams

### 1. Main Content Creation Flow

```
User starts
   │
   ▼
Select Content Type
   │
   ├─── Text Content ──────┐
   │                       ▼
   │                    Text Editor
   │                       │
   │                       ▼
   │                 Add Metadata
   │                       │
   │                       ▼
   │                    Preview
   │                       │
   │                       ▼
   │                      Save
   │
   ├─── Image Content ─────┐
   │                       ▼
   │                Upload/Select Image ◄─── Access Media Library
   │                       │                      │
   │                       ▼                      │
   │                 Add Caption/Alt             │
   │                       │                      │
   │                       ▼                      │
   │                 Add Metadata                │
   │                       │                      │
   │                       ▼                      │
   │                    Preview                  │
   │                       │                      │
   │                       ▼                      │
   │                      Save                   │
   │                                             │
   ├─── Video Content ─────┐                      │
   │                       ▼                      │
   │                Upload/Select Video ◄─────────┘
   │                       │
   │                       ▼
   │                Add Transcript
   │                       │
   │                       ▼
   │                 Add Metadata
   │                       │
   │                       ▼
   │                    Preview
   │                       │
   │                       ▼
   │                      Save
   │
   └─── [Other Types] ─────┐
                           ▼
                      Type-specific
                         Flow
                           │
                           ▼
                          Save
```

### 2. Media Selection/Upload Sub-Flow

```
Media Needed
      │
      ▼
┌─────────────────┐
│   Choose Mode   │
└─────────────────┘
      │
      ├─── Upload New ───┐
      │                  ▼
      │             Drag & Drop
      │                  │
      │                  ▼
      │           Validate Format
      │                  │
      │                  ▼
      │           Validate Size
      │                  │
      │                  ▼
      │           Upload Progress
      │                  │
      │                  ▼
      │           Add Media Metadata
      │                  │
      │                  ▼
      │           Return Media ID
      │
      └─── Select Existing ───┐
                              ▼
                         Filter/Search
                              │
                              ▼
                         Browse Grid
                              │
                              ▼
                         Preview Media
                              │
                              ▼
                          Select
                              │
                              ▼
                        Return Media ID
```

### 3. Navigation Between Content and Media Management

```
Content Module
      │
      ├─── Content Creation ───┐
      │                        ▼
      │                 Need Media Mgmt?
      │                        │
      │                        ├─── No
      │                        │
      │                        └─── Yes ───┐
      │                                    ▼
      │                             Quick Access Menu
      │                                    │
      │                                    ▼
      │                              Media Manager
      │                                    │
      │                                    ▼
      │                          Return to Content
      │
      └─── Content Library ────┐
                               ▼
                          View Content
                               │
                               ▼
                          Edit Content
                               │
                               ▼
                        Manage Media ───────┐
                                            ▼
                                      Media Manager
                                            │
                                            ▼
                                    Return to Content
```

## Content Type-Specific Workflows

### Text Content Workflow
1. User selects "Text Content" type
2. Rich text editor appears with formatting tools
3. User enters and formats text
4. User adds metadata (title, description, tags)
5. User previews content (including WhatsApp preview)
6. User saves as draft or publishes

### Image Content Workflow
1. User selects "Image Content" type
2. User uploads new image or selects from media library
3. If uploading:
   - Drag-drop or file-select dialog appears
   - Image is validated for format and size
   - Upload progress is shown
   - Basic metadata (alt text, caption) is requested
4. User adds content metadata (title, description, tags)
5. User previews content (including WhatsApp preview)
6. User saves as draft or publishes

### Video Content Workflow
1. User selects "Video Content" type
2. User uploads new video or selects from media library
3. If uploading:
   - Drag-drop or file-select dialog appears
   - Video is validated for format and size
   - Upload progress is shown
   - Thumbnail is auto-generated with option to customize
4. User adds transcript (optional)
5. User adds content metadata (title, description, tags)
6. User previews content (including WhatsApp preview)
7. User saves as draft or publishes

### Audio Content Workflow
1. User selects "Audio Content" type
2. User uploads new audio or selects from media library
3. If uploading:
   - Drag-drop or file-select dialog appears
   - Audio is validated for format and size
   - Upload progress is shown
4. User adds transcript (optional)
5. User adds content metadata (title, description, tags)
6. User previews content (including WhatsApp preview)
7. User saves as draft or publishes

### Document Content Workflow
1. User selects "Document Content" type
2. User uploads new document or selects from media library
3. If uploading:
   - Drag-drop or file-select dialog appears
   - Document is validated for format and size
   - Upload progress is shown
4. User adds document description
5. User adds content metadata (title, description, tags)
6. User previews content summary
7. User saves as draft or publishes

## Media Management Integration

### Quick Access to Media Management
- From any content creation screen, a "Manage Media" button provides access to the media library
- Media Library appears as a modal or side panel, allowing quick browsing without losing content editing context
- After selecting or managing media, user returns to the exact point in content creation

### Media Selection Component
- Appears whenever media selection is required
- Shows recently used media at the top for quick access
- Provides filtering by type, search by name/tags
- Thumbnail grid view with hover previews
- Option to upload new media directly from this interface

## Validation Rules

### Media Validation
- Images: JPEG, PNG, WebP formats; max 5MB; max dimensions 2000x2000px
- Videos: MP4, WebM formats; max 16MB for WhatsApp compatibility; max 3 minutes
- Audio: MP3, WAV, OGG formats; max 16MB; max 5 minutes
- Documents: PDF, DOCX formats; max 20MB

### Content Validation
- Title: Required, 3-100 characters
- Description: Optional, max 500 characters
- All content must have at least one tag
- Type-specific validations (e.g., text content must not be empty)

## User Experience Considerations

### Progressive Loading
- Media upload and processing happens in the background when possible
- Content form remains accessible during upload/processing
- Clear progress indicators show status without blocking the entire interface

### Error Recovery
- Validation errors are shown inline next to relevant fields
- Upload failures provide retry options
- Autosave prevents loss of work in progress

### Accessibility
- All media requires alternative text or descriptions
- Keyboard navigation throughout the entire workflow
- Screen reader compatible form controls and media selection

## Technical Implementation Notes

### State Management
- Content creation state maintained in a context/store
- Media upload state tracked separately to avoid blocking content editing
- Form state uses controlled components with validation

### API Integration
- Media upload uses multipart form data with progress tracking
- Content creation uses JSON payload with media references
- Separate API endpoints for media and content with error handling

### Performance Considerations
- Lazy loading of heavy components (rich text editor, media selector)
- Image optimization during upload process
- Pagination for media library browsing 