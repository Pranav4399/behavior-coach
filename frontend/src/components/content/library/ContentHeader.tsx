import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PERMISSIONS } from '@/constants/permissions';
import { useHasPermission } from '@/lib/permission';
import { cn } from '@/lib/utils';
import { Content, ContentStatus } from '@/types/content';
import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Download,
  Edit2,
  EyeOff,
  MoreHorizontal,
  Share2,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ContentHeaderProps {
  content: Content;
  showBackButton?: boolean;
  backHref?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onPublish?: () => void;
  onArchive?: () => void;
  onStatusChange?: (status: ContentStatus) => void;
  className?: string;
}

/**
 * ContentHeader - A header component for content-related pages with title and action buttons
 * 
 * Features:
 * - Back button for navigation
 * - Content title display
 * - Status badge
 * - Actions dropdown menu
 */
export const ContentHeader: React.FC<ContentHeaderProps> = ({
  content,
  showBackButton = true,
  backHref,
  onBack,
  onEdit,
  onDelete,
  onDuplicate,
  onDownload,
  onShare,
  onPublish,
  onArchive,
  onStatusChange,
  className
}) => {
  const router = useRouter();
  const canEditContent = useHasPermission(PERMISSIONS.CONTENT.EDIT);
  
  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.push('/content');  // Always go to content library instead of router.back()
    }
  };
  
  // Get status badge color based on content status
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DRAFT:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case ContentStatus.PUBLISHED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case ContentStatus.ARCHIVED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case ContentStatus.REVIEW:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Determine if a status change action should be enabled
  const canChangeStatus = (toStatus: ContentStatus) => {
    // Prevent changing to the same status
    if (toStatus === content.status) return false;
    
    // Special rules for different statuses
    switch (content.status) {
      case ContentStatus.ARCHIVED:
        // Archived content can only be restored to draft
        return toStatus === ContentStatus.DRAFT;
      default:
        return true;
    }
  };
  
  // Check if edit action should be available
  const canEdit = () => {
    return content.status !== ContentStatus.ARCHIVED && canEditContent;
  };
  
  // Render the actions dropdown menu
  const renderActionsMenu = () => {
    // Check if any actions are available
    const hasAvailableActions = 
      (onDuplicate) || 
      (onDownload) || 
      (onShare) || 
      (onStatusChange && (
        canChangeStatus(ContentStatus.DRAFT) || 
        canChangeStatus(ContentStatus.REVIEW) || 
        (canChangeStatus(ContentStatus.PUBLISHED) && onPublish) || 
        (canChangeStatus(ContentStatus.ARCHIVED) && onArchive)
      )) || 
      (onDelete);
    
    // Don't render the menu if no actions are available
    if (!hasAvailableActions) {
      return null;
    }
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          {/* Primary actions */}
          {onDuplicate && (
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>
          )}
          
          {onDownload && (
            <DropdownMenuItem onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              <span>Download</span>
            </DropdownMenuItem>
          )}
          
          {onShare && (
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
          )}
          
          {/* Show separator only if there are status change options */}
          {onStatusChange && (
            canChangeStatus(ContentStatus.DRAFT) || 
            canChangeStatus(ContentStatus.REVIEW) || 
            (canChangeStatus(ContentStatus.PUBLISHED) && onPublish) || 
            (canChangeStatus(ContentStatus.ARCHIVED) && onArchive)
          ) && <DropdownMenuSeparator />}
          
          {/* Status change actions */}
          {onStatusChange && (
            <>
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              
              {canChangeStatus(ContentStatus.DRAFT) && (
                <DropdownMenuItem onClick={() => onStatusChange(ContentStatus.DRAFT)}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  <span>Set as Draft</span>
                </DropdownMenuItem>
              )}
              
              {canChangeStatus(ContentStatus.REVIEW) && (
                <DropdownMenuItem onClick={() => onStatusChange(ContentStatus.REVIEW)}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  <span>Send for Review</span>
                </DropdownMenuItem>
              )}
              
              {canChangeStatus(ContentStatus.PUBLISHED) && onPublish && (
                <DropdownMenuItem onClick={onPublish}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Publish</span>
                </DropdownMenuItem>
              )}
              
              {canChangeStatus(ContentStatus.ARCHIVED) && onArchive && (
                <DropdownMenuItem onClick={onArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Archive</span>
                </DropdownMenuItem>
              )}
              
              {/* Show separator only if there's a delete option */}
              {onDelete && <DropdownMenuSeparator />}
            </>
          )}
          
          {/* Danger zone */}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-red-600 hover:text-red-700 focus:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  return (
    <div className={cn("content-header flex justify-between items-center mb-6", className)}>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        
        <div>
          <h1 className="text-2xl font-bold mb-1 truncate max-w-2xl">{content.title}</h1>
          <div className="flex items-center gap-2">
            <Badge className={cn("capitalize", getStatusColor(content.status))}>
              {content.status.toLowerCase()}
            </Badge>
            <span className="text-sm text-gray-500 capitalize">{content.type.toLowerCase()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onEdit && canEdit() && (
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="hidden md:flex items-center"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        {renderActionsMenu()}
      </div>
    </div>
  );
}; 