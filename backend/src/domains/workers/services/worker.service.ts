import { 
  Worker, 
  WorkerProps,
  WorkerFilterOptions,
  WorkerTagsDTO
} from '../models/worker.model';
import { WorkerRepository } from '../repositories/worker.repository';
import { AppError } from '../../../common/middleware/errorHandler';

export class WorkerService {
  private workerRepository: WorkerRepository;

  constructor() {
    this.workerRepository = new WorkerRepository();
  }

  /**
   * Get all workers with pagination and filtering
   */
  async getWorkers(
    organizationId: string,
    page = 1,
    limit = 10,
    filterOptions?: WorkerFilterOptions
  ): Promise<{ workers: Worker[]; total: number; page: number; limit: number; totalPages: number }> {
    const { workers, total } = await this.workerRepository.findAll(
      organizationId,
      page,
      limit,
      filterOptions
    );

    const totalPages = Math.ceil(total / limit);

    return {
      workers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get worker by ID
   */
  async getWorkerById(id: string): Promise<Worker> {
    const worker = await this.workerRepository.findById(id);
    
    if (!worker) {
      throw new AppError(`Worker with ID ${id} not found`, 404);
    }
    
    return worker;
  }

  /**
   * Create a new worker
   */
  async createWorker(data: WorkerProps): Promise<Worker> {
    // Create a worker instance to validate the data
    const worker = new Worker(data);
    
    // Validate worker data
    worker.validate();
    
    // If we have contact info, validate it
    if (worker.contact) {
      worker.contact.validate();
    }
    
    return this.workerRepository.create(data);
  }

  /**
   * Update an existing worker
   */
  async updateWorker(id: string, data: Partial<WorkerProps>): Promise<Worker> {
    // Check if worker exists
    const existingWorker = await this.getWorkerById(id);
    
    // Update the worker object
    existingWorker.update(data);
    
    // Save the updated worker
    return this.workerRepository.update(id, data);
  }

  /**
   * Delete a worker
   */
  async deleteWorker(id: string): Promise<Worker> {
    // Check if worker exists
    await this.getWorkerById(id);
    
    // Delete the worker
    return this.workerRepository.delete(id);
  }

  /**
   * Bulk import workers
   */
  async bulkImportWorkers(data: { workers: WorkerProps[]; organizationId: string }): Promise<{ count: number }> {
    // Validate each worker
    for (const workerData of data.workers) {
      // Create a worker instance to validate
      const worker = new Worker({
        ...workerData,
        organizationId: data.organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Validate core worker data
      worker.validate();
      
      // If contact info provided, validate it
      if (worker.contact) {
        worker.contact.validate();
      }
    }
    
    return this.workerRepository.bulkImport(data);
  }

  /**
   * Bulk update workers
   */
  async bulkUpdateWorkers(data: { workerIds: string[]; updates: Partial<WorkerProps> }): Promise<{ count: number }> {
    // Validate update data if necessary
    // For bulk operations we can't validate everything, but we can check for basic issues
    if (data.updates.firstName === '') {
      throw new AppError('First name cannot be empty', 400);
    }
    
    if (data.updates.lastName === '') {
      throw new AppError('Last name cannot be empty', 400);
    }
    
    if (data.updates.contact?.emailAddress && !this.isValidEmail(data.updates.contact.emailAddress)) {
      throw new AppError('Valid email address is required', 400);
    }
    
    if (data.updates.contact?.primaryEmailAddress && !this.isValidEmail(data.updates.contact.primaryEmailAddress)) {
      throw new AppError('Valid primary email address is required', 400);
    }
    
    return this.workerRepository.bulkUpdate(data);
  }

  /**
   * Basic email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Bulk delete workers
   */
  async bulkDeleteWorkers(workerIds: string[]): Promise<{ count: number }> {
    return this.workerRepository.bulkDelete(workerIds);
  }

  /**
   * Add tags to a worker
   */
  async addWorkerTags(workerId: string, data: WorkerTagsDTO): Promise<Worker> {
    return this.workerRepository.addTags(workerId, data.tags);
  }

  /**
   * Remove a tag from a worker
   */
  async removeWorkerTag(workerId: string, tag: string): Promise<Worker> {
    return this.workerRepository.removeTag(workerId, tag);
  }

  /**
   * Get workers by organization ID
   */
  async getWorkersByOrganization(
    organizationId: string,
    page = 1,
    limit = 10
  ): Promise<{ workers: Worker[]; total: number; page: number; limit: number; totalPages: number }> {
    const { workers, total } = await this.workerRepository.findByOrganizationId(
      organizationId,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      workers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Update a worker's active status
   * This is a convenience method for a common operation
   */
  async updateLastActive(workerId: string): Promise<void> {
    const now = new Date();
    await this.workerRepository.update(workerId, {
      engagement: {
        lastEngagementDate: now,
        lastActiveAt: now,
        lastInteractionDate: now
      }
    });
  }

  /**
   * Get workers by their external IDs
   * @param externalIds Array of external IDs to lookup
   * @returns Promise with array of found workers
   */
  async getWorkersByExternalIds(externalIds: string[]): Promise<Worker[]> {
    const workers = await this.workerRepository.findByExternalIds(externalIds);
    return workers;
  }

  /**
   * Get workers by their email addresses
   * @param emails Array of email addresses to lookup
   * @returns Promise with array of found workers
   */
  async getWorkersByEmails(emails: string[]): Promise<Worker[]> {
    if (!emails.length) return [];
    const workers = await this.workerRepository.findByEmails(emails);
    return workers;
  }

  /**
   * Get workers by their phone numbers
   * @param phoneNumbers Array of phone numbers to lookup
   * @returns Promise with array of found workers
   */
  async getWorkersByPhoneNumbers(phoneNumbers: string[]): Promise<Worker[]> {
    if (!phoneNumbers.length) return [];
    const workers = await this.workerRepository.findByPhoneNumbers(phoneNumbers);
    return workers;
  }
} 