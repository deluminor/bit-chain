import { rotateRefreshToken } from '@/lib/mobile-auth';
import { createRateLimiter, getIpAddress } from '@/lib/rate-limit';
import { getOrCreateRequestId } from '@/lib/request-id';
import { err, ok, RefreshRequestSchema, type TokenResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Refresh endpoint rate limit: 30 attempts per IP per 10-minute window.
 * Looser than login but still prevents automated token cycling abuse.
 */
const refreshRateLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 10 * 60 * 1000, // 10 minutes
});

/**
 * POST /api/mobile/auth/refresh
 *
 * Rotates a refresh token: revokes the provided token and issues a new
 * access + refresh pair. Implements token family invalidation — if a revoked
 * token is replayed, the entire family is invalidated (reuse detection).
 *
 * @returns 200 TokenResponse on success
 * @returns 401 INVALID_REFRESH_TOKEN | TOKEN_REUSE_DETECTED | REFRESH_TOKEN_EXPIRED
 * @returns 422 VALIDATION_ERROR if body is malformed
 * @returns 429 RATE_LIMITED if too many refresh attempts
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = getOrCreateRequestId(request);

  const ip = getIpAddress(request);
  const rateCheck = refreshRateLimiter.check(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      err(
        'RATE_LIMITED',
        `Too many requests. Retry after ${rateCheck.retryAfterSeconds}s`,
        requestId,
      ),
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfterSeconds),
          'X-Request-Id': requestId,
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(err('INVALID_JSON', 'Request body must be valid JSON', requestId), {
      status: 400,
      headers: { 'X-Request-Id': requestId },
    });
  }

  const parsed = RefreshRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid request body', requestId),
      { status: 422, headers: { 'X-Request-Id': requestId } },
    );
  }

  const deviceId = request.headers.get('x-device-id') ?? undefined;

  try {
    const { pair, userId, email } = await rotateRefreshToken(parsed.data.refreshToken, deviceId);

    const response: TokenResponse = {
      ...pair,
      user: { id: userId, email },
    };

    return NextResponse.json(ok(response), {
      status: 200,
      headers: { 'X-Request-Id': requestId },
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'REFRESH_FAILED';

    const statusMap: Record<string, number> = {
      INVALID_REFRESH_TOKEN: 401,
      TOKEN_REUSE_DETECTED: 401,
      REFRESH_TOKEN_EXPIRED: 401,
    };

    return NextResponse.json(err(code, 'Refresh token is invalid or expired', requestId), {
      status: statusMap[code] ?? 401,
      headers: { 'X-Request-Id': requestId },
    });
  }
}
