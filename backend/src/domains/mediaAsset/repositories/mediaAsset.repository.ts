import { PrismaClient } from '@prisma/client';
import { MediaAsset, MediaAssetFilterOptions, UpdateMediaAssetDto } from '../models/mediaAsset.model';

/**
 * Repository for MediaAsset entities
 * Handles database operations for media assets
 */
export class MediaAssetRepository {
  private prisma: PrismaClient;

  /**
   * Create a new MediaAssetRepository
   * @param prismaClient The Prisma client instance
   */
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Find all media assets with pagination and filtering
   * @param options Filter and pagination options
   * @returns Array of MediaAsset entities
   */
  async findAll(options: MediaAssetFilterOptions = {}): Promise<MediaAsset[]> {
    const { 
      organizationId, 
      type, 
      uploadedById, 
      search,
      limit = 20, 
      offset = 0 
    } = options;

    const where: any = {};

    // Apply organization filter
    if (organizationId) {
      where.organizationId = organizationId;
    }

    // Apply type filter
    if (type) {
      where.type = type;
    }

    // Apply uploader filter
    if (uploadedById) {
      where.uploadedById = uploadedById;
    }

    // Apply search filter (file name, alt text)
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.mediaAsset.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Count media assets with filters
   * @param options Filter options
   * @returns Count of matching media assets
   */
  async count(options: MediaAssetFilterOptions = {}): Promise<number> {
    const { organizationId, type, uploadedById, search } = options;
    const where: any = {};

    // Apply organization filter
    if (organizationId) {
      where.organizationId = organizationId;
    }

    // Apply type filter
    if (type) {
      where.type = type;
    }

    // Apply uploader filter
    if (uploadedById) {
      where.uploadedById = uploadedById;
    }

    // Apply search filter (file name, alt text)
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.mediaAsset.count({ where });
  }

  /**
   * Find a media asset by ID
   * @param id Media asset ID
   * @returns MediaAsset entity or null if not found
   */
  async findById(id: string): Promise<MediaAsset | null> {
    return this.prisma.mediaAsset.findUnique({
      where: { id }
    });
  }

  /**
   * Create a new media asset
   * @param data Media asset data
   * @returns Created MediaAsset entity
   */
  async create(data: any): Promise<MediaAsset> {
    return this.prisma.mediaAsset.create({
      data
    });
  }

  /**
   * Update a media asset
   * @param id Media asset ID
   * @param data Updated media asset data
   * @returns Updated MediaAsset entity
   */
  async update(id: string, data: UpdateMediaAssetDto): Promise<MediaAsset> {
    return this.prisma.mediaAsset.update({
      where: { id },
      data
    });
  }

  /**
   * Delete a media asset
   * @param id Media asset ID
   * @returns Deleted MediaAsset entity
   */
  async delete(id: string): Promise<MediaAsset> {
    return this.prisma.mediaAsset.delete({
      where: { id }
    });
  }

  /**
   * Find media assets by their IDs
   * @param ids Array of media asset IDs
   * @returns Array of MediaAsset entities
   */
  async findByIds(ids: string[]): Promise<MediaAsset[]> {
    if (!ids.length) return [];
    
    return this.prisma.mediaAsset.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  /**
   * Find content items that use this media asset
   * @param id Media asset ID
   * @returns Array of content references to this media asset
   */
  async findUsage(id: string): Promise<any[]> {
    // Find image content references
    const imageContents = await this.prisma.imageContent.findMany({
      where: { mediaAssetId: id },
      include: { content: true }
    });

    // Find video content references
    const videoContents = await this.prisma.videoContent.findMany({
      where: { mediaAssetId: id },
      include: { content: true }
    });

    // Find audio content references
    const audioContents = await this.prisma.audioContent.findMany({
      where: { mediaAssetId: id },
      include: { content: true }
    });

    // Find document content references
    const documentContents = await this.prisma.documentContent.findMany({
      where: { mediaAssetId: id },
      include: { content: true }
    });

    // Combine all references
    return [
      ...imageContents.map((item: any) => ({ 
        type: 'image', 
        contentId: item.content.id,
        contentTitle: item.content.title
      })),
      ...videoContents.map((item: any) => ({ 
        type: 'video', 
        contentId: item.content.id,
        contentTitle: item.content.title
      })),
      ...audioContents.map((item: any) => ({ 
        type: 'audio', 
        contentId: item.content.id,
        contentTitle: item.content.title
      })),
      ...documentContents.map((item: any) => ({ 
        type: 'document', 
        contentId: item.content.id,
        contentTitle: item.content.title
      }))
    ];
  }
} 