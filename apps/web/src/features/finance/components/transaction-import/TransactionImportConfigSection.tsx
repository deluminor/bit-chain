import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import type { TransactionCategory } from '@/features/finance/queries/transactions';

interface TransactionImportConfigSectionProps {
  accounts: FinanceAccount[];
  incomeCategories: TransactionCategory[];
  expenseCategories: TransactionCategory[];
  accountId: string;
  incomeCategoryId: string;
  expenseCategoryId: string;
  onAccountChange: (value: string) => void;
  onIncomeCategoryChange: (value: string) => void;
  onExpenseCategoryChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onPreview: () => void;
  canPreview: boolean;
  isPreviewPending: boolean;
}

export function TransactionImportConfigSection({
  accounts,
  incomeCategories,
  expenseCategories,
  accountId,
  incomeCategoryId,
  expenseCategoryId,
  onAccountChange,
  onIncomeCategoryChange,
  onExpenseCategoryChange,
  onFileChange,
  onPreview,
  canPreview,
  isPreviewPending,
}: TransactionImportConfigSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Account *</Label>
          <Select value={accountId} onValueChange={onAccountChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Default Income Category *</Label>
          <Select value={incomeCategoryId} onValueChange={onIncomeCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select income category" />
            </SelectTrigger>
            <SelectContent>
              {incomeCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Default Expense Category *</Label>
          <Select value={expenseCategoryId} onValueChange={onExpenseCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select expense category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <Label>CSV File *</Label>
          <Input
            type="file"
            accept=".csv,text/csv"
            onChange={event => onFileChange(event.target.files?.[0] ?? null)}
          />
        </div>
        <Button onClick={onPreview} disabled={!canPreview || isPreviewPending}>
          {isPreviewPending ? 'Parsing...' : 'Preview CSV'}
        </Button>
      </div>
    </>
  );
}
