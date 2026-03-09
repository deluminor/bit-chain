import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    justifyContent: 'center',
  },
  inputText: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
  },
  inputDisabled: {
    backgroundColor: colors.bgMuted,
    borderColor: colors.border,
  },
  readOnlyText: {
    color: colors.textMuted,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  hintText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginLeft: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: 4,
    marginLeft: 4,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  addCatBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.brandSubtle,
    borderRadius: radius.sm,
  },
  addCatText: {
    color: colors.brand,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
  categoriesList: {
    gap: spacing.md,
    backgroundColor: colors.bgSurface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyCategories: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyCategoriesText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  catRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  catInputWrap: {
    flex: 1,
    gap: 4,
  },
  catInputWrapCompact: {
    flex: 0.6,
  },
  catLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 4,
  },
  removeBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.expenseSubtle,
    borderRadius: radius.md,
  },
  removeIcon: {
    color: colors.expense,
    fontSize: 24,
    lineHeight: 28,
  },
  footer: {
    padding: spacing.base,
    paddingBottom: Platform.OS === 'ios' ? spacing['4xl'] : spacing.base,
    backgroundColor: colors.bgBase,
    borderTopWidth: 1,
    borderColor: colors.border,
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
});
