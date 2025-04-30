'use client';

import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = 'Loading...' }: LoadingOverlayProps) {
  // If not loading, don't render anything to ensure it's completely removed from DOM
  if (!isLoading) return null;

  // Only render the overlay when loading
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
    >
      <div className="flex flex-col items-center space-y-4 animate-in zoom-in-50 duration-300">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
} 