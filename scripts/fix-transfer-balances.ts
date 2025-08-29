import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function fixTransferBalances() {
  try {
    console.log('🔄 Fixing transfer transaction balances...');

    // Find all TRANSFER transactions that have transferAmount different from amount
    const transferTransactions = await prisma.transaction.findMany({
      where: {
        type: 'TRANSFER',
        transferAmount: {
          not: null,
        },
      },
      include: {
        account: true,
        transferTo: true,
      },
    });

    console.log(`Found ${transferTransactions.length} transfer transactions to check`);

    for (const transaction of transferTransactions) {
      if (!transaction.transferTo || !transaction.transferAmount) continue;

      // Check if transferAmount is different from amount (indicating multi-currency transfer)
      const amountDifference = Math.abs(transaction.amount - transaction.transferAmount);
      const isMultiCurrency = amountDifference > 0.01; // Allow for small floating point differences

      if (isMultiCurrency) {
        console.log(`\n🔧 Fixing transaction ${transaction.id}:`);
        console.log(`   Source: ${transaction.amount} ${transaction.currency}`);
        console.log(
          `   Should be destination: ${transaction.transferAmount} ${transaction.transferCurrency}`,
        );
        console.log(`   But was added: ${transaction.amount} ${transaction.currency}`);

        // Calculate the correction needed
        const correctionAmount = transaction.transferAmount - transaction.amount;

        console.log(`   Correction needed: ${correctionAmount} to destination account`);

        // Apply correction to destination account
        await prisma.financeAccount.update({
          where: { id: transaction.transferToId! },
          data: {
            balance: {
              increment: correctionAmount,
            },
          },
        });

        console.log(
          `   ✅ Applied correction of ${correctionAmount} to account ${transaction.transferTo.name}`,
        );
      } else {
        console.log(`   ✅ Transaction ${transaction.id} has correct amounts`);
      }
    }

    console.log('\n🎉 Transfer balance corrections completed!');
  } catch (error) {
    console.error('❌ Error fixing transfer balances:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTransferBalances();
