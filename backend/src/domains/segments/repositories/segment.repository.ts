import { PrismaClient } from '@prisma/client';
import { Segment, SegmentProps, SegmentFilterOptions, SegmentType } from '../models/segment.model';
import { AppError } from '../../../common/middleware/errorHandler';

export class SegmentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Find a segment by ID
   */
  async findById(id: string): Promise<Segment | null> {
    const segment = await this.prisma.segment.findUnique({
      where: { id }
    });

    if (!segment) {
      return null;
    }

    return this.mapToSegmentClass(segment);
  }

  /**
   * Find segments by organization ID with optional filtering
   */
  async findByOrganizationId(
    organizationId: string,
    filter?: SegmentFilterOptions,
    pagination?: { page: number; pageSize: number }
  ): Promise<{ segments: Segment[]; total: number }> {
    const where: any = { organizationId };

    // Apply filters if provided
    if (filter) {
      if (filter.name) {
        where.name = { contains: filter.name, mode: 'insensitive' };
      }
      if (filter.type) {
        where.type = filter.type;
      }
      if (filter.createdById) {
        where.createdById = filter.createdById;
      }
      if (filter.updatedById) {
        where.updatedById = filter.updatedById;
      }
    }

    // Count total matching segments (for pagination)
    const total = await this.prisma.segment.count({ where });

    // Fetch segments with pagination
    const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
    const take = pagination ? pagination.pageSize : undefined;

    const segments = await this.prisma.segment.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: 'desc' }
    });

    // Map to domain model
    const mappedSegments = segments.map((segment: any) => this.mapToSegmentClass(segment));

    return { segments: mappedSegments, total };
  }

  /**
   * Create a new segment
   */
  async create(segmentProps: SegmentProps): Promise<Segment> {
    try {
      const segment = new Segment(segmentProps);
      segment.validate();

      const createdSegment = await this.prisma.segment.create({
        data: {
          name: segment.name,
          description: segment.description,
          type: segment.type as string,
          ruleDefinition: segment.ruleDefinition,
          workerCount: segment.workerCount,
          lastSyncAt: segment.lastSyncAt,
          organizationId: segment.organizationId,
          createdById: segment.createdById,
          updatedById: segment.updatedById
        }
      });

      return this.mapToSegmentClass(createdSegment);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create segment', 500);
    }
  }

  /**
   * Update an existing segment
   */
  async update(id: string, data: Partial<SegmentProps>): Promise<Segment> {
    try {
      // Fetch the current segment to apply updates
      const existingSegment = await this.findById(id);
      
      if (!existingSegment) {
        throw new AppError('Segment not found', 404);
      }

      // Apply updates to the segment
      existingSegment.update(data);

      // Save to database
      const updatedSegment = await this.prisma.segment.update({
        where: { id },
        data: {
          name: existingSegment.name,
          description: existingSegment.description,
          type: existingSegment.type as string,
          ruleDefinition: existingSegment.ruleDefinition,
          workerCount: existingSegment.workerCount,
          lastSyncAt: existingSegment.lastSyncAt,
          updatedById: existingSegment.updatedById,
          updatedAt: new Date()
        }
      });

      return this.mapToSegmentClass(updatedSegment);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update segment', 500);
    }
  }

  /**
   * Delete a segment
   */
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.segment.delete({
        where: { id }
      });
    } catch (error) {
      throw new AppError('Failed to delete segment', 500);
    }
  }

  /**
   * Get segments that a worker belongs to
   */
  async getSegmentsForWorker(workerId: string): Promise<Segment[]> {
    const memberships = await this.prisma.segmentMembership.findMany({
      where: { workerId },
      include: { segment: true }
    });

    return memberships.map((membership: any) => this.mapToSegmentClass(membership.segment));
  }

  /**
   * Add a worker to a segment
   */
  async addWorkerToSegment(
    segmentId: string, 
    workerId: string, 
    options?: { ruleMatch?: boolean; ruleMatchReason?: string | null }
  ): Promise<void> {
    try {
      await this.prisma.segmentMembership.create({
        data: {
          segmentId,
          workerId,
          ruleMatch: options?.ruleMatch || false,
          ruleMatchReason: options?.ruleMatchReason || null
        }
      });

      // Update the worker count for the segment
      await this.prisma.segment.update({
        where: { id: segmentId },
        data: { workerCount: { increment: 1 } }
      });
    } catch (error: any) {
      if (error.code === 'P2002') { // Unique constraint violation
        // Worker is already in the segment, ignore
        return;
      }
      throw new AppError('Failed to add worker to segment', 500);
    }
  }

  /**
   * Remove a worker from a segment
   */
  async removeWorkerFromSegment(segmentId: string, workerId: string): Promise<void> {
    try {
      await this.prisma.segmentMembership.deleteMany({
        where: {
          segmentId,
          workerId
        }
      });

      // Update the worker count for the segment
      await this.prisma.segment.update({
        where: { id: segmentId },
        data: { workerCount: { decrement: 1 } }
      });
    } catch (error) {
      throw new AppError('Failed to remove worker from segment', 500);
    }
  }

  /**
   * Get all workers in a segment
   */
  async getWorkersInSegment(
    segmentId: string,
    pagination?: { page: number; pageSize: number }
  ): Promise<{ workerIds: string[]; total: number }> {
    // First, verify the segment exists
    const segmentExists = await this.prisma.segment.findUnique({
      where: { id: segmentId },
      select: { id: true }
    });

    if (!segmentExists) {
      throw new AppError('Segment not found', 404);
    }

    // Count total workers
    const total = await this.prisma.segmentMembership.count({
      where: { segmentId }
    });

    // Fetch with pagination if needed
    const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
    const take = pagination ? pagination.pageSize : undefined;

    const memberships = await this.prisma.segmentMembership.findMany({
      where: { segmentId },
      select: { workerId: true },
      skip,
      take
    });

    return {
      workerIds: memberships.map((m: any) => m.workerId),
      total
    };
  }

  /**
   * Create a sync job for a segment
   */
  async createSyncJob(segmentId: string): Promise<string> {
    try {
      const syncJob = await this.prisma.segmentSyncJob.create({
        data: {
          segmentId,
          status: 'pending'
        }
      });

      return syncJob.id;
    } catch (error) {
      throw new AppError('Failed to create sync job', 500);
    }
  }

  /**
   * Update a sync job's status
   */
  async updateSyncJob(
    jobId: string,
    data: {
      status: 'pending' | 'processing' | 'completed' | 'failed';
      processedCount?: number;
      matchCount?: number;
      errorMessage?: string | null;
      completedAt?: Date | null;
    }
  ): Promise<void> {
    try {
      await this.prisma.segmentSyncJob.update({
        where: { id: jobId },
        data: {
          status: data.status,
          processedCount: data.processedCount,
          matchCount: data.matchCount,
          errorMessage: data.errorMessage,
          completedAt: data.completedAt,
          updatedAt: new Date()
        }
      });

      // If the job completed successfully, update the segment's lastSyncAt
      if (data.status === 'completed') {
        const syncJob = await this.prisma.segmentSyncJob.findUnique({
          where: { id: jobId },
          select: { segmentId: true }
        });

        if (syncJob) {
          await this.prisma.segment.update({
            where: { id: syncJob.segmentId },
            data: { lastSyncAt: new Date() }
          });
        }
      }
    } catch (error) {
      throw new AppError('Failed to update sync job', 500);
    }
  }

  /**
   * Map database segment to domain model
   */
  private mapToSegmentClass(segmentData: any): Segment {
    return new Segment({
      id: segmentData.id,
      name: segmentData.name,
      description: segmentData.description,
      type: segmentData.type as SegmentType,
      ruleDefinition: segmentData.ruleDefinition,
      workerCount: segmentData.workerCount,
      lastSyncAt: segmentData.lastSyncAt,
      organizationId: segmentData.organizationId,
      createdById: segmentData.createdById,
      updatedById: segmentData.updatedById,
      createdAt: segmentData.createdAt,
      updatedAt: segmentData.updatedAt
    });
  }
} 