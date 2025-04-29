import { Router } from 'express';
import { segmentCrudRoutes } from './segmentCrudRoutes';
import { segmentWorkerRoutes } from './segmentWorkerRoutes';
import { ruleTestingRoutes } from './ruleTestingRoutes';
import { segmentSyncRoutes } from './segmentSyncRoutes';
import { segmentAnalyticsRoutes } from './segmentAnalyticsRoutes';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Worker segment management
 */

const router = Router();

// Apply JWT authentication to all segment routes
router.use(authenticate);

// Register all segment-related routes
router.use('/', segmentCrudRoutes);
router.use('/', segmentWorkerRoutes);
router.use('/', ruleTestingRoutes);
router.use('/', segmentSyncRoutes);
router.use('/', segmentAnalyticsRoutes);

export const segmentRoutes = router; 