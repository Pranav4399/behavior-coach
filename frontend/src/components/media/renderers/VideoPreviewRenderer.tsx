import React, { useRef, useEffect, useState } from 'react';
import { MediaAsset } from '@/types/mediaAsset';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface VideoPreviewRendererProps {
  mediaAsset: MediaAsset;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * VideoPreviewRenderer - Specialized component for rendering video previews
 * 
 * Features:
 * - Custom playback controls
 * - Volume control
 * - Fullscreen mode
 * - Duration display
 */
const VideoPreviewRenderer: React.FC<VideoPreviewRendererProps> = ({
  mediaAsset,
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = true,
  onLoad,
  onError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  
  // Initialize video with props when component mounts or props change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
    
    video.muted = isMuted;
    video.volume = volume;
  }, [isPlaying, isMuted, volume]);
  
  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    if (onLoad) onLoad();
  };
  
  // Handle video load error
  const handleVideoError = () => {
    if (onError) onError('Failed to load video');
  };
  
  // Update current time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };
  
  // Handle video end
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (loop) {
      setIsPlaying(true);
      videoRef.current?.play();
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  // Set volume
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Seek to position
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const newTime = value[0];
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };
  
  // Show/hide controls based on mouse movement
  const handleShowControls = () => {
    setIsControlsVisible(true);
  };
  
  const handleHideControls = () => {
    if (!isUserInteracting) {
      setIsControlsVisible(false);
    }
  };
  
  // User started interacting with controls
  const startInteracting = () => {
    setIsUserInteracting(true);
  };
  
  // User stopped interacting with controls
  const stopInteracting = () => {
    setIsUserInteracting(false);
  };
  
  // Render video with controls
  const renderVideo = (isFullScreenView = false) => (
    <div 
      className={cn(
        "relative rounded-md overflow-hidden", 
        isFullScreenView ? "w-full h-full" : "",
        className
      )}
      onMouseEnter={handleShowControls}
      onMouseLeave={handleHideControls}
      onMouseMove={handleShowControls}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={mediaAsset.url}
        className="w-full rounded-md object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        controls={showControls && !isControlsVisible}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Custom controls */}
      {showControls && isControlsVisible && (
        <div 
          ref={controlsRef}
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white transition-opacity",
            isControlsVisible ? "opacity-100" : "opacity-0"
          )}
          onMouseEnter={startInteracting}
          onMouseLeave={stopInteracting}
          onTouchStart={startInteracting}
          onTouchEnd={stopInteracting}
        >
          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-white/20" 
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              {/* Volume */}
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white hover:bg-white/20" 
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-16 mx-2 hidden sm:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Time */}
              <div className="text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            {/* Fullscreen button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-white hover:bg-white/20" 
              onClick={toggleFullScreen}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Play/Pause overlay for center of video */}
      {isControlsVisible && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onClick={togglePlay}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-16 w-16 rounded-full bg-black/30 text-white hover:bg-black/50"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
      )}
    </div>
  );
  
  return (
    <>
      {/* Regular video view */}
      {renderVideo(false)}
      
      {/* Fullscreen dialog */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-screen-lg w-[90vw] max-h-[90vh] p-0">
          {renderVideo(true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoPreviewRenderer; 