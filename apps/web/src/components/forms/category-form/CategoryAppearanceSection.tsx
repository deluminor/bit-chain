import {
  CATEGORY_COLOR_OPTIONS,
  CATEGORY_ICON_OPTIONS,
  type CategoryFormData,
} from '@/components/forms/category-form.config';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { TransactionCategory } from '@/features/finance/queries/categories';
import { DollarSign } from 'lucide-react';
import type { Control } from 'react-hook-form';

interface CategoryAppearanceSectionProps {
  control: Control<CategoryFormData>;
  selectedColor: string;
  selectedIcon: string;
  categoryName: string;
  selectedType: 'INCOME' | 'EXPENSE';
  category?: TransactionCategory;
  onColorSelect: (color: string) => void;
  onIconSelect: (icon: string) => void;
}

export function CategoryAppearanceSection({
  control,
  selectedColor,
  selectedIcon,
  categoryName,
  selectedType,
  category,
  onColorSelect,
  onIconSelect,
}: CategoryAppearanceSectionProps) {
  const IconComponent =
    CATEGORY_ICON_OPTIONS.find(option => option.value === selectedIcon)?.icon || DollarSign;

  return (
    <>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLOR_OPTIONS.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-foreground' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }} />
          <span className="text-sm text-muted-foreground">{selectedColor}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-6 gap-2">
          {CATEGORY_ICON_OPTIONS.map(iconOption => {
            const Icon = iconOption.icon;
            return (
              <button
                key={iconOption.value}
                type="button"
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  selectedIcon === iconOption.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onIconSelect(iconOption.value)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs text-center">{iconOption.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <IconComponent className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">
            {CATEGORY_ICON_OPTIONS.find(option => option.value === selectedIcon)?.label}
          </span>
        </div>
      </div>

      {!category?.isDefault && (
        <FormField
          control={control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Default Category</FormLabel>
                <FormDescription>Mark this as a default system category</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <div className="rounded-lg border p-4 bg-muted/50">
        <Label className="text-sm font-medium">Preview</Label>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedColor }}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium">{categoryName || 'Category Name'}</div>
            <div className="text-xs text-muted-foreground">{selectedType} Category</div>
          </div>
        </div>
      </div>
    </>
  );
}
