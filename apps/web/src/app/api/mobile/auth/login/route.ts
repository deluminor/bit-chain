import { issueTokenPair } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { createRateLimiter, getIpAddress } from '@/lib/rate-limit';
import { getOrCreateRequestId } from '@/lib/request-id';
import { err, LoginRequestSchema, ok, type TokenResponse } from '@bit-chain/api-contracts';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';

/**
 * Brute-force protection: 10 attempts per IP per 15-minute window.
 * Single instance in-memory limiter — sufficient for personal use.
 */
const loginRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

/**
 * POST /api/mobile/auth/login
 *
 * Authenticates a user with email + password and returns a JWT access token
 * and a rotating refresh token. Registration is disabled — only existing users
 * in the database can log in.
 *
 * Rate limited: 10 attempts per IP per 15 minutes.
 *
 * @returns 200 TokenResponse on success
 * @returns 401 INVALID_CREDENTIALS if email/password don't match
 * @returns 422 VALIDATION_ERROR if request body is malformed
 * @returns 429 RATE_LIMITED if too many login attempts
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = getOrCreateRequestId(request);

  // Rate limit check
  const ip = getIpAddress(request);
  const rateCheck = loginRateLimiter.check(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      err(
        'RATE_LIMITED',
        `Too many login attempts. Retry after ${rateCheck.retryAfterSeconds}s`,
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

  const parsed = LoginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid request body', requestId),
      { status: 422, headers: { 'X-Request-Id': requestId } },
    );
  }

  const { email, password, deviceId } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  // Constant-time path: always run compare to prevent timing attacks
  const passwordHash = user?.password ?? '$2b$10$invalidhashtopreventtimingattack000000000000000';
  const isValid = await compare(password, passwordHash);

  if (!user || !isValid) {
    return NextResponse.json(err('INVALID_CREDENTIALS', 'Invalid email or password', requestId), {
      status: 401,
      headers: { 'X-Request-Id': requestId },
    });
  }

  const familyId = randomBytes(16).toString('hex');
  const pair = await issueTokenPair(user.id, user.email, familyId, deviceId);

  const response: TokenResponse = {
    ...pair,
    user: { id: user.id, email: user.email },
  };

  return NextResponse.json(ok(response), {
    status: 200,
    headers: { 'X-Request-Id': requestId },
  });
}
