'use client';

import {
  BudgetFormData,
  BudgetFormInput,
  budgetPeriods,
} from '@/components/forms/create-budget-form.config';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/currency';
import { Calendar } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

interface BudgetBasicSettingsSectionProps {
  form: UseFormReturn<BudgetFormInput, unknown, BudgetFormData>;
  watchedPeriod: BudgetPeriod;
  watchedCurrency: string;
  totalPlannedInput: string;
  onPeriodChange: (period: BudgetPeriod) => void;
  onTotalPlannedChange: (value: string) => void;
  onTotalPlannedBlur: () => void;
}

export function BudgetBasicSettingsSection({
  form,
  watchedPeriod,
  watchedCurrency,
  totalPlannedInput,
  onPeriodChange,
  onTotalPlannedChange,
  onTotalPlannedBlur,
}: BudgetBasicSettingsSectionProps) {
  const isTemplate = form.watch('isTemplate');

  return (
    <>
      <div className="space-y-3">
        <Label>Budget Period</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {budgetPeriods.map(period => (
            <button
              key={period.value}
              type="button"
              onClick={() => onPeriodChange(period.value)}
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

        <div className="space-y-2">
          <Label htmlFor="totalPlanned">Total Budget Amount *</Label>
          <div className="relative">
            <Input
              id="totalPlanned"
              type="text"
              placeholder="2500.00"
              value={totalPlannedInput}
              onChange={event => onTotalPlannedChange(event.target.value)}
              onBlur={onTotalPlannedBlur}
              className={`pr-16 ${form.formState.errors.totalPlanned ? 'border-destructive' : ''}`}
              autoComplete="off"
            />
            <div className="absolute right-3 top-2.5 text-sm text-muted-foreground font-medium">
              {watchedCurrency}
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
              {formatCurrency(parseFloat(totalPlannedInput) || 0, watchedCurrency).replace(
                '$',
                `${watchedCurrency} `,
              )}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isTemplate"
            checked={isTemplate}
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
        {isTemplate && (
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
    </>
  );
}
