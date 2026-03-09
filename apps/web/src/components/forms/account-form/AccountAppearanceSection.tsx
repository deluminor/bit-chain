import { predefinedAccountColors } from '@/components/forms/account-form.config';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Palette } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { AccountFormData } from '../account-form.config';

interface AccountAppearanceSectionProps {
  form: UseFormReturn<AccountFormData>;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function AccountAppearanceSection({
  form,
  selectedColor,
  onColorSelect,
}: AccountAppearanceSectionProps) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <Label>Account Color</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {predefinedAccountColors.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? 'border-foreground scale-110'
                  : 'border-muted hover:border-foreground/50'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add any additional details about this account..."
          {...form.register('description')}
          rows={3}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>
    </>
  );
}
