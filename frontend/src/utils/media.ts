import { MediaAsset, MediaType } from '@/types/mediaAsset';
import { API_BASE_URL } from '../lib/api/client';

/**
 * MediaUtils provides utilities for working with media assets and URLs
 */

// Default expiration for URLs in seconds (30 minutes)
const DEFAULT_EXPIRATION = 30 * 60;

/**
 * Get the public URL for a media asset
 * 
 * @param mediaAsset The media asset
 * @returns The public URL to access the media
 */
export function getMediaUrl(mediaAsset: MediaAsset | string): string {
  const assetId = typeof mediaAsset === 'string' ? mediaAsset : mediaAsset.id;
  return `${API_BASE_URL}/mediaAssets/${assetId}/view`;
}

/**
 * Get the public URL for a media thumbnail
 * 
 * @param mediaAsset The media asset
 * @returns The public URL to access the thumbnail
 */
export function getThumbnailUrl(mediaAsset: MediaAsset | string): string {
  // If it's a string ID, we need to assume it's an image that has a thumbnail
  if (typeof mediaAsset === 'string') {
    return `${API_BASE_URL}/mediaAssets/${mediaAsset}/thumbnail`;
  }
  
  // For actual media assets, check if thumbnail exists
  if (mediaAsset.thumbnailUrl) {
    return mediaAsset.thumbnailUrl;
  }
  
  // Return a generic placeholder based on media type if no thumbnail
  return getPlaceholderImage(mediaAsset.type);
}

/**
 * Get a presigned URL for a media asset (with limited time access)
 * 
 * @param mediaAsset The media asset
 * @param expiresIn Time in seconds until URL expires
 * @returns The presigned URL with temporary access
 */
export function getPresignedUrl(mediaAsset: MediaAsset | string, expiresIn: number = DEFAULT_EXPIRATION): string {
  const assetId = typeof mediaAsset === 'string' ? mediaAsset : mediaAsset.id;
  return `${API_BASE_URL}/mediaAssets/${assetId}/presigned-url?expiresIn=${expiresIn}`;
}

/**
 * Get a streaming URL for video/audio content
 * 
 * @param mediaAsset The media asset
 * @returns The streaming URL
 */
export function getStreamingUrl(mediaAsset: MediaAsset | string): string {
  const assetId = typeof mediaAsset === 'string' ? mediaAsset : mediaAsset.id;
  return `${API_BASE_URL}/mediaAssets/${assetId}/stream`;
}

/**
 * Get a download URL for media content
 * 
 * @param mediaAsset The media asset
 * @returns The download URL
 */
export function getDownloadUrl(mediaAsset: MediaAsset | string): string {
  const assetId = typeof mediaAsset === 'string' ? mediaAsset : mediaAsset.id;
  return `${API_BASE_URL}/mediaAssets/${assetId}/download`;
}

/**
 * Get a placeholder image URL based on media type
 * 
 * @param mediaType The type of media
 * @returns A placeholder image URL
 */
export function getPlaceholderImage(mediaType: MediaType): string {
  switch (mediaType) {
    case MediaType.IMAGE:
      return '/images/placeholders/image-placeholder.svg';
    case MediaType.VIDEO:
      return '/images/placeholders/video-placeholder.svg';
    case MediaType.AUDIO:
      return '/images/placeholders/audio-placeholder.svg';
    case MediaType.DOCUMENT:
      return '/images/placeholders/document-placeholder.svg';
    default:
      return '/images/placeholders/file-placeholder.svg';
  }
}

/**
 * Checks if a URL is an external URL (not from our API)
 * 
 * @param url The URL to check
 * @returns True if it's an external URL
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http') && !url.includes(API_BASE_URL);
}

/**
 * Gets a safe URL for displaying in the UI (either a media URL or presigned URL)
 * 
 * @param mediaAsset The media asset
 * @returns A URL that can be safely used in the UI
 */
export function getSafeDisplayUrl(mediaAsset: MediaAsset): string {
  // If the URL is already a fully-qualified URL, use it directly
  if (mediaAsset.url && isExternalUrl(mediaAsset.url)) {
    return mediaAsset.url;
  }
  
  // Otherwise, get a media URL from our API
  return getMediaUrl(mediaAsset);
}

/**
 * Creates an embed URL for a media asset (useful for iframes)
 * 
 * @param mediaAsset The media asset
 * @returns An embed URL
 */
export function getEmbedUrl(mediaAsset: MediaAsset | string): string {
  const assetId = typeof mediaAsset === 'string' ? mediaAsset : mediaAsset.id;
  return `${API_BASE_URL}/mediaAssets/${assetId}/embed`;
}

/**
 * Extract filename from a URL or path
 * 
 * @param urlOrPath URL or file path
 * @returns The filename
 */
export function extractFilename(urlOrPath: string): string {
  return urlOrPath.split('/').pop() || urlOrPath;
}

/**
 * Get file extension from URL or filename
 * 
 * @param urlOrFilename URL or filename
 * @returns The file extension (without the dot)
 */
export function getFileExtension(urlOrFilename: string): string {
  const filename = extractFilename(urlOrFilename);
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop() || '' : '';
}

/**
 * Determine if a file is an image based on its URL or extension
 * 
 * @param urlOrFilename URL or filename
 * @returns True if it's an image
 */
export function isImage(urlOrFilename: string): boolean {
  const ext = getFileExtension(urlOrFilename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

/**
 * Determine if a file is a video based on its URL or extension
 * 
 * @param urlOrFilename URL or filename
 * @returns True if it's a video
 */
export function isVideo(urlOrFilename: string): boolean {
  const ext = getFileExtension(urlOrFilename).toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
}

/**
 * Determine if a file is an audio file based on its URL or extension
 * 
 * @param urlOrFilename URL or filename
 * @returns True if it's an audio file
 */
export function isAudio(urlOrFilename: string): boolean {
  const ext = getFileExtension(urlOrFilename).toLowerCase();
  return ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
}

/**
 * Determine if a file is a document based on its URL or extension
 * 
 * @param urlOrFilename URL or filename
 * @returns True if it's a document
 */
export function isDocument(urlOrFilename: string): boolean {
  const ext = getFileExtension(urlOrFilename).toLowerCase();
  return ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
}

/**
 * Format file size for display (converts bytes to KB, MB, etc.)
 * 
 * @param bytes File size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export default {
  getMediaUrl,
  getThumbnailUrl,
  getPresignedUrl,
  getStreamingUrl,
  getDownloadUrl,
  getPlaceholderImage,
  isExternalUrl,
  getSafeDisplayUrl,
  getEmbedUrl,
  extractFilename,
  getFileExtension,
  isImage,
  isVideo,
  isAudio,
  isDocument,
  formatFileSize,
}; 