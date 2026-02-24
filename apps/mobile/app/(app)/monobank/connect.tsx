/**
 * Monobank Connect screen — enter a personal API token to link the integration.
 */

import { useMonobankConnect } from '~/src/hooks/useMonobank';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { Card } from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

const STEPS = [
  'Open the Monobank app on your phone',
  'Go to Settings → Other → API',
  'Copy your personal token and paste it below',
] as const;

export default function MonobankConnectScreen() {
  const [token, setToken]               = useState('');
  const { mutate: connect, isPending }  = useMonobankConnect();
  const router                          = useRouter();

  const handleConnect = () => {
    const trimmed = token.trim();
    if (!trimmed) {
      Alert.alert('Missing token', 'Please enter your Monobank API token.');
      return;
    }

    connect(
      { token: trimmed },
      {
        onSuccess: (result) => {
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
            ]
          );
        },
        onError: (error) => {
          Alert.alert(
            'Connection failed',
            error.message === 'INVALID_TOKEN'
              ? 'The token you entered is invalid. Please check and try again.'
              : 'Could not connect to Monobank. Please try again later.'
          );
        },
      }
    );
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

          {/* ── How to get the token ─────────────────── */}
          <Card padding="base">
            <Text style={styles.cardTitle}>How to get your token</Text>
            {STEPS.map((step, idx) => (
              <View key={idx} style={styles.step}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Card>

          {/* ── Token input ──────────────────────────── */}
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

          {/* ── Connect button ───────────────────────── */}
          <Pressable
            style={[styles.btn, isPending && styles.btnDisabled]}
            onPress={handleConnect}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnText}>Connect Monobank</Text>
            }
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: colors.bgBase,
  },
  flex: { flex: 1 },
  scroll: {
    padding:       spacing.base,
    gap:           spacing.lg,
    paddingBottom: spacing['5xl'],
  },

  // How-to card
  cardTitle: {
    color:        colors.textPrimary,
    fontSize:     fontSize.md,
    fontWeight:   fontWeight.semibold,
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           spacing.md,
    marginBottom:  spacing.sm,
  },
  stepBadge: {
    width:           24,
    height:          24,
    borderRadius:    12,
    backgroundColor: colors.brandSubtle,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
    marginTop:       1,
  },
  stepNumber: {
    color:      colors.brand,
    fontSize:   fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  stepText: {
    color:      colors.textSecondary,
    fontSize:   fontSize.base,
    flex:       1,
    lineHeight: fontSize.base * 1.5,
  },

  // Input
  inputGroup: { gap: spacing.sm },
  label: {
    color:         colors.textMuted,
    fontSize:      fontSize.sm,
    fontWeight:    fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor:   colors.bgSurface,
    borderRadius:      radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical:   spacing.md,
    color:             colors.textPrimary,
    fontSize:          fontSize.md,
    borderWidth:       1,
    borderColor:       colors.borderStrong,
    fontFamily:        Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  inputEmpty: {
    borderColor: colors.border,
  },
  hint: {
    color:    colors.textDisabled,
    fontSize: fontSize.sm,
  },

  // Button
  btn: {
    backgroundColor: colors.brand,
    borderRadius:    radius.lg,
    height:          52,
    alignItems:      'center',
    justifyContent:  'center',
  },
  btnDisabled: { opacity: 0.55 },
  btnText: {
    color:      colors.white,
    fontSize:   fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
