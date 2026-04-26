'use client';

import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { submitButtonStyle } from '@/components/forms/add-transaction-form.styles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Tag, X } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface TransactionFormMetaSectionProps {
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  selectedDate: Date | undefined;
  newTag: string;
  watchedTags: string[];
  isPending: boolean;
  isEditing: boolean;
  submitColor?: string;
  onDateChange: (date: Date | undefined) => void;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
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
  isPending,
  isEditing,
  submitColor,
  onCancel,
}: TransactionFormMetaSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What was this transaction for?"
          rows={3}
          className="min-h-[88px] resize-y"
          {...form.register('description')}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-foreground">
          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />
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
            <span className="text-xs" aria-hidden>
              ⚠
            </span>
            {form.formState.errors.date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-foreground">
          <Tag className="h-4 w-4 text-muted-foreground" aria-hidden />
          Tags
        </Label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <Input
            className="min-w-0 sm:flex-1"
            placeholder="Add a tag"
            value={newTag}
            onChange={event => onNewTagChange(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onAddTag();
              }
            }}
          />
          <Button
            type="button"
            onClick={onAddTag}
            variant="secondary"
            className="shrink-0 sm:w-auto"
          >
            Add
          </Button>
        </div>

        {watchedTags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {watchedTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="ml-0.5 rounded-sm hover:text-destructive"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:min-w-[200px] sm:flex-1"
          style={submitButtonStyle(submitColor)}
        >
          {isPending ? 'Saving...' : isEditing ? 'Update transaction' : 'Add transaction'}
        </Button>
      </div>
    </div>
  );
}
