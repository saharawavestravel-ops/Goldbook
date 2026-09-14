import { NextResponse } from "next/server";
import { changeUserPin, getSessionUser } from "@/lib/auth";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const PIN_LIMIT = 6;
const PIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const limited = await consumeRateLimit(`change-pin:${user.id}`, PIN_LIMIT, PIN_WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many PIN changes. Try again later." },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  let body: { currentPin?: string; nextPin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { currentPin, nextPin } = body;
  if (!currentPin || !nextPin) {
    return NextResponse.json({ error: "Enter current and new PIN" }, { status: 400 });
  }

  const result = await changeUserPin(user.id, currentPin, nextPin);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 400, headers: rateLimitHeaders(limited) },
    );
  }

  const response = NextResponse.json({ ok: true });
  for (const [key, value] of Object.entries(rateLimitHeaders(limited))) {
    response.headers.set(key, value);
  }
  return response;
}
