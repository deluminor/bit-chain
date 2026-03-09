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

  header: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgBase,
  },
  headerTitleText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 48,
  },
  rowDisabled: { opacity: 0.4 },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
  },
  rowLabelDestructive: { color: colors.error },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowValue: {
    color: colors.textMuted,
    fontSize: fontSize.base,
    maxWidth: 160,
  },
  rowChevron: {
    color: colors.textMuted,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.regular,
  },
  connectLabel: {
    color: colors.brand,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.brand,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  profileInfo: { flex: 1 },
  profileEmail: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  profileId: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },

  rowContent: {
    flex: 1,
    gap: 2,
  },
  privacyHint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },

  periodWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  periodChip: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgMuted,
  },
  periodChipActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSubtle,
  },
  periodLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  periodLabelActive: { color: colors.brand },
  periodHint: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    paddingHorizontal: 4,
  },
});
