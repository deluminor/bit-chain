import { convertToBaseCurrencySafe } from '@/lib/currency';
import { format } from 'date-fns';
import type { ComprehensiveReportRawData } from './comprehensive-report.data';
import type {
  AccountSummary,
  BudgetSummary,
  GoalSummary,
  LoanSummary,
  TransactionItem,
} from './comprehensive-report.types';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function buildAccountSummaries(
  accounts: ComprehensiveReportRawData['accounts'],
  transactions: Array<
    ComprehensiveReportRawData['transactions'][number] & {
      amountBase: number;
    }
  >,
): Promise<AccountSummary[]> {
  return Promise.all(
    accounts.map(async account => {
      let periodIncome = 0;
      let periodExpenses = 0;
      let periodTransfers = 0;
      let transactionCount = 0;

      for (const transaction of transactions) {
        if (transaction.account.id !== account.id) {
          continue;
        }

        transactionCount++;
        if (transaction.type === 'INCOME') {
          periodIncome += transaction.amountBase;
        } else if (transaction.type === 'EXPENSE') {
          periodExpenses += transaction.amountBase;
        } else {
          periodTransfers += transaction.amountBase;
        }
      }

      return {
        name: account.name,
        type: account.type,
        currency: account.currency,
        balance: account.balance,
        balanceBase: await convertToBaseCurrencySafe(account.balance, account.currency),
        isActive: account.isActive,
        periodIncome: round2(periodIncome),
        periodExpenses: round2(periodExpenses),
        periodTransfers: round2(periodTransfers),
        transactionCount,
      };
    }),
  );
}

export function buildBudgetSummaries(
  budgets: ComprehensiveReportRawData['budgets'],
): BudgetSummary[] {
  return budgets.map(budget => {
    const categories = budget.categories.map(item => ({
      name: item.category.name,
      planned: item.planned,
      actual: item.actual,
    }));
    const totalActual = categories.reduce((sum, category) => sum + category.actual, 0);

    return {
      name: budget.name,
      period: budget.period,
      currency: budget.currency,
      totalPlanned: budget.totalPlanned,
      totalActual,
      variance: round2(totalActual - budget.totalPlanned),
      adherencePercent:
        budget.totalPlanned > 0
          ? round2(((budget.totalPlanned - totalActual) / budget.totalPlanned) * 100)
          : 0,
      categories,
    };
  });
}

export function buildLoanSummaries(loans: ComprehensiveReportRawData['loans']): LoanSummary[] {
  return loans.map(loan => ({
    name: loan.name,
    type: loan.type,
    totalAmount: loan.totalAmount,
    paidAmount: loan.paidAmount,
    remaining: Math.max(loan.totalAmount - loan.paidAmount, 0),
    currency: loan.currency,
    progressPercent: loan.totalAmount > 0 ? round2((loan.paidAmount / loan.totalAmount) * 100) : 0,
    interestRate: loan.interestRate,
    dueDate: loan.dueDate ? format(new Date(loan.dueDate), 'yyyy-MM-dd') : null,
    lender: loan.lender,
    notes: loan.notes,
  }));
}

export function buildGoalSummaries(goals: ComprehensiveReportRawData['goals']): GoalSummary[] {
  return goals.map(goal => ({
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    progressPercent:
      goal.targetAmount > 0 ? round2((goal.currentAmount / goal.targetAmount) * 100) : 0,
    currency: goal.currency,
    deadline: goal.deadline ? format(new Date(goal.deadline), 'yyyy-MM-dd') : null,
    isCompleted: goal.isCompleted,
  }));
}

export function buildTransactionItems(
  transactions: Array<
    ComprehensiveReportRawData['transactions'][number] & {
      amountBase: number;
    }
  >,
): TransactionItem[] {
  return transactions.map(transaction => ({
    date: format(new Date(transaction.date), 'yyyy-MM-dd'),
    type: transaction.type,
    amount: transaction.amount,
    currency: transaction.currency,
    amountBase: round2(transaction.amountBase),
    description: transaction.description ?? '',
    categoryName: transaction.category?.name ?? 'Uncategorized',
    categoryType: transaction.category?.type ?? '',
    accountName: transaction.account.name,
    accountType: transaction.account.type,
    tags: transaction.tags,
    isRecurring: transaction.isRecurring,
    recurringPattern: transaction.recurringPattern,
    transferTo: transaction.transferTo?.name ?? null,
    transferAmount: transaction.transferAmount,
    transferCurrency: transaction.transferCurrency,
  }));
}
