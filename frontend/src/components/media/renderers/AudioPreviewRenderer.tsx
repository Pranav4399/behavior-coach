import React, { useRef, useEffect, useState } from 'react';
import { MediaAsset } from '@/types/mediaAsset';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface AudioPreviewRendererProps {
  mediaAsset: MediaAsset;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * AudioPreviewRenderer - Specialized component for rendering audio previews
 * 
 * Features:
 * - Custom playback controls
 * - Volume control
 * - Skip forward/backward
 * - Waveform-like visualization
 */
const AudioPreviewRenderer: React.FC<AudioPreviewRendererProps> = ({
  mediaAsset,
  showControls = true,
  autoPlay = false,
  loop = false,
  onLoad,
  onError,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize audio with props when component mounts or props change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
    
    audio.muted = isMuted;
    audio.volume = volume;
  }, [isPlaying, isMuted, volume]);
  
  // Handle audio metadata loaded
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle audio load error
  const handleAudioError = () => {
    if (onError) onError('Failed to load audio');
  };
  
  // Update current time
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Handle audio end
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (loop) {
      setIsPlaying(true);
      audioRef.current?.play();
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
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Skip backward 10 seconds
  const skipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Skip forward 10 seconds
  const skipForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(audioRef.current.currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Generate a simple pseudo-waveform visualization
  const generateWaveform = () => {
    // This is a visual-only representation that doesn't reflect actual audio data
    // For real-time waveform, you'd need to use Web Audio API's AnalyserNode
    const segments = 40;
    const randomHeights = Array.from({ length: segments }, () => 
      Math.random() * 0.6 + 0.2 // Heights between 20% and 80%
    );
    
    return (
      <div className="flex items-end justify-between h-16 gap-[2px] px-2">
        {randomHeights.map((height, i) => {
          const isCurrent = i / segments < (currentTime / duration);
          return (
            <div 
              key={i} 
              className={cn(
                "w-full rounded-sm",
                isCurrent ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              )} 
              style={{ height: `${height * 100}%` }}
            />
          );
        })}
      </div>
    );
  };
  
  return (
    <div className={cn("rounded-md overflow-hidden border border-gray-200 dark:border-gray-700", className)}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={mediaAsset.url}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        autoPlay={autoPlay}
        loop={loop}
      >
        Your browser does not support the audio element.
      </audio>
      
      {/* Audio visualization (waveform) */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3">
        {isLoaded ? generateWaveform() : (
          <div className="h-16 flex items-center justify-center">
            <p className="text-gray-400">Loading audio...</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      {showControls && (
        <div className="p-3 bg-white dark:bg-gray-900">
          {/* Progress bar */}
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          
          {/* Time display */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Skip back 10s */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={skipBackward}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              {/* Play/Pause */}
              <Button 
                variant="default" 
                size="icon" 
                className="h-10 w-10 rounded-full" 
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              
              {/* Skip forward 10s */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={skipForward}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Volume */}
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20 ml-2">
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
          </div>
          
          {/* File metadata */}
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 truncate">
            {mediaAsset.fileName}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPreviewRenderer; 