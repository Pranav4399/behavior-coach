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
