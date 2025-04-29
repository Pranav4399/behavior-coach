import { PrismaClient } from '@prisma/client';
import { SegmentRepository } from '../repositories/segment.repository';
import { AppError } from '../../../common/middleware/errorHandler';
import { WorkerService } from '../../workers/services/worker.service';

interface SegmentGrowthStats {
  segmentId: string;
  previousCount: number;
  currentCount: number;
  growthRate: number; // percentage
  period: string;
}

interface WorkerAttributeDistribution {
  attributeName: string;
  values: {
    value: string;
    count: number;
    percentage: number;
  }[];
}

interface SegmentComparisonResult {
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

/**
 * Service for segment analytics operations
 */
export class SegmentAnalyticsService {
  private prisma: PrismaClient;
  private segmentRepository: SegmentRepository;
  private workerService: WorkerService;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.segmentRepository = new SegmentRepository(prisma);
    this.workerService = new WorkerService(prisma);
  }
  
  /**
   * Get comprehensive analytics for a segment
   */
  async getSegmentAnalytics(segmentId: string): Promise<{
    basicStats: {
      totalMembers: number;
      ruleMatchCount: number;
      manuallyAddedCount: number;
      lastSyncDate: Date | null;
    };
    syncActivity: {
      totalSyncs: number;
      lastSyncDetails: {
        date: Date | null;
        processedCount: number;
        matchCount: number;
        durationMs: number;
      } | null;
    };
    growthStats: SegmentGrowthStats[];
    topAttributes: WorkerAttributeDistribution[];
  }> {
    // Check if segment exists
    const segment = await this.segmentRepository.findById(segmentId);
    if (!segment) {
      throw new AppError('Segment not found', 404);
    }
    
    // Get basic stats
    const basicStats = await this.getBasicStats(segmentId);
    
    // Get sync activity
    const syncActivity = await this.getSyncActivity(segmentId);
    
    // Get growth stats (last 7 days, last 30 days, last 90 days)
    const growthStats = await this.getGrowthStats(segmentId);
    
    // Get top worker attributes
    const topAttributes = await this.getTopAttributes(segmentId);
    
    return {
      basicStats,
      syncActivity,
      growthStats,
      topAttributes
    };
  }
  
  /**
   * Compare two segments
   */
  async compareSegments(segmentAId: string, segmentBId: string): Promise<SegmentComparisonResult> {
    // Verify both segments exist
    const [segmentA, segmentB] = await Promise.all([
      this.segmentRepository.findById(segmentAId),
      this.segmentRepository.findById(segmentBId)
    ]);
    
    if (!segmentA || !segmentB) {
      throw new AppError('One or both segments not found', 404);
    }
    
    // Check both segments are from same organization
    if (segmentA.organizationId !== segmentB.organizationId) {
      throw new AppError('Cannot compare segments from different organizations', 400);
    }
    
    // Get worker IDs for both segments
    const [segmentAMemberships, segmentBMemberships] = await Promise.all([
      this.prisma.segmentMembership.findMany({
        where: { segmentId: segmentAId },
        select: { workerId: true }
      }),
      this.prisma.segmentMembership.findMany({
        where: { segmentId: segmentBId },
        select: { workerId: true }
      })
    ]);
    
    const workerIdsInA = new Set(segmentAMemberships.map((m: { workerId: string }) => m.workerId));
    const workerIdsInB = new Set(segmentBMemberships.map((m: { workerId: string }) => m.workerId));
    
    // Calculate overlap
    const overlappingWorkers = [...workerIdsInA].filter(id => workerIdsInB.has(id));
    const onlyInA = [...workerIdsInA].filter(id => !workerIdsInB.has(id));
    const onlyInB = [...workerIdsInB].filter(id => !workerIdsInA.has(id));
    
    // Calculate metrics
    const countA = workerIdsInA.size;
    const countB = workerIdsInB.size;
    const overlapCount = overlappingWorkers.length;
    
    return {
      segmentA: {
        id: segmentAId,
        name: segmentA.name,
        memberCount: countA
      },
      segmentB: {
        id: segmentBId,
        name: segmentB.name,
        memberCount: countB
      },
      overlap: {
        count: overlapCount,
        percentageOfA: countA > 0 ? (overlapCount / countA) * 100 : 0,
        percentageOfB: countB > 0 ? (overlapCount / countB) * 100 : 0
      },
      difference: {
        onlyInA: onlyInA.length,
        onlyInB: onlyInB.length,
        percentageOnlyInA: countA > 0 ? (onlyInA.length / countA) * 100 : 0,
        percentageOnlyInB: countB > 0 ? (onlyInB.length / countB) * 100 : 0
      }
    };
  }
  
