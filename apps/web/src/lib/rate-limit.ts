/**
 * In-memory sliding-window rate limiter.
 *
 * Uses an LRU-style Map that auto-expires entries after `windowMs`.
 * Not suitable for multi-instance deployments — use Upstash Redis for that.
 * For this personal project (single instance) this is sufficient.
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
 *
 * export async function POST(request: NextRequest) {
 *   const ip = getIpAddress(request);
 *   const result = limiter.check(ip);
 *   if (!result.allowed) {
 *     return NextResponse.json(
 *       err('RATE_LIMITED', `Too many requests. Retry after ${result.retryAfterSeconds}s`),
 *       { status: 429, headers: { 'Retry-After': String(result.retryAfterSeconds) } }
 *     );
 *   }
 *   // ...
 * }
 * ```
 */

interface RateLimitEntry {
  /** Timestamps (ms) of requests within the current window */
  timestamps: number[];
  /** Absolute time when this entry was first created */
  createdAt: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Seconds until the oldest request falls out of the window (0 if allowed) */
  retryAfterSeconds: number;
}

interface RateLimiterOptions {
  /** Max number of requests per window per key */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimiter {
  /**
   * Checks whether the given key is within rate limits.
   * Increments the counter if allowed.
   */
  check(key: string): RateLimitResult;
  /** Clears all entries (useful for testing) */
  reset(): void;
}

/**
 * Creates a sliding-window rate limiter backed by an in-memory Map.
 *
 * @param options - Rate limit configuration
 * @returns RateLimiter instance
 */
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { maxRequests, windowMs } = options;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent unbounded memory growth.
  // Runs every minute — entries older than 2×windowMs are evicted.
  const cleanup = () => {
    const cutoff = Date.now() - windowMs * 2;
    for (const [key, entry] of store) {
      if (entry.createdAt < cutoff) {
        store.delete(key);
      }
    }
  };

  // Only run cleanup in server environments
  if (typeof setInterval !== 'undefined') {
    const interval = setInterval(cleanup, Math.max(windowMs, 60_000));
    // Unref so the interval doesn't keep the process alive in tests
    if (typeof interval === 'object' && 'unref' in interval) {
      (interval as NodeJS.Timeout).unref();
    }
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const windowStart = now - windowMs;

      let entry = store.get(key);
      if (!entry) {
        entry = { timestamps: [], createdAt: now };
        store.set(key, entry);
      }

      // Slide the window: remove timestamps older than windowMs
      entry.timestamps = entry.timestamps.filter(t => t > windowStart);

      if (entry.timestamps.length >= maxRequests) {
        // Oldest request in the current window — when it expires, a new slot opens
        const oldestInWindow = entry.timestamps[0]!;
        const retryAfterMs = oldestInWindow + windowMs - now;
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        };
      }

      // Allow — record this request
      entry.timestamps.push(now);
      return {
        allowed: true,
        remaining: maxRequests - entry.timestamps.length,
        retryAfterSeconds: 0,
      };
    },

    reset(): void {
      store.clear();
    },
  };
}

/**
 * Extracts a reliable IP address from a Next.js request.
 * Prefers `x-forwarded-for` (set by Vercel/proxies) over the socket address.
 *
 * @param request - Incoming Next.js request
 * @returns IP address string, or 'unknown' if not determinable
 */
export function getIpAddress(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may contain multiple IPs (client, proxies): take the first
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return 'unknown';
}
