export interface AccountSummary {
  name: string;
  type: string;
  currency: string;
  balance: number;
  balanceBase: number;
  isActive: boolean;
  periodIncome: number;
  periodExpenses: number;
  periodTransfers: number;
  transactionCount: number;
}

export interface CategorySummaryItem {
  name: string;
  total: number;
  count: number;
  percentage: number;
  parent?: string;
}

export interface TrendPoint {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

export interface BudgetSummary {
  name: string;
  period: string;
  currency: string;
  totalPlanned: number;
  totalActual: number;
  variance: number;
  adherencePercent: number;
  categories: Array<{ name: string; planned: number; actual: number }>;
}

export interface LoanSummary {
  name: string;
  type: string;
  totalAmount: number;
  paidAmount: number;
  remaining: number;
  currency: string;
  progressPercent: number;
  interestRate: number | null;
  dueDate: string | null;
  lender: string | null;
  notes: string | null;
}

export interface GoalSummary {
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  currency: string;
  deadline: string | null;
  isCompleted: boolean;
}

export interface TransactionItem {
  date: string;
  type: string;
  amount: number;
  currency: string;
  amountBase: number;
  description: string;
  categoryName: string;
  categoryType: string;
  accountName: string;
  accountType: string;
  tags: string[];
  transferTo: string | null;
  transferAmount: number | null;
  transferCurrency: string | null;
}

export interface ComprehensiveReport {
  metadata: {
    generatedAt: string;
    period: { from: string | null; to: string | null; label: string };
    baseCurrency: string;
    transactionCount: number;
    daysInPeriod: number;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalTransfers: number;
    netSavings: number;
    savingsRate: number;
    averageDailySpending: number;
    transactionCounts: { income: number; expense: number; transfer: number };
  };
  accounts: AccountSummary[];
  categoryBreakdown: {
    expenses: CategorySummaryItem[];
    income: CategorySummaryItem[];
  };
  topSpendingCategories: Array<{ name: string; total: number; percentage: number }>;
  trends: {
    daily: TrendPoint[];
    monthly: TrendPoint[];
  };
  budgets: BudgetSummary[];
  loans: LoanSummary[];
  goals: GoalSummary[];
  transactions: TransactionItem[];
}

export type ComprehensiveReportFormat = 'json' | 'markdown';

export interface ComprehensiveReportDocument {
  content: string;
  contentType: string;
  fileName: string;
}

export class ComprehensiveReportServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ComprehensiveReportServiceError';
    this.status = status;
  }
}
