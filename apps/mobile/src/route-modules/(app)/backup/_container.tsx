import { styles } from '@/route-modules/(app)/backup/_styles';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorScreen, LoadingScreen } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { exportBackupData, useBackupList, useCreateBackup } from '~/src/hooks/useBackup';

export default function BackupScreen() {
  const { data, isLoading, isRefetching, error, refetch } = useBackupList();
  const { mutateAsync: createBackup, isPending: isCreating } = useCreateBackup();

  const [isExporting, setIsExporting] = useState(false);

  const backups = data?.backups ?? [];

  const handleCreateBackup = async () => {
    try {
      const result = await createBackup();
      Alert.alert('Backup Created', `Backup saved successfully.\nFile: ${result.filename}`);
    } catch {
      Alert.alert('Error', 'Failed to create backup');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const json = await exportBackupData();
      await Share.share({ title: 'BitChain Export', message: json });
    } catch {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return <LoadingScreen label="Loading backups…" />;
  if (error) {
    return (
      <ErrorScreen
        message={error instanceof Error ? error.message : 'Failed to load'}
        onRetry={refetch}
      />
    );
  }

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
              <Text style={styles.headerTitleText}>Backup & Restore</Text>
              <Text style={styles.headerSubtitleText}>
                {backups.length > 0 ? `${backups.length} backups saved` : 'No backups yet'}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardEmoji}>💾</Text>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Create Backup</Text>
              <Text style={styles.cardDesc}>
                Save a full snapshot of your transactions, accounts, categories, goals, and loans.
              </Text>
            </View>
          </View>
          <Pressable
            style={[styles.actionBtn, isCreating && styles.actionBtnDisabled]}
            onPress={handleCreateBackup}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.actionBtnText}>Create Backup</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardEmoji}>📤</Text>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Export as JSON</Text>
              <Text style={styles.cardDesc}>
                Download all your data as a JSON file. You can use it to migrate or restore
                manually.
              </Text>
            </View>
          </View>
          <Pressable
            style={[
              styles.actionBtn,
              styles.actionBtnSecondary,
              isExporting && styles.actionBtnDisabled,
            ]}
            onPress={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.brand} size="small" />
            ) : (
              <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Export Data</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Saved Backups{backups.length > 0 ? ` (${backups.length})` : ''}
          </Text>

          {backups.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No backups yet. Create your first backup above.</Text>
            </View>
          ) : (
            backups.map((backup, index) => (
              <View key={backup.filename}>
                {index > 0 && <View style={styles.separator} />}
                <View style={styles.backupRow}>
                  <Text style={styles.backupIcon}>📁</Text>
                  <View style={styles.backupInfo}>
                    <Text style={styles.backupFilename} numberOfLines={1}>
                      {backup.filename}
                    </Text>
                    <Text style={styles.backupMeta}>
                      {new Date(backup.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {backup.sizeMb ? ` · ${backup.sizeMb} MB` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 Backups are stored on the server. To restore from a backup, contact support or use
            the web app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
