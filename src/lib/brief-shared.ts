import { agents, type AgentId } from "@/lib/agents";
import type { Bias, DailyBriefPreview } from "@/lib/today-shared";
import { biasLabelSimple } from "@/lib/today-shared";
import { biasPlainTitle } from "@/lib/plain-language";

export type DebateLine = {
  agentId: AgentId;
  agentName: string;
  text: string;
  plainVerdict?: string;
  watchNext?: string;
};

export type DailyBrief = DailyBriefPreview & {
  signedBy: string;
  why: string[];
  debate: DebateLine[];
  plan: {
    bias: string;
    levels: string;
    dontTradeIf: string;
  };
  sources: { label: string; detail: string }[];
  dissent: string;
  /** Locale the brief prose was generated in */
  locale?: import("@/lib/i18n/locales").Locale;
};

export function briefShareText(brief: DailyBrief) {
  const title = brief.plainTitle ?? biasPlainTitle(brief.bias as Bias);
  const explain = brief.plainExplain ?? brief.summary;
  return [
    `Goldbook · ${brief.dateLabel}`,
    title,
    `${biasLabelSimple(brief.bias as Bias)} · ${brief.confidence}/100 sure`,
    explain,
    `Map: ${brief.plan.levels}`,
    `Stand down if: ${brief.plan.dontTradeIf}`,
    `— ${brief.signedBy} · research only, not advice`,
  ].join("\n");
}

export function agentAccent(agentId: AgentId) {
    return agents.find((agent) => agent.id === agentId)?.accent ?? "#2563eb";
}
