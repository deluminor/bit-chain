import { MonobankStatusDot, SettingsRow } from '@/route-modules/(app)/(tabs)/settings/_components';
import { styles } from '@/route-modules/(app)/(tabs)/settings/_styles';
import { Tabs, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, SectionHeader, Separator } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useLogout, useUser } from '~/src/hooks/useAuth';
import { useMonobankStatus, useMonobankSync } from '~/src/hooks/useMonobank';
import { useCurrencyStore } from '~/src/lib/currency';
import { PERIOD_OPTIONS, usePeriodStore } from '~/src/lib/period';
import { usePrivacyStore } from '~/src/lib/privacy';
import { formatRelativeDate } from '~/src/utils/format';

export default function SettingsScreen() {
  const { user } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: monoStatus, isLoading: monoLoading } = useMonobankStatus();
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();
  const { isPrivate, toggle: togglePrivacy } = usePrivacyStore();
  const { period, setPeriod } = usePeriodStore();
  const { baseCurrency, availableCurrencies, setBaseCurrency } = useCurrencyStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleSync = () => {
    sync(
      {},
      {
        onSuccess: result => {
          if (result.synced) {
            Alert.alert('Synced ✓', `Imported ${result.imported} new transactions.`);
          } else {
            Alert.alert('Up to date', 'No new transactions found.');
          }
        },
        onError: err => {
          const msg =
            err.message === 'RATE_LIMITED'
              ? 'Please wait 65 seconds before syncing again.'
              : 'Sync failed. Try again later.';
          Alert.alert('Sync failed', msg);
        },
      },
    );
  };

  const lastSync = monoStatus?.lastSyncAt ? formatRelativeDate(monoStatus.lastSyncAt) : 'Never';
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Tabs.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top - 14 }]}>
        <Text style={styles.headerTitleText}>Settings</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SectionHeader title="Account" />
        <Card padding="sm">
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{(user?.email?.[0] ?? '?').toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {user?.email ?? 'Unknown'}
              </Text>
              <Text style={styles.profileId}>ID: {user?.id?.slice(0, 8) ?? '—'}…</Text>
            </View>
          </View>
        </Card>

        <SectionHeader title="Data Range" />
        <Card padding="sm">
          <View style={styles.periodWrap}>
            {PERIOD_OPTIONS.map(opt => (
              <Pressable
                key={opt.key}
                style={[styles.periodChip, period === opt.key && styles.periodChipActive]}
                onPress={() => setPeriod(opt.key)}
              >
                <Text style={[styles.periodLabel, period === opt.key && styles.periodLabelActive]}>
                  {opt.short}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.periodHint}>
            Affects Transactions stats and Dashboard period data.
          </Text>
        </Card>

        <SectionHeader title="Currency" />
        <Card padding="sm">
          <View style={styles.periodWrap}>
            {availableCurrencies.map(code => (
              <Pressable
                key={code}
                style={[styles.periodChip, baseCurrency === code && styles.periodChipActive]}
                onPress={() => setBaseCurrency(code)}
              >
                <Text
                  style={[styles.periodLabel, baseCurrency === code && styles.periodLabelActive]}
                >
                  {code}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.periodHint}>
            Controls which currency is treated as base when showing total balances.
          </Text>
        </Card>

        <SectionHeader title="Privacy" />
        <Card padding="sm">
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Hide balances</Text>
              <Text style={styles.privacyHint}>
                {isPrivate ? 'Balances are hidden (••••)' : 'Balances are visible'}
              </Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={() => togglePrivacy()}
              trackColor={{ false: colors.border, true: colors.brandDim }}
              thumbColor={isPrivate ? colors.brand : colors.textMuted}
            />
          </View>
        </Card>

        <SectionHeader title="Monobank" />
        <Card padding="sm">
          <SettingsRow
            label="Status"
            rightSlot={
              monoLoading ? (
                <ActivityIndicator size="small" color={colors.brand} />
              ) : (
                <MonobankStatusDot isConnected={monoStatus?.status === 'CONNECTED'} />
              )
            }
          />
          <Separator />
          {monoStatus?.status === 'CONNECTED' ? (
            <>
              <SettingsRow label="Last sync" value={lastSync} />
              <Separator />
              <SettingsRow
                label="Enabled accounts"
                value={String(monoStatus.summary.enabled)}
                onPress={() => router.push('/(app)/monobank/accounts')}
              />
              <Separator />
              <SettingsRow
                label={isSyncing ? 'Syncing…' : 'Sync now'}
                onPress={handleSync}
                disabled={isSyncing}
                rightSlot={
                  isSyncing ? (
                    <ActivityIndicator size="small" color={colors.brand} />
                  ) : (
                    <Text style={styles.rowChevron}>↻</Text>
                  )
                }
              />
            </>
          ) : (
            <SettingsRow
              label="Connect Monobank"
              onPress={() => router.push('/(app)/monobank/connect')}
              rightSlot={<Text style={styles.connectLabel}>Connect →</Text>}
            />
          )}
        </Card>

        <SectionHeader title="App" />
        <Card padding="sm">
          <SettingsRow label="Version" value="1.0.0" />
        </Card>

        <Card padding="sm">
          <SettingsRow
            label={isLoggingOut ? 'Signing out…' : 'Sign out'}
            onPress={handleLogout}
            destructive
            disabled={isLoggingOut}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
