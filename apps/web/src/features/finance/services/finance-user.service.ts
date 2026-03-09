import { prisma } from '@/lib/prisma';

/**
 * Finds an existing finance user by email or creates a minimal account for NextAuth users.
 *
 * @param email - Unique user email from authenticated session
 * @returns Existing or newly created user record
 */
export async function findOrCreateFinanceUserByEmail(email: string) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return user;
  }

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

  return user;
}
