import type { MacroSnapshot, NewsSnapshot } from "@/lib/context/types";

const SAMPLE_AS_OF = "2026-09-10T20:00:00.000Z";
const SAMPLE_DATE = "2026-09-10";

export function fallbackMacro(warnings: string[] = []): MacroSnapshot {
  return {
    source: "fallback",
    asOf: SAMPLE_AS_OF,
    dataAsOf: SAMPLE_AS_OF,
    sample: true,
    cacheTtlSec: 0,
    points: [
      {
        seriesId: "DGS10",
        label: "US 10Y yield",
        value: 4.18,
        date: SAMPLE_DATE,
        change: -0.02,
      },
      {
        seriesId: "DTWEXBGS",
        label: "Broad USD index",
        value: 122.4,
        date: SAMPLE_DATE,
        change: -0.15,
      },
      {
        seriesId: "T10YIE",
        label: "10Y breakeven inflation",
        value: 2.21,
        date: SAMPLE_DATE,
        change: 0.01,
      },
    ],
    goldPressure: -0.18,
    narrative: "Sample macro: slightly softer USD/yields — mild support for gold.",
    warnings: [
      "Sample macro — add FRED_API_KEY for live yields and dollar data.",
      ...warnings,
    ],
  };
}

export function fallbackNews(warnings: string[] = []): NewsSnapshot {
  return {
    source: "fallback",
    asOf: SAMPLE_AS_OF,
    dataAsOf: SAMPLE_AS_OF,
    sample: true,
    cacheTtlSec: 0,
    items: [
      {
        id: "sample-1",
        title: "Dollar softens as markets await Fed speakers",
        source: "Sample Wire",
        publishedAt: SAMPLE_AS_OF,
        score: 0.25,
        reasons: ["gold-relevant", "+ weak dollar tone"],
      },
      {
        id: "sample-2",
        title: "Gold holds near session highs on safe-haven demand",
        source: "Sample Wire",
        publishedAt: SAMPLE_AS_OF,
        score: 0.35,
        reasons: ["mentions gold", "+ safe haven"],
      },
      {
        id: "sample-3",
        title: "Treasury yields ease after quiet inflation data",
        source: "Sample Wire",
        publishedAt: SAMPLE_AS_OF,
        score: 0.2,
        reasons: ["gold-relevant", "yield"],
      },
    ],
    sentiment: 0.27,
    narrative: "Sample news lean mildly supportive for gold.",
    warnings: [
      "Sample news — add FINNHUB_API_KEY or NEWS_API_KEY for live headlines.",
      ...warnings,
    ],
  };
}
