/**
 * Enum for content status
 */
export enum ContentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * Enum for content type
 */
export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
  TEMPLATE = 'template'
}

/**
 * Content entity interface
 */
export interface Content {
  id: string;
  title: string;
  description?: string | null;
  status: ContentStatus;
  type: ContentType;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  createdById?: string | null;
  updatedById?: string | null;
}

/**
 * Data for creating a new content entity
 */
export interface CreateContentDto {
  title: string;
  description?: string | null;
  status?: ContentStatus;
  type: ContentType;
  organizationId: string;
  createdById?: string | null;
}

/**
 * Data for updating a content entity
 */
export interface UpdateContentDto {
  title?: string;
  description?: string | null;
  status?: ContentStatus;
  updatedById?: string | null;
}

/**
 * Filter options for querying content
 */
export interface ContentFilterOptions {
  organizationId?: string;
  createdById?: string;
  updatedById?: string;
  status?: ContentStatus;
  type?: ContentType;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// Type specific content interfaces

/**
 * Text content interface
 */
export interface TextContent {
  id: string;
  contentId: string;
  text: string;
  formatting?: any;
}

/**
 * Image content interface
 */
export interface ImageContent {
  id: string;
  contentId: string;
  mediaAssetId: string;
  altText?: string | null;
  caption?: string | null;
}

/**
 * Video content interface
 */
export interface VideoContent {
  id: string;
  contentId: string;
  mediaAssetId: string;
  caption?: string | null;
  transcript?: string | null;
  duration?: number | null;
}

/**
 * Audio content interface
 */
export interface AudioContent {
  id: string;
  contentId: string;
  mediaAssetId: string;
  caption?: string | null;
  transcript?: string | null;
  duration?: number | null;
}

/**
 * Document content interface
 */
export interface DocumentContent {
  id: string;
  contentId: string;
  mediaAssetId: string;
  description?: string | null;
}

/**
 * Quiz content interface
 */
export interface QuizContent {
  id: string;
  contentId: string;
  questions: any; // JSON structure of questions with options and correct answers
  scoringType?: string | null;
  timeLimit?: number | null;
}

/**
 * Reflection content interface
 */
export interface ReflectionContent {
  id: string;
  contentId: string;
  promptText: string;
  guidanceText?: string | null;
}

/**
 * Template content interface
 */
export interface TemplateContent {
  id: string;
  contentId: string;
  templateText: string;
  variables: any; // JSON structure of variables with descriptions
  channel: string;
  approvalStatus?: string | null;
} 