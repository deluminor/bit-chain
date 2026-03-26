import { updateMobileAccountInputSchema } from '@/features/finance/services/accounts/account-domain.schemas';
import {
  AccountDomainError,
  listMobileAccounts,
  updateMobileAccount,
} from '@/features/finance/services/accounts/account-domain.service';
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
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const payload: AccountsListResponse = await listMobileAccounts(user.id, { includeInactive });
    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/accounts] fetch error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch accounts'), { status: 500 });
  }
}

/**
 * PATCH /api/mobile/accounts
 * Updates a non-Monobank account (name, balance, description, color).
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body: unknown = await request.json();
    const parsed = updateMobileAccountInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        err('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Invalid input'),
        { status: 400 },
      );
    }

    const updated = await updateMobileAccount(user.id, parsed.data);
    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    if (error instanceof AccountDomainError) {
      return NextResponse.json(err(error.code, error.message), { status: error.status });
    }
    console.error('[mobile/accounts] patch error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to update account'), { status: 500 });
  }
}
