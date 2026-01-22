'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  TransactionCategory,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from '@/features/finance/queries/categories';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useState } from 'react';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  type: z.enum(['INCOME', 'EXPENSE']),
  parentId: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required'),
  isDefault: z.boolean().default(false),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const ICON_OPTIONS = [
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

const COLOR_OPTIONS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
  '#78716c', // stone
  '#dc2626', // red-600
  '#16a34a', // green-600
];

interface CategoryFormProps {
  category?: TransactionCategory;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    category?.color || COLOR_OPTIONS[0] || '#3b82f6',
  );
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || 'DollarSign');

  const { data: categoriesData } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isEditing = !!category;
  const categories: TransactionCategory[] = categoriesData?.categories || [];

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as unknown as Resolver<CategoryFormData>,
    defaultValues: {
      name: category?.name || '',
      type: category?.type || 'EXPENSE',
      parentId: category?.parentId || 'none',
      color: category?.color || COLOR_OPTIONS[0],
      icon: category?.icon || 'DollarSign',
      isDefault: category?.isDefault ?? false,
    },
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = form;
  const watchedType = watch('type');

  // Filter parent categories by type and exclude current category
  const availableParents = categories.filter(
    cat =>
      cat.type === watchedType &&
      !cat.parentId && // Only top-level categories can be parents
      cat.id !== category?.id, // Can't be parent of itself
  );

  const onSubmit: SubmitHandler<CategoryFormData> = async data => {
    try {
      const payload = {
        ...data,
        color: selectedColor || COLOR_OPTIONS[0] || '#3b82f6',
        icon: selectedIcon,
        parentId: data.parentId === 'none' ? undefined : data.parentId || undefined,
      };

      if (isEditing) {
        await updateCategory.mutateAsync({
          id: category.id,
          ...payload,
        });
      } else {
        await createCategory.mutateAsync(payload);
      }

      onSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  };

  const IconComponent = ICON_OPTIONS.find(opt => opt.value === selectedIcon)?.icon || DollarSign;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {isEditing ? 'Edit Category' : 'Create New Category'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isEditing ? 'Update category details' : 'Add a new category for your transactions'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
                    {...field}
                    disabled={category?.isDefault && isEditing}
                  />
                </FormControl>
                {category?.isDefault && isEditing && (
                  <FormDescription>Default category names cannot be changed</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={category?.isDefault && isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                {category?.isDefault && isEditing && (
                  <FormDescription>Default category types cannot be changed</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parent Category */}
          <FormField
            control={control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No parent (top-level category)</SelectItem>
                    {availableParents.map(parentCat => (
                      <SelectItem key={parentCat.id} value={parentCat.id}>
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: parentCat.color }}
                          />
                          {parentCat.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose a parent category to create a subcategory</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-foreground' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }} />
              <span className="text-sm text-muted-foreground">{selectedColor}</span>
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(iconOption => {
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
                    onClick={() => setSelectedIcon(iconOption.value)}
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
                {ICON_OPTIONS.find(opt => opt.value === selectedIcon)?.label}
              </span>
            </div>
          </div>

          {/* Is Default */}
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

          {/* Preview */}
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
                <div className="font-medium">{form.watch('name') || 'Category Name'}</div>
                <div className="text-xs text-muted-foreground">{form.watch('type')} Category</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
