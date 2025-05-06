import React, { useState } from 'react';
import { MediaAsset, MediaType } from '@/types/mediaAsset';
import { cn } from '@/lib/utils';
import { FileWarning } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ImagePreviewRenderer from './renderers/ImagePreviewRenderer';
import VideoPreviewRenderer from './renderers/VideoPreviewRenderer';
import AudioPreviewRenderer from './renderers/AudioPreviewRenderer';
import DocumentPreviewRenderer from './renderers/DocumentPreviewRenderer';
export interface MediaPreviewProps {
  mediaAsset: MediaAsset;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number | string;
  height?: number | string;
  alt?: string;
  caption?: string;
  onError?: (error: string) => void;
  onLoad?: () => void;
  className?: string;
  fallbackComponent?: React.ReactNode;
  showFullScreenButton?: boolean;
}

/**
 * MediaPreview - A component that renders different types of media with appropriate controls
 * 
 * Handles images, videos, audio, and documents with specialized renderers for each type
 */
const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaAsset,
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = true,
  width = '100%',
  height = 'auto',
  alt = '',
  caption = '',
  onError,
  onLoad,
  className = '',
  fallbackComponent,
  showFullScreenButton = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle loading complete
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle media error
  const handleError = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
    if (onError) onError(errorMessage);
  };

  // Render media based on type
  const renderMedia = () => {
    if (!mediaAsset || error) {
      return renderError();
    }

    if (isLoading) {
      return renderLoading();
    }

    switch (mediaAsset.type) {
      case MediaType.IMAGE:
        return (
          <ImagePreviewRenderer
            mediaAsset={mediaAsset}
            alt={alt || mediaAsset.altText || 'Image'}
            onLoad={handleLoad}
            onError={handleError}
            showFullScreenButton={showFullScreenButton}
          />
        );

      case MediaType.VIDEO:
        return (
          <VideoPreviewRenderer
            mediaAsset={mediaAsset}
            showControls={showControls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      case MediaType.AUDIO:
        return (
          <AudioPreviewRenderer
            mediaAsset={mediaAsset}
            showControls={showControls}
            autoPlay={autoPlay}
            loop={loop}
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      case MediaType.DOCUMENT:
        return (
          <DocumentPreviewRenderer
            mediaAsset={mediaAsset}
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      default:
        return renderError('Unsupported media type');
    }
  };

  // Render loading state
  const renderLoading = () => (
    <div className="w-full h-full flex items-center justify-center">
      <Skeleton className="w-full h-32" />
    </div>
  );

  // Render error state
  const renderError = (errorMessage: string = error || 'Failed to load media') => {
    if (fallbackComponent) {
      return fallbackComponent;
    }

    return (
      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center p-4">
        <FileWarning className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{errorMessage}</p>
      </div>
    );
  };

  return (
    <div 
      className={cn("media-preview", className)}
      style={{ width, height: height !== 'auto' ? height : undefined }}
    >
      {renderMedia()}
      {caption && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </div>
      )}
    </div>
  );
};

export default MediaPreview; 