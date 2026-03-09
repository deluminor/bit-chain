import { useStore } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useCreatePosition,
  useDeletePosition,
  usePositions,
  useUpdatePosition,
} from '../queries/positions';
import { Trade } from '../types/position';

interface TradeFilters {
  sideFilter?: string;
  categoryFilter?: string;
  resultFilter?: string;
}

export const useTradeData = (filters: TradeFilters = {}) => {
  const { selectedDateRange } = useStore();

  const {
    data: trades,
    refetch: reactQueryRefetch,
    isLoading,
    isFetching: reactQueryFetching,
  } = usePositions();
  const [isManualRefetching, setIsManualRefetching] = useState(false);
  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();
  const { mutateAsync: deletePosition } = useDeletePosition();

  const isFetching = reactQueryFetching || isManualRefetching;

  useEffect(() => {
    setIsManualRefetching(reactQueryFetching);
  }, [reactQueryFetching]);

  const filteredTrades = useMemo(() => {
    if (!trades) return [];

    return trades.filter(trade => {
      if (selectedDateRange?.from && selectedDateRange?.to) {
        const tradeDate = new Date(trade.date);
        if (tradeDate < selectedDateRange.from || tradeDate > selectedDateRange.to) {
          return false;
        }
      }

      if (filters.sideFilter && trade.side !== filters.sideFilter) return false;
      if (filters.categoryFilter && trade.category.name !== filters.categoryFilter) return false;
      if (filters.resultFilter && trade.result !== filters.resultFilter) return false;

      return true;
    });
  }, [trades, filters, selectedDateRange]);

  const refetch = useCallback(async () => {
    try {
      setIsManualRefetching(true);
      const startTime = Date.now();
      const result = await reactQueryRefetch();
      const elapsed = Date.now() - startTime;
      const minVisibleTime = 2600;
      if (elapsed < minVisibleTime) {
        await new Promise(resolve => setTimeout(resolve, minVisibleTime - elapsed));
      }
      return result;
    } finally {
      setTimeout(() => setIsManualRefetching(false), 300);
    }
  }, [reactQueryRefetch]);

  const handleCreatePosition = useCallback(
    async (position: Omit<Trade, 'id' | 'pnl' | 'result' | 'riskPercent'>) => {
      return createPosition(position as Trade);
    },
    [createPosition],
  );

  const handleEditPosition = useCallback(
    async (position: Partial<Trade>) => {
      return updatePosition(position as Trade);
    },
    [updatePosition],
  );

  const handleDeletePosition = useCallback(
    async (id: string) => {
      await deletePosition({ id } as Trade);
    },
    [deletePosition],
  );

  return {
    trades: trades || [],
    filteredTrades,
    handleCreatePosition,
    handleEditPosition,
    handleDeletePosition,
    isLoading,
    isFetching,
    refetch,
  };
};
