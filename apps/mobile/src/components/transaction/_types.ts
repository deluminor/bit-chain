export interface TransactionRowData {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string | null;
  date: string;
  currency: string;
  amountInAccountCurrency?: number | null;
  accountCurrency?: string;
  accountName: string;
  categoryName: string | null;
  categoryColor?: string | null;
}

export interface TransactionRowProps {
  transaction: TransactionRowData;
  hideDate?: boolean;
}

export type TransactionFormValues = {
  id?: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: string;
  accountId: string;
  categoryId: string;
  transferToId: string;
  transferAmount?: string;
  loanId?: string;
  description: string;
  date: Date;
};

export interface TransactionSubmitPayload {
  id?: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  accountId: string;
  categoryId?: string;
  transferToId?: string;
  transferAmount?: number;
  transferCurrency?: string;
  loanId?: string | null;
  description?: string;
  date?: Date;
}

export interface TransactionFormProps {
  initialValues?: Partial<TransactionFormValues>;
  onSubmit: (values: TransactionSubmitPayload) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}
