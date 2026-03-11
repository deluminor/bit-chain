import { Text, type StyleProp, type TextStyle } from 'react-native';
import { colors, fontSize } from '~/src/design/tokens';
import { usePrivacyStore } from '~/src/lib/privacy';

interface PrivacyAmountProps {
  value: string;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}

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
