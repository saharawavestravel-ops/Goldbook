import { apiError, apiOk, requireApiUser, readLimitEnv } from "@/lib/api";
import { runAndPersistBrief } from "@/lib/brief";
import { getLocale } from "@/lib/i18n/server";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const RUN_LIMIT = readLimitEnv("DESK_RUN_LIMIT", 4);
const RUN_WINDOW_MS = 60 * 60 * 1000;

export async function POST() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const limited = await consumeRateLimit(
    `desk-run:${auth.user.id}`,
    RUN_LIMIT,
    RUN_WINDOW_MS,
  );
  if (!limited.ok) {
    return apiError(
      429,
      "RATE_LIMITED",
      `Desk run limit reached. Try again in about ${limited.retryAfterSec}s.`,
      rateLimitHeaders(limited),
    );
  }

  try {
    const locale = await getLocale();
    const result = await runAndPersistBrief(locale);
    return apiOk(
      {
        dateKey: result.dateKey,
        savedAt: result.savedAt,
        brief: {
          bias: result.brief.bias,
          confidence: result.brief.confidence,
          summary: result.brief.summary,
          plainTitle: result.brief.plainTitle,
          plainExplain: result.brief.plainExplain,
          levels: result.brief.levels,
          vetoApplied: result.brief.vetoApplied,
          fusionScore: result.brief.fusionScore,
          locale: result.brief.locale,
        },
        specialists: result.desk.specialists.map((report) => ({
          agentId: report.agentId,
          bias: report.bias,
          score: report.score,
          confidence: report.confidence,
          status: report.status,
          take: report.take,
          plainVerdict: report.plainVerdict,
          watchNext: report.watchNext,
        })),
        fusion: {
          score: result.desk.fusion.score,
          agreement: result.desk.fusion.agreement,
          veto: result.desk.fusion.veto,
        },
        warnings: result.desk.warnings,
        data: {
          market: {
            source: result.desk.market.source,
            sample: result.desk.market.sample,
            dataAsOf: result.desk.market.dataAsOf,
          },
          macro: {
            source: result.desk.context.macro.source,
            sample: result.desk.context.macro.sample,
            dataAsOf: result.desk.context.macro.dataAsOf,
          },
          news: {
            source: result.desk.context.news.source,
            sample: result.desk.context.news.sample,
            dataAsOf: result.desk.context.news.dataAsOf,
          },
        },
      },
      { locale },
      { headers: rateLimitHeaders(limited) },
    );
  } catch (error) {
    return apiError(
      500,
      "DESK_RUN_FAILED",
      error instanceof Error ? error.message : "Desk run failed",
      rateLimitHeaders(limited),
    );
  }
}
