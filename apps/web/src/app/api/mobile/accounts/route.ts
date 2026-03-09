import { listMobileAccounts } from '@/features/finance/services/accounts/account-domain.service';
import { getMobileUser } from '@/lib/mobile-auth';
import { err, ok, type AccountsListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

async function getAuthenticatedMobileUser(request: NextRequest): Promise<{ id: string } | null> {
  try {
    return await getMobileUser(request);
  } catch {
    return null;
  }
}

/**
 * GET /api/mobile/accounts
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const payload: AccountsListResponse = await listMobileAccounts(user.id);
    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/accounts] fetch error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch accounts'), { status: 500 });
  }
}
