import { BASE_CURRENCY } from '@/lib/currency';
import { z } from 'zod';

export const goalFormSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100, 'Goal name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  targetAmount: z.number().positive('Target amount must be positive').min(1, 'Minimum amount is 1'),
  currentAmount: z.number().min(0, 'Current amount cannot be negative').optional().default(0),
  currency: z.string().min(3).max(3).optional().default(BASE_CURRENCY),
  deadline: z.date().optional(),
  color: z.string().optional().default('#10B981'),
  icon: z.string().optional().default('🎯'),
});

export type GoalFormData = z.infer<typeof goalFormSchema>;

export const goalColors = [
  { value: '#10B981', label: 'Green', name: 'Success Green' },
  { value: '#3B82F6', label: 'Blue', name: 'Professional Blue' },
  { value: '#8B5CF6', label: 'Purple', name: 'Creative Purple' },
  { value: '#F59E0B', label: 'Orange', name: 'Energetic Orange' },
  { value: '#EF4444', label: 'Red', name: 'Bold Red' },
  { value: '#06B6D4', label: 'Cyan', name: 'Fresh Cyan' },
  { value: '#EC4899', label: 'Pink', name: 'Vibrant Pink' },
  { value: '#84CC16', label: 'Lime', name: 'Nature Lime' },
] as const;

export const goalIcons = [
  '🎯',
  '💰',
  '🏠',
  '🚗',
  '✈️',
  '🎓',
  '💍',
  '🏖️',
  '📱',
  '💻',
  '🎵',
  '📚',
  '🏥',
  '🏦',
  '🛡️',
  '🎁',
] as const;

export const goalTemplates = [
  {
    name: 'Emergency Fund',
    description: '6 months of expenses saved for emergencies',
    icon: '🛡️',
    color: '#10B981',
    suggestedAmount: 15000,
  },
  {
    name: 'New Car',
    description: 'Save for a reliable vehicle',
    icon: '🚗',
    color: '#3B82F6',
    suggestedAmount: 25000,
  },
  {
    name: 'Vacation Fund',
    description: 'Dream vacation with family',
    icon: '✈️',
    color: '#8B5CF6',
    suggestedAmount: 5000,
  },
  {
    name: 'Home Down Payment',
    description: 'First home down payment',
    icon: '🏠',
    color: '#F59E0B',
    suggestedAmount: 50000,
  },
] as const;
