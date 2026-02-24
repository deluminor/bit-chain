import { Text, type TextStyle } from 'react-native';
import { colors, fontSize } from '~/src/design/tokens';
import { usePrivacyStore } from '~/src/lib/privacy';

interface PrivacyAmountProps {
  /** Formatted value to display when privacy is off, e.g. "₴12,345.00" */
  value: string;
  /** Optional text color override */
  color?: string;
  /** Optional font size override */
  size?: number;
  /** Additional text style overrides */
  style?: TextStyle;
}

/**
 * Renders a monetary value that respects global privacy mode.
 * When privacy mode is ON, the value is replaced with "••••".
 *
 * Use this component for ALL balance/amount displays across the app.
 *
 * @example
 * ```tsx
 * <PrivacyAmount value={formatCurrency(balance, 'UAH')} color={colors.income} />
 * ```
 */
export function PrivacyAmount({ value, color, size, style }: PrivacyAmountProps) {
  const isPrivate = usePrivacyStore(s => s.isPrivate);

  return (
    <Text
      style={[
        {
          color: color ?? colors.textPrimary,
          fontSize: size ?? fontSize.base,
        },
        style,
      ]}
      numberOfLines={1}
    >
      {isPrivate ? '••••' : value}
    </Text>
  );
}
