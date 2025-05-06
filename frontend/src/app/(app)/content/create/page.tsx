'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentTypeSelector } from '@/components/content';
import { ContentType } from '@/types/content';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Content creation page - First step is to select content type
 * Then redirects to the appropriate editor for that content type
 */
export default function CreateContentPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  
  // Handle navigation
  const handleBack = () => {
    router.push('/content');
  };
  
  // Handle content type selection
  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (selectedType) {
      // Get URL-friendly string for the content type
      let typeParam: string;
      switch (selectedType) {
        case ContentType.TEXT:
          typeParam = 'text';
          break;
        case ContentType.IMAGE:
          typeParam = 'image';
          break;
        case ContentType.VIDEO:
          typeParam = 'video';
          break;
        case ContentType.AUDIO:
          typeParam = 'audio';
          break;
        case ContentType.DOCUMENT:
          typeParam = 'document';
          break;
        case ContentType.QUIZ:
          typeParam = 'quiz';
          break;
        case ContentType.REFLECTION:
          typeParam = 'reflection';
          break;
        case ContentType.TEMPLATE:
          typeParam = 'template';
          break;
        default:
          typeParam = 'text';
      }
      router.push(`/content/create/${typeParam}`);
    }
  };
  
  return (
    <div className="create-content-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Content</h1>
          <p className="text-muted-foreground">Choose a content type to create</p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="max-w-4xl">
          <ContentTypeSelector
            selectedType={selectedType}
            onTypeSelect={handleTypeSelect}
            className="mb-6"
          />
          
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 