"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/lib/i18n/client";
import { localeLabels, locales, type Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div className={compact ? "" : "gb-surface p-5"}>
      {!compact ? (
        <>
          <p className="gb-eyebrow">{dict.you.language}</p>
          <p className="mt-2 text-sm leading-relaxed text-gb-muted">{dict.you.languageHint}</p>
        </>
      ) : null}
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-4"}`}>
        {locales.map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              disabled={pending}
              onClick={() => setLocale(code)}
              className={`rounded-gb-md px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
                active
                  ? "bg-gb-ink text-white"
                  : "border border-gb-line bg-gb-elevated text-gb-muted hover:border-gb-line-strong hover:text-gb-ink"
              }`}
            >
              {localeLabels[code]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
