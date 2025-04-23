import { AppError } from '../../../common/middleware/errorHandler';

export class Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  organizationId: string;
  organizationName?: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
  description?: string;

  constructor(data: {
    id: string;
    name: string;
    displayName: string;
    permissions: any; // Prisma stores this as JSON
    organizationId: string;
    organizationName?: string;
    createdAt: Date;
    updatedAt: Date;
    isDefault?: boolean;
    description?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.displayName = data.displayName;
    this.permissions = Array.isArray(data.permissions) ? data.permissions : [];
    this.organizationId = data.organizationId;
    this.organizationName = data.organizationName;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isDefault = data.isDefault;
    this.description = data.description;
  }

  validate(): void {
    if (!this.name || this.name.trim() === '') {
      throw new AppError('Role name is required', 400);
    }

    if (!this.displayName || this.displayName.trim() === '') {
      throw new AppError('Role display name is required', 400);
    }

    if (!Array.isArray(this.permissions)) {
      throw new AppError('Permissions must be an array', 400);
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      description: this.description,
      permissions: this.permissions,
      organizationId: this.organizationId,
      organizationName: this.organizationName,
      isDefault: this.isDefault,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 