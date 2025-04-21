import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AppError } from '../../../common/middleware/errorHandler';

const userService = new UserService();

export class UserController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users for the current organization
   *     tags: [Users]
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
   *           default: 20
   *         description: Number of items per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term for name or email
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *         description: Filter by role
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, inactive, pending]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: A list of users
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.organizationId) {
        return next(new AppError('Unauthorized: Organization access required', 403));
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as string;
      const status = req.query.status as 'active' | 'inactive' | 'pending';

      const result = await userService.getAllUsers(
        req.user.organizationId,
        page,
        limit,
        { search, role, status }
      );

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{userId}:
   *   get:
   *     summary: Get a specific user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: User details
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.organizationId) {
        return next(new AppError('Unauthorized: Organization access required', 403));
      }

      const userId = req.params.userId;
      const user = await userService.getUserById(userId, req.user.organizationId);

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Invite a new user to the organization
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - role
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               name:
   *                 type: string
   *               role:
   *                 type: string
   *     responses:
   *       201:
   *         description: User invited successfully
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       409:
   *         description: User already exists
   */
  async inviteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.organizationId) {
        return next(new AppError('Unauthorized: Organization access required', 403));
      }

      const { email, name, role } = req.body;

      if (!email) {
        return next(new AppError('Email is required', 400));
      }

      if (!role) {
        return next(new AppError('Role is required', 400));
      }

      const user = await userService.inviteUser({
        email,
        name,
        role,
        organizationId: req.user.organizationId
      });

      res.status(201).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{userId}:
   *   patch:
   *     summary: Update a user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               role:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [active, inactive, pending]
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.organizationId) {
        return next(new AppError('Unauthorized: Organization access required', 403));
      }

      const userId = req.params.userId;
      const { name, role, status } = req.body;

      const user = await userService.updateUser(
        userId,
        { name, role, status },
        req.user.organizationId
      );

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{userId}:
   *   delete:
   *     summary: Delete a user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.organizationId) {
        return next(new AppError('Unauthorized: Organization access required', 403));
      }

      const userId = req.params.userId;
      
      // Prevent deletion of self
      if (userId === req.user.id) {
        return next(new AppError('You cannot delete your own account', 400));
      }

      await userService.deleteUser(userId, req.user.organizationId);

      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{userId}/resend-invite:
   *   post:
   *     summary: Resend invitation to a pending user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: Invitation resent successfully
   *       400:
   *         description: Invalid operation
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  async resendInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.organizationId) {
        return next(new AppError('Unauthorized: Organization access required', 403));
      }

      const userId = req.params.userId;
      await userService.resendInvitation(userId, req.user.organizationId);

      res.status(200).json({
        status: 'success',
        message: 'Invitation resent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{userId}/preferences:
   *   get:
   *     summary: Get user preferences
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: User preferences
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  async getUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Unauthorized', 401));
      }

      const userId = req.params.userId;
      
      // Users can only access their own preferences, or admins can access any
      if (userId !== req.user.id && !req.user.permissions.includes('user:manage')) {
        return next(new AppError('Forbidden: You can only access your own preferences', 403));
      }

      const organizationId = req.user.permissions.includes('user:manage') ? req.user.organizationId : undefined;
      const preferences = await userService.getUserPreferences(userId, organizationId);

      res.status(200).json({
        status: 'success',
        data: { preferences }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{userId}/preferences:
   *   patch:
   *     summary: Update user preferences
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               theme:
   *                 type: string
   *                 enum: [light, dark, system]
   *               language:
   *                 type: string
   *               emailNotifications:
   *                 type: boolean
   *               pushNotifications:
   *                 type: boolean
   *               timezone:
   *                 type: string
   *               dateFormat:
   *                 type: string
   *               customSettings:
   *                 type: object
   *     responses:
   *       200:
   *         description: Preferences updated successfully
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  async updateUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Unauthorized', 401));
      }

      const userId = req.params.userId;
      
      // Users can only update their own preferences, or admins can update any
      if (userId !== req.user.id && !req.user.permissions.includes('user:manage')) {
        return next(new AppError('Forbidden: You can only update your own preferences', 403));
      }

      const { 
        theme, 
        language, 
        emailNotifications, 
        pushNotifications, 
        timezone, 
        dateFormat, 
        customSettings 
      } = req.body;

      const organizationId = req.user.permissions.includes('user:manage') ? req.user.organizationId : undefined;
      const preferences = await userService.updateUserPreferences(
        userId,
        { 
          theme, 
          language, 
          emailNotifications, 
          pushNotifications, 
          timezone, 
          dateFormat, 
          customSettings 
        },
        organizationId
      );

      res.status(200).json({
        status: 'success',
        data: { preferences }
      });
    } catch (error) {
      next(error);
    }
  }
} 