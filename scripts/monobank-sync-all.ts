#!/usr/bin/env tsx

import { PrismaClient } from '../src/generated/prisma';
import { syncMonobankAccounts } from '../src/lib/integrations/monobank-sync';

const prisma = new PrismaClient();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const result: { email?: string; from?: string; force?: boolean; accountName?: string } = {};

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
    if (arg === '--account') {
      result.accountName = args[i + 1];
      i += 1;
      continue;
    }
  }

  return result;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
  const { email, from, force } = parseArgs();
  let user;

  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  } else {
    // If no email provided, find the first user that has a Monobank integration
    const integration = await prisma.integration.findFirst({
      where: { provider: 'MONOBANK', status: 'CONNECTED' },
      include: { user: true },
    });
    user = integration?.user ?? null;
  }

  if (!user) {
    throw new Error('No user found for sync');
  }

  // Fetch token from integration record
  const integration = await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId: user.id,
        provider: 'MONOBANK',
      },
    },
  });

  const token = integration?.token;

  if (!token) {
    throw new Error(`Monobank token is not configured for user ${user.email}`);
  }

  const fromDate = from ? new Date(from) : null;
  if (from && Number.isNaN(fromDate?.getTime())) {
    throw new Error('Invalid --from date');
  }

  const payload = {
    reason: 'script',
    fromDate: fromDate ?? null,
    force: Boolean(force),
    accountName: parseArgs().accountName,
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
