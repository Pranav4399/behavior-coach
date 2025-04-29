import { AppError } from '../../../common/middleware/errorHandler';
import { Worker } from '../../workers/models/worker.model';

// Operator types for conditions
export type SegmentRuleOperator = 
  // Comparison operators
  'equals' | 'not_equals' |              // For string, number, boolean
  'contains' | 'not_contains' |          // For strings and arrays
  'starts_with' | 'ends_with' |          // For strings
  'greater_than' | 'less_than' |         // For numbers and dates
  'greater_than_or_equals' | 'less_than_or_equals' |  // For numbers and dates
  'in' | 'not_in' |                      // For arrays of values
  'is_empty' | 'is_not_empty' |          // For strings, arrays
  'exists' | 'not_exists' |              // For any field check
  'has_any' | 'has_all';                 // For array fields

// Group logical operators
export type LogicalOperator = 'and' | 'or';

// Model for a single condition
export interface ConditionProps {
  field: string;
  operator: SegmentRuleOperator;
  value: any;
  negate?: boolean;
}

export class Condition {
  field: string;
  operator: SegmentRuleOperator;
  value: any;
  negate: boolean;

  constructor(props: ConditionProps) {
    this.field = props.field;
    this.operator = props.operator;
    this.value = props.value;
    this.negate = props.negate || false;
  }

  validate(): void {
    if (!this.field) {
      throw new AppError('Condition field is required', 400);
    }

    if (!this.operator) {
      throw new AppError('Condition operator is required', 400);
    }

    // Validate based on operator
    switch (this.operator) {
      case 'equals':
      case 'not_equals':
      case 'greater_than':
      case 'less_than':
      case 'greater_than_or_equals':
      case 'less_than_or_equals':
        if (this.value === undefined || this.value === null) {
          throw new AppError(`Value is required for operator: ${this.operator}`, 400);
        }
        break;
      case 'in':
      case 'not_in':
      case 'has_any':
      case 'has_all':
        if (!Array.isArray(this.value)) {
          throw new AppError(`Value must be an array for operator: ${this.operator}`, 400);
        }
        break;
      case 'is_empty':
      case 'is_not_empty':
      case 'exists':
      case 'not_exists':
        // These operators don't require a value
        break;
      default:
        if (this.value === undefined || this.value === null) {
          throw new AppError(`Value is required for operator: ${this.operator}`, 400);
        }
        break;
    }
  }

  /**
   * Evaluates this condition against a worker object
   * Returns true if the condition matches, false otherwise
   */
  evaluate(worker: Worker): { result: boolean; reason?: string } {
    try {
      // Get field value using dot notation (e.g., "employment.jobTitle")
      const fieldValue = this.getFieldValue(worker, this.field);
      let result = false;

      // Evaluate based on operator
      switch (this.operator) {
        case 'equals':
          result = fieldValue === this.value;
          break;
        case 'not_equals':
          result = fieldValue !== this.value;
          break;
        case 'contains':
          result = typeof fieldValue === 'string' && fieldValue.includes(this.value);
          break;
        case 'not_contains':
          result = typeof fieldValue === 'string' && !fieldValue.includes(this.value);
          break;
        case 'starts_with':
          result = typeof fieldValue === 'string' && fieldValue.startsWith(this.value);
          break;
        case 'ends_with':
          result = typeof fieldValue === 'string' && fieldValue.endsWith(this.value);
          break;
        case 'greater_than':
          result = fieldValue > this.value;
          break;
        case 'less_than':
          result = fieldValue < this.value;
          break;
        case 'greater_than_or_equals':
          result = fieldValue >= this.value;
          break;
        case 'less_than_or_equals':
          result = fieldValue <= this.value;
          break;
        case 'in':
          result = Array.isArray(this.value) && this.value.includes(fieldValue);
          break;
        case 'not_in':
          result = Array.isArray(this.value) && !this.value.includes(fieldValue);
          break;
        case 'is_empty':
          result = fieldValue === '' || fieldValue === null || fieldValue === undefined ||
                  (Array.isArray(fieldValue) && fieldValue.length === 0);
          break;
        case 'is_not_empty':
          result = fieldValue !== '' && fieldValue !== null && fieldValue !== undefined &&
                  (!Array.isArray(fieldValue) || fieldValue.length > 0);
          break;
        case 'exists':
          result = fieldValue !== undefined && fieldValue !== null;
          break;
        case 'not_exists':
          result = fieldValue === undefined || fieldValue === null;
          break;
        case 'has_any':
          result = Array.isArray(fieldValue) && Array.isArray(this.value) &&
                  this.value.some(v => fieldValue.includes(v));
          break;
        case 'has_all':
          result = Array.isArray(fieldValue) && Array.isArray(this.value) &&
                  this.value.every(v => fieldValue.includes(v));
          break;
        default:
          throw new Error(`Unsupported operator: ${this.operator}`);
      }

      // Apply negation if specified
      if (this.negate) {
        result = !result;
      }

      return {
        result,
        reason: result 
          ? `${this.field} ${this.operator} ${JSON.stringify(this.value)}`
          : undefined
      };
    } catch (error) {
      // Error in evaluation, return false
      return {
        result: false,
        reason: undefined
      };
    }
  }

