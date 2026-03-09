import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Calendar, Palette, Smile } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { goalColors, goalIcons, type GoalFormData } from '../goal-form.config';

interface GoalCustomizationSectionProps {
  form: UseFormReturn<GoalFormData>;
  selectedColor: string;
  selectedIcon: string;
}

export function GoalCustomizationSection({
  form,
  selectedColor,
  selectedIcon,
}: GoalCustomizationSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Target Deadline (Optional)
          </Label>
          <DatePicker
            date={form.watch('deadline')}
            onDateChange={date => {
              form.setValue('deadline', date);
            }}
            placeholder="Select target date"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Goal Color
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {goalColors.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  form.setValue('color', color.value);
                }}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-current scale-105'
                    : 'border-muted hover:border-muted-foreground'
                }`}
                style={{ color: color.value }}
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto"
                  style={{ backgroundColor: color.value }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Smile className="h-4 w-4" />
          Goal Icon
        </Label>
        <div className="grid grid-cols-8 gap-2">
          {goalIcons.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => {
                form.setValue('icon', icon);
              }}
              className={`p-2 rounded-lg border-2 transition-all text-lg ${
                selectedIcon === icon
                  ? 'border-primary bg-primary/10'
                  : 'border-muted hover:border-muted-foreground hover:bg-muted/50'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
