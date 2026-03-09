import { z } from 'zod';

export const GoalItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  currency: z.string(),
  deadline: z.string().nullable(),
  color: z.string(),
  icon: z.string(),
  isActive: z.boolean(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
});

export type GoalItem = z.infer<typeof GoalItemSchema>;

export const GoalsSummarySchema = z.object({
  total: z.number(),
  active: z.number(),
  totalTarget: z.number(),
  totalCurrent: z.number(),
  completed: z.number(),
});

export type GoalsSummary = z.infer<typeof GoalsSummarySchema>;

export const GoalsListResponseSchema = z.object({
  goals: z.array(GoalItemSchema),
  summary: GoalsSummarySchema,
});

export type GoalsListResponse = z.infer<typeof GoalsListResponseSchema>;

export const CreateGoalRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).optional(),
  currency: z.string().min(3).max(3),
  deadline: z.string().datetime().nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().min(1),
});

export type CreateGoalRequest = z.infer<typeof CreateGoalRequestSchema>;

export const UpdateGoalRequestSchema = CreateGoalRequestSchema.partial().extend({
  id: z.string().cuid(),
  isActive: z.boolean().optional(),
});

export type UpdateGoalRequest = z.infer<typeof UpdateGoalRequestSchema>;
