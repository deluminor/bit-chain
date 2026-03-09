import { StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarIcon: {
    fontSize: 28,
  },
  accountName: {
    color: colors.textPrimary,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  accountType: {
    color: colors.textMuted,
    fontSize: fontSize.base,
    marginTop: 2,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    lineHeight: fontSize.base * 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  metaDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: fontSize.base,
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  statusBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  monobankTag: {
    backgroundColor: colors.brandSubtle,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  monobankText: {
    color: colors.brand,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
