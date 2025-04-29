import { Worker } from '../../workers/models/worker.model';
import { WorkerService } from '../../workers/services/worker.service';
import { RuleEngineService } from './rule-engine.service';
import { RuleValidatorService, RuleValidationError } from './rule-validator.service';
import { SegmentRule } from '../models/segment-rule.model';
import { AppError } from '../../../common/middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

/**
 * Result of a simulated rule execution against specific workers
 */
export interface RuleTestResult {
  valid: boolean;
  validationErrors?: RuleValidationError[];
  executionStats?: {
    totalWorkers: number;
    matchedWorkers: number;
    matchPercentage: number;
    processingTimeMs: number;
  };
  matchSamples?: Array<{
    workerId: string;
    workerName: string;
    reason: string | null;
    workerData?: any; // Optional detailed worker data for debugging
  }>;
  nonMatchSamples?: Array<{
    workerId: string;
    workerName: string;
  }>;
}

/**
 * Options for testing a rule
 */
export interface RuleTestOptions {
  organizationId: string;
  sampleSize?: number;
  includeNonMatches?: boolean;
  includeWorkerData?: boolean;
  specificWorkerIds?: string[];
  testAgainstAllWorkers?: boolean;
  customFilter?: any;
}

/**
 * Service dedicated to testing segment rules against workers
 */
export class RuleTestingService {
  private workerService: WorkerService;
  private ruleEngineService: RuleEngineService;
  private ruleValidatorService: RuleValidatorService;

  constructor(prisma: PrismaClient) {
    this.workerService = new WorkerService(prisma);
    this.ruleEngineService = new RuleEngineService();
    this.ruleValidatorService = new RuleValidatorService();
  }

  /**
   * Validate a rule definition without executing it
   */
  validateRule(ruleDefinition: any): { valid: boolean; errors: RuleValidationError[] } {
    const result = this.ruleValidatorService.validateRule(ruleDefinition);
    return result;
  }

