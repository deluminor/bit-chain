'use client';

import {
  recurringPatterns,
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { submitButtonStyle } from '@/components/forms/add-transaction-form.styles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Tag, X } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface TransactionFormMetaSectionProps {
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  selectedDate: Date | undefined;
  newTag: string;
  watchedTags: string[];
  watchedIsRecurring: boolean;
  isPending: boolean;
  isEditing: boolean;
  submitColor?: string;
  onDateChange: (date: Date | undefined) => void;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onToggleRecurring: () => void;
  onCancel?: () => void;
}

export function TransactionFormMetaSection({
  form,
  selectedDate,
  onDateChange,
  newTag,
  onNewTagChange,
  onAddTag,
  watchedTags,
  onRemoveTag,
  watchedIsRecurring,
  onToggleRecurring,
  isPending,
  isEditing,
  submitColor,
  onCancel,
}: TransactionFormMetaSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What was this transaction for?"
          rows={2}
          {...form.register('description')}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date *
        </Label>
        <DatePicker
          date={selectedDate}
          onDateChange={onDateChange}
          placeholder="Select transaction date"
          className={form.formState.errors.date ? 'border-destructive' : ''}
        />
        {form.formState.errors.date && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <span className="text-xs">⚠</span>
            {form.formState.errors.date.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Tags
        </Label>

        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={event => onNewTagChange(event.target.value)}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onAddTag();
              }
            }}
          />
          <Button type="button" onClick={onAddTag} size="sm">
            Add
          </Button>
        </div>

        {watchedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {watchedTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="isRecurring">Recurring Transaction</Label>
          <Button type="button" variant="outline" size="sm" onClick={onToggleRecurring}>
            {watchedIsRecurring ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {watchedIsRecurring && (
          <div className="space-y-2">
            <Label>Recurring Pattern</Label>
            <Select
              value={form.watch('recurringPattern') ?? ''}
              onValueChange={value =>
                form.setValue(
                  'recurringPattern',
                  value as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent>
                {recurringPatterns.map(pattern => (
                  <SelectItem key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1"
          style={submitButtonStyle(submitColor)}
        >
          {isPending ? 'Saving...' : isEditing ? 'Update Transaction' : 'Add Transaction'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
