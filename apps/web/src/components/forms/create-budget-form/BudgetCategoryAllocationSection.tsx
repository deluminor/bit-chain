'use client';

import { BudgetFormData } from '@/components/forms/create-budget-form.config';
import { categorySwatchStyle } from '@/components/forms/create-budget-form.styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionCategory } from '@/features/finance/queries/categories';
import { formatCurrency } from '@/lib/currency';
import { Plus, Trash2 } from 'lucide-react';

interface BudgetCategoryAllocationSectionProps {
  categories: TransactionCategory[];
  watchedCategories: BudgetFormData['categories'];
  watchedCurrency: string;
  totalAllocated: number;
  remainingAmount: number;
  onAddCategory: (categoryId: string) => void;
  onRemoveCategory: (categoryId: string) => void;
  onUpdateCategoryPlanned: (categoryId: string, planned: number) => void;
}

export function BudgetCategoryAllocationSection({
  categories,
  watchedCategories,
  watchedCurrency,
  totalAllocated,
  remainingAmount,
  onAddCategory,
  onRemoveCategory,
  onUpdateCategoryPlanned,
}: BudgetCategoryAllocationSectionProps) {
  return (
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
            {formatCurrency(totalAllocated, watchedCurrency).replace('$', `${watchedCurrency} `)}
          </div>
          <div
            className={`text-sm font-medium ${
              remainingAmount < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            Remaining:{' '}
            {formatCurrency(remainingAmount, watchedCurrency).replace('$', `${watchedCurrency} `)}
          </div>
        </div>
      </div>

      {watchedCategories.length === 0 && (
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-3">
            Select expense categories to include in your budget:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories
              .filter(category => category.type === 'EXPENSE')
              .map(category => (
                <Button
                  key={category.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddCategory(category.id)}
                  className="justify-start"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={categorySwatchStyle(category.color)}
                  />
                  {category.name}
                </Button>
              ))}
          </div>
        </div>
      )}

      {watchedCategories.length > 0 && (
        <div className="space-y-3">
          {watchedCategories.map(budgetCategory => {
            const category = categories.find(item => item.id === budgetCategory.categoryId);
            if (!category) {
              return null;
            }

            return (
              <div
                key={budgetCategory.categoryId}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={categorySwatchStyle(category.color)}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={budgetCategory.planned || ''}
                    onChange={event =>
                      onUpdateCategoryPlanned(
                        budgetCategory.categoryId,
                        parseFloat(event.target.value) || 0,
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
                    onClick={() => onRemoveCategory(budgetCategory.categoryId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="border-2 border-dashed rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-2">Add more categories:</div>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter(
                  category =>
                    category.type === 'EXPENSE' &&
                    !watchedCategories.find(item => item.categoryId === category.id),
                )
                .map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddCategory(category.id)}
                    className="h-7"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={categorySwatchStyle(category.color)}
                    />
                    {category.name}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
