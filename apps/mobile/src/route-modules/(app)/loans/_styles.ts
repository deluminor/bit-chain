import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgBase },

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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
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
  headerBtnPrimary: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  headerIconPrimary: {
    color: colors.white,
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
    gap: spacing.sm,
    paddingBottom: spacing['5xl'] + spacing.base,
  },

  nextDueCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nextDueLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  nextDueName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  nextDueDate: {
    color: colors.expense,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },

  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitleBlock: { flex: 1 },
  cardName: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  cardLender: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexShrink: 0,
  },
  typeBadge: {
    borderRadius: radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.3,
  },
  statusBadge: {
    borderRadius: radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amountLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  amountValueMuted: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  amountDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.bgMuted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  progressPct: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDate: { fontSize: fontSize.sm },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDestructive: { backgroundColor: colors.errorSubtle },
  actionBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: fontWeight.semibold,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
    gap: spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.base,
  },
  emptyBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  emptyBtnText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});

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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  currencyRow: {
    flexShrink: 1,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  chipTextActive: { color: colors.white },
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
    backgroundColor: colors.brandSubtle ?? colors.bgMuted,
  },
  typeBtnLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  typeBtnLabelActive: { color: colors.brand },
  typeBtnDesc: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  typeBtnDescActive: { color: colors.brand },
  footer: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
