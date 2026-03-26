import { ACCOUNT_TYPE_META, ACCOUNT_TYPE_META_FALLBACK } from '@/constants/accountTypes';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AccountRowData } from '~/src/components/account/AccountRow';
import { Card, ErrorScreen, LoadingScreen, StatCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useAccounts, useUpdateAccount } from '~/src/hooks/useAccounts';
import { formatCurrency } from '~/src/utils/format';
import { styles } from './_detail-styles';
import { AccountEditModal } from './_edit-modal';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = useAccounts();
  const { mutateAsync: updateAccount, isPending: isUpdating } = useUpdateAccount();

  const [editingAccount, setEditingAccount] = useState<AccountRowData | null>(null);

  const account = data?.accounts.find(item => item.id === id);

  useEffect(() => {
    if (account?.name) {
      navigation.setOptions({ title: account.name });
    }
  }, [account?.name, navigation]);

  const handleSave = async (changes: {
    name?: string;
    balance?: number;
    description?: string | null;
    color?: string | null;
  }) => {
    if (!account) return;
    try {
      await updateAccount({ id: account.id, ...changes });
      setEditingAccount(null);
    } catch {
      Alert.alert('Error', 'Failed to update account');
    }
  };

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load accounts." onRetry={refetch} />;
  if (!account) {
    return <ErrorScreen message={`Account not found.\nID: ${id}`} />;
  }

  const meta = ACCOUNT_TYPE_META[account.type] ?? ACCOUNT_TYPE_META_FALLBACK;
  const color = account.color ?? meta.defaultColor;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card padding="lg">
          <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
            <Text style={styles.avatarIcon}>{meta.icon}</Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.accountName}>{account.name}</Text>
            {!account.isMonobank && (
              <Pressable
                style={styles.editBtn}
                onPress={() => setEditingAccount(account)}
                hitSlop={8}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.accountType}>{meta.label}</Text>

          {account.description != null && (
            <Text style={styles.description}>{account.description}</Text>
          )}
        </Card>

        <View style={styles.statsRow}>
          <StatCard
            label="Balance"
            value={formatCurrency(account.balance, account.currency)}
            valueColor={account.balance < 0 ? colors.expense : colors.textPrimary}
            style={styles.statCard}
          />
          <StatCard
            label="Transactions"
            value={String(account.transactionCount)}
            style={styles.statCard}
          />
        </View>

        <Card padding="base">
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Currency</Text>
            <Text style={styles.metaValue}>{account.currency}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: account.isActive ? colors.successSubtle : colors.bgMuted },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: account.isActive ? colors.success : colors.textMuted },
                ]}
              >
                {account.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          {account.isMonobank && (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Source</Text>
                <View style={styles.monobankTag}>
                  <Text style={styles.monobankText}>Monobank</Text>
                </View>
              </View>
            </>
          )}
        </Card>
      </ScrollView>

      <AccountEditModal
        account={editingAccount}
        isUpdating={isUpdating}
        onSave={handleSave}
        onClose={() => setEditingAccount(null)}
      />
    </SafeAreaView>
  );
}
