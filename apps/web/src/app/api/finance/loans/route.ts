import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { BASE_CURRENCY, currencyService } from '@/lib/currency';

const loanSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(['LOAN', 'DEBT']),
  totalAmount: z.number().positive(),
  paidAmount: z.number().min(0).optional(),
  currency: z.string().min(3).max(3).optional(),
  startDate: z
    .string()
    .datetime()
    .transform(value => new Date(value))
    .optional(),
  dueDate: z
    .string()
    .datetime()
    .transform(value => new Date(value))
    .optional(),
  interestRate: z.number().min(0).max(100).optional(),
  lender: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

const updateLoanSchema = loanSchema.partial().extend({
  id: z.string().cuid(),
});

async function findOrCreateUser(email: string) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: 'nextauth_user',
      },
    });

    await prisma.category.create({
      data: {
        name: 'solo',
        userId: user.id,
      },
    });
  }

  return user;
}

interface LoanRecord {
  id: string;
  name: string;
  type: 'LOAN' | 'DEBT';
  totalAmount: number;
  paidAmount: number;
  currency: string;
  startDate: Date | null;
  dueDate: Date | null;
  interestRate: number | null;
  lender: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const allLoans = (await prisma.loan.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [{ createdAt: 'desc' }],
    })) as LoanRecord[];

    // Filter based on status (active = unpaid, inactive = paid)
    const loans = includeInactive
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
      } catch (convertError) {
        console.warn(`Failed to convert ${loan.currency} to ${BASE_CURRENCY}:`, convertError);
        // Fallback: add raw amount without conversion
        totalOutstandingBase += remaining;
      }
    }

    const summary = {
      total: loans.length,
      active: loans.filter(loan => loan.paidAmount < loan.totalAmount).length,
      loanCount: loans.filter(loan => loan.type === 'LOAN').length,
      debtCount: loans.filter(loan => loan.type === 'DEBT').length,
      totalOutstandingBase,
    };

    return NextResponse.json({ loans, summary });
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const payload = loanSchema.parse(await request.json());

    const paidAmount = payload.paidAmount ?? 0;

    if (paidAmount > payload.totalAmount) {
      return NextResponse.json(
        { error: 'Paid amount cannot exceed total amount' },
        { status: 400 },
      );
    }

    const existingLoan = await prisma.loan.findFirst({
      where: {
        userId: user.id,
        name: payload.name,
      },
    });

    if (existingLoan) {
      return NextResponse.json(
        { error: 'Loan with this name already exists. Choose another name.' },
        { status: 400 },
      );
    }

    const loan = await prisma.loan.create({
      data: {
        userId: user.id,
        name: payload.name,
        type: payload.type,
        totalAmount: payload.totalAmount,
        paidAmount,
        currency: payload.currency || 'UAH',
        startDate: payload.startDate || null,
        dueDate: payload.dueDate || null,
        interestRate: payload.interestRate ?? null,
        lender: payload.lender || null,
        notes: payload.notes || null,
      },
    });

    return NextResponse.json({ loan }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating loan:', error);
    return NextResponse.json({ error: 'Failed to create loan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const payload = updateLoanSchema.parse(await request.json());

    const existingLoan = await prisma.loan.findFirst({
      where: {
        id: payload.id,
        userId: user.id,
      },
    });

    if (!existingLoan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    if (payload.type && payload.type !== existingLoan.type) {
      return NextResponse.json(
        { error: 'Loan type cannot be changed once created' },
        { status: 400 },
      );
    }

    if (payload.name && payload.name !== existingLoan.name) {
      const nameExists = await prisma.loan.findFirst({
        where: {
          userId: user.id,
          name: payload.name,
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Loan with this name already exists. Choose another name.' },
          { status: 400 },
        );
      }
    }

    const nextTotalAmount = payload.totalAmount ?? existingLoan.totalAmount;
    const nextPaidAmount = payload.paidAmount ?? existingLoan.paidAmount;

    if (nextPaidAmount > nextTotalAmount) {
      return NextResponse.json(
        { error: 'Paid amount cannot exceed total amount' },
        { status: 400 },
      );
    }

    const updatedLoan = await prisma.loan.update({
      where: { id: existingLoan.id },
      data: {
        name: payload.name ?? existingLoan.name,
        totalAmount: payload.totalAmount ?? existingLoan.totalAmount,
        paidAmount: payload.paidAmount ?? existingLoan.paidAmount,
        currency: payload.currency ?? existingLoan.currency,
        startDate: payload.startDate ?? existingLoan.startDate,
        dueDate: payload.dueDate ?? existingLoan.dueDate,
        interestRate: payload.interestRate ?? existingLoan.interestRate,
        lender: payload.lender ?? existingLoan.lender,
        notes: payload.notes ?? existingLoan.notes,
      },
    });

    return NextResponse.json({ loan: updatedLoan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating loan:', error);
    return NextResponse.json({ error: 'Failed to update loan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Loan ID is required' }, { status: 400 });
    }

    const existingLoan = await prisma.loan.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingLoan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    await prisma.loan.delete({
      where: { id: existingLoan.id },
    });

    return NextResponse.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    return NextResponse.json({ error: 'Failed to delete loan' }, { status: 500 });
  }
}
