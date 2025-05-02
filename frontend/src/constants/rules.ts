/**
 * Predefined options for worker attribute fields in the rule engine
 * These options provide user-friendly dropdowns for various field types
 */

export interface AttributeOption {
  value: string;
  label: string;
}

// Extended option types to support different control types
export interface ControlConfig {
  type: 'dropdown' | 'range' | 'slider' | 'radio' | 'date-range' | 'multi-select';
  options?: AttributeOption[];
  min?: number;
  max?: number;
  step?: number;
  format?: string;
}

export type AttributeOptionsMap = Record<string, AttributeOption[]>;
export type ControlConfigMap = Record<string, ControlConfig>;

// Standard dropdown options
export const ATTRIBUTE_OPTIONS: AttributeOptionsMap = {
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_say', label: 'Prefer not to say' },
  ],
  'employment.employmentStatus': [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
  ],
  'employment.employmentType': [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'intern', label: 'Intern' },
    { value: 'fellow', label: 'Fellow' },
  ],
  'employment.department': [
    { value: 'Program Management', label: 'Program Management' },
    { value: 'Field Operations', label: 'Field Operations' },
    { value: 'Community Outreach', label: 'Community Outreach' },
    { value: 'Fundraising', label: 'Fundraising' },
    { value: 'Donor Relations', label: 'Donor Relations' },
    { value: 'Grants Management', label: 'Grants Management' },
    { value: 'Monitoring and Evaluation', label: 'Monitoring and Evaluation' },
    { value: 'Advocacy', label: 'Advocacy' },
    { value: 'Communications', label: 'Communications' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Administration', label: 'Administration' },
    { value: 'IT', label: 'IT' },
    { value: 'Volunteer Coordination', label: 'Volunteer Coordination' },
    { value: 'Research', label: 'Research' },
  ],
  'employment.jobTitle': [
    { value: 'Program Manager', label: 'Program Manager' },
    { value: 'Project Coordinator', label: 'Project Coordinator' },
    { value: 'Field Officer', label: 'Field Officer' },
    { value: 'Community Mobilizer', label: 'Community Mobilizer' },
    { value: 'Fundraising Manager', label: 'Fundraising Manager' },
    { value: 'Grant Writer', label: 'Grant Writer' },
    { value: 'M&E Officer', label: 'M&E Officer' },
    { value: 'Advocacy Officer', label: 'Advocacy Officer' },
    { value: 'Communications Officer', label: 'Communications Officer' },
    { value: 'Social Media Coordinator', label: 'Social Media Coordinator' },
    { value: 'Volunteer Coordinator', label: 'Volunteer Coordinator' },
    { value: 'Counselor', label: 'Counselor' },
    { value: 'Social Worker', label: 'Social Worker' },
    { value: 'Director', label: 'Director' },
    { value: 'Executive Director', label: 'Executive Director' },
    { value: 'Board Member', label: 'Board Member' },
    { value: 'Researcher', label: 'Researcher' },
    { value: 'Trainer', label: 'Trainer' },
    { value: 'Consultant', label: 'Consultant' },
  ],
  deactivationReason: [
    { value: 'voluntary_resignation', label: 'Voluntary Resignation' },
    { value: 'performance_issues', label: 'Performance Issues' },
    { value: 'policy_violation', label: 'Policy Violation' },
    { value: 'redundancy', label: 'Redundancy' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'end_of_contract', label: 'End of Contract' },
    { value: 'other', label: 'Other' },
  ],
  'contact.whatsappOptInStatus': [
    { value: 'opted_in', label: 'Opted In' },
    { value: 'opted_out', label: 'Opted Out' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ],
  'contact.preferredLanguage': [
    { value: 'hi', label: 'Hindi' },
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'Bengali' },
    { value: 'te', label: 'Telugu' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'ur', label: 'Urdu' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'as', label: 'Assamese' },
    { value: 'or', label: 'Odia' },
    { value: 'ks', label: 'Kashmiri' },
    { value: 'sd', label: 'Sindhi' },
    { value: 'sa', label: 'Sanskrit' },
  ],
  'contact.locationCountry': [
    { value: 'IN', label: 'India' },
  ],
  'contact.locationStateProvince': [
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UK', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' },
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'PY', label: 'Puducherry' },
  ],
};

// Advanced control configurations
export const CONTROL_CONFIG: ControlConfigMap = {
  'wellbeing.wellbeingScore': {
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
  },
  'wellbeing.overallWellbeingScore': {
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
  },
  'engagement.engagementRate': {
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
  },
  'tags': {
    type: 'multi-select',
    options: [
      { value: 'high_performer', label: 'High Performer' },
      { value: 'leadership_potential', label: 'Leadership Potential' },
      { value: 'field_worker', label: 'Field Worker' },
      { value: 'new_joiner', label: 'New Joiner' },
      { value: 'mentor', label: 'Mentor' },
      { value: 'core_team', label: 'Core Team' },
      { value: 'volunteer', label: 'Volunteer' },
      { value: 'community_leader', label: 'Community Leader' },
    ],
  },
};

/**
 * Helper function to check if a given attribute has predefined options
 */
export function hasAttributeOptions(attribute: string): boolean {
  return attribute in ATTRIBUTE_OPTIONS;
}

/**
 * Helper function to get options for an attribute
 */
export function getAttributeOptions(attribute: string): AttributeOption[] {
  return ATTRIBUTE_OPTIONS[attribute] || [];
}

/**
 * Helper function to check if an attribute has a specialized control type
 */
export function hasSpecializedControl(attribute: string): boolean {
  return attribute in CONTROL_CONFIG;
}

/**
 * Helper function to get control configuration for an attribute
 */
export function getControlConfig(attribute: string): ControlConfig | null {
  return CONTROL_CONFIG[attribute] || null;
}

/**
 * Get a human-readable label for an attribute value
 */
export function getAttributeValueLabel(attribute: string, value: string): string {
  if (!hasAttributeOptions(attribute)) return value;
  
  const option = ATTRIBUTE_OPTIONS[attribute]?.find(opt => opt.value === value);
  return option?.label || value;
} 