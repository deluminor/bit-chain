import { StyleSheet } from 'react-native';

import { colors, fontSize, radius, spacing } from '~/src/design/tokens';

/**
 * Shared grouped-list card and empty-state styles.
 *
 * Used on Accounts and Categories screens to render a rounded surface
 * card that wraps a list of separator-divided rows, plus a centred
 * empty-state message when the list is empty.
 *
 * @example
 * ```tsx
 * import { listCardStyles } from '~/src/styles/listCard.styles';
 *
 * {items.length === 0 ? (
 *   <View style={listCardStyles.emptyWrap}>
 *     <Text style={listCardStyles.emptyText}>Nothing here yet</Text>
 *   </View>
 * ) : (
 *   <View style={listCardStyles.listCard}>
 *     {items.map(item => <Row key={item.id} {...item} />)}
 *   </View>
 * )}
 * ```
 */
export const listCardStyles = StyleSheet.create({
  /** Rounded surface card wrapping a divided list of rows. */
  listCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    overflow: 'hidden',
  },

  /** Centred container for the empty-state message. */
  emptyWrap: {
    alignItems: 'center',
    padding: spacing.xl,
  },

  /** Muted text rendered inside emptyWrap. */
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.base,
  },
});
