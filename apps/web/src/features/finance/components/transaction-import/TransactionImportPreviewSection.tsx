import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TransactionCategory } from '@/features/finance/queries/transactions';
import { Trash2 } from 'lucide-react';
import {
  EditableImportRow,
  formatDateTimeInput,
  parseDateTimeInput,
} from './transaction-import.types';

interface TransactionImportPreviewSectionProps {
  rows: EditableImportRow[];
  sourceLabel: string | null;
  skippedCount: number;
  totalRows: number;
  duplicates: number;
  incomeCategories: TransactionCategory[];
  expenseCategories: TransactionCategory[];
  onRowUpdate: (id: string, updates: Partial<EditableImportRow>) => void;
  onRowTypeChange: (id: string, type: 'INCOME' | 'EXPENSE') => void;
  onRowRemove: (id: string) => void;
}

export function TransactionImportPreviewSection({
  rows,
  sourceLabel,
  skippedCount,
  totalRows,
  duplicates,
  incomeCategories,
  expenseCategories,
  onRowUpdate,
  onRowTypeChange,
  onRowRemove,
}: TransactionImportPreviewSectionProps) {
  if (!rows.length && !totalRows) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Separator />
      <div className="flex flex-wrap items-center gap-3">
        {sourceLabel && <Badge variant="secondary">Source: {sourceLabel}</Badge>}
        <Badge variant="outline">Rows: {totalRows || rows.length}</Badge>
        <Badge variant="outline">Duplicates: {duplicates}</Badge>
        {skippedCount > 0 && <Badge variant="outline">Skipped: {skippedCount}</Badge>}
      </div>

      <div className="max-h-[380px] overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Import</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[120px] text-right">Amount</TableHead>
              <TableHead className="w-[90px]">Currency</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => {
              const categoryOptions = row.type === 'INCOME' ? incomeCategories : expenseCategories;

              return (
                <TableRow key={row.id} className={row.duplicate ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={row.include}
                      disabled={row.duplicate}
                      onCheckedChange={checked =>
                        onRowUpdate(row.id, { include: Boolean(checked) })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeInput(row.date)}
                      onChange={event => {
                        const nextValue = parseDateTimeInput(event.target.value);
                        if (nextValue) {
                          onRowUpdate(row.id, { date: nextValue });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Input
                        value={row.description}
                        onChange={event => onRowUpdate(row.id, { description: event.target.value })}
                      />
                      {row.duplicate && <Badge variant="destructive">Duplicate</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.type}
                      onValueChange={value =>
                        onRowTypeChange(row.id, value as 'INCOME' | 'EXPENSE')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.categoryId}
                      onValueChange={value => onRowUpdate(row.id, { categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.amount}
                      onChange={event =>
                        onRowUpdate(row.id, {
                          amount: Number.parseFloat(event.target.value) || 0,
                        })
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.currency}
                      onChange={event =>
                        onRowUpdate(row.id, { currency: event.target.value.toUpperCase() })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onRowRemove(row.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
