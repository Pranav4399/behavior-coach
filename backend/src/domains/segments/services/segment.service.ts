import { PrismaClient } from '@prisma/client';
import { Segment, SegmentProps, SegmentFilterOptions, SegmentType } from '../models/segment.model';
import { SegmentRepository } from '../repositories/segment.repository';
import { RuleEngineService } from './rule-engine.service';
import { RuleValidatorService } from './rule-validator.service';
import { RuleTestingService } from './rule-testing.service';
import { SegmentMembershipService } from './segment-membership.service';
import { AppError } from '../../../common/middleware/errorHandler';
import { Worker } from '../../workers/models/worker.model';
import { WorkerService } from '../../workers/services/worker.service';

interface SegmentCreateDTO {
  name: string;
  description?: string;
  type: SegmentType;
  ruleDefinition?: any; // For rule-based segments
  organizationId: string;
  createdById?: string;
}

interface SegmentUpdateDTO {
  name?: string;
  description?: string;
  type?: SegmentType;
  ruleDefinition?: any;
  updatedById?: string;
}

interface SegmentQueryOptions {
  filter?: SegmentFilterOptions;
  pagination?: {
    page: number;
    pageSize: number;
  };
}

export class SegmentService {
  private segmentRepository: SegmentRepository;
  private workerService: WorkerService;
  private ruleEngineService: RuleEngineService;
  private ruleValidatorService: RuleValidatorService;
  private ruleTestingService: RuleTestingService;
  private segmentMembershipService: SegmentMembershipService;
  
  constructor(
    prisma: PrismaClient,
    workerService: WorkerService
  ) {
    this.segmentRepository = new SegmentRepository(prisma);
    this.workerService = workerService;
    this.ruleEngineService = new RuleEngineService();
    this.ruleValidatorService = new RuleValidatorService();
    this.ruleTestingService = new RuleTestingService(prisma);
    this.segmentMembershipService = new SegmentMembershipService(prisma);
  }
  
  /**
   * Get a segment by ID
   */
  async getSegmentById(id: string): Promise<Segment> {
    const segment = await this.segmentRepository.findById(id);
    
    if (!segment) {
      throw new AppError('Segment not found', 404);
    }
    
    return segment;
  }
  
  /**
   * List segments for an organization
   */
  async listSegments(
    organizationId: string,
    options: SegmentQueryOptions = {}
  ): Promise<{ segments: Segment[]; total: number }> {
    return this.segmentRepository.findByOrganizationId(
      organizationId,
      options.filter,
      options.pagination
    );
  }
  
  /**
   * Create a new segment
   */
  async createSegment(data: SegmentCreateDTO): Promise<Segment> {
    // For rule-based segments, validate the rule definition
    if (data.type === 'rule_based' && data.ruleDefinition) {
      const validationResult = this.ruleValidatorService.validateRule(data.ruleDefinition);
      
      if (!validationResult.valid) {
        throw new AppError(
          `Invalid rule definition: ${validationResult.errors.map(e => e.message).join(', ')}`,
          400
        );
      }
    }
    
    const segment = await this.segmentRepository.create({
      name: data.name,
      description: data.description,
      type: data.type,
      ruleDefinition: data.ruleDefinition,
      organizationId: data.organizationId,
      createdById: data.createdById,
      updatedById: data.createdById // Initially same as created by
    });
    
    // For rule-based segments, trigger initial calculation
    if (data.type === 'rule_based' && data.ruleDefinition) {
      await this.scheduleSyncForSegment(segment.id);
    }
    
    return segment;
  }
  
