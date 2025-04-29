import { Worker } from '../../workers/models/worker.model';
import { 
  SegmentRule,
  SegmentRuleDefinition,
  Condition,
  RuleGroup
} from '../models/segment-rule.model';
import { SegmentRuleSerializer } from '../models/segment-serialization.model';
import { AppError } from '../../../common/middleware/errorHandler';

/**
 * Service responsible for segment rule validation and evaluation
 */
export class RuleEngineService {
  /**
   * Parse a rule definition from JSON string or object
   */
  parseRule(ruleDefinition: string | any): SegmentRule {
    try {
      // Handle string input
      if (typeof ruleDefinition === 'string') {
        return SegmentRuleSerializer.deserialize(ruleDefinition);
      }
      
      // Handle object input
      if (typeof ruleDefinition === 'object' && ruleDefinition !== null) {
        return new SegmentRule(ruleDefinition as SegmentRuleDefinition);
      }
      
      throw new AppError('Invalid rule definition format', 400);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to parse rule definition', 400);
    }
  }
  
  /**
   * Validate a rule definition
   */
  validateRule(ruleDefinition: string | any): { valid: boolean; error?: string } {
    try {
      const rule = this.parseRule(ruleDefinition);
      rule.validate();
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof AppError ? error.message : 'Invalid rule definition'
      };
    }
  }

  /**
   * Evaluate a rule against a single worker
   */
  evaluateRuleForWorker(rule: SegmentRule, worker: Worker): { match: boolean; reason: string | null } {
    return rule.evaluate(worker);
  }

  /**
   * Evaluates a rule against a batch of workers for performance
   * Returns array of worker IDs that match the rule
   */
  evaluateRuleForWorkerBatch(
    rule: SegmentRule, 
    workers: Worker[]
  ): { 
    matches: string[]; 
    matchDetails: Array<{ workerId: string; reason: string | null }>;
    stats: { 
      total: number; 
      matched: number; 
      processingTimeMs: number 
    } 
  } {
    const startTime = Date.now();
    const matches: string[] = [];
    const matchDetails: Array<{ workerId: string; reason: string | null }> = [];
    
    // Iterate through workers and evaluate each
    for (const worker of workers) {
      const { match, reason } = this.evaluateRuleForWorker(rule, worker);
      
      if (match) {
        matches.push(worker.id);
        matchDetails.push({ 
          workerId: worker.id, 
          reason 
        });
      }
    }
    
    const processingTimeMs = Date.now() - startTime;
    
    return {
      matches,
      matchDetails,
      stats: {
        total: workers.length,
        matched: matches.length,
        processingTimeMs
      }
    };
  }

  /**
   * Convert a rule to human-readable format
   */
  ruleToHumanReadable(rule: SegmentRule): string {
    return SegmentRuleSerializer.toHumanReadable(rule);
  }

  /**
   * Generate a preview of the rule's results based on a sample of workers
   */
  async generateRulePreview(
    rule: SegmentRule, 
    sampleWorkers: Worker[], 
    limit: number = 5
  ): Promise<{
    matchCount: number;
    totalCount: number;
    sampleMatches: Array<{
      workerId: string;
      workerName: string;
      reason: string | null;
    }>;
  }> {
    const { matches, matchDetails, stats } = this.evaluateRuleForWorkerBatch(rule, sampleWorkers);
    
    // Map the match details with worker names
    const sampleMatches = matchDetails
      .slice(0, limit)
      .map(detail => {
        const worker = sampleWorkers.find(w => w.id === detail.workerId);
        return {
          workerId: detail.workerId,
          workerName: worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown Worker',
          reason: detail.reason
        };
      });
    
    return {
      matchCount: stats.matched,
      totalCount: stats.total,
      sampleMatches
    };
  }

  /**
   * Create an optimized rule based on the original rule definition
   * This can be used for complex rules to improve performance
   */
  optimizeRule(rule: SegmentRule): SegmentRule {
    // Clone the rule first to avoid modifying the original
    const ruleJson = SegmentRuleSerializer.serialize(rule);
    const optimizedRule = SegmentRuleSerializer.deserialize(ruleJson);
    
    // For now, we're returning the cloned rule without optimization
    // In the future, this could implement optimizations like:
    // - Simplifying logical expressions
    // - Reordering conditions for early termination
    // - Caching computed values
    
    return optimizedRule;
  }

  /**
   * Create a test rule (useful for development and testing)
   */
  createTestRule(field: string, value: any): SegmentRule {
    const definition: SegmentRuleDefinition = {
      rootGroup: {
        operator: 'and',
        conditions: [
          {
            field,
            operator: 'equals',
            value
          }
        ]
      }
    };
    
    return new SegmentRule(definition);
  }
} 