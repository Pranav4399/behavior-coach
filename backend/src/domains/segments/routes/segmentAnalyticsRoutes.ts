import { Router } from 'express';
import {
  getSegmentAnalytics,
  compareSegments,
  getSegmentInsights,
  getOverlappingSegments
} from '../controllers/segmentAnalyticsController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SegmentAnalytics
 *   description: Segment analytics and insights endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SegmentGrowthStats:
 *       type: object
 *       properties:
 *         segmentId:
 *           type: string
 *           description: Segment ID
 *         previousCount:
 *           type: integer
 *           description: Member count at the start of the period
 *         currentCount:
 *           type: integer
 *           description: Current member count
 *         growthRate:
 *           type: number
 *           description: Growth rate as a percentage
 *         period:
 *           type: string
 *           enum: [7 days, 30 days, 90 days]
 *           description: Time period for the growth calculation
 *
 *     WorkerAttributeDistribution:
 *       type: object
 *       properties:
 *         attributeName:
 *           type: string
 *           description: Name of the worker attribute
 *         values:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 description: Attribute value
 *               count:
 *                 type: integer
 *                 description: Number of workers with this value
 *               percentage:
 *                 type: number
 *                 description: Percentage of segment with this value
 */

/**
 * @swagger
 * /api/segments/{id}/analytics:
 *   get:
 *     summary: Get comprehensive analytics for a segment
 *     tags: [SegmentAnalytics]
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
 *         description: Segment analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     basicStats:
 *                       type: object
 *                       properties:
 *                         totalMembers:
 *                           type: integer
 *                           description: Total number of workers in the segment
 *                         ruleMatchCount:
 *                           type: integer
 *                           description: Number of workers matching the segment rule
 *                         manuallyAddedCount:
 *                           type: integer
 *                           description: Number of workers manually added to the segment
 *                         lastSyncDate:
 *                           type: string
 *                           format: date-time
 *                           description: Last time the segment was synchronized
 *                     syncActivity:
 *                       type: object
 *                       properties:
 *                         totalSyncs:
 *                           type: integer
 *                           description: Total number of sync operations
 *                         lastSyncDetails:
 *                           type: object
 *                           properties:
 *                             date:
 *                               type: string
 *                               format: date-time
 *                               description: When the last sync completed
 *                             processedCount:
 *                               type: integer
 *                               description: Number of workers processed
 *                             matchCount:
 *                               type: integer
 *                               description: Number of workers that matched the rule
 *                             durationMs:
 *                               type: integer
 *                               description: Duration of the sync in milliseconds
 *                     growthStats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SegmentGrowthStats'
 *                       description: Growth statistics for different time periods
 *                     topAttributes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkerAttributeDistribution'
 *                       description: Most common worker attributes in the segment
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id/analytics', getSegmentAnalytics);

/**
 * @swagger
 * /api/segments/compare:
 *   get:
 *     summary: Compare two segments
 *     tags: [SegmentAnalytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: segmentA
 *         required: true
 *         schema:
 *           type: string
 *         description: First segment ID
 *       - in: query
 *         name: segmentB
 *         required: true
 *         schema:
 *           type: string
 *         description: Second segment ID
 *     responses:
 *       200:
 *         description: Segment comparison data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     segmentA:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Segment ID
 *                         name:
 *                           type: string
 *                           description: Segment name
 *                         memberCount:
 *                           type: integer
 *                           description: Number of workers in the segment
 *                     segmentB:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Segment ID
 *                         name:
 *                           type: string
 *                           description: Segment name
 *                         memberCount:
 *                           type: integer
 *                           description: Number of workers in the segment
 *                     overlap:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           description: Number of workers in both segments
 *                         percentageOfA:
 *                           type: number
 *                           description: Percentage of segment A that overlaps with segment B
 *                         percentageOfB:
 *                           type: number
 *                           description: Percentage of segment B that overlaps with segment A
 *                     difference:
 *                       type: object
 *                       properties:
 *                         onlyInA:
 *                           type: integer
 *                           description: Number of workers only in segment A
 *                         onlyInB:
 *                           type: integer
 *                           description: Number of workers only in segment B
 *                         percentageOnlyInA:
 *                           type: number
 *                           description: Percentage of segment A that is unique
 *                         percentageOnlyInB:
 *                           type: number
 *                           description: Percentage of segment B that is unique
 *       400:
 *         description: Invalid request or segments from different organizations
 *       404:
 *         description: One or both segments not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/compare', compareSegments);

/**
 * @swagger
 * /api/segments/{id}/insights:
 *   get:
 *     summary: Get insights and recommendations for a segment
 *     tags: [SegmentAnalytics]
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
 *         description: Segment insights data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     uniqueAttributes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkerAttributeDistribution'
 *                       description: Attributes unique to this segment compared to the general worker population
 *                     mostDifferentiating:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkerAttributeDistribution'
 *                       description: Attributes that best distinguish this segment from others
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [split, merge, refine]
 *                             description: Type of recommendation
 *                           description:
 *                             type: string
 *                             description: Detailed explanation of the recommendation
 *                           potentialImpact:
 *                             type: number
 *                             description: Estimated impact as a percentage
 *                       description: Algorithmic recommendations for segment optimization
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id/insights', getSegmentInsights);

/**
 * @swagger
 * /api/segments/{id}/overlapping:
 *   get:
 *     summary: Find segments that overlap with a specific segment
 *     tags: [SegmentAnalytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target segment ID
 *     responses:
 *       200:
 *         description: List of overlapping segments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       segmentId:
 *                         type: string
 *                         description: ID of the overlapping segment
 *                       segmentName:
 *                         type: string
 *                         description: Name of the overlapping segment
 *                       overlapCount:
 *                         type: integer
 *                         description: Number of workers in both segments
 *                       overlapPercentage:
 *                         type: number
 *                         description: Percentage of the target segment that overlaps
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id/overlapping', getOverlappingSegments);

export const segmentAnalyticsRoutes = router; 