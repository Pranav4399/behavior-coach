import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(
  date: string | Date, 
  formatString: string = 'MMM dd, yyyy'
): string {
  if (!date) return '-';
  return format(new Date(date), formatString);
}

/**
 * Calculate the human-readable duration between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted duration string (e.g., "5s", "2m 30s", "1h 15m")
 */
export function calculateDuration(startDate: Date, endDate: Date): string {
  const diffMs = endDate.getTime() - startDate.getTime();
  
  // If less than a minute
  if (diffMs < 60000) {
    return `${Math.round(diffMs / 1000)}s`;
  }
  
  // If less than an hour
  if (diffMs < 3600000) {
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.round((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
  
  // If more than an hour
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
