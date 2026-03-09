import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { GoalFormData } from '../goal-form.config';

interface GoalBasicInfoSectionProps {
  form: UseFormReturn<GoalFormData>;
}

export function GoalBasicInfoSection({ form }: GoalBasicInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </>
  );
}
