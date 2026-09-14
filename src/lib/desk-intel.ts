import type { Bias } from "@/lib/today-shared";
import { simplifyJargon } from "@/lib/plain-language";
import type { Locale } from "@/lib/i18n/locales";
import { getCopy } from "@/lib/i18n/copy";

export type PredictionPath = {
  id: "up" | "base" | "down";
  label: string;
  plain: string;
  /** 0–100, paths sum ≈ 100 */
  probability: number;
  target: number;
  trigger: string;
  standDownIf: string;
};

export type NewsAnalysisCard = {
  title: string;
  source: string;
  score: number;
  lean: "helps gold" | "hurts gold" | "mixed / noise";
  whyItMatters: string;
  reasons: string[];
  url?: string;
  publishedAt?: string;
};

export type DeskAdvicePack = {
  headline: string;
  timing: string;
  /** What the machine desk tracks that a human alone rarely can at once */
  machineEdges: string[];
  watches: string[];
  playbook: { title: string; detail: string }[];
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function normalizeProbs(up: number, base: number, down: number) {
  const raw = [up, base, down].map((v) => Math.max(5, v));
  const sum = raw.reduce((a, b) => a + b, 0);
  const scaled = raw.map((v) => Math.round((v / sum) * 100));
  const drift = 100 - scaled.reduce((a, b) => a + b, 0);
  scaled[1] += drift;
  return { up: scaled[0]!, base: scaled[1]!, down: scaled[2]! };
}

/** Three-path prediction board — weighted, not a single guess. */
export function buildPredictionScenarios(
  input: {
    bias: Bias;
    confidence: number;
    price: number;
    levels: { support: number; watch: number; invalidation: number };
    vetoApplied?: boolean;
    fusionScore?: number;
  },
  locale: Locale = "en",
): PredictionPath[] {
  const d = getCopy(locale).desk;
  const { bias, confidence, price, levels, vetoApplied, fusionScore = 0 } = input;
  const conf = clamp(confidence, 0, 100);
  const lean = clamp(Math.abs(fusionScore), 0, 1);

  let up = 28;
  let base = 44;
  let down = 28;

  if (bias === "bullish") {
    up = 34 + conf * 0.28 + lean * 12;
    base = 38 - conf * 0.08;
    down = 28 - conf * 0.12 - lean * 6;
  } else if (bias === "bearish") {
    down = 34 + conf * 0.28 + lean * 12;
    base = 38 - conf * 0.08;
    up = 28 - conf * 0.12 - lean * 6;
  } else {
    base = 48 + (100 - conf) * 0.12;
    up = 26 - lean * 4;
    down = 26 - lean * 4;
  }

  if (vetoApplied) {
    base += 14;
    up -= 7;
    down -= 7;
  }

  const probs = normalizeProbs(up, base, down);
  const mid = round2((levels.support + levels.watch) / 2);
  const upTarget = round2(Math.max(levels.watch, price + (levels.watch - price) * 0.65));
  const downTarget = round2(Math.min(levels.support, price - (price - levels.support) * 0.65));

  return [
    {
      id: "up",
      label: d.pathUp,
      plain: d.pathUpPlain,
      probability: probs.up,
      target: upTarget,
      trigger: d.triggerUp(levels.support, levels.watch),
      standDownIf: d.standUp(levels.invalidation),
    },
    {
      id: "base",
      label: d.pathBase,
      plain: d.pathBasePlain,
      probability: probs.base,
      target: mid,
      trigger: d.triggerBase(levels.support, levels.watch),
      standDownIf: d.standBase,
    },
    {
      id: "down",
      label: d.pathDown,
      plain: d.pathDownPlain,
      probability: probs.down,
      target: downTarget,
      trigger: d.triggerDown(levels.watch, levels.support),
      standDownIf: d.standDown(levels.invalidation),
    },
  ];
}

function leanFromScore(score: number): NewsAnalysisCard["lean"] {
  if (score >= 0.2) return "helps gold";
  if (score <= -0.2) return "hurts gold";
  return "mixed / noise";
}

function whyHeadlineMatters(
  title: string,
  score: number,
  reasons: string[],
  locale: Locale,
): string {
  const d = getCopy(locale).desk;
  const t = title.toLowerCase();
  if (/fed|rate|yield|treasury|fomc|taux|fed/.test(t)) {
    return score >= 0 ? d.whyRatePos : d.whyRateNeg;
  }
  if (/dollar|dxy|usd|dollar/.test(t)) {
    return score >= 0 ? d.whyDollarPos : d.whyDollarNeg;
  }
  if (/war|geopolit|conflict|attack|israel|ukraine|taiwan/.test(t)) {
    return d.whyGeo;
  }
  if (/inflation|cpi|pce|jobs|payroll|nfp/.test(t)) {
    return d.whyInflation;
  }
  if (/gold|bullion|xau|etf|or\b|ذهب/.test(t)) {
    return d.whyGoldDirect;
  }
  if (reasons.length > 0) {
    return d.whyTagged(reasons.slice(0, 2).join(", "));
  }
  if (score >= 0.2) return d.whyToneHelp;
  if (score <= -0.2) return d.whyToneHurt;
  return d.whyNoise;
}

/** Per-headline gold impact board — more than a human skim in one pass. */
export function buildNewsAnalysis(
  items: {
    title: string;
    source: string;
    score: number;
    reasons?: string[];
    url?: string;
    publishedAt?: string;
  }[],
  narrative?: string,
  locale: Locale = "en",
): { narrative: string; cards: NewsAnalysisCard[]; netLean: string } {
  const d = getCopy(locale).desk;
  const cards = items.slice(0, 8).map((item) => {
    const reasons = item.reasons ?? [];
    return {
      title: item.title,
      source: item.source,
      score: item.score,
      lean: leanFromScore(item.score),
      whyItMatters: whyHeadlineMatters(item.title, item.score, reasons, locale),
      reasons,
      url: item.url,
      publishedAt: item.publishedAt,
    };
  });

  const avg =
    cards.length === 0
      ? 0
      : cards.reduce((acc, c) => acc + c.score, 0) / cards.length;

  const netLean =
    avg >= 0.15 ? d.netHelp : avg <= -0.15 ? d.netHurt : d.netMix;

  return {
    narrative: simplifyJargon(
      narrative ?? (cards.length ? d.newsIris : d.newsEmpty),
      locale,
    ),
    cards,
    netLean,
  };
}

/** Research playbook — multi-sensor advice a solo human rarely runs live. */
export function buildDeskAdvice(
  input: {
    bias: Bias;
    confidence: number;
    session: string;
    vetoApplied?: boolean;
    levels: { support: number; watch: number; invalidation: number };
    watches?: string[];
  },
  locale: Locale = "en",
): DeskAdvicePack {
  const d = getCopy(locale).desk;
  const p = getCopy(locale).plain;
  const { bias, confidence, session, vetoApplied, levels } = input;

  const headline = vetoApplied
    ? d.adviceVeto
    : bias === "bullish"
      ? d.adviceBull
      : bias === "bearish"
        ? d.adviceBear
        : d.adviceWait;

  const timing = session.toLowerCase().includes("new york")
    ? d.timingNy
    : session.toLowerCase().includes("london")
      ? d.timingLondon
      : d.timingQuiet;

  const machineEdges = [...d.machineEdges];

  const watches = input.watches?.filter(Boolean).slice(0, 5) ?? [
    `${p.floorLabel} ${levels.support}`,
    `${p.ceilingLabel} ${levels.watch}`,
    `${p.stopLabel} ${levels.invalidation}`,
    d.watchDollar,
    d.watchHeadlines,
  ];

  const playbook =
    bias === "bullish"
      ? [
          { title: d.primaryPlan, detail: d.planBull(levels.support, levels.watch) },
          { title: d.ifWrong, detail: d.wrongBull(levels.invalidation) },
          { title: d.sizeMind, detail: d.sizeConf(confidence) },
        ]
      : bias === "bearish"
        ? [
            { title: d.primaryPlan, detail: d.planBear(levels.watch, levels.support) },
            { title: d.ifWrong, detail: d.wrongBear(levels.invalidation) },
            { title: d.sizeMind, detail: d.sizeBear(confidence) },
          ]
        : [
            { title: d.primaryPlan, detail: d.planWait },
            { title: d.triggerCare, detail: d.triggerWait(levels.watch, levels.support) },
            { title: d.sizeMind, detail: d.sizeWait },
          ];

  if (vetoApplied) {
    playbook.unshift({
      title: d.veraOverride,
      detail: d.veraDetail,
    });
  }

  return { headline, timing, machineEdges, watches, playbook };
}

/** Live what-if: where price sits vs the desk map. */
export function buildWhatIfRead(
  input: {
    probe: number;
    spot: number;
    levels: { support: number; watch: number; invalidation: number };
    bias: Bias;
  },
  locale: Locale = "en",
) {
  const d = getCopy(locale).desk;
  const { probe, spot, levels, bias } = input;
  const move = round2(probe - spot);
  const movePct = round2((move / Math.max(spot, 1)) * 100);

  let zone: string;
  let meaning: string;
  let pathHint: string;

  if (probe <= levels.invalidation) {
    zone = d.zoneStop;
    meaning = d.meanStop;
    pathHint = d.hintRisk;
  } else if (probe < levels.support) {
    zone = d.zoneUnderFloor;
    meaning = d.meanUnder;
    pathHint = bias === "bearish" ? d.hintDownStrong : d.hintBasePressure;
  } else if (probe > levels.watch) {
    zone = d.zoneAboveCeil;
    meaning = d.meanAbove;
    pathHint = bias === "bullish" ? d.hintUpExt : d.hintBreakout;
  } else if (probe >= (levels.support + levels.watch) / 2) {
    zone = d.zoneUpper;
    meaning = d.meanUpper;
    pathHint = d.hintHighChop;
  } else {
    zone = d.zoneLower;
    meaning = d.meanLower;
    pathHint = d.hintLowChop;
  }

  return {
    zone,
    meaning,
    pathHint,
    move,
    movePct,
    vsFloor: round2(probe - levels.support),
    vsCeil: round2(levels.watch - probe),
    vsStop: round2(probe - levels.invalidation),
  };
}
