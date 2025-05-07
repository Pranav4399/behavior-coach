import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import { 
  Content, 
  ContentType, 
  ContentWithDetails,
  TextContent,
  ImageContent,
  VideoContent,
  AudioContent,
  DocumentContent,
  ReflectionContent,
  QuizContent,
  TemplateContent
} from '@/types/content';
import { MediaAsset, MediaType } from '@/types/mediaAsset';
import { Card, CardContent } from '@/components/ui/card';

export interface WhatsAppPreviewProps {
  content: ContentWithDetails;
  mediaAsset?: MediaAsset | null;
  message?: string;
  caption?: string;
  transcript?: string;
  altText?: string;
  deviceType?: 'mobile' | 'desktop';
  darkMode?: boolean;
}

const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  content,
  mediaAsset = null,
  message,
  caption,
  transcript,
  altText,
  deviceType = 'mobile',
  darkMode = false,
}) => {
  const isDelivered = true; // Mock state - could be configurable
  const currentTime = new Date();
  
  // Helper to safely access type-specific data
  const getTypeSpecificData = <T extends object>(contentType: ContentType) => {
    // First try the direct content type property
    switch (contentType) {
      case ContentType.TEXT:
        if (content.textContent) return content.textContent as T;
        break;
      case ContentType.IMAGE:
        if (content.imageContent) return content.imageContent as T;
        break;
      case ContentType.VIDEO:
        if (content.videoContent) return content.videoContent as T;
        break;
      case ContentType.AUDIO:
        if (content.audioContent) return content.audioContent as T;
        break;
      case ContentType.DOCUMENT:
        if (content.documentContent) return content.documentContent as T;
        break;
      case ContentType.QUIZ:
        if (content.quizContent) return content.quizContent as T;
        break;
      case ContentType.REFLECTION:
        if (content.reflectionContent) return content.reflectionContent as T;
        break;
      case ContentType.TEMPLATE:
        if (content.templateContent) return content.templateContent as T;
        break;
    }
  };
  
  // Calculate display message based on content type
  const getDisplayMessage = () => {
    switch (content.type) {
      case ContentType.TEXT: {
        const textContent = getTypeSpecificData<TextContent>(ContentType.TEXT);
        return textContent?.text || message || 'Text message';
      }
      case ContentType.IMAGE: {
        const imageContent = getTypeSpecificData<ImageContent>(ContentType.IMAGE);
        return caption || imageContent?.caption || '';
      }
      case ContentType.VIDEO: {
        const videoContent = getTypeSpecificData<VideoContent>(ContentType.VIDEO);
        return caption || videoContent?.caption || '';
      }
      case ContentType.AUDIO: {
        const audioContent = getTypeSpecificData<AudioContent>(ContentType.AUDIO);
        return caption || audioContent?.caption || transcript || audioContent?.transcript || 'Audio message';
      }
      case ContentType.DOCUMENT: {
        const documentContent = getTypeSpecificData<DocumentContent>(ContentType.DOCUMENT);
        return caption || documentContent?.description || content.title || 'Document';
      }
      case ContentType.REFLECTION: {
        const reflectionContent = getTypeSpecificData<ReflectionContent>(ContentType.REFLECTION);
        return reflectionContent?.promptText || 'Reflection prompt';
      }
      case ContentType.QUIZ: {
        return content.title || 'Quiz';
      }
      case ContentType.TEMPLATE: {
        const templateContent = getTypeSpecificData<TemplateContent>(ContentType.TEMPLATE);
        return templateContent?.templateText || 'Template message';
      }
      default:
        return message || 'Message';
    }
  };

  // Function to render content preview based on type
  const renderContentPreview = () => {
    // Get media asset to use (either passed directly or from content)
    const mediaToUse = mediaAsset;
    
    switch (content.type) {
      case ContentType.TEXT:
        return null; // No media preview for text
        
      case ContentType.IMAGE: {
        const imageContent = getTypeSpecificData<ImageContent>(ContentType.IMAGE);
        return mediaToUse ? (
          <div className="rounded-md overflow-hidden mb-1 bg-gray-100 dark:bg-gray-800">
            <img 
              src={mediaToUse.url || '/placeholder-image.png'} 
              alt={altText || imageContent?.altText || 'Image content'} 
              className="w-full h-auto max-h-48 object-contain"
            />
          </div>
        ) : (
          <div className="rounded-md overflow-hidden mb-1 bg-gray-100 dark:bg-gray-800 h-32 flex items-center justify-center text-gray-400">
            No image available
          </div>
        );
      }
        
      case ContentType.VIDEO: {
        const videoContent = getTypeSpecificData<VideoContent>(ContentType.VIDEO);
        return mediaToUse ? (
          <div className="rounded-md overflow-hidden mb-1 bg-black relative">
            {mediaToUse.thumbnailUrl ? (
              <>
                <img 
                  src={mediaToUse.thumbnailUrl} 
                  alt={altText || 'Video thumbnail'} 
                  className="w-full h-auto max-h-48 object-contain opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-32 flex items-center justify-center text-white">
                Video preview
              </div>
            )}
            {videoContent?.duration && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1 rounded">
                {Math.floor(videoContent.duration / 60)}:{(videoContent.duration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md overflow-hidden mb-1 bg-gray-100 dark:bg-gray-800 h-32 flex items-center justify-center text-gray-400">
            No video available
          </div>
        );
      }
        
      case ContentType.AUDIO: {
        const audioContent = getTypeSpecificData<AudioContent>(ContentType.AUDIO);
        const duration = audioContent?.duration;
        
        return (
          <div className="rounded-md overflow-hidden mb-1 bg-gray-50 dark:bg-gray-800 p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <div className="w-0 h-0 border-t-5 border-b-5 border-l-8 border-transparent border-l-white ml-1"></div>
            </div>
            <div className="flex-1 relative h-4">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {duration ? 
                `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : 
                '0:30'}
            </div>
          </div>
        );
      }
        
      case ContentType.DOCUMENT:
        return (
          <div className="rounded-md overflow-hidden mb-1 bg-gray-50 dark:bg-gray-800 p-3 flex items-center gap-2">
            <div className="w-10 h-12 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 flex items-center justify-center">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {mediaToUse?.mimeType?.split('/')[1]?.toUpperCase() || 'DOC'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium truncate">
                {mediaToUse?.fileName || content.title || 'Document.pdf'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {mediaToUse?.fileSize ? 
                  `${(mediaToUse.fileSize / 1024).toFixed(0)} KB • ${mediaToUse.mimeType?.split('/')[1] || 'PDF'}` : 
                  '128 KB • PDF'}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "border shadow-md", "py-0",
      deviceType === 'mobile' ? 'max-w-[320px]' : 'max-w-[420px]',
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'
    )}>
      <CardContent className="p-0">
        {/* WhatsApp Header */}
        <div className={cn(
          "px-4 py-2 flex items-center",
          darkMode ? 'bg-gray-800' : 'bg-green-500 text-white'
        )}>
          <div className="flex-1">
            <h3 className="text-sm font-medium">Content Preview</h3>
            <p className="text-xs opacity-80">WhatsApp</p>
          </div>
        </div>
        
        {/* Chat Area */}
        <div 
          className={cn(
            "p-4 max-h-[300px] overflow-y-auto relative",
            darkMode ? 'bg-gray-800' : ''
          )}
          style={!darkMode ? {
            backgroundImage: 'url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '210px'
          } : undefined}
        >
          {/* Chat bubble with timestamp */}
          <div className="flex justify-end mb-4">
            <div className={cn(
              "rounded-lg py-2 px-3 max-w-[80%] relative",
              darkMode ? 'bg-gray-700' : 'bg-[#dcf8c6]'
            )}>
              {/* Media preview area */}
              {renderContentPreview()}
              
              {/* Message text */}
              <p className={cn(
                "text-sm",
                darkMode ? 'text-gray-200' : 'text-gray-800'
              )}>
                {getDisplayMessage()}
              </p>
              
              {/* Time and delivery status */}
              <div className="flex items-center justify-end mt-1 gap-1">
                <span className="text-xs text-gray-500">
                  {format(currentTime, 'h:mm a')}
                </span>
                {isDelivered ? (
                  <Check size={14} className="text-gray-500" />
                ) : (
                  <Clock size={14} className="text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </div>
          
        {/* Input area (mock) */}
        <div className={cn(
          "p-2 flex items-center gap-2",
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        )}>
          <div className={cn(
            "flex-1 rounded-full py-1 px-3 text-sm",
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white'
          )}>
            Type a message
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppPreview; 