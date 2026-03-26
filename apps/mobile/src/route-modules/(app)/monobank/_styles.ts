import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const accountsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  list: {
    padding: spacing.base,
    paddingBottom: spacing['5xl'] + spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  summaryText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  card: {
    borderRadius: radius.lg,
  },
  separator: {
    height: spacing.sm,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  accountInfo: { flex: 1 },
  accountName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  accountMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  accountPan: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    marginTop: 2,
    fontFamily: 'monospace',
  },
});

export const connectStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  flex: { flex: 1 },
  scroll: {
    padding: spacing.base,
    gap: spacing.lg,
    paddingBottom: spacing['5xl'] + spacing.base,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumber: {
    color: colors.brand,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    flex: 1,
    lineHeight: fontSize.base * 1.5,
  },
  inputGroup: { gap: spacing.sm },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  inputEmpty: {
    borderColor: colors.border,
  },
  hint: {
    color: colors.textDisabled,
    fontSize: fontSize.sm,
  },
  btn: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.55 },
  btnText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
