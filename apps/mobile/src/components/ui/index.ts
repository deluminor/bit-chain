/**
 * Barrel export for all reusable UI primitives.
 * Import from this file, not from individual component files.
 *
 * @example
 * ```tsx
 * import { Card, StatCard, Badge, EmptyState, PrivacyAmount } from '~/src/components/ui';
 * ```
 */

export { Badge } from './Badge';
export * from './BudgetCard';
export * from './Card';
export * from './charts';
export * from './EmptyState';
export * from './ErrorScreen';
export * from './LoadingScreen';
export * from './PageHeader';
export * from './PrivacyAmount';
export * from './ProgressBar';
export * from './SectionHeader';
export * from './Separator';
export * from './StatCard';
export { SummaryCard } from './SummaryCard';
export type { SummaryMetric } from './SummaryCard';

export type { BadgeVariant } from './Badge';
