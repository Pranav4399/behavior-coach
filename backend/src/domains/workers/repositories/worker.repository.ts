import { PrismaClient } from '@prisma/client';
import { 
  Worker, 
  WorkerProps,
  WorkerFilterOptions,
  Gender,
  CustomField,
  OptInStatus,
  EmploymentStatus,
  EmploymentType,
  DeactivationReason
} from '../models/worker.model';
import prisma from '../../../../prisma/prisma';

// Define type for transaction client
type PrismaTransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

// Define types for the contact, employment, etc. data from Prisma
interface PrismaContactData {
  id: string;
  workerId: string;
  locationCity?: string | null;
  locationStateProvince?: string | null;
  locationCountry?: string | null;
  primaryPhoneNumber: string;
  whatsappOptInStatus: OptInStatus;
  preferredLanguage: string;
  communicationConsent: boolean;
  emailAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaEmploymentData {
  id: string;
  workerId: string;
  jobTitle?: string | null;
  department?: string | null;
  team?: string | null;
  hireDate?: Date | null;
  employmentStatus: EmploymentStatus;
  employmentType?: EmploymentType | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaEngagementData {
  id: string;
  workerId: string;
  lastActiveAt?: Date | null;
  lastInteractionDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaWellbeingData {
  id: string;
  workerId: string;
  lastWellbeingAssessmentDate?: Date | null;
  overallWellbeingScore?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaGamificationData {
  id: string;
  workerId: string;
  pointsBalance: number;
  badgesEarnedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define a generic type for mapping Prisma data to Worker classes
type PrismaWorkerData = {
  id: string;
  externalId?: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date | null;
  gender?: string | null;
  customFields?: Record<string, CustomField> | null;
  tags: string[];
  isActive: boolean;
  deactivationReason?: DeactivationReason | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  supervisorId?: string | null;
  contact?: PrismaContactData;
  employment?: PrismaEmploymentData;
  engagement?: PrismaEngagementData;
  wellbeing?: PrismaWellbeingData;
  gamification?: PrismaGamificationData;
};

// Type for where clauses in Prisma queries
type PrismaWhereClause = {
  organizationId?: string;
  OR?: Array<Record<string, unknown>>;
  employment?: Record<string, unknown>;
  tags?: { hasSome: string[] };
};

export class WorkerRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Map Prisma worker data to Worker class
   */
  private mapToWorkerClass(data: PrismaWorkerData): Worker {
    // Prepare worker props
    const workerProps: WorkerProps = {
      id: data.id,
      externalId: data.externalId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as Gender,
      customFields: data.customFields,
      tags: data.tags || [],
      isActive: data.isActive,
      deactivationReason: data.deactivationReason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      organizationId: data.organizationId,
      supervisorId: data.supervisorId
    };

    // Add related data if included
    if (data.contact) {
      workerProps.contact = {
        id: data.contact.id,
        workerId: data.contact.workerId,
        locationCity: data.contact.locationCity,
        locationStateProvince: data.contact.locationStateProvince,
        locationCountry: data.contact.locationCountry,
        primaryPhoneNumber: data.contact.primaryPhoneNumber,
        whatsappOptInStatus: data.contact.whatsappOptInStatus,
        emailAddress: data.contact.emailAddress,
        preferredLanguage: data.contact.preferredLanguage,
        communicationConsent: data.contact.communicationConsent,
        createdAt: data.contact.createdAt,
        updatedAt: data.contact.updatedAt
      };
    }

    if (data.employment) {
      workerProps.employment = {
        id: data.employment.id,
        workerId: data.employment.workerId,
        jobTitle: data.employment.jobTitle,
        department: data.employment.department,
        team: data.employment.team,
        hireDate: data.employment.hireDate,
        employmentStatus: data.employment.employmentStatus,
        employmentType: data.employment.employmentType,
        createdAt: data.employment.createdAt,
        updatedAt: data.employment.updatedAt
      };
    }

    if (data.engagement) {
      workerProps.engagement = {
        id: data.engagement.id,
        workerId: data.engagement.workerId,
        lastActiveAt: data.engagement.lastActiveAt,
        lastInteractionDate: data.engagement.lastInteractionDate,
        createdAt: data.engagement.createdAt,
        updatedAt: data.engagement.updatedAt
      };
    }

    if (data.wellbeing) {
      workerProps.wellbeing = {
        id: data.wellbeing.id,
        workerId: data.wellbeing.workerId,
        wellbeingScore: data.wellbeing.overallWellbeingScore || 0,
        overallWellbeingScore: data.wellbeing.overallWellbeingScore,
        lastWellbeingCheckDate: data.wellbeing.lastWellbeingAssessmentDate,
        lastWellbeingAssessmentDate: data.wellbeing.lastWellbeingAssessmentDate,
        createdAt: data.wellbeing.createdAt,
        updatedAt: data.wellbeing.updatedAt
      };
    }

    if (data.gamification) {
      workerProps.gamification = {
        id: data.gamification.id,
        workerId: data.gamification.workerId,
        pointsBalance: data.gamification.pointsBalance,
        badgesEarnedCount: data.gamification.badgesEarnedCount,
        createdAt: data.gamification.createdAt,
        updatedAt: data.gamification.updatedAt
      };
    }

    return new Worker(workerProps);
  }

  /**
   * Get all workers with pagination and filtering
   */
  async findAll(
    organizationId: string, 
    page = 1, 
    limit = 10, 
    filterOptions?: WorkerFilterOptions
  ): Promise<{ workers: Worker[]; total: number }> {
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where: PrismaWhereClause = {
      organizationId,
    };

    if (filterOptions) {
      // Search term across name and other fields
      if (filterOptions.searchTerm) {
        where.OR = [
          { firstName: { contains: filterOptions.searchTerm, mode: 'insensitive' } },
          { lastName: { contains: filterOptions.searchTerm, mode: 'insensitive' } },
          { externalId: { contains: filterOptions.searchTerm, mode: 'insensitive' } },
          { contact: { primaryPhoneNumber: { contains: filterOptions.searchTerm } } },
          { contact: { emailAddress: { contains: filterOptions.searchTerm, mode: 'insensitive' } } },
        ];
      }

      // Add employment status filter
      if (filterOptions.employmentStatus) {
        where.employment = {
          ...where.employment,
          employmentStatus: filterOptions.employmentStatus
        };
      }

      // Add department filter
      if (filterOptions.department) {
        where.employment = {
          ...where.employment,
          department: filterOptions.department
        };
      }

      // Add team filter
      if (filterOptions.team) {
        where.employment = {
          ...where.employment,
          team: filterOptions.team
        };
      }

      // Add hire date range filters
      if (filterOptions.hiredAfter || filterOptions.hiredBefore) {
        where.employment = {
          ...where.employment,
          hireDate: {
            ...(filterOptions.hiredAfter && { gte: filterOptions.hiredAfter }),
            ...(filterOptions.hiredBefore && { lte: filterOptions.hiredBefore })
          }
        };
      }

      // Add tags filter (array contains)
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        where.tags = { hasSome: filterOptions.tags };
      }
    }

    // Execute count and find in parallel
    const [workersData, total] = await Promise.all([
      this.prisma.worker.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          lastName: 'asc',
        },
        include: {
          contact: true,
          employment: true,
          engagement: true,
          wellbeing: true,
          gamification: true
        }
      }),
      this.prisma.worker.count({ where }),
    ]);

    // Map Prisma data to Worker class instances
    const workers = workersData.map((worker: PrismaWorkerData) => this.mapToWorkerClass(worker));

    return { workers, total };
  }

