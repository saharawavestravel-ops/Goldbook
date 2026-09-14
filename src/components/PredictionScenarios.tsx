"use client";

import type { PredictionPath } from "@/lib/desk-intel";
import { useI18n } from "@/lib/i18n/client";
import { numberLocale } from "@/lib/i18n/labels";
import { getCopy } from "@/lib/i18n/copy";

function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const tone: Record<PredictionPath["id"], string> = {
  up: "border-gb-bull/25 bg-white",
  base: "border-gb-accent/20 bg-gb-accent-wash/40",
  down: "border-gb-bear/25 bg-white",
};

const bar: Record<PredictionPath["id"], string> = {
  up: "bg-gb-bull",
  base: "bg-gb-accent",
  down: "bg-gb-bear",
};

export function PredictionScenarios({ paths }: { paths: PredictionPath[] }) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;
  const primary = [...paths].sort((a, b) => b.probability - a.probability)[0];

  return (
    <section className="gb-fade-up">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="gb-eyebrow">{ui.scenariosTitle}</p>
          <p className="mt-1 text-sm text-gb-muted">{ui.scenariosSubtitle}</p>
        </div>
        {primary ? (
          <p className="text-xs text-gb-faint">
            {ui.leadingPath}: <span className="font-medium text-gb-ink">{primary.label}</span> (
            {primary.probability}%)
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {paths.map((path) => (
          <article
            key={path.id}
            className={`rounded-gb-lg border p-4 ${tone[path.id]} ${
              primary?.id === path.id ? "ring-1 ring-gb-ink/10" : ""
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-medium text-gb-ink">{path.label}</h3>
              <span className="text-lg font-medium text-gb-ink">{path.probability}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gb-line/80">
              <div
                className={`h-full rounded-full ${bar[path.id]}`}
                style={{ width: `${path.probability}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gb-ink-soft">{path.plain}</p>
            <p className="mt-3 text-sm text-gb-ink">
              {ui.target} ~{formatPrice(path.target, locale)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gb-muted">
              <span className="text-gb-faint">{ui.trigger} · </span>
              {path.trigger}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-gb-muted">
              <span className="text-gb-faint">{ui.standDown} · </span>
              {path.standDownIf}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-gb-faint">{dict.common.researchOnly}</p>
    </section>
  );
}
