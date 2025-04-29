import { 
  Gender, 
  OptInStatus, 
  EmploymentStatus, 
  EmploymentType, 
  DeactivationReason 
} from '../models/worker.model';
import csvService, { 
  CsvFieldValidator, 
  CsvParseResult, 
  ErrorSeverity,
  CsvValidationError
} from '../../../common/utils/csv.service';
import { 
  validateEmail, 
  validateDate, 
  validatePhone, 
  validateBoolean, 
  transformToBoolean, 
  validateEnum, 
  validateTags, 
  transformTags,
  validateNumber,
  transformToNumber
} from '../../../common/utils/validators';

// Define the worker CSV record interface to match CSV columns
export interface WorkerCsvRecord {
  firstName: string;
  lastName: string;
  middleName?: string;
  displayName?: string;
  externalId?: string;
  dateOfBirth?: string;
  gender?: Gender;
  avatarUrl?: string;
  primaryTag?: string;
  tags?: string[];
  isActive: boolean;
  deactivationReason?: DeactivationReason;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  emailAddress?: string;
  primaryEmailAddress?: string;
  secondaryEmailAddress?: string;
  whatsappOptInStatus?: OptInStatus;
  preferredLanguage?: string;
  communicationConsent?: boolean;
  locationCity?: string;
  locationStateProvince?: string;
  locationCountry?: string;
  jobTitle?: string;
  department?: string;
  team?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  hireDate?: string;
  lastActiveAt?: string;
  lastInteractionDate?: string;
  lastEngagementDate?: string;
  engagementRate?: number;
  wellbeingScore?: number;
  overallWellbeingScore?: number;
  lastWellbeingCheckDate?: string;
  lastWellbeingAssessmentDate?: string;
  pointsBalance?: number;
  badgesEarnedCount?: number;
}

// Define a mapping from CSV headers to display names
export const workerCsvHeaders = [
  { key: 'firstName', header: 'First Name (Required)' },
  { key: 'lastName', header: 'Last Name (Required)' },
  { key: 'middleName', header: 'Middle Name' },
  { key: 'displayName', header: 'Display Name' },
  { key: 'externalId', header: 'External ID (Recommended for Updates)' },
  { key: 'dateOfBirth', header: 'Date of Birth (YYYY-MM-DD)' },
  { key: 'gender', header: 'Gender (male/female/non_binary/other/prefer_not_say)' },
  { key: 'avatarUrl', header: 'Avatar URL' },
  { key: 'primaryTag', header: 'Primary Tag' },
  { key: 'tags', header: 'Tags (Comma Separated)' },
  { key: 'isActive', header: 'Is Active (true/false, Required)' },
  { key: 'deactivationReason', header: 'Deactivation Reason (Only if isActive=false)' },
  { key: 'primaryPhoneNumber', header: 'Primary Phone Number (Required)' },
  { key: 'secondaryPhoneNumber', header: 'Secondary Phone Number' },
  { key: 'emailAddress', header: 'Email Address' },
  { key: 'primaryEmailAddress', header: 'Primary Email Address' },
  { key: 'secondaryEmailAddress', header: 'Secondary Email Address' },
  { key: 'whatsappOptInStatus', header: 'WhatsApp Opt-In Status (opted_in/opted_out/pending/failed)' },
  { key: 'preferredLanguage', header: 'Preferred Language (e.g. en, hi, fr)' },
  { key: 'communicationConsent', header: 'Communication Consent (true/false)' },
  { key: 'locationCity', header: 'City' },
  { key: 'locationStateProvince', header: 'State/Province' },
  { key: 'locationCountry', header: 'Country' },
  { key: 'jobTitle', header: 'Job Title' },
  { key: 'department', header: 'Department' },
  { key: 'team', header: 'Team' },
  { key: 'employmentStatus', header: 'Employment Status (active/inactive/on_leave/terminated)' },
  { key: 'employmentType', header: 'Employment Type (full_time/part_time/contractor/temporary)' },
  { key: 'hireDate', header: 'Hire Date (YYYY-MM-DD)' },
  { key: 'lastActiveAt', header: 'Last Active At (YYYY-MM-DD)' },
  { key: 'lastInteractionDate', header: 'Last Interaction Date (YYYY-MM-DD)' },
  { key: 'lastEngagementDate', header: 'Last Engagement Date (YYYY-MM-DD)' },
  { key: 'engagementRate', header: 'Engagement Rate (0-100)' },
  { key: 'wellbeingScore', header: 'Wellbeing Score (0-100)' },
  { key: 'overallWellbeingScore', header: 'Overall Wellbeing Score (0-100)' },
  { key: 'lastWellbeingCheckDate', header: 'Last Wellbeing Check Date (YYYY-MM-DD)' },
  { key: 'lastWellbeingAssessmentDate', header: 'Last Wellbeing Assessment Date (YYYY-MM-DD)' },
  { key: 'pointsBalance', header: 'Points Balance' },
  { key: 'badgesEarnedCount', header: 'Badges Earned Count' }
];

