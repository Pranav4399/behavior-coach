# ABCD Behavior Coach - Content Management System

## 1. Overview

The Content Management System (CMS) is a core component of the ABCD Behavior Coach platform, enabling the creation, organization, and delivery of educational and behavioral change content to workers through WhatsApp and other channels. This document provides a comprehensive guide to the content management frontend implementation, including page designs, component specifications, API integrations, and user workflows.

### 1.1 Purpose and Goals

The Content Management System serves several key purposes within the platform:

1. **Enable Knowledge Capture**: Allow organizations to create and structure educational content
2. **Support Behavior Change**: Facilitate the creation of content that drives behavior change and skill development
3. **Ensure Consistency**: Maintain consistent messaging and branding across communication
4. **Optimize Delivery**: Format content appropriately for delivery via WhatsApp and other channels
5. **Enable Sharing**: Allow content to be shared, reused, and potentially monetized through the Marketplace

### 1.2 Design Principles

The Content Management System is designed according to these guiding principles:

1. **User-Centered**: Intuitive interfaces that accommodate users with varying levels of technical expertise
2. **Modularity**: Content is created as reusable modules that can be assembled into journeys and programs
3. **Flexibility**: Support for diverse content types and formats to address different learning needs
4. **Accessibility**: Content creation tools that promote the development of accessible materials
5. **Efficiency**: Streamlined workflows that minimize the time required to create and manage content

## 2. Content Types

The platform supports several content types to accommodate different learning styles and engagement strategies:

### 2.1 Text Content

Text content forms the foundation of most educational materials in the platform.

#### 2.1.1 Structure and Properties

- **Title**: Descriptive name for the content (required)
- **Body Text**: Main textual content, supporting basic formatting (required)
- **Summary**: Brief description for content library display (optional)
- **Metadata**: Tags, categories, language, target audience (optional)

#### 2.1.2 Formatting Capabilities

The text editor supports:
- Basic formatting (bold, italic, underline)
- Lists (ordered and unordered)
- Headings and subheadings
- Hyperlinks (with careful consideration for WhatsApp limitations)
- Variables for personalization (e.g., `{{worker_name}}`)

#### 2.1.3 Implementation Considerations

- Editor should enforce WhatsApp character limits (1,000 characters per message)
- Support for message splitting for longer content
- Preview mode to show how text will appear in WhatsApp

### 2.2 Media Content

Media content enables richer communication through visual and audio elements.

#### 2.2.1 Image Content

**Structure and Properties:**
- **Title**: Descriptive name for the image (required)
- **Image File**: The actual image asset (required, formats: JPG, PNG, WebP)
- **Alt Text**: Description for accessibility (required)
- **Caption**: Text to display with the image (optional)
- **Metadata**: Tags, categories, language (optional)

**Implementation Considerations:**
- Enforce WhatsApp image size limits (max 5MB)
- Provide cropping and basic editing tools
- Generate optimized versions for different contexts
- Consider bandwidth limitations for target audiences

#### 2.2.2 Video Content

**Structure and Properties:**
- **Title**: Descriptive name for the video (required)
- **Video File**: The actual video asset (required, formats: MP4, 3GP)
- **Thumbnail**: Preview image (auto-generated or custom)
- **Caption**: Text to display with the video (optional)
- **Transcript**: Text version of audio content for accessibility (optional)
- **Metadata**: Tags, categories, language (optional)

**Implementation Considerations:**
- Enforce WhatsApp video size limits (max 16MB)
- Duration limits (typically 3 minutes for WhatsApp)
- Provide basic trimming capabilities
- Consider compression for low-bandwidth environments

#### 2.2.3 Audio Content

**Structure and Properties:**
- **Title**: Descriptive name for the audio (required)
- **Audio File**: The actual audio asset (required, formats: MP3, OGG)
- **Caption**: Text to display with the audio (optional)
- **Transcript**: Text version of audio content for accessibility (optional)
- **Metadata**: Tags, categories, language (optional)

**Implementation Considerations:**
- Enforce WhatsApp audio size limits (max 16MB)
- Duration limits
- Basic editing capabilities (trimming)

### 2.3 Interactive Content

Interactive content engages workers through active participation and feedback.

#### 2.3.1 Quiz/Assessment Content

**Structure and Properties:**
- **Title**: Name of the quiz/assessment (required)
- **Description**: Purpose and instructions (required)
- **Questions**: Collection of questions with various formats (required)
  - Multiple choice (single or multiple correct answers)
  - True/False
  - Short answer (text input)
  - Rating scales
- **Feedback**: Responses for correct/incorrect answers (optional)
- **Scoring**: Rules for calculating scores (optional)
- **Metadata**: Tags, categories, language (optional)

**Implementation Considerations:**
- Questions need to be deliverable via WhatsApp conversation format
- Response collection and validation logic
- Reporting and analytics integration

#### 2.3.2 Reflection Activities

**Structure and Properties:**
- **Title**: Name of the reflection activity (required)
- **Prompt**: The reflection question or scenario (required)
- **Instructions**: Guidance for completing the reflection (optional)
- **Response Format**: Expected format of response (optional)
- **Metadata**: Tags, categories, language (optional)

**Implementation Considerations:**
- Open-ended responses require different handling than structured quizzes
- May need sentiment analysis for automatic processing
- Consider privacy implications of personal reflections

### 2.4 Message Templates

Message templates ensure consistent communication and may require approval for WhatsApp Business accounts.

#### 2.4.1 WhatsApp HSM Templates

**Structure and Properties:**
- **Name**: Template identifier (required, alphanumeric with underscores)
- **Category**: WhatsApp category (required: marketing, utility, authentication)
- **Language**: Template language (required)
- **Content**: Template text with variable placeholders (required)
- **Example Values**: Sample values for variables (required for approval)
- **Status**: Approval status (draft, submitted, approved, rejected)
- **Metadata**: Internal tags, categories (optional)

**Implementation Considerations:**
- Must conform to WhatsApp HSM template requirements
- Approval workflow integration with WhatsApp Business API
- Version management for approved templates

#### 2.4.2 SMS Templates

Similar structure to WhatsApp templates but with:
- Different character limitations
- No approval process
- Different formatting capabilities

#### 2.4.3 Email Templates

More extensive capabilities including:
- HTML formatting
- Attachments
- Subject line management

### 2.5 Document Content

Support for structured documents that may be shared as attachments.

**Structure and Properties:**
- **Title**: Document title (required)
- **File**: Document file (required, formats: PDF, DOCX)
- **Description**: Summary of document contents (optional)
- **Metadata**: Tags, categories, language (optional)

**Implementation Considerations:**
- File size limits for WhatsApp attachment delivery
- Preview generation
- Version management

## 3. Key Features

- Content Library with filtering and search capabilities
- Rich content creation and editing tools
- Media asset management
- Template creation and approval workflows
- Content versioning and history
- Tagging and metadata management
- Content licensing and marketplace integration

### 3.1 Content Organization

#### 3.1.1 Tagging System

The platform implements a flexible tagging system to organize content:

- **Standard Tags**: Predefined categories for consistent organization
  - Content type (text, image, video, quiz, etc.)
  - Subject area (health, finance, agriculture, etc.)
  - Skill level (beginner, intermediate, advanced)
  - Target demographic (if applicable)
  
