import { authOptions } from '@/features/auth/libs/auth';
import { createRateLimiter, getIpAddress } from '@/lib/rate-limit';
import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const nextAuthHandler = NextAuth(authOptions);

const webLoginLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
});

async function handler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> },
): Promise<NextResponse | Response> {
  if (req.method === 'POST' && req.nextUrl.pathname.endsWith('/callback/credentials')) {
    const ip = getIpAddress(req);
    const result = webLoginLimiter.check(ip);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(result.retryAfterSeconds) },
        },
      );
    }
  }

  return nextAuthHandler(req, context);
}

export { handler as GET, handler as POST };
