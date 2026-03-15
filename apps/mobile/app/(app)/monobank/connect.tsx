import { MONOBANK_STEPS } from '@/route-modules/(app)/monobank/_constants';
import { connectStyles as styles } from '@/route-modules/(app)/monobank/_styles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { Card } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useMonobankConnect } from '~/src/hooks/useMonobank';

const MonobankTokenSchema = z.object({
  token: z.string().min(1, 'Please enter your Monobank API token.').max(500, 'Token is too long.'),
});

export default function MonobankConnectScreen() {
  const [token, setToken] = useState('');
  const { mutate: connect, isPending } = useMonobankConnect();
  const router = useRouter();

  const handleConnect = () => {
    const trimmed = token.trim();
    const parsed = MonobankTokenSchema.safeParse({ token: trimmed });
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.token?.[0] ?? 'Please enter a valid token.';
      Alert.alert('Invalid token', msg);
      return;
    }

    connect(parsed.data, {
      onSuccess: result => {
        Alert.alert(
          'Connected ✓',
          `Found ${result.accountsFound} account${result.accountsFound === 1 ? '' : 's'}.\nChoose which ones to import.`,
          [
            {
              text: 'Manage Accounts',
              onPress: () => router.replace('/(app)/monobank/accounts'),
            },
            {
              text: 'Go to Dashboard',
              style: 'cancel',
              onPress: () => router.replace('/(app)/(tabs)/dashboard'),
            },
          ],
        );
      },
      onError: error => {
        Alert.alert(
          'Connection failed',
          error.message === 'INVALID_TOKEN'
            ? 'The token you entered is invalid. Please check and try again.'
            : 'Could not connect to Monobank. Please try again later.',
        );
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card padding="base">
            <Text style={styles.cardTitle}>How to get your token</Text>
            {MONOBANK_STEPS.map((step, idx) => (
              <View key={idx} style={styles.step}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Card>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>API Token</Text>
            <TextInput
              style={[styles.input, !token && styles.inputEmpty]}
              value={token}
              onChangeText={setToken}
              placeholder="u…"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              editable={!isPending}
              returnKeyType="done"
              onSubmitEditing={handleConnect}
            />
            <Text style={styles.hint}>
              🔒 Your token is encrypted before being stored on our servers.
            </Text>
          </View>

          <Pressable
            style={[styles.btn, isPending && styles.btnDisabled]}
            onPress={handleConnect}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>Connect Monobank</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
