'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar, Palette, Smile } from 'lucide-react';
import {
  CreateGoalData,
  UpdateGoalData,
  useCreateGoal,
  useUpdateGoal,
  FinancialGoal,
} from '@/features/finance/queries/goals';
import { formatCurrency, BASE_CURRENCY, useCurrencyConverter } from '@/lib/currency';

const goalFormSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100, 'Goal name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  targetAmount: z.number().positive('Target amount must be positive').min(1, 'Minimum amount is 1'),
  currentAmount: z.number().min(0, 'Current amount cannot be negative').optional().default(0),
  currency: z.string().min(3).max(3).optional().default(BASE_CURRENCY),
  deadline: z.date().optional(),
  color: z.string().optional().default('#10B981'),
  icon: z.string().optional().default('🎯'),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  goal?: FinancialGoal; // For editing
}

const goalColors = [
  { value: '#10B981', label: 'Green', name: 'Success Green' },
  { value: '#3B82F6', label: 'Blue', name: 'Professional Blue' },
  { value: '#8B5CF6', label: 'Purple', name: 'Creative Purple' },
  { value: '#F59E0B', label: 'Orange', name: 'Energetic Orange' },
  { value: '#EF4444', label: 'Red', name: 'Bold Red' },
  { value: '#06B6D4', label: 'Cyan', name: 'Fresh Cyan' },
  { value: '#EC4899', label: 'Pink', name: 'Vibrant Pink' },
  { value: '#84CC16', label: 'Lime', name: 'Nature Lime' },
];

const goalIcons = [
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
];

const goalTemplates = [
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
];

