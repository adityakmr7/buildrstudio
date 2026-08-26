// In-memory, fixed-window rate limiter. Acceptable for MVP per the
// marketplace plan's constraints — resets on cold start / redeploy, and
// doesn't share state across serverless instances. Swap for Upstash Redis
// (@upstash/redis) if that starts mattering; the call site
// (app/api/v1/chat/route.ts) is the only thing that would need to change.

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000;
const buckets = new Map<string, Bucket>();

// Cheap periodic cleanup so the Map doesn't grow unbounded on a long-lived
// server process.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(key);
  }
}, WINDOW_MS).unref?.();

export function rateLimit(identifier: string, limitPerMinute: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = buckets.get(identifier);

  if (!existing || now - existing.windowStart > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: limitPerMinute - 1 };
  }

  if (existing.count >= limitPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: limitPerMinute - existing.count };
}
