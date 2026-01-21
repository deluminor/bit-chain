import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import { syncMonobankAccounts } from '@/lib/integrations/monobank-sync';

const prisma = new PrismaClient();

async function getUserFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

const parseFromDate = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  if (date > now) {
    return now;
  }

  return date;
};

const parseSyncPayload = async (request: Request) => {
  try {
    const body = (await request.json()) as {
      reason?: string;
      fromDate?: string;
      force?: boolean;
    };

    return {
      reason: body?.reason ?? null,
      fromDate: parseFromDate(body?.fromDate ?? null),
      force: Boolean(body?.force),
    };
  } catch {
    return { reason: null, fromDate: null, force: false };
  }
};

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await parseSyncPayload(request);

    const token = process.env.MONO_API;
    if (!token) {
      return NextResponse.json({ error: 'Monobank token is not configured' }, { status: 500 });
    }
    const result = await syncMonobankAccounts({
      prisma,
      userId: user.id,
      token,
      payload,
      maxAccountsPerRun: 1, // Limit to 1 account per run to avoid serverless timeouts
      throttleMs: 65_000,
    });

    if (result.skipped && result.skipReason === 'rate_limit') {
      return NextResponse.json(
        {
          skipped: true,
          reason: 'rate_limit',
          nextAllowedAt: result.nextAllowedAt,
          message: 'Monobank rate limit hit. Try again in 60 seconds.',
        },
        { status: 429 },
      );
    }

    if (result.skipped && result.skipReason === 'no_accounts') {
      return NextResponse.json({ skipped: true, reason: 'no_accounts' });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing Monobank transactions:', error);
    return NextResponse.json({ error: 'Failed to sync Monobank data' }, { status: 500 });
  }
}
