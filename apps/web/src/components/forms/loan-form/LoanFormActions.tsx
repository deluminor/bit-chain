import { Button } from '@/components/ui/button';

interface LoanFormActionsProps {
  isPending: boolean;
  isEditing: boolean;
  onClose: () => void;
}

export function LoanFormActions({ isPending, isEditing, onClose }: LoanFormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" disabled={isPending} className="flex-1">
        {isPending
          ? `${isEditing ? 'Updating' : 'Creating'} Loan...`
          : isEditing
            ? 'Update Loan'
            : 'Create Loan'}
      </Button>
      <Button type="button" variant="outline" onClick={onClose} className="flex-1">
        Cancel
      </Button>
    </div>
  );
}
