import { Request, Response } from 'express';
import { WorkerService } from '../services/worker.service';
import workerCsvService from '../services/worker-csv.service';
import { Worker } from '../models/worker.model';
import { AppError } from '../../../common/middleware/errorHandler';

export class WorkerCsvController {
  private workerService: WorkerService;
  private BATCH_SIZE = 100; // Process workers in batches of 100

  constructor() {
    this.workerService = new WorkerService();
  }

  /**
   * Upload and process CSV file with worker data
   */
  uploadCsv = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get organization ID from params or user
      const organizationId = req.params.organizationId || req.user?.organizationId;
      
      if (!organizationId) {
        res.status(400).json({ 
          success: false, 
          message: 'Organization ID is required' 
        });
        return;
      }

      // Check if we received a file
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No CSV file provided'
        });
        return;
      }

      // Mode: 'create' for new workers, 'update' for existing workers (default is 'create')
      const mode = req.query.mode === 'update' ? 'update' : 'create';
      
      // Parse and validate the CSV file
      const parseResult = await workerCsvService.parseWorkerCsv(req.file.buffer);
      
      // If there are validation errors, return detailed information
      if (!parseResult.success) {
        // Group errors by row for better visualization
        const errorsByRow: Record<number, Array<any>> = {};
        parseResult.errors.forEach(error => {
          if (!errorsByRow[error.row]) {
            errorsByRow[error.row] = [];
          }
          errorsByRow[error.row].push(error);
        });
        
        // Count errors by severity
        const errorStats = {
          error: parseResult.errors.filter(e => e.severity === 'error').length,
          warning: parseResult.errors.filter(e => e.severity === 'warning').length,
          info: parseResult.errors.filter(e => e.severity === 'info').length
        };
        
        res.status(400).json({
          success: false,
          message: 'CSV validation failed',
          errors: parseResult.errors,
          errorsByRow,
          errorStats,
          summary: parseResult.summary,
          validRecords: parseResult.data.length,
          totalRecords: parseResult.summary?.totalRows || 0
        });
        return;
      }

      // Convert CSV records to worker objects
      const workerData = workerCsvService.transformRecordsToWorkers(parseResult.data, organizationId);
      
      // Do a dry run to check for any database-level errors
      const dryRun = req.query.dryRun === 'true';
      if (dryRun) {
        res.status(200).json({
          success: true,
          message: 'CSV validation successful (dry run)',
          count: workerData.length,
          mode,
          summary: parseResult.summary
        });
        return;
      }

      // Process records based on mode
      if (mode === 'update') {
        await this.processWorkerUpdates(workerData, organizationId, res);
      } else {
        await this.processWorkerCreation(workerData, organizationId, res);
      }
    } catch (error) {
      console.error('Error processing CSV upload:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process CSV file',
        error: (error as Error).message
      });
    }
  };

  /**
   * Process worker creation from CSV data
   */
  private async processWorkerCreation(workerData: any[], organizationId: string, res: Response): Promise<void> {
    try {
      // Process workers in batches to avoid memory issues with large files
      const batches = this.chunkArray(workerData, this.BATCH_SIZE);
      let totalImported = 0;
      const processingResults = {
        successful: [] as string[],
        failed: [] as {id?: string, firstName: string, lastName: string, error: string}[]
      };
      
      // Process each batch
      for (const batch of batches) {
        try {
          const result = await this.workerService.bulkImportWorkers({
            workers: batch,
            organizationId
          });
          
          totalImported += result.count;
          
          // Record successful imports (we don't have individual success records from bulk import currently)
          batch.forEach(worker => {
            processingResults.successful.push(`${worker.firstName} ${worker.lastName}`);
          });
        } catch (error) {
          // In case of batch failure, log the error but continue with other batches
          console.error('Error importing batch:', error);
          
          // Record failed workers
          batch.forEach(worker => {
            processingResults.failed.push({
              firstName: worker.firstName,
              lastName: worker.lastName,
              error: (error as Error).message
            });
          });
        }
      }
      
      res.status(201).json({
        success: processingResults.failed.length === 0,
        message: `Imported ${totalImported} workers successfully${processingResults.failed.length > 0 ? `, failed to import ${processingResults.failed.length} workers` : ''}`,
        count: totalImported,
        failedCount: processingResults.failed.length,
        mode: 'create',
        processingResults: processingResults.failed.length > 0 ? processingResults : undefined
      });
    } catch (error) {
      throw new AppError(`Failed to create workers: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Process worker updates from CSV data
   */
  private async processWorkerUpdates(workerData: any[], organizationId: string, res: Response): Promise<void> {
    try {
      // First, collect all possible identifiers we'll use for matching
      const externalIds = workerData
        .map(worker => worker.externalId)
        .filter(id => id) as string[];
      
      const emails = workerData
        .map(worker => worker.contact?.emailAddress)
        .filter(email => email) as string[];
      
      const phones = workerData
        .map(worker => worker.contact?.primaryPhoneNumber)
        .filter(phone => phone) as string[];
      
      // Get all existing workers that might match our update criteria
      const workersToUpdate = await this.getExistingWorkersForUpdate(organizationId, externalIds, emails, phones);
      
      // Match and prepare updates
      const updates = this.prepareWorkerUpdates(workerData, workersToUpdate);
      
      // Track workers that could not be matched for update
      const notFoundWorkers = workerData.filter(worker => 
        !updates.some(update => 
          update.externalId === worker.externalId || 
          update.contact?.emailAddress === worker.contact?.emailAddress ||
          update.contact?.primaryPhoneNumber === worker.contact?.primaryPhoneNumber
        )
      );
      
      // Process updates in batches
      const batches = this.chunkArray(updates, this.BATCH_SIZE);
      let totalUpdated = 0;
      const processingResults = {
        successful: [] as {id: string, name: string}[],
        failed: [] as {id: string, name: string, error: string}[],
        notFound: notFoundWorkers.map(w => ({
          externalId: w.externalId,
          name: `${w.firstName} ${w.lastName}`,
          identifiers: {
            email: w.contact?.emailAddress,
            phone: w.contact?.primaryPhoneNumber
          }
        }))
      };
      
      for (const batch of batches) {
        for (const update of batch) {
          try {
            const result = await this.workerService.updateWorker(update.id, update);
            processingResults.successful.push({
              id: result.id,
              name: `${result.firstName} ${result.lastName}`
            });
            totalUpdated++;
          } catch (error) {
            processingResults.failed.push({
              id: update.id,
              name: `${update.firstName} ${update.lastName}`,
              error: (error as Error).message
            });
          }
        }
      }
      
      // Return detailed results
      res.status(200).json({
        success: processingResults.failed.length === 0 && processingResults.notFound.length === 0,
        message: `Updated ${totalUpdated} workers successfully${processingResults.failed.length > 0 ? `, ${processingResults.failed.length} failed` : ''}${processingResults.notFound.length > 0 ? `, ${processingResults.notFound.length} workers not found` : ''}`,
        count: totalUpdated,
        notFoundCount: processingResults.notFound.length,
        failedCount: processingResults.failed.length,
        mode: 'update',
        processingResults
      });
    } catch (error) {
      throw new AppError(`Failed to update workers: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get existing workers that match potential update criteria
   */
  private async getExistingWorkersForUpdate(
    organizationId: string,
    externalIds: string[],
    emails: string[],
    phones: string[]
  ): Promise<Worker[]> {
    // Get workers by different identifiers
    const [workersByExternalId, workersByEmail, workersByPhone] = await Promise.all([
      externalIds.length ? await this.workerService.getWorkersByExternalIds(externalIds) : [],
      emails.length ? await this.workerService.getWorkersByEmails(emails) : [],
      phones.length ? await this.workerService.getWorkersByPhoneNumbers(phones) : []
    ]);
    
    // Combine all results, removing duplicates by worker ID
    const workersMap = new Map<string, Worker>();
    
    [...workersByExternalId, ...workersByEmail, ...workersByPhone].forEach(worker => {
      // Only include workers from the specified organization
      if (worker.organizationId === organizationId) {
        workersMap.set(worker.id, worker);
      }
    });
    
    return Array.from(workersMap.values());
  }

  /**
   * Match and prepare worker updates
   */
  private prepareWorkerUpdates(workerData: any[], existingWorkers: Worker[]): any[] {
    const updates: any[] = [];
    
    for (const worker of workerData) {
      // Try to find a match using various fields
      let match: Worker | undefined;
      
      // Try matching by external ID first (most reliable)
      if (worker.externalId) {
        match = existingWorkers.find(w => w.externalId === worker.externalId);
      }
      
      // If no match by external ID, try email
      if (!match && worker.contact?.emailAddress) {
        match = existingWorkers.find(
          w => w.contact?.emailAddress === worker.contact.emailAddress
        );
      }
      
      // If still no match, try phone number
      if (!match && worker.contact?.primaryPhoneNumber) {
        match = existingWorkers.find(
          w => w.contact?.primaryPhoneNumber === worker.contact.primaryPhoneNumber
        );
      }
      
      // If we found a match, prepare the update
      if (match) {
        updates.push({ id: match.id, ...worker });
      }
    }
    
    return updates;
  }

  /**
   * Split array into chunks of specified size
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  /**
   * Download a CSV template for worker import
   */
  downloadTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      // Generate the template CSV
      const template = await workerCsvService.generateTemplate();
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=worker_template.csv');
      
      // Send the template
      res.status(200).send(template);
    } catch (error) {
      console.error('Error generating CSV template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate CSV template',
        error: (error as Error).message
      });
    }
  };

  /**
   * Download a sample CSV with example worker data
   */
  downloadSample = async (req: Request, res: Response): Promise<void> => {
    try {
      // Generate the sample CSV
      const sample = await workerCsvService.generateSample();
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=worker_sample.csv');
      
      // Send the sample
      res.status(200).send(sample);
    } catch (error) {
      console.error('Error generating CSV sample:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate CSV sample',
        error: (error as Error).message
      });
    }
  };

  /**
   * Validate a CSV file without importing the data
   */
  validateCsv = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if we received a file
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No CSV file provided'
        });
        return;
      }

      // Parse and validate the CSV file
      const parseResult = await workerCsvService.parseWorkerCsv(req.file.buffer);
      
      // Group errors by row for better visualization
      const errorsByRow: Record<number, Array<any>> = {};
      parseResult.errors.forEach(error => {
        if (!errorsByRow[error.row]) {
          errorsByRow[error.row] = [];
        }
        errorsByRow[error.row].push(error);
      });
      
      // Count errors by type
      const errorStats = {
        error: parseResult.errors.filter(e => e.severity === 'error').length,
        warning: parseResult.errors.filter(e => e.severity === 'warning').length,
        info: parseResult.errors.filter(e => e.severity === 'info').length
      };
      
      // Count errors by code
      const errorsByCode: Record<string, number> = {};
      parseResult.errors.forEach(error => {
        if (error.code) {
          errorsByCode[error.code] = (errorsByCode[error.code] || 0) + 1;
        }
      });
      
      // Return enhanced validation results
      res.status(200).json({
        success: parseResult.success,
        message: parseResult.success ? 'CSV validation successful' : 'CSV validation failed',
        errors: parseResult.errors,
        errorsByRow,
        errorStats,
        errorsByCode,
        validRecords: parseResult.data.length,
        totalRecords: parseResult.summary?.totalRows || 0,
        summary: parseResult.summary
      });
    } catch (error) {
      console.error('Error validating CSV:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate CSV file',
        error: (error as Error).message
      });
    }
  };
} 