'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddWorkersToSegment } from '@/hooks/api/use-segments';
import { useWorkers } from '@/hooks/api/use-workers';
import { useToast } from '@/components/ui/toast';
import { Segment } from '@/types/segment';
import { Worker, WorkerFilterOptions } from '@/types/worker';
import { Loader2, Search, Plus, User, UserCheck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationWithProps } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface AddWorkersDialogProps {
  segment: Segment;
  open: boolean;
  onClose: () => void;
}

export default function AddWorkersDialog({
  segment,
  open,
  onClose,
}: AddWorkersDialogProps) {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState<WorkerFilterOptions>({
    searchTerm: '',
  });
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  
  // Fetch workers not in the segment
  const { data: workersData, isLoading } = useWorkers(page, limit, filters);
  
  // Add workers mutation
  const addWorkersToSegment = useAddWorkersToSegment(segment.id);
  
  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value,
    });
    setPage(1); // Reset to first page when search changes
  };
  
  // Handle worker selection
  const handleToggleWorker = (workerId: string) => {
    if (selectedWorkerIds.includes(workerId)) {
      setSelectedWorkerIds(selectedWorkerIds.filter(id => id !== workerId));
    } else {
      setSelectedWorkerIds([...selectedWorkerIds, workerId]);
    }
  };
  
  // Handle add workers
  const handleAddWorkers = async () => {
    if (segment.type === 'rule_based') {
      toast({
        title: 'Not allowed',
        description: 'Cannot manually add workers to rule-based segments.',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedWorkerIds.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one worker to add.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await addWorkersToSegment.mutateAsync({
        workerIds: selectedWorkerIds,
      });
      
      toast({
        title: 'Workers added',
        description: `Successfully added ${selectedWorkerIds.length} workers to the segment.`,
      });
      
      // Reset selected workers
      setSelectedWorkerIds([]);
      
      // Close dialog
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add workers to the segment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Workers to Segment</DialogTitle>
          <DialogDescription>
            Select workers to add to the "{segment.name}" segment
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workers by name or ID..."
              className="pl-8"
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Selected workers count */}
          {selectedWorkerIds.length > 0 && (
            <div className="flex items-center text-sm">
              <Badge variant="outline" className="mr-2">
                {selectedWorkerIds.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWorkerIds([])}
                className="h-7 text-xs"
              >
                Clear selection
              </Button>
            </div>
          )}
          
          {/* Workers list */}
          <div className="rounded-md border max-h-[350px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading workers...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : workersData?.workers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No workers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  workersData?.workers?.map((worker: Worker) => (
                    <TableRow 
                      key={worker.id}
                      className={selectedWorkerIds.includes(worker.id) ? 'bg-muted' : ''}
                      onClick={() => handleToggleWorker(worker.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {selectedWorkerIds.includes(worker.id) ? (
                            <UserCheck className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {worker.fullName || `${worker.firstName} ${worker.lastName}`}
                      </TableCell>
                      <TableCell>{worker.externalId || 'N/A'}</TableCell>
                      <TableCell>{worker.employment?.department || 'N/A'}</TableCell>
                      <TableCell>{worker.employment?.jobTitle || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {(workersData?.totalPages && workersData.totalPages > 1) ? (
            <div className="flex justify-end">
              <PaginationWithProps
                currentPage={page}
                totalPages={workersData.totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : <></>}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={addWorkersToSegment.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddWorkers}
            disabled={selectedWorkerIds.length === 0 || addWorkersToSegment.isPending}
          >
            {addWorkersToSegment.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add to Segment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 