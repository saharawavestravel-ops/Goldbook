import { persistGetJson, persistSetJson } from "@/lib/persist";
import type { Bias } from "@/lib/today-shared";
import type { HistoryResult } from "@/lib/history-shared";

export type StoredScore = {
  dateIso: string;
  bias: Bias;
  confidence: number;
  summary: string;
  levels: {
    support: number;
    watch: number;
    invalidation: number;
  };
  result: Exclude<HistoryResult, "pending">;
  movePct: number;
  note: string;
  callPrice: number;
  evalPrice: number;
  scoredAt: string;
};

type ScoreStore = Record<string, StoredScore>;

const SCORES_KEY = "scores";

async function readStore(): Promise<ScoreStore> {
  return (await persistGetJson<ScoreStore>(SCORES_KEY)) ?? {};
}

async function writeStore(store: ScoreStore) {
  await persistSetJson(SCORES_KEY, store);
}

export async function getStoredScore(dateIso: string) {
  const store = await readStore();
  return store[dateIso] ?? null;
}

export async function listStoredScores() {
  const store = await readStore();
  return Object.values(store).sort((a, b) => b.dateIso.localeCompare(a.dateIso));
}

export async function saveStoredScore(score: StoredScore) {
  const store = await readStore();
  store[score.dateIso] = score;
  await writeStore(store);
  return score;
}
