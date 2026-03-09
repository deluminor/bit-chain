import type { LoanItem } from '@bit-chain/api-contracts';
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
import { CURRENCIES, DEFAULT_LOAN_FORM, LOAN_TYPES } from './_constants';
import { formStyles, styles } from './_styles';

export function getLoanStatus(loan: LoanItem): { label: string; color: string } {
  const isPaid = loan.paidAmount >= loan.totalAmount;
  if (isPaid) return { label: 'Paid', color: colors.success };
  if (loan.dueDate && new Date(loan.dueDate) < new Date()) {
    return { label: 'Overdue', color: colors.expense };
  }
  return { label: 'Active', color: colors.brand };
}

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.min(Math.max(progress, 0), 100);
  const barColor = pct >= 100 ? colors.success : pct >= 70 ? colors.brand : colors.income;
  return (
    <View style={styles.progressTrack}>
      <View
        style={[styles.progressFill, { width: `${pct}%` as `${number}%`, backgroundColor: barColor }]}
      />
    </View>
  );
}

export function LoanCard({
  loan,
  onEdit,
  onDelete,
  onRepay,
}: {
  loan: LoanItem;
  onEdit: (loan: LoanItem) => void;
  onDelete: (id: string) => void;
  onRepay: (loan: LoanItem) => void;
}) {
  const remaining = loan.totalAmount - loan.paidAmount;
  const progress = loan.totalAmount > 0 ? (loan.paidAmount / loan.totalAmount) * 100 : 0;
  const status = getLoanStatus(loan);
  const isLoan = loan.type === 'LOAN';

  const dueDateLabel = loan.dueDate
    ? new Date(loan.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No due date';

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: isLoan ? colors.income : colors.expense, borderLeftWidth: 3 },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardName} numberOfLines={1}>{loan.name}</Text>
          {loan.lender ? (
            <Text style={styles.cardLender} numberOfLines={1}>
              {isLoan ? 'To: ' : 'From: '}{loan.lender}
            </Text>
          ) : null}
        </View>
        <View style={styles.cardBadgeRow}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: isLoan ? colors.incomeSubtle : colors.errorSubtle },
            ]}
          >
            <Text style={[styles.typeBadgeText, { color: isLoan ? colors.income : colors.expense }]}>
              {isLoan ? 'LOAN' : 'DEBT'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.bgMuted }]}>
            <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.amountRow}>
        <View>
          <Text style={styles.amountLabel}>Remaining</Text>
          <Text style={[styles.amountValue, { color: isLoan ? colors.income : colors.expense }]}>
            {formatCurrency(remaining, loan.currency)}
          </Text>
        </View>
        <View style={styles.amountDivider} />
        <View>
          <Text style={styles.amountLabel}>Total</Text>
          <Text style={styles.amountValueMuted}>{formatCurrency(loan.totalAmount, loan.currency)}</Text>
        </View>
        {loan.interestRate ? (
          <>
            <View style={styles.amountDivider} />
            <View>
              <Text style={styles.amountLabel}>Interest</Text>
              <Text style={styles.amountValueMuted}>{loan.interestRate}%</Text>
            </View>
          </>
        ) : null}
      </View>

      <ProgressBar progress={progress} />
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>Paid: {formatCurrency(loan.paidAmount, loan.currency)}</Text>
        <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.dueDate, { color: status.label === 'Overdue' ? colors.expense : colors.textMuted }]}>
          {dueDateLabel}
        </Text>
        <View style={styles.cardActions}>
          {status.label !== 'Paid' && (
            <Pressable style={styles.actionBtn} onPress={() => onRepay(loan)} hitSlop={8}>
              <Text style={styles.actionBtnText}>💰</Text>
            </Pressable>
          )}
          <Pressable style={styles.actionBtn} onPress={() => onEdit(loan)} hitSlop={8}>
            <Text style={styles.actionBtnText}>✎</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnDestructive]}
            onPress={() => onDelete(loan.id)}
            hitSlop={8}
          >
            <Text style={[styles.actionBtnText, { color: colors.expense }]}>✕</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function LoanForm({
  visible,
  initial,
  onClose,
  onSubmit,
  isLoading,
}: {
  visible: boolean;
  initial?: LoanItem | null;
  onClose: () => void;
  onSubmit: (data: typeof DEFAULT_LOAN_FORM) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<typeof DEFAULT_LOAN_FORM>(DEFAULT_LOAN_FORM);

  useEffect(() => {
    if (visible) {
      setForm(
        initial
          ? {
              name: initial.name,
              type: initial.type,
              totalAmount: String(initial.totalAmount),
              currency: initial.currency,
              paidAmount: String(initial.paidAmount),
              dueDate: initial.dueDate ? (initial.dueDate.split('T')[0] ?? '') : '',
              lender: initial.lender ?? '',
              notes: initial.notes ?? '',
              interestRate: initial.interestRate != null ? String(initial.interestRate) : '',
            }
          : DEFAULT_LOAN_FORM,
      );
    }
  }, [visible, initial]);

  const set = useCallback(
    (key: keyof typeof DEFAULT_LOAN_FORM) => (value: string) =>
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
            <Text style={formStyles.title}>{initial ? 'Edit Record' : 'New Record'}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={formStyles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={formStyles.scroll}
            contentContainerStyle={formStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {!initial && (
              <>
                <Text style={formStyles.label}>Type *</Text>
                <View style={formStyles.typeRow}>
                  {LOAN_TYPES.map(t => (
                    <Pressable
                      key={t.key}
                      style={[formStyles.typeBtn, form.type === t.key && formStyles.typeBtnActive]}
                      onPress={() => setForm(f => ({ ...f, type: t.key }))}
                    >
                      <Text
                        style={[
                          formStyles.typeBtnLabel,
                          form.type === t.key && formStyles.typeBtnLabelActive,
                        ]}
                      >
                        {t.label}
                      </Text>
                      <Text
                        style={[
                          formStyles.typeBtnDesc,
                          form.type === t.key && formStyles.typeBtnDescActive,
                        ]}
                      >
                        {t.desc}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Text style={formStyles.label}>Name *</Text>
            <TextInput
              style={formStyles.input}
              value={form.name}
              onChangeText={set('name')}
              placeholder="e.g. Car Loan"
              placeholderTextColor={colors.textDisabled}
              maxLength={100}
            />

            <Text style={formStyles.label}>Total Amount *</Text>
            <View style={formStyles.row}>
              <TextInput
                style={[formStyles.input, { flex: 1 }]}
                value={form.totalAmount}
                onChangeText={set('totalAmount')}
                placeholder="5000"
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
                    <Text style={[formStyles.chipText, form.currency === c && formStyles.chipTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <Text style={formStyles.label}>Paid Amount</Text>
            <TextInput
              style={formStyles.input}
              value={form.paidAmount}
              onChangeText={set('paidAmount')}
              placeholder="0"
              placeholderTextColor={colors.textDisabled}
              keyboardType="decimal-pad"
            />

            <Text style={formStyles.label}>Due Date (YYYY-MM-DD)</Text>
            <TextInput
              style={formStyles.input}
              value={form.dueDate}
              onChangeText={set('dueDate')}
              placeholder="2025-12-31"
              placeholderTextColor={colors.textDisabled}
            />

            <Text style={formStyles.label}>{form.type === 'LOAN' ? 'Borrower' : 'Lender'}</Text>
            <TextInput
              style={formStyles.input}
              value={form.lender}
              onChangeText={set('lender')}
              placeholder="Person or institution name"
              placeholderTextColor={colors.textDisabled}
              maxLength={100}
            />

            <Text style={formStyles.label}>Interest Rate (%)</Text>
            <TextInput
              style={formStyles.input}
              value={form.interestRate}
              onChangeText={set('interestRate')}
              placeholder="0"
              placeholderTextColor={colors.textDisabled}
              keyboardType="decimal-pad"
            />

            <Text style={formStyles.label}>Notes</Text>
            <TextInput
              style={[formStyles.input, { height: 80 }]}
              value={form.notes}
              onChangeText={set('notes')}
              placeholder="Optional notes..."
              placeholderTextColor={colors.textDisabled}
              multiline
              maxLength={500}
            />
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
                <Text style={formStyles.submitText}>{initial ? 'Save Changes' : 'Add Record'}</Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
