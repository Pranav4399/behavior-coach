import { Router } from 'express';
import {
  getSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment
} from '../controllers/segmentController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Segment management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SegmentRule:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [any, all, none]
 *           description: Rule type (any = OR, all = AND, none = NOT)
 *         conditions:
 *           type: array
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/SegmentRule'
 *               - $ref: '#/components/schemas/SegmentCondition'
 *     
 *     SegmentCondition:
 *       type: object
 *       properties:
 *         attribute:
 *           type: string
 *           description: Worker attribute path (e.g., 'personal.firstName', 'employment.jobTitle')
 *         operator:
 *           type: string
 *           enum: [equals, not_equals, contains, not_contains, starts_with, ends_with, greater_than, less_than, in_list, not_in_list]
 *           description: Comparison operator
 *         value:
 *           type: string
 *           description: Value to compare against
 *     
 *     Segment:
 *       type: object
 *       required:
 *         - name
 *         - organizationId
 *       properties:
 *         id:
 *           type: string
 *           description: Segment ID
 *         name:
 *           type: string
 *           description: Segment name
 *         description:
 *           type: string
 *           description: Segment description
 *         organizationId:
 *           type: string
 *           description: Organization ID that owns this segment
 *         type:
 *           type: string
 *           enum: [static, rule]
 *           description: Segment type (static = manually managed, rule = rule-based)
 *         ruleDefinition:
 *           $ref: '#/components/schemas/SegmentRule'
 *           description: Rule definition for rule-based segments
 *         memberCount:
 *           type: integer
 *           description: Number of workers in the segment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         lastSyncAt:
 *           type: string
 *           format: date-time
 *           description: Last synchronization timestamp for rule-based segments
 */

/**
 * @swagger
 * /api/segments:
 *   get:
 *     summary: Get all segments
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for segment names or descriptions
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [static, rule]
 *         description: Filter by segment type
 *     responses:
 *       200:
 *         description: List of segments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 segments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Segment'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new segment
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [static, rule]
 *                 default: static
 *               ruleDefinition:
 *                 $ref: '#/components/schemas/SegmentRule'
 *     responses:
 *       201:
 *         description: Segment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 segment:
 *                   $ref: '#/components/schemas/Segment'
 *       400:
 *         description: Invalid segment data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getSegments)
  .post(createSegment);

/**
 * @swagger
 * /api/segments/{id}:
 *   get:
 *     summary: Get segment by ID
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Segment ID
 *     responses:
 *       200:
 *         description: Segment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 segment:
 *                   $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   patch:
 *     summary: Update segment
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Segment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [static, rule]
 *               ruleDefinition:
 *                 $ref: '#/components/schemas/SegmentRule'
 *     responses:
 *       200:
 *         description: Segment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 segment:
 *                   $ref: '#/components/schemas/Segment'
 *       400:
 *         description: Invalid segment data
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete segment
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Segment ID
 *     responses:
 *       200:
 *         description: Segment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getSegmentById)
  .patch(updateSegment)
  .delete(deleteSegment);

export const segmentCrudRoutes = router; 