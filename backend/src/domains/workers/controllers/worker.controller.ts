import { Request, Response } from 'express';
import { WorkerService } from '../services/worker.service';
import { 
  WorkerProps,
  WorkerFilterOptions,
  WorkerTagsDTO,
  EmploymentStatus,
  OptInStatus,
  CustomField,
  WorkerContactProps,
  WorkerEmploymentProps,
  WorkerEngagementProps,
  WorkerWellbeingProps,
  WorkerGamificationProps,
  Gender,
  EmploymentType,
  DeactivationReason
} from '../models/worker.model';
import { AppError } from '../../../common/middleware/errorHandler';

// Define interfaces for update objects to replace 'any'
interface ContactUpdates {
  primaryPhoneNumber?: string;
  emailAddress?: string | null;
  preferredLanguage?: string;
  locationCity?: string | null;
  locationStateProvince?: string | null;
  locationCountry?: string | null;
  whatsappOptInStatus?: OptInStatus;
  communicationConsent?: boolean;
  [key: string]: unknown;
}

interface EmploymentUpdates {
  jobTitle?: string | null;
  department?: string | null;
  team?: string | null;
  hireDate?: Date | null;
  employmentStatus?: EmploymentStatus;
  employmentType?: string | null;
  [key: string]: unknown;
}

interface EngagementUpdates {
  lastActiveAt?: Date | null;
  lastInteractionDate?: Date | null;
  [key: string]: unknown;
}

interface WellbeingUpdates {
  lastWellbeingAssessmentDate?: Date | null;
  overallWellbeingScore?: number | null;
  [key: string]: unknown;
}

interface GamificationUpdates {
  pointsBalance?: number;
  badgesEarnedCount?: number;
  [key: string]: unknown;
}

// Input worker data from request
interface WorkerInputData {
  id?: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | Date | null;
  gender?: Gender | null;
  customFields?: Record<string, CustomField> | null;
  tags?: string[];
  supervisorId?: string | null;
  isActive?: boolean;
  deactivationReason?: DeactivationReason | null;
  
  // Contact information (flat or nested)
  contact?: Partial<WorkerContactProps>;
  primaryPhoneNumber?: string;
  emailAddress?: string | null;
  preferredLanguage?: string;
  communicationConsent?: boolean;
  whatsappOptInStatus?: OptInStatus;
  locationCity?: string | null;
  locationStateProvince?: string | null;
  locationCountry?: string | null;
  
  // Employment information (flat or nested)
  employment?: Partial<WorkerEmploymentProps>;
  jobTitle?: string | null;
  department?: string | null;
  team?: string | null;
  hireDate?: string | Date | null;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType | null;
  
  // Other related data
  engagement?: Partial<WorkerEngagementProps>;
  wellbeing?: Partial<WorkerWellbeingProps>;
  gamification?: Partial<WorkerGamificationProps>;
  
  // Other fields that might come from flat API requests
  lastActiveAt?: string | Date | null;
  lastInteractionDate?: string | Date | null;
  lastWellbeingAssessmentDate?: string | Date | null;
  overallWellbeingScore?: number | null;
  pointsBalance?: number;
  badgesEarnedCount?: number;
  [key: string]: unknown;
}

export class WorkerController {
  private workerService: WorkerService;

  constructor() {
    this.workerService = new WorkerService();
  }

  /**
   * Get all workers with pagination and filters
   */
  getWorkers = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.organizationId || req.user?.organizationId;
      
