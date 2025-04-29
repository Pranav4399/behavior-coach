import { SegmentCondition, SegmentRule } from './segment';

// Available worker attributes for conditions
export type WorkerAttribute =
  // Base attributes
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'externalId'
  | 'gender'
  | 'isActive'
  | 'tags'
  | 'dateOfBirth'
  | 'customFields'
  | 'deactivationReason'
  | 'supervisorId'
  
  // Employment attributes
  | 'employment.jobTitle'
  | 'employment.department'
  | 'employment.team'
  | 'employment.hireDate'
  | 'employment.employmentStatus'
  | 'employment.employmentType'
  
  // Contact attributes
  | 'contact.primaryPhoneNumber'
  | 'contact.emailAddress'
  | 'contact.locationCity'
  | 'contact.locationStateProvince'
  | 'contact.locationCountry'
  | 'contact.preferredLanguage'
  | 'contact.whatsappOptInStatus'
  | 'contact.communicationConsent'
  
  // Engagement attributes
  | 'engagement.lastEngagementDate'
  | 'engagement.lastActiveAt'
  | 'engagement.lastInteractionDate'
  | 'engagement.engagementRate'
  
  // Wellbeing attributes
  | 'wellbeing.wellbeingScore'
  | 'wellbeing.overallWellbeingScore'
  | 'wellbeing.lastWellbeingCheckDate'
  | 'wellbeing.lastWellbeingAssessmentDate'
  
  // Gamification attributes
  | 'gamification.pointsBalance'
  | 'gamification.badgesEarnedCount';

// Readable labels for worker attributes
export const WORKER_ATTRIBUTE_LABELS: Record<WorkerAttribute, string> = {
  // Base attributes
  firstName: 'First Name',
  lastName: 'Last Name',
  fullName: 'Full Name',
  externalId: 'Worker ID',
  gender: 'Gender',
  isActive: 'Active Status',
  tags: 'Tags',
  dateOfBirth: 'Date of Birth',
  customFields: 'Custom Fields',
  deactivationReason: 'Deactivation Reason',
  supervisorId: 'Supervisor ID',
  
  // Employment attributes
  'employment.jobTitle': 'Job Title',
  'employment.department': 'Department',
  'employment.team': 'Team',
  'employment.hireDate': 'Hire Date',
  'employment.employmentStatus': 'Employment Status',
  'employment.employmentType': 'Employment Type',
  
  // Contact attributes
  'contact.primaryPhoneNumber': 'Phone Number',
  'contact.emailAddress': 'Email Address',
  'contact.locationCity': 'City',
  'contact.locationStateProvince': 'State/Province',
  'contact.locationCountry': 'Country',
  'contact.preferredLanguage': 'Preferred Language',
  'contact.whatsappOptInStatus': 'WhatsApp Opt-in Status',
  'contact.communicationConsent': 'Communication Consent',
  
  // Engagement attributes
  'engagement.lastEngagementDate': 'Last Engagement Date',
  'engagement.lastActiveAt': 'Last Active At',
  'engagement.lastInteractionDate': 'Last Interaction Date',
  'engagement.engagementRate': 'Engagement Rate',
  
  // Wellbeing attributes
  'wellbeing.wellbeingScore': 'Wellbeing Score',
  'wellbeing.overallWellbeingScore': 'Overall Wellbeing Score',
  'wellbeing.lastWellbeingCheckDate': 'Last Wellbeing Check Date',
  'wellbeing.lastWellbeingAssessmentDate': 'Last Wellbeing Assessment Date',
  
  // Gamification attributes
  'gamification.pointsBalance': 'Points Balance',
  'gamification.badgesEarnedCount': 'Badges Earned Count',
};

