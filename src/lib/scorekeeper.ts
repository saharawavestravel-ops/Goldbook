import type { Bias } from "@/lib/today-shared";
import type { HistoryResult } from "@/lib/history-shared";

export type ScoreInput = {
  bias: Bias;
  confidence: number;
  /** Percent move from call price to next evaluation price */
  movePct: number;
};

export type ScoreResult = {
  result: Exclude<HistoryResult, "pending">;
  movePct: number;
  note: string;
};

const TREND_THRESHOLD = 0.15;
const RANGE_THRESHOLD = 0.25;

/**
 * Grade a daily call against the realized gold move.
 * Bullish/bearish need a clear directional move; range wants containment.
 */
export function gradeCall(input: ScoreInput): ScoreResult {
  const move = Math.round(input.movePct * 100) / 100;
  const abs = Math.abs(move);

  if (input.bias === "bullish") {
    if (move >= TREND_THRESHOLD) {
      return {
        result: "hit",
        movePct: move,
        note: `Gold rose ${formatMove(move)} — bullish call held.`,
      };
    }
    if (move <= -TREND_THRESHOLD) {
      return {
        result: "miss",
        movePct: move,
        note: `Gold fell ${formatMove(move)} — bullish call missed.`,
      };
    }
    return {
      result: abs <= 0.08 ? "hit" : "miss",
      movePct: move,
      note:
        abs <= 0.08
          ? `Flat day (${formatMove(move)}) — mild bullish still acceptable.`
          : `Chop (${formatMove(move)}) — bullish lacked follow-through.`,
    };
  }

  if (input.bias === "bearish") {
    if (move <= -TREND_THRESHOLD) {
      return {
        result: "hit",
        movePct: move,
        note: `Gold fell ${formatMove(move)} — bearish call held.`,
      };
    }
    if (move >= TREND_THRESHOLD) {
      return {
        result: "miss",
        movePct: move,
        note: `Gold rose ${formatMove(move)} — bearish call missed.`,
      };
    }
    return {
      result: abs <= 0.08 ? "hit" : "miss",
      movePct: move,
      note:
        abs <= 0.08
          ? `Flat day (${formatMove(move)}) — mild bearish still acceptable.`
          : `Chop (${formatMove(move)}) — bearish lacked follow-through.`,
    };
  }

  // range
  if (abs <= RANGE_THRESHOLD) {
    return {
      result: "hit",
      movePct: move,
      note: `Move ${formatMove(move)} stayed inside range expectations.`,
    };
  }

  return {
    result: "miss",
    movePct: move,
    note: `Move ${formatMove(move)} broke the range call.`,
  };
}

function formatMove(move: number) {
  return `${move >= 0 ? "+" : ""}${move.toFixed(2)}%`;
}

export function previousDateKey(from = new Date()) {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
