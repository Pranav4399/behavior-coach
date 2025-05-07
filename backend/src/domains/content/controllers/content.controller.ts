import { Request, Response } from 'express';
import { ContentService } from '../services/content.service';
import prisma from '../../../../prisma/prisma';
import { ContentStatus, ContentType, ContentFilterOptions } from '../models/content.model';
import { ContentErrorService } from '../services/content-error.service';

/**
 * Controller for handling content-related HTTP requests
 */
export class ContentController {
  private contentService: ContentService;
  private errorService: ContentErrorService;

  /**
   * Create a new ContentController
   */
  constructor() {
    this.contentService = new ContentService(prisma);
    this.errorService = new ContentErrorService();
  }

  /**
   * Get all content with pagination and filtering
   */
  getContents = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract from query params instead of route params
      const { organizationId } = req.query;
      
      if (!organizationId) {
        this.errorService.handleMissingFieldsError(res, ['organizationId']);
        return;
      }

      // Extract pagination and filtering parameters
      const { type, status, search, limit, offset, createdById, updatedById, tags } = req.query;

      // Create filter options object
      const filterOptions: ContentFilterOptions = {
        organizationId: organizationId as string,
      };

      // Add optional filters if provided
      if (type) filterOptions.type = type as ContentType;
      if (status) filterOptions.status = status as ContentStatus;
      if (search) filterOptions.search = search as string;
      if (createdById) filterOptions.createdById = createdById as string;
      if (updatedById) filterOptions.updatedById = updatedById as string;

      // Parse tags if provided (expect comma-separated list)
      if (tags) {
        filterOptions.tags = (tags as string).split(',');
      }

      // Parse pagination parameters
      if (limit) filterOptions.limit = parseInt(limit as string, 10);
      if (offset) filterOptions.offset = parseInt(offset as string, 10);

      // Get content with filtering and pagination - using correct method name
      const result = await this.contentService.getAllContent(filterOptions);

