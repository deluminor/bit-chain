'use client';

import {
  CATEGORY_COLOR_OPTIONS,
  type CategoryFormData,
  categorySchema,
} from '@/components/forms/category-form.config';
import { CategoryAppearanceSection } from '@/components/forms/category-form/CategoryAppearanceSection';
import { CategoryBasicFieldsSection } from '@/components/forms/category-form/CategoryBasicFieldsSection';
import { CategoryFormActions } from '@/components/forms/category-form/CategoryFormActions';
import { Form } from '@/components/ui/form';
import {
  type TransactionCategory,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from '@/features/finance/queries/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type Resolver, type SubmitHandler, useForm } from 'react-hook-form';

interface CategoryFormProps {
  category?: TransactionCategory;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    category?.color || CATEGORY_COLOR_OPTIONS[0] || '#3b82f6',
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
      color: category?.color || CATEGORY_COLOR_OPTIONS[0],
      icon: category?.icon || 'DollarSign',
      isDefault: category?.isDefault ?? false,
    },
  });

  const watchedType = form.watch('type');

  const availableParents = categories.filter(
    item => item.type === watchedType && !item.parentId && item.id !== category?.id,
  );

  const onSubmit: SubmitHandler<CategoryFormData> = async data => {
    try {
      const payload = {
        ...data,
        color: selectedColor || CATEGORY_COLOR_OPTIONS[0] || '#3b82f6',
        icon: selectedIcon,
        parentId: data.parentId === 'none' ? undefined : data.parentId || undefined,
      };

      if (isEditing && category) {
        await updateCategory.mutateAsync({ id: category.id, ...payload });
      } else {
        await createCategory.mutateAsync(payload);
      }

      onSuccess?.();
    } catch {
      // handled by query mutation
    }
  };

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CategoryBasicFieldsSection
            control={form.control}
            availableParents={availableParents}
            category={category}
            isEditing={isEditing}
          />

          <CategoryAppearanceSection
            control={form.control}
            selectedColor={selectedColor}
            selectedIcon={selectedIcon}
            categoryName={form.watch('name')}
            selectedType={watchedType}
            category={category}
            onColorSelect={color => {
              setSelectedColor(color);
              form.setValue('color', color);
            }}
            onIconSelect={icon => {
              setSelectedIcon(icon);
              form.setValue('icon', icon);
            }}
          />

          <CategoryFormActions
            isSubmitting={form.formState.isSubmitting}
            isEditing={isEditing}
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  );
}
