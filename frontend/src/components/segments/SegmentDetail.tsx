'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, BarChart, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Segment } from '@/types/segment';
import { formatDate, calculateDuration } from '@/lib/utils';
import SegmentTypeBadge from './SegmentTypeBadge';
import { useSegmentSyncStatus, useSyncSegment } from '@/hooks/api/use-segments';
import { useToast } from '@/components/ui/toast';
import EditSegmentDialog from './EditSegmentDialog';
import { formatRuleForDisplay } from '@/lib/segments/rule-formatter';
import { useQueryClient } from '@tanstack/react-query';

// Define the sync status response interface
interface SegmentSyncStatusResponse {
  success: boolean;
  data: {
    segment: {
      id: string;
      name: string;
      type: 'static' | 'rule_based';
      lastSyncAt?: string;
    };
    syncJobs: Array<{
      id: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      processedCount: number;
      matchCount: number;
      startedAt?: string;
      completedAt?: string;
      createdAt: string;
    }>;
    membershipStats: {
      totalMembers: number;
      ruleMatchCount: number;
      manuallyAddedCount: number;
    };
    totalMembers: number;
    lastRuleVersion?: number;
  };
}

// Function to calculate duration between two dates is now imported from utils

interface SegmentDetailProps {
  segment: Segment;
  loading: boolean;
  onDeleteSegment?: (segmentId: string) => void;
}

export default function SegmentDetail({
  segment,
  loading,
  onDeleteSegment,
}: SegmentDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Check if segment is rule-based
  const isRuleBased = segment?.type === 'rule_based';
  
  // For rule-based segments
  const syncMutation = useSyncSegment(segment?.id || '');
  const { data: syncStatusResponse } = useSegmentSyncStatus(segment?.id || '');
  const syncStatus = syncStatusResponse as SegmentSyncStatusResponse | undefined;
  const latestSyncJob = syncStatus?.data?.syncJobs?.[0];
  const isSyncing = latestSyncJob?.status === 'in_progress' || latestSyncJob?.status === 'pending';

  const handleEditSegment = () => {
    setIsEditDialogOpen(true);
  };

  const handleViewAnalytics = () => {
    router.push(`/segments/${segment.id}/analytics`);
  };

  const handleViewMembers = () => {
    router.push(`/segments/${segment.id}/members`);
  };

  const handleSyncSegment = () => {
    
    syncMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          variant: "info",
          title: "Sync started",
          description: `Syncing segment ${segment.name} to match current rule criteria. You can continue working while this runs in the background.`,
        });
        
        // Force refetch sync status to show updated information immediately
        queryClient.invalidateQueries({ queryKey: ['segments', segment.id, 'sync'] });
      },
      onError: (error) => {        
        toast({
          title: "Sync failed",
          description: "Unable to start segment sync. Please try again or contact support if the problem persists.",
          variant: "destructive",
        });
      },
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Segment...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            Loading segment details...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!segment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segment Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The requested segment could not be found or you don't have permission to view it.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{segment.name}</h1>
          {segment.description && (
            <p className="text-muted-foreground mt-1">{segment.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleViewMembers}
          >
            <Users className="mr-2 h-4 w-4" />
            View Members
          </Button>
          <Button 
            variant="outline" 
            onClick={handleViewAnalytics}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          {isRuleBased && (
            <Button 
              variant="outline" 
              onClick={handleSyncSegment}
              disabled={isSyncing || syncMutation.isPending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${(isSyncing || syncMutation.isPending) ? 'animate-spin' : ''}`} />
              {syncMutation.isPending ? 'Starting sync...' : isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleEditSegment}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {onDeleteSegment && (
            <Button 
              variant="destructive" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this segment?')) {
                  onDeleteSegment(segment.id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Segment details */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Details</CardTitle>
          <CardDescription>
            Detailed information about this segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rules">Rule Definition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Type:</span>{' '}
                    <SegmentTypeBadge type={segment.type} />
                  </div>
                  <div>
                    <span className="font-medium">Members:</span>{' '}
                    {segment.memberCount}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {formatDate(segment.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {formatDate(segment.updatedAt)}
                  </div>
                  {segment.lastSyncAt && (
                    <div>
                      <span className="font-medium">Last Sync:</span>{' '}
                      {formatDate(segment.lastSyncAt)}
                    </div>
                  )}
                </div>
                
                <div>
                  {isRuleBased && syncStatus?.data && (
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Sync Status</h3>
                      {latestSyncJob && (
                        <>
                          <div>
                            Status: <span className="capitalize">{latestSyncJob.status}</span>
                          </div>
                          {latestSyncJob.startedAt && (
                            <div>
                              Started: {formatDate(latestSyncJob.startedAt, 'MMM dd, yyyy')} at {formatDate(latestSyncJob.startedAt, 'h:mm:ss a')}
                            </div>
                          )}
                          {latestSyncJob.completedAt && (
                            <div>
                              Completed: {formatDate(latestSyncJob.completedAt, 'MMM dd, yyyy')} at {formatDate(latestSyncJob.completedAt, 'h:mm:ss a')}
                            </div>
                          )}
                          {latestSyncJob.startedAt && latestSyncJob.completedAt && (
                            <div>
                              Duration: {calculateDuration(new Date(latestSyncJob.startedAt), new Date(latestSyncJob.completedAt))}
                            </div>
                          )}
                          <div>
                            Processed: {latestSyncJob.processedCount} workers
                          </div>
                          <div>
                            Matches: {latestSyncJob.matchCount} workers
                          </div>
                        </>
                      )}
                      <div className="mt-2">
                        <h4 className="font-medium text-sm">Membership</h4>
                        <div>
                          Total Members: {syncStatus.data.membershipStats?.totalMembers || 0}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="mt-4">
              {isRuleBased ? (
                segment.ruleDefinition ? (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Rule Definition</h3>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Human-readable format:</p>
                      <div className="bg-muted p-4 rounded-md overflow-auto max-h-60 whitespace-pre-wrap">
                        {formatRuleForDisplay(segment.ruleDefinition)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">JSON format:</p>
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-60 text-xs">
                        {JSON.stringify(segment.ruleDefinition, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>Rule-based Segment</AlertTitle>
                    <AlertDescription>
                      This is a rule-based segment but no rule definition was found. You may need to edit the segment to add rules.
                    </AlertDescription>
                  </Alert>
                )
              ) : (
                <Alert>
                  <AlertTitle>Static Segment</AlertTitle>
                  <AlertDescription>
                    This is a static segment. Members are manually added and removed.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Segment Dialog */}
      {segment && (
        <EditSegmentDialog 
          segment={segment}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
} 