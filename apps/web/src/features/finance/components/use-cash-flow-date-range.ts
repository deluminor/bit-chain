import { endOfDay, startOfDay } from 'date-fns';
import { useMemo } from 'react';

interface SelectedDateRange {
  from?: Date;
  to?: Date;
}

export function useCashFlowDateRange(selectedDateRange?: SelectedDateRange) {
  const dateFrom = useMemo(() => {
    if (selectedDateRange?.from) {
      return startOfDay(selectedDateRange.from).toISOString();
    }
    return undefined;
  }, [selectedDateRange?.from]);

  const dateTo = useMemo(() => {
    if (selectedDateRange?.to) {
      return endOfDay(selectedDateRange.to).toISOString();
    }
    return new Date().toISOString();
  }, [selectedDateRange?.to]);

  return { dateFrom, dateTo };
}