      res.status(200).json({
        success: true,
        contents: result.contents,
        total: result.total,
        pagination: {
          limit: filterOptions.limit || 20,
          offset: filterOptions.offset || 0,
          total: result.total
        }
      });
    } catch (error) {
      console.error('Error getting contents:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Get a content item by ID
   */
  getContentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        this.errorService.handleMissingFieldsError(res, ['id']);
        return;
      }

      const content = await this.contentService.getContentById(id);
      
      if (!content) {
        this.errorService.handleNotFoundError(res, 'Content', id);
        return;
      }

      res.status(200).json({
        success: true,
        content
      });
    } catch (error) {
      console.error('Error getting content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create text content
   */
  createTextContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, status, organizationId, text, formatting } = req.body;
      
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!text) missingFields.push('text');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        type: ContentType.TEXT,
        organizationId,
        createdById: req.user?.id
      };

      const textContent = {
        text,
        formatting: formatting || null
      };

      const content = await this.contentService.createTextContent(baseContent, textContent);

      res.status(201).json({
        success: true,
        message: 'Text content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating text content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create image content
   */
  createImageContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        title, 
        description, 
        status, 
        organizationId, 
        mediaAssetId, 
        altText, 
        caption 
      } = req.body;
      
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!mediaAssetId) missingFields.push('mediaAssetId');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        type: ContentType.IMAGE,
        organizationId,
        createdById: req.user?.id
      };

      const imageContent = {
        mediaAssetId,
        altText,
        caption
      };

      const content = await this.contentService.createImageContent(baseContent, imageContent);

      res.status(201).json({
        success: true,
        message: 'Image content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating image content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create video content
   */
  createVideoContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        title, 
        description, 
        status, 
        organizationId, 
        mediaAssetId, 
        caption,
        transcript,
        duration
      } = req.body;
      
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!mediaAssetId) missingFields.push('mediaAssetId');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        type: ContentType.VIDEO,
        organizationId,
        createdById: req.user?.id
      };

      const videoContent = {
        mediaAssetId,
        caption,
        transcript,
        duration: duration ? parseInt(duration, 10) : undefined
      };

      const content = await this.contentService.createVideoContent(baseContent, videoContent);

      res.status(201).json({
        success: true,
        message: 'Video content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating video content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create audio content
   */
  createAudioContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        title, 
        description, 
        status, 
        organizationId, 
        mediaAssetId, 
        caption,
        transcript,
        duration
      } = req.body;
      
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!mediaAssetId) missingFields.push('mediaAssetId');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        type: ContentType.AUDIO,
        organizationId,
        createdById: req.user?.id
      };

      const audioContent = {
        mediaAssetId,
        caption,
        transcript,
        duration: duration ? parseInt(duration, 10) : undefined
      };

      const content = await this.contentService.createAudioContent(baseContent, audioContent);

      res.status(201).json({
        success: true,
        message: 'Audio content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating audio content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create document content
   */
  createDocumentContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        title, 
        description, 
        status, 
        organizationId, 
        mediaAssetId, 
        documentDescription
      } = req.body;
      
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!mediaAssetId) missingFields.push('mediaAssetId');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        type: ContentType.DOCUMENT,
        organizationId,
        createdById: req.user?.id
      };

      const documentContent = {
        mediaAssetId,
        description: documentDescription
      };

      const content = await this.contentService.createDocumentContent(baseContent, documentContent);

      res.status(201).json({
        success: true,
        message: 'Document content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating document content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create quiz content
   */
  createQuizContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        title, 
        description, 
        status, 
        organizationId, 
        questions,
        scoringType,
        timeLimit
      } = req.body;
      
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!questions || !Array.isArray(questions) || questions.length === 0) missingFields.push('questions');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        type: ContentType.QUIZ,
        organizationId,
        createdById: req.user?.id
      };

      const quizContent = {
        questions,
        scoringType: scoringType || 'standard',
        timeLimit: timeLimit ? parseInt(timeLimit, 10) : undefined
      };

      const content = await this.contentService.createQuizContent(baseContent, quizContent);

      res.status(201).json({
        success: true,
        message: 'Quiz content created successfully',
        content
      });
    } catch (error) {
      console.error('Error creating quiz content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create other content types (video, audio, document, etc.)
   * Similar methods for other content types would follow the same pattern
   * as createTextContent and createImageContent
   */

  /**
   * Update content
   */
  updateContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      
      if (!id) {
        this.errorService.handleMissingFieldsError(res, ['id']);
        return;
      }

      const updateData = {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        updatedById: req.user?.id
      };

      const content = await this.contentService.updateContent(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Content updated successfully',
        content
      });
    } catch (error) {
      console.error('Error updating content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Update type-specific content
   */
  updateTypeSpecificContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const typeSpecificData = req.body;
      
      if (!id) {
        this.errorService.handleMissingFieldsError(res, ['id']);
        return;
      }

      const content = await this.contentService.updateTypeSpecificContent(id, typeSpecificData);

      res.status(200).json({
        success: true,
        message: 'Content data updated successfully',
        content
      });
    } catch (error) {
      console.error('Error updating type-specific content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Delete content
   */
  deleteContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        this.errorService.handleMissingFieldsError(res, ['id']);
        return;
      }

      await this.contentService.deleteContent(id);

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Add tags to content
   */
  addContentTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { tagIds } = req.body;
      
      if (!id) {
        this.errorService.handleMissingFieldsError(res, ['id']);
        return;
      }

      if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
        this.errorService.handleValidationError(res, ['Tag IDs array is required']);
        return;
      }

      await this.contentService.addTags(id, tagIds);
      const content = await this.contentService.getContentById(id);

      res.status(200).json({
        success: true,
        message: 'Tags added successfully',
        content
      });
    } catch (error) {
      console.error('Error adding content tags:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Remove tag from content
   */
  removeContentTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, tagId } = req.params;
      
      const missingFields = [];
      if (!id) missingFields.push('id');
      if (!tagId) missingFields.push('tagId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      await this.contentService.removeTag(id, tagId);
      const content = await this.contentService.getContentById(id);

      res.status(200).json({
        success: true,
        message: 'Tag removed successfully',
        content
      });
    } catch (error) {
      console.error('Error removing content tag:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Get content by tag
   */
  getContentByTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tagId } = req.params;
      const organizationId = req.query.organizationId as string;
      
      if (!tagId) {
        this.errorService.handleMissingFieldsError(res, ['tagId']);
        return;
      }

      // Parse query parameters
      const options: ContentFilterOptions = {
        organizationId,
        status: req.query.status as ContentStatus,
        type: req.query.type as ContentType,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const { contents, total } = await this.contentService.findContentByTag(tagId, options);

      res.status(200).json({
        success: true,
        contents,
        total,
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total
        }
      });
    } catch (error) {
      console.error('Error getting content by tag:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Create content directly from a media asset
   * Handles the workflow of creating appropriate content based on the media type
   */
  createContentFromMediaAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        mediaAssetId, 
        title, 
        description, 
        status, 
        organizationId,
        caption,
        altText,
        transcript,
        description: documentDescription // Using alias to avoid duplicate
      } = req.body;
      
      const missingFields = [];
      if (!mediaAssetId) missingFields.push('mediaAssetId');
      if (!title) missingFields.push('title');
      if (!organizationId) missingFields.push('organizationId');
      
      if (missingFields.length > 0) {
        this.errorService.handleMissingFieldsError(res, missingFields);
        return;
      }

      const baseContent = {
        title,
        description,
        status: status || ContentStatus.DRAFT,
        organizationId,
        createdById: req.user?.id
      };

      // Type-specific data that might be useful for any media type
      const typeSpecificData = {
        altText,
        caption,
        transcript,
        description: documentDescription
      };

      // Use integration service to create content
      const content = await this.contentService.createContentFromMediaAsset(
        mediaAssetId,
        baseContent,
        typeSpecificData
      );

      res.status(201).json({
        success: true,
        message: `${content.type} content created successfully from media asset`,
        content
      });
    } catch (error) {
      console.error('Error creating content from media asset:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Get a content item by ID with media details
   */
  getContentWithMediaDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        this.errorService.handleMissingFieldsError(res, ['id']);
        return;
      }

      const content = await this.contentService.getContentWithMediaDetails(id);
      
      if (!content) {
        this.errorService.handleNotFoundError(res, 'Content', id);
        return;
      }

      res.status(200).json({
        success: true,
        content
      });
    } catch (error) {
      console.error('Error getting content with media details:', error);
      this.errorService.handleError(res, error);
    }
  };

  /**
   * Get all content with media details
   */
  getContentsWithMediaDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract from query params instead of route params
      const { organizationId } = req.query;
      
      if (!organizationId) {
        this.errorService.handleMissingFieldsError(res, ['organizationId']);
        return;
      }

      // Extract pagination and filtering parameters
      const { type, status, search, limit, offset, createdById, updatedById, tags } = req.query;

      // Create filter options object
      const filterOptions: ContentFilterOptions = {
        organizationId: organizationId as string,
      };

      // Add optional filters if provided
      if (type) filterOptions.type = type as ContentType;
      if (status) filterOptions.status = status as ContentStatus;
      if (search) filterOptions.search = search as string;
      if (createdById) filterOptions.createdById = createdById as string;
      if (updatedById) filterOptions.updatedById = updatedById as string;

      // Parse tags if provided (expect comma-separated list)
      if (tags) {
        filterOptions.tags = (tags as string).split(',');
      }

      // Parse pagination parameters
      if (limit) filterOptions.limit = parseInt(limit as string, 10);
      if (offset) filterOptions.offset = parseInt(offset as string, 10);

      // Get content with filtering and pagination
      const result = await this.contentService.getAllContentWithMediaDetails(filterOptions);

      res.status(200).json({
        success: true,
        contents: result.contents,
        total: result.total,
        pagination: {
          limit: filterOptions.limit || 20,
          offset: filterOptions.offset || 0,
          total: result.total
        }
      });
    } catch (error) {
      console.error('Error getting contents with media details:', error);
      this.errorService.handleError(res, error);
    }
  };
} 