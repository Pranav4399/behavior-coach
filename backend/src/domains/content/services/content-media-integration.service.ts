import { PrismaClient, Prisma } from '@prisma/client';
import { 
  MediaAsset,
  MediaType 
} from '../../mediaAsset/models/mediaAsset.model';
import { 
  Content,
  ContentType,
  CreateContentDto
} from '../models/content.model';
import { MediaAssetService } from '../../mediaAsset/services/mediaAsset.service';
import { ContentService } from './content.service';
import { 
  CreateImageContentDto,
  CreateVideoContentDto,
  CreateAudioContentDto,
  CreateDocumentContentDto
} from './content.service';
import { MetricsService } from '../../../common/services/metrics.service';

/**
 * Service for integrating media assets with content
 * Handles workflows and validations between the two domains
 */
export class ContentMediaIntegrationService {
  private mediaAssetService: MediaAssetService;
  private metricsService: MetricsService;
  private _contentService?: ContentService;

  /**
   * Create a new ContentMediaIntegrationService
   * @param prismaClient The Prisma client instance for database operations
   */
  constructor(private prismaClient: PrismaClient) {
    this.mediaAssetService = new MediaAssetService(prismaClient);
    this.metricsService = MetricsService.getInstance();
    // Note: ContentService is no longer initialized here to avoid circular dependency
  }

  /**
   * Get ContentService instance with lazy initialization to avoid circular dependency
   */
  private get contentService(): ContentService {
    if (!this._contentService) {
      this._contentService = new ContentService(this.prismaClient);
    }
    return this._contentService;
  }

  /**
   * Create content from a media asset
   * Creates the appropriate content type based on the media asset type
   * 
   * @param mediaAssetId The ID of the media asset to create content from
   * @param baseContent Base content information (title, description, etc)
   * @param typeSpecificData Additional type-specific data for the content
   * @returns The created content
   */
  async createContentFromMediaAsset(
    mediaAssetId: string,
    baseContent: Omit<CreateContentDto, 'type'>,
    typeSpecificData: Record<string, any> = {}
  ): Promise<Content> {
    // Start a timer for this operation
    this.metricsService.startTimer('content_media_creation', {
      mediaAssetId,
      organizationId: baseContent.organizationId || 'unknown'
    });

    try {
      // Verify media asset exists
      const mediaAsset = await this.mediaAssetService.getMediaAssetById(mediaAssetId);
      if (!mediaAsset) {
        this.metricsService.incrementCounter('content_media_creation_error', 1, {
          error: 'media_asset_not_found',
          mediaAssetId
        });
        throw new Error(`Media asset with ID ${mediaAssetId} not found`);
      }

      // Track media types used in content creation
      this.metricsService.incrementCounter('content_creation_by_media_type', 1, {
        mediaType: mediaAsset.type
      });

      // Determine content type based on media asset type
      const contentType = this.mapMediaTypeToContentType(mediaAsset.type);
      
      // Set organization ID if not provided (inherit from media asset)
      if (!baseContent.organizationId && mediaAsset.organizationId) {
        baseContent.organizationId = mediaAsset.organizationId;
      }

      // Create full content DTO with type
      const fullBaseContent: CreateContentDto = {
        ...baseContent,
        type: contentType
      };

      // Use transaction version for consistency
      const content = await this.createContentFromMediaAssetWithTransaction(
        mediaAssetId,
        baseContent,
        typeSpecificData
      );

      // Record the success
      this.metricsService.incrementCounter('content_media_creation_success', 1, {
        mediaType: mediaAsset.type,
        contentType,
        organizationId: baseContent.organizationId
      });

      // Stop and record the timer
      this.metricsService.stopTimer('content_media_creation', {
        mediaAssetId,
        organizationId: baseContent.organizationId || 'unknown'
      });

      return content;
    } catch (error) {
      // Record the error
      this.metricsService.incrementCounter('content_media_creation_error', 1, {
        error: error instanceof Error ? error.message : 'unknown_error',
        organizationId: baseContent.organizationId || 'unknown'
      });

      // Stop the timer even on error
      this.metricsService.stopTimer('content_media_creation', {
        mediaAssetId,
        organizationId: baseContent.organizationId || 'unknown'
      });

      throw error;
    }
  }

