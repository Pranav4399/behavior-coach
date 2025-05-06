/**
 * Content-Media Integration TypeScript Definitions
 * 
 * These types handle the integration between content and media assets.
 */

import { ContentType } from './content';
import { MediaAsset, MediaType } from './mediaAsset';

/**
 * Mapping between ContentType and MediaType
 */
export const CONTENT_TO_MEDIA_TYPE_MAP: Record<ContentType, MediaType | null> = {
  [ContentType.TEXT]: null,
  [ContentType.IMAGE]: MediaType.IMAGE,
  [ContentType.VIDEO]: MediaType.VIDEO,
  [ContentType.AUDIO]: MediaType.AUDIO,
  [ContentType.DOCUMENT]: MediaType.DOCUMENT,
  [ContentType.QUIZ]: null,
  [ContentType.REFLECTION]: null,
  [ContentType.TEMPLATE]: null
};

/**
 * Content creation with media upload request
 */
export interface ContentMediaCreateRequest {
  mediaFile?: File;
  mediaId?: string; // When using existing media
  content: {
    title: string;
    description?: string;
    type: ContentType;
    status?: string;
    organizationId: string;
  };
  mediaMetadata?: {
    altText?: string;
    caption?: string;
    transcript?: string;
  };
  typeSpecificData?: Record<string, any>;
}

/**
 * Media usage in content result
 */
export interface MediaUsage {
  mediaAssetId: string;
  contentId: string;
  contentTitle: string;
  contentType: ContentType;
  usageType: 'primary' | 'referenced';
  createdAt: Date | string;
}

/**
 * Media selection result
 */
export interface MediaSelectionResult {
  selectedAsset: MediaAsset;
  metadata: {
    altText?: string;
    caption?: string;
    transcript?: string;
    description?: string;
  };
}

/**
 * Checks if a content type requires media
 */
export function contentTypeRequiresMedia(type: ContentType): boolean {
  return CONTENT_TO_MEDIA_TYPE_MAP[type] !== null;
}

/**
 * Gets required media type for a content type
 */
export function getRequiredMediaType(contentType: ContentType): MediaType | null {
  return CONTENT_TO_MEDIA_TYPE_MAP[contentType];
} 