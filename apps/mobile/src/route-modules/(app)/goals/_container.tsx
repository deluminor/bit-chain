import { GoalCard, GoalForm } from '@/route-modules/(app)/goals/_components';
import { DEFAULT_GOAL_FORM } from '@/route-modules/(app)/goals/_constants';
import { styles } from '@/route-modules/(app)/goals/_styles';
import type { GoalItem } from '@bit-chain/api-contracts';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorScreen, LoadingScreen, SummaryCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal } from '~/src/hooks/useGoals';

export default function GoalsScreen() {
  const { data, isLoading, isRefetching, error, refetch } = useGoals();
  const { mutateAsync: createGoal, isPending: isCreating } = useCreateGoal();
  const { mutateAsync: updateGoal, isPending: isUpdating } = useUpdateGoal();
  const { mutateAsync: deleteGoal } = useDeleteGoal();

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

  const goals = [...(data?.goals ?? [])].sort((a, b) => b.targetAmount - a.targetAmount);
  const summary = data?.summary;

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEdit = (goal: GoalItem) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(id);
          } catch {
            Alert.alert('Error', 'Failed to delete goal');
          }
        },
      },
    ]);
  };

  const handleAddFunds = (goal: GoalItem) => {
    Alert.prompt(
      'Add Funds',
      `Enter amount to add to "${goal.name}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async (value?: string) => {
            const amount = parseFloat(value ?? '0');
            if (!amount || isNaN(amount) || amount <= 0) return;
            try {
              await updateGoal({ id: goal.id, currentAmount: goal.currentAmount + amount });
            } catch {
              Alert.alert('Error', 'Failed to add funds');
            }
          },
        },
      ],
      'plain-text',
      '',
      'decimal-pad',
    );
  };

  const handleSubmit = async (form: typeof DEFAULT_GOAL_FORM) => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Goal name is required');
      return;
    }
    const targetAmount = parseFloat(form.targetAmount);
    if (!targetAmount || targetAmount <= 0) {
      Alert.alert('Validation', 'Target amount must be greater than 0');
      return;
    }

    try {
      if (editingGoal) {
        await updateGoal({
          id: editingGoal.id,
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          targetAmount,
          currentAmount: parseFloat(form.currentAmount) || 0,
          currency: form.currency,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
          color: form.color,
          icon: form.icon.trim() || '🎯',
        });
      } else {
        await createGoal({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          targetAmount,
          currentAmount: parseFloat(form.currentAmount) || 0,
          currency: form.currency,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
          color: form.color,
          icon: form.icon.trim() || '🎯',
        });
      }
      setShowForm(false);
    } catch {
      Alert.alert('Error', 'Failed to save goal');
    }
  };

  if (isLoading) return <LoadingScreen label="Loading goals…" />;
  if (error) {
    return (
      <ErrorScreen
        message={error instanceof Error ? error.message : 'Failed to load goals'}
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
              <Text style={styles.headerTitleText}>Goals</Text>
              <Text style={styles.headerSubtitleText}>{goals.length} total</Text>
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
              <Pressable
                style={[styles.headerBtn, styles.headerBtnPrimary]}
                onPress={handleOpenCreate}
                hitSlop={8}
              >
                <Text style={[styles.headerIcon, styles.headerIconPrimary]}>+</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {summary && (
          <SummaryCard
            metrics={[
              { label: 'Active', value: String(summary.active), private: false },
              {
                label: 'Completed',
                value: String(summary.completed),
                valueColor: colors.success,
                private: false,
              },
              {
                label: 'Progress',
                value:
                  summary.totalTarget > 0
                    ? `${Math.round((summary.totalCurrent / summary.totalTarget) * 100)}%`
                    : '0%',
                valueColor: colors.brand,
                private: false,
              },
            ]}
          />
        )}

        {goals.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyText}>Create your first financial goal</Text>
            <Pressable style={styles.emptyBtn} onPress={handleOpenCreate}>
              <Text style={styles.emptyBtnText}>+ Create Goal</Text>
            </Pressable>
          </View>
        ) : (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddFunds={handleAddFunds}
            />
          ))
        )}
      </ScrollView>

      <GoalForm
        visible={showForm}
        initial={editingGoal}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />
    </SafeAreaView>
  );
}
