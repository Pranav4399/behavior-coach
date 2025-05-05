import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, defaultBucketName, isLocal } from '../../config/s3.config';

/**
 * S3 Service for handling file operations with AWS S3 or LocalStack
 */
export class S3Service {
  private bucketName: string;

  /**
   * Create an S3 service instance
   * @param bucketName Optional bucket name, defaults to the one in config
   */
  constructor(bucketName?: string) {
    this.bucketName = bucketName || defaultBucketName;
  }

  /**
   * Initialize the S3 bucket - creates it if it doesn't exist (useful for LocalStack)
   */
  async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      await s3Client.send(new HeadBucketCommand({ 
        Bucket: this.bucketName 
      }));
      console.log(`Bucket ${this.bucketName} exists`);
    } catch (error: any) {
      // Catch both NotFound and NoSuchBucket errors that might come from different S3 implementations
      if (error.name === 'NotFound' || 
          error.name === 'NoSuchBucket' || 
          error.$metadata?.httpStatusCode === 404 ||
          (error.message && (error.message.includes('NotFound') || error.message.includes('NoSuchBucket')))) {
        console.log(`Bucket ${this.bucketName} does not exist, creating...`);
        try {
          await this.createBucket();
          console.log(`Bucket ${this.bucketName} created successfully`);
        } catch (createError) {
          console.error(`Failed to create bucket ${this.bucketName}:`, createError);
          throw createError;
        }
      } else {
        console.error(`Error checking bucket ${this.bucketName}:`, error);
        throw error;
      }
    }
  }

  /**
   * Create a new S3 bucket
   */
  async createBucket(): Promise<void> {
    try {
      await s3Client.send(new CreateBucketCommand({
        Bucket: this.bucketName
      }));
      console.log(`Bucket ${this.bucketName} created successfully`);
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }

  /**
   * Upload a file to S3
   * @param key The key (path) to store the file under
   * @param body The file buffer or stream
   * @param contentType The file's MIME type
   * @returns The URL of the uploaded file
   */
  async uploadFile(key: string, body: Buffer | Uint8Array | string, contentType: string): Promise<string> {
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
      }));

      // Return the URL to the uploaded file
      return this.getFileUrl(key);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  /**
   * Get a pre-signed URL for a file
   * @param key The key (path) of the file
   * @param expiresIn How long the URL is valid for (in seconds)
   * @returns A pre-signed URL for the file
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw error;
    }
  }

  /**
   * Get the URL for a file
   * @param key The key (path) of the file
   * @returns The URL for the file
   */
  getFileUrl(key: string): string {
    if (isLocal) {
      // LocalStack URL format
      return `http://localhost:4566/${this.bucketName}/${key}`;
    } else {
      // AWS S3 URL format - region-specific
      const region = process.env.AWS_REGION || 'us-east-1';
      return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
    }
  }

  /**
   * Delete a file from S3
   * @param key The key (path) of the file to delete
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      }));
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }

  /**
   * List files in a directory
   * @param prefix The directory prefix to list files from
   * @returns Array of file keys
   */
  async listFiles(prefix: string): Promise<string[]> {
    try {
      const response = await s3Client.send(new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix
      }));

      return (response.Contents || []).map(item => item.Key || '');
    } catch (error) {
      console.error('Error listing files from S3:', error);
      throw error;
    }
  }

  /**
   * Download a file from S3
   * @param key The key (path) of the file to download
   * @returns The file data as a buffer
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      const response = await s3Client.send(new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      }));

      // Convert the stream to a buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      throw error;
    }
  }
} 