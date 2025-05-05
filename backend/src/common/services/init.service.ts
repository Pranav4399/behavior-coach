import { S3Service } from './s3.service';
import { isLocal } from '../../config/s3.config';

/**
 * Initialize various services on application startup
 */
export class InitializationService {
  /**
   * Initialize all necessary services
   */
  static async initializeServices(): Promise<void> {
    try {
      console.log('Initializing services...');
      
      // Initialize S3 bucket (especially important for LocalStack)
      if (isLocal) {
        console.log('LocalStack detected, initializing S3 bucket...');
        await InitializationService.initializeS3();
      }
      
      console.log('Services initialized successfully');
    } catch (error) {
      console.error('Error initializing services:', error);
      // Don't throw error here, so the application can still start
      // even if service initialization fails
    }
  }

  /**
   * Initialize S3 service and create default bucket if it doesn't exist
   */
  private static async initializeS3(): Promise<void> {
    try {
      const s3Service = new S3Service();
      await s3Service.initializeBucket();
    } catch (error) {
      console.error('Error initializing S3:', error);
      throw error;
    }
  }
} 