import type { Prisma } from '@/generated/prisma';
import {
  fetchMonobankStatement,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import { classifyMonobankStatement } from '@/lib/integrations/monobank-mapping';
import {
  buildTransactionDescription,
  buildTransferExternalId,
  isIntermediateTransfer,
  normalizeText,
  resolveTransferCounterAccount,
} from './monobank-sync.helpers';
import type {
  CategoryType,
  IntegrationAccountShape,
  SyncCategoryResolver,
  SyncableIntegrationAccount,
} from './monobank-sync.types';

type MonobankStatement = Awaited<ReturnType<typeof fetchMonobankStatement>>[number];

type MapStatementsParams = {
  userId: string;
  account: SyncableIntegrationAccount;
  integrationAccounts: readonly IntegrationAccountShape[];
  statements: readonly MonobankStatement[];
  categories: SyncCategoryResolver;
};

const resolveFallbackCategoryId = (
  type: CategoryType,
  categories: SyncCategoryResolver,
): string => {
  if (type === 'INCOME') {
    return categories.incomeCategoryId;
  }

  if (type === 'TRANSFER') {
    return categories.transferCategoryId;
  }

  return categories.expenseCategoryId;
};

const mapTransferStatement = (params: {
  userId: string;
  account: SyncableIntegrationAccount;
  integrationAccounts: readonly IntegrationAccountShape[];
  statement: MonobankStatement;
  accountCurrency: string;
  operationCurrency: string;
  amount: number;
  operationAmount: number | null;
  categoryId: string;
  baseDescription: string;
  normalizedText: string;
}): Prisma.TransactionCreateManyInput | null => {
  const {
    userId,
    account,
    integrationAccounts,
    statement,
    accountCurrency,
    operationCurrency,
    amount,
    operationAmount,
    categoryId,
    baseDescription,
    normalizedText,
  } = params;

  const counterAccount = resolveTransferCounterAccount({
    text: normalizedText,
    counterIban: statement.counterIban ?? null,
    operationCurrency,
    currentAccountId: account.id,
    accounts: integrationAccounts,
  });
  const isIncoming = statement.amount > 0;
  const sourceAccount = isIncoming ? counterAccount : account;
  const destinationAccount = isIncoming ? account : counterAccount;
  const resolvedSourceAccount = sourceAccount?.financeAccountId ? sourceAccount : account;
  const resolvedDestinationAccount = destinationAccount?.financeAccountId
    ? destinationAccount
    : null;

  if (
    resolvedDestinationAccount &&
    isIntermediateTransfer({
      text: normalizedText,
      sourceAccount: resolvedSourceAccount,
      destinationAccount: resolvedDestinationAccount,
    })
  ) {
    return null;
  }

  const sourceCurrency = resolvedSourceAccount.currency ?? accountCurrency;
  const destinationCurrency = resolvedDestinationAccount?.currency ?? accountCurrency;
  const sourceAmount =
    resolvedSourceAccount.id === account.id ? amount : (operationAmount ?? amount);
  const destinationAmount =
    resolvedDestinationAccount?.id === account.id ? amount : (operationAmount ?? amount);
  const sourceAccountId = resolvedSourceAccount.financeAccountId ?? account.financeAccountId;
  const destinationAccountId = resolvedDestinationAccount?.financeAccountId ?? null;
  const isSameAccount = destinationAccountId === sourceAccountId;

  const descriptionParts = [baseDescription];
  if (resolvedDestinationAccount) {
    descriptionParts.push(
      `Transfer ${resolvedSourceAccount.name} -> ${resolvedDestinationAccount.name}`,
    );
  } else {
    descriptionParts.push(`Transfer from ${resolvedSourceAccount.name}`);
  }

  const transferExternalId =
    resolvedDestinationAccount && destinationAccountId
      ? buildTransferExternalId({
          sourceAccountId: resolvedSourceAccount.id,
          destinationAccountId: resolvedDestinationAccount.id,
          amount: sourceAmount,
          currency: sourceCurrency,
          time: statement.time,
          destinationCurrency,
        })
      : statement.id;

  return {
    userId,
    accountId: sourceAccountId,
    categoryId,
    type: 'TRANSFER',
    amount: sourceAmount,
    currency: sourceCurrency,
    description: descriptionParts.join(' | '),
    date: new Date(statement.time * 1000),
    tags: [],
    isRecurring: false,
    source: 'MONOBANK',
    externalId: transferExternalId,
    integrationAccountId: account.id,
    transferToId: isSameAccount ? null : destinationAccountId,
    transferAmount: isSameAccount ? null : destinationAmount,
    transferCurrency: isSameAccount ? null : destinationCurrency,
  };
};

/**
 * Maps Monobank statements into internal transaction records.
 */
export function mapMonobankStatementsToTransactions({
  userId,
  account,
  integrationAccounts,
  statements,
  categories,
}: MapStatementsParams): Prisma.TransactionCreateManyInput[] {
  return statements
    .map(statement => {
      const accountCurrency = account.currency;
      const operationCurrency = mapCurrencyCode(statement.currencyCode, accountCurrency);
      const absoluteAmount = Math.abs(statement.amount);
      const amount = normalizeMonobankAmount(absoluteAmount, accountCurrency);
      const operationAmountRaw = statement.operationAmount ?? null;
      const operationAmount =
        operationAmountRaw != null
          ? normalizeMonobankAmount(Math.abs(operationAmountRaw), operationCurrency)
          : null;

      const classification = classifyMonobankStatement({
        amount: statement.amount,
        mcc: statement.mcc ?? statement.originalMcc ?? null,
        description: statement.description,
        comment: statement.comment,
        counterName: statement.counterName,
      });

      const fallbackId = resolveFallbackCategoryId(classification.type, categories);
      const categoryId = categories.resolveCategoryId(
        classification.type,
        classification.categoryNames,
      );
      const resolvedCategoryId = categoryId || fallbackId;

      const baseDescription = buildTransactionDescription(
        statement.description,
        statement.comment,
        statement.counterName,
      );
      const normalizedText = normalizeText(baseDescription);

      if (classification.type === 'TRANSFER') {
        return mapTransferStatement({
          userId,
          account,
          integrationAccounts,
          statement,
          accountCurrency,
          operationCurrency,
          amount,
          operationAmount,
          categoryId: resolvedCategoryId,
          baseDescription,
          normalizedText,
        });
      }

      const description =
        operationAmount != null && operationCurrency !== accountCurrency
          ? `${baseDescription} (${operationCurrency} ${operationAmount})`
          : baseDescription;

      return {
        userId,
        accountId: account.financeAccountId,
        categoryId: resolvedCategoryId,
        type: classification.type,
        amount,
        currency: accountCurrency,
        description,
        date: new Date(statement.time * 1000),
        tags: [],
        isRecurring: false,
        source: 'MONOBANK',
        externalId: statement.id,
        integrationAccountId: account.id,
      } satisfies Prisma.TransactionCreateManyInput;
    })
    .filter((item): item is Prisma.TransactionCreateManyInput => item !== null)
    .filter(item => item.amount > 0);
}
