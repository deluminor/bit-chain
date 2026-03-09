import type { ComprehensiveReport } from './comprehensive-report.types';

export function formatComprehensiveReportAsMarkdown(report: ComprehensiveReport): string {
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
  const currency = metadata.baseCurrency;

  const lines: string[] = [];

  lines.push('# Comprehensive Financial Report');
  lines.push(`**Period:** ${metadata.period.label}`);
  lines.push(`**Generated:** ${metadata.generatedAt}`);
  lines.push(`**Base Currency:** ${currency}`);
  lines.push(`**Total Transactions:** ${metadata.transactionCount}`);
  lines.push(`**Days in Period:** ${metadata.daysInPeriod}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Total Income | ${currency} ${summary.totalIncome.toFixed(2)} |`);
  lines.push(`| Total Expenses | ${currency} ${summary.totalExpenses.toFixed(2)} |`);
  lines.push(`| Total Transfers | ${currency} ${summary.totalTransfers.toFixed(2)} |`);
  lines.push(`| Net Savings | ${currency} ${summary.netSavings.toFixed(2)} |`);
  lines.push(`| Savings Rate | ${summary.savingsRate.toFixed(2)}% |`);
  lines.push(`| Avg Daily Spending | ${currency} ${summary.averageDailySpending.toFixed(2)} |`);
  lines.push(`| Income Transactions | ${summary.transactionCounts.income} |`);
  lines.push(`| Expense Transactions | ${summary.transactionCounts.expense} |`);
  lines.push(`| Transfer Transactions | ${summary.transactionCounts.transfer} |`);
  lines.push('');

  if (accounts.length > 0) {
    lines.push('## Accounts');
    lines.push(
      '| Name | Type | Currency | Balance | Balance (Base) | Active | Income | Expenses |',
    );
    lines.push(
      '|------|------|----------|---------|----------------|--------|--------|----------|',
    );
    for (const account of accounts) {
      lines.push(
        `| ${account.name} | ${account.type} | ${account.currency} | ${account.balance.toFixed(2)} | ${account.balanceBase.toFixed(2)} | ${account.isActive ? 'Yes' : 'No'} | ${account.periodIncome.toFixed(2)} | ${account.periodExpenses.toFixed(2)} |`,
      );
    }
    lines.push('');
  }

  if (topSpendingCategories.length > 0) {
    lines.push('## Top Spending Categories');
    lines.push('| # | Category | Amount | % of Total |');
    lines.push('|---|----------|--------|------------|');
    topSpendingCategories.forEach((category, index) => {
      lines.push(
        `| ${index + 1} | ${category.name} | ${category.total.toFixed(2)} | ${category.percentage.toFixed(1)}% |`,
      );
    });
    lines.push('');
  }

  if (categoryBreakdown.expenses.length > 0) {
    lines.push('## Expense Categories');
    lines.push('| Category | Parent | Amount | Count | % of Total |');
    lines.push('|----------|--------|--------|-------|------------|');
    for (const category of categoryBreakdown.expenses) {
      lines.push(
        `| ${category.name} | ${category.parent ?? '—'} | ${category.total.toFixed(2)} | ${category.count} | ${category.percentage.toFixed(1)}% |`,
      );
    }
    lines.push('');
  }

  if (categoryBreakdown.income.length > 0) {
    lines.push('## Income Categories');
    lines.push('| Category | Amount | Count | % of Total |');
    lines.push('|----------|--------|-------|------------|');
    for (const category of categoryBreakdown.income) {
      lines.push(
        `| ${category.name} | ${category.total.toFixed(2)} | ${category.count} | ${category.percentage.toFixed(1)}% |`,
      );
    }
    lines.push('');
  }

  if (trends.monthly.length > 0) {
    lines.push('## Monthly Trends');
    lines.push('| Month | Income | Expenses | Net |');
    lines.push('|-------|--------|----------|-----|');
    for (const trend of trends.monthly) {
      lines.push(
        `| ${trend.date} | ${trend.income.toFixed(2)} | ${trend.expenses.toFixed(2)} | ${trend.net.toFixed(2)} |`,
      );
    }
    lines.push('');
  }

  if (budgets.length > 0) {
    lines.push('## Budgets');
    for (const budget of budgets) {
      lines.push(`### ${budget.name} (${budget.period})`);
      lines.push(`- **Planned:** ${budget.currency} ${budget.totalPlanned.toFixed(2)}`);
      lines.push(`- **Actual:** ${budget.currency} ${budget.totalActual.toFixed(2)}`);
      lines.push(`- **Variance:** ${budget.currency} ${budget.variance.toFixed(2)}`);
      lines.push(`- **Adherence:** ${budget.adherencePercent.toFixed(1)}%`);

      if (budget.categories.length > 0) {
        lines.push('');
        lines.push('| Category | Planned | Actual |');
        lines.push('|----------|---------|--------|');
        for (const category of budget.categories) {
          lines.push(
            `| ${category.name} | ${category.planned.toFixed(2)} | ${category.actual.toFixed(2)} |`,
          );
        }
      }
      lines.push('');
    }
  }

  if (loans.length > 0) {
    lines.push('## Loans & Debts');
    lines.push(
      '| Name | Type | Total | Paid | Remaining | Currency | Progress | Interest | Due Date |',
    );
    lines.push(
      '|------|------|-------|------|-----------|----------|----------|----------|----------|',
    );
    for (const loan of loans) {
      lines.push(
        `| ${loan.name} | ${loan.type} | ${loan.totalAmount.toFixed(2)} | ${loan.paidAmount.toFixed(2)} | ${loan.remaining.toFixed(2)} | ${loan.currency} | ${loan.progressPercent.toFixed(1)}% | ${loan.interestRate != null ? `${loan.interestRate}%` : '—'} | ${loan.dueDate ?? '—'} |`,
      );
    }
    lines.push('');
  }

  if (goals.length > 0) {
    lines.push('## Financial Goals');
    lines.push('| Name | Target | Current | Progress | Currency | Deadline | Completed |');
    lines.push('|------|--------|---------|----------|----------|----------|-----------|');
    for (const goal of goals) {
      lines.push(
        `| ${goal.name} | ${goal.targetAmount.toFixed(2)} | ${goal.currentAmount.toFixed(2)} | ${goal.progressPercent.toFixed(1)}% | ${goal.currency} | ${goal.deadline ?? '—'} | ${goal.isCompleted ? 'Yes' : 'No'} |`,
      );
    }
    lines.push('');
  }

  if (transactions.length > 0) {
    lines.push(`## All Transactions (${transactions.length})`);
    lines.push(
      '| Date | Type | Amount | Currency | Base Amount | Category | Account | Description | Tags |',
    );
    lines.push(
      '|------|------|--------|----------|-------------|----------|---------|-------------|------|',
    );
    for (const transaction of transactions) {
      const tags = transaction.tags.length > 0 ? transaction.tags.join(', ') : '—';
      const description = transaction.description
        ? transaction.description.replace(/\|/g, '\\|')
        : '—';
      lines.push(
        `| ${transaction.date} | ${transaction.type} | ${transaction.amount.toFixed(2)} | ${transaction.currency} | ${transaction.amountBase.toFixed(2)} | ${transaction.categoryName} | ${transaction.accountName} | ${description} | ${tags} |`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}
