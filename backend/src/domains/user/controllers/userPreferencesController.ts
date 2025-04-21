import { Request, Response } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import { UserService } from '../services/userService';

export class UserPreferencesController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get user preferences for a specific user
   */
  public getUserPreferences = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const currentUserId = req.user?.id;
    const organizationId = req.user?.organizationId;

    if (!currentUserId || !organizationId) {
      throw new AppError('User not authenticated', 401);
    }

    // Only allow users to access their own preferences or admin/supervisor to access others
    if (userId !== currentUserId && !req.user?.permissions?.includes('user:view')) {
      throw new AppError('You do not have permission to view these preferences', 403);
    }

    const userPreferences = await this.userService.getUserPreferences(userId);

    res.status(200).json({
      success: true,
      data: userPreferences,
    });
  };

  /**
   * Update user preferences for a specific user
   */
  public updateUserPreferences = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const currentUserId = req.user?.id;
    const organizationId = req.user?.organizationId;
    const preferencesData = req.body;

    if (!currentUserId || !organizationId) {
      throw new AppError('User not authenticated', 401);
    }

    // Only allow users to update their own preferences or admin/supervisor to update others
    if (userId !== currentUserId && !req.user?.permissions?.includes('user:edit')) {
      throw new AppError('You do not have permission to update these preferences', 403);
    }

    const updatedPreferences = await this.userService.updateUserPreferences(
      userId,
      preferencesData
    );

    res.status(200).json({
      success: true,
      data: updatedPreferences,
      message: 'User preferences updated successfully',
    });
  };
} 