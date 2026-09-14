import type { AgentId, AgentStatus } from "@/lib/agents";
import type { Bias } from "@/lib/today-shared";

export type SpecialistId = Exclude<AgentId, "aurelia">;

export type AgentSource = {
  label: string;
  detail: string;
};

/** Structured specialist mission output. */
export type SpecialistReport = {
  agentId: SpecialistId;
  status: AgentStatus;
  /** Directional score in [-1, 1] */
  score: number;
  bias: Bias;
  /** 0–100 */
  confidence: number;
  take: string;
  /** One plain sentence: lean higher / lower / wait */
  plainVerdict?: string;
  /** One concrete thing to watch next */
  watchNext?: string;
  sources: AgentSource[];
  trustWeight: number;
  engine: "rules" | "rules+llm";
};

export type SpecialistBundle = {
  asOf: string;
  reports: SpecialistReport[];
  warnings: string[];
};
