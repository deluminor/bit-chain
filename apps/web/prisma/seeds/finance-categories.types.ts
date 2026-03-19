export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface DefaultCategoryData {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault: boolean;
  isLoanRepayment?: boolean;
  children?: Omit<DefaultCategoryData, 'children'>[];
}
