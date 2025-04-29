import { Router } from 'express';
import { WorkerCsvController } from '../controllers/worker-csv.controller';
import { authMiddleware as authenticate, blockPlatformAdmin } from '../../auth/middleware/authMiddleware';
import { csvUpload, handleUploadError } from '../../../common/middleware/uploadMiddleware';

const router = Router();
const workerCsvController = new WorkerCsvController();

/**
 * @swagger
 * /api/workers/csv/upload:
 *   post:
 *     summary: Upload and process a CSV file with worker data
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [create, update]
 *           default: create
 *         description: Mode to process the CSV - create new workers or update existing ones
 *       - in: query
 *         name: dryRun
 *         schema:
 *           type: boolean
 *           default: false
 *         description: If true, validate the CSV but don't import data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with worker data
 *     responses:
 *       201:
 *         description: Workers imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 mode:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       row:
 *                         type: integer
 *                       column:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/upload',
  authenticate,
  blockPlatformAdmin,
  csvUpload.single('file'),
  handleUploadError,
  workerCsvController.uploadCsv
);

/**
 * @swagger
 * /api/workers/csv/validate:
 *   post:
 *     summary: Validate a CSV file without importing the data
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file to validate
 *     responses:
 *       200:
 *         description: Validation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       row:
 *                         type: integer
 *                       column:
 *                         type: string
 *                       message:
 *                         type: string
 *                 validRecords:
 *                   type: integer
 *                 totalRecords:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/validate',
  authenticate,
  blockPlatformAdmin,
  csvUpload.single('file'),
  handleUploadError,
  workerCsvController.validateCsv
);

/**
 * @swagger
 * /api/workers/csv/template:
 *   get:
 *     summary: Download a CSV template for worker import
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV template file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/template',
  authenticate,
  blockPlatformAdmin,
  workerCsvController.downloadTemplate
);

/**
 * @swagger
 * /api/workers/csv/sample:
 *   get:
 *     summary: Download a sample CSV with example worker data
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sample CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/sample',
  authenticate,
  blockPlatformAdmin,
  workerCsvController.downloadSample
);

export default router; 