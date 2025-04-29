import multer from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * Multer storage configuration for memory storage
 * (files will be stored in memory as buffers rather than on disk)
 */
const storage = multer.memoryStorage();

/**
 * Multer file filter function to restrict uploads to only CSV files
 */
const csvFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  // Accept only csv files
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') {
    return callback(new Error('Only CSV files are allowed'));
  }
  callback(null, true);
};

/**
 * Multer instance configured for CSV uploads
 * Restricts file size to 5MB and only allows CSV files
 */
export const csvUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: csvFileFilter,
});

/**
 * Error handler for multer errors 
 * Converts multer-specific errors to a consistent API error format
 */
export const handleUploadError = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    let message = 'File upload error';
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the 5MB limit';
    }
    
    return res.status(400).json({
      success: false,
      message,
      error: err.message,
    });
  } else if (err) {
    // Non-Multer error (e.g., from fileFilter)
    return res.status(400).json({
      success: false,
      message: 'Invalid file',
      error: err.message,
    });
  }
  
  // No error occurred, continue to next middleware
  next();
}; 