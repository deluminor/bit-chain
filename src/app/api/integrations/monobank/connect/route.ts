import { PrismaClient } from '@/generated/prisma';
import {
  fetchMonobankClientInfo,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

type IntegrationAccountShape = {
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

type IntegrationAccountResponse = {
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

async function getUserFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

const buildDefaultAccountName = (
  accountType: string,
  maskedPan: string | null,
  iban: string | null,
  currency: string,
  ownerType: 'PERSONAL' | 'FOP',
  ownerName?: string | null,
) => {
  const label = ACCOUNT_TYPE_LABELS[accountType] ?? 'Monobank Account';
  const details: string[] = [label];

  if (maskedPan) {
    const last4 = maskedPan.slice(-4);
    details.push(`**** ${last4}`);
  } else if (iban) {
    const last4 = iban.slice(-4);
    details.push(`IBAN ${last4}`);
  } else {
    details.push(currency);
  }

  if (ownerType === 'FOP' && ownerName) {
    details.unshift(`FOP ${ownerName}`);
  }

  return details.join(' - ');
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const token = body.token;

    if (!token) {
      // Check if we already have a token in DB (for reconnect cases without providing new token)
      const existingIntegration = await prisma.integration.findUnique({
        where: {
          userId_provider: {
            userId: user.id,
            provider: 'MONOBANK',
          },
        },
      });

      if (existingIntegration?.token) {
        // Use existing token
      } else {
        return NextResponse.json({ error: 'Monobank token is required' }, { status: 400 });
      }
    }

    // If we have a token (either new from body or env), use it to validate
    const activeToken =
      token ||
      (
        await prisma.integration.findUnique({
          where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
        })
      )?.token;

    if (!activeToken) {
      return NextResponse.json({ error: 'No token available' }, { status: 400 });
    }

    const clientInfo = await fetchMonobankClientInfo(activeToken);

    const integration = await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'MONOBANK',
        },
      },
      update: {
        status: 'CONNECTED',
        token: activeToken, // specific update to save token
      },
      create: {
        userId: user.id,
        provider: 'MONOBANK',
        status: 'CONNECTED',
        token: activeToken, // specific create to save token
      },
    });

    const accountEntries = [
      ...clientInfo.accounts.map(account => ({
        account,
        ownerType: 'PERSONAL' as const,
        ownerName: clientInfo.name,
      })),
      ...(clientInfo.managedClients ?? []).flatMap(managedClient =>
        managedClient.accounts.map(account => ({
          account,
          ownerType: 'FOP' as const,
          ownerName: managedClient.name,
        })),
      ),
    ];

    for (const entry of accountEntries) {
      const currency = mapCurrencyCode(entry.account.currencyCode);
      const balance = normalizeMonobankAmount(entry.account.balance, currency);
      const maskedPan = entry.account.maskedPan?.[0] ?? null;
      const iban = entry.account.iban ?? null;
      const defaultName = buildDefaultAccountName(
        entry.account.type,
        maskedPan,
        iban,
        currency,
        entry.ownerType,
        entry.ownerName,
      );

      await prisma.integrationAccount.upsert({
        where: {
          integrationId_providerAccountId: {
            integrationId: integration.id,
            providerAccountId: entry.account.id,
          },
        },
        update: {
          ownerType: entry.ownerType,
          ownerName: entry.ownerName,
          currency,
          balance,
          accountType: entry.account.type,
          maskedPan,
          iban,
        },
        create: {
          integrationId: integration.id,
          providerAccountId: entry.account.id,
          ownerType: entry.ownerType,
          ownerName: entry.ownerName,
          name: defaultName,
          maskedPan,
          iban,
          currency,
          balance,
          accountType: entry.account.type,
        },
      });
    }

    const updatedIntegration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'MONOBANK',
        },
      },
      include: {
        accounts: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!updatedIntegration) {
      return NextResponse.json({ error: 'Integration setup failed' }, { status: 500 });
    }

    const accounts: IntegrationAccountResponse[] = updatedIntegration.accounts.map(
      (account: IntegrationAccountShape) => ({
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
      }),
    );

    const enabledAccounts = accounts.filter(account => account.importEnabled).length;

    return NextResponse.json({
      integration: {
        id: updatedIntegration.id,
        provider: updatedIntegration.provider,
        status: updatedIntegration.status,
        lastSyncedAt: updatedIntegration.lastSyncedAt?.toISOString() ?? null,
        createdAt: updatedIntegration.createdAt.toISOString(),
        updatedAt: updatedIntegration.updatedAt.toISOString(),
      },
      accounts,
      summary: {
        totalAccounts: accounts.length,
        enabledAccounts,
      },
      hasEnabledAccounts: enabledAccounts > 0,
    });
  } catch (error) {
    console.error('Error connecting Monobank:', error);
    return NextResponse.json({ error: 'Failed to connect Monobank' }, { status: 500 });
  }
}
