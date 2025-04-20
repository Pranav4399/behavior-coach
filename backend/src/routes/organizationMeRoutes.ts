import { Router } from 'express';
import * as organizationMeController from '../controllers/organizationMeController';
import { authenticate, authorize, requireOrgAdmin, restrictToOrgType } from '../middleware/authMiddleware';
import { PERMISSIONS } from '../config/permissions';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/organizations/me:
 *   get:
 *     summary: Retrieve details for the current user's organization
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: Organization details retrieved successfully
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
router.get('/', 
  authorize([PERMISSIONS.ORGANIZATION.VIEW]), 
  organizationMeController.getCurrentOrganization
);

/**
 * @swagger
 * /api/organizations/me:
 *   patch:
 *     summary: Update details for the current user's organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               customTerminology:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
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
router.patch('/', 
  requireOrgAdmin, 
  authorize([PERMISSIONS.ORGANIZATION.EDIT]), 
  organizationMeController.updateCurrentOrganization
);

/**
 * @swagger
 * /api/organizations/me/settings:
 *   get:
 *     summary: Retrieve organization-specific settings
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
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
 *                     settings:
 *                       type: object
 *                     customTerminology:
 *                       type: object
 *       404:
 *         description: Organization not found
 */
router.get('/settings', 
  authorize([PERMISSIONS.ORGANIZATION.MANAGE_SETTINGS]), 
  organizationMeController.getSettings
);

/**
 * @swagger
 * /api/organizations/me/settings:
 *   patch:
 *     summary: Update organization-specific settings
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Settings updated successfully
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
 *                     settings:
 *                       type: object
 *       404:
 *         description: Organization not found
 */
router.patch('/settings', 
  requireOrgAdmin, 
  authorize([PERMISSIONS.ORGANIZATION.MANAGE_SETTINGS]), 
  organizationMeController.updateSettings
);

/**
 * @swagger
 * /api/organizations/me/roles:
 *   get:
 *     summary: Get organization-specific role definitions
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           displayName:
 *                             type: string
 *                           permissions:
 *                             type: array
 *                             items:
 *                               type: string
 */
router.get('/roles', 
  authorize([PERMISSIONS.ROLE.VIEW]), 
  organizationMeController.getRoles
);

/**
 * @swagger
 * /api/organizations/me/roles:
 *   post:
 *     summary: Create a new custom role within the organization
 *     tags: [Organizations]
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
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         displayName:
 *                           type: string
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 */
router.post('/roles', 
  requireOrgAdmin, 
  authorize([PERMISSIONS.ROLE.CREATE]), 
  organizationMeController.createRole
);

/**
 * @swagger
 * /api/organizations/me/roles/{roleId}:
 *   patch:
 *     summary: Update an existing custom role definition
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
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
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         displayName:
 *                           type: string
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 */
router.patch('/roles/:roleId', 
  requireOrgAdmin, 
  authorize([PERMISSIONS.ROLE.EDIT]), 
  organizationMeController.updateRole
);

/**
 * @swagger
 * /api/organizations/me/roles/{roleId}:
 *   delete:
 *     summary: Delete a custom role
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
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
 */
router.delete('/roles/:roleId', 
  requireOrgAdmin, 
  authorize([PERMISSIONS.ROLE.DELETE]), 
  organizationMeController.deleteRole
);

/**
 * @swagger
 * /api/organizations/me/permissions:
 *   get:
 *     summary: Get the permission matrix available for roles within the organization
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
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
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           actions:
 *                             type: array
 *                             items:
 *                               type: string
 *                           description:
 *                             type: string
 */
router.get('/permissions', 
  authorize([PERMISSIONS.ROLE.VIEW]), 
  organizationMeController.getPermissions
);

// Examples of organization type-specific routes
// These would be added for functionality specific to client or expert organizations

// Client-only routes for program management
router.get('/programs', 
  authenticate, 
  restrictToOrgType(['client']), 
  authorize([PERMISSIONS.PROGRAM.VIEW]),
  (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'This is a client-only endpoint for programs'
      }
    });
  }
);

// Expert-only routes for marketplace management
router.get('/marketplace/listings', 
  authenticate, 
  restrictToOrgType(['expert']), 
  authorize([PERMISSIONS.MARKETPLACE.MANAGE_LISTINGS]),
  (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'This is an expert-only endpoint for marketplace'
      }
    });
  }
);

export { router as organizationMeRoutes }; 