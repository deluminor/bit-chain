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

  scroll: {
    padding: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing['5xl'] + spacing.base,
  },

  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.md,
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  cardTextBlock: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  cardDesc: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  actionBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.brand,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionBtnTextSecondary: { color: colors.brand },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  backupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  backupIcon: { fontSize: 20 },
  backupInfo: { flex: 1 },
  backupFilename: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  backupMeta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },

  emptyWrap: { paddingVertical: spacing.md },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
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
