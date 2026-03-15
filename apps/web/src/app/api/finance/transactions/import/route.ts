import { authOptions } from '@/features/auth/libs/auth';
import { createImportKey } from '@/lib/finance/transaction-import';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const importSchema = z.object({
  accountId: z.string().cuid(),
  items: z
    .array(
      z.object({
        type: z.enum(['INCOME', 'EXPENSE']),
        amount: z.number().positive(),
        currency: z.string().min(3).max(3),
        description: z.string().max(200).optional(),
        date: z.string().datetime(),
        categoryId: z.string().cuid(),
      }),
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = importSchema.parse(body);

    const account = await prisma.financeAccount.findFirst({
      where: {
        id: parsed.accountId,
        userId: user.id,
        isActive: true,
      },
      select: {
        id: true,
        currency: true,
        integrationAccounts: {
          select: { id: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or inactive' }, { status: 400 });
    }

    // specific logic for integrated accounts (Monobank, etc)
    // if the account is integrated, we do not update the balance
    const shouldUpdateBalance = account.integrationAccounts.length === 0;

    const categoryIds = Array.from(new Set(parsed.items.map(item => item.categoryId)));
    const categories = await prisma.transactionCategory.findMany({
      where: {
        id: { in: categoryIds },
        userId: user.id,
        isActive: true,
      },
      select: { id: true, type: true },
    });

    const categoryMap = new Map(categories.map(category => [category.id, category]));

    parsed.items.forEach(item => {
      const category = categoryMap.get(item.categoryId);
      if (!category || category.type !== item.type) {
        throw new Error('Category not found or type mismatch');
      }
    });

    const dates = parsed.items.map(item => new Date(item.date));
    const minDate = new Date(Math.min(...dates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));

    const existingTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        accountId: account.id,
        type: { in: ['INCOME', 'EXPENSE'] },
        date: {
          gte: minDate,
          lte: maxDate,
        },
      },
      select: {
        type: true,
        amount: true,
        currency: true,
        description: true,
        date: true,
      },
    });

    const existingMap = new Set<string>();
    existingTransactions.forEach(tx => {
      if (tx.type === 'TRANSFER') {
        return;
      }
      existingMap.add(
        createImportKey({
          accountId: account.id,
          type: tx.type,
          amount: tx.amount,
          currency: tx.currency || account.currency,
          description: tx.description ?? '',
          date: tx.date,
        }),
      );
    });

    const importMap = new Set<string>();
    const itemsToCreate = parsed.items.filter(item => {
      const key = createImportKey({
        accountId: account.id,
        type: item.type,
        amount: item.amount,
        currency: item.currency,
        description: item.description ?? '',
        date: new Date(item.date),
      });
      if (existingMap.has(key) || importMap.has(key)) {
        return false;
      }
      importMap.add(key);
      return true;
    });

    if (itemsToCreate.length === 0) {
      return NextResponse.json({
        message: 'No new transactions to import',
        created: 0,
        skipped: parsed.items.length,
      });
    }

    const totalIncome = itemsToCreate
      .filter(item => item.type === 'INCOME')
      .reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = itemsToCreate
      .filter(item => item.type === 'EXPENSE')
      .reduce((sum, item) => sum + item.amount, 0);
    const netChange = totalIncome - totalExpense;

    const createdCount = await prisma.$transaction(async tx => {
      for (const item of itemsToCreate) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: account.id,
            categoryId: item.categoryId,
            type: item.type,
            amount: item.amount,
            currency: item.currency,
            description: item.description,
            date: new Date(item.date),
            tags: [],
          },
        });
      }

      if (shouldUpdateBalance) {
        await tx.financeAccount.update({
          where: { id: account.id },
          data: {
            balance: {
              increment: netChange,
            },
          },
        });
      }

      return itemsToCreate.length;
    });

    return NextResponse.json({
      message: 'Transactions imported successfully',
      created: createdCount,
      skipped: parsed.items.length - createdCount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error && 'status' in error && error.status === 400) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error importing transactions:', error);
    return NextResponse.json({ error: 'Failed to import transactions' }, { status: 500 });
  }
}
