import { Router } from 'express';
import { 
  getAllOrganizations, 
  getOrganizationById, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization 
} from '../controllers/organizationController';
import { authMiddleware as authenticate, authorize } from '../../auth/middleware/authMiddleware';
import { PERMISSIONS } from '../../../config/permissions';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrganizationType:
 *       type: string
 *       enum: [client, expert]
 *     Organization:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - subscriptionTier
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated UUID of the organization
 *         name:
 *           type: string
 *           description: The name of the organization
 *         type:
 *           $ref: '#/components/schemas/OrganizationType'
 *         subscriptionTier:
 *           type: string
 *           description: Tier of service
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the organization was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the organization was last updated
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440000
 *         name: Acme Corporation
 *         type: client
 *         subscriptionTier: premium
 *         createdAt: 2023-11-20T12:00:00.000Z
 *         updatedAt: 2023-11-20T12:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management API
 */

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Retrieve a list of organizations
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: A list of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Organization'
 */
router.get('/', authenticate, authorize([PERMISSIONS.ORGANIZATION.VIEW]), getAllOrganizations);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Get an organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The organization ID
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     organization:
 *                       $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.get('/:id', authenticate, authorize([PERMISSIONS.ORGANIZATION.VIEW]), getOrganizationById);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - subscriptionTier
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 $ref: '#/components/schemas/OrganizationType'
 *               subscriptionTier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     organization:
 *                       $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, authorize([PERMISSIONS.ORGANIZATION.CREATE]), createOrganization);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Update an organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 $ref: '#/components/schemas/OrganizationType'
 *               subscriptionTier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     organization:
 *                       $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.put('/:id', authenticate, authorize([PERMISSIONS.ORGANIZATION.EDIT]), updateOrganization);

/**
 * @swagger
 * /api/organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The organization ID
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       404:
 *         description: Organization not found
 */
router.delete('/:id', authenticate, authorize([PERMISSIONS.ORGANIZATION.DELETE]), deleteOrganization);

export { router as organizationRoutes }; 