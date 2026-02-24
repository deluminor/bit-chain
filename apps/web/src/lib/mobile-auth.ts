/**
 * Mobile bearer token authentication utilities.
 *
 * Provides JWT access token issuance/verification and refresh token
 * rotation with family-based invalidation for reuse detection.
 *
 * Auth flow:
 *  1. POST /api/mobile/auth/login  → issue access + refresh token pair
 *  2. Client sends `Authorization: Bearer <accessToken>` on each request
 *  3. On 401, client calls POST /api/mobile/auth/refresh with refresh token
 *  4. Server rotates: old token revoked, new pair issued (same familyId)
 *  5. If old token is used again → entire family revoked (reuse detection)
 *
 * @see {@link getMobileUser} for request authentication guard
 */

import { prisma } from '@/lib/prisma';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

const ACCESS_TTL_MS = (): number => {
  const minutes = parseInt(process.env['MOBILE_JWT_ACCESS_TTL_MINUTES'] ?? '15', 10);
  return minutes * 60 * 1000;
};

const REFRESH_TTL_MS = (): number => {
  const days = parseInt(process.env['MOBILE_JWT_REFRESH_TTL_DAYS'] ?? '30', 10);
  return days * 24 * 60 * 60 * 1000;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env['MOBILE_JWT_SECRET'];
  if (!secret) throw new Error('MOBILE_JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

// ---------------------------------------------------------------------------
// Access Token (short-lived signed JWT)
// ---------------------------------------------------------------------------

interface AccessTokenPayload {
  sub: string;
  email: string;
  type: 'access';
}

/**
 * Issues a signed JWT access token for a user.
 *
 * @param userId - User database id
 * @param email - User email (included in payload for convenience)
 * @returns Signed JWT string valid for MOBILE_JWT_ACCESS_TTL_MINUTES minutes
 */
export async function issueAccessToken(userId: string, email: string): Promise<string> {
  const expiresAt = new Date(Date.now() + ACCESS_TTL_MS());

  return new SignJWT({ email, type: 'access' } satisfies Omit<AccessTokenPayload, 'sub'>)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getJwtSecret());
}

/**
 * Verifies and decodes an access token.
 *
 * @param token - JWT string from Authorization header
 * @returns Decoded payload if valid
 * @throws {Error} If token is invalid, expired, or wrong type
 */
async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify<AccessTokenPayload>(token, getJwtSecret());

  if (payload.type !== 'access') {
    throw new Error('Invalid token type');
  }

  return payload as AccessTokenPayload;
}

// ---------------------------------------------------------------------------
// Refresh Token (random opaque value, stored as hash)
// ---------------------------------------------------------------------------

/**
 * Generates a cryptographically random refresh token and its SHA-256 hash.
 *
 * @returns `{ token, tokenHash }` — store only hash, send token to client
 */
export function generateRefreshToken(): { token: string; tokenHash: string } {
  const token = randomBytes(48).toString('base64url');
  const tokenHash = hashToken(token);
  return { token, tokenHash };
}

/**
 * Hashes a token with SHA-256.
 *
 * @param token - Raw token string from client
 * @returns Hex-encoded SHA-256 hash for database storage/lookup
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// ---------------------------------------------------------------------------
// Token Pair (login / refresh response)
// ---------------------------------------------------------------------------

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds (for client-side expiry tracking) */
  expiresIn: number;
}

/**
 * Issues a complete access + refresh token pair and persists the session.
 *
 * @param userId - Authenticated user's database id
 * @param email - User email
 * @param familyId - Token family id (pass existing or create new with `randomBytes(16).toString('hex')`)
 * @param deviceId - Optional stable device identifier
 * @returns Token pair ready to send to the client
 */
export async function issueTokenPair(
  userId: string,
  email: string,
  familyId: string,
  deviceId?: string
): Promise<TokenPair> {
  const [accessToken, { token: refreshToken, tokenHash }] = await Promise.all([
    issueAccessToken(userId, email),
    Promise.resolve(generateRefreshToken()),
  ]);

  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS());

  await prisma.mobileSession.create({
    data: { userId, tokenHash, familyId, deviceId, expiresAt },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: Math.floor(ACCESS_TTL_MS() / 1000),
  };
}

// ---------------------------------------------------------------------------
// Refresh Token Rotation
// ---------------------------------------------------------------------------

export interface RotateResult {
  pair: TokenPair;
  userId: string;
  email: string;
}

/**
 * Rotates a refresh token: revokes the old one and issues a new pair.
 * Detects token reuse (stolen token scenario) and revokes the entire family.
 *
 * @param refreshToken - Raw refresh token from the client
 * @param deviceId - Device identifier for session tracking
 * @returns New token pair if rotation succeeds
 * @throws {Error} If token is invalid, expired, revoked, or reuse detected
 */
export async function rotateRefreshToken(
  refreshToken: string,
  deviceId?: string
): Promise<RotateResult> {
  const tokenHash = hashToken(refreshToken);

  const session = await prisma.mobileSession.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!session) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  // Reuse detection: token already consumed — revoke entire family
  if (session.revokedAt !== null) {
    await prisma.mobileSession.updateMany({
      where: { familyId: session.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new Error('TOKEN_REUSE_DETECTED');
  }

  if (session.expiresAt < new Date()) {
    throw new Error('REFRESH_TOKEN_EXPIRED');
  }

  // Revoke the current token
  await prisma.mobileSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  const { user } = session;
  const pair = await issueTokenPair(user.id, user.email, session.familyId, deviceId);

  return { pair, userId: user.id, email: user.email };
}

// ---------------------------------------------------------------------------
// Request Guard
// ---------------------------------------------------------------------------

export interface AuthenticatedMobileUser {
  id: string;
  email: string;
}

/**
 * Extracts and verifies the Bearer token from an incoming request.
 * Use at the start of every mobile API route handler.
 *
 * @param request - Next.js server request
 * @returns Authenticated user data if token is valid
 * @throws {Error} If Authorization header is missing or token is invalid/expired
 *
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const user = await getMobileUser(request);
 *   // user.id is guaranteed to be a valid userId
 * }
 * ```
 */
export async function getMobileUser(request: NextRequest): Promise<AuthenticatedMobileUser> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('MISSING_AUTH_HEADER');
  }

  const token = authHeader.slice(7);
  const payload = await verifyAccessToken(token);

  return { id: payload.sub as string, email: payload.email };
}

/**
 * Revokes all active mobile sessions for a user (logout all devices).
 *
 * @param userId - User database id
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.mobileSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Revokes a single session identified by the raw refresh token.
 *
 * @param refreshToken - Raw token from the client (will be hashed internally)
 */
export async function revokeSingleSession(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await prisma.mobileSession.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