- **Custom Tags**: Organization-specific tags for unique classification needs
  - Project identifiers
  - Internal categories
  - Custom taxonomies

**Implementation Requirements:**
- Tag creation, editing, and deletion interfaces
- Tag assignment during content creation/editing
- Tag-based filtering in the content library
- Tag management screens for administrators
- API endpoints for tag operations

#### 3.1.2 Collections

Collections allow grouping related content items:

- **Manual Collections**: User-created groupings of content
- **Smart Collections**: Automatically populated based on rules (tags, creation date, etc.)
- **Featured Collections**: Highlighted on the content library home page

**Implementation Requirements:**
- Collection creation and management interfaces
- Content assignment to collections
- Collection-based navigation in the content library
- API endpoints for collection operations

### 3.2 Content Metadata

Each content item includes metadata to facilitate discovery and management:

- **Basic Metadata**:
  - Title
  - Description
  - Creation date
  - Last modified date
  - Created by (user)
  - Modified by (user)
  
- **Usage Metadata**:
  - Usage count in journeys/programs
  - Performance metrics (completion rates, engagement)
  - Feedback scores

- **Technical Metadata**:
  - File size (for media)
  - Duration (for audio/video)
  - Dimensions (for images)
  - Format/encoding

- **Rights Metadata**:
  - License type
  - Attribution requirements
  - Usage restrictions
  - Expiration date (if applicable)

**Implementation Requirements:**
- Metadata display in content detail view
- Metadata editing interfaces
- Search/filter by metadata
- Export/import of metadata

## 4. Pages and Routes

### 4.1 Content Library (`/content`)

The Content Library is the main hub for browsing, searching, and managing content modules.

#### 4.1.1 Page Structure

The Content Library page consists of the following sections:

1. **Header Section**
   - Page title ("Content Library")
   - Primary actions (Create content button, Filter button, View toggle)
   - Search input
   - Sort options dropdown (Recently updated, Alphabetical, Most used, etc.)

2. **Filters Panel** (expandable/collapsible)
   - Content type filters (checkboxes for Text, Image, Video, Quiz, etc.)
   - Tag filters (multiple select)
   - Date range filters (created, updated)
   - Status filters (Draft, Published, Archived)
   - Additional metadata filters (Language, License, etc.)
   - "Clear all filters" button
   - "Apply filters" button

3. **Content Grid/List View**
   - Toggle between grid view (cards) and list view (table)
   - Pagination controls
   - Items per page selector
   - Total items count

4. **Empty State**
   - Displayed when no content matches filters
   - Helpful message
   - Call to action (Create content button)

#### 4.1.2 Component Specifications

**ContentLibraryHeader Component**
```tsx
interface ContentLibraryHeaderProps {
  onCreateClick: () => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onViewToggle: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  totalItems: number;
}
```

**ContentFiltersPanel Component**
```tsx
interface ContentFiltersPanelProps {
  filters: ContentFilters;
  onFiltersChange: (filters: ContentFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  availableTags: Tag[];
  isOpen: boolean;
  onToggle: () => void;
}

interface ContentFilters {
  contentTypes: string[];
  tags: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  status: ('draft' | 'published' | 'archived')[];
  language?: string[];
  license?: string[];
}
```

**ContentCard Component** (Used in Grid View)
```tsx
interface ContentCardProps {
  id: string;
  title: string;
  type: ContentType;
  summary?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  usageCount: number;
  tags: Tag[];
  onClick: (id: string) => void;
  onContextMenu: (id: string, event: React.MouseEvent) => void;
}
```

**ContentTable Component** (Used in List View)
```tsx
interface ContentTableProps {
  items: ContentItem[];
  onRowClick: (id: string) => void;
  onSort: (column: keyof ContentItem) => void;
  sortColumn: keyof ContentItem;
  sortDirection: 'asc' | 'desc';
  onContextMenu: (id: string, event: React.MouseEvent) => void;
}
```

**ContentContextMenu Component**
```tsx
interface ContentContextMenuProps {
  contentId: string;
  x: number;
  y: number;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  canEdit: boolean;
  canDelete: boolean;
}
```

#### 4.1.3 UI/UX Specifications

**Layout:**
- Responsive design with grid layout adjusting columns based on screen size
  - Desktop: 4 columns
  - Tablet: 3 columns
  - Mobile: 1 column
- Filters panel displays as side panel on desktop, converts to modal on mobile
- Table view scrolls horizontally on smaller screens

**Interactions:**
- Clicking a content card/row navigates to the content detail view
- Right-clicking opens a context menu with actions (Edit, Duplicate, Delete, etc.)
- Hovering on a card shows a quick action menu
- Drag-and-drop for adding to collections (when collections panel is open)
- Keyboard navigation support

**Visual Design:**
- Cards display thumbnail previews for visual content
- Type icons for different content types
- Color-coding for status indicators (Draft, Published, Archived)
- Subtle hover effects for interactive elements
- Loading skeletons during data fetching

#### 4.1.4 API Integration

The Content Library page integrates with the following API endpoints:

- **GET** `/content`
  - Purpose: List content modules with pagination and filtering
  - Query parameters:
    - `page`: Page number
    - `limit`: Items per page
    - `search`: Search query
    - `sort`: Sort field
    - `direction`: Sort direction
    - `filters`: JSON object with filter criteria
  - Response: Paginated list of content items with metadata

- **DELETE** `/content/{contentId}`
  - Purpose: Delete a content item (called from context menu)

- **GET** `/content/tags`
  - Purpose: Retrieve available tags for filter panel

Sample API Call using React Query:
```tsx
const useContentLibrary = (filters: ContentFilters, page: number, limit: number, search: string, sort: string, direction: 'asc' | 'desc') => {
  return useQuery(
    ['content', filters, page, limit, search, sort, direction],
    () => fetchContent(filters, page, limit, search, sort, direction),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
```

### 4.2 Content Detail View (`/content/[contentId]`)

The Content Detail View provides a comprehensive display of a specific content module with preview and metadata.

#### 4.2.1 Page Structure

The Content Detail page consists of the following sections:

1. **Header Section**
   - Breadcrumb navigation (Content Library > Content Title)
   - Content title (editable with inline editing)
   - Action buttons:
     - Edit button
     - Delete button
     - Duplicate button
     - Back to library button
   - Status indicator/toggle

2. **Main Content Area** (Two-column layout on desktop, single column on mobile)
   - **Left Column: Content Preview**
     - Type-specific preview component
     - WhatsApp preview mode toggle
   
   - **Right Column: Content Information**
     - Metadata panel (created date, updated date, creator, etc.)
     - Usage information (journeys/programs using this content)
     - Tags section (with inline tag management)
     - Description (with inline editing)

3. **Additional Tabs** (below main content)
   - Version History tab
   - Analytics tab (usage metrics, performance data)
   - Related Content tab
   - Licensing information tab

4. **Feedback/Notes Section**
   - Internal notes/comments on the content
   - Comment thread with timestamp and user information

#### 4.2.2 Component Specifications

