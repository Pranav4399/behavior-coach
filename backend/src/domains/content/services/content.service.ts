import { PrismaClient } from '@prisma/client';
import { 
  Content, 
  ContentFilterOptions, 
  CreateContentDto, 
  UpdateContentDto,
  ContentType
} from '../models/content.model';
import { ContentRepository } from '../repositories/content.repository';
import { MediaAssetService } from '../../mediaAsset/services/mediaAsset.service';
import { ContentValidatorService } from './content-validator.service';
import { ContentMediaIntegrationService } from './content-media-integration.service';

/**
 * Type-specific content creation DTOs
 */
export interface CreateTextContentDto {
  text: string;
  formatting?: any;
}

export interface CreateImageContentDto {
  mediaAssetId: string;
  altText?: string;
  caption?: string;
}

export interface CreateVideoContentDto {
  mediaAssetId: string;
  caption?: string;
  transcript?: string;
  duration?: number;
}

export interface CreateAudioContentDto {
  mediaAssetId: string;
  caption?: string;
  transcript?: string;
  duration?: number;
}

export interface CreateDocumentContentDto {
  mediaAssetId: string;
  description?: string;
}

export interface CreateQuizContentDto {
  questions: any;
  scoringType?: string;
  timeLimit?: number;
}

export interface CreateReflectionContentDto {
  promptText: string;
  guidanceText?: string;
}

export interface CreateTemplateContentDto {
  templateText: string;
  variables: any;
  channel: string;
  approvalStatus?: string;
}

/**
 * Service for managing content
 * Handles business logic for content operations
 */
export class ContentService {
  private contentRepository: ContentRepository;
  private mediaAssetService: MediaAssetService;
  private contentValidator: ContentValidatorService;
  private contentMediaIntegration: ContentMediaIntegrationService;

  /**
   * Create a new ContentService
   * @param prismaClient The Prisma client instance
   */
  constructor(prismaClient: PrismaClient) {
    this.contentRepository = new ContentRepository(prismaClient);
    this.mediaAssetService = new MediaAssetService(prismaClient);
    this.contentValidator = new ContentValidatorService();
    this.contentMediaIntegration = new ContentMediaIntegrationService(prismaClient);
  }

  /**
   * Get all content items with pagination and filtering
   * @param options Content filter options
   * @returns Array of content items and total count
   */
  async getAllContent(options: ContentFilterOptions = {}): Promise<{ contents: Content[], total: number }> {
    return this.contentRepository.findAll(options);
  }

  /**
   * Get a content item by ID
   * @param id Content ID
   * @returns Content item or null if not found
   */
  async getContentById(id: string): Promise<Content | null> {
    return this.contentRepository.findById(id);
  }

