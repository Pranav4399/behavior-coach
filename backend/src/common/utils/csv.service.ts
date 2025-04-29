import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { Readable, Writable } from 'stream';

export enum ErrorSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface CsvValidationError {
  row: number;
  column: string;
  message: string;
  value?: any;
  severity: ErrorSeverity;
  code?: string;
  suggestedFix?: string;
}

export interface CsvParseResult<T> {
  data: T[];
  errors: CsvValidationError[];
  success: boolean;
  summary?: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    warningRows: number;
  };
}

export interface CsvFieldValidator {
  validate: (value: any, rowIndex: number, columnName: string) => string | null;
  required?: boolean;
  transform?: (value: any) => any;
  validateWithContext?: (value: any, rowData: Record<string, any>, rowIndex: number, columnName: string) => CsvValidationError | null;
}

export interface CsvValidationOptions {
  validators: Record<string, CsvFieldValidator>;
  requiredFields?: string[];
  customRowValidators?: Array<(row: Record<string, any>, rowIndex: number) => CsvValidationError[]>;
  headerMap?: Record<string, string>;
}

export class CsvService {
  /**
   * Parse a CSV file from a buffer
   * @param buffer The CSV file buffer
   * @param options Parsing options
   * @returns Promise with parsed data
   */
  async parseCsvBuffer<T>(
    buffer: Buffer,
    options: { columns: boolean; skipEmptyLines: boolean } = { columns: true, skipEmptyLines: true }
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];
      
      // Create a readable stream from the buffer
      const readableStream = Readable.from([buffer]);
      
      // Create the parser
      const parser = parse({
        columns: options.columns,
        skip_empty_lines: options.skipEmptyLines,
        trim: true
      });
      
