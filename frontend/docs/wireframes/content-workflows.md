# Content Workflow Wireframes

This document contains wireframe descriptions for the main content workflows in the Behavior Coach platform's content management system. These wireframes illustrate the user interfaces and interactions for creating, editing, and managing different content types.

## Content Library Page

```
┌────────────────────────────────────────────────────────────────────┐
│ Content Library                                       [+ Create]    │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ ┌─────────┐ [Search content...]        [Filter ▼]               ││
│ │ │ All     │                                                     ││
│ │ │ Text    │                                                     ││
│ │ │ Image   │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        ││
│ │ │ Video   │ │Content1│ │Content2│ │Content3│ │Content4│        ││
│ │ │ Audio   │ │        │ │        │ │        │ │        │        ││
│ │ │ Document│ │[Status]│ │[Status]│ │[Status]│ │[Status]│        ││
│ │ └─────────┘ └────────┘ └────────┘ └────────┘ └────────┘        ││
│ │                                                                 ││
│ │             ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        ││
│ │             │Content5│ │Content6│ │Content7│ │Content8│        ││
│ │             │        │ │        │ │        │ │        │        ││
│ │             │[Status]│ │[Status]│ │[Status]│ │[Status]│        ││
│ │             └────────┘ └────────┘ └────────┘ └────────┘        ││
│ │                                                                 ││
│ │ [< Prev]                         [1][2][3][4][5][...] [Next >] ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Side navigation for content types
- Search bar for finding content
- Filter dropdown for additional filtering (status, date, tags)
- Grid view of content with cards
- Content cards showing title, type icon, status badge
- Pagination controls
- Create button for adding new content

## Content Type Selection Dialog

```
┌────────────────────────────────────────────────────┐
│ Create New Content                      [X]        │
│ ─────────────────────────────────────────          │
│                                                    │
│  Select the type of content you want to create:    │
│                                                    │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │  Text   │   │  Image  │   │  Video  │          │
│  │ Content │   │ Content │   │ Content │          │
│  │   [A]   │   │   [📷]  │   │   [🎬]  │          │
│  └─────────┘   └─────────┘   └─────────┘          │
│                                                    │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │  Audio  │   │Document │   │  Quiz   │          │
│  │ Content │   │ Content │   │ Content │          │
│  │   [🔊]  │   │   [📄]  │   │   [❓]  │          │
│  └─────────┘   └─────────┘   └─────────┘          │
│                                                    │
│          [Cancel]                                  │
└────────────────────────────────────────────────────┘
```

### Key Features:
- Clear type options with descriptive icons
- Grid layout for visual selection
- Each type card shows icon and label
- Cancel option to return to content library

## Text Content Creation Page

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Library   Create Text Content         [Draft ▼] [Save]   │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ [Edit] [Preview]                                                ││
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────┐││
│ │ │                             │ │        WhatsApp Preview     │││
│ │ │ Title: [________________]   │ │ ┌─────────────────────────┐ │││
│ │ │                             │ │ │                         │ │││
│ │ │ Description:                │ │ │  ┌─────────────────┐    │ │││
│ │ │ [_______________________]   │ │ │  │                 │    │ │││
│ │ │ [_______________________]   │ │ │  │  Text content   │    │ │││
│ │ │                             │ │ │  │  appears here   │    │ │││
│ │ │ Content:                    │ │ │  │  with styling   │    │ │││
│ │ │ [Bold][Italic][Link][...]   │ │ │  │                 │    │ │││
│ │ │ [_______________________]   │ │ │  └─────────────────┘    │ │││
│ │ │ [_______________________]   │ │ │  12:30 PM ✓✓            │ │││
│ │ │ [_______________________]   │ │ │                         │ │││
│ │ │                             │ │ └─────────────────────────┘ │││
│ │ │ Tags:                       │ │                             │││
│ │ │ [Add tag +] [Tag1][Tag2]    │ │                             │││
│ │ │                             │ │                             │││
│ │ └─────────────────────────────┘ └─────────────────────────────┘││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Edit/Preview tabs
- Form for title, description, and content
- Rich text editor with formatting controls
- Tags input with autocomplete
- WhatsApp preview showing how content will appear
- Status selector (Draft, Review, Published)
- Save button with loading state

## Image Content Creation Page

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Library   Create Image Content        [Draft ▼] [Save]   │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ [Edit] [Preview]                                                ││
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────┐││
│ │ │                             │ │        WhatsApp Preview     │││
│ │ │ Title: [________________]   │ │ ┌─────────────────────────┐ │││
│ │ │                             │ │ │                         │ │││
│ │ │ Description:                │ │ │  ┌─────────────────┐    │ │││
│ │ │ [_______________________]   │ │ │  │                 │    │ │││
│ │ │ [_______________________]   │ │ │  │    [Image]      │    │ │││
│ │ │                             │ │ │  │                 │    │ │││
│ │ │ Image:                      │ │ │  │                 │    │ │││
│ │ │ ┌─────────────────────────┐ │ │ │  │                 │    │ │││
│ │ │ │                         │ │ │ │  └─────────────────┘    │ │││
│ │ │ │  [Drop image here or]   │ │ │ │                         │ │││
│ │ │ │  [Choose from Media]    │ │ │ │  Caption here           │ │││
│ │ │ │                         │ │ │ │  12:30 PM ✓✓            │ │││
│ │ │ └─────────────────────────┘ │ │ │                         │ │││
│ │ │                             │ │ └─────────────────────────┘ │││
│ │ │ Alt Text: [_____________]   │ │                             │││
│ │ │ Caption:  [_____________]   │ │                             │││
│ │ │                             │ │                             │││
│ │ │ Tags:                       │ │                             │││
│ │ │ [Add tag +] [Tag1][Tag2]    │ │                             │││
│ │ │                             │ │                             │││
│ │ └─────────────────────────────┘ └─────────────────────────────┘││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Edit/Preview tabs
- Form for title and description
- Image upload area with drag-and-drop
- Option to select from existing media
- Alt text and caption fields for accessibility
- Tags input with autocomplete
- WhatsApp preview showing how image will appear
- Status selector and save button

## Content Detail Page

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Library   Content Title               [Edit] [Delete]    │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ ┌───────────────────────────────┐ ┌─────────────────────────┐  ││
│ │ │                               │ │ Metadata                │  ││
│ │ │                               │ │ ────────────────────    │  ││
│ │ │                               │ │ Status:    [Badge]      │  ││
│ │ │       Content Preview         │ │ Created:   01/15/2024   │  ││
│ │ │       (Type-specific)         │ │ Modified:  01/16/2024   │  ││
│ │ │                               │ │ Created by: John Doe    │  ││
│ │ │                               │ │                         │  ││
│ │ │                               │ │ Tags                    │  ││
│ │ │                               │ │ ────────────────────    │  ││
│ │ │                               │ │ [Tag1] [Tag2] [Tag3]    │  ││
│ │ │                               │ │                         │  ││
│ │ │                               │ │ Usage Stats             │  ││
│ │ │                               │ │ ────────────────────    │  ││
│ │ │                               │ │ Programs: 3             │  ││
│ │ │                               │ │ Views: 145              │  ││
│ │ │                               │ │ Last used: 01/10/2024   │  ││
│ │ └───────────────────────────────┘ └─────────────────────────┘  ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Back navigation to content library
- Edit and delete actions
- Content preview area that adapts to content type
- Metadata sidebar with creation info, tags, and usage stats
- Status badge showing current state

## Media Selection Dialog

```
┌────────────────────────────────────────────────────────────────────┐
│ Select Media                                       [X]             │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ ┌─────────────────────────────────────────────────────────────┐ ││
│ │ │ [Search media...]         [Type ▼] [Sort ▼] [Upload New +]  │ ││
│ │ └─────────────────────────────────────────────────────────────┘ ││
│ │                                                                 ││
│ │ Recently Used                                                   ││
│ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                    ││
│ │ │Media 1 │ │Media 2 │ │Media 3 │ │Media 4 │                    ││
│ │ └────────┘ └────────┘ └────────┘ └────────┘                    ││
│ │                                                                 ││
│ │ All Media                                                       ││
│ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        ││
│ │ │Media 1 │ │Media 2 │ │Media 3 │ │Media 4 │ │Media 5 │        ││
│ │ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        ││
│ │                                                                 ││
│ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        ││
│ │ │Media 6 │ │Media 7 │ │Media 8 │ │Media 9 │ │Media 10│        ││
│ │ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        ││
│ │                                                                 ││
│ │ [< Prev]                         [1][2][3][4][5] [Next >]      ││
│ │                                                                 ││
│ │                    [Cancel]    [Select]                         ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Search and filter options for finding media
- Upload button to add new media
- Recently used section for quick access
- Grid view of available media assets
- Pagination for browsing large collections
- Select and cancel buttons
- Clicking media item toggles selection