**ContentDetailHeader Component**
```tsx
interface ContentDetailHeaderProps {
  content: ContentItem;
  onTitleChange: (title: string) => void;
  onStatusChange: (status: ContentStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBack: () => void;
  isSaving: boolean;
  error?: string;
}
```

**ContentPreview Component**
```tsx
interface ContentPreviewProps {
  content: ContentItem;
  previewMode: 'standard' | 'whatsapp';
  onPreviewModeChange: (mode: 'standard' | 'whatsapp') => void;
}
```

**ContentMetadata Component**
```tsx
interface ContentMetadataProps {
  content: ContentItem;
  onMetadataChange: (key: string, value: any) => void;
  onTagsChange: (tags: Tag[]) => void;
  onDescriptionChange: (description: string) => void;
  isEditing: boolean;
}
```

**ContentUsage Component**
```tsx
interface ContentUsageProps {
  contentId: string;
  usageData: {
    journeys: UsageReference[];
    programs: UsageReference[];
  };
}

interface UsageReference {
  id: string;
  name: string;
  type: string;
  lastUsed: Date;
}
```

**ContentVersionHistory Component**
```tsx
interface ContentVersionHistoryProps {
  contentId: string;
  versions: ContentVersion[];
  onRevertToVersion: (versionId: string) => void;
  currentVersionId: string;
}

interface ContentVersion {
  id: string;
  createdAt: Date;
  createdBy: User;
  changeDescription?: string;
}
```

#### 4.2.3 UI/UX Specifications

**Layout:**
- Responsive two-column layout on desktop, stacking to single column on mobile
- Content preview takes approximately 60% width on desktop
- Sticky header with actions while scrolling
- Tabs become accordion-style sections on mobile

**Interactions:**
- Inline editing for title, description
- Click-to-edit functionality for metadata fields
- Tag management with typeahead for adding tags
- Version comparison (side-by-side or overlay)
- Zoom/expand options for media content preview

**Visual Design:**
- WhatsApp message styling in WhatsApp preview mode
- Clear visual hierarchy with section dividers
- Status indicators with distinct colors (Draft, Published, Archived)
- Version timeline visualization
- Usage charts for analytics tab

#### 4.2.4 API Integration

The Content Detail page integrates with the following API endpoints:

- **GET** `/content/{contentId}`
  - Purpose: Retrieve detailed information about a specific content item
  - Response: Complete content item data including metadata

- **PATCH** `/content/{contentId}`
  - Purpose: Update content metadata (title, description, tags, etc.)
  - Payload: Fields to update
  - Response: Updated content item

- **GET** `/content/{contentId}/usage`
  - Purpose: Retrieve usage information (what journeys/programs use this content)
  - Response: List of references to journeys and programs

- **GET** `/content/{contentId}/versions`
  - Purpose: Retrieve version history for the content
  - Response: List of previous versions with metadata

- **POST** `/content/{contentId}/versions/{versionId}/revert`
  - Purpose: Revert content to a previous version
  - Response: Updated content item data

Sample API Call:
```tsx
const useContentDetail = (contentId: string) => {
  return useQuery(
    ['content', contentId],
    () => fetchContentDetail(contentId),
    {
      enabled: !!contentId,
    }
  );
};

const useUpdateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: { id: string; updates: Partial<ContentItem> }) => 
      updateContent(data.id, data.updates),
    {
      onSuccess: (updatedContent) => {
        queryClient.setQueryData(
          ['content', updatedContent.id], 
          updatedContent
        );
        queryClient.invalidateQueries(['content']);
      },
    }
  );
};
```

### 4.3 Content Creation (`/content/create`)

The Content Creation page provides an interface for creating new content modules of various types.

#### 4.3.1 Page Structure

The Content Creation page consists of the following sections:

1. **Header Section**
   - Page title ("Create New Content")
   - Cancel button
   - Save as draft button
   - Publish button

2. **Content Type Selection** (initial step)
   - Grid of content type options with icons and descriptions
   - Recently used types section

3. **Type-Specific Creation Form**
   - Common fields (present for all types):
     - Title input
     - Description textarea
     - Tags input (multiple select with typeahead)
     - Language selector
   
   - Type-specific fields:
     - Text content: Rich text editor
     - Image content: Image upload, alt text, caption
     - Video content: Video upload, thumbnail selection, caption
     - Audio content: Audio upload, transcript
     - Quiz content: Question builder interface
     - Template: Template fields and variable definitions

4. **Preview Panel**
   - Split view with form on left, preview on right
   - Preview mode toggle (standard, WhatsApp)
   - Device preview options (phone, tablet, desktop)

5. **Validation Feedback**
   - Inline validation messages
   - Summary of validation issues

#### 4.3.2 Component Specifications

**ContentTypeSelector Component**
```tsx
interface ContentTypeSelectorProps {
  onTypeSelect: (type: ContentType) => void;
  recentTypes: ContentType[];
}

type ContentType = 'text' | 'image' | 'video' | 'audio' | 'quiz' | 'reflection' | 'template' | 'document';
```

**ContentCreationForm Component**
```tsx
interface ContentCreationFormProps {
  contentType: ContentType;
  initialData?: Partial<ContentItem>;
  onSave: (data: ContentItem, action: 'draft' | 'publish') => void;
  onCancel: () => void;
  isSaving: boolean;
  error?: string;
}
```

**TextContentEditor Component**
```tsx
interface TextContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  showWordCount?: boolean;
  placeholder?: string;
}
```

**QuizBuilder Component**
```tsx
interface QuizBuilderProps {
  questions: QuizQuestion[];
  onQuestionsChange: (questions: QuizQuestion[]) => void;
  onAddQuestion: (type: QuestionType) => void;
  onRemoveQuestion: (index: number) => void;
  onReorderQuestions: (startIndex: number, endIndex: number) => void;
}

interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: QuizOption[];
  correctAnswer?: string | string[];
  explanation?: string;
}

type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'rating';
```

**MediaUploader Component**
```tsx
interface MediaUploaderProps {
  type: 'image' | 'video' | 'audio' | 'document';
  onUploadComplete: (fileUrl: string, metadata: MediaMetadata) => void;
  onUploadError: (error: string) => void;
  maxSize: number; // in bytes
  acceptedFormats: string[];
  previewUrl?: string;
}

interface MediaMetadata {
  filename: string;
  fileSize: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  duration?: number; // for audio/video
}
```

**ContentPreviewPanel Component**
```tsx
interface ContentPreviewPanelProps {
  content: Partial<ContentItem>;
  previewMode: 'standard' | 'whatsapp';
  deviceType: 'phone' | 'tablet' | 'desktop';
  onPreviewModeChange: (mode: 'standard' | 'whatsapp') => void;
  onDeviceTypeChange: (deviceType: 'phone' | 'tablet' | 'desktop') => void;
}
```

#### 4.3.3 UI/UX Specifications

**Layout:**
- Initial content type selection displayed as a grid of cards
- Creation form uses two-column layout on desktop (form and preview)
- Single column layout on mobile with collapsible preview
- Sticky header with save/publish actions

**Interactions:**
- Progressive disclosure of form fields based on content type
- Real-time validation feedback
- Drag-and-drop for media uploads
- Live preview updates as content is edited
- Auto-save functionality (save draft every 30 seconds)
- Dirty form detection with unsaved changes warning

