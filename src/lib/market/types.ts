export type MarketBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type MarketSnapshot = {
  symbol: string;
  price: number;
  previousClose: number;
  changePct: number;
  session: string;
  /** When this snapshot was assembled by Goldbook */
  asOf: string;
  /** Underlying market data time when known (else same as asOf) */
  dataAsOf: string;
  source: "twelvedata" | "polygon" | "fallback";
  sample: boolean;
  cacheTtlSec: number;
  bars: MarketBar[];
  levels: {
    support: number;
    watch: number;
    invalidation: number;
    atr: number;
  };
  helpers: {
    dxy?: number;
    dxyChangePct?: number;
    us10y?: number;
  };
  warnings: string[];
};
