import { fallbackSnapshot } from "@/lib/market/fallback";
import { fetchPolygonSnapshot } from "@/lib/market/polygon";
import { fetchTwelveDataSnapshot } from "@/lib/market/twelve-data";
import type { MarketSnapshot } from "@/lib/market/types";

export type { MarketSnapshot, MarketBar } from "@/lib/market/types";
export { currentSessionLabel, computeLevels } from "@/lib/market/fallback";

/**
 * Live XAUUSD snapshot with provider cascade + safe fallback.
 * Twelve Data → Polygon → offline sample.
 */
export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const warnings: string[] = [];

  try {
    const twelve = await fetchTwelveDataSnapshot();
    if (twelve) return twelve;
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Twelve Data failed");
  }

  try {
    const polygon = await fetchPolygonSnapshot();
    if (polygon) {
      return {
        ...polygon,
        warnings: [...polygon.warnings, ...warnings],
      };
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Polygon failed");
  }

  return fallbackSnapshot(warnings);
}