**Visual Design:**
- Content type cards with illustrative icons
- Clear section headings with helper text
- Visual feedback for validation state (green for valid, red for errors)
- Progress indicator for multi-step forms
- Loading indicators for media uploads
- WhatsApp message styling in preview mode

#### 4.3.4 API Integration

The Content Creation page integrates with the following API endpoints:

- **POST** `/content`
  - Purpose: Create a new content item
  - Payload: Content data including type-specific fields
  - Response: Created content item with ID

- **POST** `/content/media/upload`
  - Purpose: Upload media files (images, videos, audio, documents)
  - Payload: File data
  - Response: URL and metadata for the uploaded file

- **GET** `/content/types`
  - Purpose: Retrieve available content types and their schemas
  - Response: List of content types with form schema information

- **GET** `/content/tags`
  - Purpose: Retrieve available tags for autocomplete
  - Response: List of existing tags

Sample API Call:
```tsx
const useCreateContent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation(
    (data: { content: Omit<ContentItem, 'id'>; action: 'draft' | 'publish' }) => 
      createContent(data.content, data.action),
    {
      onSuccess: (createdContent) => {
        queryClient.invalidateQueries(['content']);
        toast.success('Content created successfully');
        router.push(`/content/${createdContent.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create content: ${error.message}`);
      }
    }
  );
};

const useMediaUpload = () => {
  return useMutation(
    (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return uploadMedia(formData);
    }
  );
};
```

### 4.4 Content Editor (`/content/editor/[contentId]`)

The Content Editor provides a rich editing environment for modifying existing content.

#### 4.4.1 Page Structure

The Content Editor shares much of its structure with the Content Creation page, with the following differences:

1. **Header Section**
   - Page title ("Edit Content: [Title]")
   - Back to detail button
   - Save changes button
   - Publish button (if currently draft)
   - Version information

2. **Version Control Panel**
   - Create new version checkbox
   - Version notes input
   - Previous version comparison view

3. **Change Tracking**
   - Visual indicators for changed fields
   - Change summary panel

The rest of the structure follows the Content Creation page, with the form fields pre-populated with the existing content data.

#### 4.4.2 Component Specifications

Components are largely shared with the Content Creation page, with these additions:

**VersionControlPanel Component**
```tsx
interface VersionControlPanelProps {
  contentId: string;
  currentVersion: string;
  createNewVersion: boolean;
  onCreateNewVersionChange: (create: boolean) => void;
  versionNotes: string;
  onVersionNotesChange: (notes: string) => void;
  previousVersions: ContentVersion[];
  onCompareWithVersion: (versionId: string) => void;
  compareVersion?: string;
}
```

**ChangeTrackingPanel Component**
```tsx
interface ChangeTrackingPanelProps {
  originalContent: ContentItem;
  currentContent: ContentItem;
  changedFields: string[];
}
```

#### 4.4.3 UI/UX Specifications

Largely similar to Content Creation page, with these additions:

**Interactions:**
- Version comparison (side-by-side or overlay)
- Field-level change highlighting
- Revision history navigation
- Discard changes confirmation

**Visual Design:**
- Changed fields highlighted with subtle background color
- Version timeline visualization
- Diff view for text content changes
- Changed fields summary in sidebar

#### 4.4.4 API Integration

The Content Editor page integrates with the following API endpoints:

- **GET** `/content/{contentId}`
  - Purpose: Retrieve the content to be edited
  - Response: Complete content item data

- **PATCH** `/content/{contentId}`
  - Purpose: Update an existing content item
  - Payload: Updated content data
  - Response: Updated content item

- **POST** `/content/{contentId}/versions`
  - Purpose: Create a new version of a content item
  - Payload: Version notes and updated content
  - Response: New version information

- **GET** `/content/{contentId}/versions/{versionId}`
  - Purpose: Retrieve a specific version for comparison
  - Response: Content data for the specified version

Sample API Call:
```tsx
const useUpdateContentWithVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: { 
      contentId: string; 
      updates: Partial<ContentItem>;
      createNewVersion: boolean;
      versionNotes?: string;
    }) => {
      if (data.createNewVersion) {
        return createContentVersion(
          data.contentId, 
          data.updates, 
          data.versionNotes
        );
      } else {
        return updateContent(data.contentId, data.updates);
      }
    },
    {
      onSuccess: (updatedContent) => {
        queryClient.invalidateQueries(['content', updatedContent.id]);
        queryClient.invalidateQueries(['content', updatedContent.id, 'versions']);
        toast.success('Content updated successfully');
      }
    }
  );
};
```

### 4.5 Media Library (`/content/media`)

The Media Library provides a repository for uploaded media assets.

#### 4.5.1 Page Structure

1. **Header Section**
   - Page title ("Media Library")
   - Upload button
   - Filter button
   - View toggle (grid/list)
   - Search input

2. **Filters Panel**
   - Media type filters (Image, Video, Audio, Document)
   - Date range filters
   - Size filters
   - Usage filters (Used/Unused)
   - Tag filters

3. **Media Grid/List View**
   - Thumbnail preview
   - Media type indicator
   - File name
   - Size information
   - Upload date
   - Usage count

4. **Upload Panel**
   - Drag and drop area
   - File selection button
   - Upload progress indicators
   - Batch metadata editor

5. **Media Detail Panel** (displayed when item selected)
   - Large preview
   - Metadata editor
   - Usage information
   - Actions (delete, download, replace)

#### 4.5.2 Component Specifications

**MediaLibraryHeader Component**
```tsx
interface MediaLibraryHeaderProps {
  onUploadClick: () => void;
  onSearchChange: (query: string) => void;
  onViewToggle: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  totalItems: number;
}
```

**MediaGrid Component**
```tsx
interface MediaGridProps {
  media: MediaItem[];
  onItemClick: (id: string) => void;
  selectedItemId?: string;
  onContextMenu: (id: string, event: React.MouseEvent) => void;
}

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  thumbnailUrl: string;
  url: string;
  fileSize: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  uploadedAt: Date;
  uploadedBy: User;
  usageCount: number;
  tags: Tag[];
}
```

**MediaBatchUploader Component**
```tsx
interface MediaBatchUploaderProps {
  onUploadComplete: (media: MediaItem[]) => void;
  onUploadError: (error: string) => void;
  maxFileSize: number;
  acceptedTypes: string[];
  maxFiles?: number;
}
```

**MediaDetailPanel Component**
```tsx
interface MediaDetailPanelProps {
  media: MediaItem;
  onClose: () => void;
  onUpdate: (updates: Partial<MediaItem>) => void;
  onDelete: (id: string) => void;
  onReplace: (id: string, file: File) => void;
  onDownload: (url: string, filename: string) => void;
}
```

#### 4.5.3 UI/UX Specifications

**Layout:**
- Grid view with responsive columns (4 on desktop, 3 on tablet, 1-2 on mobile)
- List view with sortable columns
- Right panel for media details (or modal on mobile)
- Fullscreen preview mode for media items

**Interactions:**
- Drag and drop for uploads
- Multi-select for batch operations
- Preview on hover for grid items
- In-place metadata editing
- Lazy loading for large media libraries
- Virtual scrolling for performance with large sets

**Visual Design:**
- Type-specific icons for different media types
- Visual indicators for file size/duration
- Progress bars for uploads
- Thumbnail previews with aspect ratio preservation
- File type badges

#### 4.5.4 API Integration

The Media Library integrates with the following API endpoints:

- **GET** `/content/media`
  - Purpose: List uploaded media assets
  - Query parameters:
    - `page`: Page number
    - `limit`: Items per page
    - `search`: Search query
    - `type`: Filter by media type
    - `dateRange`: Filter by upload date range
    - `used`: Filter by usage status
  - Response: Paginated list of media items

- **POST** `/content/media/upload`
  - Purpose: Upload media files
  - Payload: File data (FormData)
  - Response: Created media item data

- **PATCH** `/content/media/{mediaId}`
  - Purpose: Update media metadata
  - Payload: Updated metadata
  - Response: Updated media item

- **DELETE** `/content/media/{mediaId}`
  - Purpose: Delete a media item
  - Response: Success status

- **GET** `/content/media/{mediaId}/usage`
  - Purpose: Get usage information for a media item
  - Response: List of content using this media

Sample API Call:
```tsx
const useMediaLibrary = (filters: MediaFilters, page: number, limit: number, search: string) => {
  return useQuery(
    ['media', filters, page, limit, search],
    () => fetchMedia(filters, page, limit, search),
    {
      keepPreviousData: true,
    }
  );
};

const useMediaUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      return uploadMediaBatch(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['media']);
        toast.success('Media uploaded successfully');
      }
    }
  );
};
```

### 4.6 Template Management (`/content/templates`)

The Template Management interface allows creating and managing message templates, particularly WhatsApp HSM templates that require approval.

#### 4.6.1 Page Structure

1. **Header Section**
   - Page title ("Message Templates")
   - Create template button
   - Filter button
   - Search input
   - Channel filter (WhatsApp, SMS, Email)

2. **Templates List**
   - Template name
   - Channel type
   - Category
   - Status indicator (Draft, Submitted, Approved, Rejected)
   - Language indicator
   - Created date
   - Last modified date
   - Actions (Edit, Duplicate, Delete)

3. **Template Creation/Edit Form**
   - Channel selector (WhatsApp, SMS, Email)
   - Name input (with validation for WhatsApp naming requirements)
   - Category selector (for WhatsApp: marketing, utility, authentication)
   - Language selector
   - Content editor with variable highlighting
   - Variable examples section (required for WhatsApp approval)
   - Header section for media (WhatsApp)
   - Footer section (WhatsApp)
   - Buttons configuration (WhatsApp)

4. **Template Preview**
   - Channel-specific preview (WhatsApp, SMS, Email)
   - Variable substitution preview
   - Device frame

5. **Approval Status Panel** (for WhatsApp templates)
   - Submission history
   - Current status
   - Rejection reasons (if rejected)
   - Submit for approval button
   - Resubmit button (if rejected)

#### 4.6.2 Component Specifications

**TemplatesList Component**
```tsx
interface TemplatesListProps {
  templates: Template[];
  onTemplateClick: (id: string) => void;
  onCreateTemplate: () => void;
  onDuplicateTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  filters: TemplateFilters;
  onFiltersChange: (filters: TemplateFilters) => void;
}

interface Template {
  id: string;
  name: string;
  channelType: 'whatsapp' | 'sms' | 'email';
  category?: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  content: string;
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  rejectionReason?: string;
}

interface TemplateVariable {
  name: string;
  exampleValue: string;
}
```

**TemplateEditor Component**
```tsx
interface TemplateEditorProps {
  template: Partial<Template>;
  onTemplateChange: (template: Partial<Template>) => void;
  onSave: (template: Template) => void;
  onSubmitForApproval: (template: Template) => void;
  isSaving: boolean;
  isSubmitting: boolean;
  validationErrors: ValidationError[];
}
```

**TemplatePreview Component**
```tsx
interface TemplatePreviewProps {
  template: Partial<Template>;
  variableValues: Record<string, string>;
  onVariableValuesChange: (values: Record<string, string>) => void;
}
```

**TemplateApprovalPanel Component**
```tsx
interface TemplateApprovalPanelProps {
  template: Template;
  approvalHistory: ApprovalEvent[];
  onSubmit: (templateId: string) => void;
  isSubmitting: boolean;
}

interface ApprovalEvent {
  id: string;
  templateId: string;
  status: 'submitted' | 'approved' | 'rejected';
  timestamp: Date;
  rejectionReason?: string;
  submittedBy: User;
}
```

#### 4.6.3 UI/UX Specifications

**Layout:**
- Templates list with status filtering tabs
- Split-screen layout for template editing: editor on left, preview on right
- Mobile view with tabbed navigation between editor and preview
- Modal dialogs for approval submission and confirmation actions

**Interactions:**
- Variable insertion via dropdown or type-ahead
- Live preview updating as template is edited
- Character counter with limit indication
- Validation checks specific to template type
- Status-based action restrictions (e.g., can't edit approved templates without creating new version)

**Visual Design:**
- Status badges with distinct colors
- Channel-specific icons
- WhatsApp message styling in preview
- Syntax highlighting for variables
- Warning indicators for potential approval issues

#### 4.6.4 API Integration

The Template Management interface integrates with the following API endpoints:

- **GET** `/content/templates`
  - Purpose: List message templates
  - Query parameters:
    - `channelType`: Filter by channel
    - `status`: Filter by approval status
    - `search`: Search query
  - Response: List of templates

- **POST** `/content/templates`
  - Purpose: Create a new message template
  - Payload: Template data
  - Response: Created template

- **GET** `/content/templates/{templateId}`
  - Purpose: Get template details
  - Response: Complete template data

- **PATCH** `/content/templates/{templateId}`
  - Purpose: Update template details
  - Payload: Updated template data
  - Response: Updated template

- **POST** `/content/templates/{templateId}/request-approval` (for WhatsApp HSM)
  - Purpose: Submit WhatsApp template for approval
  - Response: Submission status

- **GET** `/content/templates/{templateId}/approval-status` (for WhatsApp HSM)
  - Purpose: Check approval status
  - Response: Current status and history

Sample API Call:
```tsx
const useTemplates = (filters: TemplateFilters) => {
  return useQuery(
    ['templates', filters],
    () => fetchTemplates(filters)
  );
};

const useSubmitTemplateForApproval = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (templateId: string) => submitTemplateForApproval(templateId),
    {
      onSuccess: (result, templateId) => {
        queryClient.invalidateQueries(['templates']);
        queryClient.invalidateQueries(['templates', templateId]);
        toast.success('Template submitted for approval');
      }
    }
  );
};
```

## 5. Architecture Overview

The content management system follows a modular architecture that integrates with the platform's core infrastructure:

### 5.1 Frontend Architecture

The content management frontend is built upon a layered architecture designed for maintainability, scalability, and clear separation of concerns:

#### 5.1.1 Layers

1. **Presentation Layer**
   - React components responsible for rendering UI
   - Organized by feature (content, media, templates)
   - Follows component hierarchy (base UI components → feature-specific components)

2. **State Management Layer**
   - React Query for server state (content items, media, templates)
   - Local React state for UI interactions
   - Context for shared state across multiple components

3. **Service Layer**
   - API client services for communication with backend
   - Utility services for common operations

4. **Validation Layer**
   - Zod schemas for API request/response validation
   - Form validation using react-hook-form with Zod integration

#### 5.1.2 Component Organization

Components in the content management system are organized according to the platform's standards:

1. **UI Components** (`src/components/ui/`)
   - Basic input elements (Button, TextField, Select)
   - Data display elements (Table, Card)
   - Feedback elements (Alert, Toast)
   - Layout elements (Box, Grid, Stack)

2. **Feature Components** (`src/components/features/content/`)
   - **ContentCard**: Displays a single content item in the library
   - **ContentEditor**: Rich text editor for content creation/editing
   - **ContentPreview**: Renders preview for different content types
   - **MediaUploader**: Handles file uploads with progress indication
   - **QuizBuilder**: Interface for creating quiz questions and answers
   - **TemplateEditor**: Interface for creating message templates

3. **Page Components** (`src/app/(app)/content/`)
   - Compose feature components into full pages
   - Handle routing parameters and navigation
   - Implement layout for specific content routes

### 5.2 State Management

The content management system uses a hybrid state management approach to optimize for different types of state:

#### 5.2.1 Server State Management

React Query is used for managing server-sourced data:

```tsx
// Content library data fetching
export const useContentLibrary = (filters, pagination) => {
  return useQuery({
    queryKey: ['content', 'list', filters, pagination],
    queryFn: () => contentService.getContentList(filters, pagination),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Content detail fetching
export const useContentDetail = (contentId) => {
  return useQuery({
    queryKey: ['content', 'detail', contentId],
    queryFn: () => contentService.getContentDetail(contentId),
    enabled: !!contentId,
  });
};
```

Key benefits of this approach:
- Automatic caching of content data
- Background refetching of stale data
- Loading and error states handled consistently
- Optimistic updates for content mutations
- Deduplication of requests

#### 5.2.2 Form State Management

React Hook Form is used for complex form state, integrated with Zod for validation:

```tsx
// Content creation form
export const ContentCreationForm = ({ contentType, onSubmit }) => {
  const schema = contentSchemas[contentType]; // Zod schema specific to content type
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(contentType),
  });
  
  // Form submission handler
  const onSubmitForm = (data) => {
    onSubmit(data);
    reset(data); // Reset form state after submission
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {/* Form fields vary based on contentType */}
      {/* ... */}
    </form>
  );
};
```

#### 5.2.3 UI State Management

Local React state is used for component-specific UI state:

```tsx
// Media Library component UI state
export const MediaLibrary = () => {
  // UI state
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<MediaFilters>(defaultMediaFilters);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<MediaFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // ... remaining component logic
};
```

### 5.3 API Integration

The content management system communicates with backend services through a structured API integration layer:

#### 5.3.1 API Client Structure

```tsx
// Base API client with authentication handling
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add tenant interceptor
apiClient.interceptors.request.use((config) => {
  const organizationId = getTenantId();
  if (organizationId) {
    config.headers['X-Organization-Id'] = organizationId;
  }
  return config;
});
```

#### 5.3.2 Content Service Implementation

```tsx
// Content service for API interactions
export const contentService = {
  // Get paginated content list
  async getContentList(filters, pagination) {
    const response = await apiClient.get('/content', {
      params: {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      },
    });
    return response.data;
  },
  
  // Get single content item
  async getContentDetail(contentId) {
    const response = await apiClient.get(`/content/${contentId}`);
    return response.data;
  },
  
  // Create new content
  async createContent(contentData) {
    const response = await apiClient.post('/content', contentData);
    return response.data;
  },
  
  // Update existing content
  async updateContent(contentId, updates) {
    const response = await apiClient.patch(`/content/${contentId}`, updates);
    return response.data;
  },
  
  // Delete content
  async deleteContent(contentId) {
    await apiClient.delete(`/content/${contentId}`);
    return true;
  },
  
  // Additional methods for content operations
  // ...
};
```

#### 5.3.3 Media Upload Service

For media content, a specialized service handles file uploads with progress tracking:

```tsx
export const mediaService = {
  // Upload single media file
  async uploadMedia(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/content/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  },
  
  // Additional media operations
  // ...
};
```

### 5.4 Data Validation

The content management system implements comprehensive data validation to ensure data integrity:

#### 5.4.1 Schema Definitions

Zod schemas define the structure and validation rules for different content types:

```tsx
// Base content schema for common fields
const baseContentSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
});

// Text content schema
const textContentSchema = baseContentSchema.extend({
  type: z.literal('text'),
  body: z
    .string()
    .min(1, 'Content body is required')
    .max(5000, 'Content body cannot exceed 5000 characters'),
});

// Image content schema
const imageContentSchema = baseContentSchema.extend({
  type: z.literal('image'),
  imageUrl: z.string().url('Image URL must be valid'),
  altText: z.string().min(1, 'Alt text is required for accessibility'),
  caption: z.string().optional(),
});

// Quiz content schema
const quizContentSchema = baseContentSchema.extend({
  type: z.literal('quiz'),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, 'Question text is required'),
        type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'rating']),
        options: z
          .array(
            z.object({
              id: z.string(),
              text: z.string().min(1, 'Option text is required'),
            })
          )
          .optional(),
        correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
      })
    )
    .min(1, 'At least one question is required'),
});

// Export consolidated content schemas
export const contentSchemas = {
  text: textContentSchema,
  image: imageContentSchema,
  video: videoContentSchema,
  audio: audioContentSchema,
  quiz: quizContentSchema,
  reflection: reflectionContentSchema,
  template: templateContentSchema,
  document: documentContentSchema,
};
```

#### 5.4.2 Form Validation Integration

React Hook Form integrates with Zod schemas for client-side validation:

```tsx
// Use the schema in a form component
const TextContentForm = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contentSchemas.text),
    defaultValues: initialData || {
      type: 'text',
      title: '',
      description: '',
      body: '',
      tags: [],
    },
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Title"
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      
      <TextField
        label="Description"
        multiline
        rows={3}
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      
      <RichTextEditor
        label="Content"
        {...register('body')}
        error={!!errors.body}
        helperText={errors.body?.message}
      />
      
      <TagSelector
        label="Tags"
        {...register('tags')}
        error={!!errors.tags}
        helperText={errors.tags?.message}
      />
      
      <Button type="submit">Save</Button>
    </form>
  );
};
```

#### 5.4.3 API Validation

Server responses are validated to ensure type safety:

```tsx
// Validate API response with Zod schema
const useContentDetail = (contentId) => {
  return useQuery({
    queryKey: ['content', contentId],
    queryFn: async () => {
      const response = await contentService.getContentDetail(contentId);
      // Validate response against expected schema
      return contentResponseSchema.parse(response);
    },
    enabled: !!contentId,
  });
};
```

### 5.5 Error Handling

The content management system implements a comprehensive error handling strategy:

#### 5.5.1 API Error Handling

```tsx
// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error details from response
    const errorData = error.response?.data || {
      message: 'An unexpected error occurred',
    };
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Authentication error - redirect to login
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    } else if (error.response?.status === 403) {
      // Authorization error - display permission denied message
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 413) {
      // File too large error
      toast.error('The file you are trying to upload is too large');
    } else {
      // Generic error handling
      toast.error(errorData.message || 'An error occurred');
    }
    
    // Rethrow the error for the calling code to handle
    return Promise.reject(errorData);
  }
);
```

#### 5.5.2 Component-Level Error Handling

Error boundaries capture rendering errors in content components:

```tsx
export class ContentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ContentErrorFallback 
          error={this.state.error} 
          onReset={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}

// Usage
const ContentPage = () => {
  return (
    <ContentErrorBoundary>
      <ContentLibrary />
    </ContentErrorBoundary>
  );
};
```

### 5.6 Accessibility

The content management system is designed to meet WCAG AA accessibility standards:

#### 5.6.1 Keyboard Navigation

All interactive elements are keyboard accessible:

```tsx
// Keyboard accessible content card
const ContentCard = ({ content, onSelect, onDelete, isSelected }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(content.id);
      e.preventDefault();
    } else if (e.key === 'Delete' && e.shiftKey) {
      onDelete(content.id);
      e.preventDefault();
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      className={`content-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(content.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Card content */}
    </div>
  );
};
```

#### 5.6.2 Screen Reader Support

ARIA attributes and semantic HTML improve screen reader navigation:

```tsx
// Content library with ARIA support
const ContentLibrary = () => {
  return (
    <div role="region" aria-label="Content Library">
      <div aria-live="polite" className="sr-only">
        {isLoading ? 'Loading content items' : `${totalItems} content items available`}
      </div>
      
      <header>
        <h1>Content Library</h1>
        <div role="search">
          <label htmlFor="content-search">Search content</label>
          <input 
            id="content-search" 
            type="search" 
            aria-controls="content-grid"
            onChange={handleSearchChange} 
          />
        </div>
      </header>
      
      <div id="content-grid" role="grid" aria-busy={isLoading}>
        {/* Grid content */}
      </div>
    </div>
  );
};
```

#### 5.6.3 Color Contrast and Focus

Ensuring sufficient color contrast and visible focus indicators:

```css
/* Focus styles */
.content-card:focus {
  outline: 2px solid #003D63;
  outline-offset: 2px;
}

