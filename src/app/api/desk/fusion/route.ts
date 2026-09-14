import { apiError, apiOk, requireApiUser, readLimitEnv } from "@/lib/api";
import { runDesk } from "@/lib/engine";
import { getLocale } from "@/lib/i18n/server";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const FUSION_LIMIT = readLimitEnv("DESK_FUSION_LIMIT", 8);
const WINDOW_MS = 60 * 60 * 1000;

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const limited = await consumeRateLimit(
    `desk-fusion:${auth.user.id}`,
    FUSION_LIMIT,
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
  const desk = await runDesk(locale);
  return apiOk(
    {
      asOf: desk.asOf,
      locale: desk.locale,
      fusion: desk.fusion,
      specialists: desk.specialists,
      levels: desk.fusion.levels,
      market: {
        price: desk.market.price,
        changePct: desk.market.changePct,
        source: desk.market.source,
        sample: desk.market.sample,
        session: desk.market.session,
        dataAsOf: desk.market.dataAsOf,
      },
      context: {
        macro: {
          source: desk.context.macro.source,
          sample: desk.context.macro.sample,
          dataAsOf: desk.context.macro.dataAsOf,
        },
        news: {
          source: desk.context.news.source,
          sample: desk.context.news.sample,
          dataAsOf: desk.context.news.dataAsOf,
        },
      },
      warnings: desk.warnings,
    },
    { locale },
    { headers: rateLimitHeaders(limited) },
  );
}
