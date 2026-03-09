import {
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartHandshake,
  Home,
  Plane,
  ShoppingCart,
  Wrench,
} from 'lucide-react';
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  type: z.enum(['INCOME', 'EXPENSE']),
  parentId: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required'),
  isDefault: z.boolean().default(false),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const CATEGORY_ICON_OPTIONS = [
  { value: 'DollarSign', label: 'Money', icon: DollarSign },
  { value: 'ShoppingCart', label: 'Shopping', icon: ShoppingCart },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Car', label: 'Transport', icon: Car },
  { value: 'Coffee', label: 'Food & Drink', icon: Coffee },
  { value: 'Gamepad2', label: 'Entertainment', icon: Gamepad2 },
  { value: 'HeartHandshake', label: 'Health', icon: HeartHandshake },
  { value: 'Briefcase', label: 'Work', icon: Briefcase },
  { value: 'GraduationCap', label: 'Education', icon: GraduationCap },
  { value: 'Plane', label: 'Travel', icon: Plane },
  { value: 'Gift', label: 'Gifts', icon: Gift },
  { value: 'Wrench', label: 'Tools', icon: Wrench },
] as const;

export const CATEGORY_COLOR_OPTIONS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#78716c',
  '#dc2626',
  '#16a34a',
] as const;