/* Status indicators with sufficient contrast */
.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status-badge.draft {
  background-color: #E0E0E0;
  color: #000000; /* 15.8:1 contrast ratio */
}

.status-badge.published {
  background-color: #04B27A;
  color: #FFFFFF; /* 4.6:1 contrast ratio */
}

.status-badge.archived {
  background-color: #757575;
  color: #FFFFFF; /* 4.6:1 contrast ratio */
}
```

#### 5.6.4 Content Creation Accessibility

Content creation tools are designed to encourage accessible content:

```tsx
// Accessible image upload component
const ImageUploader = ({ onChange, error }) => {
  return (
    <div>
      <label htmlFor="image-upload">Upload Image</label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onChange}
        aria-describedby="image-requirements image-error"
      />
      <div id="image-requirements" className="helper-text">
        Accepted formats: JPG, PNG, WebP. Maximum size: 5MB.
      </div>
      {error && (
        <div id="image-error" className="error-text" role="alert">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="alt-text" className="required">
          Alt Text (for accessibility)
        </label>
        <input
          id="alt-text"
          type="text"
          aria-describedby="alt-text-help"
          required
        />
        <div id="alt-text-help" className="helper-text">
          Provide a description of the image for users who cannot see it.
        </div>
      </div>
    </div>
  );
};
```

### 5.7 Performance Optimization

The content management system implements several performance optimizations:

#### 5.7.1 Data Fetching Optimizations

Using React Query for efficient data fetching:

```tsx
// Optimized queries with prefetching
export const ContentPagesLayout = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Prefetch common data
  useEffect(() => {
    // Prefetch content types
    queryClient.prefetchQuery({
      queryKey: ['content', 'types'],
      queryFn: contentService.getContentTypes,
    });
    
    // Prefetch tags
    queryClient.prefetchQuery({
      queryKey: ['content', 'tags'],
      queryFn: contentService.getTags,
    });
  }, [queryClient]);
  
  return <>{children}</>;
};
```

#### 5.7.2 Virtualized Lists

For large content libraries, virtualized lists improve rendering performance:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedContentList = ({ items, rowHeight, onItemClick }) => {
  const parentRef = useRef(null);
  
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
  });
  
  return (
    <div 
      ref={parentRef}
      className="virtualized-list-container"
      style={{ height: '600px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="virtualized-list-item"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${rowHeight}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
            onClick={() => onItemClick(items[virtualItem.index])}
          >
            <ContentListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 5.7.3 Image Optimization

Optimized image loading for media content:

```tsx
import Image from 'next/image';

