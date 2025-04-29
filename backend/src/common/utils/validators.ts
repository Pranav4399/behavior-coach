/**
 * Common validator functions for CSV fields
 */

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns Error message or null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return null; // Empty is handled by required validation
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address format';
  }
  
  return null;
};

/**
 * Validates a date string
 * @param date The date string to validate (YYYY-MM-DD)
 * @returns Error message or null if valid
 */
export const validateDate = (date: string): string | null => {
  if (!date) return null; // Empty is handled by required validation
  
  // Validate format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return 'Invalid date format. Expected YYYY-MM-DD';
  }
  
  // Validate if it's a real date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }
  
  return null;
};

/**
 * Validates a phone number
 * @param phone The phone number to validate
 * @returns Error message or null if valid
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) return null; // Empty is handled by required validation
  
  // Basic phone validation (allow +, spaces, -, and numbers)
  const phoneRegex = /^[+\d\s-]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  
  return null;
};

/**
 * Validates a boolean value (true/false, yes/no, 1/0)
 * @param value The boolean value to validate
 * @returns Error message or null if valid
 */
export const validateBoolean = (value: string): string | null => {
  if (!value) return null; // Empty is handled by required validation
  
  const validValues = ['true', 'false', 'yes', 'no', '1', '0'];
  if (!validValues.includes(value.toLowerCase())) {
    return 'Invalid boolean value. Expected true/false, yes/no, or 1/0';
  }
  
  return null;
};

/**
 * Transforms a string to a boolean
 * @param value The string to transform
 * @returns Boolean value
 */
export const transformToBoolean = (value: string): boolean => {
  if (!value) return false;
  
  const trueValues = ['true', 'yes', '1'];
  return trueValues.includes(value.toLowerCase());
};

/**
 * Validates that a value is one of the allowed values
 * @param allowedValues Array of allowed values
 * @returns Validator function
 */
export const validateEnum = (allowedValues: string[]) => {
  return (value: string): string | null => {
    if (!value) return null; // Empty is handled by required validation
    
    if (!allowedValues.includes(value)) {
      return `Invalid value. Expected one of: ${allowedValues.join(', ')}`;
    }
    
    return null;
  };
};

/**
 * Validates a comma-separated list of tags
 * @param tags The tags string to validate
 * @returns Error message or null if valid
 */
export const validateTags = (tags: string): string | null => {
  if (!tags) return null; // Empty is handled by required validation
  
  // Remove double quotes if present (common in CSV)
  const cleanedTags = tags.replace(/^"(.*)"$/, '$1');
  
  // Validate that tags are comma-separated
  const tagsRegex = /^[a-zA-Z0-9_\-,\s]+$/;
  if (!tagsRegex.test(cleanedTags)) {
    return 'Invalid tags format. Tags should be comma-separated';
  }
  
  return null;
};

/**
 * Transforms a comma-separated string of tags to an array
 * @param tagsString The tags string to transform
 * @returns Array of tags
 */
export const transformTags = (tagsString: string): string[] => {
  if (!tagsString) return [];
  
  // Remove double quotes if present (common in CSV)
  const cleanedTags = tagsString.replace(/^"(.*)"$/, '$1');
  
  // Split by comma and trim whitespace
  return cleanedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
};

/**
 * Validates a numeric value
 * @param value The value to validate
 * @returns Error message or null if valid
 */
export const validateNumber = (value: string): string | null => {
  if (!value) return null; // Empty is handled by required validation
  
  if (isNaN(Number(value))) {
    return 'Invalid number format';
  }
  
  return null;
};

/**
 * Transforms a string to a number
 * @param value The string to transform
 * @returns Number value
 */
export const transformToNumber = (value: string): number => {
  if (!value) return 0;
  
  return Number(value);
}; 