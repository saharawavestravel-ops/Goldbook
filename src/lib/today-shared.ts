import type { AgentStatus } from "@/lib/agents";
import type { MarketSnapshot } from "@/lib/market/types";

export type Bias = "bullish" | "bearish" | "range";

export type DailyBriefPreview = {
  dateLabel: string;
  session: string;
  price: number;
  priceChangePct: number;
  bias: Bias;
  confidence: number;
  summary: string;
  /** Beginner-friendly one-liner */
  plainTitle?: string;
  /** Beginner-friendly paragraph */
  plainExplain?: string;
  levels: {
    support: number;
    watch: number;
    invalidation: number;
  };
  agentStatuses: Record<string, AgentStatus>;
  hasBrief: boolean;
  marketSource: MarketSnapshot["source"];
  marketWarnings: string[];
  dataSamples?: {
    market: boolean;
    macro: boolean;
    news: boolean;
  };
  macroNarrative: string;
  newsNarrative: string;
  topHeadlines: {
    title: string;
    source: string;
    score: number;
    reasons?: string[];
    url?: string;
    publishedAt?: string;
  }[];
  fusionScore?: number;
  vetoApplied?: boolean;
  /** Desk agreement 0–1 */
  agreement?: number;
  atr?: number;
  helpers?: {
    dxy?: number;
    dxyChangePct?: number;
    us10y?: number;
  };
  agentLeans?: {
    agentId: string;
    name: string;
    bias: Bias;
    score: number;
    confidence: number;
    plainVerdict?: string;
  }[];
  trackRecord?: {
    hitRate: number | null;
    scored: number;
    hits: number;
    misses: number;
  };
};

export function biasLabel(bias: Bias) {
  if (bias === "bullish") return "Mildly bullish";
  if (bias === "bearish") return "Mildly bearish";
  return "Range / wait";
}

/** Even simpler label for home hero. */
export function biasLabelSimple(bias: Bias) {
  if (bias === "bullish") return "Lean up";
  if (bias === "bearish") return "Lean down";
  return "Wait";
}

export function biasClass(bias: Bias) {
  if (bias === "bullish") return "text-gb-bull";
  if (bias === "bearish") return "text-gb-bear";
  return "text-gb-range";
}
