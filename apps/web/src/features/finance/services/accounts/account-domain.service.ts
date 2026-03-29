import { prisma } from '@/lib/prisma';
import type {
  CreateWebAccountInput,
  DeleteWebAccountInput,
  UpdateMobileAccountInput,
  UpdateWebAccountInput,
  WebAccountsQuery,
} from './account-domain.schemas';

export class AccountDomainError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown> | null;

  constructor(message: string, status: number, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AccountDomainError';
    this.status = status;
    this.code = code;
    this.details = details ?? null;
  }
}

async function ensureUniqueAccountName(
  userId: string,
  name: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.financeAccount.findFirst({
    where: {
      userId,
      name,
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AccountDomainError('Account with this name already exists', 400, 'CONFLICT');
  }
}

async function getOwnedAccount(userId: string, accountId: string) {
  const account = await prisma.financeAccount.findFirst({
    where: {
      id: accountId,
      userId,
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!account) {
    throw new AccountDomainError('Account not found', 404, 'NOT_FOUND');
  }

  return account;
}

export async function listWebAccounts(userId: string, query: WebAccountsQuery) {
  const accounts = await prisma.financeAccount.findMany({
    where: {
      userId,
      ...(query.includeInactive ? {} : { isActive: true }),
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
  });

  return {
    accounts,
    summary: {
      total: accounts.length,
      active: accounts.filter(account => account.isActive).length,
      inactive: accounts.filter(account => !account.isActive).length,
      totalBalance: accounts
        .filter(account => account.isActive)
        .reduce((sum, account) => sum + account.balance, 0),
    },
  };
}

export async function createWebAccount(userId: string, input: CreateWebAccountInput) {
  await ensureUniqueAccountName(userId, input.name);

  return prisma.financeAccount.create({
    data: {
      ...input,
      userId,
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });
}

export async function updateWebAccount(userId: string, input: UpdateWebAccountInput) {
  const { id, ...changes } = input;
  const account = await getOwnedAccount(userId, id);

  if (changes.name && changes.name !== account.name) {
    await ensureUniqueAccountName(userId, changes.name, id);
  }

  return prisma.financeAccount.update({
    where: { id },
    data: changes,
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });
}

export async function deleteWebAccount(userId: string, input: DeleteWebAccountInput) {
  const account = await getOwnedAccount(userId, input.id);

  if (account._count.transactions > 0 && !input.force) {
    throw new AccountDomainError('Cannot delete account with transactions', 400, 'CONFLICT', {
      hasTransactions: true,
      transactionCount: account._count.transactions,
      message: 'Use force=true to delete anyway or deactivate the account instead',
    });
  }

  if (input.force && account._count.transactions > 0) {
    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { accountId: input.id } }),
      prisma.financeAccount.delete({ where: { id: input.id } }),
    ]);
  } else {
    await prisma.financeAccount.delete({ where: { id: input.id } });
  }

  return {
    deletedTransactions: input.force ? account._count.transactions : 0,
  };
}

export async function updateMobileAccount(userId: string, input: UpdateMobileAccountInput) {
  const { id, ...changes } = input;

  const account = await prisma.financeAccount.findFirst({
    where: { id, userId, isDemo: false },
    include: {
      integrationAccounts: { select: { id: true }, take: 1 },
    },
  });

  if (!account) {
    throw new AccountDomainError('Account not found', 404, 'NOT_FOUND');
  }

  if (account.integrationAccounts.length > 0) {
    throw new AccountDomainError(
      'Monobank-synced accounts cannot be edited manually',
      403,
      'FORBIDDEN',
    );
  }

  if (changes.name && changes.name !== account.name) {
    await ensureUniqueAccountName(userId, changes.name, id);
  }

  const hasChanges = Object.keys(changes).length > 0;

  if (!hasChanges) {
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      description: account.description,
      isActive: account.isActive,
      color: account.color,
    };
  }

  return prisma.financeAccount.update({
    where: { id },
    data: changes,
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
      currency: true,
      description: true,
      isActive: true,
      color: true,
    },
  });
}

export async function listMobileAccounts(userId: string, options?: { includeInactive?: boolean }) {
  const includeInactive = options?.includeInactive ?? false;

  const accounts = await prisma.financeAccount.findMany({
    where: {
      userId,
      isDemo: false,
      ...(includeInactive ? {} : { isActive: true }),
    },
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
      currency: true,
      description: true,
      isActive: true,
      color: true,
      integrationAccounts: {
        select: { id: true },
        take: 1,
      },
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: [{ createdAt: 'asc' }],
  });

  return {
    accounts: accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      description: account.description,
      isActive: account.isActive,
      color: account.color,
      isMonobank: account.integrationAccounts.length > 0,
      transactionCount: account._count.transactions,
    })),
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter(account => account.isActive).length,
  };
}
