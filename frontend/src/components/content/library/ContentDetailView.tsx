import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Content, 
  ContentType, 
  ContentStatus,
  ContentTag,
  ContentWithDetails
} from '@/types/content';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { 
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
  
  // Cast content to any to access different properties based on content type
  const contentAny = content as any;
  
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
        // Try to access text content from the content object directly
        const textContent = contentAny.textContent;
        
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
        // Get image content and media asset
        const imageContent = contentAny.imageContent;
        
        if (imageContent?.mediaAsset) {
          return (
            <div className="p-4 flex justify-center">
              <MediaPreview 
                mediaAsset={imageContent.mediaAsset}
                caption={imageContent.caption}
                alt={imageContent.altText || content.title}
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
            <p>Image content preview not available</p>
          </div>
        );
        
      case ContentType.VIDEO:
        const videoContent = contentAny.videoContent;
        
        if (videoContent?.mediaAsset) {
          return (
            <div className="p-4 flex justify-center">
              <MediaPreview 
                mediaAsset={videoContent.mediaAsset}
                caption={videoContent.caption}
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
            <p>Video content preview not available</p>
          </div>
        );
        
      case ContentType.AUDIO:
        const audioContent = contentAny.audioContent;
        
        if (audioContent?.mediaAsset) {
          return (
            <div className="p-4 flex justify-center">
              <MediaPreview 
                mediaAsset={audioContent.mediaAsset}
                caption={audioContent.caption}
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
            <p>Audio content preview not available</p>
          </div>
        );
        
      case ContentType.DOCUMENT:
        const documentContent = contentAny.documentContent;
        
        if (documentContent?.mediaAsset) {
          return (
            <div className="p-4 flex justify-center">
              <MediaPreview 
                mediaAsset={documentContent.mediaAsset}
                caption={documentContent.description}
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
            <p>Document content preview not available</p>
          </div>
        );
        
      case ContentType.QUIZ:
        const quizContent = contentAny.quizContent;
        
        if (quizContent?.questions && quizContent.questions.length > 0) {
          return (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Quiz Questions</h3>
              <div className="space-y-6">
                {quizContent.questions.map((question: any, index: number) => (
                  <div key={question.id || index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h4 className="font-medium mb-2">
                      Question {index + 1}: {question.text}
                    </h4>
                    {question.options && (
                      <div className="ml-4 space-y-2">
                        {question.options.map((option: any, optIndex: number) => (
                          <div 
                            key={option.id || optIndex} 
                            className={`p-2 rounded flex items-start ${option.isCorrect ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700' : ''}`}
                          >
                            <div className="mr-2 mt-0.5">
                              {option.isCorrect ? (
                                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                            <span>{option.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {question.explanation && (
                      <div className="mt-2 ml-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {quizContent.scoringType && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">Scoring type:</span> {quizContent.scoringType}
                </div>
              )}
            </div>
          );
        }
        
        // Fallback if no quiz content available
        return (
          <div className="flex items-center justify-center h-full p-8 flex-col text-gray-500">
            <FileText className="h-12 w-12 mb-2 text-gray-400" />
            <p>Quiz content preview not available</p>
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
    switch (content.type) {
      case ContentType.VIDEO:
        const videoContent = contentAny.videoContent;
        if (videoContent?.transcript) {
          return (
            <>
              <Separator />
              <CardFooter className="pt-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Transcript</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm whitespace-pre-wrap">
                    {videoContent.transcript}
                  </div>
                </div>
              </CardFooter>
            </>
          );
        }
        return null;
        
      case ContentType.AUDIO:
        const audioContent = contentAny.audioContent;
        if (audioContent?.transcript) {
          return (
            <>
              <Separator />
              <CardFooter className="pt-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Transcript</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm whitespace-pre-wrap">
                    {audioContent.transcript}
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