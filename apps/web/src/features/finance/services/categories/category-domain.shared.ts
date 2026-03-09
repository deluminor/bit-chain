import { prisma } from '@/lib/prisma';

export class CategoryDomainError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown> | null;

  constructor(message: string, status: number, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'CategoryDomainError';
    this.status = status;
    this.code = code;
    this.details = details ?? null;
  }
}

export function normalizeCategoryName(name: string): string {
  return name.trim();
}

export async function ensureUniqueCategoryName(
  userId: string,
  name: string,
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER',
  excludeId?: string,
): Promise<void> {
  const existingCategory = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      name,
      type,
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: { id: true },
  });

  if (existingCategory) {
    throw new CategoryDomainError(
      'Category with this name and type already exists',
      400,
      'CONFLICT',
    );
  }
}

export async function assertValidParentCategory(
  userId: string,
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER',
  parentId: string,
): Promise<void> {
  const parentCategory = await prisma.transactionCategory.findFirst({
    where: {
      id: parentId,
      userId,
      type,
      parentId: null,
    },
    select: { id: true },
  });

  if (!parentCategory) {
    throw new CategoryDomainError('Parent category not found or invalid', 400, 'VALIDATION_ERROR');
  }
}
