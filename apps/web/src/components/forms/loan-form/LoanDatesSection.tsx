import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { LoanFormData } from '../loan-form.config';

interface LoanDatesSectionProps {
  form: UseFormReturn<LoanFormData>;
  startDate: Date | undefined;
  dueDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onDueDateChange: (date: Date | undefined) => void;
}

export function LoanDatesSection({
  form,
  startDate,
  dueDate,
  onStartDateChange,
  onDueDateChange,
}: LoanDatesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Start Date
        </Label>
        <DatePicker
          date={startDate}
          onDateChange={date => {
            onStartDateChange(date);
            form.setValue('startDate', date);
          }}
          placeholder="Select start date"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Due Date
        </Label>
        <DatePicker
          date={dueDate}
          onDateChange={date => {
            onDueDateChange(date);
            form.setValue('dueDate', date);
          }}
          placeholder="Select due date"
        />
      </div>
    </div>
  );
}
