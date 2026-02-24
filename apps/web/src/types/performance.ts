export interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export interface ChartPerformanceConfig {
  onRenderStart: () => void;
  onRenderEnd: (duration: number) => void;
}

export interface QueryOptimizationResult<T> {
  data: T;
  fromCache: boolean;
  executionTime: number;
}

export interface PaginationResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type PerformanceThreshold = {
  COMPONENT_RENDER: number;
  DATABASE_QUERY: number;
  CHART_RENDER: number;
  API_REQUEST: number;
  MEMORY_USAGE: number;
};

export interface AnalyticsEvent {
  event: string;
  data: Record<string, unknown>;
  timestamp: number;
}
