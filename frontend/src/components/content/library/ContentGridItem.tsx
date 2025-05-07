import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PERMISSIONS } from '@/constants/permissions';
import { useHasPermission } from '@/lib/permission';
import { cn } from '@/lib/utils';
import { Content, ContentStatus, ContentType } from '@/types/content';
import {
  AudioLines,
  BookOpen,
  ClipboardList,
  File,
  FileQuestion,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  Video
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

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
  const contentAny = content as any;

  const canViewContent = useHasPermission(PERMISSIONS.CONTENT.EDIT);
  const canEditContent = useHasPermission(PERMISSIONS.CONTENT.EDIT);
  const canDeleteContent = useHasPermission(PERMISSIONS.CONTENT.EDIT);

  // Get the appropriate media data based on content type - more direct approach
  const getMediaData = () => {
    if (content.type === ContentType.IMAGE && contentAny.imageContent?.mediaAsset?.thumbnailUrl) {
      return {
        thumbnailUrl: contentAny.imageContent.mediaAsset.thumbnailUrl,
        altText: contentAny.imageContent.altText || content.title
      };
    } else if (content.type === ContentType.VIDEO && contentAny.videoContent?.mediaAsset?.thumbnailUrl) {
      return {
        thumbnailUrl: contentAny.videoContent.mediaAsset.thumbnailUrl,
        altText: content.title
      };
    } else if (content.type === ContentType.AUDIO && contentAny.audioContent?.mediaAsset?.thumbnailUrl) {
      return {
        thumbnailUrl: contentAny.audioContent.mediaAsset.thumbnailUrl,
        altText: content.title
      };
    } else if (content.type === ContentType.DOCUMENT && contentAny.documentContent?.mediaAsset?.thumbnailUrl) {
      return {
        thumbnailUrl: contentAny.documentContent.mediaAsset.thumbnailUrl,
        altText: content.title
      };
    }
    return null;
  };

  const mediaData = getMediaData();

  // Mapping of content types to their visual representation
  const contentVisuals: Partial<Record<ContentType, any>> = {
    [ContentType.TEXT]: {
      icon: <FileText className="h-12 w-12 text-blue-500" />,
      background: 'linear-gradient(135deg, #e6f2ff 0%, #ffffff 100%)',
    },
    [ContentType.IMAGE]: {
      icon: <ImageIcon className="h-12 w-12 text-purple-500" />,
      background: 'rgb(243 244 246)'
    },
    [ContentType.VIDEO]: {
      icon: <Video className="h-12 w-12 text-red-500" />,
      background: 'rgb(243 244 246)'
    },
    [ContentType.AUDIO]: {
      icon: <AudioLines className="h-12 w-12 text-green-500" />,
      background: 'rgb(243 244 246)'
    },
    [ContentType.DOCUMENT]: {
      icon: <File className="h-12 w-12 text-orange-500" />,
      background: 'linear-gradient(135deg, #fff6e6 0%, #ffffff 100%)'
    },
    [ContentType.QUIZ]: {
      icon: <ClipboardList className="h-12 w-12 text-indigo-500" />,
      background: 'linear-gradient(135deg, #eee6ff 0%, #ffffff 100%)',
      preview: contentAny.quizContent?.questions && (
        <div className="text-xs font-medium text-indigo-700 mt-1">
          {contentAny.quizContent.questions.length} 
          {contentAny.quizContent.questions.length === 1 ? ' Question' : ' Questions'}
        </div>
      )
    },
    [ContentType.REFLECTION]: {
      icon: <BookOpen className="h-12 w-12 text-teal-500" />,
      background: 'rgb(243 244 246)'
    }
  };

  // Get the visual content - use default if type not in mapping
  const visual = contentVisuals[content.type] || {
    icon: <FileQuestion className="h-12 w-12 text-gray-500" />,
    background: 'rgb(243 244 246)'
  };
  
  return (
    <div 
      key={content.id}
      className={cn(
        "group relative border rounded-md shadow-sm bg-white dark:bg-gray-800 overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
        selected && "ring-2 ring-primary",
        !canViewContent && "pointer-events-none"
      )}
      onClick={() => onToggleSelection(content.id)}
      onDoubleClick={() => { if(canViewContent) onSelect(content); }}
    >
      {/* Content type indicator and preview */}
      <div 
        className="h-32 flex items-center justify-center overflow-hidden" 
        style={{ background: visual.background, backgroundSize: 'cover' }}
      >
        {mediaData?.thumbnailUrl ? (
          <img 
            src={mediaData.thumbnailUrl} 
            alt={mediaData.altText} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 w-full">
            {visual.icon}
            <div className="text-xs font-medium mt-2 capitalize">{content.type}</div>
            {visual.preview}
          </div>
        )}
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
            <DropdownMenuItem disabled={!canViewContent} onClick={(e) => {
              e.stopPropagation();
              onSelect(content);
            }}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!canEditContent} onClick={(e) => {
              e.stopPropagation();
              router.push(`/content/${content.id}/edit`);
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={!canDeleteContent}
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