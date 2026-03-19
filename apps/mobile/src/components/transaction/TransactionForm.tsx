import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '~/src/design/tokens';
import { useAccounts } from '~/src/hooks/useAccounts';
import { useCategories } from '~/src/hooks/useCategories';
import { useLoans } from '~/src/hooks/useLoans';
import { createTransactionSchema } from '~/src/hooks/useTransactions';
import { formatCurrency } from '~/src/utils/format';
import { formStyles as styles } from './_styles';
import type { TransactionFormProps, TransactionFormValues } from './_types';

export type { TransactionFormValues } from './_types';

export function TransactionForm({
  onSubmit,
  onDelete,
  initialValues,
  isSubmitting = false,
  submitLabel = 'Save Transaction',
  isDeleting = false,
}: TransactionFormProps) {
  const { data: accountsData } = useAccounts({ includeInactive: Boolean(initialValues?.id) });
  const { data: categoriesData } = useCategories();
  const { data: loansData } = useLoans(false);

  const accounts = accountsData?.accounts ?? [];
  const categories = categoriesData?.categories ?? [];
  const unpaidLoans = loansData?.loans ?? [];

  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>(
    initialValues?.type || 'EXPENSE',
  );

  const defaultAccountId = accounts?.[0]?.id || '';

  const [amount, setAmount] = useState(initialValues?.amount || '');
  const [accountId, setAccountId] = useState(initialValues?.accountId || '');
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId || '');
  const [transferToId, setTransferToId] = useState(initialValues?.transferToId || '');
  const [transferAmount, setTransferAmount] = useState(initialValues?.transferAmount || '');
  const [loanId, setLoanId] = useState(initialValues?.loanId || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const availableCategories = categories.filter(c => c.type === type);
  const selectedCategory = availableCategories.find(c => c.id === categoryId);
  const isLoanRepaymentCategory =
    selectedCategory?.isLoanRepayment === true ||
    selectedCategory?.name?.toLowerCase() === 'loan repayment';
  const showLoanSelect = type === 'EXPENSE' && isLoanRepaymentCategory && unpaidLoans.length > 0;

  const activeAccountId = accountId || defaultAccountId;
  const fromAccount = accounts.find(a => a.id === activeAccountId);
  const toAccount = accounts.find(a => a.id === transferToId);
  const isCrossCurrency =
    type === 'TRANSFER' &&
    !!toAccount &&
    !!fromAccount &&
    toAccount.currency !== fromAccount.currency;

  useEffect(() => {
    if (availableCategories.length === 0) {
      if (categoryId) setCategoryId('');
      if (loanId) setLoanId('');
      return;
    }

    const stillValid = availableCategories.some(category => category.id === categoryId);
    if (!stillValid) {
      setCategoryId(availableCategories[0]!.id);
      setLoanId('');
    }
  }, [availableCategories, categoryId, loanId]);

  useEffect(() => {
    if (!showLoanSelect && loanId) {
      setLoanId('');
    }
  }, [showLoanSelect, loanId]);

  const parseAmountInput = (raw: string): number => {
    const normalized = raw.replace(/\s+/g, '').replace(',', '.');
    return parseFloat(normalized);
  };

  const handleSubmit = () => {
    // Validate with Zod
    const parsedTransferAmount = transferAmount.trim()
      ? parseAmountInput(transferAmount)
      : undefined;

    if (showLoanSelect && !loanId) {
      Alert.alert('Validation Error', 'Please select a loan to attribute this repayment to.');
      return;
    }

    const payload = {
      type,
      amount: parseAmountInput(amount),
      accountId: accountId || defaultAccountId,
      categoryId: type === 'TRANSFER' ? undefined : categoryId || undefined,
      transferToId: type === 'TRANSFER' ? transferToId : undefined,
      transferAmount: parsedTransferAmount,
      transferCurrency: parsedTransferAmount ? toAccount?.currency : undefined,
      loanId: showLoanSelect && loanId ? loanId : undefined,
      description: description.trim() || undefined,
      date: initialValues?.date || new Date(),
    };

    const validateResult = createTransactionSchema.safeParse(payload);

    if (!validateResult.success) {
      const errorMsg = validateResult.error.errors.map(e => e.message).join('\n');
      Alert.alert('Validation Error', errorMsg);
      return;
    }

    if (initialValues?.id) {
      onSubmit({ ...validateResult.data, id: initialValues.id });
    } else {
      onSubmit(validateResult.data);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Type Selector */}
        <View style={styles.typeRow}>
          {['EXPENSE', 'INCOME', 'TRANSFER'].map(t => (
            <Pressable
              key={t}
              style={[styles.typeBtn, type === t && styles.typeBtnActive]}
              onPress={() => setType(t as TransactionFormValues['type'])}
            >
              <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{type === 'TRANSFER' ? 'From Account' : 'Account'}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {accounts.map(acc => (
              <Pressable
                key={acc.id}
                style={[styles.chip, activeAccountId === acc.id && styles.chipActive]}
                onPress={() => setAccountId(acc.id)}
              >
                <Text
                  style={[styles.chipText, activeAccountId === acc.id && styles.chipTextActive]}
                >
                  {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Transfer Destination */}
        {type === 'TRANSFER' ? (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>To Account</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {accounts
                .filter(a => a.id !== activeAccountId)
                .map(acc => (
                  <Pressable
                    key={acc.id}
                    style={[styles.chip, transferToId === acc.id && styles.chipActive]}
                    onPress={() => setTransferToId(acc.id)}
                  >
                    <Text
                      style={[styles.chipText, transferToId === acc.id && styles.chipTextActive]}
                    >
                      {acc.name}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        ) : null}

        {type !== 'TRANSFER' ? (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {availableCategories.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[styles.chip, categoryId === cat.id && styles.chipActive]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text style={[styles.chipText, categoryId === cat.id && styles.chipTextActive]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
              {availableCategories.length === 0 && (
                <Text style={styles.emptyText}>No categories found</Text>
              )}
            </ScrollView>
          </View>
        ) : null}

        {showLoanSelect && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Apply to Loan</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {unpaidLoans.map(loan => (
                <Pressable
                  key={loan.id}
                  style={[styles.chip, loanId === loan.id && styles.chipActive]}
                  onPress={() => setLoanId(loan.id)}
                >
                  <Text
                    style={[styles.chipText, loanId === loan.id && styles.chipTextActive]}
                    numberOfLines={1}
                  >
                    {loan.name} ({formatCurrency(loan.totalAmount - loan.paidAmount, loan.currency)}{' '}
                    left)
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {isCrossCurrency && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Received Amount ({toAccount?.currency})</Text>
            <TextInput
              style={styles.input}
              placeholder={`0.00 ${toAccount?.currency ?? ''}`}
              placeholderTextColor={colors.textDisabled}
              keyboardType="decimal-pad"
              value={transferAmount}
              onChangeText={setTransferAmount}
              editable={!isSubmitting}
            />
            <Text style={styles.fieldHint}>
              How much was credited to {toAccount?.name}? Leave blank if the same amount.
            </Text>
          </View>
        )}

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What was this for?"
            placeholderTextColor={colors.textDisabled}
            value={description}
            onChangeText={setDescription}
            editable={!isSubmitting}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.btn, isSubmitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || isDeleting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.btnText}>{submitLabel}</Text>
          )}
        </Pressable>

        {onDelete && (
          <Pressable
            style={[styles.deleteBtn, isDeleting && styles.btnDisabled]}
            onPress={() => {
              Alert.alert(
                'Delete Transaction',
                'Are you sure you want to delete this transaction?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: onDelete },
                ],
              );
            }}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color={colors.expense} />
            ) : (
              <Text style={styles.deleteBtnText}>Delete Transaction</Text>
            )}
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
