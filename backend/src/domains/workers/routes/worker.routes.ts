import { Router } from 'express';
import { WorkerController } from '../controllers/worker.controller';
import { authMiddleware as authenticate, authorize } from '../../auth/middleware/authMiddleware';
import { PERMISSIONS } from '../../../config/permissions';
const router = Router();
const workerController = new WorkerController();

/**
 * @swagger
 * tags:
 *   name: Workers
 *   description: Worker management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: The worker ID
 *         firstName:
 *           type: string
 *           description: Worker's first name
 *         lastName:
 *           type: string
 *           description: Worker's last name
 *         externalId:
 *           type: string
 *           description: Optional external identifier
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Worker's date of birth
 *         gender:
 *           type: string
 *           enum: [male, female, non_binary, other, prefer_not_say]
 *           description: Worker's gender
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the worker
 *         isActive:
 *           type: boolean
 *           description: Whether the worker is active
 *         primaryPhoneNumber:
 *           type: string
 *           description: Primary phone number
 *         emailAddress:
 *           type: string
 *           description: Email address
 *         locationCity:
 *           type: string
 *           description: City of residence
 *         locationStateProvince:
 *           type: string
 *           description: State or province
 *         locationCountry:
 *           type: string
 *           description: Country
 *         jobTitle:
 *           type: string
 *           description: Job title
 *         department:
 *           type: string
 *           description: Department
 *         team:
 *           type: string
 *           description: Team
 *         employmentStatus:
 *           type: string
 *           enum: [active, inactive, on_leave, terminated]
 *           description: Employment status
 *         employmentType:
 *           type: string
 *           enum: [full_time, part_time, contractor, temporary]
 *           description: Employment type
 */

// Worker routes with authentication and permissions
/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Get all workers
 *     tags: [Workers]
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
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search by name, ID, or contact info
 *       - in: query
 *         name: employmentStatus
 *         schema:
 *           type: string
 *           enum: [active, inactive, on_leave, terminated]
 *         description: Filter by employment status
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: team
 *         schema:
 *           type: string
 *         description: Filter by team
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
 *     responses:
 *       200:
 *         description: List of workers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  workerController.getWorkers
);

/**
 * @swagger
 * /api/workers/{id}:
 *   get:
 *     summary: Get worker by ID
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Worker not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  workerController.getWorkerById
);

/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Create a new worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - primaryPhoneNumber
 *               - emailAddress
 *               - locationCity
 *               - locationStateProvince
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               externalId:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, non_binary, other, prefer_not_say]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               primaryPhoneNumber:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *               locationCity:
 *                 type: string
 *               locationStateProvince:
 *                 type: string
 *               locationCountry:
 *                 type: string
 *                 default: India
 *               jobTitle:
 *                 type: string
 *               department:
 *                 type: string
 *               team:
 *                 type: string
 *               employmentStatus:
 *                 type: string
 *                 enum: [active, inactive, on_leave, terminated]
 *                 default: active
 *               employmentType:
 *                 type: string
 *                 enum: [full_time, part_time, contractor, temporary]
 *     responses:
 *       201:
 *         description: Worker created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticate,
  workerController.createWorker
);

/**
 * @swagger
 * /api/workers/{id}:
 *   patch:
 *     summary: Update a worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               externalId:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, non_binary, other, prefer_not_say]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *               primaryPhoneNumber:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *               locationCity:
 *                 type: string
 *               locationStateProvince:
 *                 type: string
 *               locationCountry:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               department:
 *                 type: string
 *               team:
 *                 type: string
 *               employmentStatus:
 *                 type: string
 *                 enum: [active, inactive, on_leave, terminated]
 *               employmentType:
 *                 type: string
 *                 enum: [full_time, part_time, contractor, temporary]
 *     responses:
 *       200:
 *         description: Worker updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id',
  authenticate,
  workerController.updateWorker
);

/**
 * @swagger
 * /api/workers/{id}:
 *   delete:
 *     summary: Delete a worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  workerController.deleteWorker
);

/**
 * @swagger
 * /api/workers/bulk-import:
 *   post:
 *     summary: Bulk import workers
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workers
 *             properties:
 *               workers:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Worker'
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
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/bulk-import',
  authenticate,
  workerController.bulkImportWorkers
);

/**
 * @swagger
 * /api/workers/bulk-update:
 *   post:
 *     summary: Bulk update workers
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workerIds
 *               - updates
 *             properties:
 *               workerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               updates:
 *                 type: object
 *                 description: Worker fields to update
 *     responses:
 *       200:
 *         description: Workers updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/bulk-update',
  authenticate,
  workerController.bulkUpdateWorkers
);

/**
 * @swagger
 * /api/workers/bulk-delete:
 *   post:
 *     summary: Bulk delete workers
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Workers deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/bulk-delete',
  authenticate,
  workerController.bulkDeleteWorkers
);

/**
 * @swagger
 * /api/workers/{id}/tags:
 *   post:
 *     summary: Add tags to a worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tags
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tags added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/tags',
  authenticate,
  workerController.addWorkerTags
);

/**
 * @swagger
 * /api/workers/{id}/tags/{tag}:
 *   delete:
 *     summary: Remove a tag from a worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag to remove
 *     responses:
 *       200:
 *         description: Tag removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id/tags/:tag',
  authenticate,
  workerController.removeWorkerTag
);

export default router; 