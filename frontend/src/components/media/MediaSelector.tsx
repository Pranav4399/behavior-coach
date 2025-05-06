import React, { useState, useEffect, useCallback } from 'react';
import { useMediaAssets } from '@/hooks/api/use-media-assets';
import { MediaAsset, MediaAssetFilterOptions, MediaType } from '@/types/mediaAsset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { getThumbnailUrl, formatFileSize, isImage, isVideo, isAudio, isDocument } from '@/utils/media';

interface MediaSelectorProps {
  organizationId: string;
  onSelect?: (mediaAsset: MediaAsset) => void;
  onCancel?: () => void;
  allowedTypes?: MediaType[];
  isMultiSelect?: boolean;
  initialSelectedAssets?: MediaAsset[];
  className?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  organizationId,
  onSelect,
  onCancel,
  allowedTypes,
  isMultiSelect = false,
  initialSelectedAssets = [],
  className = '',
}) => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentFilter, setCurrentFilter] = useState<MediaAssetFilterOptions>({
    organizationId,
    limit: 20,
    offset: 0,
  });
  
  // State for selected media
  const [selectedAssets, setSelectedAssets] = useState<MediaAsset[]>(initialSelectedAssets);
  
  // Fetch media assets
  const { 
    data: mediaData, 
    isLoading, 
    error, 
    refetch 
  } = useMediaAssets(currentFilter);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setCurrentFilter({
        ...currentFilter,
        type: undefined
      });
    } else {
      setCurrentFilter({
        ...currentFilter,
        type: value as MediaType
      });
    }
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentFilter(prev => ({
        ...prev,
        search: searchTerm || undefined,
        offset: 0 // Reset pagination when searching
      }));
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Handle selection
  const handleAssetClick = (asset: MediaAsset) => {
    if (isMultiSelect) {
      // Toggle selection for multi-select
      const isSelected = selectedAssets.some(item => item.id === asset.id);
      if (isSelected) {
        setSelectedAssets(selectedAssets.filter(item => item.id !== asset.id));
      } else {
        setSelectedAssets([...selectedAssets, asset]);
      }
    } else {
      // Single select mode - immediately call onSelect
      if (onSelect) {
        onSelect(asset);
      }
    }
  };
  
  // Handle pagination
  const loadMore = () => {
    if (mediaData && mediaData.mediaAssets.length > 0) {
      setCurrentFilter(prev => ({
        ...prev,
        offset: (prev.offset || 0) + (prev.limit || 20)
      }));
    }
  };
  
  // Handle confirm selection (for multi-select)
  const handleConfirmSelection = () => {
    if (onSelect && isMultiSelect && selectedAssets.length > 0) {
      // For multi-select, we pass the first selected asset
      // In a real implementation, you would want to modify onSelect to handle multiple assets
      onSelect(selectedAssets[0]);
    }
  };
  
  // Render media item
  const renderMediaItem = (asset: MediaAsset) => {
    const isSelected = selectedAssets.some(item => item.id === asset.id);
    const thumbnailUrl = getThumbnailUrl(asset);
    
    return (
      <Card 
        key={asset.id}
        className={`relative overflow-hidden cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary scale-95' : 'hover:scale-95'
        }`}
        onClick={() => handleAssetClick(asset)}
      >
        {/* Thumbnail or icon */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {isImage(asset.fileName) ? (
            <img 
              src={thumbnailUrl} 
              alt={asset.altText || asset.fileName} 
              className="w-full h-full object-cover"
            />
          ) : isVideo(asset.fileName) ? (
            <div className="flex items-center justify-center h-full">
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 5.5L12.5 10L6.5 14.5V5.5Z" />
                </svg>
              </div>
              <img 
                src={thumbnailUrl} 
                alt={asset.altText || asset.fileName} 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          ) : isAudio(asset.fileName) ? (
            <div className="flex items-center justify-center h-full bg-blue-50">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          ) : isDocument(asset.fileName) ? (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          )}
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* File type badge */}
          <Badge className="absolute bottom-2 left-2 text-xs">
            {asset.type}
          </Badge>
        </div>
        
        {/* File name and info */}
        <div className="p-2">
          <p className="text-sm font-medium truncate" title={asset.fileName}>
            {asset.fileName}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(asset.fileSize)}
          </p>
        </div>
      </Card>
    );
  };
  
  return (
    <div className={`${className}`}>
      {/* Header with search */}
      <div className="flex flex-col mb-4">
        <h2 className="text-lg font-semibold mb-2">Select Media</h2>
        <Input
          type="text"
          placeholder="Search media assets..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4"
        />
        
        {/* Type filter tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={MediaType.IMAGE}>Images</TabsTrigger>
            <TabsTrigger value={MediaType.VIDEO}>Videos</TabsTrigger>
            <TabsTrigger value={MediaType.AUDIO}>Audio</TabsTrigger>
            <TabsTrigger value={MediaType.DOCUMENT}>Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="w-10 h-10" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                Failed to load media assets. Please try again.
              </div>
            ) : mediaData?.mediaAssets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No media assets found. Upload some media first.
              </div>
            ) : (
              <>
                {/* Media grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaData?.mediaAssets.map(asset => renderMediaItem(asset))}
                </div>
                
                {/* Pagination */}
                {mediaData && mediaData.pagination.total > mediaData.mediaAssets.length && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={loadMore}>
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer with actions */}
      {isMultiSelect && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm">
            {selectedAssets.length} {selectedAssets.length === 1 ? 'item' : 'items'} selected
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleConfirmSelection}
              disabled={selectedAssets.length === 0}
            >
              Select
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSelector; 