// Map CSV fields to user-friendly display names for error messages
export const headerDisplayMap: Record<string, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  middleName: 'Middle Name',
  displayName: 'Display Name',
  externalId: 'External ID',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  avatarUrl: 'Avatar URL',
  primaryTag: 'Primary Tag',
  tags: 'Tags',
  isActive: 'Is Active',
  deactivationReason: 'Deactivation Reason',
  primaryPhoneNumber: 'Primary Phone Number',
  secondaryPhoneNumber: 'Secondary Phone Number',
  emailAddress: 'Email Address',
  primaryEmailAddress: 'Primary Email Address',
  secondaryEmailAddress: 'Secondary Email Address',
  whatsappOptInStatus: 'WhatsApp Opt-In Status',
  preferredLanguage: 'Preferred Language',
  communicationConsent: 'Communication Consent',
  locationCity: 'City',
  locationStateProvince: 'State/Province',
  locationCountry: 'Country',
  jobTitle: 'Job Title',
  department: 'Department',
  team: 'Team',
  employmentStatus: 'Employment Status',
  employmentType: 'Employment Type',
  hireDate: 'Hire Date',
  lastActiveAt: 'Last Active At',
  lastInteractionDate: 'Last Interaction Date',
  lastEngagementDate: 'Last Engagement Date',
  engagementRate: 'Engagement Rate',
  wellbeingScore: 'Wellbeing Score',
  overallWellbeingScore: 'Overall Wellbeing Score',
  lastWellbeingCheckDate: 'Last Wellbeing Check Date',
  lastWellbeingAssessmentDate: 'Last Wellbeing Assessment Date',
  pointsBalance: 'Points Balance',
  badgesEarnedCount: 'Badges Earned Count'
};

