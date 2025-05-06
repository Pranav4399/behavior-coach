'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContent } from '@/hooks/api/use-content';
import { useAuth } from '@/hooks/useAuth';
import { ContentEditor } from '@/components/content';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

/**
 * Content edit page - Allows editing of existing content
 */
export default function EditContentPage() {
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
    router.push(`/content/${contentId}`);
  };
  
  // Handle save
  const handleSave = () => {
    // After saving, go back to content detail view
    router.push(`/content/${contentId}`);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
        <span className="ml-2">Loading content...</span>
      </div>
    );
  }
  
  // Render error state
  if (error || !content) {
    return (
      <div className="py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Not Found</h1>
            <p className="text-muted-foreground">The content you're looking for doesn't exist or you don't have permission to edit it.</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/content')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="edit-content-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Content</h1>
          <p className="text-muted-foreground">Make changes to your content</p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Details
        </Button>
      </div>
      
      <div className="mt-6">
        <ContentEditor
          initialContent={content}
          contentType={content.type}
          organizationId={organizationId}
          userId={user?.id || ''}
          onSave={handleSave}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
} 