  /**
   * Update an existing segment
   */
  async updateSegment(id: string, data: SegmentUpdateDTO): Promise<Segment> {
    // Get the current segment
    const segment = await this.getSegmentById(id);
    
    // For rule-based segments, validate the rule definition if provided
    if (data.ruleDefinition && (data.type === 'rule_based' || segment.type === 'rule_based')) {
      const validationResult = this.ruleValidatorService.validateRule(data.ruleDefinition);
      
      if (!validationResult.valid) {
        throw new AppError(
          `Invalid rule definition: ${validationResult.errors.map(e => e.message).join(', ')}`,
          400
        );
      }
    }
    
    // Check for type change from static to rule-based without a rule definition
    if (segment.type === 'static' && data.type === 'rule_based' && !data.ruleDefinition && !segment.ruleDefinition) {
      throw new AppError('Rule definition is required when changing segment type to rule-based', 400);
    }
    
    // Update the segment
    const updatedSegment = await this.segmentRepository.update(id, data);
    
    // If the rule definition was updated, trigger a recalculation
    if (data.ruleDefinition && (data.type === 'rule_based' || segment.type === 'rule_based')) {
      await this.scheduleSyncForSegment(id);
    }
    
    return updatedSegment;
  }
  
  /**
   * Delete a segment
   */
  async deleteSegment(id: string): Promise<void> {
    // Verify segment exists first
    await this.getSegmentById(id);
    
    // Delete the segment
    await this.segmentRepository.delete(id);
  }
  
  /**
   * Get workers in a segment
   */
  async getSegmentWorkers(
    segmentId: string,
    pagination?: { page: number; pageSize: number }
  ): Promise<{ workers: Worker[]; total: number }> {
    // Get worker IDs in the segment
    const { workerIds, total } = await this.segmentRepository.getWorkersInSegment(
      segmentId,
      pagination
    );
    
    // Fetch the actual worker details
    const workers = await Promise.all(
      workerIds.map(id => this.workerService.getWorkerById(id).catch(() => null))
    );
    
    // Filter out any null values (if workers were deleted but memberships remain)
    const validWorkers = workers.filter(worker => worker !== null) as Worker[];
    
    return { workers: validWorkers, total };
  }
  
  /**
   * Add workers to a static segment
   */
  async addWorkersToSegment(segmentId: string, workerIds: string[]): Promise<void> {
    // Verify segment exists and is static
    const segment = await this.getSegmentById(segmentId);
    
    if (segment.type !== 'static') {
      throw new AppError('Cannot manually add workers to a rule-based segment', 400);
    }
    
    // Add each worker
    for (const workerId of workerIds) {
      await this.segmentRepository.addWorkerToSegment(segmentId, workerId);
    }
  }
  
  /**
   * Remove workers from a static segment
   */
  async removeWorkersFromSegment(segmentId: string, workerIds: string[]): Promise<void> {
    // Verify segment exists and is static
    const segment = await this.getSegmentById(segmentId);
    
    if (segment.type !== 'static') {
      throw new AppError('Cannot manually remove workers from a rule-based segment', 400);
    }
    
    // Remove each worker
    for (const workerId of workerIds) {
      await this.segmentRepository.removeWorkerFromSegment(segmentId, workerId);
    }
  }
  
  /**
   * Get segments a worker belongs to
   */
  async getWorkerSegments(workerId: string): Promise<Segment[]> {
    // Verify worker exists
    const worker = await this.workerService.getWorkerById(workerId);
    
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    return this.segmentRepository.getSegmentsForWorker(workerId);
  }
  
  /**
   * Schedule a sync job for a rule-based segment
   */
  async scheduleSyncForSegment(segmentId: string): Promise<string> {
    // Verify segment exists and is rule-based
    const segment = await this.getSegmentById(segmentId);
    
    if (segment.type !== 'rule_based') {
      throw new AppError('Can only sync rule-based segments', 400);
    }
    
    // Start the synchronization process using the membership service
    const syncResult = await this.segmentMembershipService.synchronizeSegment(segmentId);
    
    return syncResult.syncJobId;
  }
  