  private getFieldValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[key];
    }
    
    return value;
  }

  toJSON(): { field: string; operator: SegmentRuleOperator; value: any; negate: boolean } {
    return {
      field: this.field,
      operator: this.operator,
      value: this.value,
      negate: this.negate
    };
  }
}

// A rule group contains multiple conditions or nested rule groups
export interface RuleGroupProps {
  operator: LogicalOperator;
  conditions?: ConditionProps[];
  groups?: RuleGroupProps[];
}

export class RuleGroup {
  operator: LogicalOperator;
  conditions: Condition[];
  groups: RuleGroup[];

  constructor(props: RuleGroupProps) {
    this.operator = props.operator || 'and';
    this.conditions = (props.conditions || []).map(c => new Condition(c));
    this.groups = (props.groups || []).map(g => new RuleGroup(g));
  }

  validate(): void {
    // A group must have at least one condition or one nested group
    if (this.conditions.length === 0 && this.groups.length === 0) {
      throw new AppError('Rule group must have at least one condition or nested group', 400);
    }

    // Validate each condition
    this.conditions.forEach(condition => condition.validate());

    // Validate each nested group
    this.groups.forEach(group => group.validate());
  }

  /**
   * Evaluates this rule group against a worker object
   * Returns true if the group matches based on its operator, false otherwise
   */
  evaluate(worker: Worker): { result: boolean; matchedConditions: string[] } {
    const matchedConditions: string[] = [];
    
    // Evaluate conditions
    const conditionResults = this.conditions.map(condition => {
      const { result, reason } = condition.evaluate(worker);
      if (result && reason) {
        matchedConditions.push(reason);
      }
      return result;
    });
    
    // Evaluate nested groups
    const groupResults = this.groups.map(group => {
      const { result, matchedConditions: nestedMatches } = group.evaluate(worker);
      matchedConditions.push(...nestedMatches);
      return result;
    });
    
    // Combine all results based on the logical operator
    const allResults = [...conditionResults, ...groupResults];
    let result: boolean;
    
    if (this.operator === 'and') {
      result = allResults.length > 0 && allResults.every(r => r);
    } else { // 'or'
      result = allResults.some(r => r);
    }
    
    return {
      result,
      matchedConditions
    };
  }

  toJSON(): { operator: LogicalOperator; conditions: ReturnType<Condition['toJSON']>[]; groups: ReturnType<RuleGroup['toJSON']>[] } {
    return {
      operator: this.operator,
      conditions: this.conditions.map(c => c.toJSON()),
      groups: this.groups.map(g => g.toJSON())
    };
  }
}

// The complete rule definition for a segment
export interface SegmentRuleDefinition {
  rootGroup: RuleGroupProps;
}

export class SegmentRule {
  rootGroup: RuleGroup;

  constructor(definition: SegmentRuleDefinition) {
    this.rootGroup = new RuleGroup(definition.rootGroup);
  }

  validate(): void {
    this.rootGroup.validate();
  }

  /**
   * Evaluates the entire rule against a worker
   * Returns result and explanation for matching
   */
  evaluate(worker: Worker): { match: boolean; reason: string | null } {
    const { result, matchedConditions } = this.rootGroup.evaluate(worker);
    
    return {
      match: result,
      reason: result && matchedConditions.length > 0
        ? matchedConditions.join('; ')
        : null
    };
  }

  toJSON(): SegmentRuleDefinition {
    return {
      rootGroup: this.rootGroup.toJSON() as RuleGroupProps
    };
  }

  /**
   * Create a SegmentRule from a JSON string
   */
  static fromJSON(json: string): SegmentRule {
    try {
      const definition = JSON.parse(json) as SegmentRuleDefinition;
      return new SegmentRule(definition);
    } catch (error) {
      throw new AppError('Invalid rule definition format', 400);
    }
  }
} 