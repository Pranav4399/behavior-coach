import React, { useState } from 'react';
import { MediaAsset } from '@/types/mediaAsset';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  FileCode,
  File,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export interface DocumentPreviewRendererProps {
  mediaAsset: MediaAsset;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * DocumentPreviewRenderer - Specialized component for rendering document previews
 * 
 * Features:
 * - Support for different document types (PDF, docx, xlsx, etc.)
 * - Download option
 * - Document metadata display
 */
const DocumentPreviewRenderer: React.FC<DocumentPreviewRendererProps> = ({
  mediaAsset,
  onLoad,
  onError,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validate URL
  if (!mediaAsset?.url) {
    if (onError) onError('Document URL is missing');
    return (
      <div className="text-red-500 p-4">
        Error: Document URL is missing
      </div>
    );
  }
  
  // Determine document type from file extension
  const getDocumentType = () => {
    const mimeType = mediaAsset.mimeType?.toLowerCase() || '';
    
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('wordprocessing') || mimeType.includes('msword') || mimeType.includes('document')) return 'doc';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('sheet')) return 'sheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint') || mimeType.includes('slide')) return 'presentation';
    if (mimeType.includes('text/plain')) return 'text';
    if (mimeType.includes('text/html') || mimeType.includes('xml')) return 'code';
    
    // Extract extension from filename as fallback
    const fileName = mediaAsset.fileName?.toLowerCase() || '';
    const extension = fileName.split('.').pop() || '';
    
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'doc';
      case 'xls':
      case 'xlsx': return 'sheet';
      case 'ppt':
      case 'pptx': return 'presentation';
      case 'txt': return 'text';
      case 'html':
      case 'htm':
      case 'xml':
      case 'json':
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx': return 'code';
      default: return 'generic';
    }
  };
  
  // Get document icon based on type
  const getDocumentIcon = () => {
    const type = getDocumentType();
    
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'sheet': return <FileText className="h-8 w-8 text-green-500" />;
      case 'presentation': return <FileText className="h-8 w-8 text-orange-500" />;
      case 'text': return <FileText className="h-8 w-8 text-gray-500" />;
      case 'code': return <FileCode className="h-8 w-8 text-purple-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  // Handle PDF iframe loading
  const handleIframeLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle PDF iframe error
  const handleIframeError = () => {
    setError('Failed to load document preview');
    if (onError) onError('Failed to load document preview');
  };
  
  // Render document preview based on type
  const renderDocumentPreview = () => {
    const documentType = getDocumentType();
    
    // For PDFs, try to render inline if supported by the browser
    if (documentType === 'pdf') {
      return (
        <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 relative">
          <iframe
            src={mediaAsset.url + '#toolbar=0&navpanes=0'}
            className={cn("w-full h-full border-0", isLoaded ? "" : "hidden")}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={mediaAsset.fileName || 'PDF document'}
          />
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-gray-500 mb-2">Preview unavailable</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(mediaAsset.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in new tab
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // For other document types, just show metadata
    return (
      <div className="w-full py-12 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center">
        {getDocumentIcon()}
        <p className="mt-4 text-sm font-medium">{mediaAsset.fileName}</p>
        <p className="text-xs text-gray-500 mt-1">
          {mediaAsset.fileSize ? formatFileSize(mediaAsset.fileSize) : ''}
        </p>
        <p className="text-xs text-gray-500">
          {getDocumentType().toUpperCase()} Document
        </p>
      </div>
    );
  };
  
  return (
    <div className={cn("rounded-md overflow-hidden border border-gray-200 dark:border-gray-700", className)}>
      {/* Document preview */}
      {renderDocumentPreview()}
      
      {/* Document actions */}
      <div className="p-3 bg-white dark:bg-gray-900 flex justify-end">
        <a href={mediaAsset.url} download={mediaAsset.fileName} target="_blank" rel="noopener noreferrer">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </a>
      </div>
    </div>
  );
};

export default DocumentPreviewRenderer; 