## Media Upload Dialog

```
┌────────────────────────────────────────────────────────────────────┐
│ Upload Media                                      [X]              │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ ┌─────────────────────────────────────────────────────────────┐ ││
│ │ │                                                             │ ││
│ │ │                      Drag & Drop Files                      │ ││
│ │ │                              or                             │ ││
│ │ │                    [Choose Files] button                    │ ││
│ │ │                                                             │ ││
│ │ │ Accepted formats: JPEG, PNG, WebP, MP4, MP3, PDF, DOCX      │ ││
│ │ │ Maximum file size: 16MB for videos, 5MB for images          │ ││
│ │ │                                                             │ ││
│ │ └─────────────────────────────────────────────────────────────┘ ││
│ │                                                                 ││
│ │ ┌─────────────────────────────────────────────────────────────┐ ││
│ │ │ File: example.jpg (1.2MB)                              [X]  │ ││
│ │ │ [====================] 75%                                   │ ││
│ │ └─────────────────────────────────────────────────────────────┘ ││
│ │                                                                 ││
│ │ ┌─────────────────────────────────────────────────────────────┐ ││
│ │ │ Title: [________________]                                    │ ││
│ │ │ Alt Text: [_______________]                                  │ ││
│ │ │ Description: [___________________]                           │ ││
│ │ └─────────────────────────────────────────────────────────────┘ ││
│ │                                                                 ││
│ │                [Cancel]    [Upload]                             ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Drag and drop area for files
- File browser button alternative
- Clear format and size constraints
- Upload progress indicator
- Metadata form for title, alt text, description
- Cancel and upload buttons

## Video Content Creation Page

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Library   Create Video Content        [Draft ▼] [Save]   │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ [Edit] [Preview]                                                ││
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────┐││
│ │ │                             │ │        WhatsApp Preview     │││
│ │ │ Title: [________________]   │ │ ┌─────────────────────────┐ │││
│ │ │                             │ │ │                         │ │││
│ │ │ Description:                │ │ │  ┌─────────────────┐    │ │││
│ │ │ [_______________________]   │ │ │  │                 │    │ │││
│ │ │ [_______________________]   │ │ │  │    [Video]      │    │ │││
│ │ │                             │ │ │  │      ▶          │    │ │││
│ │ │ Video:                      │ │ │  │                 │    │ │││
│ │ │ ┌─────────────────────────┐ │ │ │  │                 │    │ │││
│ │ │ │                         │ │ │ │  └─────────────────┘    │ │││
│ │ │ │  [Drop video here or]   │ │ │ │                         │ │││
│ │ │ │  [Choose from Media]    │ │ │ │  Caption here           │ │││
│ │ │ │                         │ │ │ │  12:30 PM ✓✓            │ │││
│ │ │ └─────────────────────────┘ │ │ │                         │ │││
│ │ │                             │ │ └─────────────────────────┘ │││
│ │ │ Caption:     [_____________]│ │                             │││
│ │ │ Transcript:                 │ │                             │││
│ │ │ [_______________________]   │ │                             │││
│ │ │ [_______________________]   │ │                             │││
│ │ │                             │ │                             │││
│ │ │ Tags:                       │ │                             │││
│ │ │ [Add tag +] [Tag1][Tag2]    │ │                             │││
│ │ │                             │ │                             │││
│ │ └─────────────────────────────┘ └─────────────────────────────┘││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Similar layout to image content creation
- Video upload area with drag-and-drop
- Caption and transcript fields
- Video-specific constraints (duration, size)
- WhatsApp preview showing how video will appear
- Tags input with autocomplete

## Audio Content Creation Page

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Library   Create Audio Content        [Draft ▼] [Save]   │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ [Edit] [Preview]                                                ││
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────┐││
│ │ │                             │ │        WhatsApp Preview     │││
│ │ │ Title: [________________]   │ │ ┌─────────────────────────┐ │││
│ │ │                             │ │ │                         │ │││
│ │ │ Description:                │ │ │  ┌─────────────────┐    │ │││
│ │ │ [_______________________]   │ │ │  │                 │    │ │││
│ │ │ [_______________________]   │ │ │  │    [Audio]      │    │ │││
│ │ │                             │ │ │  │     ▶ 0:00      │    │ │││
│ │ │ Audio:                      │ │ │  │                 │    │ │││
│ │ │ ┌─────────────────────────┐ │ │ │  │                 │    │ │││
│ │ │ │                         │ │ │ │  └─────────────────┘    │ │││
│ │ │ │  [Drop audio here or]   │ │ │ │                         │ │││
│ │ │ │  [Choose from Media]    │ │ │ │  Caption here           │ │││
│ │ │ │                         │ │ │ │  12:30 PM ✓✓            │ │││
│ │ │ └─────────────────────────┘ │ │ │                         │ │││
│ │ │                             │ │ └─────────────────────────┘ │││
│ │ │ Caption:     [_____________]│ │                             │││
│ │ │ Transcript:                 │ │                             │││
│ │ │ [_______________________]   │ │                             │││
│ │ │ [_______________________]   │ │                             │││
│ │ │                             │ │                             │││
│ │ │ Tags:                       │ │                             │││
│ │ │ [Add tag +] [Tag1][Tag2]    │ │                             │││
│ │ │                             │ │                             │││
│ │ └─────────────────────────────┘ └─────────────────────────────┘││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Similar layout to video content creation
- Audio upload area with drag-and-drop
- Caption and transcript fields
- Audio-specific constraints (duration, format)
- WhatsApp preview showing audio player
- Tags input with autocomplete

## Document Content Creation Page

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back to Library   Create Document Content     [Draft ▼] [Save]   │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ [Edit] [Preview]                                                ││
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────┐││
│ │ │                             │ │        WhatsApp Preview     │││
│ │ │ Title: [________________]   │ │ ┌─────────────────────────┐ │││
│ │ │                             │ │ │                         │ │││
│ │ │ Description:                │ │ │  ┌─────────────────┐    │ │││
│ │ │ [_______________________]   │ │ │  │                 │    │ │││
│ │ │ [_______________________]   │ │ │  │  [Document]     │    │ │││
│ │ │                             │ │ │  │     📄          │    │ │││
│ │ │ Document:                   │ │ │  │                 │    │ │││
│ │ │ ┌─────────────────────────┐ │ │ │  │                 │    │ │││
│ │ │ │                         │ │ │ │  └─────────────────┘    │ │││
│ │ │ │  [Drop document here or]│ │ │ │                         │ │││
│ │ │ │  [Choose from Media]    │ │ │ │  Document Name.pdf      │ │││
│ │ │ │                         │ │ │ │  12:30 PM ✓✓            │ │││
│ │ │ └─────────────────────────┘ │ │ │                         │ │││
│ │ │                             │ │ └─────────────────────────┘ │││
│ │ │ Document Name: [__________] │ │                             │││
│ │ │ Summary:                    │ │                             │││
│ │ │ [_______________________]   │ │                             │││
│ │ │ [_______________________]   │ │                             │││
│ │ │                             │ │                             │││
│ │ │ Tags:                       │ │                             │││
│ │ │ [Add tag +] [Tag1][Tag2]    │ │                             │││
│ │ │                             │ │                             │││
│ │ └─────────────────────────────┘ └─────────────────────────────┘││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### Key Features:
- Document upload area with drag-and-drop
- Document name and summary fields
- Document-specific constraints (file type, size)
- WhatsApp preview showing document representation
- Tags input with autocomplete

## Next Steps

These wireframes will guide the implementation of the user interfaces for the content management system. The next steps include:

1. Creating detailed component specifications based on these wireframes
2. Implementing the grid view UI components according to the specifications
3. Connecting the UI to the API services for data operations
4. Testing the workflows with real users
5. Later phase: Consider implementing list view based on user feedback and advanced sorting/filtering needs 