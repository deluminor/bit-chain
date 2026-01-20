import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { BASE_CURRENCY, currencyService } from '@/lib/currency';

const loanSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(['LOAN', 'DEBT']),
  originalAmount: z.number().positive(),
  currentBalance: z.number().min(0).optional(),
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
  isActive: z.boolean().optional(),
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

const loanCategoryConfig = {
  LOAN: { type: 'EXPENSE' as const, color: '#EF4444', icon: '💳' },
  DEBT: { type: 'INCOME' as const, color: '#10B981', icon: '🤝' },
};

interface LoanRecord {
  id: string;
  name: string;
  type: 'LOAN' | 'DEBT';
  originalAmount: number;
  currentBalance: number;
  currency: string;
  startDate: Date | null;
  dueDate: Date | null;
  interestRate: number | null;
  lender: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    isActive: boolean;
  } | null;
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

    const loans = (await prisma.loan.findMany({
      where: {
        userId: user.id,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    })) as LoanRecord[];

    let totalOutstandingBase = 0;
    for (const loan of loans) {
      try {
        if (loan.currency === BASE_CURRENCY) {
          totalOutstandingBase += loan.currentBalance;
        } else {
          totalOutstandingBase += await currencyService.convertToBaseCurrency(
            loan.currentBalance,
            loan.currency,
          );
        }
      } catch {
        totalOutstandingBase += loan.currentBalance;
      }
    }

    const summary = {
      total: loans.length,
      active: loans.filter(loan => loan.isActive).length,
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

    const currentBalance = payload.currentBalance ?? payload.originalAmount;

    if (currentBalance > payload.originalAmount) {
      return NextResponse.json(
        { error: 'Current balance cannot exceed original amount' },
        { status: 400 },
      );
    }

    const categoryConfig = loanCategoryConfig[payload.type as 'LOAN' | 'DEBT'];

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

    const existingCategory = await prisma.transactionCategory.findFirst({
      where: {
        userId: user.id,
        name: payload.name,
        type: categoryConfig.type,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists. Choose another loan name.' },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async tx => {
      const loan = await tx.loan.create({
        data: {
          userId: user.id,
          name: payload.name,
          type: payload.type,
          originalAmount: payload.originalAmount,
          currentBalance,
          currency: payload.currency || 'UAH',
          startDate: payload.startDate || null,
          dueDate: payload.dueDate || null,
          interestRate: payload.interestRate ?? null,
          lender: payload.lender || null,
          notes: payload.notes || null,
          isActive: currentBalance > 0,
        },
      });

      const category = await tx.transactionCategory.create({
        data: {
          userId: user.id,
          name: payload.name,
          type: categoryConfig.type,
          color: categoryConfig.color,
          icon: categoryConfig.icon,
          isDefault: false,
          isActive: currentBalance > 0,
          loanId: loan.id,
        },
      });

      return { loan, category };
    });

    return NextResponse.json({ loan: result.loan, category: result.category }, { status: 201 });
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

    const categoryConfig = loanCategoryConfig[existingLoan.type as 'LOAN' | 'DEBT'];
    const loanCategory = await prisma.transactionCategory.findFirst({
      where: {
        loanId: existingLoan.id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (payload.currency && payload.currency !== existingLoan.currency) {
      if (loanCategory && loanCategory._count.transactions > 0) {
        return NextResponse.json(
          { error: 'Cannot change currency after transactions were recorded' },
          { status: 400 },
        );
      }
    }

    const nextOriginalAmount = payload.originalAmount ?? existingLoan.originalAmount;
    const nextCurrentBalance = payload.currentBalance ?? existingLoan.currentBalance;
    const baseIsActive = payload.isActive ?? existingLoan.isActive;
    const nextIsActive = baseIsActive && nextCurrentBalance > 0;

    if (nextCurrentBalance > nextOriginalAmount) {
      return NextResponse.json(
        { error: 'Current balance cannot exceed original amount' },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async tx => {
      const updatedLoan = await tx.loan.update({
        where: { id: existingLoan.id },
        data: {
          name: payload.name ?? existingLoan.name,
          originalAmount: payload.originalAmount ?? existingLoan.originalAmount,
          currentBalance: payload.currentBalance ?? existingLoan.currentBalance,
          currency: payload.currency ?? existingLoan.currency,
          startDate: payload.startDate ?? existingLoan.startDate,
          dueDate: payload.dueDate ?? existingLoan.dueDate,
          interestRate: payload.interestRate ?? existingLoan.interestRate,
          lender: payload.lender ?? existingLoan.lender,
          notes: payload.notes ?? existingLoan.notes,
          isActive: nextIsActive,
        },
      });

      if (loanCategory) {
        await tx.transactionCategory.update({
          where: { id: loanCategory.id },
          data: {
            name: payload.name ?? existingLoan.name,
            type: categoryConfig.type,
            color: categoryConfig.color,
            icon: categoryConfig.icon,
            isActive: nextIsActive,
          },
        });
      }

      return updatedLoan;
    });

    return NextResponse.json({ loan: result });
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

    const category = await prisma.transactionCategory.findFirst({
      where: {
        loanId: existingLoan.id,
      },
    });

    await prisma.$transaction(async tx => {
      if (category) {
        await tx.transactionCategory.update({
          where: { id: category.id },
          data: {
            isActive: false,
            loanId: null,
          },
        });
      }

      await tx.loan.delete({
        where: { id: existingLoan.id },
      });
    });

    return NextResponse.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    return NextResponse.json({ error: 'Failed to delete loan' }, { status: 500 });
  }
}
