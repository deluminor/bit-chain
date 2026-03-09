'use client';

import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';

interface CategoriesPageHeaderProps {
  onCreateCategory: () => void;
}

export function CategoriesPageHeader({ onCreateCategory }: CategoriesPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-3 rounded-xl bg-primary shadow-sm">
          <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
      </div>
      <Button onClick={onCreateCategory} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>
  );
}
