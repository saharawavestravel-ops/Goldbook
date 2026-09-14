import type { AgentStatus } from "@/lib/agents";
import { getMarketSnapshot } from "@/lib/market";
import type { MarketSnapshot } from "@/lib/market/types";
import { getData } from "@/lib/i18n/data";
import type { Locale } from "@/lib/i18n/locales";
import { numberLocale } from "@/lib/i18n/labels";
import {
  biasClass,
  biasLabel,
  type Bias,
  type DailyBriefPreview,
} from "@/lib/today-shared";

export type { Bias, DailyBriefPreview };
export { biasLabel, biasClass };

/** Soft placeholder when no desk run has been saved yet. */
export function getTodayPreview(locale: Locale = "en"): DailyBriefPreview {
  const e = getData(locale).engine;
  return {
    dateLabel: new Intl.DateTimeFormat(numberLocale(locale), {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(new Date()),
    session: "Asia → London → New York",
    price: 2642.8,
    priceChangePct: 0,
    bias: "range",
    confidence: 0,
    summary: e.todayEmptySummary,
    levels: {
      support: 2620,
      watch: 2650,
      invalidation: 2608,
    },
    agentStatuses: {
      aurelia: "idle",
      marcus: "idle",
      nova: "idle",
      iris: "idle",
      felix: "idle",
      vera: "idle",
    },
    hasBrief: false,
    marketSource: "fallback",
    marketWarnings: [],
    dataSamples: { market: true, macro: true, news: true },
    macroNarrative: e.todayEmptyMacro,
    newsNarrative: e.todayEmptyNews,
    topHeadlines: [],
  };
}

/** Today home — prefer persisted brief; else live price + empty call state. */
export async function getTodayPreviewAsync(
  locale: Locale = "en",
): Promise<DailyBriefPreview> {
  const base = getTodayPreview(locale);
  let trackRecord: DailyBriefPreview["trackRecord"];

  try {
    const { getHistoryBriefs } = await import("@/lib/history");
    const { historyStats } = await import("@/lib/history-shared");
    const stats = historyStats(await getHistoryBriefs());
    trackRecord = {
      hitRate: stats.hitRate,
      scored: stats.scored,
      hits: stats.hits,
      misses: stats.misses,
    };
  } catch {
    trackRecord = undefined;
  }

  try {
    const { loadDailyBrief } = await import("@/lib/brief-store");
    const stored = await loadDailyBrief(undefined, locale);
    if (stored) {
      return {
        ...base,
        ...stored,
        hasBrief: true,
        trackRecord,
      };
    }
  } catch {
    // continue to market-only preview
  }

  try {
    const market = await getMarketSnapshot();
    return {
      ...base,
      session: market.session,
      price: market.price,
      priceChangePct: market.changePct,
      levels: market.levels,
      hasBrief: false,
      marketSource: market.source as MarketSnapshot["source"],
      marketWarnings: market.warnings,
      dataSamples: {
        market: market.sample,
        macro: true,
        news: true,
      },
      atr: market.levels.atr,
      helpers: market.helpers,
      trackRecord,
    };
  } catch {
    return { ...base, trackRecord };
  }
}

/** Force a live fusion preview (used by APIs / debugging). */
export async function getLiveTodayPreview(
  locale: Locale = "en",
): Promise<DailyBriefPreview> {
  const base = getTodayPreview(locale);
  const { runDesk } = await import("@/lib/engine");
  const desk = await runDesk(locale);

  const agentStatuses: Record<string, AgentStatus> = {
    aurelia: "ready",
  };
  for (const report of desk.specialists) {
    agentStatuses[report.agentId] = report.status;
  }

  return {
    ...base,
    session: desk.market.session,
    price: desk.market.price,
    priceChangePct: desk.market.changePct,
    bias: desk.fusion.bias,
    confidence: desk.fusion.confidence,
    summary: desk.fusion.summary,
    levels: desk.fusion.levels,
    agentStatuses,
    hasBrief: true,
    marketSource: desk.market.source as MarketSnapshot["source"],
    marketWarnings: desk.warnings,
    dataSamples: {
      market: desk.market.sample,
      macro: desk.context.macro.sample,
      news: desk.context.news.sample,
    },
    macroNarrative: desk.context.macro.narrative,
    newsNarrative: desk.context.news.narrative,
    topHeadlines: desk.context.news.items.slice(0, 8).map((item) => ({
      title: item.title,
      source: item.source,
      score: item.score,
      reasons: item.reasons,
      url: item.url,
      publishedAt: item.publishedAt,
    })),
    fusionScore: desk.fusion.score,
    vetoApplied: desk.fusion.veto.applied,
    agreement: desk.fusion.agreement,
    atr: desk.market.levels.atr,
    helpers: desk.market.helpers,
    agentLeans: desk.specialists.map((report) => ({
      agentId: report.agentId,
      name:
        report.agentId === "marcus"
          ? "Marcus"
          : report.agentId === "nova"
            ? "Nova"
            : report.agentId === "iris"
              ? "Iris"
              : report.agentId === "felix"
                ? "Felix"
                : "Vera",
      bias: report.bias,
      score: report.score,
      confidence: report.confidence,
      plainVerdict: report.plainVerdict,
    })),
  };
}