// Attribute type mapping
export const WORKER_ATTRIBUTE_TYPES: Record<WorkerAttribute, 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'> = {
  // Base attributes
  firstName: 'string',
  lastName: 'string',
  fullName: 'string',
  externalId: 'string',
  gender: 'string',
  isActive: 'boolean',
  tags: 'array',
  dateOfBirth: 'date',
  customFields: 'object',
  deactivationReason: 'string',
  supervisorId: 'string',
  
  // Employment attributes
  'employment.jobTitle': 'string',
  'employment.department': 'string',
  'employment.team': 'string',
  'employment.hireDate': 'date',
  'employment.employmentStatus': 'string',
  'employment.employmentType': 'string',
  
  // Contact attributes
  'contact.primaryPhoneNumber': 'string',
  'contact.emailAddress': 'string',
  'contact.locationCity': 'string',
  'contact.locationStateProvince': 'string',
  'contact.locationCountry': 'string',
  'contact.preferredLanguage': 'string',
  'contact.whatsappOptInStatus': 'string',
  'contact.communicationConsent': 'boolean',
  
  // Engagement attributes
  'engagement.lastEngagementDate': 'date',
  'engagement.lastActiveAt': 'date',
  'engagement.lastInteractionDate': 'date',
  'engagement.engagementRate': 'number',
  
  // Wellbeing attributes
  'wellbeing.wellbeingScore': 'number',
  'wellbeing.overallWellbeingScore': 'number',
  'wellbeing.lastWellbeingCheckDate': 'date',
  'wellbeing.lastWellbeingAssessmentDate': 'date',
  
  // Gamification attributes
  'gamification.pointsBalance': 'number',
  'gamification.badgesEarnedCount': 'number',
};

// Operators available for condition building
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'in_list'
  | 'not_in_list';

// Readable labels for condition operators
export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals: 'Equals',
  not_equals: 'Not Equals',
  contains: 'Contains',
  not_contains: 'Does Not Contain',
  starts_with: 'Starts With',
  ends_with: 'Ends With',
  greater_than: 'Greater Than',
  less_than: 'Less Than',
  in_list: 'In List',
  not_in_list: 'Not In List',
};

// Type for rule group operations
export type LogicalOperator = 'all' | 'any' | 'none';

// Readable labels for logical operators
export const LOGICAL_OPERATOR_LABELS: Record<LogicalOperator, string> = {
  all: 'AND (All Conditions)',
  any: 'OR (Any Condition)',
  none: 'NOT (None of the Conditions)',
};

// Props for RuleCondition component
export interface RuleConditionProps {
  condition: SegmentCondition;
  onUpdate: (updatedCondition: SegmentCondition) => void;
  onDelete: () => void;
}

// Props for RuleGroup component
export interface RuleGroupProps {
  rule: SegmentRule;
  onUpdate: (updatedRule: SegmentRule) => void;
  onDelete: () => void;
  isRoot?: boolean;
}

// Props for the main RuleBuilder component
export interface RuleBuilderProps {
  initialRule?: SegmentRule;
  onChange: (rule: SegmentRule) => void;
}

// Helper function to create a new empty condition
export const createEmptyCondition = (attribute?: WorkerAttribute): SegmentCondition => {
  const selectedAttribute = attribute || 'firstName';
  const attributeType = WORKER_ATTRIBUTE_TYPES[selectedAttribute];
  
  // Set default value based on attribute type
  let defaultValue: string | number | string[] = '';
  if (attributeType === 'boolean') {
    defaultValue = 'true';
  } else if (attributeType === 'array') {
    defaultValue = [];
  } else if (attributeType === 'number') {
    defaultValue = 0;
  } else if (attributeType === 'date') {
    defaultValue = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  }
  
  // Select appropriate default operator based on attribute type
  let defaultOperator: ConditionOperator = 'equals';
  if (attributeType === 'array') {
    defaultOperator = 'contains';
  } else if (attributeType === 'string' && (
    selectedAttribute.includes('name') || 
    selectedAttribute.includes('title') ||
    selectedAttribute.includes('City') ||
    selectedAttribute.includes('Country') ||
    selectedAttribute.includes('department')
  )) {
    defaultOperator = 'contains'; // Better default for name-like fields
  }
  
  return {
    attribute: selectedAttribute as string, // Cast to match SegmentCondition interface
    operator: defaultOperator,
    value: defaultValue,
  };
};

// Helper function to create a new rule group
export const createEmptyRule = (): SegmentRule => ({
  type: 'all',
  conditions: [createEmptyCondition()],
}); 