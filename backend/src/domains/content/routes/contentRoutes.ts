import express from 'express';
import { PERMISSIONS } from '../../../config/permissions';
import { authMiddleware as authenticate, authorize } from '../../auth/middleware/authMiddleware';
import { ContentController } from '../controllers/content.controller';

const router = express.Router();
const contentController = new ContentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the content
 *         title:
 *           type: string
 *           description: Content title
 *         description:
 *           type: string
 *           description: Content description
 *         type:
 *           type: string
 *           enum: [text, image, video, audio, document, quiz, reflection, template]
 *           description: Content type
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           description: Content status
 *         organizationId:
 *           type: string
 *           description: Organization this content belongs to
 *         createdById:
 *           type: string
 *           description: User who created this content
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       required:
 *         - title
 *         - type
 *         - status
 *         - organizationId
 */

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management endpoints
 */

/**
 * @swagger
 * /api/contents:
 *   get:
 *     tags: [Content]
 *     summary: Get all content
 *     description: Returns a list of content items with pagination and filtering
 *     parameters:
 *       - name: organizationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
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
 *         description: List of content items
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize([PERMISSIONS.CONTENT.VIEW]), contentController.getContents);

/**
 * @swagger
 * /api/contents/with-media:
 *   get:
 *     tags: [Content]
 *     summary: Get all content with media details
 *     description: Returns a list of content items with complete media asset information
 *     parameters:
 *       - name: organizationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
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
 *         description: List of content items with media details
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/with-media', authenticate, authorize([PERMISSIONS.CONTENT.VIEW]), contentController.getContentsWithMediaDetails);

/**
 * @swagger
 * /api/contents/{id}:
 *   get:
 *     tags: [Content]
 *     summary: Get content by ID
 *     description: Returns details of a specific content item
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content details
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, authorize([PERMISSIONS.CONTENT.VIEW]), contentController.getContentById);

/**
 * @swagger
 * /api/contents/text:
 *   post:
 *     tags: [Content]
 *     summary: Create text content
 *     description: Creates a new text content item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               text:
 *                 type: string
 *               formatting:
 *                 type: object
 *     responses:
 *       201:
 *         description: Text content created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/text', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createTextContent);

/**
 * @swagger
 * /api/contents/image:
 *   post:
 *     tags: [Content]
 *     summary: Create image content
 *     description: Creates a new image content item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               mediaAssetId:
 *                 type: string
 *               altText:
 *                 type: string
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image content created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/image', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createImageContent);

/**
 * @swagger
 * /api/contents/document:
 *   post:
 *     tags: [Content]
 *     summary: Create document content
 *     description: Creates a new document content item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               mediaAssetId:
 *                 type: string
 *               documentDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document content created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/document', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createDocumentContent);

/**
 * @swagger
 * /api/contents/quiz:
 *   post:
 *     tags: [Content]
 *     summary: Create quiz content
 *     description: Creates a new quiz content item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *               scoringType:
 *                 type: string
 *               timeLimit:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Quiz content created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/quiz', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createQuizContent);

/**
 * @swagger
 * /api/contents/from-media:
 *   post:
 *     tags: [Content]
 *     summary: Create content from media asset
 *     description: Creates appropriate content based on media asset type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaAssetId:
 *                 type: string
 *                 description: ID of the media asset to create content from
 *               title:
 *                 type: string
 *                 description: Content title
 *               description:
 *                 type: string
 *                 description: Content description
 *               status:
 *                 type: string
 *                 description: Content status (draft, published, etc.)
 *               organizationId:
 *                 type: string
 *                 description: Organization ID
 *               altText:
 *                 type: string
 *                 description: Alternative text for images
 *               caption:
 *                 type: string
 *                 description: Caption for media
 *               transcript:
 *                 type: string
 *                 description: Transcript for audio/video
 *     responses:
 *       201:
 *         description: Content created successfully from media asset
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/from-media', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createContentFromMediaAsset);

/**
 * @swagger
 * /api/contents/{id}:
 *   patch:
 *     tags: [Content]
 *     summary: Update content
 *     description: Updates a content item's base properties
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', authenticate, authorize([PERMISSIONS.CONTENT.EDIT]), contentController.updateContent);

/**
 * @swagger
 * /api/contents/{id}/data:
 *   patch:
 *     tags: [Content]
 *     summary: Update content type-specific data
 *     description: Updates a content item's type-specific data
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
 *     responses:
 *       200:
 *         description: Content data updated successfully
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/data', authenticate, authorize([PERMISSIONS.CONTENT.EDIT]), contentController.updateTypeSpecificContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     tags: [Content]
 *     summary: Delete content
 *     description: Deletes a content item
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, authorize([PERMISSIONS.CONTENT.DELETE]), contentController.deleteContent);

/**
 * @swagger
 * /api/contents/{id}/tags:
 *   post:
 *     tags: [Content]
 *     summary: Add tags to content
 *     description: Adds tags to a content item
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
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tags added successfully
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/tags', authenticate, authorize([PERMISSIONS.CONTENT.EDIT]), contentController.addContentTags);

/**
 * @swagger
 * /api/contents/{id}/tags/{tagId}:
 *   delete:
 *     tags: [Content]
 *     summary: Remove tag from content
 *     description: Removes a tag from a content item
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: tagId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag removed successfully
 *       404:
 *         description: Content or tag not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/tags/:tagId', authenticate, authorize([PERMISSIONS.CONTENT.EDIT]), contentController.removeContentTag);

/**
 * @swagger
 * /api/contents/tags/{tagId}:
 *   get:
 *     tags: [Content]
 *     summary: Get content by tag
 *     description: Returns content items with a specific tag
 *     parameters:
 *       - name: tagId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: organizationId
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: type
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
 *         description: List of content items with the specified tag
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/tags/:tagId/contents', authenticate, authorize([PERMISSIONS.CONTENT.VIEW]), contentController.getContentByTag);

/**
 * @swagger
 * /api/contents/{id}/with-media:
 *   get:
 *     tags: [Content]
 *     summary: Get content by ID with media details
 *     description: Returns details of a specific content item including complete media asset information
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content details with media information
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/with-media', authenticate, authorize([PERMISSIONS.CONTENT.VIEW]), contentController.getContentWithMediaDetails);

/**
 * @swagger
 * /api/contents/video:
 *   post:
 *     tags: [Content]
 *     summary: Create video content
 *     description: Creates a new video content item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               mediaAssetId:
 *                 type: string
 *               caption:
 *                 type: string
 *               transcript:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Video content created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/video', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createVideoContent);

/**
 * @swagger
 * /api/contents/audio:
 *   post:
 *     tags: [Content]
 *     summary: Create audio content
 *     description: Creates a new audio content item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               mediaAssetId:
 *                 type: string
 *               caption:
 *                 type: string
 *               transcript:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Audio content created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/audio', authenticate, authorize([PERMISSIONS.CONTENT.CREATE]), contentController.createAudioContent);

export default router;