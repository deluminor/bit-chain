import {
  createLoanInputSchema,
  loanDeleteInputSchema,
  mobileLoansQuerySchema,
  updateLoanInputSchema,
} from '@/features/finance/services/loans/loan-domain.schemas';
import {
  LoanDomainError,
  createLoan,
  deleteLoan,
  listMobileLoans,
  toMobileLoanPayload,
  updateLoan,
} from '@/features/finance/services/loans/loan-domain.service';
import { getMobileUser } from '@/lib/mobile-auth';
import {
  err,
  ok,
  type CreateLoanRequest,
  type LoansListResponse,
  type UpdateLoanRequest,
} from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getAuthenticatedMobileUser(request: NextRequest): Promise<{ id: string } | null> {
  try {
    return await getMobileUser(request);
  } catch {
    return null;
  }
}

function parseMobileLoansQuery(searchParams: URLSearchParams) {
  return mobileLoansQuerySchema.parse({
    showPaid: searchParams.get('showPaid') === 'true',
  });
}

function mapMobileLoanError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    const firstIssue = error.errors[0]?.message ?? 'Validation error';
    return NextResponse.json(err('VALIDATION_ERROR', firstIssue), { status: 400 });
  }

  if (error instanceof LoanDomainError) {
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json(err('NOT_FOUND', error.message), { status: 404 });
    }

    if (error.code === 'CONFLICT') {
      return NextResponse.json(err('CONFLICT', error.message), { status: 409 });
    }

    return NextResponse.json(err('VALIDATION_ERROR', error.message), { status: error.status });
  }

  console.error(`[mobile/loans] ${action} error:`, error);
  return NextResponse.json(err('INTERNAL_ERROR', `Failed to ${action} loan`), { status: 500 });
}

/**
 * GET /api/mobile/loans?showPaid=true|false
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const query = parseMobileLoansQuery(new URL(request.url).searchParams);
    const payload: LoansListResponse = await listMobileLoans(user.id, query);

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    return mapMobileLoanError(error, 'fetch');
  }
}

/**
 * POST /api/mobile/loans
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body: CreateLoanRequest = await request.json();
    const input = createLoanInputSchema.parse(body);
    const loan = await createLoan(user.id, input);

    return NextResponse.json(ok(toMobileLoanPayload(loan)), { status: 201 });
  } catch (error) {
    return mapMobileLoanError(error, 'create');
  }
}

/**
 * PUT /api/mobile/loans
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body: UpdateLoanRequest = await request.json();
    const input = updateLoanInputSchema.parse(body);
    const loan = await updateLoan(user.id, input);

    return NextResponse.json(ok(toMobileLoanPayload(loan)), { status: 200 });
  } catch (error) {
    return mapMobileLoanError(error, 'update');
  }
}

/**
 * DELETE /api/mobile/loans?id=
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const { id } = loanDeleteInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteLoan(user.id, id);

    return NextResponse.json(ok({ message: 'Loan deleted successfully' }), { status: 200 });
  } catch (error) {
    return mapMobileLoanError(error, 'delete');
  }
}
