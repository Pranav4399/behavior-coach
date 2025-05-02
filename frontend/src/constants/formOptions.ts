/**
 * Common form options shared between the rule engine and form components
 * This helps maintain consistency across the application
 */

import { 
  ATTRIBUTE_OPTIONS, 
  AttributeOption 
} from '@/constants/rules';

// Export specific options for direct use in form components
export const GENDER_OPTIONS = ATTRIBUTE_OPTIONS.gender;
export const EMPLOYMENT_STATUS_OPTIONS = ATTRIBUTE_OPTIONS['employment.employmentStatus'];
export const EMPLOYMENT_TYPE_OPTIONS = ATTRIBUTE_OPTIONS['employment.employmentType'];
export const DEPARTMENT_OPTIONS = ATTRIBUTE_OPTIONS['employment.department'];
export const JOB_TITLE_OPTIONS = ATTRIBUTE_OPTIONS['employment.jobTitle'];
export const DEACTIVATION_REASON_OPTIONS = ATTRIBUTE_OPTIONS.deactivationReason;
export const WHATSAPP_OPTIN_OPTIONS = ATTRIBUTE_OPTIONS['contact.whatsappOptInStatus'];
export const PREFERRED_LANGUAGE_OPTIONS = ATTRIBUTE_OPTIONS['contact.preferredLanguage'];
export const LOCATION_COUNTRY_OPTIONS = ATTRIBUTE_OPTIONS['contact.locationCountry'];
export const LOCATION_STATE_OPTIONS = ATTRIBUTE_OPTIONS['contact.locationStateProvince'];

/**
 * Helper function to convert options to SelectItem compatible format
 * Useful for form components that use different property names
 */
export function mapOptionsToSelectItems<T extends string>(
  options: AttributeOption[],
  valueKey: string = 'value',
  labelKey: string = 'label'
): Record<string, any>[] {
  return options.map(option => ({
    [valueKey]: option.value as T,
    [labelKey]: option.label
  }));
}

/**
 * Get the label for a given value from options
 */
export function getLabelForValue(options: AttributeOption[], value: string): string {
  const option = options.find(opt => opt.value === value);
  return option?.label || value;
}

/**
 * Helper function to get options for a specific attribute
 */
export function getOptionsForAttribute(attribute: string): AttributeOption[] {
  return ATTRIBUTE_OPTIONS[attribute as keyof typeof ATTRIBUTE_OPTIONS] || [];
} 