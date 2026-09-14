/**
 * Simple rate limiter — memory locally, durable KV when configured.
 */

import { persistGetJson, persistSetJson, getKvConfig } from "@/lib/persist";

type Bucket = {
  count: number;
  resetAt: number;
};

const memory = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
};

async function readBucket(key: string): Promise<Bucket | null> {
  if (getKvConfig()) {
    return persistGetJson<Bucket>(`ratelimit:${key}`);
  }
  return memory.get(key) ?? null;
}

async function writeBucket(key: string, bucket: Bucket) {
  if (getKvConfig()) {
    await persistSetJson(`ratelimit:${key}`, bucket);
    return;
  }
  memory.set(key, bucket);
}

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  let bucket = await readBucket(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return {
      ok: false,
      limit,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterSec,
    };
  }

  bucket.count += 1;
  await writeBucket(key, bucket);

  return {
    ok: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
    retryAfterSec: 0,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.ok) {
    headers["Retry-After"] = String(result.retryAfterSec);
  }
  return headers;
}

export function clientKey(request: Request, suffix: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = forwarded || realIp || "local";
  return `${ip}:${suffix}`;
}
