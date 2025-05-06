import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MediaSelector } from './index';
import { MediaAsset } from '@/types/mediaAsset';
import { getThumbnailUrl, formatFileSize } from '@/utils/media';

// This is an example component showing how to use the MediaSelector
const MediaSelectorExample: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Example organization ID - replace with your actual organization ID
  const organizationId = 'example-org-id';
  
  const handleSelect = (mediaAsset: MediaAsset) => {
    setSelectedAsset(mediaAsset);
    setIsOpen(false);
  };
  
  return (
    <div className="max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Media</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAsset ? (
            <div className="mb-4 p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <img 
                  src={getThumbnailUrl(selectedAsset)} 
                  alt={selectedAsset.fileName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{selectedAsset.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {selectedAsset.type} • {formatFileSize(selectedAsset.fileSize)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Alert className="mb-4">
              <AlertDescription>
                No media selected. Click the button below to select media.
              </AlertDescription>
            </Alert>
          )}
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                {selectedAsset ? 'Change Media' : 'Select Media'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <MediaSelector 
                organizationId={organizationId}
                onSelect={handleSelect}
                onCancel={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaSelectorExample; 