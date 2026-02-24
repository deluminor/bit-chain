import { StyleSheet } from 'react-native';

import { filterChipStyles } from '~/src/styles/filterChip.styles';
import { listCardStyles } from '~/src/styles/listCard.styles';
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
});

export const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  defaultTag: {
    backgroundColor: colors.bgMuted,
    borderRadius: radius.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  defaultText: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});

export const styles = {
  ...tabHeaderStyles,
  ...filterChipStyles,
  ...listCardStyles,
  ...screenStyles,
};
