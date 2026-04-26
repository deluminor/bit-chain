'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import { CardSkeleton, ChartSkeleton, StatCardSkeleton } from '@/components/ui/loading-skeleton';
import { BudgetPageHeader } from '@/features/finance/components/budget-page/BudgetPageHeader';

export function BudgetPageLoading() {
  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <BudgetPageHeader />
      </div>

      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>

      <div className="px-4 lg:px-6 space-y-8 md:space-y-12">
        <ChartSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </AnimatedDiv>
  );
}
