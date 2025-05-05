import { Response } from 'express';
import { ContentType } from '../models/content.model';
import { AppError } from '../../../common/middleware/errorHandler';

/**
 * Error codes for content operations
 */
export enum ContentErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MEDIA_ERROR = 'MEDIA_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR'
}

/**
 * Content error response interface
 */
export interface ContentErrorResponse {
  success: boolean;
  status: string;
  code: ContentErrorCode;
  message: string;
  details?: string | string[] | Record<string, any>;
  timestamp: string;
}

/**
 * Service for handling content-specific errors
 */
export class ContentErrorService {
  /**
   * Handle validation errors
   * @param res Express response object
   * @param errors Validation error messages
   * @param message General error message
   */
  handleValidationError(res: Response, errors: string[], message = 'Validation failed'): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.VALIDATION_ERROR,
      message,
      details: errors,
      timestamp: new Date().toISOString()
    };

    res.status(400).json(errorResponse);
  }

  /**
   * Handle resource not found errors
   * @param res Express response object
   * @param resourceType Resource type (e.g., 'Content', 'MediaAsset')
   * @param id Resource ID
   */
  handleNotFoundError(res: Response, resourceType: string, id: string): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.RESOURCE_NOT_FOUND,
      message: `${resourceType} not found`,
      details: `${resourceType} with ID ${id} does not exist or has been deleted`,
      timestamp: new Date().toISOString()
    };

    res.status(404).json(errorResponse);
  }

  /**
   * Handle media-related errors
   * @param res Express response object
   * @param mediaType Media type
   * @param mediaId Media ID
   * @param message Error message
   */
  handleMediaError(res: Response, mediaType: string, mediaId: string, message: string): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.MEDIA_ERROR,
      message,
      details: `Media asset ${mediaId} is not a valid ${mediaType}`,
      timestamp: new Date().toISOString()
    };

    res.status(400).json(errorResponse);
  }

  /**
   * Handle content type errors
   * @param res Express response object
   * @param contentType Content type
   * @param expectedType Expected content type
   */
  handleContentTypeError(res: Response, contentType: ContentType, expectedType: ContentType): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.INVALID_INPUT,
      message: 'Invalid content type',
      details: `Content is of type ${contentType}, but expected ${expectedType}`,
      timestamp: new Date().toISOString()
    };

    res.status(400).json(errorResponse);
  }

  /**
   * Handle missing required field errors
   * @param res Express response object
   * @param fields Missing fields
   */
  handleMissingFieldsError(res: Response, fields: string[]): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.INVALID_INPUT,
      message: 'Missing required fields',
      details: fields,
      timestamp: new Date().toISOString()
    };

    res.status(400).json(errorResponse);
  }

  /**
   * Handle operation not permitted error
   * @param res Express response object
   * @param message Error message
   */
  handleForbiddenError(res: Response, message: string): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.FORBIDDEN,
      message,
      timestamp: new Date().toISOString()
    };

    res.status(403).json(errorResponse);
  }

  /**
   * Handle duplicate resource error
   * @param res Express response object
   * @param resourceType Resource type
   * @param details Additional details
   */
  handleDuplicateError(res: Response, resourceType: string, details: string): void {
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'fail',
      code: ContentErrorCode.DUPLICATE_ERROR,
      message: `${resourceType} already exists`,
      details,
      timestamp: new Date().toISOString()
    };

    res.status(409).json(errorResponse);
  }

  /**
   * Handle internal server errors
   * @param res Express response object
   * @param error Original error object
   */
  handleInternalError(res: Response, error: Error): void {
    console.error('Internal server error:', error);
    
    const errorResponse: ContentErrorResponse = {
      success: false,
      status: 'error',
      code: ContentErrorCode.INTERNAL_ERROR,
      message: 'An internal server error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    };

    res.status(500).json(errorResponse);
  }

  /**
   * Parse error and send appropriate response
   * @param res Express response object
   * @param error Error object
   */
  handleError(res: Response, error: any): void {
    // Handle AppError instances
    if (error instanceof AppError) {
      const errorResponse: ContentErrorResponse = {
        success: false,
        status: error.status,
        code: this.mapStatusToErrorCode(error.statusCode),
        message: error.message,
        timestamp: new Date().toISOString()
      };
      
      res.status(error.statusCode).json(errorResponse);
      return;
    }
    
    // Check for common error patterns
    const errorMessage = error.message || '';
    
    if (errorMessage.includes('not found')) {
      const matches = errorMessage.match(/(\w+) with ID ([a-zA-Z0-9-]+) not found/);
      if (matches && matches.length >= 3) {
        this.handleNotFoundError(res, matches[1], matches[2]);
        return;
      }
      
      if (errorMessage.includes('Media asset') && errorMessage.includes('not found')) {
        const mediaId = errorMessage.match(/Media asset with ID ([a-zA-Z0-9-]+)/)?.[1] || 'unknown';
        this.handleNotFoundError(res, 'Media asset', mediaId);
        return;
      }
      
      // Generic not found error
      this.handleNotFoundError(res, 'Resource', 'unknown');
      return;
    }
    
    if (errorMessage.includes('Validation failed')) {
      const errors = errorMessage.replace('Validation failed: ', '').split(', ');
      this.handleValidationError(res, errors);
      return;
    }
    
    if (errorMessage.includes('is not a')) {
      if (errorMessage.includes('is not an image')) {
        const mediaId = errorMessage.match(/Media asset with ID ([a-zA-Z0-9-]+)/)?.[1] || 'unknown';
        this.handleMediaError(res, 'image', mediaId, errorMessage);
        return;
      }
      
      if (errorMessage.includes('is not a video')) {
        const mediaId = errorMessage.match(/Media asset with ID ([a-zA-Z0-9-]+)/)?.[1] || 'unknown';
        this.handleMediaError(res, 'video', mediaId, errorMessage);
        return;
      }
      
      if (errorMessage.includes('is not an audio')) {
        const mediaId = errorMessage.match(/Media asset with ID ([a-zA-Z0-9-]+)/)?.[1] || 'unknown';
        this.handleMediaError(res, 'audio', mediaId, errorMessage);
        return;
      }
      
      if (errorMessage.includes('is not a document')) {
        const mediaId = errorMessage.match(/Media asset with ID ([a-zA-Z0-9-]+)/)?.[1] || 'unknown';
        this.handleMediaError(res, 'document', mediaId, errorMessage);
        return;
      }
    }
    
    // Fall back to internal error handler
    this.handleInternalError(res, error);
  }
  
  /**
   * Map HTTP status code to error code
   * @param statusCode HTTP status code
   * @returns Error code
   */
  private mapStatusToErrorCode(statusCode: number): ContentErrorCode {
    switch (statusCode) {
      case 400:
        return ContentErrorCode.INVALID_INPUT;
      case 401:
        return ContentErrorCode.UNAUTHORIZED;
      case 403:
        return ContentErrorCode.FORBIDDEN;
      case 404:
        return ContentErrorCode.RESOURCE_NOT_FOUND;
      case 409:
        return ContentErrorCode.DUPLICATE_ERROR;
      default:
        return ContentErrorCode.INTERNAL_ERROR;
    }
  }
} 