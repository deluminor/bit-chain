export interface TransactionRowData {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string | null;
  date: string;
  currency: string;
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
  /** Amount received in the destination account (cross-currency transfers). */
  transferAmount?: string;
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
