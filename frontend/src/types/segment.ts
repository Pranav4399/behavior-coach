// Type definitions for segment management

// Segment Condition Type
export interface SegmentCondition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in_list' | 'not_in_list';
  value: string | number | string[];
}

// Segment Rule Type
export interface SegmentRule {
  type: 'any' | 'all' | 'none'; // any = OR, all = AND, none = NOT
  conditions: (SegmentRule | SegmentCondition)[];
}

// Segment Model
export interface Segment {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  type: 'static' | 'rule_based';
  ruleDefinition?: SegmentRule;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  lastSyncAt?: string;
}

// Segment Create Data
export interface SegmentCreateData {
  name: string;
  description?: string;
  organizationId?: string;
  type: 'static' | 'rule_based';
  ruleDefinition?: SegmentRule;
}

// Segment Update Data
export interface SegmentUpdateData {
  name?: string;
  description?: string;
  type?: 'static' | 'rule_based';
  ruleDefinition?: SegmentRule;
}

// Segment Filter Options
export interface SegmentFilterOptions {
  searchTerm?: string;
  type?: 'static' | 'rule_based';
}

// Segment List Response
export interface SegmentListResponse {
  segments: Segment[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Segment Response
export interface SegmentResponse {
  success: boolean;
  data: {
    segment: Segment;
  };
}

// Segment Testing Response
export interface SegmentTestResponse {
  matchCount: number;
  totalWorkers: number;
  matchPercentage: number;
  matchingWorkers: any[]; // We'll use the Worker type once we have it
}

// Segment Worker Management
export interface SegmentAddWorkersData {
  workerIds: string[];
}

// Segment Sync Status
export interface SegmentSyncStatus {
  id: string;
  segmentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  processedCount: number;
  matchCount: number;
  error?: string;
}

// Segment Analytics Data
export interface SegmentAnalyticsData {
  basicStats: {
    totalMembers: number;
    ruleMatchCount: number;
    manuallyAddedCount: number;
    lastSyncDate: string | null;
  };
  syncActivity: {
    totalSyncs: number;
    lastSyncDetails: {
      date: string | null;
      processedCount: number;
      matchCount: number;
      durationMs: number;
    } | null;
  };
  growthStats: {
    segmentId: string;
    previousCount: number;
    currentCount: number;
    growthRate: number;
    period: string;
  }[];
  topAttributes: {
    attributeName: string;
    values: {
      value: string;
      count: number;
      percentage: number;
    }[];
  }[];
}

// Segment Worker Distribution
export interface WorkerAttributeDistribution {
  attributeName: string;
  values: {
    value: string;
    count: number;
    percentage: number;
  }[];
}

// Segment Insights Data
export interface SegmentInsightsData {
  uniqueAttributes: WorkerAttributeDistribution[];
  mostDifferentiating: WorkerAttributeDistribution[];
  recommendations: {
    type: 'split' | 'merge' | 'refine';
    description: string;
    potentialImpact: number;
  }[];
}

// Segment Comparison Data
export interface SegmentComparisonData {
  segmentA: {
    id: string;
    name: string;
    memberCount: number;
  };
  segmentB: {
    id: string;
    name: string;
    memberCount: number;
  };
  overlap: {
    count: number;
    percentageOfA: number;
    percentageOfB: number;
  };
  difference: {
    onlyInA: number;
    onlyInB: number;
    percentageOnlyInA: number;
    percentageOnlyInB: number;
  };
}

// Segment Overlapping Data
export interface SegmentOverlappingData {
  segmentId: string;
  segmentName: string;
  overlapCount: number;
  overlapPercentage: number;
} 