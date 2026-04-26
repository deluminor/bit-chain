import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { type Transaction } from '@/features/finance/queries/transactions';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTransactionColumns } from '../config/transaction-columns';

interface TransactionTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  /** Omitted on views where row edit/delete is not available (e.g. embedded list). */
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

export function TransactionTable({
  transactions,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  isLoading = false,
  isFetching = false,
}: TransactionTableProps) {
  const columns = useTransactionColumns();
  const hasRowActions = onEdit != null || onDelete != null;

  return (
    <div className="pb-4 flex flex-col gap-4 justify-between items-start md:items-center overflow-hidden">
      <div className="w-full relative pt-4">
        <TableLoadingBar isLoading={isFetching} className="absolute top-0 left-0 right-0 z-10" />
        <div className="w-full px-4">
          <div className="max-h-[550px] overflow-auto data-table">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="hover:bg-transparent">
                  {columns.map(column => (
                    <TableHead key={column.key} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                  {hasRowActions ? <TableHead className="w-[100px]">Actions</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {columns.map(column => (
                        <TableCell key={`skeleton-${index}-${column.key}`}>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                      ))}
                      {hasRowActions ? (
                        <TableCell>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                {!isLoading &&
                  transactions.length > 0 &&
                  transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      {columns.map(column => (
                        <TableCell key={`${transaction.id}-${column.key}`}>
                          {column.cell(transaction)}
                        </TableCell>
                      ))}
                      {hasRowActions ? (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit != null ? (
                                <DropdownMenuItem onClick={() => onEdit(transaction)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              ) : null}
                              {onDelete != null ? (
                                <DropdownMenuItem
                                  onClick={() => onDelete(transaction)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                {!isLoading && transactions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (hasRowActions ? 1 : 0)}
                      className="h-24 text-center"
                    >
                      No transactions match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {transactions.length > 0 && !isLoading && (
        <div className="pt-4 border-t w-full">
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
