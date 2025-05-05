import { Request, Response } from 'express';
import { S3Service } from '../services/s3.service';
import { MediaAssetService } from '../../domains/mediaAsset/services/mediaAsset.service';
import path from 'path';
import crypto from 'crypto';
import prisma from '../../../prisma/prisma';

/**
 * Controller for handling file uploads to S3/LocalStack
 */
export class UploadsController {
  private s3Service: S3Service;
  private mediaAssetService: MediaAssetService;

  /**
   * Create a new uploads controller
   */
  constructor() {
    this.s3Service = new S3Service();
    this.mediaAssetService = new MediaAssetService(prisma);
  }

  /**
   * Generate a unique ID using Node's crypto module
   * This is an alternative to using the uuid package
   */
  private generateUniqueId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Upload a file to S3
   * - Uses multer middleware to process the file
   * - Stores the file in S3
   * - Stores metadata in the database as a MediaAsset
   * - Returns the URL and other file info
   */
  uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file provided'
        });
        return;
      }

      const organizationId = req.params.organizationId || req.user?.organizationId;
      
      if (!organizationId) {
        res.status(400).json({ 
          success: false, 
          message: 'Organization ID is required' 
        });
        return;
      }

      const { originalname, buffer, mimetype, size } = req.file;
      const fileExtension = path.extname(originalname);
      const fileName = `${this.generateUniqueId()}${fileExtension}`;
      
      // Organize files by type
      let filePath = 'uploads/';
      
      // Determine folder based on MIME type
      if (mimetype.startsWith('image/')) {
        filePath += 'images/';
      } else if (mimetype.startsWith('video/')) {
        filePath += 'videos/';
      } else if (mimetype.startsWith('audio/')) {
        filePath += 'audio/';
      } else if (mimetype === 'application/pdf') {
        filePath += 'documents/';
      } else {
        filePath += 'misc/';
      }
      
      // Complete file path with filename
      filePath += fileName;
      
      // Upload to S3
      const fileUrl = await this.s3Service.uploadFile(filePath, buffer, mimetype);

      // Generate a pre-signed URL for temporary access
      const presignedUrl = await this.s3Service.getPresignedUrl(filePath);
      
      // Get alt text from request body (if provided)
      const altText = req.body.altText || undefined;
      
      // Try to generate a thumbnail for images
      let thumbnailUrl: string | undefined = undefined;
      if (mimetype.startsWith('image/')) {
        thumbnailUrl = await this.mediaAssetService.generateThumbnail(filePath, mimetype) || undefined;
      }
      
      // Store metadata in the database
      const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
      
      const mediaAsset = await this.mediaAssetService.createMediaAsset(
        {
          key: filePath,
          url: fileUrl,
          originalname,
          mimetype,
          size
        },
        {
          altText,
          thumbnailUrl,
          customMetadata: metadata,
          organizationId,
          uploadedById: req.user?.id
        }
      );
      
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          id: mediaAsset.id,
          name: originalname,
          fileName: mediaAsset.fileName,
          mimetype,
          size,
          key: filePath,
          url: fileUrl,
          presignedUrl,
          type: mediaAsset.type,
          thumbnailUrl: mediaAsset.thumbnailUrl,
          altText: mediaAsset.altText,
          metadata: mediaAsset.metadata
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload file',
        error: (error as Error).message
      });
    }
  };

  /**
   * Get a pre-signed URL for a file in S3
   */
  getFileUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      
      if (!key) {
        res.status(400).json({
          success: false,
          message: 'File key is required'
        });
        return;
      }
      
      const presignedUrl = await this.s3Service.getPresignedUrl(key);
      
      res.status(200).json({
        success: true,
        url: presignedUrl
      });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate pre-signed URL',
        error: (error as Error).message
      });
    }
  };

  /**
   * Delete a file from S3 and its metadata from the database
   * Note: This is primarily for direct S3 access.
   * For most cases, use the MediaAsset delete endpoint instead.
   */
  deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      
      if (!key) {
        res.status(400).json({
          success: false,
          message: 'File key is required'
        });
        return;
      }
      
      await this.s3Service.deleteFile(key);
      
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: (error as Error).message
      });
    }
  };

  /**
   * List files in a directory
   */
  listFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { prefix = 'uploads/' } = req.query;
      
      const files = await this.s3Service.listFiles(prefix as string);
      
      res.status(200).json({
        success: true,
        files
      });
    } catch (error) {
      console.error('Error listing files:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list files',
        error: (error as Error).message
      });
    }
  };
} 