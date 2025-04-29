import { PrismaClient } from '@prisma/client';
import { WorkerRepository } from '../repositories/worker.repository';
import { SegmentService } from '../../segments/services/segment.service';
import { AppError } from '../../../common/middleware/errorHandler';

export class WorkerSegmentService {
  private workerRepository: WorkerRepository;
  private segmentService: SegmentService;
  
  constructor(prisma: PrismaClient) {
    this.workerRepository = new WorkerRepository(prisma);
    this.segmentService = new SegmentService(prisma, this.workerRepository);
  }

  /**
   * Get all segments for a worker
   */
  async getWorkerSegments(workerId: string, organizationId: string): Promise<any[]> {
    // Verify worker exists and belongs to the organization
    const worker = await this.workerRepository.findById(workerId);
    
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    if (worker.organizationId !== organizationId) {
      throw new AppError('Worker not found or access denied', 404);
    }
    
    // Get segments the worker belongs to
    return this.segmentService.getWorkerSegments(workerId);
  }

  /**
   * Reconcile segment memberships for a worker
   */
  async reconcileWorkerSegments(workerId: string, organizationId: string): Promise<{
    addedToSegments: string[];
    removedFromSegments: string[];
  }> {
    // Verify worker exists and belongs to the organization
    const worker = await this.workerRepository.findById(workerId);
    
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    if (worker.organizationId !== organizationId) {
      throw new AppError('Worker not found or access denied', 404);
    }
    
    // Reconcile worker's segment memberships
    return this.segmentService.reconcileWorkerSegments(workerId, organizationId);
  }

  /**
   * Check if a worker is in a specific segment and why
   */
  async checkWorkerInSegment(workerId: string, segmentId: string, organizationId: string): Promise<{
    isInSegment: boolean;
    matchesRules: boolean;
    reason: string | null;
  }> {
    // Verify worker exists and belongs to the organization
    const worker = await this.workerRepository.findById(workerId);
    
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    if (worker.organizationId !== organizationId) {
      throw new AppError('Worker not found or access denied', 404);
    }
    
    // Get segment to verify access
    const segment = await this.segmentService.getSegmentById(segmentId);
    
    if (segment.organizationId !== organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    // Check if worker is in segment
    return this.segmentService.checkWorkerInSegment(segmentId, workerId);
  }

  /**
   * Bulk reconcile segment memberships for multiple workers
   */
  async bulkReconcileWorkerSegments(workerIds: string[], organizationId: string): Promise<{
    results: Array<{
      workerId: string;
      addedToSegments: string[];
      removedFromSegments: string[];
    }>;
    errors: Array<{
      workerId: string;
      error: string;
    }>;
    totalProcessed: number;
    successCount: number;
    failureCount: number;
  }> {
    if (!Array.isArray(workerIds) || workerIds.length === 0) {
      throw new AppError('Worker IDs must be provided as a non-empty array', 400);
    }
    
    const results: Array<any> = [];
    const errors: Array<{workerId: string; error: string}> = [];
    
    // Process each worker in the batch
    for (const workerId of workerIds) {
      try {
        // Verify worker exists and belongs to the organization
        const worker = await this.workerRepository.findById(workerId);
        
        if (!worker || worker.organizationId !== organizationId) {
          errors.push({
            workerId,
            error: 'Worker not found or access denied'
          });
          continue;
        }
        
        // Reconcile worker's segment memberships
        const result = await this.segmentService.reconcileWorkerSegments(workerId, organizationId);
        results.push({
          workerId,
          ...result
        });
      } catch (error) {
        errors.push({
          workerId,
          error: error instanceof AppError ? error.message : 'An unexpected error occurred'
        });
      }
    }
    
    return {
      results,
      errors,
      totalProcessed: workerIds.length,
      successCount: results.length,
      failureCount: errors.length
    };
  }
} 