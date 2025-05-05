/**
 * File validation utility
 * 
 * Enforces constraints for file uploads, including:
 * - Size limits based on file type
 * - Allowed file types
 * - WhatsApp-compatible media constraints
 */

// WhatsApp file size limits
export const FILE_SIZE_LIMITS = {
  // Images can be up to 5MB
  IMAGE: 5 * 1024 * 1024,
  // Videos can be up to 16MB
  VIDEO: 16 * 1024 * 1024,
  // Audio can be up to 16MB
  AUDIO: 16 * 1024 * 1024,
  // Documents can be up to 100MB
  DOCUMENT: 100 * 1024 * 1024,
  // Default limit for other file types
  DEFAULT: 5 * 1024 * 1024
};

// Allowed file types by MIME type
export const ALLOWED_MIME_TYPES = {
  // Image types
  IMAGE: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ],
  // Video types
  VIDEO: [
    'video/mp4',
    'video/3gpp'
  ],
  // Audio types
  AUDIO: [
    'audio/aac',
    'audio/mp4',
    'audio/amr',
    'audio/mpeg',
    'audio/ogg'
  ],
  // Document types
  DOCUMENT: [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/plain'
  ]
};

/**
 * Error class for file validation failures
 */
export class FileValidationError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'FileValidationError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Validate if a file's MIME type is allowed
 * @param mimeType The MIME type to validate
 * @returns The file category (IMAGE, VIDEO, etc.) if valid
 * @throws FileValidationError if the MIME type is not allowed
 */
export function validateMimeType(mimeType: string): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' {
  // Check if mime type is allowed for images
  if (ALLOWED_MIME_TYPES.IMAGE.includes(mimeType)) {
    return 'IMAGE';
  }
  
  // Check if mime type is allowed for videos
  if (ALLOWED_MIME_TYPES.VIDEO.includes(mimeType)) {
    return 'VIDEO';
  }
  
  // Check if mime type is allowed for audio
  if (ALLOWED_MIME_TYPES.AUDIO.includes(mimeType)) {
    return 'AUDIO';
  }
  
  // Check if mime type is allowed for documents
  if (ALLOWED_MIME_TYPES.DOCUMENT.includes(mimeType)) {
    return 'DOCUMENT';
  }
  
  // If we get here, the MIME type is not allowed
  throw new FileValidationError(
    `File type ${mimeType} is not allowed`,
    'INVALID_FILE_TYPE',
    { allowedTypes: Object.values(ALLOWED_MIME_TYPES).flat() }
  );
}

/**
 * Validate if a file's size is within the allowed limit for its type
 * @param size The file size in bytes
 * @param fileCategory The file category (IMAGE, VIDEO, etc.)
 * @throws FileValidationError if the file size exceeds the limit
 */
export function validateFileSize(size: number, fileCategory: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'): void {
  const limit = FILE_SIZE_LIMITS[fileCategory] || FILE_SIZE_LIMITS.DEFAULT;
  
  if (size > limit) {
    const limitInMB = limit / (1024 * 1024);
    throw new FileValidationError(
      `File size exceeds the limit of ${limitInMB}MB for ${fileCategory.toLowerCase()} files`,
      'FILE_TOO_LARGE',
      { limit, size, fileCategory }
    );
  }
}

/**
 * Validate a file based on its MIME type and size
 * @param mimeType The file's MIME type
 * @param size The file size in bytes
 * @throws FileValidationError if validation fails
 */
export function validateFile(mimeType: string, size: number): void {
  // First validate the MIME type
  const fileCategory = validateMimeType(mimeType);
  
  // Then validate the file size
  validateFileSize(size, fileCategory);
}

/**
 * Get human-readable file size limit for a given MIME type
 * @param mimeType MIME type
 * @returns Human-readable size limit (e.g. "5MB")
 */
export function getFileSizeLimitForDisplay(mimeType: string): string {
  try {
    const fileCategory = validateMimeType(mimeType);
    const limitInBytes = FILE_SIZE_LIMITS[fileCategory];
    const limitInMB = limitInBytes / (1024 * 1024);
    return `${limitInMB}MB`;
  } catch (error) {
    return '5MB'; // Default limit
  }
}

/**
 * Get file type constraints for display to users
 * @returns Object with human-readable constraints
 */
export function getFileConstraintsForDisplay(): Record<string, any> {
  return {
    images: {
      formats: 'JPG, PNG, WebP, GIF',
      maxSize: `${FILE_SIZE_LIMITS.IMAGE / (1024 * 1024)}MB`
    },
    videos: {
      formats: 'MP4, 3GPP',
      maxSize: `${FILE_SIZE_LIMITS.VIDEO / (1024 * 1024)}MB`
    },
    audio: {
      formats: 'AAC, MP4, AMR, MP3, OGG',
      maxSize: `${FILE_SIZE_LIMITS.AUDIO / (1024 * 1024)}MB`
    },
    documents: {
      formats: 'PDF, Word, Excel, PowerPoint, Text',
      maxSize: `${FILE_SIZE_LIMITS.DOCUMENT / (1024 * 1024)}MB`
    }
  };
} 