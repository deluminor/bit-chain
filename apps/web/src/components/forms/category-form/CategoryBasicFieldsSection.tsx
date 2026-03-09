import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TransactionCategory } from '@/features/finance/queries/categories';
import type { Control } from 'react-hook-form';
import type { CategoryFormData } from '../category-form.config';

interface CategoryBasicFieldsSectionProps {
  control: Control<CategoryFormData>;
  availableParents: TransactionCategory[];
  category?: TransactionCategory;
  isEditing: boolean;
}

export function CategoryBasicFieldsSection({
  control,
  availableParents,
  category,
  isEditing,
}: CategoryBasicFieldsSectionProps) {
  return (
    <>
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
                {availableParents.map(parentCategory => (
                  <SelectItem key={parentCategory.id} value={parentCategory.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: parentCategory.color }}
                      />
                      {parentCategory.name}
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
    </>
  );
}