const MediaThumbnail = ({ media, width = 200, height = 150 }) => {
  if (media.type === 'image') {
    return (
      <div className="media-thumbnail">
        <Image
          src={media.thumbnailUrl}
          alt={media.name}
          width={width}
          height={height}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='30' viewBox='0 0 40 30'%3E%3Crect width='40' height='30' fill='%23f0f0f0'/%3E%3C/svg%3E"
        />
      </div>
    );
  }
  
  // Render appropriate thumbnail for other media types
  return (
    <div className="media-thumbnail">
      <div className={`media-icon ${media.type}`}>
        {media.type === 'video' && <VideoIcon />}
        {media.type === 'audio' && <AudioIcon />}
        {media.type === 'document' && <DocumentIcon />}
      </div>
      <span className="media-name">{media.name}</span>
    </div>
  );
};
```

#### 5.7.4 Code Splitting

Using dynamic imports to reduce initial bundle size:

```tsx
// Dynamic import for content editors
const TextContentEditor = dynamic(() => import('@/components/features/content/TextContentEditor'), {
  loading: () => <ContentEditorSkeleton />,
  ssr: false, // No need to render on server
});

const QuizContentEditor = dynamic(() => import('@/components/features/content/QuizContentEditor'), {
  loading: () => <ContentEditorSkeleton />,
  ssr: false,
});

