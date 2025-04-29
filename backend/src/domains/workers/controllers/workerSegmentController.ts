import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import prisma from '../../../../prisma/prisma';
import { WorkerSegmentService } from '../services/workerSegmentService';

// Initialize service
const workerSegmentService = new WorkerSegmentService(prisma);

/**
 * Get segments for a specific worker
 * @route GET /api/workers/:workerId/segments
 */
export const getWorkerSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workerId } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Get segments the worker belongs to
    const segments = await workerSegmentService.getWorkerSegments(workerId, organizationId);
    
    res.status(200).json({
      status: 'success',
      data: { segments }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reconcile segment memberships for a specific worker
 * @route POST /api/workers/:workerId/segments/reconcile
 */
export const reconcileWorkerSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workerId } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Reconcile worker's segment memberships
    const result = await workerSegmentService.reconcileWorkerSegments(workerId, organizationId);
    
    res.status(200).json({
      status: 'success',
      data: result,
      message: 'Worker segment memberships reconciled successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reconcile segment memberships for multiple workers
 * @route POST /api/workers/segments/bulk-reconcile
 */
export const bulkReconcileWorkerSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workerIds } = req.body;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Process bulk reconciliation
    const result = await workerSegmentService.bulkReconcileWorkerSegments(workerIds, organizationId);
    
    res.status(200).json({
      status: 'success',
      data: result,
      message: `Processed segment reconciliation for ${result.successCount} out of ${result.totalProcessed} workers`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if a worker is in a specific segment and why
 * @route GET /api/workers/:workerId/segments/:segmentId
 */
export const checkWorkerInSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workerId, segmentId } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Check if worker is in segment
    const membershipStatus = await workerSegmentService.checkWorkerInSegment(workerId, segmentId, organizationId);
    
    res.status(200).json({
      status: 'success',
      data: membershipStatus
    });
  } catch (error) {
    next(error);
  }
}; 