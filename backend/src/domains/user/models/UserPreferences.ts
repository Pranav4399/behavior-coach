import { AppError } from '../../../common/middleware/errorHandler';

export interface UserPreferencesProps {
  id: string;
  userId: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  timezone?: string;
  dateFormat?: string;
  customSettings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  timezone: string;
  dateFormat: string;
  customSettings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: UserPreferencesProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.theme = props.theme || 'system';
    this.language = props.language || 'en';
    this.emailNotifications = props.emailNotifications ?? true;
    this.pushNotifications = props.pushNotifications ?? true;
    this.timezone = props.timezone || 'UTC';
    this.dateFormat = props.dateFormat || 'YYYY-MM-DD';
    this.customSettings = props.customSettings || {};
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Validate user preferences data
   * @throws AppError if validation fails
   */
  validate(): void {
    if (!this.userId) {
      throw new AppError('User ID is required for preferences', 400);
    }

    if (this.theme && !['light', 'dark', 'system'].includes(this.theme)) {
      throw new AppError('Invalid theme value', 400);
    }
  }

  /**
   * Update user preferences with new data
   */
  update(data: Partial<UserPreferencesProps>): void {
    if (data.theme) {
      if (!['light', 'dark', 'system'].includes(data.theme)) {
        throw new AppError('Invalid theme value', 400);
      }
      this.theme = data.theme;
    }

    if (data.language !== undefined) {
      this.language = data.language;
    }

    if (data.emailNotifications !== undefined) {
      this.emailNotifications = data.emailNotifications;
    }

    if (data.pushNotifications !== undefined) {
      this.pushNotifications = data.pushNotifications;
    }

    if (data.timezone) {
      this.timezone = data.timezone;
    }

    if (data.dateFormat) {
      this.dateFormat = data.dateFormat;
    }

    if (data.customSettings) {
      this.customSettings = { ...this.customSettings, ...data.customSettings };
    }

    this.updatedAt = new Date();
  }
} 