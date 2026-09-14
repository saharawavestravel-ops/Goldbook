import type { ContextSnapshot } from "@/lib/context";
import type { MarketSnapshot } from "@/lib/market";
import type { Bias } from "@/lib/today-shared";
import type { SpecialistId, SpecialistReport } from "@/lib/engine/types";
import { currentSessionLabel } from "@/lib/market/fallback";
import type { Locale } from "@/lib/i18n/locales";
import { getData, leanFor, plainVerdictFor as plainFromData } from "@/lib/i18n/data";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function biasFromScore(score: number): Bias {
  if (score > 0.15) return "bullish";
  if (score < -0.15) return "bearish";
  return "range";
}

export function confidenceFromScore(score: number, dataQuality = 0.7, agreementBoost = 0) {
  const base = 42 + Math.abs(score) * 48 + agreementBoost * 8;
  return Math.round(clamp(base * dataQuality, 40, 84));
}

function dataQuality(market: MarketSnapshot, context: ContextSnapshot) {
  let q = 0.52;
  if (!market.sample && market.source !== "fallback") q += 0.16;
  if (!context.macro.sample && context.macro.source !== "fallback") q += 0.16;
  if (!context.news.sample && context.news.source !== "fallback") q += 0.16;
  if (market.bars.length >= 10) q += 0.04;
  if (context.news.items.length >= 3) q += 0.04;
  return clamp(q, 0.45, 1);
}

function trendScore(market: MarketSnapshot) {
  const bars = market.bars;
  if (bars.length < 5) return 0;
  const closes = bars.map((bar) => bar.close);
  const last = closes[closes.length - 1]!;
  const mid = closes[Math.floor(closes.length / 2)]!;
  const first = closes[0]!;
  const short = (last - mid) / Math.max(mid, 1);
  const longer = (last - first) / Math.max(first, 1);
  return clamp(short * 18 + longer * 8, -1, 1);
}

function scoreMarcus(market: MarketSnapshot, context: ContextSnapshot) {
  // Softer macro pressure (USD/yields/real yields) → bullish gold
  let score = -context.macro.goldPressure * 0.9;

  if (market.helpers.dxyChangePct !== undefined) {
    score += -market.helpers.dxyChangePct * 0.28;
  }
  if (market.helpers.us10y !== undefined) {
    // Absolute high yields are mild headwind; we mainly use pressure from FRED deltas
    score += clamp((4.2 - market.helpers.us10y) * 0.04, -0.12, 0.12);
  }

  const breakeven = context.macro.points.find((point) => point.seriesId === "T10YIE");
  if (breakeven?.change !== undefined) {
    score += breakeven.change * 0.35;
  }

  return clamp(score, -1, 1);
}

function scoreNova(market: MarketSnapshot) {
  const { price, changePct, session } = market;
  const { support, watch, atr } = market.levels;
  const mid = (support + watch) / 2;
  const range = Math.max(watch - support, atr || 1);
  const position = (price - mid) / range;
  const trend = trendScore(market);
  const atrPct = atr / Math.max(price, 1);

  // Near support → buy-the-dip structure; stretched to watch → cautious / fade
  let score = clamp(-position * 0.55 + trend * 0.35, -0.7, 0.7);

  if (price > support && price < watch) score *= 0.85;
  if (price <= support) score += 0.12;
  if (price >= watch) score -= 0.12;

  // High ATR regimes → shrink conviction (structure less trustworthy)
  if (atrPct > 0.014) score *= 0.65;

  if (changePct > 0.45) score += 0.08;
  if (changePct < -0.45) score -= 0.08;

  // Session nuance: NY often extends London trends
  if (session.includes("New York") && Math.abs(trend) > 0.25) {
    score += Math.sign(trend) * 0.06;
  }

  return clamp(score, -1, 1);
}

function scoreIris(context: ContextSnapshot) {
  const base = context.news.sentiment;
  const top = context.news.items.slice(0, 3);
  const intensity = top.reduce((acc, item) => acc + Math.abs(item.score), 0) / Math.max(top.length, 1);
  // Stronger when headlines agree and intensity is high
  const amplify = 0.75 + clamp(intensity, 0, 1) * 0.35;
  return clamp(base * amplify, -1, 1);
}

