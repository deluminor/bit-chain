import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';

interface EmptyStateProps {
  /** Large emoji or symbol shown above the title */
  icon?:        string;
  title:        string;
  description?: string;
}

/**
 * Centered empty-state placeholder for screens with no data.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📭"
 *   title="No transactions yet"
 *   description="Sync your Monobank account to import transactions."
 * />
 * ```
 */
export function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description != null && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:  'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing['2xl'],
    gap: spacing.sm,
  },
  icon: {
    fontSize:    40,
    marginBottom: spacing.sm,
  },
  title: {
    color:      colors.textSecondary,
    fontSize:   fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign:  'center',
  },
  description: {
    color:     colors.textMuted,
    fontSize:  fontSize.base,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
    marginTop:  spacing.xs,
  },
});
