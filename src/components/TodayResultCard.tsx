"use client";

import Link from "next/link";
import { AgentAvatar } from "@/components/AgentAvatar";
import { CountUp } from "@/components/CountUp";
import type { HomeIntel } from "@/lib/home-intel";
import { useI18n } from "@/lib/i18n/client";
import { biasFullFromDict, biasSimpleFromDict, numberLocale } from "@/lib/i18n/labels";
import {
  biasMood,
  confidenceBand,
  confidencePlain,
  levelPlainLabels,
} from "@/lib/plain-language";
import { biasClass, type DailyBriefPreview } from "@/lib/today-shared";

const leanTone = {
  up: "text-gb-bull bg-gb-bull/10 border-gb-bull/20",
  down: "text-gb-bear bg-gb-bear/10 border-gb-bear/20",
  flat: "text-gb-muted bg-gb-line/60 border-gb-line-strong",
} as const;

const riskTone = {
  cool: "text-gb-bull border-gb-bull/25 bg-gb-bull/5",
  warm: "text-gb-accent border-gb-accent/30 bg-gb-accent-wash",
  hot: "text-gb-danger border-gb-danger/30 bg-gb-danger/5",
} as const;

export function TodayResultCard({
  preview,
  intel,
  plainTitle,
}: {
  preview: DailyBriefPreview;
  intel: HomeIntel;
  plainTitle: string;
}) {
  const { locale, dict } = useI18n();
  const fmt = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const mood = biasMood(preview.bias, locale);
  const band = confidenceBand(preview.confidence, locale);
  const levels = levelPlainLabels(locale);
  const agentTakes = (preview.agentLeans ?? []).slice(0, 5);
  const riskLabel =
    intel.riskTemp === "cool"
      ? dict.today.cool
      : intel.riskTemp === "warm"
        ? dict.today.warm
        : dict.today.hot;

  return (
    <section className={`gb-fade-up overflow-hidden rounded-gb-lg border ${mood.wash}`}>
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <p className="gb-eyebrow !text-inherit opacity-80">{dict.today.goldResult}</p>
          <span
            className={`rounded-full border border-current/20 bg-gb-elevated/80 px-2.5 py-0.5 text-[0.7rem] font-semibold ${mood.color}`}
          >
            {biasSimpleFromDict(preview.bias, dict)}
          </span>
          {preview.vetoApplied ? (
            <span className="rounded-full border border-gb-danger/30 bg-gb-elevated/80 px-2.5 py-0.5 text-[0.7rem] font-semibold text-gb-danger">
              {dict.today.riskBrake}
            </span>
          ) : null}
          {intel.agreementPct !== null ? (
            <span className="rounded-full border border-gb-line bg-gb-elevated/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-gb-muted">
              {intel.agreementPct}% {dict.today.deskAgree}
            </span>
          ) : null}
        </div>

        <h1 className={`gb-display mt-3 text-3xl leading-tight sm:text-5xl ${biasClass(preview.bias)}`}>
          {plainTitle}
        </h1>
        <p className="mt-2 text-sm text-gb-muted">{mood.meaning}</p>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gb-ink-soft sm:text-[1.05rem]">
          {intel.machineRead}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric
            label={dict.today.lean}
            value={
              <span className={biasClass(preview.bias)}>
                {biasSimpleFromDict(preview.bias, dict)}
              </span>
            }
            hint={biasFullFromDict(preview.bias, dict)}
          />
          <Metric
            label={dict.today.howSure}
            value={
              <span className="flex items-end gap-1">
                <CountUp value={preview.confidence} className="gb-display text-3xl text-gb-ink" />
                <span className="mb-1 text-xs text-gb-muted">/100</span>
              </span>
            }
            hint={confidencePlain(preview.confidence, locale)}
          />
          <Metric
            label={dict.today.edgeQuality}
            value={<span className="gb-display text-3xl text-gb-ink">{intel.edgeScore}</span>}
            hint={intel.edgeLabel}
            bar={intel.edgeScore}
          />
          <Metric
            label={dict.today.riskTemp}
            value={
              <span className={`text-lg font-semibold ${riskTone[intel.riskTemp].split(" ")[0]}`}>
                {riskLabel}
              </span>
            }
            hint={intel.riskLabel}
            className={riskTone[intel.riskTemp]}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-gb-md border border-gb-line/80 bg-gb-elevated/85 px-4 py-3">
            <p className="text-sm font-medium text-gb-faint">{dict.today.expectedSwing}</p>
            <p className="mt-1 text-xl font-medium tracking-tight text-gb-ink">
              ~${fmt.format(intel.expectedSwing.dollars)}
              <span className="ms-2 text-sm font-normal text-gb-muted">
                ({intel.expectedSwing.pct}%)
              </span>
            </p>
          </div>
          <div className="rounded-gb-md border border-gb-accent/25 bg-gb-elevated/85 px-4 py-3">
            <p className="text-sm font-medium text-gb-accent">{dict.today.leadingPath}</p>
            <p className="mt-1 text-lg font-medium text-gb-ink">
              {intel.leadingPath.label}
              <span className="ms-2 text-base font-medium text-gb-accent">
                {intel.leadingPath.probability}%
              </span>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gb-muted">{intel.leadingPath.plain}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {intel.paths.map((path) => (
            <div key={path.id} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-gb-muted">
                {path.label.replace(" path", "")}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gb-line/80">
                <div
                  className={`h-full rounded-full ${
                    path.id === "up"
                      ? "bg-gb-bull"
                      : path.id === "down"
                        ? "bg-gb-bear"
                        : "bg-gb-accent"
                  }`}
                  style={{ width: `${path.probability}%` }}
                />
              </div>
              <span className="w-10 text-end text-xs font-medium text-gb-ink">
                {path.probability}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gb-line/70 bg-gb-elevated/50 px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="gb-eyebrow">{dict.today.intelligence}</p>
            <p className="mt-1 text-xs text-gb-faint">{dict.today.intelligenceHint}</p>
          </div>
          <span className="text-xs text-gb-muted">{band.label}</span>
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {intel.drivers.slice(0, 5).map((driver) => (
            <li
              key={driver.id}
              className="flex flex-col gap-2 rounded-gb-md border border-gb-line bg-gb-elevated px-3 py-2.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${leanTone[driver.lean]}`}
                >
                  {driver.lean === "up" ? "↑" : driver.lean === "down" ? "↓" : "~"}{" "}
                  {dict.common.gold}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gb-ink">{driver.label}</p>
                  <p className="text-xs leading-relaxed text-gb-muted">{driver.detail}</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-28">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-gb-line">
                  <div
                    className="h-full rounded-full bg-gb-ink/70"
                    style={{ width: `${Math.min(100, driver.weight)}%` }}
                  />
                </div>
                <span className="w-7 text-end text-xs font-medium text-gb-faint">
                  {driver.weight}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {intel.catalyst ? (
          <p className="mt-4 rounded-gb-md border border-gb-accent/20 bg-gb-accent-wash/60 px-3 py-2.5 text-sm leading-relaxed text-gb-ink-soft">
            <span className="font-semibold text-gb-accent">{dict.today.catalyst} · </span>
            {intel.catalyst}
          </p>
        ) : null}

        {intel.dissentNote ? (
          <p className="mt-3 text-sm text-gb-muted">
            <span className="font-medium text-gb-ink">{dict.today.dissent} · </span>
            {intel.dissentNote}
          </p>
        ) : null}
      </div>

      {agentTakes.length > 0 ? (
        <div className="border-t border-gb-line/70 px-5 py-4 sm:px-7">
          <p className="text-sm font-medium text-gb-faint">{dict.today.specialistTakes}</p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {agentTakes.map((lean) => (
              <Link
                key={lean.agentId}
                href={`/agents/${lean.agentId}`}
                className="min-w-[9.5rem] shrink-0 rounded-gb-md border border-gb-line bg-gb-elevated px-3 py-2.5 transition hover:border-gb-line-strong"
              >
                <div className="flex items-center gap-2">
                  <AgentAvatar agentId={lean.agentId} name={lean.name} size="sm" />
                  <span className="text-xs font-medium text-gb-ink">{lean.name}</span>
                </div>
                <p className={`mt-2 text-xs font-semibold ${biasClass(lean.bias)}`}>
                  {biasSimpleFromDict(lean.bias, dict)}
                </p>
                <p className="mt-1 line-clamp-2 text-[0.7rem] leading-snug text-gb-muted">
                  {lean.plainVerdict ?? `Score ${lean.score >= 0 ? "+" : ""}${lean.score.toFixed(2)}`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-px border-t border-gb-line bg-gb-line">
        {(
          [
            { key: "support" as const, label: dict.today.floor, value: preview.levels.support },
            { key: "watch" as const, label: dict.today.ceiling, value: preview.levels.watch },
            {
              key: "invalidation" as const,
              label: dict.today.stop,
              value: preview.levels.invalidation,
            },
          ] as const
        ).map((level) => (
          <div key={level.key} className="bg-gb-elevated px-3 py-3 text-center">
            <p className="text-xs font-medium text-gb-faint">{level.label}</p>
            <p className="mt-1 text-sm font-medium tracking-tight text-gb-ink">
              {fmt.format(level.value)}
            </p>
            <p className="sr-only">{levels[level.key].help}</p>
          </div>
        ))}
      </div>

      <p className="px-5 py-3 text-center text-[0.7rem] text-gb-faint sm:px-7">
        {dict.common.researchOnly}
      </p>
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
  bar,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  bar?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-gb-md border border-gb-line/80 bg-gb-elevated/85 px-3 py-3 sm:px-4 ${className}`}
    >
      <p className="text-sm font-medium text-gb-faint">{label}</p>
      <div className="mt-1">{value}</div>
      {typeof bar === "number" ? (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-gb-line">
          <div className="h-full rounded-full bg-gb-accent" style={{ width: `${bar}%` }} />
        </div>
      ) : null}
      <p className="mt-1.5 text-xs leading-snug text-gb-muted">{hint}</p>
    </div>
  );
}
