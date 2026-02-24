import { Stack } from 'expo-router';
import { colors, fontSize, fontWeight } from '~/src/design/tokens';

export default function AccountsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgBase },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: fontWeight.semibold, fontSize: fontSize.lg } as const,
        contentStyle: { backgroundColor: colors.bgBase },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Accounts', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Account', headerShown: false }} />
    </Stack>
  );
}
