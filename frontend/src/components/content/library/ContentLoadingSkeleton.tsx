import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ContentLoadingSkeletonProps {
  count?: number;
  className?: string;
}

export const ContentLoadingSkeleton: React.FC<ContentLoadingSkeletonProps> = ({
  count = 8,
  className
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={cn("border rounded-md shadow-sm overflow-hidden", className)}
        >
          <Skeleton className="h-32 w-full" />
          <div className="p-3">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}; 