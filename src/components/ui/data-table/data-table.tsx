'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { RefreshCw } from 'lucide-react';
import { DataTablePagination } from './pagination';

export interface DataTableColumn<T = unknown> {
  key: string;
  header: string | ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T = unknown> {
  // Data
  data: T[];
  columns: DataTableColumn<T>[];

  // Loading states
  isLoading?: boolean;
  isFetching?: boolean;

  // Pagination
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  pageSizeOptions?: number[];
  showPagination?: boolean;

  // Actions
  actions?: (item: T) => ReactNode;
  onRefresh?: () => void;

  // Card wrapper
  title?: string | ReactNode;
  description?: string | ReactNode;
  headerActions?: ReactNode;

  // Customization
  emptyMessage?: string;
  emptyDescription?: string;
  emptyActions?: ReactNode;
  tableClassName?: string;
  maxHeight?: string;

  // Row key
  getRowKey?: (item: T) => string | number;
}

export function DataTable<T = any>({
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
      <TableRow key={`skeleton-${index}`}>
        {columns.map(column => (
          <TableCell key={`skeleton-${index}-${column.key}`}>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
        ))}
        {actions && (
          <TableCell>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  const renderDataRows = () => {
    return data.map((item, index) => (
      <TableRow key={getRowKey(item, index)}>
        {columns.map(column => (
          <TableCell key={`${getRowKey(item, index)}-${column.key}`} className={column.className}>
            {column.cell(item)}
          </TableCell>
        ))}
        {actions && <TableCell className="w-[100px]">{actions(item)}</TableCell>}
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
      <div className="w-full relative pt-4">
        <TableLoadingBar isLoading={isFetching} className="absolute top-0 left-0 right-0 z-10" />
        <div className="w-full px-4">
          <div className={`overflow-auto data-table ${tableClassName}`} style={{ maxHeight }}>
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="hover:bg-transparent">
                  {columns.map(column => (
                    <TableHead key={column.key} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                  {actions && <TableHead className="w-[100px]">Actions</TableHead>}
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
        <div className="pt-4 border-t w-full">
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

  // If title is provided, wrap in Card
  if (title || description || headerActions || onRefresh) {
    return (
      <Card>
        {(title || description || headerActions || onRefresh) && (
          <CardHeader>
            <div className="flex items-center justify-between">
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
          </CardHeader>
        )}
        <CardContent className="p-0">{tableContent}</CardContent>
      </Card>
    );
  }

  // Return bare table without Card wrapper
  return tableContent;
}
