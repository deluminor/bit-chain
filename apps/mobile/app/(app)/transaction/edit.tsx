import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TransactionForm } from '~/src/components/transaction/TransactionForm';
import { ErrorScreen, LoadingScreen } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from '~/src/hooks/useTransactions';

export default function EditTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // If we have an ID, try to find it in the cached transactions list.
  // Note: For a robust app, you might want a specific 'GET /transactions/:id' or
  // ensure the list cache is fully populated.
  const { data: transactionsData, isLoading } = useTransactions({});
  const { mutate: createTx, isPending: isCreating } = useCreateTransaction();
  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: deleteTx, isPending: isDeleting } = useDeleteTransaction();

  const isEditing = !!id;
  const isSubmitting = isCreating || isUpdating || isDeleting;

  const existingTransaction = useMemo(() => {
    if (!id || !transactionsData) return null;
    return transactionsData.transactions.find(t => t.id === id);
  }, [id, transactionsData]);

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
        transferToId: '', // Transfer-to ID mapping might need backend support or special handling if you edit transfers
        description: existingTransaction.description || '',
        date: new Date(existingTransaction.date),
      }
    : undefined;

  const handleSubmit = (values: any) => {
    if (isEditing) {
      updateTx(values, {
        onSuccess: () => {
          router.back();
        },
        onError: error => {
          Alert.alert('Update Failed', error.message);
        },
      });
    } else {
      createTx(values, {
        onSuccess: () => {
          router.back();
        },
        onError: error => {
          Alert.alert('Creation Failed', error.message);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!id) return;
    deleteTx(id, {
      onSuccess: () => {
        router.back();
      },
      onError: (error: any) => {
        Alert.alert('Deletion Failed', error.message);
      },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
});
