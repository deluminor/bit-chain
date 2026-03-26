import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { usePrivacyStore } from '~/src/lib/privacy';

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string;
  /** Secondary line below the value (e.g. transaction count, trend) */
  subtitle?: string;
  /** Colours the subtitle text */
  trend?: TrendDirection;
  /** Override the value text colour */
  valueColor?: string;
  style?: ViewStyle;
  /**
   * When true, the value is masked by privacy mode.
   * Pass `true` for monetary values, omit (or `false`) for counts/labels.
   * Defaults to `true` — set to `false` for non-monetary stats.
   */
  private?: boolean;
}

/**
 * Single-metric display card used in summary rows.
 * Renders a label, large value, and optional trend subtitle.
 *
 * Monetary values are hidden (••••) when global privacy mode is on.
 * Pass `private={false}` to always show the value (e.g. account count).
 *
 * @example
 * ```tsx
 * <StatCard label="Income"   value="€292.66" valueColor={colors.income} />
 * <StatCard label="Accounts" value="3" private={false} />
 * ```
 */
export function StatCard({
  label,
  value,
  subtitle,
  trend,
  valueColor,
  style,
  private: isPrivateValue = true,
}: StatCardProps) {
  const isPrivate = usePrivacyStore(s => s.isPrivate);

  const displayValue = isPrivate && isPrivateValue ? '••••' : value;

  const subtitleColor =
    trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textMuted;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.value, valueColor ? { color: valueColor } : undefined]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {displayValue}
      </Text>
      {subtitle != null && (
        <Text style={[styles.subtitle, { color: subtitleColor }]} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    flex: 1,
    gap: 2,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  value: {
    color: colors.textPrimary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
});
