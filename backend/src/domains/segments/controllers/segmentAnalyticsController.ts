import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../common/middleware/errorHandler';
import prisma from '../../../../prisma/prisma';
import { SegmentAnalyticsService } from '../services/segment-analytics.service';
import { SegmentService } from '../services/segment.service';
import { WorkerService } from '../../workers/services/worker.service';

// Initialize services
const workerService = new WorkerService(prisma);
const segmentService = new SegmentService(prisma, workerService);
const analyticsService = new SegmentAnalyticsService(prisma);

/**
 * Get comprehensive analytics for a segment
 * @route GET /api/segments/:id/analytics
 */
export const getSegmentAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // First verify access to the segment
    const segment = await segmentService.getSegmentById(id);
    
    if (segment.organizationId !== organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    // Get analytics data
    const analytics = await analyticsService.getSegmentAnalytics(id);
    
    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare two segments
 * @route GET /api/segments/compare
 */
export const compareSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { segmentA, segmentB } = req.query as { segmentA: string; segmentB: string };
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    if (!segmentA || !segmentB) {
      throw new AppError('Both segment IDs are required', 400);
    }
    
    // First verify access to both segments
    const [segmentAData, segmentBData] = await Promise.all([
      segmentService.getSegmentById(segmentA),
      segmentService.getSegmentById(segmentB)
    ]);
    
    if (segmentAData.organizationId !== organizationId || segmentBData.organizationId !== organizationId) {
      throw new AppError('One or both segments not found or access denied', 404);
    }
    
    // Get comparison data
    const comparison = await analyticsService.compareSegments(segmentA, segmentB);
    
    res.status(200).json({
      status: 'success',
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get segment insights with recommendations
 * @route GET /api/segments/:id/insights
 */
export const getSegmentInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // First verify access to the segment
    const segment = await segmentService.getSegmentById(id);
    
    if (segment.organizationId !== organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    // Get insights
    const insights = await analyticsService.getSegmentInsights(id);
    
    res.status(200).json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get segments that overlap with the specified segment
 * @route GET /api/segments/:id/overlapping
 */
export const getOverlappingSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;
    
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    // First verify access to the segment
    const segment = await segmentService.getSegmentById(id);
    
    if (segment.organizationId !== organizationId) {
      throw new AppError('Segment not found or access denied', 404);
    }
    
    // Get overlapping segments
    const overlappingSegments = await analyticsService.getOverlappingSegments(id);
    
    res.status(200).json({
      status: 'success',
      data: overlappingSegments
    });
  } catch (error) {
    next(error);
  }
}; 