  /**
   * Get insights about a segment
   */
  async getSegmentInsights(segmentId: string): Promise<{
    uniqueAttributes: WorkerAttributeDistribution[];
    mostDifferentiating: WorkerAttributeDistribution[];
    recommendations: {
      type: 'split' | 'merge' | 'refine';
      description: string;
      potentialImpact: number; // percentage
    }[];
  }> {
    // Check if segment exists
    const segment = await this.segmentRepository.findById(segmentId);
    if (!segment) {
      throw new AppError('Segment not found', 404);
    }
    
    // Get segment worker IDs
    const memberships = await this.prisma.segmentMembership.findMany({
      where: { segmentId },
      select: { workerId: true }
    });
    
    const workerIds = memberships.map((m: { workerId: string }) => m.workerId);
    
    // For unique attributes, we need to find attributes that are common within the segment
    // but uncommon in the general worker population
    const uniqueAttributes = await this.calculateUniqueAttributes(segmentId, workerIds, segment.organizationId);
    
    // Most differentiating attributes are those that most strongly correlate with segment membership
    const mostDifferentiating = await this.calculateDifferentiatingAttributes(segmentId, workerIds, segment.organizationId);
    
    // Recommendations are algorithmic suggestions for segment optimization
    const recommendations = await this.generateRecommendations(segmentId, uniqueAttributes, mostDifferentiating);
    
    return {
      uniqueAttributes,
      mostDifferentiating,
      recommendations
    };
  }
  
  /**
   * Get all worker segments that overlap with a given segment
   */
  async getOverlappingSegments(segmentId: string): Promise<{
    segmentId: string;
    segmentName: string;
    overlapCount: number;
    overlapPercentage: number;
  }[]> {
    // Check if segment exists
    const segment = await this.segmentRepository.findById(segmentId);
    if (!segment) {
      throw new AppError('Segment not found', 404);
    }
    
    // Find all segments in the same organization
    const { segments } = await this.segmentRepository.findByOrganizationId(
      segment.organizationId
    );
    
    // Skip the segment we're analyzing
    const otherSegments = segments.filter(s => s.id !== segmentId);
    
    // Get worker IDs for the segment we're analyzing
    const memberships = await this.prisma.segmentMembership.findMany({
      where: { segmentId },
      select: { workerId: true }
    });
    
    const segmentWorkerIds = new Set(memberships.map((m: { workerId: string }) => m.workerId));
    const segmentWorkerCount = segmentWorkerIds.size;
    
    if (segmentWorkerCount === 0) {
      return [];
    }
    
    // Calculate overlap for each segment
    const overlapResults = await Promise.all(
      otherSegments.map(async (otherSegment) => {
        const otherMemberships = await this.prisma.segmentMembership.findMany({
          where: { segmentId: otherSegment.id },
          select: { workerId: true }
        });
        
        const otherWorkerIds = new Set(otherMemberships.map((m: { workerId: string }) => m.workerId));
        
        // Calculate overlap
        const overlappingWorkers = [...segmentWorkerIds].filter(id => otherWorkerIds.has(id));
        const overlapCount = overlappingWorkers.length;
        const overlapPercentage = (overlapCount / segmentWorkerCount) * 100;
        
        return {
          segmentId: otherSegment.id,
          segmentName: otherSegment.name,
          overlapCount,
          overlapPercentage
        };
      })
    );
    
    // Sort by overlap percentage (highest first)
    return overlapResults.sort((a, b) => b.overlapPercentage - a.overlapPercentage);
  }
  
