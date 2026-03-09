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

  periodWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  periodChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  periodChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  periodChipTextActive: { color: colors.white },

  scroll: {
    padding: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing['5xl'],
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },

  exportCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.md,
  },
  exportIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  exportEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  exportTextBlock: {
    flex: 1,
    gap: 4,
  },
  exportTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  exportDesc: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  exportBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportBtnIcon: {
    color: colors.white,
    fontSize: 16,
  },
  exportBtnText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },

  noteCard: {
    backgroundColor: colors.bgMuted,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noteText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
});
