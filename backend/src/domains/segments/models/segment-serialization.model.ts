import { AppError } from '../../../common/middleware/errorHandler';
import { 
  SegmentRule, 
  SegmentRuleDefinition,
  RuleGroupProps, 
  ConditionProps, 
  SegmentRuleOperator, 
  LogicalOperator 
} from './segment-rule.model';

/**
 * Class for handling serialization and deserialization of segment rules
 * Both to/from JSON strings and to/from user-friendly formats
 */
export class SegmentRuleSerializer {
  /**
   * Serialize a SegmentRule to a JSON string
   */
  static serialize(rule: SegmentRule): string {
    try {
      return JSON.stringify(rule.toJSON());
    } catch (error) {
      throw new AppError('Failed to serialize rule', 500);
    }
  }

  /**
   * Deserialize a JSON string to a SegmentRule
   */
  static deserialize(json: string): SegmentRule {
    try {
      const definition = JSON.parse(json) as SegmentRuleDefinition;
      return new SegmentRule(definition);
    } catch (error) {
      throw new AppError('Invalid rule definition format', 400);
    }
  }

  /**
   * Convert a rule to a human-readable format
   * This returns a simplified description of the rule in plain English
   */
  static toHumanReadable(rule: SegmentRule): string {
    try {
      return this.ruleGroupToHumanReadable(rule.rootGroup);
    } catch (error) {
      return 'Complex rule (unable to display in plain text)';
    }
  }

  /**
   * Helper method to convert a rule group to human-readable text
   */
  private static ruleGroupToHumanReadable(group: RuleGroupProps, nested = false): string {
    const conditions = group.conditions || [];
    const groups = group.groups || [];
    
    if (conditions.length === 0 && groups.length === 0) {
      return '(empty rule)';
    }
    
    const conditionStrings = conditions.map(c => this.conditionToHumanReadable(c));
    const groupStrings = groups.map(g => this.ruleGroupToHumanReadable(g, true));
    
    const allStrings = [...conditionStrings, ...groupStrings];
    const joinOperator = group.operator === 'and' ? ' AND ' : ' OR ';
    
    // For nested groups, wrap in parentheses
    const result = allStrings.join(joinOperator);
    return nested ? `(${result})` : result;
  }

  /**
   * Get readable operator text based on operator type and negation
   */
  private static getOperatorText(operator: SegmentRuleOperator, negate: boolean = false): string {
    switch (operator) {
      case 'equals':
        return negate ? 'is not' : 'is';
      case 'not_equals':
        return negate ? 'is' : 'is not';
      case 'contains':
        return negate ? 'does not contain' : 'contains';
      case 'not_contains':
        return negate ? 'contains' : 'does not contain';
      case 'starts_with':
        return negate ? 'does not start with' : 'starts with';
      case 'ends_with':
        return negate ? 'does not end with' : 'ends with';
      case 'greater_than':
        return negate ? 'is not greater than' : 'is greater than';
      case 'less_than':
        return negate ? 'is not less than' : 'is less than';
      case 'greater_than_or_equals':
        return negate ? 'is less than' : 'is at least';
      case 'less_than_or_equals':
        return negate ? 'is greater than' : 'is at most';
      case 'in':
        return negate ? 'is not one of' : 'is one of';
      case 'not_in':
        return negate ? 'is one of' : 'is not one of';
      case 'is_empty':
        return negate ? 'is not empty' : 'is empty';
      case 'is_not_empty':
        return negate ? 'is empty' : 'is not empty';
      case 'exists':
        return negate ? 'does not exist' : 'exists';
      case 'not_exists':
        return negate ? 'exists' : 'does not exist';
      case 'has_any':
        return negate ? 'has none of' : 'has any of';
      case 'has_all':
        return negate ? 'is missing some of' : 'has all of';
      default:
        // This handles the case where TypeScript can't narrow the type correctly
        const opStr = operator as string;
        return opStr.replace(/_/g, ' ');
    }
  }

  /**
   * Format field name for readability
   */
  private static formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/\./g, ' → ') // Replace dots with arrows
      .replace(/^[a-z]/, c => c.toUpperCase()); // Capitalize first letter
  }

  /**
   * Format value for human readability
   */
  private static formatValue(value: any): string {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '(empty list)';
      } else if (value.length === 1) {
        return String(value[0]);
      } else if (value.length === 2) {
        return `${value[0]} and ${value[1]}`;
      } else {
        const lastValue = value[value.length - 1];
        const otherValues = value.slice(0, value.length - 1);
        return `${otherValues.join(', ')}, and ${lastValue}`;
      }
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    } else if (value === null || value === undefined) {
      return 'nothing';
    } else {
      return String(value);
    }
  }

  /**
   * Helper method to convert a condition to human-readable text
   */
  private static conditionToHumanReadable(condition: ConditionProps): string {
    // Validate the condition
    if (!condition || typeof condition !== 'object') {
      return '(invalid condition)';
    }
    
    const { field, operator, value, negate = false } = condition;
    
    // Validate required fields
    if (typeof field !== 'string') {
      return '(invalid field)';
    }
    
    if (!operator) {
      return `${this.formatFieldName(field)} (unknown operator)`;
    }
    
    // Format field name for readability
    const readableField = this.formatFieldName(field);
    
    // Get readable operator text
    const operatorText = this.getOperatorText(operator, negate);
    
    // For operators that don't need a value
    if (
      operator === 'is_empty' || 
      operator === 'is_not_empty' || 
      operator === 'exists' || 
      operator === 'not_exists'
    ) {
      return `${readableField} ${operatorText}`;
    }
    
    // Format the value
    const valueText = this.formatValue(value);
    
    // Put it all together
    return `${readableField} ${operatorText} ${valueText}`;
  }

  /**
   * Validate a rule definition
   * Returns true if valid, throws an error if invalid
   */
  static validateRuleDefinition(definition: unknown): boolean {
    try {
      // Check if it's an object
      if (typeof definition !== 'object' || definition === null) {
        throw new AppError('Rule definition must be an object', 400);
      }
      
      // Check if it has rootGroup
      const typedDefinition = definition as Partial<SegmentRuleDefinition>;
      if (!typedDefinition.rootGroup) {
        throw new AppError('Rule definition must have a rootGroup', 400);
      }
      
      // Create and validate a rule
      const rule = new SegmentRule(definition as SegmentRuleDefinition);
      rule.validate();
      
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid rule definition', 400);
    }
  }
} 