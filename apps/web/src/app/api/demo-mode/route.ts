import { authOptions } from '@/features/auth/libs/auth';
import {
  DemoModeServiceError,
  runDemoModeAction,
  type DemoModeAction,
} from '@/features/finance/services/demo-mode/demo-mode.service';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

interface DemoModeRequestBody {
  action?: DemoModeAction;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as DemoModeRequestBody;
    const action = body.action;

    if (!action) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await runDemoModeAction(session.user.email, action);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DemoModeServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('[POST /api/demo-mode] Unhandled error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
