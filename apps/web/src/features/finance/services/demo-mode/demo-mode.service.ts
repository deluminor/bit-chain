import { DEMO_TRADES_COUNT } from './demo-mode.constants';
import { generateDemoFinanceData, removeDemoFinanceData } from './demo-mode-finance.service';
import { generateDemoTrades, removeDemoTrades } from './demo-mode-trades.service';
import { type DemoModeAction, type DemoModeResult, DemoModeServiceError } from './demo-mode.types';
import { findOrCreateDemoUserByEmail } from './demo-mode-user.service';

export type { DemoModeAction, DemoModeResult };
export { DemoModeServiceError };

/**
 * Add or remove demo data for user identified by email.
 */
export async function runDemoModeAction(
  email: string,
  action: DemoModeAction,
): Promise<DemoModeResult> {
  if (!email) {
    throw new DemoModeServiceError('Unauthorized', 401);
  }

  if (action !== 'add' && action !== 'remove') {
    throw new DemoModeServiceError('Invalid action', 400);
  }

  const user = await findOrCreateDemoUserByEmail(email);

  if (action === 'add') {
    await generateDemoTrades(user.id);
    const finance = await generateDemoFinanceData(user.id);

    return {
      message: 'Demo data added successfully',
      details: {
        trades: DEMO_TRADES_COUNT,
        finance,
      },
    };
  }

  await removeDemoTrades(user.id);
  await removeDemoFinanceData(user.id);

  return { message: 'Demo data removed successfully' };
}
