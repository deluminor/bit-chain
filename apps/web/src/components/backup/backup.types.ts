export interface BackupFile {
  filename: string;
  metadata?: {
    version: string;
    timestamp: string;
    totalRecords: number;
  };
  recordCounts?: {
    users: number;
    categories: number;
    trades: number;
    screenshots: number;
    financeAccounts: number;
    transactions: number;
    transactionCategories: number;
    budgets: number;
    budgetCategories: number;
    financialGoals: number;
    loans: number;
  };
}
