import { useState, useMemo } from 'react';

export interface UseDataTableOptions {
  initialPageSize?: number;
  initialPage?: number;
}

export interface UseDataTableReturn {
  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;

  // Computed values
  totalPages: (totalItems: number) => number;
  offset: number;
}

export function useDataTable(options: UseDataTableOptions = {}): UseDataTableReturn {
  const { initialPageSize = 50, initialPage = 1 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onPageSizeChange = (value: string) => {
    const newSize = parseInt(value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const totalPages = (totalItems: number) => Math.ceil(totalItems / pageSize);

  const offset = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    onPageChange,
    onPageSizeChange,
    totalPages,
    offset,
  };
}