export function GoalForm({ onClose, onSuccess, goal }: GoalFormProps) {
  const { toast } = useToast();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const { convertToBase: _convertToBase } = useCurrencyConverter();

  const [selectedColor, setSelectedColor] = useState(goal?.color || '#10B981');
  const [selectedIcon, setSelectedIcon] = useState(goal?.icon || '🎯');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    goal?.deadline ? new Date(goal.deadline) : undefined,
  );

  const isEditing = !!goal;

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema) as unknown as Resolver<GoalFormData>,
    defaultValues: {
      name: goal?.name || '',
      description: goal?.description || '',
      targetAmount: goal?.targetAmount || 0,
      currentAmount: goal?.currentAmount || 0,
      currency: goal?.currency || BASE_CURRENCY,
      deadline: goal?.deadline ? new Date(goal.deadline) : undefined,
      color: goal?.color || '#10B981',
      icon: goal?.icon || '🎯',
    },
  });

  const watchedTargetAmount = form.watch('targetAmount');
  const watchedCurrentAmount = form.watch('currentAmount');
  const watchedCurrency = form.watch('currency');
  const watchedIcon = form.watch('icon');

  // Calculate progress when amounts change
  const progress = (
    watchedTargetAmount > 0 ? Math.min((watchedCurrentAmount / watchedTargetAmount) * 100, 100) : 0
  ).toFixed(0);

  // Apply template
  const applyTemplate = (template: (typeof goalTemplates)[0]) => {
    form.setValue('name', template.name);
    form.setValue('description', template.description);
    form.setValue('icon', template.icon);
    form.setValue('color', template.color);
    form.setValue('targetAmount', template.suggestedAmount);
    // Sync local state with form values
    setSelectedIcon(template.icon);
    setSelectedColor(template.color);
  };

  const onSubmit: SubmitHandler<GoalFormData> = async data => {
    try {
      const formData = {
        ...data,
        targetAmount: parseFloat(data.targetAmount.toFixed(2)),
        currentAmount: parseFloat(data.currentAmount.toFixed(2)),
        deadline: data.deadline ? data.deadline.toISOString() : undefined,
        color: data.color, // Use form value instead of local state
        icon: data.icon, // Use form value instead of local state
      };

      if (isEditing && goal) {
        await updateGoal.mutateAsync({
          id: goal.id,
          ...formData,
        } as UpdateGoalData);
        toast({
          title: 'Success',
          description: 'Goal updated successfully',
        });
      } else {
        await createGoal.mutateAsync(formData as CreateGoalData);
        toast({
          title: 'Success',
          description: 'Goal created successfully',
        });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? 'update' : 'create'} goal`;
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-muted-foreground flex items-center gap-2">
          <span className="text-2xl">{watchedIcon}</span>
          {isEditing
            ? 'Update your financial goal details and track progress'
            : 'Set a financial target and track your progress towards achieving it'}
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Goal Templates (only for new goals) */}
        {!isEditing && (
          <div className="space-y-3">
            <Label className="text-base">Quick Start Templates</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goalTemplates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="p-3 rounded-lg border-2 border-muted bg-muted/50 hover:bg-muted transition-all text-left"
                >
                  <div className="text-2xl mb-1">{template.icon}</div>
                  <div className="text-sm font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.suggestedAmount.toLocaleString()} UAH
                  </div>
                </button>
              ))}
            </div>
            <Separator />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name *</Label>
            <Input
              id="name"
              placeholder="Emergency Fund"
              className={form.formState.errors.name ? 'border-destructive' : ''}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={form.watch('currency')}
              onValueChange={value => form.setValue('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UAH">UAH - Ukrainian Hryvnia</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="6 months of expenses saved for emergencies"
            rows={2}
            className={form.formState.errors.description ? 'border-destructive' : ''}
            {...form.register('description')}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount *</Label>
            <CurrencyInput
              placeholder="15000.00"
              value={form.getValues('targetAmount')}
              onAmountChange={(value: number) => form.setValue('targetAmount', value)}
              className={form.formState.errors.targetAmount ? 'border-destructive' : ''}
              currency={watchedCurrency}
              showCurrencySelect={false}
            />
            {form.formState.errors.targetAmount && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {form.formState.errors.targetAmount.message}
              </p>
            )}
          </div>

          {/* Current Amount */}
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount</Label>
            <CurrencyInput
              placeholder="0.00"
              value={form.getValues('currentAmount')}
              onAmountChange={(value: number) => form.setValue('currentAmount', value)}
              className={form.formState.errors.currentAmount ? 'border-destructive' : ''}
              currency={watchedCurrency}
              showCurrencySelect={false}
            />
            {form.formState.errors.currentAmount && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {form.formState.errors.currentAmount.message}
              </p>
            )}
          </div>
        </div>

        {/* Progress Preview */}
        {watchedTargetAmount > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: selectedColor,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Remaining:{' '}
                {formatCurrency(watchedTargetAmount - watchedCurrentAmount, watchedCurrency)}
              </span>
              <span>Target: {formatCurrency(watchedTargetAmount, watchedCurrency)}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deadline */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Target Deadline (Optional)
            </Label>
            <DatePicker
              date={selectedDate}
              onDateChange={date => {
                setSelectedDate(date);
                form.setValue('deadline', date);
              }}
              placeholder="Select target date"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Goal Color
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {goalColors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color.value);
                    form.setValue('color', color.value);
                  }}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-current scale-105'
                      : 'border-muted hover:border-muted-foreground'
                  }`}
                  style={{ color: color.value }}
                >
                  <div
                    className="w-4 h-4 rounded-full mx-auto"
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Icon Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            Goal Icon
          </Label>
          <div className="grid grid-cols-8 gap-2">
            {goalIcons.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  setSelectedIcon(icon);
                  form.setValue('icon', icon);
                }}
                className={`p-2 rounded-lg border-2 transition-all text-lg ${
                  selectedIcon === icon
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground hover:bg-muted/50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={createGoal.isPending || updateGoal.isPending}
            className="flex-1"
          >
            {createGoal.isPending || updateGoal.isPending
              ? `${isEditing ? 'Updating' : 'Creating'} Goal...`
              : isEditing
                ? 'Update Goal'
                : 'Create Goal'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
