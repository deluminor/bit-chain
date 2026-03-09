import {
  buildDefaultAccountName,
  getSessionUser,
  mapIntegrationAccountResponse,
} from '@/features/integrations/services/monobank-connect.service';
import {
  fetchMonobankClientInfo,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
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

    const accounts = mapIntegrationAccountResponse(updatedIntegration.accounts);

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
