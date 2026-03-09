import React from 'react';
import { logPerformanceMetric } from './performance.logging';
import type { PerformanceMetrics } from './performance.types';

export { QueryOptimizer } from './performance.query-optimizer';
export {
  PERFORMANCE_THRESHOLDS,
  checkPerformanceThresholds,
  logPerformanceMetric,
} from './performance.logging';
export { initWebVitals } from './performance.web-vitals';
export type { PerformanceMetrics } from './performance.types';

export function measurePerformance(label: string) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    _target: object,
    _propertyName: string,
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

export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const navigation = entries[0];

  if (!navigation) {
    return;
  }

  console.group('📦 Bundle Analysis');
  console.log(`📥 Transfer Size: ${(navigation.transferSize / 1024).toFixed(2)}KB`);
  console.log(`📄 Encoded Size: ${(navigation.encodedBodySize / 1024).toFixed(2)}KB`);
  console.log(`🗜️ Decoded Size: ${(navigation.decodedBodySize / 1024).toFixed(2)}KB`);
  console.log(`⏱️ Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
  console.groupEnd();
}
