"use client";

import Link from "next/link";
import { localizeAgents } from "@/lib/agents";
import { AgentAvatar } from "@/components/AgentAvatar";
import { DailyGoldGuide } from "@/components/DailyGoldGuide";
import { DeskAdvicePanel } from "@/components/DeskAdvicePanel";
import { DeskRadar } from "@/components/DeskRadar";
import { GoldPriceChart } from "@/components/GoldPriceChart";
import { LiveSensorsStrip } from "@/components/LiveSensorsStrip";
import { NewsAnalysisBoard } from "@/components/NewsAnalysisBoard";
import { PredictionScenarios } from "@/components/PredictionScenarios";
import { ScenarioWhatIf } from "@/components/ScenarioWhatIf";
import { DataNotice, EmptyState } from "@/components/StatePanels";
import { TodayResultCard } from "@/components/TodayResultCard";
import { TrackRecordPulse } from "@/components/TrackRecordPulse";
import {
  buildDeskAdvice,
  buildNewsAnalysis,
} from "@/lib/desk-intel";
import { buildHomeIntel } from "@/lib/home-intel";
import { useI18n } from "@/lib/i18n/client";
import { biasTitleFromDict, numberLocale } from "@/lib/i18n/labels";
import {
  buildGoldTodayResult,
  sessionPlain,
  simplifyJargon,
} from "@/lib/plain-language";
import type { DailyBriefPreview } from "@/lib/today-shared";

function dollarMove(price: number, changePct: number) {
  return (price * changePct) / 100;
}

