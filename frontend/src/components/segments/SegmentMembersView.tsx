'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginationWithProps } from '@/components/ui/pagination';
import { 
  useSegmentWorkers, 
  useRemoveWorkerFromSegment 
} from '@/hooks/api/use-segments';
import { Segment } from '@/types/segment';
import { Worker } from '@/types/worker';
import { useToast } from '@/components/ui/toast';
import { Loader2, Search, Trash2, UserPlus } from 'lucide-react';
import AddWorkersDialog from './AddWorkersDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SegmentMembersViewProps {
  segment: Segment;
}

interface SegmentWorkersResponse {
  success: boolean;
  data: {
    workers: Worker[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export default function SegmentMembersView({ segment }: SegmentMembersViewProps) {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingWorkers, setIsAddingWorkers] = useState(false);
  
  // Fetch segment members
  const { 
    data: workersResponse, 
    isLoading: isLoadingWorkers, 
    error 
  } = useSegmentWorkers(segment.id, page, limit, searchTerm);
  
  const typedWorkersResponse = workersResponse as SegmentWorkersResponse | undefined;
  const workers = typedWorkersResponse?.data?.workers || [];
  const totalWorkers = typedWorkersResponse?.data?.total || 0;
  const totalPages = typedWorkersResponse?.data?.totalPages || 1;
  
  // Remove worker mutation
  const removeWorker = useRemoveWorkerFromSegment(segment.id);
  
  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when search changes
  };
  
  // Handle remove worker
  const handleRemoveWorker = (worker: Worker) => {
    if (window.confirm(`Are you sure you want to remove ${worker.fullName || `${worker.firstName} ${worker.lastName}`} from this segment?`)) {
      removeWorker.mutate(worker.id, {
        onSuccess: () => {
          toast({
            title: 'Worker removed',
            description: `Successfully removed worker from the segment.`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: 'Failed to remove worker. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {segment.type === 'rule_based' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <Button disabled className="cursor-not-allowed">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Workers
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Members cannot be added manually to rule-based segments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button onClick={() => setIsAddingWorkers(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Workers
          </Button>
        )}
      </div>
      
      {segment.type === 'rule_based' && (
        <div className="text-muted-foreground text-sm">
          This is a rule-based segment. Workers are automatically added based on matching rules and cannot be added manually.
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Segment Members</CardTitle>
          <CardDescription>
            Workers that belong to the "{segment.name}" segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingWorkers ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading workers...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-red-500">
                      Error loading workers: {error instanceof Error ? error.message : 'Unknown error'}
                    </TableCell>
                  </TableRow>
                ) : workers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No workers found in this segment.
                    </TableCell>
                  </TableRow>
                ) : (
                  workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        {worker.fullName || `${worker.firstName} ${worker.lastName}`}
                      </TableCell>
                      <TableCell>{worker.externalId || 'N/A'}</TableCell>
                      <TableCell>{worker.employment?.department || 'N/A'}</TableCell>
                      <TableCell>{worker.employment?.jobTitle || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {segment.type === 'rule_based' ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-block">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={true}
                                    className="cursor-not-allowed"
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Members cannot be removed manually from rule-based segments</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveWorker(worker)}
                            title="Remove worker"
                            disabled={removeWorker.isPending && removeWorker.variables === worker.id}
                          >
                            {removeWorker.isPending && removeWorker.variables === worker.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end">
              <PaginationWithProps
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Workers Dialog */}
      <AddWorkersDialog
        segment={segment}
        open={isAddingWorkers}
        onClose={() => setIsAddingWorkers(false)}
      />
    </div>
  );
} 