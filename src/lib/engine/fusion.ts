import { biasFromScore } from "@/lib/engine/scoring";
import type { SpecialistReport } from "@/lib/engine/types";
import type { MarketSnapshot } from "@/lib/market";
import type { Bias } from "@/lib/today-shared";
import type { AgentStatus } from "@/lib/agents";
import type { Locale } from "@/lib/i18n/locales";
import { getData } from "@/lib/i18n/data";

export type AureliaReport = {
  agentId: "aurelia";
  status: AgentStatus;
  bias: Bias;
  confidence: number;
  take: string;
  sources: { label: string; detail: string }[];
  trustWeight: number;
  score: number;
  engine: "fusion" | "fusion+llm";
};

export type DeskFusion = {
  bias: Bias;
  /** Fused directional score in [-1, 1] */
  score: number;
  confidence: number;
  summary: string;
  plainTitle?: string;
  plainExplain?: string;
  levels: {
    support: number;
    watch: number;
    invalidation: number;
  };
  veto: {
    applied: boolean;
    reason?: string;
  };
  agreement: number;
  dissent?: SpecialistReport;
  aurelia: AureliaReport;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function agreementScore(reports: SpecialistReport[]) {
  if (reports.length === 0) return 0;
  const sum = reports.reduce((acc, report) => acc + report.score, 0);
  const dominantSign = Math.sign(sum) || 1;
  const aligned = reports.filter((report) => {
    if (Math.abs(report.score) < 0.08) return true;
    return Math.sign(report.score) === dominantSign;
  }).length;
  return aligned / reports.length;
}

/**
 * Aurelia fusion:
 * X = Σ(α · c · x) / Σ(α · c)
 * Vera veto when vol elevated, desk split + flat risk, or late-session chaos.
 */
export function fuseDeskCall(
  reports: SpecialistReport[],
  market: MarketSnapshot,
  locale: Locale = "en",
): DeskFusion {
  const e = getData(locale).engine;
  const voters = reports.filter((r) => r.agentId !== "vera");
  const vera = reports.find((r) => r.agentId === "vera");

  let weightSum = 0;
  let weighted = 0;
  for (const report of voters) {
    const w = report.trustWeight * (report.confidence / 100);
    weighted += w * report.score;
    weightSum += w;
  }

  let score = weightSum > 0 ? weighted / weightSum : 0;
  const agreement = agreementScore(voters);
  let bias = biasFromScore(score);
  let confidence = Math.round(
    clamp(Math.abs(score) * 110 * agreement * 0.9 + 22 * agreement, 44, 84),
  );

  const atrPct = market.levels.atr / Math.max(market.price, 1);
  const splitDesk = agreement < 0.58;
  const veraFlat = vera ? Math.abs(vera.score) < 0.12 && vera.bias === "range" : false;
  const highVol = atrPct > 0.012;
  const extremeDay = Math.abs(market.changePct) > 1.1;

  let vetoApplied = false;
  let vetoReason: string | undefined;

  if (vera && (highVol || extremeDay || (splitDesk && veraFlat))) {
    vetoApplied = true;
    bias = "range";
    score = score * 0.22;
    confidence = Math.min(confidence, 52);
    vetoReason = highVol ? e.vetoVol : extremeDay ? e.vetoExtreme : e.vetoSplit;
  }

  score = round2(score);
  const dissent =
    reports
      .filter((r) => Math.sign(r.score) !== 0 && Math.sign(r.score) !== Math.sign(score || 1))
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0] ??
    reports.find((r) => r.status === "disagreed");

  const scoreStr = `${score > 0 ? "+" : ""}${score}`;
  const summaryParts = [
    bias === "bullish" ? e.summaryBull : bias === "bearish" ? e.summaryBear : e.summaryWait,
    e.summaryScore(scoreStr, Math.round(agreement * 100)),
  ];
  if (vetoApplied && vetoReason) summaryParts.push(vetoReason);
  else if (dissent) {
    const name = dissent.agentId[0]!.toUpperCase() + dissent.agentId.slice(1);
    summaryParts.push(e.dissent(name));
  }

  const aurelia: AureliaReport = {
    agentId: "aurelia",
    status: "ready",
    bias,
    confidence,
    take: summaryParts.join(" "),
    sources: [
      { label: e.srcFusion, detail: String(score) },
      { label: e.srcAgreement, detail: `${Math.round(agreement * 100)}%` },
      {
        label: e.srcVera,
        detail: vetoApplied ? vetoReason ?? e.srcVeraVeto : e.srcVeraOk,
      },
      {
        label: e.srcLevels,
        detail: `${market.levels.support} / ${market.levels.watch} / ${market.levels.invalidation}`,
      },
    ],
    trustWeight: 1,
    score,
    engine: "fusion",
  };

  return {
    bias,
    score,
    confidence,
    summary: summaryParts.join(" "),
    levels: {
      support: market.levels.support,
      watch: market.levels.watch,
      invalidation: market.levels.invalidation,
    },
    veto: { applied: vetoApplied, reason: vetoReason },
    agreement,
    dissent,
    aurelia,
  };
}

/** Apply Aurelia LLM prose onto an existing fusion result. */
export function withAureliaNarrative(
  fusion: DeskFusion,
  summary: string,
  take: string,
  plain?: { plainTitle?: string; plainExplain?: string },
): DeskFusion {
  return {
    ...fusion,
    summary,
    plainTitle: plain?.plainTitle ?? fusion.plainTitle,
    plainExplain: plain?.plainExplain ?? fusion.plainExplain,
    aurelia: {
      ...fusion.aurelia,
      take,
      engine: "fusion+llm",
      sources: [
        ...fusion.aurelia.sources,
        { label: "Chief note", detail: "LLM synthesis" },
      ],
    },
  };
}
