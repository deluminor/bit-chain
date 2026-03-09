import { BASE_CURRENCY, currencyService } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import type {
  CreateLoanInput,
  MobileLoansQuery,
  UpdateLoanInput,
  WebLoansQuery,
} from './loan-domain.schemas';

type LoanEntity = Awaited<ReturnType<typeof prisma.loan.findFirst>>;

export class LoanDomainError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'LoanDomainError';
    this.status = status;
    this.code = code;
  }
}

function normalizeText(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value.trim();
}

function mapLoanForWeb(loan: NonNullable<LoanEntity>) {
  return {
    ...loan,
    startDate: loan.startDate ? loan.startDate.toISOString() : null,
    dueDate: loan.dueDate ? loan.dueDate.toISOString() : null,
    createdAt: loan.createdAt.toISOString(),
    updatedAt: loan.updatedAt.toISOString(),
  };
}

function mapLoanForMobile(loan: NonNullable<LoanEntity>) {
  return {
    id: loan.id,
    name: loan.name,
    type: loan.type,
    totalAmount: loan.totalAmount,
    paidAmount: loan.paidAmount,
    currency: loan.currency,
    startDate: loan.startDate ? loan.startDate.toISOString() : null,
    dueDate: loan.dueDate ? loan.dueDate.toISOString() : null,
    interestRate: loan.interestRate,
    lender: loan.lender,
    notes: loan.notes,
    createdAt: loan.createdAt.toISOString(),
  };
}

async function requireLoanOwnership(userId: string, loanId: string) {
  const loan = await prisma.loan.findFirst({
    where: {
      id: loanId,
      userId,
    },
  });

  if (!loan) {
    throw new LoanDomainError('Loan not found', 404, 'NOT_FOUND');
  }

  return loan;
}

async function ensureUniqueLoanName(
  userId: string,
  name: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.loan.findFirst({
    where: {
      userId,
      name,
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new LoanDomainError(
      'Loan with this name already exists. Choose another name.',
      400,
      'CONFLICT',
    );
  }
}

/**
 * Returns loans for web API with converted summary in base currency.
 */
export async function listWebLoans(userId: string, query: WebLoansQuery) {
  const allLoans = await prisma.loan.findMany({
    where: {
      userId,
    },
    orderBy: [{ createdAt: 'desc' }],
  });

  const loans = query.includeInactive
    ? allLoans
    : allLoans.filter(loan => loan.paidAmount < loan.totalAmount);

  let totalOutstandingBase = 0;
  for (const loan of loans) {
    const remaining = loan.totalAmount - loan.paidAmount;

    try {
      if (loan.currency === BASE_CURRENCY) {
        totalOutstandingBase += remaining;
      } else {
        const converted = await currencyService.convertToBaseCurrency(remaining, loan.currency);
        totalOutstandingBase += converted;
      }
    } catch (error) {
      console.warn(`Failed to convert ${loan.currency} to ${BASE_CURRENCY}:`, error);
      totalOutstandingBase += remaining;
    }
  }

  return {
    loans: loans.map(mapLoanForWeb),
    summary: {
      total: loans.length,
      active: loans.filter(loan => loan.paidAmount < loan.totalAmount).length,
      loanCount: loans.filter(loan => loan.type === 'LOAN').length,
      debtCount: loans.filter(loan => loan.type === 'DEBT').length,
      totalOutstandingBase,
    },
  };
}

/**
 * Returns loans for mobile API with lightweight summary.
 */
export async function listMobileLoans(userId: string, query: MobileLoansQuery) {
  const allLoans = await prisma.loan.findMany({
    where: {
      userId,
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });

  const loans = query.showPaid
    ? allLoans
    : allLoans.filter(loan => loan.paidAmount < loan.totalAmount);

  return {
    loans: loans.map(mapLoanForMobile),
    summary: {
      total: loans.length,
      active: loans.filter(loan => loan.paidAmount < loan.totalAmount).length,
      loanCount: loans.filter(loan => loan.type === 'LOAN').length,
      debtCount: loans.filter(loan => loan.type === 'DEBT').length,
      totalOutstandingBase: loans.reduce(
        (sum, loan) => sum + (loan.totalAmount - loan.paidAmount),
        0,
      ),
    },
  };
}

/**
 * Creates loan record.
 */
export async function createLoan(userId: string, input: CreateLoanInput) {
  const name = normalizeText(input.name);
  if (!name) {
    throw new LoanDomainError('Loan name is required', 400, 'VALIDATION_ERROR');
  }

  const paidAmount = input.paidAmount ?? 0;
  if (paidAmount > input.totalAmount) {
    throw new LoanDomainError('Paid amount cannot exceed total amount', 400, 'VALIDATION_ERROR');
  }

  await ensureUniqueLoanName(userId, name);

  const loan = await prisma.loan.create({
    data: {
      userId,
      name,
      type: input.type,
      totalAmount: input.totalAmount,
      paidAmount,
      currency: input.currency ?? 'UAH',
      startDate: input.startDate ?? null,
      dueDate: input.dueDate ?? null,
      interestRate: input.interestRate ?? null,
      lender: normalizeText(input.lender) ?? null,
      notes: normalizeText(input.notes) ?? null,
    },
  });

  return loan;
}

/**
 * Updates loan record.
 */
export async function updateLoan(userId: string, input: UpdateLoanInput) {
  const existingLoan = await requireLoanOwnership(userId, input.id);

  if (input.type && input.type !== existingLoan.type) {
    throw new LoanDomainError('Loan type cannot be changed once created', 400, 'VALIDATION_ERROR');
  }

  const nextName = input.name ? normalizeText(input.name) : existingLoan.name;
  if (!nextName) {
    throw new LoanDomainError('Loan name is required', 400, 'VALIDATION_ERROR');
  }

  if (nextName !== existingLoan.name) {
    await ensureUniqueLoanName(userId, nextName, input.id);
  }

  const nextTotalAmount = input.totalAmount ?? existingLoan.totalAmount;
  const nextPaidAmount = input.paidAmount ?? existingLoan.paidAmount;

  if (nextPaidAmount > nextTotalAmount) {
    throw new LoanDomainError('Paid amount cannot exceed total amount', 400, 'VALIDATION_ERROR');
  }

  return prisma.loan.update({
    where: { id: existingLoan.id },
    data: {
      name: nextName,
      totalAmount: nextTotalAmount,
      paidAmount: nextPaidAmount,
      currency: input.currency ?? existingLoan.currency,
      startDate: input.startDate !== undefined ? input.startDate : existingLoan.startDate,
      dueDate: input.dueDate !== undefined ? input.dueDate : existingLoan.dueDate,
      interestRate:
        input.interestRate !== undefined ? input.interestRate : existingLoan.interestRate,
      lender:
        input.lender !== undefined ? (normalizeText(input.lender) ?? null) : existingLoan.lender,
      notes: input.notes !== undefined ? (normalizeText(input.notes) ?? null) : existingLoan.notes,
    },
  });
}

/**
 * Deletes loan record.
 */
export async function deleteLoan(userId: string, loanId: string): Promise<void> {
  const existingLoan = await requireLoanOwnership(userId, loanId);

  await prisma.loan.delete({
    where: { id: existingLoan.id },
  });
}

/**
 * Maps loan entity to web payload shape.
 */
export function toWebLoanPayload(loan: NonNullable<LoanEntity>) {
  return mapLoanForWeb(loan);
}

/**
 * Maps loan entity to mobile payload shape.
 */
export function toMobileLoanPayload(loan: NonNullable<LoanEntity>) {
  return mapLoanForMobile(loan);
}
