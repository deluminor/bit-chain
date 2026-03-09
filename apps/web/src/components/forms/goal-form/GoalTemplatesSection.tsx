import { goalTemplates } from '@/components/forms/goal-form.config';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface GoalTemplatesSectionProps {
  onApplyTemplate: (template: (typeof goalTemplates)[number]) => void;
}

export function GoalTemplatesSection({ onApplyTemplate }: GoalTemplatesSectionProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base">Quick Start Templates</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {goalTemplates.map((template, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onApplyTemplate(template)}
            className="p-3 rounded-lg border-2 border-muted bg-muted/50 hover:bg-muted transition-all text-left"
          >
            <div className="text-2xl mb-1">{template.icon}</div>
            <div className="text-sm font-medium">{template.name}</div>
            <div className="text-xs text-muted-foreground">
              {template.suggestedAmount.toLocaleString()} UAH
            </div>
          </button>
        ))}
      </div>
      <Separator />
    </div>
  );
}
