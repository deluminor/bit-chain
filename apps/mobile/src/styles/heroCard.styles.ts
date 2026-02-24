import { StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';

/**
 * Shared hero balance card styles.
 *
 * Used on Dashboard and Accounts screens to display the primary
 * aggregate balance with a label, large value, and meta line.
 *
 * @example
 * ```tsx
 * import { heroCardStyles } from '~/src/styles/heroCard.styles';
 *
 * <Card style={heroCardStyles.heroCard} padding="lg">
 *   <Text style={heroCardStyles.heroLabel}>Total Balance</Text>
 *   <Text style={heroCardStyles.heroValue}>{amount}</Text>
 *   <Text style={heroCardStyles.heroMeta}>3 active accounts</Text>
 * </Card>
 * ```
 */
export const heroCardStyles = StyleSheet.create({
  /** Gap container for the hero card children. */
  heroCard: {
    gap: spacing.xs,
  },

  /** Small muted label above the primary value. */
  heroLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },

  /** Large bold balance amount — primary visual anchor. */
  heroValue: {
    color: colors.textPrimary,
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.extrabold,
    letterSpacing: -1,
  },

  /** Secondary meta line below the primary value. */
  heroMeta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
