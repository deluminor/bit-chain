#!/usr/bin/env tsx

import { PrismaClient } from '../src/generated/prisma';
import { syncMonobankAccounts } from '../src/lib/integrations/monobank-sync';

const prisma = new PrismaClient();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const result: { email?: string; from?: string; force?: boolean } = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--email') {
      result.email = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--from') {
      result.from = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--force') {
      result.force = true;
    }
  }

  return result;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
  const { email, from, force } = parseArgs();
  const token = process.env.MONO_API;

  if (!token) {
    throw new Error('MONO_API is not configured');
  }

  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });

  if (!user) {
    throw new Error('No user found for sync');
  }

  const fromDate = from ? new Date(from) : null;
  if (from && Number.isNaN(fromDate?.getTime())) {
    throw new Error('Invalid --from date');
  }

  const payload = {
    reason: 'script',
    fromDate: fromDate ?? null,
    force: Boolean(force),
  };

  console.log(`Syncing Monobank for ${user.email}`);

  while (true) {
    const result = await syncMonobankAccounts({
      prisma,
      userId: user.id,
      token,
      payload,
      maxAccountsPerRun: Number.POSITIVE_INFINITY,
      throttleMs: 65_000,
    });

    if (result.skipReason === 'no_accounts') {
      console.log('No enabled accounts to sync.');
      break;
    }

    console.log(
      `Imported ${result.importedCount} txs, updated ${result.updatedAccounts} accounts, remaining ${result.remainingAccounts}.`,
    );

    if (result.remainingAccounts <= 0) {
      break;
    }

    if (result.skipReason === 'rate_limit') {
      console.log('Rate limit hit. Waiting 65 seconds...');
      await delay(65_000);
      continue;
    }

    await delay(65_000);
  }
};

run()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
