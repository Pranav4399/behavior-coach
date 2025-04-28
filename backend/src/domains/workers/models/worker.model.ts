// Using string literals for enums since we don't have direct access to Prisma enums
import { AppError } from '../../../common/middleware/errorHandler';

// Gender enum values
export type Gender = 'male' | 'female' | 'non_binary' | 'other' | 'prefer_not_say';

// OptInStatus enum values
export type OptInStatus = 'opted_in' | 'opted_out' | 'pending' | 'failed';

// EmploymentStatus enum values
export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

// EmploymentType enum values
export type EmploymentType = 'full_time' | 'part_time' | 'contractor' | 'temporary';

// DeactivationReason enum values
export type DeactivationReason = 'voluntary_resignation' | 'performance_issues' | 'policy_violation' | 
                              'redundancy' | 'retirement' | 'end_of_contract' | 'other';

// Define a type for custom fields to avoid using 'any'
export type CustomField = string | number | boolean | null | Date | 
                          { [key: string]: CustomField } | CustomField[];

// Props interfaces for constructor parameters
export interface WorkerProps {
  id?: string;
  // Basic Information
  externalId?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  displayName?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  avatarUrl?: string | null;
  primaryTag?: string | null;
  tags?: string[] | null;
  
  // Related entities
  contact?: Partial<WorkerContactProps> | null;
  employment?: Partial<WorkerEmploymentProps> | null;
  engagement?: Partial<WorkerEngagementProps> | null;
  wellbeing?: Partial<WorkerWellbeingProps> | null;
  gamification?: Partial<WorkerGamificationProps> | null;

