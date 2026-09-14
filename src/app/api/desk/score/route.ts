import { NextResponse } from "next/server";
import { readLimitEnv } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { previousDateKey } from "@/lib/scorekeeper";
import { scoreBriefForDate, scoreYesterdayIfNeeded } from "@/lib/score-service";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const SCORE_LIMIT = readLimitEnv("DESK_SCORE_LIMIT", 20);
const SCORE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const limited = await consumeRateLimit(`desk-score:${user.id}`, SCORE_LIMIT, SCORE_WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Score rate limit reached. Try again later." },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  let dateIso = previousDateKey();
  try {
    const body = (await request.json()) as { dateIso?: string };
    if (body.dateIso) dateIso = body.dateIso;
  } catch {
    // default yesterday
  }

  try {
    if (dateIso === previousDateKey()) {
      const result = await scoreYesterdayIfNeeded();
      if (result.scored || result.score) {
        const response = NextResponse.json({ ok: true, ...result });
        for (const [key, value] of Object.entries(rateLimitHeaders(limited))) {
          response.headers.set(key, value);
        }
        return response;
      }
    }
    const score = await scoreBriefForDate(dateIso);
    const response = NextResponse.json({ ok: true, scored: true, dateIso, score });
    for (const [key, value] of Object.entries(rateLimitHeaders(limited))) {
      response.headers.set(key, value);
    }
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Score failed",
      },
      { status: 400, headers: rateLimitHeaders(limited) },
    );
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const result = await scoreYesterdayIfNeeded();
  return NextResponse.json(result);
}
