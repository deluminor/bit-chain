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
      // Date range filter (using global date range)
      if (selectedDateRange?.from && selectedDateRange?.to) {
        const tradeDate = new Date(trade.date);
        if (tradeDate < selectedDateRange.from || tradeDate > selectedDateRange.to) {
          return false;
        }
      }

      // Side filter
      if (filters.sideFilter && trade.side !== filters.sideFilter) {
        return false;
      }

      // Category filter
      if (filters.categoryFilter && trade.category.name !== filters.categoryFilter) {
        return false;
      }

      // Result filter
      if (filters.resultFilter && trade.result !== filters.resultFilter) {
        return false;
      }

      return true;
    });
  }, [trades, filters, selectedDateRange]);

  // Custom refetch function that ensures loading state is visible
  const refetch = useCallback(async () => {
    try {
      console.log('Manual refetch started');
      setIsManualRefetching(true);

      // Get the current time to calculate overall duration
      const startTime = Date.now();

      // Execute the actual refetch
      const result = await reactQueryRefetch();

      // Calculate how much time has passed
      const elapsedTime = Date.now() - startTime;

      // If the refetch was too fast, add a delay to ensure animation is visible
      const minimumVisibleTime = 2600;
      if (elapsedTime < minimumVisibleTime) {
        await new Promise(resolve => setTimeout(resolve, minimumVisibleTime - elapsedTime));
      }

      return result;
    } finally {
      console.log('Manual refetch completed');
      // The loading indicator will naturally fade out due to the TableLoadingBar component's
      // internal timing logic, so we don't need an extra delay here
      setTimeout(() => {
        setIsManualRefetching(false);
      }, 300);
    }
  }, [reactQueryRefetch]);

  const handleCreatePosition = useCallback(
    async (position: Omit<Trade, 'id' | 'pnl' | 'result' | 'riskPercent'>) => {
      const newTrade = await createPosition(position as Trade);
      return newTrade;
    },
    [createPosition],
  );

  const handleEditPosition = useCallback(
    async (position: Partial<Trade>) => {
      const updatedTrade = await updatePosition(position as Trade);
      return updatedTrade;
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
    filteredTrades: filteredTrades,
    handleCreatePosition,
    handleEditPosition,
    handleDeletePosition,
    isLoading,
    isFetching,
    refetch,
  };
};
