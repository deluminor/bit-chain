import { Stack } from 'expo-router';
import { colors, fontSize, fontWeight } from '~/src/design/tokens';

const SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: colors.bgBase },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: fontWeight.semibold, fontSize: fontSize.lg } as const,
  headerTitleAlign: 'left' as const,
  contentStyle: { backgroundColor: colors.bgBase },
  headerShadowVisible: false,
} as const;

export default function BudgetIdLayout() {
  return <Stack screenOptions={SCREEN_OPTIONS} />;
}
