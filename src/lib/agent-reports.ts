import type { AgentId, AgentStatus } from "@/lib/agents";
import { agents } from "@/lib/agents";
import { loadDailyBrief } from "@/lib/brief-store";
import { getData } from "@/lib/i18n/data";
import type { Locale } from "@/lib/i18n/locales";
import type { Bias } from "@/lib/today-shared";

export type AgentReport = {
  agentId: AgentId;
  status: AgentStatus;
  bias: Bias;
  confidence: number;
  take: string;
  plainVerdict?: string;
  watchNext?: string;
  sources: { label: string; detail: string }[];
  trustWeight: number;
  score?: number;
  engine?: string;
};

const TRUST: Record<AgentId, number> = {
  aurelia: 1,
  marcus: 0.9,
  nova: 0.85,
  iris: 0.75,
  felix: 0.7,
  vera: 0.95,
};

function idleReport(agentId: AgentId, locale: Locale = "en"): AgentReport {
  const e = getData(locale).engine;
  return {
    agentId,
    status: "idle",
    bias: "range",
    confidence: 0,
    take: e.idleTake,
    sources: [{ label: e.idleSource, detail: e.idleDetail }],
    trustWeight: TRUST[agentId],
  };
}

/** Prefer today’s saved brief; otherwise idle empty state (no forced live run). */
export async function getAgentReport(
  agentId: AgentId,
  locale: Locale = "en",
): Promise<AgentReport> {
  const stored = await loadDailyBrief(undefined, locale);
  if (!stored) return idleReport(agentId, locale);
  const e = getData(locale).engine;

  if (agentId === "aurelia") {
    return {
      agentId: "aurelia",
      status: "ready",
      bias: stored.bias,
      confidence: stored.confidence,
      take: stored.plainExplain ?? stored.summary,
      plainVerdict: stored.plainTitle,
      watchNext: e.aureliaWatch(
        stored.levels.support,
        stored.levels.watch,
        stored.levels.invalidation,
      ),
      sources: stored.sources.slice(0, 4),
      trustWeight: TRUST.aurelia,
      engine: "fusion",
    };
  }

  const line = stored.debate.find((item) => item.agentId === agentId);
  if (!line) return idleReport(agentId, locale);

  return {
    agentId,
    status: "ready",
    bias: stored.bias,
    confidence: stored.confidence,
    take: line.text,
    plainVerdict: line.plainVerdict,
    watchNext: line.watchNext,
    sources: stored.sources.slice(0, 3),
    trustWeight: TRUST[agentId],
    engine: "stored-brief",
  };
}

export async function getAllAgentReports(locale: Locale = "en"): Promise<AgentReport[]> {
  const ids = agents.map((agent) => agent.id);
  return Promise.all(ids.map((id) => getAgentReport(id, locale)));
}
