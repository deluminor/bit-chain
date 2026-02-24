import { Trade } from '@/features/positions/types/position';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  paginatedTrades: Trade[];
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (value: string) => void;
}

export function usePagination(
  trades: Trade[],
  searchParams: ReadonlyURLSearchParams,
): UsePaginationResult {
  const pageParam = Number(searchParams.get('page')) || 1;
  const pageSizeParam = Number(searchParams.get('pageSize')) || 10;

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [pageSize, setPageSize] = useState(pageSizeParam);

  useEffect(() => {
    const maxPage = Math.max(Math.ceil(trades.length / pageSize), 1);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [trades, pageSize, currentPage]);

  const totalPages = Math.max(Math.ceil(trades.length / pageSize), 1);

  const paginatedTrades = trades.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  };
}
