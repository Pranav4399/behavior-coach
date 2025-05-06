import React, { useState, useEffect } from 'react';
import { ContentFilterOptions, ContentStatus, ContentType } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContentFiltersProps {
  filters: ContentFilterOptions;
  onFilterChange: (filters: ContentFilterOptions) => void;
  searchInput?: string;
  onSearchChange?: (value: string) => void;
  simpleMode?: boolean;
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
  simpleMode = false,
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
    if (simpleMode) {
      handleFilterChange('search', value || undefined);
    }
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
  
  // Render the simple mode (horizontal layout)
  if (simpleMode) {
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
              <SelectValue placeholder="Type" />
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
              <SelectValue placeholder="Status" />
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
  }
  
  // Render the advanced mode (vertical layout)
  return (
    <div className={cn("bg-white dark:bg-gray-800 border rounded-md shadow-sm", className)}>
      <div className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="search"
                placeholder="Search content..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applySearchFilter();
                  }
                }}
              />
              <Button 
                variant="outline"
                onClick={applySearchFilter}
              >
                Apply
              </Button>
            </div>
          </div>
          
          {/* Type filter */}
          <div className="w-full md:w-40">
            <Label htmlFor="content-type">Content Type</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) => handleFilterChange('type', value === "all" ? undefined : value)}
            >
              <SelectTrigger id="content-type" className="mt-1">
                <SelectValue placeholder="All types" />
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
          </div>
          
          {/* Status filter */}
          <div className="w-full md:w-40">
            <Label htmlFor="content-status">Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange('status', value === "all" ? undefined : value)}
            >
              <SelectTrigger id="content-status" className="mt-1">
                <SelectValue placeholder="All statuses" />
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
          </div>
        </div>
        
        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.search && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {filters.search}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setSearchInput('');
                    handleFilterChange('search', undefined);
                  }}
                />
              </Badge>
            )}
            
            {filters.type && (
              <Badge variant="outline" className="flex items-center gap-1 capitalize">
                Type: {filters.type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('type', undefined)}
                />
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="outline" className="flex items-center gap-1 capitalize">
                Status: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('status', undefined)}
                />
              </Badge>
            )}
            
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 