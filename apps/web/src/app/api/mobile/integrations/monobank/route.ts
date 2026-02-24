import { err, ok, type MonobankStatusResponse } from '@bit-chain/api-contracts';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/integrations/monobank
 *
 * Returns Monobank integration status with accounts list.
 *
 * @returns 200 MonobankStatusResponse
 * @returns 401 UNAUTHORIZED
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
      include: { accounts: { orderBy: { createdAt: 'asc' } } },
    });

    if (!integration) {
      const response: MonobankStatusResponse = {
        status: 'DISCONNECTED',
        connectedAt: null,
        lastSyncAt: null,
        hasToken: false,
        accounts: [],
        summary: { total: 0, enabled: 0 },
      };
      return NextResponse.json(ok(response), { status: 200 });
    }

    const accounts = integration.accounts.map((a) => ({
      id: a.id,
      externalId: a.providerAccountId,
      name: a.name,
      type: a.accountType,
      currency: a.currency,
      balance: a.balance,
      creditLimit: 0,
      importEnabled: a.importEnabled,
      owner: a.ownerType,
      maskedPan: a.maskedPan ? [a.maskedPan] : [],
      financeAccountId: a.financeAccountId,
    }));

    const response: MonobankStatusResponse = {
      status: integration.status,
      connectedAt: integration.createdAt.toISOString(),
      lastSyncAt: integration.lastSyncedAt?.toISOString() ?? null,
      hasToken: Boolean(integration.token),
      accounts,
      summary: {
        total: accounts.length,
        enabled: accounts.filter((a) => a.importEnabled).length,
      },
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/integrations/monobank] GET error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch integration status'), {
      status: 500,
    });
  }
}
