'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ContentType } from '@/types/content';
import { ContentEditor } from '@/components/content';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Generic content creation page that handles all content types
 */
export default function CreateContentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const organizationId = user?.organizationId || '';
  
  // Map the URL parameter to ContentType enum
  const getContentType = (): ContentType => {
    const typeParam = (params.type as string).toLowerCase();
    
    switch (typeParam) {
      case 'text':
        return ContentType.TEXT;
      case 'image':
        return ContentType.IMAGE;
      case 'video':
        return ContentType.VIDEO;
      case 'audio':
        return ContentType.AUDIO;
      case 'document':
        return ContentType.DOCUMENT;
      case 'quiz':
        return ContentType.QUIZ;
      case 'reflection':
        return ContentType.REFLECTION;
      case 'template':
        return ContentType.TEMPLATE;
      default:
        // Default to TEXT if type is not recognized
        return ContentType.TEXT;
    }
  };
  
  const contentType = getContentType();
  
  // Get content type friendly name for display
  const getContentTypeName = (): string => {
    const typeNames: Record<ContentType, string> = {
      [ContentType.TEXT]: 'Text',
      [ContentType.IMAGE]: 'Image',
      [ContentType.VIDEO]: 'Video',
      [ContentType.AUDIO]: 'Audio',
      [ContentType.DOCUMENT]: 'Document',
      [ContentType.QUIZ]: 'Quiz',
      [ContentType.REFLECTION]: 'Reflection',
      [ContentType.TEMPLATE]: 'Template'
    };
    
    return typeNames[contentType];
  };
  
  // Handle navigation
  const handleBack = () => {
    router.push('/content/create');
  };
  
  // Handle save
  const handleSave = () => {
    // After saving, redirect to content list
    router.push('/content');
  };
  
  return (
    <div className="create-content-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Create {getContentTypeName()} Content
          </h1>
          <p className="text-muted-foreground">
            Create {getContentTypeName().toLowerCase()}-based content for your audience
          </p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Types
        </Button>
      </div>
      
      <div className="mt-6">
        <ContentEditor
          contentType={contentType}
          organizationId={organizationId}
          userId={user?.id || ''}
          onSave={handleSave}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
} 