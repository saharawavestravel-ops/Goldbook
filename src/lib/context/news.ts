import { env } from "@/lib/env";
import { averageSentiment, isGoldRelevant, scoreHeadline } from "@/lib/context/news-filter";
import type { NewsItem, NewsSnapshot } from "@/lib/context/types";

type FinnhubNews = {
  id?: number;
  headline?: string;
  source?: string;
  url?: string;
  datetime?: number;
}[];

type NewsApiResponse = {
  status?: string;
  articles?: {
    title?: string;
    source?: { name?: string };
    url?: string;
    publishedAt?: string;
  }[];
  message?: string;
};

function toSnapshot(items: NewsItem[], source: NewsSnapshot["source"]): NewsSnapshot {
  const sentiment = averageSentiment(items.map((item) => item.score));
  let narrative = "News flow is quiet for gold.";
  if (sentiment > 0.15) narrative = "Filtered headlines lean supportive for gold.";
  if (sentiment < -0.15) narrative = "Filtered headlines lean pressuring for gold.";

  const fetchedAt = new Date().toISOString();
  const newest = items
    .map((item) => item.publishedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    source,
    asOf: fetchedAt,
    dataAsOf: newest ?? fetchedAt,
    sample: false,
    cacheTtlSec: 300,
    items: items.slice(0, 8),
    sentiment,
    narrative,
    warnings: [],
  };
}

export async function fetchFinnhubNews(): Promise<NewsSnapshot | null> {
  const key = env.news.finnhubKey;
  if (!key) return null;

  const url = new URL("https://finnhub.io/api/v1/news");
  url.searchParams.set("category", "general");
  url.searchParams.set("token", key);

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Finnhub HTTP ${response.status}`);
  }

  const data = (await response.json()) as FinnhubNews;
  const items: NewsItem[] = [];

  for (const row of data) {
    const title = row.headline?.trim();
    if (!title || !isGoldRelevant(title)) continue;
    const scored = scoreHeadline(title);
    items.push({
      id: String(row.id ?? title),
      title,
      source: row.source ?? "Finnhub",
      url: row.url,
      publishedAt: row.datetime
        ? new Date(row.datetime * 1000).toISOString()
        : new Date().toISOString(),
      score: scored.score,
      reasons: scored.reasons,
    });
  }

  if (items.length === 0) {
    throw new Error("Finnhub returned no gold-relevant headlines");
  }

  return toSnapshot(items, "finnhub");
}

export async function fetchNewsApiNews(): Promise<NewsSnapshot | null> {
  const key = env.news.newsApiKey;
  if (!key) return null;

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set(
    "q",
    '(gold OR XAU OR "Federal Reserve" OR yields OR "US dollar") AND (gold OR Fed OR dollar OR yields)',
  );
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "30");
  url.searchParams.set("apiKey", key);

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`NewsAPI HTTP ${response.status}`);
  }

  const data = (await response.json()) as NewsApiResponse;
  if (data.status === "error") {
    throw new Error(data.message ?? "NewsAPI error");
  }

  const items: NewsItem[] = [];
  for (const article of data.articles ?? []) {
    const title = article.title?.trim();
    if (!title || !isGoldRelevant(title)) continue;
    const scored = scoreHeadline(title);
    items.push({
      id: article.url ?? title,
      title,
      source: article.source?.name ?? "NewsAPI",
      url: article.url,
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      score: scored.score,
      reasons: scored.reasons,
    });
  }

  if (items.length === 0) {
    throw new Error("NewsAPI returned no gold-relevant headlines");
  }

  return toSnapshot(items, "newsapi");
}
