export type Gender = 'male' | 'female' | 'non_binary' | 'other' | 'prefer_not_say';
export type OptInStatus = 'opted_in' | 'opted_out' | 'pending' | 'failed';
export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type EmploymentType = 'full_time' | 'part_time' | 'contractor' | 'temporary';
export type DeactivationReason = 'voluntary_resignation' | 'performance_issues' | 'policy_violation' | 
                              'redundancy' | 'retirement' | 'end_of_contract' | 'other';

export interface WorkerContact {
  id?: string;
  locationCity?: string | null;
  locationStateProvince?: string | null;
  locationCountry?: string | null;
  primaryPhoneNumber: string;
  whatsappOptInStatus: OptInStatus;
  emailAddress?: string | null;
  preferredLanguage?: string;
  communicationConsent?: boolean;
}

export interface WorkerEmployment {
  id?: string;
  jobTitle?: string | null;
  department?: string | null;
  team?: string | null;
  hireDate?: string | null;
  employmentStatus: EmploymentStatus;
  employmentType?: EmploymentType | null;
}

export interface WorkerEngagement {
  id?: string;
  lastEngagementDate?: string | null;
  lastActiveAt?: string | null;
  lastInteractionDate?: string | null;
  engagementRate?: number;
}

export interface WorkerWellbeing {
  id?: string;
  wellbeingScore?: number;
  overallWellbeingScore?: number | null;
  lastWellbeingCheckDate?: string | null;
  lastWellbeingAssessmentDate?: string | null;
}

export interface WorkerGamification {
  id?: string;
  pointsBalance?: number;
  badgesEarnedCount?: number;
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  externalId?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tags: string[];
  customFields?: Record<string, any> | null;
  isActive: boolean;
  deactivationReason?: DeactivationReason | null;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  supervisorId?: string | null;
  contact?: WorkerContact;
  employment?: WorkerEmployment;
  engagement?: WorkerEngagement;
  wellbeing?: WorkerWellbeing;
  gamification?: WorkerGamification;
}

export interface WorkerFilterOptions {
  searchTerm?: string;
  employmentStatus?: EmploymentStatus;
  department?: string;
  team?: string;
  hiredAfter?: string;
  hiredBefore?: string;
  tags?: string[];
}

export interface WorkerListResponse {
  success: boolean;
  workers: Worker[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WorkerResponse {
  success: boolean;
  data: Worker;
}

export interface WorkerCreateData {
  firstName: string;
  lastName: string;
  externalId?: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tags?: string[];
  customFields?: Record<string, any>;
  isActive?: boolean;
  deactivationReason?: DeactivationReason | null;
  organizationId?: string;
  supervisorId?: string | null;
  
  // Contact information (flat properties for easier form handling)
  primaryPhoneNumber?: string;
  emailAddress?: string;
  preferredLanguage?: string;
  communicationConsent?: boolean;
  whatsappOptInStatus?: OptInStatus;
  locationCity?: string;
  locationStateProvince?: string;
  locationCountry?: string;
  
  // Employment information (flat properties)
  jobTitle?: string;
  department?: string;
  team?: string;
  hireDate?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
}

export interface WorkerUpdateData extends Partial<WorkerCreateData> {}

export interface WorkerBulkImportData {
  workers: WorkerCreateData[];
  organizationId?: string;
}

export interface WorkerBulkUpdateData {
  workerIds: string[];
  updates: WorkerUpdateData;
}

export interface WorkerBulkDeleteData {
  workerIds: string[];
}

export interface WorkerTagsData {
  tags: string[];
} 