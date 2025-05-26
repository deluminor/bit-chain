import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Category } from '@/generated/prisma';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useDefaultCategory,
  useDeleteCategory,
  useSetDefaultCategory,
  useUpdateCategory,
} from '../queries/categories';

interface CategoryModalProps {
  children: React.ReactNode;
}

export function CategoryModal({ children }: CategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: defaultCategory, isLoading: isDefaultLoading } = useDefaultCategory();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const setDefaultCategory = useSetDefaultCategory();

  const isLoading =
    isCategoriesLoading ||
    isDefaultLoading ||
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending ||
    setDefaultCategory.isPending;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    await createCategory.mutateAsync({ name: newCategoryName.trim() });
    setNewCategoryName('');
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editedCategoryName.trim()) return;

    await updateCategory.mutateAsync({
      id: editingCategory.id,
      name: editedCategoryName.trim(),
    });
    setEditingCategory(null);
    setEditedCategoryName('');
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditedCategoryName('');
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory.mutateAsync(id);
  };

  const handleSetDefaultCategory = async (id: string) => {
    await setDefaultCategory.mutateAsync({ categoryId: id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateCategory} className="flex items-center gap-2 mb-4">
          <Input
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !newCategoryName.trim()}>
            {createCategory.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </form>

        {isCategoriesLoading ? (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            <p className="mt-2">Loading categories...</p>
          </div>
        ) : categories?.length ? (
          <div className="border rounded-md overflow-auto max-h-[350px] relative">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingCategory?.id === category.id ? (
                        <form onSubmit={handleEditCategory} className="flex items-center gap-2">
                          <Input
                            value={editedCategoryName}
                            onChange={e => setEditedCategoryName(e.target.value)}
                            className="h-8"
                            disabled={isLoading}
                          />
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              type="submit"
                              disabled={isLoading || !editedCategoryName.trim()}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              onClick={cancelEditing}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center">
                          <span>{category.name}</span>
                          {defaultCategory?.id === category.id && (
                            <Badge variant="outline" className="ml-2">
                              default
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingCategory?.id !== category.id && (
                        <div className="flex justify-end gap-1">
                          {category.id !== defaultCategory?.id && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => startEditing(category)}
                                    disabled={isLoading}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>

                              {/* <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleSetDefaultCategory(category.id)}
                                    disabled={isLoading || defaultCategory?.id === category.id}
                                  >
                                    <StarIcon className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Set as default</TooltipContent>
                              </Tooltip> */}

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteCategory(category.id)}
                                    disabled={isLoading || defaultCategory?.id === category.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No categories found. Create your first category above.
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Note: The '{defaultCategory?.name}' category cannot be deleted.</p>
          <p>You cannot delete a category set as default.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
