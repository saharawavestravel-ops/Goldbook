import { loadDailyBrief, saveDailyBrief } from "@/lib/brief-store";
import {
  agentAccent,
  briefShareText,
  type DailyBrief,
  type DebateLine,
} from "@/lib/brief-shared";
import { runDesk, type DeskRunResult } from "@/lib/engine";
import { getData } from "@/lib/i18n/data";
import type { Locale } from "@/lib/i18n/locales";
import { numberLocale } from "@/lib/i18n/labels";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPlainExplain } from "@/lib/plain-language";
import { biasFullFromDict } from "@/lib/i18n/labels";
import type { Bias, DailyBriefPreview } from "@/lib/today-shared";

export type { DailyBrief, DebateLine };
export { agentAccent, briefShareText };

export function buildDailyBriefFromDesk(
  desk: DeskRunResult,
  locale: Locale = "en",
): DailyBrief {
  const byId = Object.fromEntries(desk.specialists.map((r) => [r.agentId, r]));
  const marcus = byId.marcus;
  const nova = byId.nova;
  const iris = byId.iris;
  const felix = byId.felix;
  const vera = byId.vera;

  if (!marcus || !nova || !iris || !felix || !vera) {
    throw new Error("Specialist engine returned incomplete reports");
  }

  const e = getData(locale).engine;
  const dict = getDictionary(locale);

  const dateLabel = new Intl.DateTimeFormat(numberLocale(locale), {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const plainFallback = buildPlainExplain({
    bias: desk.fusion.bias,
    confidence: desk.fusion.confidence,
    priceChangePct: desk.market.changePct,
    summary: desk.fusion.summary,
    macroNarrative: desk.context.macro.narrative,
    newsNarrative: desk.context.news.narrative,
    vetoApplied: desk.fusion.veto.applied,
    levels: desk.fusion.levels,
    locale,
  });

  const preview: DailyBriefPreview = {
    dateLabel,
    session: desk.market.session,
    price: desk.market.price,
    priceChangePct: desk.market.changePct,
    bias: desk.fusion.bias,
    confidence: desk.fusion.confidence,
    summary: desk.fusion.summary,
    plainTitle: desk.fusion.plainTitle ?? plainFallback.title,
    plainExplain: desk.fusion.plainExplain ?? plainFallback.explain,
    levels: desk.fusion.levels,
    agentStatuses: {
      aurelia: "ready",
      marcus: marcus.status,
      nova: nova.status,
      iris: iris.status,
      felix: felix.status,
      vera: vera.status,
    },
    hasBrief: true,
    marketSource: desk.market.source,
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

  const why = [
    desk.context.macro.narrative,
    desk.context.news.narrative,
    nova.take,
  ];
  if (desk.fusion.veto.reason) why.push(desk.fusion.veto.reason);

  return {
    ...preview,
    locale,
    signedBy: "Aurelia",
    why,
    debate: [
      {
        agentId: "marcus",
        agentName: "Marcus",
        text: marcus.take,
        plainVerdict: marcus.plainVerdict,
        watchNext: marcus.watchNext,
      },
      {
        agentId: "nova",
        agentName: "Nova",
        text: nova.take,
        plainVerdict: nova.plainVerdict,
        watchNext: nova.watchNext,
      },
      {
        agentId: "iris",
        agentName: "Iris",
        text: iris.take,
        plainVerdict: iris.plainVerdict,
        watchNext: iris.watchNext,
      },
      {
        agentId: "felix",
        agentName: "Felix",
        text: felix.take,
        plainVerdict: felix.plainVerdict,
        watchNext: felix.watchNext,
      },
      {
        agentId: "vera",
        agentName: "Vera",
        text: vera.take,
        plainVerdict: vera.plainVerdict,
        watchNext: vera.watchNext,
      },
    ],
    plan: {
      bias: biasFullFromDict(preview.bias as Bias, dict),
      levels: e.planLevels(
        preview.levels.support,
        preview.levels.watch,
        preview.levels.invalidation,
      ),
      dontTradeIf: e.planDont(preview.levels.invalidation),
    },
    sources: [
      {
        label: e.srcFusion,
        detail: e.srcFusionDetail(desk.fusion.score, desk.fusion.confidence),
      },
      ...marcus.sources.slice(0, 1),
      ...nova.sources.slice(0, 1),
      ...iris.sources.slice(0, 1),
      {
        label: e.srcMarketLabel,
        detail:
          preview.marketSource === "fallback"
            ? e.srcMarketSample
            : e.srcMarketLive(preview.marketSource),
      },
      { label: e.srcMacro, detail: preview.macroNarrative },
      { label: e.srcNews, detail: preview.newsNarrative },
      { label: e.srcDesk, detail: e.srcDeskDetail },
    ],
    dissent: desk.fusion.dissent?.take ?? felix.take,
  };
}

/** Prefer persisted brief for today; regenerate if locale mismatch. */
export async function getDailyBrief(options?: {
  preferStored?: boolean;
  locale?: Locale;
}): Promise<DailyBrief> {
  const locale = options?.locale ?? "en";
  const preferStored = options?.preferStored ?? true;
  if (preferStored) {
    const stored = await loadDailyBrief(undefined, locale);
    if (stored) {
      return { ...stored, locale: stored.locale ?? locale };
    }
  }

  const desk = await runDesk(locale);
  return buildDailyBriefFromDesk(desk, locale);
}

/** Full desk run + persist today’s brief. */
export async function runAndPersistBrief(locale: Locale = "en") {
  const desk = await runDesk(locale);
  const brief = buildDailyBriefFromDesk(desk, locale);
  const saved = await saveDailyBrief(brief, undefined, locale);
  return { desk, brief, savedAt: saved.savedAt, dateKey: saved.dateKey };
}
