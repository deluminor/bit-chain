import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

/**
 * Shared header styles for all tab screens.
 *
 * Provides the full-width flex-row header layout with title, subtitle,
 * action buttons (icon 32×32 and sync 36×36 variants).
 *
 * @example
 * ```tsx
 * import { tabHeaderStyles } from '~/src/styles/tabHeader.styles';
 * // Spread into screen styles or use directly:
 * <View style={[tabHeaderStyles.header, { paddingTop: insets.top - 14 }]}>
 * ```
 */
export const tabHeaderStyles = StyleSheet.create({
  /** Full-width flex-row header with space-between layout. */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgBase,
  },

  /** Primary page title text. */
  headerTitleText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },

  /** Secondary subtitle text rendered below the page title. */
  headerSubtitleText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },

  /** Row container for header action buttons. */
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  /** Small (32×32) icon action button — used on Transactions and Categories. */
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

  /** Text icon rendered inside headerBtn. */
  headerIcon: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
  },

  /** Medium (36×36) sync action button — used on Dashboard and Accounts. */
  syncBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Disabled state for syncBtn. */
  syncBtnDisabled: {
    opacity: 0.4,
  },

  /** Text icon rendered inside syncBtn. */
  syncBtnText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
