import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionList } from '~/src/components/transaction/TransactionList';
import { ErrorScreen, LoadingScreen, PrivacyAmount } from '~/src/components/ui';
import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';
import { useBudgets } from '~/src/hooks/useBudgets';
import { BASE_CURRENCY } from '~/src/lib/currency';
import { formatCurrency, formatShortDate } from '~/src/utils/format';

export default function BudgetCategoryTransactionsContainer() {
  const router = useRouter();
  const { id: budgetId, categoryId } = useLocalSearchParams<{
    id: string;
    categoryId: string;
  }>();

  const { data, isLoading, error } = useBudgets();
  const budget = data?.budgets.find(item => item.id === budgetId);
  const budgetCategory = budget?.categories.find(cat => cat.categoryId === categoryId);

  const filters = useMemo(
    () =>
      budget && categoryId
        ? {
            categoryId,
            dateFrom: budget.startDate,
            dateTo: budget.endDate,
            type: 'EXPENSE' as const,
          }
        : undefined,
    [budget, categoryId],
  );

  if (isLoading) return <LoadingScreen label="Loading..." />;
  if (error || !budget || !budgetCategory || !filters) {
    return <ErrorScreen message="Budget or category not found." onRetry={() => router.back()} />;
  }

  const listHeader = (
    <View style={styles.header}>
      <Text style={styles.periodText}>
        {formatShortDate(budget.startDate)} – {formatShortDate(budget.endDate)}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Spent</Text>
        <PrivacyAmount
          value={formatCurrency(budgetCategory.actualBase, BASE_CURRENCY)}
          color={colors.textPrimary}
          size={fontSize.base}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Planned</Text>
        <PrivacyAmount
          value={formatCurrency(budgetCategory.plannedBase, BASE_CURRENCY)}
          color={colors.textMuted}
          size={fontSize.base}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: budgetCategory.category.name,
        }}
      />
      <TransactionList filters={filters} ListHeaderComponent={listHeader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  periodText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.semibold,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
