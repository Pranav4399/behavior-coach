import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import { AuthService } from '../services/authService';
import { generateToken, verifyToken } from '../utils/jwt';

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

      // Set token as HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });

      // Return success response
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            roleId: result.user.roleId,
            organizationId: result.user.organizationId
          }
          // Don't include token in response body anymore
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

      // Set token as HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });

      // Return success response
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            roleId: result.user.roleId,
            organizationId: result.user.organizationId
          }
          // Don't include token in response body anymore
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

  /**
   * @swagger
   * /api/auth/permissions:
   *   get:
   *     summary: Get current user permissions
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User permissions
   *       401:
   *         description: Not authenticated
   */
  async getUserPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('You are not logged in', 401));
      }

      const permissions = await authService.getUserPermissions(req.user.id);

      res.status(200).json({
        status: 'success',
        data: {
          permissions
        }
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout the current user
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Logout successful
   */
  async logout(req: Request, res: Response) {
    // Clear the auth cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  }

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh the authentication token
   *     tags: [Auth]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       401:
   *         description: Not authenticated
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Get token from cookie
      const token = req.cookies?.auth_token;
      
      if (!token) {
        return next(new AppError('Authentication required. Please log in.', 401));
      }
      
      try {
        // Verify the existing token
        const decoded = verifyToken(token);
        
        // Generate a new token
        const newToken = generateToken(decoded.id);
        
        // Set the new token as a cookie
        res.cookie('auth_token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          path: '/'
        });
        
        // Return success response
        res.status(200).json({
          status: 'success',
          message: 'Token refreshed successfully'
        });
      } catch (error) {
        // If token verification fails, clear the cookie and return unauthorized
        res.clearCookie('auth_token');
        return next(new AppError('Invalid or expired token. Please log in again.', 401));
      }
    } catch (error) {
      next(error);
    }
  }
} 