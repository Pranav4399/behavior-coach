import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';

const authService = new AuthService();

export class AuthController {
  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *               name:
   *                 type: string
   *               organizationId:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Invalid input data
   *       409:
   *         description: User already exists
   */
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, organizationId } = req.body;

      // Validate input
      if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
      }

      if (password.length < 6) {
        return next(new AppError('Password must be at least 6 characters', 400));
      }

      // Create user
      const result = await authService.signup({
        email,
        password,
        name,
        organizationId
      });

      // Return success response
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            organizationId: result.user.organizationId
          },
          token: result.token
        }
      });
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return next(new AppError(error.message, 409));
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login with email and password
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
      }

      // Login user
      const result = await authService.login(email, password);

      // Return success response
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            organizationId: result.user.organizationId
          },
          token: result.token
        }
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return next(new AppError('Invalid email or password', 401));
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile data
   *       401:
   *         description: Not authenticated
   */
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('You are not logged in', 401));
      }

      const user = await authService.getUserById(req.user.id);

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
} 