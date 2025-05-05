import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics.service';

/**
 * Controller for handling metrics-related HTTP requests
 */
export class MetricsController {
  private metricsService: MetricsService;
  
  /**
   * Create a new MetricsController
   */
  constructor() {
    this.metricsService = MetricsService.getInstance();
  }
  
  /**
   * Get all metrics
   */
  getAllMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const metrics = this.metricsService.getMetrics();
      
      res.status(200).json({
        success: true,
        metrics
      });
    } catch (error) {
      console.error('Error getting metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve metrics',
        error: (error as Error).message
      });
    }
  };
  
  /**
   * Get Prometheus-formatted metrics
   * This endpoint is used by Prometheus to scrape metrics
   */
  getPrometheusMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const metrics = this.metricsService.getMetrics();
      let prometheusOutput = '';
      
      // Convert metrics to Prometheus format
      Object.values(metrics).forEach(metric => {
        const metricName = `app_${metric.name.replace(/[^a-zA-Z0-9_]/g, '_')}`;
        const tags = Object.entries(metric.tags)
          .map(([k, v]) => `${k}="${v}"`)
          .join(',');
        
        // Add help line if it doesn't exist
        if (!prometheusOutput.includes(`# HELP ${metricName}`)) {
          prometheusOutput += `# HELP ${metricName} ${metric.type} metric for ${metric.name}\n`;
          prometheusOutput += `# TYPE ${metricName} ${metric.type === 'timer' ? 'gauge' : metric.type}\n`;
        }
        
        // Add the metric value
        prometheusOutput += `${metricName}{${tags}} ${metric.value} ${Math.floor(metric.timestamp / 1000)}\n`;
      });
      
      res.set('Content-Type', 'text/plain');
      res.status(200).send(prometheusOutput);
    } catch (error) {
      console.error('Error getting Prometheus metrics:', error);
      res.status(500).send('# Error generating metrics');
    }
  };
} 