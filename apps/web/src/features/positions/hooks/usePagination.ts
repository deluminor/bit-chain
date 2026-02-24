import { useMemo, useState } from 'react';
import { Trade } from '../types/position';

interface UsePaginationResult {
  totalPages: number;
  paginatedTrades: Trade[];
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}

export function usePagination(
  trades: Trade[],
  currentPage: number,
  pageSize: number,
): UsePaginationResult {
  const [page, setPage] = useState(currentPage);
  const [size, setSize] = useState(pageSize);

  const totalPages = Math.ceil(trades.length / size);
  const paginatedTrades = useMemo(() => {
    const startIndex = (page - 1) * size;
    return trades.slice(startIndex, startIndex + size);
  }, [trades, page, size]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1);
  };

  return {
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  };
}