// Conditional rendering based on content type
const ContentEditor = ({ contentType, ...props }) => {
  switch (contentType) {
    case 'text':
      return <TextContentEditor {...props} />;
    case 'quiz':
      return <QuizContentEditor {...props} />;
    // Other content types...
    default:
      return <div>Unsupported content type</div>;
  }
};
```

## 6. User Roles and Permissions

Different user roles have varying levels of access to content functionality:

### 6.1 Role-Based Access

| Feature | Content Specialist | Training Manager | Program Manager | Organization Admin |
|---------|-------------------|-----------------|-----------------|-------------------|
| View content | ✅ | ✅ | ✅ | ✅ |
| Create content | ✅ | ✅ | ❌ | ✅ |
| Edit content | ✅ | ✅ | ❌ | ✅ |
| Delete content | ✅ | ✅ | ❌ | ✅ |
| Manage templates | ✅ | ✅ | ❌ | ✅ |
| Submit for approval | ✅ | ✅ | ❌ | ✅ |
| Manage media | ✅ | ✅ | ✅ | ✅ |
| Manage tags | ✅ | ✅ | ❌ | ✅ |
| Manage collections | ✅ | ✅ | ✅ | ✅ |
| License management | ❌ | ✅ | ❌ | ✅ |
| Marketplace publishing | ❌ | ✅ | ❌ | ✅ |

### 6.2 Permission Implementation

Permissions are enforced through a combination of:

1. **Backend API Authorization**: Server-side role checks on API endpoints
2. **Frontend Permission Checks**: UI elements conditional rendering based on user roles
3. **Feature Flags**: Configuration-based enabling/disabling of features by role

```tsx
// Permission hook
const useContentPermissions = () => {
  const { user } = useAuth();
  
  return {
    canCreate: ['content_specialist', 'training_manager', 'organization_admin'].includes(user.role),
    canEdit: ['content_specialist', 'training_manager', 'organization_admin'].includes(user.role),
    canDelete: ['content_specialist', 'training_manager', 'organization_admin'].includes(user.role),
    canPublish: ['training_manager', 'organization_admin'].includes(user.role),
    canManageTags: ['content_specialist', 'training_manager', 'organization_admin'].includes(user.role),
    canLicense: ['training_manager', 'organization_admin'].includes(user.role),
    canSubmitToMarketplace: ['training_manager', 'organization_admin'].includes(user.role),
  };
};

