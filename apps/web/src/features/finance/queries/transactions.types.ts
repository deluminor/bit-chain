export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency: string;
  amountInAccountCurrency?: number | null;
  description?: string;
  date: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    name: string;
    type: string;
    currency: string;
    color?: string;
    icon?: string;
  };
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
  };
  transferToId?: string;
  transferTo?: {
    id: string;
    name: string;
    type: string;
    currency: string;
  };
  transferAmount?: number;
  transferCurrency?: string;
}

export interface TransactionImportPreviewItem {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  description: string;
  date: string;
  categoryId: string;
  duplicate: boolean;
}

export interface TransactionImportPreviewResponse {
  source: 'REVOLUT' | 'MONOBANK';
  skipped: number;
  summary: {
    total: number;
    duplicates: number;
  };
  items: TransactionImportPreviewItem[];
}

export interface TransactionImportRequestItem {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  description?: string;
  date: string;
  categoryId: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  parentId?: string;
  loanId?: string | null;
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  parent?: {
    id: string;
    name: string;
    color: string;
  };
  children?: TransactionCategory[];
  _count: {
    transactions: number;
    children: number;
  };
}

export interface CreateTransactionData {
  accountId: string;
  categoryId: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
  tags?: string[];
  transferToId?: string;
  transferAmount?: number;
  transferCurrency?: string;
  isRecurring?: boolean;
  recurringPattern?: Transaction['recurringPattern'];
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string;
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionResponse {
  transactions: Transaction[];
  summary: {
    income: number;
    expenses: number;
    transfers: number;
    totalTransactions: number;
    incomeCount: number;
    expenseCount: number;
    transferCount: number;
    maxIncome: number;
    maxExpense: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CategoryFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  includeInactive?: boolean;
  hierarchical?: boolean;
}
