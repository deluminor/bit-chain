import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  ErrorScreen,
  LoadingScreen,
  ProgressBar,
  SectionHeader,
  Separator,
} from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { useBudgets, useDeleteBudget } from '~/src/hooks/useBudgets';
import { formatCurrency, formatShortDate } from '~/src/utils/format';

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error, refetch, isRefetching } = useBudgets();
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget();

  const budget = data?.budgets.find(b => b.id === id);

  if (isLoading) return <LoadingScreen label="Loading budget..." />;
  if (error || !budget) {
    return (
      <ErrorScreen
        message="Budget not found or could not be loaded."
        onRetry={() => router.back()}
      />
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete "${budget.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBudget(budget.id, {
              onSuccess: () => router.back(),
              onError: err => Alert.alert('Deletion Failed', err.message),
            });
          },
        },
      ],
    );
  };

  const isOverBudget = budget.totalActualBase > budget.totalPlannedBase;
  const mainProgress =
    budget.totalPlannedBase > 0
      ? Math.min((budget.totalActualBase / budget.totalPlannedBase) * 100, 100)
      : 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start' }}>
              <Text style={styles.headerTitleText} numberOfLines={1}>
                {budget.name}
              </Text>
              <Text style={styles.headerSubtitleText}>
                {formatShortDate(budget.startDate)} - {formatShortDate(budget.endDate)}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
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
                style={styles.headerBtn}
                onPress={() => router.push({ pathname: '/budget/edit', params: { id: budget.id } })}
                hitSlop={8}
              >
                <Text style={styles.headerIcon}>✎</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card padding="lg" style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.amountsRow}>
            <View>
              <Text style={styles.amountLabel}>Spent</Text>
              <Text style={[styles.spentAmount, isOverBudget && styles.overSpent]}>
                {formatCurrency(budget.totalActualBase, budget.currency)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amountLabel}>Planned</Text>
              <Text style={styles.plannedAmount}>
                {formatCurrency(budget.totalPlannedBase, budget.currency)}
              </Text>
            </View>
          </View>
          <View style={styles.mainProgressWrap}>
            <ProgressBar
              progress={mainProgress}
              color={isOverBudget ? colors.expense : colors.brand}
              height={12}
            />
          </View>
        </Card>

        <SectionHeader title="Categories" />
        <Card padding="sm">
          {budget.categories.map((cat, idx) => {
            const catProgress =
              cat.plannedBase > 0 ? Math.min((cat.actualBase / cat.plannedBase) * 100, 100) : 0;
            const catOver = cat.actualBase > cat.plannedBase;

            return (
              <View key={cat.id}>
                <View style={styles.catRow}>
                  <View style={styles.catInfo}>
                    <Text style={styles.catIcon}>{'📁'}</Text>
                    <Text style={styles.catName} numberOfLines={1}>
                      {cat.category.name}
                    </Text>
                  </View>
                  <View style={styles.catAmounts}>
                    <Text style={[styles.catSpent, catOver && styles.catOverSpent]}>
                      {formatCurrency(cat.actualBase, budget.currency)}
                    </Text>
                    <Text style={styles.catPlanned}>
                      / {formatCurrency(cat.plannedBase, budget.currency)}
                    </Text>
                  </View>
                </View>
                <View style={styles.catProgressWrap}>
                  <ProgressBar
                    progress={catProgress}
                    color={catOver ? colors.expense : cat.category.color || colors.brand}
                    height={6}
                  />
                </View>
                {idx < budget.categories.length - 1 && <Separator />}
              </View>
            );
          })}
        </Card>

        <Pressable
          style={[styles.deleteBtn, isDeleting && styles.disabledBtn]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Text style={styles.deleteBtnText}>{isDeleting ? 'Deleting...' : 'Delete Budget'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: Platform.OS === 'ios' ? 0 : spacing.sm,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  headerTitleText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  headerSubtitleText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  overviewCard: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: 4,
  },
  spentAmount: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  overSpent: {
    color: colors.expense,
  },
  plannedAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  mainProgressWrap: {
    marginTop: spacing.xs,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  catInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  catIcon: {
    fontSize: 20,
  },
  catName: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  catAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  catSpent: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  catOverSpent: {
    color: colors.expense,
  },
  catPlanned: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  catProgressWrap: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
  deleteBtn: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.expenseSubtle,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: colors.expense,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
