/**
 * Content Management System TypeScript Definitions
 * 
 * These types mirror the backend models and provide type safety for frontend components.
 */

import { MediaAsset } from './mediaAsset';

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
 * Base Content interface
 */
export interface Content {
  id: string;
  title: string;
  description?: string | null;
  status: ContentStatus;
  type: ContentType;
  createdAt: Date | string;
  updatedAt: Date | string;
  organizationId: string;
  createdById?: string | null;
  updatedById?: string | null;
  tags?: ContentTag[];
}

/**
 * Content data with type-specific details
 */
export interface ContentWithDetails extends Content {
  typeSpecificData?: TextContent | ImageContent | VideoContent | AudioContent | DocumentContent | QuizContent | ReflectionContent | TemplateContent;
  mediaDetails?: MediaAsset | null;
  textContent?: TextContent | null;
  imageContent?: ImageContent | null;
  videoContent?: VideoContent | null;
  audioContent?: AudioContent | null;
  documentContent?: DocumentContent | null;
  quizContent?: QuizContent | null;
  reflectionContent?: ReflectionContent | null;
  templateContent?: TemplateContent | null;
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
  tagIds?: string[];
}

/**
 * Data for updating a content entity
 */
export interface UpdateContentDto {
  title?: string;
  description?: string | null;
  status?: ContentStatus;
  updatedById?: string | null;
  tagIds?: string[];
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

/**
 * Content tag definition
 */
export interface ContentTag {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
 * Quiz question option interface
 */
export interface QuizQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Quiz question interface
 */
export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizQuestionOption[];
  explanation?: string | null;
  points?: number;
}

/**
 * Quiz content interface
 */
export interface QuizContent {
  id: string;
  contentId: string;
  questions: QuizQuestion[];
  scoringType?: 'standard' | 'weighted' | 'no_score' | null;
  timeLimit?: number | null; // in seconds
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
 * Template variable interface
 */
export interface TemplateVariable {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

/**
 * Template content interface
 */
export interface TemplateContent {
  id: string;
  contentId: string;
  templateText: string;
  variables: TemplateVariable[];
  channel: string;
  approvalStatus?: string | null;
}

/**
 * Response when listing content items
 */
export interface ContentListResponse {
  success: boolean;
  contents: Content[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  }
}

/**
 * Response when retrieving a single content item
 */
export interface ContentResponse {
  success: boolean;
  content: ContentWithDetails;
}

/**
 * Form state for content creation/editing
 */
export interface ContentFormState {
  title: string;
  description: string;
  status: ContentStatus;
  type: ContentType;
  tagIds: string[];
  // Type-specific data
  text?: string;
  formatting?: any;
  mediaAssetId?: string;
  altText?: string;
  caption?: string;
  transcript?: string;
  questions?: QuizQuestion[];
  scoringType?: string;
  timeLimit?: number;
  promptText?: string;
  guidanceText?: string;
  templateText?: string;
  variables?: TemplateVariable[];
  channel?: string;
}

/**
 * Content preview configuration
 */
export interface ContentPreviewConfig {
  showPreview: boolean;
  previewType: 'whatsapp' | 'web' | 'mobile';
  previewDevice?: 'phone' | 'tablet' | 'desktop';
} 