import { View, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radius, spacing, type Spacing } from '~/src/design/tokens';

interface CardProps {
  children: React.ReactNode;
  /** Override padding. Defaults to "base" (16pt). */
  padding?: Spacing;
  style?: ViewStyle;
}

/**
 * Base surface card. Dark background, rounded corners, subtle border.
 * All financial cards should be built on top of this primitive.
 *
 * @example
 * ```tsx
 * <Card padding="lg">
 *   <Text>Balance: € 2,427.53</Text>
 * </Card>
 * ```
 */
export function Card({ children, padding = 'base', style }: CardProps) {
  return (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius:    radius.lg,
    borderWidth:     1,
    borderColor:     colors.border,
  },
});
