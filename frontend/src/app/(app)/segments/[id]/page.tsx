'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSegment, useDeleteSegment } from '@/hooks/api/use-segments';
import { SegmentDetail } from '@/components/segments';
import { useToast } from '@/components/ui/toast';
import { Segment } from '@/types/segment';

export default function SegmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);

  // Fetch segment data
  const { data: segmentResponse, isLoading, error } = useSegment(id);
  const segment = segmentResponse?.data?.segment;

  // Delete mutation hook
  const deleteSegment = useDeleteSegment();

  // Handle segment deletion
  const handleDeleteSegment = async (segmentId: string) => {
    try {
      await deleteSegment.mutateAsync(segmentId);
      toast({
        title: 'Success',
        description: 'Segment deleted successfully',
      });
      // Navigate back to segments list
      router.push('/segments');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete segment',
        variant: 'destructive',
      });
    }
  };

  // Handle error states
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => router.push('/segments')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Segments
          </Button>
        </div>
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          Error loading segment: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => router.push('/segments')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Segments
        </Button>
      </div>
      
      <SegmentDetail
        segment={segment as Segment}
        loading={isLoading}
        onDeleteSegment={handleDeleteSegment}
      />
    </div>
  );
} 