  /**
   * Private helper methods for analytics
   */
  private async getBasicStats(segmentId: string) {
    // Count total members
    const totalMembers = await this.prisma.segmentMembership.count({
      where: { segmentId }
    });
    
    // Count rule matches
    const ruleMatchCount = await this.prisma.segmentMembership.count({
      where: {
        segmentId,
        ruleMatch: true
      }
    });
    
    // Get last sync date
    const segment = await this.segmentRepository.findById(segmentId);
    
    return {
      totalMembers,
      ruleMatchCount,
      manuallyAddedCount: totalMembers - ruleMatchCount,
      lastSyncDate: segment?.lastSyncAt || null
    };
  }
  
  private async getSyncActivity(segmentId: string) {
    // Count total syncs
    const totalSyncs = await this.prisma.segmentSyncJob.count({
      where: { segmentId }
    });
    
    // Get last sync details
    const lastSync = await this.prisma.segmentSyncJob.findFirst({
      where: { 
        segmentId,
        status: 'completed'
      },
      orderBy: { completedAt: 'desc' }
    });
    
    let lastSyncDetails = null;
    
    if (lastSync && lastSync.startedAt && lastSync.completedAt) {
      const durationMs = lastSync.completedAt.getTime() - lastSync.startedAt.getTime();
      
      lastSyncDetails = {
        date: lastSync.completedAt,
        processedCount: lastSync.processedCount,
        matchCount: lastSync.matchCount,
        durationMs
      };
    }
    
    return {
      totalSyncs,
      lastSyncDetails
    };
  }
  
  private async getGrowthStats(segmentId: string): Promise<SegmentGrowthStats[]> {
    // This is a simplified implementation - in a real system, 
    // you would use a time-series database or track historical counts
    
    // For now, we'll look at the creation dates of the memberships and use that for estimation
    const memberships = await this.prisma.segmentMembership.findMany({
      where: { segmentId },
      select: { addedAt: true }
    });
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 90);
    
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    // Count memberships in each period
    const currentCount = memberships.length;
    
    const count30DaysAgo = memberships.filter(
      (m: { addedAt: Date | null }) => m.addedAt && m.addedAt < thirtyDaysAgo
    ).length;
    
    const count90DaysAgo = memberships.filter(
      (m: { addedAt: Date | null }) => m.addedAt && m.addedAt < ninetyDaysAgo
    ).length;
    
    const count7DaysAgo = memberships.filter(
      (m: { addedAt: Date | null }) => m.addedAt && m.addedAt < sevenDaysAgo
    ).length;
    
