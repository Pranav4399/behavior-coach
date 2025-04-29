import { Worker } from '../../workers/models/worker.model';
import { SegmentRule } from '../models/segment-rule.model';
import { AppError } from '../../../common/middleware/errorHandler';

/**
 * Interface for worker field extraction functions
 * These are used to efficiently access worker properties during rule evaluation
 */
interface FieldExtractor {
  fieldPath: string[];
  extract: (worker: Worker) => any;
}

/**
 * Class that optimizes rule evaluation against large worker datasets
 * Implements field caching and batched processing strategies
 */
export class RuleEvaluationOptimizer {
  private fieldExtractors: Map<string, FieldExtractor> = new Map();
  private fieldValueCache: Map<string, Map<string, any>> = new Map();
  private batchSize: number;
  
  constructor(options: { batchSize?: number } = {}) {
    this.batchSize = options.batchSize || 1000;
  }
  
  /**
   * Extract all field paths from a rule for pre-building extractors
   */
  analyzeRule(rule: SegmentRule): string[] {
    const fieldPaths: Set<string> = new Set();
    
    const extractFromGroup = (group: any) => {
      if (group.conditions && Array.isArray(group.conditions)) {
        for (const condition of group.conditions) {
          if (condition.field) {
            fieldPaths.add(condition.field);
          }
        }
      }
      
      if (group.groups && Array.isArray(group.groups)) {
        for (const nestedGroup of group.groups) {
          extractFromGroup(nestedGroup);
        }
      }
    };
    
    // Start from the root group
    extractFromGroup(rule.rootGroup);
    
    return Array.from(fieldPaths);
  }
  
  /**
   * Build field extractors for all fields used in the rule
   */
  prepareForRule(rule: SegmentRule): void {
    const fieldPaths = this.analyzeRule(rule);
    
    // Create extractors for each field path
    for (const path of fieldPaths) {
      if (!this.fieldExtractors.has(path)) {
        const pathParts = path.split('.');
        
        const extractor: FieldExtractor = {
          fieldPath: pathParts,
          extract: (worker: Worker) => {
            let value = worker as any;
            
            for (const part of pathParts) {
              if (value === null || value === undefined) {
                return undefined;
              }
              value = value[part];
            }
            
            return value;
          }
        };
        
        this.fieldExtractors.set(path, extractor);
      }
    }
    
    // Reset cache for a new evaluation
    this.fieldValueCache.clear();
  }
  
  /**
   * Pre-cache field values for a batch of workers
   * This improves performance by extracting values once per worker
   */
  preloadWorkerValues(workers: Worker[]): void {
    for (const [fieldPath, extractor] of this.fieldExtractors.entries()) {
      const fieldCache = new Map<string, any>();
      this.fieldValueCache.set(fieldPath, fieldCache);
      
      // Extract and cache the value for each worker
      for (const worker of workers) {
        const value = extractor.extract(worker);
        fieldCache.set(worker.id, value);
      }
    }
  }
  
  /**
   * Get a cached field value for a worker
   */
  getCachedFieldValue(workerId: string, fieldPath: string): any {
    const fieldCache = this.fieldValueCache.get(fieldPath);
    if (!fieldCache) {
      throw new AppError(`Field cache not initialized for field: ${fieldPath}`, 500);
    }
    
    return fieldCache.get(workerId);
  }
  
  /**
   * Process a large worker dataset in batches
   * This prevents memory issues when dealing with many workers
   */
  async processInBatches<T>(
    workers: Worker[],
    rule: SegmentRule,
    processBatch: (batch: Worker[], rule: SegmentRule, optimizer: RuleEvaluationOptimizer) => Promise<T[]>
  ): Promise<T[]> {
    const results: T[] = [];
    
    // Initialize extractors based on the rule
    this.prepareForRule(rule);
    
    // Process in batches
    for (let i = 0; i < workers.length; i += this.batchSize) {
      const batch = workers.slice(i, i + this.batchSize);
      
      // Preload field values for this batch
      this.preloadWorkerValues(batch);
      
      // Process the batch
      const batchResults = await processBatch(batch, rule, this);
      results.push(...batchResults);
      
      // Clear cache after processing to free memory
      this.fieldValueCache.clear();
    }
    
    return results;
  }
  
  /**
   * Evaluate a rule against many workers using batching and caching
   */
  async evaluateRuleAgainstWorkers(
    rule: SegmentRule,
    workers: Worker[]
  ): Promise<{
    matches: string[];
    matchDetails: Array<{ workerId: string; reason: string | null }>;
    timingInfo: {
      totalTimeMs: number;
      batchTimes: number[];
      workersPerSecond: number;
    };
  }> {
    const startTime = Date.now();
    const batchTimes: number[] = [];
    const matches: string[] = [];
    const matchDetails: Array<{ workerId: string; reason: string | null }> = [];
    
    // Process in batches
    const processBatch = async (
      batch: Worker[], 
      rule: SegmentRule,
      optimizer: RuleEvaluationOptimizer
    ): Promise<Array<{ workerId: string; reason: string | null }>> => {
      const batchStartTime = Date.now();
      const batchResults: Array<{ workerId: string; reason: string | null }> = [];
      
      // Evaluate rule for each worker
      for (const worker of batch) {
        const { match, reason } = rule.evaluate(worker);
        
        if (match) {
          matches.push(worker.id);
          batchResults.push({ workerId: worker.id, reason });
        }
      }
      
      const batchTime = Date.now() - batchStartTime;
      batchTimes.push(batchTime);
      
      return batchResults;
    };
    
    // Run batch processing
    const details = await this.processInBatches(workers, rule, processBatch);
    matchDetails.push(...details);
    
    const totalTimeMs = Date.now() - startTime;
    const workersPerSecond = workers.length / (totalTimeMs / 1000);
    
    return {
      matches,
      matchDetails,
      timingInfo: {
        totalTimeMs,
        batchTimes,
        workersPerSecond
      }
    };
  }
} 