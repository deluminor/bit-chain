import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { OfflineBanner } from '~/src/components/OfflineBanner';
import { colors } from '~/src/design/tokens';
import { useAuthStore } from '~/src/lib/auth';
import { QUERY_CONFIG } from '~/src/lib/constants';
import { useCurrencyStore } from '~/src/lib/currency';
import { setupNetworkListener } from '~/src/lib/network';
import { usePeriodStore } from '~/src/lib/period';
import { usePrivacyStore } from '~/src/lib/privacy';
import { asyncStoragePersister, queryClient } from '~/src/lib/query';

function AuthGuard() {
  const { user, accessToken, isLoading, hydrate } = useAuthStore();
  const hydratePrivacy = usePrivacyStore(s => s.hydrate);
  const hydratePeriod = usePeriodStore(s => s.hydrate);
  const hydrateCurrency = useCurrencyStore(s => s.hydrate);
  const router = useRouter();
  const segments = useSegments();

  // Hydrate tokens, privacy preference, and period from storage on mount
  useEffect(() => {
    hydrate();
    hydratePrivacy();
    hydratePeriod();
    hydrateCurrency();
  }, [hydrate, hydratePrivacy, hydratePeriod, hydrateCurrency]);

  // Route guard: redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!accessToken && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (accessToken && inAuthGroup) {
      router.replace('/(app)/(tabs)/dashboard');
    }
  }, [accessToken, user, isLoading, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  // Register NetInfo → TanStack Query online manager bridge.
  // Must run once at app startup. Listener persists for the app's lifetime.
  useEffect(() => {
    setupNetworkListener();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: QUERY_CONFIG.MAX_CACHE_AGE,
      }}
    >
      <View style={styles.root}>
        <StatusBar style="light" />
        <OfflineBanner />
        <AuthGuard />
      </View>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
});
