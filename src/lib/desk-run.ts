import type { AgentId } from "@/lib/agents";
import type { Locale } from "@/lib/i18n/locales";
import { getCopy } from "@/lib/i18n/copy";

export type RunStep = {
  agentId: AgentId;
  line: string;
  delayMs: number;
};

const delays: Record<AgentId, number> = {
  marcus: 750,
  nova: 900,
  iris: 800,
  felix: 750,
  vera: 700,
  aurelia: 1200,
};

const order: AgentId[] = ["marcus", "nova", "iris", "felix", "vera", "aurelia"];

/** UI timeline while `/api/desk/run` executes the real engine. */
export function getDeskRunSteps(locale: Locale = "en"): RunStep[] {
  const steps = getCopy(locale).runSteps;
  return order.map((agentId) => ({
    agentId,
    line: steps[agentId],
    delayMs: delays[agentId],
  }));
}

/** @deprecated use getDeskRunSteps(locale) */
export const deskRunSteps: RunStep[] = getDeskRunSteps("en");