  /**
   * Create content from a media asset with transaction support
   * Use transactions to ensure data consistency between content and media operations
   * 
   * @param mediaAssetId The ID of the media asset to create content from
   * @param baseContent Base content information (title, description, etc)
   * @param typeSpecificData Additional type-specific data for the content
   * @returns The created content
   */
  private async createContentFromMediaAssetWithTransaction(
    mediaAssetId: string,
    baseContent: Omit<CreateContentDto, 'type'>,
    typeSpecificData: Record<string, any> = {}
  ): Promise<Content> {
    return this.prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create a temporary ContentService and MediaAssetService instances that use the transaction
      const tempMediaAssetService = new MediaAssetService(tx as unknown as PrismaClient);
      const tempContentService = new ContentService(tx as unknown as PrismaClient);
      
      // Verify media asset exists
      const mediaAsset = await tempMediaAssetService.getMediaAssetById(mediaAssetId);
      if (!mediaAsset) {
        throw new Error(`Media asset with ID ${mediaAssetId} not found`);
      }

      // Determine content type based on media asset type
      const contentType = this.mapMediaTypeToContentType(mediaAsset.type);
      
      // Set organization ID if not provided (inherit from media asset)
      if (!baseContent.organizationId && mediaAsset.organizationId) {
        baseContent.organizationId = mediaAsset.organizationId;
      }

      // Create full content DTO with type
      const fullBaseContent: CreateContentDto = {
        ...baseContent,
        type: contentType
      };

      // Use appropriate method to create content based on media type
      let content: Content;
      
      switch (mediaAsset.type) {
        case MediaType.IMAGE: {
          const imageContentData: CreateImageContentDto = {
            mediaAssetId: mediaAsset.id,
            altText: typeSpecificData.altText || mediaAsset.altText,
            caption: typeSpecificData.caption
          };
          content = await tempContentService.createImageContent(fullBaseContent, imageContentData);
          break;
        }
        case MediaType.VIDEO: {
          const duration = mediaAsset.metadata?.duration || typeSpecificData.duration;
          const videoContentData: CreateVideoContentDto = {
            mediaAssetId: mediaAsset.id,
            caption: typeSpecificData.caption,
            transcript: typeSpecificData.transcript,
            duration
          };
          content = await tempContentService.createVideoContent(fullBaseContent, videoContentData);
          break;
        }
        case MediaType.AUDIO: {
          const duration = mediaAsset.metadata?.duration || typeSpecificData.duration;
          const audioContentData: CreateAudioContentDto = {
            mediaAssetId: mediaAsset.id,
            caption: typeSpecificData.caption,
            transcript: typeSpecificData.transcript,
            duration
          };
          content = await tempContentService.createAudioContent(fullBaseContent, audioContentData);
          break;
        }
        case MediaType.DOCUMENT: {
          const documentContentData: CreateDocumentContentDto = {
            mediaAssetId: mediaAsset.id,
            description: typeSpecificData.description
          };
          content = await tempContentService.createDocumentContent(fullBaseContent, documentContentData);
          break;
        }
        default:
          throw new Error(`Unsupported media type: ${mediaAsset.type}`);
      }
      
      return content;
    });
  }

  /**
   * Map media asset type to content type
   * @param mediaType Media asset type
   * @returns Content type
   */
  private mapMediaTypeToContentType(mediaType: MediaType): ContentType {
    switch (mediaType) {
      case MediaType.IMAGE:
        return ContentType.IMAGE;
      case MediaType.VIDEO:
        return ContentType.VIDEO;
      case MediaType.AUDIO:
        return ContentType.AUDIO;
      case MediaType.DOCUMENT:
        return ContentType.DOCUMENT;
      default:
        throw new Error(`No matching content type for media type: ${mediaType}`);
    }
  }

  /**
   * Validate a media asset reference in content
   * Ensures the media asset exists and is of the correct type for the content
   * 
   * @param mediaAssetId Media asset ID to validate
   * @param expectedType Expected content type
   * @returns The validated media asset
   * @throws Error if validation fails
   */
  async validateMediaAssetReference(
    mediaAssetId: string, 
    expectedType: ContentType
  ): Promise<MediaAsset> {
    // Verify media asset exists
    const mediaAsset = await this.mediaAssetService.getMediaAssetById(mediaAssetId);
    if (!mediaAsset) {
      throw new Error(`Media asset with ID ${mediaAssetId} not found`);
    }

    // Map expected content type to media type
    const expectedMediaType = this.mapContentTypeToMediaType(expectedType);
    
    // Validate media type matches expected type
    if (mediaAsset.type !== expectedMediaType) {
      throw new Error(
        `Media asset type ${mediaAsset.type} does not match expected type ${expectedMediaType} for content type ${expectedType}`
      );
    }

    return mediaAsset;
  }

  /**
   * Map content type to expected media type
   * @param contentType Content type
   * @returns Expected media type
   */
  private mapContentTypeToMediaType(contentType: ContentType): MediaType {
    switch (contentType) {
      case ContentType.IMAGE:
        return MediaType.IMAGE;
      case ContentType.VIDEO:
        return MediaType.VIDEO;
      case ContentType.AUDIO:
        return MediaType.AUDIO;
      case ContentType.DOCUMENT:
        return MediaType.DOCUMENT;
      default:
        throw new Error(`Content type ${contentType} does not map to a media type`);
    }
  }

  /**
   * Get content with detailed media asset information
   * 
   * @param contentId ID of the content to retrieve
   * @returns Content with detailed media asset information
   */
  async getContentWithMediaDetails(contentId: string): Promise<any> {
    // Start a timer for this operation
    this.metricsService.startTimer('content_media_details_retrieval', {
      contentId
    });

    try {
      // Get the base content
      const content = await this.contentService.getContentById(contentId);
      if (!content) {
        // Record the error
        this.metricsService.incrementCounter('content_media_details_error', 1, {
          error: 'content_not_found',
          contentId
        });
        throw new Error(`Content with ID ${contentId} not found`);
      }

      // If content has no media (e.g., text, quiz, etc.), return as is
      if (!this.contentTypeHasMedia(content.type)) {
        // Record non-media content access
        this.metricsService.incrementCounter('content_details_access_non_media', 1, {
          contentType: content.type
        });
        
        // Stop the timer
        this.metricsService.stopTimer('content_media_details_retrieval', { contentId });
        
        return content;
      }

      // Get the type-specific content to extract mediaAssetId
      const typeSpecificContent = await this.getTypeSpecificContent(contentId, content.type);
      if (!typeSpecificContent || !typeSpecificContent.mediaAssetId) {
        // Record missing media asset reference
        this.metricsService.incrementCounter('content_media_details_error', 1, {
          error: 'media_reference_missing',
          contentId,
          contentType: content.type
        });
        
        // Stop the timer
        this.metricsService.stopTimer('content_media_details_retrieval', { contentId });
        
        // Return the content without media details if no mediaAssetId found
        return content;
      }

      // Get detailed media asset information
      const mediaAsset = await this.mediaAssetService.getMediaAssetById(typeSpecificContent.mediaAssetId);
      
      // Record successful media details retrieval
      this.metricsService.incrementCounter('content_media_details_success', 1, {
        contentType: content.type,
        mediaType: mediaAsset?.type || 'unknown'
      });
      
      // Stop the timer
      this.metricsService.stopTimer('content_media_details_retrieval', { contentId });
      
      // Combine content with media details
      return {
        ...content,
        typeSpecificContent: {
          ...typeSpecificContent,
          mediaAsset
        }
      };
    } catch (error) {
      // Record any other errors
      this.metricsService.incrementCounter('content_media_details_error', 1, {
        error: error instanceof Error ? error.message : 'unknown_error',
        contentId
      });
      
      // Stop the timer even on error
      this.metricsService.stopTimer('content_media_details_retrieval', { contentId });
      
      throw error;
    }
  }

  /**
   * Get multiple content items with media details
   * 
   * @param contentIds List of content IDs to retrieve
   * @returns Array of content items with media details
   */
  async getContentsWithMediaDetails(contentIds: string[]): Promise<any[]> {
    return Promise.all(contentIds.map(id => this.getContentWithMediaDetails(id)));
  }

  /**
   * Check if a content type has associated media
   */
  private contentTypeHasMedia(contentType: ContentType): boolean {
    return [
      ContentType.IMAGE, 
      ContentType.VIDEO, 
      ContentType.AUDIO, 
      ContentType.DOCUMENT
    ].includes(contentType);
  }

  /**
   * Get type-specific content data for a given content ID
   */
  private async getTypeSpecificContent(contentId: string, contentType: ContentType): Promise<any> {
    let table: string;
    
    switch (contentType) {
      case ContentType.IMAGE:
        table = 'imageContent';
        break;
      case ContentType.VIDEO:
        table = 'videoContent';
        break;
      case ContentType.AUDIO:
        table = 'audioContent';
        break;
      case ContentType.DOCUMENT:
        table = 'documentContent';
        break;
      default:
        return null;
    }
    
    return (this.prismaClient as any)[table].findUnique({
      where: { contentId }
    });
  }
} 