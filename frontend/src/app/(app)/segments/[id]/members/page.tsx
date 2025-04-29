'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSegment } from '@/hooks/api/use-segments';
import { SegmentMembersView } from '@/components/segments';
import { Segment } from '@/types/segment';

export default function SegmentMembersPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const { id } = use(params);

  // Fetch segment data
  const { data: segmentResponse, isLoading, error } = useSegment(id);
  const segment = segmentResponse?.data?.segment;

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
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => router.push(`/segments/${id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Segment
        </Button>
      </div>
      
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          Loading segment details...
        </div>
      ) : segment ? (
        <SegmentMembersView segment={segment as Segment} />
      ) : (
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          Segment not found
        </div>
      )}
    </div>
  );
} 