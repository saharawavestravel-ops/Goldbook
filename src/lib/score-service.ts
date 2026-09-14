import { loadDailyBrief } from "@/lib/brief-store";
import { getMarketSnapshot } from "@/lib/market";
import { gradeCall, previousDateKey } from "@/lib/scorekeeper";
import { getStoredScore, saveStoredScore, type StoredScore } from "@/lib/scores-store";

export async function scoreBriefForDate(dateIso: string): Promise<StoredScore> {
  const existing = await getStoredScore(dateIso);
  if (existing) return existing;

  const brief = await loadDailyBrief(dateIso);
  if (!brief) {
    throw new Error(`No persisted brief for ${dateIso}`);
  }

  const market = await getMarketSnapshot();
  const callPrice = brief.price;
  const evalPrice = market.price;
  const movePct = ((evalPrice - callPrice) / callPrice) * 100;

  const graded = gradeCall({
    bias: brief.bias,
    confidence: brief.confidence,
    movePct,
  });

  return saveStoredScore({
    dateIso,
    bias: brief.bias,
    confidence: brief.confidence,
    summary: brief.summary,
    levels: brief.levels,
    result: graded.result,
    movePct: graded.movePct,
    note: graded.note,
    callPrice,
    evalPrice,
    scoredAt: new Date().toISOString(),
  });
}

/** Score yesterday’s brief if present and not yet graded. */
export async function scoreYesterdayIfNeeded() {
  const dateIso = previousDateKey();
  const brief = await loadDailyBrief(dateIso);
  if (!brief) {
    return { scored: false as const, dateIso, reason: "No yesterday brief" };
  }
  const existing = await getStoredScore(dateIso);
  if (existing) {
    return { scored: false as const, dateIso, reason: "Already scored", score: existing };
  }
  const score = await scoreBriefForDate(dateIso);
  return { scored: true as const, dateIso, score };
}
