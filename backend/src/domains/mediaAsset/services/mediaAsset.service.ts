import { PrismaClient } from '@prisma/client';
import { S3Service } from '../../../common/services/s3.service';
import { MediaAssetRepository } from '../repositories/mediaAsset.repository';
import { 
  MediaAsset, 
  MediaAssetFilterOptions, 
  CreateMediaAssetDto, 
  MediaAssetMetadataDto,
  UpdateMediaAssetDto,
  getMediaTypeFromMimeType,
  MediaType
} from '../models/mediaAsset.model';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

/**
 * Service for managing media assets
 * Handles both S3 storage and database operations
 */
export class MediaAssetService {
  private mediaAssetRepository: MediaAssetRepository;
  private s3Service: S3Service;

  /**
   * Create a new MediaAssetService
   * @param prismaClient The Prisma client instance
   */
  constructor(prismaClient: PrismaClient) {
    this.mediaAssetRepository = new MediaAssetRepository(prismaClient);
    this.s3Service = new S3Service();
  }

  /**
   * Generate a unique ID for filenames
   */
  private generateUniqueId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Get file path in S3 based on file type
   * @param fileName Original file name
   * @param mimeType File mime type
   * @returns Path in S3 where the file should be stored
   */
  private getFilePath(fileName: string, mimeType: string): string {
    const fileExtension = path.extname(fileName);
    const uniqueFileName = `${this.generateUniqueId()}${fileExtension}`;
    
    // Organize files by type
    let filePath = 'uploads/';
    
    // Determine folder based on MIME type
    if (mimeType.startsWith('image/')) {
      filePath += 'images/';
    } else if (mimeType.startsWith('video/')) {
      filePath += 'videos/';
    } else if (mimeType.startsWith('audio/')) {
      filePath += 'audio/';
    } else if (mimeType === 'application/pdf') {
      filePath += 'documents/';
    } else {
      filePath += 'misc/';
    }
    
    // Complete file path with filename
    return filePath + uniqueFileName;
  }

  /**
   * Get all media assets with pagination and filtering
   * @param options Filter and pagination options
   * @returns Array of MediaAsset objects and total count
   */
  async getMediaAssets(options: MediaAssetFilterOptions = {}): Promise<{ mediaAssets: MediaAsset[], total: number }> {
    const [mediaAssets, total] = await Promise.all([
      this.mediaAssetRepository.findAll(options),
      this.mediaAssetRepository.count(options)
    ]);
    
    return { mediaAssets, total };
  }

  /**
   * Get a single media asset by ID
   * @param id Media asset ID
   * @returns MediaAsset object or null if not found
   */
  async getMediaAssetById(id: string): Promise<MediaAsset | null> {
    return this.mediaAssetRepository.findById(id);
  }

  /**
   * Create a new media asset from uploaded file
   * @param file File buffer and metadata
   * @param metadata Additional metadata
   * @returns Created MediaAsset object
   */
  async uploadAndCreateMediaAsset(
    file: { 
      buffer: Buffer, 
      originalname: string, 
      mimetype: string, 
      size: number 
    },
    metadata: MediaAssetMetadataDto
  ): Promise<MediaAsset> {
    // 1. Determine file path in S3
    const filePath = this.getFilePath(file.originalname, file.mimetype);
    
    // 2. Upload to S3
    const fileUrl = await this.s3Service.uploadFile(
      filePath, 
      file.buffer, 
      file.mimetype
    );
    
    // 3. Generate thumbnail for images
    let thumbnailUrl;
    if (file.mimetype.startsWith('image/')) {
      thumbnailUrl = await this.generateThumbnail(filePath, file.mimetype, file.buffer);
    }
    
    // 4. Create database record
    return this.createMediaAsset(
      {
        key: filePath,
        url: fileUrl,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      },
      {
        ...metadata,
        thumbnailUrl
      }
    );
  }

  /**
   * Create a new media asset record in the database
   * @param fileData Basic file data
   * @param metadata Additional metadata
   * @returns Created MediaAsset object
   */
  async createMediaAsset(
    fileData: CreateMediaAssetDto,
    metadata: MediaAssetMetadataDto
  ): Promise<MediaAsset> {
    const { key, url, originalname, mimetype, size } = fileData;
    const { 
      altText, 
      thumbnailUrl, 
      customMetadata, 
      organizationId, 
      uploadedById 
    } = metadata;
    
    // Determine media type from MIME type
    const type = getMediaTypeFromMimeType(mimetype);
    
    // Create a file name from the original name
    const fileName = path.basename(originalname);
    
    // Store additional metadata as JSON
    const metadataJson = customMetadata || {};
    
    // Add file specific metadata
    if (mimetype.startsWith('image/')) {
      // Add image dimensions if available
      metadataJson.dimensions = metadataJson.dimensions || { width: null, height: null };
    } else if (mimetype.startsWith('video/')) {
      // Add video duration if available
      metadataJson.duration = metadataJson.duration || null;
    } else if (mimetype.startsWith('audio/')) {
      // Add audio duration if available
      metadataJson.duration = metadataJson.duration || null;
    }
    
    // Create the media asset record
    return this.mediaAssetRepository.create({
      fileName,
      fileSize: size,
      mimeType: mimetype,
      type,
      url,
      thumbnailUrl,
      altText,
      metadata: metadataJson,
      organizationId,
      uploadedById
    });
  }

