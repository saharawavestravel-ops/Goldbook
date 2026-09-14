import { env } from "@/lib/env";
import type { MacroPoint, MacroSnapshot } from "@/lib/context/types";

type FredObservation = {
  date: string;
  value: string;
};

type FredResponse = {
  observations?: FredObservation[];
  error_message?: string;
};

const SERIES = [
  { id: "DGS10", label: "US 10Y yield" },
  { id: "DTWEXBGS", label: "Broad USD index" },
  { id: "T10YIE", label: "10Y breakeven inflation" },
] as const;

async function fetchSeries(seriesId: string, label: string): Promise<MacroPoint | null> {
  const key = env.macro.fredKey;
  if (!key) return null;

  const url = new URL("https://api.stlouisfed.org/fred/series/observations");
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", key);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("sort_order", "desc");
  url.searchParams.set("limit", "8");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error(`FRED HTTP ${response.status} for ${seriesId}`);
  }

  const data = (await response.json()) as FredResponse;
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const usable =
    data.observations?.filter((row) => row.value !== "." && Number.isFinite(Number(row.value))) ??
    [];
  if (usable.length === 0) return null;

  const latest = usable[0];
  const previous = usable[1];
  const value = Number(latest.value);
  const change = previous ? value - Number(previous.value) : undefined;

  return {
    seriesId,
    label,
    value: Math.round(value * 1000) / 1000,
    date: latest.date,
    change: change !== undefined ? Math.round(change * 1000) / 1000 : undefined,
  };
}

function pressureFromPoints(points: MacroPoint[]) {
  let pressure = 0;
  const yieldPoint = points.find((point) => point.seriesId === "DGS10");
  const dollarPoint = points.find((point) => point.seriesId === "DTWEXBGS");
  const breakevenPoint = points.find((point) => point.seriesId === "T10YIE");

  if (yieldPoint?.change !== undefined) {
    // Rising nominal yields → pressure on gold
    pressure += yieldPoint.change * 2;
  }
  if (dollarPoint?.change !== undefined) {
    // Stronger USD → pressure on gold
    pressure += dollarPoint.change * 0.15;
  }
  if (breakevenPoint?.change !== undefined) {
    // Falling inflation expectations (real yields up) → pressure on gold
    // Rising breakevens → softer real yields → supportive for gold
    pressure += -breakevenPoint.change * 1.4;
  }

  return Math.max(-1, Math.min(1, Math.round(pressure * 100) / 100));
}

function narrativeFromPressure(pressure: number, points: MacroPoint[]) {
  const be = points.find((point) => point.seriesId === "T10YIE");
  const beNote =
    be?.change !== undefined
      ? be.change > 0
        ? " Breakevens edged up (softer real-yield tone)."
        : be.change < 0
          ? " Breakevens cooled (firmer real-yield tone)."
          : ""
      : "";

  if (pressure < -0.15) {
    return `Macro softens (USD/yields/real yields) — supportive for gold.${beNote}`;
  }
  if (pressure > 0.15) {
    return `Macro tightens (USD/yields/real yields) — headwind for gold.${beNote}`;
  }
  return `Macro mixed — no strong directional push for gold.${beNote}`;
}

export async function fetchFredMacro(): Promise<MacroSnapshot | null> {
  if (!env.macro.fredKey) return null;

  const points: MacroPoint[] = [];
  for (const series of SERIES) {
    const point = await fetchSeries(series.id, series.label);
    if (point) points.push(point);
  }

  if (points.length === 0) {
    throw new Error("FRED returned no usable series");
  }

  const goldPressure = pressureFromPoints(points);

  const fetchedAt = new Date().toISOString();
  const latestPoint = points.reduce(
    (best, point) => (point.date > best ? point.date : best),
    points[0]?.date ?? "",
  );
  const dataAsOf = latestPoint
    ? new Date(`${latestPoint}T20:00:00.000Z`).toISOString()
    : fetchedAt;

  return {
    source: "fred",
    asOf: fetchedAt,
    dataAsOf,
    sample: false,
    cacheTtlSec: 3600,
    points,
    goldPressure,
    narrative: narrativeFromPressure(goldPressure, points),
    warnings: [],
  };
}
