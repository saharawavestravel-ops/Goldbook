import Link from "next/link";
import { AgentAvatar } from "@/components/AgentAvatar";
import { BriefActions } from "@/components/BriefActions";
import { DeskAdvicePanel } from "@/components/DeskAdvicePanel";
import { DeskRadar } from "@/components/DeskRadar";
import { GoldPriceChart } from "@/components/GoldPriceChart";
import { LiveSensorsStrip } from "@/components/LiveSensorsStrip";
import { NewsAnalysisBoard } from "@/components/NewsAnalysisBoard";
import { PredictionScenarios } from "@/components/PredictionScenarios";
import { ScenarioWhatIf } from "@/components/ScenarioWhatIf";
import { agentAccent, type DailyBrief } from "@/lib/brief-shared";
import {
  buildDeskAdvice,
  buildNewsAnalysis,
  buildPredictionScenarios,
} from "@/lib/desk-intel";
import { getCopy } from "@/lib/i18n/copy";
import { biasFullFromDict, biasSimpleFromDict, numberLocale } from "@/lib/i18n/labels";
import { getI18n } from "@/lib/i18n/server";
import {
  buildPlainExplain,
  confidencePlain,
  levelPlainLabels,
  simplifyJargon,
  agentJobPlain,
} from "@/lib/plain-language";
import { biasClass } from "@/lib/today-shared";

