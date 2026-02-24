'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { XCircle } from 'lucide-react';

export function ResetFiltersButton() {
  const { resetTradeFilters } = useStore();
  const tradeFilters = useStore(state => state.tradeFilters);
  const selectedDateRange = useStore(state => state.selectedDateRange);

  const hasActiveFilters =
    Object.values(tradeFilters).some(value => !!value) || !!selectedDateRange;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={resetTradeFilters}
      className="gap-2 min-h-32px"
      disabled={!hasActiveFilters}
    >
      <XCircle className="h-4 w-4" />
      Reset filters
    </Button>
  );
}
