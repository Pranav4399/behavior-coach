'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { SegmentFilterOptions } from '@/types/segment';

interface SegmentFiltersProps {
  filters?: SegmentFilterOptions;
  onFiltersChange: (filters: SegmentFilterOptions) => void;
}

export default function SegmentFilters({
  filters = {},
  onFiltersChange,
}: SegmentFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [segmentType, setSegmentType] = useState(filters.type || 'all');

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      searchTerm,
      type: segmentType === 'all' ? undefined : (segmentType as 'static' | 'rule_based'),
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSegmentType('all');
    onFiltersChange({});
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Input
          placeholder="Search segments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={segmentType}
        onValueChange={(value) => {
          setSegmentType(value);
          onFiltersChange({
            ...filters,
            searchTerm,
            type: value === 'all' ? undefined : (value as 'static' | 'rule_based'),
          });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Segment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="static">Static</SelectItem>
          <SelectItem value="rule_based">Rule-based</SelectItem>
        </SelectContent>
      </Select>

      {(searchTerm || segmentType) && (
        <Button variant="ghost" onClick={handleReset} className="h-10 px-3">
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
} 