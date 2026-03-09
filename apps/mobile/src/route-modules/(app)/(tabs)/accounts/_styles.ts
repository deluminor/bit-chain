import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';
import { filterChipStyles } from '~/src/styles/filterChip.styles';
import { heroCardStyles } from '~/src/styles/heroCard.styles';
import { listCardStyles } from '~/src/styles/listCard.styles';
import { searchBarStyles } from '~/src/styles/searchBar.styles';
import { tabHeaderStyles } from '~/src/styles/tabHeader.styles';

const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.md,
    paddingBottom: spacing['5xl'],
  },

  countLabel: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
});

export const styles = {
  ...tabHeaderStyles,
  ...heroCardStyles,
  ...filterChipStyles,
  ...searchBarStyles,
  ...listCardStyles,
  ...screenStyles,
};
