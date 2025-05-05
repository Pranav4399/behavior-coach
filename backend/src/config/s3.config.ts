import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Determine if we're running locally or in production
const isLocalEnvironment = process.env.NODE_ENV !== 'production';

// S3 client configuration
const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// If we're in a local/dev environment, use LocalStack
if (isLocalEnvironment) {
  console.log('Using LocalStack S3 endpoint');
  s3Config.endpoint = process.env.LOCALSTACK_ENDPOINT || 'http://localstack:4566';
  s3Config.forcePathStyle = true; // Required for LocalStack
  // In LocalStack, we don't need real credentials, but aws-sdk still requires them
  s3Config.credentials = {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  };
} else {
  console.log('Using AWS S3 endpoint');
  // In production, AWS SDK will use the environment variables:
  // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
}

// Create and export the S3 client
export const s3Client = new S3Client(s3Config);

// Default bucket name - can be different between local and prod
export const defaultBucketName = isLocalEnvironment 
  ? (process.env.LOCAL_S3_BUCKET_NAME || 'local-test-bucket')
  : (process.env.AWS_S3_BUCKET_NAME || 'production-bucket');

// Export environment indicator
export const isLocal = isLocalEnvironment; 