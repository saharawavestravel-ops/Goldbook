"use client";

import { useMemo, useState } from "react";
import { buildWhatIfRead } from "@/lib/desk-intel";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { numberLocale } from "@/lib/i18n/labels";
import type { Bias } from "@/lib/today-shared";

function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ScenarioWhatIf({
  spot,
  levels,
  bias,
}: {
  spot: number;
  levels: { support: number; watch: number; invalidation: number };
  bias: Bias;
}) {
  const { locale } = useI18n();
  const ui = getCopy(locale).ui;
  const min = Math.min(levels.invalidation, levels.support) - 15;
  const max = levels.watch + 20;
  const [probe, setProbe] = useState(spot);

  const read = useMemo(
    () => buildWhatIfRead({ probe, spot, levels, bias }, locale),
    [probe, spot, levels, bias, locale],
  );

  return (
    <section className="gb-fade-up gb-surface p-5 sm:p-6">
      <p className="gb-eyebrow">{ui.whatIfTitle}</p>
      <p className="mt-1 text-sm text-gb-muted">{ui.whatIfSubtitle}</p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gb-faint">{ui.probePrice}</p>
          <p className="mt-1 text-2xl font-medium text-gb-ink">{formatPrice(probe, locale)}</p>
        </div>
        <p
          className={`text-sm font-medium ${
            read.move >= 0 ? "text-gb-bull" : "text-gb-bear"
          }`}
        >
          {read.move >= 0 ? "+" : ""}
          {formatPrice(Math.abs(read.move), locale)} ({read.movePct >= 0 ? "+" : ""}
          {read.movePct.toFixed(2)}%) {ui.vsSpot}
        </p>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={probe}
        onChange={(e) => setProbe(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--gb-accent,#2563eb)]"
        aria-label={ui.probeAria}
      />

      <div className="mt-2 flex justify-between text-[0.65rem] text-gb-faint">
        <span>
          {ui.vsStop} {formatPrice(levels.invalidation, locale)}
        </span>
        <button type="button" className="hover:text-gb-ink" onClick={() => setProbe(spot)}>
          {ui.resetSpot}
        </button>
        <span>
          {ui.vsCeiling} {formatPrice(levels.watch, locale)}
        </span>
      </div>

      <div className="mt-5 rounded-gb-md border border-gb-line bg-gb-bg/60 px-4 py-3">
        <p className="text-sm font-medium text-gb-ink">{read.zone}</p>
        <p className="mt-1 text-sm leading-relaxed text-gb-muted">{read.meaning}</p>
        <p className="mt-2 text-xs text-gb-faint">{read.pathHint}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-gb-md border border-gb-line px-2 py-2">
          <p className="text-gb-faint">{ui.vsFloor}</p>
          <p className="mt-1 font-medium text-gb-ink">
            {read.vsFloor >= 0 ? "+" : ""}
            {formatPrice(Math.abs(read.vsFloor), locale)}
          </p>
        </div>
        <div className="rounded-gb-md border border-gb-line px-2 py-2">
          <p className="text-gb-faint">{ui.vsCeiling}</p>
          <p className="mt-1 font-medium text-gb-ink">
            {read.vsCeil >= 0 ? "+" : ""}
            {formatPrice(Math.abs(read.vsCeil), locale)}
          </p>
        </div>
        <div className="rounded-gb-md border border-gb-line px-2 py-2">
          <p className="text-gb-faint">{ui.vsStop}</p>
          <p className="mt-1 font-medium text-gb-ink">
            {read.vsStop >= 0 ? "+" : ""}
            {formatPrice(Math.abs(read.vsStop), locale)}
          </p>
        </div>
      </div>
    </section>
  );
}
