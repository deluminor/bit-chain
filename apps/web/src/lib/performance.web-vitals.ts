import { logPerformanceMetric } from './performance.logging';

export function initWebVitals() {
  if (typeof window === 'undefined') {
    return;
  }

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

  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      const fidEntry = entry as PerformanceEntry & { processingStart: number };
      const interactionTime = fidEntry.processingStart - entry.startTime;
      logPerformanceMetric('FID', {
        renderTime: interactionTime,
        loadTime: interactionTime,
        interactionTime,
      });
    });
  }).observe({ entryTypes: ['first-input'] });

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
