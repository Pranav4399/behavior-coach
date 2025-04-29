import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import prisma from '../../../../prisma/prisma';
import { RuleTestingService } from '../services/rule-testing.service';
import { SegmentService } from '../services/segment.service';
import { WorkerService } from '../../workers/services/worker.service';

// Initialize services
const workerService = new WorkerService(prisma);
const ruleTestingService = new RuleTestingService(prisma);
const segmentService = new SegmentService(prisma, workerService);

/**
 * Test a segment rule definition against the worker database
 * @route POST /api/segments/test-rule
 */
export const testRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ruleDefinition, sampleSize = 10, includeNonMatches = false } = req.body;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    if (!ruleDefinition) {
      throw new AppError('Rule definition is required', 400);
    }
    
    // Test the rule definition
    const result = await segmentService.testRuleDefinition(
      ruleDefinition,
      organizationId,
      sampleSize
    );
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Advanced rule testing with more options
 * @route POST /api/segments/test-rule/advanced
 */
export const testRuleAdvanced = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      ruleDefinition, 
      sampleSize, 
      includeNonMatches, 
      includeWorkerData,
      specificWorkerIds,
      testAgainstAllWorkers
    } = req.body;
    
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    if (!ruleDefinition) {
      throw new AppError('Rule definition is required', 400);
    }
    
    // Test the rule with advanced options
    const result = await segmentService.testRuleAdvanced(ruleDefinition, {
      organizationId,
      sampleSize,
      includeNonMatches,
      includeWorkerData,
      specificWorkerIds,
      testAgainstAllWorkers
    });
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Test a segment's rule definition
 * @route POST /api/segments/:segmentId/test-rule
 */
export const testSegmentRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { segmentId } = req.params;
    const { sampleSize = 10 } = req.body;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Get segment to verify access
    const segment = await segmentService.getSegmentById(segmentId);
    
    if (segment.organizationId !== organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    if (segment.type !== 'rule_based' || !segment.ruleDefinition) {
      throw new AppError('Segment has no rule definition to test', 400);
    }
    
    // Test the segment's rule definition
    const result = await segmentService.testRuleDefinition(
      segment.ruleDefinition,
      organizationId,
      sampleSize
    );
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Explain why a worker matches or doesn't match a rule
 * @route POST /api/segments/explain-worker-match
 */
export const explainWorkerMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workerId, ruleDefinition } = req.body;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    if (!workerId) {
      throw new AppError('Worker ID is required', 400);
    }
    
    if (!ruleDefinition) {
      throw new AppError('Rule definition is required', 400);
    }
    
    // Verify worker exists and belongs to the organization
    const worker = await workerService.getWorkerById(workerId);
    
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    if (worker.organizationId !== organizationId) {
      throw new AppError('Worker not found or access denied', 404);
    }
    
    // Explain the worker-rule match
    const explanation = await ruleTestingService.explainWorkerRuleMatch(workerId, ruleDefinition);
    
    res.status(200).json({
      status: 'success',
      data: explanation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Explain why a worker matches or doesn't match a segment
 * @route GET /api/segments/:segmentId/workers/:workerId/explain
 */
export const explainWorkerSegmentMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { segmentId, workerId } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Verify segment access
    const segment = await segmentService.getSegmentById(segmentId);
    
    if (segment.organizationId !== organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    if (segment.type !== 'rule_based' || !segment.ruleDefinition) {
      throw new AppError('Segment has no rule definition to explain', 400);
    }
    
    // Verify worker access
    const worker = await workerService.getWorkerById(workerId);
    
    if (!worker) {
      throw new AppError('Worker not found', 404);
    }
    
    if (worker.organizationId !== organizationId) {
      throw new AppError('Worker not found or access denied', 404);
    }
    
    // Get the explanation
    const explanation = await ruleTestingService.explainWorkerRuleMatch(
      workerId,
      segment.ruleDefinition
    );
    
    // Also get membership status
    const membershipStatus = await segmentService.checkWorkerInSegment(segmentId, workerId);
    
    res.status(200).json({
      status: 'success',
      data: {
        explanation,
        membershipStatus
      }
    });
  } catch (error) {
    next(error);
  }
}; 