// Define validators for worker CSV fields
const workerValidators: Record<string, CsvFieldValidator> = {
  firstName: {
    validate: (value) => value ? null : 'First name is required',
    required: true,
    validateWithContext: (value, row, rowIndex, columnName) => {
      if (!value) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'First name is required',
          value,
          severity: ErrorSeverity.ERROR,
          code: 'REQUIRED_FIELD'
        };
      }
      if (value.length < 2) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'First name should be at least 2 characters',
          value,
          severity: ErrorSeverity.WARNING,
          code: 'VALUE_TOO_SHORT'
        };
      }
      return null;
    }
  },
  lastName: {
    validate: (value) => value ? null : 'Last name is required',
    required: true,
    validateWithContext: (value, row, rowIndex, columnName) => {
      if (!value) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'Last name is required',
          value,
          severity: ErrorSeverity.ERROR,
          code: 'REQUIRED_FIELD'
        };
      }
      if (value.length < 2) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'Last name should be at least 2 characters',
          value,
          severity: ErrorSeverity.WARNING,
          code: 'VALUE_TOO_SHORT'
        };
      }
      return null;
    }
  },
  middleName: {
    validate: () => null
  },
  displayName: {
    validate: () => null
  },
  externalId: {
    validate: () => null
  },
  dateOfBirth: {
    validate: validateDate,
    validateWithContext: (value, row, rowIndex, columnName) => {
      if (!value) return null;
      
      const error = validateDate(value);
      if (error) {
        return {
          row: rowIndex,
          column: columnName,
          message: error,
          value,
          severity: ErrorSeverity.ERROR,
          code: 'INVALID_DATE',
          suggestedFix: 'Use format YYYY-MM-DD (e.g., 1990-01-31)'
        };
      }
      
      // Check if the date is in the future
      const date = new Date(value);
      const today = new Date();
      if (date > today) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'Date of birth cannot be in the future',
          value,
          severity: ErrorSeverity.ERROR,
          code: 'FUTURE_DATE'
        };
      }
      
      // Check if the worker is too young or too old
      const age = (today.getFullYear() - date.getFullYear());
      if (age > 100) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'Worker appears to be over 100 years old. Please verify date of birth.',
          value,
          severity: ErrorSeverity.WARNING,
          code: 'AGE_UNUSUAL'
        };
      }
      if (age < 18) {
        return {
          row: rowIndex,
          column: columnName,
          message: 'Worker appears to be under 18 years old. Please verify date of birth.',
          value,
          severity: ErrorSeverity.WARNING,
          code: 'AGE_UNUSUAL'
        };
      }
      
      return null;
    }
  },
  gender: {
    validate: validateEnum(['male', 'female', 'non_binary', 'other', 'prefer_not_say'])
  },
  avatarUrl: {
    validate: () => null // Could add URL validation if needed
  },
  primaryTag: {
    validate: () => null
  },
  tags: {
    validate: validateTags,
    transform: transformTags
  },
  isActive: {
    validate: validateBoolean,
    transform: transformToBoolean,
    required: true
  },
  deactivationReason: {
    validate: validateEnum([
      'voluntary_resignation', 
      'performance_issues', 
      'policy_violation', 
      'redundancy', 
      'retirement', 
      'end_of_contract', 
      'other'
    ])
  },
  primaryPhoneNumber: {
    validate: validatePhone,
    required: true
  },
  secondaryPhoneNumber: {
    validate: validatePhone
  },
  emailAddress: {
    validate: validateEmail,
    validateWithContext: (value, row, rowIndex, columnName) => {
      if (!value) return null;
      
      const error = validateEmail(value);
      if (error) {
        return {
          row: rowIndex,
          column: columnName,
          message: error,
          value,
          severity: ErrorSeverity.ERROR,
          code: 'INVALID_EMAIL',
          suggestedFix: 'Use format name@example.com'
        };
      }
      
      // Check for common email domain mistakes
      const domain = value.split('@')[1];
      if (domain === 'gmail.co' || domain === 'gamil.com' || domain === 'gmal.com') {
        return {
          row: rowIndex,
          column: columnName,
          message: `Possible typo in email domain "${domain}". Did you mean "gmail.com"?`,
          value,
          severity: ErrorSeverity.WARNING,
          code: 'POSSIBLE_TYPO',
          suggestedFix: value.replace(domain, 'gmail.com')
        };
      }
      
      if (domain === 'yahoo.co' || domain === 'yaho.com') {
        return {
          row: rowIndex,
          column: columnName,
          message: `Possible typo in email domain "${domain}". Did you mean "yahoo.com"?`,
          value,
          severity: ErrorSeverity.WARNING,
          code: 'POSSIBLE_TYPO',
          suggestedFix: value.replace(domain, 'yahoo.com')
        };
      }
      
      if (domain === 'hotmail.co' || domain === 'hotmal.com') {
        return {
          row: rowIndex,
          column: columnName,
          message: `Possible typo in email domain "${domain}". Did you mean "hotmail.com"?`,
          value,
          severity: ErrorSeverity.WARNING,
          code: 'POSSIBLE_TYPO',
          suggestedFix: value.replace(domain, 'hotmail.com')
        };
      }
      
      return null;
    }
  },
  primaryEmailAddress: {
    validate: validateEmail,
    validateWithContext: (value, row, rowIndex, columnName) => {
      if (!value) return null;
      
      // Reuse the email validation
      if (workerValidators.emailAddress.validateWithContext) {
        return workerValidators.emailAddress.validateWithContext(value, row, rowIndex, columnName);
      }
      
      return null;
    }
  },
  secondaryEmailAddress: {
    validate: validateEmail
  },
  whatsappOptInStatus: {
    validate: validateEnum(['opted_in', 'opted_out', 'pending', 'failed'])
  },
  preferredLanguage: {
    validate: () => null // Could add language code validation if needed
  },
  communicationConsent: {
    validate: validateBoolean,
    transform: transformToBoolean
  },
  locationCity: {
    validate: () => null
  },
  locationStateProvince: {
    validate: () => null
  },
  locationCountry: {
    validate: () => null
  },
  jobTitle: {
    validate: () => null
  },
  department: {
    validate: () => null
  },
  team: {
    validate: () => null
  },
  employmentStatus: {
    validate: validateEnum(['active', 'inactive', 'on_leave', 'terminated'])
  },
  employmentType: {
    validate: validateEnum(['full_time', 'part_time', 'contractor', 'temporary'])
  },
  hireDate: {
    validate: validateDate
  },
  lastActiveAt: {
    validate: validateDate
  },
  lastInteractionDate: {
    validate: validateDate
  },
  lastEngagementDate: {
    validate: validateDate
  },
  engagementRate: {
    validate: validateNumber,
    transform: transformToNumber
  },
  wellbeingScore: {
    validate: validateNumber,
    transform: transformToNumber
  },
  overallWellbeingScore: {
    validate: validateNumber,
    transform: transformToNumber
  },
  lastWellbeingCheckDate: {
    validate: validateDate
  },
  lastWellbeingAssessmentDate: {
    validate: validateDate
  },
  pointsBalance: {
    validate: validateNumber,
    transform: transformToNumber
  },
  badgesEarnedCount: {
    validate: validateNumber,
    transform: transformToNumber
  }
};

