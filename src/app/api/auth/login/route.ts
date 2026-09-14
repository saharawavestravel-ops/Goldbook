import { NextResponse } from "next/server";
import { createSessionToken, sessionCookieOptions, verifyUserPin } from "@/lib/auth";
import { clientKey, consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { isUserId } from "@/lib/users";

const LOGIN_LIMIT = 30;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  let body: { userId?: string; pin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, pin } = body;
  if (!userId || !pin || !isUserId(userId)) {
    return NextResponse.json({ error: "Choose a profile and enter your PIN" }, { status: 400 });
  }

  const limited = await consumeRateLimit(
    clientKey(request, `login:${userId}`),
    LOGIN_LIMIT,
    LOGIN_WINDOW_MS,
  );
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  if (!(await verifyUserPin(userId, pin))) {
    return NextResponse.json(
      { error: "Wrong PIN" },
      { status: 401, headers: rateLimitHeaders(limited) },
    );
  }

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
