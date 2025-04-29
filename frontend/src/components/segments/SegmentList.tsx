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
import { PaginationWithProps } from '@/components/ui/pagination';
import { Segment, SegmentFilterOptions } from '@/types/segment';
import { formatDate } from '@/lib/utils';
import SegmentTypeBadge from './SegmentTypeBadge';
import { Eye } from 'lucide-react';
import SegmentFilters from './SegmentFilters';

interface SegmentListProps {
  segments: Segment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  filters?: SegmentFilterOptions;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onFiltersChange: (filters: SegmentFilterOptions) => void;
}

export default function SegmentList({
  segments,
  total,
  page,
  limit,
  totalPages,
  loading,
  filters,
  onPageChange,
  onLimitChange,
  onFiltersChange,
}: SegmentListProps) {
  const router = useRouter();

  const handleViewSegment = (segmentId: string) => {
    router.push(`/segments/${segmentId}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SegmentFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      </div>

      {/* Segments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Segments</CardTitle>
          <CardDescription>
            Manage worker segments for targeted campaigns and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading segments...
                    </TableCell>
                  </TableRow>
                ) : segments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No segments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  segments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-medium">
                        {segment.name}
                        {segment.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {segment.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <SegmentTypeBadge type={segment.type} />
                      </TableCell>
                      <TableCell>{segment.memberCount}</TableCell>
                      <TableCell>{formatDate(segment.createdAt)}</TableCell>
                      <TableCell>{formatDate(segment.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSegment(segment.id)}
                            title="View segment"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end">
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