// Fields that are required in the CSV
const requiredFields = ['firstName', 'lastName', 'primaryPhoneNumber', 'isActive'];

// Define custom row validators for cross-field validation
const customRowValidators = [
  // Check the consistency between isActive and deactivationReason
  (row: Record<string, any>, rowIndex: number): CsvValidationError[] => {
    const errors: CsvValidationError[] = [];
    
    // If worker is not active, they should have a deactivation reason
    if (row.isActive === 'false' || row.isActive === false) {
      if (!row.deactivationReason) {
        errors.push({
          row: rowIndex,
          column: 'deactivationReason',
          message: 'Deactivation reason is required when worker is not active',
          value: row.deactivationReason,
          severity: ErrorSeverity.WARNING,
          code: 'MISSING_RELATED_FIELD'
        });
      }
    } 
    // If worker is active, they shouldn't have a deactivation reason
    else if (row.isActive === 'true' || row.isActive === true) {
      if (row.deactivationReason) {
        errors.push({
          row: rowIndex,
          column: 'deactivationReason',
          message: 'Deactivation reason should be empty when worker is active',
          value: row.deactivationReason,
          severity: ErrorSeverity.WARNING,
          code: 'UNEXPECTED_FIELD',
          suggestedFix: 'Remove deactivation reason for active workers'
        });
      }
    }
    
    return errors;
  },
  
  // Check for consistency in dates (hire date vs engagement dates)
  (row: Record<string, any>, rowIndex: number): CsvValidationError[] => {
    const errors: CsvValidationError[] = [];
    
    // If hire date is present
    if (row.hireDate) {
      const hireDate = new Date(row.hireDate);
      
      // Check that lastActiveAt, lastInteractionDate, and lastEngagementDate are not before hire date
      if (row.lastActiveAt) {
        const lastActiveAt = new Date(row.lastActiveAt);
        if (lastActiveAt < hireDate) {
          errors.push({
            row: rowIndex,
            column: 'lastActiveAt',
            message: 'Last active date cannot be before hire date',
            value: row.lastActiveAt,
            severity: ErrorSeverity.WARNING,
            code: 'DATE_INCONSISTENCY'
          });
        }
      }
      
      if (row.lastInteractionDate) {
        const lastInteractionDate = new Date(row.lastInteractionDate);
        if (lastInteractionDate < hireDate) {
          errors.push({
            row: rowIndex,
            column: 'lastInteractionDate',
            message: 'Last interaction date cannot be before hire date',
            value: row.lastInteractionDate,
            severity: ErrorSeverity.WARNING,
            code: 'DATE_INCONSISTENCY'
          });
        }
      }
      
      if (row.lastEngagementDate) {
        const lastEngagementDate = new Date(row.lastEngagementDate);
        if (lastEngagementDate < hireDate) {
          errors.push({
            row: rowIndex,
            column: 'lastEngagementDate',
            message: 'Last engagement date cannot be before hire date',
            value: row.lastEngagementDate,
            severity: ErrorSeverity.WARNING,
            code: 'DATE_INCONSISTENCY'
          });
        }
      }
    }
    
    return errors;
  },
  
  // Check for consistency in contact information
  (row: Record<string, any>, rowIndex: number): CsvValidationError[] => {
    const errors: CsvValidationError[] = [];
    
    // If WhatsApp opt-in status is 'opted_in', primary phone number is required
    if (row.whatsappOptInStatus === 'opted_in' && !row.primaryPhoneNumber) {
      errors.push({
        row: rowIndex,
        column: 'primaryPhoneNumber',
        message: 'Primary phone number is required when WhatsApp opt-in status is opted_in',
        value: row.primaryPhoneNumber,
        severity: ErrorSeverity.ERROR,
        code: 'MISSING_RELATED_FIELD'
      });
    }
    
    // Check if communication consent is true but no contact methods are provided
    if ((row.communicationConsent === 'true' || row.communicationConsent === true) && 
        !row.primaryPhoneNumber && !row.emailAddress && !row.primaryEmailAddress) {
      errors.push({
        row: rowIndex,
        column: 'communicationConsent',
        message: 'Communication consent is true but no contact methods (phone/email) are provided',
        severity: ErrorSeverity.WARNING,
        code: 'LOGICAL_INCONSISTENCY'
      });
    }
    
    return errors;
  }
];

