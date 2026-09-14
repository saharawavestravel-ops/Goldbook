"use client";

import Link from "next/link";
import {
  historyLeanPlain,
  resultClass,
  resultLabel,
  resultLabelPlain,
  type HistoryBrief,
} from "@/lib/history-shared";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { biasSimpleFromDict, numberLocale } from "@/lib/i18n/labels";
import { levelPlainLabels, simplifyJargon, confidencePlain } from "@/lib/plain-language";
import { biasClass } from "@/lib/today-shared";

export function HistoryBriefView({ brief }: { brief: HistoryBrief }) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;
  const levels = levelPlainLabels(locale);
  const fmt = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const matched =
    brief.result === "hit"
      ? ui.historyMatched
      : brief.result === "miss"
        ? ui.historyMissed
        : ui.historyUngraded;

  return (
    <div className="flex flex-col gap-6">
      <section className="gb-surface border-gb-accent/25 bg-gb-accent-wash/35 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="gb-eyebrow">{brief.dateLabel}</p>
            <h2 className={`gb-display mt-3 text-3xl sm:text-4xl ${biasClass(brief.bias)}`}>
              {historyLeanPlain(brief.bias, locale)}
            </h2>
            <p className={`mt-2 text-sm font-medium ${biasClass(brief.bias)}`}>
              {biasSimpleFromDict(brief.bias, dict)}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${resultClass(brief.result)}`}
          >
            {resultLabel(brief.result, locale)}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gb-ink-soft">{matched}</p>
        <p className="mt-2 text-xs text-gb-faint">{resultLabelPlain(brief.result, locale)}</p>

        <div className="mt-5 flex items-end gap-2">
          <span className="gb-display text-4xl text-gb-ink">{brief.confidence}</span>
          <span className="mb-1 text-sm text-gb-muted">/ 100 {ui.sureOf100}</span>
        </div>
        <p className="mt-1 text-xs text-gb-faint">{confidencePlain(brief.confidence, locale)}</p>

        <p className="mt-4 text-sm leading-relaxed text-gb-ink-soft">
          {simplifyJargon(brief.summary, locale)}
        </p>
        {typeof brief.movePct === "number" ? (
          <p className={`mt-3 text-sm ${brief.movePct >= 0 ? "text-gb-bull" : "text-gb-bear"}`}>
            {dict.common.gold} {brief.movePct >= 0 ? "+" : ""}
            {brief.movePct.toFixed(2)}%
          </p>
        ) : null}
      </section>

      <section>
        <p className="gb-eyebrow">{ui.map}</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              { key: "support" as const, value: brief.levels.support },
              { key: "watch" as const, value: brief.levels.watch },
              { key: "invalidation" as const, value: brief.levels.invalidation },
            ] as const
          ).map((level) => (
            <div
              key={level.key}
              className="rounded-gb-md border border-gb-line bg-gb-elevated px-3 py-3"
            >
              <p className="text-sm font-medium text-gb-ink">{levels[level.key].label}</p>
              <p className="mt-1 text-sm text-gb-ink">{fmt.format(level.value)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gb-muted">{levels[level.key].help}</p>
            </div>
          ))}
        </div>
      </section>

      <Link href="/history" className="gb-btn gb-btn-ghost justify-center sm:self-start">
        {dict.common.back}
      </Link>
    </div>
  );
}
