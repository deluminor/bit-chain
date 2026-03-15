import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

const buildResponse = (integration: {
  id: string;
  provider: 'MONOBANK';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  accounts: Array<{
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
  }>;
}) => {
  const accounts = integration.accounts.map(account => ({
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

  const enabledAccounts = accounts.filter(account => account.importEnabled).length;

  return {
    integration: {
      id: integration.id,
      provider: integration.provider,
      status: integration.status,
      lastSyncedAt: integration.lastSyncedAt?.toISOString() ?? null,
      createdAt: integration.createdAt.toISOString(),
      updatedAt: integration.updatedAt.toISOString(),
    },
    accounts,
    summary: {
      totalAccounts: accounts.length,
      enabledAccounts,
    },
    hasEnabledAccounts: enabledAccounts > 0,
  };
};

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integration = await prisma.integration.findUnique({
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

    if (!integration) {
      return NextResponse.json({
        integration: null,
        accounts: [],
        summary: {
          totalAccounts: 0,
          enabledAccounts: 0,
        },
        hasEnabledAccounts: false,
      });
    }

    return NextResponse.json(buildResponse(integration));
  } catch (error) {
    console.error('Error fetching Monobank integration:', error);
    return NextResponse.json({ error: 'Failed to fetch integration' }, { status: 500 });
  }
}
