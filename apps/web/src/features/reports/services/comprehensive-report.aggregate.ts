import { BASE_CURRENCY, convertToBaseCurrencySafe } from '@/lib/currency';
import { differenceInDays, format } from 'date-fns';
import type { ComprehensiveReportRawData } from './comprehensive-report.data';
import {
  buildAccountSummaries,
  buildBudgetSummaries,
  buildGoalSummaries,
  buildLoanSummaries,
  buildTransactionItems,
} from './comprehensive-report.sections';
import type {
  CategorySummaryItem,
  ComprehensiveReport,
  TrendPoint,
} from './comprehensive-report.types';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function buildComprehensiveReport(
  data: ComprehensiveReportRawData,
  dateFrom?: string,
  dateTo?: string,
): Promise<ComprehensiveReport> {
  const transactions = await Promise.all(
    data.transactions.map(async transaction => ({
      ...transaction,
      amountBase: await convertToBaseCurrencySafe(transaction.amount, transaction.currency),
    })),
  );

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalTransfers = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let transferCount = 0;

  const expenseCategoryMap = new Map<string, { total: number; count: number; parent?: string }>();
  const incomeCategoryMap = new Map<string, { total: number; count: number }>();
  const dailyMap = new Map<string, { income: number; expenses: number }>();
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  for (const transaction of transactions) {
    if (transaction.type === 'INCOME') {
      totalIncome += transaction.amountBase;
      incomeCount++;
    } else if (transaction.type === 'EXPENSE') {
      totalExpenses += transaction.amountBase;
      expenseCount++;
    } else {
      totalTransfers += transaction.amountBase;
      transferCount++;
    }

    const categoryName = transaction.category?.name ?? 'Uncategorized';

    if (transaction.type === 'EXPENSE') {
      const item = expenseCategoryMap.get(categoryName) ?? { total: 0, count: 0 };
      item.total += transaction.amountBase;
      item.count++;
      item.parent = transaction.category?.parent?.name ?? undefined;
      expenseCategoryMap.set(categoryName, item);
    }

    if (transaction.type === 'INCOME') {
      const item = incomeCategoryMap.get(categoryName) ?? { total: 0, count: 0 };
      item.total += transaction.amountBase;
      item.count++;
      incomeCategoryMap.set(categoryName, item);
    }

    if (transaction.type === 'TRANSFER') {
      continue;
    }

    const dayKey = format(new Date(transaction.date), 'yyyy-MM-dd');
    const monthKey = format(new Date(transaction.date), 'yyyy-MM');
    const daily = dailyMap.get(dayKey) ?? { income: 0, expenses: 0 };
    const monthly = monthlyMap.get(monthKey) ?? { income: 0, expenses: 0 };

    if (transaction.type === 'INCOME') {
      daily.income += transaction.amountBase;
      monthly.income += transaction.amountBase;
    } else {
      daily.expenses += transaction.amountBase;
      monthly.expenses += transaction.amountBase;
    }

    dailyMap.set(dayKey, daily);
    monthlyMap.set(monthKey, monthly);
  }

  const expenseCategories: CategorySummaryItem[] = [...expenseCategoryMap.entries()]
    .map(([name, item]) => ({
      name,
      total: round2(item.total),
      count: item.count,
      percentage: totalExpenses > 0 ? round2((item.total / totalExpenses) * 100) : 0,
      parent: item.parent,
    }))
    .sort((a, b) => b.total - a.total);

  const incomeCategories: CategorySummaryItem[] = [...incomeCategoryMap.entries()]
    .map(([name, item]) => ({
      name,
      total: round2(item.total),
      count: item.count,
      percentage: totalIncome > 0 ? round2((item.total / totalIncome) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const dailyTrends: TrendPoint[] = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, item]) => ({
      date,
      income: round2(item.income),
      expenses: round2(item.expenses),
      net: round2(item.income - item.expenses),
    }));

  const monthlyTrends: TrendPoint[] = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, item]) => ({
      date,
      income: round2(item.income),
      expenses: round2(item.expenses),
      net: round2(item.income - item.expenses),
    }));

  const accounts = await buildAccountSummaries(data.accounts, transactions);
  const budgets = buildBudgetSummaries(data.budgets);
  const loans = buildLoanSummaries(data.loans);
  const goals = buildGoalSummaries(data.goals);
  const transactionItems = buildTransactionItems(transactions);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const periodStart = dateFrom ? new Date(dateFrom) : (transactions[0]?.date ?? new Date());
  const periodEnd = dateTo ? new Date(dateTo) : new Date();
  const daysInPeriod = Math.max(differenceInDays(periodEnd, periodStart), 1);
  const periodLabel =
    dateFrom && dateTo
      ? `${format(new Date(dateFrom), 'MMM dd, yyyy')} — ${format(new Date(dateTo), 'MMM dd, yyyy')}`
      : 'All Time';

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      period: { from: dateFrom ?? null, to: dateTo ?? null, label: periodLabel },
      baseCurrency: BASE_CURRENCY,
      transactionCount: data.transactions.length,
      daysInPeriod,
    },
    summary: {
      totalIncome: round2(totalIncome),
      totalExpenses: round2(totalExpenses),
      totalTransfers: round2(totalTransfers),
      netSavings: round2(netSavings),
      savingsRate: round2(savingsRate),
      averageDailySpending: round2(totalExpenses / daysInPeriod),
      transactionCounts: { income: incomeCount, expense: expenseCount, transfer: transferCount },
    },
    accounts,
    categoryBreakdown: { expenses: expenseCategories, income: incomeCategories },
    topSpendingCategories: expenseCategories.slice(0, 10).map(category => ({
      name: category.name,
      total: category.total,
      percentage: category.percentage,
    })),
    trends: { daily: dailyTrends, monthly: monthlyTrends },
    budgets,
    loans,
    goals,
    transactions: transactionItems,
  };
}
