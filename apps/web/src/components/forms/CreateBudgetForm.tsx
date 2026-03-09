'use client';

import { BudgetBasicSettingsSection } from '@/components/forms/create-budget-form/BudgetBasicSettingsSection';
import { BudgetCategoryAllocationSection } from '@/components/forms/create-budget-form/BudgetCategoryAllocationSection';
import {
  buildBudgetName,
  resolveEndDate,
  type BudgetPeriod,
} from '@/components/forms/create-budget-form/budget-form.utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreateBudgetData, useCreateBudget } from '@/features/finance/queries/budget';
import { TransactionCategory } from '@/features/finance/queries/categories';
import { useTransactionCategories } from '@/features/finance/queries/transactions';
import { useToast } from '@/hooks/use-toast';
import { BASE_CURRENCY } from '@/lib/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  budgetFormSchema,
  budgetPeriods,
  type BudgetFormData,
  type BudgetFormInput,
} from './create-budget-form.config';
import { periodHeaderIconStyle } from './create-budget-form.styles';

interface CreateBudgetFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateBudgetForm({ onClose, onSuccess }: CreateBudgetFormProps) {
  const { toast } = useToast();
  const createBudget = useCreateBudget();
  const [totalPlannedInput, setTotalPlannedInput] = useState('');

  const form = useForm<BudgetFormInput, unknown, BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      period: 'MONTHLY',
      startDate: new Date(),
      endDate: resolveEndDate(new Date(), 'MONTHLY'),
      currency: BASE_CURRENCY,
      totalPlanned: undefined,
      categories: [],
    },
    mode: 'onChange',
  });

  const watchedPeriod = form.watch('period') ?? 'MONTHLY';
  const watchedStartDate = form.watch('startDate');
  const watchedCategories = form.watch('categories') ?? [];
  const watchedCurrency = form.watch('currency') ?? BASE_CURRENCY;

  const { data: categoriesData } = useTransactionCategories('EXPENSE');
  const categories: TransactionCategory[] = categoriesData?.categories || [];

  useEffect(() => {
    if (!watchedStartDate || !watchedPeriod) {
      return;
    }

    const startDate = new Date(watchedStartDate);
    form.setValue('endDate', resolveEndDate(startDate, watchedPeriod));
  }, [watchedPeriod, watchedStartDate, form]);

  useEffect(() => {
    if (!watchedStartDate || !watchedPeriod) {
      return;
    }

    const startDate = new Date(watchedStartDate);
    const name = buildBudgetName(startDate, watchedPeriod);
    if (name && !form.getValues('name')) {
      form.setValue('name', name);
    }
  }, [watchedPeriod, watchedStartDate, form]);

  const selectedPeriodConfig = budgetPeriods.find(period => period.value === watchedPeriod);

  const handleTotalPlannedChange = (value: string) => {
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
    if (!totalPlannedInput) {
      return;
    }

    const numValue = parseFloat(totalPlannedInput);
    if (!isNaN(numValue)) {
      setTotalPlannedInput(numValue.toFixed(2));
      form.setValue('totalPlanned', numValue);
    }
  };

  const addCategory = (categoryId: string) => {
    const existingCategories = form.getValues('categories') ?? [];
    if (!existingCategories.find(category => category.categoryId === categoryId)) {
      form.setValue('categories', [...existingCategories, { categoryId, planned: 0 }]);
    }
  };

  const removeCategory = (categoryId: string) => {
    const existingCategories = form.getValues('categories') ?? [];
    form.setValue(
      'categories',
      existingCategories.filter(category => category.categoryId !== categoryId),
    );
  };

  const updateCategoryPlanned = (categoryId: string, planned: number) => {
    const existingCategories = form.getValues('categories') ?? [];
    form.setValue(
      'categories',
      existingCategories.map(category =>
        category.categoryId === categoryId ? { ...category, planned } : category,
      ),
    );
  };

  const totalAllocated = watchedCategories.reduce((sum, category) => sum + category.planned, 0);
  const remainingAmount = (form.getValues('totalPlanned') || 0) - totalAllocated;

  const onSubmit: SubmitHandler<BudgetFormData> = async data => {
    try {
      const formData: CreateBudgetData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        totalPlanned: parseFloat(data.totalPlanned.toFixed(2)),
        categories: data.categories
          .filter(category => category.planned > 0)
          .map(category => ({
            categoryId: category.categoryId,
            planned: parseFloat(category.planned.toFixed(2)),
          })),
      };

      await createBudget.mutateAsync(formData);
      toast({ title: 'Success', description: 'Budget created successfully' });

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create budget';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
          {selectedPeriodConfig && (
            <selectedPeriodConfig.icon className="h-5 w-5" style={periodHeaderIconStyle} />
          )}
          Create New Budget
        </h2>
        <p className="text-muted-foreground">
          Set up a budget to track your spending across different categories
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BudgetBasicSettingsSection
          form={form}
          watchedPeriod={watchedPeriod}
          watchedCurrency={watchedCurrency}
          totalPlannedInput={totalPlannedInput}
          onPeriodChange={period => form.setValue('period', period as BudgetPeriod)}
          onTotalPlannedChange={handleTotalPlannedChange}
          onTotalPlannedBlur={handleTotalPlannedBlur}
        />

        <Separator />

        <BudgetCategoryAllocationSection
          categories={categories}
          watchedCategories={watchedCategories}
          watchedCurrency={watchedCurrency}
          totalAllocated={totalAllocated}
          remainingAmount={remainingAmount}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          onUpdateCategoryPlanned={updateCategoryPlanned}
        />

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
  );
}
