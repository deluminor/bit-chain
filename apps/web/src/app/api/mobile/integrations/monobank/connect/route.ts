import { err, ok, MonobankConnectRequestSchema, type MonobankConnectResponse } from '@bit-chain/api-contracts';
import { getMobileUser } from '@/lib/mobile-auth';
import { encrypt, decrypt, isEncrypted } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';
import {
  fetchMonobankClientInfo,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import { NextRequest, NextResponse } from 'next/server';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  black: 'Black Card',
  white: 'White Card',
  platinum: 'Platinum Card',
  iron: 'Iron Card',
  fop: 'FOP Account',
  eAid: 'eAid Card',
  mono: 'Monobank Account',
};

const buildDefaultAccountName = (
  accountType: string,
  maskedPan: string | null,
  iban: string | null,
  currency: string,
  ownerType: 'PERSONAL' | 'FOP',
  ownerName?: string | null
): string => {
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
};

/**
 * POST /api/mobile/integrations/monobank/connect
 *
 * Connects a Monobank account using a personal API token.
 * The token is encrypted with AES-256-GCM before persistence.
 * If no token is provided, attempts to re-connect using the stored (encrypted) token.
 *
 * @returns 200 MonobankConnectResponse with accounts list
 * @returns 400 NO_TOKEN if no token provided and none stored
 * @returns 401 UNAUTHORIZED
 * @returns 502 MONOBANK_API_ERROR if Monobank API call fails
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  let body: unknown;
  try {
    body = await request.json().catch(() => ({}));
  } catch {
    body = {};
  }

  const parsed = MonobankConnectRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid request body'),
      { status: 422 }
    );
  }

  try {
    // Resolve active token: provided in body OR decrypt stored token
    let activeToken: string | undefined = parsed.data.token;

    if (!activeToken) {
      const existing = await prisma.integration.findUnique({
        where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
        select: { token: true },
      });

      if (!existing?.token) {
        return NextResponse.json(
          err('NO_TOKEN', 'Monobank token is required for initial connection'),
          { status: 400 }
        );
      }

      // Handle both encrypted and legacy plain-text tokens
      activeToken = isEncrypted(existing.token)
        ? await decrypt(existing.token)
        : existing.token;
    }

    // Validate token by calling Monobank API
    let clientInfo: Awaited<ReturnType<typeof fetchMonobankClientInfo>>;
    try {
      clientInfo = await fetchMonobankClientInfo(activeToken);
    } catch {
      return NextResponse.json(
        err('MONOBANK_API_ERROR', 'Failed to validate token with Monobank API'),
        { status: 502 }
      );
    }

    // Encrypt and persist token
    const encryptedToken = await encrypt(activeToken);

    const integration = await prisma.integration.upsert({
      where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
      update: { status: 'CONNECTED', token: encryptedToken },
      create: {
        userId: user.id,
        provider: 'MONOBANK',
        status: 'CONNECTED',
        token: encryptedToken,
      },
    });

    // Upsert all accounts from Monobank response
    const accountEntries = [
      ...clientInfo.accounts.map((account) => ({
        account,
        ownerType: 'PERSONAL' as const,
        ownerName: clientInfo.name,
      })),
      ...(clientInfo.managedClients ?? []).flatMap((managed) =>
        managed.accounts.map((account) => ({
          account,
          ownerType: 'FOP' as const,
          ownerName: managed.name,
        }))
      ),
    ];

    for (const entry of accountEntries) {
      const currency = mapCurrencyCode(entry.account.currencyCode);
      const balance = normalizeMonobankAmount(entry.account.balance, currency);
      const maskedPan = entry.account.maskedPan?.[0] ?? null;
      const iban = entry.account.iban ?? null;

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
          name: buildDefaultAccountName(
            entry.account.type,
            maskedPan,
            iban,
            currency,
            entry.ownerType,
            entry.ownerName
          ),
          maskedPan,
          iban,
          currency,
          balance,
          accountType: entry.account.type,
        },
      });
    }

    const updatedIntegration = await prisma.integration.findUniqueOrThrow({
      where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
      include: { accounts: { orderBy: { createdAt: 'asc' } } },
    });

    const accounts = updatedIntegration.accounts.map((a) => ({
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

    const response: MonobankConnectResponse = {
      connected: true,
      accountsFound: accounts.length,
      accounts,
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/integrations/monobank/connect] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to connect Monobank'), { status: 500 });
  }
}
