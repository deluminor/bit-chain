import { endOfMonth, endOfQuarter, endOfWeek, endOfYear } from 'date-fns';

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export function resolveEndDate(startDate: Date, period: BudgetPeriod): Date {
  switch (period) {
    case 'WEEKLY':
      return endOfWeek(startDate);
    case 'MONTHLY':
      return endOfMonth(startDate);
    case 'QUARTERLY':
      return endOfQuarter(startDate);
    case 'YEARLY':
      return endOfYear(startDate);
    default:
      return endOfMonth(startDate);
  }
}

export function buildBudgetName(startDate: Date, period: BudgetPeriod): string {
  switch (period) {
    case 'WEEKLY':
      return `Week of ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    case 'MONTHLY':
      return `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Budget`;
    case 'QUARTERLY':
      return `Q${Math.floor(startDate.getMonth() / 3) + 1} ${startDate.getFullYear()} Budget`;
    case 'YEARLY':
      return `${startDate.getFullYear()} Annual Budget`;
    default:
      return '';
  }
}
