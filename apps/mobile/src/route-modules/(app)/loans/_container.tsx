import { LoanCard, LoanForm } from '@/route-modules/(app)/loans/_components';
import { DEFAULT_LOAN_FORM } from '@/route-modules/(app)/loans/_constants';
import { styles } from '@/route-modules/(app)/loans/_styles';
import type { LoanItem } from '@bit-chain/api-contracts';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorScreen, LoadingScreen, SummaryCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useCreateLoan, useDeleteLoan, useLoans, useUpdateLoan } from '~/src/hooks/useLoans';
import { formatCurrency } from '~/src/utils/format';

export default function LoansScreen() {
  const [showPaid, setShowPaid] = useState(false);
  const { data, isLoading, isRefetching, error, refetch } = useLoans(showPaid);
  const { mutateAsync: createLoan, isPending: isCreating } = useCreateLoan();
  const { mutateAsync: updateLoan, isPending: isUpdating } = useUpdateLoan();
  const { mutateAsync: deleteLoan } = useDeleteLoan();

  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanItem | null>(null);

  const loans = data?.loans ?? [];
  const summary = data?.summary;

  const handleOpenCreate = () => {
    setEditingLoan(null);
    setShowForm(true);
  };

  const handleEdit = (loan: LoanItem) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Are you sure you want to delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteLoan(id);
          } catch {
            Alert.alert('Error', 'Failed to delete record');
          }
        },
      },
    ]);
  };

  const handleRepay = (loan: LoanItem) => {
    const remaining = loan.totalAmount - loan.paidAmount;
    Alert.prompt(
      'Record Payment',
      `Remaining: ${formatCurrency(remaining, loan.currency)}\nEnter payment amount:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async (value?: string) => {
            const amount = parseFloat(value ?? '0');
            if (!amount || isNaN(amount) || amount <= 0) return;
            try {
              await updateLoan({
                id: loan.id,
                paidAmount: Math.min(loan.paidAmount + amount, loan.totalAmount),
              });
            } catch {
              Alert.alert('Error', 'Failed to record payment');
            }
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad',
    );
  };

  const handleSubmit = async (form: typeof DEFAULT_LOAN_FORM) => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    const totalAmount = parseFloat(form.totalAmount);
    if (!totalAmount || totalAmount <= 0) {
      Alert.alert('Validation', 'Total amount must be greater than 0');
      return;
    }

    try {
      if (editingLoan) {
        await updateLoan({
          id: editingLoan.id,
          name: form.name.trim(),
          totalAmount,
          currency: form.currency,
          paidAmount: parseFloat(form.paidAmount) || 0,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
          lender: form.lender.trim() || undefined,
          notes: form.notes.trim() || undefined,
          interestRate: form.interestRate ? parseFloat(form.interestRate) : undefined,
        });
      } else {
        await createLoan({
          name: form.name.trim(),
          type: form.type,
          totalAmount,
          currency: form.currency,
          paidAmount: parseFloat(form.paidAmount) || 0,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
          lender: form.lender.trim() || undefined,
          notes: form.notes.trim() || undefined,
          interestRate: form.interestRate ? parseFloat(form.interestRate) : undefined,
        });
      }
      setShowForm(false);
    } catch {
      Alert.alert('Error', 'Failed to save record');
    }
  };

  if (isLoading) return <LoadingScreen label="Loading loans…" />;
  if (error) {
    return (
      <ErrorScreen
        message={error instanceof Error ? error.message : 'Failed to load'}
        onRetry={refetch}
      />
    );
  }

  const nextDue = loans
    .filter(l => l.dueDate && l.paidAmount < l.totalAmount)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View
              style={[
                styles.headerTitleWrap,
                Platform.OS !== 'ios' && styles.headerTitleWrapAndroid,
              ]}
            >
              <Text style={styles.headerTitleText}>Loans & Debts</Text>
              <Text style={styles.headerSubtitleText}>{loans.length} records</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Paid</Text>
                <Switch
                  value={showPaid}
                  onValueChange={setShowPaid}
                  trackColor={{ true: colors.brand, false: colors.bgMuted }}
                  thumbColor={colors.white}
                />
              </View>
              <Pressable
                style={[styles.headerBtn, isRefetching && { opacity: 0.5 }]}
                onPress={() => refetch()}
                disabled={isRefetching}
                hitSlop={8}
              >
                {isRefetching ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <Text style={styles.headerIcon}>↻</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.headerBtn, styles.headerBtnPrimary]}
                onPress={handleOpenCreate}
                hitSlop={8}
              >
                <Text style={[styles.headerIcon, styles.headerIconPrimary]}>+</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {summary && (
          <SummaryCard
            metrics={[
              { label: 'Active', value: String(summary.active), private: false },
              {
                label: 'Loans',
                value: String(summary.loanCount),
                valueColor: colors.income,
                private: false,
              },
              {
                label: 'Debts',
                value: String(summary.debtCount),
                valueColor: colors.expense,
                private: false,
              },
            ]}
          />
        )}

        {nextDue && (
          <View style={styles.nextDueCard}>
            <Text style={styles.nextDueLabel}>Next due</Text>
            <Text style={styles.nextDueName} numberOfLines={1}>
              {nextDue.name}
            </Text>
            <Text style={styles.nextDueDate}>
              {new Date(nextDue.dueDate!).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        )}

        {loans.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyTitle}>No records</Text>
            <Text style={styles.emptyText}>Track your loans and debts</Text>
            <Pressable style={styles.emptyBtn} onPress={handleOpenCreate}>
              <Text style={styles.emptyBtnText}>+ Add Record</Text>
            </Pressable>
          </View>
        ) : (
          loans.map(loan => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRepay={handleRepay}
            />
          ))
        )}
      </ScrollView>

      <LoanForm
        visible={showForm}
        initial={editingLoan}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />
    </SafeAreaView>
  );
}
