import express from 'express';
import { MetricsController } from '../controllers/metrics.controller';
import { authMiddleware as authenticate } from '../../domains/auth/middleware/authMiddleware';

const router = express.Router();
const metricsController = new MetricsController();

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Get all metrics
 *     description: Returns all metrics collected by the system
 *     responses:
 *       200:
 *         description: List of all metrics
 *       401:
 *         description: Unauthorized
 */
router.get('/metrics', authenticate, metricsController.getAllMetrics);

/**
 * @swagger
 * /api/metrics/prometheus:
 *   get:
 *     summary: Get metrics in Prometheus format
 *     description: Returns metrics in Prometheus-compatible format
 *     responses:
 *       200:
 *         description: Prometheus-formatted metrics
 */
router.get('/metrics/prometheus', metricsController.getPrometheusMetrics);

export default router; 