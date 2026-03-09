import { Button } from '@/components/ui/button';

interface CategoryFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

export function CategoryFormActions({
  isSubmitting,
  isEditing,
  onCancel,
}: CategoryFormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" disabled={isSubmitting} className="flex-1">
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
      </Button>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}
