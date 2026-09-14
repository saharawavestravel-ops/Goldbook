import type { MarketBar, MarketSnapshot } from "@/lib/market/types";

export function currentSessionLabel(now = new Date()) {
  const hour = now.getUTCHours();
  // Rough full-day desk windows in UTC
  if (hour >= 0 && hour < 7) return "Asia";
  if (hour >= 7 && hour < 12) return "Asia → London";
  if (hour >= 12 && hour < 16) return "London";
  if (hour >= 16 && hour < 21) return "London → New York";
  return "New York";
}

export function computeLevels(bars: MarketBar[]) {
  if (bars.length === 0) {
    return { support: 2620, watch: 2650, invalidation: 2608, atr: 18 };
  }

  const recent = bars.slice(-14);
  const closes = recent.map((bar) => bar.close);
  const last = closes[closes.length - 1] ?? recent[recent.length - 1].close;
  const highs = recent.map((bar) => bar.high);
  const lows = recent.map((bar) => bar.low);

  let trSum = 0;
  for (let i = 1; i < recent.length; i++) {
    const prevClose = recent[i - 1].close;
    const bar = recent[i];
    const tr = Math.max(
      bar.high - bar.low,
      Math.abs(bar.high - prevClose),
      Math.abs(bar.low - prevClose),
    );
    trSum += tr;
  }
  const atr = trSum / Math.max(recent.length - 1, 1);

  const support = Math.min(...lows.slice(-5));
  const watch = Math.max(...highs.slice(-5));
  const invalidation = support - atr * 0.35;

  return {
    support: round2(support),
    watch: round2(watch),
    invalidation: round2(invalidation),
    atr: round2(atr),
    last: round2(last),
  };
}

export function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function fallbackSnapshot(warnings: string[] = []): MarketSnapshot {
  const bars: MarketBar[] = [
    { date: "2026-09-04", open: 2610, high: 2622, low: 2598, close: 2605 },
    { date: "2026-09-05", open: 2605, high: 2618, low: 2592, close: 2597 },
    { date: "2026-09-08", open: 2598, high: 2632, low: 2595, close: 2624 },
    { date: "2026-09-09", open: 2624, high: 2651, low: 2618, close: 2640 },
    { date: "2026-09-10", open: 2640, high: 2655, low: 2628, close: 2642.8 },
  ];
  const levels = computeLevels(bars);
  const price = 2642.8;
  const previousClose = 2640;
  /** Fixed sample clock — never “now”, so UI can’t mistake it for live. */
  const dataAsOf = "2026-09-10T20:00:00.000Z";

  return {
    symbol: "XAUUSD",
    price,
    previousClose,
    changePct: round2(((price - previousClose) / previousClose) * 100),
    session: currentSessionLabel(),
    asOf: dataAsOf,
    dataAsOf,
    source: "fallback",
    sample: true,
    cacheTtlSec: 0,
    bars,
    levels: {
      support: levels.support,
      watch: levels.watch,
      invalidation: levels.invalidation,
      atr: levels.atr,
    },
    helpers: {
      dxy: 104.2,
      dxyChangePct: -0.12,
      us10y: 4.18,
    },
    warnings: [
      "Sample market snapshot — add TWELVEDATA_API_KEY or POLYGON_API_KEY for live quotes.",
      ...warnings,
    ],
  };
}
