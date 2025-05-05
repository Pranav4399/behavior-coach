import { Router, Request, Response } from 'express';
import { S3Service } from '../services/s3.service';
import { isLocal, defaultBucketName } from '../../config/s3.config';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome page
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the Behavioral Coach API
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Behavioral Coach API',
    status: 'ok'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns health status of the API
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * @swagger
 * /health/s3:
 *   get:
 *     summary: S3 Health check
 *     description: Returns health status of the S3 service (LocalStack or AWS)
 *     responses:
 *       200:
 *         description: S3 is operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 provider:
 *                   type: string
 *                   example: LocalStack
 *                 bucket:
 *                   type: string
 *                   example: local-test-bucket
 *       500:
 *         description: S3 is not operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 */
router.get('/health/s3', async (req: Request, res: Response) => {
  try {
    const s3Service = new S3Service();
    
    // Try to initialize the bucket first to ensure it exists
    await s3Service.initializeBucket();
    
    // List files - if this works, S3 is responsive
    await s3Service.listFiles('');
    
    res.status(200).json({ 
      status: 'ok',
      provider: isLocal ? 'LocalStack' : 'AWS S3',
      bucket: defaultBucketName
    });
  } catch (error) {
    console.error('S3 health check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'S3 service is not operational',
      details: (error as Error).message
    });
  }
});

export { router as indexRoutes }; 