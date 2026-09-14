"use client";

import type { DeskAdvicePack } from "@/lib/desk-intel";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";

export function DeskAdvicePanel({ advice }: { advice: DeskAdvicePack }) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;

  return (
    <section className="gb-fade-up gb-surface border-gb-accent/25 bg-gb-accent-wash/25 p-5 sm:p-6">
      <p className="gb-eyebrow">{ui.adviceTitle}</p>
      <h2 className="gb-display mt-3 text-2xl text-gb-ink sm:text-3xl">{advice.headline}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gb-muted">{advice.timing}</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-xs text-gb-faint">{ui.adviceMachine}</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {advice.machineEdges.map((edge) => (
              <li key={edge} className="flex gap-3 text-sm leading-relaxed text-gb-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gb-accent" />
                {edge}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-gb-faint">{ui.watchNext}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {advice.watches.map((watch) => (
              <li
                key={watch}
                className="rounded-gb-md border border-gb-line bg-gb-elevated/80 px-3 py-2 text-sm text-gb-ink-soft"
              >
                {watch}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-gb-line/80 pt-5">
        <p className="text-xs text-gb-faint">{ui.playbook}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {advice.playbook.map((step) => (
            <div key={step.title} className="rounded-gb-md border border-gb-line bg-gb-elevated/90 px-3 py-3">
              <p className="text-sm font-medium text-gb-ink">{step.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-gb-muted">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-xs text-gb-faint">{dict.common.researchOnly}</p>
    </section>
  );
}
