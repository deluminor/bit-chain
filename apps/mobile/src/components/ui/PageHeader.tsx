import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Secondary line — e.g. "Last sync: Today" or "9 accounts" */
  subtitle?: string;
  /** Called when the reload button is pressed */
  onReload?: () => void;
  /** When true, shows a spinner instead of the reload icon */
  isLoading?: boolean;
  /** Custom right action node */
  actionRight?: React.ReactNode;
}

/**
 * Consistent header used across all tab screens.
 * Mirrors the Dashboard header design.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Accounts"
 *   subtitle="9 accounts"
 *   onReload={refetch}
 *   isLoading={isRefetching}
 * />
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  onReload,
  isLoading = false,
  actionRight,
}: PageHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle != null && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {onReload != null && (
          <Pressable
            style={[styles.reloadBtn, isLoading && styles.reloadBtnDisabled]}
            onPress={onReload}
            disabled={isLoading}
            hitSlop={8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Text style={styles.reloadIcon}>↻</Text>
            )}
          </Pressable>
        )}
        {actionRight}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reloadBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadBtnDisabled: {
    opacity: 0.4,
  },
  reloadIcon: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
