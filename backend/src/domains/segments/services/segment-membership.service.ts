import { PrismaClient } from '@prisma/client';
import { Worker } from '../../workers/models/worker.model';
import { WorkerService } from '../../workers/services/worker.service';
import { Segment, SegmentType } from '../models/segment.model';
import { SegmentRepository } from '../repositories/segment.repository';
import { RuleEngineService } from './rule-engine.service';
import { AppError } from '../../../common/middleware/errorHandler';

interface SyncOptions {
  fullSync?: boolean;
  batchSize?: number;
  specificWorkerIds?: string[];
}

interface SyncResult {
  syncJobId: string;
  processed: number;
  matched: number;
  added: number;
  removed: number;
  completed: boolean;
  error?: string;
}

interface MembershipStatus {
  workerId: string;
  workerName: string;
  isInSegment: boolean;
  matchesRules: boolean;
  reason: string | null;
  lastUpdated: Date;
}

// Define interface for sync job updates
interface SyncJobUpdateData {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedCount?: number;
  matchCount?: number;
  errorMessage?: string | null;
  completedAt?: Date | null;
  startedAt?: Date | null;
}

export class SegmentMembershipService {
  private segmentRepository: SegmentRepository;
  private workerService: WorkerService;
  private ruleEngineService: RuleEngineService;
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.segmentRepository = new SegmentRepository(prisma);
    this.workerService = new WorkerService(prisma);
    this.ruleEngineService = new RuleEngineService();
  }
  
  /**
   * Get the membership status of a specific worker in a segment
   */
  async getWorkerMembershipStatus(segmentId: string, workerId: string): Promise<MembershipStatus | null> {
    try {
      // Verify segment exists
      const segment = await this.segmentRepository.findById(segmentId);
      if (!segment) {
        throw new AppError('Segment not found', 404);
      }
      
      // Verify worker exists
      const worker = await this.workerService.getWorkerById(workerId);
      if (!worker) {
        throw new AppError('Worker not found', 404);
      }
      
      // Check if worker is in segment
      const membership = await this.prisma.segmentMembership.findUnique({
        where: {
          workerId_segmentId: {
            workerId,
            segmentId
          }
        }
      });
      
      const isInSegment = !!membership;
      
      // For rule-based segments, check if worker matches current rules
      let matchesRules = false;
      let reason: string | null = null;
      
      if (segment.type === 'rule_based' && segment.ruleDefinition) {
        try {
          const rule = this.ruleEngineService.parseRule(segment.ruleDefinition);
          const evaluation = this.ruleEngineService.evaluateRuleForWorker(rule, worker);
          matchesRules = evaluation.match;
          reason = evaluation.reason;
        } catch (error) {
          // If rule evaluation fails, consider it a non-match
          matchesRules = false;
          reason = 'Error evaluating rule';
        }
      }
      
      return {
        workerId,
        workerName: `${worker.firstName} ${worker.lastName}`,
        isInSegment,
        matchesRules,
        reason,
        lastUpdated: membership?.addedAt || new Date()
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to get membership status: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Synchronize a rule-based segment by evaluating rules for all eligible workers
   */
  async synchronizeSegment(segmentId: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      // Verify segment exists and is rule-based
      const segment = await this.segmentRepository.findById(segmentId);
      if (!segment) {
        throw new AppError('Segment not found', 404);
      }
      
      if (segment.type !== 'rule_based') {
        throw new AppError('Only rule-based segments can be synchronized', 400);
      }
      
      if (!segment.ruleDefinition) {
        throw new AppError('Segment has no rule definition', 400);
      }
      
      // Create a sync job
      const syncJobId = await this.segmentRepository.createSyncJob(segmentId);
      
      // Update job to processing status
      await this.updateSyncJobStatus(syncJobId, {
        status: 'processing',
        startedAt: new Date()
      });
      
      try {
        // Start the synchronization process
        const result = await this.performSync(segment, syncJobId, options);
        
        // Mark job as completed
        await this.updateSyncJobStatus(syncJobId, {
          status: 'completed',
          processedCount: result.processed,
          matchCount: result.matched,
          completedAt: new Date()
        });
        
        return {
          ...result,
          syncJobId,
          completed: true
        };
      } catch (error) {
        // Mark job as failed
        await this.updateSyncJobStatus(syncJobId, {
          status: 'failed',
          errorMessage: (error as Error).message,
          completedAt: new Date()
        });
        
        throw error;
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to synchronize segment: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Perform the actual synchronization logic
   */
  private async performSync(
    segment: Segment,
    syncJobId: string,
    options: SyncOptions
  ): Promise<SyncResult> {
    const batchSize = options.batchSize || 100;
    let processed = 0;
    let matched = 0;
    let added = 0;
    let removed = 0;
    
    // Parse the rule
    const rule = this.ruleEngineService.parseRule(segment.ruleDefinition);
    
    // Get workers to process
    let workersToProcess: Worker[];
    
    if (options.specificWorkerIds && options.specificWorkerIds.length > 0) {
      // Process only specific workers
      workersToProcess = [];
      for (const id of options.specificWorkerIds) {
        const worker = await this.workerService.getWorkerById(id);
        if (worker) {
          workersToProcess.push(worker);
        }
      }
    } else if (options.fullSync) {
      // Process all workers in the organization
      const { workers } = await this.workerService.getWorkers(segment.organizationId);
      workersToProcess = workers;
    } else {
      // Process workers not yet processed in this segment
      // This is a simplified approach - in a production system, 
      // you'd want a more sophisticated batch processing mechanism
      const { workers } = await this.workerService.getWorkersByOrganization(
        segment.organizationId,
        1, // page
        1000 // limit - for demo purposes
      );
      workersToProcess = workers;
    }
    
    // Get current segment memberships
    const currentMemberships = await this.prisma.segmentMembership.findMany({
      where: { segmentId: segment.id },
      select: { workerId: true }
    });
    
    const currentMemberSet = new Set(currentMemberships.map((m: { workerId: string }) => m.workerId));
    
    // Process in batches
    for (let i = 0; i < workersToProcess.length; i += batchSize) {
      const batch = workersToProcess.slice(i, i + batchSize);
      
      // Evaluate rules for the batch
      const { matches, matchDetails } = this.ruleEngineService.evaluateRuleForWorkerBatch(rule, batch);
      
      // Track workers to add and remove
      const workersToAdd: Array<{ workerId: string; reason: string | null }> = [];
      const workersToRemove: string[] = [];
      
      // Process each worker
      for (const worker of batch) {
        processed++;
        
        const isCurrentMember = currentMemberSet.has(worker.id);
        const shouldBeMember = matches.includes(worker.id);
        
        if (shouldBeMember) {
          matched++;
          if (!isCurrentMember) {
            // Worker should be added
            const matchDetail = matchDetails.find(d => d.workerId === worker.id);
            workersToAdd.push({
              workerId: worker.id,
              reason: matchDetail?.reason || null
            });
          }
        } else if (isCurrentMember) {
          // Worker should be removed
          workersToRemove.push(worker.id);
        }
      }
      
      // Add new members
      for (const { workerId, reason } of workersToAdd) {
        await this.segmentRepository.addWorkerToSegment(segment.id, workerId, {
          ruleMatch: true,
          ruleMatchReason: reason
        });
        added++;
      }
      
      // Remove members that no longer match
      for (const workerId of workersToRemove) {
        await this.segmentRepository.removeWorkerFromSegment(segment.id, workerId);
        removed++;
      }
      
      // Update sync job progress
      await this.segmentRepository.updateSyncJob(syncJobId, {
        status: 'processing',
        processedCount: processed,
        matchCount: matched
      });
    }
    
    return {
      syncJobId,
      processed,
      matched,
      added,
      removed,
      completed: true
    };
  }
  
  /**
   * Get the status of a sync job
   */
  async getSyncJobStatus(jobId: string): Promise<{
    id: string;
    segmentId: string;
    status: string;
    processedCount: number;
    matchCount: number;
    startedAt: Date | null;
    completedAt: Date | null;
    errorMessage: string | null;
  }> {
    const job = await this.prisma.segmentSyncJob.findUnique({
      where: { id: jobId }
    });
    
    if (!job) {
      throw new AppError('Sync job not found', 404);
    }
    
    return {
      id: job.id,
      segmentId: job.segmentId,
      status: job.status,
      processedCount: job.processedCount,
      matchCount: job.matchCount,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      errorMessage: job.errorMessage
    };
  }
  
  /**
   * Get all sync jobs for a segment
   */
  async getSegmentSyncJobs(segmentId: string, limit: number = 10): Promise<Array<{
    id: string;
    status: string;
    processedCount: number;
    matchCount: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
  }>> {
    const jobs = await this.prisma.segmentSyncJob.findMany({
      where: { segmentId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    
    return jobs.map((job: {
      id: string;
      status: string;
      processedCount: number;
      matchCount: number;
      startedAt: Date | null;
      completedAt: Date | null;
      createdAt: Date;
    }) => ({
      id: job.id,
      status: job.status,
      processedCount: job.processedCount,
      matchCount: job.matchCount,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      createdAt: job.createdAt
    }));
  }
  
  /**
   * Manually reconcile a worker's segment memberships
   * This is useful for debugging and fixing inconsistencies
   */
  async reconcileWorkerSegmentMemberships(
    workerId: string,
    organizationId: string
  ): Promise<{
    workerId: string;
    existingSegments: string[];
    addedToSegments: string[];
    removedFromSegments: string[];
  }> {
    // Get the worker
    const worker = await this.workerService.getWorkerById(workerId);
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    // Get all rule-based segments for the organization
    const { segments } = await this.segmentRepository.findByOrganizationId(
      organizationId,
      { type: 'rule_based' }
    );
    
    // Get current segment memberships
    const currentMemberships = await this.prisma.segmentMembership.findMany({
      where: { workerId },
      include: { segment: true }
    });
    
    const existingSegmentIds = currentMemberships.map((m: { segmentId: string }) => m.segmentId);
    const addedToSegments: string[] = [];
    const removedFromSegments: string[] = [];
    
    // Check each rule-based segment
    for (const segment of segments) {
      if (!segment.ruleDefinition) continue;
      
      try {
        // Parse and evaluate the rule
        const rule = this.ruleEngineService.parseRule(segment.ruleDefinition);
        const { match } = this.ruleEngineService.evaluateRuleForWorker(rule, worker);
        
        const isCurrentMember = existingSegmentIds.includes(segment.id);
        
        if (match && !isCurrentMember) {
          // Worker should be added to this segment
          await this.segmentRepository.addWorkerToSegment(segment.id, workerId, {
            ruleMatch: true
          });
          addedToSegments.push(segment.name);
        } else if (!match && isCurrentMember) {
          // Only remove from rule-based segments
          const membership = currentMemberships.find((m: { segmentId: string; segment: { type: string } }) => m.segmentId === segment.id);
          if (membership && membership.segment.type === 'rule_based') {
            await this.segmentRepository.removeWorkerFromSegment(segment.id, workerId);
            removedFromSegments.push(segment.name);
          }
        }
      } catch (error) {
        console.error(`Error evaluating segment ${segment.id} for worker ${workerId}:`, error);
        // Continue with other segments
      }
    }
    
    return {
      workerId,
      existingSegments: currentMemberships.map((m: { segment: { name: string } }) => m.segment.name),
      addedToSegments,
      removedFromSegments
    };
  }
  
  /**
   * Get statistics about segment membership
   */
  async getSegmentMembershipStats(segmentId: string): Promise<{
    totalMembers: number;
    ruleMatchCount: number;
    manuallyAddedCount: number;
    lastSyncDate: Date | null;
    syncJobsCount: number;
  }> {
    // Get segment
    const segment = await this.segmentRepository.findById(segmentId);
    if (!segment) {
      throw new AppError('Segment not found', 404);
    }
    
    // Count total members
    const totalMembers = await this.prisma.segmentMembership.count({
      where: { segmentId }
    });
    
    // Count rule matches
    const ruleMatchCount = await this.prisma.segmentMembership.count({
      where: {
        segmentId,
        ruleMatch: true
      }
    });
    
    // Count sync jobs
    const syncJobsCount = await this.prisma.segmentSyncJob.count({
      where: { segmentId }
    });
    
    return {
      totalMembers,
      ruleMatchCount,
      manuallyAddedCount: totalMembers - ruleMatchCount,
      lastSyncDate: segment.lastSyncAt,
      syncJobsCount
    };
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
   * Private method to update sync job status with proper typing
   */
  private async updateSyncJobStatus(jobId: string, data: SyncJobUpdateData): Promise<void> {
    // For startedAt, we need to handle it specially since it's not in the segmentRepository updateSyncJob method
    if (data.startedAt) {
      await this.prisma.segmentSyncJob.update({
        where: { id: jobId },
        data: { startedAt: data.startedAt }
      });
    }
    
    await this.segmentRepository.updateSyncJob(jobId, {
      status: data.status,
      processedCount: data.processedCount,
      matchCount: data.matchCount,
      errorMessage: data.errorMessage,
      completedAt: data.completedAt
    });
  }
} 