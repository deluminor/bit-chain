import { err, ok } from '@bit-chain/api-contracts';
import { getMobileUser, revokeAllUserSessions, revokeSingleSession } from '@/lib/mobile-auth';
import { getOrCreateRequestId } from '@/lib/request-id';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/mobile/auth/logout
 *
 * Revokes mobile sessions for the authenticated user.
 * If `refreshToken` is provided in the body, only that specific session is revoked.
 * If `all: true` is provided, all active sessions are revoked (logout all devices).
 * Without a body, only the current refresh token session is revoked.
 *
 * @returns 200 { revoked: true } on success
 * @returns 401 if access token is missing or invalid
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = getOrCreateRequestId(request);

  let user: { id: string; email: string };
  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(
      err('UNAUTHORIZED', 'Invalid or missing access token', requestId),
      { status: 401, headers: { 'X-Request-Id': requestId } }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    const raw = await request.json().catch(() => ({}));
    if (typeof raw === 'object' && raw !== null) {
      body = raw as Record<string, unknown>;
    }
  } catch {
    // Body is optional — ignore parse errors
  }

  if (body['all'] === true) {
    await revokeAllUserSessions(user.id);
  } else if (typeof body['refreshToken'] === 'string') {
    await revokeSingleSession(body['refreshToken']);
  } else {
    // No specific token provided — revoke all (safe fallback for mobile)
    await revokeAllUserSessions(user.id);
  }

  return NextResponse.json(ok({ revoked: true }), {
    status: 200,
    headers: { 'X-Request-Id': requestId },
  });
}
