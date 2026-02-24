/**
 * Request ID utilities for distributed tracing.
 *
 * A request ID is injected into every mobile API response via the
 * `X-Request-Id` header. Clients should log/report this ID when encountering
 * errors to speed up debugging.
 */

import { randomBytes } from 'node:crypto';

/**
 * Generates a URL-safe random request ID.
 * Format: 16 random bytes encoded as base64url (~22 chars).
 *
 * @returns A unique request identifier string
 */
export function generateRequestId(): string {
  return randomBytes(16).toString('base64url');
}

/**
 * Reads the `x-request-id` header from an incoming request.
 * If the client sends one, it's reused (allows end-to-end correlation).
 * Otherwise a new ID is generated.
 *
 * @param request - Incoming Next.js request
 * @returns Request ID string
 */
export function getOrCreateRequestId(request: Request): string {
  return (request.headers as Headers).get('x-request-id') ?? generateRequestId();
}