    return [
      {
        segmentId,
        previousCount: count7DaysAgo,
        currentCount,
        growthRate: count7DaysAgo > 0 ? ((currentCount - count7DaysAgo) / count7DaysAgo) * 100 : 0,
        period: '7 days'
      },
      {
        segmentId,
        previousCount: count30DaysAgo,
        currentCount,
        growthRate: count30DaysAgo > 0 ? ((currentCount - count30DaysAgo) / count30DaysAgo) * 100 : 0,
        period: '30 days'
      },
      {
        segmentId,
        previousCount: count90DaysAgo,
        currentCount,
        growthRate: count90DaysAgo > 0 ? ((currentCount - count90DaysAgo) / count90DaysAgo) * 100 : 0,
        period: '90 days'
      }
    ];
  }
  
  private async getTopAttributes(segmentId: string): Promise<WorkerAttributeDistribution[]> {
    // Get workers in the segment
    const memberships = await this.prisma.segmentMembership.findMany({
      where: { segmentId },
      select: { workerId: true }
    });
    
    const workerIds = memberships.map((m: { workerId: string }) => m.workerId);
    
    if (workerIds.length === 0) {
      return [];
    }
    
    // Get the workers' details
    const workers = await Promise.all(
      workerIds.map((id: string) => this.workerService.getWorkerById(id).catch(() => null))
    );
    
    const validWorkers = workers.filter(Boolean) as any[];
    
    // Analyze common attributes
    const distributions: WorkerAttributeDistribution[] = [];
    
    // Departments (if available)
    if (validWorkers.some(w => w.employment?.department)) {
      const departments: Record<string, number> = {};
      
      validWorkers.forEach(worker => {
        if (worker.employment?.department) {
          const dept = worker.employment.department;
          departments[dept] = (departments[dept] || 0) + 1;
        }
      });
      
      const values = Object.entries(departments)
        .map(([value, count]) => ({
          value,
          count,
          percentage: (count / validWorkers.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10
      
      distributions.push({
        attributeName: 'department',
        values
      });
    }
    
    // Job titles (if available)
    if (validWorkers.some(w => w.employment?.jobTitle)) {
      const jobTitles: Record<string, number> = {};
      
      validWorkers.forEach(worker => {
        if (worker.employment?.jobTitle) {
          const title = worker.employment.jobTitle;
          jobTitles[title] = (jobTitles[title] || 0) + 1;
        }
      });
      
      const values = Object.entries(jobTitles)
        .map(([value, count]) => ({
          value,
          count,
          percentage: (count / validWorkers.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10
      
      distributions.push({
        attributeName: 'jobTitle',
        values
      });
    }
    
    // Location (if available)
    if (validWorkers.some(w => w.contact?.locationCity)) {
      const locations: Record<string, number> = {};
      
      validWorkers.forEach(worker => {
        if (worker.contact?.locationCity) {
          const location = worker.contact.locationCity;
          locations[location] = (locations[location] || 0) + 1;
        }
      });
      
      const values = Object.entries(locations)
        .map(([value, count]) => ({
          value,
          count,
          percentage: (count / validWorkers.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10
      
      distributions.push({
        attributeName: 'location',
        values
      });
    }
    
    // Tags (if available)
    if (validWorkers.some(w => w.tags && w.tags.length > 0)) {
      const tags: Record<string, number> = {};
      
      validWorkers.forEach(worker => {
        if (worker.tags && worker.tags.length > 0) {
          worker.tags.forEach((tag: string) => {
            tags[tag] = (tags[tag] || 0) + 1;
          });
        }
      });
      
      const values = Object.entries(tags)
        .map(([value, count]) => ({
          value,
          count,
          percentage: (count / validWorkers.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10
      
      distributions.push({
        attributeName: 'tags',
        values
      });
    }
    
    return distributions;
  }
  
  private async calculateUniqueAttributes(
    segmentId: string,
    segmentWorkerIds: string[],
    organizationId: string
  ): Promise<WorkerAttributeDistribution[]> {
    // For a simplified implementation, we'll return a subset of top attributes
    // In a real system, this would compare distribution in segment vs. overall population
    const topAttributes = await this.getTopAttributes(segmentId);
    
    return topAttributes.slice(0, 2); // Return top 2 attributes as "unique"
  }
  
  private async calculateDifferentiatingAttributes(
    segmentId: string,
    segmentWorkerIds: string[],
    organizationId: string
  ): Promise<WorkerAttributeDistribution[]> {
    // For a simplified implementation, we'll return a subset of top attributes
    // In a real system, this would calculate statistical significance
    const topAttributes = await this.getTopAttributes(segmentId);
    
    // Use attributes with highest internal percentage
    return topAttributes
      .map(attr => ({
        ...attr,
        values: attr.values.filter(v => v.percentage > 50) // Only values with high percentages
      }))
      .filter(attr => attr.values.length > 0)
      .slice(0, 2);
  }
  
  private async generateRecommendations(
    segmentId: string,
    uniqueAttributes: WorkerAttributeDistribution[],
    differentiatingAttributes: WorkerAttributeDistribution[]
  ): Promise<any[]> {
    // This is a simplified implementation with generic recommendations
    const recommendations = [];
    
    // Recommend splitting if there are distinct subgroups
    if (uniqueAttributes.length > 0 && uniqueAttributes[0].values.length >= 2) {
      const attribute = uniqueAttributes[0];
      recommendations.push({
        type: 'split',
        description: `Consider splitting this segment based on ${attribute.attributeName} values`,
        potentialImpact: 30
      });
    }
    
    // Recommend refining if there's a dominant characteristic
    if (differentiatingAttributes.length > 0 && differentiatingAttributes[0].values.length > 0) {
      const attribute = differentiatingAttributes[0];
      const topValue = attribute.values[0];
      recommendations.push({
        type: 'refine',
        description: `Refine segment to focus on ${attribute.attributeName} = "${topValue.value}" (${topValue.percentage.toFixed(1)}%)`,
        potentialImpact: 25
      });
    }
    
    // Default recommendation if no specific insights
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'merge',
        description: 'Consider analyzing related segments for potential merging opportunities',
        potentialImpact: 15
      });
    }
    
    return recommendations;
  }
} 