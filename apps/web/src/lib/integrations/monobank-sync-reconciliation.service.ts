import type { PrismaClient } from '@/generated/prisma';
import {
  fetchMonobankClientInfo,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import type { IntegrationAccountShape } from './monobank-sync.types';

type ReconciliationParams = {
  prisma: PrismaClient;
  token: string;
  accounts: readonly IntegrationAccountShape[];
};

/**
 * Reconciles local balances with current balances from Monobank API.
 * Failing reconciliation is non-blocking for transactions sync.
 */
export async function reconcileMonobankBalances({
  prisma,
  token,
  accounts,
}: ReconciliationParams): Promise<void> {
  try {
    const clientInfo = await fetchMonobankClientInfo(token);
    const balanceMap = new Map<string, number>();

    const processAccount = (account: { id: string; currencyCode: number; balance: number }) => {
      const currency = mapCurrencyCode(account.currencyCode);
      const normalized = normalizeMonobankAmount(account.balance, currency);
      balanceMap.set(account.id, normalized);
    };

    clientInfo.accounts.forEach(processAccount);
    clientInfo.managedClients?.forEach(client => client.accounts.forEach(processAccount));

    for (const account of accounts) {
      const correctBalance = balanceMap.get(account.providerAccountId);
      if (correctBalance === undefined) {
        continue;
      }

      await prisma.integrationAccount.update({
        where: { id: account.id },
        data: { balance: correctBalance },
      });

      if (account.financeAccountId) {
        await prisma.financeAccount.update({
          where: { id: account.financeAccountId },
          data: { balance: correctBalance },
        });
      }
    }
  } catch (error) {
    console.error('Failed to perform balance reconciliation:', error);
  }
}
