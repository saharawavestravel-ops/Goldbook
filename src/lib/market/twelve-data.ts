import { env } from "@/lib/env";
import {
  computeLevels,
  currentSessionLabel,
  round2,
} from "@/lib/market/fallback";
import type { MarketBar, MarketSnapshot } from "@/lib/market/types";

type TwelveQuote = {
  symbol?: string;
  close?: string;
  previous_close?: string;
  percent_change?: string;
  datetime?: string;
  status?: string;
  message?: string;
};

type TwelveSeries = {
  values?: { datetime: string; open: string; high: string; low: string; close: string }[];
  status?: string;
  message?: string;
};

async function twelveGet<T>(path: string, params: Record<string, string>) {
  const key = env.market.twelveDataKey;
  if (!key) return null;

  const url = new URL(`https://api.twelvedata.com/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("apikey", key);

  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`Twelve Data HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

function toBars(series: TwelveSeries): MarketBar[] {
  const values = series.values ?? [];
  return values
    .map((row) => ({
      date: row.datetime,
      open: Number(row.open),
      high: Number(row.high),
      low: Number(row.low),
      close: Number(row.close),
    }))
    .filter((bar) => Number.isFinite(bar.close))
    .reverse();
}

export async function fetchTwelveDataSnapshot(): Promise<MarketSnapshot | null> {
  if (!env.market.twelveDataKey) return null;

  const [quote, series, dxy, us10y] = await Promise.all([
    twelveGet<TwelveQuote>("quote", { symbol: "XAU/USD" }),
    twelveGet<TwelveSeries>("time_series", {
      symbol: "XAU/USD",
      interval: "1day",
      outputsize: "30",
    }),
    twelveGet<TwelveQuote>("quote", { symbol: "DXY" }).catch(() => null),
    twelveGet<TwelveQuote>("quote", { symbol: "US10Y" }).catch(() => null),
  ]);

  if (!quote || quote.status === "error") {
    throw new Error(quote?.message ?? "Twelve Data quote failed");
  }
  if (!series || series.status === "error") {
    throw new Error(series?.message ?? "Twelve Data series failed");
  }

  const bars = toBars(series);
  const levels = computeLevels(bars);
  const price = Number(quote.close);
  const previousClose = Number(quote.previous_close ?? bars.at(-2)?.close ?? price);
  const changePct = Number(
    quote.percent_change ??
      (((price - previousClose) / previousClose) * 100).toFixed(2),
  );

  if (!Number.isFinite(price)) {
    throw new Error("Twelve Data returned invalid XAU/USD price");
  }

  const fetchedAt = new Date().toISOString();
  const dataAsOf = quote.datetime
    ? new Date(quote.datetime).toISOString()
    : fetchedAt;

  return {
    symbol: "XAUUSD",
    price: round2(price),
    previousClose: round2(previousClose),
    changePct: round2(changePct),
    session: currentSessionLabel(),
    asOf: fetchedAt,
    dataAsOf,
    source: "twelvedata",
    sample: false,
    cacheTtlSec: 60,
    bars,
    levels: {
      support: levels.support,
      watch: levels.watch,
      invalidation: levels.invalidation,
      atr: levels.atr,
    },
    helpers: {
      dxy: dxy?.close ? round2(Number(dxy.close)) : undefined,
      dxyChangePct: dxy?.percent_change ? round2(Number(dxy.percent_change)) : undefined,
      us10y: us10y?.close ? round2(Number(us10y.close)) : undefined,
    },
    warnings: [],
  };
}
