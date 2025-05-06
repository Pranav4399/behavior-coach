import React from 'react';
import { Content, ContentTag } from '@/types/content';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Tag as TagIcon, 
  BarChart2,
  Edit,
  Eye,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Types for extended metadata not directly in the Content type
export interface ContentExtendedMetadata {
  createdByName?: string;
  updatedByName?: string;
  viewCount?: number;
  programCount?: number;
  lastUsedAt?: string | Date;
  lastViewedAt?: string | Date;
  // Add additional metadata as needed
}

export interface ContentMetadataProps {
  content: Content;
  contentTags?: ContentTag[];
  metadata?: ContentExtendedMetadata;
  className?: string;
  showTagsEditor?: boolean;
  onAddTag?: () => void;
  onRemoveTag?: (tagId: string) => void;
}

/**
 * ContentMetadata - A reusable sidebar component for displaying content metadata
 * 
 * Features:
 * - Basic information section (type, created/updated dates, etc.)
 * - Tags section with optional editing capability
 * - Usage statistics section
 */
export const ContentMetadata: React.FC<ContentMetadataProps> = ({
  content,
  contentTags = [],
  metadata = {},
  className,
  showTagsEditor = false,
  onAddTag,
  onRemoveTag
}) => {
  // Get formatted timestamps
  const createdAt = content.createdAt ? new Date(content.createdAt) : null;
  const updatedAt = content.updatedAt ? new Date(content.updatedAt) : null;
  
  return (
    <Card className={cn("content-metadata", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Metadata</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic info */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            Basic Information
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Type</span>
              <Badge variant="outline" className="capitalize">
                {content.type.toLowerCase()}
              </Badge>
            </div>
            
            {createdAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Created
                </span>
                <span className="text-gray-600">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
            )}
            
            {updatedAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Updated
                </span>
                <span className="text-gray-600">
                  {formatDistanceToNow(updatedAt, { addSuffix: true })}
                </span>
              </div>
            )}
            
            {metadata.createdByName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <User className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Created by
                </span>
                <span className="text-gray-600">{metadata.createdByName}</span>
              </div>
            )}
            
            {metadata.updatedByName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Edit className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Updated by
                </span>
                <span className="text-gray-600">{metadata.updatedByName}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Tags section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-500 flex items-center">
              <TagIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Tags
            </h4>
            
            {showTagsEditor && onAddTag && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAddTag}
                className="h-7 px-2 text-xs"
              >
                + Add
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {contentTags.length > 0 ? (
              contentTags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    showTagsEditor && onRemoveTag && "pr-1"
                  )}
                >
                  {tag.name}
                  {showTagsEditor && onRemoveTag && (
                    <button
                      className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                      onClick={() => onRemoveTag(tag.id)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7M1 7L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No tags</span>
            )}
          </div>
        </div>
        
        {/* Usage stats section */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <BarChart2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            Usage Statistics
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Programs</span>
              <span className="text-gray-600">{metadata.programCount || 0}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                Views
              </span>
              <span className="text-gray-600">{metadata.viewCount || 0}</span>
            </div>
            
            {metadata.lastUsedAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last used</span>
                <span className="text-gray-600">
                  {formatDistanceToNow(new Date(metadata.lastUsedAt), { addSuffix: true })}
                </span>
              </div>
            )}
            
            {metadata.lastViewedAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  Last viewed
                </span>
                <span className="text-gray-600">
                  {formatDistanceToNow(new Date(metadata.lastViewedAt), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 