import type { MonobankStatementItem } from '@/lib/integrations/monobank';
import {
  fetchMonobankServerSync,
  mapCurrencyCode,
  normalizeMonobankAmount,
  verifyMonobankWebhookSignature,
} from '@/lib/integrations/monobank';
import { buildSyncCategoryResolver } from '@/lib/integrations/monobank-sync-categories.service';
import { mapMonobankStatementsToTransactions } from '@/lib/integrations/monobank-sync-transaction-mapper';
import type { IntegrationAccountShape } from '@/lib/integrations/monobank-sync.types';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const SIGNATURE_HEADER = 'X-Sign';

type WebhookPayload = {
  type: string;
  data?: unknown;
};

/**
 * Monobank sends `data` with `account` (provider account id) and `statementItem` for StatementItem webhooks.
 */
function isMonobankStatementItemWebhookData(
  data: unknown,
): data is { account: string; statementItem: MonobankStatementItem } {
  if (data === null || typeof data !== 'object') {
    return false;
  }
  const record = data as Record<string, unknown>;
  if (typeof record.account !== 'string') {
    return false;
  }
  if (record.statementItem === null || typeof record.statementItem !== 'object') {
    return false;
  }
  return true;
}

/** Always returns 200 to prevent Monobank retries, except for signature verification failures. */
export async function POST(request: Request): Promise<Response> {
  const rawBody = Buffer.from(await request.arrayBuffer());
  const signatureHeader = request.headers.get(SIGNATURE_HEADER);

  if (!signatureHeader) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  let serverSync: Awaited<ReturnType<typeof fetchMonobankServerSync>> | null = null;
  try {
    serverSync = await fetchMonobankServerSync();
  } catch {
    // If we can't fetch the public key, fail closed
    return NextResponse.json({ error: 'Could not verify signature' }, { status: 503 });
  }

  const isValid = verifyMonobankWebhookSignature(rawBody, signatureHeader, serverSync.serverPubKey);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody.toString('utf-8')) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Only handle StatementItem events; acknowledge others silently
  if (payload.type !== 'StatementItem' || !isMonobankStatementItemWebhookData(payload.data)) {
    return NextResponse.json({ ok: true });
  }

  const { account: providerAccountId, statementItem } = payload.data;

  try {
    await processWebhookStatement(providerAccountId, statementItem);
  } catch (error) {
    console.error('[monobank-webhook] Failed to process statement:', {
      providerAccountId,
      statementId: statementItem.id,
      error,
    });
    // Return 200 so Monobank does not retry — we log the failure for investigation
  }

  return NextResponse.json({ ok: true });
}

async function processWebhookStatement(
  providerAccountId: string,
  statementItem: MonobankStatementItem,
): Promise<void> {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { providerAccountId },
    include: {
      integration: {
        include: { accounts: true },
      },
    },
  });

  if (!integrationAccount) {
    return;
  }

  if (!integrationAccount.importEnabled || !integrationAccount.financeAccountId) {
    return;
  }

  const { integration } = integrationAccount;
  const userId = integration.userId;
  const integrationAccounts = integration.accounts as IntegrationAccountShape[];

  const syncableAccount = {
    ...integrationAccount,
    financeAccountId: integrationAccount.financeAccountId,
  };

  const categories = await buildSyncCategoryResolver(prisma, userId);

  const transactionData = mapMonobankStatementsToTransactions({
    userId,
    account: syncableAccount,
    integrationAccounts,
    statements: [statementItem],
    categories,
  });

  if (transactionData.length > 0) {
    await prisma.transaction.createMany({
      data: transactionData,
      skipDuplicates: true,
    });
  }

  const currency = mapCurrencyCode(statementItem.currencyCode, integrationAccount.currency);
  const balance = normalizeMonobankAmount(statementItem.balance, currency);

  await Promise.all([
    prisma.financeAccount.update({
      where: { id: integrationAccount.financeAccountId },
      data: { balance },
    }),
    prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { balance, lastSyncedAt: new Date(statementItem.time * 1000) },
    }),
  ]);
}
