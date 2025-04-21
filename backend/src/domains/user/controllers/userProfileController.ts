import { Request, Response } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import { UserService } from '../services/userService';

export class UserProfileController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get user profile for the authenticated user
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const userProfile = await this.userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: userProfile,
    });
  };

  /**
   * Update user profile for the authenticated user
   */
  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const profileData = req.body;
    const updatedProfile = await this.userService.updateUserProfile(userId, profileData);

    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
    });
  };

  /**
   * Get profile for a specific user (admin/supervisor only)
   */
  public getUserProfileById = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    
    // Check if user has permission to view other profiles
    if (!req.user?.permissions?.includes('user:view')) {
      throw new AppError('You do not have permission to view this profile', 403);
    }

    const userProfile = await this.userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: userProfile,
    });
  };
} 