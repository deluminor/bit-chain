import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '~/src/design/tokens';

interface LoadingScreenProps {
  /** Optional label shown below the spinner */
  label?: string;
}

/**
 * Full-screen loading state with an activity indicator.
 * Used as the initial loading placeholder for data-driven screens.
 *
 * @example
 * ```tsx
 * if (isLoading && !data) return <LoadingScreen />;
 * ```
 */
export function LoadingScreen({ label }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand} />
      {label != null && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.base,
  },
});
