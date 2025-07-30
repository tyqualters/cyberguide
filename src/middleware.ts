import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type RateLimitRecord = {
  count: number;
  expiresAt: number;
};

// In-memory map to track IP hits
const ipHits = new Map<string, RateLimitRecord>();

const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/login' && request.method == 'POST') {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'unknown';

    const now = Date.now();
    const record = ipHits.get(ip);

    if (!record || record.expiresAt < now) {
      // New window or no record, reset count
      ipHits.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    } else {
      if (record.count >= LIMIT) {
        const retryAfterSeconds = Math.ceil((record.expiresAt - now) / 1000);
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Try again later.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': retryAfterSeconds.toString(),
            },
          }
        );
      }

      // Increment count
      record.count++;
      ipHits.set(ip, record);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
};