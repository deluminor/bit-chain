import type { Budget } from '@bit-chain/api-contracts';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';
import { formatCurrency, formatShortDate } from '~/src/utils/format';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

type Props = {
  budget: Budget;
};

export function BudgetCard({ budget }: Props) {
  const percentSpent =
    budget.totalPlannedBase > 0
      ? Math.min((budget.totalActualBase / budget.totalPlannedBase) * 100, 100)
      : 0;

  const isOverBudget = budget.totalActualBase > budget.totalPlannedBase;
  const progressColor = isOverBudget ? colors.expense : colors.brand;

  return (
    <Card padding="md" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {budget.name}
        </Text>
        <Text style={styles.period}>
          {budget.period === 'MONTHLY'
            ? 'Monthly'
            : budget.period === 'YEARLY'
              ? 'Yearly'
              : 'Custom'}
        </Text>
      </View>

      <View style={styles.dates}>
        <Text style={styles.dateText}>
          {formatShortDate(budget.startDate)} - {formatShortDate(budget.endDate)}
        </Text>
        {budget.isActive && <Text style={styles.activeBadge}>Active</Text>}
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar progress={percentSpent} color={progressColor} height={8} />
      </View>

      <View style={styles.amounts}>
        <Text style={[styles.spent, isOverBudget && styles.overSpent]}>
          {formatCurrency(budget.totalActualBase, budget.currency)} spent
        </Text>
        <Text style={styles.planned}>
          of {formatCurrency(budget.totalPlannedBase, budget.currency)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  period: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  dates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  activeBadge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.brand,
    backgroundColor: colors.brandSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  progressWrap: {
    paddingVertical: spacing.xs,
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  spent: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  overSpent: {
    color: colors.expense,
  },
  planned: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
