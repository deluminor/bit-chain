import type { GoalItem } from '@bit-chain/api-contracts';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '~/src/design/tokens';
import { formatCurrency } from '~/src/utils/format';
import { COLOR_SWATCHES, CURRENCIES, DEFAULT_GOAL_FORM } from './_constants';
import { formStyles, styles } from './_styles';

export function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(Math.max(progress, 0), 100)}%` as `${number}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddFunds,
}: {
  goal: GoalItem;
  onEdit: (goal: GoalItem) => void;
  onDelete: (id: string) => void;
  onAddFunds: (goal: GoalItem) => void;
}) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const deadlineLabel =
    daysLeft === null
      ? 'No deadline'
      : daysLeft < 0
        ? 'Overdue'
        : daysLeft === 0
          ? 'Due today'
          : `${daysLeft}d left`;

  const deadlineColor = daysLeft !== null && daysLeft <= 0 ? colors.expense : colors.textMuted;

  return (
    <View style={[styles.card, { borderLeftColor: goal.color, borderLeftWidth: 3 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>{goal.icon}</Text>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.cardName} numberOfLines={1}>
              {goal.name}
            </Text>
            {goal.description ? (
              <Text style={styles.cardDesc} numberOfLines={1}>
                {goal.description}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.cardBadge}>
          <Text
            style={[
              styles.cardBadgeText,
              { color: goal.isCompleted ? colors.success : colors.brand },
            ]}
          >
            {goal.isCompleted ? 'Done' : 'Active'}
          </Text>
        </View>
      </View>

      <ProgressBar progress={progress} color={goal.color} />
      <View style={styles.cardProgressRow}>
        <Text style={styles.cardAmounts}>
          {formatCurrency(goal.currentAmount, goal.currency)} /{' '}
          {formatCurrency(goal.targetAmount, goal.currency)}
        </Text>
        <Text style={styles.cardPercent}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.cardDeadline, { color: deadlineColor }]}>{deadlineLabel}</Text>
        <View style={styles.cardActions}>
          {!goal.isCompleted && (
            <Pressable style={styles.actionBtn} onPress={() => onAddFunds(goal)} hitSlop={8}>
              <Text style={styles.actionBtnText}>+$</Text>
            </Pressable>
          )}
          <Pressable style={styles.actionBtn} onPress={() => onEdit(goal)} hitSlop={8}>
            <Text style={styles.actionBtnText}>✎</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnDestructive]}
            onPress={() => onDelete(goal.id)}
            hitSlop={8}
          >
            <Text style={[styles.actionBtnText, { color: colors.expense }]}>✕</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function GoalForm({
  visible,
  initial,
  onClose,
  onSubmit,
  isLoading,
}: {
  visible: boolean;
  initial?: GoalItem | null;
  onClose: () => void;
  onSubmit: (data: typeof DEFAULT_GOAL_FORM) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<typeof DEFAULT_GOAL_FORM>(DEFAULT_GOAL_FORM);

  useEffect(() => {
    if (visible) {
      setForm(
        initial
          ? {
              name: initial.name,
              description: initial.description ?? '',
              targetAmount: String(initial.targetAmount),
              currentAmount: String(initial.currentAmount),
              currency: initial.currency,
              deadline: initial.deadline ? (initial.deadline.split('T')[0] ?? '') : '',
              color: initial.color as string,
              icon: initial.icon,
            }
          : DEFAULT_GOAL_FORM,
      );
    }
  }, [visible, initial]);

  const set = useCallback(
    (key: keyof typeof DEFAULT_GOAL_FORM) => (value: string) =>
      setForm(f => ({ ...f, [key]: value })),
    [],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={formStyles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={formStyles.safe} edges={['top', 'left', 'right', 'bottom']}>
          <View style={formStyles.header}>
            <Text style={formStyles.title}>{initial ? 'Edit Goal' : 'New Goal'}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={formStyles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={formStyles.scroll}
            contentContainerStyle={formStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={formStyles.label}>Icon</Text>
            <TextInput
              style={formStyles.input}
              value={form.icon}
              onChangeText={set('icon')}
              placeholder="🎯"
              placeholderTextColor={colors.textDisabled}
              maxLength={4}
            />

            <Text style={formStyles.label}>Goal Name *</Text>
            <TextInput
              style={formStyles.input}
              value={form.name}
              onChangeText={set('name')}
              placeholder="e.g. Emergency Fund"
              placeholderTextColor={colors.textDisabled}
              maxLength={100}
            />

            <Text style={formStyles.label}>Description</Text>
            <TextInput
              style={[formStyles.input, { height: 72 }]}
              value={form.description}
              onChangeText={set('description')}
              placeholder="Optional description..."
              placeholderTextColor={colors.textDisabled}
              multiline
              maxLength={500}
            />

            <Text style={formStyles.label}>Target Amount *</Text>
            <View style={formStyles.row}>
              <TextInput
                style={[formStyles.input, { flex: 1 }]}
                value={form.targetAmount}
                onChangeText={set('targetAmount')}
                placeholder="10000"
                placeholderTextColor={colors.textDisabled}
                keyboardType="decimal-pad"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={formStyles.currencyRow}
                contentContainerStyle={{ gap: 6 }}
              >
                {CURRENCIES.map(c => (
                  <Pressable
                    key={c}
                    style={[formStyles.chip, form.currency === c && formStyles.chipActive]}
                    onPress={() => set('currency')(c)}
                  >
                    <Text
                      style={[
                        formStyles.chipText,
                        form.currency === c && formStyles.chipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <Text style={formStyles.label}>Current Amount</Text>
            <TextInput
              style={formStyles.input}
              value={form.currentAmount}
              onChangeText={set('currentAmount')}
              placeholder="0"
              placeholderTextColor={colors.textDisabled}
              keyboardType="decimal-pad"
            />

            <Text style={formStyles.label}>Deadline (YYYY-MM-DD)</Text>
            <TextInput
              style={formStyles.input}
              value={form.deadline}
              onChangeText={set('deadline')}
              placeholder="2025-12-31"
              placeholderTextColor={colors.textDisabled}
            />

            <Text style={formStyles.label}>Color</Text>
            <View style={formStyles.swatchRow}>
              {COLOR_SWATCHES.map(c => (
                <Pressable
                  key={c}
                  style={[
                    formStyles.swatch,
                    { backgroundColor: c },
                    form.color === c && formStyles.swatchSelected,
                  ]}
                  onPress={() => set('color')(c)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={formStyles.footer}>
            <Pressable
              style={[formStyles.submitBtn, isLoading && { opacity: 0.6 }]}
              onPress={() => onSubmit(form)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={formStyles.submitText}>
                  {initial ? 'Save Changes' : 'Create Goal'}
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
