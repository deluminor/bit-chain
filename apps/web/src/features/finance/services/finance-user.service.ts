import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export async function findOrCreateFinanceUserByEmail(email: string) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return user;
  }

  const randomPassword = randomBytes(32).toString('base64url');
  const hashedPassword = await hash(randomPassword, 10);

  user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  await prisma.category.create({
    data: {
      name: 'solo',
      userId: user.id,
    },
  });

  return user;
}
