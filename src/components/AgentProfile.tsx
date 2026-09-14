"use client";

import Link from "next/link";
import type { Agent } from "@/lib/agents";
import type { AgentReport } from "@/lib/agent-reports";
import { AgentAvatar } from "@/components/AgentAvatar";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { biasFullFromDict, biasSimpleFromDict } from "@/lib/i18n/labels";
import {
  agentJobPlain,
  biasPlainTitle,
  confidencePlain,
  simplifyJargon,
} from "@/lib/plain-language";
import { biasClass } from "@/lib/today-shared";

export function AgentProfile({
  agent,
  report,
}: {
  agent: Agent;
  report: AgentReport;
}) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;
  const trustPct = Math.round(report.trustWeight * 100);
  const idle = report.status === "idle" || report.confidence === 0;

  const status =
    report.status === "ready"
      ? ui.agentReady
      : report.status === "thinking"
        ? ui.agentThinking
        : report.status === "disagreed"
          ? ui.agentDisagreed
          : ui.agentIdle;

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
      <div className="flex flex-col gap-6">
        <section className="gb-surface flex items-center gap-4 p-5">
          <AgentAvatar
            agentId={agent.id}
            name={agent.name}
            initials={agent.initials}
            accent={agent.accent}
            size="xl"
          />
          <div className="min-w-0">
            <p className="text-xs text-gb-faint">{agent.role}</p>
            <h2 className="mt-1 text-xl font-medium text-gb-ink">{agent.name}</h2>
            <p className="mt-1 text-sm text-gb-muted">{status}</p>
          </div>
        </section>

        <section className="gb-surface border-gb-accent/20 bg-gb-accent-wash/30 p-5">
          <p className="gb-eyebrow">{ui.jobPlain}</p>
          <p className="mt-3 text-base leading-relaxed text-gb-ink-soft">
            {agentJobPlain(agent.id, locale)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gb-muted">{agent.bio}</p>
          <p className="mt-3 text-sm italic text-gb-faint">“{agent.oneLiner}”</p>
        </section>

        <section>
          <p className="gb-eyebrow">{ui.whatTheyWatch}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {agent.watches.map((item) => (
              <span
                key={item}
                className="rounded-full border border-gb-line bg-gb-elevated px-3 py-1.5 text-xs text-gb-ink-soft"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <section className="gb-surface p-5 sm:p-6">
          <p className="gb-eyebrow">{ui.todaysTake}</p>
          {idle ? (
            <p className="mt-4 text-sm leading-relaxed text-gb-muted">
              {ui.agentIdle}. {agent.name}
            </p>
          ) : (
            <>
              <p className={`gb-display mt-3 text-2xl sm:text-3xl ${biasClass(report.bias)}`}>
                {biasPlainTitle(report.bias, locale)}
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className={`text-sm font-medium ${biasClass(report.bias)}`}>
                  {biasSimpleFromDict(report.bias, dict)}
                </span>
                <span className="text-xs text-gb-faint">
                  ({biasFullFromDict(report.bias, dict)})
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <span className="gb-display text-4xl text-gb-ink">{report.confidence}</span>
                <span className="mb-1 text-sm text-gb-muted">/ 100 {ui.sureOf100}</span>
              </div>
              <p className="mt-1 text-xs text-gb-faint">
                {confidencePlain(report.confidence, locale)}
              </p>
              {report.plainVerdict ? (
                <p className="mt-4 text-sm font-medium text-gb-ink">{report.plainVerdict}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-gb-ink-soft">
                {simplifyJargon(report.take, locale)}
              </p>
              {report.watchNext ? (
                <p className="mt-4 rounded-gb-md border border-gb-line bg-gb-bg px-3 py-2 text-xs leading-relaxed text-gb-muted">
                  {ui.watchNextColon} {report.watchNext}
                </p>
              ) : null}
            </>
          )}
        </section>

        <section>
          <p className="gb-eyebrow">{ui.sources}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {report.sources.map((source) => (
              <li
                key={source.label}
                className="flex flex-col gap-1 border-b border-gb-line py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="text-sm text-gb-ink">{source.label}</span>
                <span className="text-sm text-gb-muted">{source.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="gb-eyebrow">{ui.deskTrust}</p>
            <p className="text-sm text-gb-muted">{trustPct}%</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gb-line">
            <div
              className="h-full rounded-full bg-gb-accent"
              style={{ width: `${trustPct}%` }}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link href="/brief" className="gb-btn gb-btn-secondary w-full sm:w-auto">
            {ui.readFullBrief}
          </Link>
          <Link href="/agents" className="gb-btn gb-btn-ghost justify-center sm:w-auto">
            {ui.backAgents}
          </Link>
        </div>
      </div>
    </div>
  );
}
