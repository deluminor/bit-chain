import { EXPENSE_RULES, INCOME_RULES, type CategoryRule } from './monobank-mapping.rules';
import {
  TRANSFER_EXCLUDE_KEYWORDS,
  TRANSFER_KEYWORDS,
  TRANSFER_MCC_KEYWORD,
  TRANSFER_MCC_STRICT,
} from './monobank-mapping.transfer';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const includesKeyword = (text: string, keywords: string[]) =>
  keywords.some(keyword => text.includes(keyword));

const isMccMatch = (mcc: number | null, rule: CategoryRule) => {
  if (!mcc) {
    return false;
  }

  if (rule.mcc?.includes(mcc)) {
    return true;
  }

  return !!rule.mccRanges?.some(([min, max]) => mcc >= min && mcc <= max);
};

const matchRules = (rules: CategoryRule[], mcc: number | null, text: string) => {
  for (const rule of rules) {
    if (isMccMatch(mcc, rule)) {
      return rule.names;
    }
  }

  for (const rule of rules) {
    if (rule.keywords && includesKeyword(text, rule.keywords)) {
      return rule.names;
    }
  }

  return null;
};

const detectTransfer = (mcc: number | null, text: string) => {
  if (TRANSFER_EXCLUDE_KEYWORDS.some(keyword => text.includes(keyword))) {
    return false;
  }

  if (mcc && TRANSFER_MCC_STRICT.has(mcc)) {
    return true;
  }

  if (mcc && TRANSFER_MCC_KEYWORD.has(mcc)) {
    return includesKeyword(text, TRANSFER_KEYWORDS);
  }

  return includesKeyword(text, TRANSFER_KEYWORDS);
};

export const classifyMonobankStatement = (input: {
  amount: number;
  mcc?: number | null;
  description?: string | null;
  comment?: string | null;
  counterName?: string | null;
}): { type: TransactionType; categoryNames: string[] } => {
  const text = normalizeText(
    [input.description, input.comment, input.counterName].filter(Boolean).join(' '),
  );
  const mcc = input.mcc ?? null;

  if (detectTransfer(mcc, text)) {
    return { type: 'TRANSFER', categoryNames: ['Transfer'] };
  }

  if (input.amount >= 0) {
    const matched = matchRules(INCOME_RULES, mcc, text);
    return { type: 'INCOME', categoryNames: matched ?? ['Other Income'] };
  }

  const matched = matchRules(EXPENSE_RULES, mcc, text);
  return { type: 'EXPENSE', categoryNames: matched ?? ['Other Expenses'] };
};
