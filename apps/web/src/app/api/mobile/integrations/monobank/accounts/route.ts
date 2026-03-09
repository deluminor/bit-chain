import type { Prisma } from '@/generated/prisma';
import { mapMonobankAccountType } from '@/lib/integrations/monobank';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import {
  err,
  MonobankAccountsUpdateRequestSchema,
  ok,
  type MonobankAccountsUpdateResponse,
} from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

async function buildUniqueAccountName(
  tx: Prisma.TransactionClient,
  userId: string,
  baseName: string,
  excludeId?: string | null,
): Promise<string> {
  const trimmed = baseName.trim();
  const base = trimmed.length > 0 ? trimmed : 'Monobank Account';
  let candidate = base;
  let suffix = 1;

  while (true) {
    const existing = await tx.financeAccount.findFirst({
      where: { userId, name: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) return candidate;

    candidate = suffix === 1 ? `${base} (Monobank)` : `${base} (Monobank ${suffix})`;
    suffix++;
  }
}

/**
 * PATCH /api/mobile/integrations/monobank/accounts
 *
 * Toggles import enabled/disabled status for one or more Monobank accounts.
 * When enabling import, automatically creates a linked FinanceAccount.
 * Preserves existing FinanceAccount names when updating.
 *
 * @returns 200 MonobankAccountsUpdateResponse
 * @returns 401 UNAUTHORIZED
 * @returns 404 INTEGRATION_NOT_FOUND | ACCOUNT_NOT_FOUND
 * @returns 422 VALIDATION_ERROR
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
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
    body = await request.json();
  } catch {
    return NextResponse.json(err('INVALID_JSON', 'Request body must be valid JSON'), {
      status: 400,
    });
  }

  const parsed = MonobankAccountsUpdateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid request body'),
      { status: 422 },
    );
  }

  try {
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
      include: { accounts: true },
    });

    if (!integration) {
      return NextResponse.json(err('INTEGRATION_NOT_FOUND', 'Monobank integration not found'), {
        status: 404,
      });
    }

    const accountMap = new Map(integration.accounts.map(a => [a.id, a]));

    for (const update of parsed.data.accounts) {
      const account = accountMap.get(update.accountId);
      if (!account) {
        return NextResponse.json(
          err('ACCOUNT_NOT_FOUND', `Account ${update.accountId} not found`),
          { status: 404 },
        );
      }

      await prisma.$transaction(async tx => {
        const baseName = update.name ?? account.name;
        let finalName = baseName;
        let financeAccountId = account.financeAccountId;

        if (financeAccountId) {
          finalName = await buildUniqueAccountName(tx, user.id, finalName, financeAccountId);
          await tx.financeAccount.update({
            where: { id: financeAccountId },
            data: { name: finalName },
          });
        }

        if (update.importEnabled && !financeAccountId) {
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
            importEnabled: update.importEnabled,
            financeAccountId,
          },
        });
      });
    }

    const updated = await prisma.integration.findUniqueOrThrow({
      where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
      include: { accounts: { orderBy: { createdAt: 'asc' } } },
    });

    const accounts = updated.accounts.map(a => ({
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

    const response: MonobankAccountsUpdateResponse = {
      updated: parsed.data.accounts.length,
      accounts,
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/integrations/monobank/accounts] PATCH error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to update accounts'), { status: 500 });
  }
}
