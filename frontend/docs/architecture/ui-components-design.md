# Reusable UI Components Design

## Overview

This document outlines the design of domain-specific UI components for the Behavior Coach platform's content management system. These components provide consistent interaction patterns, visual styling, and behavior across different content types and workflows, building on top of existing UI primitives.

## Component Library Foundation

The UI components are built on top of existing [shadcn/ui](https://ui.shadcn.com/) components, which provide accessible, customizable primitives based on Radix UI and Tailwind CSS. We'll leverage these existing components rather than recreating them.

## Content-Related Components

### ContentCard

A versatile card component for displaying content items in grid views.

```tsx
interface ContentCardProps {
  content: Content;
  onClick?: (content: Content) => void;
  selected?: boolean;
  actions?: React.ReactNode;
  compact?: boolean;
  showPreview?: boolean;
}
```

**Key Features:**
- Displays content title, type, status, and creation date
- Optional thumbnail/preview for media-based content
- Supports selection state with visual feedback
- Configurable action buttons (edit, delete, etc.)
- Compact mode for dense layouts

### ContentStatusBadge

A badge component that visually represents content status.

```tsx
interface ContentStatusBadgeProps {
  status: ContentStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}
```

**Key Features:**
- Color-coded based on status (draft, review, published, etc.)
- Optional text label
- Different size variants

### ContentTypeIcon

An icon component that visually represents content type.

```tsx
interface ContentTypeIconProps {
  type: ContentType;
  size?: 'sm' | 'md' | 'lg';
  color?: boolean; // Whether to use type-specific color
}
```

**Key Features:**
- Distinct icon for each content type
- Configurable size
- Optional type-specific coloring

### ContentFilterBar

A component for filtering and searching content.

```tsx
interface ContentFilterBarProps {
  filters: ContentFilterOptions;
  onFiltersChange: (filters: ContentFilterOptions) => void;
  availableTypes?: ContentType[];
  availableTags?: ContentTag[];
  showStatusFilter?: boolean;
  showTypeFilter?: boolean;
  showTagFilter?: boolean;
  showSearch?: boolean;
}
```

**Key Features:**
- Search input
- Status filter dropdown
- Content type filter dropdown
- Tags filter dropdown
- Filter pills for active filters

### ContentFormHeader

A header component for content creation/editing forms.

```tsx
interface ContentFormHeaderProps {
  title: string;
  contentType?: ContentType;
  status?: ContentStatus;
  onStatusChange?: (status: ContentStatus) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isDirty?: boolean;
  isValid?: boolean;
  isSaving?: boolean;
}
```

**Key Features:**
- Form title with content type indicator
- Status selector
- Save and cancel buttons
- Loading indicator for save action
- Dirty state indication

### ContentMetadataPanel

A panel for displaying and editing content metadata.

```tsx
interface ContentMetadataPanelProps {
  title: string;
  description?: string;
  tags?: ContentTag[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  status?: ContentStatus;
  editable?: boolean;
  onEdit?: (field: string, value: any) => void;
}
```

**Key Features:**
- Displays all common metadata fields
- Optional edit mode for updatable fields
- Formatted dates and times
- Tag chips with add/remove functionality in edit mode

## Media-Related Components

### MediaUploader

A component for uploading media files with validation and progress tracking.

```tsx
interface MediaUploaderProps {
  accept?: string[]; // MIME types
  maxSize?: number; // in bytes
  uploadProgress?: MediaUploadProgress;
  onFileSelect: (file: File) => void;
  onUploadCancel?: () => void;
  onUploadRetry?: () => void;
  error?: string;
  mediaType?: MediaType;
  dropzoneText?: string;
  showPreview?: boolean;
}
```

**Key Features:**
- Drag-and-drop support
- File input button
- Progress indicator
- File validation (type, size)
- Error display
- File preview (for images)
- Cancellation and retry options

### MediaSelector

A component for selecting existing media assets.

```tsx
interface MediaSelectorProps {
  mediaType?: MediaType;
  onSelect: (result: MediaSelectionResult) => void;
  onCancel?: () => void;
  preselectedMedia?: MediaAsset;
  showUploadOption?: boolean;
  onUploadRequest?: () => void;
  organizationId: string;
}
```

**Key Features:**
- Grid view of available media
- Filtering by type and search
- Preview on hover/select
- Recently used media section
- Option to upload new media

### MediaPreview

A component for previewing different types of media.

```tsx
interface MediaPreviewProps {
  mediaAsset: MediaAsset;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number | string;
  height?: number | string;
  alt?: string;
  caption?: string;
  onError?: (error: string) => void;
}
```

**Key Features:**
- Type-specific rendering (image, video, audio, document)
- Appropriate controls for media type
- Fallback for unsupported or error states
- Caption display
- Lazy loading

### WhatsAppPreview

A component that simulates how content will appear in WhatsApp.

```tsx
interface WhatsAppPreviewProps {
  content: Content;
  mediaAsset?: MediaAsset;
  message?: string;
  caption?: string;
  transcript?: string;
  altText?: string;
  deviceType?: 'mobile' | 'desktop';
  darkMode?: boolean;
}
```

**Key Features:**
- WhatsApp-like UI styling
- Message bubble layout
- Media rendering with appropriate constraints
- Time stamp
- Delivery indicators
- Light/dark mode support

## Form Components

### RichTextEditor

A rich text editor component for text-based content.

```tsx
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number | string;
  maxHeight?: number | string;
  toolbarOptions?: string[]; // ['bold', 'italic', 'link', etc.]
  readOnly?: boolean;
  simpleMode?: boolean; // Reduced toolbar for simplicity
}
```

**Key Features:**
- Rich formatting options
- Link support
- Basic formatting shortcuts
- Clean HTML output
- Character count
- Customizable toolbar
- Focus states

### MediaMetadataForm

A form for editing media-specific metadata.

```tsx
interface MediaMetadataFormProps {
  mediaType: MediaType;
  values: {
    altText?: string;
    caption?: string;
    transcript?: string;
    description?: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}
```

**Key Features:**
- Alt text input (for images, videos)
- Caption input (for all media)
- Transcript input (for audio, video)
- Description input (for documents)
- Field validation
- Type-appropriate field set

### TagInput

A component for adding and managing tags.

```tsx
interface TagInputProps {
  tags: ContentTag[];
  onTagsChange: (tags: ContentTag[]) => void;
  availableTags?: ContentTag[];
  organizationId: string;
  canCreateTags?: boolean;
  maxTags?: number;
  placeholder?: string;
}
```

**Key Features:**
- Tag chips with remove button
- Autocomplete for existing tags
- Create new tag option
- Tag limit enforcement
- Keyboard navigation

### QuestionEditor

An editor for quiz questions and answers.

```tsx
interface QuestionEditorProps {
  question: QuizQuestion;
  onChange: (question: QuizQuestion) => void;
  onDelete?: () => void;
  error?: Record<string, string>;
  showValidation?: boolean;
}
```

**Key Features:**
- Question text input
- Answer options with correct/incorrect toggle
- Add/remove answer options
- Explanation field
- Points/weight field
- Validation feedback

## Component Composition Examples

### Image Content Editor

```tsx
<Tabs defaultValue="edit">
  <TabsList>
    <TabsTrigger value="edit">Edit</TabsTrigger>
    <TabsTrigger value="preview">Preview</TabsTrigger>
  </TabsList>
  <TabsContent value="edit">
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={ContentType.IMAGE} />
          <h1 className="text-2xl font-semibold">Edit Image Content</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={handleStatusChange}
            options={contentStatusOptions}
          />
          <Button
            onClick={handleSave}
            disabled={!isValid || !isDirty || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input label="Title" value={title} onChange={setTitle} />
          <Textarea label="Description" value={description} onChange={setDescription} />
          <MediaSelector
            mediaType={MediaType.IMAGE}
            onSelect={handleMediaSelect}
            preselectedMedia={selectedMedia}
            organizationId={organizationId}
          />
          {selectedMedia && (
            <MediaMetadataForm
              mediaType={MediaType.IMAGE}
              values={{
                altText,
                caption,
              }}
              onChange={handleMetadataChange}
            />
          )}
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            availableTags={availableTags}
            organizationId={organizationId}
          />
        </div>
        <div>
          <WhatsAppPreview
            content={previewContent}
            mediaAsset={selectedMedia}
            caption={caption}
            altText={altText}
          />
        </div>
      </div>
    </div>
  </TabsContent>
  <TabsContent value="preview">
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {selectedMedia && (
        <MediaPreview
          mediaAsset={selectedMedia}
          caption={caption}
          alt={altText}
        />
      )}
      <div className="mt-4 flex gap-2">
        {tags.map(tag => (
          <Badge key={tag.id}>{tag.name}</Badge>
        ))}
      </div>
    </div>
  </TabsContent>
</Tabs>
```

## Design System Consistency

All components adhere to these design system principles:

1. **Color Palette**: Consistent use of primary, secondary, and accent colors
2. **Typography**: Consistent font family, sizes, and weights
3. **Spacing**: 4px/0.25rem base unit for margins and padding
4. **Borders**: Consistent border radius and stroke width
5. **Shadows**: Consistent elevation levels
6. **Animation**: Consistent durations and easing functions

## Accessibility Considerations

1. **Keyboard Navigation**: All interactive components are keyboard accessible
2. **Screen Reader Support**: ARIA attributes and semantic HTML
3. **Focus States**: Visible focus indicators for all interactive elements
4. **Color Contrast**: WCAG AA compliance for all text and UI elements
5. **Reduced Motion**: Respects user preferences for reduced motion

## Responsive Behavior

1. **Mobile-First Approach**: Components designed for small screens first
2. **Breakpoints**: Consistent breakpoints for layout changes (sm, md, lg, xl)
3. **Touch Targets**: Minimum 44px height/width for interactive elements
4. **Responsive Typography**: Fluid typography based on viewport size
5. **Stack to Grid**: Components that shift from vertical to grid layouts at larger sizes

## Implementation Approach

These components will be implemented using:

1. TypeScript for type safety
2. React for component structure
3. Tailwind CSS for styling, extending shadcn/ui
4. React Context for state management where appropriate
5. Composition pattern for complex components

## Next Steps

1. Create content-specific components with tests
2. Implement missing form components like TagInput and MediaMetadataForm
3. Develop specialized MediaUploader with proper constraints
4. Create WhatsAppPreview for all content types
5. Integrate with the content creation workflow 