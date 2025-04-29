import { 
  SegmentRule, 
  SegmentRuleDefinition, 
  SegmentRuleOperator,
  RuleGroupProps,
  ConditionProps,
  LogicalOperator
} from '../models/segment-rule.model';
import { AppError } from '../../../common/middleware/errorHandler';

/**
 * Validation error types
 */
export enum RuleValidationErrorType {
  MISSING_FIELD = 'MISSING_FIELD',
  INVALID_FIELD_TYPE = 'INVALID_FIELD_TYPE',
  INVALID_OPERATOR = 'INVALID_OPERATOR',
  MISSING_VALUE = 'MISSING_VALUE',
  INVALID_VALUE_TYPE = 'INVALID_VALUE_TYPE',
  EMPTY_GROUP = 'EMPTY_GROUP',
  STRUCTURAL_ERROR = 'STRUCTURAL_ERROR',
  UNKNOWN_FIELD = 'UNKNOWN_FIELD'
}

/**
 * Error with detailed information about rule validation issues
 */
export interface RuleValidationError {
  type: RuleValidationErrorType;
  message: string;
  path: string;
  details?: any;
}

/**
 * Validation result interface
 */
export interface RuleValidationResult {
  valid: boolean;
  errors: RuleValidationError[];
}

/**
 * Service for validating segment rule definitions
 */
export class RuleValidatorService {
  // Known worker fields that can be used in rules
  private knownFields: Set<string>;
  
  constructor() {
    // Initialize the set of known fields
    // These fields correspond to worker properties that can be used in rules
    this.knownFields = new Set([
      // Core worker fields
      'id', 'externalId', 'firstName', 'lastName', 'dateOfBirth', 'gender', 
      'tags', 'isActive', 'deactivationReason', 'organizationId', 'supervisorId',
      'customFields',
      
      // Nested field paths
      'contact.locationCity', 'contact.locationStateProvince', 'contact.locationCountry',
      'contact.primaryPhoneNumber', 'contact.whatsappOptInStatus', 'contact.preferredLanguage',
      'contact.communicationConsent', 'contact.emailAddress',
      
      'employment.jobTitle', 'employment.department', 'employment.team', 
      'employment.hireDate', 'employment.employmentStatus', 'employment.employmentType',
      
      'engagement.lastActiveAt', 'engagement.lastInteractionDate',
      
      'wellbeing.lastWellbeingAssessmentDate', 'wellbeing.overallWellbeingScore',
      
      'gamification.pointsBalance', 'gamification.badgesEarnedCount'
    ]);
  }
  
  /**
   * Add custom fields to the known fields set
   * This can be used to support organization-specific custom fields
   */
  addCustomFields(fields: string[]): void {
    for (const field of fields) {
      this.knownFields.add(field);
    }
  }
  
