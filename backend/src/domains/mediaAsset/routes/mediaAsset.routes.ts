import express from 'express';
import { MediaAssetController } from '../controllers/mediaAsset.controller';
import multer from 'multer';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

// Configure multer for memory storage (needed for S3 uploads)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();
const mediaAssetController = new MediaAssetController();

/**
 * @swagger
 * /api/organizations/{organizationId}/media:
 *   get:
 *     summary: Get all media assets
 *     description: Returns a list of media assets with pagination and filtering
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [image, video, audio, document]
 *       - name: uploadedById
 *         in: query
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of media assets
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/organizations/:organizationId/media', authenticate, mediaAssetController.getMediaAssets);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get a media asset by ID
 *     description: Returns details of a specific media asset
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media asset details
 *       404:
 *         description: Media asset not found
 *       401:
 *         description: Unauthorized
 */
router.get('/media/:id', authenticate, mediaAssetController.getMediaAssetById);

/**
 * @swagger
 * /api/organizations/{organizationId}/media/upload:
 *   post:
 *     summary: Upload a new media asset
 *     description: Uploads a file and creates a new media asset record
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               altText:
 *                 type: string
 *               metadata:
 *                 type: string
 *                 description: JSON string of additional metadata
 *     responses:
 *       201:
 *         description: Media asset created successfully
 *       400:
 *         description: Invalid request or file
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/organizations/:organizationId/media/upload',
  authenticate,
  upload.single('file'),
  mediaAssetController.uploadMediaAsset
);

/**
 * @swagger
 * /api/media/{id}:
 *   patch:
 *     summary: Update a media asset
 *     description: Updates metadata of an existing media asset
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               altText:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Media asset updated successfully
 *       404:
 *         description: Media asset not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/media/:id', authenticate, mediaAssetController.updateMediaAsset);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete a media asset
 *     description: Deletes a media asset and its file from S3
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media asset deleted successfully
 *       400:
 *         description: Asset is in use and cannot be deleted
 *       404:
 *         description: Media asset not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/media/:id', authenticate, mediaAssetController.deleteMediaAsset);

/**
 * @swagger
 * /api/media/{id}/usage:
 *   get:
 *     summary: Get media asset usage
 *     description: Returns a list of content items using this media asset
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of usages
 *       404:
 *         description: Media asset not found
 *       401:
 *         description: Unauthorized
 */
router.get('/media/:id/usage', authenticate, mediaAssetController.getMediaAssetUsage);

/**
 * @swagger
 * /api/media/{id}/url:
 *   get:
 *     summary: Get a pre-signed URL
 *     description: Returns a pre-signed URL for temporary access to the file
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: expiresIn
 *         in: query
 *         schema:
 *           type: integer
 *           description: Expiration time in seconds (default 3600)
 *     responses:
 *       200:
 *         description: Pre-signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 presignedUrl:
 *                   type: string
 *                   description: Secure URL with expiration
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Media asset not found
 *       401:
 *         description: Unauthorized
 */
router.get('/media/:id/url', authenticate, mediaAssetController.getPresignedUrl);

/**
 * @swagger
 * /api/organizations/{organizationId}/media/{id}/url:
 *   get:
 *     summary: Get a pre-signed URL for organization media
 *     description: Returns a pre-signed URL for temporary access to an organization's media asset file
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: expiresIn
 *         in: query
 *         schema:
 *           type: integer
 *           description: Expiration time in seconds (default 3600)
 *     responses:
 *       200:
 *         description: Pre-signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 presignedUrl:
 *                   type: string
 *                   description: Secure URL with expiration
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   description: ISO timestamp when URL expires
 *       404:
 *         description: Media asset not found
 *       401:
 *         description: Unauthorized
 */
router.get('/organizations/:organizationId/media/:id/url', authenticate, mediaAssetController.getPresignedUrl);

export default router; 