      // Handle parsing
      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          results.push(record as T);
        }
      });
      
      // Handle errors
      parser.on('error', (err) => {
        reject(err);
      });
      
      // Finalize parsing
      parser.on('end', () => {
        resolve(results);
      });
      
      // Start the process
      readableStream.pipe(parser);
    });
  }

  /**
   * Generate a CSV file from data
   * @param data Array of objects to convert to CSV
   * @param headers Column headers (keys from the data objects)
   * @returns Promise with CSV string
   */
  async generateCsv<T>(
    data: T[],
    headers: { key: string; header: string }[]
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const writableStream = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(Buffer.from(chunk));
          callback();
        }
      });
      
      // Create the stringifier
      const stringifier = stringify({
        header: true,
        columns: headers,
      });
      
      // Handle errors
      stringifier.on('error', (err) => {
        reject(err);
      });
      
      // Finalize
      writableStream.on('finish', () => {
        const csvString = Buffer.concat(chunks).toString('utf8');
        resolve(csvString);
      });
      
      // Start the process
      stringifier.pipe(writableStream);
      
      // Write the data
      data.forEach(record => {
        stringifier.write(record);
      });
      
      // End the stream
      stringifier.end();
    });
  }

  /**
   * Validate parsed CSV data against a set of validation rules
   * @param data Parsed CSV data
   * @param validationOptions Validation options
   * @returns Validation result with data and errors
   */
  validateCsvData<T>(
    data: Record<string, any>[],
    validationOptions: CsvValidationOptions
  ): CsvParseResult<T> {
    const errors: CsvValidationError[] = [];
    const validatedData: T[] = [];
    const { validators, requiredFields = [], customRowValidators = [], headerMap = {} } = validationOptions;
    
    const errorRowsSet = new Set<number>();
    const warningRowsSet = new Set<number>();

    // Validate headers first (missing columns)
    if (data.length > 0) {
      const firstRow = data[0];
      const missingRequiredColumns = requiredFields.filter(field => 
        !(field in firstRow) && !Object.keys(headerMap).includes(field)
      );
      
      missingRequiredColumns.forEach(field => {
        const displayName = headerMap[field] || field;
        errors.push({
          row: 1, // Header row
          column: field,
          message: `Required column '${displayName}' is missing from the CSV file`,
          severity: ErrorSeverity.ERROR,
          code: 'MISSING_COLUMN',
          suggestedFix: `Add a column named '${displayName}' to your CSV file`
        });
      });
      
      // If we're missing required columns, we can't proceed with row validation
      if (missingRequiredColumns.length > 0) {
        return {
          data: [],
          errors,
          success: false,
          summary: {
            totalRows: data.length,
            validRows: 0,
            errorRows: data.length,
            warningRows: 0
          }
        };
      }
    }
    
    // Process each row
    data.forEach((row, rowIndex) => {
      // Track if this row has errors
      let rowHasErrors = false;
      let rowHasWarnings = false;
      const validatedRow: Record<string, any> = {};
      
      // Check required fields
      requiredFields.forEach(field => {
        if (row[field] === undefined || row[field] === null || row[field] === '') {
          const displayName = headerMap[field] || field;
          errors.push({
            row: rowIndex + 2, // +2 because CSV is 1-indexed and we have a header row
            column: field,
            message: `${displayName} is required`,
            value: row[field],
            severity: ErrorSeverity.ERROR,
            code: 'REQUIRED_FIELD'
          });
          rowHasErrors = true;
          errorRowsSet.add(rowIndex + 2);
        }
      });
      
      // Apply field-level validators
      Object.entries(validators).forEach(([field, validator]) => {
        // Skip if the field doesn't exist in the row and is not required
        if (row[field] === undefined && !validator.required) {
          return;
        }
        
        // Check if the field is required but missing
        if (validator.required && (row[field] === undefined || row[field] === null || row[field] === '')) {
          const displayName = headerMap[field] || field;
          errors.push({
            row: rowIndex + 2,
            column: field,
            message: `${displayName} is required`,
            value: row[field],
            severity: ErrorSeverity.ERROR,
            code: 'REQUIRED_FIELD'
          });
          rowHasErrors = true;
          errorRowsSet.add(rowIndex + 2);
          return;
        }
        
        // Skip validation if the field is empty and not required
        if ((row[field] === undefined || row[field] === null || row[field] === '') && !validator.required) {
          validatedRow[field] = null;
          return;
        }
        
        // Use context-aware validation if available
        if (validator.validateWithContext) {
          const error = validator.validateWithContext(row[field], row, rowIndex + 2, field);
          if (error) {
            errors.push(error);
            if (error.severity === ErrorSeverity.ERROR) {
              rowHasErrors = true;
              errorRowsSet.add(rowIndex + 2);
            } else if (error.severity === ErrorSeverity.WARNING) {
              rowHasWarnings = true;
              warningRowsSet.add(rowIndex + 2);
            }
            return;
          }
        } else {
          // Use simple validation
          const errorMessage = validator.validate(row[field], rowIndex + 2, field);
          if (errorMessage) {
            const displayName = headerMap[field] || field;
            errors.push({
              row: rowIndex + 2,
              column: field,
              message: errorMessage,
              value: row[field],
              severity: ErrorSeverity.ERROR,
              code: 'VALIDATION_ERROR'
            });
            rowHasErrors = true;
            errorRowsSet.add(rowIndex + 2);
            return;
          }
        }
        
        // Transform the value if needed
        if (validator.transform) {
          validatedRow[field] = validator.transform(row[field]);
        } else {
          validatedRow[field] = row[field];
        }
      });
      
      // Apply row-level validators for more complex validation scenarios
      if (!rowHasErrors && customRowValidators.length > 0) {
        const rowErrors = customRowValidators
          .flatMap(validator => validator(row, rowIndex + 2));
        
        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
          
          // Check if we have any error-level issues
          const hasErrorSeverity = rowErrors.some(error => error.severity === ErrorSeverity.ERROR);
          if (hasErrorSeverity) {
            rowHasErrors = true;
            errorRowsSet.add(rowIndex + 2);
          }
          
          // Check if we have any warning-level issues
          const hasWarningSeverity = rowErrors.some(error => error.severity === ErrorSeverity.WARNING);
          if (hasWarningSeverity) {
            rowHasWarnings = true;
            warningRowsSet.add(rowIndex + 2);
          }
        }
      }
      
      // Add the row to validated data if it has no errors
      if (!rowHasErrors) {
        validatedData.push(validatedRow as T);
      }
    });
    
    // Prepare summary statistics
    const summary = {
      totalRows: data.length,
      validRows: validatedData.length,
      errorRows: errorRowsSet.size,
      warningRows: warningRowsSet.size
    };
    
    return {
      data: validatedData,
      errors,
      success: errors.filter(e => e.severity === ErrorSeverity.ERROR).length === 0,
      summary
    };
  }

  /**
   * Generate a template CSV file with headers
   * @param headers Array of column headers
   * @returns CSV template as a string
   */
  async generateTemplate(headers: { key: string; header: string }[]): Promise<string> {
    return this.generateCsv([], headers);
  }

  /**
   * Generate a sample CSV file with headers and example data
   * @param headers Column headers
   * @param sampleData Sample data rows
   * @returns CSV sample as a string
   */
  async generateSample<T>(
    headers: { key: string; header: string }[],
    sampleData: T[]
  ): Promise<string> {
    return this.generateCsv(sampleData, headers);
  }
}

export default new CsvService(); 