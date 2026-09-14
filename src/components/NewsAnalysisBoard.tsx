"use client";

import type { NewsAnalysisCard } from "@/lib/desk-intel";
import { useI18n } from "@/lib/i18n/client";

const leanClass: Record<NewsAnalysisCard["lean"], string> = {
  "helps gold": "text-gb-bull bg-gb-bull/10 border-gb-bull/25",
  "hurts gold": "text-gb-bear bg-gb-bear/10 border-gb-bear/25",
  "mixed / noise": "text-gb-muted bg-gb-line/50 border-gb-line-strong",
};

export function NewsAnalysisBoard({
  narrative,
  netLean,
  cards,
}: {
  narrative: string;
  netLean: string;
  cards: NewsAnalysisCard[];
}) {
  const { dict } = useI18n();

  return (
    <section className="gb-fade-up gb-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="gb-eyebrow">{dict.news.title}</p>
          <h3 className="mt-2 text-lg font-semibold text-gb-ink">{dict.news.subtitle}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gb-ink-soft">{narrative}</p>
        </div>
        <p className="max-w-xs rounded-gb-md border border-gb-line bg-gb-bg/70 px-3 py-2 text-xs leading-relaxed text-gb-muted">
          {netLean}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
        <span className={`rounded-full border px-2.5 py-1 font-medium ${leanClass["helps gold"]}`}>
          {dict.news.helps}
        </span>
        <span className={`rounded-full border px-2.5 py-1 font-medium ${leanClass["hurts gold"]}`}>
          {dict.news.hurts}
        </span>
        <span className={`rounded-full border px-2.5 py-1 font-medium ${leanClass["mixed / noise"]}`}>
          {dict.news.mixed}
        </span>
      </div>

      {cards.length === 0 ? (
        <p className="mt-5 text-sm text-gb-muted">{dict.news.empty}</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {cards.map((card) => {
            const leanLabel =
              card.lean === "helps gold"
                ? dict.news.helps.split("=")[0]?.trim() ?? card.lean
                : card.lean === "hurts gold"
                  ? dict.news.hurts.split("=")[0]?.trim() ?? card.lean
                  : dict.news.mixed.split("=")[0]?.trim() ?? card.lean;

            const inner = (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium ${leanClass[card.lean]}`}
                  >
                    {leanLabel}
                  </span>
                  <span className="text-xs text-gb-faint">{card.source}</span>
                </div>
                <p className="mt-2 text-sm font-medium leading-snug text-gb-ink">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gb-muted">
                  <span className="font-medium text-gb-ink">{dict.news.forGold} · </span>
                  {card.whyItMatters}
                </p>
              </>
            );

            return (
              <li
                key={`${card.source}-${card.title}`}
                className="rounded-gb-md border border-gb-line bg-gb-elevated/80 px-4 py-3 transition hover:border-gb-line-strong"
              >
                {card.url ? (
                  <a href={card.url} target="_blank" rel="noreferrer" className="block">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
