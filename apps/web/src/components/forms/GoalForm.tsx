'use client';

import {
  goalFormSchema,
  goalTemplates,
  type GoalFormData,
} from '@/components/forms/goal-form.config';
import { GoalAmountSection } from '@/components/forms/goal-form/GoalAmountSection';
import { GoalBasicInfoSection } from '@/components/forms/goal-form/GoalBasicInfoSection';
import { GoalCustomizationSection } from '@/components/forms/goal-form/GoalCustomizationSection';
import { GoalFormActions } from '@/components/forms/goal-form/GoalFormActions';
import { GoalTemplatesSection } from '@/components/forms/goal-form/GoalTemplatesSection';
import {
  useCreateGoal,
  useUpdateGoal,
  type CreateGoalData,
  type FinancialGoal,
  type UpdateGoalData,
} from '@/features/finance/queries/goals';
import { useToast } from '@/hooks/use-toast';
import { BASE_CURRENCY } from '@/lib/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';

interface GoalFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  goal?: FinancialGoal;
}

export function GoalForm({ onClose, onSuccess, goal }: GoalFormProps) {
  const { toast } = useToast();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

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

  const selectedColor = form.watch('color') || '#10B981';
  const selectedIcon = form.watch('icon') || '🎯';

  const applyTemplate = (template: (typeof goalTemplates)[number]) => {
    form.setValue('name', template.name);
    form.setValue('description', template.description);
    form.setValue('icon', template.icon);
    form.setValue('color', template.color);
    form.setValue('targetAmount', template.suggestedAmount);
  };

  const onSubmit: SubmitHandler<GoalFormData> = async data => {
    try {
      const payload = {
        ...data,
        targetAmount: parseFloat(data.targetAmount.toFixed(2)),
        currentAmount: parseFloat(data.currentAmount.toFixed(2)),
        deadline: data.deadline ? data.deadline.toISOString() : undefined,
      };

      if (isEditing && goal) {
        await updateGoal.mutateAsync({ id: goal.id, ...payload } as UpdateGoalData);
        toast({ title: 'Success', description: 'Goal updated successfully' });
      } else {
        await createGoal.mutateAsync(payload as CreateGoalData);
        toast({ title: 'Success', description: 'Goal created successfully' });
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
          <span className="text-2xl">{selectedIcon}</span>
          {isEditing
            ? 'Update your financial goal details and track progress'
            : 'Set a financial target and track your progress towards achieving it'}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!isEditing && <GoalTemplatesSection onApplyTemplate={applyTemplate} />}

        <GoalBasicInfoSection form={form} />

        <GoalAmountSection form={form} selectedColor={selectedColor} />

        <GoalCustomizationSection
          form={form}
          selectedColor={selectedColor}
          selectedIcon={selectedIcon}
        />

        <GoalFormActions
          isPending={createGoal.isPending || updateGoal.isPending}
          isEditing={isEditing}
          onClose={onClose}
        />
      </form>
    </>
  );
}
