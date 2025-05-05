/**
 * MediaType enum representing different types of media files
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

/**
 * Interface for MediaAsset data
 */
export interface MediaAsset {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  uploadedById?: string;
}

/**
 * Interface for creating a new MediaAsset
 */
export interface CreateMediaAssetDto {
  key: string;
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Interface for additional MediaAsset metadata
 */
export interface MediaAssetMetadataDto {
  altText?: string;
  thumbnailUrl?: string;
  customMetadata?: Record<string, any>;
  organizationId: string;
  uploadedById?: string;
}

/**
 * Interface for updating a MediaAsset
 */
export interface UpdateMediaAssetDto {
  altText?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for filtering MediaAssets
 */
export interface MediaAssetFilterOptions {
  organizationId?: string;
  type?: MediaType;
  uploadedById?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Function to determine the MediaType from MIME type
 */
export function getMediaTypeFromMimeType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) {
    return MediaType.IMAGE;
  } else if (mimeType.startsWith('video/')) {
    return MediaType.VIDEO;
  } else if (mimeType.startsWith('audio/')) {
    return MediaType.AUDIO;
  } else {
    return MediaType.DOCUMENT;
  }
} 