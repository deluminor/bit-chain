'use client';

import { SummaryStatTile, SummaryStatsRow } from '@/components/ui/summary-stat-tile';
import { Layers, ListTree, TrendingDown, TrendingUp } from 'lucide-react';

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
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStatTile
        title="Income Categories"
        value={counts.income}
        hint="Income type"
        icon={TrendingUp}
        tone="income"
      />
      <SummaryStatTile
        title="Expense Categories"
        value={counts.expense}
        hint="Expense type"
        icon={TrendingDown}
        tone="expense"
      />
      <SummaryStatTile
        title="Parent Categories"
        value={counts.parents}
        hint="Top-level"
        icon={Layers}
        tone="blue"
      />
      <SummaryStatTile
        title="Subcategories"
        value={counts.children}
        hint="Nested"
        icon={ListTree}
        tone="purple"
      />
    </SummaryStatsRow>
  );
}
