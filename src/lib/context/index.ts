import { fallbackMacro, fallbackNews } from "@/lib/context/fallback";
import { fetchFredMacro } from "@/lib/context/fred";
import { fetchFinnhubNews, fetchNewsApiNews } from "@/lib/context/news";
import type { ContextSnapshot, MacroSnapshot, NewsSnapshot } from "@/lib/context/types";

export type {
  ContextSnapshot,
  MacroSnapshot,
  NewsSnapshot,
  NewsItem,
  MacroPoint,
} from "@/lib/context/types";
export { isGoldRelevant, scoreHeadline } from "@/lib/context/news-filter";

export async function getMacroSnapshot(): Promise<MacroSnapshot> {
  const warnings: string[] = [];
  try {
    const fred = await fetchFredMacro();
    if (fred) return fred;
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "FRED failed");
  }
  return fallbackMacro(warnings);
}

export async function getNewsSnapshot(): Promise<NewsSnapshot> {
  const warnings: string[] = [];

  try {
    const finnhub = await fetchFinnhubNews();
    if (finnhub) return finnhub;
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Finnhub failed");
  }

  try {
    const newsApi = await fetchNewsApiNews();
    if (newsApi) {
      return {
        ...newsApi,
        warnings: [...newsApi.warnings, ...warnings],
      };
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "NewsAPI failed");
  }

  return fallbackNews(warnings);
}

/** Combined macro + filtered news for agent missions. */
export async function getContextSnapshot(): Promise<ContextSnapshot> {
  const [macro, news] = await Promise.all([getMacroSnapshot(), getNewsSnapshot()]);
  return { macro, news };
}
