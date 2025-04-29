'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import WorkerCsvUpload from '@/components/workers/WorkerCsvUpload';

export default function WorkerImportPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/workers')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workers
        </Button>
      </div>
      
      <WorkerCsvUpload />
    </div>
  );
} 