import { Request, Response, NextFunction } from 'express';
import { SegmentService } from '../services/segment.service';
import { WorkerService } from '../../workers/services/worker.service';
import { AppError } from '../../../common/middleware/errorHandler';
import { SegmentType } from '../models/segment.model';
import { SegmentSyncSimpleService } from '../services/segment-sync.service';
import prisma from '../../../../prisma/prisma';

// Initialize services
const workerService = new WorkerService(prisma);
const segmentService = new SegmentService(prisma, workerService);
const segmentSyncService = new SegmentSyncSimpleService(prisma);

/**
 * Get all segments
 * @route GET /api/segments
 */
export const getSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    const { page = 1, limit = 10, type } = req.query;
    
    const filter = type ? { type: type as SegmentType } : undefined;
    const pagination = {
      page: parseInt(page as string),
      pageSize: parseInt(limit as string)
    };
    
    const { segments, total } = await segmentService.listSegments(
      organizationId,
      { filter, pagination }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        segments,
        pagination: {
          total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: Math.ceil(total / pagination.pageSize)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific segment by ID
 * @route GET /api/segments/:id
 */
export const getSegmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: { segment }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new segment
 * @route POST /api/segments
 */
export const createSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, type, ruleDefinition } = req.body;
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    const segment = await segmentService.createSegment({
      name,
      description,
      type,
      ruleDefinition,
      organizationId,
      createdById: userId
    });
    
    res.status(201).json({
      status: 'success',
      data: { segment }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a segment
 * @route PATCH /api/segments/:id
 */
export const updateSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, type, ruleDefinition } = req.body;
    const userId = req.user?.id;
    
    // First get the segment to verify access
    const existingSegment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (existingSegment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    const segment = await segmentService.updateSegment(id, {
      name,
      description,
      type,
      ruleDefinition,
      updatedById: userId
    });
    
    res.status(200).json({
      status: 'success',
      data: { segment }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a segment
 * @route DELETE /api/segments/:id
 */
export const deleteSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // First get the segment to verify access
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    await segmentService.deleteSegment(id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get workers in a segment
 * @route GET /api/segments/:id/workers
 */
export const getSegmentWorkers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // First get the segment to verify access
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    const pagination = {
      page: parseInt(page as string),
      pageSize: parseInt(limit as string)
    };
    
    const { workers, total } = await segmentService.getSegmentWorkers(id, pagination);
    
    res.status(200).json({
      status: 'success',
      data: {
        workers,
        pagination: {
          total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: Math.ceil(total / pagination.pageSize)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add workers to a static segment
 * @route POST /api/segments/:id/workers
 */
export const addWorkersToSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { workerIds } = req.body;
    
    if (!Array.isArray(workerIds)) {
      throw new AppError('workerIds must be an array', 400);
    }
    
    // First get the segment to verify access
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    await segmentService.addWorkersToSegment(id, workerIds);
    
    res.status(200).json({
      status: 'success',
      message: `${workerIds.length} worker(s) added to segment`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove workers from a static segment
 * @route DELETE /api/segments/:id/workers/:workerId
 */
export const removeWorkerFromSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, workerId } = req.params;
    
    // First get the segment to verify access
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    await segmentService.removeWorkersFromSegment(id, [workerId]);
    
    res.status(200).json({
      status: 'success',
      message: 'Worker removed from segment'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Manually trigger sync for a rule-based segment
 * @route POST /api/segments/:id/sync
 */
export const syncSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // First get the segment to verify access
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    // Use the simplified sync service directly
    const syncResult = await segmentSyncService.synchronizeSegment(id);
    
    res.status(200).json({
      status: 'success',
      data: syncResult,
      message: 'Segment synchronized successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get segment status including membership statistics
 * @route GET /api/segments/:id/status
 */
export const getSegmentSyncStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // First get the segment to verify access
    const segment = await segmentService.getSegmentById(id);
    
    // Check if segment belongs to the user's organization
    if (segment.organizationId !== req.user?.organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    // Get sync jobs for this segment
    const syncJobs = await segmentService.getSegmentSyncStatus(id);
    
    // Get membership statistics
    const membershipStats = await prisma.segmentMembership.groupBy({
      by: ['segmentId'],
      where: { segmentId: id },
      _count: { workerId: true }
    });
    
    const totalMembers = membershipStats[0]?._count?.workerId || 0;
    
    res.status(200).json({
      status: 'success',
      data: {
        segment: {
          id: segment.id,
          name: segment.name,
          type: segment.type,
          lastSyncAt: segment.lastSyncAt,
        },
        syncJobs: syncJobs.recentJobs,
        membershipStats: syncJobs.membershipStats,
        totalMembers,
        lastRuleVersion: segment.ruleDefinition ? JSON.stringify(segment.ruleDefinition).length : 0
      }
    });
  } catch (error) {
    next(error);
  }
}; 