// Usage in component
const ContentActions = ({ contentId }) => {
  const permissions = useContentPermissions();
  
  return (
    <div className="content-actions">
      {permissions.canEdit && (
        <Button onClick={() => handleEdit(contentId)}>Edit</Button>
      )}
      {permissions.canDelete && (
        <Button variant="danger" onClick={() => handleDelete(contentId)}>Delete</Button>
      )}
      {permissions.canPublish && contentStatus === 'draft' && (
        <Button variant="primary" onClick={() => handlePublish(contentId)}>Publish</Button>
      )}
      {permissions.canLicense && (
        <Button onClick={() => handleLicense(contentId)}>Manage License</Button>
      )}
    </div>
  );
};
```

## 7. Integration with Other Platform Features

The content management system integrates with other key platform features:

### 7.1 Journey Builder Integration

Content created in the CMS can be used in journey touchpoints:

```tsx
// Content selector component for Journey Builder
const JourneyContentSelector = ({ onSelect, selectedContentId, contentType }) => {
  // Fetch content filtered by type
  const { data, isLoading } = useContentLibrary({
    contentTypes: contentType ? [contentType] : undefined,
    status: ['published'],
  });
  
  // Render content selection interface
  return (
    <div className="journey-content-selector">
      <h3>Select Content</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="content-grid">
          {data?.items.map(content => (
            <ContentCard
              key={content.id}
              content={content}
              isSelected={content.id === selectedContentId}
              onClick={() => onSelect(content.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

### 7.2 Program Management Integration

Programs use content from the CMS for worker interactions:

```tsx
// Program content preview
const ProgramContentPreview = ({ programId, touchpointId }) => {
  // Fetch touchpoint data including content reference
  const { data: touchpoint, isLoading } = useTouchpoint(programId, touchpointId);
  
  // Fetch referenced content
  const { data: content, isLoading: isLoadingContent } = useContentDetail(
    touchpoint?.contentId,
    { enabled: !!touchpoint?.contentId }
  );
  
  if (isLoading || isLoadingContent) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="program-content-preview">
      <h3>Content Preview: {content.title}</h3>
      <ContentPreview 
        content={content} 
        previewMode="whatsapp" 
      />
    </div>
  );
};
```

### 7.3 Analytics Integration

Content usage and performance analytics:

```tsx
// Content analytics component
const ContentAnalytics = ({ contentId }) => {
  // Fetch content usage analytics
  const { data, isLoading } = useContentAnalytics(contentId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="content-analytics">
      <h3>Content Performance</h3>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Usage Count</h4>
          <div className="metric">{data.usageCount}</div>
          <div className="label">Total Programs</div>
        </div>
        
        <div className="analytics-card">
          <h4>Completion Rate</h4>
          <div className="metric">{data.completionRate}%</div>
          <div className="label">Average</div>
        </div>
        
        <div className="analytics-card">
          <h4>Engagement Score</h4>
          <div className="metric">{data.engagementScore}/10</div>
          <div className="label">Based on interactions</div>
        </div>
      </div>
      
      {data.contentType === 'quiz' && (
        <div className="quiz-analytics">
          <h4>Quiz Performance</h4>
          <div className="chart-container">
            <QuizPerformanceChart data={data.quizPerformance} />
          </div>
        </div>
      )}
    </div>
  );
};
```

### 7.4 Marketplace Integration

Content can be published to the platform marketplace:

```tsx
// Marketplace publishing component
const MarketplacePublishing = ({ contentId }) => {
  const { data: content } = useContentDetail(contentId);
  const { canSubmitToMarketplace } = useContentPermissions();
  
  const [licenseData, setLicenseData] = useState({
    licenseType: 'standard',
    price: 0,
    allowModification: false,
    requireAttribution: true,
  });
  
  const publishMutation = usePublishToMarketplace();
  
  if (!canSubmitToMarketplace) {
    return (
      <Alert severity="info">
        You do not have permission to publish content to the marketplace.
      </Alert>
    );
  }
  
  const handlePublish = () => {
    publishMutation.mutate({
      contentId,
      licenseData,
    });
  };
  
  return (
    <div className="marketplace-publishing">
      <h3>Publish to Marketplace</h3>
      
      <form onSubmit={handlePublish}>
        {/* License configuration fields */}
        {/* ... */}
        
        <Button 
          type="submit" 
          disabled={publishMutation.isLoading}
        >
          {publishMutation.isLoading ? 'Publishing...' : 'Publish to Marketplace'}
        </Button>
      </form>
    </div>
  );
};
```

## 8. Future Enhancements

The content management system is designed to evolve over time. Future enhancements may include:

### 8.1 AI-Assisted Content Creation

Integration with AI services to assist with content creation:

- Text generation and enhancement
- Image generation based on prompts
- Translation assistance for multi-language content
- Sentiment analysis for reflection responses

### 8.2 Advanced Media Management

Enhanced capabilities for media assets:

- Automated video captioning and transcription
- Advanced image editing capabilities
- Media asset versioning
- Digital rights management

### 8.3 Collaborative Editing

Multi-user editing capabilities:

- Real-time collaborative editing
- Comments and annotations
- Approval workflows
- Content review process

### 8.4 Personalization Framework

Content personalization capabilities:

- Dynamic content variables based on worker attributes
- Conditional content blocks
- A/B testing integration
- Personalization rules editor

## 9. Conclusion

The Content Management System is a critical component of the ABCD Behavior Coach platform, enabling the creation, organization, and delivery of educational and behavioral change content. By following the specifications outlined in this document, the implementation will provide a robust, user-friendly, and extensible system that meets the needs of diverse content creators and program managers.

The modular architecture, comprehensive component library, and integration with other platform features ensure that the CMS will scale effectively as the platform grows and evolves. The focus on accessibility, performance, and user experience will enable content creators to work efficiently while producing high-quality content for worker engagement.
