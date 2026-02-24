import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

interface ErrorScreenProps {
  /** Error message to display */
  message?: string;
  /** Called when the user taps "Retry" */
  onRetry?: () => void;
}

/**
 * Full-screen error state with an optional retry button.
 *
 * @example
 * ```tsx
 * if (error && !data) {
 *   return <ErrorScreen message="Failed to load" onRetry={refetch} />;
 * }
 * ```
 */
export function ErrorScreen({
  message = 'Something went wrong.',
  onRetry,
}: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry != null && (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: colors.bgBase,
    alignItems:      'center',
    justifyContent:  'center',
    gap:             spacing.md,
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 40,
  },
  message: {
    color:     colors.textSecondary,
    fontSize:  fontSize.base,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
  },
  button: {
    marginTop:        spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical:  spacing.md,
    backgroundColor:  colors.bgSurface,
    borderRadius:     radius.md,
    borderWidth:      1,
    borderColor:      colors.border,
  },
  buttonText: {
    color:      colors.brand,
    fontSize:   fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
