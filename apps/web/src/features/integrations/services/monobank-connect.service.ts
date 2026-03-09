import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export type IntegrationAccountShape = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
  maskedPan: string | null;
  iban: string | null;
  ownerType: 'PERSONAL' | 'FOP';
  ownerName: string | null;
  importEnabled: boolean;
  financeAccountId: string | null;
  lastSyncedAt: Date | null;
};

export type IntegrationAccountResponse = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
  maskedPan: string | null;
  iban: string | null;
  ownerType: 'PERSONAL' | 'FOP';
  ownerName: string | null;
  importEnabled: boolean;
  financeAccountId: string | null;
  lastSyncedAt: string | null;
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  black: 'Black Card',
  white: 'White Card',
  platinum: 'Platinum Card',
  iron: 'Iron Card',
  fop: 'FOP Account',
  eAid: 'eAid Card',
  mono: 'Monobank Account',
};

export async function getSessionUser() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export function buildDefaultAccountName(
  accountType: string,
  maskedPan: string | null,
  iban: string | null,
  currency: string,
  ownerType: 'PERSONAL' | 'FOP',
  ownerName?: string | null,
): string {
  const label = ACCOUNT_TYPE_LABELS[accountType] ?? 'Monobank Account';
  const details: string[] = [label];

  if (maskedPan) {
    details.push(`**** ${maskedPan.slice(-4)}`);
  } else if (iban) {
    details.push(`IBAN ${iban.slice(-4)}`);
  } else {
    details.push(currency);
  }

  if (ownerType === 'FOP' && ownerName) {
    details.unshift(`FOP ${ownerName}`);
  }

  return details.join(' - ');
}

export function mapIntegrationAccountResponse(
  accounts: IntegrationAccountShape[],
): IntegrationAccountResponse[] {
  return accounts.map(account => ({
    id: account.id,
    name: account.name,
    currency: account.currency,
    balance: account.balance,
    accountType: account.accountType,
    maskedPan: account.maskedPan,
    iban: account.iban,
    ownerType: account.ownerType,
    ownerName: account.ownerName,
    importEnabled: account.importEnabled,
    financeAccountId: account.financeAccountId,
    lastSyncedAt: account.lastSyncedAt?.toISOString() ?? null,
  }));
}
