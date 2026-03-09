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
    paddingBottom: spacing['5xl'],
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

  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  trendTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  trendBadgeUp: { backgroundColor: colors.incomeSubtle },
  trendBadgeDown: { backgroundColor: colors.errorSubtle },
  trendBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  trendValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  trendCurrentValue: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  trendChange: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  trendHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  trendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  trendMinMax: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
  },
  trendPeriodLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});

export const styles = {
  ...tabHeaderStyles,
  ...heroCardStyles,
  ...screenStyles,
};
