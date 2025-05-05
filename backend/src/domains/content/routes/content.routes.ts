import express from 'express';
import { ContentController } from '../controllers/content.controller';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = express.Router();
const contentController = new ContentController();

/**
 * @swagger
 * /api/organizations/{organizationId}/contents:
 *   get:
 *     summary: Get all content
 *     description: Returns a list of content items with pagination and filtering
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
router.get('/organizations/:organizationId/contents', authenticate, contentController.getContents);

/**
 * @swagger
 * /api/contents/{id}:
 *   get:
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
router.get('/contents/:id', authenticate, contentController.getContentById);

/**
 * @swagger
 * /api/contents/text:
 *   post:
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
router.post('/contents/text', authenticate, contentController.createTextContent);

/**
 * @swagger
 * /api/contents/image:
 *   post:
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
router.post('/contents/image', authenticate, contentController.createImageContent);

/**
 * @swagger
 * /api/contents/media:
 *   post:
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
router.post('/contents/from-media', authenticate, contentController.createContentFromMediaAsset);

/**
 * @swagger
 * /api/contents/{id}:
 *   patch:
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
router.patch('/contents/:id', authenticate, contentController.updateContent);

/**
 * @swagger
 * /api/contents/{id}/data:
 *   patch:
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
router.patch('/contents/:id/data', authenticate, contentController.updateTypeSpecificContent);

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
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
router.delete('/contents/:id', authenticate, contentController.deleteContent);

/**
 * @swagger
 * /api/contents/{id}/tags:
 *   post:
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
router.post('/contents/:id/tags', authenticate, contentController.addContentTags);

/**
 * @swagger
 * /api/contents/{id}/tags/{tagId}:
 *   delete:
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
router.delete('/contents/:id/tags/:tagId', authenticate, contentController.removeContentTag);

/**
 * @swagger
 * /api/tags/{tagId}/contents:
 *   get:
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
router.get('/tags/:tagId/contents', authenticate, contentController.getContentByTag);

/**
 * @swagger
 * /api/contents/{id}/with-media:
 *   get:
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
router.get('/contents/:id/with-media', authenticate, contentController.getContentWithMediaDetails);

/**
 * @swagger
 * /api/organizations/{organizationId}/contents/with-media:
 *   get:
 *     summary: Get all content with media details
 *     description: Returns a list of content items with complete media asset information
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
router.get('/organizations/:organizationId/contents/with-media', authenticate, contentController.getContentsWithMediaDetails);

export default router;