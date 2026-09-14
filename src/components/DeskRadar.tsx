"use client";

import { agents } from "@/lib/agents";
import { AgentAvatar } from "@/components/AgentAvatar";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { biasSimpleFromDict } from "@/lib/i18n/labels";
import { biasClass, type Bias } from "@/lib/today-shared";

type Lean = {
  agentId: string;
  name: string;
  bias: Bias;
  score: number;
  confidence: number;
  plainVerdict?: string;
};

export function DeskRadar({
  agreement,
  leans,
  vetoApplied,
}: {
  agreement?: number;
  leans?: Lean[];
  vetoApplied?: boolean;
}) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;
  if (!leans || leans.length === 0) return null;

  const agreePct = agreement !== undefined ? Math.round(agreement * 100) : null;
  const upVotes = leans.filter((l) => l.bias === "bullish").length;
  const downVotes = leans.filter((l) => l.bias === "bearish").length;
  const waitVotes = leans.filter((l) => l.bias === "range").length;

  return (
    <section className="gb-fade-up gb-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="gb-eyebrow">{ui.radarTitle}</p>
          <p className="mt-1 text-sm text-gb-muted">{ui.radarSubtitle}</p>
        </div>
        {agreePct !== null ? (
          <div className="text-end">
            <p className="gb-display text-3xl text-gb-ink">{agreePct}%</p>
            <p className="text-xs text-gb-faint">{ui.agreement}</p>
          </div>
        ) : null}
      </div>

      {agreePct !== null ? (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gb-line">
          <div
            className="h-full rounded-full bg-gb-accent transition-all"
            style={{ width: `${agreePct}%` }}
          />
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-gb-bull/10 px-2.5 py-1 text-gb-bull">
          {upVotes} {ui.up}
        </span>
        <span className="rounded-full bg-gb-line px-2.5 py-1 text-gb-muted">
          {waitVotes} {ui.wait}
        </span>
        <span className="rounded-full bg-gb-bear/10 px-2.5 py-1 text-gb-bear">
          {downVotes} {ui.down}
        </span>
        {vetoApplied ? (
          <span className="rounded-full bg-gb-danger/10 px-2.5 py-1 text-gb-danger">
            {ui.veraBrake}
          </span>
        ) : null}
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {leans.map((lean) => {
          const agent = agents.find((a) => a.id === lean.agentId);
          const width = Math.round((Math.abs(lean.score) / 1) * 100);
          const side = lean.score >= 0 ? "up" : "down";
          return (
            <li key={lean.agentId} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <AgentAvatar
                  agentId={lean.agentId}
                  name={lean.name}
                  accent={agent?.accent}
                  size="sm"
                />
                <span className="truncate text-xs font-medium text-gb-ink">{lean.name}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gb-line">
                <div
                  className={`h-full rounded-full ${side === "up" ? "bg-gb-bull" : "bg-gb-bear"}`}
                  style={{ width: `${Math.min(100, width)}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${biasClass(lean.bias)}`}>
                {biasSimpleFromDict(lean.bias, dict)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
