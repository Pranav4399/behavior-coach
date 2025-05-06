import { ApiError } from '@/types/common';

// Log levels enum
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

// Current log level (defaults to ERROR in production, DEBUG in development)
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG;

// Log level configuration
let currentLogLevel = DEFAULT_LOG_LEVEL;

// Set log level
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

// Get current log level
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

// Log level priority map (higher number = higher priority)
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 4,
  [LogLevel.WARN]: 3,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 1,
};

// Check if a log level should be shown based on current configuration
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel];
}

// Generic logging function
function log(level: LogLevel, message: string, data?: any): void {
  if (!shouldLog(level)) return;

  // Format timestamp
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  // Log based on level
  switch (level) {
    case LogLevel.ERROR:
      if (data instanceof Error) {
        console.error(`${prefix} ${message}`, data);
      } else {
        console.error(`${prefix} ${message}`, data || '');
      }
      break;
    case LogLevel.WARN:
      console.warn(`${prefix} ${message}`, data || '');
      break;
    case LogLevel.INFO:
      console.info(`${prefix} ${message}`, data || '');
      break;
    case LogLevel.DEBUG:
      console.debug(`${prefix} ${message}`, data || '');
      break;
    default:
      console.log(`${prefix} ${message}`, data || '');
  }
}

// Public logging functions
export const logger = {
  error(message: string, error?: Error | unknown): void {
    log(LogLevel.ERROR, message, error);
    
    // Optional: Send critical errors to an error monitoring service
    // if (process.env.NODE_ENV === 'production') {
    //   sendToErrorMonitoring(message, error);
    // }
  },
  
  warn(message: string, data?: any): void {
    log(LogLevel.WARN, message, data);
  },
  
  info(message: string, data?: any): void {
    log(LogLevel.INFO, message, data);
  },
  
  debug(message: string, data?: any): void {
    log(LogLevel.DEBUG, message, data);
  },
  
  // API specific logging
  apiRequest(method: string, url: string, data?: any): void {
    if (shouldLog(LogLevel.DEBUG)) {
      log(LogLevel.DEBUG, `API Request: ${method} ${url}`, data);
    }
  },
  
  apiResponse(method: string, url: string, status: number, data?: any): void {
    if (shouldLog(LogLevel.DEBUG)) {
      log(LogLevel.DEBUG, `API Response: ${method} ${url} (${status})`, data);
    }
  },
  
  apiError(method: string, url: string, error: ApiError | Error): void {
    const isApiError = error instanceof ApiError;
    const status = isApiError ? (error as ApiError).status : 0;
    const errorData = isApiError ? (error as ApiError).data : undefined;
    
    log(LogLevel.ERROR, `API Error: ${method} ${url} (${status}) - ${error.message}`, errorData);
  }
};

// Helper function to format errors for display to users
export function formatErrorForUser(error: unknown): string {
  if (error instanceof ApiError) {
    // For API errors, use the message directly as it should be user-friendly
    return error.message;
  } else if (error instanceof Error) {
    // For general JS errors, provide a more generic message
    if (process.env.NODE_ENV === 'development') {
      return `Error: ${error.message}`;
    } else {
      return 'An unexpected error occurred. Please try again later.';
    }
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred. Please try again later.';
  }
}

export default logger; 