export async function DailyBriefView({ brief }: { brief: DailyBrief }) {
  const { locale, dict } = await getI18n();
  const ui = getCopy(locale).ui;
  const fmt = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const levels = levelPlainLabels(locale);
  const plain = buildPlainExplain({
    bias: brief.bias,
    confidence: brief.confidence,
    priceChangePct: brief.priceChangePct,
    summary: brief.summary,
    macroNarrative: brief.macroNarrative,
    newsNarrative: brief.newsNarrative,
    vetoApplied: brief.vetoApplied,
    levels: brief.levels,
    locale,
  });
  const plainTitle = brief.plainTitle ?? plain.title;
  const plainExplain = brief.plainExplain ?? plain.explain;
  const predictions = buildPredictionScenarios(
    {
      bias: brief.bias,
      confidence: brief.confidence,
      price: brief.price,
      levels: brief.levels,
      vetoApplied: brief.vetoApplied,
      fusionScore: brief.fusionScore,
    },
    locale,
  );
  const newsBoard = buildNewsAnalysis(brief.topHeadlines, brief.newsNarrative, locale);
  const advice = buildDeskAdvice(
    {
      bias: brief.bias,
      confidence: brief.confidence,
      session: brief.session,
      vetoApplied: brief.vetoApplied,
      levels: brief.levels,
      watches: brief.debate.map((d) => d.watchNext).filter(Boolean) as string[],
    },
    locale,
  );

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <section className="gb-surface border-gb-accent/30 bg-gb-accent-wash/40 p-5 sm:p-6">
        <p className="gb-eyebrow">{ui.briefPlain}</p>
        <h2 className={`gb-display mt-3 text-3xl sm:text-4xl ${biasClass(brief.bias)}`}>
          {plainTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gb-ink-soft">{plainExplain}</p>
        <p className="mt-3 text-sm text-gb-muted">{confidencePlain(brief.confidence, locale)}</p>
        <p className="mt-4 text-xs text-gb-faint">
          {ui.signedBy} {brief.signedBy} · {brief.dateLabel} · {dict.common.researchOnly}
        </p>
      </section>

      <GoldPriceChart levels={brief.levels} spot={brief.price} />

      <LiveSensorsStrip
        initial={{
          price: brief.price,
          changePct: brief.priceChangePct,
          atr: brief.atr,
          helpers: brief.helpers,
          marketSource: brief.marketSource,
        }}
      />

      <PredictionScenarios paths={predictions} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ScenarioWhatIf spot={brief.price} levels={brief.levels} bias={brief.bias} />
        <DeskRadar
          agreement={brief.agreement}
          leans={brief.agentLeans}
          vetoApplied={brief.vetoApplied}
        />
      </div>

      <DeskAdvicePanel advice={advice} />

      <NewsAnalysisBoard
        narrative={newsBoard.narrative}
        netLean={newsBoard.netLean}
        cards={newsBoard.cards}
      />

      <section className="max-w-2xl">
        <p className="gb-eyebrow">{ui.briefShorthand}</p>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <p className={`gb-display text-4xl sm:text-5xl ${biasClass(brief.bias)}`}>
            {biasSimpleFromDict(brief.bias, dict)}
          </p>
          <p className="text-sm text-gb-muted">({biasFullFromDict(brief.bias, dict)})</p>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="gb-display text-5xl text-gb-ink">{brief.confidence}</span>
          <span className="mb-2 text-sm text-gb-muted">/ 100 {ui.sureOf100}</span>
        </div>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-gb-ink-soft">{brief.summary}</p>
      </section>

      <section>
        <p className="gb-eyebrow">{ui.howToRead}</p>
        <ol className="mt-3 flex max-w-xl flex-col gap-2 text-sm leading-relaxed text-gb-muted">
          <li>1. {ui.briefPlain}</li>
          <li>
            2. {dict.today.floor} / {dict.today.ceiling} / {dict.today.stop}
          </li>
          <li>3. {ui.deskDebate}</li>
          <li>4. {ui.standDownIf}</li>
        </ol>
      </section>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <section>
          <p className="gb-eyebrow">{ui.why}</p>
          <ul className="mt-3 flex flex-col gap-3">
            {brief.why.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-gb-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gb-accent" />
                {simplifyJargon(line, locale)}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="gb-eyebrow">{ui.someoneDisagrees}</p>
          <p className="mt-3 text-sm leading-relaxed text-gb-muted">
            {simplifyJargon(brief.dissent, locale)}
          </p>
        </section>
      </div>

      <section>
        <p className="gb-eyebrow">{ui.deskDebate}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {brief.debate.map((line) => (
            <div key={line.agentId} className="gb-surface p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <AgentAvatar
                  agentId={line.agentId}
                  name={line.agentName}
                  accent={agentAccent(line.agentId)}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium text-gb-ink">{line.agentName}</p>
                  <p className="text-xs text-gb-faint">{agentJobPlain(line.agentId, locale)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gb-muted">{line.text}</p>
              {line.plainVerdict ? (
                <p className="mt-2 text-sm font-medium text-gb-ink">{line.plainVerdict}</p>
              ) : null}
              {line.watchNext ? (
                <p className="mt-1 text-xs text-gb-faint">
                  {ui.watchNext} · {line.watchNext}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="gb-surface p-5 sm:p-6">
        <p className="gb-eyebrow">{ui.simplePlan}</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gb-faint">{ui.lean}</dt>
            <dd className="mt-1 text-gb-ink">{brief.plan.bias}</dd>
          </div>
          <div>
            <dt className="text-gb-faint">{ui.map}</dt>
            <dd className="mt-1 text-gb-ink">{brief.plan.levels}</dd>
          </div>
          <div>
            <dt className="text-gb-faint">{ui.standDownIf}</dt>
            <dd className="mt-1 text-gb-ink-soft">{brief.plan.dontTradeIf}</dd>
          </div>
        </dl>
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gb-line pt-4 sm:grid-cols-3">
          {(
            [
              { key: "support" as const, value: brief.levels.support },
              { key: "watch" as const, value: brief.levels.watch },
              { key: "invalidation" as const, value: brief.levels.invalidation },
            ] as const
          ).map((level) => (
            <div key={level.key}>
              <p className="text-sm font-medium text-gb-ink">{levels[level.key].label}</p>
              <p className="mt-1 text-sm text-gb-ink">{fmt.format(level.value)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gb-muted">{levels[level.key].help}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="gb-eyebrow">{ui.sources}</p>
        <ul className="mt-3 flex flex-col">
          {brief.sources.map((source) => (
            <li
              key={`${source.label}-${source.detail}`}
              className="flex flex-col gap-1 border-b border-gb-line py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <span className="text-sm text-gb-ink">{source.label}</span>
              <span className="text-sm text-gb-muted sm:text-end">{source.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <BriefActions brief={brief} />

      <Link href="/" className="gb-btn gb-btn-ghost justify-center sm:self-start">
        {ui.backToday}
      </Link>
    </div>
  );
}
