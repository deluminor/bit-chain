import { authOptions } from '@/features/auth/libs/auth';
import {
  createWebAccountInputSchema,
  deleteWebAccountInputSchema,
  updateWebAccountInputSchema,
  webAccountsQuerySchema,
} from '@/features/finance/services/accounts/account-domain.schemas';
import {
  AccountDomainError,
  createWebAccount,
  deleteWebAccount,
  listWebAccounts,
  updateWebAccount,
} from '@/features/finance/services/accounts/account-domain.service';
import { findOrCreateFinanceUserByEmail } from '@/features/finance/services/finance-user.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getAuthenticatedFinanceUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await findOrCreateFinanceUserByEmail(session.user.email);
  return user.id;
}

function parseWebAccountsQuery(searchParams: URLSearchParams) {
  return webAccountsQuerySchema.parse({
    includeInactive: searchParams.get('includeInactive') === 'true',
  });
}

function mapWebAccountsError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
  }

  if (error instanceof AccountDomainError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details ?? {}),
      },
      { status: error.status },
    );
  }

  console.error(`[finance/accounts] ${action} error:`, error);
  return NextResponse.json({ error: `Failed to ${action} accounts` }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = parseWebAccountsQuery(new URL(request.url).searchParams);
    const payload = await listWebAccounts(userId, query);

    return NextResponse.json(payload);
  } catch (error) {
    return mapWebAccountsError(error, 'fetch');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = createWebAccountInputSchema.parse(body);
    const account = await createWebAccount(userId, input);

    return NextResponse.json(
      {
        account,
        message: 'Account created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    return mapWebAccountsError(error, 'create');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = updateWebAccountInputSchema.parse(body);
    const account = await updateWebAccount(userId, input);

    return NextResponse.json({
      account,
      message: 'Account updated successfully',
    });
  } catch (error) {
    return mapWebAccountsError(error, 'update');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const input = deleteWebAccountInputSchema.parse({
      id: searchParams.get('id') ?? '',
      force: searchParams.get('force') === 'true',
    });

    const result = await deleteWebAccount(userId, input);

    return NextResponse.json({
      message: 'Account deleted successfully',
      deletedTransactions: result.deletedTransactions,
    });
  } catch (error) {
    return mapWebAccountsError(error, 'delete');
  }
}
