import { styles } from '@/route-modules/(app)/reports/_styles';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SummaryCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useReport } from '~/src/hooks/useReports';
import { PERIOD_OPTIONS, getPeriodRange, usePeriodStore } from '~/src/lib/period';
import { formatCurrency } from '~/src/utils/format';

export default function ReportsScreen() {
  const { period, setPeriod } = usePeriodStore();
  const { dateFrom, dateTo } = getPeriodRange(period);
  const { data, isLoading, isRefetching, refetch } = useReport({ dateFrom, dateTo });

  const [isExporting, setIsExporting] = useState(false);

  const currency = data?.baseCurrency ?? 'EUR';
  const netFlow = (data?.totalIncome ?? 0) - (data?.totalExpenses ?? 0);

  const handleExport = async () => {
    if (!data) {
      Alert.alert('No data', 'Wait for the report to load first.');
      return;
    }
    setIsExporting(true);
    try {
      const filename = `report_${data.dateFrom.slice(0, 10)}_${data.dateTo.slice(0, 10)}.json`;
      const json = JSON.stringify(data, null, 2);
      await Share.share({ title: filename, message: json });
    } catch {
      Alert.alert('Error', 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View
              style={[
                styles.headerTitleWrap,
                Platform.OS !== 'ios' && styles.headerTitleWrapAndroid,
              ]}
            >
              <Text style={styles.headerTitleText}>Reports</Text>
              <Text style={styles.headerSubtitleText}>
                {data
                  ? `${data.dateFrom.slice(0, 10)} – ${data.dateTo.slice(0, 10)}`
                  : 'Select a period'}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                style={[styles.headerBtn, isRefetching && { opacity: 0.5 }]}
                onPress={() => refetch()}
                disabled={isRefetching}
                hitSlop={8}
              >
                {isRefetching ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <Text style={styles.headerIcon}>↻</Text>
                )}
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={styles.periodWrap}>
        <FlatList
          data={[...PERIOD_OPTIONS]}
          keyExtractor={o => o.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodRow}
          renderItem={({ item: o }) => (
            <Pressable
              style={[styles.periodChip, period === o.key && styles.periodChipActive]}
              onPress={() => setPeriod(o.key)}
            >
              <Text
                style={[styles.periodChipText, period === o.key && styles.periodChipTextActive]}
              >
                {o.short}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SummaryCard
          metrics={[
            {
              label: 'Income',
              value: isLoading ? '…' : formatCurrency(data?.totalIncome ?? 0, currency),
              valueColor: colors.income,
            },
            {
              label: 'Expenses',
              value: isLoading ? '…' : formatCurrency(data?.totalExpenses ?? 0, currency),
              valueColor: colors.expense,
            },
            {
              label: 'Net',
              value: isLoading ? '…' : formatCurrency(Math.abs(netFlow), currency),
              valueColor: netFlow >= 0 ? colors.income : colors.expense,
            },
          ]}
        />

        {data && (
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{data.transactionCount}</Text>
              <Text style={styles.statLabel}>transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{data.byCategory.length}</Text>
              <Text style={styles.statLabel}>categories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{data.topTransactions.length}</Text>
              <Text style={styles.statLabel}>top entries</Text>
            </View>
          </View>
        )}

        <View style={styles.exportCard}>
          <View style={styles.exportIconRow}>
            <Text style={styles.exportEmoji}>📊</Text>
            <View style={styles.exportTextBlock}>
              <Text style={styles.exportTitle}>Export Report</Text>
              <Text style={styles.exportDesc}>
                Download all transactions, category breakdown, and summary for the selected period
                as a JSON file.
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.exportBtn, (isLoading || isExporting) && styles.exportBtnDisabled]}
            onPress={handleExport}
            disabled={isLoading || isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.exportBtnIcon}>⬇</Text>
                <Text style={styles.exportBtnText}>{isLoading ? 'Loading…' : 'Download JSON'}</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 The exported file includes income/expense totals, a breakdown by category, and up to
            10 top transactions for the selected period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
