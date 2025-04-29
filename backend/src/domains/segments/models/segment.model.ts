import { AppError } from '../../../common/middleware/errorHandler';

// Using string literals for enums since we don't have direct access to Prisma enums
export type SegmentType = 'static' | 'rule_based';
export type SegmentSyncStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Props interface for Segment constructor parameters
export interface SegmentProps {
  id?: string;
  name: string;
  description?: string | null;
  type: SegmentType;
  ruleDefinition?: any | null; // Will be replaced with typed rule definition
  workerCount?: number;
  lastSyncAt?: Date | null;
  organizationId: string;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Core Segment class
export class Segment {
  id: string;
  name: string;
  description: string | null;
  type: SegmentType;
  ruleDefinition: any | null; // Will be replaced with typed rule definition
  workerCount: number;
  lastSyncAt: Date | null;
  organizationId: string;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: SegmentProps) {
    this.id = props.id || '';
    this.name = props.name;
    this.description = props.description || null;
    this.type = props.type;
    this.ruleDefinition = props.ruleDefinition || null;
    this.workerCount = props.workerCount || 0;
    this.lastSyncAt = props.lastSyncAt || null;
    this.organizationId = props.organizationId;
    this.createdById = props.createdById || null;
    this.updatedById = props.updatedById || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  validate(): void {
    if (!this.name || this.name.trim() === '') {
      throw new AppError('Segment name is required', 400);
    }

    if (!this.type) {
      throw new AppError('Segment type is required', 400);
    }
    
    if (this.type === 'rule_based' && !this.ruleDefinition) {
      throw new AppError('Rule definition is required for rule-based segments', 400);
    }

    if (!this.organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
  }

  update(data: Partial<SegmentProps>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.type !== undefined) this.type = data.type;
    if (data.ruleDefinition !== undefined) this.ruleDefinition = data.ruleDefinition;
    if (data.workerCount !== undefined) this.workerCount = data.workerCount;
    if (data.lastSyncAt !== undefined) this.lastSyncAt = data.lastSyncAt;
    if (data.updatedById !== undefined) this.updatedById = data.updatedById;
    
    this.updatedAt = new Date();
    
    this.validate();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      ruleDefinition: this.ruleDefinition,
      workerCount: this.workerCount,
      lastSyncAt: this.lastSyncAt,
      organizationId: this.organizationId,
      createdById: this.createdById,
      updatedById: this.updatedById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// SegmentMembership models
export interface SegmentMembershipProps {
  id?: string;
  workerId: string;
  segmentId: string;
  ruleMatch?: boolean;
  ruleMatchReason?: string | null;
  addedAt?: Date;
}

export class SegmentMembership {
  id: string;
  workerId: string;
  segmentId: string;
  ruleMatch: boolean;
  ruleMatchReason: string | null;
  addedAt: Date;

  constructor(props: SegmentMembershipProps) {
    this.id = props.id || '';
    this.workerId = props.workerId;
    this.segmentId = props.segmentId;
    this.ruleMatch = props.ruleMatch || false;
    this.ruleMatchReason = props.ruleMatchReason || null;
    this.addedAt = props.addedAt || new Date();
  }

  validate(): void {
    if (!this.workerId) {
      throw new AppError('Worker ID is required', 400);
    }

    if (!this.segmentId) {
      throw new AppError('Segment ID is required', 400);
    }
  }

  toJSON() {
    return {
      id: this.id,
      workerId: this.workerId,
      segmentId: this.segmentId,
      ruleMatch: this.ruleMatch,
      ruleMatchReason: this.ruleMatchReason,
      addedAt: this.addedAt
    };
  }
}

// Segment Sync Job models
export interface SegmentSyncJobProps {
  id?: string;
  segmentId: string;
  status?: SegmentSyncStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  processedCount?: number;
  matchCount?: number;
  errorMessage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SegmentSyncJob {
  id: string;
  segmentId: string;
  status: SegmentSyncStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  processedCount: number;
  matchCount: number;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: SegmentSyncJobProps) {
    this.id = props.id || '';
    this.segmentId = props.segmentId;
    this.status = props.status || 'pending';
    this.startedAt = props.startedAt || null;
    this.completedAt = props.completedAt || null;
    this.processedCount = props.processedCount || 0;
    this.matchCount = props.matchCount || 0;
    this.errorMessage = props.errorMessage || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  validate(): void {
    if (!this.segmentId) {
      throw new AppError('Segment ID is required', 400);
    }
  }

  start(): void {
    this.status = 'processing';
    this.startedAt = new Date();
    this.updatedAt = new Date();
  }

  complete(processedCount: number, matchCount: number): void {
    this.status = 'completed';
    this.completedAt = new Date();
    this.processedCount = processedCount;
    this.matchCount = matchCount;
    this.updatedAt = new Date();
  }

  fail(errorMessage: string): void {
    this.status = 'failed';
    this.completedAt = new Date();
    this.errorMessage = errorMessage;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      segmentId: this.segmentId,
      status: this.status,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      processedCount: this.processedCount,
      matchCount: this.matchCount,
      errorMessage: this.errorMessage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Helper types for filtering segments
export interface SegmentFilterOptions {
  name?: string;
  type?: SegmentType;
  createdById?: string;
  updatedById?: string;
} 