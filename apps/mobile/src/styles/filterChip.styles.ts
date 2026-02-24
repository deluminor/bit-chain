import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

/**
 * Shared horizontal filter chip (pill) styles.
 *
 * Used on Accounts, Transactions, and Categories screens to render
 * a scrollable row of selectable filter options.
 *
 * @example
 * ```tsx
 * import { filterChipStyles } from '~/src/styles/filterChip.styles';
 *
 * <Pressable style={[filterChipStyles.filterChip, active && filterChipStyles.filterChipActive]}>
 *   <Text style={[filterChipStyles.filterLabel, active && filterChipStyles.filterLabelActive]}>
 *     All
 *   </Text>
 * </Pressable>
 * ```
 */
export const filterChipStyles = StyleSheet.create({
  /** contentContainerStyle for the horizontal ScrollView / FlatList. */
  filterRow: {
    gap: spacing.xs,
    paddingRight: spacing.xs,
  },

  /** Default (inactive) pill container. */
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSurface,
  },

  /** Active/selected pill container override. */
  filterChipActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSubtle,
  },

  /** Default (inactive) pill label text. */
  filterLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },

  /** Active/selected pill label override. */
  filterLabelActive: {
    color: colors.brand,
    fontWeight: fontWeight.semibold,
  },
});
