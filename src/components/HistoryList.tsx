"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  historyLeanPlain,
  historyStats,
  resultClass,
  resultLabel,
  resultLabelPlain,
  type HistoryBrief,
  type HistoryResult,
} from "@/lib/history-shared";
import { biasClass } from "@/lib/today-shared";
import { EmptyState } from "@/components/StatePanels";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { biasSimpleFromDict } from "@/lib/i18n/labels";
import { simplifyJargon } from "@/lib/plain-language";

type Filter = "all" | HistoryResult;

export function HistoryList({ briefs }: { briefs: HistoryBrief[] }) {
  const { locale, dict } = useI18n();
  const copy = getCopy(locale);
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const stats = useMemo(() => historyStats(briefs), [briefs]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: dict.history.all },
    { id: "hit", label: dict.history.hits },
    { id: "miss", label: dict.history.misses },
    { id: "pending", label: dict.history.pending },
  ];

  const items = useMemo(() => {
    if (filter === "all") return briefs;
    return briefs.filter((brief) => brief.result === filter);
  }, [briefs, filter]);

  function scoreYesterday() {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch("/api/desk/score", { method: "POST", body: "{}" });
      const data = (await response.json()) as {
        ok?: boolean;
        scored?: boolean;
        reason?: string;
        error?: string;
        score?: { result: string; movePct: number; note: string };
      };
      if (!response.ok || data.ok === false) {
        setMessage(data.error ?? data.reason ?? copy.ui.scoreFail);
        return;
      }
      if (data.scored && data.score) {
        const plain =
          data.score.result === "hit"
            ? copy.ui.scoreHit
            : data.score.result === "miss"
              ? copy.ui.scoreMiss
              : data.score.result;
        setMessage(`${plain}. ${data.score.note}`);
      } else {
        setMessage(data.reason ?? copy.ui.scoreNothing);
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="gb-surface grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">
        <div>
          <p className="text-sm font-medium text-gb-faint">{dict.history.days}</p>
          <p className="mt-1 text-2xl font-medium text-gb-ink">{stats.total}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gb-faint">{dict.history.hitRate}</p>
          <p className="mt-1 text-2xl font-medium text-gb-ink">
            {stats.hitRate !== null ? `${stats.hitRate}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gb-faint">{dict.history.hits}</p>
          <p className="mt-1 text-2xl font-medium text-gb-success">{stats.hits}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gb-faint">{dict.history.misses}</p>
          <p className="mt-1 text-2xl font-medium text-gb-danger">{stats.misses}</p>
        </div>
        <p className="col-span-2 text-xs leading-relaxed text-gb-muted sm:col-span-4">
          {dict.history.hint}
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-gb-ink text-white"
                    : "border border-gb-line bg-gb-elevated text-gb-muted hover:border-gb-line-strong"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={scoreYesterday}
          disabled={pending}
          className="gb-btn gb-btn-secondary !min-h-9 !px-3 !text-xs disabled:opacity-60"
        >
          {pending ? dict.history.scoring : dict.history.gradeYesterday}
        </button>
      </div>

      {message ? <p className="text-sm text-gb-muted">{message}</p> : null}

      {items.length === 0 ? (
        <EmptyState
          title={dict.history.emptyTitle}
          description={dict.history.emptyDesc}
          actionHref="/run"
          actionLabel={dict.today.runDesk}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((brief) => (
            <Link
              key={brief.id}
              href={`/history/${brief.id}`}
              className="gb-surface flex flex-col gap-3 p-4 transition hover:border-gb-line-strong hover:shadow-gb-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gb-muted">{brief.dateLabel}</p>
                  <p className={`mt-1 text-lg font-medium ${biasClass(brief.bias)}`}>
                    {biasSimpleFromDict(brief.bias, dict)}
                  </p>
                  <p className="mt-0.5 text-xs text-gb-faint">{historyLeanPlain(brief.bias, locale)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${resultClass(brief.result)}`}
                >
                  {resultLabel(brief.result, locale)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gb-ink-soft">
                {simplifyJargon(brief.summary, locale)}
              </p>
              <div className="flex items-center justify-between gap-3 text-xs text-gb-faint">
                <span>{resultLabelPlain(brief.result, locale)}</span>
                {typeof brief.movePct === "number" ? (
                  <span className={brief.movePct >= 0 ? "text-gb-bull" : "text-gb-bear"}>
                    {dict.common.gold} {brief.movePct >= 0 ? "+" : ""}
                    {brief.movePct.toFixed(2)}%
                  </span>
                ) : (
                  <span>{dict.history.awaitingGrade}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
