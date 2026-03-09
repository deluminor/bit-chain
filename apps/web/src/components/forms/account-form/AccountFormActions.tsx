import { Button } from '@/components/ui/button';

interface AccountFormActionsProps {
  isPending: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

export function AccountFormActions({ isPending, isEditing, onCancel }: AccountFormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" disabled={isPending} className="flex-1">
        {isPending ? 'Saving...' : isEditing ? 'Update Account' : 'Create Account'}
      </Button>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      )}
    </div>
  );
}
