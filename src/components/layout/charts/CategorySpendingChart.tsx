'use client';

import { PieChartComponent } from './PieChartComponent';
import { useCategorySpending } from '@/features/finance/hooks/useCategorySpending';
import { formatSummaryAmount } from '@/lib/currency';

export function CategorySpendingChart() {
  const { data: categoryData, isLoading, error } = useCategorySpending();

  if (error) {
    return (
      <PieChartComponent
        title="Category Spending"
        description="Breakdown of expenses by category"
        data={[]}
        isLoading={false}
        error="Failed to load spending data"
      />
    );
  }

  // Find highest spending category
  const topCategory =
    categoryData && categoryData.length > 0
      ? categoryData.reduce((prev, current) => (prev.value > current.value ? prev : current))
      : null;

  return (
    <PieChartComponent
      title="Category Spending"
      description="Breakdown of expenses by category this month"
      data={categoryData || []}
      isLoading={isLoading}
      footer={
        topCategory ? (
          <div className="text-sm text-muted-foreground">
            Highest spending category: <span className="font-medium">{topCategory.name}</span>
            <span className="ml-2">({formatSummaryAmount(topCategory.amount)})</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No spending data available</div>
        )
      }
    />
  );
}