function scoreFelix(market: MarketSnapshot, context: ContextSnapshot) {
  const crowd = context.news.sentiment;
  const momentum = clamp(market.changePct / 1.1, -1, 1);
  const trend = trendScore(market);
  const atrPct = market.levels.atr / Math.max(market.price, 1);

  const sameWay =
    Math.sign(crowd) !== 0 &&
    Math.sign(crowd) === Math.sign(momentum) &&
    Math.abs(crowd) > 0.18 &&
    Math.abs(momentum) > 0.25;

  // Contrarian when crowded; otherwise mild momentum confirmation
  let score = sameWay
    ? -crowd * 0.4 - momentum * 0.25 - trend * 0.1
    : crowd * 0.15 + momentum * 0.2;

  // Exhaustion: big day + already extended in range
  const { support, watch } = market.levels;
  const mid = (support + watch) / 2;
  const extended = Math.abs(market.price - mid) / Math.max(watch - support, 1) > 0.45;
  if (sameWay && extended) score *= 1.15;
  if (atrPct > 0.015 && sameWay) score *= 1.1;

  return clamp(score, -1, 1);
}

function scoreVera(market: MarketSnapshot, context: ContextSnapshot) {
  const atrPct = market.levels.atr / Math.max(market.price, 1);
  const macroSign = Math.sign(-context.macro.goldPressure);
  const newsSign = Math.sign(context.news.sentiment);
  const conflict =
    macroSign !== 0 &&
    newsSign !== 0 &&
    macroSign !== newsSign &&
    Math.abs(context.macro.goldPressure) > 0.1 &&
    Math.abs(context.news.sentiment) > 0.12;

  const session = market.session || currentSessionLabel();
  const lateNy = session.includes("New York") && new Date().getUTCHours() >= 19;

  // Vera is primarily a brake: near-zero when risk is elevated
  if (atrPct > 0.014 || conflict || lateNy) {
    return 0;
  }

  // Mild directional allowance only in calm tape
  let score = clamp((-context.macro.goldPressure * 0.35 + context.news.sentiment * 0.25) / 2, -0.28, 0.28);
  if (Math.abs(market.changePct) > 0.7) score *= 0.4;
  return clamp(score, -0.35, 0.35);
}

function takeFor(
  id: SpecialistId,
  score: number,
  bias: Bias,
  market: MarketSnapshot,
  context: ContextSnapshot,
  locale: Locale,
) {
  const data = getData(locale);
  const e = data.engine;
  const lean = leanFor(bias, data);
  const signed = `${score > 0 ? "+" : ""}${round2(score)}`;

  switch (id) {
    case "marcus": {
      const be = context.macro.points.find((point) => point.seriesId === "T10YIE");
      const beBit =
        be?.change !== undefined
          ? be.change > 0
            ? e.beUp(be.change)
            : e.beDown(be.change)
          : "";
      return e.takeMarcus(lean, signed, context.macro.narrative, beBit);
    }
    case "nova": {
      const trend = trendScore(market);
      const trendStr = `${trend > 0 ? "+" : ""}${round2(trend)}`;
      return e.takeNova(
        lean,
        signed,
        market.price,
        market.levels.support,
        market.levels.watch,
        market.levels.atr,
        trendStr,
      );
    }
    case "iris": {
      const top = context.news.items[0]?.title ?? "";
      return e.takeIris(lean, signed, context.news.narrative, top);
    }
    case "felix": {
      const crowd = context.news.sentiment;
      const crowded =
        Math.sign(crowd) === Math.sign(market.changePct) && Math.abs(crowd) > 0.18;
      const dayMove = `${market.changePct > 0 ? "+" : ""}${market.changePct}%`;
      return e.takeFelix(lean, signed, crowded, dayMove);
    }
    case "vera": {
      const atrPct = round2((market.levels.atr / Math.max(market.price, 1)) * 100);
      const risk = bias === "range" ? e.veraPreferWait : e.veraNoBrake;
      return e.takeVera(risk, signed, atrPct, market.levels.invalidation);
    }
  }
}

function plainVerdictFor(bias: Bias, locale: Locale) {
  return plainFromData(bias, getData(locale));
}

function watchNextFor(
  id: SpecialistId,
  market: MarketSnapshot,
  context: ContextSnapshot,
  locale: Locale,
) {
  const e = getData(locale).engine;
  switch (id) {
    case "marcus":
      return e.watchMarcus;
    case "nova":
      return e.watchNova(market.levels.support, market.levels.watch);
    case "iris":
      return context.news.items[0]?.title ? e.watchIrisHot : e.watchIrisEmpty;
    case "felix":
      return e.watchFelix;
    case "vera":
      return e.watchVera(market.levels.invalidation);
  }
}

const BASE_TRUST: Record<SpecialistId, number> = {
  marcus: 0.84,
  nova: 0.8,
  iris: 0.76,
  felix: 0.72,
  vera: 0.9,
};

