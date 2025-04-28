'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationWithProps } from '@/components/ui/pagination';
import { Worker, WorkerFilterOptions } from '@/types/worker';
import { formatDate } from '@/lib/utils';
import WorkerFilters from './WorkerFilters';
import WorkerBulkActions from './WorkerBulkActions';
import WorkerStatusBadge from './WorkerStatusBadge';
import EditWorkerDialog from './EditWorkerDialog';
import ViewWorkerDialog from './ViewWorkerDialog';

interface WorkerListProps {
  workers: Worker[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  filters?: WorkerFilterOptions;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onFiltersChange: (filters: WorkerFilterOptions) => void;
  onBulkDelete?: (workerIds: string[]) => void;
  onBulkUpdate?: (workerIds: string[], updates: any) => void;
}

export default function WorkerList({
  workers,
  total,
  page,
  limit,
  totalPages,
  loading,
  filters,
  onPageChange,
  onLimitChange,
  onFiltersChange,
  onBulkDelete,
  onBulkUpdate,
}: WorkerListProps) {
  const router = useRouter();
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [editWorkerDialogOpen, setEditWorkerDialogOpen] = useState(false);
  const [viewWorkerDialogOpen, setViewWorkerDialogOpen] = useState(false);
  const [selectedWorkerForEdit, setSelectedWorkerForEdit] = useState<Worker | null>(null);
  const [selectedWorkerForView, setSelectedWorkerForView] = useState<Worker | null>(null);
  
  // Handle row selection
  const handleSelectWorker = (workerId: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkers([...selectedWorkers, workerId]);
    } else {
      setSelectedWorkers(selectedWorkers.filter(id => id !== workerId));
    }
  };
  
  // Handle select all
  const handleSelectAllWorkers = (checked: boolean) => {
    if (checked) {
      setSelectedWorkers(workers.map(worker => worker.id));
    } else {
      setSelectedWorkers([]);
    }
  };
  
  // Open view worker dialog
  const handleViewWorker = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      setSelectedWorkerForView(worker);
      setViewWorkerDialogOpen(true);
    }
  };
  
  // Handle bulk actions
  const handleBulkDelete = () => {
    if (onBulkDelete && selectedWorkers.length > 0) {
      onBulkDelete(selectedWorkers);
      setSelectedWorkers([]);
    }
  };
  
  // Handle edit worker
  const handleEditWorker = (worker: Worker) => {
    setSelectedWorkerForEdit(worker);
    setEditWorkerDialogOpen(true);
  };
  
  // Handle edit success
  const handleEditSuccess = () => {
    setEditWorkerDialogOpen(false);
    setSelectedWorkerForEdit(null);
    // Optionally refresh the workers list here if needed
  };
  
  return (
    <div className="space-y-4">
      {/* Filters and Bulk Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <WorkerFilters 
          filters={filters} 
          onFiltersChange={onFiltersChange}
        />
        
        {selectedWorkers.length > 0 && (
          <WorkerBulkActions
            selectedCount={selectedWorkers.length}
            onDelete={handleBulkDelete}
            onUpdate={updates => {
              if (onBulkUpdate) {
                onBulkUpdate(selectedWorkers, updates);
                setSelectedWorkers([]);
              }
            }}
          />
        )}
      </div>
      
      {/* Edit Worker Dialog */}
      {selectedWorkerForEdit && (
        <EditWorkerDialog
          open={editWorkerDialogOpen}
          onClose={() => {
            setEditWorkerDialogOpen(false);
            setSelectedWorkerForEdit(null);
          }}
          onSuccess={handleEditSuccess}
          worker={selectedWorkerForEdit}
        />
      )}
      
      {/* View Worker Dialog */}
      {selectedWorkerForView && (
        <ViewWorkerDialog
          open={viewWorkerDialogOpen}
          onClose={() => {
            setViewWorkerDialogOpen(false);
            setSelectedWorkerForView(null);
          }}
          worker={selectedWorkerForView}
        />
      )}
      
      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workers</CardTitle>
          <CardDescription>
            Manage your workforce and view worker details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={
                        selectedWorkers.length > 0 && selectedWorkers.length < workers.length
                          ? "indeterminate"
                          : selectedWorkers.length === workers.length && workers.length > 0
                      }
                      onCheckedChange={handleSelectAllWorkers}
                      aria-label="Select all workers"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Loading workers...
                    </TableCell>
                  </TableRow>
                ) : workers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No workers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedWorkers.includes(worker.id)}
                          onCheckedChange={(checked) => 
                            handleSelectWorker(worker.id, !!checked)
                          }
                          aria-label={`Select ${worker.firstName} ${worker.lastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {worker.fullName || `${worker.firstName} ${worker.lastName}`}
                        </div>
                        {worker.externalId && (
                          <div className="text-xs text-muted-foreground">
                            ID: {worker.externalId}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <WorkerStatusBadge status={worker.isActive ? 
                          (worker.employment?.employmentStatus || 'active') : 
                          'inactive'} 
                        />
                      </TableCell>
                      <TableCell>{worker.employment?.department || '-'}</TableCell>
                      <TableCell>{worker.employment?.team || '-'}</TableCell>
                      <TableCell>
                        {worker.contact?.locationCity && worker.contact?.locationCountry
                          ? `${worker.contact.locationCity}, ${worker.contact.locationCountry}`
                          : worker.contact?.locationCity || worker.contact?.locationCountry || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {worker.tags && worker.tags.length > 0 ? (
                            worker.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            '-'
                          )}
                          {worker.tags && worker.tags.length > 2 && (
                            <Badge variant="outline" className="bg-muted">
                              +{worker.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {worker.engagement?.lastActiveAt
                          ? formatDate(worker.engagement.lastActiveAt)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewWorker(worker.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditWorker(worker)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span>
                {' - '}
                <span className="font-medium">
                  {Math.min(page * limit, total)}
                </span>{' '}
                of <span className="font-medium">{total}</span> workers
              </div>
              <PaginationWithProps
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 