  /**
   * Generate a thumbnail for an image
   * @param filePath The S3 path of the original image
   * @param mimeType The MIME type of the image
   * @param fileBuffer Optional file buffer (avoids downloading if provided)
   * @returns URL of the thumbnail or undefined if generation failed
   */
  async generateThumbnail(
    filePath: string, 
    mimeType: string, 
    fileBuffer?: Buffer
  ): Promise<string | undefined> {
    if (!mimeType.startsWith('image/')) {
      return undefined;
    }
    
    try {
      // Get the image data (either from buffer or download from S3)
      const imageBuffer = fileBuffer || await this.s3Service.downloadFile(filePath);
      
      // Generate thumbnail using sharp
      const thumbnailBuffer = await sharp(imageBuffer)
        .resize(200, 200, { fit: 'inside' })
        .toBuffer();
      
      // Create thumbnail path
      const thumbnailPath = filePath.replace(/\.[^/.]+$/, '') + '_thumb' + path.extname(filePath);
      
      // Upload thumbnail to S3
      const thumbnailUrl = await this.s3Service.uploadFile(
        thumbnailPath,
        thumbnailBuffer,
        mimeType
      );
      
      return thumbnailUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return undefined;
    }
  }

  /**
   * Update a media asset's metadata
   * @param id Media asset ID
   * @param updateData Updated metadata
   * @returns Updated MediaAsset object
   */
  async updateMediaAsset(id: string, updateData: UpdateMediaAssetDto): Promise<MediaAsset> {
    // Get the current asset to merge metadata
    const current = await this.mediaAssetRepository.findById(id);
    if (!current) {
      throw new Error(`MediaAsset with ID ${id} not found`);
    }
    
    // Prepare the update data
    const data: any = {};
    
    // Update alt text if provided
    if (updateData.altText !== undefined) {
      data.altText = updateData.altText;
    }
    
    // Merge metadata if provided
    if (updateData.metadata) {
      data.metadata = {
        ...current.metadata,
        ...updateData.metadata
      };
    }
    
    // Update the record
    return this.mediaAssetRepository.update(id, data);
  }

  /**
   * Delete a media asset and its file from S3
   * @param id Media asset ID
   * @returns Deleted MediaAsset object
   */
  async deleteMediaAsset(id: string): Promise<MediaAsset> {
    // First, check if the asset is used by any content
    const usages = await this.getMediaAssetUsage(id);
    if (usages.length > 0) {
      throw new Error(`Cannot delete media asset: it is used by ${usages.length} content items`);
    }
    
    // Get the asset to find the S3 key
    const asset = await this.mediaAssetRepository.findById(id);
    if (!asset) {
      throw new Error(`MediaAsset with ID ${id} not found`);
    }
    
    // Extract the key from the URL
    const urlParts = asset.url.split('/');
    const key = urlParts.slice(3).join('/');
    
    try {
      // Delete the file from S3
      await this.s3Service.deleteFile(key);
      
      // If there's a thumbnail, delete it too
      if (asset.thumbnailUrl) {
        const thumbUrlParts = asset.thumbnailUrl.split('/');
        const thumbKey = thumbUrlParts.slice(3).join('/');
        await this.s3Service.deleteFile(thumbKey);
      }
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      // Continue with database deletion even if S3 deletion fails
    }
    
    // Delete the record from the database
    return this.mediaAssetRepository.delete(id);
  }

  /**
   * Get content items that use this media asset
   * @param id Media asset ID
   * @returns Array of content references
   */
  async getMediaAssetUsage(id: string): Promise<any[]> {
    return this.mediaAssetRepository.findUsage(id);
  }

  /**
   * Get a pre-signed URL for a media asset
   * @param id Media asset ID
   * @param expiresIn Expiration time in seconds
   * @param organizationId Optional organization ID for access validation
   * @returns Pre-signed URL
   */
  async getPresignedUrl(id: string, expiresIn = 3600, organizationId?: string): Promise<string> {
    // Get the asset to find the S3 key
    const asset = await this.mediaAssetRepository.findById(id);
    if (!asset) {
      throw new Error(`MediaAsset with ID ${id} not found`);
    }
    
    // Validate organization access if organizationId is provided
    if (organizationId && asset.organizationId !== organizationId) {
      throw new Error(`Access denied: Media asset doesn't belong to the specified organization`);
    }
    
    // Extract the key from the URL
    const urlParts = asset.url.split('/');
    const key = urlParts.slice(3).join('/');
    
    // Generate the pre-signed URL
    return this.s3Service.getPresignedUrl(key, expiresIn);
  }
} 