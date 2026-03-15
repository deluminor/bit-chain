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

export default function AppLayout() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="monobank/connect" options={{ title: 'Connect Monobank' }} />
      <Stack.Screen name="monobank/accounts" options={{ title: 'Monobank Accounts' }} />
      <Stack.Screen
        name="transaction/edit"
        options={{ presentation: 'modal', title: 'Transaction' }}
      />

      {/* Quick Action Screens */}
      <Stack.Screen name="budget/index" options={{ title: 'Budget' }} />
      <Stack.Screen name="budget/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="goals/index" options={{ title: 'Goals' }} />
      <Stack.Screen name="loans/index" options={{ title: 'Loans' }} />
      <Stack.Screen name="reports/index" options={{ title: 'Reports' }} />
      <Stack.Screen name="backup/index" options={{ title: 'Backup' }} />
    </Stack>
  );
}
