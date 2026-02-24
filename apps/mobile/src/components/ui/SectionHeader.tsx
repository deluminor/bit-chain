import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '~/src/design/tokens';

interface SectionHeaderProps {
  title:          string;
  actionLabel?:   string;
  onAction?:      () => void;
}

/**
 * Section title row with an optional right-aligned action link.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Recent Transactions"
 *   actionLabel="See all"
 *   onAction={() => router.push('/transactions')}
 * />
 * ```
 */
export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel != null && onAction != null && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  title: {
    color:         colors.textSecondary,
    fontSize:      fontSize.sm,
    fontWeight:    fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  action: {
    color:      colors.brand,
    fontSize:   fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
