import type { PerformanceMetrics } from './performance.types';

function sendAnalytics(event: string, data: Record<string, unknown>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (
      window.gtag as (
        command: string,
        eventName: string,
        parameters: Record<string, unknown>,
      ) => void
    )('event', event, data);
  }
}

export function logPerformanceMetric(label: string, metrics: PerformanceMetrics) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Performance: ${label}`);
    console.log(`⏱️ Duration: ${metrics.renderTime.toFixed(2)}ms`);
    if (metrics.memoryUsage) {
      console.log(`🧠 Memory: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }
    console.groupEnd();
  }

  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    sendAnalytics('performance', {
      label,
      duration: metrics.renderTime,
      memory: metrics.memoryUsage,
      timestamp: Date.now(),
    });
  }
}

export const PERFORMANCE_THRESHOLDS = {
  COMPONENT_RENDER: 100,
  DATABASE_QUERY: 1000,
  CHART_RENDER: 500,
  API_REQUEST: 2000,
  MEMORY_USAGE: 50,
} as const;

export function checkPerformanceThresholds(
  label: string,
  metrics: PerformanceMetrics,
  threshold?: number,
) {
  const defaultThreshold = PERFORMANCE_THRESHOLDS.COMPONENT_RENDER;
  const maxTime = threshold || defaultThreshold;

  if (metrics.renderTime > maxTime) {
    console.warn(
      `⚠️ Performance Warning: ${label} took ${metrics.renderTime.toFixed(2)}ms ` +
        `(threshold: ${maxTime}ms)`,
    );
  }

  if (
    metrics.memoryUsage &&
    metrics.memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_USAGE * 1024 * 1024
  ) {
    console.warn(
      `⚠️ Memory Warning: ${label} used ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB ` +
        `(threshold: ${PERFORMANCE_THRESHOLDS.MEMORY_USAGE}MB)`,
    );
  }
}
