'use client';

import { Card } from '@/components/ui/card';

interface CategoriesCounts {
  income: number;
  expense: number;
  parents: number;
  children: number;
}

interface CategoriesStatsCardsProps {
  counts: CategoriesCounts;
}

export function CategoriesStatsCards({ counts }: CategoriesStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
          {counts.income}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Income Categories</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
          {counts.expense}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Expense Categories</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
          {counts.parents}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Parent Categories</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
          {counts.children}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Subcategories</p>
      </Card>
    </div>
  );
}
