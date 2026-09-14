import type { Bias } from "@/lib/today-shared";
import { biasPlainTitle } from "@/lib/plain-language";
import type { Locale } from "@/lib/i18n/locales";
import { getData } from "@/lib/i18n/data";

export type HistoryResult = "hit" | "miss" | "pending";

export type HistoryBrief = {
  id: string;
  dateLabel: string;
  dateIso: string;
  bias: Bias;
  confidence: number;
  summary: string;
  levels: {
    support: number;
    watch: number;
    invalidation: number;
  };
  result: HistoryResult;
  movePct?: number;
  note?: string;
};

export function resultLabel(result: HistoryResult, locale: Locale = "en") {
  const e = getData(locale).engine;
  if (result === "hit") return e.hit;
  if (result === "miss") return e.miss;
  return e.pending;
}

/** Beginner-friendly result wording. */
export function resultLabelPlain(result: HistoryResult, locale: Locale = "en") {
  const e = getData(locale).engine;
  if (result === "hit") return e.hitPlain;
  if (result === "miss") return e.missPlain;
  return e.pendingPlain;
}

export function resultClass(result: HistoryResult) {
  if (result === "hit") return "text-gb-success bg-gb-success/10";
  if (result === "miss") return "text-gb-danger bg-gb-danger/10";
  return "text-gb-muted bg-gb-line/60";
}

export function historyLeanPlain(bias: Bias, locale: Locale = "en") {
  return biasPlainTitle(bias, locale);
}

export function historyStats(briefs: HistoryBrief[]) {
  const scored = briefs.filter((b) => b.result === "hit" || b.result === "miss");
  const hits = scored.filter((b) => b.result === "hit").length;
  const misses = scored.filter((b) => b.result === "miss").length;
  const pending = briefs.filter((b) => b.result === "pending").length;
  const hitRate = scored.length > 0 ? Math.round((hits / scored.length) * 100) : null;
  return { scored: scored.length, hits, misses, pending, hitRate, total: briefs.length };
}
