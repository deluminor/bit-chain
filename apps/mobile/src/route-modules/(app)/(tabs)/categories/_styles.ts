import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { filterChipStyles } from '~/src/styles/filterChip.styles';
import { listCardStyles } from '~/src/styles/listCard.styles';
import { tabHeaderStyles } from '~/src/styles/tabHeader.styles';

export const formStyles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  close: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing['3xl'],
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  typeBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: colors.brand,
    backgroundColor: colors.bgMuted,
  },
  typeBtnText: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  typeBtnTextActive: { color: colors.brand },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  footer: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  deleteBtn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteBtnText: {
    color: colors.error,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  submitBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});

const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.sm,
    paddingBottom: spacing['5xl'] + spacing.base,
  },
  headerBlock: {
    gap: spacing.md,
    marginBottom: spacing.xs,
    paddingTop: spacing.xs,
  },
});

export const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
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
  },
  defaultTag: {
    backgroundColor: colors.bgMuted,
    borderRadius: radius.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  defaultText: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  icon: {
    fontSize: fontSize.base,
  },
  rowTypeWrap: {
    minWidth: 90,
    alignItems: 'flex-end',
  },
  rowPressed: {
    opacity: 0.6,
  },
});

export const styles = {
  ...tabHeaderStyles,
  ...filterChipStyles,
  ...listCardStyles,
  ...screenStyles,
};
