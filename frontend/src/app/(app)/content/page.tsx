'use client';

import React from 'react';
import { ContentLibrary } from '@/components/content';
import { useAuth } from '@/hooks/useAuth';

/**
 * Content page - Displays the content library with filtering and management capabilities
 */
export default function ContentPage() {
  const { user } = useAuth();
  const organizationId = user?.organizationId || '';
  
  return (
    <div className="content-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Library</h1>
          <p className="text-muted-foreground">Manage and organize your content assets</p>
        </div>
      </div>
      
      <ContentLibrary 
        organizationId={organizationId} 
        showCreateButton={true}
      />
    </div>
  );
} 