import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Content, 
  ContentType, 
  ContentStatus,
  ContentTag,
  ContentWithDetails,
  TextContent,
  ImageContent,
  VideoContent,
  AudioContent,
  DocumentContent
} from '@/types/content';
import { MediaAsset, MediaType } from '@/types/mediaAsset';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Tag as TagIcon, 
  BarChart2,
  FileText 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import MediaPreview from '@/components/media/MediaPreview';
import { ContentHeader } from './ContentHeader';
import { ContentMetadata, ContentExtendedMetadata } from './ContentMetadata';

interface ContentDetailViewProps {
  content: Content | ContentWithDetails;
  onBack?: () => void;
  onEdit?: (content: Content) => void;
  onDelete?: (content: Content) => void;
  onDuplicate?: (content: Content) => void;
  onDownload?: (content: Content) => void;
  onShare?: (content: Content) => void;
  onPublish?: (content: Content) => void;
  onArchive?: (content: Content) => void;
  onStatusChange?: (content: Content, status: ContentStatus) => void;
  onAddTag?: (contentId: string) => void;
  onRemoveTag?: (contentId: string, tagId: string) => void;
  className?: string;
  contentTags?: ContentTag[];
  metadata?: ContentExtendedMetadata;
  showTagsEditor?: boolean;
}

/**
 * ContentDetailView - Displays detailed information about a content item
 * 
 * Features:
 * - Type-specific content preview using MediaPreview component
 * - Metadata sidebar with creation info, tags, and usage stats
 * - Actions for editing and deleting content
 */
