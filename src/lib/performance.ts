// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

// Performance measurement decorator
export function measurePerformance(label: string) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    target: object,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    const method = descriptor.value;

    if (!method) {
      return descriptor;
    }

    descriptor.value = async function (this: unknown, ...args: Parameters<T>) {
      const startTime = performance.now();
      const startMemory = (performance as { memory?: { usedJSHeapSize: number } }).memory
        ?.usedJSHeapSize;

      try {
        const result = await method.call(this, ...args);
        const endTime = performance.now();
        const endMemory = (performance as { memory?: { usedJSHeapSize: number } }).memory
          ?.usedJSHeapSize;

        const metrics: PerformanceMetrics = {
          renderTime: endTime - startTime,
          loadTime: endTime - startTime,
          interactionTime: endTime - startTime,
          memoryUsage: endMemory && startMemory ? endMemory - startMemory : undefined,
        };

        logPerformanceMetric(label, metrics);
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.error(`Performance measurement failed for ${label}:`, {
          duration: endTime - startTime,
          error,
        });
        throw error;
      }
    } as T;

    return descriptor;
  };
}

// Performance logging
export function logPerformanceMetric(label: string, metrics: PerformanceMetrics) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Performance: ${label}`);
    console.log(`⏱️ Duration: ${metrics.renderTime.toFixed(2)}ms`);
    if (metrics.memoryUsage) {
      console.log(`🧠 Memory: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }
    console.groupEnd();
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // You can integrate with services like Google Analytics, DataDog, etc.
    sendAnalytics('performance', {
      label,
      duration: metrics.renderTime,
      memory: metrics.memoryUsage,
      timestamp: Date.now(),
    });
  }
}

// React performance hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = performance.now();

  React.useEffect(() => {
    const endTime = performance.now();
    logPerformanceMetric(`Component: ${componentName}`, {
      renderTime: endTime - startTime,
      loadTime: endTime - startTime,
      interactionTime: endTime - startTime,
    });
  }, [componentName, startTime]);

  return {
    measure: <T>(label: string, fn: () => T): T => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();

      logPerformanceMetric(`${componentName}: ${label}`, {
        renderTime: end - start,
        loadTime: end - start,
        interactionTime: end - start,
      });

      return result;
    },
  };
}

// Database query performance monitoring
export async function measureDatabaseQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await queryFn();
    const endTime = performance.now();

    logPerformanceMetric(`DB Query: ${queryName}`, {
      renderTime: endTime - startTime,
      loadTime: endTime - startTime,
      interactionTime: endTime - startTime,
    });

    return result;
  } catch (error) {
    const endTime = performance.now();
    logPerformanceMetric(`DB Query: ${queryName} (error)`, {
      renderTime: endTime - startTime,
      loadTime: endTime - startTime,
      interactionTime: endTime - startTime,
    });
    throw error;
  }
}

// Chart rendering performance
export function measureChartPerformance(chartName: string) {
  return {
    onAnimationStart: () => {
      (window as Window & { __chartStartTime?: number }).__chartStartTime = performance.now();
    },
    onAnimationEnd: () => {
      const startTime = (window as Window & { __chartStartTime?: number }).__chartStartTime;
      if (startTime) {
        const endTime = performance.now();
        logPerformanceMetric(`Chart: ${chartName}`, {
          renderTime: endTime - startTime,
          loadTime: endTime - startTime,
          interactionTime: endTime - startTime,
        });
      }
    },
  };
}

// Memory usage monitoring
export function getMemoryUsage(): {
  used: number;
  total: number;
  limit: number;
} | null {
  if ('memory' in performance) {
    const memory = (
      performance as {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
    };
  }
  return null;
}

// Bundle size analysis
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigation = entries[0];

    if (navigation) {
      console.group('📦 Bundle Analysis');
      console.log(`📥 Transfer Size: ${(navigation.transferSize / 1024).toFixed(2)}KB`);
      console.log(`📄 Encoded Size: ${(navigation.encodedBodySize / 1024).toFixed(2)}KB`);
      console.log(`🗜️ Decoded Size: ${(navigation.decodedBodySize / 1024).toFixed(2)}KB`);
      console.log(`⏱️ Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
      console.groupEnd();
    }
  }
}

// Core Web Vitals monitoring
export function initWebVitals() {
  if (typeof window !== 'undefined') {
    // Largest Contentful Paint
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        const lcpEntry = lastEntry as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        logPerformanceMetric('LCP', {
          renderTime: lcpEntry.renderTime || 0,
          loadTime: lcpEntry.loadTime || 0,
          interactionTime: lastEntry.startTime,
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const fidEntry = entry as PerformanceEntry & { processingStart: number };
        logPerformanceMetric('FID', {
          renderTime: fidEntry.processingStart - entry.startTime,
          loadTime: fidEntry.processingStart - entry.startTime,
          interactionTime: fidEntry.processingStart - entry.startTime,
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver(entryList => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
        }
      });

      if (clsValue > 0) {
        logPerformanceMetric('CLS', {
          renderTime: clsValue,
          loadTime: clsValue,
          interactionTime: clsValue,
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Analytics integration (placeholder)
function sendAnalytics(event: string, data: Record<string, unknown>) {
  // Integrate with your analytics service
  // Example: Google Analytics, Mixpanel, DataDog, etc.

  if (typeof window !== 'undefined' && 'gtag' in window) {
    (
      window.gtag as (
        command: string,
        eventName: string,
        parameters: Record<string, unknown>,
      ) => void
    )('event', event, data);
  }

  // Or send to custom endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify({ event, data })
  // });
}

// React import (for useEffect hook)
import React from 'react';

// Performance warning thresholds
export const PERFORMANCE_THRESHOLDS = {
  COMPONENT_RENDER: 100, // ms
  DATABASE_QUERY: 1000, // ms
  CHART_RENDER: 500, // ms
  API_REQUEST: 2000, // ms
  MEMORY_USAGE: 50, // MB
} as const;

// Check if performance metrics exceed thresholds
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

// Query optimization utilities
export const QueryOptimizer = {
  // Debounce for search queries
  debounce: <T extends (...args: unknown[]) => unknown>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  // Cache for expensive calculations
  memoize: <T extends (...args: unknown[]) => unknown>(func: T): T => {
    const cache = new Map<string, ReturnType<T>>();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args) as ReturnType<T>;
      cache.set(key, result);
      return result;
    }) as T;
  },

  // Pagination helper
  paginate: <T>(items: T[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      items: items.slice(startIndex, endIndex),
      totalPages: Math.ceil(items.length / limit),
      currentPage: page,
      totalItems: items.length,
    };
  },
};
