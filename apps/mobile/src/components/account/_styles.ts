import { StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowPressed: {
    opacity: 0.6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarIcon: {
    fontSize: fontSize.xl,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  monobankTag: {
    backgroundColor: colors.brandSubtle,
    borderRadius: radius.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  monobankText: {
    color: colors.brand,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  type: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  balanceWrap: {
    alignItems: 'flex-end',
    gap: 1,
    flexShrink: 0,
  },
  balance: {
    fontWeight: fontWeight.bold,
  },
  currency: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
