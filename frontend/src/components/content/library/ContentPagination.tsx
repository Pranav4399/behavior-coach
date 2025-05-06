import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContentPaginationProps {
  currentPage: number;
  totalPages: number;
  offset: number;
  limit: number;
  total: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  className?: string;
}

export const ContentPagination: React.FC<ContentPaginationProps> = ({
  currentPage,
  totalPages,
  offset,
  limit,
  total,
  onPrevPage,
  onNextPage,
  className
}) => {
  if (total === 0) return null;
  
  return (
    <div className={cn("mt-6 flex justify-between items-center", className)}>
      <div className="text-sm text-gray-500">
        Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} items
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}; 