  /**
   * Get the sync status for a segment
   */
  async getSegmentSyncStatus(segmentId: string): Promise<{
    lastSyncAt: Date | null;
    recentJobs: Array<{
      id: string;
      status: string;
      processedCount: number;
      matchCount: number;
      startedAt: Date | null;
      completedAt: Date | null;
    }>;
    membershipStats: {
      totalMembers: number;
      ruleMatchCount: number;
      manuallyAddedCount: number;
    };
  }> {
    // Get the segment
    const segment = await this.getSegmentById(segmentId);
    
    // Get recent sync jobs
    const recentJobs = await this.segmentMembershipService.getSegmentSyncJobs(segmentId, 5);
    
    // Get membership stats
    const stats = await this.segmentMembershipService.getSegmentMembershipStats(segmentId);
    
    return {
      lastSyncAt: segment.lastSyncAt,
      recentJobs,
      membershipStats: {
        totalMembers: stats.totalMembers,
        ruleMatchCount: stats.ruleMatchCount,
        manuallyAddedCount: stats.manuallyAddedCount
      }
    };
  }
  
  /**
   * Check if a worker is in a specific segment and why
   */
  async checkWorkerInSegment(segmentId: string, workerId: string): Promise<{
    isInSegment: boolean;
    matchesRules: boolean;
    reason: string | null;
  }> {
    const status = await this.segmentMembershipService.getWorkerMembershipStatus(segmentId, workerId);
    
    if (!status) {
      throw new AppError('Failed to get membership status', 500);
    }
    
    return {
      isInSegment: status.isInSegment,
      matchesRules: status.matchesRules,
      reason: status.reason
    };
  }
  
  /**
   * Reconcile a worker's segment memberships
   * This will add the worker to segments whose rules they match and remove them from
   * rule-based segments they no longer match
   */
  async reconcileWorkerSegments(workerId: string, organizationId: string): Promise<{
    addedToSegments: string[];
    removedFromSegments: string[];
  }> {
    const result = await this.segmentMembershipService.reconcileWorkerSegmentMemberships(
      workerId,
      organizationId
    );
    
    return {
      addedToSegments: result.addedToSegments,
      removedFromSegments: result.removedFromSegments
    };
  }
  
  /**
   * Test a rule definition against sample workers
   * Basic testing using default options
   */
  async testRuleDefinition(
    ruleDefinition: any,
    organizationId: string,
    sampleSize: number = 10
  ): Promise<{
    valid: boolean;
    validationErrors?: any[];
    previewResults?: {
      matchCount: number;
      totalCount: number;
      sampleMatches: Array<{
        workerId: string;
        workerName: string;
        reason: string | null;
      }>;
    };
  }> {
    // Use the new RuleTestingService for rule validation and testing
    const testResult = await this.ruleTestingService.testRule(ruleDefinition, {
      organizationId,
      sampleSize,
      includeNonMatches: false
    });
    
    if (!testResult.valid) {
      return {
        valid: false,
        validationErrors: testResult.validationErrors
      };
    }
    
    // Map the result format to maintain backward compatibility
    return {
      valid: true,
      previewResults: {
        matchCount: testResult.executionStats?.matchedWorkers || 0,
        totalCount: testResult.executionStats?.totalWorkers || 0,
        sampleMatches: testResult.matchSamples?.map(sample => ({
          workerId: sample.workerId,
          workerName: sample.workerName,
          reason: sample.reason
        })) || []
      }
    };
  }
  
  /**
   * Advanced rule testing with more options and detailed results
   */
  async testRuleAdvanced(ruleDefinition: any, options: {
    organizationId: string;
    sampleSize?: number;
    includeNonMatches?: boolean;
    includeWorkerData?: boolean;
    specificWorkerIds?: string[];
    testAgainstAllWorkers?: boolean;
  }) {
    return this.ruleTestingService.testRule(ruleDefinition, options);
  }
  
  /**
   * Explain why a specific worker matches or doesn't match a rule
   */
  async explainWorkerRuleMatch(workerId: string, ruleDefinition: any) {
    return this.ruleTestingService.explainWorkerRuleMatch(workerId, ruleDefinition);
  }
  
  /**
   * Get a human-readable description of a rule
   */
  getHumanReadableRule(ruleDefinition: any): string {
    try {
      const rule = this.ruleEngineService.parseRule(ruleDefinition);
      return this.ruleEngineService.ruleToHumanReadable(rule);
    } catch (error) {
      return 'Invalid rule definition';
    }
  }
} 