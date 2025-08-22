'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  Tag,
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Gamepad2,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Plane,
  Gift,
  Wrench,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CategoryForm } from '@/components/forms/CategoryForm';
import {
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
  TransactionCategory,
  CategoryFilters,
} from '@/features/finance/queries/categories';
import { AnimatedDiv } from '@/components/ui/animations';
import {
  DataTable,
  TableFilters,
  DataTableColumn,
  FilterField,
  createSelectFilter,
} from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/useDataTable';

const ICON_MAP = {
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Gamepad2,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Plane,
  Gift,
  Wrench,
} as const;

export default function CategoriesPage() {
  // Data table hooks
  const { currentPage, pageSize, onPageChange, onPageSizeChange, totalPages } = useDataTable({
    initialPageSize: 25,
  });

  // Filter states
  const [filters, setFilters] = useState<CategoryFilters>({
    type: undefined,
    includeInactive: false,
    hierarchical: false,
  });

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get categories with current filters
  const { data: categoriesData, isLoading, error, refetch, isFetching } = useCategories(filters);

  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const categories = categoriesData?.categories || [];
  const counts = categoriesData?.counts || {
    income: 0,
    expense: 0,
    parents: 0,
    children: 0,
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    } catch {
      // Error is handled by the mutation
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (category: TransactionCategory) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        isActive: !category.isActive,
      });
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleFormSuccess = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedCategory(null);
  };

  const clearFilters = () => {
    setFilters({
      type: undefined,
      includeInactive: false,
      hierarchical: false,
    });
    onPageChange(1);
  };

  const hasActiveFilters = !!filters.type || !!filters.includeInactive;

  const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || Tag;
  };

  // Define table columns
  const columns: DataTableColumn<TransactionCategory>[] = [
    {
      key: 'icon',
      header: '',
      cell: category => {
        const IconComponent = getIconComponent(category.icon);
        return (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color }}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        );
      },
      className: 'w-[60px]',
    },
    {
      key: 'name',
      header: 'Name',
      cell: category => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {category.name}
            {category.isDefault && (
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            )}
            {!category.isActive && (
              <Badge variant="outline" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
          {category.parent && (
            <div className="text-xs text-muted-foreground">Under: {category.parent.name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: category => (
        <Badge variant={category.type === 'INCOME' ? 'default' : 'secondary'}>
          {category.type}
        </Badge>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      cell: category => (
        <div className="text-sm">
          <div>{category._count.transactions} transactions</div>
          {category._count.children > 0 && (
            <div className="text-xs text-muted-foreground">
              {category._count.children} subcategories
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'color',
      header: 'Color',
      cell: category => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-xs text-muted-foreground">{category.color}</span>
        </div>
      ),
    },
  ];

  // Define filter fields
  const filterFields: FilterField[] = [
    createSelectFilter(
      'type',
      filters.type,
      value =>
        setFilters(prev => ({
          ...prev,
          type: value === 'all' ? undefined : (value as 'INCOME' | 'EXPENSE'),
        })),
      [
        { value: 'INCOME', label: 'Income' },
        { value: 'EXPENSE', label: 'Expense' },
      ],
      'types',
    ),
    {
      key: 'includeInactive',
      type: 'custom',
      onChange: () => {}, // Required by FilterField type but not used
      render: () => (
        <Button
          variant={filters.includeInactive ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilters(prev => ({ ...prev, includeInactive: !prev.includeInactive }))}
          className="h-9"
        >
          {filters.includeInactive ? (
            <Eye className="w-4 h-4 mr-2" />
          ) : (
            <EyeOff className="w-4 h-4 mr-2" />
          )}
          {filters.includeInactive ? 'Show All' : 'Active Only'}
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container mx-auto py-6">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-lg font-medium mb-2">Failed to load categories</p>
          <p className="text-muted-foreground mb-4">There was an error loading your categories.</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-3 md:gap-6">
          {/* Header */}
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
            <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                {counts.income}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Income Categories</p>
            </div>

            <div className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                {counts.expense}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Expense Categories</p>
            </div>

            <div className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                {counts.parents}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Parent Categories</p>
            </div>

            <div className="p-4 sm:p-5 lg:p-6 rounded-lg border bg-card">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                {counts.children}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Subcategories</p>
            </div>
          </div>

          {/* Filters */}
          <TableFilters
            fields={filterFields}
            onClearFilters={clearFilters}
            onRefresh={refetch}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            gridColumns="grid-cols-1 md:grid-cols-3"
          />

          {/* Categories Table */}
          <div className="overflow-x-auto">
            <DataTable
              data={categories}
              columns={columns}
              isLoading={isLoading}
              isFetching={isFetching}
              currentPage={currentPage}
              totalPages={totalPages(categories.length)}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSizeOptions={[10, 25, 50, 100]}
              title={
                <>
                  <Tag className="h-5 w-5" />
                  Categories
                </>
              }
              description={`Your transaction categories ${hasActiveFilters ? '(filtered)' : ''}`}
              onRefresh={refetch}
              actions={category => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(category)}>
                      {category.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowDeleteDialog(true);
                      }}
                      className="text-destructive"
                      disabled={category.isDefault}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              emptyMessage={
                hasActiveFilters ? 'No categories match your filters' : 'No categories found'
              }
              emptyDescription={
                hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Create your first category to get started'
              }
              emptyActions={
                !hasActiveFilters && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                )
              }
              showPagination={categories.length > 10}
            />
          </div>

          {/* Create Category Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                onSuccess={handleFormSuccess}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={selectedCategory || undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowEditDialog(false);
                  setSelectedCategory(null);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Category Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSelectedCategory(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCategory} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete Category'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AnimatedDiv>
  );
}
