import { StyleSheet } from 'react-native';

import { heroCardStyles } from '~/src/styles/heroCard.styles';
import { tabHeaderStyles } from '~/src/styles/tabHeader.styles';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

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
});

export const styles = {
  ...tabHeaderStyles,
  ...heroCardStyles,
  ...screenStyles,
};
