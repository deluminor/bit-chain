import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: {
    id: string;
  };
};

export async function GET(_: NextRequest, context: unknown) {
  try {
    const { id } = (context as Context).params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userEmail = session.user?.email;
    if (!userEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        trades: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = {
      ...category,
      tradesCount: category.trades.length,
      trades: undefined,
    };

    return NextResponse.json({ category: result });
  } catch (error) {
    console.error('Error getting category:', error);
    return NextResponse.json({ error: 'Failed to get category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: unknown) {
  try {
    const { id } = (context as Context).params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userEmail = session.user?.email;
    if (!userEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name: name.trim(),
        NOT: {
          id,
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Another category with this name already exists' },
        { status: 400 },
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: unknown) {
  try {
    const { id } = (context as Context).params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userEmail = session.user?.email;
    if (!userEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const category = await prisma.category.findUnique({
      where: { id },
      include: { trades: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (category.name === 'solo') {
      return NextResponse.json(
        { error: 'Cannot delete the default "solo" category' },
        { status: 400 },
      );
    }

    if (user.defaultCategory === category.name) {
      return NextResponse.json(
        { error: 'Cannot delete your default category. Change default category first.' },
        { status: 400 },
      );
    }

    if (category.trades.length > 0) {
      const soloCategory = await prisma.category.findFirst({
        where: {
          userId: user.id,
          name: 'solo',
        },
      });

      if (!soloCategory) {
        return NextResponse.json(
          { error: 'Default category "solo" not found for trade migration' },
          { status: 500 },
        );
      }

      await prisma.trade.updateMany({
        where: { categoryId: id },
        data: { categoryId: soloCategory.id },
      });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
