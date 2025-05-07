import React, { useState } from 'react';
import { MediaAsset } from '@/types/mediaAsset';
import { cn } from '@/lib/utils';
import { Maximize2, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export interface ImagePreviewRendererProps {
  mediaAsset: MediaAsset;
  alt?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  showFullScreenButton?: boolean;
  className?: string;
}

/**
 * ImagePreviewRenderer - Specialized component for rendering image previews
 * 
 * Features:
 * - Zoom in/out capabilities
 * - Full-screen view
 * - Image rotation
 * - Error handling
 */
const ImagePreviewRenderer: React.FC<ImagePreviewRendererProps> = ({
  mediaAsset,
  alt = '',
  onLoad,
  onError,
  showFullScreenButton = true,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // If there's no URL, show an error
  if (!mediaAsset?.url) {
    if (onError) onError('Image URL is missing');
    return (
      <div className="text-red-500 p-4">
        Error: Image URL is missing
      </div>
    );
  }
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    if (onError) onError('Failed to load image');
  };
  
  // Zoom in the image
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  // Zoom out the image
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  // Rotate the image
  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };
  
  // Reset zoom and rotation
  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  
  // Calculate transform style based on zoom and rotation
  const getTransformStyle = () => {
    return {
      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
      transition: 'transform 0.2s ease-in-out',
    };
  };
  
  // Render the image with controls
  const renderImage = (isFullScreenView = false) => (
    <div className={cn(
      "relative group", 
      isFullScreenView ? "w-full h-full flex items-center justify-center" : "",
      className
    )}>
      {/* Image - hidden while loading but still loads in background */}
      <img
        src={mediaAsset.url}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          "max-w-full rounded-md object-contain",
          isFullScreenView ? "max-h-[80vh]" : "max-h-[500px]",
          isLoading ? "hidden" : ""
        )}
        style={getTransformStyle()}
      />
      
      {/* Show loading skeleton while image is loading */}
      {isLoading && (
        <div className="w-full h-32 flex items-center justify-center">
          <Skeleton className="w-full h-32" />
        </div>
      )}
      
      {/* Controls (only shown on hover) */}
      <div className={cn(
        "absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        isFullScreenView ? "opacity-100" : ""
      )}>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white text-gray-700 shadow"
          onClick={zoomIn}
          disabled={zoomLevel >= 3}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white text-gray-700 shadow"
          onClick={zoomOut}
          disabled={zoomLevel <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white text-gray-700 shadow"
          onClick={rotateImage}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        {showFullScreenButton && !isFullScreenView && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/80 hover:bg-white text-gray-700 shadow"
            onClick={toggleFullScreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
  
  return (
    <>
      {/* Regular image view */}
      {renderImage(false)}
      
      {/* Fullscreen dialog */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-screen-lg w-[90vw] max-h-[90vh] p-2">
          {renderImage(true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePreviewRenderer; 