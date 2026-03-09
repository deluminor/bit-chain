import { BASE_CURRENCY, currencyService } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import type {
  CreateMobileGoalInput,
  CreateWebGoalInput,
  UpdateMobileGoalInput,
  UpdateWebGoalInput,
} from './goal-domain.schemas';

interface GoalDto {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string | null;
  color: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
}

export class GoalDomainError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'GoalDomainError';
    this.status = status;
    this.code = code;
  }
}

function parseDeadline(deadline: string | null | undefined): Date | null | undefined {
  if (deadline === undefined) {
    return undefined;
  }

  if (deadline === null || deadline === '') {
    return null;
  }

  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    throw new GoalDomainError('Invalid deadline value', 400, 'VALIDATION_ERROR');
  }

  return parsed;
}

function toGoalDto(goal: {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: Date | null;
  color: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: Date;
}): GoalDto {
  return {
    id: goal.id,
    name: goal.name,
    description: goal.description,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    currency: goal.currency,
    deadline: goal.deadline ? goal.deadline.toISOString() : null,
    color: goal.color,
    icon: goal.icon,
    isActive: goal.isActive,
    isCompleted: goal.isCompleted,
    createdAt: goal.createdAt.toISOString(),
  };
}

async function getOwnedGoal(userId: string, id: string) {
  const goal = await prisma.financialGoal.findFirst({ where: { id, userId } });
  if (!goal) {
    throw new GoalDomainError('Goal not found', 404, 'NOT_FOUND');
  }

  return goal;
}

export async function listWebGoals(userId: string) {
  const goals = await prisma.financialGoal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const totalsInBase = await Promise.all(
    goals.map(async goal => {
      try {
        if (goal.currency === BASE_CURRENCY) {
          return { target: goal.targetAmount, current: goal.currentAmount };
        }

        const [target, current] = await Promise.all([
          currencyService.convertToBaseCurrency(goal.targetAmount, goal.currency),
          currencyService.convertToBaseCurrency(goal.currentAmount, goal.currency),
        ]);

        return { target, current };
      } catch {
        return { target: goal.targetAmount, current: goal.currentAmount };
      }
    }),
  );

  const summary = totalsInBase.reduce(
    (acc, item) => ({
      ...acc,
      totalTarget: acc.totalTarget + item.target,
      totalCurrent: acc.totalCurrent + item.current,
    }),
    {
      total: goals.length,
      active: goals.filter(goal => goal.isActive).length,
      totalTarget: 0,
      totalCurrent: 0,
      completed: goals.filter(goal => goal.currentAmount >= goal.targetAmount).length,
    },
  );

  return { goals, summary };
}

export async function createWebGoal(userId: string, input: CreateWebGoalInput) {
  return prisma.financialGoal.create({
    data: {
      userId,
      name: input.name,
      description: input.description ?? null,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount,
      currency: input.currency,
      deadline: parseDeadline(input.deadline),
      color: input.color,
      icon: input.icon,
      isActive: true,
    },
  });
}

export async function updateWebGoal(userId: string, input: UpdateWebGoalInput) {
  const existing = await getOwnedGoal(userId, input.id);

  return prisma.financialGoal.update({
    where: { id: existing.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.targetAmount !== undefined && { targetAmount: input.targetAmount }),
      ...(input.currentAmount !== undefined && { currentAmount: input.currentAmount }),
      ...(input.currency !== undefined && { currency: input.currency }),
      ...(input.deadline !== undefined && { deadline: parseDeadline(input.deadline) }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
  });
}

export async function deleteWebGoal(userId: string, id: string): Promise<void> {
  const existing = await getOwnedGoal(userId, id);
  await prisma.financialGoal.delete({ where: { id: existing.id } });
}

export async function listMobileGoals(userId: string) {
  const goals = await prisma.financialGoal.findMany({
    where: { userId, isDemo: false },
    orderBy: { createdAt: 'desc' },
  });

  const active = goals.filter(goal => goal.isActive && !goal.isCompleted);
  const completed = goals.filter(
    goal => goal.isCompleted || goal.currentAmount >= goal.targetAmount,
  );
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  return {
    goals: goals.map(toGoalDto),
    summary: {
      total: goals.length,
      active: active.length,
      totalTarget,
      totalCurrent,
      completed: completed.length,
    },
  };
}

export async function createMobileGoal(userId: string, input: CreateMobileGoalInput) {
  const goal = await prisma.financialGoal.create({
    data: {
      userId,
      name: input.name,
      description: input.description ?? null,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount ?? 0,
      currency: input.currency ?? 'UAH',
      deadline: parseDeadline(input.deadline),
      color: input.color ?? '#10B981',
      icon: input.icon ?? '🎯',
      isActive: true,
      isCompleted: false,
    },
  });

  return toGoalDto(goal);
}

export async function updateMobileGoal(userId: string, input: UpdateMobileGoalInput) {
  const existing = await getOwnedGoal(userId, input.id);
  const nextTarget = input.targetAmount ?? existing.targetAmount;
  const nextCurrent = input.currentAmount ?? existing.currentAmount;
  const isCompleted = nextCurrent >= nextTarget;

  const updated = await prisma.financialGoal.update({
    where: { id: existing.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.targetAmount !== undefined && { targetAmount: input.targetAmount }),
      ...(input.currentAmount !== undefined && { currentAmount: input.currentAmount }),
      ...(input.currency !== undefined && { currency: input.currency }),
      ...(input.deadline !== undefined && { deadline: parseDeadline(input.deadline) }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      isCompleted,
      ...(isCompleted && !existing.isCompleted && { completedAt: new Date() }),
    },
  });

  return toGoalDto(updated);
}

export async function deleteMobileGoal(userId: string, id: string): Promise<void> {
  const existing = await getOwnedGoal(userId, id);
  await prisma.financialGoal.delete({ where: { id: existing.id } });
}
