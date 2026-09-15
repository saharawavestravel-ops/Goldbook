import { NextResponse } from "next/server";
import { createSessionToken, sessionCookieOptions, verifyUserPin } from "@/lib/auth";
import {
  clientKey,
  consumeRateLimit,
  getRateLimit,
  rateLimitHeaders,
  resetRateLimit,
} from "@/lib/rate-limit";
import { isUserId } from "@/lib/users";

/** Failed attempts only — correct PIN must always be allowed. */
const LOGIN_FAIL_LIMIT = 20;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function normalizePin(raw: unknown) {
  if (typeof raw !== "string") return "";
  return raw.replace(/\D/g, "").slice(0, 4);
}

export async function POST(request: Request) {
  let body: { userId?: string; pin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId.trim().toLowerCase() : "";
  const pin = normalizePin(body.pin);
  if (!userId || !isUserId(userId) || pin.length !== 4) {
    return NextResponse.json({ error: "Choose a profile and enter your PIN" }, { status: 400 });
  }

  const limitKey = clientKey(request, `login:${userId}`);
  const limited = await getRateLimit(limitKey, LOGIN_FAIL_LIMIT);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${limited.retryAfterSec}s.`,
      },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  if (!(await verifyUserPin(userId, pin))) {
    const afterFail = await consumeRateLimit(limitKey, LOGIN_FAIL_LIMIT, LOGIN_WINDOW_MS);
    return NextResponse.json(
      {
        error: afterFail.ok
          ? "Wrong PIN"
          : `Too many failed attempts. Try again in ${afterFail.retryAfterSec}s.`,
      },
      {
        status: afterFail.ok ? 401 : 429,
        headers: rateLimitHeaders(afterFail),
      },
    );
  }

  await resetRateLimit(limitKey).catch(() => null);

  const { touchUserLogin } = await import("@/lib/users-store");
  await touchUserLogin(userId).catch(() => null);

  const token = createSessionToken(userId);
  const response = NextResponse.json({ ok: true, userId });
  response.cookies.set(sessionCookieOptions(token));
  for (const [key, value] of Object.entries(rateLimitHeaders(limited))) {
    response.headers.set(key, value);
  }
  return response;
}
