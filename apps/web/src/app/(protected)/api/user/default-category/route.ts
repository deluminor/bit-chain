import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const category = await prisma.category.findFirst({
      where: {
        name: user.defaultCategory,
        userId: user.id,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Default category not found' }, { status: 404 });
    }

    return NextResponse.json({ defaultCategory: category });
  } catch (error) {
    console.error('Error fetching default category:', error);
    return NextResponse.json({ error: 'Failed to fetch default category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { categoryId } = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.userId !== user.id) {
      return NextResponse.json({ error: 'Category does not belong to user' }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { defaultCategory: category.name },
    });

    return NextResponse.json({
      success: true,
      defaultCategory: category.name,
    });
  } catch (error) {
    console.error('Error updating default category:', error);
    return NextResponse.json({ error: 'Failed to update default category' }, { status: 500 });
  }
}
