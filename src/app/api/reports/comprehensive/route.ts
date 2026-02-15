import { authOptions } from '@/features/auth/libs/auth';
import { BASE_CURRENCY, convertToBaseCurrencySafe } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import { differenceInDays, format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AccountSummary {
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

interface CategorySummaryItem {
  name: string;
  total: number;
  count: number;
  percentage: number;
  parent?: string;
}

interface TrendPoint {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

interface BudgetSummary {
  name: string;
  period: string;
  currency: string;
  totalPlanned: number;
  totalActual: number;
  variance: number;
  adherencePercent: number;
  categories: Array<{ name: string; planned: number; actual: number }>;
}

interface LoanSummary {
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

interface GoalSummary {
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  currency: string;
  deadline: string | null;
  isCompleted: boolean;
}

interface TransactionItem {
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
  isRecurring: boolean;
  recurringPattern: string | null;
  transferTo: string | null;
  transferAmount: number | null;
  transferCurrency: string | null;
}

interface ComprehensiveReport {
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function findOrCreateUser(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email, password: 'nextauth_user' },
    });
  }

  return user;
}

function buildDateFilter(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) return undefined;

  const filter: { gte?: Date; lte?: Date } = {};
  if (dateFrom) filter.gte = new Date(dateFrom);
  if (dateTo) filter.lte = new Date(dateTo);
  return filter;
}

function buildBudgetDateFilter(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) return {};

  const filter: Record<string, unknown> = {};
  if (dateTo) filter.startDate = { lte: new Date(dateTo) };
  if (dateFrom) filter.endDate = { gte: new Date(dateFrom) };
  return filter;
}

// ─── Data Aggregation ────────────────────────────────────────────────────────

