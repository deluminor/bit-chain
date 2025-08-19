import { useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (value: string) => void;
}

export function usePagination(): UsePaginationResult {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }

      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const newPageSize = Number(value);

      if (newPageSize === 10) {
        params.delete('pageSize');
      } else {
        params.set('pageSize', newPageSize.toString());
      }

      // Reset to first page when changing page size
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
}
