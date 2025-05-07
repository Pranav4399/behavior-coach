import React, { useState, useEffect } from 'react';
import { ContentFilterOptions, ContentStatus, ContentType } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { capitalize } from '@/utils/common';

interface ContentFiltersProps {
  filters: ContentFilterOptions;
  onFilterChange: (filters: ContentFilterOptions) => void;
  searchInput?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

/**
 * ContentFilters - Component for filtering content
 * 
 * Provides search, type, and status filtering capabilities
 */
export const ContentFilters: React.FC<ContentFiltersProps> = ({
  filters,
  onFilterChange,
  searchInput: externalSearchInput,
  onSearchChange: externalSearchChange,
  className
}) => {
  // Local state for managing internal filter values
  const [searchInput, setSearchInput] = useState(externalSearchInput || filters.search || '');
  
  // Update internal search state when external prop changes
  useEffect(() => {
    if (externalSearchInput !== undefined) {
      setSearchInput(externalSearchInput);
    }
  }, [externalSearchInput]);
  
  // Handle search input changes
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    
    // If an external handler is provided, call it
    if (externalSearchChange) {
      externalSearchChange(value);
    }
    
    // In simple mode, immediately apply filter
    handleFilterChange('search', value || undefined);
  };
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => 
    value !== undefined && 
    value !== null && 
    value !== '' && 
    !(Array.isArray(value) && value.length === 0)
  ).length;
  
  // Apply current search input to filters
  const applySearchFilter = () => {
    handleFilterChange('search', searchInput || undefined);
  };
  
  // Handle individual filter changes
  const handleFilterChange = (key: keyof ContentFilterOptions, value: any) => {
    const updatedFilters = {
      ...filters,
      [key]: value || undefined,
      // Reset pagination when filters change
      offset: key !== 'offset' ? 0 : filters.offset
    };
    
    onFilterChange(updatedFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchInput('');
    
    // Keep just organizationId filter if it exists
    const baseFilters: ContentFilterOptions = {};
    if (filters.organizationId) {
      baseFilters.organizationId = filters.organizationId;
    }
    
    onFilterChange(baseFilters);
    
    // If an external handler is provided, call it
    if (externalSearchChange) {
      externalSearchChange('');
    }
  };
  
  return (
    <div className={cn("flex flex-wrap items-center gap-2 w-full", className)}>
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search content..."
          className="pl-8 w-full h-9"
          value={searchInput}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              applySearchFilter();
            }
          }}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {/* Type filter */}
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => handleFilterChange('type', value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Type">
              {filters.type ? capitalize(filters.type) : "All types"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.values(ContentType).map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Status filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => handleFilterChange('status', value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Status">
              {filters.status ? capitalize(filters.status) : "All statuses"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(ContentStatus).map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Clear button (only shown when filters are active) */}
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}; 