async function aggregateReport(
  userId: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<ComprehensiveReport> {
  const dateFilter = buildDateFilter(dateFrom, dateTo);
  const budgetDateFilter = buildBudgetDateFilter(dateFrom, dateTo);

  // Parallel data fetching
  const [transactions, accounts, _categories, budgets, loans, goals] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        isDemo: false,
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
        description: true,
        date: true,
        tags: true,
        isRecurring: true,
        recurringPattern: true,
        transferAmount: true,
        transferCurrency: true,
        account: { select: { id: true, name: true, type: true, currency: true } },
        category: {
          select: { id: true, name: true, type: true, parent: { select: { name: true } } },
        },
        transferTo: { select: { id: true, name: true, currency: true } },
      },
      orderBy: { date: 'asc' },
    }),

    prisma.financeAccount.findMany({
      where: { userId, isDemo: false },
      select: {
        id: true,
        name: true,
        type: true,
        currency: true,
        balance: true,
        isActive: true,
      },
    }),

    prisma.transactionCategory.findMany({
      where: { userId, isActive: true, isDemo: false },
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
        parent: { select: { name: true } },
      },
    }),

    prisma.budget.findMany({
      where: { userId, isDemo: false, isTemplate: false, ...budgetDateFilter },
      include: {
        categories: {
          include: {
            category: { select: { name: true, type: true } },
          },
        },
      },
    }),

    prisma.loan.findMany({ where: { userId } }),

    prisma.financialGoal.findMany({ where: { userId, isDemo: false } }),
  ]);

  // ─── Convert and aggregate ───

  // Convert all transaction amounts to base currency
  const txWithBase = await Promise.all(
    transactions.map(async tx => ({
      ...tx,
      amountBase: await convertToBaseCurrencySafe(tx.amount, tx.currency),
    })),
  );

  // Summary totals
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalTransfers = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let transferCount = 0;

  for (const tx of txWithBase) {
    switch (tx.type) {
      case 'INCOME':
        totalIncome += tx.amountBase;
        incomeCount++;
        break;
      case 'EXPENSE':
        totalExpenses += tx.amountBase;
        expenseCount++;
        break;
      case 'TRANSFER':
        totalTransfers += tx.amountBase;
        transferCount++;
        break;
    }
  }

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Days in period
  const periodStart = dateFrom ? new Date(dateFrom) : (txWithBase[0]?.date ?? new Date());
  const periodEnd = dateTo ? new Date(dateTo) : new Date();
  const daysInPeriod = Math.max(differenceInDays(periodEnd, periodStart), 1);
  const averageDailySpending = totalExpenses / daysInPeriod;

  // ─── Category breakdown ───

  const expenseCategoryMap = new Map<string, { total: number; count: number; parent?: string }>();
  const incomeCategoryMap = new Map<string, { total: number; count: number }>();

  for (const tx of txWithBase) {
    const catName = tx.category?.name ?? 'Uncategorized';

    if (tx.type === 'EXPENSE') {
      const existing = expenseCategoryMap.get(catName) ?? { total: 0, count: 0 };
      existing.total += tx.amountBase;
      existing.count++;
      existing.parent = tx.category?.parent?.name ?? undefined;
      expenseCategoryMap.set(catName, existing);
    } else if (tx.type === 'INCOME') {
      const existing = incomeCategoryMap.get(catName) ?? { total: 0, count: 0 };
      existing.total += tx.amountBase;
      existing.count++;
      incomeCategoryMap.set(catName, existing);
    }
  }

  const expenseCategories: CategorySummaryItem[] = Array.from(expenseCategoryMap.entries())
    .map(([name, data]) => ({
      name,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
      percentage: totalExpenses > 0 ? Math.round((data.total / totalExpenses) * 10000) / 100 : 0,
      parent: data.parent,
    }))
    .sort((a, b) => b.total - a.total);

  const incomeCategories: CategorySummaryItem[] = Array.from(incomeCategoryMap.entries())
    .map(([name, data]) => ({
      name,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
      percentage: totalIncome > 0 ? Math.round((data.total / totalIncome) * 10000) / 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const topSpendingCategories = expenseCategories.slice(0, 10).map(c => ({
    name: c.name,
    total: c.total,
    percentage: c.percentage,
  }));

  // ─── Trends ───

  const dailyMap = new Map<string, { income: number; expenses: number }>();
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  for (const tx of txWithBase) {
    if (tx.type === 'TRANSFER') continue;

    const dayKey = format(new Date(tx.date), 'yyyy-MM-dd');
    const monthKey = format(new Date(tx.date), 'yyyy-MM');

    // Daily
    const dailyEntry = dailyMap.get(dayKey) ?? { income: 0, expenses: 0 };
    if (tx.type === 'INCOME') dailyEntry.income += tx.amountBase;
    if (tx.type === 'EXPENSE') dailyEntry.expenses += tx.amountBase;
    dailyMap.set(dayKey, dailyEntry);

    // Monthly
    const monthlyEntry = monthlyMap.get(monthKey) ?? { income: 0, expenses: 0 };
    if (tx.type === 'INCOME') monthlyEntry.income += tx.amountBase;
    if (tx.type === 'EXPENSE') monthlyEntry.expenses += tx.amountBase;
    monthlyMap.set(monthKey, monthlyEntry);
  }

  const dailyTrends: TrendPoint[] = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      income: Math.round(data.income * 100) / 100,
      expenses: Math.round(data.expenses * 100) / 100,
      net: Math.round((data.income - data.expenses) * 100) / 100,
    }));

  const monthlyTrends: TrendPoint[] = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      income: Math.round(data.income * 100) / 100,
      expenses: Math.round(data.expenses * 100) / 100,
      net: Math.round((data.income - data.expenses) * 100) / 100,
    }));

  // ─── Account summaries ───

  const accountSummaries: AccountSummary[] = await Promise.all(
    accounts.map(async acc => {
      let periodIncome = 0;
      let periodExpenses = 0;
      let periodTransfers = 0;
      let txCount = 0;

      for (const tx of txWithBase) {
        if (tx.account.id !== acc.id) continue;
        txCount++;
        switch (tx.type) {
          case 'INCOME':
            periodIncome += tx.amountBase;
            break;
          case 'EXPENSE':
            periodExpenses += tx.amountBase;
            break;
          case 'TRANSFER':
            periodTransfers += tx.amountBase;
            break;
        }
      }

      return {
        name: acc.name,
        type: acc.type,
        currency: acc.currency,
        balance: acc.balance,
        balanceBase: await convertToBaseCurrencySafe(acc.balance, acc.currency),
        isActive: acc.isActive,
        periodIncome: Math.round(periodIncome * 100) / 100,
        periodExpenses: Math.round(periodExpenses * 100) / 100,
        periodTransfers: Math.round(periodTransfers * 100) / 100,
        transactionCount: txCount,
      };
    }),
  );

  // ─── Budgets ───

  const budgetSummaries: BudgetSummary[] = budgets.map(budget => {
    const cats = budget.categories.map(bc => ({
      name: bc.category.name,
      planned: bc.planned,
      actual: bc.actual,
    }));

    const totalActual = cats.reduce((sum, c) => sum + c.actual, 0);
    const variance = totalActual - budget.totalPlanned;
    const adherencePercent =
      budget.totalPlanned > 0
        ? Math.round(((budget.totalPlanned - totalActual) / budget.totalPlanned) * 10000) / 100
        : 0;

    return {
      name: budget.name,
      period: budget.period,
      currency: budget.currency,
      totalPlanned: budget.totalPlanned,
      totalActual,
      variance: Math.round(variance * 100) / 100,
      adherencePercent,
      categories: cats,
    };
  });

  // ─── Loans ───

  const loanSummaries: LoanSummary[] = loans.map(loan => ({
    name: loan.name,
    type: loan.type,
    totalAmount: loan.totalAmount,
    paidAmount: loan.paidAmount,
    remaining: Math.max(loan.totalAmount - loan.paidAmount, 0),
    currency: loan.currency,
    progressPercent:
      loan.totalAmount > 0 ? Math.round((loan.paidAmount / loan.totalAmount) * 10000) / 100 : 0,
    interestRate: loan.interestRate,
    dueDate: loan.dueDate ? format(new Date(loan.dueDate), 'yyyy-MM-dd') : null,
    lender: loan.lender,
    notes: loan.notes,
  }));

  // ─── Goals ───

  const goalSummaries: GoalSummary[] = goals.map(goal => ({
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    progressPercent:
      goal.targetAmount > 0
        ? Math.round((goal.currentAmount / goal.targetAmount) * 10000) / 100
        : 0,
    currency: goal.currency,
    deadline: goal.deadline ? format(new Date(goal.deadline), 'yyyy-MM-dd') : null,
    isCompleted: goal.isCompleted,
  }));

  // ─── Transaction items ───

  const transactionItems: TransactionItem[] = txWithBase.map(tx => ({
    date: format(new Date(tx.date), 'yyyy-MM-dd'),
    type: tx.type,
    amount: tx.amount,
    currency: tx.currency,
    amountBase: Math.round(tx.amountBase * 100) / 100,
    description: tx.description ?? '',
    categoryName: tx.category?.name ?? 'Uncategorized',
    categoryType: tx.category?.type ?? '',
    accountName: tx.account.name,
    accountType: tx.account.type,
    tags: tx.tags,
    isRecurring: tx.isRecurring,
    recurringPattern: tx.recurringPattern,
    transferTo: tx.transferTo?.name ?? null,
    transferAmount: tx.transferAmount,
    transferCurrency: tx.transferCurrency,
  }));

  // ─── Build period label ───

  const periodLabel =
    dateFrom && dateTo
      ? `${format(new Date(dateFrom), 'MMM dd, yyyy')} — ${format(new Date(dateTo), 'MMM dd, yyyy')}`
      : 'All Time';

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      period: {
        from: dateFrom ?? null,
        to: dateTo ?? null,
        label: periodLabel,
      },
      baseCurrency: BASE_CURRENCY,
      transactionCount: transactions.length,
      daysInPeriod,
    },
    summary: {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      totalTransfers: Math.round(totalTransfers * 100) / 100,
      netSavings: Math.round(netSavings * 100) / 100,
      savingsRate: Math.round(savingsRate * 100) / 100,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      transactionCounts: {
        income: incomeCount,
        expense: expenseCount,
        transfer: transferCount,
      },
    },
    accounts: accountSummaries,
    categoryBreakdown: {
      expenses: expenseCategories,
      income: incomeCategories,
    },
    topSpendingCategories,
    trends: {
      daily: dailyTrends,
      monthly: monthlyTrends,
    },
    budgets: budgetSummaries,
    loans: loanSummaries,
    goals: goalSummaries,
    transactions: transactionItems,
  };
}

