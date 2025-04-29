import { SegmentRule, SegmentCondition } from '@/types/segment';

/**
 * Transforms a segment rule from the frontend format (type/conditions) to
 * the backend format (rootGroup with operator/conditions)
 * 
 * @param rule The rule in frontend format
 * @returns The rule in backend format
 */
export function transformRuleToBackendFormat(rule: SegmentRule | any): any {
  if (!rule) return null;
  
  // If the rule already has rootGroup, assume it's already in the correct format
  if ('rootGroup' in rule) {
    // Even if it has rootGroup, we need to ensure any conditions inside use 'field' not 'attribute'
    const rootGroup = rule.rootGroup;
    if (rootGroup && rootGroup.conditions && Array.isArray(rootGroup.conditions)) {
      rootGroup.conditions = rootGroup.conditions.map(convertCondition);
    }
    return rule;
  }
  
  // Convert frontend format to backend format
  return {
    rootGroup: {
      operator: convertTypeToOperator(rule.type),
      conditions: rule.conditions.map(convertCondition)
    }
  };
}

/**
 * Converts a condition or nested rule from frontend format to backend format
 */
function convertCondition(condition: SegmentRule | SegmentCondition): any {
  // If it's a nested rule (has type and conditions)
  if ('type' in condition && 'conditions' in condition) {
    return {
      operator: convertTypeToOperator(condition.type),
      conditions: condition.conditions.map(convertCondition)
    };
  }
  
  // Otherwise it's a simple condition, convert attribute name to field
  if ('attribute' in condition) {
    return {
      field: condition.attribute,
      operator: condition.operator,
      value: condition.value
    };
  }
  
  // Return as is for other cases (already has field property)
  return condition;
}

/**
 * Converts a frontend rule type to a backend operator string
 */
function convertTypeToOperator(type: 'any' | 'all' | 'none'): string {
  switch (type) {
    case 'any':
      return 'or';
    case 'all':
      return 'and';
    case 'none':
      return 'not';
    default:
      return 'and'; // Default to AND if type is not recognized
  }
}

/**
 * Transforms a segment rule from the backend format (rootGroup) to
 * the frontend format (type/conditions)
 * 
 * This is useful when receiving rule definitions from the API
 * 
 * @param backendRule The rule in backend format
 * @returns The rule in frontend format
 */
export function transformRuleToFrontendFormat(backendRule: any): SegmentRule | null {
  if (!backendRule) return null;
  
  // If the rule already has type and conditions, assume it's already in frontend format
  if ('type' in backendRule && 'conditions' in backendRule) {
    return backendRule as SegmentRule;
  }
  
  // If no rootGroup, cannot convert
  if (!backendRule.rootGroup) return null;
  
  // Convert backend format to frontend format
  return {
    type: convertOperatorToType(backendRule.rootGroup.operator),
    conditions: backendRule.rootGroup.conditions.map(convertBackendCondition)
  };
}

/**
 * Converts a backend condition or nested rule to frontend format
 */
function convertBackendCondition(backendCondition: any): SegmentRule | SegmentCondition {
  // If it has operator and conditions, it's a nested rule
  if ('operator' in backendCondition && 'conditions' in backendCondition) {
    return {
      type: convertOperatorToType(backendCondition.operator),
      conditions: backendCondition.conditions.map(convertBackendCondition)
    };
  }
  
  // Otherwise it's a simple condition, convert field to attribute
  if ('field' in backendCondition) {
    return {
      attribute: backendCondition.field,
      operator: backendCondition.operator,
      value: backendCondition.value
    } as SegmentCondition;
  }
  
  // Return as is for other cases (already has attribute property)
  return backendCondition as SegmentCondition;
}

/**
 * Converts a backend operator to a frontend rule type
 */
function convertOperatorToType(operator: string): 'any' | 'all' | 'none' {
  switch (operator) {
    case 'or':
      return 'any';
    case 'and':
      return 'all';
    case 'not':
      return 'none';
    default:
      return 'all'; // Default to ALL if operator is not recognized
  }
}

/**
 * Converts a segment rule to a human-readable format
 * 
 * @param rule The rule to format
 * @returns A human-readable string representation of the rule
 */
export function formatRuleForDisplay(rule: SegmentRule | null): string {
  if (!rule) return 'No rule defined';
  
  return formatRuleGroup(rule);
}

/**
 * Formats a rule group (type + conditions) into a human-readable string
 */
function formatRuleGroup(rule: SegmentRule, nestLevel = 0): string {
  const indent = '  '.repeat(nestLevel);
  const typeText = getTypeText(rule.type);
  
  if (!rule.conditions || rule.conditions.length === 0) {
    return `${indent}${typeText} of the following: (empty)`;
  }
  
  const formattedConditions = rule.conditions.map(condition => {
    if ('type' in condition && 'conditions' in condition) {
      // This is a nested rule
      return formatRuleGroup(condition as SegmentRule, nestLevel + 1);
    } else {
      // This is a condition
      return formatCondition(condition as SegmentCondition, nestLevel + 1);
    }
  });
  
  return `${indent}${typeText} of the following:\n${formattedConditions.join('\n')}`;
}

/**
 * Returns the text representation of a rule type
 */
function getTypeText(type: 'any' | 'all' | 'none'): string {
  switch (type) {
    case 'any':
      return 'ANY';
    case 'all':
      return 'ALL';
    case 'none':
      return 'NONE';
    default:
      return 'ALL';
  }
}

/**
 * Formats a single condition into a human-readable string
 */
function formatCondition(condition: SegmentCondition, nestLevel = 0): string {
  const indent = '  '.repeat(nestLevel);
  const attribute = condition.attribute;
  const operator = formatOperator(condition.operator);
  const value = formatValue(condition.value);
  
  return `${indent}${attribute} ${operator} ${value}`;
}

/**
 * Formats an operator into a human-readable string
 */
function formatOperator(operator: string): string {
  switch (operator) {
    case 'equals':
      return 'equals';
    case 'not_equals':
      return 'does not equal';
    case 'contains':
      return 'contains';
    case 'not_contains':
      return 'does not contain';
    case 'starts_with':
      return 'starts with';
    case 'ends_with':
      return 'ends with';
    case 'greater_than':
      return 'is greater than';
    case 'less_than':
      return 'is less than';
    case 'in_list':
      return 'is in';
    case 'not_in_list':
      return 'is not in';
    default:
      return operator;
  }
}

/**
 * Formats a value into a human-readable string
 */
function formatValue(value: string | number | string[]): string {
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  
  return String(value);
} 