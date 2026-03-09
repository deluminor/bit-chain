import { authOptions } from '@/features/auth/libs/auth';
import { findOrCreateFinanceUserByEmail } from '@/features/finance/services/finance-user.service';
import {
  createLoanInputSchema,
  loanDeleteInputSchema,
  updateLoanInputSchema,
  webLoansQuerySchema,
} from '@/features/finance/services/loans/loan-domain.schemas';
import {
  LoanDomainError,
  createLoan,
  deleteLoan,
  listWebLoans,
  toWebLoanPayload,
  updateLoan,
} from '@/features/finance/services/loans/loan-domain.service';
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

function parseWebLoansQuery(searchParams: URLSearchParams) {
  return webLoansQuerySchema.parse({
    includeInactive: searchParams.get('includeInactive') === 'true',
  });
}

function mapLoanError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
  }

  if (error instanceof LoanDomainError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(`[finance/loans] ${action} error:`, error);
  return NextResponse.json({ error: `Failed to ${action} loan` }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = parseWebLoansQuery(new URL(request.url).searchParams);
    const response = await listWebLoans(userId, query);

    return NextResponse.json(response);
  } catch (error) {
    return mapLoanError(error, 'fetch');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = createLoanInputSchema.parse(body);
    const loan = await createLoan(userId, input);

    return NextResponse.json({ loan: toWebLoanPayload(loan) }, { status: 201 });
  } catch (error) {
    return mapLoanError(error, 'create');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = updateLoanInputSchema.parse(body);
    const loan = await updateLoan(userId, input);

    return NextResponse.json({ loan: toWebLoanPayload(loan) });
  } catch (error) {
    return mapLoanError(error, 'update');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { id } = loanDeleteInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteLoan(userId, id);

    return NextResponse.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    return mapLoanError(error, 'delete');
  }
}
