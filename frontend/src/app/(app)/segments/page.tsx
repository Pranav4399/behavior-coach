'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSegments } from '@/hooks/api/use-segments';
import { SegmentFilterOptions } from '@/types/segment';
import { SegmentList, CreateSegmentDialog } from '@/components/segments';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { useAdminType } from '@/lib/permission';

export default function SegmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isPlatformAdmin } = useAdminType();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<SegmentFilterOptions>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Redirect platform admins to the dashboard
  React.useEffect(() => {
    if (isPlatformAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Platform administrators do not have access to segment management',
        variant: 'destructive',
      });
      router.push('/dashboard');
    }
  }, [isPlatformAdmin, router, toast]);
  
  // If the user is a platform admin, don't render anything while redirecting
  if (isPlatformAdmin) {
    return null;
  }
  
  // Fetch segments
  const { data, isLoading, error } = useSegments(page, limit, filters);

  // Handlers
  const handleCreateSegment = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleFiltersChange = (newFilters: SegmentFilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  // If error occurs while fetching
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading segments</h2>
          <p className="text-sm text-muted-foreground">
            {(error as Error).message || 'Please try again.'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Segments</h1>
        <div className="flex space-x-2">
          <Button onClick={handleCreateSegment}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Segment
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsContent value="all" className="mt-4">
          <SegmentList
            segments={data?.segments || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
          />
        </TabsContent>
        
        <TabsContent value="static" className="mt-4">
          <SegmentList
            segments={data?.segments || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
          />
        </TabsContent>
        
        <TabsContent value="rule" className="mt-4">
          <SegmentList
            segments={data?.segments || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
          />
        </TabsContent>
      </Tabs>
      
      {/* Create Segment Dialog */}
      <CreateSegmentDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          // No need to do anything, the useSegments query will be invalidated automatically
        }}
      />
    </div>
  );
} 