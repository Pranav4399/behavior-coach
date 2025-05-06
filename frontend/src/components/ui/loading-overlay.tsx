'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  message?: string;
  className?: string;
  variant?: 'full' | 'contained';
}

/**
 * LoadingOverlay - Displays a loading spinner with optional message
 * Can be used as a full-screen overlay or contained within a parent element
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  className,
  variant = 'contained'
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50",
        variant === 'full' && "fixed",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
      )}
    </div>
  );
}; 