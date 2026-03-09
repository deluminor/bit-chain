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
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: spacing['4xl'],
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  sectionInactive: {
    opacity: 0.7,
  },
  cardsWrap: {
    gap: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    marginTop: spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyMessage: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
