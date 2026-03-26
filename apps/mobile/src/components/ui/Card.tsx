import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing, type Spacing } from '~/src/design/tokens';

interface CardProps {
  children: React.ReactNode;
  /** Override padding. Defaults to "base" (16pt). */
  padding?: Spacing;
  style?: ViewStyle;
  /** Render a 2px green accent line at the bottom of the card. */
  accent?: boolean;
}

/**
 * Base surface card. Dark background, rounded corners, subtle border.
 * All financial cards should be built on top of this primitive.
 *
 * @example
 * ```tsx
 * <Card padding="lg" accent>
 *   <Text>Balance: € 2,427.53</Text>
 * </Card>
 * ```
 */
export function Card({ children, padding = 'base', style, accent = false }: CardProps) {
  return (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
      {accent && <View style={styles.accentLine} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: spacing.base,
    right: spacing.base,
    height: 2,
    backgroundColor: colors.brand,
    borderRadius: radius.full,
  },
});
