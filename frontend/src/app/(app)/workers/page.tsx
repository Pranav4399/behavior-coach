'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useWorkers, useBulkDeleteWorkers, useBulkUpdateWorkers } from '@/hooks/api/use-workers';
import { WorkerFilterOptions } from '@/types/worker';
import WorkerList from '@/components/workers/WorkerList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import CreateWorkerDialog from '@/components/workers/CreateWorkerDialog';

export default function WorkersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<WorkerFilterOptions>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch workers
  const { data, isLoading, error } = useWorkers(page, limit, filters);
  
  // Bulk mutation hooks
  const bulkDeleteWorkers = useBulkDeleteWorkers();
  const bulkUpdateWorkers = useBulkUpdateWorkers();

  // Handlers
  const handleCreateWorker = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleFiltersChange = (newFilters: WorkerFilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };
  
  const handleBulkDelete = async (workerIds: string[]) => {
    try {
      await bulkDeleteWorkers.mutateAsync({ workerIds });
      toast({
        title: 'Workers deleted',
        description: `Successfully deleted ${workerIds.length} workers.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete workers.',
        variant: 'destructive',
      });
    }
  };
  
  const handleBulkUpdate = async (workerIds: string[], updates: any) => {
    try {
      await bulkUpdateWorkers.mutateAsync({ workerIds, updates });
      toast({
        title: 'Workers updated',
        description: `Successfully updated ${workerIds.length} workers.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update workers.',
        variant: 'destructive',
      });
    }
  };
  
  // If error occurs while fetching
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Error loading workers</h2>
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
        <h1 className="text-2xl font-bold tracking-tight">Workers</h1>
        <Button onClick={handleCreateWorker}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger 
            value="all"
            onClick={() => handleFiltersChange({ ...filters, employmentStatus: undefined })}
          >
            All Workers
          </TabsTrigger>
          <TabsTrigger 
            value="active"
            onClick={() => handleFiltersChange({ ...filters, employmentStatus: 'active' })}
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            onClick={() => handleFiltersChange({ ...filters, employmentStatus: 'inactive' })}
          >
            Inactive
          </TabsTrigger>
          <TabsTrigger
            value="on_leave"
            onClick={() => handleFiltersChange({ ...filters, employmentStatus: 'on_leave' })}
          >
            On Leave
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <WorkerList
            workers={data?.workers || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <WorkerList
            workers={data?.workers || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-4">
          <WorkerList
            workers={data?.workers || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        </TabsContent>
        
        <TabsContent value="on_leave" className="mt-4">
          <WorkerList
            workers={data?.workers || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            totalPages={data?.totalPages || 0}
            loading={isLoading}
            filters={filters}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onFiltersChange={handleFiltersChange}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Create Worker Dialog */}
      <CreateWorkerDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          // Refetch workers list after successful creation
          setPage(1);
        }}
      />
    </div>
  );
} 