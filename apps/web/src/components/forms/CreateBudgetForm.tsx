'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar, Plus, Trash2, DollarSign, Target, Clock } from 'lucide-react';
import { CreateBudgetData, useCreateBudget } from '@/features/finance/queries/budget';
import { TransactionCategory } from '@/features/finance/queries/categories';
import { useTransactionCategories } from '@/features/finance/queries/transactions';
import { formatCurrency, BASE_CURRENCY } from '@/lib/currency';
import { endOfMonth, endOfWeek, endOfQuarter, endOfYear } from 'date-fns';

const budgetFormSchema = z.object({
  name: z.string().min(1, 'Budget name is required').max(100, 'Budget name is too long'),
  period: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  startDate: z.date(),
  endDate: z.date(),
  currency: z.string().min(3).max(3).default(BASE_CURRENCY),
  totalPlanned: z.coerce
    .number()
    .positive('Total planned amount must be positive')
    .min(1, 'Minimum amount is 1'),
  isTemplate: z.boolean().default(false),
  templateName: z.string().optional(),
  categories: z
    .array(
      z.object({
        categoryId: z.string(),
        planned: z.coerce.number().positive('Category amount must be positive'),
      }),
    )
    .default([]),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

interface CreateBudgetFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const budgetPeriods = [
  {
    value: 'WEEKLY',
    label: 'Weekly',
    icon: Clock,
    description: 'Budget for one week',
  },
  {
    value: 'MONTHLY',
    label: 'Monthly',
    icon: Calendar,
    description: 'Budget for one month',
  },
  {
    value: 'QUARTERLY',
    label: 'Quarterly',
    icon: Target,
    description: 'Budget for 3 months',
  },
  {
    value: 'YEARLY',
    label: 'Yearly',
    icon: DollarSign,
    description: 'Budget for one year',
  },
] as const;

export function CreateBudgetForm({ onClose, onSuccess }: CreateBudgetFormProps) {
  const { toast } = useToast();
  const createBudget = useCreateBudget();
  const [_selectedPeriod, setSelectedPeriod] = useState<
    'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  >('MONTHLY');
  const [totalPlannedInput, setTotalPlannedInput] = useState('');

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema) as unknown as Resolver<BudgetFormData>,
    defaultValues: {
      name: '',
      period: 'MONTHLY',
      startDate: new Date(),
      endDate: endOfMonth(new Date()),
      currency: BASE_CURRENCY,
      totalPlanned: undefined,
      categories: [],
    },
    mode: 'onChange',
  });

  const watchedPeriod = form.watch('period');
  const watchedStartDate = form.watch('startDate');
  const watchedCategories = form.watch('categories');
  const watchedCurrency = form.watch('currency');
  const _watchedTotalPlanned = form.watch('totalPlanned');

  // Get expense categories for budget allocation
  const { data: categoriesData } = useTransactionCategories('EXPENSE');
  const categories: TransactionCategory[] = categoriesData?.categories || [];

  // Auto-update end date when period or start date changes
  useEffect(() => {
    if (watchedStartDate && watchedPeriod) {
      let endDate: Date;
      const startDate = new Date(watchedStartDate);

      switch (watchedPeriod) {
        case 'WEEKLY':
          endDate = endOfWeek(startDate);
          break;
        case 'MONTHLY':
          endDate = endOfMonth(startDate);
          break;
        case 'QUARTERLY':
          endDate = endOfQuarter(startDate);
          break;
        case 'YEARLY':
          endDate = endOfYear(startDate);
          break;
        default:
          endDate = endOfMonth(startDate);
      }

      form.setValue('endDate', endDate);
    }
  }, [watchedPeriod, watchedStartDate, form]);

  // Auto-generate budget name based on period and start date
  useEffect(() => {
    if (watchedStartDate && watchedPeriod) {
      const startDate = new Date(watchedStartDate);
      let name = '';

      switch (watchedPeriod) {
        case 'WEEKLY':
          name = `Week of ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          break;
        case 'MONTHLY':
          name = `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Budget`;
          break;
        case 'QUARTERLY':
          name = `Q${Math.floor(startDate.getMonth() / 3) + 1} ${startDate.getFullYear()} Budget`;
          break;
        case 'YEARLY':
          name = `${startDate.getFullYear()} Annual Budget`;
          break;
      }

      if (name && !form.getValues('name')) {
        form.setValue('name', name);
      }
    }
  }, [watchedPeriod, watchedStartDate, form]);

  const selectedPeriodConfig = budgetPeriods.find(p => p.value === watchedPeriod);

  // Handle total planned amount input with number formatting
  const handleTotalPlannedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTotalPlannedInput(value);
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        form.setValue('totalPlanned', numValue);
        form.clearErrors('totalPlanned');
      }
    }
  };

  const handleTotalPlannedBlur = () => {
    if (totalPlannedInput) {
      const numValue = parseFloat(totalPlannedInput);
      if (!isNaN(numValue)) {
        setTotalPlannedInput(numValue.toFixed(2));
        form.setValue('totalPlanned', numValue);
      }
    }
  };

  // Add category to budget
  const addCategory = (categoryId: string) => {
    const existingCategories = form.getValues('categories');
    if (!existingCategories.find(c => c.categoryId === categoryId)) {
      form.setValue('categories', [...existingCategories, { categoryId, planned: 0 }]);
    }
  };

  // Remove category from budget
  const removeCategory = (categoryId: string) => {
    const existingCategories = form.getValues('categories');
    form.setValue(
      'categories',
      existingCategories.filter(c => c.categoryId !== categoryId),
    );
  };

  // Update category planned amount
  const updateCategoryPlanned = (categoryId: string, planned: number) => {
    const existingCategories = form.getValues('categories');
    form.setValue(
      'categories',
      existingCategories.map(c => (c.categoryId === categoryId ? { ...c, planned } : c)),
    );
  };

  // Calculate total allocated amount
  const totalAllocated = watchedCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const remainingAmount = (form.getValues('totalPlanned') || 0) - totalAllocated;

  const onSubmit: SubmitHandler<BudgetFormData> = async data => {
    try {
      const formData: CreateBudgetData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        totalPlanned: parseFloat(data.totalPlanned.toFixed(2)),
        categories: data.categories
          .filter(c => c.planned > 0)
          .map(c => ({
            categoryId: c.categoryId,
            planned: parseFloat(c.planned.toFixed(2)),
          })),
      };

      await createBudget.mutateAsync(formData);
      toast({
        title: 'Success',
        description: 'Budget created successfully',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create budget';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
          {selectedPeriodConfig && (
            <selectedPeriodConfig.icon className="h-5 w-5" style={{ color: '#FF5722' }} />
          )}
          Create New Budget
        </h2>
        <p className="text-muted-foreground">
          Set up a budget to track your spending across different categories
        </p>
      </div>

      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Budget Period */}
          <div className="space-y-3">
            <Label>Budget Period</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgetPeriods.map(period => (
                <button
                  key={period.value}
                  type="button"
                  onClick={() => {
                    form.setValue('period', period.value);
                    setSelectedPeriod(period.value);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    watchedPeriod === period.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <period.icon className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">{period.label}</div>
                  <div className="text-xs opacity-70">{period.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name *</Label>
              <Input
                id="name"
                placeholder="My Monthly Budget"
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

            {/* Total Budget Amount */}
            <div className="space-y-2">
              <Label htmlFor="totalPlanned">Total Budget Amount *</Label>
              <div className="relative">
                <Input
                  id="totalPlanned"
                  type="text"
                  placeholder="2500.00"
                  value={totalPlannedInput}
                  onChange={handleTotalPlannedChange}
                  onBlur={handleTotalPlannedBlur}
                  className={`pr-16 ${form.formState.errors.totalPlanned ? 'border-destructive' : ''}`}
                  autoComplete="off"
                />
                <div className="absolute right-3 top-2.5 text-sm text-muted-foreground font-medium">
                  {form.watch('currency')}
                </div>
              </div>
              {form.formState.errors.totalPlanned && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <span className="text-xs">⚠</span>
                  {form.formState.errors.totalPlanned.message}
                </p>
              )}
              {totalPlannedInput && !form.formState.errors.totalPlanned && (
                <p className="text-xs text-muted-foreground">
                  Preview:{' '}
                  {formatCurrency(
                    parseFloat(totalPlannedInput) || 0,
                    form.watch('currency'),
                  ).replace('$', form.watch('currency') + ' ')}
                </p>
              )}
            </div>
          </div>

          {/* Template Options */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isTemplate"
                checked={form.watch('isTemplate')}
                onCheckedChange={checked => {
                  form.setValue('isTemplate', checked as boolean);
                  if (!checked) {
                    form.setValue('templateName', '');
                  }
                }}
              />
              <Label htmlFor="isTemplate" className="text-sm font-medium">
                Create as template for monthly budgets
              </Label>
            </div>
            {form.watch('isTemplate') && (
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="Monthly Living Expenses"
                  {...form.register('templateName')}
                />
                <p className="text-xs text-muted-foreground">
                  This template can be applied to create budgets for future months
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date *
              </Label>
              <DatePicker
                date={form.watch('startDate')}
                onDateChange={date => date && form.setValue('startDate', date)}
                placeholder="Select start date"
              />
            </div>

            {/* End Date (Auto-calculated) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date (Auto-calculated)
              </Label>
              <DatePicker
                date={form.watch('endDate')}
                onDateChange={date => date && form.setValue('endDate', date)}
                placeholder="End date"
              />
            </div>
          </div>

          <Separator />

          {/* Category Allocation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Category Allocation</Label>
                <p className="text-sm text-muted-foreground">
                  Allocate your budget across expense categories (optional)
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Allocated:{' '}
                  {formatCurrency(totalAllocated, watchedCurrency).replace(
                    '$',
                    watchedCurrency + ' ',
                  )}
                </div>
                <div
                  className={`text-sm font-medium ${remainingAmount < 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                  Remaining:{' '}
                  {formatCurrency(remainingAmount, watchedCurrency).replace(
                    '$',
                    watchedCurrency + ' ',
                  )}
                </div>
              </div>
            </div>

            {/* Available Categories */}
            {watchedCategories.length === 0 && (
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-3">
                  Select expense categories to include in your budget:
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories
                    .filter(cat => cat.type === 'EXPENSE')
                    .map(category => (
                      <Button
                        key={category.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCategory(category.id)}
                        className="justify-start"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Selected Categories */}
            {watchedCategories.length > 0 && (
              <div className="space-y-3">
                {watchedCategories.map(budgetCategory => {
                  const category = categories.find(c => c.id === budgetCategory.categoryId);
                  if (!category) return null;

                  return (
                    <div
                      key={budgetCategory.categoryId}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={budgetCategory.planned || ''}
                          onChange={e =>
                            updateCategoryPlanned(
                              budgetCategory.categoryId,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-24"
                          min="0"
                          step="0.01"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(budgetCategory.categoryId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Add More Categories */}
                <div className="border-2 border-dashed rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-2">Add more categories:</div>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter(
                        cat =>
                          cat.type === 'EXPENSE' &&
                          !watchedCategories.find(bc => bc.categoryId === cat.id),
                      )
                      .map(category => (
                        <Button
                          key={category.id}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addCategory(category.id)}
                          className="h-7"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={createBudget.isPending} className="flex-1">
              {createBudget.isPending ? 'Creating Budget...' : 'Create Budget'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
