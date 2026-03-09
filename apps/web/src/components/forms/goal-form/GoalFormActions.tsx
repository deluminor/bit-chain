import { Button } from '@/components/ui/button';

interface GoalFormActionsProps {
  isPending: boolean;
  isEditing: boolean;
  onClose: () => void;
}

export function GoalFormActions({ isPending, isEditing, onClose }: GoalFormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" disabled={isPending} className="flex-1">
        {isPending
          ? `${isEditing ? 'Updating' : 'Creating'} Goal...`
          : isEditing
            ? 'Update Goal'
            : 'Create Goal'}
      </Button>
      <Button type="button" variant="outline" onClick={onClose} className="flex-1">
        Cancel
      </Button>
    </div>
  );
}