// ─── Markdown Formatter ──────────────────────────────────────────────────────

function formatReportAsMarkdown(report: ComprehensiveReport): string {
  const {
    metadata,
    summary,
    accounts,
    categoryBreakdown,
    topSpendingCategories,
    trends,
    budgets,
    loans,
    goals,
    transactions,
  } = report;
  const cur = metadata.baseCurrency;

  const lines: string[] = [];

  lines.push(`# Comprehensive Financial Report`);
  lines.push(`**Period:** ${metadata.period.label}`);
  lines.push(`**Generated:** ${metadata.generatedAt}`);
  lines.push(`**Base Currency:** ${cur}`);
  lines.push(`**Total Transactions:** ${metadata.transactionCount}`);
  lines.push(`**Days in Period:** ${metadata.daysInPeriod}`);
  lines.push('');

  // Summary
  lines.push(`## Summary`);
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Income | ${cur} ${summary.totalIncome.toFixed(2)} |`);
  lines.push(`| Total Expenses | ${cur} ${summary.totalExpenses.toFixed(2)} |`);
  lines.push(`| Total Transfers | ${cur} ${summary.totalTransfers.toFixed(2)} |`);
  lines.push(`| Net Savings | ${cur} ${summary.netSavings.toFixed(2)} |`);
  lines.push(`| Savings Rate | ${summary.savingsRate.toFixed(2)}% |`);
  lines.push(`| Avg Daily Spending | ${cur} ${summary.averageDailySpending.toFixed(2)} |`);
  lines.push(`| Income Transactions | ${summary.transactionCounts.income} |`);
  lines.push(`| Expense Transactions | ${summary.transactionCounts.expense} |`);
  lines.push(`| Transfer Transactions | ${summary.transactionCounts.transfer} |`);
  lines.push('');

  // Accounts
  if (accounts.length > 0) {
    lines.push(`## Accounts`);
    lines.push(
      `| Name | Type | Currency | Balance | Balance (${cur}) | Active | Period Income | Period Expenses |`,
    );
    lines.push(
      `|------|------|----------|---------|------------|--------|---------------|-----------------|`,
    );
    for (const acc of accounts) {
      lines.push(
        `| ${acc.name} | ${acc.type} | ${acc.currency} | ${acc.balance.toFixed(2)} | ${acc.balanceBase.toFixed(2)} | ${acc.isActive ? 'Yes' : 'No'} | ${acc.periodIncome.toFixed(2)} | ${acc.periodExpenses.toFixed(2)} |`,
      );
    }
    lines.push('');
  }

  // Top Spending Categories
  if (topSpendingCategories.length > 0) {
    lines.push(`## Top Spending Categories`);
    lines.push(`| # | Category | Amount (${cur}) | % of Total |`);
    lines.push(`|---|----------|------------|------------|`);
    topSpendingCategories.forEach((cat, i) => {
      lines.push(
        `| ${i + 1} | ${cat.name} | ${cat.total.toFixed(2)} | ${cat.percentage.toFixed(1)}% |`,
      );
    });
    lines.push('');
  }

  // Category Breakdown - Expenses
  if (categoryBreakdown.expenses.length > 0) {
    lines.push(`## Expense Categories`);
    lines.push(`| Category | Parent | Amount (${cur}) | Count | % of Total |`);
    lines.push(`|----------|--------|------------|-------|------------|`);
    for (const cat of categoryBreakdown.expenses) {
      lines.push(
        `| ${cat.name} | ${cat.parent ?? '—'} | ${cat.total.toFixed(2)} | ${cat.count} | ${cat.percentage.toFixed(1)}% |`,
      );
    }
    lines.push('');
  }

  // Category Breakdown - Income
  if (categoryBreakdown.income.length > 0) {
    lines.push(`## Income Categories`);
    lines.push(`| Category | Amount (${cur}) | Count | % of Total |`);
    lines.push(`|----------|------------|-------|------------|`);
    for (const cat of categoryBreakdown.income) {
      lines.push(
        `| ${cat.name} | ${cat.total.toFixed(2)} | ${cat.count} | ${cat.percentage.toFixed(1)}% |`,
      );
    }
    lines.push('');
  }

  // Monthly Trends
  if (trends.monthly.length > 0) {
    lines.push(`## Monthly Trends`);
    lines.push(`| Month | Income (${cur}) | Expenses (${cur}) | Net (${cur}) |`);
    lines.push(`|-------|------------|-------------|----------|`);
    for (const t of trends.monthly) {
      lines.push(
        `| ${t.date} | ${t.income.toFixed(2)} | ${t.expenses.toFixed(2)} | ${t.net.toFixed(2)} |`,
      );
    }
    lines.push('');
  }

  // Budgets
  if (budgets.length > 0) {
    lines.push(`## Budgets`);
    for (const budget of budgets) {
      lines.push(`### ${budget.name} (${budget.period})`);
      lines.push(`- **Planned:** ${budget.currency} ${budget.totalPlanned.toFixed(2)}`);
      lines.push(`- **Actual:** ${budget.currency} ${budget.totalActual.toFixed(2)}`);
      lines.push(`- **Variance:** ${budget.currency} ${budget.variance.toFixed(2)}`);
      lines.push(`- **Adherence:** ${budget.adherencePercent.toFixed(1)}%`);

      if (budget.categories.length > 0) {
        lines.push('');
        lines.push(`| Category | Planned | Actual |`);
        lines.push(`|----------|---------|--------|`);
        for (const cat of budget.categories) {
          lines.push(`| ${cat.name} | ${cat.planned.toFixed(2)} | ${cat.actual.toFixed(2)} |`);
        }
      }
      lines.push('');
    }
  }

  // Loans
  if (loans.length > 0) {
    lines.push(`## Loans & Debts`);
    lines.push(
      `| Name | Type | Total | Paid | Remaining | Currency | Progress | Interest | Due Date |`,
    );
    lines.push(
      `|------|------|-------|------|-----------|----------|----------|----------|----------|`,
    );
    for (const loan of loans) {
      lines.push(
        `| ${loan.name} | ${loan.type} | ${loan.totalAmount.toFixed(2)} | ${loan.paidAmount.toFixed(2)} | ${loan.remaining.toFixed(2)} | ${loan.currency} | ${loan.progressPercent.toFixed(1)}% | ${loan.interestRate != null ? loan.interestRate + '%' : '—'} | ${loan.dueDate ?? '—'} |`,
      );
    }
    lines.push('');
  }

  // Goals
  if (goals.length > 0) {
    lines.push(`## Financial Goals`);
    lines.push(`| Name | Target | Current | Progress | Currency | Deadline | Completed |`);
    lines.push(`|------|--------|---------|----------|----------|----------|-----------|`);
    for (const goal of goals) {
      lines.push(
        `| ${goal.name} | ${goal.targetAmount.toFixed(2)} | ${goal.currentAmount.toFixed(2)} | ${goal.progressPercent.toFixed(1)}% | ${goal.currency} | ${goal.deadline ?? '—'} | ${goal.isCompleted ? 'Yes' : 'No'} |`,
      );
    }
    lines.push('');
  }

  // Transactions
  if (transactions.length > 0) {
    lines.push(`## All Transactions (${transactions.length})`);
    lines.push(
      `| Date | Type | Amount | Currency | Amount (${cur}) | Category | Account | Description | Tags |`,
    );
    lines.push(
      `|------|------|--------|----------|------------|----------|---------|-------------|------|`,
    );
    for (const tx of transactions) {
      const tags = tx.tags.length > 0 ? tx.tags.join(', ') : '—';
      const desc = tx.description ? tx.description.replace(/\|/g, '\\|') : '—';
      lines.push(
        `| ${tx.date} | ${tx.type} | ${tx.amount.toFixed(2)} | ${tx.currency} | ${tx.amountBase.toFixed(2)} | ${tx.categoryName} | ${tx.accountName} | ${desc} | ${tags} |`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') ?? undefined;
    const dateTo = searchParams.get('dateTo') ?? undefined;
    const outputFormat = searchParams.get('format') ?? 'json';

    const report = await aggregateReport(user.id, dateFrom, dateTo);

    if (outputFormat === 'markdown') {
      const markdown = formatReportAsMarkdown(report);
      const fileName = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.md`;

      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }

    // JSON format — return as downloadable file
    const jsonContent = JSON.stringify(report, null, 2);
    const fileName = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.json`;

    return new Response(jsonContent, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