  /**
   * Find a worker by ID
   */
  async findById(id: string): Promise<Worker | null> {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: {
        contact: true,
        employment: true,
        engagement: true,
        wellbeing: true,
        gamification: true
      }
    });
    
    if (!worker) return null;
    
    return this.mapToWorkerClass(worker);
  }

  /**
   * Create a new worker
   */
  async create(workerProps: WorkerProps): Promise<Worker> {
    const { contact, employment, engagement, wellbeing, gamification, id, ...workerData } = workerProps;
    
    // Create the worker with all related records in a transaction
    const result = await this.prisma.$transaction(async (tx: PrismaTransactionClient) => {
      // Create main worker record
      const createdWorker = await tx.worker.create({
        data: {
          ...workerData,
          tags: workerData.tags || [],
          
          // Create related records if provided
          ...(contact && {
            contact: {
              create: {
                locationCity: contact.locationCity,
                locationStateProvince: contact.locationStateProvince,
                locationCountry: contact.locationCountry,
                primaryPhoneNumber: contact.primaryPhoneNumber,
                whatsappOptInStatus: contact.whatsappOptInStatus,
                preferredLanguage: contact.preferredLanguage,
                communicationConsent: contact.communicationConsent ?? false,
                emailAddress: contact.emailAddress
              }
            }
          }),
          
          ...(employment && {
            employment: {
              create: {
                jobTitle: employment.jobTitle,
                department: employment.department,
                team: employment.team,
                hireDate: employment.hireDate,
                employmentStatus: employment.employmentStatus || 'active',
                employmentType: employment.employmentType
              }
            }
          }),
          
          ...(engagement && {
            engagement: {
              create: {
                lastActiveAt: engagement.lastActiveAt,
                lastInteractionDate: engagement.lastInteractionDate,
                lastEngagementDate: engagement.lastEngagementDate,
                engagementRate: engagement.engagementRate || 0
              }
            }
          }),
          
          ...(wellbeing && {
            wellbeing: {
              create: {
                lastWellbeingAssessmentDate: wellbeing.lastWellbeingAssessmentDate,
                lastWellbeingCheckDate: wellbeing.lastWellbeingCheckDate,
                wellbeingScore: wellbeing.wellbeingScore || wellbeing.overallWellbeingScore || 0,
                overallWellbeingScore: wellbeing.overallWellbeingScore
              }
            }
          }),
          
          ...(gamification && {
            gamification: {
              create: {
                pointsBalance: gamification.pointsBalance || 0,
                badgesEarnedCount: gamification.badgesEarnedCount || 0
              }
            }
          })
        },
        include: {
          contact: true,
          employment: true,
          engagement: true,
          wellbeing: true,
          gamification: true
        }
      });
      
      return createdWorker;
    });
    
    return this.mapToWorkerClass(result);
  }

  /**
   * Update an existing worker
   */
  async update(id: string, updateData: Partial<WorkerProps>): Promise<Worker> {
    const { contact, employment, engagement, wellbeing, gamification, ...workerData } = updateData;
    
    // Update the worker and related records in a transaction
    const result = await this.prisma.$transaction(async (tx: PrismaTransactionClient) => {
      // Update worker core data
      const updatedWorker = await tx.worker.update({
        where: { id },
        data: workerData,
        include: {
          contact: true,
          employment: true,
          engagement: true,
          wellbeing: true,
          gamification: true
        }
      });
      
      // Update contact if provided
      if (contact) {
        if (updatedWorker.contact) {
          await tx.workerContact.update({
            where: { workerId: id },
            data: contact
          });
        } else {
          await tx.workerContact.create({
            data: {
              ...contact,
              workerId: id
            }
          });
        }
      }
      
      // Update employment if provided
      if (employment) {
        if (updatedWorker.employment) {
          await tx.workerEmployment.update({
            where: { workerId: id },
            data: employment
          });
        } else {
          await tx.workerEmployment.create({
            data: {
              ...employment,
              workerId: id
            }
          });
        }
      }
      
      // Update engagement if provided
      if (engagement) {
        if (updatedWorker.engagement) {
          await tx.workerEngagement.update({
            where: { workerId: id },
            data: engagement
          });
        } else {
          await tx.workerEngagement.create({
            data: {
              ...engagement,
              workerId: id
            }
          });
        }
      }
      
      // Update wellbeing if provided
      if (wellbeing) {
        if (updatedWorker.wellbeing) {
          await tx.workerWellbeing.update({
            where: { workerId: id },
            data: wellbeing
          });
        } else {
          await tx.workerWellbeing.create({
            data: {
              ...wellbeing,
              workerId: id
            }
          });
        }
      }
      
      // Update gamification if provided
      if (gamification) {
        if (updatedWorker.gamification) {
          await tx.workerGamification.update({
            where: { workerId: id },
            data: gamification
          });
        } else {
          await tx.workerGamification.create({
            data: {
              ...gamification,
              workerId: id
            }
          });
        }
      }
      
      // Get the fully updated worker with all relations
      return tx.worker.findUnique({
        where: { id },
        include: {
          contact: true,
          employment: true,
          engagement: true,
          wellbeing: true,
          gamification: true
        }
      });
    });
    
    if (!result) throw new Error(`Worker with ID ${id} not found`);
    
    return this.mapToWorkerClass(result);
  }

  /**
   * Delete a worker
   */
  async delete(id: string): Promise<Worker> {
    // Get the worker before deletion
    const worker = await this.findById(id);
    
    if (!worker) {
      throw new Error(`Worker with ID ${id} not found`);
    }
    
    // Delete the worker (related records will be deleted via cascade)
    await this.prisma.worker.delete({
      where: { id }
    });
    
    return worker;
  }

  /**
   * Bulk import workers
   */
  async bulkImport(data: { workers: WorkerProps[]; organizationId: string }): Promise<{ count: number }> {
    const { workers, organizationId } = data;
    
    // Create all workers in a transaction
    const result = await this.prisma.$transaction(async (tx: PrismaTransactionClient) => {
      for (const workerData of workers) {
        const { contact, employment, engagement, wellbeing, gamification, ...workerProps } = workerData;
        
        await tx.worker.create({
          data: {
            ...workerProps,
            organizationId,
            tags: workerProps.tags || [],
            
            // Create related records if provided
            ...(contact && {
              contact: {
                create: {
                  locationCity: contact.locationCity,
                  locationStateProvince: contact.locationStateProvince,
                  locationCountry: contact.locationCountry,
                  primaryPhoneNumber: contact.primaryPhoneNumber,
                  whatsappOptInStatus: contact.whatsappOptInStatus,
                  preferredLanguage: contact.preferredLanguage,
                  communicationConsent: contact.communicationConsent ?? false,
                  emailAddress: contact.emailAddress
                }
              }
            }),
            
            ...(employment && {
              employment: {
                create: {
                  jobTitle: employment.jobTitle,
                  department: employment.department,
                  team: employment.team,
                  hireDate: employment.hireDate,
                  employmentStatus: employment.employmentStatus || 'active',
                  employmentType: employment.employmentType
                }
              }
            }),
            
            ...(engagement && {
              engagement: {
                create: {
                  lastActiveAt: engagement.lastActiveAt,
                  lastInteractionDate: engagement.lastInteractionDate,
                  lastEngagementDate: engagement.lastEngagementDate,
                  engagementRate: engagement.engagementRate || 0
                }
              }
            }),
            
            ...(wellbeing && {
              wellbeing: {
                create: {
                  lastWellbeingAssessmentDate: wellbeing.lastWellbeingAssessmentDate,
                  lastWellbeingCheckDate: wellbeing.lastWellbeingCheckDate,
                  wellbeingScore: wellbeing.wellbeingScore || wellbeing.overallWellbeingScore || 0,
                  overallWellbeingScore: wellbeing.overallWellbeingScore
                }
              }
            }),
            
            ...(gamification && {
              gamification: {
                create: {
                  pointsBalance: gamification.pointsBalance || 0,
                  badgesEarnedCount: gamification.badgesEarnedCount || 0
                }
              }
            })
          }
        });
      }
      return { count: workers.length };
    });
    
    return result;
  }

  /**
   * Bulk update workers
   */
  async bulkUpdate(data: { workerIds: string[]; updates: Partial<WorkerProps> }): Promise<{ count: number }> {
    const { workerIds, updates } = data;
    const { contact, employment, engagement, wellbeing, gamification, ...workerUpdates } = updates;
    
    // Update all workers in a transaction
    const result = await this.prisma.$transaction(async (tx: PrismaTransactionClient) => {
      let count = 0;
      
      for (const id of workerIds) {
        try {
          // Update worker core data
          await tx.worker.update({
            where: { id },
            data: workerUpdates
          });
          
          // Update related data if provided
          if (contact) {
            await tx.workerContact.upsert({
              where: { workerId: id },
              update: contact,
              create: {
                ...contact,
                workerId: id,
                primaryPhoneNumber: contact.primaryPhoneNumber || '',
                whatsappOptInStatus: contact.whatsappOptInStatus || 'pending',
                preferredLanguage: contact.preferredLanguage || 'en',
                communicationConsent: contact.communicationConsent ?? false
              }
            });
          }
          
          if (employment) {
            await tx.workerEmployment.upsert({
              where: { workerId: id },
              update: employment,
              create: {
                ...employment,
                workerId: id,
                employmentStatus: employment.employmentStatus || 'active'
              }
            });
          }
          
          if (engagement) {
            await tx.workerEngagement.upsert({
              where: { workerId: id },
              update: engagement,
              create: {
                ...engagement,
                workerId: id
              }
            });
          }
          
          if (wellbeing) {
            await tx.workerWellbeing.upsert({
              where: { workerId: id },
              update: wellbeing,
              create: {
                ...wellbeing,
                workerId: id
              }
            });
          }
          
          if (gamification) {
            await tx.workerGamification.upsert({
              where: { workerId: id },
              update: gamification,
              create: {
                ...gamification,
                workerId: id,
                pointsBalance: gamification.pointsBalance || 0,
                badgesEarnedCount: gamification.badgesEarnedCount || 0
              }
            });
          }
          
          count++;
        } catch (error) {
          // Log error but continue with other workers
          console.error(`Failed to update worker ${id}:`, error);
        }
      }
      
      return { count };
    });
    
    return result;
  }

  /**
   * Bulk delete workers
   */
  async bulkDelete(workerIds: string[]): Promise<{ count: number }> {
    // Delete all workers in a transaction
    const result = await this.prisma.$transaction(async (tx: PrismaTransactionClient) => {
      let count = 0;
      for (const id of workerIds) {
        try {
          await tx.worker.delete({
            where: { id },
          });
          count++;
        } catch (error) {
          // Log error but continue with other workers
          console.error(`Failed to delete worker ${id}:`, error);
        }
      }
      return { count };
    });
    
    return result;
  }

  /**
   * Add tags to a worker
   */
  async addTags(workerId: string, tags: string[]): Promise<Worker> {
    const worker = await this.findById(workerId);

    if (!worker) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    // Add new tags without duplicates
    const uniqueTags = [...new Set([...worker.tags, ...tags])];

    // Update tags
    const updatedWorker = await this.update(workerId, { tags: uniqueTags });
    
    return updatedWorker;
  }

  /**
   * Remove a tag from a worker
   */
  async removeTag(workerId: string, tag: string): Promise<Worker> {
    const worker = await this.findById(workerId);

    if (!worker) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    // Filter out the tag to remove
    const updatedTags = worker.tags.filter((t: string) => t !== tag);

    // Update tags
    const updatedWorker = await this.update(workerId, { tags: updatedTags });
    
    return updatedWorker;
  }

  /**
   * Find workers by organization ID
   */
  async findByOrganizationId(
    organizationId: string,
    page = 1,
    limit = 10
  ): Promise<{ workers: Worker[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [workersData, total] = await Promise.all([
      this.prisma.worker.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: {
          lastName: 'asc',
        },
        include: {
          contact: true,
          employment: true,
          engagement: true,
          wellbeing: true,
          gamification: true
        }
      }),
      this.prisma.worker.count({
        where: { organizationId },
      }),
    ]);

    // Map to Worker class instances
    const workers = workersData.map((worker: PrismaWorkerData) => this.mapToWorkerClass(worker));

    return { workers, total };
  }

  /**
   * Find workers by their external IDs
   * @param externalIds Array of external IDs
   * @returns Promise with array of workers matching the external IDs
   */
  async findByExternalIds(externalIds: string[]): Promise<Worker[]> {
    if (!externalIds.length) {
      return [];
    }
    
    const workersData = await this.prisma.worker.findMany({
      where: {
        externalId: {
          in: externalIds
        }
      },
      include: {
        contact: true,
        employment: true,
        engagement: true,
        wellbeing: true,
        gamification: true
      }
    });
    
    // Map to Worker class instances
    return workersData.map((worker: PrismaWorkerData) => this.mapToWorkerClass(worker));
  }

  /**
   * Find workers by their email addresses
   * @param emails Array of email addresses
   * @returns Promise with array of workers matching the email addresses
   */
  async findByEmails(emails: string[]): Promise<Worker[]> {
    if (!emails.length) {
      return [];
    }
    
    const workersData = await this.prisma.worker.findMany({
      where: {
        contact: {
          emailAddress: {
            in: emails
          }
        }
      },
      include: {
        contact: true,
        employment: true,
        engagement: true,
        wellbeing: true,
        gamification: true
      }
    });
    
    // Map to Worker class instances
    return workersData.map((worker: PrismaWorkerData) => this.mapToWorkerClass(worker));
  }

  /**
   * Find workers by their phone numbers
   * @param phoneNumbers Array of phone numbers
   * @returns Promise with array of workers matching the phone numbers
   */
  async findByPhoneNumbers(phoneNumbers: string[]): Promise<Worker[]> {
    if (!phoneNumbers.length) {
      return [];
    }
    
    const workersData = await this.prisma.worker.findMany({
      where: {
        contact: {
          primaryPhoneNumber: {
            in: phoneNumbers
          }
        }
      },
      include: {
        contact: true,
        employment: true,
        engagement: true,
        wellbeing: true,
        gamification: true
      }
    });
    
    // Map to Worker class instances
    return workersData.map((worker: PrismaWorkerData) => this.mapToWorkerClass(worker));
  }
} 