  // Metadata
  isActive: boolean;
  deactivationReason?: DeactivationReason | null;
  customFields?: Record<string, CustomField> | null;
  organizationId?: string;
  supervisorId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkerContactProps {
  id?: string;
  workerId: string;
  locationCity?: string | null;
  locationStateProvince?: string | null;
  locationCountry?: string | null;
  primaryPhoneNumber?: string;
  whatsappOptInStatus?: OptInStatus;
  secondaryPhoneNumber?: string | null;
  primaryEmailAddress?: string | null;
  secondaryEmailAddress?: string | null;
  emailAddress?: string | null;
  preferredLanguage?: string;
  communicationConsent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkerEmploymentProps {
  id?: string;
  workerId: string;
  jobTitle?: string | null;
  department?: string | null;
  team?: string | null;
  hireDate?: Date | null;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkerEngagementProps {
  id?: string;
  workerId: string;
  lastEngagementDate?: Date | null;
  lastActiveAt?: Date | null;
  lastInteractionDate?: Date | null; 
  engagementRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkerWellbeingProps {
  id?: string;
  workerId: string;
  wellbeingScore?: number;
  overallWellbeingScore?: number | null;
  lastWellbeingCheckDate?: Date | null;
  lastWellbeingAssessmentDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkerGamificationProps {
  id?: string;
  workerId: string;
  pointsBalance?: number;
  badgesEarnedCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Core Worker class
export class Worker {
  id: string;
  externalId: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: Gender | null;
  customFields: Record<string, CustomField> | null;
  tags: string[];
  isActive: boolean;
  deactivationReason: DeactivationReason | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  supervisorId: string | null;
  
  // Related entities
  contact?: WorkerContact;
  employment?: WorkerEmployment;
  engagement?: WorkerEngagement;
  wellbeing?: WorkerWellbeing;
  gamification?: WorkerGamification;

  constructor(props: WorkerProps) {
    this.id = props.id || '';
    this.externalId = props.externalId || null;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.dateOfBirth = props.dateOfBirth || null;
    this.gender = props.gender || null;
    this.customFields = props.customFields || null;
    this.tags = props.tags || [];
    this.isActive = props.isActive;
    this.deactivationReason = props.deactivationReason || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.organizationId = props.organizationId || '';
    this.supervisorId = props.supervisorId || null;
    
    // Initialize related entities if provided
    if (props.contact) {
      this.contact = new WorkerContact({
        ...props.contact,
        workerId: this.id
      });
    }
    
    if (props.employment) {
      this.employment = new WorkerEmployment({
        ...props.employment,
        workerId: this.id
      });
    }
    
    if (props.engagement) {
      this.engagement = new WorkerEngagement({
        ...props.engagement,
        workerId: this.id
      });
    }
    
    if (props.wellbeing) {
      this.wellbeing = new WorkerWellbeing({
        ...props.wellbeing,
        workerId: this.id
      });
    }
    
    if (props.gamification) {
      this.gamification = new WorkerGamification({
        ...props.gamification,
        workerId: this.id
      });
    }
  }

  validate(): void {
    if (!this.firstName || this.firstName.trim() === '') {
      throw new AppError('First name is required', 400);
    }
    
    if (!this.lastName || this.lastName.trim() === '') {
      throw new AppError('Last name is required', 400);
    }
    
    if (!this.organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // Validate contact information if provided
    if (this.contact) {
      this.contact.validate();
    }
  }

  // Get full name
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Update worker with new data
  update(data: Partial<WorkerProps>): void {
    if (data.firstName) {
      this.firstName = data.firstName;
    }
    
    if (data.lastName) {
      this.lastName = data.lastName;
    }
    
    if (data.externalId !== undefined) {
      this.externalId = data.externalId;
    }
    
    if (data.dateOfBirth !== undefined) {
      this.dateOfBirth = data.dateOfBirth;
    }
    
    if (data.gender !== undefined) {
      this.gender = data.gender;
    }
    
    if (data.customFields !== undefined) {
      this.customFields = data.customFields;
    }
    
    if (data.tags) {
      this.tags = data.tags;
    }
    
    if (data.supervisorId !== undefined) {
      this.supervisorId = data.supervisorId;
    }
    
    if (data.isActive !== undefined) {
      this.isActive = data.isActive;
    }
    
    if (data.deactivationReason !== undefined) {
      this.deactivationReason = data.deactivationReason;
    }
    
    // Update related entities if provided
    if (data.contact && this.contact) {
      this.contact.update(data.contact);
    } else if (data.contact) {
      this.contact = new WorkerContact({
        ...data.contact,
        workerId: this.id
      });
    }
    
    if (data.employment && this.employment) {
      this.employment.update(data.employment);
    } else if (data.employment) {
      this.employment = new WorkerEmployment({
        ...data.employment,
        workerId: this.id
      });
    }
    
    if (data.engagement && this.engagement) {
      this.engagement.update(data.engagement);
    } else if (data.engagement) {
      this.engagement = new WorkerEngagement({
        ...data.engagement,
        workerId: this.id
      });
    }
    
    if (data.wellbeing && this.wellbeing) {
      this.wellbeing.update(data.wellbeing);
    } else if (data.wellbeing) {
      this.wellbeing = new WorkerWellbeing({
        ...data.wellbeing,
        workerId: this.id
      });
    }
    
    if (data.gamification && this.gamification) {
      this.gamification.update(data.gamification);
    } else if (data.gamification) {
      this.gamification = new WorkerGamification({
        ...data.gamification,
        workerId: this.id
      });
    }
    
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      externalId: this.externalId,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.getFullName(),
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      customFields: this.customFields,
      tags: this.tags,
      isActive: this.isActive,
      deactivationReason: this.deactivationReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      organizationId: this.organizationId,
      supervisorId: this.supervisorId,
      contact: this.contact,
      employment: this.employment,
      engagement: this.engagement,
      wellbeing: this.wellbeing,
      gamification: this.gamification
    };
  }
}

// Worker Contact class
export class WorkerContact {
  id: string;
  workerId: string;
  locationCity: string | null;
  locationStateProvince: string | null;
  locationCountry: string | null;
  primaryPhoneNumber: string;
  whatsappOptInStatus: OptInStatus;
  secondaryPhoneNumber: string | null;
  primaryEmailAddress: string | null;
  secondaryEmailAddress: string | null;
  emailAddress: string | null;
  preferredLanguage: string;
  communicationConsent: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: WorkerContactProps) {
    this.id = props.id || '';
    this.workerId = props.workerId || '';
    this.locationCity = props.locationCity || null;
    this.locationStateProvince = props.locationStateProvince || null;
    this.locationCountry = props.locationCountry || null;
    this.primaryPhoneNumber = props.primaryPhoneNumber || '';
    this.whatsappOptInStatus = props.whatsappOptInStatus || 'opted_out';
    this.secondaryPhoneNumber = props.secondaryPhoneNumber || null;
    this.primaryEmailAddress = props.primaryEmailAddress || null;
    this.secondaryEmailAddress = props.secondaryEmailAddress || null;
    this.emailAddress = props.emailAddress || null;
    this.preferredLanguage = props.preferredLanguage || '';
    this.communicationConsent = props.communicationConsent || false;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  validate(): void {
    if (!this.primaryPhoneNumber) {
      throw new AppError('Primary phone number is required', 400);
    }
    
    if (!this.whatsappOptInStatus) {
      throw new AppError('WhatsApp opt-in status is required', 400);
    }
    
    if (this.primaryEmailAddress && !this.isValidEmail(this.primaryEmailAddress)) {
      throw new AppError('Valid primary email address is required', 400);
    }
    
    if (this.secondaryEmailAddress && !this.isValidEmail(this.secondaryEmailAddress)) {
      throw new AppError('Valid secondary email address is required', 400);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  update(data: Partial<WorkerContactProps>): void {
    if (data.locationCity !== undefined) {
      this.locationCity = data.locationCity;
    }
    
    if (data.locationStateProvince !== undefined) {
      this.locationStateProvince = data.locationStateProvince;
    }
    
    if (data.locationCountry !== undefined) {
      this.locationCountry = data.locationCountry;
    }
    
    if (data.primaryPhoneNumber) {
      this.primaryPhoneNumber = data.primaryPhoneNumber;
    }
    
    if (data.whatsappOptInStatus) {
      this.whatsappOptInStatus = data.whatsappOptInStatus;
    }
    
    if (data.secondaryPhoneNumber) {
      this.secondaryPhoneNumber = data.secondaryPhoneNumber;
    }
    
    if (data.primaryEmailAddress !== undefined) {
      this.primaryEmailAddress = data.primaryEmailAddress;
    }
    
    if (data.secondaryEmailAddress !== undefined) {
      this.secondaryEmailAddress = data.secondaryEmailAddress;
    }
    
    if (data.emailAddress !== undefined) {
      this.emailAddress = data.emailAddress;
    }
    
    if (data.preferredLanguage !== undefined) {
      this.preferredLanguage = data.preferredLanguage;
    }
    
    if (data.communicationConsent !== undefined) {
      this.communicationConsent = data.communicationConsent;
    }
    
    this.updatedAt = new Date();
  }
}

// Worker Employment class
export class WorkerEmployment {
  id: string;
  workerId: string;
  jobTitle: string | null;
  department: string | null;
  team: string | null;
  hireDate: Date | null;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: WorkerEmploymentProps) {
    this.id = props.id || '';
    this.workerId = props.workerId || '';
    this.jobTitle = props.jobTitle || null;
    this.department = props.department || null;
    this.team = props.team || null;
    this.hireDate = props.hireDate || null;
    this.employmentStatus = props.employmentStatus || 'active';
    this.employmentType = props.employmentType || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  update(data: Partial<WorkerEmploymentProps>): void {
    if (data.jobTitle !== undefined) {
      this.jobTitle = data.jobTitle;
    }
    
    if (data.department !== undefined) {
      this.department = data.department;
    }
    
    if (data.team !== undefined) {
      this.team = data.team;
    }
    
    if (data.hireDate !== undefined) {
      this.hireDate = data.hireDate;
    }
    
    if (data.employmentStatus) {
      this.employmentStatus = data.employmentStatus;
    }
    
    if (data.employmentType !== undefined) {
      this.employmentType = data.employmentType;
    }
    
    this.updatedAt = new Date();
  }
}

// Worker Engagement class
export class WorkerEngagement {
  id: string;
  workerId: string;
  lastEngagementDate: Date | null;
  lastActiveAt: Date | null;
  lastInteractionDate: Date | null;
  engagementRate: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: WorkerEngagementProps) {
    this.id = props.id || '';
    this.workerId = props.workerId || '';
    this.lastEngagementDate = props.lastEngagementDate || null;
    this.lastActiveAt = props.lastActiveAt || null;
    this.lastInteractionDate = props.lastInteractionDate || null;
    this.engagementRate = props.engagementRate || 0;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  update(data: Partial<WorkerEngagementProps>): void {
    if (data.lastEngagementDate !== undefined) {
      this.lastEngagementDate = data.lastEngagementDate;
    }
    
    if (data.lastActiveAt !== undefined) {
      this.lastActiveAt = data.lastActiveAt;
    }
    
    if (data.lastInteractionDate !== undefined) {
      this.lastInteractionDate = data.lastInteractionDate;
    }
    
    if (data.engagementRate !== undefined) {
      this.engagementRate = data.engagementRate;
    }
    
    this.updatedAt = new Date();
  }
}

// Worker Wellbeing class
export class WorkerWellbeing {
  id: string;
  workerId: string;
  wellbeingScore: number;
  overallWellbeingScore: number | null;
  lastWellbeingCheckDate: Date | null;
  lastWellbeingAssessmentDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: WorkerWellbeingProps) {
    this.id = props.id || '';
    this.workerId = props.workerId || '';
    this.wellbeingScore = props.wellbeingScore || 0;
    this.overallWellbeingScore = props.overallWellbeingScore || null;
    this.lastWellbeingCheckDate = props.lastWellbeingCheckDate || null;
    this.lastWellbeingAssessmentDate = props.lastWellbeingAssessmentDate || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  update(data: Partial<WorkerWellbeingProps>): void {
    if (data.wellbeingScore !== undefined) {
      this.wellbeingScore = data.wellbeingScore;
    }
    
    if (data.overallWellbeingScore !== undefined) {
      this.overallWellbeingScore = data.overallWellbeingScore;
    }
    
    if (data.lastWellbeingCheckDate !== undefined) {
      this.lastWellbeingCheckDate = data.lastWellbeingCheckDate;
    }
    
    if (data.lastWellbeingAssessmentDate !== undefined) {
      this.lastWellbeingAssessmentDate = data.lastWellbeingAssessmentDate;
    }
    
    this.updatedAt = new Date();
  }
}

// Worker Gamification class
export class WorkerGamification {
  id: string;
  workerId: string;
  pointsBalance: number;
  badgesEarnedCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: WorkerGamificationProps) {
    this.id = props.id || '';
    this.workerId = props.workerId || '';
    this.pointsBalance = props.pointsBalance || 0;
    this.badgesEarnedCount = props.badgesEarnedCount || 0;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  update(data: Partial<WorkerGamificationProps>): void {
    if (data.pointsBalance !== undefined) {
      this.pointsBalance = data.pointsBalance;
    }
    
    if (data.badgesEarnedCount !== undefined) {
      this.badgesEarnedCount = data.badgesEarnedCount;
    }
    
    this.updatedAt = new Date();
  }
}

// DTOs remain mostly unchanged but adapted to work with class constructors
export interface WorkerFilterOptions {
  searchTerm?: string;
  employmentStatus?: EmploymentStatus;
  department?: string;
  team?: string;
  hiredAfter?: Date;
  hiredBefore?: Date;
  tags?: string[];
}

export interface BulkImportWorkerDTO {
  workers: WorkerProps[];
  organizationId: string;
}

export interface BulkUpdateWorkerDTO {
  workerIds: string[];
  updates: Partial<WorkerProps>;
}

export interface BulkDeleteWorkerDTO {
  workerIds: string[];
}

export interface WorkerTagsDTO {
  tags: string[];
} 