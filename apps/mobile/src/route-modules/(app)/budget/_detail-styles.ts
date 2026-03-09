import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: Platform.OS === 'ios' ? 0 : spacing.sm,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitleWrapAndroid: {
    alignItems: 'flex-start',
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  headerTitleText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  headerSubtitleText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  overviewCard: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountPlannedWrap: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: 4,
  },
  spentAmount: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  overSpent: {
    color: colors.expense,
  },
  plannedAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  mainProgressWrap: {
    marginTop: spacing.xs,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  catInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  catIcon: {
    fontSize: 20,
  },
  catName: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  catAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  catSpent: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  catOverSpent: {
    color: colors.expense,
  },
  catPlanned: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  catProgressWrap: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
  deleteBtn: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.expenseSubtle,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: colors.expense,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
