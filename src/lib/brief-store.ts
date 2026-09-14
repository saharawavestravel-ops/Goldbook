import { persistGetJson, persistKeys, persistSetJson } from "@/lib/persist";
import type { DailyBrief } from "@/lib/brief-shared";
import type { Locale } from "@/lib/i18n/locales";

const LOCALES: Locale[] = ["en", "fr", "ar"];

export function briefDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function briefKey(dateKey: string, locale?: Locale) {
  return locale ? `brief:${dateKey}:${locale}` : `brief:${dateKey}`;
}

type BriefPayload = {
  dateKey: string;
  locale?: Locale;
  savedAt: string;
  brief: DailyBrief;
};

export async function saveDailyBrief(
  brief: DailyBrief,
  dateKey = briefDateKey(),
  locale?: Locale,
) {
  const resolvedLocale = locale ?? brief.locale ?? "en";
  const payload: BriefPayload = {
    dateKey,
    locale: resolvedLocale,
    savedAt: new Date().toISOString(),
    brief: { ...brief, locale: resolvedLocale },
  };
  await persistSetJson(briefKey(dateKey, resolvedLocale), payload);
  return payload;
}

export async function loadDailyBrief(
  dateKey = briefDateKey(),
  locale?: Locale,
): Promise<DailyBrief | null> {
  if (locale) {
    const localized = await persistGetJson<BriefPayload>(briefKey(dateKey, locale));
    if (localized?.brief) return localized.brief;
  } else {
    for (const loc of LOCALES) {
      const localized = await persistGetJson<BriefPayload>(briefKey(dateKey, loc));
      if (localized?.brief) return localized.brief;
    }
  }

  /** Legacy single-key briefs (pre locale split). */
  const legacy = await persistGetJson<BriefPayload>(briefKey(dateKey));
  if (!legacy?.brief) return null;
  if (locale && legacy.brief.locale && legacy.brief.locale !== locale) {
    return null;
  }
  return legacy.brief;
}

export async function listBriefDates() {
  const keys = await persistKeys("brief:");
  const dates = keys
    .map((key) => key.replace(/^brief:/, "").split(":")[0] ?? "")
    .filter(Boolean);
  return [...new Set(dates)].sort().reverse();
}