/**
 * Service for handling worker CSV operations
 */
class WorkerCsvService {
  /**
   * Parse and validate a CSV file for workers
   * @param buffer The CSV file buffer
   * @returns Parsed and validated worker data
   */
  async parseWorkerCsv(buffer: Buffer): Promise<CsvParseResult<WorkerCsvRecord>> {
    try {
      // Parse the CSV file
      const parsedData = await csvService.parseCsvBuffer<Record<string, any>>(buffer);
      
      // Validate the data with enhanced validation
      return csvService.validateCsvData<WorkerCsvRecord>(parsedData, {
        validators: workerValidators,
        requiredFields,
        customRowValidators,
        headerMap: headerDisplayMap
      });
    } catch (error) {
      console.error('Error parsing worker CSV:', error);
      return {
        data: [],
        errors: [{ 
          row: 1, 
          column: '', 
          message: `Failed to parse CSV file: ${error instanceof Error ? error.message : String(error)}`,
          severity: ErrorSeverity.ERROR,
          code: 'PARSE_ERROR'
        }],
        success: false,
        summary: {
          totalRows: 0,
          validRows: 0,
          errorRows: 0,
          warningRows: 0
        }
      };
    }
  }

  /**
   * Transform validated CSV records to worker objects ready for database insertion
   * @param csvRecords Validated CSV records
   * @returns Worker objects ready for database
   */
  transformRecordsToWorkers(csvRecords: WorkerCsvRecord[], organizationId: string) {
    return csvRecords.map(record => {
      // Convert dates to Date objects or null
      const dateOfBirth = record.dateOfBirth ? new Date(record.dateOfBirth) : undefined;
      const hireDate = record.hireDate ? new Date(record.hireDate) : undefined;
      const lastActiveAt = record.lastActiveAt ? new Date(record.lastActiveAt) : undefined;
      const lastInteractionDate = record.lastInteractionDate ? new Date(record.lastInteractionDate) : undefined;
      const lastEngagementDate = record.lastEngagementDate ? new Date(record.lastEngagementDate) : undefined;
      const lastWellbeingCheckDate = record.lastWellbeingCheckDate ? new Date(record.lastWellbeingCheckDate) : undefined;
      const lastWellbeingAssessmentDate = record.lastWellbeingAssessmentDate ? new Date(record.lastWellbeingAssessmentDate) : undefined;
      
      // Create worker object with nested properties
      return {
        // Basic information
        firstName: record.firstName,
        lastName: record.lastName,
        middleName: record.middleName,
        displayName: record.displayName,
        externalId: record.externalId,
        dateOfBirth,
        gender: record.gender,
        avatarUrl: record.avatarUrl,
        primaryTag: record.primaryTag,
        tags: record.tags || [],
        isActive: record.isActive,
        deactivationReason: record.deactivationReason,
        organizationId,
        
        // Contact information
        contact: {
          primaryPhoneNumber: record.primaryPhoneNumber,
          secondaryPhoneNumber: record.secondaryPhoneNumber,
          emailAddress: record.emailAddress || record.primaryEmailAddress,
          primaryEmailAddress: record.primaryEmailAddress,
          secondaryEmailAddress: record.secondaryEmailAddress,
          whatsappOptInStatus: record.whatsappOptInStatus || 'pending',
          preferredLanguage: record.preferredLanguage || 'en',
          communicationConsent: record.communicationConsent || false,
          locationCity: record.locationCity,
          locationStateProvince: record.locationStateProvince,
          locationCountry: record.locationCountry
        },
        
        // Employment information
        employment: {
          jobTitle: record.jobTitle,
          department: record.department,
          team: record.team,
          hireDate,
          employmentStatus: record.employmentStatus || 'active',
          employmentType: record.employmentType
        },
        
        // Engagement information
        engagement: {
          lastActiveAt,
          lastInteractionDate,
          lastEngagementDate,
          engagementRate: record.engagementRate
        },
        
        // Wellbeing information
        wellbeing: {
          wellbeingScore: record.wellbeingScore,
          overallWellbeingScore: record.overallWellbeingScore,
          lastWellbeingCheckDate,
          lastWellbeingAssessmentDate
        },
        
        // Gamification information
        gamification: {
          pointsBalance: record.pointsBalance,
          badgesEarnedCount: record.badgesEarnedCount
        }
      };
    });
  }

