import { PrismaClient } from '@prisma/client';
import { 
  Content, 
  ContentFilterOptions, 
  CreateContentDto, 
  UpdateContentDto,
  ContentType,
  ContentStatus
} from '../models/content.model';

/**
 * Repository for Content entities
 * Handles database operations for content items
 */
export class ContentRepository {
  private prisma: PrismaClient;

  /**
   * Create a new ContentRepository
   * @param prismaClient The Prisma client instance
   */
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Find content by ID with optional type-specific content
   * @param id Content ID
   * @param includeTypeContent Whether to include type-specific content
   * @returns Content entity or null if not found
   */
  async findById(id: string, includeTypeContent = true): Promise<Content | null> {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: this.getIncludeOptions(includeTypeContent)
    });

    return content as Content | null;
  }

  /**
   * Find all content items with pagination and filtering
   * @param options Filter and pagination options
   * @returns Array of Content entities and total count
   */
  async findAll(options: ContentFilterOptions = {}): Promise<{ contents: Content[]; total: number }> {
    const { 
      organizationId, 
      createdById, 
      updatedById, 
      status, 
      type, 
      search,
      tags,
      limit = 20, 
      offset = 0 
    } = options;

    // Build where clause
    const where: any = {};
    
    // Required organization filter
    if (organizationId) {
      where.organizationId = organizationId;
    }
    
    // Optional filters
    if (createdById) {
      where.createdById = createdById;
    }
    
    if (updatedById) {
      where.updatedById = updatedById;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    // Search filter - search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Tag filtering
    if (tags && tags.length > 0) {
      where.contentTags = {
        some: {
          tag: {
            name: {
              in: tags
            }
          }
        }
      };
    }

    // Count total matching content items
    const total = await this.prisma.content.count({ where });

    // Fetch content items with pagination
    const contents = await this.prisma.content.findMany({
      where,
      include: this.getIncludeOptions(true),
      skip: offset,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    }) as Content[];

    return { contents, total };
  }

  /**
   * Create a new content item
   * @param data Content creation data
   * @returns Created Content entity
   */
  async create(data: CreateContentDto): Promise<Content> {
    const content = await this.prisma.content.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || ContentStatus.DRAFT,
        type: data.type,
        organizationId: data.organizationId,
        createdById: data.createdById
      },
      include: this.getIncludeOptions(true)
    });

    return content as Content;
  }

  /**
   * Update an existing content item
   * @param id Content ID
   * @param data Content update data
   * @returns Updated Content entity
   */
  async update(id: string, data: UpdateContentDto): Promise<Content> {
    const content = await this.prisma.content.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.updatedById !== undefined && { updatedById: data.updatedById }),
        updatedAt: new Date()
      },
      include: this.getIncludeOptions(true)
    });

    return content as Content;
  }

  /**
   * Delete a content item
   * @param id Content ID
   * @returns Deleted Content entity
   */
  async delete(id: string): Promise<Content> {
    const content = await this.prisma.content.delete({
      where: { id },
      include: this.getIncludeOptions(false)
    });

    return content as Content;
  }

  /**
   * Count content items matching the filter
   * @param options Filter options
   * @returns Count of matching content items
   */
  async count(options: ContentFilterOptions = {}): Promise<number> {
    const { 
      organizationId, 
      createdById, 
      updatedById, 
      status, 
      type,
      search,
      tags
    } = options;

    // Build where clause
    const where: any = {};
    
    // Required organization filter
    if (organizationId) {
      where.organizationId = organizationId;
    }
    
    // Optional filters
    if (createdById) {
      where.createdById = createdById;
    }
    
    if (updatedById) {
      where.updatedById = updatedById;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    // Search filter - search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Tag filtering
    if (tags && tags.length > 0) {
      where.contentTags = {
        some: {
          tag: {
            name: {
              in: tags
            }
          }
        }
      };
    }

    return this.prisma.content.count({ where });
  }

  /**
   * Find content items by tag
   * @param tagId Tag ID
   * @param options Filter and pagination options
   * @returns Array of Content entities and total count
   */
  async findByTag(tagId: string, options: ContentFilterOptions = {}): Promise<{ contents: Content[]; total: number }> {
    const { limit = 20, offset = 0 } = options;
    
    // Build where clause based on options
    const where: any = {
      contentTags: {
        some: {
          tagId
        }
      }
    };
    
    if (options.organizationId) {
      where.organizationId = options.organizationId;
    }
    
    if (options.status) {
      where.status = options.status;
    }
    
    if (options.type) {
      where.type = options.type;
    }

    // Count total matching content items
    const total = await this.prisma.content.count({ where });

    // Fetch content items with pagination
    const contents = await this.prisma.content.findMany({
      where,
      include: this.getIncludeOptions(true),
      skip: offset,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    }) as Content[];

    return { contents, total };
  }

  /**
   * Add a tag to a content item
   * @param contentId Content ID
   * @param tagId Tag ID
   * @returns The created content-tag relationship
   */
  async addTag(contentId: string, tagId: string): Promise<any> {
    return this.prisma.contentTag.create({
      data: {
        contentId,
        tagId
      }
    });
  }

  /**
   * Remove a tag from a content item
   * @param contentId Content ID
   * @param tagId Tag ID
   */
  async removeTag(contentId: string, tagId: string): Promise<void> {
    await this.prisma.contentTag.delete({
      where: {
        contentId_tagId: {
          contentId,
          tagId
        }
      }
    });
  }

  /**
   * Get content tags
   * @param contentId Content ID
   * @returns Array of tags
   */
  async getTags(contentId: string): Promise<any[]> {
    const contentTags = await this.prisma.contentTag.findMany({
      where: { contentId },
      include: { tag: true }
    });
    
    return contentTags.map((ct: { tag: any }) => ct.tag);
  }

  /**
   * Get include options for Prisma queries
   * @param includeTypeContent Whether to include type-specific content
   * @returns Prisma include options
   */
  private getIncludeOptions(includeTypeContent: boolean): any {
    const baseInclude = {
      createdBy: true,
      updatedBy: true,
      contentTags: {
        include: {
          tag: true
        }
      }
    };
    
    if (!includeTypeContent) {
      return baseInclude;
    }
    
    return {
      ...baseInclude,
      textContent: true,
      imageContent: {
        include: {
          mediaAsset: true
        }
      },
      videoContent: {
        include: {
          mediaAsset: true
        }
      },
      audioContent: {
        include: {
          mediaAsset: true
        }
      },
      documentContent: {
        include: {
          mediaAsset: true
        }
      },
      quizContent: true,
      reflectionContent: true,
      templateContent: true
    };
  }
} 