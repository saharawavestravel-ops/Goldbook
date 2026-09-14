import { getIntegrationStatus, hasAnyLlm, hasMarketData, preferredLlm } from "@/lib/env";

/**
 * Lightweight readiness check used by later desk engine tasks.
 * Safe to call from server routes / server components only.
 */
export function getDeskConfigSummary() {
  const status = getIntegrationStatus();
  const ready = status.filter((item) => item.ready).map((item) => item.id);
  const missing = status.filter((item) => !item.ready).map((item) => item.id);

  return {
    llm: preferredLlm(),
    hasLlm: hasAnyLlm(),
    hasMarketData: hasMarketData(),
    ready,
    missing,
    status,
  };
}
