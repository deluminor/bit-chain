import { prisma } from '@/lib/prisma';

export async function findOrCreateDemoUserByEmail(email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return existing;
  }

  const created = await prisma.user.create({
    data: {
      email,
      password: 'nextauth_user',
    },
  });

  await prisma.category.create({
    data: {
      name: 'solo',
      userId: created.id,
    },
  });

  return created;
}
