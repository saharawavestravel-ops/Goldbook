import {
  buildPredictionScenarios,
  type PredictionPath,
} from "@/lib/desk-intel";
import type { Bias, DailyBriefPreview } from "@/lib/today-shared";
import { simplifyJargon } from "@/lib/plain-language";
import type { Locale } from "@/lib/i18n/locales";
import { getCopy } from "@/lib/i18n/copy";

export type IntelDriver = {
  id: string;
  label: string;
  lean: "up" | "down" | "flat";
  detail: string;
  /** 0–100 relative importance today */
  weight: number;
};

export type HomeIntel = {
  edgeScore: number;
  edgeLabel: string;
  riskTemp: "cool" | "warm" | "hot";
  riskLabel: string;
  expectedSwing: { dollars: number; pct: number };
  drivers: IntelDriver[];
  catalyst: string | null;
  machineRead: string;
  leadingPath: PredictionPath;
  paths: PredictionPath[];
  dissentNote?: string;
  agreementPct: number | null;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function leanFromScore(score: number): IntelDriver["lean"] {
  if (score >= 0.12) return "up";
  if (score <= -0.12) return "down";
  return "flat";
}

function leanWord(lean: IntelDriver["lean"], locale: Locale) {
  const h = getCopy(locale).home;
  if (lean === "up") return h.leanHelps;
  if (lean === "down") return h.leanPresses;
  return h.leanMixed;
}

/** Synthesize a home-page intelligence pack from the saved desk preview. */
export function buildHomeIntel(
  preview: DailyBriefPreview,
  locale: Locale = "en",
): HomeIntel {
  const h = getCopy(locale).home;
  const paths = buildPredictionScenarios(
    {
      bias: preview.bias,
      confidence: preview.confidence,
      price: preview.price,
      levels: preview.levels,
      vetoApplied: preview.vetoApplied,
      fusionScore: preview.fusionScore,
    },
    locale,
  );
  const leadingPath = [...paths].sort((a, b) => b.probability - a.probability)[0]!;

  const atr = preview.atr ?? round2((preview.levels.watch - preview.levels.support) * 0.45);
  const expectedSwing = {
    dollars: round2(atr),
    pct: round2((atr / Math.max(preview.price, 1)) * 100),
  };

  const drivers: IntelDriver[] = [];

  if (preview.helpers?.dxyChangePct !== undefined) {
    const dxy = preview.helpers.dxyChangePct;
    const lean: IntelDriver["lean"] = dxy > 0.05 ? "down" : dxy < -0.05 ? "up" : "flat";
    const pct = `${dxy >= 0 ? "+" : ""}${dxy.toFixed(2)}`;
    drivers.push({
      id: "dollar",
      label: h.dollar,
      lean,
      detail:
        lean === "up"
          ? h.dollarEase(pct)
          : lean === "down"
            ? h.dollarFirm(pct)
            : h.dollarFlat(pct),
      weight: 88,
    });
  }

  if (preview.helpers?.us10y !== undefined) {
    const y = preview.helpers.us10y;
    const lean: IntelDriver["lean"] = y >= 4.35 ? "down" : y <= 4.0 ? "up" : "flat";
    const ys = y.toFixed(2);
    drivers.push({
      id: "yields",
      label: h.yields,
      lean,
      detail:
        lean === "down"
          ? h.yieldsHigh(ys)
          : lean === "up"
            ? h.yieldsSoft(ys)
            : h.yieldsMid(ys),
      weight: 78,
    });
  }

  const span = Math.max(preview.levels.watch - preview.levels.support, 1);
  const pos = (preview.price - preview.levels.support) / span;
  drivers.push({
    id: "chart",
    label: h.chart,
    lean: pos > 0.68 ? "up" : pos < 0.32 ? "down" : "flat",
    detail: pos > 0.68 ? h.chartHigh : pos < 0.32 ? h.chartLow : h.chartMid,
    weight: 72,
  });

  const newsScore =
    preview.topHeadlines.length > 0
      ? preview.topHeadlines.reduce((a, item) => a + item.score, 0) / preview.topHeadlines.length
      : 0;
  if (preview.topHeadlines.length > 0 || preview.newsNarrative) {
    drivers.push({
      id: "news",
      label: h.news,
      lean: leanFromScore(newsScore),
      detail: simplifyJargon(
        preview.newsNarrative ||
          (newsScore >= 0.15
            ? h.newsHelp
            : newsScore <= -0.15
              ? h.newsHurt
              : h.newsMix),
        locale,
      ),
      weight: 70,
    });
  }

  if (preview.macroNarrative) {
    const m = preview.macroNarrative.toLowerCase();
    const lean: IntelDriver["lean"] = /support|helpful|easing|soft dollar|lower yield/.test(m)
      ? "up"
      : /pressure|tighter|strong dollar|higher yield|headwind/.test(m)
        ? "down"
        : "flat";
    drivers.push({
      id: "macro",
      label: h.macro,
      lean,
      detail: simplifyJargon(preview.macroNarrative, locale).slice(0, 140),
      weight: 65,
    });
  }

  for (const lean of preview.agentLeans ?? []) {
    if (lean.agentId === "vera") continue;
    drivers.push({
      id: `agent-${lean.agentId}`,
      label: lean.name,
      lean: leanFromScore(lean.score),
      detail: lean.plainVerdict ?? `${lean.name} ${lean.score >= 0 ? "+" : ""}${lean.score.toFixed(2)}`,
      weight: Math.round(40 + lean.confidence * 0.35),
    });
  }

  const ranked = [...drivers]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  const agreementPct =
    preview.agreement !== undefined ? Math.round(preview.agreement * 100) : null;

  const absFusion = Math.abs(preview.fusionScore ?? 0);
  let edgeScore = Math.round(
    clamp(
      preview.confidence * 0.55 +
        (agreementPct ?? 50) * 0.25 +
        absFusion * 35 +
        (preview.bias === "range" ? -8 : 6),
      18,
      92,
    ),
  );
  if (preview.vetoApplied) edgeScore = Math.min(edgeScore, 48);

  const edgeLabel =
    edgeScore >= 70 ? h.edgeClean : edgeScore >= 52 ? h.edgeSoft : h.edgeThin;

  const atrPct = expectedSwing.pct;
  const riskTemp: HomeIntel["riskTemp"] = preview.vetoApplied
    ? "hot"
    : atrPct >= 1.2 || Math.abs(preview.priceChangePct) >= 0.9
      ? "hot"
      : atrPct >= 0.7 || (agreementPct !== null && agreementPct < 55)
        ? "warm"
        : "cool";

  const riskLabel =
    riskTemp === "hot" ? h.riskHot : riskTemp === "warm" ? h.riskWarm : h.riskCool;

  const topHeadline = preview.topHeadlines[0];
  const catalyst = topHeadline
    ? `${topHeadline.source}: ${topHeadline.title}`
    : null;

  const dissent = preview.agentLeans
    ?.filter((a) => {
      if (preview.bias === "bullish") return a.bias === "bearish";
      if (preview.bias === "bearish") return a.bias === "bullish";
      return a.bias !== "range" && Math.abs(a.score) > 0.2;
    })
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];

  const dissentNote = dissent
    ? h.dissent(dissent.name, dissent.plainVerdict ?? dissent.bias)
    : undefined;

  const driverBits = ranked
    .slice(0, 3)
    .map((d) => `${d.label} ${leanWord(d.lean, locale)}`)
    .join(" · ");

  const baseRead =
    preview.plainExplain ??
    (preview.bias === "bullish"
      ? h.readBull
      : preview.bias === "bearish"
        ? h.readBear
        : h.readWait);

  const machineRead = [
    baseRead,
    driverBits ? h.driversToday(driverBits) : null,
    h.leadingPath(leadingPath.label, leadingPath.probability),
    preview.vetoApplied ? h.riskBrakeOn : null,
    h.typicalSwing(String(expectedSwing.dollars), expectedSwing.pct),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    edgeScore,
    edgeLabel,
    riskTemp,
    riskLabel,
    expectedSwing,
    drivers: ranked,
    catalyst,
    machineRead: simplifyJargon(machineRead, locale),
    leadingPath,
    paths,
    dissentNote,
    agreementPct,
  };
}

export function biasToDriverLean(bias: Bias): IntelDriver["lean"] {
  if (bias === "bullish") return "up";
  if (bias === "bearish") return "down";
  return "flat";
}
