export type MacroPoint = {
  seriesId: string;
  label: string;
  value: number;
  date: string;
  change?: number;
};

export type MacroSnapshot = {
  source: "fred" | "fallback";
  asOf: string;
  dataAsOf: string;
  sample: boolean;
  cacheTtlSec: number;
  points: MacroPoint[];
  /** Rough gold pressure: negative = supportive for gold */
  goldPressure: number;
  narrative: string;
  warnings: string[];
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url?: string;
  publishedAt: string;
  score: number;
  reasons: string[];
};

export type NewsSnapshot = {
  source: "finnhub" | "newsapi" | "fallback";
  asOf: string;
  dataAsOf: string;
  sample: boolean;
  cacheTtlSec: number;
  items: NewsItem[];
  sentiment: number;
  narrative: string;
  warnings: string[];
};

export type ContextSnapshot = {
  macro: MacroSnapshot;
  news: NewsSnapshot;
};
