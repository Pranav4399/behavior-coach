import { Request, Response } from 'express';
import { MediaAssetService } from '../services/mediaAsset.service';
import prisma from '../../../../prisma/prisma';
import { MediaAssetFilterOptions, UpdateMediaAssetDto } from '../models/mediaAsset.model';

/**
 * Controller for handling media asset-related HTTP requests
 */
export class MediaAssetController {
  private mediaAssetService: MediaAssetService;

  /**
   * Create a new MediaAssetController
   */
  constructor() {
    this.mediaAssetService = new MediaAssetService(prisma);
  }

  /**
   * Get all media assets with pagination and filtering
   */
  getMediaAssets = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.query.organizationId as string;
      
      const options: MediaAssetFilterOptions = {
        organizationId,
        uploadedById: req.query.uploadedById as string,
        search: req.query.search as string,
        type: req.query.type as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      // Ensure organization ID is provided
      if (!options.organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID is required'
        });
        return;
      }

      const { mediaAssets, total } = await this.mediaAssetService.getMediaAssets(options);

      res.status(200).json({
        success: true,
        mediaAssets,
        total,
        pagination: {
          limit: options.limit || 20,
          offset: options.offset || 0,
          total
        }
      });
    } catch (error) {
      console.error('Error getting media assets:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get media assets',
        error: (error as Error).message
      });
    }
  };

  /**
   * Get a single media asset by ID
   */
  getMediaAssetById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media Asset ID is required'
        });
        return;
      }

      const mediaAsset = await this.mediaAssetService.getMediaAssetById(id);
      
      if (!mediaAsset) {
        res.status(404).json({
          success: false,
          message: 'Media Asset not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        mediaAsset
      });
    } catch (error) {
      console.error('Error getting media asset:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get media asset',
        error: (error as Error).message
      });
    }
  };

  /**
   * Upload and create a new media asset
   * - Uses multer middleware to process the file
   */
  uploadMediaAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file provided'
        });
        return;
      }

      const organizationId = req.body.organizationId;
      
      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID is required'
        });
        return;
      }

      // Get metadata from request body
      const altText = req.body.altText || undefined;
      const customMetadata = req.body.metadata 
        ? (typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata) 
        : {};

      // Upload and create the media asset
      const mediaAsset = await this.mediaAssetService.uploadAndCreateMediaAsset(
        {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        },
        {
          altText,
          customMetadata,
          organizationId,
          uploadedById: req.user?.id
        }
      );

      // Generate a pre-signed URL for temporary access
      const presignedUrl = await this.mediaAssetService.getPresignedUrl(mediaAsset.id);

      res.status(201).json({
        success: true,
        message: 'Media Asset created successfully',
        mediaAsset,
        presignedUrl
      });
    } catch (error) {
      console.error('Error creating media asset:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create media asset',
        error: (error as Error).message
      });
    }
  };

  /**
   * Update a media asset's metadata
   */
  updateMediaAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media Asset ID is required'
        });
        return;
      }

      const updateData: UpdateMediaAssetDto = {
        altText: req.body.altText,
        metadata: req.body.metadata
      };

      const mediaAsset = await this.mediaAssetService.updateMediaAsset(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Media Asset updated successfully',
        mediaAsset
      });
    } catch (error) {
      console.error('Error updating media asset:', error);
      
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: 'Media Asset not found',
          error: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update media asset',
        error: (error as Error).message
      });
    }
  };

  /**
   * Delete a media asset and its file from S3
   */
  deleteMediaAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media Asset ID is required'
        });
        return;
      }

      await this.mediaAssetService.deleteMediaAsset(id);

      res.status(200).json({
        success: true,
        message: 'Media Asset deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting media asset:', error);
      
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: 'Media Asset not found',
          error: (error as Error).message
        });
        return;
      }
      
      if ((error as Error).message.includes('used by')) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete: Media Asset is in use',
          error: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete media asset',
        error: (error as Error).message
      });
    }
  };

  /**
   * Get content items that use this media asset
   */
  getMediaAssetUsage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media Asset ID is required'
        });
        return;
      }

      const usages = await this.mediaAssetService.getMediaAssetUsage(id);

      res.status(200).json({
        success: true,
        usages
      });
    } catch (error) {
      console.error('Error getting media asset usage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get media asset usage',
        error: (error as Error).message
      });
    }
  };

  /**
   * Get a pre-signed URL for a media asset
   */
  getPresignedUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const organizationId = req.query.organizationId as string;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media Asset ID is required'
        });
        return;
      }

      // Get expiresIn value from query params (default to 3600 seconds / 1 hour)
      const expiresIn = req.query.expiresIn ? parseInt(req.query.expiresIn as string) : 3600;
      
      // Validate expiresIn to prevent security issues (min: 60 seconds, max: 7 days)
      const validatedExpiresIn = Math.min(Math.max(60, expiresIn), 604800);
      
      // Get the presigned URL (pass organizationId if available)
      const presignedUrl = await this.mediaAssetService.getPresignedUrl(
        id,
        validatedExpiresIn,
        organizationId
      );
      
      // Calculate expiration timestamp
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + validatedExpiresIn);

      // Set cache-control headers to improve performance
      // Allow caching but require revalidation
      res.set('Cache-Control', 'private, max-age=0, must-revalidate');

      // Return the URL with expiration info
      res.status(200).json({
        success: true,
        presignedUrl,
        expiresAt: expiresAt.toISOString(),
        expiresInSeconds: validatedExpiresIn
      });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: 'Media Asset not found',
          error: (error as Error).message
        });
        return;
      }
      
      if ((error as Error).message.includes('Access denied')) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to generate pre-signed URL',
        error: (error as Error).message
      });
    }
  };
} 