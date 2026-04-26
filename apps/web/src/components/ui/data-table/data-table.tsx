'use client';

import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableLoadingBar } from '@/components/ui/table-loading-bar';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';
import { DataTablePagination } from './pagination';
import { FilterField, TableFilters } from './table-filters';

const DATA_TABLE_CELL_PAD = 'px-4 py-2';
const DATA_TABLE_ACTIONS_HEAD = 'w-16 min-w-16 text-right';
const DATA_TABLE_ACTIONS_CELL = 'w-16 min-w-16 text-right';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T = unknown> {
  data: T[];
  columns: DataTableColumn<T>[];

  isLoading?: boolean;
  isFetching?: boolean;

  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  pageSizeOptions?: number[];
  showPagination?: boolean;

  actions?: (item: T) => ReactNode;
  onRefresh?: () => void;

  filterFields?: FilterField[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;

  title?: string | ReactNode;
  description?: string | ReactNode;
  headerActions?: ReactNode;

  emptyMessage?: string;
  emptyDescription?: string;
  emptyActions?: ReactNode;
  tableClassName?: string;
  maxHeight?: string;

  getRowKey?: (item: T, index: number) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  isFetching = false,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  showPagination = true,
  actions,
  onRefresh,
  filterFields,
  onClearFilters,
  hasActiveFilters,
  title,
  description,
  headerActions,
  emptyMessage = 'No data found',
  emptyDescription = 'No items match your criteria',
  emptyActions,
  tableClassName = '',
  maxHeight = '550px',
  getRowKey = (item: T, index: number) => (item as { id?: string | number })?.id || index,
}: DataTableProps<T>) {
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`} className="group">
        {columns.map(column => (
          <TableCell
            key={`skeleton-${index}-${column.key}`}
            className={cn(DATA_TABLE_CELL_PAD, column.className)}
          >
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
        ))}
        {actions && (
          <TableCell className={cn(DATA_TABLE_CELL_PAD, DATA_TABLE_ACTIONS_CELL)}>
            <div className="flex w-full justify-end">
              <Skeleton className="h-8 w-8" />
            </div>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  const renderDataRows = () => {
    return data.map((item, index) => (
      <TableRow key={getRowKey(item, index)} className="group">
        {columns.map(column => (
          <TableCell
            key={`${getRowKey(item, index)}-${column.key}`}
            className={cn(DATA_TABLE_CELL_PAD, column.className)}
          >
            {column.cell(item)}
          </TableCell>
        ))}
        {actions && (
          <TableCell className={cn(DATA_TABLE_CELL_PAD, DATA_TABLE_ACTIONS_CELL)}>
            {actions(item)}
          </TableCell>
        )}
      </TableRow>
    ));
  };

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-medium mb-2">{emptyMessage}</p>
          <p className="text-muted-foreground mb-4">{emptyDescription}</p>
          {emptyActions}
        </div>
      </TableCell>
    </TableRow>
  );

  const tableContent = (
    <div className="pb-4 flex flex-col gap-4 justify-between items-start md:items-center overflow-hidden">
      <div className="w-full relative pt-0">
        <TableLoadingBar isLoading={isFetching} className="absolute top-0 left-0 right-0 z-10" />
        <div className="w-full px-0">
          <div className={`overflow-auto data-table ${tableClassName}`} style={{ maxHeight }}>
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur supports-backdrop-filter:bg-card/60">
                <TableRow className="hover:bg-transparent">
                  {columns.map(column => (
                    <TableHead
                      key={column.key}
                      className={cn(DATA_TABLE_CELL_PAD, column.className)}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                  {actions && (
                    <TableHead className={cn(DATA_TABLE_CELL_PAD, DATA_TABLE_ACTIONS_HEAD)}>
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && renderSkeletonRows()}
                {!isLoading && data.length > 0 && renderDataRows()}
                {!isLoading && data.length === 0 && renderEmptyState()}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {showPagination && data.length > 0 && !isLoading && (
        <div className="pt-4 border-t w-full px-4">
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
    </div>
  );

  // Helper to render the header content
  const renderHeader = () => {
    if (filterFields && filterFields.length > 0) {
      return (
        <div className="w-full">
          <TableFilters
            fields={filterFields}
            onClearFilters={onClearFilters}
            onRefresh={onRefresh}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            layout="flex"
            showCard={false}
            className="items-center w-full"
          />
        </div>
      );
    }

    if (title || description || headerActions || onRefresh) {
      return (
        <div className="flex items-center justify-between w-full">
          <div>
            {title && <CardTitle className="flex items-center gap-2">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const headerContent = renderHeader();

  return (
    <div className="shadow rounded-lg border bg-card text-card-foreground">
      {headerContent && (
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {headerContent}
        </div>
      )}
      <div className="p-0">{tableContent}</div>
    </div>
  );
}
