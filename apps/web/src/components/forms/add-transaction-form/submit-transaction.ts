import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import {
  CreateTransactionData,
  Transaction,
  UpdateTransactionData,
} from '@/features/finance/queries/transactions';
import type { UseFormReturn } from 'react-hook-form';

interface ToastPayload {
  title: string;
  description: string;
  variant?: 'destructive';
}

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

interface SubmitTransactionParams {
  data: TransactionFormData;
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  isEditing: boolean;
  transaction?: Transaction;
  createTransaction: (payload: CreateTransactionData) => Promise<unknown>;
  updateTransaction: (payload: UpdateTransactionData) => Promise<unknown>;
  toast: (payload: ToastPayload) => void;
  onSuccess?: () => void;
}

export async function submitTransactionForm({
  data,
  form,
  isEditing,
  transaction,
  createTransaction,
  updateTransaction,
  toast,
  onSuccess,
}: SubmitTransactionParams): Promise<void> {
  if (!data.amount || data.amount <= 0) {
    form.setError('amount', { message: 'Amount is required and must be positive' });
    return;
  }

  if (data.type === 'TRANSFER') {
    if (!data.transferToId) {
      form.setError('transferToId', {
        message: 'Destination account is required for transfers',
      });
      return;
    }
    if (!data.transferAmount || data.transferAmount <= 0) {
      form.setError('transferAmount', {
        message: 'Transfer amount is required and must be positive',
      });
      return;
    }
  }

  const formData = {
    ...data,
    amount: parseFloat(data.amount.toFixed(2)),
    date: data.date instanceof Date ? data.date.toISOString() : new Date(data.date).toISOString(),
    ...(data.type !== 'TRANSFER' && {
      transferToId: undefined,
      transferAmount: undefined,
      transferCurrency: undefined,
    }),
    ...(data.type === 'TRANSFER' &&
      data.transferAmount && {
        transferAmount: parseFloat(data.transferAmount.toFixed(2)),
      }),
  };

  try {
    if (isEditing && transaction) {
      await updateTransaction({ id: transaction.id, ...formData } as UpdateTransactionData);
      toast({ title: 'Success', description: 'Transaction updated successfully' });
    } else {
      await createTransaction(formData as CreateTransactionData);
      toast({ title: 'Success', description: 'Transaction created successfully' });
    }

    onSuccess?.();
  } catch (error: unknown) {
    const responseData =
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object'
        ? (error as { response?: { data?: ApiErrorPayload } }).response?.data
        : undefined;

    toast({
      title: 'Error',
      description: responseData?.error || responseData?.message || 'Something went wrong',
      variant: 'destructive',
    });
  }
}
