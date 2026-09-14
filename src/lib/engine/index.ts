import { getContextSnapshot, type ContextSnapshot } from "@/lib/context";
import {
  fuseDeskCall,
  withAureliaNarrative,
  type DeskFusion,
  type AureliaReport,
} from "@/lib/engine/fusion";
import {
  enrichSpecialistsWithLlm,
  synthesizeAureliaWithLlm,
} from "@/lib/engine/llm";
import { applyTrustCalibration, runRulesEngine } from "@/lib/engine/scoring";
import type { SpecialistBundle, SpecialistId, SpecialistReport } from "@/lib/engine/types";
import { getMarketSnapshot, type MarketSnapshot } from "@/lib/market";
import type { Locale } from "@/lib/i18n/locales";

export type { SpecialistBundle, SpecialistReport, SpecialistId } from "@/lib/engine/types";
export type { DeskFusion, AureliaReport } from "@/lib/engine/fusion";
export { biasFromScore } from "@/lib/engine/scoring";
export { fuseDeskCall } from "@/lib/engine/fusion";

export type DeskRunResult = {
  asOf: string;
  market: MarketSnapshot;
  context: ContextSnapshot;
  specialists: SpecialistReport[];
  fusion: DeskFusion;
  warnings: string[];
  locale: Locale;
};

async function loadTrustHints() {
  try {
    const { listStoredScores } = await import("@/lib/scores-store");
    const scores = await listStoredScores();
    return scores.slice(0, 8).map((row) => ({
      bias: row.bias,
      result: row.result,
    }));
  } catch {
    return [];
  }
}

async function loadSpecialistsWithContext(locale: Locale = "en") {
  const warnings: string[] = [];
  const [market, context, trustHints] = await Promise.all([
    getMarketSnapshot(),
    getContextSnapshot(),
    loadTrustHints(),
  ]);

  warnings.push(...market.warnings, ...context.macro.warnings, ...context.news.warnings);

  let reports = runRulesEngine(market, context, locale);
  reports = applyTrustCalibration(reports, trustHints);

  const enriched = await enrichSpecialistsWithLlm(reports, market, context, locale);
  reports = enriched.reports;
  warnings.push(...enriched.warnings);
  if (enriched.provider) {
    warnings.push(`Intelligence layer: ${enriched.provider}`);
  }

  return { market, context, reports, warnings: warnings.filter(Boolean) };
}

/**
 * Run specialist missions on live market + macro/news context.
 * Rules score first; LLM deepens analysis (capped score nudges).
 */
export async function runSpecialists(locale: Locale = "en"): Promise<SpecialistBundle> {
  const { reports, warnings } = await loadSpecialistsWithContext(locale);
  return {
    asOf: new Date().toISOString(),
    reports,
    warnings,
  };
}

/** Full desk: specialists + Aurelia fusion (+ optional LLM chief note). */
export async function runDesk(locale: Locale = "en"): Promise<DeskRunResult> {
  const { market, context, reports, warnings } = await loadSpecialistsWithContext(locale);
  let fusion = fuseDeskCall(reports, market, locale);

  const synthesized = await synthesizeAureliaWithLlm(fusion, reports, market, locale);
  warnings.push(...synthesized.warnings);
  if (synthesized.provider) {
    warnings.push(`Aurelia synthesis: ${synthesized.provider}`);
  }
  if (synthesized.summary) {
    fusion = withAureliaNarrative(fusion, synthesized.summary, synthesized.take, {
      plainTitle: synthesized.plainTitle,
      plainExplain: synthesized.plainExplain,
    });
  }

  return {
    asOf: new Date().toISOString(),
    market,
    context,
    specialists: reports,
    fusion,
    warnings: warnings.filter(Boolean),
    locale,
  };
}

export async function getSpecialistReport(
  agentId: SpecialistId,
  locale: Locale = "en",
): Promise<SpecialistReport | undefined> {
  const bundle = await runSpecialists(locale);
  return bundle.reports.find((report) => report.agentId === agentId);
}

export async function getAureliaReport(locale: Locale = "en"): Promise<AureliaReport> {
  const desk = await runDesk(locale);
  return desk.fusion.aurelia;
}
