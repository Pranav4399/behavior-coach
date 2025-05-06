import React from 'react';
import { useRouter } from 'next/navigation';
import { Content, ContentStatus } from '@/types/content';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ContentGridItemProps {
  content: Content;
  selected: boolean;
  onSelect: (content: Content) => void;
  onToggleSelection: (contentId: string) => void;
  onDelete: (content: Content, e: React.MouseEvent) => void;
}

export const ContentGridItem: React.FC<ContentGridItemProps> = ({
  content,
  selected,
  onSelect,
  onToggleSelection,
  onDelete
}) => {
  const router = useRouter();

  return (
    <div 
      key={content.id}
      className={cn(
        "group relative border rounded-md shadow-sm bg-white dark:bg-gray-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
        selected && "ring-2 ring-primary"
      )}
      onClick={() => onToggleSelection(content.id)}
      onDoubleClick={() => onSelect(content)}
    >
      {/* Content type indicator and preview */}
      <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {/* This would be replaced with actual preview based on content type */}
        <div className="text-4xl text-gray-400 capitalize">{content.type}</div>
      </div>
      
      {/* Content details */}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{content.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">
            {new Date(content.updatedAt).toLocaleDateString()}
          </div>
          
          {/* Status badge */}
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full capitalize",
            content.status === ContentStatus.PUBLISHED && "bg-green-100 text-green-800",
            content.status === ContentStatus.DRAFT && "bg-gray-100 text-gray-800",
            content.status === ContentStatus.REVIEW && "bg-yellow-100 text-yellow-800",
            content.status === ContentStatus.APPROVED && "bg-blue-100 text-blue-800",
            content.status === ContentStatus.ARCHIVED && "bg-red-100 text-red-800"
          )}>
            {content.status}
          </div>
        </div>
      </div>
      
      {/* Action buttons (visible on hover) */}
      <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 shadow-sm hover:bg-white">
              <MoreHorizontal className="h-4 w-4 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onSelect(content);
            }}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              router.push(`/content/${content.id}/edit`);
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={(e) => onDelete(content, e)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}; 