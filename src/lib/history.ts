import type { Bias } from "@/lib/today-shared";
import { biasLabel } from "@/lib/today-shared";
import type { HistoryBrief, HistoryResult } from "@/lib/history-shared";
import { resultClass, resultLabel } from "@/lib/history-shared";
import { loadDailyBrief, listBriefDates, briefDateKey } from "@/lib/brief-store";
import { listStoredScores } from "@/lib/scores-store";
import { scoreYesterdayIfNeeded } from "@/lib/score-service";

export type { HistoryBrief, HistoryResult };
export { resultClass, resultLabel };

/** Seed samples so History never looks empty before first scored runs. */
const sampleHistory: HistoryBrief[] = [
  {
    id: "2026-09-09",
    dateLabel: "Tue, Sep 9",
    dateIso: "2026-09-09",
    bias: "bullish",
    confidence: 61,
    summary: "Soft USD tone supported a mild gold bid into New York.",
    levels: { support: 2614, watch: 2648, invalidation: 2602 },
    result: "hit",
    movePct: 0.42,
    note: "Price respected support and closed higher.",
  },
  {
    id: "2026-09-08",
    dateLabel: "Mon, Sep 8",
    dateIso: "2026-09-08",
    bias: "range",
    confidence: 54,
    summary: "Chop expected around resistance with mixed macro signals.",
    levels: { support: 2608, watch: 2635, invalidation: 2595 },
    result: "hit",
    movePct: 0.08,
    note: "Session stayed inside the range call.",
  },
  {
    id: "2026-09-05",
    dateLabel: "Fri, Sep 5",
    dateIso: "2026-09-05",
    bias: "bullish",
    confidence: 57,
    summary: "Desk leaned long, but a late USD bounce cut the move.",
    levels: { support: 2598, watch: 2628, invalidation: 2588 },
    result: "miss",
    movePct: -0.31,
    note: "Invalidation was close; bias was too early.",
  },
];

function formatDateLabel(dateIso: string) {
  if (dateIso === briefDateKey()) return "Today";
  const date = new Date(`${dateIso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

/** Build history from scores + persisted briefs + samples. */
export async function getHistoryBriefs(): Promise<HistoryBrief[]> {
  await scoreYesterdayIfNeeded().catch(() => null);

  const [scores, dates] = await Promise.all([listStoredScores(), listBriefDates()]);
  const byId = new Map<string, HistoryBrief>();

  for (const sample of sampleHistory) {
    byId.set(sample.id, sample);
  }

  for (const score of scores) {
    byId.set(score.dateIso, {
      id: score.dateIso,
      dateLabel: formatDateLabel(score.dateIso),
      dateIso: score.dateIso,
      bias: score.bias,
      confidence: score.confidence,
      summary: score.summary,
      levels: score.levels,
      result: score.result,
      movePct: score.movePct,
      note: score.note,
    });
  }

  for (const dateIso of dates) {
    const existing = byId.get(dateIso);
    if (existing && existing.result !== "pending") continue;
    const brief = await loadDailyBrief(dateIso);
    if (!brief) continue;
    const isToday = dateIso === briefDateKey();
    byId.set(dateIso, {
      id: isToday ? "today" : dateIso,
      dateLabel: formatDateLabel(dateIso),
      dateIso,
      bias: brief.bias,
      confidence: brief.confidence,
      summary: brief.summary,
      levels: brief.levels,
      result: isToday ? "pending" : (existing?.result ?? "pending"),
      movePct: existing?.movePct,
      note: existing?.note ?? (isToday ? "Awaiting end-of-day score." : "Not scored yet."),
    });
  }

  return Array.from(byId.values()).sort((a, b) => b.dateIso.localeCompare(a.dateIso));
}

export async function getHistoryBrief(id: string) {
  const briefs = await getHistoryBriefs();
  if (id === "today") {
    return (
      briefs.find((brief) => brief.dateIso === briefDateKey()) ??
      briefs.find((b) => b.id === "today")
    );
  }
  return briefs.find((brief) => brief.id === id || brief.dateIso === id);
}

export function historyTitle(brief: HistoryBrief) {
  return `${biasLabel(brief.bias as Bias)} · ${brief.confidence}`;
}

/** Sync helper for generateStaticParams samples. */
export const historyBriefs = sampleHistory;
