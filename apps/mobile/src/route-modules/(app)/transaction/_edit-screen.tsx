import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, View } from 'react-native';
import { TransactionForm } from '~/src/components/transaction/TransactionForm';
import type { TransactionSubmitPayload } from '~/src/components/transaction/_types';
import { ErrorScreen, LoadingScreen } from '~/src/components/ui';
import {
  type CreateTransactionPayload,
  type UpdateTransactionPayload,
  useCreateTransaction,
  useDeleteTransaction,
  useTransactionById,
  useUpdateTransaction,
} from '~/src/hooks/useTransactions';
import { styles } from './_styles';

export default function EditTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: transactionById, isLoading } = useTransactionById(id);
  const { mutate: createTx, isPending: isCreating } = useCreateTransaction();
  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: deleteTx, isPending: isDeleting } = useDeleteTransaction();

  const isEditing = Boolean(id);
  const isSubmitting = isCreating || isUpdating || isDeleting;

  const existingTransaction = useMemo(() => {
    if (!id || !transactionById) return null;
    return transactionById;
  }, [id, transactionById]);

  if (isEditing && isLoading) {
    return <LoadingScreen label="Loading transaction..." />;
  }

  if (isEditing && !existingTransaction) {
    return (
      <ErrorScreen
        message="Transaction not found or could not be loaded."
        onRetry={() => router.back()}
      />
    );
  }

  const initialValues = existingTransaction
    ? {
        id: existingTransaction.id,
        type: existingTransaction.type,
        amount: existingTransaction.amount.toString(),
        accountId: existingTransaction.accountId,
        categoryId: existingTransaction.categoryId || '',
        transferToId: existingTransaction.transferToId || '',
        transferAmount:
          typeof existingTransaction.transferAmount === 'number'
            ? existingTransaction.transferAmount.toString()
            : '',
        description: existingTransaction.description || '',
        date: new Date(existingTransaction.date),
      }
    : undefined;

  const handleSubmit = (values: TransactionSubmitPayload) => {
    if (isEditing) {
      if (!values.id) {
        Alert.alert('Update Failed', 'Transaction ID is missing.');
        return;
      }

      const updatePayload: UpdateTransactionPayload = {
        ...values,
        id: values.id,
      };

      updateTx(updatePayload, {
        onSuccess: () => router.back(),
        onError: error => Alert.alert('Update Failed', error.message),
      });
      return;
    }

    const createPayload: CreateTransactionPayload = {
      type: values.type,
      amount: values.amount,
      accountId: values.accountId,
      categoryId: values.categoryId,
      transferToId: values.transferToId,
      transferAmount: values.transferAmount,
      transferCurrency: values.transferCurrency,
      description: values.description,
      date: values.date,
    };

    createTx(createPayload, {
      onSuccess: () => router.back(),
      onError: error => Alert.alert('Creation Failed', error.message),
    });
  };

  const handleDelete = () => {
    if (!id) return;
    deleteTx(id, {
      onSuccess: () => router.back(),
      onError: error => Alert.alert('Deletion Failed', error.message),
    });
  };

  return (
    <View style={styles.container}>
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditing ? 'Save Changes' : 'Add Transaction'}
        onDelete={isEditing ? handleDelete : undefined}
        isDeleting={isDeleting}
      />
    </View>
  );
}
