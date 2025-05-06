/**
 * Media Asset Management TypeScript Definitions
 * 
 * These types mirror the backend models and provide type safety for frontend components.
 */

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
  createdAt: Date | string;
  updatedAt: Date | string;
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
 * Interface for file upload with metadata
 */
export interface MediaUploadRequest {
  file: File;
  organizationId: string;
  altText?: string;
  uploadedById?: string;
  metadata?: Record<string, any>;
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
 * Response when listing media assets
 */
export interface MediaAssetListResponse {
  success: boolean;
  mediaAssets: MediaAsset[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  }
}

/**
 * Response when retrieving a single media asset
 */
export interface MediaAssetResponse {
  success: boolean;
  mediaAsset: MediaAsset;
}

/**
 * Valid file extensions by media type
 */
export const VALID_FILE_EXTENSIONS = {
  [MediaType.IMAGE]: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  [MediaType.VIDEO]: ['.mp4', '.mov', '.webm'],
  [MediaType.AUDIO]: ['.mp3', '.wav', '.ogg', '.m4a'],
  [MediaType.DOCUMENT]: ['.pdf', '.doc', '.docx', '.txt']
};

/**
 * Maximum file size by media type (in bytes)
 */
export const MAX_FILE_SIZE = {
  [MediaType.IMAGE]: 5 * 1024 * 1024, // 5MB
  [MediaType.VIDEO]: 16 * 1024 * 1024, // 16MB (WhatsApp limit)
  [MediaType.AUDIO]: 16 * 1024 * 1024, // 16MB (WhatsApp limit)
  [MediaType.DOCUMENT]: 20 * 1024 * 1024 // 20MB
};

/**
 * Interface for media upload progress tracking
 */
export interface MediaUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

/**
 * Interface for media selection state
 */
export interface MediaSelectionState {
  selectedMedia?: MediaAsset;
  recentMedia: MediaAsset[];
  searchQuery: string;
  filters: {
    types: MediaType[];
    dateRange?: {
      start: Date | null;
      end: Date | null;
    };
  };
}

/**
 * Media asset validation errors
 */
export interface MediaValidationErrors {
  fileSize?: string;
  fileType?: string;
  dimensions?: string;
  duration?: string;
  general?: string;
} 