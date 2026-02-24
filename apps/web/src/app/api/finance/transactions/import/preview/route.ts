import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { PrismaClient } from '@/generated/prisma';
import { randomUUID } from 'crypto';
import {
  createImportKey,
  parseTransactionsCsv,
  type ParsedCsvRow,
} from '@/lib/finance/transaction-import';

const prisma = new PrismaClient();

const previewSchema = z.object({
  accountId: z.string().cuid(),
  incomeCategoryId: z.string().cuid(),
  expenseCategoryId: z.string().cuid(),
});

const resolveAmountForAccount = (row: ParsedCsvRow, accountCurrency: string) => {
  if (row.currency.toUpperCase() === accountCurrency) {
    return { amount: row.amount, currency: row.currency.toUpperCase() };
  }
  if (row.fallbackCurrency && row.fallbackCurrency.toUpperCase() === accountCurrency) {
    return {
      amount: row.fallbackAmount ?? row.amount,
      currency: row.fallbackCurrency.toUpperCase(),
    };
  }
  return { amount: row.amount, currency: row.currency.toUpperCase() || accountCurrency };
};

const buildExistingMap = (
  existing: Array<{
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    amount: number;
    currency: string | null;
    description: string | null;
    date: Date;
  }>,
  accountId: string,
  accountCurrency: string,
) => {
  const map = new Set<string>();
  existing.forEach(tx => {
    if (tx.type === 'TRANSFER') {
      return;
    }
    const currency = tx.currency || accountCurrency;
    map.add(
      createImportKey({
        accountId,
        type: tx.type,
        amount: tx.amount,
        currency,
        description: tx.description ?? '',
        date: tx.date,
      }),
    );
  });
  return map;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const accountId = formData.get('accountId');
    const incomeCategoryId = formData.get('incomeCategoryId');
    const expenseCategoryId = formData.get('expenseCategoryId');

    const parsed = previewSchema.safeParse({
      accountId,
      incomeCategoryId,
      expenseCategoryId,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'CSV file is required' }, { status: 400 });
    }

    const account = await prisma.financeAccount.findFirst({
      where: {
        id: parsed.data.accountId,
        userId: user.id,
        isActive: true,
      },
      select: { id: true, currency: true },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or inactive' }, { status: 400 });
    }

    const categories = await prisma.transactionCategory.findMany({
      where: {
        id: { in: [parsed.data.incomeCategoryId, parsed.data.expenseCategoryId] },
        userId: user.id,
        isActive: true,
      },
      select: { id: true, type: true },
    });

    const incomeCategory = categories.find(
      category => category.id === parsed.data.incomeCategoryId,
    );
    const expenseCategory = categories.find(
      category => category.id === parsed.data.expenseCategoryId,
    );

    if (!incomeCategory || incomeCategory.type !== 'INCOME') {
      return NextResponse.json({ error: 'Invalid income category' }, { status: 400 });
    }

    if (!expenseCategory || expenseCategory.type !== 'EXPENSE') {
      return NextResponse.json({ error: 'Invalid expense category' }, { status: 400 });
    }

    const content = await file.text();
    const parsedCsv = parseTransactionsCsv(content);

    if (parsedCsv.source === 'UNKNOWN' || parsedCsv.rows.length === 0) {
      return NextResponse.json(
        { error: parsedCsv.errors[0] || 'Unsupported CSV format' },
        { status: 400 },
      );
    }

    const resolvedRows = parsedCsv.rows
      .map(row => {
        const resolved = resolveAmountForAccount(row, account.currency);
        const amountValue = Number.parseFloat(Math.abs(resolved.amount).toFixed(2));
        if (!amountValue || Number.isNaN(amountValue)) {
          return null;
        }
        const type = resolved.amount >= 0 ? 'INCOME' : 'EXPENSE';
        return {
          ...row,
          type,
          amount: amountValue,
          currency: resolved.currency,
          categoryId: type === 'INCOME' ? incomeCategory.id : expenseCategory.id,
        };
      })
      .filter(Boolean) as Array<
      ParsedCsvRow & {
        type: 'INCOME' | 'EXPENSE';
        amount: number;
        currency: string;
        categoryId: string;
      }
    >;

    if (resolvedRows.length === 0) {
      return NextResponse.json({ error: 'No valid rows to import' }, { status: 400 });
    }

    const dates = resolvedRows.map(row => row.date);
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

    const existingMap = buildExistingMap(existingTransactions, account.id, account.currency);
    const importKeys = new Set<string>();

    const items = resolvedRows.map(row => {
      const key = createImportKey({
        accountId: account.id,
        type: row.type,
        amount: row.amount,
        currency: row.currency,
        description: row.description,
        date: row.date,
      });
      const isDuplicate = existingMap.has(key) || importKeys.has(key);
      importKeys.add(key);

      return {
        id: randomUUID(),
        type: row.type,
        amount: row.amount,
        currency: row.currency,
        description: row.description,
        date: row.date.toISOString(),
        categoryId: row.categoryId,
        duplicate: isDuplicate,
      };
    });

    const duplicateCount = items.filter(item => item.duplicate).length;

    return NextResponse.json({
      source: parsedCsv.source,
      skipped: parsedCsv.skipped,
      summary: {
        total: items.length,
        duplicates: duplicateCount,
      },
      items,
    });
  } catch (error) {
    console.error('Error generating import preview:', error);
    return NextResponse.json({ error: 'Failed to preview import' }, { status: 500 });
  }
}
