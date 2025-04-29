import { Router } from 'express';
import {
  syncSegment,
  getSegmentSyncStatus
} from '../controllers/segmentController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SegmentSync
 *   description: Segment synchronization endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SyncStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Sync job ID
 *         segmentId:
 *           type: string
 *           description: Segment ID
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, failed]
 *           description: Current status of the sync job
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: When the sync job started processing
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: When the sync job completed
 *         processedCount:
 *           type: integer
 *           description: Number of workers processed
 *         matchCount:
 *           type: integer
 *           description: Number of workers matching the rule
 *         error:
 *           type: string
 *           description: Error message if sync job failed
 */

/**
 * @swagger
 * /api/segments/{id}/sync:
 *   post:
 *     summary: Manually trigger synchronization for a rule-based segment
 *     tags: [SegmentSync]
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
 *         description: Sync job initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 syncJob:
 *                   $ref: '#/components/schemas/SyncStatus'
 *       400:
 *         description: Invalid segment or not a rule-based segment
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:id/sync', syncSegment);

/**
 * @swagger
 * /api/segments/{id}/sync/status:
 *   get:
 *     summary: Get sync status for a segment
 *     tags: [SegmentSync]
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
 *         description: Segment sync status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 segment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     lastSyncAt:
 *                       type: string
 *                       format: date-time
 *                     memberCount:
 *                       type: integer
 *                 currentSyncJob:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/SyncStatus'
 *                     - type: 'null'
 *                   description: Details of the current sync job, if one is in progress
 *                 lastCompletedSyncJob:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/SyncStatus'
 *                     - type: 'null'
 *                   description: Details of the last completed sync job
 *                 recentSyncJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SyncStatus'
 *                   description: List of recent sync jobs
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id/sync/status', getSegmentSyncStatus);

export const segmentSyncRoutes = router; 