      if (!organizationId) {
        res.status(400).json({ 
          success: false, 
          message: 'Organization ID is required' 
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Extract filter options from query params
      const filterOptions: WorkerFilterOptions = {};
      
      if (req.query.searchTerm) filterOptions.searchTerm = req.query.searchTerm as string;
      if (req.query.employmentStatus) filterOptions.employmentStatus = req.query.employmentStatus as EmploymentStatus;
      if (req.query.department) filterOptions.department = req.query.department as string;
      if (req.query.team) filterOptions.team = req.query.team as string;
      if (req.query.hiredAfter) filterOptions.hiredAfter = new Date(req.query.hiredAfter as string);
      if (req.query.hiredBefore) filterOptions.hiredBefore = new Date(req.query.hiredBefore as string);
      if (req.query.tags) {
        const tagsParam = req.query.tags as string;
        filterOptions.tags = tagsParam.split(',');
      }

      const result = await this.workerService.getWorkers(
        organizationId,
        page,
        limit,
        filterOptions
      );

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error getting workers:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve workers',
        error: (error as Error).message
      });
    }
  };

  /**
   * Get worker by ID
   */
  getWorkerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const worker = await this.workerService.getWorkerById(id);
      
      res.status(200).json({
        success: true,
        data: worker.toJSON()
      });
    } catch (error) {
      console.error(`Error getting worker ${req.params.id}:`, error);
      
      if (error instanceof AppError && error.message.includes('not found')) {
        res.status(404).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to retrieve worker',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Create a new worker
   */
  createWorker = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.organizationId || req.user?.organizationId;
      
      if (!organizationId) {
        res.status(400).json({ 
          success: false, 
          message: 'Organization ID is required' 
        });
        return;
      }

      // Construct worker data with relations
      const workerData: WorkerProps = {
        id: req.body.id || '', // Will be generated by DB
        externalId: req.body.externalId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null,
        gender: req.body.gender,
        customFields: req.body.customFields,
        tags: req.body.tags || [],
        organizationId,
        supervisorId: req.body.supervisorId,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        deactivationReason: req.body.deactivationReason,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add contact information if provided
      if (req.body.contact || 
          req.body.primaryPhoneNumber || 
          req.body.emailAddress || 
          req.body.preferredLanguage) {
        workerData.contact = {
          primaryPhoneNumber: req.body.primaryPhoneNumber || req.body.contact?.primaryPhoneNumber,
          whatsappOptInStatus: req.body.whatsappOptInStatus || req.body.contact?.whatsappOptInStatus || 'pending',
          preferredLanguage: req.body.preferredLanguage || req.body.contact?.preferredLanguage || 'en',
          communicationConsent: req.body.communicationConsent || req.body.contact?.communicationConsent || false,
          emailAddress: req.body.emailAddress || req.body.contact?.emailAddress,
          locationCity: req.body.locationCity || req.body.contact?.locationCity,
          locationStateProvince: req.body.locationStateProvince || req.body.contact?.locationStateProvince,
          locationCountry: req.body.locationCountry || req.body.contact?.locationCountry
        };
      }

      // Add employment information if provided
      if (req.body.employment ||
          req.body.jobTitle ||
          req.body.department ||
          req.body.team ||
          req.body.hireDate ||
          req.body.employmentStatus ||
          req.body.employmentType) {
        workerData.employment = {
          jobTitle: req.body.jobTitle || req.body.employment?.jobTitle,
          department: req.body.department || req.body.employment?.department,
          team: req.body.team || req.body.employment?.team,
          hireDate: req.body.hireDate ? new Date(req.body.hireDate) : 
                    (req.body.employment?.hireDate ? new Date(req.body.employment.hireDate) : null),
          employmentStatus: req.body.employmentStatus || req.body.employment?.employmentStatus || 'active',
          employmentType: req.body.employmentType || req.body.employment?.employmentType
        };
      }
      
      // Create the worker
      const worker = await this.workerService.createWorker(workerData);
      
      res.status(201).json({
        success: true,
        data: worker.toJSON()
      });
    } catch (error) {
      console.error('Error creating worker:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to create worker',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Update a worker
   */
  updateWorker = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      // Prepare update data with nested structures
      const updateData: Partial<WorkerProps> = {};
      
      // Core worker properties
      if (req.body.firstName !== undefined) updateData.firstName = req.body.firstName;
      if (req.body.lastName !== undefined) updateData.lastName = req.body.lastName;
      if (req.body.externalId !== undefined) updateData.externalId = req.body.externalId;
      if (req.body.dateOfBirth !== undefined) updateData.dateOfBirth = req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null;
      if (req.body.gender !== undefined) updateData.gender = req.body.gender;
      if (req.body.customFields !== undefined) updateData.customFields = req.body.customFields;
      if (req.body.tags !== undefined) updateData.tags = req.body.tags;
      if (req.body.supervisorId !== undefined) updateData.supervisorId = req.body.supervisorId;
      
      // Contact information
      if (req.body.contact || 
          req.body.primaryPhoneNumber !== undefined || 
          req.body.emailAddress !== undefined || 
          req.body.preferredLanguage !== undefined ||
          req.body.locationCity !== undefined ||
          req.body.locationStateProvince !== undefined ||
          req.body.locationCountry !== undefined ||
          req.body.whatsappOptInStatus !== undefined ||
          req.body.communicationConsent !== undefined) {
        
        const contactUpdates: ContactUpdates = {};
        if (req.body.primaryPhoneNumber !== undefined) contactUpdates.primaryPhoneNumber = req.body.primaryPhoneNumber;
        if (req.body.emailAddress !== undefined) contactUpdates.emailAddress = req.body.emailAddress;
        if (req.body.preferredLanguage !== undefined) contactUpdates.preferredLanguage = req.body.preferredLanguage;
        if (req.body.locationCity !== undefined) contactUpdates.locationCity = req.body.locationCity;
        if (req.body.locationStateProvince !== undefined) contactUpdates.locationStateProvince = req.body.locationStateProvince;
        if (req.body.locationCountry !== undefined) contactUpdates.locationCountry = req.body.locationCountry;
        if (req.body.whatsappOptInStatus !== undefined) contactUpdates.whatsappOptInStatus = req.body.whatsappOptInStatus as OptInStatus;
        if (req.body.communicationConsent !== undefined) contactUpdates.communicationConsent = req.body.communicationConsent;
        
        if (Object.keys(contactUpdates).length > 0) {
          updateData.contact = contactUpdates as unknown as Partial<WorkerContactProps>;
        }
      }
      
      // Employment information
      if (req.body.employment ||
          req.body.jobTitle !== undefined ||
          req.body.department !== undefined ||
          req.body.team !== undefined ||
          req.body.hireDate !== undefined ||
          req.body.employmentStatus !== undefined ||
          req.body.employmentType !== undefined) {
        
        const employmentUpdates: EmploymentUpdates = {};
        if (req.body.jobTitle !== undefined) employmentUpdates.jobTitle = req.body.jobTitle;
        if (req.body.department !== undefined) employmentUpdates.department = req.body.department;
        if (req.body.team !== undefined) employmentUpdates.team = req.body.team;
        if (req.body.hireDate !== undefined) employmentUpdates.hireDate = req.body.hireDate ? new Date(req.body.hireDate) : null;
        if (req.body.employmentStatus !== undefined) employmentUpdates.employmentStatus = req.body.employmentStatus as EmploymentStatus;
        if (req.body.employmentType !== undefined) employmentUpdates.employmentType = req.body.employmentType as EmploymentType;
        
        if (Object.keys(employmentUpdates).length > 0) {
          updateData.employment = employmentUpdates as unknown as Partial<WorkerEmploymentProps>;
        }
      }
      
      // Engagement information
      if (req.body.engagement ||
          req.body.lastActiveAt !== undefined ||
          req.body.lastInteractionDate !== undefined) {
        
        const engagementUpdates: EngagementUpdates = {};
        if (req.body.lastActiveAt !== undefined) engagementUpdates.lastActiveAt = req.body.lastActiveAt ? new Date(req.body.lastActiveAt) : null;
        if (req.body.lastInteractionDate !== undefined) engagementUpdates.lastInteractionDate = req.body.lastInteractionDate ? new Date(req.body.lastInteractionDate) : null;
        
        if (Object.keys(engagementUpdates).length > 0) {
          updateData.engagement = engagementUpdates as unknown as Partial<WorkerEngagementProps>;
        }
      }
      
      // Wellbeing information
      if (req.body.wellbeing ||
          req.body.lastWellbeingAssessmentDate !== undefined ||
          req.body.overallWellbeingScore !== undefined) {
        
        const wellbeingUpdates: WellbeingUpdates = {};
        if (req.body.lastWellbeingAssessmentDate !== undefined) wellbeingUpdates.lastWellbeingAssessmentDate = req.body.lastWellbeingAssessmentDate ? new Date(req.body.lastWellbeingAssessmentDate) : null;
        if (req.body.overallWellbeingScore !== undefined) wellbeingUpdates.overallWellbeingScore = req.body.overallWellbeingScore;
        
        if (Object.keys(wellbeingUpdates).length > 0) {
          updateData.wellbeing = wellbeingUpdates as unknown as Partial<WorkerWellbeingProps>;
        }
      }
      
      // Gamification information
      if (req.body.gamification ||
          req.body.pointsBalance !== undefined ||
          req.body.badgesEarnedCount !== undefined) {
        
        const gamificationUpdates: GamificationUpdates = {};
        if (req.body.pointsBalance !== undefined) gamificationUpdates.pointsBalance = req.body.pointsBalance;
        if (req.body.badgesEarnedCount !== undefined) gamificationUpdates.badgesEarnedCount = req.body.badgesEarnedCount;
        
        if (Object.keys(gamificationUpdates).length > 0) {
          updateData.gamification = gamificationUpdates as unknown as Partial<WorkerGamificationProps>;
        }
      }
      
      const worker = await this.workerService.updateWorker(id, updateData);
      
      res.status(200).json({
        success: true,
        data: worker.toJSON()
      });
    } catch (error) {
      console.error(`Error updating worker ${req.params.id}:`, error);
      
      if (error instanceof AppError && error.message.includes('not found')) {
        res.status(404).json({ 
          success: false, 
          message: error.message 
        });
      } else if (error instanceof AppError) {
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to update worker',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Delete a worker
   */
  deleteWorker = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.workerService.deleteWorker(id);
      
      res.status(200).json({
        success: true,
        message: 'Worker deleted successfully'
      });
    } catch (error) {
      console.error(`Error deleting worker ${req.params.id}:`, error);
      
      if (error instanceof AppError && error.message.includes('not found')) {
        res.status(404).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to delete worker',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Bulk import workers
   */
  bulkImportWorkers = async (req: Request, res: Response): Promise<void> => {
    try {
      const organizationId = req.params.organizationId || req.user?.organizationId;
      
      if (!organizationId) {
        res.status(400).json({ 
          success: false, 
          message: 'Organization ID is required' 
        });
        return;
      }

      // Prepare workers data for import
      const workers: WorkerProps[] = req.body.workers.map((worker: WorkerInputData) => {
        const workerData: WorkerProps = {
          id: worker.id || '',
          externalId: worker.externalId,
          firstName: worker.firstName,
          lastName: worker.lastName,
          dateOfBirth: worker.dateOfBirth ? new Date(worker.dateOfBirth) : null,
          gender: worker.gender as Gender,
          customFields: worker.customFields,
          tags: worker.tags || [],
          organizationId,
          supervisorId: worker.supervisorId,
          isActive: worker.isActive !== undefined ? worker.isActive : true,
          deactivationReason: worker.deactivationReason,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add contact information if provided
        if (worker.contact || worker.primaryPhoneNumber || worker.emailAddress) {
          workerData.contact = {
            primaryPhoneNumber: worker.primaryPhoneNumber || worker.contact?.primaryPhoneNumber,
            whatsappOptInStatus: worker.whatsappOptInStatus || worker.contact?.whatsappOptInStatus || 'pending',
            preferredLanguage: worker.preferredLanguage || worker.contact?.preferredLanguage || 'en',
            communicationConsent: worker.communicationConsent || worker.contact?.communicationConsent || false,
            emailAddress: worker.emailAddress || worker.contact?.emailAddress,
            locationCity: worker.locationCity || worker.contact?.locationCity,
            locationStateProvince: worker.locationStateProvince || worker.contact?.locationStateProvince,
            locationCountry: worker.locationCountry || worker.contact?.locationCountry
          };
        }

        // Add employment information if provided
        if (worker.employment || worker.jobTitle || worker.department || worker.employmentStatus) {
          workerData.employment = {
            jobTitle: worker.jobTitle || worker.employment?.jobTitle,
            department: worker.department || worker.employment?.department,
            team: worker.team || worker.employment?.team,
            hireDate: worker.hireDate ? new Date(worker.hireDate) : 
                      (worker.employment?.hireDate ? new Date(worker.employment.hireDate) : null),
            employmentStatus: worker.employmentStatus || worker.employment?.employmentStatus || 'active',
            employmentType: worker.employmentType || worker.employment?.employmentType
          };
        }

        return workerData;
      });
      
      const result = await this.workerService.bulkImportWorkers({
        workers,
        organizationId
      });
      
      res.status(201).json({
        success: true,
        message: `Successfully imported ${result.count} workers`,
        count: result.count
      });
    } catch (error) {
      console.error('Error bulk importing workers:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to bulk import workers',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Bulk update workers
   */
  bulkUpdateWorkers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { workerIds, updates } = req.body;
      
      // Prepare nested updates structure
      const updateData: Partial<WorkerProps> = {};
      
      // Map flat structure to nested structure
      if (updates) {
        // Core properties
        if (updates.firstName !== undefined) updateData.firstName = updates.firstName;
        if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
        if (updates.externalId !== undefined) updateData.externalId = updates.externalId;
        if (updates.dateOfBirth !== undefined) updateData.dateOfBirth = updates.dateOfBirth ? new Date(updates.dateOfBirth) : null;
        if (updates.gender !== undefined) updateData.gender = updates.gender;
        if (updates.customFields !== undefined) updateData.customFields = updates.customFields;
        if (updates.tags !== undefined) updateData.tags = updates.tags;
        if (updates.supervisorId !== undefined) updateData.supervisorId = updates.supervisorId;
        
        // Contact related fields
        const contactUpdates: ContactUpdates = {};
        if (updates.primaryPhoneNumber !== undefined) contactUpdates.primaryPhoneNumber = updates.primaryPhoneNumber;
        if (updates.emailAddress !== undefined) contactUpdates.emailAddress = updates.emailAddress;
        if (updates.preferredLanguage !== undefined) contactUpdates.preferredLanguage = updates.preferredLanguage;
        if (updates.locationCity !== undefined) contactUpdates.locationCity = updates.locationCity;
        if (updates.locationStateProvince !== undefined) contactUpdates.locationStateProvince = updates.locationStateProvince;
        if (updates.locationCountry !== undefined) contactUpdates.locationCountry = updates.locationCountry;
        if (updates.whatsappOptInStatus !== undefined) contactUpdates.whatsappOptInStatus = updates.whatsappOptInStatus as OptInStatus;
        if (updates.communicationConsent !== undefined) contactUpdates.communicationConsent = updates.communicationConsent;
        
        if (Object.keys(contactUpdates).length > 0) {
          updateData.contact = contactUpdates as unknown as Partial<WorkerContactProps>;
        }
        
        // Employment related fields
        const employmentUpdates: EmploymentUpdates = {};
        if (updates.jobTitle !== undefined) employmentUpdates.jobTitle = updates.jobTitle;
        if (updates.department !== undefined) employmentUpdates.department = updates.department;
        if (updates.team !== undefined) employmentUpdates.team = updates.team;
        if (updates.hireDate !== undefined) employmentUpdates.hireDate = updates.hireDate ? new Date(updates.hireDate) : null;
        if (updates.employmentStatus !== undefined) employmentUpdates.employmentStatus = updates.employmentStatus as EmploymentStatus;
        if (updates.employmentType !== undefined) employmentUpdates.employmentType = updates.employmentType as EmploymentType;
        
        if (Object.keys(employmentUpdates).length > 0) {
          updateData.employment = employmentUpdates as unknown as Partial<WorkerEmploymentProps>;
        }
        
        // Engagement related fields
        const engagementUpdates: EngagementUpdates = {};
        if (updates.lastActiveAt !== undefined) engagementUpdates.lastActiveAt = updates.lastActiveAt ? new Date(updates.lastActiveAt) : null;
        if (updates.lastInteractionDate !== undefined) engagementUpdates.lastInteractionDate = updates.lastInteractionDate ? new Date(updates.lastInteractionDate) : null;
        
        if (Object.keys(engagementUpdates).length > 0) {
          updateData.engagement = engagementUpdates as unknown as Partial<WorkerEngagementProps>;
        }
        
        // Wellbeing related fields
        const wellbeingUpdates: WellbeingUpdates = {};
        if (updates.lastWellbeingAssessmentDate !== undefined) wellbeingUpdates.lastWellbeingAssessmentDate = updates.lastWellbeingAssessmentDate ? new Date(updates.lastWellbeingAssessmentDate) : null;
        if (updates.overallWellbeingScore !== undefined) wellbeingUpdates.overallWellbeingScore = updates.overallWellbeingScore;
        
        if (Object.keys(wellbeingUpdates).length > 0) {
          updateData.wellbeing = wellbeingUpdates as unknown as Partial<WorkerWellbeingProps>;
        }
        
        // Gamification related fields
        const gamificationUpdates: GamificationUpdates = {};
        if (updates.pointsBalance !== undefined) gamificationUpdates.pointsBalance = updates.pointsBalance;
        if (updates.badgesEarnedCount !== undefined) gamificationUpdates.badgesEarnedCount = updates.badgesEarnedCount;
        
        if (Object.keys(gamificationUpdates).length > 0) {
          updateData.gamification = gamificationUpdates as unknown as Partial<WorkerGamificationProps>;
        }
      }
      
      const result = await this.workerService.bulkUpdateWorkers({
        workerIds,
        updates: updateData
      });
      
      res.status(200).json({
        success: true,
        message: `Successfully updated ${result.count} workers`,
        count: result.count
      });
    } catch (error) {
      console.error('Error bulk updating workers:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to bulk update workers',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Bulk delete workers
   */
  bulkDeleteWorkers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { workerIds } = req.body;
      
      const result = await this.workerService.bulkDeleteWorkers(workerIds);
      
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.count} workers`,
        count: result.count
      });
    } catch (error) {
      console.error('Error bulk deleting workers:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ 
          success: false, 
          message: error.message
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to bulk delete workers',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Add tags to a worker
   */
  addWorkerTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const tagsData: WorkerTagsDTO = req.body;
      
      const worker = await this.workerService.addWorkerTags(id, tagsData);
      
      res.status(200).json({
        success: true,
        data: worker.toJSON()
      });
    } catch (error) {
      console.error(`Error adding tags to worker ${req.params.id}:`, error);
      
      if (error instanceof AppError && error.message.includes('not found')) {
        res.status(404).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to add tags to worker',
          error: (error as Error).message
        });
      }
    }
  };

  /**
   * Remove a tag from a worker
   */
  removeWorkerTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, tag } = req.params;
      
      const worker = await this.workerService.removeWorkerTag(id, tag);
      
      res.status(200).json({
        success: true,
        data: worker.toJSON()
      });
    } catch (error) {
      console.error(`Error removing tag from worker ${req.params.id}:`, error);
      
      if (error instanceof AppError && error.message.includes('not found')) {
        res.status(404).json({ 
          success: false, 
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to remove tag from worker',
          error: (error as Error).message
        });
      }
    }
  };
} 