export function TodayHome({ preview }: { preview: DailyBriefPreview }) {
  const { locale, dict } = useI18n();
  const roster = localizeAgents(locale);
  const fmt = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const changePositive = preview.priceChangePct >= 0;
  const $move = dollarMove(preview.price, preview.priceChangePct);
  const gold = buildGoldTodayResult({
    bias: preview.bias,
    confidence: preview.confidence,
    price: preview.price,
    priceChangePct: preview.priceChangePct,
    summary: preview.summary,
    macroNarrative: preview.macroNarrative,
    newsNarrative: preview.newsNarrative,
    vetoApplied: preview.vetoApplied,
    levels: preview.levels,
    headlines: preview.topHeadlines,
    locale,
  });
  const plainTitle = preview.plainTitle ?? biasTitleFromDict(preview.bias, dict);
  const intel = preview.hasBrief ? buildHomeIntel(preview, locale) : null;
  const newsBoard = buildNewsAnalysis(preview.topHeadlines, preview.newsNarrative, locale);
  const advice = buildDeskAdvice(
    {
      bias: preview.bias,
      confidence: preview.confidence,
      session: preview.session,
      vetoApplied: preview.vetoApplied,
      levels: preview.levels,
      watches: preview.agentLeans
        ?.map((l) => l.plainVerdict)
        .filter(Boolean) as string[] | undefined,
    },
    locale,
  );

  return (
    <main className="gb-page flex flex-1 flex-col gap-6 py-6 sm:gap-7 sm:py-8 lg:gap-8 lg:py-12">
      <section className="gb-lift gb-surface overflow-hidden p-0">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
          <div>
            <p className="gb-eyebrow">{preview.dateLabel}</p>
            <p className="mt-1 text-xs text-gb-muted">{sessionPlain(preview.session, locale)}</p>
            <p className="mt-3 text-2xl font-medium tracking-tight text-gb-ink sm:text-3xl">
              {fmt.format(preview.price)}
              <span className="ms-2 text-xs font-normal text-gb-faint">{dict.common.gold}</span>
            </p>
          </div>
          <div className="sm:text-end">
            <p className={`text-base font-medium ${changePositive ? "text-gb-bull" : "text-gb-bear"}`}>
              {changePositive ? "+" : ""}
              {preview.priceChangePct.toFixed(2)}%
              <span className="ms-2 text-sm font-normal">
                {changePositive ? "+" : ""}
                {fmt.format(Math.abs($move))}
              </span>
            </p>
            <p className="mt-1 text-xs text-gb-faint">
              {preview.marketSource === "fallback" ? dict.common.sampleData : dict.common.liveQuote} ·{" "}
              {dict.today.floor} {fmt.format(preview.levels.support)} → {dict.today.ceiling}{" "}
              {fmt.format(preview.levels.watch)}
            </p>
          </div>
        </div>
        <div className="border-t border-gb-line bg-gb-bg/50 px-4 py-3 sm:px-5">
          <div className="relative h-2 overflow-hidden rounded-full bg-gb-line">
            <div
              className="absolute inset-y-0 start-0 rounded-full bg-gb-accent/40"
              style={{ width: `${gold.vs.pos}%` }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gb-ink bg-white rtl:translate-x-1/2"
              style={{ left: `${gold.vs.pos}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gb-muted">{gold.vs.place}</p>
        </div>
      </section>

      <DataNotice
        source={preview.marketSource}
        warnings={preview.marketWarnings}
        samples={preview.dataSamples}
      />

      <DailyGoldGuide preview={preview} intel={intel} />

      {!preview.hasBrief || !intel ? (
        <EmptyState
          title={dict.today.noCallTitle}
          description={dict.today.noCallDesc}
          actionHref="/run"
          actionLabel={dict.today.runDesk}
        />
      ) : (
        <>
          <TodayResultCard preview={preview} intel={intel} plainTitle={plainTitle} />

          <LiveSensorsStrip
            initial={{
              price: preview.price,
              changePct: preview.priceChangePct,
              atr: preview.atr,
              helpers: preview.helpers,
              marketSource: preview.marketSource,
            }}
          />

          <TrackRecordPulse trackRecord={preview.trackRecord} />

          <GoldPriceChart levels={preview.levels} spot={preview.price} />

          <NewsAnalysisBoard
            narrative={newsBoard.narrative}
            netLean={newsBoard.netLean}
            cards={newsBoard.cards}
          />

          <PredictionScenarios paths={intel.paths} />

          <div className="grid gap-4 lg:grid-cols-2">
            <ScenarioWhatIf
              spot={preview.price}
              levels={preview.levels}
              bias={preview.bias}
            />
            <DeskRadar
              agreement={preview.agreement}
              leans={preview.agentLeans}
              vetoApplied={preview.vetoApplied}
            />
          </div>

          <DeskAdvicePanel advice={advice} />

          <div className="grid gap-4 md:grid-cols-2">
            <section className="gb-fade-up gb-surface p-5">
              <p className="gb-eyebrow">{dict.today.doSimple}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {gold.doList.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-gb-ink-soft">
                    <span className="mt-0.5 text-gb-bull">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="gb-fade-up gb-surface p-5">
              <p className="gb-eyebrow">{dict.today.dont}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {gold.dontList.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-gb-ink-soft">
                    <span className="mt-0.5 text-gb-bear">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="gb-fade-up gb-surface p-5 sm:p-6">
            <p className="gb-eyebrow">{dict.today.whyDesk}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gb-faint">{dict.today.bigPicture}</p>
                <p className="mt-2 text-sm leading-relaxed text-gb-ink-soft">
                  {simplifyJargon(preview.macroNarrative, locale)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gb-faint">{dict.today.newsTone}</p>
                <p className="mt-2 text-sm leading-relaxed text-gb-muted">
                  {simplifyJargon(preview.newsNarrative, locale)}
                </p>
              </div>
            </div>
            {preview.summary ? (
              <p className="mt-5 border-t border-gb-line pt-4 text-sm leading-relaxed text-gb-ink-soft">
                <span className="font-medium text-gb-faint">Aurelia · </span>
                {preview.summary}
              </p>
            ) : null}
          </section>
        </>
      )}

      {!preview.hasBrief ? (
        <>
          <LiveSensorsStrip
            initial={{
              price: preview.price,
              changePct: preview.priceChangePct,
              atr: preview.atr,
              helpers: preview.helpers,
              marketSource: preview.marketSource,
            }}
          />
          <GoldPriceChart levels={preview.levels} spot={preview.price} />
        </>
      ) : null}

      <section className="gb-fade-up">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="gb-eyebrow">{dict.today.whoBuilt}</p>
            <p className="mt-1 text-xs text-gb-faint">{dict.today.tapAgent}</p>
          </div>
          <Link href="/agents" className="shrink-0 text-xs text-gb-muted hover:text-gb-ink">
            {dict.common.viewAll}
          </Link>
        </div>
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((agent) => {
            const status = preview.agentStatuses[agent.id] ?? "idle";
            const lean = preview.agentLeans?.find((l) => l.agentId === agent.id);
            return (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="gb-surface flex items-center gap-3 p-3 transition hover:border-gb-line-strong"
              >
                <span className="relative shrink-0">
                  <AgentAvatar
                    agentId={agent.id}
                    name={agent.name}
                    initials={agent.initials}
                    accent={agent.accent}
                    size="md"
                  />
                  <span
                    className={`absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-gb-elevated ${
                      status === "ready"
                        ? "bg-gb-success"
                        : status === "disagreed"
                          ? "bg-gb-accent"
                          : status === "thinking"
                            ? "bg-gb-accent-soft"
                            : "bg-gb-faint"
                    }`}
                    title={status}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gb-ink">{agent.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-gb-muted">
                    {lean?.plainVerdict ?? agent.role}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="gb-fade-up mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:justify-start">
        {preview.hasBrief ? (
          <Link href="/brief" className="gb-btn gb-btn-primary w-full sm:w-auto sm:min-w-[12rem]">
            {dict.today.readBrief}
          </Link>
        ) : null}
        <Link
          href="/run"
          className={`gb-btn w-full sm:w-auto sm:min-w-[12rem] ${
            preview.hasBrief ? "gb-btn-secondary" : "gb-btn-primary"
          }`}
        >
          {preview.hasBrief ? dict.today.refreshCall : dict.today.runDesk}
        </Link>
      </section>
    </main>
  );
}
