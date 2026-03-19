import { decrypt, isEncrypted } from '@/lib/encryption';
import { syncMonobankAccounts } from '@/lib/integrations/monobank-sync';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import {
  MonobankSyncRequestSchema,
  err,
  ok,
  type MonobankSyncResponse,
  type RateLimitResponse,
} from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/mobile/integrations/monobank/sync
 *
 * Triggers a Monobank transaction sync for the authenticated user.
 * Handles:
 * - Token decryption (supports both encrypted and legacy plain-text tokens)
 * - Rate limiting (65s throttle — Monobank API limit)
 * - 1 account per run to avoid serverless timeouts
 *
 * @returns 200 MonobankSyncResponse on success
 * @returns 400 NO_INTEGRATION if Monobank is not connected
 * @returns 401 UNAUTHORIZED
 * @returns 429 RateLimitResponse if rate limit hit
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

  const parsed = MonobankSyncRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid request body'),
      { status: 422 },
    );
  }

  try {
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
      select: { token: true },
    });

    if (!integration?.token) {
      return NextResponse.json(
        err('NO_INTEGRATION', 'Monobank is not connected. Please connect first.'),
        { status: 400 },
      );
    }

    // Support both encrypted (new) and plain-text (legacy) tokens
    const token = isEncrypted(integration.token)
      ? await decrypt(integration.token)
      : integration.token;

    const fromDate = parsed.data.fromDate ? new Date(parsed.data.fromDate) : null;

    const result = await syncMonobankAccounts({
      prisma,
      userId: user.id,
      token,
      payload: {
        reason: null,
        fromDate,
        force: parsed.data.force ?? false,
      },
      maxAccountsPerRun: 1,
      throttleMs: 65_000,
    });

    // Rate limit hit
    if (result.skipped && result.skipReason === 'rate_limit') {
      const rateLimitResponse: RateLimitResponse = {
        rateLimited: true,
        retryAfterSeconds: 65,
        message: 'Monobank rate limit hit. Try again in 65 seconds.',
      };
      return NextResponse.json(rateLimitResponse, { status: 429 });
    }

    // No enabled accounts to sync
    if (result.skipped && result.skipReason === 'no_accounts') {
      const response: MonobankSyncResponse = {
        synced: false,
        imported: 0,
        syncedAt: new Date().toISOString(),
        message: 'No enabled accounts to sync. Enable import for at least one account first.',
        remainingAccounts: 0,
      };
      return NextResponse.json(ok(response), { status: 200 });
    }

    const response: MonobankSyncResponse = {
      synced: true,
      imported: result.importedCount ?? 0,
      syncedAt: new Date().toISOString(),
      remainingAccounts: result.remainingAccounts ?? 0,
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/integrations/monobank/sync] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to sync Monobank data'), {
      status: 500,
    });
  }
}
