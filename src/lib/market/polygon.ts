import { env } from "@/lib/env";
import {
  computeLevels,
  currentSessionLabel,
  round2,
} from "@/lib/market/fallback";
import type { MarketBar, MarketSnapshot } from "@/lib/market/types";

type PolygonAgg = {
  results?: { t: number; o: number; h: number; l: number; c: number }[];
  status?: string;
  error?: string;
};

/**
 * Polygon aggregates for C:XAUUSD (if plan supports forex).
 * Used as secondary adapter when Twelve Data is unavailable.
 */
export async function fetchPolygonSnapshot(): Promise<MarketSnapshot | null> {
  const key = env.market.polygonKey;
  if (!key) return null;

  const to = new Date();
  const from = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const url = new URL(
    `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/range/1/day/${fromStr}/${toStr}`,
  );
  url.searchParams.set("adjusted", "true");
  url.searchParams.set("sort", "asc");
  url.searchParams.set("limit", "30");
  url.searchParams.set("apiKey", key);

  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`Polygon HTTP ${response.status}`);
  }

  const data = (await response.json()) as PolygonAgg;
  if (!data.results?.length) {
    throw new Error(data.error ?? "Polygon returned no XAUUSD bars");
  }

  const bars: MarketBar[] = data.results.map((row) => ({
    date: new Date(row.t).toISOString().slice(0, 10),
    open: row.o,
    high: row.h,
    low: row.l,
    close: row.c,
  }));

  const levels = computeLevels(bars);
  const price = bars[bars.length - 1].close;
  const previousClose = bars[bars.length - 2]?.close ?? price;
  const changePct = ((price - previousClose) / previousClose) * 100;

  const lastBarDate = bars[bars.length - 1]?.date;
  const fetchedAt = new Date().toISOString();
  const dataAsOf = lastBarDate
    ? new Date(`${lastBarDate}T20:00:00.000Z`).toISOString()
    : fetchedAt;

  return {
    symbol: "XAUUSD",
    price: round2(price),
    previousClose: round2(previousClose),
    changePct: round2(changePct),
    session: currentSessionLabel(),
    asOf: fetchedAt,
    dataAsOf,
    source: "polygon",
    sample: false,
    cacheTtlSec: 60,
    bars,
    levels: {
      support: levels.support,
      watch: levels.watch,
      invalidation: levels.invalidation,
      atr: levels.atr,
    },
    helpers: {},
    warnings: [],
  };
}
