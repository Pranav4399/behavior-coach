import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { 
  validateFile, 
  FileValidationError, 
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES,
  getFileConstraintsForDisplay
} from '../utils/fileValidator';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Custom file filter for multer
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  try {
    // This will throw an error if the file type is not allowed
    validateFile(file.mimetype, file.size);
    cb(null, true);
  } catch (error) {
    cb(error as Error);
  }
};

// Create multer upload middleware with dynamic size limits based on file type
export const uploadMiddleware = multer({
  storage,
  // Set a large fileSize limit here since we'll do custom validation
  limits: {
    // Use the largest possible file size from our constraints
    fileSize: FILE_SIZE_LIMITS.DOCUMENT
  },
  fileFilter
});

/**
 * Middleware to handle validation errors from multer
 */
export const handleFileValidationErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof FileValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
      constraints: getFileConstraintsForDisplay()
    });
  }
  
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large',
        code: 'FILE_TOO_LARGE',
        constraints: getFileConstraintsForDisplay()
      });
    }
  }
  
  // Pass other errors to the next error handler
  next(err);
};

/**
 * Get file constraints information (for API endpoints)
 */
export const getFileConstraints = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    constraints: getFileConstraintsForDisplay(),
    allowedTypes: {
      image: ALLOWED_MIME_TYPES.IMAGE,
      video: ALLOWED_MIME_TYPES.VIDEO,
      audio: ALLOWED_MIME_TYPES.AUDIO,
      document: ALLOWED_MIME_TYPES.DOCUMENT
    },
    sizeLimits: {
      image: FILE_SIZE_LIMITS.IMAGE,
      video: FILE_SIZE_LIMITS.VIDEO,
      audio: FILE_SIZE_LIMITS.AUDIO,
      document: FILE_SIZE_LIMITS.DOCUMENT
    }
  });
}; 