  /**
   * Validate an entire rule definition
   */
  validateRule(ruleDefinition: unknown): RuleValidationResult {
    const errors: RuleValidationError[] = [];
    
    // Check if it's an object
    if (typeof ruleDefinition !== 'object' || ruleDefinition === null) {
      errors.push({
        type: RuleValidationErrorType.INVALID_FIELD_TYPE,
        message: 'Rule definition must be an object',
        path: 'rule'
      });
      
      return { valid: false, errors };
    }
    
    // Check if it has rootGroup
    const typedDefinition = ruleDefinition as Partial<SegmentRuleDefinition>;
    if (!typedDefinition.rootGroup) {
      errors.push({
        type: RuleValidationErrorType.MISSING_FIELD,
        message: 'Rule definition must have a rootGroup property',
        path: 'rule'
      });
      
      return { valid: false, errors };
    }
    
    // Validate the root group
    this.validateGroup(typedDefinition.rootGroup, 'rootGroup', errors);
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate a rule group
   */
  private validateGroup(
    group: unknown, 
    path: string, 
    errors: RuleValidationError[]
  ): void {
    // Check if it's an object
    if (typeof group !== 'object' || group === null) {
      errors.push({
        type: RuleValidationErrorType.INVALID_FIELD_TYPE,
        message: 'Rule group must be an object',
        path
      });
      return;
    }
    
    const typedGroup = group as Partial<RuleGroupProps>;
    
    // Validate operator
    if (!typedGroup.operator) {
      errors.push({
        type: RuleValidationErrorType.MISSING_FIELD,
        message: 'Group must have an operator (and/or)',
        path: `${path}.operator`
      });
    } else if (typedGroup.operator !== 'and' && typedGroup.operator !== 'or') {
      errors.push({
        type: RuleValidationErrorType.INVALID_OPERATOR,
        message: 'Group operator must be "and" or "or"',
        path: `${path}.operator`,
        details: { value: typedGroup.operator }
      });
    }
    
    // Check for conditions or nested groups
    const hasConditions = Array.isArray(typedGroup.conditions) && typedGroup.conditions.length > 0;
    const hasGroups = Array.isArray(typedGroup.groups) && typedGroup.groups.length > 0;
    
    if (!hasConditions && !hasGroups) {
      errors.push({
        type: RuleValidationErrorType.EMPTY_GROUP,
        message: 'Group must have at least one condition or nested group',
        path
      });
    }
    
    // Validate conditions
    if (typedGroup.conditions) {
      if (!Array.isArray(typedGroup.conditions)) {
        errors.push({
          type: RuleValidationErrorType.INVALID_FIELD_TYPE,
          message: 'Conditions must be an array',
          path: `${path}.conditions`
        });
      } else {
        typedGroup.conditions.forEach((condition, index) => {
          this.validateCondition(condition, `${path}.conditions[${index}]`, errors);
        });
      }
    }
    
    // Validate nested groups
    if (typedGroup.groups) {
      if (!Array.isArray(typedGroup.groups)) {
        errors.push({
          type: RuleValidationErrorType.INVALID_FIELD_TYPE,
          message: 'Groups must be an array',
          path: `${path}.groups`
        });
      } else {
        typedGroup.groups.forEach((nestedGroup, index) => {
          this.validateGroup(nestedGroup, `${path}.groups[${index}]`, errors);
        });
      }
    }
  }
  
  /**
   * Validate a condition
   */
  private validateCondition(
    condition: unknown, 
    path: string, 
    errors: RuleValidationError[]
  ): void {
    // Check if it's an object
    if (typeof condition !== 'object' || condition === null) {
      errors.push({
        type: RuleValidationErrorType.INVALID_FIELD_TYPE,
        message: 'Condition must be an object',
        path
      });
      return;
    }
    
    const typedCondition = condition as Partial<ConditionProps>;
    
    // Validate field
    if (!typedCondition.field) {
      errors.push({
        type: RuleValidationErrorType.MISSING_FIELD,
        message: 'Condition must have a field property',
        path: `${path}.field`
      });
    } else if (typeof typedCondition.field !== 'string') {
      errors.push({
        type: RuleValidationErrorType.INVALID_FIELD_TYPE,
        message: 'Field must be a string',
        path: `${path}.field`,
        details: { type: typeof typedCondition.field }
      });
    } else if (!this.knownFields.has(typedCondition.field)) {
      // Check if the field exists in the known fields set
      errors.push({
        type: RuleValidationErrorType.UNKNOWN_FIELD,
        message: `Unknown field: "${typedCondition.field}"`,
        path: `${path}.field`,
        details: { field: typedCondition.field }
      });
    }
    
    // Validate operator
    if (!typedCondition.operator) {
      errors.push({
        type: RuleValidationErrorType.MISSING_FIELD,
        message: 'Condition must have an operator property',
        path: `${path}.operator`
      });
    } else {
      // Check if operator is one of the valid operators
      const validOperators = [
        'equals', 'not_equals', 'contains', 'not_contains', 
        'starts_with', 'ends_with', 'greater_than', 'less_than',
        'greater_than_or_equals', 'less_than_or_equals', 'in',
        'not_in', 'is_empty', 'is_not_empty', 'exists', 'not_exists',
        'has_any', 'has_all'
      ];
      
      if (!validOperators.includes(typedCondition.operator as string)) {
        errors.push({
          type: RuleValidationErrorType.INVALID_OPERATOR,
          message: `Invalid operator: "${typedCondition.operator}"`,
          path: `${path}.operator`,
          details: { 
            value: typedCondition.operator,
            validOperators 
          }
        });
      }
    }
    
    // Validate value based on operator
    const operator = typedCondition.operator as SegmentRuleOperator;
    
    // For these operators, a value is not needed
    const noValueOperators = ['is_empty', 'is_not_empty', 'exists', 'not_exists'];
    
    // For these operators, value must be an array
    const arrayValueOperators = ['in', 'not_in', 'has_any', 'has_all'];
    
    if (operator && !noValueOperators.includes(operator) && typedCondition.value === undefined) {
      errors.push({
        type: RuleValidationErrorType.MISSING_VALUE,
        message: `Value is required for operator: "${operator}"`,
        path: `${path}.value`
      });
    } else if (operator && arrayValueOperators.includes(operator) && 
              (!Array.isArray(typedCondition.value))) {
      errors.push({
        type: RuleValidationErrorType.INVALID_VALUE_TYPE,
        message: `Value must be an array for operator: "${operator}"`,
        path: `${path}.value`,
        details: { type: typeof typedCondition.value }
      });
    }
  }
  
  /**
   * Check if a field value is valid for a given operator and value
   * This is useful for field-specific validations
   */
  isValueValidForField(field: string, operator: SegmentRuleOperator, value: any): boolean {
    // For some field types, we can validate the value is appropriate
    // This is a simple implementation that could be expanded
    
    if (field === 'dateOfBirth' || field === 'employment.hireDate' || 
        field.includes('Date') || field.endsWith('At')) {
      // Date fields
      if (['greater_than', 'less_than', 'greater_than_or_equals', 'less_than_or_equals'].includes(operator)) {
        try {
          // Check if value can be parsed as a date
          new Date(value);
          return true;
        } catch (e) {
          return false;
        }
      }
    } else if (field === 'gender') {
      // Enum field
      if (operator === 'equals' || operator === 'not_equals' || operator === 'in' || operator === 'not_in') {
        const validGenders = ['male', 'female', 'non_binary', 'other', 'prefer_not_say'];
        return Array.isArray(value) 
          ? value.every(v => validGenders.includes(v))
          : validGenders.includes(value);
      }
    }
    
    // For other fields/operators, assume valid
    return true;
  }
  
  /**
   * Get suggestions for correcting rule validation errors
   */
  getSuggestions(errors: RuleValidationError[]): Record<string, string> {
    const suggestions: Record<string, string> = {};
    
    for (const error of errors) {
      switch (error.type) {
        case RuleValidationErrorType.UNKNOWN_FIELD:
          suggestions[error.path] = 'Use one of the known worker fields or add this as a custom field';
          break;
        case RuleValidationErrorType.INVALID_OPERATOR:
          suggestions[error.path] = 'Fix the operator to one of the valid types (equals, contains, etc.)';
          break;
        case RuleValidationErrorType.EMPTY_GROUP:
          suggestions[error.path] = 'Add at least one condition or nested group';
          break;
        case RuleValidationErrorType.INVALID_VALUE_TYPE:
          if (error.path.includes('in') || error.path.includes('has_')) {
            suggestions[error.path] = 'Provide an array value for this operator, e.g., ["value1", "value2"]';
          }
          break;
        default:
          // No specific suggestion
          break;
      }
    }
    
    return suggestions;
  }
} 