  /**
   * Generate a template CSV file for workers
   * @returns CSV template as a string
   */
  async generateTemplate(): Promise<string> {
    return csvService.generateTemplate(workerCsvHeaders);
  }

  /**
   * Generate a sample CSV file for workers with example data
   * @returns CSV sample as a string
   */
  async generateSample(): Promise<string> {
    // Create sample data
    const sampleData: Partial<WorkerCsvRecord>[] = [
      {
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Robert',
        externalId: 'EMP001',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        tags: ['tech', 'engineering'],
        isActive: true,
        primaryPhoneNumber: '+919876543210',
        emailAddress: 'john.doe@example.com',
        whatsappOptInStatus: 'opted_in',
        preferredLanguage: 'en-IN',
        communicationConsent: true,
        locationCity: 'Mumbai',
        locationStateProvince: 'Maharashtra',
        locationCountry: 'India',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        team: 'Backend',
        employmentStatus: 'active',
        employmentType: 'full_time',
        hireDate: '2022-03-15',
        wellbeingScore: 85,
        pointsBalance: 450
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        externalId: 'EMP002',
        dateOfBirth: '1988-06-22',
        gender: 'female',
        tags: ['marketing', 'creative'],
        isActive: true,
        primaryPhoneNumber: '+919876543211',
        emailAddress: 'jane.smith@example.com',
        whatsappOptInStatus: 'pending',
        preferredLanguage: 'hi',
        communicationConsent: true,
        locationCity: 'Delhi',
        locationStateProvince: 'Delhi',
        locationCountry: 'India',
        jobTitle: 'Marketing Specialist',
        department: 'Marketing',
        employmentStatus: 'active',
        employmentType: 'part_time',
        hireDate: '2021-11-10',
        wellbeingScore: 78,
        pointsBalance: 320
      }
    ];
    
    return csvService.generateSample(workerCsvHeaders, sampleData);
  }
}

export default new WorkerCsvService(); 