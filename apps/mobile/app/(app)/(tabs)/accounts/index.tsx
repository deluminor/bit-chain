'use client';

import { Tabs } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountRow, type AccountRowData } from '~/src/components/account/AccountRow';
import { Card, ErrorScreen, LoadingScreen, PrivacyAmount, Separator } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useAccounts } from '~/src/hooks/useAccounts';
import { useMonobankSync } from '~/src/hooks/useMonobank';
import { convertCurrency, useCurrencyStore } from '~/src/lib/currency';
import { formatCurrency } from '~/src/utils/format';
import { ACCOUNT_FILTERS } from './_constants';
import { styles } from './_styles';
import type { FilterKey } from './_types';

function SyncButton({ isSyncing, onPress }: { isSyncing: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.syncBtn, isSyncing && styles.syncBtnDisabled]}
      onPress={onPress}
      disabled={isSyncing}
    >
      <Text style={styles.syncBtnText}>{isSyncing ? '…' : '↻'}</Text>
    </Pressable>
  );
}

export default function AccountsScreen() {
  const { data, isLoading, isRefetching, error, refetch } = useAccounts();
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);
  const [heroTotal, setHeroTotal] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const insets = useSafeAreaInsets();

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
              : 'Could not sync Monobank data. Try again later.';
          Alert.alert('Sync failed', msg);
        },
      },
    );
  };

  const accounts: AccountRowData[] = data?.accounts ?? [];

  const filtered = accounts.filter(acc => {
    const matchType = filter === 'ALL' || acc.type === filter;
    const matchSearch = search === '' || acc.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const balancesByCurrency = useMemo(
    () =>
      accounts.reduce<
        Array<{
          currency: string;
          totalBalance: number;
          accountCount: number;
        }>
      >((accum, account) => {
        const existing = accum.find(b => b.currency === account.currency);
        if (existing) {
          existing.totalBalance += account.balance;
          existing.accountCount += 1;
          return accum;
        }
        return [
          ...accum,
          {
            currency: account.currency,
            totalBalance: account.balance,
            accountCount: 1,
          },
        ];
      }, []),
    [accounts],
  );

  // Total Balance на екрані акаунтів показуємо в базовій валюті, якщо така є серед балансів.
  const primaryBalance =
    balancesByCurrency.find(b => b.currency === baseCurrency) ?? balancesByCurrency[0] ?? undefined;

  const refetchCb = useCallback(() => {
    refetch();
    sync({}, { onError: () => {} }); // trigger sync silently
  }, [refetch, sync]);

  useEffect(() => {
    let isMounted = true;

    const recompute = async () => {
      if (!accounts.length) {
        if (isMounted) setHeroTotal(0);
        return;
      }

      let total = 0;
      for (const acc of accounts) {
        total += await convertCurrency(acc.balance, acc.currency, baseCurrency);
      }

      if (isMounted) {
        setHeroTotal(total);
      }
    };

    void recompute();

    return () => {
      isMounted = false;
    };
  }, [accounts, baseCurrency]);

  if (isLoading) return <LoadingScreen label="Loading accounts…" />;
  if (error) {
    const msg = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return <ErrorScreen message={`Failed to load accounts: ${msg}`} onRetry={() => refetch()} />;
  }

  const primaryCurrency = primaryBalance?.currency ?? accounts[0]?.currency ?? baseCurrency;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Tabs.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top - 14 }]}>
        <View>
          <Text style={styles.headerTitleText}>Accounts</Text>
          <Text style={styles.headerSubtitleText}>{data?.totalAccounts ?? 0} active</Text>
        </View>
        <View style={styles.headerActions}>
          <SyncButton isSyncing={isSyncing} onPress={handleSync} />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isSyncing}
            onRefresh={refetchCb}
            tintColor={colors.brand}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        <Card style={styles.heroCard} padding="lg">
          <Text style={styles.heroLabel}>Total Balance</Text>
          <PrivacyAmount
            value={formatCurrency(heroTotal ?? primaryBalance?.totalBalance ?? 0, baseCurrency)}
            style={styles.heroValue}
          />
          <Text style={styles.heroMeta}>
            {data?.totalAccounts ?? 0} active {data?.totalAccounts === 1 ? 'account' : 'accounts'}
          </Text>
        </Card>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search accounts..."
            placeholderTextColor={colors.textDisabled}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {ACCOUNT_FILTERS.map(f => (
            <Pressable
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.countLabel}>
          {filtered.length} {filter === 'ALL' ? 'ACCOUNTS' : `${filter.replace('_', ' ')}S`}
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No accounts found</Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {filtered.map((acc, idx) => (
              <View key={acc.id}>
                <AccountRow account={acc} />
                {idx < filtered.length - 1 && <Separator />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
