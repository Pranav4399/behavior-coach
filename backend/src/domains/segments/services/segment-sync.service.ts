import { PrismaClient } from '@prisma/client';
import { SegmentRepository } from '../repositories/segment.repository';
import { WorkerService } from '../../workers/services/worker.service';
import { SegmentMembershipService } from './segment-membership.service';
import { RuleEngineService } from './rule-engine.service';
import { AppError } from '../../../common/middleware/errorHandler';
import { Worker } from '../../workers/models/worker.model';

/**
 * A simplified service for segment synchronization that handles updates directly
 * instead of using a background job system
 */
export class SegmentSyncSimpleService {
  private prisma: PrismaClient;
  private segmentRepository: SegmentRepository;
  private workerService: WorkerService;
  private membershipService: SegmentMembershipService;
  private ruleEngineService: RuleEngineService;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.segmentRepository = new SegmentRepository(prisma);
    this.workerService = new WorkerService(prisma);
    this.membershipService = new SegmentMembershipService(prisma);
    this.ruleEngineService = new RuleEngineService();
  }
  
  /**
   * Synchronize a specific segment by evaluating all workers against its rules
   */
  async synchronizeSegment(segmentId: string): Promise<{
    segmentId: string;
    syncJobId: string;
    workersProcessed: number;
    workersMatched: number;
  }> {
    try {
      // Verify segment exists and is rule-based
      const segment = await this.segmentRepository.findById(segmentId);
      if (!segment) {
        throw new AppError('Segment not found', 404);
      }
      
      if (segment.type !== 'rule_based') {
        throw new AppError('Only rule-based segments can be synchronized', 400);
      }
      
      // Use the existing membership service to perform the synchronization
      const result = await this.membershipService.synchronizeSegment(segmentId, {
        fullSync: true  // Process all workers in the organization
      });
      
      return {
        segmentId,
        syncJobId: result.syncJobId,
        workersProcessed: result.processed,
        workersMatched: result.matched
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to synchronize segment: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Handle worker created event by updating their segment memberships
   */
  async handleWorkerCreated(worker: Worker): Promise<{
    workerId: string;
    addedToSegments: string[];
  }> {
    try {
      console.log(`Processing segment memberships for new worker: ${worker.id}`);
      
      // Directly reconcile worker's segment memberships
      const result = await this.membershipService.reconcileWorkerSegmentMemberships(
        worker.id,
        worker.organizationId
      );
      
      return {
        workerId: worker.id,
        addedToSegments: result.addedToSegments
      };
    } catch (error) {
      console.error(`Error processing new worker ${worker.id}:`, error);
      throw new AppError(`Failed to process worker creation: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Handle worker updated event by updating their segment memberships if needed
   */
  async handleWorkerUpdated(
    workerId: string,
    organizationId: string,
    changedFields?: string[]
  ): Promise<{
    workerId: string;
    addedToSegments: string[];
    removedFromSegments: string[];
  }> {
    try {
      console.log(`Processing segment memberships for updated worker: ${workerId}`);
      
      // If specific fields changed and we know what they are, we can optimize
      // by only checking segments with rules that reference those fields
      if (changedFields && changedFields.length > 0) {
        return this.updateSegmentsForChangedFields(workerId, organizationId, changedFields);
      }
      
      // Otherwise, check all rule-based segments for this worker
      const result = await this.membershipService.reconcileWorkerSegmentMemberships(
        workerId, 
        organizationId
      );
      
      return {
        workerId,
        addedToSegments: result.addedToSegments,
        removedFromSegments: result.removedFromSegments
      };
    } catch (error) {
      console.error(`Error processing updated worker ${workerId}:`, error);
      throw new AppError(`Failed to process worker update: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Handle worker deleted event by removing them from all segments
   */
  async handleWorkerDeleted(workerId: string): Promise<{
    workerId: string;
    removedFromSegments: string[];
  }> {
    try {
      console.log(`Removing deleted worker ${workerId} from all segments`);
      
      // Find all segment memberships for this worker
      const memberships = await this.prisma.segmentMembership.findMany({
        where: { workerId },
        include: { segment: true }
      });
      
      const segmentNames: string[] = [];
      
      // Remove from all segments
      for (const membership of memberships) {
        await this.prisma.segmentMembership.delete({
          where: {
            workerId_segmentId: {
              workerId,
              segmentId: membership.segmentId
            }
          }
        });
        segmentNames.push(membership.segment.name);
      }
      
      return {
        workerId,
        removedFromSegments: segmentNames
      };
    } catch (error) {
      console.error(`Error removing deleted worker ${workerId} from segments:`, error);
      throw new AppError(`Failed to process worker deletion: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Handle segment rule updated event by re-evaluating all workers
   */
  async handleSegmentRuleUpdated(segmentId: string): Promise<{
    segmentId: string;
    syncJobId: string;
    workersProcessed: number;
    workersMatched: number;
  }> {
    try {
      console.log(`Re-evaluating workers for updated segment rule: ${segmentId}`);
      return this.synchronizeSegment(segmentId);
    } catch (error) {
      console.error(`Error synchronizing segment ${segmentId} after rule update:`, error);
      throw new AppError(`Failed to process segment rule update: ${(error as Error).message}`, 500);
    }
  }
  
  /**
   * Optimize segment updates by only checking segments with rules
   * that reference the changed worker fields
   */
  private async updateSegmentsForChangedFields(
    workerId: string,
    organizationId: string,
    changedFields: string[]
  ): Promise<{
    workerId: string;
    addedToSegments: string[];
    removedFromSegments: string[];
  }> {
    try {
      // Get the worker
      const worker = await this.workerService.getWorkerById(workerId);
      if (!worker) {
        throw new AppError('Worker not found', 404);
      }
      
      // Find rule-based segments for the organization
      const { segments } = await this.segmentRepository.findByOrganizationId(
        organizationId,
        { type: 'rule_based' }
      );
      
      // Get current segment memberships
      const currentMemberships = await this.prisma.segmentMembership.findMany({
        where: { workerId },
        include: { segment: true }
      });
      
      const currentSegmentIds = currentMemberships.map((m: { segmentId: string }) => m.segmentId);
      const addedToSegments: string[] = [];
      const removedFromSegments: string[] = [];
      
      // Filter segments to those that might be affected by the changed fields
      const potentiallyAffectedSegments = segments.filter(segment => {
        if (!segment.ruleDefinition) return false;
        
        // Quick check if rule definition contains any of the changed fields
        const ruleStr = JSON.stringify(segment.ruleDefinition).toLowerCase();
        return changedFields.some(field => 
          ruleStr.includes(field.toLowerCase())
        );
      });
      
      // Process each potentially affected segment
      for (const segment of potentiallyAffectedSegments) {
        if (!segment.ruleDefinition) continue;
        
        try {
          // Evaluate the rule for this worker
          const rule = this.ruleEngineService.parseRule(segment.ruleDefinition);
          const evaluation = this.ruleEngineService.evaluateRuleForWorker(rule, worker);
          
          const isCurrentMember = currentSegmentIds.includes(segment.id);
          
          if (evaluation.match && !isCurrentMember) {
            // Worker should be added
            await this.segmentRepository.addWorkerToSegment(segment.id, workerId, {
              ruleMatch: true,
              ruleMatchReason: evaluation.reason
            });
            addedToSegments.push(segment.name);
          } else if (!evaluation.match && isCurrentMember) {
            // Only remove from rule-based segments
            const membership = currentMemberships.find((m: { segmentId: string; segment: { type: string } }) => 
              m.segmentId === segment.id
            );
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
        addedToSegments,
        removedFromSegments
      };
    } catch (error) {
      throw new AppError(`Failed to update segments for changed fields: ${(error as Error).message}`, 500);
    }
  }
} 