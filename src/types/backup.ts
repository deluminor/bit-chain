import { 
  User, 
  Category, 
  Trade, 
  Screenshot,
  FinanceAccount,
  Transaction,
  TransactionCategory,
  Budget,
  BudgetCategory,
  FinancialGoal
} from '@/generated/prisma/index';

export interface BackupData {
  users: User[];
  categories: Category[];
  trades: Trade[];
  screenshots: Screenshot[];
  // Financial data
  financeAccounts: FinanceAccount[];
  transactions: Transaction[];
  transactionCategories: TransactionCategory[];
  budgets: Budget[];
  budgetCategories: BudgetCategory[];
  financialGoals: FinancialGoal[];
  metadata: {
    version: string;
    timestamp: string;
    totalRecords: number;
  };
}

export interface BackupOptions {
  includeScreenshots?: boolean;
  userId?: string;
  format?: 'json' | 'csv';
}

export interface BackupInfo {
  filename: string;
  size: number;
  created: Date;
  version: string;
  totalRecords: number;
}

export interface ImportOptions {
  overwrite?: boolean;
}
