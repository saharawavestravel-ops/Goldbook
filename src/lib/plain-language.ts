import type { Bias } from "@/lib/today-shared";
import type { Locale } from "@/lib/i18n/locales";
import { getCopy } from "@/lib/i18n/copy";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { AgentId } from "@/lib/agents";

/** Short label a beginner can read in one glance. */
export function biasPlainTitle(bias: Bias, locale: Locale = "en") {
  const b = getDictionary(locale).bias;
  if (bias === "bullish") return b.bullishTitle;
  if (bias === "bearish") return b.bearishTitle;
  return b.rangeTitle;
}

export function biasMood(bias: Bias, locale: Locale = "en") {
  const c = getCopy(locale).plain;
  if (bias === "bullish") {
    return {
      chip: c.moodBullChip,
      color: "text-gb-bull",
      wash: "bg-gb-bull/10 border-gb-bull/25",
      meaning: c.moodBullMeaning,
    };
  }
  if (bias === "bearish") {
    return {
      chip: c.moodBearChip,
      color: "text-gb-bear",
      wash: "bg-gb-bear/10 border-gb-bear/25",
      meaning: c.moodBearMeaning,
    };
  }
  return {
    chip: c.moodWaitChip,
    color: "text-gb-range",
    wash: "bg-gb-line/60 border-gb-line-strong",
    meaning: c.moodWaitMeaning,
  };
}

/** One-line meaning of confidence. */
export function confidencePlain(confidence: number, locale: Locale = "en") {
  const c = getCopy(locale).plain;
  if (confidence >= 70) return c.confHigh;
  if (confidence >= 55) return c.confMed;
  return c.confLow;
}

export function confidenceBand(confidence: number, locale: Locale = "en") {
  const c = getCopy(locale).plain;
  if (confidence >= 70) return { label: c.bandHigh, hint: c.bandHighHint };
  if (confidence >= 55) return { label: c.bandMed, hint: c.bandMedHint };
  return { label: c.bandLow, hint: c.bandLowHint };
}

export function levelPlainLabels(locale: Locale = "en") {
  const c = getCopy(locale).plain;
  return {
    support: { label: c.floorLabel, help: c.floorHelp },
    watch: { label: c.ceilingLabel, help: c.ceilingHelp },
    invalidation: { label: c.stopLabel, help: c.stopHelp },
  } as const;
}

export function priceMovePlain(changePct: number, locale: Locale = "en") {
  const c = getCopy(locale).plain;
  if (changePct > 0.35) return c.moveUp(changePct.toFixed(2));
  if (changePct < -0.35) return c.moveDown(Math.abs(changePct).toFixed(2));
  return c.moveFlat(`${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}`);
}

