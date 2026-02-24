import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { usePrivacyStore } from '~/src/lib/privacy';


export interface SummaryMetric {
  label: string;
  value: string;
  /** Override value color */
  valueColor?: string;
  /** Whether to mask in privacy mode. Default: true */
  private?: boolean;
}

interface SummaryCardProps {
  /** Main large value shown at top */
  heroValue?: string;
  /** Label below hero value */
  heroLabel?: string;
  /** Color override for hero value */
  heroColor?: string;
  /** Whether hero value should be masked. Default: true */
  heroPrivate?: boolean;
  /** 2–3 smaller metrics in a row below */
  metrics?: SummaryMetric[];
}

/**
 * Full-width summary card with hero metric and optional sub-metrics row.
 *
 * @example
 * ```tsx
 * <SummaryCard
 *   heroValue="₴30,256.54"
 *   heroLabel="Total Balance"
 *   metrics={[
 *     { label: 'Income', value: '+€375', valueColor: colors.income },
 *     { label: 'Expenses', value: '-€422K', valueColor: colors.expense },
 *   ]}
 * />
 * ```
 */
export function SummaryCard({
  heroValue,
  heroLabel,
  heroColor,
  heroPrivate = true,
  metrics,
}: SummaryCardProps) {
  const isPrivate = usePrivacyStore(s => s.isPrivate);

  return (
    <View style={styles.card}>
      {/* Hero value */}
      {heroValue != null && (
        <View style={styles.heroWrap}>
          {heroLabel != null && <Text style={styles.heroLabel}>{heroLabel}</Text>}
          <Text
            style={[styles.heroValue, heroColor ? { color: heroColor } : undefined]}
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.6}
          >
            {isPrivate && heroPrivate ? '••••' : heroValue}
          </Text>
        </View>
      )}

      {/* Sub-metrics row */}
      {metrics != null && metrics.length > 0 && (
        <>
          {heroValue != null && <View style={styles.divider} />}
          <View style={styles.metricsRow}>
            {metrics.map((m, idx) => (
              <View
                key={m.label}
                style={[styles.metric, idx < metrics.length - 1 && styles.metricBorder]}
              >
                <Text style={styles.metricLabel} numberOfLines={1}>
                  {m.label}
                </Text>
                <Text
                  style={[styles.metricValue, m.valueColor ? { color: m.valueColor } : undefined]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.65}
                >
                  {isPrivate && m.private !== false ? '••••' : m.value}
                </Text>
              </View>
            ))}
          </View>
        </>
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
    overflow: 'hidden',
  },
  heroWrap: {
    padding: spacing.base,
    gap: 4,
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  heroValue: {
    color: colors.textPrimary,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.extrabold,
    letterSpacing: -1,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.base,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metric: {
    flex: 1,
    padding: spacing.md,
    gap: 2,
  },
  metricBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
