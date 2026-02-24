import { StyleSheet } from 'react-native';

import { colors, fontSize, radius, spacing } from '~/src/design/tokens';

/**
 * Shared search input bar styles.
 *
 * Used on Accounts and Transactions screens to render a full-width
 * pill-shaped search field with a leading emoji icon.
 *
 * @example
 * ```tsx
 * import { searchBarStyles } from '~/src/styles/searchBar.styles';
 *
 * <View style={searchBarStyles.searchWrap}>
 *   <Text style={searchBarStyles.searchIcon}>🔍</Text>
 *   <TextInput style={searchBarStyles.searchInput} placeholder="Search…" />
 * </View>
 * ```
 */
export const searchBarStyles = StyleSheet.create({
  /** Pill-shaped container for the search icon + input. */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.xs,
  },

  /** Leading emoji icon inside the search bar. */
  searchIcon: {
    fontSize: fontSize.base,
  },

  /** Flex-grow text input — resets padding for uniform alignment. */
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    padding: 0,
  },
});
