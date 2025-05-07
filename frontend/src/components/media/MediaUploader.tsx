import React, { useCallback, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { useMediaUploadWithProgress, validateMediaFile } from '@/hooks/api/use-media-assets';
import { MediaUploadProgress, MediaUploadRequest } from '@/types/mediaAsset';
import { formatFileSize, isImage, isVideo, isAudio, isDocument } from '@/utils/media';

interface MediaUploaderProps {
  organizationId: string;
  onUploadComplete?: (mediaAsset: any) => void;
  onUploadError?: (error: Error) => void;
  uploadedById?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  showPreview?: boolean;
  buttonText?: string;
  className?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  organizationId,
  onUploadComplete,
  onUploadError,
  uploadedById,
  maxSizeMB = 16,
  allowedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  showPreview = true,
  buttonText = 'Select a file',
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<MediaUploadProgress | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMedia } = useMediaUploadWithProgress();

  // Handle file selection
  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;
    
    // Reset states
    setValidationError(null);
    setUploadProgress(null);
    
    // Validate file
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      const errorMessage = Object.values(validation.errors)[0];
      setValidationError(errorMessage);
      setSelectedFile(null);
      return;
    }
    
    // Create preview
    if (showPreview) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    }
    
    setSelectedFile(file);
  }, [showPreview]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  // Handle drop events
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  }, [handleFileChange]);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Click to open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Start upload process
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    
    setValidationError(null);
    
    try {
      const uploadRequest: MediaUploadRequest = {
        file: selectedFile,
        organizationId,
        uploadedById: uploadedById,
      };
      
      // Start upload with progress tracking
      const result = await uploadMedia(uploadRequest, (progress) => {
        setUploadProgress(progress);
        
        // Clear preview URL when upload is complete
        if (progress.status === 'complete' && preview) {
          URL.revokeObjectURL(preview);
          setPreview(null);
        }
      });
      
      if (onUploadComplete) {
        onUploadComplete(result.mediaAsset);
      }
      
      // Reset after successful upload
      setSelectedFile(null);
    } catch (error) {
      if (onUploadError) {
        onUploadError(error as Error);
      }
      setValidationError((error as Error).message);
    }
  }, [selectedFile, organizationId, uploadedById, uploadMedia, onUploadComplete, onUploadError, preview]);

  // Render file preview
  const renderPreview = () => {
    if (!preview || !selectedFile) return null;
    
    if (isImage(selectedFile.name)) {
      return (
        <div className="relative mt-4 rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-48 max-w-full object-contain" 
          />
        </div>
      );
    } else if (isVideo(selectedFile.name)) {
      return (
        <div className="relative mt-4 rounded-md overflow-hidden">
          <video 
            src={preview} 
            controls 
            className="max-h-48 max-w-full" 
          />
        </div>
      );
    } else if (isAudio(selectedFile.name)) {
      return (
        <div className="mt-4">
          <audio src={preview} controls className="w-full" />
        </div>
      );
    } else if (isDocument(selectedFile.name)) {
      return (
        <div className="flex items-center mt-4 p-3 border rounded-md">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="ml-2 truncate">{selectedFile.name}</span>
        </div>
      );
    }
    
    return null;
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (!uploadProgress) return null;
    
    return (
      <div className="mt-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>
            {uploadProgress.status === 'uploading' ? 'Uploading...' : 
             uploadProgress.status === 'processing' ? 'Processing...' : 
             uploadProgress.status === 'complete' ? 'Upload complete' : 
             uploadProgress.status === 'error' ? 'Upload failed' : ''}
          </span>
          <span>{uploadProgress.percentage}%</span>
        </div>
        <Progress value={uploadProgress.percentage} className="h-2" />
        {uploadProgress.status === 'uploading' && (
          <div className="text-xs text-gray-500 mt-1">
            {formatFileSize(uploadProgress.loaded)} of {formatFileSize(uploadProgress.total)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={allowedTypes.join(',')}
      />
      
      {/* Drop zone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } transition-colors duration-150 cursor-pointer`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <div className="text-sm text-gray-600">
            {selectedFile ? (
              <span className="font-medium">{selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            {allowedTypes.includes('image/*') && 'Images, '}
            {allowedTypes.includes('video/*') && 'Videos, '}
            {allowedTypes.includes('audio/*') && 'Audio, '}
            {allowedTypes.includes('application/pdf') && 'PDFs'}
            {` up to ${maxSizeMB}MB`}
          </p>
        </div>
      </div>
      
      {/* File preview */}
      {showPreview && renderPreview()}
      
      {/* Progress bar */}
      {renderProgressBar()}
      
      {/* Error message */}
      {validationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      {/* Upload button */}
      {selectedFile && !uploadProgress?.status && (
        <Button 
          onClick={handleUpload} 
          className="mt-4 w-full"
        >
          Upload File
        </Button>
      )}
      
      {/* Loading state */}
      {uploadProgress?.status === 'uploading' || uploadProgress?.status === 'processing' ? (
        <Button disabled className="mt-4 w-full">
          <Spinner className="mr-2 h-4 w-4" />
          {uploadProgress.status === 'uploading' ? 'Uploading...' : 'Processing...'}
        </Button>
      ) : null}
    </div>
  );
};

export default MediaUploader; 