import { Loan } from '@/features/finance/queries/loans';

export const loanTypeLabels = {
  LOAN: 'Loan',
  DEBT: 'Debt',
} as const;

export const loanTypeBadge = {
  LOAN: 'bg-rose-100 text-rose-700',
  DEBT: 'bg-emerald-100 text-emerald-700',
} as const;

export function getLoanStatus(loan: Loan): { label: string; className: string } {
  const isPaid = loan.paidAmount >= loan.totalAmount;

  if (isPaid) {
    return { label: 'Paid', className: 'bg-emerald-100 text-emerald-700' };
  }

  if (loan.dueDate) {
    const due = new Date(loan.dueDate);
    if (due.getTime() < Date.now()) {
      return { label: 'Overdue', className: 'bg-rose-100 text-rose-700' };
    }
  }

  return { label: 'Active', className: 'bg-blue-100 text-blue-700' };
}

export function sortLoansByDueDate(loans: Loan[]): Loan[] {
  return [...loans].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function getNearestDueDate(loans: Loan[]): Date | undefined {
  return loans
    .filter(loan => loan.paidAmount < loan.totalAmount && loan.dueDate)
    .map(loan => new Date(loan.dueDate as string))
    .sort((a, b) => a.getTime() - b.getTime())[0];
}
