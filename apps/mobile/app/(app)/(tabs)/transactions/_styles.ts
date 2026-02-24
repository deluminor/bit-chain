import { StyleSheet } from 'react-native';

import { filterChipStyles } from '~/src/styles/filterChip.styles';
import { searchBarStyles } from '~/src/styles/searchBar.styles';
import { tabHeaderStyles } from '~/src/styles/tabHeader.styles';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.sm,
    paddingBottom: spacing['5xl'],
  },
  headerBlock: {
    gap: spacing.md,
    marginBottom: spacing.xs,
    paddingTop: spacing.xs,
  },

  countWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },

  sectionTitle: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    marginTop: spacing.sm,
    marginBottom: 4,
  },

  rowCard: {
    backgroundColor: colors.bgSurface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  rowCardFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  rowCardLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },

  loadMore: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },

  emptyWrap: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.base,
  },
});

export const styles = {
  ...tabHeaderStyles,
  ...filterChipStyles,
  ...searchBarStyles,
  ...screenStyles,
};
