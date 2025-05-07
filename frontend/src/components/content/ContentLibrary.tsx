import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Content, 
  ContentFilterOptions 
} from '@/types/content';
import { useContents, useDeleteContent } from '@/hooks/api/use-content';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentFilters, ContentGrid, ContentPagination } from './library';

interface ContentLibraryProps {
  organizationId: string;
  className?: string;
  showCreateButton?: boolean;
  onContentSelect?: (content: Content) => void;
  selectedContentIds?: string[];
  allowMultipleSelection?: boolean;
  hideFilters?: boolean;
  initialFilters?: Partial<ContentFilterOptions>;
}

/**
 * ContentLibrary - Component for browsing and filtering content items
 * 
 * Features:
 * - Server-side filtering and pagination
 * - Grid view presentation
 * - Content type filtering
 * - Search functionality
 * - Multi-select capability
 */
const ContentLibrary: React.FC<ContentLibraryProps> = ({
  organizationId,
  className,
  showCreateButton = true,
  onContentSelect,
  selectedContentIds = [],
  allowMultipleSelection = false,
  hideFilters = false,
  initialFilters = {}
}) => {
  const router = useRouter();
  
  // State for filters and pagination
  const [filters, setFilters] = useState<ContentFilterOptions>({
    organizationId,
    limit: 20,
    offset: 0,
    ...initialFilters
  });
  
  // UI state
  const [selected, setSelected] = useState<string[]>(selectedContentIds);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Debounce search to prevent too many API calls
  const debouncedSearch = useDebounce(searchInput, 300);
  
  // Get content data using the API hook
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useContents(filters);
  
  // Delete content mutation
  const deleteContentMutation = useDeleteContent();
  
  // Extract needed data from the response
  const contents = data?.contents || [];
  const total = data?.pagination?.total || 0;
  
  // Update filters when search changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch
    }));
  }, [debouncedSearch]);
  
  // Handle content selection
  const handleContentSelect = (content: Content) => {
    if (onContentSelect) {
      onContentSelect(content);
      return;
    }
    
    // Navigate to content detail page when no selection handler is provided
    router.push(`/content/${content.id}`);
  };
  
  // Toggle selection for multi-select mode
  const toggleContentSelection = (contentId: string) => {
    if (!allowMultipleSelection) return;
    
    setSelected(prev => {
      if (prev.includes(contentId)) {
        return prev.filter(id => id !== contentId);
      } else {
        return [...prev, contentId];
      }
    });
  };
  
  // Handle content creation button click
  const handleCreateContent = () => {
    router.push('/content/create');
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof ContentFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset offset when filters change
      offset: key !== 'offset' ? 0 : prev.offset
    }));
  };
  
  // Function to fetch contents with provided filters
  const fetchContents = (newFilters: ContentFilterOptions) => {
    setFilters(newFilters);
    return refetch();
  };
  
  // Handle content deletion
  const handleDeleteContent = (content: Content, e: React.MouseEvent) => {
    e.stopPropagation();
    setContentToDelete(content);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm content deletion
  const confirmDelete = async () => {
    if (!contentToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteContentMutation.mutateAsync(contentToDelete.id);
      // Refresh content after deletion
      fetchContents(filters);
    } catch (error) {
      console.error('Error deleting content:', error);
    } finally {
      setContentToDelete(null);
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
    }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(total / (filters.limit || 20));
  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1;
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      handleFilterChange('offset', (currentPage) * (filters.limit || 20));
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      handleFilterChange('offset', (currentPage - 2) * (filters.limit || 20));
    }
  };
  
  // Adapter for the updated ContentFilters API
  const handleFilterChangeAdapter = (updatedFilters: ContentFilterOptions) => {
    setFilters(updatedFilters);
  };
  
  return (
    <div className={cn("content-library w-full", className)}>
      {/* Top actions bar */}
      <div className="flex flex-col gap-4 w-full mb-6">
        {/* Header with create button */}
        <div className="flex justify-end">
          {showCreateButton && (
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateContent}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          )}
        </div>
        
        {/* Filters */}
        {!hideFilters && (
          <ContentFilters
            filters={filters}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            onFilterChange={handleFilterChangeAdapter}
            className="w-full"
          />
        )}
      </div>
      
      {/* Content section */}
      <div className="relative w-full">
        {isLoading && <LoadingOverlay />}
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            Failed to load content: {error instanceof Error ? error.message : String(error)}
          </div>
        )}
        
        {!error && (
          <ContentGrid
            contents={contents}
            isLoading={isLoading}
            selectedIds={selected}
            onContentSelect={handleContentSelect}
            onContentToggle={toggleContentSelection}
            onContentDelete={handleDeleteContent}
          />
        )}
      </div>
      
      {/* Pagination */}
      {!isLoading && contents.length > 0 && (
        <ContentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          offset={filters.offset || 0}
          limit={filters.limit || 20}
          total={total}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          className="mt-6"
        />
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{contentToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentLibrary; 