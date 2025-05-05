import { EventEmitter } from 'events';

/**
 * Metric types supported by the system
 */
export enum MetricType {
  COUNTER = 'counter',   // Metrics that only increase
  GAUGE = 'gauge',       // Metrics that can go up or down
  HISTOGRAM = 'histogram', // Distribution of values
  TIMER = 'timer'        // Timing measurements
}

/**
 * Metric data structure
 */
interface Metric {
  name: string;
  type: MetricType;
  value: number;
  tags: Record<string, string>;
  timestamp: number;
}

/**
 * Service for collecting and publishing metrics
 * Provides a central place for monitoring system activity
 */
export class MetricsService {
  private static instance: MetricsService;
  private eventEmitter: EventEmitter;
  private metrics: Record<string, Metric> = {};
  private timers: Record<string, number> = {};

  /**
   * Create a new metrics service (singleton)
   */
  private constructor() {
    this.eventEmitter = new EventEmitter();
    
    // Set high limit to avoid max listeners warning
    this.eventEmitter.setMaxListeners(100);
    
    // Log metrics periodically if needed
    setInterval(() => {
      this.publishMetrics();
    }, 60000); // Publish every minute
  }

  /**
   * Get the metrics service instance
   * @returns MetricsService singleton instance
   */
  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  /**
   * Increment a counter metric
   * @param name Metric name
   * @param value Value to increment by (default: 1)
   * @param tags Additional tags to associate with the metric
   */
  public incrementCounter(name: string, value = 1, tags: Record<string, string> = {}): void {
    const metricName = this.getMetricKey(name, tags);
    
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = {
        name,
        type: MetricType.COUNTER,
        value: 0,
        tags,
        timestamp: Date.now()
      };
    }
    
    this.metrics[metricName].value += value;
    this.metrics[metricName].timestamp = Date.now();
    
    this.eventEmitter.emit('metric', this.metrics[metricName]);
  }

  /**
   * Set a gauge metric
   * @param name Metric name
   * @param value Current value
   * @param tags Additional tags to associate with the metric
   */
  public setGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    const metricName = this.getMetricKey(name, tags);
    
    this.metrics[metricName] = {
      name,
      type: MetricType.GAUGE,
      value,
      tags,
      timestamp: Date.now()
    };
    
    this.eventEmitter.emit('metric', this.metrics[metricName]);
  }

  /**
   * Record a value in a histogram
   * @param name Metric name
   * @param value Value to record
   * @param tags Additional tags to associate with the metric
   */
  public recordHistogram(name: string, value: number, tags: Record<string, string> = {}): void {
    const metricName = this.getMetricKey(name, tags);
    
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = {
        name,
        type: MetricType.HISTOGRAM,
        value,
        tags,
        timestamp: Date.now()
      };
    } else {
      // For simplicity, just update the value (in a real implementation, we'd keep all values)
      this.metrics[metricName].value = value;
      this.metrics[metricName].timestamp = Date.now();
    }
    
    this.eventEmitter.emit('metric', this.metrics[metricName]);
  }

  /**
   * Start a timer
   * @param name Timer name
   * @param tags Additional tags to associate with the timer
   */
  public startTimer(name: string, tags: Record<string, string> = {}): void {
    const timerName = this.getMetricKey(name, tags);
    this.timers[timerName] = Date.now();
  }

  /**
   * Stop a timer and record the duration
   * @param name Timer name
   * @param tags Additional tags to associate with the timer
   * @returns Duration in milliseconds or undefined if timer wasn't started
   */
  public stopTimer(name: string, tags: Record<string, string> = {}): number | undefined {
    const timerName = this.getMetricKey(name, tags);
    const startTime = this.timers[timerName];
    
    if (!startTime) {
      console.warn(`Timer ${name} was not started`);
      return undefined;
    }
    
    const duration = Date.now() - startTime;
    delete this.timers[timerName];
    
    const metricName = this.getMetricKey(name, tags);
    this.metrics[metricName] = {
      name,
      type: MetricType.TIMER,
      value: duration,
      tags,
      timestamp: Date.now()
    };
    
    this.eventEmitter.emit('metric', this.metrics[metricName]);
    return duration;
  }

  /**
   * Get all recorded metrics
   * @returns Object containing all metrics
   */
  public getMetrics(): Record<string, Metric> {
    return { ...this.metrics };
  }

  /**
   * Subscribe to metric events
   * @param callback Function to call when a metric is updated
   */
  public onMetric(callback: (metric: Metric) => void): void {
    this.eventEmitter.on('metric', callback);
  }

  /**
   * Generate a unique key for a metric based on name and tags
   * @param name Metric name
   * @param tags Tags associated with the metric
   * @returns Unique metric key
   */
  private getMetricKey(name: string, tags: Record<string, string>): string {
    const tagString = Object.entries(tags)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    
    return tagString ? `${name}:${tagString}` : name;
  }

  /**
   * Publish current metrics
   * This could send metrics to monitoring systems like Prometheus, Datadog, etc.
   * For now, it just logs to console if in development mode
   */
  private publishMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Current metrics:', JSON.stringify(this.metrics, null, 2));
    }
    
    // In production, you would send to a monitoring system:
    // - Send to Prometheus endpoint
    // - Push to Datadog/CloudWatch/etc.
    // - Write to a monitoring database
    
    this.eventEmitter.emit('publish', this.metrics);
  }
} 