/** Optional trust tilt from recent hit/miss history (soft). */
export function applyTrustCalibration(
  reports: SpecialistReport[],
  recentResults?: { bias: Bias; result: "hit" | "miss" }[],
): SpecialistReport[] {
  if (!recentResults || recentResults.length === 0) return reports;

  const hits = recentResults.filter((row) => row.result === "hit").length;
  const hitRate = hits / recentResults.length;
  // Desk-wide calm: if recent calls miss a lot, shrink non-Vera trust slightly
  const deskFactor = hitRate >= 0.55 ? 1 : hitRate >= 0.4 ? 0.96 : 0.9;

  return reports.map((report) => {
    if (report.agentId === "vera") {
      return { ...report, trustWeight: clamp(report.trustWeight * (hitRate < 0.45 ? 1.05 : 1), 0.5, 1) };
    }
    return {
      ...report,
      trustWeight: clamp(report.trustWeight * deskFactor, 0.45, 1),
    };
  });
}

function statusFor(id: SpecialistId, score: number, bias: Bias): SpecialistReport["status"] {
  if (id === "vera" && Math.abs(score) < 0.08) return "ready";
  if (id === "felix" && bias === "bearish") return "disagreed";
  if (id !== "vera" && Math.abs(score) > 0.35 && bias === "bearish") return "disagreed";
  return "ready";
}

export function runRulesEngine(
  market: MarketSnapshot,
  context: ContextSnapshot,
  locale: Locale = "en",
): SpecialistReport[] {
  const quality = dataQuality(market, context);
  const e = getData(locale).engine;

  const specs: {
    id: SpecialistId;
    score: number;
    sources: SpecialistReport["sources"];
  }[] = [
    {
      id: "marcus",
      score: scoreMarcus(market, context),
      sources: [
        { label: e.srcMacroPressure, detail: String(context.macro.goldPressure) },
        {
          label: e.srcUsd,
          detail:
            market.helpers.dxyChangePct !== undefined
              ? `${market.helpers.dxyChangePct}%`
              : context.macro.points.find((p) => p.seriesId === "DTWEXBGS")?.value?.toString() ??
                "n/a",
        },
        {
          label: e.srcBreakeven,
          detail:
            context.macro.points.find((p) => p.seriesId === "T10YIE")?.change?.toString() ?? "n/a",
        },
        { label: e.srcMacroSource, detail: context.macro.source },
      ],
    },
    {
      id: "nova",
      score: scoreNova(market),
      sources: [
        { label: e.srcSupport, detail: String(market.levels.support) },
        { label: e.srcWatch, detail: String(market.levels.watch) },
        { label: e.srcAtr, detail: String(market.levels.atr) },
        { label: e.srcTrend, detail: String(round2(trendScore(market))) },
        { label: e.srcMarketSource, detail: market.source },
      ],
    },
    {
      id: "iris",
      score: scoreIris(context),
      sources: [
        { label: e.srcNewsSentiment, detail: String(context.news.sentiment) },
        {
          label: e.srcTopHeadline,
          detail: context.news.items[0]?.title ?? e.srcNoHeadline,
        },
        { label: e.srcHeadlineCount, detail: String(context.news.items.length) },
        { label: e.srcNewsSource, detail: context.news.source },
      ],
    },
    {
      id: "felix",
      score: scoreFelix(market, context),
      sources: [
        { label: e.srcNewsLean, detail: String(context.news.sentiment) },
        { label: e.srcDayMove, detail: `${market.changePct}%` },
        { label: e.srcMode, detail: e.srcModeDetail },
      ],
    },
    {
      id: "vera",
      score: scoreVera(market, context),
      sources: [
        { label: e.srcInvalidation, detail: String(market.levels.invalidation) },
        {
          label: e.srcAtrPct,
          detail: String(round2((market.levels.atr / Math.max(market.price, 1)) * 100)),
        },
        { label: e.srcSession, detail: market.session },
        { label: e.srcRiskScan, detail: e.srcRiskDetail },
      ],
    },
  ];

  return specs.map((spec) => {
    const score = round2(spec.score);
    const bias = biasFromScore(score);
    return {
      agentId: spec.id,
      status: statusFor(spec.id, score, bias),
      score,
      bias,
      confidence: confidenceFromScore(score, quality),
      take: takeFor(spec.id, score, bias, market, context, locale),
      plainVerdict: plainVerdictFor(bias, locale),
      watchNext: watchNextFor(spec.id, market, context, locale),
      sources: spec.sources,
      trustWeight: BASE_TRUST[spec.id],
      engine: "rules" as const,
    };
  });
}
