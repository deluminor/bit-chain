import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'brand' | 'neutral' | 'pro';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Render as a compact chip without background */
  outline?: boolean;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  success: { bg: colors.successSubtle, text: colors.success, border: colors.successSubtle },
  error: { bg: colors.errorSubtle, text: colors.error, border: colors.errorSubtle },
  warning: { bg: colors.warningSubtle, text: colors.warning, border: colors.warningSubtle },
  info: { bg: colors.infoSubtle, text: colors.info, border: colors.infoSubtle },
  brand: { bg: colors.brandSubtle, text: colors.brand, border: colors.brandSubtle },
  neutral: { bg: colors.bgMuted, text: colors.textSecondary, border: colors.borderStrong },
  pro: { bg: colors.brand, text: colors.black, border: colors.brand },
};

/**
 * Compact label chip for type indicators (INCOME, EXPENSE, BANK CARD, etc.).
 *
 * @example
 * ```tsx
 * <Badge label="INCOME"  variant="success" />
 * <Badge label="EXPENSE" variant="error"   />
 * <Badge label="DEFAULT" variant="neutral" outline />
 * ```
 */
export function Badge({ label, variant = 'neutral', outline = false }: BadgeProps) {
  const theme = VARIANT_STYLES[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: outline ? colors.transparent : theme.bg,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
