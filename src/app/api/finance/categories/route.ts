import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  type: z.enum(['INCOME', 'EXPENSE']),
  parentId: z.string().cuid().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required'),
  isDefault: z.boolean().default(false),
});

// Helper function to get user from session
async function getUserFromSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'INCOME' | 'EXPENSE' | null;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const hierarchical = searchParams.get('hierarchical') === 'true';

    // Build where clause
    const where = {
      userId: user.id,
      ...(type && { type }),
      ...(includeInactive ? {} : { isActive: true }),
    };

    if (hierarchical) {
      // Get categories in hierarchical structure (parents with children)
      const parentCategories = await prisma.transactionCategory.findMany({
        where: {
          ...where,
          parentId: null, // Only parent categories
        },
        include: {
          children: {
            where: {
              userId: user.id,
              ...(includeInactive ? {} : { isActive: true }),
            },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              transactions: true,
              children: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({
        categories: parentCategories,
        total: parentCategories.length,
      });
    } else {
      // Get flat list of all categories
      const categories = await prisma.transactionCategory.findMany({
        where,
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          _count: {
            select: {
              transactions: true,
              children: true,
            },
          },
        },
        orderBy: [{ parent: { name: 'asc' } }, { name: 'asc' }],
      });

      // Group by type for easier consumption
      const grouped = {
        INCOME: categories.filter(cat => cat.type === 'INCOME'),
        EXPENSE: categories.filter(cat => cat.type === 'EXPENSE'),
      };

      return NextResponse.json({
        categories: hierarchical ? grouped : categories,
        total: categories.length,
        counts: {
          income: grouped.INCOME.length,
          expense: grouped.EXPENSE.length,
          parents: categories.filter(cat => !cat.parentId).length,
          children: categories.filter(cat => cat.parentId).length,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    // Check if category name already exists for this user and type
    const existingCategory = await prisma.transactionCategory.findFirst({
      where: {
        userId: user.id,
        name: validatedData.name,
        type: validatedData.type,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name and type already exists' },
        { status: 400 },
      );
    }

    // If parentId is provided, verify it exists and belongs to user
    if (validatedData.parentId) {
      const parentCategory = await prisma.transactionCategory.findFirst({
        where: {
          id: validatedData.parentId,
          userId: user.id,
          type: validatedData.type, // Parent must be same type
          parentId: null, // Parent cannot be a child category itself
        },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found or invalid' },
          { status: 400 },
        );
      }
    }

    const category = await prisma.transactionCategory.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        _count: {
          select: {
            transactions: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        category,
        message: 'Category created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.transactionCategory.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category is default and prevent certain modifications
    if (existingCategory.isDefault && (updateData.name || updateData.type)) {
      return NextResponse.json(
        { error: 'Cannot modify name or type of default categories' },
        { status: 400 },
      );
    }

    // If name is being changed, check for duplicates
    if (updateData.name && updateData.name !== existingCategory.name) {
      const nameExists = await prisma.transactionCategory.findFirst({
        where: {
          userId: user.id,
          name: updateData.name,
          type: updateData.type || existingCategory.type,
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Category with this name and type already exists' },
          { status: 400 },
        );
      }
    }

    const updatedCategory = await prisma.transactionCategory.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        _count: {
          select: {
            transactions: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json({
      category: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Check if category exists and belongs to user
    const category = await prisma.transactionCategory.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Prevent deletion of default categories
    if (category.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default categories. Deactivate instead.' },
        { status: 400 },
      );
    }

    // Check if category has transactions or children
    if (category._count.transactions > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category with transactions',
          hasTransactions: true,
          transactionCount: category._count.transactions,
          message: 'Deactivate the category instead or reassign transactions first',
        },
        { status: 400 },
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category with subcategories',
          hasChildren: true,
          childrenCount: category._count.children,
          message: 'Delete or reassign subcategories first',
        },
        { status: 400 },
      );
    }

    // Delete the category
    await prisma.transactionCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
