import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

async function findOrCreateUser(email: string) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: 'nextauth_user',
      },
    });

    await prisma.category.create({
      data: {
        name: 'solo',
        userId: user.id,
      },
    });
  }

  return user;
}

// Get all budget templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);

    const templates = await prisma.budget.findMany({
      where: {
        userId: user.id,
        isTemplate: true,
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching budget templates:', error);
    return NextResponse.json({ error: 'Failed to fetch budget templates' }, { status: 500 });
  }
}

// Apply template to create new budget for current month
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const { templateId, targetDate } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Find the template
    const template = await prisma.budget.findFirst({
      where: {
        id: templateId,
        userId: user.id,
        isTemplate: true,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Calculate dates for the new budget
    const date = targetDate ? new Date(targetDate) : new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const budgetName = `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()} - ${template.templateName || template.name}`;

    // Check if budget already exists for this period
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
        name: budgetName,
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this period from this template' },
        { status: 400 },
      );
    }

    // Create new budget from template
    const newBudget = await prisma.budget.create({
      data: {
        userId: user.id,
        name: budgetName,
        period: 'MONTHLY',
        startDate,
        endDate,
        currency: template.currency,
        totalPlanned: template.totalPlanned,
        isActive: true,
        isTemplate: false,
        parentTemplateId: template.id,
      },
    });

    // Copy categories from template
    if (template.categories.length > 0) {
      const budgetCategories = template.categories.map(cat => ({
        budgetId: newBudget.id,
        categoryId: cat.categoryId,
        planned: cat.planned,
      }));

      await prisma.budgetCategory.createMany({
        data: budgetCategories,
      });
    }

    // Fetch the created budget with categories
    const createdBudget = await prisma.budget.findUnique({
      where: { id: newBudget.id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ budget: createdBudget });
  } catch (error: any) {
    console.error('Error applying budget template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to apply budget template' },
      { status: 500 },
    );
  }
}