  /**
   * Create text content
   * @param baseContent Base content data
   * @param textContent Text-specific content data
   * @returns Created content
   */
  async createTextContent(
    baseContent: CreateContentDto, 
    textContent: CreateTextContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.TEXT;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, textContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create text content record
    await this.createTypeSpecificContent('textContent', content.id, textContent);
    
    // Return full content with text-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create image content
   * @param baseContent Base content data
   * @param imageContent Image-specific content data
   * @returns Created content
   */
  async createImageContent(
    baseContent: CreateContentDto, 
    imageContent: CreateImageContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.IMAGE;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, imageContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Validate media asset reference using integration service
    await this.contentMediaIntegration.validateMediaAssetReference(
      imageContent.mediaAssetId,
      ContentType.IMAGE
    );
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create image content record
    await this.createTypeSpecificContent('imageContent', content.id, imageContent);
    
    // Return full content with image-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create video content
   * @param baseContent Base content data
   * @param videoContent Video-specific content data
   * @returns Created content
   */
  async createVideoContent(
    baseContent: CreateContentDto, 
    videoContent: CreateVideoContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.VIDEO;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, videoContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Validate media asset reference using integration service
    await this.contentMediaIntegration.validateMediaAssetReference(
      videoContent.mediaAssetId,
      ContentType.VIDEO
    );
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create video content record
    await this.createTypeSpecificContent('videoContent', content.id, videoContent);
    
    // Return full content with video-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create audio content
   * @param baseContent Base content data
   * @param audioContent Audio-specific content data
   * @returns Created content
   */
  async createAudioContent(
    baseContent: CreateContentDto, 
    audioContent: CreateAudioContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.AUDIO;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, audioContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Validate media asset reference using integration service
    await this.contentMediaIntegration.validateMediaAssetReference(
      audioContent.mediaAssetId,
      ContentType.AUDIO
    );
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create audio content record
    await this.createTypeSpecificContent('audioContent', content.id, audioContent);
    
    // Return full content with audio-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create document content
   * @param baseContent Base content data
   * @param documentContent Document-specific content data
   * @returns Created content
   */
  async createDocumentContent(
    baseContent: CreateContentDto, 
    documentContent: CreateDocumentContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.DOCUMENT;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, documentContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Validate media asset reference using integration service
    await this.contentMediaIntegration.validateMediaAssetReference(
      documentContent.mediaAssetId,
      ContentType.DOCUMENT
    );
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create document content record
    await this.createTypeSpecificContent('documentContent', content.id, documentContent);
    
    // Return full content with document-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create quiz content
   * @param baseContent Base content data
   * @param quizContent Quiz-specific content data
   * @returns Created content
   */
  async createQuizContent(
    baseContent: CreateContentDto, 
    quizContent: CreateQuizContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.QUIZ;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, quizContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create quiz content record
    await this.createTypeSpecificContent('quizContent', content.id, quizContent);
    
    // Return full content with quiz-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create reflection content
   * @param baseContent Base content data
   * @param reflectionContent Reflection-specific content data
   * @returns Created content
   */
  async createReflectionContent(
    baseContent: CreateContentDto, 
    reflectionContent: CreateReflectionContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.REFLECTION;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, reflectionContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create reflection content record
    await this.createTypeSpecificContent('reflectionContent', content.id, reflectionContent);
    
    // Return full content with reflection-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Create template content
   * @param baseContent Base content data
   * @param templateContent Template-specific content data
   * @returns Created content
   */
  async createTemplateContent(
    baseContent: CreateContentDto, 
    templateContent: CreateTemplateContentDto
  ): Promise<Content> {
    // Override content type to ensure consistency
    baseContent.type = ContentType.TEMPLATE;
    
    // Validate content
    const validationResult = this.contentValidator.validateContent(baseContent, templateContent);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Create base content record
    const content = await this.contentRepository.create(baseContent);
    
    // Create template content record
    await this.createTypeSpecificContent('templateContent', content.id, templateContent);
    
    // Return full content with template-specific data
    return this.getContentById(content.id) as Promise<Content>;
  }

  /**
   * Update content
   * @param id Content ID
   * @param updateData Updated content data
   * @returns Updated content
   */
  async updateContent(id: string, updateData: UpdateContentDto): Promise<Content> {
    const content = await this.getContentById(id);
    if (!content) {
      throw new Error(`Content with ID ${id} not found`);
    }
    
    return this.contentRepository.update(id, updateData);
  }

  /**
   * Update type-specific content data
   * @param id Content ID
   * @param typeSpecificData Type-specific content data to update
   * @returns Updated content
   */
  async updateTypeSpecificContent(id: string, typeSpecificData: any): Promise<Content> {
    const content = await this.getContentById(id);
    if (!content) {
      throw new Error(`Content with ID ${id} not found`);
    }
    
    // Validate type-specific content data
    const validationResult = this.contentValidator.validateTypeSpecificUpdate(content.type, typeSpecificData);
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Determine content type and update the corresponding type-specific table
    const contentType = content.type;
    let table: string;
    
    switch (contentType) {
      case ContentType.TEXT:
        table = 'textContent';
        break;
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
      case ContentType.QUIZ:
        table = 'quizContent';
        break;
      case ContentType.REFLECTION:
        table = 'reflectionContent';
        break;
      case ContentType.TEMPLATE:
        table = 'templateContent';
        break;
      default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }
    
    // Update the type-specific content
    await (this.contentRepository as any).prisma[table].update({
      where: { contentId: id },
      data: typeSpecificData
    });
    
    // Return the updated content
    return this.getContentById(id) as Promise<Content>;
  }

  /**
   * Delete content
   * @param id Content ID
   * @returns Deleted content
   */
  async deleteContent(id: string): Promise<Content> {
    return this.contentRepository.delete(id);
  }

  /**
   * Add tags to content
   * @param contentId Content ID
   * @param tagIds Array of tag IDs to add
   */
  async addTags(contentId: string, tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      await this.contentRepository.addTag(contentId, tagId);
    }
  }

  /**
   * Remove a tag from content
   * @param contentId Content ID
   * @param tagId Tag ID to remove
   */
  async removeTag(contentId: string, tagId: string): Promise<void> {
    await this.contentRepository.removeTag(contentId, tagId);
  }

  /**
   * Get content tags
   * @param contentId Content ID
   * @returns Array of tags
   */
  async getContentTags(contentId: string): Promise<any[]> {
    return this.contentRepository.getTags(contentId);
  }

  /**
   * Find content by tag
   * @param tagId Tag ID
   * @param options Filter and pagination options
   * @returns Content items and total count
   */
  async findContentByTag(tagId: string, options: ContentFilterOptions = {}): Promise<{ contents: Content[], total: number }> {
    return this.contentRepository.findByTag(tagId, options);
  }

  /**
   * Create type-specific content
   * @param table The type-specific table name
   * @param contentId The base content ID
   * @param data The type-specific data
   */
  private async createTypeSpecificContent(table: string, contentId: string, data: any): Promise<void> {
    await (this.contentRepository as any).prisma[table].create({
      data: {
        ...data,
        contentId
      }
    });
  }

  /**
   * Create content directly from a media asset
   * Convenience method that uses the integration service
   * 
   * @param mediaAssetId The media asset ID to create content from
   * @param baseContent Base content information (without type)
   * @param typeSpecificData Additional type-specific data
   * @returns The created content
   */
  async createContentFromMediaAsset(
    mediaAssetId: string,
    baseContent: Omit<CreateContentDto, 'type'>,
    typeSpecificData: Record<string, any> = {}
  ): Promise<Content> {
    return this.contentMediaIntegration.createContentFromMediaAsset(
      mediaAssetId, 
      baseContent, 
      typeSpecificData
    );
  }

  /**
   * Get a content item by ID with detailed media information
   * @param id Content ID
   * @returns Content with media details or null if not found
   */
  async getContentWithMediaDetails(id: string): Promise<any> {
    return this.contentMediaIntegration.getContentWithMediaDetails(id);
  }

  /**
   * Get all content with media details for media-based content types
   * @param options Content filter options
   * @returns Array of content items with media details
   */
  async getAllContentWithMediaDetails(options: ContentFilterOptions = {}): Promise<{ contents: any[], total: number }> {
    const { contents, total } = await this.getAllContent(options);
    
    // Get content IDs
    const contentIds = contents.map(content => content.id);
    
    // Get detailed content for all IDs
    const contentsWithDetails = await Promise.all(
      contentIds.map(async id => {
        try {
          return await this.contentMediaIntegration.getContentWithMediaDetails(id);
        } catch (error) {
          console.error(`Error getting media details for content ${id}:`, error);
          // Return the original content if media details can't be retrieved
          return contents.find(c => c.id === id);
        }
      })
    );
    
    return { contents: contentsWithDetails, total };
  }
}