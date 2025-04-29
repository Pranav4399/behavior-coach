import { Router } from 'express';
import {
  getSegmentWorkers,
  addWorkersToSegment,
  removeWorkerFromSegment
} from '../controllers/segmentController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SegmentWorkers
 *   description: Segment worker membership management
 */

/**
 * @swagger
 * /api/segments/{id}/workers:
 *   get:
 *     summary: Get workers in a segment
 *     tags: [SegmentWorkers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Segment ID
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
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for worker names
 *     responses:
 *       200:
 *         description: List of workers in the segment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   
 *   post:
 *     summary: Add workers to a segment
 *     tags: [SegmentWorkers]
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
 *             required:
 *               - workerIds
 *             properties:
 *               workerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of worker IDs to add to the segment
 *     responses:
 *       200:
 *         description: Workers added to segment successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 addedCount:
 *                   type: integer
 *       400:
 *         description: Invalid worker IDs
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.route('/:id/workers')
  .get(getSegmentWorkers)
  .post(addWorkersToSegment);

/**
 * @swagger
 * /api/segments/{id}/workers/{workerId}:
 *   delete:
 *     summary: Remove a worker from a segment
 *     tags: [SegmentWorkers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Segment ID
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker removed from segment successfully
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
 *         description: Segment or worker not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.route('/:id/workers/:workerId')
  .delete(removeWorkerFromSegment);

export const segmentWorkerRoutes = router; 