export const ContentDetailView: React.FC<ContentDetailViewProps> = ({
  content,
  onBack,
  onEdit,
  onDelete,
  onDuplicate,
  onDownload,
  onShare,
  onPublish,
  onArchive,
  onStatusChange,
  onAddTag,
  onRemoveTag,
  className,
  contentTags = [],
  metadata = {},
  showTagsEditor = false
}) => {
  const router = useRouter();
  
  // Get formatted timestamps
  const createdAt = content.createdAt ? new Date(content.createdAt) : null;
  const updatedAt = content.updatedAt ? new Date(content.updatedAt) : null;
  
  // Extract media asset and type-specific data if available
  const contentWithDetails = content as ContentWithDetails;
  const mediaAsset = contentWithDetails.mediaDetails;
  const typeSpecificData = contentWithDetails.typeSpecificData;
  
  // Handle edit button click
  const handleEdit = () => {
    if (onEdit) {
      onEdit(content);
    } else {
      router.push(`/content/${content.id}/edit`);
    }
  };
  
  // Handle delete button click
  const handleDelete = () => {
    if (onDelete) {
      onDelete(content);
    }
  };
  
  // Handle duplicate button click
  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(content);
    }
  };
  
  // Handle download button click
  const handleDownload = () => {
    if (onDownload) {
      onDownload(content);
    }
  };
  
  // Handle share button click
  const handleShare = () => {
    if (onShare) {
      onShare(content);
    }
  };
  
  // Handle publish button click
  const handlePublish = () => {
    if (onPublish) {
      onPublish(content);
    } else if (onStatusChange) {
      onStatusChange(content, ContentStatus.PUBLISHED);
    }
  };
  
  // Handle archive button click
  const handleArchive = () => {
    if (onArchive) {
      onArchive(content);
    } else if (onStatusChange) {
      onStatusChange(content, ContentStatus.ARCHIVED);
    }
  };
  
  // Handle status change
  const handleStatusChange = (status: ContentStatus) => {
    if (onStatusChange) {
      onStatusChange(content, status);
    }
  };
  
  // Handle add tag
  const handleAddTag = () => {
    if (onAddTag) {
      onAddTag(content.id);
    }
  };
  
  // Handle remove tag
  const handleRemoveTag = (tagId: string) => {
    if (onRemoveTag) {
      onRemoveTag(content.id, tagId);
    }
  };
  
  // Render content preview based on content type
  const renderContentPreview = () => {
    // Handle each content type specifically
    switch (content.type) {
      case ContentType.TEXT:
        // Try to access text content from the content object directly (it may be nested)
        // Cast to any first to avoid TypeScript errors since the structure might vary
        const contentObj = content as any;
        const textContent = contentObj.textContent;
        
        // First try to use the directly available textContent, then fallback to typeSpecificData
        return (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Content</h3>
            <div className="prose max-w-none dark:prose-invert">
              {textContent?.text ? (
                <div dangerouslySetInnerHTML={{ __html: textContent.text }} />
              ) : (
                <p className="text-gray-500">No text content available</p>
              )}
            </div>
          </div>
        );
        
      case ContentType.IMAGE:
        // Try to access image content properties directly from the content object
        const contentWithImage = content as any;
        const imageContent = contentWithImage.imageContent;
        const imageData = typeSpecificData as ImageContent;

        // Use either from the nested structure or typeSpecificData
        const mediaForImage = mediaAsset; 
        const caption = imageContent?.caption || imageData?.caption;
        const altText = imageContent?.altText || imageData?.altText;
        
        if (mediaForImage) {
          return (
            <div className="p-4 flex justify-center">
              <MediaPreview 
                mediaAsset={mediaForImage}
                caption={caption}
                alt={altText || content.title}
                showControls={true}
                className="max-w-full"
                showFullScreenButton={true}
              />
            </div>
          );
        }
        // Fallback if no media asset is available
        return (
          <div className="flex items-center justify-center h-full p-8 flex-col text-gray-500">
            <FileText className="h-12 w-12 mb-2 text-gray-400" />
            <p>Content preview not available</p>
          </div>
        );
        
      case ContentType.VIDEO:
      case ContentType.AUDIO:
      case ContentType.DOCUMENT:
        // For media-based content, use MediaPreview if we have a mediaAsset
        if (mediaAsset) {
          const caption = (() => {
            switch (content.type) {
              case ContentType.VIDEO:
                return (typeSpecificData as VideoContent)?.caption || 
                       (content as any)?.videoContent?.caption ||
                       undefined;
              case ContentType.AUDIO:
                return (typeSpecificData as AudioContent)?.caption || 
                       (content as any)?.audioContent?.caption ||
                       undefined;
              case ContentType.DOCUMENT:
                return (typeSpecificData as DocumentContent)?.description || 
                       (content as any)?.documentContent?.description ||
                       undefined;
              default:
                return undefined;
            }
          })();
          
          return (
            <div className="p-4 flex justify-center">
              <MediaPreview 
                mediaAsset={mediaAsset}
                caption={caption}
                alt={content.title}
                showControls={true}
                className="max-w-full"
                showFullScreenButton={true}
              />
            </div>
          );
        }
        // Fallback if no media asset is available
        return (
          <div className="flex items-center justify-center h-full p-8 flex-col text-gray-500">
            <FileText className="h-12 w-12 mb-2 text-gray-400" />
            <p>Content preview not available</p>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full p-8 text-gray-500">
            <p>No preview available for this content type</p>
          </div>
        );
    }
  };
  
  // Display additional content details based on type
  const renderAdditionalDetails = () => {
    if (!typeSpecificData) return null;
    
    switch (content.type) {
      case ContentType.VIDEO:
      case ContentType.AUDIO:
        const mediaContent = typeSpecificData as (VideoContent | AudioContent);
        if (mediaContent.transcript) {
          return (
            <>
              <Separator />
              <CardFooter className="pt-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Transcript</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm whitespace-pre-wrap">
                    {mediaContent.transcript}
                  </div>
                </div>
              </CardFooter>
            </>
          );
        }
        return null;
        
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("content-detail-view", className)}>
      {/* Use the new ContentHeader component */}
      <ContentHeader 
        content={content}
        showBackButton={true}
        onBack={onBack}
        onEdit={onEdit ? handleEdit : undefined}
        onDelete={onDelete ? handleDelete : undefined}
        onDuplicate={onDuplicate ? handleDuplicate : undefined}
        onDownload={onDownload ? handleDownload : undefined}
        onShare={onShare ? handleShare : undefined}
        onPublish={onPublish || onStatusChange ? handlePublish : undefined}
        onArchive={onArchive || onStatusChange ? handleArchive : undefined}
        onStatusChange={onStatusChange ? handleStatusChange : undefined}
      />
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Content preview */}
        <Card className="md:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <div className="min-h-[300px] relative">
              {renderContentPreview()}
            </div>
          </CardContent>
          
          {/* Additional details section based on content type */}
          {renderAdditionalDetails()}
          
          {/* Description section (if available) */}
          {content.description && (
            <>
              <Separator />
              <CardFooter className="pt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-700">{content.description}</p>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
        
        {/* Use the ContentMetadata component for the sidebar */}
        <ContentMetadata
          content={content}
          contentTags={contentTags}
          metadata={metadata}
          showTagsEditor={showTagsEditor}
          onAddTag={onAddTag ? handleAddTag : undefined}
          onRemoveTag={onRemoveTag ? handleRemoveTag : undefined}
        />
      </div>
    </div>
  );
}; 