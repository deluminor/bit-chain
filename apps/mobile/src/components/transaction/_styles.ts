import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  description: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  account: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  amount: {
    fontWeight: fontWeight.semibold,
  },
  amountInAccountCurrency: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  date: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
  },
});

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['4xl'],
    gap: spacing.xl,
  },
  footer: {
    padding: spacing.base,
    paddingBottom: Platform.OS === 'ios' ? spacing['4xl'] : spacing.base,
    backgroundColor: colors.bgBase,
    borderTopWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  typeRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  typeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  typeBtnActive: {
    backgroundColor: colors.brandSubtle,
  },
  typeBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  typeBtnTextActive: {
    color: colors.brand,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: spacing.base,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurface,
  },
  chipActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandDim,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  emptyText: {
    color: colors.textDisabled,
    fontStyle: 'italic',
  },
  fieldHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: -spacing.xs,
  },
  btn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  deleteBtn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.expenseSubtle,
  },
  deleteBtnText: {
    color: colors.expense,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
