import { prisma } from './src/lib/prisma'; // Use internal export

async function main() {
  const users = await prisma.user.findMany({ take: 1 });
  if (!users.length) return;
  const user = users[0];

  const periodAggregates = await prisma.transaction.groupBy({
    by: ['type', 'currency'],
    where: {
      userId: user.id,
      isDemo: false,
      type: { in: ['INCOME', 'EXPENSE'] },
      date: { gte: new Date('2026-02-01') },
    },
    _sum: { amount: true },
  });

  console.log('periodAggregates:', JSON.stringify(periodAggregates, null, 2));
}

main()
  .catch(e => console.log('error', e))
  .finally(() => prisma.$disconnect());
