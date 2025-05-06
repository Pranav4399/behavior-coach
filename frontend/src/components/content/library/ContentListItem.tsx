import React from 'react';
import { useRouter } from 'next/router';
import { Content, ContentStatus } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentListItemProps {
  content: Content;
  selected: boolean;
  onSelect: (content: Content) => void;
  onToggleSelection: (contentId: string) => void;
  onDelete: (content: Content, e: React.MouseEvent) => void;
}

export const ContentListItem: React.FC<ContentListItemProps> = ({
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
        "group flex items-center border-b last:border-b-0 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
        selected && "bg-blue-50 dark:bg-blue-900/20"
      )}
      onClick={() => onToggleSelection(content.id)}
      onDoubleClick={() => onSelect(content)}
    >
      {/* Content title and type */}
      <div className="flex-grow">
        <h3 className="font-medium">{content.title}</h3>
        <div className="text-sm text-gray-500 capitalize">
          {content.type}
        </div>
      </div>
      
      {/* Status badge */}
      <div className="mx-4">
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
      
      {/* Dates */}
      <div className="hidden md:block text-sm text-gray-500 w-32">
        {new Date(content.updatedAt).toLocaleDateString()}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 ml-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(content);
          }}
        >
          View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/content/edit/${content.id}`);
          }}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-600"
          onClick={(e) => onDelete(content, e)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 