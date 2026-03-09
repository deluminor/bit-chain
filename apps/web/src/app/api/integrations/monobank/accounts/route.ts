import type { Prisma } from '@/generated/prisma';
import { mapMonobankAccountType } from '@/lib/integrations/monobank';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateAccountsSchema = z.object({
  accounts: z
    .array(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(80),
        importEnabled: z.boolean(),
      }),
    )
    .min(1),
});

async function getUserFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

type IntegrationAccountShape = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
  ownerType: 'PERSONAL' | 'FOP';
  importEnabled: boolean;
  financeAccountId: string | null;
};

const buildUniqueAccountName = async (
  tx: Prisma.TransactionClient,
  userId: string,
  baseName: string,
  excludeId?: string | null,
) => {
  const trimmedName = baseName.trim();
  const initialName = trimmedName.length > 0 ? trimmedName : 'Monobank Account';
  let candidate = initialName;
  let suffixIndex = 1;

  while (true) {
    const existing = await tx.financeAccount.findFirst({
      where: {
        userId,
        name: candidate,
      },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    const suffix = suffixIndex === 1 ? 'Monobank' : `Monobank ${suffixIndex}`;
    candidate = `${initialName} (${suffix})`;
    suffixIndex += 1;
  }
};

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

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const payload = updateAccountsSchema.parse(body);

    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'MONOBANK',
        },
      },
      include: {
        accounts: true,
      },
    });

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    const integrationAccounts = integration.accounts as IntegrationAccountShape[];
    const accountMap = new Map(integrationAccounts.map(account => [account.id, account]));

    for (const accountUpdate of payload.accounts) {
      const account = accountMap.get(accountUpdate.id);
      if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }

      await prisma.$transaction(async tx => {
        const normalizedName = accountUpdate.name.trim();
        let finalName = normalizedName || account.name;
        let financeAccountId = account.financeAccountId;

        if (financeAccountId) {
          finalName = await buildUniqueAccountName(tx, user.id, finalName, financeAccountId);
          await tx.financeAccount.update({
            where: { id: financeAccountId },
            data: {
              name: finalName,
            },
          });
        }

        if (accountUpdate.importEnabled && !financeAccountId) {
          finalName = await buildUniqueAccountName(tx, user.id, finalName);
          const financeAccount = await tx.financeAccount.create({
            data: {
              userId: user.id,
              name: finalName,
              type: mapMonobankAccountType(account.accountType),
              currency: account.currency,
              balance: account.balance,
              description:
                account.ownerType === 'FOP' ? 'Monobank FOP account' : 'Monobank account',
            },
          });
          financeAccountId = financeAccount.id;
        }

        await tx.integrationAccount.update({
          where: { id: account.id },
          data: {
            name: finalName,
            importEnabled: accountUpdate.importEnabled,
            financeAccountId,
          },
        });
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
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    return NextResponse.json(buildResponse(updatedIntegration));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating Monobank accounts:', error);
    return NextResponse.json({ error: 'Failed to update accounts' }, { status: 500 });
  }
}
