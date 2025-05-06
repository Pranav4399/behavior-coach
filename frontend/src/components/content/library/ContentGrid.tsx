import React from 'react';
import { Content } from '@/types/content';
import { ContentGridItem } from './ContentGridItem';
import { ContentLoadingSkeleton } from './ContentLoadingSkeleton';
import { cn } from '@/lib/utils';

interface ContentGridProps {
  contents: Content[];
  isLoading: boolean;
  selectedIds: string[];
  onContentSelect: (content: Content) => void;
  onContentToggle: (contentId: string) => void;
  onContentDelete: (content: Content, e: React.MouseEvent) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * ContentGrid - A unified grid layout for displaying content items
 * with built-in loading state and empty state handling
 */
export const ContentGrid: React.FC<ContentGridProps> = ({
  contents,
  isLoading,
  selectedIds,
  onContentSelect,
  onContentToggle,
  onContentDelete,
  emptyMessage = "No content items found",
  className
}) => {
  // Check if a content item is selected
  const isSelected = (contentId: string) => selectedIds.includes(contentId);
  
  return (
    <div className={cn("w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {isLoading ? (
        // Use a single skeleton with count=4 which is more efficient
        <ContentLoadingSkeleton count={4} className="col-span-1" />
      ) : (
        contents.length ? 
          contents.map(content => (
            <ContentGridItem
              key={content.id}
              content={content}
              selected={isSelected(content.id)}
              onSelect={onContentSelect}
              onToggleSelection={onContentToggle}
              onDelete={onContentDelete}
            />
          )) : 
          <div className="col-span-full py-8 text-center text-gray-500">
            {emptyMessage}
          </div>
      )}
    </div>
  );
}; 