export function sessionPlain(session: string, locale: Locale = "en") {
  const c = getCopy(locale).plain;
  if (session.includes("Asia") && session.includes("London")) return c.sessionAsiaLondon;
  if (session.includes("London") && session.includes("New York")) return c.sessionLondonNy;
  if (session.includes("New York")) return c.sessionNy;
  if (session.includes("London")) return c.sessionLondon;
  if (session.includes("Asia")) return c.sessionAsia;
  return c.sessionFallback(session);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

/** Where price sits between floor and ceiling (0–100). */
export function pricePositionPct(price: number, support: number, watch: number) {
  const span = Math.max(watch - support, 1);
  return Math.min(100, Math.max(0, ((price - support) / span) * 100));
}

export function priceVsLevelsPlain(
  price: number,
  support: number,
  watch: number,
  invalidation: number,
  locale: Locale = "en",
) {
  const c = getCopy(locale).plain;
  const toFloor = round2(price - support);
  const toCeil = round2(watch - price);
  const toStop = round2(price - invalidation);
  const pos = pricePositionPct(price, support, watch);

  let place: string;
  if (price <= support) place = c.placeOnFloor;
  else if (price >= watch) place = c.placeAtCeiling;
  else if (pos < 35) place = c.placeLower;
  else if (pos > 65) place = c.placeUpper;
  else place = c.placeMid;

  const floorRel = toFloor >= 0 ? c.above : c.below;
  const ceilRel = toCeil >= 0 ? c.under : c.above;
  const stopRel = toStop >= 0 ? c.below : c.above;

  return {
    place,
    toFloor,
    toCeil,
    toStop,
    pos,
    lines: [
      place,
      `$${Math.abs(toFloor).toFixed(2)} ${floorRel} · ${c.floorLabel}`,
      `$${Math.abs(toCeil).toFixed(2)} ${ceilRel} · ${c.ceilingLabel}`,
      `$${Math.abs(toStop).toFixed(2)} ${stopRel} · ${c.stopLabel}`,
    ],
  };
}

type PlainInput = {
  bias: Bias;
  confidence: number;
  price: number;
  priceChangePct: number;
  summary?: string;
  macroNarrative?: string;
  newsNarrative?: string;
  vetoApplied?: boolean;
  levels: { support: number; watch: number; invalidation: number };
  headlines?: { title: string; source: string }[];
  locale?: Locale;
};

/** Rich beginner pack for the Today gold result. */
export function buildGoldTodayResult(input: PlainInput) {
  const locale = input.locale ?? "en";
  const c = getCopy(locale).plain;
  const title = biasPlainTitle(input.bias, locale);
  const mood = biasMood(input.bias, locale);
  const move = priceMovePlain(input.priceChangePct, locale);
  const conf = confidencePlain(input.confidence, locale);
  const band = confidenceBand(input.confidence, locale);
  const vs = priceVsLevelsPlain(
    input.price,
    input.levels.support,
    input.levels.watch,
    input.levels.invalidation,
    locale,
  );

  const action =
    input.bias === "bullish"
      ? c.actionBull
      : input.bias === "bearish"
        ? c.actionBear
        : c.actionWait;

  const doList =
    input.bias === "bullish"
      ? [...c.doBull]
      : input.bias === "bearish"
        ? [...c.doBear]
        : [...c.doWait];

  const dontList = [
    ...c.dontBase,
    input.vetoApplied ? c.dontVeto : c.dontMild,
  ];

  const scenarios =
    input.bias === "bullish"
      ? [
          {
            if: `${c.floorLabel} ~${input.levels.support}`,
            then: c.actionBull,
          },
          {
            if: `${c.ceilingLabel} ~${input.levels.watch}`,
            then: c.placeAtCeiling,
          },
          {
            if: `${c.stopLabel} ~${input.levels.invalidation}`,
            then: c.vetoStep,
          },
        ]
      : input.bias === "bearish"
        ? [
            {
              if: `${c.ceilingLabel} ~${input.levels.watch}`,
              then: c.actionBear,
            },
            {
              if: `${c.floorLabel} ~${input.levels.support}`,
              then: c.placeOnFloor,
            },
            {
              if: `${c.stopLabel} ~${input.levels.invalidation}`,
              then: c.vetoStep,
            },
          ]
        : [
            {
              if: `${c.ceilingLabel} ~${input.levels.watch}`,
              then: c.actionBull,
            },
            {
              if: `${c.floorLabel} ~${input.levels.support}`,
              then: c.actionBear,
            },
            {
              if: `${c.floorLabel} ↔ ${c.ceilingLabel}`,
              then: c.actionWait,
            },
          ];

  const whyBits = [input.macroNarrative, input.newsNarrative]
    .filter(Boolean)
    .map((line) => simplifyJargon(line!, locale))
    .slice(0, 2);

  const explain =
    whyBits.length > 0
      ? `${title}. ${move} ${vs.place} ${whyBits.join(" ")} ${conf}`
      : `${title}. ${move} ${vs.place} ${conf}`;

  const steps = [
    move,
    vs.place,
    conf,
    input.vetoApplied ? c.vetoStep : action,
    `${c.floorLabel} ${input.levels.support} · ${c.ceilingLabel} ${input.levels.watch} · ${c.stopLabel} ${input.levels.invalidation}.`,
  ];

  const headlineHints = (input.headlines ?? []).slice(0, 3).map((item) => ({
    source: item.source,
    title: item.title,
  }));

  return {
    title,
    explain,
    steps,
    action,
    mood,
    band,
    vs,
    doList,
    dontList,
    scenarios,
    headlineHints,
  };
}

/** @deprecated prefer buildGoldTodayResult */
export function buildPlainExplain(
  input: Omit<PlainInput, "price"> & { price?: number },
) {
  return buildGoldTodayResult({
    ...input,
    price: input.price ?? (input.levels.support + input.levels.watch) / 2,
  });
}

/** Soften common desk jargon for beginners. */
export function simplifyJargon(text: string, locale: Locale = "en") {
  if (locale === "fr") {
    return text
      .replace(/\bXAUUSD\b/gi, "or")
      .replace(/\bDXY\b/g, "le dollar US")
      .replace(/\breal yields?\b/gi, "taux réels")
      .replace(/\bATR\b/g, "variation typique du jour")
      .replace(/\binvalidation\b/gi, "ligne stop")
      .replace(/\bbullish\b/gi, "biais haussier")
      .replace(/\bbearish\b/gi, "biais baissier")
      .replace(/\bmacro\b/gi, "vue d’ensemble")
      .replace(/\bveto\b/gi, "frein risque");
  }
  if (locale === "ar") {
    return text
      .replace(/\bXAUUSD\b/gi, "الذهب")
      .replace(/\bDXY\b/g, "الدولار الأمريكي")
      .replace(/\breal yields?\b/gi, "العوائد الحقيقية")
      .replace(/\bATR\b/g, "التذبذب اليومي المعتاد")
      .replace(/\binvalidation\b/gi, "خط الوقف")
      .replace(/\bbullish\b/gi, "ميل صاعد")
      .replace(/\bbearish\b/gi, "ميل هابط")
      .replace(/\bmacro\b/gi, "الصورة الكبيرة")
      .replace(/\bveto\b/gi, "فرامل المخاطر");
  }
  return text
    .replace(/\bXAUUSD\b/gi, "gold")
    .replace(/\bDXY\b/g, "the US dollar")
    .replace(/\breal yields?\b/gi, "inflation-adjusted interest rates")
    .replace(/\bATR\b/g, "typical daily swing")
    .replace(/\binvalidation\b/gi, "stop line")
    .replace(/\bbullish\b/gi, "leaning higher")
    .replace(/\bbearish\b/gi, "leaning lower")
    .replace(/\bmacro\b/gi, "big-picture economy")
    .replace(/\bveto\b/gi, "risk brake");
}

export function agentJobPlain(agentId: string, locale: Locale = "en") {
  const jobs = getCopy(locale).plain.agentJobs;
  if (agentId in jobs && agentId !== "default") {
    return jobs[agentId as AgentId];
  }
  return jobs.default;
}
