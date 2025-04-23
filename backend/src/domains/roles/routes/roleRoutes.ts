import { Router } from 'express';
import { 
  getAllRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole,
  getAllRolesAdmin
} from '../controllers/roleController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';
import { PERMISSIONS } from '../../../config/permissions';
import { authorize } from '../../auth/middleware/authMiddleware';
import { ALL_PERMISSIONS } from '../../../config/permissions';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - displayName
 *         - permissions
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated UUID of the role
 *         name:
 *           type: string
 *           description: The name of the role
 *         displayName:
 *           type: string
 *           description: The display name of the role
 *         description:
 *           type: string
 *           description: Description of the role
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of permission keys
 *         isDefault:
 *           type: boolean
 *           description: Whether this is a default role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the role was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the role was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management API
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Retrieve a list of roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: A list of roles
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
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 */
router.get('/', authenticate, authorize([PERMISSIONS.ROLE.VIEW]), getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role details
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
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 */
router.get('/:id', authenticate, authorize([PERMISSIONS.ROLE.VIEW]), getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - displayName
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *               displayName:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created successfully
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
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticate, authorize([PERMISSIONS.ROLE.CREATE]), createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Update a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               displayName:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
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
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Role not found
 */
router.patch('/:id', authenticate, authorize([PERMISSIONS.ROLE.EDIT]), updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *       400:
 *         description: Cannot delete default role
 *       404:
 *         description: Role not found
 */
router.delete('/:id', authenticate, authorize([PERMISSIONS.ROLE.DELETE]), deleteRole);

/**
 * @swagger
 * /api/roles/admin/all:
 *   get:
 *     summary: Get all roles across all organizations (platform admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles across all organizations
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
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *       403:
 *         description: Unauthorized - only platform admins can access this resource
 */
router.get('/admin/all', authenticate, authorize(ALL_PERMISSIONS), getAllRolesAdmin);

export default router; 