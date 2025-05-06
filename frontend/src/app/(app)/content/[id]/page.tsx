'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContent } from '@/hooks/api/use-content';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ContentDetailView } from '@/components/content/library';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

/**
 * Content detail page - Displays a single content item with its metadata
 */
export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const contentId = params.id as string;
  const organizationId = user?.organizationId || '';
  
  // Fetch content details
  const { 
    data: contentData, 
    isLoading, 
    error 
  } = useContent(contentId, organizationId);
  
  const content = contentData?.content;
  
  // Handle navigation
  const handleBack = () => {
    router.push('/content');
  };
  
  const handleEdit = () => {
    router.push(`/content/${contentId}/edit`);
  };
  
  // Render loading state
  if (isLoading) {
    return <div className="flex justify-center py-12">Loading content...</div>;
  }
  
  // Render error state
  if (error || !content) {
    return (
      <div className="py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Not Found</h1>
            <p className="text-muted-foreground">The content you're looking for doesn't exist or you don't have permission to view it.</p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="content-detail-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Details</h1>
          <p className="text-muted-foreground">View and manage content</p>
        </div>
      </div>
      
      <div className="mt-6">
        <ContentDetailView 
          content={content}
          showTagsEditor={true}
          onEdit={handleEdit}
          onBack={handleBack}
        />
      </div>
    </div>
  );
} 