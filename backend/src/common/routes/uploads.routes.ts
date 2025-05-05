import express from 'express';
import { UploadsController } from '../controllers/uploads.controller';
import multer from 'multer';

// Create router
const router = express.Router();

// Create uploads controller instance
const uploadsController = new UploadsController();

// Configure multer for memory storage (needed for S3 uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// File upload routes
router.post('/upload', upload.single('file'), uploadsController.uploadFile);
router.get('/files', uploadsController.listFiles);
router.get('/files/:key', uploadsController.getFileUrl);
router.delete('/files/:key', uploadsController.deleteFile);

export default router; 