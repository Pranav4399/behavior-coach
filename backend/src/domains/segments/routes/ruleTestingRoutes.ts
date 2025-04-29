import { Router } from 'express';
import {
  testRule,
  testRuleAdvanced,
  testSegmentRule,
  explainWorkerMatch,
  explainWorkerSegmentMatch
} from '../controllers/ruleTestingController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: RuleTesting
 *   description: Segment rule testing and explanation endpoints
 */

/**
 * @swagger
 * /api/segments/test-rule:
 *   post:
 *     summary: Test a segment rule against the worker database
 *     tags: [RuleTesting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rule
 *             properties:
 *               rule:
 *                 $ref: '#/components/schemas/SegmentRule'
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Maximum number of matching workers to return
 *     responses:
 *       200:
 *         description: Rule testing results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matchCount:
 *                   type: integer
 *                   description: Number of workers matching the rule
 *                 totalWorkers:
 *                   type: integer
 *                   description: Total number of workers in the organization
 *                 matchPercentage:
 *                   type: number
 *                   description: Percentage of workers matching the rule
 *                 matchingWorkers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *                   description: Sample of matching workers (limited by the limit parameter)
 *       400:
 *         description: Invalid rule definition
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/test-rule', testRule);

/**
 * @swagger
 * /api/segments/test-rule/advanced:
 *   post:
 *     summary: Advanced testing of a segment rule with filtering options
 *     tags: [RuleTesting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rule
 *             properties:
 *               rule:
 *                 $ref: '#/components/schemas/SegmentRule'
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Maximum number of matching workers to return
 *               filters:
 *                 type: object
 *                 properties:
 *                   departments:
 *                     type: array
 *                     items:
 *                       type: string
 *                   employmentStatuses:
 *                     type: array
 *                     items:
 *                       type: string
 *                   locations:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Advanced rule testing results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matchCount:
 *                   type: integer
 *                   description: Number of workers matching the rule
 *                 filteredWorkerCount:
 *                   type: integer
 *                   description: Number of workers after applying filters
 *                 totalWorkers:
 *                   type: integer
 *                   description: Total number of workers in the organization
 *                 matchPercentage:
 *                   type: number
 *                   description: Percentage of workers matching the rule (from filtered set)
 *                 matchingWorkers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *                   description: Sample of matching workers (limited by the limit parameter)
 *                 breakdownByDepartment:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: Breakdown of matching workers by department
 *                 breakdownByLocation:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: Breakdown of matching workers by location
 *       400:
 *         description: Invalid rule definition or filters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/test-rule/advanced', testRuleAdvanced);

/**
 * @swagger
 * /api/segments/{id}/test-rule:
 *   post:
 *     summary: Test a segment's rule definition
 *     tags: [RuleTesting]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Maximum number of matching workers to return
 *     responses:
 *       200:
 *         description: Rule testing results for the segment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matchCount:
 *                   type: integer
 *                   description: Number of workers matching the rule
 *                 totalWorkers:
 *                   type: integer
 *                   description: Total number of workers in the organization
 *                 matchPercentage:
 *                   type: number
 *                   description: Percentage of workers matching the rule
 *                 matchingWorkers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *                   description: Sample of matching workers (limited by the limit parameter)
 *       400:
 *         description: Invalid segment or not a rule-based segment
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:id/test-rule', testSegmentRule);

/**
 * @swagger
 * /api/segments/explain-worker-match:
 *   post:
 *     summary: Explain why a worker matches or doesn't match a rule
 *     tags: [RuleTesting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rule
 *               - workerId
 *             properties:
 *               rule:
 *                 $ref: '#/components/schemas/SegmentRule'
 *               workerId:
 *                 type: string
 *                 description: ID of the worker to check against the rule
 *     responses:
 *       200:
 *         description: Explanation of worker match status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: boolean
 *                   description: Whether the worker matches the rule
 *                 explanation:
 *                   type: string
 *                   description: Human-readable explanation of why the worker matches or doesn't match
 *                 details:
 *                   type: object
 *                   description: Detailed breakdown of each condition evaluation
 *       400:
 *         description: Invalid rule definition or worker ID
 *       404:
 *         description: Worker not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/explain-worker-match', explainWorkerMatch);

/**
 * @swagger
 * /api/segments/{id}/workers/{workerId}/explain:
 *   get:
 *     summary: Explain why a worker matches or doesn't match a segment
 *     tags: [RuleTesting]
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
 *         description: Explanation of worker match status for the segment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: boolean
 *                   description: Whether the worker matches the segment
 *                 inSegment:
 *                   type: boolean
 *                   description: Whether the worker is actually in the segment (could be manually added)
 *                 ruleMatch:
 *                   type: boolean
 *                   description: Whether the worker matches the segment's rule
 *                 explanation:
 *                   type: string
 *                   description: Human-readable explanation of the match status
 *                 details:
 *                   type: object
 *                   description: Detailed breakdown of each condition evaluation (for rule-based segments)
 *       400:
 *         description: Invalid segment or not a rule-based segment
 *       404:
 *         description: Segment or worker not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id/workers/:workerId/explain', explainWorkerSegmentMatch);

export const ruleTestingRoutes = router; 