  /**
   * Test a rule definition against sample workers
   */
  async testRule(ruleDefinition: any, options: RuleTestOptions): Promise<RuleTestResult> {
    // First validate the rule definition
    const validationResult = this.ruleValidatorService.validateRule(ruleDefinition);
    
    if (!validationResult.valid) {
      return {
        valid: false,
        validationErrors: validationResult.errors
      };
    }

    try {
      // Parse the rule
      const rule = this.ruleEngineService.parseRule(ruleDefinition);
      
      // Get workers to test against
      let testWorkers: Worker[];
      
      if (options.specificWorkerIds && options.specificWorkerIds.length > 0) {
        // Test against specific workers
        testWorkers = await this.getSpecificWorkers(options.specificWorkerIds);
      } else {
        // Test against sample or all workers
        testWorkers = await this.getSampleWorkers(
          options.organizationId,
          options.sampleSize || 10,
          options.testAgainstAllWorkers || false,
          options.customFilter
        );
      }
      
      if (testWorkers.length === 0) {
        throw new AppError('No workers found to test against', 400);
      }
      
      // Execute the rule test
      return await this.executeRuleTest(rule, testWorkers, options);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to test rule: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Execute the rule test against the provided workers
   */
  private async executeRuleTest(
    rule: SegmentRule, 
    workers: Worker[],
    options: RuleTestOptions
  ): Promise<RuleTestResult> {
    const startTime = Date.now();
    
    // Evaluate the rule against all workers
    const { matches, matchDetails, stats } = this.ruleEngineService.evaluateRuleForWorkerBatch(rule, workers);
    
    // Calculate match percentage
    const matchPercentage = stats.total > 0 ? (stats.matched / stats.total) * 100 : 0;
    
    // Create samples of matching workers
    const matchSamples = matchDetails
      .slice(0, 5) // Limit to 5 examples
      .map(detail => {
        const worker = workers.find(w => w.id === detail.workerId);
        if (!worker) return null;
        
        return {
          workerId: detail.workerId,
          workerName: `${worker.firstName} ${worker.lastName}`,
          reason: detail.reason,
          ...(options.includeWorkerData && { workerData: this.sanitizeWorkerData(worker) })
        };
      })
      .filter(Boolean) as Array<{
        workerId: string;
        workerName: string;
        reason: string | null;
        workerData?: any;
      }>;
    
    // Create samples of non-matching workers if requested
    let nonMatchSamples: Array<{ workerId: string; workerName: string }> = [];
    
    if (options.includeNonMatches) {
      // Get workers that didn't match
      const nonMatchingWorkers = workers.filter(worker => !matches.includes(worker.id));
      
      // Take up to 5 non-matching examples
      nonMatchSamples = nonMatchingWorkers
        .slice(0, 5)
        .map(worker => ({
          workerId: worker.id,
          workerName: `${worker.firstName} ${worker.lastName}`
        }));
    }
    
    // Calculate total processing time
    const processingTimeMs = Date.now() - startTime;
    
    return {
      valid: true,
      executionStats: {
        totalWorkers: stats.total,
        matchedWorkers: stats.matched,
        matchPercentage,
        processingTimeMs
      },
      matchSamples,
      ...(options.includeNonMatches && { nonMatchSamples })
    };
  }

  /**
   * Get specific workers by their IDs
   */
  private async getSpecificWorkers(workerIds: string[]): Promise<Worker[]> {
    const workers: Worker[] = [];
    
    // Fetch each worker individually - in a real implementation,
    // this could be optimized with a batch fetch
    for (const id of workerIds) {
      try {
        const worker = await this.workerService.getWorkerById(id);
        if (worker) {
          workers.push(worker);
        }
      } catch (error) {
        // Skip workers that don't exist or can't be accessed
        continue;
      }
    }
    
    return workers;
  }

  /**
   * Get a sample of workers from an organization
   */
  private async getSampleWorkers(
    organizationId: string,
    sampleSize: number,
    getAllWorkers: boolean = false,
    customFilter?: any
  ): Promise<Worker[]> {
    try {
      if (getAllWorkers) {
        // Get all workers - this should be used with caution for large organizations
        const { workers } = await this.workerService.getWorkers(organizationId);
        return workers;
      }
      
      // Get a sample of workers
      const { workers } = await this.workerService.getWorkersByOrganization(
        organizationId,
        1, // page
        sampleSize // limit to the requested sample size
      );
      
      return workers;
    } catch (error) {
      throw new AppError(`Failed to get sample workers: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Create a sanitized version of worker data for debugging
   * This removes sensitive fields and includes only what's relevant for rule testing
   */
  private sanitizeWorkerData(worker: Worker): any {
    // Create a simplified view of the worker for debugging
    return {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      externalId: worker.externalId,
      gender: worker.gender,
      tags: worker.tags,
      isActive: worker.isActive,
      contact: worker.contact ? {
        locationCity: worker.contact.locationCity,
        locationStateProvince: worker.contact.locationStateProvince,
        locationCountry: worker.contact.locationCountry,
        preferredLanguage: worker.contact.preferredLanguage,
        // Exclude personal contact info like phone and email
      } : undefined,
      employment: worker.employment ? {
        jobTitle: worker.employment.jobTitle,
        department: worker.employment.department,
        team: worker.employment.team,
        employmentStatus: worker.employment.employmentStatus,
        employmentType: worker.employment.employmentType,
      } : undefined,
      // Include other relevant fields but exclude personal/sensitive info
    };
  }

  /**
   * Explain why a specific worker matches or doesn't match a rule
   * Useful for debugging and explaining segment membership
   */
  async explainWorkerRuleMatch(
    workerId: string,
    ruleDefinition: any
  ): Promise<{
    matches: boolean;
    explanation: string;
    ruleDetails: any;
    evaluationDetails: any;
  }> {
    // Validate and parse the rule
    const validationResult = this.ruleValidatorService.validateRule(ruleDefinition);
    if (!validationResult.valid) {
      throw new AppError(`Invalid rule: ${validationResult.errors[0].message}`, 400);
    }
    
    // Get the worker
    const worker = await this.workerService.getWorkerById(workerId);
    if (!worker) {
      throw new AppError(`Worker with ID ${workerId} not found`, 404);
    }
    
    // Parse the rule
    const rule = this.ruleEngineService.parseRule(ruleDefinition);
    
    // Evaluate the rule with detailed explanation
    const { match, reason } = this.ruleEngineService.evaluateRuleForWorker(rule, worker);
    
    // Get a human-readable description of the rule
    const ruleDescription = this.ruleEngineService.ruleToHumanReadable(rule);
    
    return {
      matches: match,
      explanation: reason || (match ? 'Worker matches all rule conditions' : 'Worker does not match rule conditions'),
      ruleDetails: {
        description: ruleDescription,
        definition: ruleDefinition
      },
      evaluationDetails: {
        workerName: `${worker.firstName} ${worker.lastName}`,
        relevantFields: this.extractRelevantFields(worker, rule)
      }
    };
  }

  /**
   * Extract fields from a worker that are relevant to a particular rule
   * This helps debugging by showing only the data that affected the rule evaluation
   */
  private extractRelevantFields(worker: Worker, rule: SegmentRule): any {
    // In a real implementation, this would analyze the rule structure
    // to determine which worker fields are used in conditions
    // For now, return a simplified worker object
    return this.sanitizeWorkerData(worker);
  }

  /**
   * Create a test rule for specific field/value
   * Useful for quick rule creation during testing
   */
  createTestRule(field: string, value: any): any {
    return this.ruleEngineService.createTestRule(field, value);
  }
} 