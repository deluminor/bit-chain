import { Stack } from 'expo-router';
import { colors } from '~/src/design/tokens';

export default function TransactionsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bgBase } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
