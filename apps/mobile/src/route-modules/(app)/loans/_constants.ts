export const CURRENCIES = ['UAH', 'EUR', 'USD', 'HUF'] as const;

export const LOAN_TYPES = [
  { key: 'LOAN', label: 'Loan', desc: 'Money you lent' },
  { key: 'DEBT', label: 'Debt', desc: 'Money you owe' },
] as const;

export const DEFAULT_LOAN_FORM = {
  name: '',
  type: 'DEBT' as 'LOAN' | 'DEBT',
  totalAmount: '',
  currency: 'UAH',
  paidAmount: '',
  dueDate: '',
  lender: '',
  notes: '',
  interestRate: '',
};
