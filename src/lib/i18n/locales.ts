export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = "gb_locale";
export const DEFAULT_LOCALE: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function isRtl(locale: Locale) {
  return locale === "ar";
}
