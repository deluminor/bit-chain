import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { heroCardStyles } from '~/src/styles/heroCard.styles';
import { tabHeaderStyles } from '~/src/styles/tabHeader.styles';

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.md,
    paddingBottom: spacing['5xl'] + spacing.base,
  },
  monobankBanner: {
    backgroundColor: colors.brandDim,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.brand,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  quickActionsRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  quickActionCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    width: 88,
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  balanceCurrency: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    width: 44,
  },
  balanceAccounts: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    flex: 1,
  },
  balanceAmount: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.base,
    textAlign: 'center',
  },

  expensesTrendHeader: {
    marginBottom: spacing.sm,
  },
  expensesTrendTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expensesTrendSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  expensesTrendValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  expensesTrendCurrentValue: {
    color: colors.textPrimary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  },
  expensesTrendDelta: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  expensesTrendMeta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  expensesBudgetLimitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.expenseSubtle,
    borderRadius: radius.md,
    backgroundColor: colors.errorSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  expensesBudgetLimitLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  expensesBudgetLimitStatus: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  expensesBudgetLimitApproaching: {
    color: colors.warning,
  },
  expensesBudgetLimitOver: {
    color: colors.expense,
  },
  expensesTrendLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: spacing.sm,
  },
  expensesTrendLegendGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  expensesTrendLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expensesTrendLegendLineCurrent: {
    width: 18,
    height: 2.5,
    borderRadius: radius.full,
    backgroundColor: colors.expense,
  },
  expensesTrendLegendLinePrevious: {
    width: 18,
    height: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.textDisabled,
    borderStyle: 'dashed',
  },
  expensesTrendLegendLineBudget: {
    width: 18,
    height: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(239, 68, 68, 0.45)',
    borderStyle: 'dashed',
  },
  expensesTrendLegendLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  budgetPeriod: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  budgetCatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  budgetCatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  budgetCatIcon: {
    fontSize: 20,
  },
  budgetCatName: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  budgetCatAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  budgetCatSpent: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  budgetCatOverSpent: {
    color: colors.expense,
  },
  budgetCatPlanned: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  budgetCatProgressWrap: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
});

export const styles = {
  ...tabHeaderStyles,
  ...heroCardStyles,
  ...screenStyles,
};
