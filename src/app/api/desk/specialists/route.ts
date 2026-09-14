import { apiError, apiOk, requireApiUser, readLimitEnv } from "@/lib/api";
import { runSpecialists } from "@/lib/engine";
import { getLocale } from "@/lib/i18n/server";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const SPECIALISTS_LIMIT = readLimitEnv("DESK_SPECIALISTS_LIMIT", 12);
const WINDOW_MS = 60 * 60 * 1000;

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const limited = await consumeRateLimit(
    `desk-specialists:${auth.user.id}`,
    SPECIALISTS_LIMIT,
    WINDOW_MS,
  );
  if (!limited.ok) {
    return apiError(
      429,
      "RATE_LIMITED",
      `Try again in about ${limited.retryAfterSec}s.`,
      rateLimitHeaders(limited),
    );
  }

  const locale = await getLocale();
  const bundle = await runSpecialists(locale);
  return apiOk(bundle, { locale }, { headers: rateLimitHeaders(limited) });
}
