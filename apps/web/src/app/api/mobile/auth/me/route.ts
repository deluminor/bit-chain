import { getMobileUser } from '@/lib/mobile-auth';
import { getOrCreateRequestId } from '@/lib/request-id';
import { err, ok } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/auth/me
 *
 * Returns the authenticated user's profile.
 * Lightweight "token check" endpoint — use to verify token validity on app launch.
 *
 * @returns 200 { id, email } if access token is valid
 * @returns 401 UNAUTHORIZED if token is missing, expired, or invalid
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestId = getOrCreateRequestId(request);

  try {
    const user = await getMobileUser(request);
    return NextResponse.json(ok({ id: user.id, email: user.email }), {
      status: 200,
      headers: { 'X-Request-Id': requestId },
    });
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token', requestId), {
      status: 401,
      headers: { 'X-Request-Id': requestId },
    });
  }
}
